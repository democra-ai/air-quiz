export const meta = {
  name: 'air-promo-script-storyboard',
  description: 'Research-backed bilingual script + storyboard for the AIR promo video (MBTI-for-AI hook, resistance framing)',
  phases: [
    { title: 'Research', detail: 'parallel: promo copywriting craft · personality-test virality · AI-resistance framing · reference reels · zh 网感' },
    { title: 'Draft', detail: '3 diverse bilingual script+storyboard drafts (same 7 beats, different voice)' },
    { title: 'Judge', detail: 'panel scores drafts; pick winner + lines to graft' },
    { title: 'Synthesize', detail: 'merge winner + grafted best lines into one script' },
    { title: 'Polish', detail: 'humanize (kill AI-tells, both langs) + verify constraints' },
  ],
}

/* ───────────────────────── GROUND TRUTH (authoritative — agents must not contradict) ───────────────────────── */
const GT_PRODUCT = `【产品权威事实 / PRODUCT FACTS】
- 名称 AIR — The AI-Resistance Career Personality Test (air.democra.ai). 像 MBTI 一样测人格，但测的是「你的职业有多能抵挡 AI」。
- 一定要打的类比：MBTI 有 16 型人格；我们有 16 种「职业原型」——同样 4 个维度 × 2 极 = 16 型，但每一型代表一种「在 AI 浪潮里站得住脚」的方式。这是全片的灵魂钩子，必须在前两幕就立住。
- 测法：免费、约 1 分钟、16 道题（每个维度 4 题）。
- 4 个维度（每个维度：左极=AI 拿得走 / 右极=你守得住）：
  1) 可学习性 Learnability — Explicit 显性(AI 学得会) ↔ Tacit 隐性经验(AI 学不会)
  2) 评判标准 Evaluation — Objective 客观可量(AI 能优化) ↔ Subjective 主观品味(AI 难替)
  3) 容错空间 Risk — Flexible 可纠错(AI 敢上) ↔ Rigid 一锤定音/高代价(得靠人)
  4) 人的在场 Human — Product 只看产出(AI 能匿名交付) ↔ Human 非你不可(客户/病人/相关方信任你本人)
- 16 原型 (代号 | EN | 中文): EOFP 玻璃大炮 The Glass Cannon · EOFH 人脉桥梁 The Human Bridge · EORP 终审印章 The Final Stamp · EORH 执照之墙 The License Wall · ESFP 品味定义者 The Taste Maker · ESFH 活体品牌 The Living Brand · ESRP 高压炼金师 The Pressure Alchemist · ESRH 神谕者 The Oracle · TOFP 赤手行者 The Bare Hand · TOFH 签名手艺人 The Signature Touch · TORP 不颤之手 The Steady Hand · TORH 疗愈之手 The Healing Hand · TSFP 灵魂匠人 The Soul Craftsman · TSFH 不可替代者 The Irreplaceable · TSRP 终极裁决者 The Last Call · TSRH 铁壁堡垒 The Iron Fortress.
- 片中举的例子：一个【研究人员/科研人员】测出来是 ESRP「高压炼金师 / The Pressure Alchemist」，低风险，只有 ~29% 会被 AI 接手；该型签语「When failure isn't an option, they call a human / 当失败不是选项时，他们会找一个人来」。要说成「这是一种 X 型」并往「抵挡 AI」上落。`

const GT_FRAMING = `【framing 铁律】
- 全程说「抵抗 / 守住 / 扛得住 AI」(AI resistance / hold the line / withstand the wave)，绝不说「被 AI 替代」做主框架。角度是赋能、是「你能守住多少」，不是末日。
- 结果数字用「抵挡」口径：例如「只有约三成会被接手，剩下的，是你的」。
- 真实站点更大盘是「AI 替代风险平台」，但这条宣传片只讲【人格测试】这一个入口，轻快、好奇、想转发。`

