'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import ArchetypeSvg from '@/components/result/ArchetypeSvg';
import { PROFILE_TYPES } from '@/lib/air_quiz_data';
import type { SharePayload, ShareLang } from '@/lib/share_payload';
import { ui } from '@/lib/ui_text';
import { trackShareClick, trackQuizRetake } from '@/lib/analytics';

interface DimensionView {
  dimensionId: string;
  letter: string;
  isFavorable: boolean;
  name: string;
  favorableLabel: string;
  resistantLabel: string;
}

interface ProfileView {
  code: string;
  archetype: string;
  archetypeEn: string;
  name: string;
  tagline: string;
  superpower: string;
  kryptonite: string;
  description: string;
  typicalJobs: string;
  color: string;
  riskTier: string;
  riskLabel: string;
}

interface AdviceView { icon: string; title: string; body: string; }
interface CareerView { title: string; reason: string; riskScore: number; }
interface InferredJob { id: string; title: string; confidence: number; }

interface Props {
  lang: ShareLang;
  payload: string;
  shareUrl: string;
  data: SharePayload;
  profile: ProfileView;
  dimensions: DimensionView[];
  advice: AdviceView[];
  careers: CareerView[];
  inferredJobs: InferredJob[];
}

export default function ResultPage(props: Props) {
  const { lang, profile, dimensions, advice, careers, data, shareUrl, inferredJobs } = props;

  return (
    <main style={{ minHeight: '100dvh' }}>
      <Nav />
      <HeroResult lang={lang} profile={profile} prob={data.replacementProbability} year={data.predictedReplacementYear} confidence={{ earliest: data.earliestYear, latest: data.latestYear }} />
      <DimensionStrip lang={lang} dimensions={dimensions} />
      <Narrative lang={lang} profile={profile} />
      <InferredSection lang={lang} jobs={inferredJobs} accent={profile.color} />
      <AdviceSection lang={lang} advice={advice} />
      <CareersSection lang={lang} profile={profile} careers={careers} />
      <ShareSection lang={lang} shareUrl={shareUrl} profile={profile} />
      <OtherArchetypes lang={lang} currentCode={profile.code} />
      <RetakeTail lang={lang} />
      <Footer />
    </main>
  );
}

