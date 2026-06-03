import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadNotoSerifSC } from '@remotion/google-fonts/NotoSerifSC';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const fraunces = loadFraunces('normal', { weights: ['400', '600', '900'], subsets: ['latin'] }).fontFamily;
const notoSerifSC = loadNotoSerifSC('normal', { weights: ['400', '600', '900'], subsets: ['chinese-simplified', 'latin'] }).fontFamily;
export const MONO = loadMono('normal', { weights: ['400', '500', '700'], subsets: ['latin'] }).fontFamily;

export type Lang = 'en' | 'zh';

/** Editorial serif — Fraunces for Latin, Noto Serif SC stacked in for CJK. */
export const serif = `${fraunces}, ${notoSerifSC}, serif`;

/** "Editorial Existential" palette (matches the live site). */
export const C = {
  paper: '#f7f2e8',
  paperDeep: '#efe7d6',
  paperCard: '#fbf7ee',
  rule: '#d8ccb4',
  ink: '#1f1814',
  inkStrong: '#110b08',
  inkMute: '#5a4d40',
  inkSoft: '#8a7d6c',
  accent: '#c2492c',
  accentDeep: '#8e2f1a',
  accentGlow: '#e57550',
};

export const ARCHETYPES: { code: string; en: string; zh: string }[] = [
  { code: 'EOFP', en: 'The Glass Cannon', zh: '玻璃大炮' },
  { code: 'EOFH', en: 'The Human Bridge', zh: '人脉桥梁' },
  { code: 'EORP', en: 'The Final Stamp', zh: '终审印章' },
  { code: 'EORH', en: 'The License Wall', zh: '执照之墙' },
  { code: 'ESFP', en: 'The Taste Maker', zh: '品味定义者' },
  { code: 'ESFH', en: 'The Living Brand', zh: '活体品牌' },
  { code: 'ESRP', en: 'The Pressure Alchemist', zh: '高压炼金师' },
  { code: 'ESRH', en: 'The Oracle', zh: '神谕者' },
  { code: 'TOFP', en: 'The Bare Hand', zh: '赤手行者' },
  { code: 'TOFH', en: 'The Signature Touch', zh: '签名手艺人' },
  { code: 'TORP', en: 'The Steady Hand', zh: '不颤之手' },
  { code: 'TORH', en: 'The Healing Hand', zh: '疗愈之手' },
  { code: 'TSFP', en: 'The Soul Craftsman', zh: '灵魂匠人' },
  { code: 'TSFH', en: 'The Irreplaceable', zh: '不可替代者' },
  { code: 'TSRP', en: 'The Last Call', zh: '终极裁决者' },
  { code: 'TSRH', en: 'The Iron Fortress', zh: '铁壁堡垒' },
];
