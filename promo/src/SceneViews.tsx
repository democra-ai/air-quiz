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

/* soft left/right fade to paper so a scrolling/floating wall dissolves at the edges (no hard cut) */
const EdgeFade: React.FC = () => (
  <>
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 220, background: `linear-gradient(90deg, ${C.paper}, ${C.paper}00)`, pointerEvents: 'none', zIndex: 6 }} />
    <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 220, background: `linear-gradient(270deg, ${C.paper}, ${C.paper}00)`, pointerEvents: 'none', zIndex: 6 }} />
  </>
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

/* ── caption — classic broadcast lower-third: thin weight, on a soft translucent-white band ── */
const Sub: React.FC<{ text: string; f: number; dur: number; size?: number }> = ({ text, f, dur, size = 38 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', opacity: fadeIO(f, dur), zIndex: 8 }}>
    <div style={{ background: 'rgba(251,247,238,0.84)', border: `1px solid ${C.rule}88`, borderRadius: 16, padding: '13px 34px', maxWidth: 1480, boxShadow: '0 4px 18px rgba(31,24,20,0.10)', backdropFilter: 'blur(3px)' }}>
      <div style={{ fontFamily: serif, fontWeight: 400, fontSize: size, lineHeight: 1.32, color: C.inkStrong, textAlign: 'center', whiteSpace: 'pre-line' }}>{text}</div>
    </div>
  </div>
);

/* ── timed subtitle — caption == voiceover, shown chunk-by-chunk roughly in sync with the VO.
   VO occupies [LEAD, dur-TAIL] frames (set by prepare.mjs); chunks are time-sliced by length. ── */
const SUB_LEAD = 10, SUB_TAIL = 14;
const chunkSplit = (t: string): string[] => {
  const sentences = t
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[。！？?!])|(?<=——)/))
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const s of sentences) {
    if (s.length > 60) {
      let buf = '';
      for (const p of s.split(/(?<=[，,、])/)) {
        if ((buf + p).length > 60 && buf) { out.push(buf.trim()); buf = p; } else buf += p;
      }
      if (buf.trim()) out.push(buf.trim());
    } else out.push(s);
  }
  return out;
};
const TimedSub: React.FC<{ text: string; f: number; dur: number; size?: number }> = ({ text, f, dur, size = 38 }) => {
  const chunks = chunkSplit(text);
  const voStart = SUB_LEAD;
  const voEnd = Math.max(voStart + 1, dur - SUB_TAIL);
  const weights = chunks.map((c) => Math.max(c.length, 4));
  const tot = weights.reduce((a, b) => a + b, 0);
  let acc = voStart;
  const spans = weights.map((w) => { const s = acc; const e = acc + (voEnd - voStart) * (w / tot); acc = e; return [s, e] as [number, number]; });
  let idx = spans.findIndex(([s, e]) => f >= s && f < e);
  if (idx < 0) idx = f < voStart ? 0 : chunks.length - 1;
  const [s, e] = spans[idx];
  const chunkOp = chunks.length > 1 ? Math.min(ease(f, s, s + 4), 1 - ease(f, e - 4, e)) : 1;
  const op = Math.min(fadeIO(f, dur), chunkOp);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', opacity: op, zIndex: 8 }}>
      <div style={{ background: 'rgba(251,247,238,0.86)', border: `1px solid ${C.rule}88`, borderRadius: 16, padding: '13px 34px', maxWidth: 1500, boxShadow: '0 4px 18px rgba(31,24,20,0.10)', backdropFilter: 'blur(3px)' }}>
        <div style={{ fontFamily: serif, fontWeight: 400, fontSize: size, lineHeight: 1.34, color: C.inkStrong, textAlign: 'center', whiteSpace: 'pre-line' }}>{chunks[idx]}</div>
      </div>
    </div>
  );
};

/* ── Two-row floating archetype wall — the original homepage feel; big enough to read each card ── */
const ROW_A = ARCHETYPES.slice(0, 8);
const ROW_B = ARCHETYPES.slice(8, 16);
const TILE = 232; // card slot width incl. gap
const ART = 150;
const WHICH_EMPTY = 2; // empty slot index within ROW_B

