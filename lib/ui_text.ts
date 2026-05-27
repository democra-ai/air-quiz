/**
 * UI text for the redesigned AIR quiz site, in all 5 supported languages.
 *
 * Pages and components read from `UI[lang]` rather than embedding
 * `lang === 'zh' ? ... : ...` ternaries — that lets ja/ko/de users get
 * a real localized experience instead of falling through to English.
 *
 * String values that need an inline emphasised fragment (terracotta accent
 * inside a headline) are stored as `{pre, em, post}` triples so the JSX
 * can wrap the middle in <em>.
 */

import type { Language } from './translations';

type Segment = { pre: string; em: string; post: string };

export interface UIStrings {
  meta: {
    siteTagline: string;
    methodology_lead: string;        // paragraph in §04
  };

  nav: {
    masthead_caption: string;        // "an essay in 16 parts"
    take_test: string;               // small CTA on nav
    lang_switch_aria: string;
  };

  footer: {
    tagline: string;
    blurb: string;
    nav_heading: string;
    nav_home: string;
    nav_take: string;
    nav_archetypes: string;
    nav_macro: string;
    colophon_heading: string;
    colophon_body: string;
    copy_notice: string;
    version_note: string;
  };

  hero: {
    eyebrow: string;                 // "§ 01"
    eyebrow_label: string;           // "A survey about your work"
    headline: Segment;               // {pre} <em>{em}</em> {post}
    lead: string;
    cta_primary: string;
    cta_secondary: string;
    microcopy: string;
  };

  dimensions: {
    eyebrow: string;
    headline: string;
  };

  archetypes_section: {
    eyebrow: string;
    headline: string;
  };

  methodology: {
    eyebrow: string;
    headline: string;
    kicker: string;                  // "Not a personality quiz"
  };

  cta_tail: {
    eyebrow: string;                 // "Four minutes"
    headline: Segment;
    cta: string;
    sub: string;                     // "16 Q · anonymous · instant result"
  };

  intro: {
    eyebrow: string;                 // "§ 00 · Prelude"
    headline: Segment;
    lead: string;
    stat_questions: string;
    stat_time: string;
    stat_time_value: string;
    stat_dimensions: string;
    stat_archetypes: string;
    cta_start: string;
    cta_back: string;
    privacy_note: string;
    mode_label: string;
    mode_quick: string;
    mode_quick_meta: string;
    mode_full: string;
    mode_full_meta: string;
  };

  question: {
    section_prefix: string;          // e.g. "I" — actually computed; use just dot connector
    back: string;
    continue: string;
    see_result: string;
    progress_label: string;          // "Question"
  };

  completing: {
    headline: string;
    phase_1: string;
    phase_2: string;
    phase_3: string;
  };

  result: {
    eyebrow_result: string;          // "§ I · Your archetype"
    eyebrow_axes: string;            // "§ II · Across four axes"
    eyebrow_meaning: string;         // "§ III · What this means"
    eyebrow_advice: string;          // "§ IV · What to do"
    eyebrow_careers: string;         // "§ V · Representative careers"
    eyebrow_share: string;           // "§ VI · Share"
    eyebrow_other: string;           // "§ VII · The other 15"

    stat_prob: string;
    stat_year: string;
    stat_confidence: string;

    axis_favorable: string;          // "AI catches up easily on this axis."
    axis_resistant: string;          // "This axis is your moat."

    moat_label: string;              // "Your superpower"
    kryptonite_label: string;        // "Your kryptonite"

    careers_headline: string;

    share_copy: string;
    share_copied: string;
    share_twitter: string;
    share_weibo: string;

    retake_eyebrow: string;          // "Answer differently?"
    retake_headline: string;
    retake_cta: string;
  };

  profile: {
    crumb: string;                   // "All archetypes"
    cta_take_test: string;
    eyebrow_axes: string;            // "§ II · Across four axes"
    eyebrow_why: string;             // "§ III · Why this archetype"
    eyebrow_careers: string;         // "§ IV · Representative careers"
    eyebrow_other: string;           // "§ V · The other 15"
    moat_label: string;
    kryptonite_label: string;
  };
}

