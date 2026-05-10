'use client';
import { useState } from 'react';

const subjects = ['Toán lớp 10','Tiếng Anh','Tin học','Vật lý','Lập trình cơ bản'];

export default function DiagnosticTest(){
  const [subject,setSubject]=useState(subjects[0]);
  const [topic,setTopic]=useState('Hàm số');
  const [difficulty,setDifficulty]=useState('easy');
  const [count,setCount]=useState(8);
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);

  const generate = async()=>{
    setLoading(true);
    const res = await fetch('/api/ai/generate-questions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({subject,topic,difficulty,numberOfQuestions:count})});
    const data = await res.json();
    setResult(data);
    localStorage.setItem('st_questions', JSON.stringify(data.questions||[]));
    setLoading(false);
  };

  return <section className='rounded-2xl border bg-white p-4'><h3 className='font-semibold'>Diagnostic Test</h3>
  <div className='mt-2 grid gap-2 text-sm'>
    <select className='rounded border p-2' value={subject} onChange={e=>setSubject(e.target.value)}>{subjects.map(s=><option key={s}>{s}</option>)}</select>
    <input className='rounded border p-2' value={topic} onChange={e=>setTopic(e.target.value)} placeholder='Chủ đề'/>
    <div className='flex gap-2'><select className='rounded border p-2 flex-1' value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value='easy'>easy</option><option value='medium'>medium</option><option value='hard'>hard</option></select><input type='number' className='w-20 rounded border p-2' value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
    <button onClick={generate} className='rounded bg-green-600 px-3 py-2 text-white'>{loading?'Đang tạo...':'Tạo câu hỏi AI'}</button>
  </div>
  {result?.questions?.length ? <p className='mt-2 text-xs text-green-700'>Đã tạo {result.questions.length} câu hỏi.</p> : null}
  </section>;
}
