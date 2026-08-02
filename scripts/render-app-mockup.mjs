#!/usr/bin/env node
/**
 * Render phone mockup PNG from app screenshot (used on landing).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screenPath = path.join(root, 'public/marketing/app-screen.png');
const out = path.join(root, 'public/marketing/app-phone-mockup.png');
const screenB64 = readFileSync(screenPath).toString('base64');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: transparent;
      font-family: system-ui, sans-serif;
    }
    .device {
      position: relative;
      width: 300px;
      padding: 12px 10px 14px;
      border-radius: 44px;
      background: linear-gradient(145deg, #4a4a4f 0%, #1c1c1e 35%, #2d2d32 70%, #3a3a40 100%);
      box-shadow:
        0 0 0 1px rgb(255 255 255 / 0.14) inset,
        0 0 0 1px rgb(0 0 0 / 0.35),
        0 30px 60px rgb(15 23 42 / 0.35),
        0 12px 24px rgb(80 137 253 / 0.22);
    }
    .device::before,
    .device::after {
      content: '';
      position: absolute;
      border-radius: 999px;
      background: linear-gradient(90deg, #5c5c62, #888890, #5c5c62);
      box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
    }
    .device::before {
      left: -2px;
      top: 118px;
      width: 3px;
      height: 34px;
    }
    .device::after {
      right: -2px;
      top: 152px;
      width: 3px;
      height: 64px;
    }
    .screen {
      position: relative;
      overflow: hidden;
      border-radius: 34px;
      background: #000;
      box-shadow: 0 0 0 1px rgb(0 0 0 / 0.65) inset;
      aspect-ratio: 390 / 844;
    }
    .island {
      position: absolute;
      top: 11px;
      left: 50%;
      z-index: 3;
      width: 92px;
      height: 26px;
      transform: translateX(-50%);
      border-radius: 999px;
      background: #0a0a0a;
      box-shadow:
        0 0 0 1px rgb(255 255 255 / 0.06) inset,
        0 1px 3px rgb(0 0 0 / 0.45);
    }
    .screen img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      border-radius: 34px;
    }
    .bar {
      width: 108px;
      height: 4px;
      margin: 12px auto 0;
      border-radius: 999px;
      background: rgb(255 255 255 / 0.34);
    }
    .shine {
      pointer-events: none;
      position: absolute;
      inset: 12px 10px 14px;
      border-radius: 34px;
      background: linear-gradient(
        125deg,
        rgb(255 255 255 / 0.16) 0%,
        transparent 28%,
        transparent 72%,
        rgb(255 255 255 / 0.05) 100%
      );
    }
  </style>
</head>
<body>
  <div class="device">
    <div class="screen">
      <div class="island" aria-hidden="true"></div>
      <img src="data:image/png;base64,${screenB64}" alt="" />
    </div>
    <div class="bar" aria-hidden="true"></div>
    <div class="shine" aria-hidden="true"></div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 420, height: 920 },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(300);

const device = page.locator('.device');
await device.screenshot({ path: out, type: 'png', omitBackground: true });
await browser.close();
console.log(`Saved ${out}`);
