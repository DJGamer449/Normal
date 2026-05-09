import { Answer, Question } from './schemas';

export function computeScore(questions: Question[], answers: Answer[]) {
  const map = new Map(answers.map(a=>[a.questionId,a]));
  const correct = questions.filter(q=>map.get(q.id)?.selectedIndex===q.correctIndex).length;
  return Math.round((correct/Math.max(questions.length,1))*100);
}

export function levelFromScore(score:number){ if(score<40)return 'beginner'; if(score<65)return 'developing'; if(score<85)return 'good'; return 'strong'; }
