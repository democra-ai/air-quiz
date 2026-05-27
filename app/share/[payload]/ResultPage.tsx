'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import ArchetypeSvg from '@/components/result/ArchetypeSvg';
import { PROFILE_TYPES } from '@/lib/air_quiz_data';
import type { SharePayload, ShareLang } from '@/lib/share_payload';
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

interface Props {
  lang: ShareLang;
  payload: string;
  shareUrl: string;
  data: SharePayload;
  profile: ProfileView;
  dimensions: DimensionView[];
  advice: AdviceView[];
  careers: CareerView[];
}

const FAVORABLE_LETTERS = ['E', 'O', 'F', 'P'];

export default function ResultPage(props: Props) {
  const { lang, profile, dimensions, advice, careers, data, shareUrl } = props;
  const zh = lang === 'zh';

  return (
    <main style={{ minHeight: '100dvh' }}>
      <Nav />
      <HeroResult lang={lang} profile={profile} prob={data.replacementProbability} year={data.predictedReplacementYear} confidence={{ earliest: data.earliestYear, latest: data.latestYear }} />
      <DimensionStrip lang={lang} dimensions={dimensions} />
      <Narrative lang={lang} profile={profile} />
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
  const zh = lang === 'zh';
  const yrText = year >= 2100 ? '∞' : `${year}`;
  return (
    <section
      className="page"
      style={{
        paddingTop: 'clamp(2rem, 5vw, 4rem)',
        paddingBottom: 'clamp(3rem, 7vw, 5rem)',
      }}
    >
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span className="section-number">§ I · {zh ? '结果' : 'Your archetype'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
        }}
      >
        <div>
          <p className="smallcaps-md animate-fade-up" style={{ animationDelay: '60ms', marginBottom: 18, color: profile.color }}>
            {profile.riskLabel}
          </p>
          <h1 className="display-xl animate-fade-up" style={{ animationDelay: '110ms', marginBottom: 18 }}>
            <span className="italic-display" style={{ fontStyle: 'italic' }}>{profile.archetype}</span>
          </h1>
          <p className="code-display animate-fade-up" style={{ animationDelay: '170ms' }}>{profile.code}</p>
          <p
            className="pull-quote animate-fade-up"
            style={{
              animationDelay: '230ms',
              marginTop: 28,
              maxWidth: '32ch',
              color: 'var(--ink)',
            }}
          >
            “{profile.tagline}”
          </p>
        </div>

        {/* Archetype glyph + soft halo in archetype color */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: '200ms',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: 'clamp(240px, 36vw, 440px)',
          }}
        >
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

      {/* Stats row */}
      <hr className="rule-h" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'clamp(2rem, 4vw, 3rem)' }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <Stat label={zh ? '替代概率' : 'Replacement probability'}>
          <span className="percent-display" style={{ color: profile.color }}>{Math.round(prob)}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: profile.color, opacity: 0.6, marginLeft: 4 }}>%</span>
        </Stat>
        <Stat label={zh ? '预测替代年份' : 'Predicted year'}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-6)', lineHeight: 1, color: 'var(--ink-strong)' }}>
            {yrText}
          </span>
        </Stat>
        <Stat label={zh ? '置信区间' : 'Confidence interval'}>
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
  const zh = lang === 'zh';
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
          <span className="section-number">§ II · {zh ? '四维分布' : 'Across four axes'}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>

        <div style={{ display: 'grid', gap: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
          {dimensions.map((d, i) => {
            const color = ['var(--dim-1)', 'var(--dim-2)', 'var(--dim-3)', 'var(--dim-4)'][i];
            return (
              <div
                key={d.dimensionId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(160px, 280px) auto',
                  alignItems: 'center',
                  gap: 'clamp(1rem, 2vw, 2rem)',
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
                    {d.isFavorable
                      ? (zh ? `AI 在这一维度上很容易追上你。` : `AI catches up easily on this axis.`)
                      : (zh ? `这一维度是你的护城河。` : `This axis is your moat.`)}
                  </p>
                </div>

                {/* Bar with marker */}
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

                {/* Big letter */}
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

/* ─── Narrative drop-cap block ────────────────────────────────────────── */

function Narrative({ lang, profile }: { lang: ShareLang; profile: ProfileView }) {
  const zh = lang === 'zh';
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 6vw, 4rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">§ III · {zh ? '解读' : 'What this means'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'grid', gap: 'clamp(2rem, 4vw, 3rem)', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', alignItems: 'start' }}>
        <article className="reading drop-cap" style={{ fontSize: 'var(--step-1)', lineHeight: 1.7, color: 'var(--ink)' }}>
          <p>{profile.description}</p>
        </article>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ background: 'var(--paper-card)' }}>
            <p className="smallcaps" style={{ color: 'var(--safe)' }}>{zh ? '你的护城河' : 'Your superpower'}</p>
            <p style={{ marginTop: 10, fontSize: 'var(--step-1)', lineHeight: 1.45, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-strong)' }}>
              {profile.superpower}
            </p>
          </div>
          <div className="card" style={{ background: 'var(--paper-card)' }}>
            <p className="smallcaps" style={{ color: 'var(--accent)' }}>{zh ? '你的弱点' : 'Your kryptonite'}</p>
            <p style={{ marginTop: 10, fontSize: 'var(--step-1)', lineHeight: 1.45, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-strong)' }}>
              {profile.kryptonite}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ─── Advice ─────────────────────────────────────────────────────────── */

function AdviceSection({ lang, advice }: { lang: ShareLang; advice: AdviceView[] }) {
  const zh = lang === 'zh';
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 3.5rem)', paddingBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">§ IV · {zh ? '建议' : 'What to do'}</span>
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
  const zh = lang === 'zh';
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
          <span className="section-number">§ V · {zh ? '典型职业' : 'Representative careers'}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>
        <h2 className="display-md" style={{ marginBottom: 24, maxWidth: '24ch' }}>
          {zh ? `落在这个原型上的，常是这些职业。` : `Jobs that typically land in this archetype.`}
        </h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
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
  );
}

/* ─── Share ──────────────────────────────────────────────────────────── */

function ShareSection({ lang, shareUrl, profile }: { lang: ShareLang; shareUrl: string; profile: ProfileView }) {
  const zh = lang === 'zh';
  const [copied, setCopied] = useState(false);

  const tweet = `${profile.archetypeEn} (${profile.code}) — ${zh ? '我的 AIR 类型' : 'my AIR archetype'}`;
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
        <span className="section-number">§ VI · {zh ? '分享' : 'Share'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="btn btn-ghost btn-sm" href={tweetUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackShareClick('twitter', lang)}>
          Twitter
          <span aria-hidden>↗</span>
        </a>
        <a className="btn btn-ghost btn-sm" href={weiboUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackShareClick('weibo', lang)}>
          {zh ? '微博' : 'Weibo'}
          <span aria-hidden>↗</span>
        </a>
        <button className="btn btn-ghost btn-sm" onClick={copy}>
          {copied ? (zh ? '已复制 ✓' : 'Copied ✓') : (zh ? '复制链接' : 'Copy link')}
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

/* ─── Other archetypes (small grid) ──────────────────────────────────── */

function OtherArchetypes({ lang, currentCode }: { lang: ShareLang; currentCode: string }) {
  const zh = lang === 'zh';
  const others = Object.keys(PROFILE_TYPES).filter((c) => c !== currentCode);
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 4rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">§ VII · {zh ? '其他原型' : 'The other 15'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {others.map((code) => {
          const p = PROFILE_TYPES[code];
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
                {zh ? p.archetype.zh : p.archetype.en}
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
  const zh = lang === 'zh';
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="card-strong" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <p className="smallcaps" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {zh ? '想再答一次？' : 'Answer differently?'}
          </p>
          <p className="display-md" style={{ color: 'var(--paper)', marginTop: 8 }}>
            {zh ? '重测一遍。' : 'Take the test again.'}
          </p>
        </div>
        <Link href="/?quiz=1" className="btn btn-lg" style={{ background: 'var(--paper)', color: 'var(--ink-strong)' }}
          onClick={() => trackQuizRetake('share-page', lang)}
        >
          {zh ? '重新开始' : 'Start over'}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
