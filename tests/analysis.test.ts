import { describe,it,expect } from 'vitest';
import { computeScore,classifyLevel,roadmapFromWeaknesses } from '@/lib/analysis';

describe('analysis',()=>{
 it('scoring',()=>{const qs=[{id:'1',correctIndex:0},{id:'2',correctIndex:1}];const a=[{questionId:'1',selectedIndex:0,timeSpentSeconds:1},{questionId:'2',selectedIndex:0,timeSpentSeconds:1}];expect(computeScore(qs,a)).toBe(50)});
 it('level',()=>{expect(classifyLevel(30)).toBe('beginner');expect(classifyLevel(90)).toBe('strong')});
 it('roadmap',()=>{expect(roadmapFromWeaknesses(['Đọc điều kiện'])).toHaveLength(7)});
});
