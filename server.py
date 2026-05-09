from flask import Flask, request, jsonify, send_from_directory
import sqlite3, secrets, hashlib, json, os, requests
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
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, full_name TEXT, student_class TEXT);
    CREATE TABLE IF NOT EXISTS streaks(user_id INTEGER PRIMARY KEY, count INTEGER DEFAULT 0, last_date TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, subject TEXT, score_pct INTEGER, weak_skill TEXT, dominant_error TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    ''')
    conn.commit(); conn.close()


def hash_pw(pw): return hashlib.sha256(pw.encode()).hexdigest()
def auth_user(): return sessions.get(request.headers.get('Authorization', '').replace('Bearer ', ''))


def ai_generate_questions(subject, history):
    model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    try:
        prompt = f"""Tạo 5 câu trắc nghiệm tiếng Việt cho môn {subject}. Mỗi câu có 2 đáp án, gồm text, options, answer(0/1), skill, error_hint. Tối ưu theo lịch sử yếu: {history}. Chỉ trả JSON array hợp lệ."""
        r = requests.post("http://localhost:11434/api/generate", json={"model": model, "prompt": prompt, "stream": False}, timeout=60)
        text = r.json().get("response", "[]")
        return json.loads(text)
    except Exception:
        pass
    # fallback local generation
    return [
        {"text": f"[{subject}] Câu nền tảng 1", "options": ["Đáp án A", "Đáp án B"], "answer": 0, "skill": "Kiến thức nền", "error_hint": "thiếu kiến thức"},
        {"text": f"[{subject}] Câu đọc hiểu đề", "options": ["Đúng điều kiện", "Sai điều kiện"], "answer": 0, "skill": "Đọc hiểu đề", "error_hint": "đọc thiếu dữ kiện"},
        {"text": f"[{subject}] Câu áp dụng công thức", "options": ["Công thức 1", "Công thức 2"], "answer": 1, "skill": "Áp dụng công thức", "error_hint": "nhầm công thức"},
        {"text": f"[{subject}] Câu tính toán", "options": ["Kết quả 1", "Kết quả 2"], "answer": 1, "skill": "Tính toán", "error_hint": "sai tính toán"},
        {"text": f"[{subject}] Câu suy luận", "options": ["Bước đúng", "Bước sai"], "answer": 0, "skill": "Tư duy logic", "error_hint": "suy luận sai bước"},
    ]


def ai_summary(full_name, subject, attempts):
    model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    try:
        prompt = f"Tạo kết luận tổng quát cho học sinh {full_name}, môn {subject}, lịch sử: {attempts}. Viết ngắn gọn: điểm mạnh, điểm yếu, lỗi lặp lại, đề xuất 3 việc hôm nay."
        r = requests.post("http://localhost:11434/api/generate", json={"model": model, "prompt": prompt, "stream": False}, timeout=60)
        return r.json().get("response", "")
    except Exception:
        pass
    if not attempts:
        return "Chưa đủ dữ liệu để kết luận tổng quát. Hãy làm ít nhất 2 bài kiểm tra.";
    avg = sum([a['score_pct'] for a in attempts]) / len(attempts)
    weak = attempts[0]['weak_skill'] if attempts[0]['weak_skill'] else 'chưa rõ'
    return f"Tổng quát: điểm trung bình {avg:.1f}%. Điểm yếu lặp lại: {weak}. Đề xuất hôm nay: ôn 12 phút phần yếu, làm 5 bài cùng dạng, kiểm tra lại sau 24h."

@app.post('/api/register')
def register():
    d=request.json
    try:
        conn=db(); conn.execute('INSERT INTO users(username,password_hash,full_name,student_class) VALUES(?,?,?,?)',(d['username'],hash_pw(d['password']),d.get('full_name',''),d.get('student_class','')))
        uid=conn.execute('SELECT id FROM users WHERE username=?',(d['username'],)).fetchone()['id']
        conn.execute('INSERT INTO streaks(user_id,count,last_date) VALUES(?,?,?)',(uid,0,'')); conn.commit(); conn.close()
        return jsonify(ok=True)
    except Exception as e: return jsonify(ok=False,error=str(e)),400

@app.post('/api/login')
def login():
    d=request.json; conn=db(); u=conn.execute('SELECT * FROM users WHERE username=?',(d['username'],)).fetchone(); conn.close()
    if not u or u['password_hash']!=hash_pw(d['password']): return jsonify(ok=False,error='Sai tài khoản/mật khẩu'),401
    t=secrets.token_hex(16); sessions[t]=u['id']; return jsonify(ok=True,token=t)

@app.get('/api/me')
def me():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    conn=db(); u=conn.execute('SELECT username,full_name,student_class FROM users WHERE id=?',(uid,)).fetchone(); st=conn.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone(); h=conn.execute('SELECT subject,score_pct,weak_skill,dominant_error,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 20',(uid,)).fetchall(); conn.close()
    return jsonify(ok=True,user=dict(u),streak=dict(st),history=[dict(x) for x in h])

@app.post('/api/ai/generate-quiz')
def ai_quiz():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    subject=request.json.get('subject','Toán')
    conn=db(); history=conn.execute('SELECT weak_skill,dominant_error,score_pct FROM attempts WHERE user_id=? AND subject=? ORDER BY id DESC LIMIT 10',(uid,subject)).fetchall(); conn.close()
    qs=ai_generate_questions(subject,[dict(x) for x in history])
    return jsonify(ok=True,questions=qs)

@app.post('/api/ai/summary')
def ai_sum():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    subject=request.json.get('subject','Toán')
    conn=db(); u=conn.execute('SELECT full_name FROM users WHERE id=?',(uid,)).fetchone(); at=conn.execute('SELECT score_pct,weak_skill,dominant_error FROM attempts WHERE user_id=? AND subject=? ORDER BY id DESC LIMIT 10',(uid,subject)).fetchall(); conn.close()
    text=ai_summary(u['full_name'] or 'Học sinh', subject, [dict(x) for x in at])
    return jsonify(ok=True,summary=text)

@app.post('/api/checkin')
def checkin():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    today=request.json.get('date'); conn=db(); st=conn.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone()
    from datetime import datetime,timedelta
    if st['last_date']==today: conn.close(); return jsonify(ok=True,count=st['count'],message='Đã điểm danh hôm nay')
    y=(datetime.fromisoformat(today)-timedelta(days=1)).date().isoformat(); cnt=st['count']+1 if st['last_date']==y else 1
    conn.execute('UPDATE streaks SET count=?,last_date=? WHERE user_id=?',(cnt,today,uid)); conn.commit(); conn.close(); return jsonify(ok=True,count=cnt,message='+1 streak')

@app.post('/api/attempt')
def attempt():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    d=request.json; conn=db(); conn.execute('INSERT INTO attempts(user_id,subject,score_pct,weak_skill,dominant_error) VALUES(?,?,?,?,?)',(uid,d['subject'],d['score_pct'],d.get('weak_skill',''),d.get('dominant_error',''))); conn.commit(); conn.close(); return jsonify(ok=True)

@app.get('/api/teacher/overview')
def teacher_overview():
    conn=db(); rows=conn.execute('SELECT subject, weak_skill, dominant_error, COUNT(*) as n FROM attempts GROUP BY subject, weak_skill, dominant_error ORDER BY n DESC LIMIT 20').fetchall(); conn.close(); return jsonify(ok=True, insights=[dict(r) for r in rows])

@app.get('/')
def root(): return send_from_directory('.', 'index.html')
@app.get('/<path:p>')
def sf(p): return send_from_directory('.', p)

if __name__ == '__main__':
    init_db(); app.run(host='0.0.0.0', port=8000)
