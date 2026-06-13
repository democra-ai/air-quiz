# AIR 宣传片 · 脚本与分镜 (Script & Storyboard) — v2 专业版

> 由 `workflows/script-storyboard.mjs` 工作流产出（调研→3稿→评审→合成→人味润色，11 个 agent）。
> 胜出角度：**好奇 + 身份徽章**。配音/BGM 走原项目 `ai-video-studio` 管线（script.raw.json → edge-tts 女声 → 时长测量；BGM = Carefree）。
> **改这份文件，或直接在对话里告诉我改动**。三层：分镜=画面 · 字幕=烧录文字 · 配音=女声口播。

**Logline:** MBTI 你早测过了，那你的「AI 职业人格」呢？60 秒、16 种职业原型，免费测出你能从 AI 手里守住哪一半。

**固定 7 拍 · durationSecHint 合计 ≈ 57s**（中文略长，edge-tts 实测后定稿）

---

## ① Hook / 好奇点名 — `hero-real` · ~8s
**分镜:** 真实首页截图：暖米色背景 + 赤陶红编辑杂志风排版，顶部一条赤陶红装饰细线缓缓画过。镜头从首页大标题微微下推(slow push-in)，右上角飘进一行手写体小字'你的 MBTI 你早知道了'。第 1 秒画面只有一句烧录大字钩子盖在首页上，0.8 秒后大字淡出、露出真实首页质感。节奏轻快，0.5 秒一个微动作，开场不要太素。第一句必须 2 秒内说完。
- **字幕 EN:** You know your MBTI.
What's your AI-resistance type?
- **字幕 ZH:** MBTI 你都测过了
那你的「AI 职业人格」呢？
- **配音 EN:** You know your MBTI by heart. But what's your AI-resistance type? Same idea — this one tells you how much of your job AI just can't touch.
- **配音 ZH:** MBTI 你早就背得出来了。那你的 AI 职业人格呢？玩法一样，但它测的是：你的饭碗，AI 到底动得了几分。

## ② 16 型类比 / 眼球钩子 — `grid-float` · ~9s
**分镜:** 两行水彩人格卡左右反向缓缓浮动(首页那种艺术感)，上行右移、下行左移，每张卡看得清水彩头像 + 四字母代号 + 原型名。镜头先全景展示满墙 16 张，再像逛画廊般横移扫过'终审印章''签名手艺人''神谕者'几张特写。一个赤陶大字'16'短暂叠在卡墙中央再化开，与 MBTI 的'16'对照。可在 B-roll 角落浮一行小字旁注'不是测你谈恋爱什么样'。节奏从容。
- **字幕 EN:** 16 personalities → 16 career archetypes
Each one: a way to hold the line
- **字幕 ZH:** 16 型人格 → 16 种职业原型
每一型，都是一种「守得住」的活法
- **配音 EN:** MBTI sorts you into sixteen personalities. We sort you into sixteen career archetypes. Four dimensions, two ends each — and every type is its own way to hold the line against AI.
- **配音 ZH:** MBTI 把你分成十六种人格，我们把你分成十六种职业原型。一样是四个维度、各两极，但每一型，都是你在 AI 浪潮里站得住脚的一种活法。

## ③ 四维度拆解 / 守住 vs 拿走 — `axes-anim` · ~9s
**分镜:** 动效拍：顶部'E S R P'四个字母逐字弹出，守住的两极(S、R)描赤陶红高亮，被拿走的两极(E、P)压灰。下方四条维度轴依次画出：可学习性 / 评判标准 / 容错空间 / 人的在场，圆点逐条'啪'地落位，最终呈 2-2 分布——两样被 AI 拿走、两样你守得住。画面标注规则：标红=你守得住、灰=被拿走。节奏跟口播一拍一个落点，每条轴落点时一个轻'叮'，像在拼一个身份徽章。
- **字幕 EN:** Learn it? Grade it?
Risk it? Need you?
- **字幕 ZH:** 学得会吗？打得了分吗？
敢替你冒险吗？非你不可吗？
- **配音 EN:** It comes down to four questions. Can AI learn it? Can AI grade it? Will AI take the risk? And do they need you, in the room? Four answers, sixteen ways to hold the line.
- **配音 ZH:** 说白了就四个问题：AI 学不学得会？打不打得了分？敢不敢替你扛这个险？还有，离了你这个人行不行？四个答案，拼出十六种站得住脚的活法。

