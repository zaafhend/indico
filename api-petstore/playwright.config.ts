import { defineConfig } from '@playwright/test';

// Trailing slash matters: request paths in the client are relative (e.g. 'pet/123').
const baseURL = process.env.BASE_URL ?? 'https://petstore.swagger.io/v2/';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