const Card: React.FC<{ code: string; name: string; dimmed?: boolean; empty?: boolean; pulse?: number }> = ({ code, name, dimmed, empty, pulse = 1 }) => (
  <div style={{ width: TILE - 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, filter: dimmed ? 'grayscale(0.55)' : 'none', opacity: dimmed ? 0.42 : 1 }}>
    {empty ? (
      <div style={{ position: 'relative', width: ART, height: ART, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: '-22%', borderRadius: '50%', background: `radial-gradient(circle, ${C.accent}40, ${C.accent}00 68%)`, filter: 'blur(10px)', opacity: pulse }} />
        <div style={{ position: 'relative', width: ART, height: ART, borderRadius: 16, border: `2px dashed ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.accent}14` }}>
          <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 78, color: C.accent }}>?</span>
        </div>
      </div>
    ) : (
      <Img src={charSrc(code)} style={{ width: ART, height: ART, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}`, boxShadow: '0 7px 20px rgba(31,24,20,0.12)' }} />
    )}
    <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: empty ? C.accent : C.inkSoft }}>{empty ? '???' : code}</div>
    <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: empty ? C.accent : C.inkStrong, textAlign: 'center', lineHeight: 1.12, maxWidth: TILE - 26 }}>{name}</div>
  </div>
);

const FloatRow: React.FC<{ items: typeof ROW_A; dir: 1 | -1; speed: number; lang: Lang }> = ({ items, dir, speed, lang }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = items.length * TILE;
  const tiles = [...items, ...items, ...items];
  const drift = ((f * speed) % period + period) % period;
  const x = dir < 0 ? -drift : drift - period;
  return (
    <div style={{ display: 'flex', gap: TILE - (TILE - 22), transform: `translateX(${x}px)`, willChange: 'transform' }}>
      {tiles.map((a, i) => {
        const col = i % items.length;
        const ent = spring({ frame: f - 6 - col * 3, fps, config: { damping: 18 } });
        return (
          <div key={i} style={{ opacity: ent, transform: `scale(${interpolate(ent, [0, 1], [0.84, 1])})` }}>
            <Card code={a.code} name={lang === 'zh' ? a.zh : a.en} />
          </div>
        );
      })}
    </div>
  );
};

const TwoRowWall: React.FC<{ lang: Lang; mode: 'float' | 'which' | 'bg' }> = ({ lang, mode }) => {
  const f = useCurrentFrame();
  if (mode === 'float') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40, overflow: 'hidden' }}>
        <FloatRow items={ROW_A} dir={-1} speed={1.5} lang={lang} />
        <FloatRow items={ROW_B} dir={1} speed={1.5} lang={lang} />
      </div>
    );
  }
  const pulse = 0.7 + 0.3 * Math.sin(f / 6);
  const Static = ({ items, isB }: { items: typeof ROW_A; isB?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: TILE - (TILE - 22) }}>
      {items.map((a, i) => {
        const empty = mode === 'which' && isB && i === WHICH_EMPTY;
        return (
          <div key={a.code} style={{ width: TILE - 22, opacity: mode === 'bg' ? 0.1 : 1 }}>
            {mode === 'bg' ? (
              <Img src={charSrc(a.code)} style={{ width: ART, height: ART, borderRadius: 16, objectFit: 'cover', display: 'block', margin: '0 auto' }} />
            ) : (
              <Card code={a.code} name={empty ? (lang === 'zh' ? '你？' : 'You?') : lang === 'zh' ? a.zh : a.en} dimmed={!empty} empty={empty} pulse={pulse} />
            )}
          </div>
        );
      })}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
      <Static items={ROW_A} />
      <Static items={ROW_B} isB />
    </div>
  );
};

/* ── hook · real Hero + the MBTI hook ── */
const Hook: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur, 1, 16) }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1.0, 1.045], { extrapolateRight: 'clamp' })})`, transformOrigin: '50% 40%' }}>
        <Plate src={shot(lang, 'hero')} />
      </AbsoluteFill>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)` }} />
      <TimedSub text={caption} f={f} dur={dur} size={42} />
    </AbsoluteFill>
  );
};

/* ── grid · the 16 types, two floating rows ── */
const Grid: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <TwoRowWall lang={lang} mode="float" />
      <EdgeFade />
      <TimedSub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── axes · 4 dimensions — exposed pole (AI takes, left) vs resistant pole (you hold, right); example lands 2-2 ── */
const AXES: { label: { en: string; zh: string }; q: { en: string; zh: string }; exposed: string; resist: string; pick: 'exposed' | 'resist'; letter: string }[] = [
  { label: { en: 'Learnability', zh: '可学习性' }, q: { en: 'Can AI learn it?', zh: 'AI 学不学得会？' }, exposed: 'Explicit', resist: 'Tacit', pick: 'exposed', letter: 'E' },
  { label: { en: 'Evaluation', zh: '评判标准' }, q: { en: 'Is there a clear standard?', zh: '好坏有没有准？' }, exposed: 'Objective', resist: 'Subjective', pick: 'resist', letter: 'S' },
  { label: { en: 'Accountability', zh: '担责' }, q: { en: "Who's accountable?", zh: '出错担不担得起？' }, exposed: 'Flexible', resist: 'Rigid', pick: 'resist', letter: 'R' },
  { label: { en: 'Human', zh: '人的在场' }, q: { en: 'Does it have to be you?', zh: '是不是非你不可？' }, exposed: 'Product', resist: 'Human', pick: 'exposed', letter: 'P' },
];
const TAG = { takes: { en: 'AI takes it', zh: 'AI 拿走' }, hold: { en: 'you hold', zh: '你守住' } };
const Axes: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), padding: '78px 150px 0', justifyContent: 'flex-start' }}>
      {/* each letter lights up as its question is answered; exposed=gray, resistant=terracotta → 2-2 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 30, marginBottom: 8 }}>
        {AXES.map((ax, i) => {
          const A = 40 + i * Math.max(34, (dur - 150) / 3);
          const s = spring({ frame: f - A, fps, config: { damping: 14 } });
          const col = ax.pick === 'resist' ? C.accent : C.inkSoft;
          return <div key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 104, color: col, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>{ax.letter}</div>;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 30, opacity: ease(f, 26, 44) }}>
        <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 1, color: C.inkSoft }}>{lang === 'zh' ? '灰 = AI 拿走' : 'gray = AI takes it'}</span>
        <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 1, color: C.accent }}>{lang === 'zh' ? '红 = 你守得住' : 'terracotta = you hold'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1420, margin: '0 auto', width: '100%' }}>
        {AXES.map((ax, i) => {
          const A = 40 + i * Math.max(34, (dur - 150) / 3);
          const p = spring({ frame: f - (A + 2), fps, config: { damping: 16 } });
          const pos = ax.pick === 'exposed' ? interpolate(p, [0, 1], [50, 13]) : interpolate(p, [0, 1], [50, 87]);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: ease(f, A, A + 14) }}>
              <div style={{ width: 400, flexShrink: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: C.inkSoft, marginBottom: 2 }}>{ax.label[lang]}</div>
                <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 28, color: C.inkStrong, lineHeight: 1.1 }}>{ax.q[lang]}</div>
              </div>
              <div style={{ flex: 1, position: 'relative', height: 58 }}>
                <div style={{ position: 'absolute', top: 17, left: 92, right: 92, height: 3, background: C.rule, borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, textAlign: 'left' }}>
                  <div style={{ fontFamily: serif, fontSize: 26, color: C.inkSoft }}>{ax.exposed}</div>
                  <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: C.inkSoft }}>{TAG.takes[lang]}</div>
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: serif, fontSize: 26, color: C.accent }}>{ax.resist}</div>
                  <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: C.accent }}>{TAG.hold[lang]}</div>
                </div>
                <div style={{ position: 'absolute', top: 8, left: `${pos}%`, transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: 999, background: ax.pick === 'resist' ? C.accent : C.inkSoft, boxShadow: `0 0 0 6px ${ax.pick === 'resist' ? C.accent : C.inkSoft}33` }} />
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
  // option 2's row center (cursor target) + a horizontally-centered zoom origin so the
  // full-width option card never clips. Gentle Z keeps everything in frame.
  const OX = 465, OY = 462;
  const ZOX = 960, ZOY = 470, Z = 1.2;
  const CONT_X = 1392, CONT_Y = 975; // "Continue" button
  const click1 = Math.round(dur * 0.34); // select option 2
  const zoutAt = Math.round(dur * 0.6);  // zoom back out (so Continue is visible)
  const click2 = Math.round(dur * 0.84); // click Next
  const oSel = ease(f, click1, click1 + 7);
  const oNext = ease(f, click2, click2 + 9);
  const p2 = ease(f, zoutAt + 4, click2 - 4); // travel to Continue
  const cx = p2 <= 0 ? interpolate(ease(f, 6, click1 - 4), [0, 1], [1620, OX]) : interpolate(p2, [0, 1], [OX, CONT_X]);
  const cy = p2 <= 0 ? interpolate(ease(f, 6, click1 - 4), [0, 1], [980, OY]) : interpolate(p2, [0, 1], [OY, CONT_Y]);
  const zin = spring({ frame: f - (click1 - 8), fps, config: { damping: 20, mass: 0.7 } });
  const zout = spring({ frame: f - zoutAt, fps, config: { damping: 22, mass: 0.7 } });
  const scale = 1 + (Z - 1) * Math.max(0, zin - zout);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: `${ZOX}px ${ZOY}px` }}>
        <Plate src={shot(lang, 'quiz')} />
        <Plate src={shot(lang, 'quiz-sel')} opacity={oSel * (1 - oNext)} />
        <Plate src={shot(lang, 'quiz-2')} opacity={oNext} />
        <Cursor x={cx} y={cy} clicks={[click1, click2]} />
      </div>
      <Sub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── example · real result page — a researcher → ESRP "The Pressure Alchemist" ── */
const Example: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const t1 = Math.round(dur * 0.56);
  // dip through the paper background: result fully fades out BEFORE result-mid fades in,
  // so the two page states are never superimposed (no overlap/ghosting).
  const oResult = interpolate(f, [t1, t1 + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const oMid = interpolate(f, [t1 + 6, t1 + 13], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1.0, 1.025], { extrapolateRight: 'clamp' })})`, transformOrigin: '50% 36%' }}>
        <Plate src={shot(lang, 'result')} opacity={oResult} />
        <Plate src={shot(lang, 'result-mid')} opacity={oMid} />
      </AbsoluteFill>
      <TimedSub text={caption} f={f} dur={dur} size={36} />
    </AbsoluteFill>
  );
};

