const competencyFramework = {
  math: {
    name: "Toán",
    skills: ["Biến đổi công thức", "Nhận diện điều kiện đề", "Tư duy giải quyết vấn đề", "Khái niệm nền tảng"]
  },
  physics: {
    name: "Vật lý",
    skills: ["Đọc dữ kiện", "Chọn công thức", "Đổi đơn vị", "Lập luận hiện tượng"]
  }
};

const quizBank = {
  math: [
    { id: 1, text: "Giải phương trình: 2x + 5 = 15", options: ["x = 10", "x = 5", "x = -5", "x = 7.5"], answer: 1, skill: "Biến đổi công thức", errorType: "knowledge", concept: "Chuyển vế và chia hai vế", level: 1 },
    { id: 2, text: "Nếu x > 2 và x < 8, điều kiện đúng là:", options: ["2 < x < 8", "x > 8", "x < 2", "x = 2 hoặc x = 8"], answer: 0, skill: "Nhận diện điều kiện đề", errorType: "reading", concept: "Đọc điều kiện kép", level: 1 },
    { id: 3, text: "Tam giác có 3 cạnh bằng nhau là:", options: ["Tam giác vuông", "Tam giác cân", "Tam giác đều", "Tam giác tù"], answer: 2, skill: "Khái niệm nền tảng", errorType: "knowledge", concept: "Phân loại tam giác", level: 1 },
    { id: 4, text: "Bài toán yêu cầu chọn phương pháp nhanh nhất. Em nên:", options: ["Làm thử ngẫu nhiên", "Phân tích dữ kiện rồi chọn công thức", "Bỏ qua", "Chọn đáp án dài nhất"], answer: 1, skill: "Tư duy giải quyết vấn đề", errorType: "thinking", concept: "Quy trình chọn chiến lược", level: 2 },
    { id: 5, text: "20% của 150 là:", options: ["20", "25", "30", "35"], answer: 2, skill: "Biến đổi công thức", errorType: "knowledge", concept: "Tính phần trăm", level: 1 }
  ],
  physics: [
    { id: 1, text: "Đơn vị của lực là:", options: ["W", "N", "J", "Pa"], answer: 1, skill: "Đổi đơn vị", errorType: "knowledge", concept: "Đơn vị SI", level: 1 },
    { id: 2, text: "Công thức tính vận tốc trung bình:", options: ["v = s/t", "v = t/s", "v = s*t", "v = s+t"], answer: 0, skill: "Chọn công thức", errorType: "knowledge", concept: "Công thức cơ bản", level: 1 },
    { id: 3, text: "Đề cho m=2kg, a=3m/s². Lực F bằng:", options: ["5N", "6N", "1.5N", "9N"], answer: 1, skill: "Đọc dữ kiện", errorType: "reading", concept: "Định luật II Newton", level: 2 },
    { id: 4, text: "Khi ma sát tăng, chuyển động vật:", options: ["Dễ tăng tốc", "Khó chuyển động hơn", "Không đổi", "Luôn nhanh hơn"], answer: 1, skill: "Lập luận hiện tượng", errorType: "thinking", concept: "Ma sát", level: 2 },
    { id: 5, text: "1kN bằng:", options: ["10N", "100N", "1000N", "10000N"], answer: 2, skill: "Đổi đơn vị", errorType: "knowledge", concept: "Bội số đơn vị", level: 1 }
  ]
};

const labelError = {
  knowledge: "Thiếu kiến thức nền",
  reading: "Đọc đề/chọn điều kiện chưa chính xác",
  thinking: "Chiến lược tư duy chưa phù hợp"
};

let currentSubject = "math";

function renderQuiz() {
  const root = document.getElementById("quiz");
  root.innerHTML = "";
  quizBank[currentSubject].forEach((q) => {
    const block = document.createElement("div");
    block.className = "question";
    block.innerHTML = `<h4>Câu ${q.id}. ${q.text}</h4>${q.options.map((opt, i) => `<label class='answer'><input type='radio' name='q${q.id}' value='${i}'/> ${opt}</label>`).join("")}`;
    root.appendChild(block);
  });
}

function collectAnswers() {
  return quizBank[currentSubject].map((q) => {
    const picked = document.querySelector(`input[name='q${q.id}']:checked`);
    return picked ? Number(picked.value) : null;
  });
}

