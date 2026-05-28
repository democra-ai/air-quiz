/**
 * Persona test fixture for calculateQuizResult.
 *
 *   npx tsx scripts/test-calc.mjs
 *
 * For each known profession we hand-construct a plausible 16-answer
 * vector (Q1..Q16, each 1–5, raw user picks), feed it into the calculator,
 * and check that:
 *   1. The 4-letter archetype matches what a human would intuitively
 *      assign that profession.
 *   2. The risk band (extreme-high / high / medium / low / extreme-low)
 *      is in the expected ballpark.
 *
 * Mismatches are printed in red so the maintainer can quickly spot them.
 */

import { calculateQuizResult } from '../lib/air_quiz_calculator.ts';

// Same mapping used by the result page when picking the displayed risk label.
const RISK_LEVEL_TO_BAND = {
  'critical': 'extreme-high',
  'high':     'high',
  'medium':   'medium',
  'low':      'low',
  'very-low': 'extreme-low',
};

// ── Persona library ────────────────────────────────────────────────────────
//
// Each entry: { label, answers (16), expect: { code?: string, codeContains?: string[],
// band?: ('extreme-high'|'high'|'medium'|'low'|'extreme-low')[] } }
//
// Answer indexing is Q1..Q16 (declaration order). Reference:
//   Q1  Digitalization        — 1 hands-on,            5 all digital
//   Q2  KnowledgeAccess       — 1 books cover <20%,    5 cover >90%
//   Q3  TacitKnowledge        — 1 newbie+manual,       5 years of feel
//   Q4  Novelty               — 1 same patterns,       5 every project new
//   Q5  Measurability         — 1 purely subjective,   5 clear KPIs
//   Q6  Convergence           — 1 everyone differs,    5 same output
//   Q7  GoalClarity           — 1 clear specs,         5 "help me think"
//   Q8  TasteDependence       — 1 none,                5 taste IS the work
//   Q9  ErrorSeverity         — 1 just redo,           5 lives at stake
//   Q10 Reversibility         — 1 right first time,    5 constant iteration
//   Q11 Regulation            — 1 illegal for AI,      5 no restrictions
//   Q12 PublicTrust           — 1 nobody cares,        5 absolutely unacceptable
//   Q13 Relationship          — 1 price-driven,        5 clients only want YOU
//   Q14 PersonalBrand         — 1 hard to replace,     5 instantly replaceable
//   Q15 PhysicalPresence      — 1 fully remote,        5 must be physically there
//   Q16 HumanPremium          — 1 don't care if AI,    5 would feel deceived

