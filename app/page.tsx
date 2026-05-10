'use client';

import { useEffect, useState } from 'react';

type Question = { id: string; question: string; options: string[]; correctIndex: number };

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [chatReply, setChatReply] = useState('');

  useEffect(() => {
    const q = localStorage.getItem('questions');
    const a = localStorage.getItem('answers');
    const an = localStorage.getItem('analysis');
    if (q) setQuestions(JSON.parse(q));
    if (a) setAnswers(JSON.parse(a));
    if (an) setAnalysis(JSON.parse(an));
  }, []);

  const generate = async () => {
    const res = await fetch('/api/ai/generate-questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: 'Toán lớp 10', topic: 'Hàm số', difficulty: 'easy', numberOfQuestions: 5 }) });
    const data = await res.json();
    setQuestions(data.questions); localStorage.setItem('questions', JSON.stringify(data.questions));
  };

  const analyze = async () => {
    const payload = { studentName: 'Minh', questions, answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })) };
    const res = await fetch('/api/ai/analyze-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setAnalysis(data); localStorage.setItem('analysis', JSON.stringify(data)); localStorage.setItem('learningDNA', JSON.stringify(data.learningDNA));
  };

  const ask = async () => {
    const learningDNA = analysis?.learningDNA || JSON.parse(localStorage.getItem('learningDNA') || '{}');
    const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Hôm nay em nên học gì?', learningDNA }) });
    const data = await res.json(); setChatReply(data.reply);
  };

  const skills = analysis?.skillScores || [
    { skill: 'Tư duy logic', score: 85 }, { skill: 'Áp dụng công thức', score: 42 }, { skill: 'Đọc hiểu đề bài', score: 68 }, { skill: 'Tính toán nhanh', score: 91 }
  ];

  return <main className="max-w-md mx-auto p-4 space-y-4">
    <header className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
      <div><h1 className="text-xl font-bold">Learning DNA</h1><p className="text-xs text-gray-500">Cập nhật 2 phút trước</p></div>
      <div className="w-10 h-10 rounded-full bg-green-500 text-white grid place-items-center font-bold">M</div>
    </header>

    <section className="bg-white rounded-2xl p-4 shadow-sm"><h2 className="font-semibold mb-2">AI Diagnostic</h2><p className="text-sm">{analysis?.summary || 'Bạn không yếu toàn bộ chương. Bạn gặp khó khăn cụ thể ở bước “Biến đổi biểu thức” và “Đọc điều kiện”.'}</p><p className="text-sm mt-2 text-green-700">{analysis?.learningDNA?.todaySuggestion || 'Đề xuất: dành 12 phút ôn tập phần A, sau đó làm 5 câu hỏi mức độ Dễ.'}</p></section>

    <section className="bg-white rounded-2xl p-4 shadow-sm"><h2 className="font-semibold mb-3">Phân tích Kỹ năng</h2>{skills.map((s: any) => <div key={s.skill} className="mb-2"><div className="flex justify-between text-sm"><span>{s.skill}</span><span>{s.score}%</span></div><div className="h-2 bg-gray-200 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${s.score}%` }} /></div></div>)}</section>

    <section className="bg-white rounded-2xl p-4 shadow-sm"><h2 className="font-semibold mb-2">Năng lực cốt lõi</h2><div className="flex flex-wrap gap-2">{['Foundational Knowledge','Syntax Application','Memory','Carefulness','Logical Thinking'].map(t => <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs" key={t}>{t}</span>)}</div></section>

    <section className="bg-white rounded-2xl p-4 shadow-sm"><h2 className="font-semibold mb-2">Tiến độ 7 ngày</h2><svg viewBox="0 0 280 100" className="w-full h-24"><polyline fill="none" stroke="#22c55e" strokeWidth="3" points="0,80 40,70 80,72 120,55 160,50 200,35 240,28 280,20"/></svg></section>

    <section className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
      <button className="w-full bg-green-500 text-white py-2 rounded-xl" onClick={generate}>Tạo câu hỏi AI</button>
      {questions.map((q) => <div key={q.id} className="border rounded-xl p-2"><p className="text-sm font-medium">{q.question}</p><div className="grid grid-cols-2 gap-1 mt-2">{q.options.map((o, i) => <button key={i} className={`text-xs border rounded p-1 ${answers[q.id]===i?'bg-green-100 border-green-500':''}`} onClick={() => { const n={...answers,[q.id]:i}; setAnswers(n); localStorage.setItem('answers', JSON.stringify(n)); }}>{o}</button>)}</div></div>)}
      <button className="w-full bg-gray-900 text-white py-2 rounded-xl" onClick={analyze}>Phân tích bài làm</button>
      <button className="w-full bg-white border py-2 rounded-xl" onClick={ask}>Hỏi: Hôm nay em nên học gì?</button>
      {chatReply && <p className="text-sm text-green-700">{chatReply}</p>}
    </section>
  </main>;
}
