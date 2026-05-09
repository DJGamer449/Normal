import { NextResponse } from 'next/server';
import { callOllamaText } from '@/lib/ollama';
import { prompts, SYSTEM_PROMPT } from '@/lib/ai-prompts';
export async function POST(req: Request){ const body = await req.json(); const reply = await callOllamaText([{role:'system',content:SYSTEM_PROMPT},{role:'user',content:prompts.chat(body)}]); return NextResponse.json({ reply }); }