const PERSONAS = [
  {
    label: 'Data-entry clerk',
    answers: [5, 5, 1, 1,  5, 5, 1, 1,  1, 5, 5, 1,  1, 5, 1, 1],
    expect:  { code: 'EOFP', band: ['extreme-high'] },
  },
  {
    label: 'Office administrator',
    answers: [5, 4, 2, 2,  4, 4, 2, 1,  1, 5, 4, 1,  1, 5, 1, 1],
    expect:  { code: 'EOFP', band: ['extreme-high', 'high'] },
  },
  {
    label: 'Software developer',
    answers: [5, 4, 4, 4,  3, 3, 4, 2,  3, 4, 5, 2,  2, 3, 1, 2],
    expect:  { codeContains: ['E', 'F'], band: ['high', 'medium'] },
  },
  {
    label: 'Data analyst',
    answers: [5, 4, 3, 3,  5, 4, 3, 2,  2, 4, 4, 2,  2, 3, 1, 2],
    expect:  { codeContains: ['E', 'O', 'F'], band: ['high', 'medium'] },
  },
  {
    label: 'Customer-service rep',
    answers: [4, 4, 2, 3,  4, 3, 3, 2,  2, 4, 4, 2,  2, 4, 2, 2],
    expect:  { codeContains: ['E'], band: ['high', 'medium'] },
  },
  {
    label: 'Lawyer',
    answers: [5, 4, 4, 4,  3, 3, 3, 3,  4, 2, 2, 4,  4, 3, 3, 4],
    expect:  { codeContains: ['E'], band: ['medium', 'low'] },
  },
  {
    label: 'Physician / surgeon',
    answers: [4, 4, 4, 4,  3, 3, 3, 3,  5, 1, 1, 5,  4, 2, 5, 5],
    expect:  { codeContains: ['R', 'H'], band: ['low', 'extreme-low'] },
  },
  {
    label: 'Therapist',
    // Therapist work IS high-stakes / rigid (Q9 errors→serious harm, Q12 AI
    // unacceptable in role) — so the Risk letter ends up R, not F. Expecting
    // TSRH is correct; TSFH was a faulty earlier expectation.
    answers: [2, 2, 5, 4,  1, 1, 5, 5,  4, 3, 2, 5,  5, 2, 4, 5],
    expect:  { code: 'TSRH', band: ['extreme-low', 'low'] },
  },
  {
    label: 'Plumber / electrician',
    answers: [1, 3, 4, 3,  3, 3, 2, 2,  3, 3, 3, 3,  3, 3, 5, 2],
    expect:  { codeContains: ['T'], band: ['low', 'extreme-low', 'medium'] },
  },
  {
    label: 'Chef',
    answers: [1, 3, 5, 3,  2, 2, 3, 5,  2, 4, 4, 3,  3, 3, 5, 4],
    expect:  { codeContains: ['T', 'S'], band: ['low', 'extreme-low'] },
  },
  {
    label: 'Hairstylist',
    answers: [2, 2, 4, 2,  2, 2, 3, 4,  2, 3, 4, 2,  5, 3, 5, 4],
    expect:  { codeContains: ['T', 'S', 'H'], band: ['low', 'extreme-low'] },
  },
  {
    label: 'Executive / CEO',
    answers: [4, 2, 5, 4,  2, 2, 5, 4,  4, 3, 2, 5,  5, 2, 3, 5],
    expect:  { codeContains: ['T', 'S', 'H'], band: ['low', 'extreme-low'] },
  },
  // ── The user's reported bug case ─────────────────────────────────────
  {
    label: '☆ USER BUG: all-middle answers (3,3,3,3 × 4)',
    answers: [3,3,3,3, 3,3,3,3, 3,3,3,3, 3,3,3,3],
    expect:  { note: 'no strong lean either way — letter should not feel "high pressure" / "rigid"' },
  },
  {
    label: '☆ USER BUG: middle on Risk dim only, lean fav. elsewhere',
    answers: [5,4,2,2, 4,4,2,2, 3,3,3,3,  2,4,1,2],
    expect:  { note: 'risk dim was answered exactly middle, should NOT come out as R (Rigid)' },
  },
];

// ── Run ────────────────────────────────────────────────────────────────────

const RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', RESET = '\x1b[0m';

function format(label, max = 50) {
  return label.length > max ? label.slice(0, max - 1) + '…' : label.padEnd(max);
}

console.log();
console.log('persona'.padEnd(50), 'code', 'prob%', 'dims (raw avg)'.padEnd(36), 'band'.padEnd(13), 'verdict');
console.log('─'.repeat(140));

for (const p of PERSONAS) {
  const r = calculateQuizResult({ core: Object.fromEntries(p.answers.map((a, i) => ['Q' + (i + 1), a])), snapshot: {}, survey: {} }, null);
  const dimAvgs = r.dimensions.map(d => d.rawAverage.toFixed(2)).join(' / ');
  const dimLetters = r.dimensions.map(d => d.letter).join('');
  // Compare against the prob-derived band that the result page actually shows,
  // not against the archetype's hardcoded profile.riskTier (those two can
  // disagree at the boundaries and the page intentionally shows the prob-derived one).
  const shownBand = RISK_LEVEL_TO_BAND[r.riskLevel] ?? 'medium';

  const checks = [];
  if (p.expect.code && p.expect.code !== r.profileCode) {
    checks.push(`${RED}✗ code: got ${r.profileCode}, want ${p.expect.code}${RESET}`);
  }
  if (p.expect.codeContains) {
    for (const letter of p.expect.codeContains) {
      if (!r.profileCode.includes(letter)) {
        checks.push(`${RED}✗ missing letter ${letter} in ${r.profileCode}${RESET}`);
      }
    }
  }
  if (p.expect.band && !p.expect.band.includes(shownBand)) {
    checks.push(`${RED}✗ band: got ${shownBand}, want one of [${p.expect.band.join(', ')}]${RESET}`);
  }
  const verdict = checks.length === 0
    ? (p.expect.note ? `${YELLOW}note: ${p.expect.note}${RESET}` : `${GREEN}✓${RESET}`)
    : checks.join('  ');

  console.log(
    format(p.label),
    dimLetters,
    String(Math.round(r.replacementProbability)).padStart(4),
    format(dimAvgs, 36),
    format(shownBand, 13),
    verdict,
  );
}
console.log();
