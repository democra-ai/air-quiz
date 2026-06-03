import type { Lang } from './theme';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
/** VO starts this many frames into each scene (caption/visual lead-in). */
export const LEAD = 14;

export interface SceneDef {
  id: string;
  /** duration in frames, per language (= VO length + breathing room, min 4s). */
  frEn: number;
  frZh: number;
  captionEn: string;
  captionZh: string;
}

export const SCENES: SceneDef[] = [
  { id: 's1', frEn: 216, frZh: 120, captionEn: 'The kind of human\nAI cannot replace.', captionZh: 'AI 无法取代的\n那种人。' },
  { id: 's2', frEn: 189, frZh: 196, captionEn: 'A personality test for\nyour work’s AI-resistance.', captionZh: '一场性格测试 ——\n测你职业的「抗 AI」能力。' },
  { id: 's3', frEn: 199, frZh: 224, captionEn: 'Four axes.\nOne four-letter code.', captionZh: '四个维度，\n一组四字母代码。' },
  { id: 's4', frEn: 205, frZh: 182, captionEn: '16 questions. Click to\nchoose, click to go.', captionZh: '16 道题，点一下选，\n再点一下走。' },
  { id: 's5', frEn: 162, frZh: 221, captionEn: 'Take it as a\nSoftware Developer…', captionZh: '比如，以「软件\n工程师」来测……' },
  { id: 's6', frEn: 218, frZh: 293, captionEn: '45% replaceable · ~2038', captionZh: '可替代性 45% · 约 2038 年' },
  { id: 's7', frEn: 199, frZh: 225, captionEn: '24.7% of work is\nalready replaceable.', captionZh: '24.7% 的工作\n已可被替代。' },
  { id: 's8', frEn: 221, frZh: 154, captionEn: 'Find your archetype — free.', captionZh: '找到你的原型 —— 免费。' },
];

export const sceneFrames = (s: SceneDef, lang: Lang) => (lang === 'en' ? s.frEn : s.frZh);
export const totalFrames = (lang: Lang) => SCENES.reduce((a, s) => a + sceneFrames(s, lang), 0);