/* ─── Hero block ─────────────────────────────────────────────────────── */
function HeroResult({
  lang, profile, prob, year, confidence,
}: {
  lang: ShareLang;
  profile: ProfileView;
  prob: number;
  year: number;
  confidence: { earliest: number; latest: number };
}) {
  const t = ui(lang).result;
  const yrText = year >= 2100 ? '∞' : `${year}`;
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span className="section-number">{t.eyebrow_result}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <div className="split-hero">
        <div>
          <p className="smallcaps-md animate-fade-up" style={{ animationDelay: '60ms', marginBottom: 18, color: profile.color }}>
            {profile.riskLabel}
          </p>
          <h1 className="display-xl animate-fade-up" style={{ animationDelay: '110ms', marginBottom: 18 }}>
            <span className="italic-display" style={{ fontStyle: 'italic' }}>{profile.archetype}</span>
          </h1>
          <p className="code-display animate-fade-up" style={{ animationDelay: '170ms' }}>{profile.code}</p>
          <p className="pull-quote animate-fade-up" style={{ animationDelay: '230ms', marginTop: 28, maxWidth: '32ch', color: 'var(--ink)' }}>
            “{profile.tagline}”
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '200ms', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 'clamp(240px, 36vw, 440px)' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-10%',
              background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${profile.color} 24%, transparent), transparent 65%)`,
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, width: '100%' }}>
            <ArchetypeSvg code={profile.code} size={360} />
          </div>
        </div>
      </div>

      <hr className="rule-h" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'clamp(2rem, 4vw, 3rem)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <Stat label={t.stat_prob}>
          <span className="percent-display" style={{ color: profile.color }}>{Math.round(prob)}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: profile.color, opacity: 0.6, marginLeft: 4 }}>%</span>
        </Stat>
        <Stat label={t.stat_year}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-6)', lineHeight: 1, color: 'var(--ink-strong)' }}>{yrText}</span>
        </Stat>
        <Stat label={t.stat_confidence}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--step-2)', color: 'var(--ink)' }}>
            {confidence.earliest}
            <span style={{ color: 'var(--ink-soft)', margin: '0 8px' }}>—</span>
            {confidence.latest >= 2099 ? '∞' : confidence.latest}
          </span>
        </Stat>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="smallcaps" style={{ marginBottom: 10 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>{children}</div>
    </div>
  );
}

/* ─── Dimension strip ────────────────────────────────────────────────── */
function DimensionStrip({ lang, dimensions }: { lang: ShareLang; dimensions: DimensionView[] }) {
  const t = ui(lang).result;
  return (
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
          <span className="section-number">{t.eyebrow_axes}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>

        <div style={{ display: 'grid', gap: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
          {dimensions.map((d, i) => {
            const color = ['var(--dim-1)', 'var(--dim-2)', 'var(--dim-3)', 'var(--dim-4)'][i];
            return (
              <div
                key={d.dimensionId}
                className="dim-row"
                style={{
                  paddingBottom: 'clamp(1rem, 2vw, 1.5rem)',
                  borderBottom: i < dimensions.length - 1 ? '1px dotted var(--paper-rule)' : 'none',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span className="smallcaps">§ 0{i + 1}</span>
                    <h3 className="display-sm" style={{ fontSize: 'var(--step-2)', display: 'inline' }}>{d.name}</h3>
                  </div>
                  <p style={{ marginTop: 6, color: 'var(--ink-mute)', fontSize: '0.92rem' }}>
                    {d.isFavorable ? t.axis_favorable : t.axis_resistant}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--ink-soft)', marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
                    <span>{d.favorableLabel.split(' ')[0]}</span>
                    <span>{d.resistantLabel.split(' ')[0]}</span>
                  </div>
                  <div className="dim-bar-track">
                    <div
                      className="dim-bar-marker"
                      style={{
                        left: d.isFavorable ? '22%' : '78%',
                        background: color,
                        borderColor: color,
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'var(--step-5)',
                    lineHeight: 1,
                    color,
                    fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                    paddingLeft: 'clamp(0.5rem, 2vw, 1.25rem)',
                    paddingRight: 'clamp(0.25rem, 1vw, 0.5rem)',
                  }}
                >
                  {d.letter}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Narrative ─────────────────────────────────────────────────────── */
function Narrative({ lang, profile }: { lang: ShareLang; profile: ProfileView }) {
  const t = ui(lang).result;
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 6vw, 4rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow_meaning}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <div className="split-2-1">
        <article className="reading drop-cap" style={{ fontSize: 'var(--step-1)', lineHeight: 1.7, color: 'var(--ink)' }}>
          <p>{profile.description}</p>
        </article>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ background: 'var(--paper-card)' }}>
            <p className="smallcaps" style={{ color: 'var(--safe)' }}>{t.moat_label}</p>
            <p style={{ marginTop: 10, fontSize: 'var(--step-1)', lineHeight: 1.45, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-strong)' }}>
              {profile.superpower}
            </p>
          </div>
          <div className="card" style={{ background: 'var(--paper-card)' }}>
            <p className="smallcaps" style={{ color: 'var(--accent)' }}>{t.kryptonite_label}</p>
            <p style={{ marginTop: 10, fontSize: 'var(--step-1)', lineHeight: 1.45, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-strong)' }}>
              {profile.kryptonite}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ─── Inferred occupation (from raw dimension averages) ───────────────── */

function InferredSection({ lang, jobs, accent }: { lang: ShareLang; jobs: InferredJob[]; accent: string }) {
  if (!jobs || jobs.length === 0) return null;
  const t = ui(lang).result;
  return (
    <section className="page" style={{ paddingTop: 'clamp(1.5rem, 4vw, 3rem)', paddingBottom: 'clamp(1.5rem, 4vw, 3rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow_inferred}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <h2 className="display-md" style={{ maxWidth: '24ch', marginBottom: 'clamp(1.25rem, 3vw, 2rem)' }}>
        {t.inferred_headline}
      </h2>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
        {jobs.map((j, i) => (
          <li
            key={j.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              alignItems: 'baseline',
              gap: 'clamp(0.75rem, 2vw, 1.5rem)',
              padding: '14px 0',
              borderTop: '1px dotted var(--paper-rule)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontSize: '0.78rem', minWidth: 28 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="italic-display" style={{ fontStyle: 'italic', color: 'var(--ink-strong)', fontSize: 'var(--step-2)' }}>
              {j.title}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: accent, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--step-1)' }}>
                {j.confidence}%
              </span>
              <span className="smallcaps" style={{ color: 'var(--ink-mute)', fontSize: '0.7rem' }}>
                {t.inferred_confidence_label}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="marginalia" style={{ marginTop: 18, maxWidth: '64ch' }}>
        {t.inferred_caveat}
      </p>
    </section>
  );
}

/* ─── Advice ─────────────────────────────────────────────────────────── */
function AdviceSection({ lang, advice }: { lang: ShareLang; advice: AdviceView[] }) {
  const t = ui(lang).result;
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 3.5rem)', paddingBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow_advice}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'grid', gap: 'clamp(1rem, 2.5vw, 1.5rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {advice.map((a, i) => (
          <article key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
            <h3 className="display-sm" style={{ fontSize: 'var(--step-2)' }}>{a.title}</h3>
            <p style={{ color: 'var(--ink-mute)', fontSize: '0.95rem', lineHeight: 1.55 }}>{a.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Careers ────────────────────────────────────────────────────────── */
function CareersSection({ lang, profile, careers }: { lang: ShareLang; profile: ProfileView; careers: CareerView[] }) {
  if (!careers.length) return null;
  const t = ui(lang).result;
  return (
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
          <span className="section-number">{t.eyebrow_careers}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>
        <h2 className="display-md" style={{ marginBottom: 24, maxWidth: '24ch' }}>
          {t.careers_headline}
        </h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
          {careers.slice(0, 6).map((c, i) => (
            <li
              key={i}
              className="career-row"
              style={{
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
  );
}

/* ─── Share ──────────────────────────────────────────────────────────── */
function ShareSection({ lang, shareUrl, profile }: { lang: ShareLang; shareUrl: string; profile: ProfileView }) {
  const t = ui(lang).result;
  const [copied, setCopied] = useState(false);

  const tweet = `${profile.archetypeEn} (${profile.code}) — AIR`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(shareUrl)}`;
  const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(tweet)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      trackShareClick('copy', lang);
    } catch {}
  };

  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 6vw, 4rem)', paddingBottom: 'clamp(2rem, 5vw, 3rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow_share}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="btn btn-ghost btn-sm" href={tweetUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackShareClick('twitter', lang)}>
          {t.share_twitter}<span aria-hidden>↗</span>
        </a>
        <a className="btn btn-ghost btn-sm" href={weiboUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackShareClick('weibo', lang)}>
          {t.share_weibo}<span aria-hidden>↗</span>
        </a>
        <button className="btn btn-ghost btn-sm" onClick={copy}>
          {copied ? t.share_copied : t.share_copy}
        </button>
        <code
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--ink-mute)',
            background: 'transparent',
            padding: '0 8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1 1 240px',
            minWidth: 0,
          }}
        >
          {shareUrl.replace(/^https?:\/\//, '')}
        </code>
      </div>
    </section>
  );
}

