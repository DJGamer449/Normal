# StudyTwin AI - self-hosted AI with Ollama (cost-saving)

Đã chuyển sang **Ollama tự host** để giảm chi phí, không phụ thuộc API trả phí.

## AI flow
- `POST /api/ai/generate-quiz`: tạo câu hỏi tự động bằng Ollama.
- `POST /api/ai/summary`: tạo kết luận tổng quát bằng Ollama.
- Nếu Ollama chưa chạy hoặc lỗi, hệ thống fallback nội bộ để app không bị gián đoạn.

## Cài đặt Ollama
1. Cài Ollama trên server.
2. Pull model ví dụ:
   - `ollama pull llama3.1:8b`
3. Chạy Ollama service (mặc định `http://localhost:11434`).

## Chạy StudyTwin server
- `pip install flask requests`
- (tuỳ chọn) `export OLLAMA_MODEL=llama3.1:8b`
- `python3 server.py`
