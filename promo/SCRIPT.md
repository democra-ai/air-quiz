# AIR 宣传片 · 脚本与分镜 — 终版（6 幕 · 配音==字幕）

> 由 PM+市场营销 多角色工作流润色。配音/BGM 走 `ai-video-studio` 管线（src/script.json → edge-tts 女声 → 时长测量；BGM=Carefree）。
> 每幕**一句话，配音和字幕完全一致**（屏上字幕随口播分块出现）。改文案后跑 `node scripts/prepare.mjs` 重算时长。

**Logline:** AI 正在重新划定哪些工作还需要人——像 MBTI 一样把职业分成 16 种原型，四个问题判定，第一人称带出 ESRP 高压炼金师，邀你测出自己的那一种。

---

## ① 钩子 / Hook — `hero-real`
**分镜:** 实拍冷静开场，缓推；只压这一句字幕，大量留白。
- **中文（配音=字幕）:** AI 正在重新决定，哪些工作还需要人——你的，算哪一种？
- **EN (VO = caption):** AI is redrawing which jobs still need a human. Which kind is yours?

## ② 16 原型 / Archetypes — `grid-float`
**分镜:** 两行水彩原型卡缓缓浮动，看得清头像+代号+名字；有秩序感、不喊口号。
- **中文（配音=字幕）:** 像 MBTI 一样，我们把职业也分成了 16 种原型。
- **EN (VO = caption):** Like MBTI, we sort careers into 16 archetypes.

## ③ 四维度 / Four Axes — `axes-anim`
**分镜:** 四条轴依次画出，每问对应一根轴；屏上问句逐字等于配音，正向极=你守得住。
- **中文（配音=字幕）:** 靠四个问题来分：AI 能不能学会？有没有判断标准？能不能担责？是否必须人来做？
- **EN (VO = caption):** Sorted by four questions: Can AI learn it? Is there a clear standard? Who takes the blame? Does it have to be you?

## ④ 我的结果 / My Result (ESRP) — `result-real`
**分镜:** 真实结果页：原型名+水彩像 → 切到 29% / 2044 / 2039-2049 数据区；第一人称、可信、不吹。
- **中文（配音=字幕）:** 我自己测了一下，是 ESRP，高压炼金师——在高压、不可逆、错了代价极高的时刻做创造性决策。这种活 AI 学得会，可好坏太主观、错了赔不起，所以越关键越得交给人。低风险，大概只有三成会被接手，剩下七成是我的。
- **EN (VO = caption):** I took it myself — I'm an ESRP, the Pressure Alchemist: making creative calls when the stakes are high, the move is irreversible, and a mistake costs everything. AI can learn the craft, but good is too subjective and one wrong call costs too much, so the higher the stakes, the more it stays human. Low risk — only about thirty percent gets taken, the rest stays mine.

## ⑤ 你是哪一种 / Which One — `which-pivot`
**分镜:** 16 原型墙压暗，一格变成跳动的赤陶问号=你；直给的邀请。
- **中文（配音=字幕）:** 16 种里，你是哪一种？现在就能测出来。
- **EN (VO = caption):** Which of the 16 are you? You can find out right now.

## ⑥ CTA — `cta`
**分镜:** 两版本并排（16 题 / 60 题）+ ESRP 像 + 网址下划线；轻松笃定，无挑衅。
- **中文（配音=字幕）:** 免费，不用留邮箱——16 题 3 分钟更快，60 题 12 分钟更准。测完，发给那个也该看看自己坐标的人。air democra ai。
- **EN (VO = caption):** Free, no signup — 16 questions in three minutes for a quick read, 60 in twelve for a precise one. When you're done, send it to someone who should see their own map too. air dot democra dot ai.
