import { expect, it } from 'vitest';
import { generateQuestionsOutputSchema } from '../lib/schemas';

it('validates question schema', () => {
  const ok = generateQuestionsOutputSchema.safeParse({ questions: [{ id: 'q1', question: 'Q?', options: ['A','B','C','D'], correctIndex: 0, skill: 's', competency: 'c', explanation: 'e', mistakeCategory: 'careless' }] });
  expect(ok.success).toBe(true);
});
