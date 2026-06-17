// Capture air.democra.ai as TALL portrait images (1080 wide) so the video can scroll through
// them like a screen recording — hero homepage + the ESRP result page. @2x for crispness.
import { chromium } from 'playwright';
const SHOTS = new URL('../public/shots/', import.meta.url).pathname;
const RESULT = { en: process.env.RESULT_EN, zh: process.env.RESULT_ZH };
const HERO_H = Number(process.env.HERO_H || 2800);
const RES_H = Number(process.env.RES_H || 3000);
const grab = async (browser, lang, url, name, vh) => {
  const c = await browser.newContext({ viewport: { width: 1080, height: vh }, deviceScaleFactor: 2 });
  await c.addInitScript((l) => { try { localStorage.setItem('air-lang', l); localStorage.setItem('air-theme', 'light'); } catch (e) {} }, lang);
  const page = await c.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${SHOTS}${name}-${lang}.png` });
  await c.close();
};
const run = async () => {
  const b = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    await grab(b, lang, 'https://air.democra.ai/', 'hero', HERO_H);
    if (RESULT[lang]) await grab(b, lang, RESULT[lang], 'result', RES_H);
  }
  await b.close();
  console.log(`tall portrait shots done (hero ${HERO_H}, result ${RES_H})`);
};
run().catch((e) => { console.error(e); process.exit(1); });
