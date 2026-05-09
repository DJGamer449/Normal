import { questionSchema } from './types';
export type Answer = {questionId:string;selectedIndex:number;timeSpentSeconds:number};
export function computeScore(qs: any[], answers: Answer[]){const m=new Map(answers.map(a=>[a.questionId,a]));const c=qs.filter(q=>m.get(q.id)?.selectedIndex===q.correctIndex).length;return Math.round((c/Math.max(qs.length,1))*100)}
export function classifyLevel(score:number){if(score<40)return 'beginner';if(score<65)return 'developing';if(score<85)return 'good';return 'strong';}
export function roadmapFromWeaknesses(weak:string[]){return Array.from({length:7},(_,i)=>({day:`Day ${i+1}`,goal:`Củng cố ${weak[0]??'nền tảng'}`,lessons:[`Ôn lại ${weak.join(', ')||'khái niệm chính'}`],practiceTasks:['Làm 5 câu dễ','Làm 3 câu vận dụng'],flashcards:['Ôn bộ thẻ lỗi sai'],reviewSchedule:i===0?'1 ngày':'3 hoặc 7 ngày',expectedResult:'Giảm lỗi lặp lại'}));}
export function ensureQuestions(qs: unknown[]){return qs.map((q)=>questionSchema.parse(q));}
