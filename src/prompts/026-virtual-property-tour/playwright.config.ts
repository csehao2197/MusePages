import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 35000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3126",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 8000,
  },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "node ..\\node_modules\\next\\dist\\bin\\next start -H 127.0.0.1 -p 3126",
    url: "http://127.0.0.1:3126",
    reuseExistingServer: false,
    timeout: 90000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 3000 },
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
