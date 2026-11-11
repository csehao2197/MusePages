import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 35_000,
  globalTimeout: 180_000,
  expect: { timeout: 6_000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  outputDir: "./test-results",
  use: {
    baseURL: "http://127.0.0.1:3123",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3123",
    reuseExistingServer: false,
    timeout: 40_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
  },
});
