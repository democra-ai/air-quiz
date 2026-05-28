/**
 * Validation for the SUPPLEMENTARY occupations (the ~64 common jobs added beyond
 * the 96 PROFILE_CAREERS set). Each is probed with a deterministic ±1 perturbation
 * of its anchor on the soft/subjective questions (a slightly different respondent),
 * and a guess counts as correct if the top-K contains the job itself or any title
 * matching its `near` acceptance regex.
 *
 *   npx tsx scripts/validate-supplementary.mjs
 */

import { inferOccupationFromAnswers } from '../lib/occupation_inference.ts';
import { SUPPLEMENTARY_OCCUPATIONS } from './realistic-answers.mjs';

const clamp = (n) => Math.max(1, Math.min(5, n));
const SOFT = [2, 3, 5, 6, 9, 10, 12, 13, 15]; // 0-based soft question indices
// deterministic, seed-stable perturbation so runs are reproducible
function respondent(anchor, seed) {
  const a = anchor.slice();
  let s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const picks = [...SOFT].sort(() => rnd() - 0.5).slice(0, 4);
  for (const i of picks) a[i] = clamp(a[i] + (rnd() < 0.5 ? -1 : 1));
  return a;
}

const G='\x1b[32m',R='\x1b[31m',D='\x1b[2m',X='\x1b[0m';
const pad=(s,n)=>{s=String(s);return s.length>n?s.slice(0,n-1)+'…':s.padEnd(n);};

let top1=0, top3=0, total=0;
const misses=[];
for (let k = 0; k < SUPPLEMENTARY_OCCUPATIONS.length; k++) {
  const occ = SUPPLEMENTARY_OCCUPATIONS[k];
  const accept = (t) => occ.near.test(t);
  const ans = respondent(occ.answers, k * 2654435761 + 7);
  const g = inferOccupationFromAnswers(ans, 3);
  const titles = g.map(x => x.title.en);
  const ok1 = accept(titles[0]);
  const ok3 = titles.some(accept);
  if (ok1) top1++;
  if (ok3) top3++; else misses.push({ en: occ.en, got: titles });
  total++;
}

console.log();
console.log(`SUPPLEMENTARY GUESS — ${total} added occupations, perturbed respondents`);
console.log(`accuracy = own job or an acceptable cousin (near-regex) in top-K`);
console.log('─'.repeat(72));
console.log(`  top-1: ${top1}/${total}  ${(100*top1/total).toFixed(1)}%`);
console.log(`  top-3: ${top3}/${total}  ${(100*top3/total).toFixed(1)}%`);
if (misses.length) {
  console.log();
  console.log(`${R}TOP-3 MISSES (${misses.length}):${X}`);
  for (const m of misses) console.log(`  ${pad(m.en,46)} → ${m.got.map(t=>pad(t,22)).join(', ')}`);
}
console.log();
