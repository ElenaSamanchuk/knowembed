#!/usr/bin/env node
/**
 * Capture sharp app admin screenshot for marketing mockup (390×844 @3x).
 */
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/marketing/app-screen.png');
const base = process.env.CAPTURE_BASE ?? 'http://127.0.0.1:5173';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

const email = process.env.TEST_USER_EMAIL ?? `knowembed-mock-${Date.now()}@example.com`;
const password = process.env.TEST_USER_PASSWORD ?? 'KnowEmbedShot1!';

await page.goto(`${base}/signup`, { waitUntil: 'networkidle', timeout: 120000 });
await page.getByLabel('Work email').fill(email);
await page.getByLabel('Password').fill(password);
await page.getByRole('button', { name: 'Create account' }).click();
await page.waitForURL(/\/app/, { timeout: 45000 });
await page.waitForSelector('.bot-grid, .empty-state', { timeout: 20000 });
await page.waitForTimeout(1200);

await page.evaluate(() => {
  document.documentElement.classList.add('native-app');
  document.querySelector('.app-layout')?.classList.add('app-layout--native');
});

await page.screenshot({ path: out, fullPage: false, type: 'png' });
await browser.close();
console.log(`Saved ${out}`);
