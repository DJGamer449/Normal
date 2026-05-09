const subjects = {
  math: { name: "Toán", questions: [
    { id:1, q:"2x+5=15 => x=?", o:["10","5","-5","7.5"], a:1, skill:"Biến đổi công thức", err:"knowledge" },
    { id:2, q:"Điều kiện đúng của x>2 và x<8?", o:["2<x<8","x>8","x<2","x=2 hoặc 8"], a:0, skill:"Nhận diện điều kiện", err:"reading" },
    { id:3, q:"20% của 150 là?", o:["20","25","30","35"], a:2, skill:"Tính phần trăm", err:"knowledge" },
    { id:4, q:"Bước đầu khi giải bài mới?", o:["Làm ngẫu nhiên","Phân tích dữ kiện","Bỏ qua","Chọn đáp án dài"], a:1, skill:"Tư duy giải", err:"thinking" },
    { id:5, q:"Tam giác 3 cạnh bằng nhau là?", o:["Vuông","Cân","Đều","Tù"], a:2, skill:"Khái niệm nền", err:"knowledge" }
  ]},
  english: { name: "Tiếng Anh", questions: [
    { id:1, q:"She ___ to school every day.", o:["go","goes","going","gone"], a:1, skill:"Chia động từ", err:"knowledge" },
    { id:2, q:"Synonym of 'happy'", o:["sad","angry","glad","cold"], a:2, skill:"Từ vựng", err:"knowledge" },
    { id:3, q:"Choose correct: If I ___ rich, I would travel.", o:["am","was","were","be"], a:2, skill:"Câu điều kiện", err:"knowledge" },
    { id:4, q:"Read question carefully before answering means:", o:["skip quickly","find keywords","guess","translate all"], a:1, skill:"Đọc hiểu đề", err:"reading" },
    { id:5, q:"Best writing strategy first step:", o:["write immediately","outline ideas","copy sample","ignore prompt"], a:1, skill:"Tư duy viết", err:"thinking" }
  ]}
};

let currentSubject = "math";
const errorLabel = { knowledge:"thiếu kiến thức", reading:"đọc đề chưa kỹ", thinking:"tư duy giải chưa đúng" };

function initSubjects() {
  const s = document.getElementById("subject");
  s.innerHTML = Object.entries(subjects).map(([k,v]) => `<option value='${k}'>${v.name}</option>`).join("");
  s.addEventListener("change", e => { currentSubject = e.target.value; renderQuiz(); });
}

function renderQuiz() {
  const root = document.getElementById("quiz");
  root.innerHTML = subjects[currentSubject].questions.map(q => `
    <div class='question'>
      <b>Câu ${q.id}.</b> ${q.q}
      ${q.o.map((opt,i)=>`<label class='answer'><input type='radio' name='q${q.id}' value='${i}'> ${opt}</label>`).join("")}
    </div>`).join("");
}

function analyze() {
  const qs = subjects[currentSubject].questions;
  let correct = 0; const wrong = [];
  qs.forEach(q => {
    const pick = document.querySelector(`input[name='q${q.id}']:checked`);
    if (!pick) return wrong.push({...q, picked:null});
    Number(pick.value) === q.a ? correct++ : wrong.push({...q, picked:Number(pick.value)});
  });
  const weak = {}; const err = {knowledge:0, reading:0, thinking:0};
  wrong.forEach(w=>{ weak[w.skill]=(weak[w.skill]||0)+1; err[w.err]++; });
  const topWeak = Object.entries(weak).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  const dominant = Object.entries(err).sort((a,b)=>b[1]-a[1])[0][0];
  return {correct,total:qs.length,pct:Math.round(correct/qs.length*100),topWeak,dominant,wrong};
}

function renderReport(r) {
  document.getElementById("report").hidden = false;
  document.getElementById("resources").hidden = false;
  document.getElementById("planner").hidden = false;

  document.getElementById("summary").innerHTML = `
    <span class='pill'>Điểm: ${r.correct}/${r.total} (${r.pct}%)</span>
    <span class='pill'>Môn: ${subjects[currentSubject].name}</span>
    <span class='pill'>Điểm yếu: ${r.topWeak[0] || "Không rõ"}</span>`;

  document.getElementById("insight").innerHTML = `
    <p><b>StudyTwin AI:</b> Bạn không yếu toàn bộ chương. Bạn yếu nhất ở <b>${r.topWeak.join(", ") || "chưa xác định"}</b>.</p>
    <p>Sai chủ yếu vì <b>${errorLabel[r.dominant]}</b>. Gợi ý: ôn 12 phút + làm 5 bài dễ ngay hôm nay.</p>`;

  document.getElementById("assignmentBoard").innerHTML = `
    <div class='row'>
      <div class='task-col'><h4>ABC - Ưu tiên cao (A)</h4><ul><li>Ôn ${r.topWeak[0] || "kiến thức nền"} 12 phút</li><li>Làm 5 bài cơ bản</li></ul></div>
      <div class='task-col'><h4>ABC - Ưu tiên vừa (B)</h4><ul><li>Làm 1 mini test ngày 3</li><li>Ôn flashcard 10 phút</li></ul></div>
      <div class='task-col'><h4>XYZ - Theo thời gian</h4><ul><li>X (hôm nay): học + check-in</li><li>Y (2-3 ngày): bài nâng dần</li><li>Z (7 ngày): test lại và cập nhật</li></ul></div>
    </div>`;

  document.getElementById("flashcards").innerHTML = `<h4>Flashcard nhanh</h4><ul>${(r.wrong.slice(0,3).map(w=>`<li><b>${w.skill}:</b> Tránh lỗi ${errorLabel[w.err]}.</li>`)).join("") || "<li>Bạn làm rất tốt, tiếp tục duy trì!</li>"}</ul>`;
  document.getElementById("miniRoadmap").textContent = `Roadmap 7 ngày\n- Ngày 1-2: Ôn phần yếu + 5 bài dễ\n- Ngày 3-4: Luyện trung bình\n- Ngày 5: Mini test\n- Ngày 6-7: Tăng độ khó và test lại`;
}

function setupStreak() {
  const badge = document.getElementById("streakBadge");
  const key = "studytwin_streak";
  const obj = JSON.parse(localStorage.getItem(key) || '{"count":0,"last":""}');
  badge.innerHTML = `Streak hiện tại: <b>${obj.count} ngày</b>`;
  document.getElementById("checkinBtn").addEventListener("click", () => {
    const today = new Date().toISOString().slice(0,10);
    const saved = JSON.parse(localStorage.getItem(key) || '{"count":0,"last":""}');
    if (saved.last === today) return alert("Bạn đã điểm danh hôm nay rồi 🎉");
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    const count = saved.last === yesterday ? saved.count + 1 : 1;
    localStorage.setItem(key, JSON.stringify({count, last: today}));
    badge.innerHTML = `Streak hiện tại: <b>${count} ngày</b>`;
    alert("+1 streak! Tiếp tục giữ nhịp học nhé 🔥");
  });
}

document.getElementById("saveProfile").addEventListener("click", ()=> alert("Đã lưu hồ sơ học sinh ✅"));
document.getElementById("analyzeBtn").addEventListener("click", ()=> renderReport(analyze()));

document.addEventListener("DOMContentLoaded", () => { initSubjects(); renderQuiz(); setupStreak(); });
