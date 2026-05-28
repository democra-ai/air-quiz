/**
 * INDEPENDENT, OCCUPATION-LEVEL validation of the guesser against the 96-job
 * BLS library. Each scenario is a hand-written realistic answer vector authored
 * WITHOUT looking at the anchors, plus an `accept` regex listing which guessed
 * occupation titles count as correct (the true job + genuine siblings — jobs a
 * real worker would nod at seeing).
 *
 *   npx tsx scripts/validate-bls-independent.mjs
 *
 * This measures what the user actually cares about ("看看是不是有自己" — is my own
 * job, or a close cousin, in the guess?), NOT whether a hand-guessed archetype
 * label matches. Failures here mean the realistic anchors are mis-placed —
 * tune scripts/realistic-answers.mjs and regenerate.
 */

import { inferOccupationFromAnswers } from '../lib/occupation_inference.ts';
import { BLS_OCCUPATIONS } from '../lib/occupation_anchors.generated.ts';

const archOf = Object.fromEntries(BLS_OCCUPATIONS.map(o => [o.id, o.archetype]));

// [label, 16 answers, accept-regex over guessed occupation TITLES]
//                          Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16
const T = [
  ['Software developer',    [5,4,4,4, 3,2,4,3, 3,4,5,2, 2,3,1,2], /software|systems analyst|systems admin|data scien|user support/i],
  ['Data scientist',        [5,4,3,3, 5,4,3,2, 3,4,4,2, 2,3,1,2], /data scien|software|systems analyst|market research|statistic/i],
  ['IT support',            [5,4,2,2, 4,4,3,2, 2,4,4,2, 3,4,1,2], /user support|software|systems admin|network|clerk/i],
  ['Accountant',            [5,4,3,2, 5,4,2,2, 4,3,2,4, 3,3,2,3], /accountant|auditor|bookkeep|financial|budget/i],
  ['Financial analyst',     [5,4,3,3, 5,3,3,2, 3,4,4,2, 3,3,1,2], /financial|market research|management analyst|business operation|accountant|auditor/i],
  ['Bookkeeper',            [5,5,2,1, 5,4,2,1, 2,4,4,2, 2,4,1,2], /bookkeep|accountant|auditor|clerk|payroll/i],
  ['Data-entry clerk',      [5,5,1,1, 5,5,1,1, 1,4,5,1, 1,5,1,1], /clerk|bookkeep|data|secretar|administrative assistant/i],
  ['Secretary',             [5,4,2,2, 4,4,2,1, 1,4,4,2, 2,5,2,2], /secretar|administrative assistant|receptionist|clerk/i],
  ['Customer service',      [4,4,2,2, 4,3,2,2, 2,4,4,2, 2,4,2,2], /customer service|receptionist|counter|clerk|rental/i],
  ['Cashier / retail',      [3,4,2,2, 4,4,2,1, 2,4,4,2, 2,5,4,2], /cashier|retail|counter|rental|sales|stocker/i],
  ['Sales rep',             [4,3,4,4, 3,2,4,3, 2,4,3,3, 4,3,3,4], /sales|retail|insurance|counter|rental/i],
  ['Marketing specialist',  [5,3,3,3, 3,2,4,4, 2,5,4,3, 3,3,2,3], /market research|marketing|public relations|business operation|editor/i],
  ['Lawyer',                [5,4,4,4, 3,3,3,3, 4,2,2,4, 4,2,3,4], /lawyer|paralegal|legal|judge|magistrate|arbitrat|judicial/i],
  ['Paralegal',             [5,4,3,2, 4,4,2,2, 3,3,3,3, 2,4,2,3], /paralegal|legal|lawyer|judicial|clerk/i],
  ['Judge',                 [4,4,4,3, 3,3,2,3, 5,2,1,5, 4,2,3,5], /judge|magistrate|arbitrat|lawyer|legal|judicial/i],
  ['Physician',             [4,4,4,4, 3,3,3,3, 5,1,1,5, 4,2,5,5], /nurse practitioner|medical scientist|registered nurse|physician|medical/i],
  ['Registered nurse',      [3,4,4,3, 3,3,2,2, 5,2,2,5, 3,3,5,4], /registered nurse|nurse|licensed practical|nursing assistant|medical assistant/i],
  ['Pharmacist',            [4,5,3,2, 5,5,2,1, 5,2,1,5, 2,4,4,3], /pharmacy|nurse|medical|inspector|technician/i],
  ['Therapist',             [2,2,5,4, 1,1,5,5, 4,3,2,5, 5,2,4,5], /social worker|self-enrichment|nurse|counsel|therap/i],
  ['Social worker',         [3,3,5,4, 2,2,4,4, 4,3,2,5, 4,2,4,5], /social worker|teacher|nurse|childcare|counsel/i],
  ['Elementary teacher',    [3,4,4,3, 3,3,3,3, 4,3,3,4, 4,3,4,4], /elementary|teacher|preschool|childcare|postsecondary/i],
  ['Professor',             [4,3,5,4, 2,2,4,4, 3,3,3,4, 4,2,3,4], /teacher|postsecondary|professor|self-enrichment|scientist/i],
  ['Graphic designer',      [5,2,4,4, 2,2,4,5, 2,5,4,3, 3,3,2,3], /graphic|designer|interior|editor|producer|public relations/i],
  ['Writer / editor',       [5,2,5,4, 2,1,5,5, 2,5,4,3, 3,3,1,4], /editor|writer|interpret|public relations|graphic|producer/i],
  ['Journalist',            [5,3,4,4, 3,2,4,4, 3,3,3,4, 3,3,2,4], /editor|public relations|interpret|writer|producer|market research/i],
  ['Architect',             [5,3,4,4, 4,2,4,5, 4,3,3,4, 3,2,3,4], /architect|engineer|designer/i],
  ['Mechanical engineer',   [5,4,4,3, 4,3,3,3, 4,3,3,3, 2,3,2,3], /mechanical|engineer|machinist/i],
  ['Civil engineer',        [5,4,4,3, 4,3,3,3, 4,2,3,4, 3,2,3,3], /civil|engineer|architect/i],
  ['Research scientist',    [5,3,5,5, 3,2,5,3, 3,4,4,3, 3,2,2,3], /scientist|engineer|research|medical scientist/i],
  ['Electrician',           [1,3,4,3, 3,3,2,2, 4,3,3,4, 3,3,5,2], /electrician|plumber|carpenter|construction|maintenance|operating engineer|pipefitter/i],
  ['Plumber',               [1,3,4,3, 3,3,2,2, 4,4,3,3, 3,3,5,2], /plumber|pipefitter|electrician|carpenter|construction|maintenance/i],
  ['Carpenter',             [1,3,4,3, 3,3,2,3, 3,4,3,3, 3,3,5,3], /carpenter|construction|plumber|electrician|maintenance|operating engineer/i],
  ['Machinist',             [2,4,3,2, 5,4,2,2, 4,3,3,3, 2,4,5,2], /machinist|welder|inspector|operator|production|operating engineer/i],
  ['Welder',                [1,3,4,2, 4,4,2,2, 4,3,3,3, 2,4,5,2], /welder|machinist|inspector|construction|operator|production|carpenter/i],
  ['Truck driver',          [2,4,2,2, 4,4,2,1, 4,4,3,3, 2,4,5,3], /truck driver|laborer|stocker|operating engineer|material mover|tractor/i],
  ['Warehouse / laborer',   [2,4,2,2, 4,4,2,1, 3,4,4,2, 2,5,5,2], /laborer|stocker|material mover|janitor|order filler|packaging|freight/i],
  ['Chef / cook',           [1,3,5,3, 2,2,3,5, 2,4,4,3, 3,3,5,4], /cook|chef|food prep|baker|food preparation|supervisors of food/i],
  ['Waiter / server',       [2,4,2,2, 3,3,2,2, 2,4,4,2, 3,4,5,3], /waiter|waitress|fast food|counter|food|server|bartender/i],
  ['Bartender',             [2,3,4,3, 2,2,3,4, 2,4,4,3, 4,3,5,4], /bartender|waiter|fast food|food|server|recreation/i],
  ['Hairstylist',           [2,2,4,2, 2,2,3,4, 2,3,4,2, 5,3,5,4], /hairdress|hairstyl|cosmetolog|manicur|personal|recreation/i],
  ['Fitness trainer',       [3,3,4,3, 3,2,3,3, 3,4,4,3, 4,3,5,4], /exercise trainer|fitness|recreation|amusement|self-enrichment|animal/i],
  ['Childcare worker',      [2,3,4,3, 2,2,3,3, 4,3,3,4, 4,3,5,4], /childcare|preschool|teacher|nursing assistant|animal caretaker|recreation/i],
  ['Police officer',        [2,3,4,4, 2,2,3,3, 5,2,2,5, 3,3,5,4], /police|sheriff|patrol|detective|correctional|security|firefighter/i],
  ['Firefighter',           [2,3,4,4, 2,2,3,3, 5,2,2,5, 3,3,5,4], /firefighter|police|patrol|correctional|security|sheriff/i],
  ['Security guard',        [2,4,2,3, 3,3,2,2, 4,3,3,4, 2,4,5,3], /security|guard|correctional|police|patrol|janitor/i],
  ['CEO',                   [4,2,5,4, 2,2,5,4, 4,3,2,5, 5,2,3,5], /general and operations|operations manager|chief|sales manager|financial manager|manager/i],
  ['Operations manager',    [5,3,4,3, 4,3,4,3, 4,3,3,4, 4,3,3,4], /operations manager|general and operations|manager/i],
  ['Financial manager',     [5,4,4,3, 5,3,4,2, 4,2,2,4, 4,3,2,4], /financial manager|manager|accountant|auditor/i],
  ['HR manager',            [5,3,4,3, 3,2,4,3, 3,3,3,4, 4,3,3,4], /human resources|manager|business operation/i],
  ['Project manager',       [5,3,4,4, 4,3,4,3, 3,4,4,3, 4,3,2,3], /project management|manager|business operation|management analyst/i],
];

