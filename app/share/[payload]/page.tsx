import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { decodeSharePayload, type SharePayload, type ShareLang } from '@/lib/share_payload';
import { PROFILE_TYPES, QUIZ_DIMENSIONS, RISK_TIER_INFO } from '@/lib/air_quiz_data';
import { generateAdvice } from '@/lib/air_advice_data';
import { PROFILE_CAREERS } from '@/lib/air_career_data';
import { inferOccupation, unpackDimAvg } from '@/lib/occupation_inference';
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
  // URL ?lang= override wins; falls back to the lang baked into the payload at quiz-submit time.
  const lang = overrideLang(langRaw, safeData.lang as ShareLang);
  const code = safeData.v === 2 && safeData.profileCode ? safeData.profileCode : null;
  if (!code) notFound();
  const profile = PROFILE_TYPES[code];
  if (!profile) notFound();

  // Compute per-dimension favorable/resistant inference from the 4-letter code.
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

  // Per-answer occupation inference: requires the 4 dimension averages we
  // packed into the share payload at quiz-submit time. Older share URLs
  // generated before this change won't have dimAvg → just skip the section.
  const dimAvg = safeData.v === 2 ? unpackDimAvg(safeData.dimAvg) : null;
  const inferredJobs = dimAvg
    ? inferOccupation(dimAvg, 3).map((g) => ({
        id: g.id,
        title: pickL(g.title as L10n, lang),
        confidence: g.confidence,
      }))
    : [];

  const riskTierInfo = RISK_TIER_INFO[profile.riskTier];
  const riskLabel = pickL(riskTierInfo.label as L10n, lang);

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
      inferredJobs={inferredJobs}
    />
  );
}
