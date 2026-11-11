import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 35000,
  globalTimeout: 240000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3128", reducedMotion: "reduce", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3128",
    reuseExistingServer: false,
    timeout: 60000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 3000 }
  }
});
