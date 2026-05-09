import { ZodSchema } from 'zod';

type Message = { role: 'system'|'user'|'assistant'; content: string };
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b-instruct';
const BASE = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

async function post(messages: Message[], temperature = 0.2) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 120000);
  try {
    const res = await fetch(`${BASE}/api/chat`, { method:'POST', headers:{'content-type':'application/json'}, signal:c.signal,
      body: JSON.stringify({ model: MODEL, stream: false, messages, options: { temperature }, format: 'json' }) });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = await res.json();
    return data?.message?.content ?? '';
  } finally { clearTimeout(t); }
}

export async function callOllamaText(messages: Message[]): Promise<string> {
  try { return await post(messages, 0.4); } catch (e) { console.error('ollama text error', e); return 'Hiện tại AI đang bận, vui lòng thử lại. Trong lúc chờ, em hãy ôn lại 1 ví dụ tương tự.'; }
}

export async function callOllamaJson<T>({messages, schema, fallback, temperature=0.2}:{messages:Message[];schema:ZodSchema<T>;fallback:T;temperature?:number;}): Promise<T> {
  for (let i=0;i<2;i++) {
    try {
      const txt = await post(messages, temperature);
      const parsed = schema.safeParse(JSON.parse(txt));
      if (parsed.success) return parsed.data;
      if (i===1) return fallback;
    } catch (e) { console.error('ollama json error', e); if (i===1) return fallback; }
  }
  return fallback;
}
