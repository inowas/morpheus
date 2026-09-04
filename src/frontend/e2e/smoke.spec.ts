import {expect, test} from '@playwright/test';

test('Morpheus frontend loads', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Morpheus|INOWAS/i);
  await expect(page.locator('#root')).toBeVisible();
});
