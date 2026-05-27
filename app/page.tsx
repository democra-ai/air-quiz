'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import QuizFlow from '@/components/quiz/QuizFlow';
import ArchetypeSvg from '@/components/result/ArchetypeSvg';
import HeroCarousel from '@/components/result/HeroCarousel';
import { useLang } from '@/components/shell/useLang';
import { PROFILE_TYPES, QUIZ_DIMENSIONS } from '@/lib/air_quiz_data';
import { L, type Language } from '@/lib/translations';
import { ui } from '@/lib/ui_text';
import { trackCtaClick } from '@/lib/analytics';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [lang] = useLang();
  const [inQuiz, setInQuiz] = useState(false);
  const mode: 'quick' | 'full' = params.get('mode') === 'full' ? 'full' : 'quick';

  useEffect(() => { setInQuiz(params.get('quiz') === '1'); }, [params]);

  const startQuiz = () => {
    trackCtaClick('start_quiz', 'landing');
    router.push('/?quiz=1');
  };
  const exitQuiz = () => { router.push('/'); };

  if (inQuiz) {
    return (
      <main style={{ minHeight: '100dvh', background: 'var(--paper)' }}>
        <Nav />
        <QuizFlow lang={lang} initialMode={mode} onExit={exitQuiz} />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100dvh' }}>
      <Nav />
      <Hero lang={lang} onStart={startQuiz} />
      <DimensionsSection lang={lang} />
      <ArchetypeGrid lang={lang} />
      <Methodology lang={lang} />
      <CtaTail lang={lang} onStart={startQuiz} />
      <Footer />
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────────────────────── */
function Hero({ lang, onStart }: { lang: Language; onStart: () => void }) {
  const t = ui(lang).hero;

  return (
    <section
      className="page split-hero"
      style={{
        paddingTop: 'clamp(2rem, 6vw, 4.5rem)',
        paddingBottom: 'clamp(4rem, 10vw, 7rem)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="section-number">{t.eyebrow}</span>
          <span className="smallcaps">{t.eyebrow_label}</span>
        </div>

        <h1
          className="display-lg animate-fade-up"
          style={{
            animationDelay: '60ms',
            /* Let the headline flow naturally — typically 2–3 lines on desktop,
               3 lines on mobile. The explicit \n from the headline segment is
               kept but only enforces one mandatory break. */
            whiteSpace: 'pre-line',
            maxWidth: '18ch',
          }}
        >
          {t.headline.pre}
          <span className="italic-display" style={{ color: 'var(--accent)' }}>{t.headline.em}</span>
          {t.headline.post}
        </h1>

        <p
          className="animate-fade-up"
          style={{
            animationDelay: '140ms',
            marginTop: 'clamp(1.25rem, 3vw, 2rem)',
            fontSize: 'var(--step-1)',
            lineHeight: 1.55,
            color: 'var(--ink)',
            maxWidth: '52ch',
          }}
        >
          {t.lead}
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '220ms', marginTop: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={onStart} className="btn btn-primary btn-lg">
            {t.cta_primary}<span aria-hidden>→</span>
          </button>
          <Link href="#archetypes" className="btn btn-text" style={{ padding: '0.5em 0' }}>
            {t.cta_secondary}
          </Link>
        </div>

        <p className="marginalia animate-fade-up" style={{ animationDelay: '280ms', marginTop: 22, color: 'var(--ink-soft)' }}>
          {t.microcopy}
        </p>
      </div>

      <div
        className="animate-fade-in"
        style={{
          animationDelay: '160ms',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'clamp(220px, 36vw, 440px)',
        }}
      >
        <HeroCarousel lang={lang} />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DIMENSIONS
   ────────────────────────────────────────────────────────────────────────── */
function DimensionsSection({ lang }: { lang: Language }) {
  const t = ui(lang).dimensions;
  const DIM_COLORS = ['var(--dim-1)', 'var(--dim-2)', 'var(--dim-3)', 'var(--dim-4)'];
  return (
    <section
      style={{
        background: 'var(--paper-deep)',
        borderTop: '1px solid var(--paper-rule)',
        borderBottom: '1px solid var(--paper-rule)',
        paddingTop: 'clamp(3rem, 8vw, 5.5rem)',
        paddingBottom: 'clamp(3rem, 8vw, 5.5rem)',
      }}
    >
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="section-number">{t.eyebrow}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>
        <h2 className="display-md" style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)', maxWidth: '22ch' }}>
          {t.headline}
        </h2>

        <div style={{
          display: 'grid',
          gap: 'clamp(1rem, 2.5vw, 1.75rem)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}>
          {QUIZ_DIMENSIONS.map((d, i) => (
            <article
              key={d.id}
              className="card"
              style={{
                background: 'var(--paper)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                borderColor: 'var(--paper-rule)',
                display: 'flex', flexDirection: 'column', gap: 14,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: DIM_COLORS[i] }} />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span className="section-number">§ 0{i + 1}</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.18em' }}>
                  <span style={{ color: DIM_COLORS[i], fontWeight: 600 }}>{d.favorableLetter}</span>
                  <span style={{ color: 'var(--ink-soft)' }}>/</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{d.resistantLetter}</span>
                </div>
              </div>
              <h3 className="display-sm" style={{ fontSize: 'var(--step-2)' }}>
                {L(d.name, lang)}
              </h3>
              <p style={{ fontSize: 'var(--step-0)', color: 'var(--ink-mute)', lineHeight: 1.5 }}>
                {L(d.description, lang)}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px dotted var(--paper-rule)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                <span>{L(d.favorableLabel, lang)}</span>
                <span>↔</span>
                <span>{L(d.resistantLabel, lang)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ARCHETYPE GRID
   ────────────────────────────────────────────────────────────────────────── */
function ArchetypeGrid({ lang }: { lang: Language }) {
  const t = ui(lang).archetypes_section;
  const codes = Object.keys(PROFILE_TYPES);

  return (
    <section
      id="archetypes"
      className="page"
      style={{ paddingTop: 'clamp(4rem, 9vw, 7rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <h2 className="display-md" style={{ maxWidth: '22ch', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        {t.headline}
      </h2>

      <div style={{
        display: 'grid',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      }}>
        {codes.map((code) => {
          const p = PROFILE_TYPES[code];
          const archetype = L(p.archetype, lang);
          const tagline = L(p.tagline, lang);
          return (
            <Link
              key={code}
              id={`type-${code}`}
              href={`/profile/${code}?lang=${lang}`}
              className="type-card"
              style={{
                /* Custom prop the .type-card[data-pulse="1"] CSS reads — lets
                   the brief highlight ring after a hero-click use the right
                   archetype color. */
                ['--type-color' as string]: p.color,
                display: 'flex', flexDirection: 'column',
                padding: '1.25rem 1.1rem 1rem', borderRadius: 14,
                background: 'var(--paper-card)', border: '1px solid var(--paper-rule)',
                textDecoration: 'none', color: 'var(--ink)',
                transition: 'transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .35s ease',
                position: 'relative', overflow: 'hidden',
                scrollMarginTop: '90px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--paper-rule)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.22em', color: p.color, fontWeight: 600 }}>
                  {code}
                </span>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: p.color }} />
              </div>
              <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <ArchetypeSvg code={code} size={110} />
              </div>
              <p className="italic-display" style={{ fontSize: '1.15rem', color: 'var(--ink-strong)', marginTop: 4 }}>
                {archetype}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.4 }}>
                {tagline.length > 78 ? tagline.slice(0, 78) + '…' : tagline}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   METHODOLOGY
   ────────────────────────────────────────────────────────────────────────── */
function Methodology({ lang }: { lang: Language }) {
  const t = ui(lang).methodology;
  const m = ui(lang).meta;
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">{t.eyebrow}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>
      <div className="split-1-2">
        <div>
          <h2 className="display-md" style={{ marginBottom: 18 }}>{t.headline}</h2>
          <p style={{ color: 'var(--ink-mute)', fontSize: '0.95rem' }}>{t.kicker}</p>
        </div>
        <div className="reading drop-cap" style={{ fontSize: 'var(--step-1)', lineHeight: 1.65, color: 'var(--ink)' }}>
          <p>{m.methodology_lead}</p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAIL CTA
   ────────────────────────────────────────────────────────────────────────── */
function CtaTail({ lang, onStart }: { lang: Language; onStart: () => void }) {
  const t = ui(lang).cta_tail;
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)', paddingBottom: 'clamp(5rem, 10vw, 7rem)' }}>
      <div
        className="card-strong cta-tail"
        style={{ padding: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        <div>
          <p className="smallcaps" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {t.eyebrow}
          </p>
          <h2 className="display-lg" style={{ color: 'var(--paper)', marginTop: 12, maxWidth: '18ch' }}>
            {t.headline.pre}
            <em className="italic-display" style={{ color: 'var(--accent-glow)' }}>{t.headline.em}</em>
            {t.headline.post}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <button
            onClick={onStart}
            className="btn btn-lg"
            style={{ background: 'var(--paper)', color: 'var(--ink-strong)' }}
          >
            {t.cta}<span aria-hidden>→</span>
          </button>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.16em', color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {t.sub}
          </p>
        </div>
      </div>
    </section>
  );
}
