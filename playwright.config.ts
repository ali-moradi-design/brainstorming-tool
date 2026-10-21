import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  projects: [
    {
      name: 'chromium',
      // Set CHROMIUM_PATH to use a browser that is not Playwright's bundled build.
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
