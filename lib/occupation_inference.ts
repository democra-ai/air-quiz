/**
 * Per-answer occupation inference (v2 — 16-question vector).
 *
 * v1 averaged answers into 4 dimensions before comparing. That worked for the
 * archetype letter but failed for fine-grained job matching, because two
 * jobs can land on similar dimension averages via totally different routes
 * (e.g. office worker and chef can both score "medium" on Learnability — one
 * because the work is half-tacit, the other because it's half-digital).
 * Real users immediately spotted the failure: someone who picked "all
 * digital" + "fully remote" was still being told Chef was a match.
 *
 * v2 compares the user's raw 16 answers (Q1…Q16, each 1–5) to a profession's
 * expected answer vector. Hard discriminators like Q1 (Digitalization) and
 * Q15 (PhysicalPresence) now contribute their full weight to the distance,
 * so chef and software-developer end up on opposite sides of the space.
 *
 * Pattern format: array of 16 expected raw answers in canonical Q1..Q16
 * order (the order ALL_CORE_QUESTIONS exposes — dimension-grouped:
 * Q1–Q4 learnability, Q5–Q8 evaluation, Q9–Q12 risk, Q13–Q16 human).
 *
 * Anchors are hand-placed, not measured — treat as suggestive.
 */

export interface OccupationPattern {
  id: string;
  title: { en: string; zh: string; ja?: string; ko?: string; de?: string };
  socGroup: number;
  /**
   * Expected user answer (1–5, raw) for each of Q1..Q16, in declaration
   * order. Length MUST be 16.
   */
  answers: number[];
}

/**
 * Question reference (for the maintainer reading this file):
 *
 *   Q1  Digitalization        — 1 hands-on, 5 all digital
 *   Q2  KnowledgeAccess       — 1 books cover <20%, 5 cover >90%
 *   Q3  TacitKnowledge        — 1 newbie+manual, 5 years of "feel"
 *   Q4  Novelty               — 1 same patterns, 5 every project new
 *   Q5  Measurability         — 1 purely subjective, 5 clear KPIs
 *   Q6  Convergence           — 1 everyone differs, 5 same output
 *   Q7  GoalClarity           — 1 clear specs, 5 "help me think"
 *   Q8  TasteDependence       — 1 none, 5 taste IS the work
 *   Q9  ErrorSeverity         — 1 just redo, 5 lives at stake
 *   Q10 Reversibility         — 1 must be right first time, 5 constant iteration
 *   Q11 Regulation            — 1 illegal for AI, 5 no restrictions
 *   Q12 PublicTrust           — 1 nobody cares, 5 absolutely unacceptable
 *   Q13 Relationship          — 1 price-driven, 5 clients only want YOU
 *   Q14 PersonalBrand         — 1 hard to replace, 5 instantly replaceable
 *   Q15 PhysicalPresence      — 1 fully remote, 5 must be physically there
 *   Q16 HumanPremium          — 1 don't care if AI, 5 would feel deceived
 */

