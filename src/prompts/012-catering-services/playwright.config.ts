import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3112", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: `"${process.execPath}" "${require.resolve("next/dist/bin/next")}" start --hostname 127.0.0.1 --port 3112`,
    url: "http://127.0.0.1:3112",
    reuseExistingServer: false,
    timeout: 60000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 }
  }
});
