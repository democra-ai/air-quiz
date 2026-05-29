/**
 * Data for the /macro page — the "big picture" content that existed on the
 * original air homepage + /analysis page but was dropped in the quiz-only
 * redesign. Kill-line / data-threat / hero-stat COPY lives in lib/translations.ts
 * (5 langs); the timeline + analysis data below were hardcoded in the old
 * components and are recreated here (en/zh; ja/ko/de fall back to en — the
 * original /analysis was en/zh only).
 */
import type { Language } from './translations';

export type Loc = Partial<Record<Language, string>> & { en: string };
/** Pick localized string, falling back to English. */
export const ml = (o: Loc, lang: Language): string => o[lang] ?? o.en;

/** Current employment-weighted replacement rate (E × P), see kill-line note. */
export const CURRENT_RATE = 24.7;

/** The 5-stage human↔AI relationship ladder behind the progress bar. */
export const KILL_STAGES: {
  range: [number, number];
  label: Loc;
  blurb: Loc;
  kill?: boolean;
}[] = [
  { range: [0, 20],   label: { en: 'AI Assist',   zh: 'AI 辅助' }, blurb: { en: 'You lead, AI executes',     zh: '你主导，AI 执行' } },
  { range: [20, 40],  label: { en: 'AI Augment',  zh: 'AI 增强' }, blurb: { en: 'You lead, AI elevates you',  zh: '你主导，AI 提升你' } },
  { range: [40, 60],  label: { en: 'AI Agent',    zh: 'AI 代理' }, blurb: { en: 'You direct, AI works',       zh: '你指挥，AI 干活' } },
  { range: [60, 80],  label: { en: 'AI Lead',     zh: 'AI 主导' }, blurb: { en: 'AI leads, you support',      zh: 'AI 主导，你配合' } },
  { range: [80, 100], label: { en: 'Kill Threshold', zh: '斩杀线' }, blurb: { en: 'Full replacement',         zh: '完全替代' }, kill: true },
];

/** The 3 headline macro stats (values; labels/sources come from translations.ts). */
export const MACRO_STATS: { value: string; labelKey: 'exposure' | 'proficiency' | 'jobs' }[] = [
  { value: '34.8%', labelKey: 'exposure' },
  { value: '71.3%', labelKey: 'proficiency' },
  { value: '92M',   labelKey: 'jobs' },
];

/** "From Steam to AGI" — 7 nodes (6 milestones + the now marker). */
export const TIMELINE: {
  year: number;
  name: Loc;
  impact: Loc;
  now?: boolean;
  projected?: boolean;
  aiEra?: boolean;
}[] = [
  { year: 1769, name: { en: 'Steam Engine', zh: '蒸汽机' },      impact: { en: 'Machines learned to move — replacing physical labor.', zh: '机器学会运动——替代体力劳动。' } },
  { year: 1879, name: { en: 'Electricity', zh: '电力' },         impact: { en: 'Power distributed everywhere; factories ran 24/7.', zh: '动力随处可得，工厂 24/7 运转。' } },
  { year: 2012, name: { en: 'Deep Learning', zh: '深度学习' },    impact: { en: 'Neural networks reached human-level perception.', zh: '神经网络达到人类水平的感知。' }, aiEra: true },
  { year: 2022, name: { en: 'ChatGPT', zh: 'ChatGPT' },          impact: { en: '100M users in 2 months — AI goes mainstream.', zh: '两个月一亿用户——AI 进入主流。' } },
  { year: 2025, name: { en: 'AI Agents', zh: 'AI 智能体' },       impact: { en: 'AI plans and executes multi-step work autonomously.', zh: 'AI 自主规划并执行多步骤工作。' } },
  { year: 2026, name: { en: 'We Are Here', zh: '我们在这里' },     impact: { en: 'AI already replacing 24.7% of work — and accelerating.', zh: 'AI 已替代 24.7% 的工作——且在加速。' }, now: true },
  { year: 2030, name: { en: 'AGI', zh: 'AGI' },                  impact: { en: 'Human-level AI projected across all cognitive domains.', zh: '预计在所有认知领域达到人类水平的 AI。' }, projected: true },
];

