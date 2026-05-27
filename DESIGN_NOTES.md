# AIR — Design Rationale

## Direction: *Editorial Existential*

The test asks an existential question (which kind of human can AI not replace) so the design should respect that weight. We deliberately avoid the two default modes of "personality-test site": (1) bright cartoony Buzzfeed quiz, (2) generic SaaS landing with purple gradients. Instead: a serious editorial publication that happens to be a test.

Reference field: The Atlantic interactive features × Are.na's restraint × 16personalities's character-driven warmth. The vibe should be: thoughtful, slightly slow, beautifully set, and the kind of thing you'd link from a Substack.

## Type system

Three typefaces, deliberately chosen to *not* read as default-Inter SaaS:

- **Display — Fraunces** (variable serif). We exploit the `SOFT`, `WONK`, and `opsz` axes for headlines vs body weights. Italic variant is the workhorse: archetype names, pull quotes, and accent words all run in *Fraunces Italic* with opsz=144 and SOFT=100. Gives the page its magazine voice.
- **Body — Instrument Sans.** A humanist sans with editorial proportions — looser counters than Inter, tighter than Söhne. Pairs cleanly with Fraunces and reads well at small sizes for body copy.
- **Mono — JetBrains Mono.** Used only for codes (`TORH`), percentages, and `§` section numbers. Tabular numerics, ss01 + ss02 stylistic sets.

Chinese sets fall back to system PingFang/Hiragino. Type scale uses fluid `clamp()` over 11 steps so heading sizes adapt smoothly to viewport.

## Color

Two palettes, both warm. Light mode is the canonical one (ivory paper, deep coffee ink, terracotta accent). Dark mode keeps the warmth (warm-black `#14110d`, bone text, amber accent — *not* the usual cold tech-black).

Single dominant accent — **terracotta `#c2492c`** in light, **amber `#e8a04c`** in dark — used sparingly: the operative word in a headline, the active state on an option card, the percentage on the result hero. Each of the four dimensions has its own muted accent (mulberry / terracotta / moss / honey) used only on dimension-specific elements.

## Layout grammar

- Print-magazine "front matter": every section opens with `§ 01 · LABEL` typeset in mono small-caps with a hairline rule extending to the right margin.
- Asymmetric splits — typically 1.3fr : 1fr on hero blocks with character glyph on the smaller side.
- Editorial drop-caps on the result-page narrative (the first character set in 4.6em Fraunces, terracotta).
- Pull quotes as a real design element, not afterthought — they carry the tagline and superpower/kryptonite copy.
- Hairline dotted rules between list items (careers, dimensions) — the cadence of a real essay, not a UI.

## What was cut, and why

- All MagicUI / Aceternity-style components (border-beam, magic-card, particles, neon-gradient, shimmer-button, animated-grid-pattern, …) — all generic "AI slop" patterns. Replaced with restraint.
- Everything that wasn't the quiz: hero stats counter, AI Kill timeline, layoff tracker, industry analysis, data-protection page. They live at `risk.democra.ai` now.
- AI-snapshot follow-up questions: kept the schema but skipped them in the flow. The 16 core questions are enough for a 4-minute experience. Can add back as an optional "more precise" follow-up later.

## Files written

```
app/
  globals.css              Full design system (CSS vars, typography, components)
  layout.tsx               Fraunces + Instrument Sans + JetBrains Mono fonts
  page.tsx                 Landing + quiz mount (?quiz=1)
  opengraph-image.tsx      Editorial-style social card
  share/[payload]/page.tsx + ResultPage.tsx
  profile/[code]/page.tsx
  sitemap.ts (trimmed to landing + 16 profile pages)

components/
  shell/
    Nav.tsx, Footer.tsx, ThemeBootstrap.tsx, AnalyticsProvider.tsx
    useTheme.ts, useLang.ts
  quiz/
    QuizFlow.tsx, QuizIntro.tsx, QuestionCard.tsx,
    ProgressRibbon.tsx, CompletingScreen.tsx
  result/
    ArchetypeSvg.tsx       Dynamic registry → existing 16 SVG glyphs
```

Existing reused (untouched): `components/characters/*`, all of `lib/`, all `app/api/*`.
