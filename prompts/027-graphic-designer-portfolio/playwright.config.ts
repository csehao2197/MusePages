import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 35_000,
  globalTimeout: 240_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3127", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: "node ..\\node_modules\\next\\dist\\bin\\next start --hostname 127.0.0.1 --port 3127",
    url: "http://127.0.0.1:3127",
    reuseExistingServer: false,
    timeout: 40_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 }
  }
});