/** Impact-mode taxonomy (editorial palette). */
export const MODES: Record<string, { label: Loc; color: string }> = {
  'high-replacement': { label: { en: 'High replacement', zh: '高替代' }, color: '#c2492c' },
  'mixed':            { label: { en: 'Mixed impact',     zh: '混合影响' }, color: '#c08a2e' },
  'collaboration':    { label: { en: 'Collaboration',    zh: '人机协作' }, color: '#6b8e5a' },
  'augmentation':     { label: { en: 'Augmentation',     zh: '增强' },     color: '#6b8e5a' },
};

/** AI's first targets — high-risk jobs table (8 rows). */
export const HIGH_RISK_JOBS: {
  industry: Loc; risk: number; mode: keyof typeof MODES; jobs: Loc; reason: Loc;
}[] = [
  { industry: { en: 'Customer Service', zh: '客服 / 呼叫中心' }, risk: 95, mode: 'high-replacement', jobs: { en: 'Phone & online support', zh: '电话客服、在线客服' }, reason: { en: 'AI handles ~80% of standard queries by 2025.', zh: '2025 年 AI 可处理约 80% 标准问答。' } },
  { industry: { en: 'Admin & Support', zh: '行政 / 文秘' }, risk: 90, mode: 'high-replacement', jobs: { en: 'Assistants, data entry', zh: '助理、数据录入' }, reason: { en: 'Document/data work is highly codifiable.', zh: '文档与数据处理高度可被规则化。' } },
  { industry: { en: 'Finance & Accounting', zh: '金融 / 会计' }, risk: 65, mode: 'mixed', jobs: { en: 'Junior analysts', zh: '初级分析师' }, reason: { en: 'Entry-level at risk; senior roles augmented.', zh: '入门级有风险，高级岗位被增强。' } },
  { industry: { en: 'Media & Content', zh: '媒体 / 内容' }, risk: 50, mode: 'mixed', jobs: { en: 'Copywriting, basic design', zh: '文案、基础设计' }, reason: { en: 'Low-end replaced; creative work enhanced.', zh: '低端被替代，创意岗位被增强。' } },
  { industry: { en: 'Software Development', zh: '软件开发' }, risk: 45, mode: 'mixed', jobs: { en: 'Junior developers', zh: '初级开发者' }, reason: { en: 'Young devs −20%, overall +17.9% growth.', zh: '年轻开发者 −20%，但整体增长 +17.9%。' } },
  { industry: { en: 'Manufacturing', zh: '制造业' }, risk: 55, mode: 'collaboration', jobs: { en: 'Quality inspection, monitoring', zh: '质检、监控' }, reason: { en: 'Human-machine collaboration; no mass layoffs.', zh: '人机协作，无大规模裁员。' } },
  { industry: { en: 'Education', zh: '教育' }, risk: 20, mode: 'augmentation', jobs: { en: 'K-12 teachers', zh: '中小学教师' }, reason: { en: 'BLS projects +5% growth (2024–2034).', zh: 'BLS 预测 +5% 增长（2024–2034）。' } },
  { industry: { en: 'Healthcare (Radiology)', zh: '医疗（放射科）' }, risk: 15, mode: 'augmentation', jobs: { en: 'Radiologists', zh: '放射科医生' }, reason: { en: 'BLS projects +5% growth; AI as assistant.', zh: 'BLS 预测 +5% 增长，AI 作为助手。' } },
];

/** This isn't theory — real AI-cited layoffs (5). */
export const LAYOFFS: { company: Loc; layoffs: string; reason: Loc; industry: Loc }[] = [
  { company: { en: 'UPS', zh: 'UPS' }, layoffs: '30,000', reason: { en: 'Automation & restructuring', zh: '自动化与重组' }, industry: { en: 'Logistics', zh: '物流' } },
  { company: { en: 'Dow', zh: '陶氏化学' }, layoffs: '4,500', reason: { en: 'Focus on AI & automation', zh: '聚焦 AI 与自动化' }, industry: { en: 'Chemical', zh: '化工' } },
  { company: { en: 'Nike', zh: '耐克' }, layoffs: '775', reason: { en: 'Automating warehouses', zh: '自动化仓储' }, industry: { en: 'Retail', zh: '零售' } },
  { company: { en: 'Pinterest', zh: 'Pinterest' }, layoffs: '~15%', reason: { en: 'Shifting to AI-driven products', zh: '转向 AI 驱动产品' }, industry: { en: 'Tech', zh: '科技' } },
  { company: { en: 'Tech sector', zh: '科技行业' }, layoffs: '276,000+', reason: { en: 'AI-driven restructuring (2024–25)', zh: 'AI 驱动的重组（2024–25）' }, industry: { en: '2024–25', zh: '2024–25' } },
];

