import { NextResponse } from 'next/server';
export async function POST(){ return NextResponse.json({ strategy:'Củng cố điểm yếu trước',targetSkills:['Đọc hiểu đề bài'],difficultyPlan:'2 dễ, 2 trung bình, 1 nâng cao',questions:[] }); }
