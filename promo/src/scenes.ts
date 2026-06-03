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
  { id: 'hook',    frEn: 153, frZh: 194, captionEn: 'You know your MBTI.\nDo you know your AI type?', captionZh: '你知道你的 MBTI，\n那你的 AI 抗替代型呢？' },
  { id: 'grid',    frEn: 280, frZh: 210, captionEn: '16 types — but they measure\nif AI can do your job.', captionZh: '16 种人格 —— 但这套，\n测的是 AI 能不能取代你。' },
  { id: 'axes',    frEn: 374, frZh: 280, captionEn: 'It comes down to\nfour questions.', captionZh: '归根结底，\n就四个问题。' },
  { id: 'quiz',    frEn: 218, frZh: 140, captionEn: 'Free. About a minute.', captionZh: '免费，一分钟。' },
  { id: 'example', frEn: 401, frZh: 294, captionEn: 'A developer → ESFP\n45% replaceable · ~2038', captionZh: '程序员 → ESFP\n45% 可替代 · 约 2038' },
  { id: 'which',   frEn: 245, frZh: 162, captionEn: 'Which one are YOU?', captionZh: '那你，是哪一种？' },
  { id: 'cta',     frEn: 273, frZh: 201, captionEn: 'Find your type — free.\nair.democra.ai', captionZh: '测出你的类型 · 免费\nair.democra.ai' },
];

export const sceneFrames = (s: SceneDef, lang: Lang) => (lang === 'en' ? s.frEn : s.frZh);
export const totalFrames = (lang: Lang) => SCENES.reduce((a, s) => a + sceneFrames(s, lang), 0);
