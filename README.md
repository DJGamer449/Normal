# StudyTwin AI

Chạy **không cần Docker**. Chỉ cần 1 lệnh shell.

## One-command run

```bash
cp .env.example .env
bash scripts/run.sh
```

Script sẽ tự động:
1. Cài Ollama native (nếu chưa có)
2. Start `ollama serve`
3. Pull model `qwen2.5:7b-instruct`
4. Cài npm dependencies (nếu thiếu)
5. Start Next.js web app (`http://localhost:3000`)

## Nội bộ API (server-side)
- `/api/ai/generate-questions`
- `/api/ai/generate-adaptive-questions`
- `/api/ai/analyze-test`
- `/api/ai/global-conclusion`
- `/api/ai/generate-flashcards`
- `/api/ai/chat`
