import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 7_000 },
  globalTimeout: 240_000,
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  outputDir: "./test-results",
  use: {
    baseURL: "http://127.0.0.1:3109",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "pricing", testMatch: /pricing\.spec\.ts/ },
    { name: "desktop", testMatch: /listing\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", testMatch: /listing\.spec\.ts/, use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'node "..\\..\\..\\node_modules\\next\\dist\\bin\\next" start --hostname 127.0.0.1 --port 3109',
    url: "http://127.0.0.1:3109",
    reuseExistingServer: false,
    timeout: 60_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
