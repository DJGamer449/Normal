from flask import Flask, request, jsonify, send_from_directory
import sqlite3, secrets, hashlib
from pathlib import Path

BASE = Path(__file__).parent
DB = BASE / "studytwin.db"
app = Flask(__name__, static_folder='.')
sessions = {}


def db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db()
    conn.executescript('''
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      full_name TEXT DEFAULT '',
      student_class TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS streaks(
      user_id INTEGER PRIMARY KEY,
      count INTEGER DEFAULT 0,
      last_date TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS attempts(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      subject TEXT,
      score_pct INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    ''')
    conn.commit()
    conn.close()


def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()


def auth_user():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    uid = sessions.get(token)
    return uid


@app.post('/api/register')
def register():
    data = request.json
    try:
        conn = db()
        conn.execute('INSERT INTO users(username,password_hash,full_name,student_class) VALUES(?,?,?,?)',
                     (data['username'], hash_pw(data['password']), data.get('full_name',''), data.get('student_class','')))
        conn.commit()
        uid = conn.execute('SELECT id FROM users WHERE username=?', (data['username'],)).fetchone()['id']
        conn.execute('INSERT OR IGNORE INTO streaks(user_id,count,last_date) VALUES(?,?,?)',(uid,0,''))
        conn.commit()
        conn.close()
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 400


@app.post('/api/login')
def login():
    data = request.json
    conn = db()
    user = conn.execute('SELECT * FROM users WHERE username=?', (data['username'],)).fetchone()
    conn.close()
    if not user or user['password_hash'] != hash_pw(data['password']):
        return jsonify({'ok': False, 'error': 'Sai tài khoản hoặc mật khẩu'}), 401
    token = secrets.token_hex(16)
    sessions[token] = user['id']
    return jsonify({'ok': True, 'token': token, 'full_name': user['full_name'], 'student_class': user['student_class']})


@app.get('/api/me')
def me():
    uid = auth_user()
    if not uid:
        return jsonify({'ok': False}), 401
    conn = db()
    user = conn.execute('SELECT username,full_name,student_class FROM users WHERE id=?',(uid,)).fetchone()
    streak = conn.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone()
    history = conn.execute('SELECT subject,score_pct,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 10',(uid,)).fetchall()
    conn.close()
    return jsonify({'ok': True, 'user': dict(user), 'streak': dict(streak), 'history':[dict(h) for h in history]})


@app.post('/api/checkin')
def checkin():
    uid = auth_user()
    if not uid:
        return jsonify({'ok': False}), 401
    today = request.json.get('date')
    conn = db()
    st = conn.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone()
    if st['last_date'] == today:
        conn.close()
        return jsonify({'ok': True, 'count': st['count'], 'message': 'Đã điểm danh hôm nay'})
    from datetime import datetime, timedelta
    y = (datetime.fromisoformat(today) - timedelta(days=1)).date().isoformat()
    count = st['count'] + 1 if st['last_date'] == y else 1
    conn.execute('UPDATE streaks SET count=?, last_date=? WHERE user_id=?',(count,today,uid))
    conn.commit(); conn.close()
    return jsonify({'ok': True, 'count': count, 'message': '+1 streak'})


@app.post('/api/attempt')
def attempt():
    uid = auth_user()
    if not uid:
        return jsonify({'ok': False}), 401
    data = request.json
    conn = db()
    conn.execute('INSERT INTO attempts(user_id,subject,score_pct) VALUES(?,?,?)',(uid,data['subject'],data['score_pct']))
    conn.commit(); conn.close()
    return jsonify({'ok': True})


@app.get('/')
def root():
    return send_from_directory('.', 'index.html')


@app.get('/<path:p>')
def static_files(p):
    return send_from_directory('.', p)


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=8000, debug=True)
