/**
 * Per-answer occupation inference.
 *
 * The 16 archetype labels are deliberately abstract (Glass Cannon, Iron
 * Fortress, …). That's the right framing for the test, but on the result
 * page users want a more concrete "so what is my job, then?" answer.
 *
 * This module compares the user's 4 dimension averages (1.0–5.0) to a
 * library of ~18 occupation patterns and returns the 3 closest matches by
 * Euclidean distance. Each pattern is one anchor point per profession,
 * positioned in the same 4-axis space as the quiz.
 *
 * Axes (each 1.0–5.0):
 *   learn — Learnability:   1=tacit / hands-on    5=explicit / digital
 *   eval  — Evaluation:     1=subjective taste    5=objective metric
 *   risk  — Risk Tolerance: 1=rigid / irreversible 5=flexible / forgiving
 *   human — Human Presence: 1=between two people  5=between person & product
 *
 * Anchors were placed by hand using BLS/O*NET task-mix descriptions, not
 * empirically — treat them as educated guesses, not measured ground truth.
 */

import type { DimensionResult } from './air_quiz_calculator';

export interface OccupationPattern {
  /** Stable id used to look up translations & icons. */
  id: string;
  /** Short job title in EN/ZH. */
  title: { en: string; zh: string; ja?: string; ko?: string; de?: string };
  /** Typical SOC major group (BLS 2-digit). For analytics linking. */
  socGroup: number;
  /** Anchor in (learn, eval, risk, human) space, each 1.0–5.0. */
  pattern: [number, number, number, number];
}

/**
 * Hand-anchored profession library.
 * Keep this small and representative — 18 anchors covering the major
 * BLS major groups gives enough resolution for inference without
 * overfitting to esoteric jobs.
 */