// ─── EN ─────────────────────────────────────────────────────────────────────
const EN: UIStrings = {
  meta: {
    siteTagline: 'The AI-Resistance Career Personality Test',
    methodology_lead: "The four axes — Learnability, Evaluation, Risk Tolerance, Human Presence — are drawn from automation-economics literature. Scoring uses a Weighted Power Mean (r=-2): the Swiss Cheese Barrier Model, where one strong axis is enough to break AI's replacement chain. Underlying data: BLS OES 2023 (798 occupations), O*NET task structure, Eloundou et al. 2023 task exposure, OpenAI GDPval blind-judged win rates.",
  },
  nav: {
    masthead_caption: 'an essay in 16 parts',
    take_test: 'Take the test',
    lang_switch_aria: 'Language',
  },
  footer: {
    tagline: 'AI-Resistance Career Personality Test',
    blurb: 'A 16-question career personality test mapping your profession to one of sixteen archetypes. Built on BLS, O*NET, and the Anthropic Economic Index.',
    nav_heading: 'Navigate',
    nav_home: 'Home',
    nav_take: 'Take the test',
    nav_archetypes: '16 archetypes',
    nav_macro: 'Macro report →',
    colophon_heading: 'Colophon',
    colophon_body: 'Set in Fraunces and Instrument Sans. Designed and engineered by Democra AI.',
    copy_notice: '© {year} Democra · MIT License',
    version_note: 'v0.1 · Editorial preview',
  },
  hero: {
    eyebrow: '§ 01',
    eyebrow_label: 'A survey about your work',
    headline: { pre: 'The kind of ', em: 'human', post: '\nAI cannot replace.' },
    lead: 'A 16-question test maps your work to one of sixteen archetypes — from the Glass Cannon to the Iron Fortress. Built on BLS, O*NET, and the Anthropic Economic Index.',
    cta_primary: 'Take the test',
    cta_secondary: 'Browse the 16 archetypes',
    microcopy: 'c. 4 min · fully anonymous · no signup',
  },
  dimensions: {
    eyebrow: '§ 02 · The four axes',
    headline: "Four independent axes decide how fast AI can come for your work.",
  },
  archetypes_section: {
    eyebrow: '§ 03 · Sixteen archetypes',
    headline: 'Laid out in full — yours is one of these.',
  },
  methodology: {
    eyebrow: '§ 04 · Methodology',
    headline: 'Why this test is serious.',
    kicker: 'Not a personality quiz.',
  },
  cta_tail: {
    eyebrow: 'Four minutes',
    headline: { pre: 'Find out ', em: 'which one', post: ' you are.' },
    cta: 'Take the test',
    sub: '16 Q · anonymous · instant result',
  },
  intro: {
    eyebrow: '§ 00 · Prelude',
    headline: { pre: 'The test will ask you ', em: 'sixteen questions', post: ', about how you work.' },
    lead: 'There are no right answers. For each question, pick the option that best matches your day-to-day. From your sixteen answers we map you to one of sixteen archetypes and estimate the share of your work AI can already do.',
    stat_questions: 'Questions',
    stat_time: 'Reading time',
    stat_time_value: 'c. 4 min',
    stat_dimensions: 'Dimensions',
    stat_archetypes: 'Archetypes',
    cta_start: 'Begin the test',
    cta_back: 'Back to home',
    privacy_note: 'Data collected anonymously. For research only.',
    mode_label: 'Length',
    mode_quick: 'Quick',
    mode_quick_meta: '16 Q · ~4 min',
    mode_full: 'Full',
    mode_full_meta: '60 Q · ~15 min · finer dimension scoring',
  },
  question: {
    section_prefix: '',
    back: 'Back',
    continue: 'Continue',
    see_result: 'See result',
    progress_label: 'Question',
  },
  completing: {
    headline: 'Computing your archetype',
    phase_1: 'Cross-referencing the dataset…',
    phase_2: 'Locating among 16 archetypes…',
    phase_3: 'Estimating replacement probability…',
  },
  result: {
    eyebrow_result: '§ I · Your archetype',
    eyebrow_axes: '§ II · Across four axes',
    eyebrow_meaning: '§ III · What this means',
    eyebrow_advice: '§ IV · What to do',
    eyebrow_careers: '§ V · Representative careers',
    eyebrow_share: '§ VI · Share',
    eyebrow_other: '§ VII · The other 15',
    stat_prob: 'Replacement probability',
    stat_year: 'Predicted year',
    stat_confidence: 'Confidence interval',
    axis_favorable: 'AI catches up easily on this axis.',
    axis_resistant: 'This axis is your moat.',
    moat_label: 'Your superpower',
    kryptonite_label: 'Your kryptonite',
    careers_headline: 'Jobs that typically land in this archetype.',
    share_copy: 'Copy link',
    share_copied: 'Copied ✓',
    share_twitter: 'Twitter',
    share_weibo: 'Weibo',
    retake_eyebrow: 'Answer differently?',
    retake_headline: 'Take the test again.',
    retake_cta: 'Start over',
  },
  profile: {
    crumb: 'All archetypes',
    cta_take_test: 'See if you are this archetype',
    eyebrow_axes: '§ II · Across four axes',
    eyebrow_why: '§ III · Why this archetype',
    eyebrow_careers: '§ IV · Representative careers',
    eyebrow_other: '§ V · The other 15',
    moat_label: 'Superpower',
    kryptonite_label: 'Kryptonite',
  },
};

