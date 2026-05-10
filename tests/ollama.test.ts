import { describe,it,expect,vi } from 'vitest';
import { callOllamaJson } from '@/lib/ollama';
import { z } from 'zod';
describe('ollama fallback',()=>{it('returns fallback on invalid json',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({message:{content:'nope'}})}));const r=await callOllamaJson({messages:[{role:'user',content:'x'} as any],schema:z.object({a:z.number()}),fallback:{a:1}});expect(r.a).toBe(1);});});
