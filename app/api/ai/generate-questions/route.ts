import { NextResponse } from 'next/server';
import { callOllamaJson } from '@/lib/ollama';
import { generateQuestionsResponseSchema } from '@/lib/schemas';
import { JSON_RULES, SYSTEM_PROMPT } from '@/lib/ai-prompts';
const fallback={questions:[{id:'q1',subject:'Toán lớp 10',topic:'Hàm số',difficulty:'easy',skill:'Áp dụng công thức',competencies:['foundational_knowledge'],question:'Hàm số y=2x+1 có hệ số góc là?',options:['1','2','-1','0'],correctIndex:1,explanation:'Hệ số trước x là 2.',mistakeCategory:'knowledge_gap',expectedReasoning:'Nhận diện dạng ax+b',estimatedTimeSeconds:60}]};
export async function POST(req:Request){const body=await req.json();const messages=[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:`${JSON_RULES}\nTạo ${body.numberOfQuestions||8} câu hỏi ${body.subject} chủ đề ${body.topic} độ khó ${body.difficulty}.`} ] as const;const data=await callOllamaJson({messages:[...messages],schema:generateQuestionsResponseSchema,fallback});return NextResponse.json(data);}
