import { AdaptivePractice } from '@/components/AdaptivePractice';
import { CoreCompetencyTags } from '@/components/CoreCompetencyTags';
import { DiagnosticTest } from '@/components/DiagnosticTest';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { LearningDNACard } from '@/components/LearningDNACard';
import { ProgressTrendCard } from '@/components/ProgressTrendCard';
import { SkillAnalysisCard } from '@/components/SkillAnalysisCard';
import { StudentChat } from '@/components/StudentChat';
import { TeacherDashboard } from '@/components/TeacherDashboard';
export default function Page(){return <main className='mx-auto max-w-5xl p-4 sm:p-6'><header className='mb-4 flex items-start justify-between'><div><h1 className='text-2xl font-bold'>Learning DNA</h1><p className='text-xs text-slate-500'>Cập nhật 2 phút trước</p></div><div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100'>👩‍🎓</div></header><div className='grid gap-4 md:grid-cols-2'><LearningDNACard/><SkillAnalysisCard/><CoreCompetencyTags/><ProgressTrendCard/><DiagnosticTest/><AdaptivePractice/><FlashcardDeck/><StudentChat/><TeacherDashboard/></div></main>}
