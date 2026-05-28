/**
 * Profession-validity sweep.
 *
 *   npx tsx scripts/validate-professions.mjs
 *
 * For ~32 real professions, we hand-answer all 16 core questions AS THAT
 * PROFESSION WOULD, run the calculator, and print the result next to a
 * human-intuition expectation. Anything where the computed risk band is far
 * from intuition is flagged so we can judge whether the test is valid.
 *
 * Answer key (raw 1–5, the value a person in that job would pick):
 *   Q1  Digitalization     1 hands-on            5 all digital
 *   Q2  KnowledgeAccess    1 books<20%           5 books>90%
 *   Q3  TacitKnowledge     1 newbie+manual       5 years of "feel"
 *   Q4  Novelty            1 same daily          5 every task new
 *   Q5  Measurability      1 subjective          5 clear KPIs
 *   Q6  Convergence        1 everyone differs    5 identical output
 *   Q7  GoalClarity        1 clear specs         5 "help me think"
 *   Q8  TasteDependence    1 none                5 taste IS the work
 *   Q9  ErrorSeverity      1 just redo           5 lives at stake
 *   Q10 Reversibility      1 right first time    5 constant iteration
 *   Q11 Regulation         1 illegal for AI      5 no restrictions
 *   Q12 PublicTrust        1 nobody cares        5 unacceptable for AI
 *   Q13 Relationship       1 price-driven        5 only-want-YOU
 *   Q14 PersonalBrand      1 hard to replace     5 instantly replaceable
 *   Q15 PhysicalPresence   1 fully remote        5 must be on-site
 *   Q16 HumanPremium       1 don't care if AI    5 would feel deceived
 *
 * `expect` = the risk band a domain-aware human would intuitively assign
 * (one or more acceptable bands). Used only to flag, not to assert.
 */

import { calculateQuizResult } from '../lib/air_quiz_calculator.ts';

//                          Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16
const P = [
  // ── Expected HIGH / EXTREME-HIGH risk (rote, digital, objective) ──────────
  ['Data-entry clerk',        [5,5,1,1, 5,5,1,1, 1,4,5,1, 1,5,1,1], ['extreme-high']],
  ['Bookkeeper',              [5,5,2,1, 5,4,2,1, 2,4,4,2, 2,4,1,2], ['extreme-high','high']],
  ['Telemarketer / call-ctr', [5,4,2,2, 4,4,2,1, 1,4,4,1, 2,5,1,2], ['extreme-high','high']],
  ['Customer-service rep',    [4,4,2,2, 4,3,2,2, 2,4,4,2, 2,4,2,2], ['high','extreme-high']],
  ['Translator',              [5,4,3,3, 4,3,3,3, 2,4,5,2, 2,3,1,3], ['high','extreme-high']],
  ['Junior copywriter',       [5,4,3,3, 3,3,4,3, 1,5,5,2, 2,4,1,3], ['high']],
  ['Paralegal',               [5,4,3,2, 4,4,2,2, 3,3,3,3, 2,4,2,3], ['high','medium']],
  ['Financial analyst',       [5,4,3,3, 5,3,3,2, 3,4,4,2, 3,3,1,2], ['high','medium']],
  ['Bank teller',             [5,4,2,1, 5,5,2,1, 3,3,3,3, 2,4,4,2], ['high','medium']],

  // ── Expected MEDIUM (mixed) ──────────────────────────────────────────────
  ['Software engineer',       [5,4,4,4, 3,2,4,3, 3,4,5,2, 2,3,1,2], ['medium','high']],
  ['Data scientist',          [5,4,3,3, 5,3,4,2, 3,4,4,2, 2,3,1,2], ['medium','high']],
  ['Marketing manager',       [5,3,3,4, 3,2,4,4, 2,5,4,3, 3,3,2,3], ['medium']],
  ['Graphic designer',        [5,2,4,4, 2,2,4,5, 2,5,4,3, 3,3,2,3], ['medium','low']],
  ['Journalist',              [5,3,4,4, 3,2,4,4, 3,3,3,4, 3,3,2,4], ['medium','low']],
  ['Accountant (CPA)',        [5,4,3,2, 5,4,2,2, 4,3,2,4, 3,3,2,3], ['medium','low']],
  ['HR manager',              [5,3,4,3, 3,2,4,3, 3,3,3,4, 4,3,3,4], ['medium','low']],
  ['Project manager',         [5,3,4,4, 4,3,4,3, 3,4,4,3, 4,3,2,3], ['medium']],
  ['Real-estate agent',       [4,3,4,3, 3,2,3,3, 3,4,4,3, 4,3,4,4], ['medium','low']],
  ['Architect',               [5,3,4,4, 4,2,4,5, 4,3,3,4, 3,2,3,4], ['medium','low']],

  // ── Expected LOW / EXTREME-LOW (tacit, rigid, human, physical) ───────────
  ['Lawyer (litigator)',      [5,4,4,4, 3,3,3,3, 4,2,2,4, 4,2,3,4], ['low','medium']],
  ['Physician / surgeon',     [4,4,4,4, 3,3,3,3, 5,1,1,5, 4,2,5,5], ['extreme-low','low']],
  ['Nurse',                   [3,4,4,3, 3,3,2,2, 5,2,2,5, 3,3,5,4], ['extreme-low','low']],
  ['Therapist / counsellor',  [2,2,5,4, 1,1,5,5, 4,3,2,5, 5,2,4,5], ['extreme-low','low']],
  ['Elementary teacher',      [3,4,4,3, 3,3,3,3, 4,3,3,4, 4,3,4,4], ['low','medium']],
  ['Social worker',           [3,3,5,4, 2,2,4,4, 4,3,2,5, 4,2,4,5], ['extreme-low','low']],
  ['Police officer',          [2,3,4,4, 2,2,3,3, 5,2,2,5, 3,3,5,4], ['extreme-low','low']],
  ['Electrician / plumber',   [1,3,4,3, 3,3,2,2, 4,3,3,4, 3,3,5,2], ['low','extreme-low']],
  ['Chef',                    [1,3,5,3, 2,2,3,5, 2,4,4,3, 3,3,5,4], ['low','extreme-low']],
  ['Hairstylist',             [2,2,4,2, 2,2,3,4, 2,3,4,2, 5,3,5,4], ['low','extreme-low']],
  ['Truck driver',            [2,4,2,2, 4,4,2,1, 4,3,3,4, 2,4,5,3], ['medium','low']],
  ['Construction worker',     [1,3,3,2, 3,3,2,2, 4,3,3,3, 2,4,5,2], ['low','medium']],
  ['Executive / CEO',         [4,2,5,4, 2,2,5,4, 4,3,2,5, 5,2,3,5], ['extreme-low','low']],
  ['Surgeon-tier athlete/artist', [2,1,5,4, 1,1,5,5, 3,4,3,5, 5,1,4,5], ['extreme-low']],
];

