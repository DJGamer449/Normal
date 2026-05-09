# StudyTwin AI - Personalized Learning Platform

Phiên bản này tập trung đúng các tính năng hội đồng chấm đồ án quan tâm:
- Kiểm tra năng lực đầu vào theo môn/chủ đề (Toán, Anh, Tin, Lý, Lập trình).
- Bản đồ năng lực cá nhân theo 7 trục kỹ năng.
- AI phân tích lỗi sai theo nguyên nhân.
- Lộ trình học 7 ngày cá nhân hóa.
- Adaptive learning (tăng/giảm độ khó theo kết quả).
- Flashcard + nhắc ôn 1/3/7 ngày (thể hiện trong roadmap).
- Chat với StudyTwin.
- Learning DNA.
- Teacher overview (demo lớp học: lỗi phổ biến/nhóm yếu).

## Deploy server
- `pip install flask`
- `python3 server.py`
- Deploy production: Gunicorn + Nginx.
