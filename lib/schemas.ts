import { z } from 'zod';

export const mistakeCategoryEnum = z.enum([
  'knowledge_gap',
  'misread_question',
  'wrong_formula',
  'calculation_error',
  'wrong_reasoning',
  'careless'
]);

export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  skill: z.string(),
  competency: z.string(),
  explanation: z.string(),
  mistakeCategory: mistakeCategoryEnum
});

export const generateQuestionsInputSchema = z.object({
  subject: z.string(),
  topic: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.number().int().min(1).max(20)
});

export const generateQuestionsOutputSchema = z.object({
  questions: z.array(questionSchema)
});

export const analyzeTestInputSchema = z.object({
  studentName: z.string(),
  questions: z.array(questionSchema),
  answers: z.array(z.object({ questionId: z.string(), selectedIndex: z.number().int().min(0).max(3) }))
});

export const analyzeTestOutputSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  specificWeakness: z.string(),
  skillScores: z.array(z.object({ skill: z.string(), score: z.number().min(0).max(100) })),
  coreCompetencies: z.array(z.string()),
  learningDNA: z.object({
    strongPoints: z.array(z.string()),
    weakPoints: z.array(z.string()),
    commonMistakes: z.array(z.string()),
    todaySuggestion: z.string()
  }),
  nextAction: z.string()
});

export const chatInputSchema = z.object({
  message: z.string(),
  learningDNA: analyzeTestOutputSchema.shape.learningDNA
});

export const chatOutputSchema = z.object({ reply: z.string() });
