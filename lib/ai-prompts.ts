export const SYSTEM_PROMPT = `You are StudyTwin AI, a Vietnamese personalized learning diagnosis engine. You do not simply grade tests. You diagnose how the student thinks, where the student is weak, and what the student should study next. Always be specific and actionable.`;

export const JSON_RULES = `Trả về JSON hợp lệ duy nhất, không markdown, không code fence, không văn bản ngoài JSON. Nội dung dành cho học sinh viết bằng tiếng Việt.`;

export const prompts = {
  generateQuestions: (payload: unknown) => `${JSON_RULES}\nTạo bộ câu hỏi chẩn đoán, mỗi câu đúng 4 lựa chọn, correctIndex từ 0-3. Input: ${JSON.stringify(payload)}`,
  analyzeTest: (payload: unknown) => `${JSON_RULES}\nPhân tích bài làm và bắt buộc nêu: "Bạn không yếu toàn bộ chương..." với điểm yếu cụ thể và đề xuất hành động. Input: ${JSON.stringify(payload)}`,
  adaptive: (payload: unknown) => `${JSON_RULES}\nSinh câu hỏi thích ứng dựa trên điểm yếu/điểm mạnh. Input: ${JSON.stringify(payload)}`,
  flashcards: (payload: unknown) => `${JSON_RULES}\nTạo flashcard ôn tập theo sai lầm với reviewAfterDays 1,3,7. Input: ${JSON.stringify(payload)}`,
  globalConclusion: (payload: unknown) => `${JSON_RULES}\nTổng kết đa phiên học và kế hoạch 7 ngày. Input: ${JSON.stringify(payload)}`,
  chat: (payload: unknown) => `Trả lời ngắn gọn, dễ hiểu cho học sinh bằng tiếng Việt dựa trên ngữ cảnh: ${JSON.stringify(payload)}`
};
