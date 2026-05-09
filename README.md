# StudyTwin AI - Server-based personalized web app

Bạn host trên server để học sinh tạo **tài khoản riêng**, đăng nhập và có dữ liệu cá nhân hóa.

## Có gì trong phiên bản này
- Đăng ký / đăng nhập tài khoản học sinh.
- Lưu hồ sơ cá nhân (họ tên, lớp).
- Keep streak theo từng tài khoản.
- Lưu lịch sử điểm theo từng tài khoản.
- Quiz + báo cáo + kế hoạch ABC/XYZ.

## Chạy trên server
1. Cài dependency: `pip install flask`
2. Chạy app: `python3 server.py`
3. Deploy lên VPS/cloud với Nginx + Gunicorn (khuyến nghị production).
