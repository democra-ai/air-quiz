/**
 * Rasterise app/icon.svg into the PNG variants Next.js + browsers expect.
 *
 *   node scripts/render-icons.mjs
 *
 * Outputs:
 *   app/apple-icon.png    (180×180, rounded background — Apple touch icon)
 *   app/favicon.ico       (32×32 PNG inside an ICO container, for legacy Chrome
 *                          tabs and any browser that still hits /favicon.ico)
 */

import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, 'app/icon.svg');

const svg = await readFile(SVG_PATH, 'utf8');

const sizes = [
  { out: 'app/apple-icon.png', size: 180, ext: 'png' },
  { out: 'app/icon-512.png',   size: 512, ext: 'png' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

for (const { out, size } of sizes) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`
    <!doctype html>
    <html><head><style>
      html,body{margin:0;padding:0;background:transparent}
      svg{width:${size}px;height:${size}px;display:block}
    </style></head>
    <body>${svg}</body></html>
  `);
  await page.waitForTimeout(100);
  const png = await page.locator('svg').screenshot({ omitBackground: true });
  await writeFile(join(ROOT, out), png);
  console.log('  →', out, `(${size}×${size}, ${png.length} bytes)`);
  await page.close();
}

await browser.close();
console.log('done.');
