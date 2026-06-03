// Re-capture just the result page's lower section at a clean scroll position
// (hero fully scrolled off, the §II four-axes / occupation guess framed).
import { chromium } from 'playwright';
const SHOTS = new URL('../public/shots/', import.meta.url).pathname;
const RESULT = { en: process.env.RESULT_EN, zh: process.env.RESULT_ZH };
const SCROLL = Number(process.env.SCROLL || 1080);
const run = async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    const c = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
    await c.addInitScript((l) => { try { localStorage.setItem('air-lang', l); localStorage.setItem('air-theme', 'light'); } catch (e) {} }, lang);
    const page = await c.newPage();
    await page.goto(RESULT[lang], { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2800);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), SCROLL);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${SHOTS}result-mid-${lang}.png` });
    await c.close();
  }
  await browser.close();
  console.log('result-mid recaptured @scroll', SCROLL);
};
run().catch((e) => { console.error(e); process.exit(1); });
