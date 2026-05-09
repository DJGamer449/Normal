import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export const MistakeCategorySchema = z.enum(['knowledge_gap','misread_question','wrong_formula_or_syntax','calculation_error','wrong_reasoning','careless_mistake']);
export const CompetencySchema = z.enum(['foundational_knowledge','reading_comprehension','logical_thinking','formula_or_syntax_application','calculation','memory','carefulness']);

export const QuestionSchema = z.object({
  id: z.string(), subject: z.string(), topic: z.string(), difficulty: DifficultySchema, skill: z.string(),
  competencies: z.array(CompetencySchema).min(1), question: z.string(), options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3), explanation: z.string(), mistakeCategory: MistakeCategorySchema,
  expectedReasoning: z.string(), estimatedTimeSeconds: z.number().int().positive()
});
export const QuestionsResponseSchema = z.object({ questions: z.array(QuestionSchema).min(1) });

export const AnswerSchema = z.object({ questionId: z.string(), selectedIndex: z.number().int().min(0).max(3), timeSpentSeconds: z.number().int().nonnegative() });
export const SkillScoreSchema = z.object({ skill: z.string(), score: z.number().min(0).max(100), comment: z.string() });
export const CompetencyScoreSchema = z.object({ competency: CompetencySchema, score: z.number().min(0).max(100), comment: z.string() });
export const AnalyzeResponseSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['beginner','developing','good','strong']), summary: z.string(), notWeakInWholeChapter: z.boolean(), specificWeakness: z.string(),
  skillScores: z.array(SkillScoreSchema), competencyMap: z.array(CompetencyScoreSchema),
  mistakeAnalysis: z.array(z.object({questionId: z.string(), mistakeCategory: MistakeCategorySchema, reason: z.string(), correctiveFeedback: z.string()})),
  learningDNA: z.object({strongPoints: z.array(z.string()), weakPoints: z.array(z.string()), commonMistakes: z.array(z.string()), learningStyle: z.string(), priorityTopic: z.string(), todaySuggestion: z.string()}),
  nextQuestionStrategy: z.object({difficulty: z.enum(['easier','same','harder']), targetSkills: z.array(z.string()), reason: z.string()})
});

export type Question = z.infer<typeof QuestionSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
