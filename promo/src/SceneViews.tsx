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
const Hook: React.FC<SP> = ({ lang, dur, caption }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur, 1, 16) }}>
      <ScrollPlate src={shot(lang, 'hero')} f={f} dur={dur} imgH={2800} to={-820} />
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow} 55%, transparent)`, zIndex: 7 }} />
      <TimedSub text={caption} f={f} dur={dur} size={42} />
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
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeIO(f, dur), overflow: 'hidden' }}>
      <ScrollPlate src={shot(lang, 'result')} f={f} dur={dur} imgH={3000} to={-1080} />
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
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, marginTop: -160 }}>
        <div style={{ position: 'relative', width: 200, height: 200, opacity: ease(f, 4, 24), transform: `scale(${interpolate(ease(f, 4, 24), [0, 1], [1.06, 1])})` }}>
          <div style={{ position: 'absolute', inset: '-16%', borderRadius: '50%', background: `radial-gradient(circle at 50% 45%, ${C.accent}33, ${C.accent}00 65%)`, filter: 'blur(8px)' }} />
          <Img src={charSrc('ESRP')} style={{ position: 'relative', width: 200, height: 200, borderRadius: 18, objectFit: 'cover', border: `1px solid ${C.rule}` }} />
        </div>
        <div style={{ background: C.paperCard, border: `1px solid ${C.rule}`, borderRadius: 999, padding: '13px 32px', opacity: ease(f, 14, 34), fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.accent, boxShadow: '0 6px 18px rgba(31,24,20,0.10)' }}>{badge}</div>
        <div style={{ position: 'relative', opacity: ease(f, 28, 48), marginTop: 6 }}>
          <div style={{ fontFamily: MONO, fontSize: 58, letterSpacing: 3, color: C.accent }}>air.democra.ai</div>
          <div style={{ position: 'absolute', left: 0, bottom: -12, height: 4, width: `${uw}%`, background: C.accent }} />
        </div>
      </div>
      <TimedSub text={caption} f={f} dur={dur} size={36} />
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<SP>> = { 'hero-real': Hook, 'grid-float': Grid, 'axes-anim': Axes, 'result-real': Example, 'which-pivot': Which, cta: Cta };
export const SceneSwitch: React.FC<{ id: string } & SP> = ({ id, ...p }) => {
  const Comp = MAP[id] ?? Hook;
  return <Comp {...p} />;
};
