import { NextResponse } from 'next/server';
import { callOllamaJson } from '@/lib/ollama';
import { prompts, SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { QuestionsResponseSchema } from '@/lib/schemas';

const fallback = { questions: [{ id:'q1',subject:'Toán lớp 10',topic:'Hàm số',difficulty:'easy',skill:'Biến đổi biểu thức',competencies:['foundational_knowledge'],question:'Hàm số y=2x+1 có hệ số góc là?',options:['2','1','-1','0'],correctIndex:0,explanation:'Hệ số góc là hệ số của x.',mistakeCategory:'knowledge_gap',expectedReasoning:'Nhận diện dạng y=ax+b',estimatedTimeSeconds:60 }] } as const;
export async function POST(req: Request){ const body = await req.json(); const data = await callOllamaJson({ messages:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:prompts.generateQuestions(body)}], schema: QuestionsResponseSchema, fallback: fallback as any }); return NextResponse.json(data); }
