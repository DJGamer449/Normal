import LearningDNACard from '@/components/LearningDNACard';
import SkillAnalysisCard from '@/components/SkillAnalysisCard';
import CoreCompetencyTags from '@/components/CoreCompetencyTags';
import ProgressTrendCard from '@/components/ProgressTrendCard';
import DiagnosticTest from '@/components/DiagnosticTest';
import AdaptivePractice from '@/components/AdaptivePractice';
import FlashcardDeck from '@/components/FlashcardDeck';
import StudentChat from '@/components/StudentChat';
import TeacherDashboard from '@/components/TeacherDashboard';

export default function Home(){return <main className='mx-auto max-w-5xl p-4 md:p-6'><header className='mb-4 flex items-start justify-between'><div><h1 className='text-2xl font-bold'>Learning DNA</h1><p className='text-xs text-gray-500'>Cập nhật 2 phút trước</p></div><div className='h-10 w-10 rounded-full bg-green-100 border flex items-center justify-center'>🧑‍🎓</div></header><div className='grid gap-4 md:grid-cols-2'><LearningDNACard/><SkillAnalysisCard/><CoreCompetencyTags/><ProgressTrendCard/><DiagnosticTest/><AdaptivePractice/><FlashcardDeck/><StudentChat/><TeacherDashboard/></div></main>}
