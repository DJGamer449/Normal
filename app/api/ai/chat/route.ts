import { NextResponse } from 'next/server';
import { buildChatPrompt, JSON_RULES } from '@/lib/ai-prompts';
import { callOllamaJson } from '@/lib/ollama';
import { chatInputSchema, chatOutputSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  const input = chatInputSchema.parse(await req.json());
  const fallback = { reply: 'Hôm nay em ôn 12 phút phần yếu nhất, rồi làm 5 câu easy để củng cố.' };
  const output = await callOllamaJson(
    [
      { role: 'system', content: JSON_RULES },
      { role: 'user', content: buildChatPrompt(input.message, input.learningDNA) }
    ],
    chatOutputSchema,
    fallback
  );
  return NextResponse.json(output);
}
