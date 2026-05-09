import { describe, it, expect } from 'vitest';
import { computeScore, levelFromScore } from '@/lib/analyzer';

const qs:any=[{id:'1',correctIndex:0},{id:'2',correctIndex:1},{id:'3',correctIndex:2}];

describe('analyzer',()=>{
 it('scoring',()=> expect(computeScore(qs,[{questionId:'1',selectedIndex:0,timeSpentSeconds:5},{questionId:'2',selectedIndex:1,timeSpentSeconds:5}])).toBe(67));
 it('level',()=> expect(levelFromScore(90)).toBe('strong'));
});