export const OCCUPATION_PATTERNS: OccupationPattern[] = [
  // ── Office / admin / data-entry ─────────────────────────────────────────
  { id: 'office-admin', title: { en: 'Office administrator',  zh: '行政文员',     ja: '事務員',          ko: '사무직 관리자',  de: 'Bürokraft' },                socGroup: 43,
    answers: [5, 4, 2, 2,  4, 4, 2, 1,  1, 5, 4, 1,  1, 5, 1, 1] },
  { id: 'data-entry',   title: { en: 'Data-entry clerk',      zh: '数据录入员',   ja: 'データ入力',      ko: '데이터 입력원',  de: 'Datenerfasser:in' },          socGroup: 43,
    answers: [5, 5, 1, 1,  5, 5, 1, 1,  1, 5, 5, 1,  1, 5, 1, 1] },
  { id: 'customer-service', title: { en: 'Customer service rep', zh: '客服专员', ja: 'カスタマーサポート', ko: '고객 서비스 담당', de: 'Kundenservice' },         socGroup: 43,
    answers: [4, 4, 2, 3,  4, 3, 3, 2,  2, 4, 4, 2,  2, 4, 2, 2] },

  // ── Tech & analyst ──────────────────────────────────────────────────────
  { id: 'software-engineer', title: { en: 'Software developer', zh: '软件开发者',  ja: 'ソフトウェア開発者', ko: '소프트웨어 개발자', de: 'Softwareentwickler:in' }, socGroup: 15,
    answers: [5, 4, 4, 4,  3, 3, 4, 2,  3, 4, 5, 2,  2, 3, 1, 2] },
  { id: 'data-analyst',  title: { en: 'Data analyst',          zh: '数据分析师',   ja: 'データアナリスト',   ko: '데이터 분석가',  de: 'Datenanalyst:in' },          socGroup: 15,
    answers: [5, 4, 3, 3,  5, 4, 3, 2,  2, 4, 4, 2,  2, 3, 1, 2] },

  // ── Sales / marketing ───────────────────────────────────────────────────
  { id: 'sales-rep',     title: { en: 'Sales representative',  zh: '销售代表',     ja: '営業',             ko: '영업 사원',      de: 'Vertriebsmitarbeiter:in' },   socGroup: 41,
    answers: [4, 3, 4, 4,  3, 2, 4, 3,  2, 4, 3, 3,  4, 3, 3, 4] },
  { id: 'marketing',     title: { en: 'Marketing manager',     zh: '市场营销',     ja: 'マーケティング',     ko: '마케팅 매니저',  de: 'Marketing-Manager:in' },      socGroup: 11,
    answers: [5, 3, 3, 4,  3, 2, 4, 4,  2, 5, 4, 3,  2, 3, 2, 3] },

  // ── Knowledge professions ──────────────────────────────────────────────
  { id: 'lawyer',        title: { en: 'Lawyer',                zh: '律师',         ja: '弁護士',           ko: '변호사',         de: 'Anwält:in' },                socGroup: 23,
    answers: [5, 4, 4, 4,  3, 3, 3, 3,  4, 2, 2, 4,  4, 3, 3, 4] },
  { id: 'accountant',    title: { en: 'Accountant',            zh: '会计',         ja: '会計士',           ko: '회계사',         de: 'Buchhalter:in' },             socGroup: 13,
    answers: [5, 4, 3, 2,  5, 4, 2, 2,  3, 3, 3, 3,  3, 4, 2, 3] },
  { id: 'executive',     title: { en: 'Executive / manager',   zh: '管理者/高管',   ja: '経営者',           ko: '경영진',         de: 'Geschäftsführer:in' },        socGroup: 11,
    answers: [4, 2, 5, 4,  2, 2, 5, 4,  4, 3, 2, 5,  5, 2, 3, 5] },

  // ── Healthcare ──────────────────────────────────────────────────────────
  { id: 'physician',     title: { en: 'Physician / surgeon',   zh: '医生/外科医生', ja: '医師/外科医',     ko: '의사/외과의',    de: 'Ärzt:in / Chirurg:in' },     socGroup: 29,
    answers: [4, 4, 4, 4,  3, 3, 3, 3,  5, 1, 1, 5,  4, 2, 5, 5] },
  { id: 'nurse',         title: { en: 'Nurse',                 zh: '护士',         ja: '看護師',           ko: '간호사',         de: 'Pflegekraft' },               socGroup: 29,
    answers: [3, 4, 4, 3,  3, 3, 2, 2,  5, 2, 2, 5,  3, 3, 5, 4] },
  { id: 'therapist',     title: { en: 'Therapist / counsellor', zh: '心理咨询师',  ja: 'カウンセラー',     ko: '상담사',         de: 'Therapeut:in' },              socGroup: 21,
    answers: [2, 2, 5, 4,  1, 1, 5, 5,  4, 3, 2, 5,  5, 2, 4, 5] },

  // ── Trades & physical ──────────────────────────────────────────────────
  { id: 'tradesperson',  title: { en: 'Electrician / plumber', zh: '电工/管道工',   ja: '電気・配管工',    ko: '전기·배관공',    de: 'Elektriker:in / Klempner:in' }, socGroup: 47,
    answers: [1, 3, 4, 3,  3, 3, 2, 2,  3, 3, 3, 3,  3, 3, 5, 2] },
  { id: 'driver',        title: { en: 'Driver / operator',     zh: '司机/操作员',   ja: '運転手/オペレーター', ko: '운전사/운영자', de: 'Fahrer:in / Bediener:in' },  socGroup: 53,
    answers: [2, 4, 2, 2,  4, 4, 2, 1,  4, 3, 3, 4,  2, 4, 5, 3] },
  { id: 'chef',          title: { en: 'Chef / cook',           zh: '厨师',         ja: 'シェフ/調理師',    ko: '셰프/요리사',    de: 'Koch / Köchin' },            socGroup: 35,
    answers: [1, 3, 5, 3,  2, 2, 3, 5,  2, 4, 4, 3,  3, 3, 5, 4] },

  // ── Creative / personal service ────────────────────────────────────────
  { id: 'designer',      title: { en: 'Designer / art director', zh: '设计师/艺术总监', ja: 'デザイナー',  ko: '디자이너',       de: 'Designer:in' },              socGroup: 27,
    answers: [5, 2, 4, 4,  2, 2, 4, 5,  2, 5, 4, 3,  3, 3, 2, 3] },
  { id: 'stylist',       title: { en: 'Hairstylist / makeup artist', zh: '发型师/化妆师', ja: 'ヘアスタイリスト', ko: '헤어스타일리스트', de: 'Friseur:in / Visagist:in' }, socGroup: 39,
    answers: [2, 2, 4, 2,  2, 2, 3, 4,  2, 3, 4, 2,  5, 3, 5, 4] },
  { id: 'teacher',       title: { en: 'Teacher / instructor',  zh: '教师/讲师',    ja: '教師',             ko: '교사',           de: 'Lehrer:in' },                 socGroup: 25,
    answers: [4, 4, 3, 3,  3, 3, 3, 3,  3, 3, 3, 4,  4, 3, 4, 4] },
  { id: 'artist',        title: { en: 'Artist / performer',    zh: '艺术家/表演者', ja: 'アーティスト',     ko: '아티스트',       de: 'Künstler:in' },              socGroup: 27,
    answers: [2, 1, 5, 4,  1, 1, 5, 5,  1, 5, 5, 4,  5, 1, 3, 5] },
];

