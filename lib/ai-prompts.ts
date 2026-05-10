export const JSON_RULES = `Bạn là trợ lý AI giáo dục. BẮT BUỘC trả về JSON hợp lệ đúng schema. Không markdown. Không code fence. Nội dung tiếng Việt tự nhiên, cụ thể, không chung chung. Luôn phân biệt rõ: yếu toàn bộ chương hay yếu ở kỹ năng nhỏ.`;

export const buildGenerateQuestionsPrompt = (input: {
  subject: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
}) => `${JSON_RULES}\nTạo ${input.numberOfQuestions} câu trắc nghiệm cho ${input.subject}, chủ đề ${input.topic}, độ khó ${input.difficulty}. Mỗi câu có 4 đáp án, có giải thích ngắn và phân loại lỗi sai.`;

export const buildAnalyzePrompt = (payload: unknown) =>
  `${JSON_RULES}\nDựa vào dữ liệu bài làm sau, phân tích cụ thể và tạo Learning DNA. summary phải nêu rõ điểm nghẽn kỹ năng cụ thể (ví dụ Biến đổi biểu thức, Đọc điều kiện). Dữ liệu: ${JSON.stringify(payload)}`;

export const buildChatPrompt = (message: string, learningDNA: unknown) =>
  `${JSON_RULES}\nHọc sinh hỏi: ${message}. Learning DNA hiện tại: ${JSON.stringify(learningDNA)}. Hãy trả lời ngắn gọn, actionable trong hôm nay.`;
