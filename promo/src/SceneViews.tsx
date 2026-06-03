import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, serif, type Lang } from './theme';

const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const fadeIO = (f: number, dur: number, inN = 12, outN = 14) =>
  Math.min(ease(f, 0, inN), interpolate(f, [dur - outN, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const shot = (lang: Lang, name: string) => staticFile(`shots/${name}-${lang}.png`);

type SP = { lang: Lang; dur: number; caption: string };

/** Static full-bleed real screenshot — the footage sits still (no Ken-Burns drift). */
const Plate: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 1 }) => (
  <Img src={src} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', opacity }} />
);

/** Animated pointer that eases to (x,y) and pulses at click frames. */
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

/** Elegant lower-third caption for footage scenes (muted-viewer subtitle). */
const Sub: React.FC<{ text: string; f: number; dur: number }> = ({ text, f, dur }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 54, background: 'linear-gradient(to top, rgba(247,242,232,0.97), rgba(247,242,232,0))', opacity: fadeIO(f, dur) }}>
    <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, lineHeight: 1.15, color: C.inkStrong, textAlign: 'center', maxWidth: 1400, whiteSpace: 'pre-line' }}>{text}</div>
  </div>
);

/* ── S1 · Hero (real page; doubles as poster/cover) — static ── */
const S1: React.FC<SP> = ({ lang, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur, 1, 16) }}>
      <Plate src={shot(lang, 'hero')} />
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)` }} />
    </AbsoluteFill>
  );
};

/* ── S2 · Archetype grid (real page) — static ── */
const S2: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <Plate src={shot(lang, 'grid')} />
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── S3 · Four axes (motion graphic) ── */
const AXES: { label: { en: string; zh: string }; a: string; b: string; pick: 0 | 1; letter: string }[] = [
  { label: { en: 'Learnability', zh: '可学习性' }, a: 'Explicit', b: 'Tacit', pick: 0, letter: 'E' },
  { label: { en: 'Evaluation', zh: '评判标准' }, a: 'Objective', b: 'Subjective', pick: 1, letter: 'S' },
  { label: { en: 'Risk', zh: '风险容忍' }, a: 'Flexible', b: 'Rigid', pick: 0, letter: 'F' },
  { label: { en: 'Human', zh: '人的存在' }, a: 'Product', b: 'Human', pick: 0, letter: 'P' },
];
const S3: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), padding: '120px 140px', justifyContent: 'center' }}>
      <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 64, color: C.inkStrong, opacity: ease(f, 4, 20), whiteSpace: 'pre-line', marginBottom: 14 }}>{caption}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 26, margin: '24px 0 44px' }}>
        {AXES.map((ax, i) => {
          const s = spring({ frame: f - (30 + i * 18), fps, config: { damping: 14 } });
          return <div key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 116, color: C.accent, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>{ax.letter}</div>;
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1320, margin: '0 auto', width: '100%' }}>
        {AXES.map((ax, i) => {
          const p = spring({ frame: f - (26 + i * 18), fps, config: { damping: 16 } });
          const pos = ax.pick === 0 ? interpolate(p, [0, 1], [50, 12]) : interpolate(p, [0, 1], [50, 88]);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: ease(f, 8 + i * 6, 24 + i * 6) }}>
              <div style={{ width: 220, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: C.inkMute, textTransform: 'uppercase' }}>{ax.label[lang]}</div>
              <div style={{ flex: 1, position: 'relative', height: 52 }}>
                <div style={{ position: 'absolute', top: 25, left: 110, right: 110, height: 2, background: C.rule }} />
                <span style={{ position: 'absolute', left: 0, top: 6, fontFamily: serif, fontSize: 30, color: ax.pick === 0 ? C.accent : C.inkSoft }}>{ax.a}</span>
                <span style={{ position: 'absolute', right: 0, top: 6, fontFamily: serif, fontSize: 30, color: ax.pick === 1 ? C.accent : C.inkSoft }}>{ax.b}</span>
                <div style={{ position: 'absolute', top: 16, left: `${pos}%`, transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: 999, background: C.accent, boxShadow: `0 0 0 6px ${C.accent}33` }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ── S4 · How to take it — real quiz, Screen-Studio focus-zoom on the click ── */
const S4: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FX = 540, FY = 300; // option-2 click point (canvas coords)
  const click1 = Math.round(dur * 0.34); // select
  const click2 = Math.round(dur * 0.66); // click again → advance
  const oSel = ease(f, click1, click1 + 7);
  const oNext = ease(f, click2, click2 + 9);
  const cx = interpolate(ease(f, 6, click1 - 4), [0, 1], [1520, FX + 78]);
  const cy = interpolate(ease(f, 6, click1 - 4), [0, 1], [840, FY + 6]);
  // Focus zoom: punch IN toward the click point at click1, hold through click2, ease OUT to reveal the next question.
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

/* ── S5 · Classic example (motion graphic) ── */
const S5: React.FC<SP> = ({ lang, dur }) => {
  const f = useCurrentFrame();
  const tag = lang === 'zh' ? '软件工程师' : 'Software Developer';
  const typed = tag.slice(0, Math.floor(interpolate(ease(f, 10, 46), [0, 1], [0, tag.length])));
  const letters = 'ESFP'.split('');
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 3, color: C.inkMute }}>
        {lang === 'zh' ? '比如：' : 'Say you are a'} <span style={{ color: C.ink, borderBottom: `2px solid ${C.accent}` }}>{typed}</span>
        <span style={{ opacity: f % 30 < 15 ? 1 : 0, color: C.accent }}>|</span>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {letters.map((l, i) => {
          const t = ease(f, 50 + i * 10, 66 + i * 10);
          return <div key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 130, color: C.accent, opacity: t, transform: `scale(${interpolate(t, [0, 1], [0.6, 1])})` }}>{l}</div>;
        })}
      </div>
      <div style={{ opacity: ease(f, 90, 110), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 300, height: 300, transform: `scale(${interpolate(ease(f, 86, 112), [0, 1], [1.06, 1])})` }}>
          <div style={{ position: 'absolute', inset: '-10%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, transparent 65%)`, filter: 'blur(6px)' }} />
          <Img src={staticFile('characters-art/ESFP.png')} style={{ position: 'relative', width: 300, height: 300, borderRadius: 18, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 40, color: C.inkStrong }}>{lang === 'zh' ? '品味定义者' : 'The Taste Maker'}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── S6 · Result reveal — real result page, static beats (no full-frame zoom) ── */
