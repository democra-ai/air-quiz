import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { decodeSharePayload, type SharePayload, type ShareLang } from '@/lib/share_payload';
import { PROFILE_TYPES, QUIZ_DIMENSIONS, RISK_TIER_INFO } from '@/lib/air_quiz_data';
import { generateAdvice } from '@/lib/air_advice_data';
import { PROFILE_CAREERS } from '@/lib/air_career_data';
import ResultPage from './ResultPage';

type Props = {
  params: Promise<{ payload: string }>;
  searchParams: Promise<{ lang?: string }>;
};
type L10n = { en: string; zh: string; ja?: string; ko?: string; de?: string };

const LANGS = ['en', 'zh', 'ja', 'ko', 'de'] as const;
function overrideLang(raw: string | undefined, fallback: ShareLang): ShareLang {
  return raw && (LANGS as readonly string[]).includes(raw) ? (raw as ShareLang) : fallback;
}

function pickL(obj: L10n | undefined, lang: ShareLang): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[lang] ?? obj.en;
}

/**
 * Map the prob-derived riskLevel ('critical'|'high'|'medium'|'low'|'very-low')
 * to the RISK_TIER_INFO tier key ('extreme-high'|'high'|'medium'|'low'|'extreme-low')
 * so we can pull the user-facing label.
 *
 * The label MUST come from the prob-derived riskLevel — not from the archetype's
 * own profile.riskTier — because two users with the same archetype letters can have
 * very different probabilities, and showing "Extreme Low Risk" next to "42%" is the
 * exact kind of inconsistency that broke user trust earlier.
 */
const RISK_LEVEL_TO_TIER: Record<NonNullable<SharePayload['riskLevel']>, keyof typeof RISK_TIER_INFO> = {
  'critical': 'extreme-high',
  'high':     'high',
  'medium':   'medium',
  'low':      'low',
  'very-low': 'extreme-low',
};

async function resolveBase() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'air.democra.ai';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { payload } = await params;
  const { lang: langRaw } = await searchParams;
  const data = decodeSharePayload(payload);
  if (!data) return { title: 'Result' };
  const code = data.v === 2 ? data.profileCode : undefined;
  const profile = code ? PROFILE_TYPES[code] : null;
  const lang = overrideLang(langRaw, data.lang as ShareLang);
  const isZh = lang === 'zh';
  const arch = profile ? (isZh ? profile.archetype.zh : profile.archetype.en) : 'AIR';
  const tag = profile ? (isZh ? profile.tagline.zh : profile.tagline.en) : '';
  const title = `${arch} (${code ?? ''}) — AIR`;
  const base = await resolveBase();
  return {
    title,
    description: tag || `${arch} archetype on AIR — the AI-resistance personality test.`,
    openGraph: {
      title,
      description: tag,
      url: `${base}/share/${payload}`,
      images: [{ url: `${base}/share/${payload}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description: tag, images: [`${base}/share/${payload}/opengraph-image`] },
  };
}

export default async function SharePage({ params, searchParams }: Props) {
  const { payload } = await params;
  const { lang: langRaw } = await searchParams;
  const data = decodeSharePayload(payload);
  if (!data) notFound();
  const safeData = data as SharePayload;
  const lang = overrideLang(langRaw, safeData.lang as ShareLang);
  const code = safeData.v === 2 && safeData.profileCode ? safeData.profileCode : null;
  if (!code) notFound();
  const profile = PROFILE_TYPES[code];
  if (!profile) notFound();

  // Per-dimension favorable/resistant inference from the 4-letter code.
  const dimensions = QUIZ_DIMENSIONS.map((d, i) => {
    const letter = code[i];
    const isFavorable = letter === d.favorableLetter;
    return {
      dimensionId: d.id,
      letter,
      isFavorable,
      name: pickL(d.name, lang),
      favorableLabel: pickL(d.favorableLabel, lang),
      resistantLabel: pickL(d.resistantLabel, lang),
    };
  });

  const advice = generateAdvice(
    dimensions.map((d) => ({ dimensionId: d.dimensionId, isFavorable: d.isFavorable })),
  ).map((a) => ({
    icon: a.icon,
    title: pickL(a.title, lang),
    body: pickL(a.body, lang),
  }));

  const careers = (PROFILE_CAREERS[code] ?? []).map((c) => ({
    title: pickL(c.title, lang),
    reason: pickL(c.reason, lang),
    riskScore: c.riskScore,
  }));

  // Risk label is derived from the actual probability (encoded into the share
  // payload at quiz-submit time), NOT from profile.riskTier — see the rationale
  // on RISK_LEVEL_TO_TIER above.
  const tierKey = RISK_LEVEL_TO_TIER[safeData.riskLevel] ?? 'medium';
  const riskLabel = pickL(RISK_TIER_INFO[tierKey].label as L10n, lang);

  const base = await resolveBase();
  const shareUrl = `${base}/share/${payload}`;

  return (
    <ResultPage
      lang={lang}
      payload={payload}
      shareUrl={shareUrl}
      data={safeData}
      profile={{
        code: profile.code,
        archetype: pickL(profile.archetype as L10n, lang),
        archetypeEn: profile.archetype.en,
        name: pickL(profile.name as L10n, lang),
        tagline: pickL(profile.tagline as L10n, lang),
        superpower: pickL(profile.superpower as L10n, lang),
        kryptonite: pickL(profile.kryptonite as L10n, lang),
        description: pickL(profile.description as L10n, lang),
        typicalJobs: pickL(profile.typicalJobs as L10n, lang),
        color: profile.color,
        riskTier: profile.riskTier,
        riskLabel,
      }}
      dimensions={dimensions}
      advice={advice}
      careers={careers}
    />
  );
}
