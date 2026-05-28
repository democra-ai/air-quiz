export type ShareLang = 'en' | 'zh' | 'ja' | 'ko' | 'de';

type SharePayloadBase = {
  riskLevel: 'very-low' | 'low' | 'medium' | 'high' | 'critical';
  replacementProbability: number;
  predictedReplacementYear: number;
  currentReplacementDegree: number;
  earliestYear: number;
  latestYear: number;
  lang: ShareLang;
};

export type SharePayloadV1 = SharePayloadBase & { v: 1 };

export type SharePayloadV2 = SharePayloadBase & {
  v: 2;
  profileCode?: string;  // 4-letter code e.g. "EOFH"
  /**
   * 4 raw dimension averages (1.0–5.0), order:
   *   [learnability, evaluation, riskTolerance, humanPresence].
   * Drives the per-axis percentage + marker position in §II of the result page.
   */
  dimAvg?: [number, number, number, number];
  /**
   * Raw user answers to Q1..Q16 (each 1–5). Drives the "we think your work
   * resembles…" occupation guess on the result page (weighted 16-answer
   * nearest-neighbour). Older URLs without it just hide that section.
   */
  coreAnswers?: number[];
  /** True when the Full-mode AI-snapshot section was answered — gates the
   *  "AI can already do X% of your work today" stat on the result page. */
  snapshotMeasured?: boolean;
  insights?: {
    primaryDriver: string;
    secondaryFactors: string[];
    protectionFactors: string[];
  };
  recommendations?: string[];
};

export type SharePayload = SharePayloadV1 | SharePayloadV2;

const RISK_LEVELS: SharePayload['riskLevel'][] = ['very-low', 'low', 'medium', 'high', 'critical'];
const LANGS: ShareLang[] = ['en', 'zh', 'ja', 'ko', 'de'];

function toBase64Url(input: string): string {
  if (typeof window === 'undefined' && typeof Buffer !== 'undefined') {
    return Buffer.from(input, 'utf8').toString('base64url');
  }
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): string | null {
  try {
    if (typeof window === 'undefined' && typeof Buffer !== 'undefined') {
      return Buffer.from(input, 'base64url').toString('utf8');
    }
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sanitizeText(input: unknown, maxLength = 72): string {
  if (typeof input !== 'string') return '';
  const normalized = input.replace(/\s+/g, ' ').trim();
  return normalized.slice(0, maxLength);
}

function sanitizeTextArray(input: unknown, maxItems: number, maxLength = 72): string[] {
  if (!Array.isArray(input)) return [];
  const cleaned = input
    .map((item) => sanitizeText(item, maxLength))
    .filter((item) => item.length > 0);
  return cleaned.slice(0, maxItems);
}

function isValidPayloadBase(payload: Partial<SharePayload>): payload is SharePayloadBase {
  return (
    typeof payload.riskLevel === 'string' &&
    RISK_LEVELS.includes(payload.riskLevel as SharePayload['riskLevel']) &&
    typeof payload.replacementProbability === 'number' &&
    Number.isFinite(payload.replacementProbability) &&
    typeof payload.predictedReplacementYear === 'number' &&
    Number.isFinite(payload.predictedReplacementYear) &&
    typeof payload.currentReplacementDegree === 'number' &&
    Number.isFinite(payload.currentReplacementDegree) &&
    typeof payload.earliestYear === 'number' &&
    Number.isFinite(payload.earliestYear) &&
    typeof payload.latestYear === 'number' &&
    Number.isFinite(payload.latestYear) &&
    typeof payload.lang === 'string' &&
    LANGS.includes(payload.lang as ShareLang)
  );
}

function isValidPayloadValue(payload: Partial<SharePayload>): payload is SharePayload {
  return (
    (payload.v === 1 || payload.v === 2) &&
    isValidPayloadBase(payload)
  );
}

export function encodeSharePayload(payload: Omit<SharePayloadV2, 'v'>): string {
  const normalized: SharePayloadV2 = {
    v: 2,
    riskLevel: payload.riskLevel,
    replacementProbability: clampInt(payload.replacementProbability, 0, 100),
    predictedReplacementYear: clampInt(payload.predictedReplacementYear, 2024, 2100),
    currentReplacementDegree: clampInt(payload.currentReplacementDegree, 0, 100),
    earliestYear: clampInt(payload.earliestYear, 2024, 2100),
    latestYear: clampInt(payload.latestYear, 2024, 2100),
    lang: payload.lang,
    profileCode: payload.profileCode && /^[ETOSFRHP]{4}$/i.test(payload.profileCode)
      ? payload.profileCode.toUpperCase()
      : undefined,
    dimAvg: Array.isArray(payload.dimAvg) && payload.dimAvg.length === 4
      ? (payload.dimAvg.map((x) => {
          const n = Number(x);
          if (!Number.isFinite(n)) return 3;
          return Math.round(Math.max(1, Math.min(5, n)) * 10) / 10;
        }) as [number, number, number, number])
      : undefined,
    snapshotMeasured: payload.snapshotMeasured === true ? true : undefined,
    coreAnswers: Array.isArray(payload.coreAnswers) && payload.coreAnswers.length === 16
      ? payload.coreAnswers.map((x) => {
          const n = Number(x);
          if (!Number.isFinite(n)) return 3;
          return Math.round(Math.max(1, Math.min(5, n)));
        })
      : undefined,
    insights: payload.insights
      ? {
          primaryDriver: sanitizeText(payload.insights.primaryDriver),
          secondaryFactors: sanitizeTextArray(payload.insights.secondaryFactors, 3),
          protectionFactors: sanitizeTextArray(payload.insights.protectionFactors, 2),
        }
      : undefined,
    recommendations: sanitizeTextArray(payload.recommendations, 4, 120),
  };
  return toBase64Url(JSON.stringify(normalized));
}

export function decodeSharePayload(payload: string): SharePayload | null {
  const decoded = fromBase64Url(payload);
  if (!decoded) return null;

  let parsed: Partial<SharePayload>;
  try {
    parsed = JSON.parse(decoded) as Partial<SharePayload>;
  } catch {
    return null;
  }
  if (!isValidPayloadValue(parsed)) return null;
  if (parsed.latestYear < parsed.earliestYear) return null;

  const normalizedBase = {
    ...parsed,
    replacementProbability: clampInt(parsed.replacementProbability, 0, 100),
    predictedReplacementYear: clampInt(parsed.predictedReplacementYear, 2024, 2100),
    currentReplacementDegree: clampInt(parsed.currentReplacementDegree, 0, 100),
    earliestYear: clampInt(parsed.earliestYear, 2024, 2100),
    latestYear: clampInt(parsed.latestYear, 2024, 2100),
  };

  if (normalizedBase.v === 1) return normalizedBase;

  const profileCode = typeof normalizedBase.profileCode === 'string' && /^[ETOSFRHP]{4}$/i.test(normalizedBase.profileCode)
    ? normalizedBase.profileCode.toUpperCase()
    : undefined;

  const insights = normalizedBase.insights
    ? {
        primaryDriver: sanitizeText(normalizedBase.insights.primaryDriver),
        secondaryFactors: sanitizeTextArray(normalizedBase.insights.secondaryFactors, 3),
        protectionFactors: sanitizeTextArray(normalizedBase.insights.protectionFactors, 2),
      }
    : undefined;
  const recommendations = sanitizeTextArray(normalizedBase.recommendations, 4, 120);

  return {
    ...normalizedBase,
    profileCode,
    insights,
    recommendations,
  };
}
