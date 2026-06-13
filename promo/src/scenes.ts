import type { Lang } from './theme';
import { SCENES, type SceneDef } from './scene-data';

// Canonical script lives in src/script.json; timing + captions are generated into
// src/scene-data.ts by scripts/prepare.mjs (edge-tts VO measured by ffprobe — the
// ai-video-studio prepare.py method). Audio: public/audio/<lang>/scene-NN.mp3.
export { SCENES };
export type { SceneDef };

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
/** VO starts this many frames into each scene (must match LEAD in prepare.mjs). */
export const LEAD = 10;

export const sceneFrames = (s: SceneDef, lang: Lang) => (lang === 'en' ? s.frEn : s.frZh);
export const totalFrames = (lang: Lang) => SCENES.reduce((a, s) => a + sceneFrames(s, lang), 0);
