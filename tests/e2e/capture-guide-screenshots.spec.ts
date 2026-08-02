import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public/docs/screenshots');
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test.describe.configure({ mode: 'serial' });
test.skip(!process.env.CAPTURE_SCREENSHOTS, 'Set CAPTURE_SCREENSHOTS=1 to capture guide screenshots');

test.beforeAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

async function shot(page: Page, fileName: string) {
  await page.screenshot({
    path: path.join(OUT_DIR, fileName),
    fullPage: false,
    animations: 'disabled',
  });
}

async function openBotWorkspace(page: Page) {
  const storeLink = page.getByRole('link', { name: /Store Assistant/i });
  if (await storeLink.isVisible().catch(() => false)) {
    await storeLink.click();
    return;
  }

  const createBtn = page.getByRole('button', { name: /Create first bot|New chatbot/i }).first();
  await createBtn.click();
  await expect(page).toHaveURL(/\/app\/bots\//, { timeout: 20_000 });
}

async function ensureKnowledgeReady(page: Page) {
  const faq = page.getByText('acme-faq.md');
  if (await faq.isVisible().catch(() => false)) return;

  const reindex = page.getByRole('button', { name: /Re-index demo FAQ/i });
  if (await reindex.isVisible().catch(() => false)) {
    await reindex.click();
    await expect(faq).toBeVisible({ timeout: 90_000 });
    return;
  }

  throw new Error('Could not prepare knowledge docs for screenshot');
}

async function signIn(page: Page) {
  if (email && password) {
    await page.goto('/login');
    await page.getByLabel('Work email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/app/, { timeout: 20_000 });
    return;
  }

  const guestEmail = `knowembed-guide-${Date.now()}@example.com`;
  const guestPassword = 'KnowEmbedShot1!';
  await page.goto('/signup');
  await page.getByLabel('Work email').fill(guestEmail);
  await page.getByLabel('Password').fill(guestPassword);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/app/, { timeout: 45_000 });
}

test('capture demo guide screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await shot(page, '01-landing.png');

  await page.goto('/signup');
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  await shot(page, '02-signup.png');

  await signIn(page);
  await openBotWorkspace(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
  await ensureKnowledgeReady(page);
  await shot(page, '03-knowledge.png');

  const chatInput = page.getByPlaceholder('Ask about pricing, shipping, returns…');
  await expect(chatInput).toBeEnabled({ timeout: 20_000 });
  await chatInput.fill('How long is shipping?');
  await page.getByRole('button', { name: 'Send' }).click();
  const assistantReply = page.locator('.chat-bubble--assistant').filter({
    hasText: /3|5|business|day|week/i,
  });
  await expect(assistantReply.last()).toBeVisible({ timeout: 60_000 });
  await shot(page, '04-chat.png');

  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, '05-publish.png');

  await page.goto('/embed-demo.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Clothes that fit');
  await expect(page.getByRole('button', { name: /Open Store Assistant|Open chat/i })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole('button', { name: /Open Store Assistant|Open chat/i }).click();
  await page.waitForTimeout(600);
  await shot(page, '06-embed.png');

  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
  await shot(page, '07-stripe.png');
});