const G='\x1b[32m',R='\x1b[31m',D='\x1b[2m',X='\x1b[0m';
const pad=(s,n)=>{s=String(s);return s.length>n?s.slice(0,n-1)+'…':s.padEnd(n);};

let top1=0, top3=0, total=0;
const misses=[];
console.log();
console.log(pad('preset (independent answers)',26), 'top-3 guess (occupation · [family])');
console.log('─'.repeat(104));
for (const [label, ans, accept] of T) {
  const g = inferOccupationFromAnswers(ans, 3);
  const titles = g.map(x => x.title.en);
  const ok1 = accept.test(titles[0]);
  const ok3 = titles.some(t => accept.test(t));
  if (ok1) top1++;
  if (ok3) top3++; else misses.push({ label, got: titles });
  total++;
  const col = ok1 ? G : (ok3 ? '\x1b[33m' : R);
  console.log(pad(label,26), `${col}${g.map(x=>pad(x.title.en,24)+D+'['+archOf[x.id]+']'+X+col).join(' · ')}${X}`);
}
console.log();
console.log(`occupation top-1 (right job/sibling is #1):     ${top1}/${total}  ${(100*top1/total).toFixed(1)}%`);
console.log(`occupation top-3 (right job/sibling in top-3):  ${top3}/${total}  ${(100*top3/total).toFixed(1)}%`);
if (misses.length){
  console.log();
  console.log(`${R}TOP-3 MISSES (no acceptable occupation in top-3):${X}`);
  for (const m of misses) console.log(`  ${pad(m.label,22)} → ${m.got.join(', ')}`);
}
console.log();
