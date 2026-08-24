import {expect, test} from '@playwright/test';

test('button behavior story keeps its visual shape', async ({page}) => {
  await page.goto('/iframe.html?id=button--behavior&viewMode=story');

  const button = page.getByRole('button', {name: 'Run action'});
  await expect(button).toBeVisible();
  await expect(button).toHaveScreenshot('button-behavior.png');
});
