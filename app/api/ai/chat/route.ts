import { NextRequest, NextResponse } from 'next/server';import { z } from 'zod';import { callOllamaJson } from '@/lib/ollama';
const schema=z.object({reply:z.string()});
export async function POST(req:NextRequest){const input=await req.json();const out=await callOllamaJson([{role:'system',content:'Bạn là StudyTwin AI, trả lời tiếng Việt, cụ thể theo Learning DNA.'},{role:'user',content:JSON.stringify(input)}],schema,{reply:'Bạn yếu nhất ở đọc điều kiện. Hôm nay ôn 12 phút rồi làm 5 câu dễ.'});return NextResponse.json(out)}
