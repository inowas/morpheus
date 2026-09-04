import {Page, expect, test} from '@playwright/test';

import {IApiHandler, mockApi} from './visual/api-mock';
import {PROJECT_ID, projectFixtures, projectsListFixture, settingsFixtures, userFixtures} from './visual/fixtures';
import {mockOidc} from './visual/oidc-mock';

// The built app derives its API and Keycloak base URLs from hostname at
// runtime (//api.<host>, //identity.<host>). Used under 127.0.0.1 those become
// invalid hosts, so the visual suite runs on a *.localhost subdomain, which
// Chromium resolves to loopback while remaining a valid URL for the app.
test.use({baseURL: 'http://morpheus.localhost:4173'});

const prepare = async (page: Page, path: string, handlers: IApiHandler[]): Promise<void> => {
  await mockOidc(page);
  await mockApi(page, handlers, (method, pathname) => {
    // Surface unhandled API requests so a new screen surfaces what it needs
    // instead of silently 404ing.
    console.warn(`[visual] no fixture for ${method} ${pathname}`);
  });
  await page.goto(path);
  // Wait for OIDC discovery + the screen's API calls to settle.
  await page.waitForLoadState('networkidle');
};

test('project list', async ({page}) => {
  await prepare(page, '/projects', [...userFixtures, projectsListFixture]);
  await expect(page.getByText('Sandy Aquifer')).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot('project-list.png');
});

test('model setup editable', async ({page}) => {
  await prepare(page, `/projects/${PROJECT_ID}/model`, projectFixtures({readOnly: false}));
  await expect(page.getByText('Sandy Aquifer')).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot('model-setup-editable.png');
});

test('model setup read-only', async ({page}) => {
  await prepare(page, `/projects/${PROJECT_ID}/model`, projectFixtures({readOnly: true}));
  await expect(page.getByText('Sandy Aquifer')).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot('model-setup-read-only.png');
});

test('settings group access editable', async ({page}) => {
  await prepare(page, `/projects/${PROJECT_ID}/settings/permissions`, settingsFixtures({readOnly: false}));
  await expect(page.getByText('Group access')).toBeVisible({timeout: 10000});
  await expect(page.getByText('Hydro Team')).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot('settings-group-access-editable.png');
});

test('settings group access read-only', async ({page}) => {
  await prepare(page, `/projects/${PROJECT_ID}/settings/permissions`, settingsFixtures({readOnly: true}));
  await expect(page.getByText('Group access')).toBeVisible({timeout: 10000});
  await expect(page.getByText('Hydro Team')).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot('settings-group-access-read-only.png');
});
