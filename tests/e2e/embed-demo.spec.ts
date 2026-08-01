import { expect, test } from '@playwright/test';

test('embed demo page loads host site and widget launcher', async ({ page }) => {
  await page.goto('/embed-demo.html');
  await expect(page.getByRole('heading', { name: /Customer support/i })).toBeVisible();
  await expect(page.getByText(/demo-store-assistant/i)).toBeVisible();

  const launcher = page.locator('#knowembed-root').locator('button').first();
  await expect(launcher).toBeVisible({ timeout: 15_000 });
});
