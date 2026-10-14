import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3123);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * End-to-end and served-HTML checks.
 *
 * These run against a production build, not the dev server. WS-D requires verification "in
 * served HTML, not in the rendered DOM" (docs/spec/seo-requirements.md), and the dev server
 * does not reproduce prerendering faithfully.
 *
 * `npm run test:e2e` builds first. When iterating locally, start `npm run start -- --port 3123`
 * yourself and the runner will reuse it.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
