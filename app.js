const subjects={math:'Toán lớp 10',english:'Tiếng Anh',cs:'Tin học',physics:'Vật lý',coding:'Lập trình cơ bản'};
let token='',current='math',quizData=[],lastResult=null;
const api=async(p,m='GET',b=null)=>(await fetch(p,{method:m,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:b?JSON.stringify(b):null})).json();

function renderSubjects(){subject.innerHTML=Object.entries(subjects).map(([k,v])=>`<option value='${k}'>${v}</option>`).join('');subject.onchange=e=>{current=e.target.value;generateQuiz();};}
async function generateQuiz(){
  quiz.innerHTML='⏳ AI đang tạo câu hỏi...';
  const r=await api('/api/ai/generate-quiz','POST',{subject:subjects[current],num_questions:5,level:'cơ bản'});
  quizData=r.questions||[];
  quiz.innerHTML=quizData.map((q,i)=>`<div class='question'><b>${i+1}.</b> ${q.question}${q.options.map((opt,j)=>`<label class='answer'><input type='radio' name='q${i}' value='${j}'> ${opt}</label>`).join('')}</div>`).join('');
}
function analyze(){let c=0,wrong=[];quizData.forEach((q,i)=>{const p=document.querySelector(`input[name='q${i}']:checked`);if(p&&Number(p.value)===q.answer_index)c++;else wrong.push(q)});const pct=Math.round(c/(quizData.length||1)*100);return {pct,wrong,subject:subjects[current]};}
async function renderAll(r){
  const ai=await api('/api/ai/summary','POST',{subject:r.subject,score:r.pct,wrong:r.wrong});
  lastResult={...r, ...ai};
  report.innerHTML=`<h4>🤖 Kết luận tổng quát từ AI</h4><p>${ai.summary}</p><p><b>Điểm yếu nhất:</b> ${ai.weakest_skill} | <b>Lỗi chính:</b> ${ai.dominant_error}</p><h4>📅 Kế hoạch 7 ngày</h4><ol><li>Ngày 1: Ôn khái niệm lõi.</li><li>Ngày 2: 5 bài nhận diện.</li><li>Ngày 3: Sửa lỗi thường gặp.</li><li>Ngày 4: Bài trung bình.</li><li>Ngày 5: Flashcard.</li><li>Ngày 6: Bài tổng hợp.</li><li>Ngày 7: Test lại.</li></ol>`;
  await api('/api/attempt','POST',{subject:current,score_pct:r.pct,weak_skill:ai.weakest_skill,dominant_error:ai.dominant_error});
}
chatBtn.onclick=()=>{const q=chatInput.value.toLowerCase();if(!lastResult){chatOut.textContent='Hãy làm bài kiểm tra trước nhé.';return;}if(q.includes('hôm nay'))chatOut.textContent=`Hôm nay ưu tiên: ${lastResult.weakest_skill}.`;else if(q.includes('yếu'))chatOut.textContent=`Bạn yếu nhất ở ${lastResult.weakest_skill}.`;else chatOut.textContent='Mình đã tối ưu lại lộ trình, bạn bám kế hoạch 7 ngày nhé.';};
async function loadMe(){const me=await api('/api/me');if(!me.ok)return;authCard.hidden=true;appCard.hidden=false;hello.textContent=`👋 Xin chào ${me.user.full_name} (${me.user.student_class})`;streakBadge.textContent=`🔥 ${me.streak.count} ngày`;history.innerHTML='<ul>'+me.history.map(h=>`<li>${h.subject}: ${h.score_pct}% | yếu: ${h.weak_skill}</li>`).join('')+'</ul>';generateQuiz();}
registerBtn.onclick=async()=>{const r=await api('/api/register','POST',{username:username.value,password:password.value,full_name:fullName.value,student_class:studentClass.value});authMsg.textContent=r.ok?'✅ Đăng ký thành công':'❌ '+r.error;};
loginBtn.onclick=async()=>{const r=await api('/api/login','POST',{username:username.value,password:password.value});if(!r.ok){authMsg.textContent=r.error;return;}token=r.token;loadMe();};
logoutBtn.onclick=()=>{token='';appCard.hidden=true;authCard.hidden=false;authMsg.textContent='Đã đăng xuất.';};
checkinBtn.onclick=async()=>{const r=await api('/api/checkin','POST',{date:new Date().toISOString().slice(0,10)});streakBadge.textContent=`🔥 ${r.count} ngày`;};
analyzeBtn.onclick=()=>renderAll(analyze());
document.addEventListener('DOMContentLoaded',()=>{renderSubjects();});
