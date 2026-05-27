'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Nav from '@/components/shell/Nav';
import Footer from '@/components/shell/Footer';
import QuizFlow from '@/components/quiz/QuizFlow';
import ArchetypeSvg from '@/components/result/ArchetypeSvg';
import { useLang } from '@/components/shell/useLang';
import { PROFILE_TYPES, QUIZ_DIMENSIONS } from '@/lib/air_quiz_data';
import { L } from '@/lib/translations';
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

  useEffect(() => {
    setInQuiz(params.get('quiz') === '1');
  }, [params]);

  const startQuiz = () => {
    trackCtaClick('start_quiz', 'landing');
    router.push('/?quiz=1');
  };

  const exitQuiz = () => {
    router.push('/');
  };

  if (inQuiz) {
    return (
      <main style={{ minHeight: '100dvh', background: 'var(--paper)' }}>
        <Nav />
        <QuizFlow lang={lang} onExit={exitQuiz} />
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

/* ───────────────────────────────────────────────────────────────────────
   HERO
   ─ asymmetric editorial split: headline + lead on left, single archetype
     glyph on the right. Big italic display serif, terracotta accent on
     the operative word.
   ─────────────────────────────────────────────────────────────────────── */

function Hero({ lang, onStart }: { lang: 'en'|'zh'|'ja'|'ko'|'de'; onStart: () => void }) {
  const zh = lang === 'zh';
  // Rotate which character peeks — pseudo-random but stable per page load
  const FEATURED = ['TSRH', 'EOFP', 'TSFH', 'ESRP', 'TORH'];
  const [code, setCode] = useState<string>('TSRH');
  useEffect(() => {
    setCode(FEATURED[Math.floor(Math.random() * FEATURED.length)]);
  }, []);

  return (
    <section
      className="page"
      style={{
        paddingTop: 'clamp(2rem, 6vw, 4.5rem)',
        paddingBottom: 'clamp(4rem, 10vw, 7rem)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 'clamp(2rem, 5vw, 4rem)',
        alignItems: 'center',
      }}
    >
      <div style={{ minWidth: 0 }}>
        {/* Eyebrow */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <span className="section-number">§ 01</span>
          <span className="smallcaps">{zh ? '一份关于工作的问卷' : 'A survey about your work'}</span>
        </div>

        {/* Headline */}
        <h1 className="display-xl animate-fade-up" style={{ animationDelay: '60ms' }}>
          {zh ? (
            <>哪种 <span className="italic-display" style={{ color: 'var(--accent)' }}>人</span>，<br />AI 取代不了？</>
          ) : (
            <>The kind of <span className="italic-display" style={{ color: 'var(--accent)' }}>human</span><br />AI cannot replace.</>
          )}
        </h1>

        {/* Lead */}
        <p
          className="reading animate-fade-up"
          style={{
            animationDelay: '140ms',
            marginTop: 'clamp(1.25rem, 3vw, 2rem)',
            fontSize: 'var(--step-1)',
            lineHeight: 1.55,
            color: 'var(--ink)',
            maxWidth: '38ch',
          }}
        >
          {zh
            ? '一份 16 题的测试，把你的工作映射到 16 个原型中的一个——从《玻璃大炮》到《铁壁堡垒》。基于 BLS、O*NET 与 Anthropic Economic Index。'
            : 'A 16-question test maps your work to one of sixteen archetypes — from the Glass Cannon to the Iron Fortress. Built on BLS, O*NET, and the Anthropic Economic Index.'}
        </p>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: '220ms', marginTop: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={onStart} className="btn btn-primary btn-lg">
            {zh ? '开始测试' : 'Take the test'}
            <span aria-hidden>→</span>
          </button>
          <Link href="#archetypes" className="btn btn-text" style={{ padding: '0.5em 0' }}>
            {zh ? '先看看 16 种原型' : 'Browse the 16 archetypes'}
          </Link>
        </div>

        {/* Microcopy */}
        <p className="marginalia animate-fade-up" style={{ animationDelay: '280ms', marginTop: 22, color: 'var(--ink-soft)' }}>
          {zh ? '约 4 分钟 · 完全匿名 · 无需注册' : 'c. 4 min · fully anonymous · no signup'}
        </p>
      </div>

      {/* Featured archetype glyph */}
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
        <FeaturedGlyph code={code} />
      </div>
    </section>
  );
}

function FeaturedGlyph({ code }: { code: string }) {
  const profile = PROFILE_TYPES[code];
  if (!profile) return null;
  return (
    <div style={{ position: 'relative', maxWidth: 380, width: '100%' }}>
      {/* Soft warm radial backdrop */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-15%',
          background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${profile.color} 22%, transparent), transparent 65%)`,
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />
      {/* Decorative tag */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 4,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--paper)',
          border: '1px solid var(--paper-rule)',
          padding: '6px 12px',
          borderRadius: 999,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          color: 'var(--ink-mute)',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, background: profile.color }} />
        <span>1 / 16</span>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ArchetypeSvg code={code} size={360} />
      </div>
      {/* Caption */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <p className="italic-display" style={{ fontSize: '1.45rem', color: 'var(--ink-strong)' }}>
          {profile.archetype.en}
        </p>
        <p className="smallcaps" style={{ marginTop: 4 }}>{code}</p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   DIMENSIONS — Four axes briefly explained
   ─────────────────────────────────────────────────────────────────────── */

function DimensionsSection({ lang }: { lang: 'en'|'zh'|'ja'|'ko'|'de' }) {
  const zh = lang === 'zh';
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
          <span className="section-number">§ 02</span>
          <span className="smallcaps">{zh ? '四个维度' : 'The four axes'}</span>
          <span className="rule-h" style={{ flex: 1 }} />
        </div>

        <h2 className="display-md" style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)', maxWidth: '22ch' }}>
          {zh ? '决定你被替代速度的，是四个互相独立的维度。' : 'Four independent axes decide how fast AI can come for your work.'}
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
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: 3,
                  background: DIM_COLORS[i],
                }}
              />
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

/* ───────────────────────────────────────────────────────────────────────
   ARCHETYPE GRID — All 16 cards, salon-style
   ─────────────────────────────────────────────────────────────────────── */

function ArchetypeGrid({ lang }: { lang: 'en'|'zh'|'ja'|'ko'|'de' }) {
  const zh = lang === 'zh';
  const codes = Object.keys(PROFILE_TYPES);

  return (
    <section
      id="archetypes"
      className="page"
      style={{
        paddingTop: 'clamp(4rem, 9vw, 7rem)',
        paddingBottom: 'clamp(3rem, 7vw, 5rem)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">§ 03</span>
        <span className="smallcaps">{zh ? '十六种原型' : 'Sixteen archetypes'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <h2 className="display-md" style={{ maxWidth: '22ch', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        {zh ? '排列开来——你的位置就在某一格里。' : 'Laid out in full — yours is one of these.'}
      </h2>

      <div style={{
        display: 'grid',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      }}>
        {codes.map((code) => {
          const p = PROFILE_TYPES[code];
          return (
            <Link
              key={code}
              href={`/profile/${code}?lang=${lang}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.25rem 1.1rem 1rem',
                borderRadius: 14,
                background: 'var(--paper-card)',
                border: '1px solid var(--paper-rule)',
                textDecoration: 'none',
                color: 'var(--ink)',
                transition: 'transform .25s ease, border-color .25s ease, background .25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = p.color;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--paper-rule)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.22em', color: p.color, fontWeight: 600 }}>
                  {code}
                </span>
                <span style={{
                  width: 8, height: 8, borderRadius: 999,
                  background: p.color,
                }} />
              </div>
              <div style={{
                height: 110,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
              }}>
                <ArchetypeSvg code={code} size={110} />
              </div>
              <p className="italic-display" style={{ fontSize: '1.15rem', color: 'var(--ink-strong)', marginTop: 4 }}>
                {zh ? p.archetype.zh : p.archetype.en}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.4 }}>
                {(zh ? p.tagline.zh : p.tagline.en).slice(0, 78)}{(zh ? p.tagline.zh : p.tagline.en).length > 78 ? '…' : ''}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   METHODOLOGY (brief, editorial)
   ─────────────────────────────────────────────────────────────────────── */

