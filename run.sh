#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
  cp .env.example .env
fi

MODEL=$(grep '^OLLAMA_MODEL=' .env | cut -d '=' -f2-)

docker compose up -d --build

echo "Waiting for Ollama..."
until curl -s http://localhost:11434/api/tags >/dev/null; do
  sleep 2
done

if ! curl -s http://localhost:11434/api/tags | grep -q "$MODEL"; then
  docker compose exec -T ollama ollama pull "$MODEL"
fi

echo "Web: http://localhost:3000"
echo "Ollama: http://localhost:11434"