/** Displacement vs creation — the net-impact figures. */
export const NET_IMPACT = {
  displaced: { value: '92M', label: { en: 'jobs displaced by 2030', zh: '到 2030 年被替代' } as Loc },
  created:   { value: '170M', label: { en: 'new jobs created', zh: '新岗位被创造' } as Loc },
  net:       { value: '+78M', label: { en: 'net gain', zh: '净增长' } as Loc },
  source: { en: 'World Economic Forum, Future of Jobs 2025', zh: '世界经济论坛《就业未来报告 2025》' } as Loc,
};

/** Localized page chrome for sections whose copy is NOT in translations.ts. */
export const MACRO_UI: Record<string, Loc> = {
  eyebrow_intro:   { en: '§ I · The clock', zh: '§ I · 时钟' },
  intro_lead:      { en: 'The career test tells you where you stand. This page is the board the game is played on — how fast AI is actually moving, what it has already taken, and what comes next.', zh: '职业测试告诉你身处何处；这个页面是这盘棋的棋盘——AI 究竟推进得多快、已经拿走了什么、接下来是什么。' },
  eyebrow_threat:  { en: '§ II · The last mile', zh: '§ II · 最后一公里' },
  eyebrow_timeline:{ en: '§ III · The timeline', zh: '§ III · 时间线' },
  timeline_title:  { en: 'From Steam to AGI', zh: '从蒸汽机到 AGI' },
  timeline_sub:    { en: '250 years of accelerating change — and where you stand on it.', zh: '250 年加速变革——以及你所处的位置。' },
  eyebrow_risk:    { en: '§ IV · First targets', zh: '§ IV · 第一批猎物' },
  risk_title:      { en: "AI's First Targets", zh: 'AI 的第一批猎物' },
  risk_sub:        { en: "AI doesn't hit everyone equally — it picks the soft targets first. If your work is rule-describable, repetitive, and document-heavy, you're on the priority list.", zh: 'AI 不会平均地影响所有人——它先挑"软柿子"。如果你的工作可被规则描述、重复度高、文档密集，你就在优先列表里。' },
  th_industry:     { en: 'Industry', zh: '行业' },
  th_risk:         { en: 'Risk', zh: '风险' },
  th_mode:         { en: 'Mode', zh: '模式' },
  th_jobs:         { en: 'Exposed roles', zh: '高危岗位' },
  th_reason:       { en: 'Evidence', zh: '证据' },
  eyebrow_layoffs: { en: '§ V · Not theory', zh: '§ V · 不是理论' },
  layoffs_title:   { en: 'Companies Are Already Cutting Jobs with AI', zh: '这些公司已经开始用 AI 裁人' },
  layoffs_sub:     { en: 'In the news it reads as a layoff number. In the company spreadsheet it reads as "taken over by AI and automation."', zh: '在新闻里是"裁员数字"，在公司表格里写的是"由 AI 和自动化接管"。' },
  layoffs_cut:     { en: 'cut', zh: '裁员' },
  eyebrow_net:     { en: '§ VI · The full picture', zh: '§ VI · 全貌' },
  net_title:       { en: 'Displacement vs Creation', zh: '替代 vs 创造' },
  net_reality:     { en: 'Structural reshuffling, not total collapse. New jobs outnumber displaced ones — but the transition pain is real, and it lands first on the people on the list above.', zh: '这是结构性洗牌，而非全面崩盘。新岗位多于被替代的岗位——但转型的痛苦是真实的，且最先落在上面名单里的人身上。' },
  cta_eyebrow:     { en: 'Where do you land?', zh: '你落在哪里？' },
  cta_title:       { en: 'Find your archetype', zh: '测出你的原型' },
  cta_sub:         { en: 'Sixteen ways to stand against the clock.', zh: '面对这座时钟的十六种姿态。' },
  cta_button:      { en: 'Take the test', zh: '开始测试' },
  marker_here:     { en: 'WE ARE HERE', zh: '我们在这里' },
  now_label:       { en: 'now', zh: '当前' },
  projected_label: { en: 'projected', zh: '预测' },
};
