import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, serif, ARCHETYPES, type Lang } from './theme';

// Vertical 9:16 (1080×1920).
const W = 1080, H = 1920;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const fadeIO = (f: number, dur: number, inN = 12, outN = 14) =>
  Math.min(ease(f, 0, inN), interpolate(f, [dur - outN, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const shot = (lang: Lang, name: string) => staticFile(`shots/${name}-${lang}.png`);
const charSrc = (code: string) => staticFile(`characters-art/${code}.png`);

type SP = { lang: Lang; dur: number; caption: string };

const Plate: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 1 }) => (
  <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity }} />
);

/* scrolls a tall page screenshot like a screen recording (content reveals, not a frozen shot) */
const ScrollPlate: React.FC<{ src: string; f: number; dur: number; imgH: number; to: number }> = ({ src, f, dur, imgH, to }) => {
  const y = interpolate(ease(f, dur * 0.1, dur * 0.9), [0, 1], [0, to]);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={src} style={{ position: 'absolute', top: 0, left: 0, width: W, height: imgH, transform: `translateY(${y}px)` }} />
    </AbsoluteFill>
  );
};

/* soft top/bottom fade to paper so a floating wall dissolves at the edges (no hard cut) */
const EdgeFade: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: `linear-gradient(180deg, ${C.paper}, ${C.paper}00)`, pointerEvents: 'none', zIndex: 6 }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(0deg, ${C.paper}, ${C.paper}00)`, pointerEvents: 'none', zIndex: 6 }} />
  </>
);

/* ── timed subtitle — caption == voiceover, shown chunk-by-chunk in sync ── */
const SUB_LEAD = 10, SUB_TAIL = 14;
const chunkSplit = (t: string): string[] => {
  const sentences = t
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[。！？?!])|(?<=——)/))
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const s of sentences) {
    if (s.length > 46) {
      let buf = '';
      for (const p of s.split(/(?<=[，,、；;:：])/)) {
        if ((buf + p).length > 46 && buf) { out.push(buf.trim()); buf = p; } else buf += p;
      }
      if (buf.trim()) out.push(buf.trim());
    } else out.push(s);
  }
  return out;
};
const TimedSub: React.FC<{ text: string; f: number; dur: number; size?: number }> = ({ text, f, dur, size = 40 }) => {
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
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', justifyContent: 'center', opacity: op, zIndex: 8, padding: '0 56px' }}>
      <div style={{ background: 'rgba(251,247,238,0.88)', border: `1px solid ${C.rule}88`, borderRadius: 18, padding: '16px 30px', maxWidth: 960, boxShadow: '0 6px 22px rgba(31,24,20,0.12)', backdropFilter: 'blur(3px)' }}>
        <div style={{ fontFamily: serif, fontWeight: 400, fontSize: size, lineHeight: 1.36, color: C.inkStrong, textAlign: 'center', whiteSpace: 'pre-line' }}>{chunks[idx]}</div>
      </div>
    </div>
  );
};

/* ── archetype wall (4×4 for portrait) ── */
const ROWS = [ARCHETYPES.slice(0, 4), ARCHETYPES.slice(4, 8), ARCHETYPES.slice(8, 12), ARCHETYPES.slice(12, 16)];
const ART = 158;
const TILE = 248;
const WHICH_R = 1, WHICH_C = 2; // empty slot (row, col)

const Card: React.FC<{ code: string; name: string; dimmed?: boolean; empty?: boolean; pulse?: number }> = ({ code, name, dimmed, empty, pulse = 1 }) => (
  <div style={{ width: TILE - 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, filter: dimmed ? 'grayscale(0.55)' : 'none', opacity: dimmed ? 0.4 : 1 }}>
    {empty ? (
      <div style={{ position: 'relative', width: ART, height: ART, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: '-24%', borderRadius: '50%', background: `radial-gradient(circle, ${C.accent}44, ${C.accent}00 68%)`, filter: 'blur(10px)', opacity: pulse }} />
        <div style={{ position: 'relative', width: ART, height: ART, borderRadius: 16, border: `2px dashed ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.accent}14` }}>
          <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 82, color: C.accent }}>?</span>
        </div>
      </div>
    ) : (
      <Img src={charSrc(code)} style={{ width: ART, height: ART, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}`, boxShadow: '0 7px 20px rgba(31,24,20,0.12)' }} />
    )}
    <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: empty ? C.accent : C.inkSoft }}>{empty ? '???' : code}</div>
    <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: empty ? C.accent : C.inkStrong, textAlign: 'center', lineHeight: 1.1, maxWidth: TILE - 26 }}>{name}</div>
  </div>
);

