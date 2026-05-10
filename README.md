# StudyTwin AI
Run all services with one command:
```bash
chmod +x run.sh
./run.sh
```
Stop:
```bash
docker compose down
```
Change model in `.env` (`OLLAMA_MODEL`).
Recommended models: `qwen2.5:7b-instruct` (VN + JSON), `llama3.1:8b`, `gemma2:9b`.
If your machine is weak, use a smaller model.
First run may take time because the model is downloaded.
