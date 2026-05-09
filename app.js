const subjects={math:{name:'Toán lớp 10'},english:{name:'Tiếng Anh'},cs:{name:'Tin học'},physics:{name:'Vật lý'},coding:{name:'Lập trình cơ bản'}};
let token='',current='math',lastResult=null,questionBank=[];
const api=async(p,m='GET',b=null)=>(await fetch(p,{method:m,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:b?JSON.stringify(b):null})).json();

function renderSubjects(){subject.innerHTML=Object.entries(subjects).map(([k,v])=>`<option value='${k}'>${v.name}</option>`).join('');subject.onchange=e=>{current=e.target.value;generateQuizAI();};}
function renderQuiz(){quiz.innerHTML=questionBank.map((q,i)=>`<div class='question'><b>${i+1}.</b> ${q.text}<label class='answer'><input type='radio' name='q${i}' value='0'>${q.options[0]}</label><label class='answer'><input type='radio' name='q${i}' value='1'>${q.options[1]}</label></div>`).join('');}

async function generateQuizAI(){
  const r=await api('/api/ai/generate-quiz','POST',{subject:current});
  if(!r.ok){quiz.innerHTML='Không tạo được quiz AI'; return;}
  questionBank=r.questions;
  renderQuiz();
}

function analyze(){let c=0,wrong=[];questionBank.forEach((q,i)=>{const p=document.querySelector(`input[name='q${i}']:checked`);if(p&&Number(p.value)===q.answer)c++;else wrong.push(q);});
 const pct=Math.round((c/(questionBank.length||1))*100); const weak=wrong[0]?.skill||'Ổn'; const dominant=wrong[0]?.error_hint||'cần luyện thêm';
 const map={knowledge:Math.max(40,pct-5),reading:Math.max(35,pct-15),logic:Math.min(95,pct+10),apply:Math.max(30,pct-20),speed:Math.max(45,pct-10),memory:Math.max(50,pct-8),careful:Math.max(35,pct-18)};
 return {pct,weak,dominant,map};}

async function renderAll(r){
  lastResult=r;
  report.innerHTML=`<h4>AI phân tích lỗi sai</h4><p>Điểm: <b>${r.pct}%</b>. Điểm yếu: <b>${r.weak}</b>. Lỗi chính: <b>${r.dominant}</b>.</p>`;
  skillMap.innerHTML=`<tr><th>Kỹ năng</th><th>Mức độ</th></tr>${[['Kiến thức nền',r.map.knowledge],['Đọc hiểu đề',r.map.reading],['Tư duy logic',r.map.logic],['Áp dụng công thức',r.map.apply],['Tốc độ',r.map.speed],['Ghi nhớ',r.map.memory],['Cẩn thận',r.map.careful]].map(x=>`<tr><td>${x[0]}</td><td>${x[1]}%</td></tr>`).join('')}`;
  dna.innerHTML=`<p><b>Learning DNA:</b> Mạnh: ${r.map.logic>=80?'logic':'kiên trì'} | Yếu: ${r.weak} | Lỗi lặp lại: ${r.dominant}</p>`;
  await api('/api/attempt','POST',{subject:current,score_pct:r.pct,weak_skill:r.weak,dominant_error:r.dominant});
  const s=await api('/api/ai/summary','POST',{subject:current});
  if(s.ok) report.innerHTML += `<h4>Kết luận tổng quát AI</h4><p>${s.summary}</p>`;
}

chatBtn.onclick=()=>{const q=chatInput.value.toLowerCase(); if(!lastResult){chatOut.textContent='Hãy làm bài test trước nhé.';return;} chatOut.textContent=q.includes('hôm nay')?'Hôm nay ôn 12 phút phần yếu + 5 bài dễ.':'Mình gợi ý em học theo roadmap 7 ngày và kiểm tra lại.';};
async function loadMe(){const me=await api('/api/me'); if(!me.ok)return; authCard.hidden=true; appCard.hidden=false; hello.textContent=`Xin chào ${me.user.full_name} (${me.user.student_class})`; streakBadge.textContent=`🔥 ${me.streak.count} ngày`; history.innerHTML='<ul>'+me.history.map(h=>`<li>${h.subject}: ${h.score_pct}% - ${h.weak_skill}</li>`).join('')+'</ul>'; const t=await api('/api/teacher/overview'); teacherOverview.innerHTML='<ul>'+t.insights.slice(0,5).map(i=>`<li>${i.subject} | ${i.weak_skill} | ${i.dominant_error} (${i.n})</li>`).join('')+'</ul>'; generateQuizAI();}
registerBtn.onclick=async()=>{const r=await api('/api/register','POST',{username:username.value,password:password.value,full_name:fullName.value,student_class:studentClass.value}); authMsg.textContent=r.ok?'Đăng ký thành công':'Lỗi: '+r.error;};
loginBtn.onclick=async()=>{const r=await api('/api/login','POST',{username:username.value,password:password.value}); if(!r.ok){authMsg.textContent=r.error;return;} token=r.token; loadMe();};
checkinBtn.onclick=async()=>{const r=await api('/api/checkin','POST',{date:new Date().toISOString().slice(0,10)}); streakBadge.textContent=`🔥 ${r.count} ngày`;};
logoutBtn.onclick=()=>{token=''; appCard.hidden=true; authCard.hidden=false; authMsg.textContent='Bạn đã đăng xuất.';};
analyzeBtn.onclick=()=>renderAll(analyze());
document.addEventListener('DOMContentLoaded',()=>{renderSubjects();});