const FloatRow: React.FC<{ items: typeof ROWS[number]; dir: 1 | -1; lang: Lang }> = ({ items, dir, lang }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = items.length * TILE;
  const tiles = [...items, ...items, ...items, ...items];
  const drift = ((f * 1.1) % period + period) % period;
  const x = dir < 0 ? -drift : drift - period;
  return (
    <div style={{ display: 'flex', gap: TILE - (TILE - 26), transform: `translateX(${x}px)`, willChange: 'transform' }}>
      {tiles.map((a, i) => {
        const ent = spring({ frame: f - 6 - (i % items.length) * 3, fps, config: { damping: 18 } });
        return (
          <div key={i} style={{ opacity: ent, transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})` }}>
            <Card code={a.code} name={lang === 'zh' ? a.zh : a.en} />
          </div>
        );
      })}
    </div>
  );
};

const Wall: React.FC<{ lang: Lang; mode: 'float' | 'which' | 'bg' }> = ({ lang, mode }) => {
  const f = useCurrentFrame();
  if (mode === 'float') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30, overflow: 'hidden' }}>
        {ROWS.map((r, i) => <FloatRow key={i} items={r} dir={i % 2 === 0 ? -1 : 1} lang={lang} />)}
      </div>
    );
  }
  const pulse = 0.7 + 0.3 * Math.sin(f / 6);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
      {ROWS.map((r, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 22 }}>
          {r.map((a, ci) => {
            const empty = mode === 'which' && ri === WHICH_R && ci === WHICH_C;
            return (
              <div key={a.code} style={{ opacity: mode === 'bg' ? 0.1 : 1 }}>
                {mode === 'bg' ? (
                  <Img src={charSrc(a.code)} style={{ width: ART, height: ART, borderRadius: 16, objectFit: 'cover', display: 'block' }} />
                ) : (
                  <Card code={a.code} name={empty ? (lang === 'zh' ? '你？' : 'You?') : lang === 'zh' ? a.zh : a.en} dimmed={!empty} empty={empty} pulse={pulse} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ── hook · real Hero (portrait) ── */
// A tasteful 3-card archetype fan: two wings deal out, the main card lifts to the front.
const CardStack: React.FC<{ lang: Lang; startF: number; top: number }> = ({ lang, startF, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wing = (code: string, rot: number, dx: number, off: number) => {
    const s = spring({ frame: f - (startF + off), fps, config: { damping: 18 } });
    return (
      <div key={code} style={{ position: 'absolute', left: '50%', top, width: 300, transformOrigin: '50% 92%', zIndex: 1, opacity: s * 0.96, transform: `translateX(calc(-50% + ${dx * s}px)) translateY(${18}px) rotate(${rot * s}deg) scale(${interpolate(s, [0, 1], [0.9, 0.82])})` }}>
        <div style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 18, padding: 12, boxShadow: '0 26px 60px rgba(31,24,20,0.16)' }}>
          <Img src={charSrc(code)} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 14, border: `1px solid ${C.rule}` }} />
          <div style={{ textAlign: 'center', marginTop: 8, fontFamily: MONO, fontSize: 15, letterSpacing: 5, color: C.inkSoft }}>{code}</div>
        </div>
      </div>
    );
  };
  const sc = spring({ frame: f - (startF + 12), fps, config: { damping: 17 } });
  const bob = Math.sin(f / 22) * 7;
  return (
    <>
      {wing('ESRP', -10, -188, 0)}
      {wing('TSRH', 10, 188, 6)}
      <div style={{ position: 'absolute', left: '50%', top, width: 372, transformOrigin: '50% 92%', zIndex: 3, opacity: sc, transform: `translateX(-50%) translateY(${-10 + bob * sc}px) rotate(${interpolate(sc, [0, 1], [-6, -2])}deg) scale(${interpolate(sc, [0, 1], [0.9, 1])})` }}>
        <div style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 24, padding: 22, boxShadow: '0 22px 56px rgba(31,24,20,0.24)' }}>
          <Img src={charSrc('ESRH')} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 16, border: `1px solid ${C.rule}` }} />
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 5, color: C.inkSoft }}>ESRH</div>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 32, color: C.inkStrong, marginTop: 2 }}>{lang === 'zh' ? '神谕者' : 'The Oracle'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

// Recreates the real air.democra.ai Hero (editorial headline + a 3-card archetype fan), animated.
const Hook: React.FC<SP> = ({ lang, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kicker = lang === 'zh' ? '§ 01 · 一份关于你工作的问卷' : '§ 01 · A SURVEY ABOUT YOUR WORK';
  const head = lang === 'zh'
    ? [[{ t: '哪种 ', a: false }, { t: '人', a: true }, { t: '，', a: false }], [{ t: 'AI 取代不了？', a: false }]]
    : [[{ t: 'The kind of ', a: false }, { t: 'human', a: true }], [{ t: 'AI cannot replace.', a: false }]];
  const sub = lang === 'zh'
    ? '16 道题，把你的工作对到 16 种原型之一——从玻璃大炮到铁壁堡垒。'
    : 'A 16-question test maps your work to one of sixteen archetypes — from the Glass Cannon to the Iron Fortress.';
  const pill = lang === 'zh' ? '开始测试 →' : 'Take the test →';
  const railW = ease(f, 4, 22);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur, 1, 16) }}>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)`, transform: `scaleX(${railW})`, transformOrigin: 'center', zIndex: 7 }} />
      {/* top nav, like the real hero */}
      <div style={{ position: 'absolute', top: 44, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: ease(f, 4, 20) }}>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 600, fontSize: 34, color: C.inkStrong }}>AIR</span>
        <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: C.inkSoft }}>{lang === 'zh' ? 'AI 职业人格测试' : 'AI-RESISTANCE CAREER TEST'}</span>
      </div>
      <div style={{ position: 'absolute', top: 220, left: 84, right: 84 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: C.inkSoft, opacity: ease(f, 10, 26) }}>{kicker}</div>
        <div style={{ marginTop: 26, fontFamily: serif, fontWeight: 900, fontSize: lang === 'zh' ? 116 : 80, lineHeight: 1.05, color: C.inkStrong }}>
          {head.map((line, li) => (
            <div key={li} style={{ opacity: ease(f, 18 + li * 9, 40 + li * 9), transform: `translateY(${interpolate(ease(f, 18 + li * 9, 40 + li * 9), [0, 1], [28, 0])}px)` }}>
              {line.map((seg, si) => <span key={si} style={{ color: seg.a ? C.accent : C.inkStrong, fontStyle: seg.a ? 'italic' : 'normal' }}>{seg.t}</span>)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34, fontFamily: serif, fontSize: 32, lineHeight: 1.42, color: C.inkMute, maxWidth: 840, opacity: ease(f, 42, 60) }}>{sub}</div>
        <div style={{ marginTop: 40, display: 'inline-block', background: C.inkStrong, color: C.paper, fontFamily: serif, fontWeight: 600, fontSize: 30, padding: '17px 36px', borderRadius: 999, opacity: ease(f, 56, 74), transform: `scale(${interpolate(ease(f, 56, 74), [0, 1], [0.94, 1])})` }}>{pill}</div>
      </div>
      {/* 3-card archetype fan (replaces the single floating card) */}
      <CardStack lang={lang} startF={44} top={910} />
    </AbsoluteFill>
  );
};

