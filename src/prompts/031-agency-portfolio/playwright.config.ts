import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  timeout: 35_000,
  expect: { timeout: 6_000 },
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3131",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 8_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", reducedMotion: "reduce" } },
  ],
  webServer: {
    command: `node "${require.resolve("next/dist/bin/next")}" start --hostname 127.0.0.1 --port 3131`,
    url: "http://127.0.0.1:3131",
    timeout: 60_000,
    reuseExistingServer: false,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 3_000 },
  },
});