// ─── ZH ─────────────────────────────────────────────────────────────────────
const ZH: UIStrings = {
  meta: {
    siteTagline: 'AI 抗性职业人格测试',
    methodology_lead: 'AIR 的四个维度——可学习性、评判标准、风险容忍、人的存在——来自自动化经济学文献。打分用加权幂均值 (r=-2)，对应"瑞士奶酪屏障模型"——任一维度足够坚固即可阻断 AI 替代链路。底层数据集对齐 BLS OES 2023（798 个职业）、O*NET 任务结构、Eloundou et al. 2023 任务暴露度，以及 OpenAI GDPval 的盲评胜率。',
  },
  nav: {
    masthead_caption: '一份关于工作的 16 段叙述',
    take_test: '开始测试',
    lang_switch_aria: '语言',
  },
  footer: {
    tagline: 'AI 抗性职业人格测试',
    blurb: '一份 16 题的职业人格测试，把你的职业映射到 16 个原型之一。基于 BLS、O*NET、Anthropic Economic Index。',
    nav_heading: '导航',
    nav_home: '首页',
    nav_take: '开始测试',
    nav_archetypes: '16 种原型',
    nav_macro: '宏观报告 →',
    colophon_heading: '关于',
    colophon_body: '排版采用 Fraunces 与 Instrument Sans。由 Democra AI 设计与制作。',
    copy_notice: '© {year} Democra · MIT 协议',
    version_note: 'v0.1 · 编辑实验性版本',
  },
  hero: {
    eyebrow: '§ 01',
    eyebrow_label: '一份关于工作的问卷',
    headline: { pre: '哪种 ', em: '人', post: '，\nAI 取代不了？' },
    lead: '一份 16 题的测试，把你的工作映射到 16 个原型中的一个——从《玻璃大炮》到《铁壁堡垒》。基于 BLS、O*NET 与 Anthropic Economic Index。',
    cta_primary: '开始测试',
    cta_secondary: '先看看 16 种原型',
    microcopy: '约 4 分钟 · 完全匿名 · 无需注册',
  },
  dimensions: {
    eyebrow: '§ 02 · 四个维度',
    headline: '决定你被替代速度的，是四个互相独立的维度。',
  },
  archetypes_section: {
    eyebrow: '§ 03 · 十六种原型',
    headline: '排列开来——你的位置就在某一格里。',
  },
  methodology: {
    eyebrow: '§ 04 · 方法论',
    headline: '为什么这测试是认真的。',
    kicker: '不是个性测验。',
  },
  cta_tail: {
    eyebrow: '只需 4 分钟',
    headline: { pre: '知道自己 ', em: '是哪一种', post: '。' },
    cta: '开始测试',
    sub: '16 题 · 匿名 · 即时结果',
  },
  intro: {
    eyebrow: '§ 00 · 准备',
    headline: { pre: '这份测试要问你 ', em: '16 个问题', post: '，关于你怎么工作。' },
    lead: '没有"正确答案"。每题选一个最贴近你日常工作的描述。我们会根据你 16 题的答案，把你映射到 16 个原型里的一个，并算出 AI 能在多大程度上取代你的概率。',
    stat_questions: '题目数',
    stat_time: '估算用时',
    stat_time_value: '约 4 分钟',
    stat_dimensions: '维度',
    stat_archetypes: '可能结果',
    cta_start: '开始测试',
    cta_back: '返回首页',
    privacy_note: '数据匿名收集，仅用于研究。',
    mode_label: '版本',
    mode_quick: '简版',
    mode_quick_meta: '16 题 · 约 4 分钟',
    mode_full: '完整版',
    mode_full_meta: '60 题 · 约 15 分钟 · 维度评分更精细',
  },
  question: {
    section_prefix: '',
    back: '上一题',
    continue: '继续',
    see_result: '查看结果',
    progress_label: '进度',
  },
  completing: {
    headline: '正在计算',
    phase_1: '对照参考数据集……',
    phase_2: '在 16 个原型中定位……',
    phase_3: '估算替代概率……',
  },
  result: {
    eyebrow_result: '§ I · 你的原型',
    eyebrow_axes: '§ II · 四维分布',
    eyebrow_meaning: '§ III · 解读',
    eyebrow_advice: '§ IV · 建议',
    eyebrow_careers: '§ V · 典型职业',
    eyebrow_share: '§ VI · 分享',
    eyebrow_other: '§ VII · 其他原型',
    stat_prob: '替代概率',
    stat_year: '预测替代年份',
    stat_confidence: '置信区间',
    axis_favorable: 'AI 在这一维度上很容易追上你。',
    axis_resistant: '这一维度是你的护城河。',
    moat_label: '你的护城河',
    kryptonite_label: '你的弱点',
    careers_headline: '落在这个原型上的，常是这些职业。',
    share_copy: '复制链接',
    share_copied: '已复制 ✓',
    share_twitter: 'Twitter',
    share_weibo: '微博',
    retake_eyebrow: '想再答一次？',
    retake_headline: '重测一遍。',
    retake_cta: '重新开始',
  },
  profile: {
    crumb: '所有原型',
    cta_take_test: '测一下我是不是这个原型',
    eyebrow_axes: '§ II · 四维特征',
    eyebrow_why: '§ III · 为什么是这个原型',
    eyebrow_careers: '§ IV · 典型职业',
    eyebrow_other: '§ V · 其他原型',
    moat_label: '护城河',
    kryptonite_label: '弱点',
  },
};

