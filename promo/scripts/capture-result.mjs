// Capture a result page (top + scrolled) for given share URLs → result-<lang>.png + result-mid-<lang>.png.
import { chromium } from 'playwright';
const SHOTS = new URL('../public/shots/', import.meta.url).pathname;
const RESULT = { en: process.env.RESULT_EN, zh: process.env.RESULT_ZH };
const MID = Number(process.env.MID || 1080);
const run = async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    const c = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
    await c.addInitScript((l) => { try { localStorage.setItem('air-lang', l); localStorage.setItem('air-theme', 'light'); } catch (e) {} }, lang);
    const page = await c.newPage();
    await page.goto(RESULT[lang], { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2800);
    await page.screenshot({ path: `${SHOTS}result-${lang}.png` });
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), MID);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${SHOTS}result-mid-${lang}.png` });
    await c.close();
  }
  await browser.close();
  console.log('result captured');
};
run().catch((e) => { console.error(e); process.exit(1); });
