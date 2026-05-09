#!/usr/bin/env bash
set -euo pipefail

command -v docker >/dev/null || { echo 'Docker chưa cài đặt.'; exit 1; }
docker compose version >/dev/null || { echo 'Docker Compose chưa sẵn sàng.'; exit 1; }

[ -f .env ] || cp .env.example .env
MODEL=$(awk -F= '/^OLLAMA_MODEL=/{print $2}' .env)

echo 'Starting containers...'
docker compose up -d --build

echo 'Waiting for Ollama health...'
for i in {1..90}; do
  if curl -fsS http://localhost:11434/api/tags >/dev/null; then break; fi
  sleep 2
  if [ "$i" -eq 90 ]; then echo 'Ollama không phản hồi kịp thời, app vẫn có fallback demo.'; fi
done

echo "Ensuring model ${MODEL}..."
docker compose exec -T ollama ollama list | grep -q "$MODEL" || docker compose exec -T ollama ollama pull "$MODEL" || true

docker compose logs --tail=30 web ollama || true

echo 'StudyTwin AI is running at http://localhost:3000'
echo 'Ollama is running at http://localhost:11434'