## ④ 答题演示 / 零摩擦 — `quiz-real` · ~7s
**分镜:** 真实答题页录屏：鼠标移到一个选项上点选 → Screen Studio 式局部聚焦放大到点击处(背景轻微虚化压暗，点击点起一圈涟漪、选中态泛起赤陶红) → 进度条往前跳一格 → 再点下一题。展示两到三次点选，节奏轻快利落。底角小字'16 题 · 约 1 分钟 · 免费'常驻。
- **字幕 EN:** 16 questions · ~1 min
Free, no email
- **字幕 ZH:** 16 题 · 约 1 分钟
免费，不留邮箱
- **配音 EN:** Sixteen questions, about a minute, no sign-up. Four per dimension. Tap, tap, done before your coffee goes cold.
- **配音 ZH:** 十六道题，一分钟左右，不用注册。每个维度四道，点一点、再点一点，咖啡还没凉就测完了。

## ⑤ 结果示范 / 研究人员=高压炼金师 — `result-real` · ~9s
**分镜:** 真实结果页：顶部大字原型名'高压炼金师 / The Pressure Alchemist'配 ESRP 水彩像，左上角小标签'研究人员'。镜头从人格名 + 水彩像切到下滑的数据区，'低风险'徽章和'~29%'数字逐个点亮，赤陶红填充条只填到约 29%，其余大段留白高亮成'你的'。下滑露出该型签语一行。节奏先停顿给惊喜，再缓滑揭数据。
- **字幕 EN:** ESRP · AI can take ~29%.
The rest is yours.
- **字幕 ZH:** ESRP · 约 29% 会被接手。
剩下的，是你的。
- **配音 EN:** A researcher takes it and lands on ESRP — the Pressure Alchemist. Low risk. Only about twenty-nine percent of the work AI could take. The rest stays theirs. Because when failure isn't an option, you call a human.
- **配音 ZH:** 一个搞科研的来测，结果是 E S R P，高压炼金师。低风险。只有大约三成会被 AI 接手，剩下的，都是他自己的。因为一旦不许出错，谁都还是要找个活人来兜底。

## ⑥ 你是哪一种 / 转发钩子 — `which-pivot` · ~7s
**分镜:** 两行人格墙整体压暗变灰、轻微往后退，已知的十五格安静下来，唯独其中一格翻成跳动的赤陶红问号'?'，外圈一道光晕一缩一放像心跳，旁边浮字'你？'。镜头微微推近那一格，强调'你的位置还空着'。节奏由静到一个突出的跳动点，制造'必须点开才闭合'的好奇缺口。
- **字幕 EN:** One slot is still you-shaped.
Which type are you?
- **字幕 ZH:** 十五格都有脸了。
还有一格，写着「你？」
- **配音 EN:** Fifteen types already have a face. One slot's still blank — and it's shaped like you. So which one are you?
- **配音 ZH:** 十五种都有人对上号了，就剩一格还空着，那一格的形状，正好是你。所以，你到底是哪一种？

## ⑦ CTA / 去测+晒+拉人 — `cta` · ~8s
**分镜:** 淡化的人格墙做背景，居中 ESRP 水彩像带柔光晕浮起。底部网址'air.democra.ai'打出后一道赤陶红下划线从左到右划满。右下角飘入'测完截图发群里'小贴纸。节奏收束、上扬，最后定格在网址 + 下划线。
- **字幕 EN:** air.democra.ai
Find your type. Keep your half.
- **字幕 ZH:** air.democra.ai
测出你的型，守住你那一半。
- **配音 EN:** Find your type at air dot democra dot ai. One minute, free. Then send it to the coworker you secretly think AI's coming for first. We won't tell.
- **配音 ZH:** 去 air democra ai 测出你是哪一种，一分钟，免费。测完顺手发给那个你私下觉得最先被 AI 盯上的同事，看他敢不敢点开。放心，我不说。
