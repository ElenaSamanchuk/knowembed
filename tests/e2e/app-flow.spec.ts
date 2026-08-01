import { expect, test } from '@playwright/test';

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test.describe('Authenticated app flow', () => {
  test.skip(!email || !password, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD for live Supabase E2E');

  test('sign in, open demo bot workspace, send chat message', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByLabel('Work email').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });
    await page.getByRole('link', { name: /Store Assistant/i }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Store Assistant' })).toBeVisible();

    const chatInput = page.getByPlaceholder('Ask about pricing, shipping, returns…');
    await expect(chatInput).toBeEnabled({ timeout: 20_000 });

    await chatInput.fill('How long is shipping?');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText(/business day|shipping|day/i)).toBeVisible({ timeout: 30_000 });
  });
});