// ─── JA ─────────────────────────────────────────────────────────────────────
const JA: UIStrings = {
  meta: {
    siteTagline: 'AI耐性キャリア・パーソナリティ・テスト',
    methodology_lead: 'AIRの4つの軸——学習可能性、評価基準、リスク許容、人の関与——は自動化経済学の文献に基づく。スコアリングは加重べき乗平均 (r=-2)、「スイスチーズ・バリアモデル」に対応する——いずれか1つの軸が十分に強ければAI代替の連鎖を断ち切れる。基礎データ：BLS OES 2023（798職種）、O*NETタスク構造、Eloundou et al. 2023のタスク露出度、OpenAI GDPvalの盲審勝率。',
  },
  nav: {
    masthead_caption: '16章からなる随筆',
    take_test: 'テストを受ける',
    lang_switch_aria: '言語',
  },
  footer: {
    tagline: 'AI耐性キャリア・パーソナリティ・テスト',
    blurb: '16問のキャリア・パーソナリティ・テストであなたの職業を16の原型のひとつにマッピング。BLS、O*NET、Anthropic Economic Indexに基づく。',
    nav_heading: 'ナビゲート',
    nav_home: 'ホーム',
    nav_take: 'テストを受ける',
    nav_archetypes: '16の原型',
    nav_macro: 'マクロレポート →',
    colophon_heading: 'コロフォン',
    colophon_body: 'FrauncesとInstrument Sansで組版。Democra AIが設計・制作。',
    copy_notice: '© {year} Democra · MITライセンス',
    version_note: 'v0.1 · エディトリアル・プレビュー',
  },
  hero: {
    eyebrow: '§ 01',
    eyebrow_label: '仕事についての調査',
    headline: { pre: 'AIに代替されない ', em: '人間', post: 'とは、\nどんな人か。' },
    lead: '16問のテストがあなたの仕事を16の原型のひとつにマッピングする——「ガラスの大砲」から「鉄壁の要塞」まで。BLS、O*NET、Anthropic Economic Indexに基づく。',
    cta_primary: 'テストを受ける',
    cta_secondary: '16の原型を見る',
    microcopy: '約4分・完全匿名・登録不要',
  },
  dimensions: {
    eyebrow: '§ 02 · 4つの軸',
    headline: 'AIがあなたの仕事に追いつく速さを決めるのは、独立した4つの軸。',
  },
  archetypes_section: {
    eyebrow: '§ 03 · 16の原型',
    headline: '全16種——あなたはこのうちのひとつ。',
  },
  methodology: {
    eyebrow: '§ 04 · 方法論',
    headline: 'なぜこのテストは本気なのか。',
    kicker: 'パーソナリティ・クイズではない。',
  },
  cta_tail: {
    eyebrow: 'たった4分',
    headline: { pre: '自分が ', em: 'どれなのか', post: ' 知ろう。' },
    cta: 'テストを受ける',
    sub: '16問 · 匿名 · 即時結果',
  },
  intro: {
    eyebrow: '§ 00 · 前奏',
    headline: { pre: 'このテストはあなたに ', em: '16の質問', post: ' をする。仕事の仕方について。' },
    lead: '正解はない。各質問で、あなたの日常に最も近い選択肢を選んでほしい。16問の回答から、あなたを16の原型のひとつにマッピングし、AIが今すでにこなせる仕事の割合を推定する。',
    stat_questions: '問題数',
    stat_time: '所要時間',
    stat_time_value: '約4分',
    stat_dimensions: '次元',
    stat_archetypes: '原型',
    cta_start: 'テストを始める',
    cta_back: 'ホームに戻る',
    privacy_note: 'データは匿名で収集。研究目的のみ。',
    mode_label: 'バージョン',
    mode_quick: '簡易版',
    mode_quick_meta: '16問 · 約4分',
    mode_full: '完全版',
    mode_full_meta: '60問 · 約15分 · より精緻な次元スコア',
  },
  question: {
    section_prefix: '',
    back: '戻る',
    continue: '次へ',
    see_result: '結果を見る',
    progress_label: '質問',
  },
  completing: {
    headline: '原型を計算中',
    phase_1: 'データセットと照合中…',
    phase_2: '16の原型のなかで位置づけ中…',
    phase_3: '代替確率を推定中…',
  },
  result: {
    eyebrow_result: '§ I · あなたの原型',
    eyebrow_axes: '§ II · 4軸の分布',
    eyebrow_meaning: '§ III · 解釈',
    eyebrow_advice: '§ IV · できること',
    eyebrow_careers: '§ V · 代表的な職業',
    eyebrow_share: '§ VI · シェア',
    eyebrow_other: '§ VII · 他の15種',
    stat_prob: '代替確率',
    stat_year: '予測代替年',
    stat_confidence: '信頼区間',
    axis_favorable: 'AIがこの軸ですぐ追いついてくる。',
    axis_resistant: 'この軸はあなたの堀。',
    moat_label: 'あなたの強み',
    kryptonite_label: 'あなたの弱点',
    careers_headline: 'この原型に該当しやすい職業。',
    share_copy: 'リンクをコピー',
    share_copied: 'コピーしました ✓',
    share_twitter: 'Twitter',
    share_weibo: 'Weibo',
    retake_eyebrow: '別の答えで試す？',
    retake_headline: 'もう一度受ける。',
    retake_cta: 'やり直す',
  },
  profile: {
    crumb: 'すべての原型',
    cta_take_test: 'この原型に当てはまるか試す',
    eyebrow_axes: '§ II · 4軸の特徴',
    eyebrow_why: '§ III · なぜこの原型なのか',
    eyebrow_careers: '§ IV · 代表的な職業',
    eyebrow_other: '§ V · 他の15種',
    moat_label: '強み',
    kryptonite_label: '弱点',
  },
};

