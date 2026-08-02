#!/usr/bin/env node
/**
 * Generate PWA + Android launcher icons from public/favicon.svg
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(path.join(root, 'public/favicon.svg'), 'utf8');
const outDir = path.join(root, 'public/icons');
const resDir = path.join(root, 'resources');

mkdirSync(outDir, { recursive: true });
mkdirSync(resDir, { recursive: true });

async function renderIcon(size, outPath) {
  const html = `<!doctype html><html><body style="margin:0;background:#5089fd;display:grid;place-items:center;width:${size}px;height:${size}px">${svg.replace('<svg', `<svg width="${size * 0.62}" height="${size * 0.62}"`)}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(html);
  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();
}

for (const size of [192, 512, 1024]) {
  const out = size === 1024 ? path.join(resDir, 'icon.png') : path.join(outDir, `icon-${size}.png`);
  await renderIcon(size, out);
  console.log(`Wrote ${out}`);
}

writeFileSync(
  path.join(resDir, 'splash.png'),
  readFileSync(path.join(resDir, 'icon.png')),
);
console.log('Done');