function Methodology({ lang }: { lang: 'en'|'zh'|'ja'|'ko'|'de' }) {
  const zh = lang === 'zh';
  return (
    <section className="page" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className="section-number">§ 04</span>
        <span className="smallcaps">{zh ? '方法论' : 'Methodology'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <div style={{
        display: 'grid',
        gap: 'clamp(2rem, 5vw, 4rem)',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
        alignItems: 'start',
      }}>
        <div>
          <h2 className="display-md" style={{ marginBottom: 18 }}>
            {zh ? '为什么这测试是认真的。' : 'Why this test is serious.'}
          </h2>
          <p style={{ color: 'var(--ink-mute)', fontSize: '0.95rem' }}>
            {zh ? '不是个性测验。' : 'Not a personality quiz.'}
          </p>
        </div>
        <div className="reading drop-cap" style={{ fontSize: 'var(--step-1)', lineHeight: 1.65, color: 'var(--ink)' }}>
          {zh ? (
            <p>
              AIR 的四个维度——可学习性、评判标准、风险容忍、人的存在——来自自动化经济学文献。打分用加权幂均值 (r=-2)，对应"瑞士奶酪屏障模型"——任一维度足够坚固即可阻断 AI 替代链路。底层数据集对齐 BLS OES 2023（798 个职业）、O*NET 任务结构、Eloundou et al. 2023 任务暴露度，以及 OpenAI GDPval 的盲评胜率。
            </p>
          ) : (
            <p>
              The four axes — Learnability, Evaluation, Risk Tolerance, Human Presence — are drawn from automation-economics literature. Scoring uses a Weighted Power Mean (r=-2): the Swiss Cheese Barrier Model, where one strong axis is enough to break AI's replacement chain. Underlying data: BLS OES 2023 (798 occupations), O*NET task structure, Eloundou et al. 2023 task exposure, OpenAI GDPval blind-judged win rates.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   TAIL CTA
   ─────────────────────────────────────────────────────────────────────── */

function CtaTail({ lang, onStart }: { lang: 'en'|'zh'|'ja'|'ko'|'de'; onStart: () => void }) {
  const zh = lang === 'zh';
  return (
    <section className="page" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)', paddingBottom: 'clamp(5rem, 10vw, 7rem)' }}>
      <div
        className="card-strong"
        style={{
          padding: 'clamp(2.5rem, 6vw, 4.5rem)',
          display: 'grid',
          gap: 'clamp(2rem, 4vw, 3rem)',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          alignItems: 'center',
        }}
      >
        <div>
          <p className="smallcaps" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {zh ? '只需 4 分钟' : 'Four minutes'}
          </p>
          <h2
            className="display-lg"
            style={{
              color: 'var(--paper)',
              marginTop: 12,
              maxWidth: '18ch',
            }}
          >
            {zh ? (
              <>知道自己 <em className="italic-display" style={{ color: 'var(--accent-glow)' }}>是哪一种</em>。</>
            ) : (
              <>Find out <em className="italic-display" style={{ color: 'var(--accent-glow)' }}>which one</em> you are.</>
            )}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <button
            onClick={onStart}
            className="btn btn-lg"
            style={{ background: 'var(--paper)', color: 'var(--ink-strong)' }}
          >
            {zh ? '开始测试' : 'Take the test'}
            <span aria-hidden>→</span>
          </button>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.16em', color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
            {zh ? '16 题 · 匿名 · 即时结果' : '16 Q · anonymous · instant result'}
          </p>
        </div>
      </div>
    </section>
  );
}
