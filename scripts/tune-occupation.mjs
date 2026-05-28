/**
 * Occupation-guess tuning loop.
 *
 *   npx tsx scripts/tune-occupation.mjs
 *
 * For every occupation in the library we synthesise SEVERAL realistic test
 * scenarios — the anchor answer vector perturbed by deterministic ±1 jitter on
 * a handful of questions (simulating "a real person in this job who answers
 * roughly like the prototype but with personal variation"). We then run the
 * guesser and check whether the correct occupation comes back in the top-1 and
 * top-3.
 *
 * This is the feedback loop: run → read accuracy + the mis-guesses → adjust
 * the anchors / weights in lib/occupation_inference.ts → run again.
 *
 * Test scenarios are deliberately NOT the raw anchors (that would be circular),
 * but the discriminative questions are only lightly perturbed because a real
 * chef really does answer Q1=1 / Q15=5.
 */

import { OCCUPATION_PATTERNS, inferOccupationFromAnswers } from '../lib/occupation_inference.ts';

// Deterministic PRNG (mulberry32) so runs are reproducible.
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n) => Math.max(1, Math.min(5, Math.round(n)));

// Questions that are LOW-discrimination → jitter freely. High-discrimination
// questions (Q1, Q8, Q9, Q15 — indices 0,7,8,14) get gentler jitter so the
// scenario stays a realistic member of the occupation.
const SOFT_Q = [1, 3, 5, 6, 9, 10, 11, 13, 15]; // 0-based indices of softer questions
function scenario(anchor, rand, jitterCount = 5) {
  const a = anchor.slice();
  // jitter `jitterCount` soft questions by ±1
  const idxs = [...SOFT_Q].sort(() => rand() - 0.5).slice(0, jitterCount);
  for (const i of idxs) a[i] = clamp(a[i] + (rand() < 0.5 ? -1 : 1));
  // small chance to nudge ONE hard question by ±1 (real people aren't textbook)
  if (rand() < 0.4) {
    const hard = [0, 7, 8, 14][Math.floor(rand() * 4)];
    a[hard] = clamp(a[hard] + (rand() < 0.5 ? -1 : 1));
  }
  return a;
}

const SCENARIOS_PER_JOB = 4;
const TOPK = 3;

const RED='\x1b[31m', GREEN='\x1b[32m', YELLOW='\x1b[33m', DIM='\x1b[2m', RESET='\x1b[0m';
function pad(s,n){ s=String(s); return s.length>n ? s.slice(0,n-1)+'…' : s.padEnd(n); }

const rand = rng(12345);
let top1 = 0, top3 = 0, total = 0;
const failures = [];
const perJob = [];

for (const occ of OCCUPATION_PATTERNS) {
  let j1 = 0, j3 = 0;
  for (let s = 0; s < SCENARIOS_PER_JOB; s++) {
    const ans = scenario(occ.answers, rand);
    const guesses = inferOccupationFromAnswers(ans, TOPK);
    const ids = guesses.map(g => g.id);
    const isTop1 = ids[0] === occ.id;
    const isTop3 = ids.includes(occ.id);
    if (isTop1) { j1++; top1++; }
    if (isTop3) { j3++; top3++; }
    else failures.push({ id: occ.id, ans, got: guesses.map(g => `${g.id}(${g.confidence}%)`) });
    total++;
  }
  perJob.push({ id: occ.id, j1, j3 });
}

console.log();
console.log(`${'OCCUPATION-GUESS ACCURACY'} — ${OCCUPATION_PATTERNS.length} jobs × ${SCENARIOS_PER_JOB} scenarios = ${total} tests`);
console.log('─'.repeat(70));
console.log(`  top-1 (exact): ${top1}/${total}  ${(100*top1/total).toFixed(1)}%`);
console.log(`  top-3:         ${top3}/${total}  ${(100*top3/total).toFixed(1)}%`);
console.log();

// Per-job summary, worst first
perJob.sort((a,b) => (a.j3 - b.j3) || (a.j1 - b.j1));
console.log('  weakest jobs (top3 hit / ' + SCENARIOS_PER_JOB + '):');
for (const p of perJob.slice(0, 12)) {
  const col = p.j3 === SCENARIOS_PER_JOB ? GREEN : p.j3 >= SCENARIOS_PER_JOB-1 ? YELLOW : RED;
  console.log(`    ${col}${pad(p.id,24)} top1=${p.j1} top3=${p.j3}${RESET}`);
}

if (failures.length) {
  console.log();
  console.log(`  ${RED}top-3 MISSES (${failures.length}):${RESET}`);
  for (const f of failures.slice(0, 20)) {
    console.log(`    ${pad(f.id,22)} guessed: ${f.got.join(', ')}`);
    console.log(`    ${DIM}      answers: ${f.ans.join(',')}${RESET}`);
  }
}
console.log();
