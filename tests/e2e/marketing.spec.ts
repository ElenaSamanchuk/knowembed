import { expect, test } from '@playwright/test';

test.describe('Marketing pages', () => {
  test('landing shows hero, features, and pricing CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('embeddable AI assistant');
    await expect(page.getByRole('link', { name: 'View pricing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create account' })).toBeVisible();
    await expect(page.getByText('Upload knowledge')).toBeVisible();
    await expect(page.getByText('Embed anywhere')).toBeVisible();
  });

  test('pricing shows starter and pro plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: 'Starter' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
    await expect(page.getByText('Mock Stripe checkout')).toBeVisible();
  });

  test('login page renders sign-up form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('embeddable bot');
    await expect(page.getByLabel('Work email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('app routes require auth', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/login$/);
  });
});
