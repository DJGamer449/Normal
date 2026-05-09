#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

export OLLAMA_BASE_URL=${OLLAMA_BASE_URL:-http://127.0.0.1:11434}
export OLLAMA_MODEL=${OLLAMA_MODEL:-qwen2.5:7b-instruct}

if ! command -v ollama >/dev/null 2>&1; then
  echo "[Setup] Installing Ollama (no Docker)..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

if ! pgrep -f "ollama serve" >/dev/null 2>&1; then
  echo "[Setup] Starting Ollama service..."
  nohup ollama serve > /tmp/ollama.log 2>&1 &
  sleep 2
fi

echo "[Setup] Waiting Ollama at $OLLAMA_BASE_URL ..."
until curl -s "$OLLAMA_BASE_URL/api/tags" >/dev/null; do sleep 1; done

echo "[Setup] Pulling model: $OLLAMA_MODEL"
ollama pull "$OLLAMA_MODEL"

if [ ! -d node_modules ]; then
  echo "[Setup] Installing npm dependencies..."
  npm install
fi

echo "[Run] Starting StudyTwin web at http://localhost:3000"
npm run dev
