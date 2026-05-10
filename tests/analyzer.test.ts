import { describe,it,expect } from 'vitest';
import { analyzeLocal } from '@/lib/analyzer';
const q=[{id:'1',correctIndex:0},{id:'2',correctIndex:1}];
describe('analyzer',()=>{it('scoring',()=>{const r=analyzeLocal({questions:q,answers:[{questionId:'1',selectedIndex:0,timeSpentSeconds:30},{questionId:'2',selectedIndex:0,timeSpentSeconds:20}],topic:'Hàm số'});expect(r.score).toBe(50);expect(r.specificWeakness.length).toBeGreaterThan(0);});});
