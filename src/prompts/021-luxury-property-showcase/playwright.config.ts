import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3121", trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3121",
    url: "http://127.0.0.1:3121",
    reuseExistingServer: false,
    timeout: 90000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 }
  }
});
