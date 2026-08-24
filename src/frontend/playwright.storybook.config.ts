import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './storybook',
  reporter: process.env.CI ? [['list'], ['junit', {outputFile: 'reports/storybook-visual.xml'}]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:6006',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'python3 -m http.server 6006 --directory dist/storybook',
    url: 'http://127.0.0.1:6006/index.json',
    reuseExistingServer: false,
  },
});
