#!/usr/bin/env node
/**
 * Capture hero block for Open Graph link previews (1200×630).
 */
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/og-image.png');
const base = process.env.CAPTURE_BASE ?? 'http://127.0.0.1:5173';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForSelector('.hero-block--mvp', { timeout: 30000 });
await page.waitForTimeout(800);

const hero = page.locator('.hero-block--mvp');
const box = await hero.boundingBox();
if (!box) throw new Error('Hero block not found');

await page.screenshot({
  path: out,
  clip: {
    x: Math.max(0, box.x - 24),
    y: Math.max(0, box.y - 16),
    width: Math.min(1280, box.width + 48),
    height: box.height + 32,
  },
  type: 'png',
});

await browser.close();
console.log(`Saved ${out}`);