const S6: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const cutAt = Math.round(dur * 0.52);
  const oMid = ease(f, cutAt, cutAt + 6); // quick cut top → axes
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <Plate src={shot(lang, 'result')} opacity={1 - oMid} />
      <Plate src={shot(lang, 'result-mid')} opacity={oMid} />
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── S7 · Macro (real progress bar) — static ── */
const S7: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <Plate src={shot(lang, 'macro')} />
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── S8 · CTA (motion graphic) ── */
const S8: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const uw = interpolate(ease(f, 40, 70), [0, 1], [0, 100]);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), alignItems: 'center', justifyContent: 'center', gap: 26 }}>
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${C.accent} 50%, transparent)` }} />
      <div style={{ position: 'relative', width: 220, height: 220, transform: `scale(${interpolate(ease(f, 6, 30), [0, 1], [1.06, 1])})`, opacity: ease(f, 6, 30) }}>
        <div style={{ position: 'absolute', inset: '-10%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, transparent 65%)`, filter: 'blur(6px)' }} />
        <Img src={staticFile('characters-art/ESFP.png')} style={{ position: 'relative', width: 220, height: 220, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
      </div>
      <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 84, color: C.inkStrong, textAlign: 'center', opacity: ease(f, 16, 34) }}>{caption}</div>
      <div style={{ position: 'relative', opacity: ease(f, 30, 46) }}>
        <div style={{ fontFamily: MONO, fontSize: 56, letterSpacing: 3, color: C.accent }}>air.democra.ai</div>
        <div style={{ position: 'absolute', left: 0, bottom: -10, height: 4, width: `${uw}%`, background: C.accent }} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.inkSoft, opacity: ease(f, 46, 62) }}>
        {lang === 'zh' ? '约 4 分钟 · 匿名 · 免登录' : 'c. 4 min · anonymous · no signup'}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<SP>> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8 };
export const SceneSwitch: React.FC<{ id: string } & SP> = ({ id, ...p }) => {
  const Comp = MAP[id] ?? S1;
  return <Comp {...p} />;
};
