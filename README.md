# StudyTwin AI (Next.js + TypeScript + Tailwind + Ollama)

## Run one command
```bash
chmod +x run.sh
./run.sh
```

## Stack
- Next.js App Router + TypeScript + Tailwind
- Ollama self-host via Docker Compose
- Frontend calls only Next.js API routes (`/api/ai/*`)

## API
- `POST /api/ai/generate-questions`
- `POST /api/ai/analyze-test`
- `POST /api/ai/chat`

## Notes
- No OpenAI usage.
- Ollama is accessed server-side through `lib/ollama.ts`.
- Demo data persisted in LocalStorage: `questions`, `answers`, `analysis`, `learningDNA`.