// ─── KO ─────────────────────────────────────────────────────────────────────
const KO: UIStrings = {
  meta: {
    siteTagline: 'AI 저항성 직업 성격 테스트',
    methodology_lead: 'AIR의 네 가지 축——학습 가능성, 평가 기준, 위험 허용, 인간 관여——은 자동화 경제학 문헌에서 도출되었다. 점수 계산은 가중 멱평균(r=-2), 즉 "스위스 치즈 장벽 모델"——하나의 축이 충분히 강하면 AI 대체 사슬을 끊을 수 있다. 기반 데이터: BLS OES 2023(798개 직종), O*NET 작업 구조, Eloundou et al. 2023 작업 노출도, OpenAI GDPval 블라인드 평가 승률.',
  },
  nav: {
    masthead_caption: '16부로 이루어진 에세이',
    take_test: '테스트 시작',
    lang_switch_aria: '언어',
  },
  footer: {
    tagline: 'AI 저항성 직업 성격 테스트',
    blurb: '16개 질문의 직업 성격 테스트로 당신의 직업을 16개 원형 중 하나에 매핑한다. BLS, O*NET, Anthropic Economic Index에 기반.',
    nav_heading: '내비게이션',
    nav_home: '홈',
    nav_take: '테스트 시작',
    nav_archetypes: '16가지 원형',
    nav_macro: '거시 보고서 →',
    colophon_heading: '콜로폰',
    colophon_body: 'Fraunces와 Instrument Sans로 조판. Democra AI가 설계·제작.',
    copy_notice: '© {year} Democra · MIT 라이선스',
    version_note: 'v0.1 · 에디토리얼 프리뷰',
  },
  hero: {
    eyebrow: '§ 01',
    eyebrow_label: '당신의 일에 관한 설문',
    headline: { pre: 'AI가 대체할 수 없는 ', em: '인간', post: '은\n어떤 사람인가.' },
    lead: '16개 질문 테스트가 당신의 일을 16개 원형 중 하나에 매핑한다——「유리 대포」부터 「철벽 요새」까지. BLS, O*NET, Anthropic Economic Index 기반.',
    cta_primary: '테스트 시작',
    cta_secondary: '16가지 원형 둘러보기',
    microcopy: '약 4분 · 완전 익명 · 가입 불필요',
  },
  dimensions: {
    eyebrow: '§ 02 · 네 가지 축',
    headline: 'AI가 당신의 일을 따라잡는 속도를 결정하는 네 개의 독립된 축.',
  },
  archetypes_section: {
    eyebrow: '§ 03 · 열여섯 가지 원형',
    headline: '모두 펼쳐놓는다——당신은 이 중 하나.',
  },
  methodology: {
    eyebrow: '§ 04 · 방법론',
    headline: '이 테스트가 진지한 이유.',
    kicker: '성격 퀴즈가 아니다.',
  },
  cta_tail: {
    eyebrow: '단 4분',
    headline: { pre: '당신이 ', em: '어느 쪽인지', post: ' 알아보자.' },
    cta: '테스트 시작',
    sub: '16문항 · 익명 · 즉시 결과',
  },
  intro: {
    eyebrow: '§ 00 · 서문',
    headline: { pre: '이 테스트는 ', em: '16개 질문', post: '을 던진다. 당신이 일하는 방식에 대해.' },
    lead: '정답은 없다. 각 질문에서 당신의 일상에 가장 가까운 항목을 고르면 된다. 16개 답변으로 당신을 16개 원형 중 하나에 매핑하고, AI가 이미 처리할 수 있는 비율을 추정한다.',
    stat_questions: '문항 수',
    stat_time: '소요 시간',
    stat_time_value: '약 4분',
    stat_dimensions: '차원',
    stat_archetypes: '원형',
    cta_start: '테스트 시작',
    cta_back: '홈으로',
    privacy_note: '데이터는 익명으로 수집됩니다. 연구 목적 한정.',
    mode_label: '버전',
    mode_quick: '간단 버전',
    mode_quick_meta: '16문항 · 약 4분',
    mode_full: '전체 버전',
    mode_full_meta: '60문항 · 약 15분 · 더 정밀한 차원 점수',
  },
  question: {
    section_prefix: '',
    back: '이전',
    continue: '계속',
    see_result: '결과 보기',
    progress_label: '진행',
  },
  completing: {
    headline: '원형을 계산 중',
    phase_1: '데이터셋과 대조 중…',
    phase_2: '16개 원형 중 위치 찾는 중…',
    phase_3: '대체 확률 추정 중…',
  },
  result: {
    eyebrow_result: '§ I · 당신의 원형',
    eyebrow_axes: '§ II · 네 축의 분포',
    eyebrow_meaning: '§ III · 해석',
    eyebrow_advice: '§ IV · 해야 할 일',
    eyebrow_careers: '§ V · 대표 직업',
    eyebrow_share: '§ VI · 공유',
    eyebrow_other: '§ VII · 나머지 15가지',
    stat_prob: '대체 확률',
    stat_year: '예측 대체 연도',
    stat_confidence: '신뢰 구간',
    axis_favorable: 'AI가 이 축에서는 쉽게 따라잡는다.',
    axis_resistant: '이 축이 당신의 해자.',
    moat_label: '당신의 강점',
    kryptonite_label: '당신의 약점',
    careers_headline: '이 원형에 자주 해당되는 직업.',
    share_copy: '링크 복사',
    share_copied: '복사됨 ✓',
    share_twitter: 'Twitter',
    share_weibo: 'Weibo',
    retake_eyebrow: '다른 답변으로 다시?',
    retake_headline: '다시 테스트.',
    retake_cta: '처음부터',
  },
  profile: {
    crumb: '모든 원형',
    cta_take_test: '이 원형에 해당하는지 테스트하기',
    eyebrow_axes: '§ II · 네 축 특성',
    eyebrow_why: '§ III · 왜 이 원형인가',
    eyebrow_careers: '§ IV · 대표 직업',
    eyebrow_other: '§ V · 나머지 15가지',
    moat_label: '강점',
    kryptonite_label: '약점',
  },
};

