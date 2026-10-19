import { defineConfig, devices } from '@playwright/test'

const PORT = 3100

// Runs against the production build (`npm run build` first). Uses the Chrome
// installed on the machine, so no browser download is needed.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // The whole suite posts from one IP; production keeps the default of 5
    env: { CONTACT_DRY_RUN: '1', CONTACT_RATE_LIMIT: '1000' },
    timeout: 60_000,
  },
})