/* ─── Other archetypes ───────────────────────────────────────────────── */
function OtherArchetypes({ lang, currentCode }: { lang: ShareLang; currentCode: string }) {
  const t = ui(lang).result;
  const others = Object.keys(PROFILE_TYPES).filter((c) => c !== currentCode);
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 4rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow_other}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {others.map((code) => {
          const p = PROFILE_TYPES[code];
          const archetype = (p.archetype as Record<string, string>)[lang] ?? p.archetype.en;
          return (
            <Link
              key={code}
              href={`/profile/${code}?lang=${lang}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid var(--paper-rule)',
                background: 'var(--paper-card)',
                textDecoration: 'none',
                color: 'var(--ink)',
                transition: 'border-color .2s ease, transform .2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--paper-rule)'; }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: p.color, flex: 'none' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-soft)', letterSpacing: '0.16em' }}>
                {code}
              </span>
              <span className="italic-display" style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {archetype}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Retake tail ─────────────────────────────────────────────────────── */
function RetakeTail({ lang }: { lang: ShareLang }) {
  const t = ui(lang).result;
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="card-strong cta-tail" style={{ alignItems: 'center' }}>
        <div>
          <p className="smallcaps" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {t.retake_eyebrow}
          </p>
          <p className="display-md" style={{ color: 'var(--paper)', marginTop: 8 }}>
            {t.retake_headline}
          </p>
        </div>
        <Link
          href="/?quiz=1"
          className="btn btn-lg"
          style={{ background: 'var(--paper)', color: 'var(--ink-strong)' }}
          onClick={() => trackQuizRetake('share-page', lang)}
        >
          {t.retake_cta}<span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