export interface OccupationGuess extends OccupationPattern {
  /** Euclidean distance to the user's 16-answer vector. */
  distance: number;
  /** 0..100, monotonic with distance. Higher = better match. */
  confidence: number;
}

/**
 * Maximum possible Euclidean distance in [1,5]^16 is sqrt(16 * 16) = 16,
 * since each axis can differ by at most 4. We map [0, 16] → [100, 0]
 * with a slight bend so realistic matches (d~3) read as ~80% rather than ~80%.
 */
function distanceToConfidence(d: number): number {
  // Plain linear: 0 distance = 100%, max distance (16) = 0%.
  // Apply a soft curve so a small distance still feels "very close".
  const norm = Math.max(0, Math.min(1, d / 16));
  const curved = 1 - Math.pow(norm, 0.75);   // gentle bend toward higher scores
  return Math.round(curved * 100);
}

/**
 * Return the top-K occupations whose 16-answer pattern is closest to the
 * user's actual answers, by Euclidean distance.
 *
 * `answers` MUST be length 16, in canonical Q1..Q16 order. Each value 1–5.
 */
export function inferOccupationFromAnswers(answers: number[], topK = 3): OccupationGuess[] {
  if (!Array.isArray(answers) || answers.length !== 16) return [];

  const scored = OCCUPATION_PATTERNS.map((p): OccupationGuess => {
    let sq = 0;
    for (let i = 0; i < 16; i++) {
      const u = Number(answers[i]);
      const e = p.answers[i];
      if (!Number.isFinite(u)) continue;
      sq += (u - e) * (u - e);
    }
    const d = Math.sqrt(sq);
    return { ...p, distance: d, confidence: distanceToConfidence(d) };
  });

  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, topK);
}

