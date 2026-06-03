// Capture real air.democra.ai states at 2x (for crisp zoom) with Playwright.
// Result pages come from prebuilt share URLs (RESULT_EN / RESULT_ZH env).
import { chromium } from 'playwright';

const SHOTS = new URL('../public/shots/', import.meta.url).pathname;
const VW = 1280, VH = 720;
const RESULT = { en: process.env.RESULT_EN, zh: process.env.RESULT_ZH };

async function newCtx(browser, lang) {
  const c = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2 });
  await c.addInitScript((l) => {
    try { localStorage.setItem('air-lang', l); localStorage.setItem('air-theme', 'light'); } catch (e) {}
  }, lang);
  return c;
}
const shot = (page, name) => page.screenshot({ path: `${SHOTS}${name}.png` });

const run = async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    const c = await newCtx(browser, lang);
    const page = await c.newPage();

    // Hero (top of homepage)
    await page.goto('https://air.democra.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2600);
    await shot(page, `hero-${lang}`);

    // Archetype grid
    await page.evaluate(() => document.getElementById('archetypes')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(1600);
    await shot(page, `grid-${lang}`);

    // Quiz: unselected → selected → advanced to next
    await page.goto('https://air.democra.ai/?quiz=1', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2200);
    await shot(page, `quiz-intro-${lang}`);
    try {
      await page.locator('button.btn-primary').first().click({ timeout: 8000 }); // begin
      await page.waitForTimeout(1700);
      await shot(page, `quiz-${lang}`);
      const opts = page.locator('button.option-card');
      await opts.nth(1).click({ timeout: 6000 });
      await page.waitForTimeout(750);
      await shot(page, `quiz-sel-${lang}`);
      await opts.nth(1).click({ timeout: 6000 }); // 2nd click advances
      await page.waitForTimeout(950);
      await shot(page, `quiz-2-${lang}`);
    } catch (e) { console.log('quiz click issue', lang, e.message); }

    // Result page (from share URL)
    if (RESULT[lang]) {
      await page.goto(RESULT[lang], { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2800);
      await shot(page, `result-${lang}`);
      await page.evaluate(() => window.scrollTo({ top: 760, behavior: 'instant' }));
      await page.waitForTimeout(1300);
      await shot(page, `result-mid-${lang}`);
    }

    // Macro: scroll to the progress bar
    await page.goto('https://air.democra.ai/macro', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2200);
    await page.evaluate(() => window.scrollTo({ top: 540, behavior: 'instant' }));
    await page.waitForTimeout(1300);
    await shot(page, `macro-${lang}`);

    await c.close();
  }
  await browser.close();
  console.log('capture done');
};
run().catch((e) => { console.error(e); process.exit(1); });