function analyze(answers) {
  const quizData = quizBank[currentSubject];
  const mistakes = [];
  let correct = 0;

  answers.forEach((a, idx) => {
    const q = quizData[idx];
    if (a === q.answer) correct += 1;
    else mistakes.push({ ...q, picked: a });
  });

  const weakSkills = {};
  const errorBuckets = { knowledge: 0, reading: 0, thinking: 0 };
  mistakes.forEach((m) => {
    weakSkills[m.skill] = (weakSkills[m.skill] || 0) + 1;
    errorBuckets[m.errorType] += 1;
  });

  const topWeak = Object.entries(weakSkills).sort((a, b) => b[1] - a[1]).map(([s]) => s);
  const dominantError = Object.entries(errorBuckets).sort((a, b) => b[1] - a[1])[0][0];
  const scorePct = Math.round((correct / quizData.length) * 100);
  const proficiency = scorePct >= 80 ? "Khá" : scorePct >= 60 ? "Trung bình" : "Cần hỗ trợ";

  return { correct, total: quizData.length, scorePct, proficiency, mistakes, topWeak, dominantError };
}

function render(result) {
  const name = document.getElementById("studentName").value || "Học sinh";
  const clazz = document.getElementById("studentClass").value || "N/A";
  const quizData = quizBank[currentSubject];

  document.getElementById("report").hidden = false;
  document.getElementById("resources").hidden = false;

  document.getElementById("summary").innerHTML = `
    <div class='metric'><span class='muted'>Học sinh</span><strong>${name}</strong><span>Lớp ${clazz}</span></div>
    <div class='metric'><span class='muted'>Môn</span><strong>${competencyFramework[currentSubject].name}</strong><span>Mức: ${result.proficiency}</span></div>
    <div class='metric'><span class='muted'>Điểm chẩn đoán</span><strong>${result.correct}/${result.total}</strong><span>${result.scorePct}%</span></div>
  `;

  document.getElementById("insight").innerHTML = `<h3>Nhận định AI</h3><p>Bạn yếu tập trung ở <b>${result.topWeak.join(", ") || "không có"}</b>.</p><p>Nguyên nhân chính: <b>${labelError[result.dominantError]}</b>.</p><p><b>Can thiệp nhanh:</b> 12 phút ôn phần ${result.topWeak[0] || "nền tảng"}, sau đó 5 bài dễ.</p>`;

  const adaptive = generateAdaptiveExercises(result.topWeak[0] || quizData[0].skill, result.scorePct);
  document.getElementById("roadmap").innerHTML = `<h3>Lộ trình 7 ngày cá nhân hóa</h3><ul><li>Ngày 1-2: Ôn lý thuyết trọng tâm.</li><li>Ngày 3-4: Luyện bài mức ${result.scorePct >= 70 ? "trung bình" : "dễ"}.</li><li>Ngày 5: Mini test.</li><li>Ngày 6-7: Tăng độ khó + tự phản biện lời giải.</li></ul><h4>Bài tập AI sinh theo năng lực</h4><ul>${adaptive.map((x) => `<li>${x}</li>`).join("")}</ul>`;

  document.getElementById("mistakeTable").innerHTML = `<h3>Phân tích lỗi theo từng câu</h3><table class='table'><tr><th>Câu</th><th>Kỹ năng</th><th>Khái niệm</th><th>Kết quả</th></tr>${quizData.map((q) => { const m = result.mistakes.find((x) => x.id === q.id); const status = m ? `<span class="tag-warn">Sai - ${labelError[m.errorType]}</span>` : `<span class="tag-ok">Đúng</span>`; return `<tr><td>${q.id}</td><td>${q.skill}</td><td>${q.concept}</td><td>${status}</td></tr>`; }).join("")}</table>`;

  const flashcards = buildFlashcards(result.mistakes);
  document.getElementById("flashcards").innerHTML = `<ul>${flashcards.map((f) => `<li><b>Q:</b> ${f.q}<br><b>A:</b> ${f.a}</li>`).join("")}</ul>`;
  document.getElementById("schedule").innerHTML = `<ul><li>Hôm nay: 12 phút + 5 bài.</li><li>+1 ngày: flashcard ôn lại.</li><li>+3 ngày: luyện dạng sai nhiều.</li><li>+7 ngày: đánh giá lại năng lực.</li></ul>`;
  document.getElementById("mindmap").textContent = `Kế hoạch học\n├── Môn: ${competencyFramework[currentSubject].name}\n├── Điểm yếu: ${result.topWeak.join(", ") || "Không có"}\n├── Nguyên nhân: ${labelError[result.dominantError]}\n└── Mục tiêu: đạt >=80% sau 7 ngày`;

  saveHistory({ name, clazz, subject: currentSubject, scorePct: result.scorePct, date: new Date().toISOString() });
  renderHistory();
}

