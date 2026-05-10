import { describe, expect, it } from 'vitest';
import { analyzeTestBasic } from '../lib/analyze';

it('scores basic answers', () => {
  const out = analyzeTestBasic({
    studentName: 'Minh',
    questions: [{ id: 'q1', question: 'x', options: ['a', 'b', 'c', 'd'], correctIndex: 1, skill: 's', competency: 'c', explanation: 'e', mistakeCategory: 'careless' }],
    answers: [{ questionId: 'q1', selectedIndex: 1 }]
  });
  expect(out.score).toBe(100);
});
