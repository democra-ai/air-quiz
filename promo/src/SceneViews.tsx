import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, serif, ARCHETYPES, type Lang } from './theme';

const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const fadeIO = (f: number, dur: number, inN = 12, outN = 14) =>
  Math.min(ease(f, 0, inN), interpolate(f, [dur - outN, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const shot = (lang: Lang, name: string) => staticFile(`shots/${name}-${lang}.png`);
const charSrc = (code: string) => staticFile(`characters-art/${code}.png`);

type SP = { lang: Lang; dur: number; caption: string };

const Plate: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 1 }) => (
  <Img src={src} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', opacity }} />
);

const Cursor: React.FC<{ x: number; y: number; clicks?: number[] }> = ({ x, y, clicks = [] }) => {
  const f = useCurrentFrame();
  let press = 1;
  for (const c of clicks) press = Math.min(press, interpolate(f, [c - 4, c, c + 6], [1, 0.78, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y, transform: `scale(${press})`, transformOrigin: '3px 3px', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.35))', zIndex: 5 }}>
      <path d="M3 2 L3 20 L8 15 L11 22 L14 21 L11 14 L18 14 Z" fill="#fff" stroke={C.inkStrong} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
};

const Sub: React.FC<{ text: string; f: number; dur: number; size?: number }> = ({ text, f, dur, size = 46 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 56, background: 'linear-gradient(to top, rgba(247,242,232,0.98), rgba(247,242,232,0))', opacity: fadeIO(f, dur) }}>
    <div style={{ fontFamily: serif, fontWeight: 700, fontSize: size, lineHeight: 1.18, color: C.inkStrong, textAlign: 'center', maxWidth: 1500, whiteSpace: 'pre-line' }}>{text}</div>
  </div>
);

/* ── Reusable 4×4 archetype wall (the "16 types" visual) ── */
const EMPTY_IDX = 9;
const GridWall: React.FC<{ lang: Lang; mode: 'reveal' | 'which' | 'bg'; dur: number }> = ({ lang, mode }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 232px)', gap: 16, marginTop: mode === 'bg' ? 0 : -54 }}>
        {ARCHETYPES.map((a, i) => {
          const isEmpty = mode === 'which' && i === EMPTY_IDX;
          const rin = mode === 'reveal' ? spring({ frame: f - 8 - i * 3, fps, config: { damping: 16 } }) : 1;
          const dim = mode === 'which' && !isEmpty;
          const op = mode === 'bg' ? 0.1 : dim ? 0.28 : rin;
          const pulse = 0.75 + 0.25 * Math.sin(f / 6);
          return (
            <div key={a.code} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: op, transform: `scale(${mode === 'reveal' ? interpolate(rin, [0, 1], [0.82, 1]) : 1})`, filter: dim ? 'grayscale(0.7)' : 'none' }}>
              {isEmpty ? (
                <div style={{ width: 108, height: 108, borderRadius: 12, border: `2px dashed ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.accent}10`, opacity: pulse }}>
                  <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 60, color: C.accent }}>?</span>
                </div>
              ) : (
                <Img src={charSrc(a.code)} style={{ width: 108, height: 108, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
              )}
              {mode !== 'bg' && <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: isEmpty ? C.accent : C.inkSoft }}>{isEmpty ? '???' : a.code}</div>}
              {mode !== 'bg' && <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: C.inkStrong, textAlign: 'center', maxWidth: 210, lineHeight: 1.1 }}>{isEmpty ? (lang === 'zh' ? '你？' : 'You?') : (lang === 'zh' ? a.zh : a.en)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── hook · real Hero + the MBTI hook ── */
const Hook: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur, 1, 16) }}>
      <Plate src={shot(lang, 'hero')} />
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)` }} />
      <Sub text={caption} f={f} dur={dur} size={56} />
    </AbsoluteFill>
  );
};

/* ── grid · the 16 types ── */
const Grid: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <GridWall lang={lang} mode="reveal" dur={dur} />
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── axes · motion graphic ── */
const AXES: { label: { en: string; zh: string }; a: string; b: string; pick: 0 | 1; letter: string }[] = [
  { label: { en: 'Learnability', zh: '可学习性' }, a: 'Explicit', b: 'Tacit', pick: 0, letter: 'E' },
  { label: { en: 'Evaluation', zh: '评判标准' }, a: 'Objective', b: 'Subjective', pick: 1, letter: 'S' },
  { label: { en: 'Risk', zh: '风险容忍' }, a: 'Flexible', b: 'Rigid', pick: 0, letter: 'F' },
  { label: { en: 'Human', zh: '人的存在' }, a: 'Product', b: 'Human', pick: 0, letter: 'P' },
];
const AXES_Q: { en: string; zh: string }[] = [
  { en: 'Can AI learn it?', zh: 'AI 学得会吗？' },
  { en: 'Can it be measured?', zh: '好坏量得出吗？' },
  { en: 'Can mistakes be undone?', zh: '错得起吗？' },
  { en: 'Do they need YOU?', zh: '非你不可吗？' },
];
const Axes: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), padding: '110px 140px', justifyContent: 'center' }}>
      <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 60, color: C.inkStrong, opacity: ease(f, 4, 20), whiteSpace: 'pre-line', marginBottom: 10 }}>{caption}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 26, margin: '18px 0 40px' }}>
        {AXES.map((ax, i) => {
          const s = spring({ frame: f - (30 + i * 20), fps, config: { damping: 14 } });
          return <div key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 110, color: C.accent, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>{ax.letter}</div>;
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1360, margin: '0 auto', width: '100%' }}>
        {AXES.map((ax, i) => {
          const p = spring({ frame: f - (26 + i * 20), fps, config: { damping: 16 } });
          const pos = ax.pick === 0 ? interpolate(p, [0, 1], [50, 12]) : interpolate(p, [0, 1], [50, 88]);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: ease(f, 8 + i * 8, 24 + i * 8) }}>
              <div style={{ width: 320, fontFamily: serif, fontStyle: 'italic', fontSize: 26, color: C.inkMute }}>{AXES_Q[i][lang]}</div>
              <div style={{ flex: 1, position: 'relative', height: 48 }}>
                <div style={{ position: 'absolute', top: 23, left: 100, right: 100, height: 2, background: C.rule }} />
                <span style={{ position: 'absolute', left: 0, top: 4, fontFamily: serif, fontSize: 28, color: ax.pick === 0 ? C.accent : C.inkSoft }}>{ax.a}</span>
                <span style={{ position: 'absolute', right: 0, top: 4, fontFamily: serif, fontSize: 28, color: ax.pick === 1 ? C.accent : C.inkSoft }}>{ax.b}</span>
                <div style={{ position: 'absolute', top: 14, left: `${pos}%`, transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: 999, background: C.accent, boxShadow: `0 0 0 6px ${C.accent}33` }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ── quiz · real footage + Screen-Studio focus-zoom on the click ── */
const Quiz: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FX = 540, FY = 300;
  const click1 = Math.round(dur * 0.36);
  const click2 = Math.round(dur * 0.7);
  const oSel = ease(f, click1, click1 + 7);
  const oNext = ease(f, click2, click2 + 9);
  const cx = interpolate(ease(f, 6, click1 - 4), [0, 1], [1520, FX + 78]);
  const cy = interpolate(ease(f, 6, click1 - 4), [0, 1], [840, FY + 6]);
  const Z = 1.55;
  const zin = spring({ frame: f - (click1 - 8), fps, config: { damping: 20, mass: 0.7 } });
  const zout = spring({ frame: f - (click2 + 6), fps, config: { damping: 22, mass: 0.7 } });
  const scale = 1 + (Z - 1) * Math.max(0, zin - zout);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: `${FX}px ${FY}px` }}>
        <Plate src={shot(lang, 'quiz')} />
        <Plate src={shot(lang, 'quiz-sel')} opacity={oSel * (1 - oNext)} />
        <Plate src={shot(lang, 'quiz-2')} opacity={oNext} />
        <Cursor x={cx} y={cy} clicks={[click1, click2]} />
      </div>
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── example · real result page (archetype + % → axes detail) ── */
const Example: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const cutAt = Math.round(dur * 0.55);
  const oMid = ease(f, cutAt, cutAt + 6);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <Plate src={shot(lang, 'result')} opacity={1 - oMid} />
      <Plate src={shot(lang, 'result-mid')} opacity={oMid} />
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── which · the identity pivot — grid with your slot empty ── */
const Which: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <GridWall lang={lang} mode="which" dur={dur} />
      <Sub text={caption} f={f} dur={dur} size={58} />
    </AbsoluteFill>
  );
};

/* ── cta ── */
const Cta: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const uw = interpolate(ease(f, 36, 66), [0, 1], [0, 100]);
  const lines = caption.split('\n');
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), alignItems: 'center', justifyContent: 'center' }}>
      <GridWall lang={lang} mode="bg" dur={dur} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${C.accent} 50%, transparent)` }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative', width: 200, height: 200, transform: `scale(${interpolate(ease(f, 4, 28), [0, 1], [1.06, 1])})`, opacity: ease(f, 4, 28) }}>
          <div style={{ position: 'absolute', inset: '-12%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, transparent 65%)`, filter: 'blur(6px)' }} />
          <Img src={charSrc('ESFP')} style={{ position: 'relative', width: 200, height: 200, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 76, color: C.inkStrong, textAlign: 'center', opacity: ease(f, 14, 32) }}>{lines[0]}</div>
        <div style={{ position: 'relative', opacity: ease(f, 28, 44) }}>
          <div style={{ fontFamily: MONO, fontSize: 58, letterSpacing: 3, color: C.accent }}>air.democra.ai</div>
          <div style={{ position: 'absolute', left: 0, bottom: -10, height: 4, width: `${uw}%`, background: C.accent }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<SP>> = { hook: Hook, grid: Grid, axes: Axes, quiz: Quiz, example: Example, which: Which, cta: Cta };
export const SceneSwitch: React.FC<{ id: string } & SP> = ({ id, ...p }) => {
  const Comp = MAP[id] ?? Hook;
  return <Comp {...p} />;
};
