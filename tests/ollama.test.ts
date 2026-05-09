import { describe,it,expect,vi } from 'vitest';
import { callOllamaJson } from '@/lib/ollama';
import { z } from 'zod';

describe('ollama fallback',()=>{
 it('returns fallback on invalid json',async ()=>{
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({message:{content:'not-json'}})}));
  const out=await callOllamaJson([{role:'user',content:'x'}],z.object({a:z.number()}),{a:7});
  expect(out.a).toBe(7);
 });
});
