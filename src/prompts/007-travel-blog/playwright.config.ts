import { defineConfig, devices } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(`${process.cwd()}\\package.json`);
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  globalTimeout: 120_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3107", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: `node "${require.resolve("next/dist/bin/next")}" start --hostname 127.0.0.1 --port 3107`,
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 30_000
  }
});
