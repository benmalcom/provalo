import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Run tests serially to avoid overloading the server */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter */
  reporter: 'html',

  /* Shared settings for all the projects below */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'on-first-retry',

    /* Increase action timeout */
    actionTimeout: 15000,

    /* Increase navigation timeout */
    navigationTimeout: 60000,
  },

  /* Default timeout */
  timeout: 90000,

  /* Expect timeout */
  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global setup */
  globalSetup: './tests/e2e/setup/global-setup.ts',
});
