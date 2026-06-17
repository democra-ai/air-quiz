// Capture air.democra.ai at a PORTRAIT viewport (1080x1920 @2x) for the vertical video.
// Result page from share URLs (RESULT_EN / RESULT_ZH).
import { chromium } from 'playwright';
const SHOTS = new URL('../public/shots/', import.meta.url).pathname;
const RESULT = { en: process.env.RESULT_EN, zh: process.env.RESULT_ZH };
const MID = Number(process.env.MID || 0); // 0 = auto-find the stats block
const run = async () => {
  const b = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    const c = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
    await c.addInitScript((l) => { try { localStorage.setItem('air-lang', l); localStorage.setItem('air-theme', 'light'); } catch (e) {} }, lang);
    const page = await c.newPage();
    await page.goto('https://air.democra.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2800);
    await page.screenshot({ path: `${SHOTS}hero-${lang}.png` });
    if (RESULT[lang]) {
      await page.goto(RESULT[lang], { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2800);
      await page.screenshot({ path: `${SHOTS}result-${lang}.png` });
      const y = MID || (await page.evaluate(() => {
        const hit = [...document.querySelectorAll('*')].find((el) =>
          el.children.length < 3 && /replacement probability|替代概率|被替代|替代风险|probability/i.test(el.textContent || ''));
        if (hit) return Math.max(0, window.scrollY + hit.getBoundingClientRect().top - 240);
        return 1000;
      }));
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${SHOTS}result-mid-${lang}.png` });
      console.log(`${lang} stats scroll = ${y}`);
    }
    await c.close();
  }
  await b.close();
  console.log('portrait shots done');
};
run().catch((e) => { console.error(e); process.exit(1); });
