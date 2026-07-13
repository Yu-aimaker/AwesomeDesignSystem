import { defineConfig, devices } from "@playwright/test";

/** Docs server port. Override with PLAYWRIGHT_PORT when 3000 is occupied. */
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  retries: 0,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  testDir: "./tests",
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
  },
  webServer: {
    // Prefer production server after `pnpm --filter @awesome-ds/docs build`.
    // Locally, reuse an already-running docs server when present (same port).
    // If port 3000 is taken by another app, run with PLAYWRIGHT_PORT=3333.
    command: `pnpm --filter @awesome-ds/docs exec next start --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/icon.svg`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testDir: "./tests/a11y",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testDir: "./tests/visual",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "no-js",
      testDir: "./tests/no-js",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
    },
  ],
});