const GT_VISUALS = `【可拍素材 / 固定 7 拍，按此顺序，只可在文案与分镜细节上发挥，不要改拍数与可视化类型】
1. hero-real    — 真实首页截图（暖米色 + 赤陶红的编辑杂志风），顶部一条赤陶装饰线。开场用真实首页，不要太素。
2. grid-float   — 两行水彩人格卡左右反向缓缓浮动（首页那种艺术感），每张卡看得清头像+代号+名字。这是「16 型」的眼球钩子。
3. axes-anim    — 动效：顶部「E S R P」逐字弹出（守住的两极标红、被拿走的两极灰）；下方 4 条维度轴，圆点落点呈 2-2（两样被拿走、两样守得住）。
4. quiz-real    — 真实答题页录屏，鼠标点选一个选项 → Screen Studio 式局部聚焦放大到点击处 → 再点下一题。
5. result-real  — 真实结果页（研究人员 → ESRP「高压炼金师」，低风险），从顶部人格名+水彩像切到下滑的数据区。
6. which-pivot  — 两行人格墙整体变灰暗下，其中一格变成跳动的赤陶「?」=「你？」，你的位置还空着。
7. cta          — 淡人格墙背景，ESRP 水彩像带光晕，行动号召 + air.democra.ai 下划线动画。`

const GT_AUDIO = `【配音/字幕 写法约束（决定能不能直接进 edge-tts 管线）】
- narration 是要被 TTS 朗读的【纯口播】：不带括号舞台提示、不带 emoji、不带 markdown。中文女声 zh-CN-XiaoxiaoNeural，英文女声 en-US-AvaMultilingualNeural。语气轻快、亲切、有网感但不浮夸。
- 网址在口播里写成可朗读形式：EN「air dot democra dot ai」；ZH「air democra ai」。代号按字母念：EN「E S R P」；ZH 同样逐字「E S R P」。
- caption 是烧录在画面上的字幕（可与口播不同、更短更狠），最多两行，用 \\n 分两行；中英各一版。
- 每拍 durationSecHint 与 narration 长度成正比；英文总时长目标 ~55-65s，中文 ~50-60s。`

const GT_ANTISLOP = `【反 AI 腔（humanizer）— 中英都要避免】
- EN: no "in today's world / unlock / delve / empower / leverage / seamless / game-changer / it's not just X, it's Y"; avoid em-dash overuse, avoid rule-of-three everywhere, avoid hollow superlatives. Write like a sharp human ad writer: concrete, short, with rhythm and one memorable line per beat.
- ZH: 禁「在当今/赋能/总而言之/众所周知/不仅仅是…更是/科技改变生活」这类八股；要口语、短句、有网感、有钩子，像真人博主在讲，不像产品说明书。`

/* ───────────────────────── SCHEMAS ───────────────────────── */
const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: '150字以内要点综述' },
    keyPoints: { type: 'array', items: { type: 'string' }, description: '可直接进脚本的手法/事实' },
    quotables: { type: 'array', items: { type: 'string' }, description: '可直接当钩子/金句/CTA 的短句（中英都可）' },
    sources: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'keyPoints', 'quotables'],
}
const VISUAL_TYPES = ['hero-real', 'grid-float', 'axes-anim', 'quiz-real', 'result-real', 'which-pivot', 'cta']
const SCRIPT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    logline: { type: 'string', description: 'one sentence pitch' },
    angle: { type: 'string', description: 'this draft\'s distinct creative angle' },
    scenes: {
      type: 'array',
      minItems: 7, maxItems: 7,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          beat: { type: 'string', description: 'beat name' },
          visualType: { type: 'string', enum: VISUAL_TYPES },
          visualNotes: { type: 'string', description: '分镜：镜头怎么动、画面里有什么、节奏（给制作者看）' },
          durationSecHint: { type: 'number' },
          narrationEn: { type: 'string', description: 'TTS-speakable English VO, no stage directions' },
          narrationZh: { type: 'string', description: '可朗读中文口播，无舞台提示' },
          captionEn: { type: 'string', description: 'burned-in EN caption, <=2 lines, use \\n' },
          captionZh: { type: 'string', description: 'burned-in ZH caption, <=2 lines, use \\n' },
        },
        required: ['id', 'beat', 'visualType', 'visualNotes', 'durationSecHint', 'narrationEn', 'narrationZh', 'captionEn', 'captionZh'],
      },
    },
  },
  required: ['title', 'logline', 'scenes'],
}
const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          angle: { type: 'string' },
          hook: { type: 'number' }, clarity: { type: 'number' }, mbtiAnalogy: { type: 'number' },
          zhNativeness: { type: 'number' }, resistanceFraming: { type: 'number' }, shootable: { type: 'number' },
          total: { type: 'number' }, notes: { type: 'string' },
        },
        required: ['angle', 'total'],
      },
    },
    winnerAngle: { type: 'string' },
    graft: { type: 'array', items: { type: 'string' }, description: 'best individual lines/ideas from non-winners to fold in, with which beat' },
    perBeatBest: { type: 'array', items: { type: 'string' }, description: 'for each of the 7 beats, the single best caption/narration choice across all drafts' },
    rationale: { type: 'string' },
  },
  required: ['winnerAngle', 'rationale'],
}

