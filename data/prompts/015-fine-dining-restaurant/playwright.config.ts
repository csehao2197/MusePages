import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  globalTimeout: 240_000,
  expect: { timeout: 6_000 },
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3115", trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3115",
    timeout: 60_000,
    reuseExistingServer: false,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
  },
});
