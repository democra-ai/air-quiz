---
title: AIR
emoji: 🤖
colorFrom: red
colorTo: yellow
sdk: docker
pinned: false
license: mit
short_description: "AI Replacement Risk Platform"
tags:
  - next.js
  - react
  - ai-impact
  - data-visualization
  - employment
  - automation
---

<div align="center">

# AIR

### AI Replacement Risk Platform

A data-driven interactive platform that visualizes AI's impact on employment — featuring a questionnaire-based risk profiler, industry analysis, and an interactive timeline of AI milestones.

[![Live Demo](https://img.shields.io/badge/Live_Demo-air.democra.ai-ff4444?style=for-the-badge)](https://air.democra.ai)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare)](https://air.democra.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## Overview

**AIR** turns research from MIT, McKinsey, the World Economic Forum, and PwC into an interactive experience. Instead of reading dense reports, users can explore AI's impact on jobs through visualizations, take a questionnaire-based risk profiler to get their 4-letter AIR type, and understand what's coming next.

> *MIT: 11.7% of jobs replaceable now. McKinsey: 57% of work hours technically automatable. WEF: 92M jobs displaced, but 170M new jobs created by 2030.*

## Features

- **AI Replacement Progress Tracker** — Visual representation of where we are on the path to automation (11.7% current → 57% technical ceiling)
- **Interactive Timeline** — Key AI milestones from 2020 (Transformer Architecture) to 2040+ (High Automation Society), with expandable details
- **AIR Risk Profiler** — 16-question questionnaire across 4 dimensions (Exposure, Originality, Flexibility, Preparedness) producing a 4-letter type code (like MBTI) with 16 profile types and 5 risk tiers
- **Industry Deep Dive** — Sector-by-sector analysis across 7 industries with risk levels and evidence
- **Real Layoff Tracker** — Documented cases of AI-driven job cuts from real companies
- **Net Employment Effect** — WEF displacement vs. creation data, PwC wage premium analysis
- **Data Protection Awareness** — How your data trains AI to replace you, with platform-specific agreement analysis
- **Bilingual Support** — Full English / Chinese (中文) interface toggle
- **Dark / Light Theme** — User-selectable theme with persistent preference
- **Share System** — Share results via Twitter, Telegram, WeChat, Weibo with OG image cards and QR code posters

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16.1.6 (App Router, standalone output) |
| UI | [React](https://react.dev/) 19.2.3, [Tailwind CSS](https://tailwindcss.com/) v4 |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Testing | [Playwright](https://playwright.dev/) (E2E) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) (via `@opennextjs/cloudflare`) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) — `quiz_sessions`, `answer_distributions`, `answer_aggregate` |
| KV | [Cloudflare KV](https://developers.cloudflare.com/kv/) — rate-limiting, rollup counters |
| Object storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) — share-poster cache |
| Telemetry | [Cloudflare Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) |
| Anti-abuse | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) (invisible) |
| Language | TypeScript |

## Project Structure

```
air/
├── app/
│   ├── page.tsx                # Main page — hero, stats, timeline, risk profiler
│   ├── analysis/page.tsx       # Industry analysis, layoff tracker, net impact
│   ├── data-protection/page.tsx# Data protection awareness
│   ├── share/[payload]/        # Share result pages with OG image generation
│   ├── layout.tsx              # Root layout, fonts, metadata, theme
│   ├── globals.css             # Global styles and theme variables
│   └── opengraph-image.tsx     # Dynamic OG image generation
├── components/
│   ├── sections/               # Page sections (SurvivalIndexSection, etc.)
│   ├── share/                  # Share panel & poster components
│   └── NavigationControls.tsx  # Theme toggle, language switch
├── lib/
│   ├── air_quiz_data.ts        # Quiz questions, dimensions, 16 profile types
│   ├── air_quiz_calculator.ts  # Scoring logic, type determination
│   ├── share_payload.ts        # URL-encoded share payload encoding/decoding
│   └── translations.ts         # Bilingual EN/ZH translations
├── ai_risk_model.py            # Reference Python model (algorithm documentation)
├── tests/                      # Playwright E2E tests
├── Dockerfile                  # Multi-stage Docker build for HF Spaces
└── next.config.ts              # Next.js config (standalone output)
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build & Run (Production)

```bash
npm run build
npm start
```

### Cloudflare preview (Worker runtime)

```bash
npm run cf:preview   # opennextjs build + wrangler pages dev
```

### Run Tests

```bash
# Headless
npm run test

# With browser UI
npm run test:headed

# Interactive test runner
npm run test:ui
```

## Data Sources

| Source | Data Used |
|---|---|
| [MIT Study](https://economics.mit.edu/) | 11.7% current AI replacement rate |
| [McKinsey Global Institute](https://www.mckinsey.com/mgi) | 57% work hours technically automatable |
| [World Economic Forum](https://www.weforum.org/) | 92M displaced / 170M created by 2030 |
| [PwC](https://www.pwc.com/) | AI skills wage premium (+56%), sector exposure |
| CNBC, Fortune, Forbes | Real-world layoff case studies |

## Deployment

Everything runs on Cloudflare's edge. See **[DEPLOY.md](DEPLOY.md)** for the full step-by-step, including D1 creation, KV/R2 bindings, Turnstile setup, and custom-domain cutover.

Quick version:

```bash
wrangler login
wrangler d1 create air && wrangler kv namespace create AIR_KV && wrangler r2 bucket create air-posters
# → paste IDs into wrangler.toml
npm run cf:d1:apply:remote
npm run cf:deploy              # outputs https://air.pages.dev
```

| Platform | URL | Method |
|---|---|---|
| **Cloudflare Pages** | [air.democra.ai](https://air.democra.ai) | `wrangler pages deploy` or GitHub auto-build |
| **GitHub** | [github.com/democra-ai/air](https://github.com/democra-ai/air) | Source of truth |

## License

[MIT](LICENSE)