/* ───────────────────────── RESEARCH ───────────────────────── */
phase('Research')
const RESEARCHERS = [
  { key: 'copy', label: 'promo-copywriting-craft', prompt: `你是顶级广告/短视频文案研究员。任务：为一条 ~60 秒的产品宣传片（一个像 MBTI 的「AI 职业抵抗力」人格测试）找出最专业的【文案手法】。
用 WebSearch/WebFetch 搜：explainer video script formula、product promo 60s script structure、hook formulas first 3 seconds、AIDA / PAS / "problem agitate solve"、Duolingo/Headspace 这类品牌的俏皮但聪明的 voice、tagline writing。
提炼：(a) 开场 3 秒钩子的具体句式；(b) 60 秒宣传片的节拍结构与每拍该干什么；(c) 写「记得住的一句话」的技巧；(d) CTA 怎么写才有人点。
输出 summary/keyPoints(可直接用的手法)/quotables(可直接用的英文钩子/CTA 句式)/sources。` },
  { key: 'viral', label: 'personality-test-virality', prompt: `你是社媒传播研究员。任务：搞清楚【为什么 MBTI / 16personalities / BuzzFeed 测试】会病毒式传播、会被疯狂转发。
用 WebSearch/WebFetch 搜：why personality tests go viral、16personalities sharing、identity badge social currency、"which one are you" mechanics、Barnum effect、self-expression sharing motivation。
提炼能直接用进脚本的「身份徽章 / 想晒 / 想对号入座 / 想拉朋友一起测」的心理钩子，以及怎么把「16 型人格」的熟悉感迁移到我们的「16 职业原型」。
输出 summary/keyPoints/quotables(可当口播的钩子句)/sources。` },
  { key: 'ai', label: 'ai-resistance-framing', prompt: `你是科技叙事研究员。任务：研究「AI 会不会抢我饭碗」这个话题怎么讲最抓人，且我们要用【抵抗/守得住】的正向框架而不是末日框架。
用 WebSearch/WebFetch 搜：will AI take my job framing、AI job displacement messaging、"AI-proof your career"、reframing automation anxiety、empowerment vs fear messaging、好用的相关 tagline。
提炼：怎么把焦虑转成好奇、把「替代率」说成「你守得住多少」、有哪些有力又不浮夸的说法。
输出 summary/keyPoints/quotables(中英皆可的有力短句)/sources。` },
  { key: 'reels', label: 'reference-reels', prompt: `你是短视频拆解专家。任务：找几条真实的「人格测试 / 找出你是哪一型 / quiz 安利」类爆款短视频或广告，拆它们的脚本套路。
用 WebSearch/WebFetch 搜：personality quiz promo video、"find your type" ad、TikTok/Reels personality test hook、enneagram/MBTI viral video script、小红书 测试 安利 文案。
提炼可复用的开场、节奏、悬念、收尾「那你呢？」式转发钩子。
输出 summary/keyPoints/quotables/sources。` },
  { key: 'zh', label: 'zh-wanggan-copy', prompt: `你是中文短视频/小红书爆款文案专家。任务：给一条「像 MBTI 但测 AI 抗替代力」的人格测试宣传片，提供地道、有网感的【中文】口播与字幕写法。
用 WebSearch/WebFetch 搜：小红书 标题 钩子 公式、抖音 口播 节奏、测试类 内容 文案、MBTI 中文 梗、"那你呢" 转发。
提炼：中文开场钩子句式、短句节奏、好笑又准的形容、避免翻译腔、结尾引导转发的口吻。给 5-8 条可直接用的中文金句/字幕。
输出 summary/keyPoints/quotables(纯中文，可直接用)/sources。` },
]
const findings = await parallel(RESEARCHERS.map((r) => () =>
  agent(r.prompt, { label: r.label, phase: 'Research', schema: RESEARCH_SCHEMA, agentType: 'general-purpose' })
))
const research = {}
RESEARCHERS.forEach((r, i) => { research[r.key] = findings[i] })
log('调研完成 → 写 3 个不同角度的脚本草稿')

