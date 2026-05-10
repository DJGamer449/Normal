#!/usr/bin/env bash
set -euo pipefail
command -v docker >/dev/null || { echo 'Docker not installed'; exit 1; }
docker compose version >/dev/null || { echo 'Docker Compose not available'; exit 1; }
[ -f .env ] || cp .env.example .env
docker compose up -d --build
echo 'Waiting for Ollama health...'
for _ in $(seq 1 90); do
  if curl -fsS http://localhost:11434/api/tags >/dev/null; then break; fi
  sleep 2
done
MODEL=$(awk -F= '/^OLLAMA_MODEL=/{print $2}' .env)
[ -n "$MODEL" ] || MODEL='qwen2.5:7b-instruct'
docker compose exec -T ollama ollama list | grep -q "$MODEL" || docker compose exec -T ollama ollama pull "$MODEL" || true
docker compose logs --tail=20 web ollama || true
echo 'StudyTwin AI is running at http://localhost:3000'
echo 'Ollama is running at http://localhost:11434'