export const OCCUPATION_PATTERNS: OccupationPattern[] = [
  // ── Office, admin, data-entry (high learn + obj + flex + product) ─────
  { id: 'office-admin',     title: { en: 'Office administrator',  zh: '行政文员',     ja: '事務員',          ko: '사무직 관리자',     de: 'Bürokraft' },                pattern: [5.0, 4.7, 4.6, 4.6], socGroup: 43 },
  { id: 'data-entry',       title: { en: 'Data-entry clerk',      zh: '数据录入员',   ja: 'データ入力',      ko: '데이터 입력원',     de: 'Datenerfasser:in' },          pattern: [5.0, 4.8, 4.8, 4.8], socGroup: 43 },
  { id: 'customer-service', title: { en: 'Customer service rep',  zh: '客服专员',     ja: 'カスタマーサポート', ko: '고객 서비스 담당', de: 'Kundenservice' },           pattern: [4.6, 4.2, 4.0, 2.0], socGroup: 43 },

  // ── Tech / analyst (high learn + obj + product-ish) ───────────────────
  { id: 'software-engineer', title: { en: 'Software developer',   zh: '软件开发者',   ja: 'ソフトウェア開発者', ko: '소프트웨어 개발자', de: 'Softwareentwickler:in' },  pattern: [5.0, 4.5, 3.8, 4.5], socGroup: 15 },
  { id: 'data-analyst',      title: { en: 'Data analyst',         zh: '数据分析师',   ja: 'データアナリスト',   ko: '데이터 분석가',    de: 'Datenanalyst:in' },          pattern: [4.9, 4.7, 4.0, 4.3], socGroup: 15 },

  // ── Sales / marketing (mixed learn, subjective, human-facing) ─────────
  { id: 'sales-rep',         title: { en: 'Sales representative',  zh: '销售代表',     ja: '営業',             ko: '영업 사원',         de: 'Vertriebsmitarbeiter:in' },  pattern: [4.3, 3.4, 3.8, 1.8], socGroup: 41 },
  { id: 'marketing',         title: { en: 'Marketing manager',     zh: '市场营销',     ja: 'マーケティング',     ko: '마케팅 매니저',     de: 'Marketing-Manager:in' },     pattern: [4.3, 2.6, 3.8, 3.0], socGroup: 11 },

  // ── Knowledge professionals (high learn + obj, but rigid) ─────────────
  { id: 'lawyer',            title: { en: 'Lawyer',                zh: '律师',         ja: '弁護士',           ko: '변호사',            de: 'Anwält:in' },                pattern: [4.5, 4.0, 1.8, 3.2], socGroup: 23 },
  { id: 'accountant',        title: { en: 'Accountant',            zh: '会计',         ja: '会計士',           ko: '회계사',            de: 'Buchhalter:in' },             pattern: [4.7, 4.6, 2.2, 4.0], socGroup: 13 },
  { id: 'executive',         title: { en: 'Executive / manager',   zh: '管理者/高管',  ja: '経営者',           ko: '경영진',            de: 'Geschäftsführer:in' },        pattern: [3.6, 2.6, 2.4, 1.8], socGroup: 11 },

  // ── Healthcare (rigid + human) ────────────────────────────────────────
  { id: 'physician',         title: { en: 'Physician / surgeon',   zh: '医生/外科医生', ja: '医師/外科医',       ko: '의사/외과의',       de: 'Ärzt:in / Chirurg:in' },     pattern: [4.0, 4.0, 1.4, 1.4], socGroup: 29 },
  { id: 'nurse',             title: { en: 'Nurse',                 zh: '护士',         ja: '看護師',           ko: '간호사',            de: 'Pflegekraft' },               pattern: [3.6, 3.8, 1.8, 1.4], socGroup: 29 },
  { id: 'therapist',         title: { en: 'Therapist / counsellor', zh: '心理咨询师',  ja: 'カウンセラー',     ko: '상담사',            de: 'Therapeut:in' },              pattern: [2.6, 1.6, 3.4, 1.2], socGroup: 21 },

  // ── Trades & physical work (low learn, mid-eval, mid-flex, product) ───
  { id: 'tradesperson',      title: { en: 'Electrician / plumber', zh: '电工/管道工',  ja: '電気・配管工',     ko: '전기·배관공',       de: 'Elektriker:in / Klempner:in' }, pattern: [2.2, 3.2, 3.0, 4.0], socGroup: 47 },
  { id: 'driver',            title: { en: 'Driver / operator',     zh: '司机/操作员',  ja: '運転手/オペレーター', ko: '운전사/운영자',    de: 'Fahrer:in / Bediener:in' },    pattern: [3.0, 3.6, 2.6, 3.6], socGroup: 53 },
  { id: 'chef',              title: { en: 'Chef / cook',           zh: '厨师',         ja: 'シェフ/調理師',    ko: '셰프/요리사',       de: 'Koch / Köchin' },             pattern: [2.4, 2.0, 3.6, 3.6], socGroup: 35 },

  // ── Creative / personal-service (subjective + human) ──────────────────
  { id: 'designer',          title: { en: 'Designer / art director', zh: '设计师/艺术总监', ja: 'デザイナー',  ko: '디자이너',          de: 'Designer:in' },              pattern: [4.0, 1.8, 3.8, 3.4], socGroup: 27 },
  { id: 'stylist',           title: { en: 'Hairstylist / makeup artist', zh: '发型师/化妆师', ja: 'ヘアスタイリスト', ko: '헤어스타일리스트', de: 'Friseur:in / Visagist:in' }, pattern: [3.4, 1.6, 3.6, 1.4], socGroup: 39 },
  { id: 'teacher',           title: { en: 'Teacher / instructor',  zh: '教师/讲师',    ja: '教師',             ko: '교사',              de: 'Lehrer:in' },                 pattern: [3.6, 3.0, 3.0, 1.6], socGroup: 25 },
  { id: 'artist',            title: { en: 'Artist / performer',    zh: '艺术家/表演者', ja: 'アーティスト',     ko: '아티스트',          de: 'Künstler:in' },              pattern: [2.0, 1.2, 4.4, 2.4], socGroup: 27 },
];

export interface OccupationGuess extends OccupationPattern {
  /** Euclidean distance to the user's 4-d profile (lower = closer). */
  distance: number;
  /** 0..100, monotonic with distance. Higher = better match. */
  confidence: number;
}

/**
 * Return the top-K occupations whose anchor pattern is closest to the
 * user's 4 dimension averages.
 *
 * `dims` is the array straight from `calculateQuizResult().dimensions`
 * (in canonical learn/eval/risk/human order).
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

  const scored = OCCUPATION_PATTERNS.map((p): OccupationGuess => {
    const d = Math.sqrt(
      Math.pow(u[0] - p.pattern[0], 2) +
      Math.pow(u[1] - p.pattern[1], 2) +
      Math.pow(u[2] - p.pattern[2], 2) +
      Math.pow(u[3] - p.pattern[3], 2),
    );
    // Map distance to a 0–100 confidence. Max possible distance in [1,5]^4
    // is sqrt(4*16) = 8; map [0,8] → [100, 0].
    const confidence = Math.max(0, Math.min(100, Math.round((1 - d / 8) * 100)));
    return { ...p, distance: d, confidence };
  });

  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, topK);
}

/**
 * Reconstruct dimension averages from a compact array. Used to decode the
 * 4 raw averages we tuck into the share payload.
 */
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