/* ── grid · 16 archetypes (4×4 floating) ── */
const Grid: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <Wall lang={lang} mode="float" />
      <EdgeFade />
      <TimedSub text={caption} f={f} dur={dur} />
    </AbsoluteFill>
  );
};

/* ── axes · 4 dimensions stacked vertically (no overlap); each question's letter + slider lands as spoken ── */
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
  const step = Math.max(34, (dur - 150) / 4);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), padding: '0 84px', justifyContent: 'center' }}>
      {/* assembled code — exposed picks gray, resistant picks terracotta → reads as 2-2 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26, marginBottom: 10 }}>
        {AXES.map((ax, i) => {
          const s = spring({ frame: f - (40 + i * step), fps, config: { damping: 14 } });
          return <div key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 92, color: ax.pick === 'resist' ? C.accent : C.inkSoft, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px)` }}>{ax.letter}</div>;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 26, marginBottom: 40, opacity: ease(f, 24, 42) }}>
        <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 1, color: C.inkSoft }}>{lang === 'zh' ? '灰=AI 拿走' : 'gray = AI takes it'}</span>
        <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 1, color: C.accent }}>{lang === 'zh' ? '红=你守住' : 'terracotta = you hold'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {AXES.map((ax, i) => {
          const A = 40 + i * step;
          const p = spring({ frame: f - (A + 2), fps, config: { damping: 16 } });
          const pos = ax.pick === 'exposed' ? interpolate(p, [0, 1], [50, 18]) : interpolate(p, [0, 1], [50, 82]);
          return (
            <div key={i} style={{ opacity: ease(f, A, A + 14) }}>
              <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: C.inkSoft, marginBottom: 3 }}>{`0${i + 1} · ${ax.label[lang]}`}</div>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 38, color: C.inkStrong, lineHeight: 1.1, marginBottom: 16 }}>{ax.q[lang]}</div>
              <div style={{ position: 'relative', height: 56 }}>
                <div style={{ position: 'absolute', top: 14, left: 170, right: 170, height: 3, background: C.rule, borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, width: 160 }}>
                  <div style={{ fontFamily: serif, fontSize: 27, color: C.inkSoft }}>{ax.exposed}</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 1, color: C.inkSoft }}>{TAG.takes[lang]}</div>
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, width: 160, textAlign: 'right' }}>
                  <div style={{ fontFamily: serif, fontSize: 27, color: C.accent }}>{ax.resist}</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 1, color: C.accent }}>{TAG.hold[lang]}</div>
                </div>
                <div style={{ position: 'absolute', top: 5, left: `${pos}%`, transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: 999, background: ax.pick === 'resist' ? C.accent : C.inkSoft, boxShadow: `0 0 0 6px ${ax.pick === 'resist' ? C.accent : C.inkSoft}33` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: serif, fontSize: 34, color: C.inkMute, textAlign: 'center', marginTop: 56, lineHeight: 1.35, opacity: ease(f, 50 + 4 * step, 74 + 4 * step) }}>
        {lang === 'zh' ? '两样 AI 拿得走，两样你守得住——四个答案，拼出你的代号。' : 'Two go to AI, two you keep — four answers make your code.'}
      </div>
    </AbsoluteFill>
  );
};

/* ── result · real result page (portrait shows archetype + 29% stats + axes in one frame) ── */
const Example: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const code = [['E', false], ['S', true], ['R', true], ['P', false]] as const; // true = resist (accent)
  const rev = ease(f, 4, 24);
  const Cc = 2 * Math.PI * 135;
  const pMine = ease(f, 120, 196);
  const pAI = ease(f, 176, 220);
  const nMine = Math.round(interpolate(pMine, [0, 1], [0, 71]));
  const name = lang === 'zh' ? '高压炼金师' : 'The Pressure Alchemist';
  const why = lang === 'zh' ? '错不起的关键时刻，还得是人来拍板。' : 'When you can’t afford to be wrong, it still takes a human.';
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 840, marginBottom: 150, background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 28, boxShadow: '0 18px 50px rgba(31,24,20,0.14)', clipPath: `inset(0 0 ${100 * (1 - rev)}% 0)`, padding: '48px 46px 42px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, borderRadius: '28px 28px 0 0', background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow})` }} />
        <div style={{ display: 'flex', gap: 26 }}>
          {code.map(([ch, resist], i) => {
            const s = spring({ frame: f - (22 + i * 7), fps, config: { damping: 16 } });
            return <span key={i} style={{ fontFamily: serif, fontWeight: 900, fontSize: 84, color: resist ? C.accent : C.inkSoft, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)` }}>{ch}</span>;
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 4, color: C.inkSoft, marginTop: -8, opacity: ease(f, 30, 44) }}>{lang === 'zh' ? '代号 · CODE' : 'YOUR CODE'}</div>
        <div style={{ position: 'relative', width: 240, height: 240, opacity: ease(f, 40, 60), transform: `scale(${interpolate(ease(f, 40, 60), [0, 1], [0.9, 1])})` }}>
          <div style={{ position: 'absolute', inset: '-16%', borderRadius: '50%', background: `radial-gradient(circle, ${C.accent}33, ${C.accent}00 66%)`, filter: 'blur(10px)' }} />
          <Img src={charSrc('ESRP')} style={{ position: 'relative', width: 240, height: 240, borderRadius: 20, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ textAlign: 'center', opacity: ease(f, 56, 76) }}>
          <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: C.inkSoft }}>{lang === 'zh' ? '第一人称 · 我测出来是' : 'I CAME OUT'}</div>
          <div style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: C.inkStrong, lineHeight: 1.1, marginTop: 4 }}>{name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, maxWidth: 660, opacity: ease(f, 74, 94) }}>
          <div style={{ width: 4, alignSelf: 'stretch', background: C.accent, borderRadius: 2 }} />
          <div style={{ fontFamily: serif, fontSize: 25, color: C.inkMute, lineHeight: 1.35 }}>{why}</div>
        </div>
        {/* donut gauge — 71% yours (terracotta) vs 29% AI (gray) */}
        <div style={{ position: 'relative', width: 300, height: 300, marginTop: 4, opacity: ease(f, 110, 126) }}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="135" fill="none" stroke={C.rule} strokeWidth="30" />
            <circle cx="150" cy="150" r="135" fill="none" stroke={C.accent} strokeWidth="30" strokeLinecap="butt" strokeDasharray={Cc} strokeDashoffset={Cc * (1 - 0.70 * pMine)} transform="rotate(-90 150 150)" />
            <circle cx="150" cy="150" r="135" fill="none" stroke={C.inkSoft} strokeWidth="30" strokeLinecap="butt" strokeDasharray={Cc} strokeDashoffset={Cc * (1 - 0.28 * pAI)} transform="rotate(96 150 150)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 96, color: C.accent, lineHeight: 1 }}>{nMine}%</div>
            <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: C.inkMute, marginTop: 4 }}>{lang === 'zh' ? '还是我的' : 'STILL MINE'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 34, opacity: ease(f, 150, 168) }}>
          <span style={{ fontFamily: MONO, fontSize: 17, color: C.inkMute }}><span style={{ color: C.accent }}>●</span> {lang === 'zh' ? '71% 还是我的' : '71% still mine'}</span>
          <span style={{ fontFamily: MONO, fontSize: 17, color: C.inkSoft }}>● {lang === 'zh' ? '29% 被 AI 接手' : '29% to AI'}</span>
        </div>
        <div style={{ marginTop: 8, padding: '11px 26px', borderRadius: 999, background: `${C.accent}14`, border: `1px solid ${C.accent}`, fontFamily: MONO, fontSize: 21, letterSpacing: 2, color: C.accent, opacity: ease(f, 200, 218), transform: `scale(${interpolate(ease(f, 200, 218), [0, 1], [0.94, 1])})` }}>● {lang === 'zh' ? '低风险 · LOW RISK' : 'LOW RISK'}</div>
        <div style={{ width: '90%', height: 1, background: C.rule, marginTop: 14, opacity: ease(f, 214, 230) }} />
        <div style={{ display: 'flex', gap: 64, opacity: ease(f, 220, 238) }}>
          {[
            { k: lang === 'zh' ? '预计被接手' : 'EST. TAKEOVER', v: '~2044' },
            { k: lang === 'zh' ? '置信区间' : 'CONFIDENCE', v: '2039–2049' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: C.inkSoft }}>{s.k}</div>
              <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 48, color: C.inkStrong, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 1, color: C.inkSoft, opacity: ease(f, 230, 248), textAlign: 'center' }}>{lang === 'zh' ? '常见于 · 工程师 / 建筑师 / 科研 / 投资' : 'COMMON IN · Engineers / Architects / Scientists'}</div>
      </div>
      <TimedSub text={caption} f={f} dur={dur} size={38} />
    </AbsoluteFill>
  );
};

/* ── which · identity pivot — 4×4 wall, your slot empty + glowing ── */
const Which: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur) }}>
      <Wall lang={lang} mode="which" />
      <EdgeFade />
      <TimedSub text={caption} f={f} dur={dur} size={46} />
    </AbsoluteFill>
  );
};

/* ── cta · two versions + URL ── */
const Cta: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  const uw = interpolate(ease(f, 34, 64), [0, 1], [0, 100]);
  const badge = lang === 'zh' ? '免费 · 最快 3 分钟出结果' : 'Free · results in ~3 min';
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), alignItems: 'center', justifyContent: 'center' }}>
      <Wall lang={lang} mode="bg" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, marginTop: -130 }}>
        <div style={{ position: 'relative', width: 132, height: 132, opacity: ease(f, 4, 22), transform: `scale(${interpolate(ease(f, 4, 22), [0, 1], [1.06, 1])})` }}>
          <div style={{ position: 'absolute', inset: '-16%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, ${C.accent}00 65%)`, filter: 'blur(8px)' }} />
          <Img src={charSrc('ESRP')} style={{ position: 'relative', width: 132, height: 132, borderRadius: 16, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ position: 'relative', opacity: ease(f, 14, 34) }}>
          <div style={{ fontFamily: MONO, fontSize: 60, letterSpacing: 3, color: C.accent }}>air.democra.ai</div>
          <div style={{ position: 'absolute', left: 0, bottom: -12, height: 4, width: `${uw}%`, background: C.accent }} />
        </div>
        {/* scan-to-take QR */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: ease(f, 30, 52), transform: `scale(${interpolate(ease(f, 30, 52), [0, 1], [0.92, 1])})` }}>
          <div style={{ padding: 16, background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 22, boxShadow: '0 10px 30px rgba(31,24,20,0.14)' }}>
            <Img src={staticFile('qr.png')} style={{ width: 248, height: 248, display: 'block', borderRadius: 8 }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.inkMute }}>{lang === 'zh' ? '扫码 · 马上开测' : 'SCAN TO TAKE IT'}</div>
        </div>
        <div style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 999, padding: '11px 30px', opacity: ease(f, 44, 64), fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: C.accent, boxShadow: '0 6px 18px rgba(31,24,20,0.10)' }}>{badge}</div>
        {/* version detail — on screen only (not spoken) */}
        <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: C.inkSoft, opacity: ease(f, 54, 74) }}>{lang === 'zh' ? '16 题 · 约 3 分钟　　60 题 · 约 12 分钟' : '16 Q · ~3 min      60 Q · ~12 min'}</div>
      </div>
      <TimedSub text={caption} f={f} dur={dur} size={36} />
    </AbsoluteFill>
  );
};

