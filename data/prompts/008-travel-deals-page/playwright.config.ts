import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 30000,
  expect: { timeout: 6000 },
  globalTimeout: 180000,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3108", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ]
});
