import { expect, test } from '@playwright/test';

test('embed demo page loads host site and widget launcher', async ({ page }) => {
  await page.goto('/embed-demo.html');
  await expect(page.getByRole('heading', { name: 'Acme Store' })).toBeVisible();
  await expect(page.getByText('How long is shipping?')).toBeVisible();

  const launcher = page.locator('#knowembed-root').locator('button').first();
  await expect(launcher).toBeVisible({ timeout: 15_000 });
});
