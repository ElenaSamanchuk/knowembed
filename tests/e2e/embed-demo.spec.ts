import { expect, test } from '@playwright/test';

test('embed demo page loads storefront and widget', async ({ page }) => {
  await page.goto('/embed-demo.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Clothes that fit');
  await expect(page.getByRole('link', { name: 'Still', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open Store Assistant|Open chat/i })).toBeVisible({
    timeout: 15_000,
  });
});
