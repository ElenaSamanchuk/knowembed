import { expect, test } from '@playwright/test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const portfolioOut = path.join(
  process.cwd(),
  '../.elena-samanchuk-portfolio/public/previews/knowembed-app-mobile.png',
);

test.describe.configure({ mode: 'serial' });
test.skip(!process.env.CAPTURE_APP_SCREENSHOT, 'Set CAPTURE_APP_SCREENSHOT=1');

test('capture native admin mobile screenshot', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL ?? `knowembed-app-${Date.now()}@example.com`;
  const password = process.env.TEST_USER_PASSWORD ?? 'KnowEmbedShot1!';

  await page.setViewportSize({ width: 390, height: 844 });

  if (process.env.TEST_USER_EMAIL) {
    await page.goto('/login');
    await page.getByLabel('Work email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
  } else {
    await page.goto('/signup');
    await page.getByLabel('Work email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
  }

  await expect(page).toHaveURL(/\/app/, { timeout: 45_000 });
  await expect(page.getByRole('heading', { name: 'Your chatbots' })).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    document.documentElement.classList.add('native-app');
    document.querySelector('.app-layout')?.classList.add('app-layout--native');
  });

  const raw = '/tmp/knowembed-app-admin-raw.png';
  await page.screenshot({ path: raw, fullPage: false, animations: 'disabled' });

  fs.mkdirSync(path.dirname(portfolioOut), { recursive: true });
  execSync(`sips --resampleWidth 704 "${raw}" --out "${portfolioOut}"`, { stdio: 'pipe' });
});