/* ── which · the identity pivot — two-row wall, your slot empty ── */
const Which: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <TwoRowWall lang={lang} mode="which" />
      <EdgeFade />
      <TimedSub text={caption} f={f} dur={dur} size={46} />
    </AbsoluteFill>
  );
};

/* ── cta ── */
const Cta: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const uw = interpolate(ease(f, 34, 64), [0, 1], [0, 100]);
  const versions = lang === 'zh'
    ? [{ t: '16 题 · 3 分钟', s: '更快' }, { t: '60 题 · 12 分钟', s: '更准' }]
    : [{ t: '16 Q · 3 min', s: 'quick' }, { t: '60 Q · 12 min', s: 'precise' }];
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), alignItems: 'center', justifyContent: 'center' }}>
      <TwoRowWall lang={lang} mode="bg" />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${C.accent} 50%, transparent)` }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, marginTop: -110 }}>
        <div style={{ position: 'relative', width: 148, height: 148, opacity: ease(f, 4, 24), transform: `scale(${interpolate(ease(f, 4, 24), [0, 1], [1.06, 1])})` }}>
          <div style={{ position: 'absolute', inset: '-14%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, transparent 65%)`, filter: 'blur(6px)' }} />
          <Img src={charSrc('ESRP')} style={{ position: 'relative', width: 148, height: 148, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ display: 'flex', gap: 26, opacity: ease(f, 14, 34) }}>
          {versions.map((v, i) => (
            <div key={i} style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 14, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 18px rgba(31,24,20,0.10)' }}>
              <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 34, color: C.inkStrong }}>{v.t}</div>
              <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: C.accent, marginTop: 5 }}>{v.s}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', opacity: ease(f, 28, 48), marginTop: 4 }}>
          <div style={{ fontFamily: MONO, fontSize: 56, letterSpacing: 3, color: C.accent }}>air.democra.ai</div>
          <div style={{ position: 'absolute', left: 0, bottom: -10, height: 4, width: `${uw}%`, background: C.accent }} />
        </div>
      </div>
      <TimedSub text={caption} f={f} dur={dur} size={34} />
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<SP>> = { 'hero-real': Hook, 'grid-float': Grid, 'axes-anim': Axes, 'result-real': Example, 'which-pivot': Which, cta: Cta };
export const SceneSwitch: React.FC<{ id: string } & SP> = ({ id, ...p }) => {
  const Comp = MAP[id] ?? Hook;
  return <Comp {...p} />;
};
