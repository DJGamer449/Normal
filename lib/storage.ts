export type SessionData = { createdAt: string; analysis?: unknown; questions?: unknown[]; answers?: unknown[] };
const K = { profile:'st_profile', sessions:'st_sessions' };
const parse = <T>(v:string|null,f:T):T=>{try{return v?JSON.parse(v):f;}catch{return f;}};
export const getStudentProfile = ()=> typeof localStorage==='undefined'?null:parse(localStorage.getItem(K.profile),null);
export const saveStudentProfile = (p:unknown)=> localStorage.setItem(K.profile, JSON.stringify(p));
export const getSessions = ():SessionData[]=> typeof localStorage==='undefined'?[]:parse(localStorage.getItem(K.sessions),[]);
export const saveSession = (s:SessionData)=> localStorage.setItem(K.sessions, JSON.stringify([s,...getSessions()]));
export const getLatestSession = ()=> getSessions()[0] ?? null;
export const clearDemoData = ()=> { localStorage.removeItem(K.profile); localStorage.removeItem(K.sessions); };
