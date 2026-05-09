# StudyTwin AI — Advanced Graduation Demo

Demo ứng dụng trợ lý học tập cá nhân hóa, phiên bản nâng cấp để phù hợp tiêu chuẩn đồ án tốt nghiệp.

## Nâng cấp chính
- Hỗ trợ nhiều môn (Toán, Vật lý) với khung năng lực riêng.
- Quiz chẩn đoán theo môn, phân loại lỗi theo 3 nhóm nguyên nhân.
- Báo cáo chuyên nghiệp: mức năng lực, điểm %, kỹ năng ưu tiên, bảng lỗi theo từng câu.
- Sinh bài tập thích ứng theo năng lực (adaptive exercises).
- Sinh flashcard theo lỗi thật học sinh vừa mắc.
- Lưu lịch sử 10 lần làm gần nhất bằng localStorage.
- Voice Q&A tiếng Việt để demo tương tác thời gian thực.

## Chạy ứng dụng
```bash
python3 -m http.server 8080
```
Mở: http://localhost:8080

## Gợi ý demo trước hội đồng
1. Chọn môn học.
2. Làm bài và cố tình sai vài câu.
3. Cho xem phân tích lỗi theo câu + lộ trình 7 ngày.
4. Chuyển môn để thể hiện tính mở rộng hệ thống.
5. Dùng voice hỏi: “Hôm nay em nên ôn gì?”.
