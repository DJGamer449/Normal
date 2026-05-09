'use client';
import { useEffect, useState } from 'react';import { loadState, saveState } from '@/lib/storage';
export default function Result(){const [s,setS]=useState<any>({});useEffect(()=>setS(loadState()),[]);
async function genFlash(){const res=await fetch('/api/ai/generate-flashcards',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({analysis:s.analysis})});const data=await res.json();const ns={...s,flashcards:data.flashcards};saveState(ns);setS(ns)}
return <div className='space-y-4'><h1 className='text-2xl font-bold'>Kết quả & Learning DNA</h1><div className='card'><p>Điểm: <b>{s.analysis?.score}</b> - Mức: <b>{s.analysis?.level}</b></p><p>{s.analysis?.summary}</p><p className='text-cyan-300'>Yếu cụ thể: {s.analysis?.specificWeakness}</p></div><button className='bg-fuchsia-600 px-3 py-2 rounded' onClick={genFlash}>Tạo flashcards</button></div>}
