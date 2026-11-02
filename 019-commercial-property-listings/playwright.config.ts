import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  globalTimeout: 180_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  outputDir: "./test-results",
  use: { baseURL: "http://127.0.0.1:3119", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "logic", testMatch: "arithmetic.spec.ts" },
    { name: "desktop", testMatch: "browser.spec.ts", use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", testMatch: "browser.spec.ts", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node "..\\node_modules\\next\\dist\\bin\\next" start --hostname 127.0.0.1 --port 3119',
    url: "http://127.0.0.1:3119",
    reuseExistingServer: false,
    timeout: 30_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
