'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import { useLang } from '@/components/shell/useLang';
import { translations } from '@/lib/translations';
import {
  CURRENT_RATE, KILL_STAGES, MACRO_STATS, TIMELINE, HIGH_RISK_JOBS, MODES,
  LAYOFFS, NET_IMPACT, MACRO_UI, ml,
} from '@/lib/macro_data';

const STAT_KEYS = {
  exposure: { label: 'exposureLabel', desc: 'exposureDesc', source: 'exposureSource', url: 'exposureUrl' },
  proficiency: { label: 'proficiencyLabel', desc: 'proficiencyDesc', source: 'proficiencySource', url: 'proficiencyUrl' },
  jobs: { label: 'jobsBy2030', desc: 'jobsBy2030Desc', source: 'jobsBy2030Source', url: 'jobsBy2030Url' },
} as const;

export default function MacroPage() {
  const [lang] = useLang();
  const tr = translations[lang];
  const m = (k: string) => ml(MACRO_UI[k], lang);

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--paper)' }}>
      <Nav />
      <Intro lang={lang} tr={tr} m={m} />
      <StatsRow lang={lang} tr={tr} />
      <ProgressBar lang={lang} tr={tr} />
      <LastMile lang={lang} tr={tr} m={m} />
      <Timeline lang={lang} m={m} />
      <HighRisk lang={lang} m={m} />
      <Layoffs lang={lang} m={m} />
      <NetImpact lang={lang} m={m} />
      <CtaTail m={m} />
      <Footer />
    </main>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type TR = any;
type Lang = ReturnType<typeof useLang>[0];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <span className="section-number">{children}</span>
      <span className="rule-h" style={{ flex: 1 }} />
    </div>
  );
}

/* ── Intro ── */
function Intro({ lang, tr, m }: { lang: Lang; tr: TR; m: (k: string) => string }) {
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 3.5rem)', paddingBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
      <Eyebrow>{m('eyebrow_intro')}</Eyebrow>
      <h1 className="display-lg" style={{ maxWidth: '20ch' }}>{tr.progressTitle}</h1>
      <p style={{ marginTop: 'clamp(1.25rem, 3vw, 1.75rem)', fontSize: 'var(--step-1)', lineHeight: 1.6, color: 'var(--ink)', maxWidth: '56ch' }}>
        {m('intro_lead')}
      </p>
    </section>
  );
}

