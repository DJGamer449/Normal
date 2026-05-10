import { describe, expect, it } from 'vitest';
import { safeJsonParse } from '../lib/ollama';

describe('safeJsonParse', () => {
  it('falls back from wrapped string', () => {
    const parsed = safeJsonParse('noise {"reply":"ok"}');
    expect(parsed).toEqual({ reply: 'ok' });
  });
});
