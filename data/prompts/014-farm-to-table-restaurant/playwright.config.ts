import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 40_000,
  globalTimeout: 180_000,
  expect: { timeout: 6000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "test-results",
  use: { baseURL: "http://127.0.0.1:3114", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'node "..\\..\\..\\node_modules\\next\\dist\\bin\\next" start --hostname 127.0.0.1 --port 3114',
    url: "http://127.0.0.1:3114",
    reuseExistingServer: false,
    timeout: 90_000,
    cwd: __dirname,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
