import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import ArchetypeSvg from '@/components/result/ArchetypeSvg';
import { PROFILE_TYPES, RISK_TIER_INFO, QUIZ_DIMENSIONS } from '@/lib/air_quiz_data';
import { PROFILE_CAREERS } from '@/lib/air_career_data';

type Lang = 'en' | 'zh' | 'ja' | 'ko' | 'de';
const LANGS: Lang[] = ['en', 'zh', 'ja', 'ko', 'de'];

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ lang?: string }>;
};

function resolveLang(raw: string | undefined): Lang {
  if (raw && (LANGS as string[]).includes(raw)) return raw as Lang;
  return 'en';
}

function pickL<T extends Record<string, unknown>>(obj: T, lang: Lang): string {
  const v = (obj as Record<string, string | undefined>)[lang] ?? (obj as Record<string, string>)['en'];
  return v ?? '';
}

export async function generateStaticParams() {
  return Object.keys(PROFILE_TYPES).map((code) => ({ code }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { code } = await params;
  const { lang: langRaw } = await searchParams;
  const profile = PROFILE_TYPES[code.toUpperCase()];
  if (!profile) return { title: 'Archetype not found' };
  const lang = resolveLang(langRaw);
  const arch = pickL(profile.archetype, lang);
  const tag  = pickL(profile.tagline, lang);
  return {
    title: `${arch} (${code.toUpperCase()})`,
    description: tag,
    alternates: { canonical: `/profile/${code.toUpperCase()}?lang=${lang}` },
    openGraph: { title: `${arch} — AIR`, description: tag },
  };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { code: codeParam } = await params;
  const { lang: langRaw } = await searchParams;
  const code = codeParam.toUpperCase();
  const profile = PROFILE_TYPES[code];
  if (!profile) notFound();
  const lang = resolveLang(langRaw);
  const zh = lang === 'zh';

  const dims = QUIZ_DIMENSIONS.map((d, i) => ({
    name: pickL(d.name, lang),
    favorableLabel: pickL(d.favorableLabel, lang),
    resistantLabel: pickL(d.resistantLabel, lang),
    letter: code[i],
    isFavorable: code[i] === d.favorableLetter,
    color: ['var(--dim-1)', 'var(--dim-2)', 'var(--dim-3)', 'var(--dim-4)'][i],
  }));

  const careers = (PROFILE_CAREERS[code] ?? []).map((c) => ({
    title: pickL(c.title, lang),
    reason: pickL(c.reason, lang),
    riskScore: c.riskScore,
  }));

  const riskTier = RISK_TIER_INFO[profile.riskTier];
  const riskLabel = pickL(riskTier.label, lang);
  const others = Object.keys(PROFILE_TYPES).filter((c) => c !== code);

  return (
    <main style={{ minHeight: '100dvh' }}>
      <Nav />

      {/* Crumb */}
      <div className="page" style={{ paddingTop: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--ink-mute)', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
          ← {zh ? '所有原型' : 'All archetypes'}
        </Link>
      </div>

      {/* Hero */}
      <section className="page" style={{ paddingTop: 'clamp(1.5rem, 4vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="section-number">§ {code}</span>
          <span className="rule-h" style={{ flex: 1 }} />
          <span className="smallcaps" style={{ color: profile.color }}>{riskLabel}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
        }}>
          <div>
            <h1 className="display-xl italic-display" style={{ fontStyle: 'italic', marginBottom: 16 }}>
              {pickL(profile.archetype, lang)}
            </h1>
            <p className="code-display" style={{ marginBottom: 24 }}>{code}</p>
            <p className="pull-quote" style={{ maxWidth: '32ch', color: 'var(--ink)' }}>
              “{pickL(profile.tagline, lang)}”
            </p>
            <div style={{ marginTop: 'clamp(1.5rem, 3vw, 2rem)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href={`/?quiz=1&lang=${lang}`} className="btn btn-primary btn-lg">
                {zh ? '测一下我是不是这个原型' : 'See if you are this archetype'}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'clamp(240px, 36vw, 420px)',
          }}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: '-12%',
                background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${profile.color} 22%, transparent), transparent 65%)`,
                filter: 'blur(8px)',
              }}
            />
            <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
              <ArchetypeSvg code={code} size={360} />
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions strip */}
      <section
        style={{
          background: 'var(--paper-deep)',
          borderTop: '1px solid var(--paper-rule)',
          borderBottom: '1px solid var(--paper-rule)',
          paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
          paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        <div className="page">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span className="section-number">§ II · {zh ? '四维特征' : 'Across four axes'}</span>
            <span className="rule-h" style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'grid', gap: 'clamp(1rem, 2vw, 1.5rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {dims.map((d, i) => (
              <div key={i} className="card" style={{ background: 'var(--paper)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span className="smallcaps">{d.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--step-4)', color: d.color, fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                    {d.letter}
                  </span>
                </div>
                <p style={{ marginTop: 8, color: 'var(--ink-mute)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {d.isFavorable ? d.favorableLabel : d.resistantLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="page" style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)', paddingBottom: 'clamp(2rem, 5vw, 4rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="section-number">§ III · {zh ? '为什么是这个原型' : 'Why this archetype'}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'grid', gap: 'clamp(2rem, 4vw, 3rem)', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', alignItems: 'start' }}>
          <article className="reading drop-cap" style={{ fontSize: 'var(--step-1)', lineHeight: 1.7, color: 'var(--ink)' }}>
            <p>{pickL(profile.description, lang)}</p>
          </article>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <p className="smallcaps" style={{ color: 'var(--safe)' }}>{zh ? '护城河' : 'Superpower'}</p>
              <p style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--step-1)', lineHeight: 1.45, color: 'var(--ink-strong)' }}>
                {pickL(profile.superpower, lang)}
              </p>
            </div>
            <div className="card">
              <p className="smallcaps" style={{ color: 'var(--accent)' }}>{zh ? '弱点' : 'Kryptonite'}</p>
              <p style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--step-1)', lineHeight: 1.45, color: 'var(--ink-strong)' }}>
                {pickL(profile.kryptonite, lang)}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Careers */}
      {careers.length > 0 && (
        <section
          style={{
            background: 'var(--paper-deep)',
            borderTop: '1px solid var(--paper-rule)',
            borderBottom: '1px solid var(--paper-rule)',
            paddingTop: 'clamp(3rem, 6vw, 4.5rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
          }}
        >
          <div className="page">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="section-number">§ IV · {zh ? '典型职业' : 'Representative careers'}</span>
              <span className="rule-h" style={{ flex: 1 }} />
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {careers.slice(0, 6).map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto minmax(0, 1.2fr) minmax(0, 1.5fr) 64px',
                    alignItems: 'baseline',
                    gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                    padding: '14px 0',
                    borderTop: '1px dotted var(--paper-rule)',
                    fontSize: '0.95rem',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontSize: '0.78rem', minWidth: 28 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="italic-display" style={{ fontStyle: 'italic', color: 'var(--ink-strong)', fontSize: 'var(--step-1)' }}>
                    {c.title}
                  </span>
                  <span style={{ color: 'var(--ink-mute)' }}>{c.reason}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: profile.color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {c.riskScore}%
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Other archetypes */}
      <section className="page" style={{ paddingTop: 'clamp(3rem, 6vw, 4rem)', paddingBottom: 'clamp(3rem, 6vw, 4rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="section-number">§ V · {zh ? '其他原型' : 'The other 15'}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {others.map((c) => {
            const p = PROFILE_TYPES[c];
            return (
              <Link key={c} href={`/profile/${c}?lang=${lang}`} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12,
                border: '1px solid var(--paper-rule)', background: 'var(--paper-card)', textDecoration: 'none', color: 'var(--ink)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: p.color, flex: 'none' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-soft)', letterSpacing: '0.16em' }}>
                  {c}
                </span>
                <span className="italic-display" style={{ fontStyle: 'italic', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pickL(p.archetype, lang)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