// ─── Pack / unpack for the share payload ───────────────────────────────────

/**
 * Pack a `core` answer record from QuizFlow into the canonical 16-number
 * array. Missing or invalid answers default to 3 (neutral).
 */
export function packCoreAnswers(core: Record<string, number>): number[] {
  const out: number[] = [];
  for (let i = 1; i <= 16; i++) {
    const v = Number(core['Q' + i]);
    out.push(Number.isFinite(v) && v >= 1 && v <= 5 ? Math.round(v) : 3);
  }
  return out;
}

export function unpackCoreAnswers(arr: number[] | undefined): number[] | null {
  if (!Array.isArray(arr) || arr.length !== 16) return null;
  return arr.map((v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 && n <= 5 ? Math.round(n) : 3;
  });
}

// ─── Back-compat: 4-dim inference for older share URLs ─────────────────────

import type { DimensionResult } from './air_quiz_calculator';

/**
 * Legacy 4-dim inference. Used only for share URLs created BEFORE we started
 * encoding the raw 16 answers. Kept so old links still surface *something*
 * in the inferred-occupation section, even if it's the cruder version.
 */
export function inferOccupation(
  dims: Pick<DimensionResult, 'dimensionId' | 'rawAverage'>[],
  topK = 3,
): OccupationGuess[] {
  const byId = Object.fromEntries(dims.map(d => [d.dimensionId, d.rawAverage]));
  const u: [number, number, number, number] = [
    byId['learnability']   ?? 3,
    byId['evaluation']     ?? 3,
    byId['riskTolerance']  ?? 3,
    byId['humanPresence']  ?? 3,
  ];

  // Project each profession's 16-answer pattern down to 4 dim averages
  // (group of 4 questions per dim) — keeps the legacy path internally
  // consistent with the new patterns.
  const scored = OCCUPATION_PATTERNS.map((p): OccupationGuess => {
    const ans = p.answers;
    const dimAvg: [number, number, number, number] = [
      (ans[0] + ans[1] + ans[2] + ans[3]) / 4,
      (ans[4] + ans[5] + ans[6] + ans[7]) / 4,
      (ans[8] + ans[9] + ans[10] + ans[11]) / 4,
      (ans[12] + ans[13] + ans[14] + ans[15]) / 4,
    ];
    const d = Math.sqrt(
      (u[0] - dimAvg[0]) ** 2 + (u[1] - dimAvg[1]) ** 2 +
      (u[2] - dimAvg[2]) ** 2 + (u[3] - dimAvg[3]) ** 2,
    );
    return { ...p, distance: d, confidence: Math.max(0, Math.min(100, Math.round((1 - d / 8) * 100))) };
  });

  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, topK);
}

export function packDimAvg(dims: Pick<DimensionResult, 'dimensionId' | 'rawAverage'>[]): number[] {
  const byId = Object.fromEntries(dims.map(d => [d.dimensionId, d.rawAverage]));
  return [
    Math.round((byId['learnability']   ?? 3) * 10) / 10,
    Math.round((byId['evaluation']     ?? 3) * 10) / 10,
    Math.round((byId['riskTolerance']  ?? 3) * 10) / 10,
    Math.round((byId['humanPresence']  ?? 3) * 10) / 10,
  ];
}

export function unpackDimAvg(arr: number[] | undefined): Pick<DimensionResult, 'dimensionId' | 'rawAverage'>[] | null {
  if (!arr || arr.length !== 4) return null;
  return [
    { dimensionId: 'learnability',  rawAverage: arr[0] },
    { dimensionId: 'evaluation',    rawAverage: arr[1] },
    { dimensionId: 'riskTolerance', rawAverage: arr[2] },
    { dimensionId: 'humanPresence', rawAverage: arr[3] },
  ];
}
