import { NextResponse } from 'next/server';
import { buildGenerateQuestionsPrompt, JSON_RULES } from '@/lib/ai-prompts';
import { callOllamaJson } from '@/lib/ollama';
import { generateQuestionsInputSchema, generateQuestionsOutputSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  const input = generateQuestionsInputSchema.parse(await req.json());
  const fallback = {
    questions: Array.from({ length: input.numberOfQuestions }).map((_, idx) => ({
      id: `q${idx + 1}`,
      question: `Câu hỏi mẫu ${idx + 1} về ${input.topic}?`,
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      skill: 'Áp dụng công thức',
      competency: 'Foundational Knowledge',
      explanation: 'Đây là câu hỏi mẫu khi AI tạm thời không phản hồi đúng định dạng.',
      mistakeCategory: 'knowledge_gap' as const
    }))
  };
  const output = await callOllamaJson(
    [
      { role: 'system', content: JSON_RULES },
      { role: 'user', content: buildGenerateQuestionsPrompt(input) }
    ],
    generateQuestionsOutputSchema,
    fallback
  );

  return NextResponse.json(output);
}
