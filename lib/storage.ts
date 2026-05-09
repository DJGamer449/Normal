export type StudentProfile={studentName:string;subject:string;topic:string;difficulty:'beginner'|'intermediate'|'advanced';numberOfQuestions:number};
export const DB_KEYS={state:'studytwin_state_v1'};
export type StudyTwinState={profile?:StudentProfile;questions?:any[];answers?:any[];analysis?:any;flashcards?:any[];roadmap?:any[];sessions?:any[]};
export function loadState():StudyTwinState{if(typeof window==='undefined')return {};try{return JSON.parse(localStorage.getItem(DB_KEYS.state)||'{}')}catch{return {}}}
export function saveState(next:StudyTwinState){if(typeof window==='undefined')return;localStorage.setItem(DB_KEYS.state,JSON.stringify(next));}
