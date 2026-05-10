const K={profile:'st_profile',sessions:'st_sessions'};
export const getStudentProfile=()=>typeof window==='undefined'?null:JSON.parse(localStorage.getItem(K.profile)||'null');
export const saveStudentProfile=(v:unknown)=>{if(typeof window!=='undefined')localStorage.setItem(K.profile,JSON.stringify(v));};
export const getSessions=()=>typeof window==='undefined'?[]:JSON.parse(localStorage.getItem(K.sessions)||'[]');
export const saveSession=(v:unknown)=>{if(typeof window!=='undefined'){const s=getSessions();s.push(v);localStorage.setItem(K.sessions,JSON.stringify(s));}};
export const getLatestSession=()=>{const s=getSessions();return s.at(-1)??null;};
export const clearDemoData=()=>{if(typeof window!=='undefined'){localStorage.removeItem(K.profile);localStorage.removeItem(K.sessions);}};
