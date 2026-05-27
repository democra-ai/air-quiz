/**
 * Capture screenshots of the live AIR site for the README.
 *
 *   AIR_BASE=https://air-quiz.tao-shen.workers.dev node scripts/screenshots.mjs
 *
 * Uses two isolated browser contexts so the dark-mode shot doesn't leak its
 * localStorage into the light-mode shots that follow.
 */

import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.AIR_BASE || 'https://air.democra.ai';
const OUT  = 'docs/screenshots';

// Precomputed share payload (TORH archetype, "high" risk band, en lang).
const SAMPLE_SHARE = 'eyJ2IjoyLCJyaXNrTGV2ZWwiOiJoaWdoIiwicmVwbGFjZW1lbnRQcm9iYWJpbGl0eSI6NzUsInByZWRpY3RlZFJlcGxhY2VtZW50WWVhciI6MjAzMCwiY3VycmVudFJlcGxhY2VtZW50RGVncmVlIjozMCwiZWFybGllc3RZZWFyIjoyMDI3LCJsYXRlc3RZZWFyIjoyMDM1LCJsYW5nIjoiZW4iLCJwcm9maWxlQ29kZSI6IlRPUkgifQ';

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

const desktopOpts = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
};

async function shoot(ctx, url, file, opts = {}) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForLoadState('load', { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (opts.waitFor) {
    await page.waitForSelector(opts.waitFor, { timeout: 10_000 }).catch(() => {});
  }
  if (opts.scrollTo) {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), opts.scrollTo);
    await page.waitForTimeout(600);
  }
  if (opts.click) {
    await page.click(opts.click).catch(() => {});
    await page.waitForTimeout(900);
  }
  const out = join(OUT, file);
  await page.screenshot({ path: out, fullPage: !!opts.fullPage });
  console.log('  →', out);
  await page.close();
}

// ── Desktop light (default theme = light, no localStorage primed) ──────────
const lightDesk = await browser.newContext(desktopOpts);
console.log('Desktop · light:');
await shoot(lightDesk, BASE,                          '01-hero-light.png');
await shoot(lightDesk, `${BASE}/?quiz=1`,             '03-quiz-intro.png');
await shoot(lightDesk, `${BASE}/?quiz=1`,             '04-quiz-question.png', {
  click: 'button.btn-primary.btn-lg', waitFor: '.option-card',
});
await shoot(lightDesk, `${BASE}/share/${SAMPLE_SHARE}`, '05-result-hero.png');
await shoot(lightDesk, BASE,                          '06-archetype-grid.png', { scrollTo: '#archetypes' });
await shoot(lightDesk, `${BASE}/profile/TORH`,        '07-profile-page.png');
await lightDesk.close();

// ── Desktop dark (separate context with air-theme=dark primed) ─────────────
const darkDesk = await browser.newContext({
  ...desktopOpts,
  storageState: {
    cookies: [],
    origins: [{
      origin: BASE,
      localStorage: [{ name: 'air-theme', value: 'dark' }],
    }],
  },
});
console.log('Desktop · dark:');
await shoot(darkDesk, BASE, '02-hero-dark.png');
await darkDesk.close();

// ── Mobile (iPhone 14 viewport, light) ─────────────────────────────────────
const mobile = await browser.newContext({ ...devices['iPhone 14'] });
console.log('Mobile · light:');
await shoot(mobile, BASE,              '08-mobile-hero.png');
await shoot(mobile, `${BASE}/?quiz=1`, '09-mobile-quiz.png', {
  click: 'button.btn-primary.btn-lg', waitFor: '.option-card',
});
await mobile.close();

await browser.close();
console.log('done.');
