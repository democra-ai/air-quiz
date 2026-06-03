import type { Lang } from './theme';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
/** VO starts this many frames into each scene (caption/visual lead-in). */
export const LEAD = 14;

export interface SceneDef {
  id: string;
  frEn: number;
  frZh: number;
  captionEn: string;
  captionZh: string;
}

// 7-beat arc: hook → 16 types → axes → quiz → example → which-one → CTA.
// Frame counts = measured VO + ~1.5s breathing room (min 4s).
export const SCENES: SceneDef[] = [
  { id: 'hook',    frEn: 162, frZh: 186, captionEn: 'You know your MBTI.\nDo you know your AI-resistance type?', captionZh: '你知道你的 MBTI，\n那你的「抗 AI 型」呢？' },
  { id: 'grid',    frEn: 285, frZh: 265, captionEn: '16 types — 16 ways to\nresist the AI wave.', captionZh: '16 种人格 ——\n16 种抵挡 AI 的方式。' },
  { id: 'axes',    frEn: 391, frZh: 393, captionEn: 'Four questions decide\nhow well you resist.', captionZh: '四个问题，\n定你抵挡 AI 的能力。' },
  { id: 'quiz',    frEn: 197, frZh: 140, captionEn: 'Free. About a minute.', captionZh: '免费，一分钟。' },
  { id: 'example', frEn: 288, frZh: 319, captionEn: 'A researcher → ESRP\nThe Pressure Alchemist', captionZh: '研究人员 → ESRP\n高压炼金师' },
  { id: 'which',   frEn: 216, frZh: 183, captionEn: 'Which one are YOU?', captionZh: '那你，是哪一种？' },
  { id: 'cta',     frEn: 279, frZh: 244, captionEn: 'Find your type — free.\nair.democra.ai', captionZh: '测出你的类型 · 免费\nair.democra.ai' },
];

export const sceneFrames = (s: SceneDef, lang: Lang) => (lang === 'en' ? s.frEn : s.frZh);
export const totalFrames = (lang: Lang) => SCENES.reduce((a, s) => a + sceneFrames(s, lang), 0);