const RISK_LEVEL_TO_BAND = {
  'critical': 'extreme-high', 'high': 'high', 'medium': 'medium', 'low': 'low', 'very-low': 'extreme-low',
};
const BAND_ORDER = ['extreme-low','low','medium','high','extreme-high'];
const RED='\x1b[31m', GREEN='\x1b[32m', YELLOW='\x1b[33m', DIM='\x1b[2m', RESET='\x1b[0m';

function pad(s,n){ s=String(s); return s.length>n ? s.slice(0,n-1)+'…' : s.padEnd(n); }

console.log();
console.log(pad('profession',26), 'code', 'prob', pad('dims (L/E/R/H)',26), pad('band',13), 'vs intuition');
console.log('─'.repeat(110));
let flags = 0;
for (const [label, ans, expect] of P) {
  const core = Object.fromEntries(ans.map((a,i)=>['Q'+(i+1), a]));
  const r = calculateQuizResult({ core, snapshot:{}, survey:{} }, null);
  const band = RISK_LEVEL_TO_BAND[r.riskLevel];
  const dims = r.dimensions.map(d=>d.rawAverage.toFixed(1)).join('/');
  // Flag if the computed band is >1 step away from the nearest expected band.
  const got = BAND_ORDER.indexOf(band);
  const dist = Math.min(...expect.map(e => Math.abs(got - BAND_ORDER.indexOf(e))));
  let verdict;
  if (dist === 0) verdict = `${GREEN}✓ ${expect.join('/')}${RESET}`;
  else if (dist === 1) verdict = `${YELLOW}~ off-by-1 (want ${expect.join('/')})${RESET}`;
  else { verdict = `${RED}✗ FAR (want ${expect.join('/')})${RESET}`; flags++; }
  console.log(pad(label,26), r.profileCode, pad(Math.round(r.replacementProbability)+'%',4), pad(dims,26), pad(band,13), verdict);
}
console.log();
console.log(`${flags === 0 ? GREEN : RED}${flags} profession(s) far from intuition.${RESET}`);
console.log();
