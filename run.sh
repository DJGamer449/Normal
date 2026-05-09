#!/usr/bin/env bash
set -euo pipefail

command -v docker >/dev/null || { echo 'Docker chưa cài đặt.'; exit 1; }
docker compose version >/dev/null || { echo 'Docker Compose chưa sẵn sàng.'; exit 1; }
[ -f .env ] || cp .env.example .env
MODEL=$(awk -F= '/^OLLAMA_MODEL=/{print $2}' .env)

port_in_use() { (command -v lsof >/dev/null && lsof -iTCP:11434 -sTCP:LISTEN -n -P >/dev/null) || (command -v ss >/dev/null && ss -ltn '( sport = :11434 )' | tail -n +2 | grep -q .); }
ollama_up() { curl -fsS http://localhost:11434/api/tags >/dev/null; }

if port_in_use; then
  if ollama_up; then
    echo 'Port 11434 đang được Ollama hiện có sử dụng. Sẽ dùng Ollama ngoài compose.'
    export OLLAMA_BASE_URL=http://host.docker.internal:11434
    docker compose up -d --build --no-deps web
  else
    echo 'Port 11434 đang bị ứng dụng khác chiếm. Hãy giải phóng port hoặc chạy Ollama tại đó.'
    exit 1
  fi
else
  echo 'Starting containers...'
  docker compose up -d --build
  echo 'Waiting for Ollama health...'
  for i in {1..90}; do
    if ollama_up; then break; fi
    sleep 2
  done
  if ! ollama_up; then
    echo 'Ollama không phản hồi kịp thời, app vẫn có fallback demo.'
  else
    echo "Ensuring model ${MODEL}..."
    docker compose exec -T ollama ollama list | grep -q "$MODEL" || docker compose exec -T ollama ollama pull "$MODEL" || true
  fi
fi

docker compose logs --tail=20 web || true
echo 'StudyTwin AI is running at http://localhost:3000'
echo 'Ollama is running at http://localhost:11434'
