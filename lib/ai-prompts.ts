export const SYSTEM_JSON = `Bạn là StudyTwin AI. Chỉ trả về JSON hợp lệ, không markdown. Nội dung tiếng Việt rõ ràng, cụ thể theo kỹ năng, tránh mơ hồ.`;
export const questionPrompt = (input: unknown)=>`Tạo bộ câu hỏi chẩn đoán theo input: ${JSON.stringify(input)}. Mỗi câu có đáp án duy nhất, không mơ hồ.`;
export const analyzePrompt = (input: unknown)=>`Phân tích bài làm: ${JSON.stringify(input)}. BẮT BUỘC phân biệt yếu toàn chương hay yếu tiểu kỹ năng, đưa gợi ý thời lượng học cụ thể.`;
