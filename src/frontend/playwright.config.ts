import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['junit', {outputFile: 'reports/playwright.xml'}]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-morpheus-dist.cjs 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
  projects: [
    {name: 'chromium', use: {...devices['Desktop Chrome']}},
  ],
});
