'use client';
import { useState } from 'react';

export default function StudentChat(){
  const [q,setQ]=useState('Hôm nay em nên học gì?');
  const [a,setA]=useState('');
  const [loading,setLoading]=useState(false);
  const ask = async()=>{
    setLoading(true);
    const ctx = { latestSession: localStorage.getItem('st_sessions'), questions: localStorage.getItem('st_questions') };
    const res=await fetch('/api/ai/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,context:ctx})});
    const data=await res.json(); setA(data.reply); setLoading(false);
  };
  return <section className='rounded-2xl border bg-white p-4'><h3 className='font-semibold'>StudentChat</h3><textarea className='mt-2 w-full rounded border p-2 text-sm' value={q} onChange={e=>setQ(e.target.value)}/><button onClick={ask} className='mt-2 rounded bg-green-600 px-3 py-2 text-white text-sm'>{loading?'Đang trả lời...':'Hỏi StudyTwin'}</button>{a?<p className='mt-2 text-sm text-gray-700'>{a}</p>:null}</section>;
}
