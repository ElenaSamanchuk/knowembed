import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('Marketing pages', () => {
  test('landing shows hero, features, and pricing CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('embed');
    await expect(page.getByText('Launch-ready MVP')).toBeVisible();
    await expect(page.getByRole('link', { name: 'View pricing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create account' })).toBeVisible();
  });

  test('pricing shows starter and pro plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: 'Starter' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
    await expect(page.getByText('Stripe Checkout')).toBeVisible();
  });

  test('login page renders sign-up form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('embeddable bot');
    await expect(page.getByLabel('Work email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('app routes require auth', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 });
  });
});
