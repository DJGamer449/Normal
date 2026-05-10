import { NextResponse } from 'next/server';
import { buildAnalyzePrompt, JSON_RULES } from '@/lib/ai-prompts';
import { callOllamaJson } from '@/lib/ollama';
import { analyzeTestOutputSchema } from '@/lib/schemas';
import { analyzeTestBasic } from '@/lib/analyze';

export async function POST(req: Request) {
  const payload = await req.json();
  const fallback = analyzeTestBasic(payload);
  const output = await callOllamaJson(
    [
      { role: 'system', content: JSON_RULES },
      { role: 'user', content: buildAnalyzePrompt(payload) }
    ],
    analyzeTestOutputSchema,
    fallback
  );
  return NextResponse.json(output);
}