/* ───────────────────────── DRAFT (3 diverse angles, same 7 beats) ───────────────────────── */
phase('Draft')
const COMMON = `${GT_PRODUCT}\n${GT_FRAMING}\n${GT_VISUALS}\n${GT_AUDIO}\n${GT_ANTISLOP}\n\n【调研结果 JSON】\n${JSON.stringify(research)}`
const ANGLES = [
  { key: 'identity', angle: '好奇 + 身份徽章：以「你知道你的 MBTI，那你的 AI 抗替代型呢？」式好奇钩子开场，全程像在邀请你对号入座、想晒想转。轻快、亲切。' },
  { key: 'stakes', angle: '利害 + 反转：用一点点「AI 真在改写岗位」的张力开场，但迅速反转到「所以更要知道你能守住什么」，落在赋能与抵抗。有力、有节奏。' },
  { key: 'playful', angle: '俏皮 + 网感：像聪明品牌（Duolingo 那种）的调皮口吻，金句多、节奏快、好笑又准，中文要特别有梗、特别想转发。' },
]
const drafts = await parallel(ANGLES.map((a) => () =>
  agent(`你是顶级双语（中英）广告编剧 + 分镜师。写一条 ~60 秒横屏 16:9 宣传片的【完整双语脚本 + 分镜】，严格按给定的固定 7 拍与可视化类型。
本稿的独特角度：${a.angle}

${COMMON}

【硬性要求】
1. 必须 7 个 scene，visualType 依次正好是 hero-real, grid-float, axes-anim, quiz-real, result-real, which-pivot, cta。
2. 每个 scene 同时给：narrationEn / narrationZh（可朗读纯口播）、captionEn / captionZh（画面字幕，更短更狠，<=2 行用 \\n 分行）、visualNotes（分镜：镜头怎么动+画面内容+节奏）、durationSecHint。
3. 灵魂钩子：MBTI 的 16 型 → 我们的 16 职业原型，必须在 hero/grid 两拍就立住并说清。
4. example 拍：研究人员 → ESRP「高压炼金师」，低风险，~29% 被接手，往「抵挡 AI」落。
5. which 拍：制造「那你是哪一种？你的位置还空着」的转发钩子。cta 拍：air.democra.ai + 邀请晒/拉朋友测。
6. 反 AI 腔；中文要地道有网感，不是翻译腔。英文总时长 ~55-65s，中文 ~50-60s（用 durationSecHint 体现）。
只输出符合 schema 的 JSON。`, { label: `draft:${a.key}`, phase: 'Draft', schema: SCRIPT_SCHEMA })
))
const liveDrafts = drafts.filter(Boolean)
log(`${liveDrafts.length} 稿完成 → 评审`)

