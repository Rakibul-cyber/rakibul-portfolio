#!/usr/bin/env node
/**
 * Capture the redesign at the reference viewports (docs/REFERENCE_DESIGN_AUDIT.md §1).
 * Scrolls the whole page first so scroll reveals fire before full-page shots.
 *
 * Usage: node scripts/capture-screenshots.mjs [baseUrl] [outDir] [prefix]
 *   defaults: http://localhost:4321/rakibul-portfolio/  docs/screenshots  redesign
 * Set PW_CHANNEL=chrome to use an installed Chrome instead of Playwright's Chromium.
 */
import { chromium } from '@playwright/test';

const [
  url = 'http://localhost:4321/rakibul-portfolio/',
  out = 'docs/screenshots',
  prefix = 'redesign',
] = process.argv.slice(2);
const viewports = { desktop: [1440, 900], tablet: [820, 1180], mobile: [390, 844] };

const browser = await chromium.launch(
  process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {},
);
for (const [name, [width, height]] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${prefix}-${name}.png` });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${prefix}-${name}-full.png`, fullPage: true });
  console.log(`${prefix}-${name}: ${width}x${height}, page height ${total}px`);
  await page.close();
}
await browser.close();
