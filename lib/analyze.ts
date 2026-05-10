import { analyzeTestInputSchema, analyzeTestOutputSchema } from './schemas';

export function analyzeTestBasic(input: unknown) {
  const parsed = analyzeTestInputSchema.parse(input);
  const answerMap = new Map(parsed.answers.map((a) => [a.questionId, a.selectedIndex]));
  const correct = parsed.questions.filter((q) => answerMap.get(q.id) === q.correctIndex).length;
  const score = Math.round((correct / Math.max(parsed.questions.length, 1)) * 100);

  const out = {
    score,
    summary:
      score >= 70
        ? 'Bạn không yếu toàn bộ chương. Bạn gặp khó khăn cục bộ ở vài bước nhỏ cần luyện chính xác hơn.'
        : 'Bạn chưa nắm vững toàn bộ phần cốt lõi. Cần củng cố lại kiến thức nền trước khi tăng độ khó.',
    specificWeakness: 'Biến đổi biểu thức và đọc điều kiện trong đề.',
    skillScores: [
      { skill: 'Tư duy logic', score: 85 },
      { skill: 'Áp dụng công thức', score: 42 },
      { skill: 'Đọc hiểu đề bài', score: 68 },
      { skill: 'Tính toán nhanh', score: 91 }
    ],
    coreCompetencies: ['Foundational Knowledge', 'Syntax Application', 'Memory', 'Carefulness', 'Logical Thinking'],
    learningDNA: {
      strongPoints: ['Tính toán nhanh ổn định', 'Khả năng suy luận tốt ở câu quen dạng'],
      weakPoints: ['Áp dụng công thức chưa nhất quán', 'Dễ bỏ sót điều kiện biên'],
      commonMistakes: ['Nhầm công thức', 'Đọc lướt đề'],
      todaySuggestion: 'Dành 12 phút ôn phần A, sau đó làm 5 câu mức độ Dễ về Hàm số.'
    },
    nextAction: 'Ôn công thức trọng tâm 12 phút và làm ngay 5 câu easy để kiểm tra tiến bộ.'
  };

  return analyzeTestOutputSchema.parse(out);
}
