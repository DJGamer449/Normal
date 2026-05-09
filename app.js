const subjects = {
  math: { name: "Toán", questions: [
    { id:1, q:"2x+5=15 => x=?", o:["10","5","-5","7.5"], a:1, skill:"Biến đổi công thức", err:"thiếu kiến thức" },
    { id:2, q:"Điều kiện đúng của x>2 và x<8?", o:["2<x<8","x>8","x<2","x=2 hoặc 8"], a:0, skill:"Nhận diện điều kiện", err:"đọc đề chưa kỹ" },
    { id:3, q:"20% của 150 là?", o:["20","25","30","35"], a:2, skill:"Tính phần trăm", err:"thiếu kiến thức" },
    { id:4, q:"Bước đầu khi giải bài mới?", o:["Làm ngẫu nhiên","Phân tích dữ kiện","Bỏ qua","Chọn đáp án dài"], a:1, skill:"Tư duy giải", err:"tư duy giải chưa đúng" },
    { id:5, q:"Tam giác 3 cạnh bằng nhau là?", o:["Vuông","Cân","Đều","Tù"], a:2, skill:"Khái niệm nền", err:"thiếu kiến thức" }
  ]}
};
let token = "";
let currentSubject = "math";

async function api(path, method="GET", body=null) {
  const res = await fetch(path, { method, headers: {"Content-Type":"application/json", ...(token? {Authorization:`Bearer ${token}`}:{})}, body: body ? JSON.stringify(body):null });
  return res.json();
}

function renderQuiz() {
  const qs = subjects[currentSubject].questions;
  quiz.innerHTML = qs.map(q=>`<div class='question'><b>${q.id}.</b> ${q.q}${q.o.map((opt,i)=>`<label class='answer'><input type='radio' name='q${q.id}' value='${i}'> ${opt}</label>`).join("")}</div>`).join("");
}

function analyze() {
  const qs = subjects[currentSubject].questions;
  let c = 0; const wrong = [];
  qs.forEach(q=>{ const p=document.querySelector(`input[name='q${q.id}']:checked`); if (p && Number(p.value)===q.a) c++; else wrong.push(q); });
  const top = wrong[0]?.skill || "Ổn";
  return { score: Math.round(c/qs.length*100), wrong, top };
}

function renderReport(r) {
  report.innerHTML = `<h3>Kết quả: ${r.score}%</h3><p>Bạn yếu nhất ở: <b>${r.top}</b>.</p><p>Gợi ý: Ôn 12 phút + 5 bài dễ.</p><h4>Kế hoạch ABC/XYZ</h4><ul><li>A: Ôn ${r.top}</li><li>B: 5 bài cơ bản</li><li>X/Y/Z: Hôm nay / 3 ngày / 7 ngày test lại</li></ul><h4>Flashcard nhanh</h4><ul>${r.wrong.slice(0,3).map(w=>`<li>${w.skill}: tránh lỗi ${w.err}</li>`).join("") || "<li>Rất tốt!</li>"}</ul>`;
  api('/api/attempt','POST',{subject: currentSubject, score_pct: r.score});
}

async function loadMe(){
  const me = await api('/api/me');
  if(!me.ok) return;
  appCard.hidden=false; authCard.hidden=true;
  hello.textContent = `Xin chào ${me.user.full_name || me.user.username} (${me.user.student_class || ''})`;
  streakBadge.textContent = `Streak: ${me.streak.count}`;
  history.innerHTML = `<h4>Lịch sử</h4><ul>${me.history.map(h=>`<li>${h.subject}: ${h.score_pct}% (${h.created_at.slice(0,10)})</li>`).join('')}</ul>`;
}

document.getElementById('registerBtn').onclick = async()=>{
  const r = await api('/api/register','POST',{username:username.value,password:password.value,full_name:fullName.value,student_class:studentClass.value});
  authMsg.textContent = r.ok ? 'Đăng ký thành công, mời đăng nhập' : r.error;
};

document.getElementById('loginBtn').onclick = async()=>{
  const r = await api('/api/login','POST',{username:username.value,password:password.value});
  if(!r.ok){ authMsg.textContent=r.error; return; }
  token=r.token; await loadMe();
};

document.getElementById('checkinBtn').onclick = async()=>{
  const r = await api('/api/checkin','POST',{date:new Date().toISOString().slice(0,10)});
  streakBadge.textContent = `Streak: ${r.count}`;
  alert(r.message);
};

document.getElementById('analyzeBtn').onclick = ()=> renderReport(analyze());

document.addEventListener('DOMContentLoaded', ()=>{
  subject.innerHTML = `<option value='math'>Toán</option>`;
  subject.onchange=(e)=>{currentSubject=e.target.value; renderQuiz();};
  renderQuiz();
});
