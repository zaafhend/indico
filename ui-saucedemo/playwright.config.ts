import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    video: 'on',
    headless: false,
    launchOptions: { slowMo: 500 }
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
