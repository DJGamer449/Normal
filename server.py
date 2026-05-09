from flask import Flask, request, jsonify, send_from_directory
import sqlite3, secrets, hashlib, os, json, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
DB = BASE / "studytwin.db"
app = Flask(__name__, static_folder='.')
sessions = {}
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

def db():
    c=sqlite3.connect(DB); c.row_factory=sqlite3.Row; return c

def init_db():
    c=db(); c.executescript("""
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, full_name TEXT, student_class TEXT);
    CREATE TABLE IF NOT EXISTS streaks(user_id INTEGER PRIMARY KEY, count INTEGER DEFAULT 0, last_date TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, subject TEXT, score_pct INTEGER, weak_skill TEXT, dominant_error TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    """); c.commit(); c.close()

def hash_pw(pw): return hashlib.sha256(pw.encode()).hexdigest()
def auth_user(): return sessions.get(request.headers.get('Authorization','').replace('Bearer ',''))

def openai_json(prompt):
    if not OPENAI_API_KEY:
        return None
    payload = {
      "model": OPENAI_MODEL,
      "input": prompt,
      "text": {"format": {"type": "json_object"}}
    }
    req = urllib.request.Request("https://api.openai.com/v1/responses", data=json.dumps(payload).encode(), headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data=json.loads(r.read().decode())
    txt = data.get("output",[])[0].get("content",[])[0].get("text","{}")
    return json.loads(txt)

@app.post('/api/register')
def register():
    d=request.json
    try:
        c=db(); c.execute('INSERT INTO users(username,password_hash,full_name,student_class) VALUES(?,?,?,?)',(d['username'],hash_pw(d['password']),d.get('full_name',''),d.get('student_class','')))
        uid=c.execute('SELECT id FROM users WHERE username=?',(d['username'],)).fetchone()['id']; c.execute('INSERT INTO streaks(user_id,count,last_date) VALUES(?,?,?)',(uid,0,'')); c.commit(); c.close(); return jsonify(ok=True)
    except Exception as e: return jsonify(ok=False,error=str(e)),400

@app.post('/api/login')
def login():
    d=request.json; c=db(); u=c.execute('SELECT * FROM users WHERE username=?',(d['username'],)).fetchone(); c.close()
    if not u or u['password_hash']!=hash_pw(d['password']): return jsonify(ok=False,error='Sai tài khoản/mật khẩu'),401
    t=secrets.token_hex(16); sessions[t]=u['id']; return jsonify(ok=True,token=t)

@app.get('/api/me')
def me():
    uid=auth_user();
    if not uid: return jsonify(ok=False),401
    c=db(); u=c.execute('SELECT username,full_name,student_class FROM users WHERE id=?',(uid,)).fetchone(); st=c.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone(); h=c.execute('SELECT subject,score_pct,weak_skill,dominant_error,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 20',(uid,)).fetchall(); c.close()
    return jsonify(ok=True,user=dict(u),streak=dict(st),history=[dict(x) for x in h])

@app.post('/api/checkin')
def checkin():
    uid=auth_user();
    if not uid:return jsonify(ok=False),401
    from datetime import datetime,timedelta
    today=request.json.get('date'); c=db(); st=c.execute('SELECT count,last_date FROM streaks WHERE user_id=?',(uid,)).fetchone()
    if st['last_date']==today: c.close(); return jsonify(ok=True,count=st['count'],message='Đã điểm danh hôm nay')
    y=(datetime.fromisoformat(today)-timedelta(days=1)).date().isoformat(); cnt=st['count']+1 if st['last_date']==y else 1
    c.execute('UPDATE streaks SET count=?,last_date=? WHERE user_id=?',(cnt,today,uid)); c.commit(); c.close(); return jsonify(ok=True,count=cnt,message='+1 streak')

@app.post('/api/attempt')
def attempt():
    uid=auth_user();
    if not uid:return jsonify(ok=False),401
    d=request.json; c=db(); c.execute('INSERT INTO attempts(user_id,subject,score_pct,weak_skill,dominant_error) VALUES(?,?,?,?,?)',(uid,d['subject'],d['score_pct'],d.get('weak_skill',''),d.get('dominant_error',''))); c.commit(); c.close(); return jsonify(ok=True)

@app.post('/api/ai/generate-quiz')
def ai_generate_quiz():
    uid=auth_user();
    if not uid:return jsonify(ok=False),401
    d=request.json
    prompt=f"Tạo {d.get('num_questions',5)} câu trắc nghiệm cho học sinh môn {d.get('subject','Toán')}, mức {d.get('level','cơ bản')}. Trả JSON dạng {{questions:[{{question,options:[a,b,c,d],answer_index,skill,error_type}}]}}"
    try:
        out=openai_json(prompt)
        if out and out.get('questions'): return jsonify(ok=True, questions=out['questions'])
    except Exception:
        pass
    return jsonify(ok=True, questions=[{"question":"2x+4=10, x=?","options":["2","3","4","5"],"answer_index":1,"skill":"Biến đổi công thức","error_type":"thiếu kiến thức"}])

@app.post('/api/ai/summary')
def ai_summary():
    uid=auth_user();
    if not uid:return jsonify(ok=False),401
    d=request.json
    prompt=f"Dựa trên dữ liệu kiểm tra sau: {json.dumps(d,ensure_ascii=False)}. Viết kết luận tổng quát ngắn gọn gồm: điểm mạnh, điểm yếu, ưu tiên hôm nay, kế hoạch 7 ngày. Trả JSON {{summary,weakest_skill,dominant_error}}"
    try:
        out=openai_json(prompt)
        if out and out.get('summary'): return jsonify(ok=True, **out)
    except Exception:
        pass
    return jsonify(ok=True, summary="Bạn có nền tảng ổn nhưng cần cải thiện đọc điều kiện đề và áp dụng công thức.", weakest_skill="Đọc hiểu đề", dominant_error="Bỏ sót dữ kiện")

@app.get('/')
def root(): return send_from_directory('.', 'index.html')
@app.get('/<path:p>')
def sf(p): return send_from_directory('.', p)

if __name__ == '__main__':
    init_db(); app.run(host='0.0.0.0', port=8000)
