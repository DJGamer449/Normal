# StudyTwin AI - Personalized Learning Platform (AI-enabled)

Đã tích hợp AI để:
- Tự động tạo câu hỏi theo môn/chủ đề và mức độ.
- Tối ưu hóa câu hỏi theo kết quả gần nhất.
- Tạo kết luận tổng quát sau mỗi bài kiểm tra (điểm mạnh/yếu, lỗi chính, ưu tiên hôm nay, kế hoạch 7 ngày).

## Cấu hình AI
- `OPENAI_API_KEY`: API key.
- `OPENAI_MODEL` (tuỳ chọn): mặc định `gpt-4.1-mini`.

## Chạy server
```bash
pip install flask
export OPENAI_API_KEY=your_key
python3 server.py
```

Nếu chưa có API key, hệ thống dùng fallback mẫu để demo.
