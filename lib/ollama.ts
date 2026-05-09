import { z } from 'zod';
export type ChatMessage = { role: 'system'|'user'|'assistant'; content: string };
function safeParse(text: string){ try { return JSON.parse(text); } catch { return null; } }
export async function callOllamaJson<T>(messages: ChatMessage[], schema: z.ZodType<T>, fallback: T): Promise<T> {
  const base = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b-instruct';
  for (let i=0;i<2;i++) {
    try {
      const res = await fetch(`${base}/api/chat`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,stream:false,messages,format:'json'})});
      if (!res.ok) continue;
      const data = await res.json() as { message?: { content?: string } };
      const parsed = safeParse(data.message?.content ?? '');
      const validated = schema.safeParse(parsed);
      if (validated.success) return validated.data;
    } catch {}
  }
  return fallback;
}
