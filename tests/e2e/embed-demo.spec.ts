import { expect, test } from '@playwright/test';

test('embed demo page loads storefront content', async ({ page }) => {
  await page.goto('/embed-demo.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Customer support');
  await expect(page.getByText('KnowEmbed live widget')).toBeVisible();
  await page.waitForSelector('#knowembed-root', { timeout: 10_000 });
  await expect(page.locator('#knowembed-root')).toBeVisible();
});
