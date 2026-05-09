# StudyTwin AI

## Chạy 1 lệnh
```bash
chmod +x run.sh
./run.sh
```

- App: http://localhost:3000
- Ollama: http://localhost:11434

## Dừng
```bash
docker compose down
```

## Đổi model
Sửa `OLLAMA_MODEL` trong `.env`.

Model gợi ý:
- `qwen2.5:7b-instruct` (tốt cho tiếng Việt + JSON)
- `llama3.1:8b`
- `gemma2:9b`

Máy yếu nên dùng model nhỏ hơn. Lần chạy đầu có thể lâu vì cần tải model.
