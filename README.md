# StudyTwin AI

Ứng dụng Next.js cho trợ lý học tập cá nhân hóa (Learning DNA), dùng Ollama self-hosted.

## Chạy nhanh

```bash
cp .env.example .env
npm install
npm run dev:full
```

`dev:full` sẽ tự chạy `docker compose up -d ollama`, chờ service sẵn sàng và pull model `qwen2.5:7b-instruct` rồi bật web app.

## API nội bộ
- POST `/api/ai/generate-questions`
- POST `/api/ai/generate-adaptive-questions`
- POST `/api/ai/analyze-test`
- POST `/api/ai/global-conclusion`
- POST `/api/ai/generate-flashcards`
- POST `/api/ai/chat`

Tất cả gọi Ollama qua server route, không lộ endpoint AI ở frontend.