/* ── opening cover poster — magazine-style promo title card (no VO) ── */
export const Poster: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const railW = ease(f, 2, 14);
  const belt = lang === 'zh' ? '16 种 AI 职业人格　·　一分钟　·　免费' : '16 AI CAREER PERSONAS · ONE MINUTE · FREE';
  const sub = lang === 'zh' ? 'The human AI cannot replace.' : '16 career archetypes for the AI age';
  const badge = (code: string, rot: number, dx: number, w: number, z: number, off: number) => {
    const s = spring({ frame: f - (8 + off), fps, config: { damping: 16 } });
    return (
      <div key={code} style={{ position: 'absolute', left: '50%', bottom: 0, width: w, transformOrigin: '50% 95%', zIndex: z, opacity: s, transform: `translateX(calc(-50% + ${dx * s}px)) rotate(${rot * s}deg) scale(${interpolate(s, [0, 1], [0.9, 1])})` }}>
        <div style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 14, padding: 8, boxShadow: `0 16px 40px rgba(31,24,20,${z === 3 ? 0.24 : 0.16})` }}>
          <Img src={charSrc(code)} style={{ width: '100%', height: w, objectFit: 'cover', borderRadius: 10 }} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.paper, alignItems: 'center', justifyContent: 'center' }}>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)`, transform: `scaleX(${railW})`, transformOrigin: 'center' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 40, border: `1px solid ${C.rule}`, opacity: 0.6 * ease(f, 2, 14), pointerEvents: 'none' }} />
      {/* report header */}
      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: ease(f, 6, 20) }}>
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 900, fontSize: 70, color: C.inkStrong, letterSpacing: 2 }}>AIR</div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: C.inkSoft, marginTop: 8 }}>{lang === 'zh' ? 'AI 职业人格测试' : 'THE AI-RESISTANCE CAREER TEST'}</div>
      </div>
      {/* centered core */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, marginTop: 40 }}>
        <div style={{ position: 'relative', width: 320, height: 220, marginBottom: 10 }}>
          {badge('ESRP', -9, -132, 168, 1, 4)}
          {badge('TSRH', 9, 132, 168, 1, 8)}
          {badge('ESRH', -1.5, 0, 200, 3, 0)}
        </div>
        <div style={{ width: 120, height: 2, background: C.accent, opacity: ease(f, 24, 38) }} />
        <div style={{ fontFamily: serif, fontWeight: 900, fontSize: lang === 'zh' ? 112 : 92, lineHeight: 1.05, color: C.inkStrong, textAlign: 'center', opacity: ease(f, 26, 44), transform: `translateY(${interpolate(ease(f, 26, 44), [0, 1], [22, 0])}px)` }}>
          {lang === 'zh' ? (
            <>
              <div>AI 取代不了的</div>
              <div>那种<span style={{ color: C.accent, fontStyle: 'italic', fontSize: 138 }}>「人」</span></div>
            </>
          ) : (
            <>
              <div>The <span style={{ color: C.accent, fontStyle: 'italic' }}>human</span></div>
              <div>AI cannot replace.</div>
            </>
          )}
        </div>
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 38, color: C.inkMute, opacity: ease(f, 42, 58) }}>{sub}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: ease(f, 46, 62) }}>
          <div style={{ width: 320, height: 1, background: C.rule }} />
          <div style={{ fontFamily: MONO, fontSize: 25, letterSpacing: 2, color: C.inkMute }}>{belt}</div>
          <div style={{ width: 320, height: 1, background: C.rule }} />
        </div>
        <div style={{ background: C.inkStrong, color: C.paper, fontFamily: serif, fontWeight: 600, fontSize: 34, padding: '17px 42px', borderRadius: 999, marginTop: 4, opacity: ease(f, 52, 66), transform: `scale(${interpolate(ease(f, 52, 66), [0, 1], [0.94, 1])})` }}>air.democra.ai →</div>
      </div>
      <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: C.inkSoft, opacity: ease(f, 58, 70) }}>ISSUE 01 · DEMOCRA.AI</div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<SP>> = { 'hero-real': Hook, 'grid-float': Grid, 'axes-anim': Axes, 'result-real': Example, 'which-pivot': Which, cta: Cta };
export const SceneSwitch: React.FC<{ id: string } & SP> = ({ id, ...p }) => {
  const Comp = MAP[id] ?? Hook;
  return <Comp {...p} />;
};
