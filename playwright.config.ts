import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
// Locally you can reuse an installed Chrome with PW_CHANNEL=chrome; CI installs Playwright's Chromium.
const channel = process.env.PW_CHANNEL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/rakibul-portfolio/`,
    trace: 'retain-on-failure',
    ...(channel ? { channel } : {}),
  },
  // Serves dist/ under /rakibul-portfolio/ exactly like GitHub Pages. Run `npm run build` first.
  webServer: {
    command: `node scripts/serve-dist.mjs --port ${PORT}`,
    url: `http://localhost:${PORT}/rakibul-portfolio/`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      testMatch: ['site.spec.ts', 'desktop.spec.ts', 'a11y.spec.ts'],
    },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true },
      testMatch: ['site.spec.ts'],
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
      testMatch: ['site.spec.ts', 'mobile.spec.ts'],
    },
  ],
});
