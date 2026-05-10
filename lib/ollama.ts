import { z } from 'zod';
const baseUrl=process.env.OLLAMA_BASE_URL||'http://127.0.0.1:11434';
const model=process.env.OLLAMA_MODEL||'qwen2.5:7b-instruct';
type Msg={role:'system'|'user'|'assistant';content:string};
async function rawChat(messages:Msg[],temperature=0.3){const c=new AbortController();const t=setTimeout(()=>c.abort(),120000);try{const r=await fetch(`${baseUrl}/api/chat`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model,messages,stream:false,options:{temperature}}),signal:c.signal});if(!r.ok) throw new Error('ollama unavailable');const j=await r.json();return j?.message?.content||'';}finally{clearTimeout(t);}}
export async function callOllamaText(messages:Msg[]):Promise<string>{try{return await rawChat(messages);}catch(e){console.error('Ollama text error',e);return 'Dữ liệu demo: hệ thống AI tạm thời không sẵn sàng.';}}
function safeJson(s:string){try{return JSON.parse(s);}catch{return null;}}
export async function callOllamaJson<T>({messages,schema,fallback,temperature=0.2}:{messages:Msg[];schema:z.ZodType<T>;fallback:T;temperature?:number;}):Promise<T>{for(let i=0;i<2;i++){try{const txt=await rawChat(messages,temperature);const parsed=safeJson(txt);if(parsed){const ok=schema.safeParse(parsed);if(ok.success) return ok.data;}}catch(e){console.error('Ollama json error',e);} }
return fallback;}