/* ───────────────────────── JUDGE ───────────────────────── */
phase('Judge')
const judge = await agent(`你是挑剔的创意总监 + 双语母语者。下面是同一条宣传片的 ${liveDrafts.length} 个不同角度草稿（固定 7 拍）。
逐稿在 6 个维度打分(1-10)：hook(开场抓不抓人)、clarity(看不看得懂)、mbtiAnalogy(「16 型人格→16 职业原型」这个类比立没立住)、zhNativeness(中文地不地道、有没有网感、是不是翻译腔)、resistanceFraming(是不是「抵抗/守住」而非「被替代」)、shootable(是否贴合固定 7 拍可拍素材)。给 total。
选出综合最佳 winnerAngle；并做 perBeatBest：对 7 拍里每一拍，跨所有草稿挑出最好的那一句字幕/口播（注明取自哪个 angle、哪个语言）；graft：列出非冠军稿里值得并进来的金句/点子。rationale 说清为什么。
评分尤其严格对待：中文是否真的像人说话、开场 3 秒钩子、以及 MBTI 类比有没有第一时间落地。

${GT_FRAMING}

【草稿 JSON】
${JSON.stringify(liveDrafts)}
只输出符合 schema 的 JSON。`, { label: 'creative-director', phase: 'Judge', schema: JUDGE_SCHEMA })
log(`winner = ${judge.winnerAngle} → 合成`)

/* ───────────────────────── SYNTHESIZE ───────────────────────── */
phase('Synthesize')
const synth = await agent(`你是终稿编剧。以 winnerAngle=「${judge.winnerAngle}」的草稿为骨架，按评审的 perBeatBest 与 graft，把每一拍替换/融合成跨稿最佳的那一句，产出唯一一版最终双语脚本+分镜（固定 7 拍）。
要求：每拍 narrationEn/narrationZh/captionEn/captionZh/visualNotes/durationSecHint 齐全；MBTI→16 职业原型 在前两拍立住；研究人员→ESRP 例子在 result 拍；which 拍有「那你呢」转发钩子；全程抵抗框架；反 AI 腔；中文地道。英文总时长 ~55-65s，中文 ~50-60s。

${GT_PRODUCT}
${GT_FRAMING}
${GT_VISUALS}
${GT_AUDIO}
${GT_ANTISLOP}

【冠军及各稿 JSON】
${JSON.stringify(liveDrafts)}
【评审结论 JSON】
${JSON.stringify(judge)}
只输出符合 schema 的最终 JSON。`, { label: 'final-writer', phase: 'Synthesize', schema: SCRIPT_SCHEMA })

/* ───────────────────────── POLISH (humanize + verify) ───────────────────────── */
phase('Polish')
const polished = await agent(`你是双语润色 + 事实校验。拿到一版最终脚本，做两件事并输出【同结构】的精修版：
1) 人味润色：按反 AI 腔清单清掉所有 AI 腔（中英都要），让每拍 narration 念出来顺、caption 一眼记得住；中文务必地道、有网感、非翻译腔；英文像利落的人类广告文案。可改写任何句子，但不得改变 7 拍结构与 visualType。
2) 校验铁律（不满足就改到满足）：MBTI→16 职业原型类比在 hero/grid 立住；4 维度口径是「两样被拿走、两样守得住」；example 是研究人员→ESRP 高压炼金师 低风险 ~29%；全程「抵抗 AI」不是「被替代」；网址口播为 EN「air dot democra dot ai」/ ZH「air democra ai」；narration 无舞台提示/emoji/markdown；caption <=2 行。
保持 durationSecHint：英文总 ~55-65s、中文 ~50-60s。

${GT_ANTISLOP}
${GT_FRAMING}

【待精修 JSON】
${JSON.stringify(synth)}
只输出符合 schema 的最终精修 JSON。`, { label: 'humanize-verify', phase: 'Polish', schema: SCRIPT_SCHEMA })

return { research, judge, finalScript: polished }
