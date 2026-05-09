import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callOllamaJson } from '@/lib/ollama';import { SYSTEM_JSON, questionPrompt } from '@/lib/ai-prompts';import { questionsOutputSchema } from '@/lib/types';import { fallbackQuestions } from '@/lib/fallbacks';
const inputSchema=z.object({subject:z.string(),topic:z.string(),difficulty:z.enum(['beginner','intermediate','advanced']),numberOfQuestions:z.number().int().min(1).max(20).default(8)});
export async function POST(req:NextRequest){const input=inputSchema.parse(await req.json());const out=await callOllamaJson([{role:'system',content:SYSTEM_JSON},{role:'user',content:questionPrompt(input)}],questionsOutputSchema,fallbackQuestions);return NextResponse.json(out)}