/* ── Macro stats ── */
function StatsRow({ lang, tr }: { lang: Lang; tr: TR }) {
  return (
    <section className="page" style={{ paddingTop: '1rem', paddingBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
      <div style={{ display: 'grid', gap: 'clamp(1rem, 2.5vw, 1.75rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {MACRO_STATS.map((s) => {
          const k = STAT_KEYS[s.labelKey];
          return (
            <article key={s.labelKey} className="card" style={{ background: 'var(--paper-card)', padding: 'clamp(1.5rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="percent-display" style={{ color: 'var(--accent)', fontSize: 'var(--step-5)', lineHeight: 1 }}>{s.value}</span>
              <span className="smallcaps" style={{ color: 'var(--ink-strong)' }}>{tr[k.label]}</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', lineHeight: 1.5, marginTop: 4 }}>{tr[k.desc]}</p>
              <a href={tr[k.url]} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', paddingTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--ink-soft)', textDecoration: 'none' }}>
                {tr[k.source]} ↗
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ── The AI replacement progress bar (kill-line) ── */
function ProgressBar({ lang, tr }: { lang: Lang; tr: TR }) {
  const [fill, setFill] = useState(0);
  const [openCalc, setOpenCalc] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFill(CURRENT_RATE), 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <section style={{ background: 'var(--paper-deep)', borderTop: '1px solid var(--paper-rule)', borderBottom: '1px solid var(--paper-rule)', paddingTop: 'clamp(2.5rem, 6vw, 4rem)', paddingBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
          <span className="smallcaps" style={{ color: 'var(--ink-strong)' }}>{tr.killLineLabel}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>{tr.killLineSpeed}</span>
        </div>

        {/* big current number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
          <span className="percent-display" style={{ color: 'var(--accent)', fontSize: 'clamp(3rem, 9vw, 5.5rem)', lineHeight: 0.9 }}>{CURRENT_RATE}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', color: 'var(--accent)', opacity: 0.6 }}>%</span>
        </div>

        {/* bar */}
        <div style={{ position: 'relative', marginTop: 28, marginBottom: 8 }}>
          {/* WE ARE HERE marker */}
          <div style={{ position: 'absolute', top: -22, left: `${CURRENT_RATE}%`, transform: 'translateX(-50%)', transition: 'left 1.2s cubic-bezier(.2,.8,.2,1)', zIndex: 3, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 700 }}>↓ {ml(MACRO_UI.marker_here, lang)}</span>
          </div>
          <div style={{ position: 'relative', height: 26, borderRadius: 6, overflow: 'hidden', background: 'var(--paper)', border: '1px solid var(--paper-rule)' }}>
            {/* kill zone hatch 80-100 */}
            <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: '80%', right: 0, background: 'repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 16%, transparent) 0 6px, transparent 6px 12px)' }} />
            {/* fill */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${fill}%`, transition: 'width 1.4s cubic-bezier(.2,.8,.2,1)', background: 'linear-gradient(90deg, var(--accent-glow), var(--accent))' }} />
            {/* stage dividers */}
            {[20, 40, 60, 80].map((p) => (
              <div key={p} aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, background: 'var(--paper-rule)' }} />
            ))}
          </div>
          {/* stage labels */}
          <div style={{ display: 'flex', marginTop: 10 }}>
            {KILL_STAGES.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', paddingInline: 4 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.06em', color: s.kill ? 'var(--accent)' : 'var(--ink)', fontWeight: 600 }}>{ml(s.label, lang)}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.3 }}>{ml(s.blurb, lang)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* how we calculate */}
        <button onClick={() => setOpenCalc((v) => !v)} className="btn btn-ghost btn-sm" style={{ marginTop: 22 }}>
          {tr.killLineHow} {openCalc ? '−' : '+'}
        </button>
        {openCalc && (
          <div className="card" style={{ marginTop: 14, padding: 'clamp(1.25rem, 3vw, 1.75rem)', background: 'var(--paper-card)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--ink-strong)' }}>{tr.killLineFormula}</p>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <div>
                <p className="smallcaps" style={{ color: 'var(--accent)' }}>{tr.killLineExposure}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', lineHeight: 1.5, marginTop: 4 }}>{tr.killLineExposureDesc}</p>
              </div>
              <div>
                <p className="smallcaps" style={{ color: 'var(--accent)' }}>{tr.killLineProbability}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', lineHeight: 1.5, marginTop: 4 }}>{tr.killLineProbabilityDesc}</p>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink)', background: 'var(--paper-deep)', padding: '10px 12px', borderRadius: 8 }}>{tr.killLineExample}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-mute)' }}>{tr.killLineAggregation}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tr.killLineNote}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', borderTop: '1px dotted var(--paper-rule)', paddingTop: 10 }}>{tr.killLineSource}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── The last mile (data threat) ── */
function LastMile({ lang, tr, m }: { lang: Lang; tr: TR; m: (k: string) => string }) {
  const steps = [
    { t: tr.lastMileStep1, d: tr.lastMileStep1Desc },
    { t: tr.lastMileStep2, d: tr.lastMileStep2Desc },
    { t: tr.lastMileStep3, d: tr.lastMileStep3Desc },
  ];
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
      <Eyebrow>{m('eyebrow_threat')}</Eyebrow>
      <h2 className="display-md" style={{ maxWidth: '22ch' }}>{tr.dataThreatTitle}</h2>
      <p style={{ marginTop: 14, fontSize: 'var(--step-1)', color: 'var(--ink)', lineHeight: 1.55, maxWidth: '54ch' }}>{tr.dataThreatSubtitle}</p>

      <div style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1.25rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 'clamp(1.75rem, 4vw, 2.5rem)', alignItems: 'stretch' }}>
        {steps.map((s, i) => (
          <article key={i} className="card" style={{ background: i === 2 ? 'color-mix(in srgb, var(--accent) 8%, var(--paper-card))' : 'var(--paper-card)', padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: 8, borderColor: i === 2 ? 'color-mix(in srgb, var(--accent) 30%, var(--paper-rule))' : 'var(--paper-rule)' }}>
            <span className="section-number" style={{ color: i === 2 ? 'var(--accent)' : 'var(--ink-soft)' }}>§ 0{i + 1}</span>
            <h3 className="display-sm" style={{ fontSize: 'var(--step-1)', color: i === 2 ? 'var(--accent)' : 'var(--ink-strong)' }}>{s.t}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-mute)', lineHeight: 1.5 }}>{s.d}</p>
            {i < 2 && <span style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--ink-soft)' }}>{i === 0 ? tr.lastMileArrow1 : tr.lastMileArrow2} →</span>}
          </article>
        ))}
      </div>

      <p style={{ marginTop: 24, padding: '14px 18px', borderLeft: '3px solid var(--accent)', background: 'color-mix(in srgb, var(--accent) 6%, transparent)', fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.5, maxWidth: '60ch' }}>
        {tr.lastMileWarning}
      </p>
    </section>
  );
}

/* ── Timeline ── */
function Timeline({ lang, m }: { lang: Lang; m: (k: string) => string }) {
  return (
    <section style={{ background: 'var(--paper-deep)', borderTop: '1px solid var(--paper-rule)', borderBottom: '1px solid var(--paper-rule)', paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <div className="page">
        <Eyebrow>{m('eyebrow_timeline')}</Eyebrow>
        <h2 className="display-md">{m('timeline_title')}</h2>
        <p style={{ marginTop: 12, color: 'var(--ink-mute)', fontSize: 'var(--step-0)', maxWidth: '48ch' }}>{m('timeline_sub')}</p>

        <ol style={{ listStyle: 'none', margin: 'clamp(2rem, 4vw, 3rem) 0 0', padding: 0, position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 2, background: 'var(--paper-rule)' }} />
          {TIMELINE.map((n) => {
            const accent = n.now;
            return (
              <li key={n.year} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                <span aria-hidden style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: 999, background: accent ? 'var(--accent)' : 'var(--paper)', border: `2px solid ${accent ? 'var(--accent)' : 'var(--ink-soft)'}`, boxShadow: accent ? '0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent)' : 'none' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: accent ? 'var(--accent)' : 'var(--ink-soft)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {n.now ? new Date().getFullYear() : n.year}
                  </span>
                  <span className="italic-display" style={{ fontStyle: 'italic', fontSize: 'var(--step-2)', color: 'var(--ink-strong)' }}>{ml(n.name, lang)}</span>
                  {n.now && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '1px 8px' }}>{m('now_label').toUpperCase()}</span>}
                  {n.projected && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', color: 'var(--ink-soft)', border: '1px dashed var(--ink-soft)', borderRadius: 999, padding: '1px 8px' }}>{m('projected_label').toUpperCase()}</span>}
                </div>
                <p style={{ marginTop: 6, fontSize: '0.95rem', color: 'var(--ink-mute)', lineHeight: 1.5, maxWidth: '52ch' }}>{ml(n.impact, lang)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── High-risk jobs ── */
function HighRisk({ lang, m }: { lang: Lang; m: (k: string) => string }) {
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
      <Eyebrow>{m('eyebrow_risk')}</Eyebrow>
      <h2 className="display-md" style={{ maxWidth: '20ch' }}>{m('risk_title')}</h2>
      <p style={{ marginTop: 12, color: 'var(--ink)', fontSize: 'var(--step-0)', lineHeight: 1.55, maxWidth: '58ch' }}>{m('risk_sub')}</p>

      <div style={{ marginTop: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--paper-rule)' }}>
        {HIGH_RISK_JOBS.map((j, i) => {
          const mode = MODES[j.mode];
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1.1fr) 64px minmax(140px, 1.3fr) minmax(0, 1.8fr)', gap: 'clamp(8px, 2vw, 18px)', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--paper-rule)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-strong)', fontSize: '0.95rem' }}>{ml(j.industry, lang)}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: mode.color, marginTop: 3 }}>● {ml(mode.label, lang)}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: mode.color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{j.risk}<span style={{ fontSize: '0.7rem', opacity: 0.6 }}>%</span></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{ml(j.jobs, lang)}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', lineHeight: 1.45 }}>{ml(j.reason, lang)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Layoffs ── */
function Layoffs({ lang, m }: { lang: Lang; m: (k: string) => string }) {
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
      <Eyebrow>{m('eyebrow_layoffs')}</Eyebrow>
      <h2 className="display-md" style={{ maxWidth: '22ch' }}>{m('layoffs_title')}</h2>
      <p style={{ marginTop: 12, color: 'var(--ink-mute)', fontSize: 'var(--step-0)', lineHeight: 1.55, maxWidth: '56ch' }}>{m('layoffs_sub')}</p>

      <div style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1.25rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
        {LAYOFFS.map((c, i) => (
          <article key={i} className="card" style={{ background: 'var(--paper-card)', padding: 'clamp(1.25rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="smallcaps" style={{ color: 'var(--ink-strong)' }}>{ml(c.company, lang)}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="percent-display" style={{ color: 'var(--accent)', fontSize: 'var(--step-3)', lineHeight: 1 }}>{c.layoffs}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>{m('layoffs_cut')}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-mute)', lineHeight: 1.45, marginTop: 2 }}>{ml(c.reason, lang)}</p>
            <span style={{ marginTop: 'auto', paddingTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-soft)', letterSpacing: '0.06em' }}>{ml(c.industry, lang)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Net impact ── */
function NetImpact({ lang, m }: { lang: Lang; m: (k: string) => string }) {
  const cells = [NET_IMPACT.displaced, NET_IMPACT.created, NET_IMPACT.net];
  return (
    <section style={{ background: 'var(--paper-deep)', borderTop: '1px solid var(--paper-rule)', borderBottom: '1px solid var(--paper-rule)', paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <div className="page">
        <Eyebrow>{m('eyebrow_net')}</Eyebrow>
        <h2 className="display-md">{m('net_title')}</h2>
        <div style={{ display: 'grid', gap: 'clamp(1rem, 3vw, 2rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          {cells.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="percent-display" style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', lineHeight: 1, color: i === 2 ? 'var(--accent)' : 'var(--ink-strong)' }}>{c.value}</div>
              <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--ink-mute)' }}>{ml(c.label, lang)}</p>
            </div>
          ))}
        </div>
        <p className="reading" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)', fontSize: 'var(--step-1)', lineHeight: 1.6, color: 'var(--ink)', maxWidth: '60ch' }}>{m('net_reality')}</p>
        <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>{ml(NET_IMPACT.source, lang)}</p>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CtaTail({ m }: { m: (k: string) => string }) {
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 6vw, 4.5rem)', paddingBottom: 'clamp(4rem, 9vw, 6.5rem)' }}>
      <div className="card-strong cta-tail" style={{ padding: 'clamp(2.5rem, 6vw, 4rem)' }}>
        <div>
          <p className="smallcaps" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>{m('cta_eyebrow')}</p>
          <h2 className="display-lg" style={{ color: 'var(--paper)', marginTop: 12, maxWidth: '16ch' }}>{m('cta_title')}</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <Link href="/?quiz=1" className="btn btn-lg" style={{ background: 'var(--paper)', color: 'var(--ink-strong)' }}>
            {m('cta_button')}<span aria-hidden>→</span>
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.16em', color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>{m('cta_sub')}</p>
        </div>
      </div>
    </section>
  );
}
