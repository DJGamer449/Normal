#!/usr/bin/env bash
set -euo pipefail
MODEL=${OLLAMA_MODEL:-qwen2.5:7b-instruct}
echo "[1/3] Start Ollama container"
docker compose up -d ollama
echo "[2/3] Wait for Ollama"
until curl -s http://127.0.0.1:11434/api/tags >/dev/null; do sleep 2; done
echo "[3/3] Pull model: $MODEL"
docker exec studytwin-ollama ollama pull "$MODEL"
echo "Done. Ollama is ready at http://127.0.0.1:11434"
