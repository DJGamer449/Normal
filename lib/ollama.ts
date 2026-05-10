import { z } from 'zod';

const baseUrl = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b-instruct';

function safeJsonParse(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    const m = input.match(/\{[\s\S]*\}$/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function callOllamaJson<T>(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  schema: z.ZodSchema<T>,
  fallback: T
): Promise<T> {
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, stream: false, format: 'json', messages })
      });
      if (!res.ok) continue;
      const data = await res.json();
      const content = data?.message?.content ?? '{}';
      const parsed = safeJsonParse(content);
      const validated = schema.safeParse(parsed);
      if (validated.success) return validated.data;
    } catch {
      // ignore and fallback
    }
  }
  return fallback;
}

export { safeJsonParse };
