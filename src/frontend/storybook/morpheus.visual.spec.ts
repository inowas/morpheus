import {expect, test} from '@playwright/test';

test('calculation state stories keep their visual states', async ({page}) => {
  for (const story of ['calculating', 'ready-to-start', 'read-only']) {
    await page.goto(`/iframe.html?id=morpheus-calculationstate--${story}&viewMode=story`);
    await expect(page.locator('body')).toHaveScreenshot(`calculation-state-${story}.png`);
  }
});

test('model setup and layer stories keep their visual states', async ({page}) => {
  for (const story of [
    'morpheus-modelsetup-setupgridproperties--default',
    'morpheus-modelsetup-setupgridproperties--read-only',
    'morpheus-modellayers-layerconfinement--default',
    'morpheus-modellayers-layerconfinement--read-only',
    'morpheus-modellayers-layerpropertyvaluesdefaultvalue--editable',
    'morpheus-modellayers-layerpropertyvaluesdefaultvalue--read-only',
  ]) {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    await expect(page.locator('body')).toHaveScreenshot(`${story.split('--')[0].split('-').pop()}-${story.split('--')[1]}.png`);
  }
});
