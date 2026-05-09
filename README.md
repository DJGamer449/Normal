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


## Xử lý lỗi port 11434
Nếu port `11434` đã được Ollama khác sử dụng, `run.sh` sẽ tự dùng Ollama đó và chỉ chạy web container.
Nếu port bị ứng dụng khác chiếm và không phải Ollama, script sẽ dừng và báo lỗi rõ ràng.