function generateAdaptiveExercises(skill, scorePct) {
  const level = scorePct >= 80 ? "nâng cao" : scorePct >= 60 ? "trung bình" : "cơ bản";
  return [
    `Bài 1 (${level}): Luyện kỹ năng ${skill} với dữ kiện 1 bước.`,
    `Bài 2 (${level}): Luyện kỹ năng ${skill} với dữ kiện 2 bước.`,
    `Bài 3 (${level}): Tự giải thích vì sao chọn phương pháp.`
  ];
}

function buildFlashcards(mistakes) {
  if (!mistakes.length) return [{ q: "Bạn cần ôn gì tiếp theo?", a: "Tiếp tục làm bài trung bình để duy trì phong độ." }];
  return mistakes.slice(0, 3).map((m) => ({ q: `Khái niệm: ${m.concept}?`, a: `Ôn lại kỹ năng ${m.skill}. Tránh lỗi: ${labelError[m.errorType]}.` }));
}

function saveHistory(entry) {
  const key = "studytwin_history";
  const old = JSON.parse(localStorage.getItem(key) || "[]");
  old.unshift(entry);
  localStorage.setItem(key, JSON.stringify(old.slice(0, 10)));
}

function renderHistory() {
  const key = "studytwin_history";
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  const host = document.getElementById("history");
  if (!host) return;
  host.innerHTML = data.length ? `<h3>Lịch sử 10 lần gần nhất</h3><table class='table'><tr><th>Ngày</th><th>Môn</th><th>Điểm %</th></tr>${data.map((d) => `<tr><td>${new Date(d.date).toLocaleDateString('vi-VN')}</td><td>${competencyFramework[d.subject].name}</td><td>${d.scorePct}</td></tr>`).join("")}</table>` : "";
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const answers = collectAnswers();
  const unanswered = answers.filter((x) => x === null).length;
  if (unanswered > 0) return alert(`Bạn còn ${unanswered} câu chưa trả lời.`);
  render(analyze(answers));
});

document.getElementById("startVoice").addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceText = document.getElementById("voiceText");
  const voiceAnswer = document.getElementById("voiceAnswer");
  if (!SR) return (voiceAnswer.textContent = "AI: Trình duyệt chưa hỗ trợ Speech Recognition.");
  const recog = new SR();
  recog.lang = "vi-VN";
  recog.start();
  recog.onresult = (e) => {
    const text = e.results[0][0].transcript;
    voiceText.textContent = `Bạn hỏi: ${text}`;
    const answer = replyVoice(text);
    voiceAnswer.textContent = `AI: ${answer}`;
    const utter = new SpeechSynthesisUtterance(answer);
    utter.lang = "vi-VN";
    speechSynthesis.speak(utter);
  };
});

function replyVoice(query) {
  const q = query.toLowerCase();
  if (q.includes("ôn") || q.includes("hôm nay")) return "Hôm nay em nên ôn 12 phút điểm yếu nhất và làm 5 bài cơ bản.";
  if (q.includes("điểm yếu")) return "Em xem mục nhận định AI và bảng lỗi theo từng câu để biết kỹ năng cần ưu tiên.";
  return "Em hoàn thành mini test ngày 5 để hệ thống cập nhật lộ trình tiếp theo.";
}

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("subject");
  selector.innerHTML = Object.entries(competencyFramework).map(([k, v]) => `<option value='${k}'>${v.name}</option>`).join("");
  selector.addEventListener("change", (e) => {
    currentSubject = e.target.value;
    renderQuiz();
  });
  renderQuiz();
  renderHistory();
});
