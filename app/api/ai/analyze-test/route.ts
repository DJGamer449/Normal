import { NextResponse } from 'next/server';
import { callOllamaJson } from '@/lib/ollama';
import { prompts, SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { AnalyzeResponseSchema } from '@/lib/schemas';
import { computeScore, levelFromScore } from '@/lib/analyzer';

export async function POST(req: Request){ const body = await req.json(); const score = computeScore(body.questions||[], body.answers||[]); const fallback = { score, level: levelFromScore(score), summary:"Bạn không yếu toàn bộ chương. Bạn gặp khó khăn cụ thể ở bước 'Biến đổi biểu thức' và 'Đọc điều kiện'.", notWeakInWholeChapter:true, specificWeakness:'Biến đổi biểu thức và đọc điều kiện', skillScores:[{skill:'Tư duy logic',score:85,comment:'Tốt'},{skill:'Áp dụng công thức',score:42,comment:'Cần ôn lại'}], competencyMap:[{competency:'foundational_knowledge',score:72,comment:'Khá'}], mistakeAnalysis:[], learningDNA:{strongPoints:['Tính toán nhanh'],weakPoints:['Đọc điều kiện'],commonMistakes:['Bỏ sót dữ kiện'],learningStyle:'Học qua ví dụ ngắn',priorityTopic:'Hàm số bậc nhất',todaySuggestion:'Ôn 12 phút rồi làm 5 câu dễ'}, nextQuestionStrategy:{difficulty:'easier',targetSkills:['Đọc hiểu đề bài'],reason:'Cần củng cố nền tảng'} };
const data = await callOllamaJson({messages:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:prompts.analyzeTest(body)}],schema:AnalyzeResponseSchema,fallback:fallback as any}); return NextResponse.json(data); }