// ─── DE ─────────────────────────────────────────────────────────────────────
const DE: UIStrings = {
  meta: {
    siteTagline: 'Der KI-Resistenz-Berufs­persönlichkeitstest',
    methodology_lead: 'Die vier Achsen von AIR — Erlernbarkeit, Beurteilbarkeit, Risikotoleranz, menschliche Präsenz — stammen aus der Automatisierungs­ökonomie. Die Bewertung nutzt ein gewichtetes Potenzmittel (r=-2), das Swiss-Cheese-Barrieremodell: eine einzige robuste Achse genügt, um die Ersatzkette der KI zu unterbrechen. Datengrundlage: BLS OES 2023 (798 Berufe), O*NET-Aufgabenstruktur, Eloundou et al. 2023 Aufgaben­exposition, blind bewertete Gewinnraten aus OpenAI GDPval.',
  },
  nav: {
    masthead_caption: 'ein Essay in 16 Teilen',
    take_test: 'Test starten',
    lang_switch_aria: 'Sprache',
  },
  footer: {
    tagline: 'KI-Resistenz-Berufs­persönlichkeitstest',
    blurb: 'Ein 16-Fragen-Berufs­persönlichkeitstest, der Ihren Beruf auf einen von sechzehn Archetypen abbildet. Basiert auf BLS, O*NET und dem Anthropic Economic Index.',
    nav_heading: 'Navigation',
    nav_home: 'Start',
    nav_take: 'Test starten',
    nav_archetypes: '16 Archetypen',
    nav_macro: 'Makro-Bericht →',
    colophon_heading: 'Kolophon',
    colophon_body: 'Gesetzt in Fraunces und Instrument Sans. Gestaltet und entwickelt von Democra AI.',
    copy_notice: '© {year} Democra · MIT-Lizenz',
    version_note: 'v0.1 · Editorial-Vorschau',
  },
  hero: {
    eyebrow: '§ 01',
    eyebrow_label: 'Eine Umfrage zu Ihrer Arbeit',
    headline: { pre: 'Die Art ', em: 'Mensch', post: ',\ndie KI nicht ersetzen kann.' },
    lead: 'Ein 16-Fragen-Test ordnet Ihre Arbeit einem von sechzehn Archetypen zu — von der Glaskanone bis zur Eisernen Festung. Basiert auf BLS, O*NET und dem Anthropic Economic Index.',
    cta_primary: 'Test starten',
    cta_secondary: 'Die 16 Archetypen ansehen',
    microcopy: 'ca. 4 Min · vollständig anonym · ohne Anmeldung',
  },
  dimensions: {
    eyebrow: '§ 02 · Die vier Achsen',
    headline: 'Vier unabhängige Achsen entscheiden, wie schnell KI Ihre Arbeit erreicht.',
  },
  archetypes_section: {
    eyebrow: '§ 03 · Sechzehn Archetypen',
    headline: 'Alle aufgereiht — Ihrer ist einer davon.',
  },
  methodology: {
    eyebrow: '§ 04 · Methodik',
    headline: 'Warum dieser Test ernst gemeint ist.',
    kicker: 'Kein Persönlichkeitsquiz.',
  },
  cta_tail: {
    eyebrow: 'Vier Minuten',
    headline: { pre: 'Finden Sie heraus, ', em: 'welcher', post: ' Sie sind.' },
    cta: 'Test starten',
    sub: '16 Fragen · anonym · sofortiges Ergebnis',
  },
  intro: {
    eyebrow: '§ 00 · Vorspiel',
    headline: { pre: 'Der Test stellt Ihnen ', em: 'sechzehn Fragen', post: ' — über Ihre Arbeit.' },
    lead: 'Es gibt keine richtigen Antworten. Wählen Sie für jede Frage die Option, die Ihrem Alltag am ehesten entspricht. Aus Ihren sechzehn Antworten ordnen wir Sie einem von sechzehn Archetypen zu und schätzen den Anteil Ihrer Arbeit, den KI bereits leisten kann.',
    stat_questions: 'Fragen',
    stat_time: 'Lesezeit',
    stat_time_value: 'ca. 4 Min',
    stat_dimensions: 'Dimensionen',
    stat_archetypes: 'Archetypen',
    cta_start: 'Test starten',
    cta_back: 'Zurück zum Start',
    privacy_note: 'Daten werden anonym erfasst. Nur zu Forschungszwecken.',
    mode_label: 'Länge',
    mode_quick: 'Kurz',
    mode_quick_meta: '16 Fragen · ca. 4 Min',
    mode_full: 'Vollständig',
    mode_full_meta: '60 Fragen · ca. 15 Min · feinere Bewertung',
  },
  question: {
    section_prefix: '',
    back: 'Zurück',
    continue: 'Weiter',
    see_result: 'Ergebnis ansehen',
    progress_label: 'Frage',
  },
  completing: {
    headline: 'Ihr Archetyp wird berechnet',
    phase_1: 'Datensatz wird abgeglichen…',
    phase_2: 'Position unter 16 Archetypen wird bestimmt…',
    phase_3: 'Ersetzungs­wahrscheinlichkeit wird geschätzt…',
  },
  result: {
    eyebrow_result: '§ I · Ihr Archetyp',
    eyebrow_axes: '§ II · Über vier Achsen',
    eyebrow_meaning: '§ III · Was das bedeutet',
    eyebrow_advice: '§ IV · Was Sie tun können',
    eyebrow_careers: '§ V · Typische Berufe',
    eyebrow_share: '§ VI · Teilen',
    eyebrow_other: '§ VII · Die anderen 15',
    stat_prob: 'Ersetzungs­wahrscheinlichkeit',
    stat_year: 'Prognosejahr',
    stat_confidence: 'Konfidenzintervall',
    axis_favorable: 'Auf dieser Achse holt KI rasch auf.',
    axis_resistant: 'Diese Achse ist Ihr Burggraben.',
    moat_label: 'Ihre Stärke',
    kryptonite_label: 'Ihre Schwäche',
    careers_headline: 'Berufe, die typisch zu diesem Archetyp gehören.',
    share_copy: 'Link kopieren',
    share_copied: 'Kopiert ✓',
    share_twitter: 'Twitter',
    share_weibo: 'Weibo',
    retake_eyebrow: 'Anders antworten?',
    retake_headline: 'Test erneut machen.',
    retake_cta: 'Von vorn',
  },
  profile: {
    crumb: 'Alle Archetypen',
    cta_take_test: 'Test machen, ob das auf Sie zutrifft',
    eyebrow_axes: '§ II · Über vier Achsen',
    eyebrow_why: '§ III · Warum dieser Archetyp',
    eyebrow_careers: '§ IV · Typische Berufe',
    eyebrow_other: '§ V · Die anderen 15',
    moat_label: 'Stärke',
    kryptonite_label: 'Schwäche',
  },
};

export const UI: Record<Language, UIStrings> = { en: EN, zh: ZH, ja: JA, ko: KO, de: DE };

export function ui(lang: Language): UIStrings {
  return UI[lang] ?? UI.en;
}
