import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-pages.mjs";

const folder = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const problems = [];
const completed = [];
let browser, server;
async function guard() {
  const lock = JSON.parse(await readFile(path.join(root, "out", ".generation-locks", "039-nutrition-coaching.lock"), "utf8"));
  assert.ok(process.env.MUSEPAGES_GENERATION_SESSION);
  assert.equal(lock.session, process.env.MUSEPAGES_GENERATION_SESSION);
  assert.equal(lock.prompt, "039-nutrition-coaching");
  process.kill(lock.pid, 0);
}
before(async () => {
  await guard();
  await mkdir(checks, { recursive: true });
  server = await startPreviewServer(exported, { workspace: root });
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
  await server?.close();
});
async function visit(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
  await context.addInitScript(() => {
    Storage.prototype.setItem = () => { throw Error("Unexpected storage write"); };
  });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("requestfailed", (request) => problems.push(`Request failed: ${request.url()}`));
  page.on("response", (response) => { if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`); });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:") || request.method() !== "GET") problems.push(`Unexpected request: ${request.method()} ${request.url()}`);
  });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}
function check(name, run) {
  test(name, { timeout: 90000 }, async () => { await guard(); await run(); completed.push(name); });
}
check("Clean export matches source, local assets and real nested static validation", async () => {
  for (const name of ["index.html", "style.css", "app.js"]) {
    assert.deepEqual(await readFile(path.join(folder, name)), await readFile(path.join(exported, name)));
  }
  for (const name of await readdir(path.join(folder, "assets"))) {
    assert.deepEqual(await readFile(path.join(folder, "assets", name)), await readFile(path.join(exported, "assets", name)));
  }
  assert.deepEqual((await readdir(exported)).filter((name) => name !== "preview.png").sort(), ["app.js", "assets", "index.html", "style.css"]);
  assert.match(await StaticHomepage.validateStaticOutput(exported, "nutrition-coaching", "GPT-6"), /^[0-9a-f]{64}$/);
});
check("Monthly and annual prices use exactly 20% savings and disclose upfront totals", async () => {
  const { page, context } = await visit();
  try {
    await page.locator("[data-billing=annual]").click();
    for (const [plan, monthly, annual] of [["starter", "$79.20", "$950.40"], ["pro", "$143.20", "$1,718.40"], ["elite", "$239.20", "$2,870.40"]]) {
      await expect(page.locator(`[data-price=${plan}]`)).toHaveText(monthly);
      await expect(page.locator(`[data-charge=${plan}]`)).toHaveText(`${annual} billed annually`);
    }
    await page.getByRole("button", { name: "Start Now — Elite", exact: true }).click();
    await expect(page.locator("#support")).toHaveValue("elite");
    await page.locator("#assessment-consent").check();
    await page.locator("#assessment-form").getByRole("button", { name: "See my local recommendation" }).click();
    await expect(page.locator("#result-title")).toHaveText("Elite could be your starting point.");
    await expect(page.locator("#result-description")).toContainText("$2,870.40 paid annually");
    await page.getByRole("button", { name: "Close assessment", exact: true }).click();
    await page.locator("[data-billing=monthly]").click();
    await expect(page.locator("[data-price=starter]")).toHaveText("$99");
    await expect(page.locator("[data-price=pro]")).toHaveText("$179");
    await expect(page.locator("[data-price=elite]")).toHaveText("$299");
  } finally { await context.close(); }
});
check("Private assessment validates consent/email, maps goals and contains unsafe text", async () => {
  const { page, context } = await visit();
  try {
    await page.locator("#lead-email").fill("demo@example.com");
    await page.locator("#lead-form").getByRole("button").click();
    await expect(page.locator("#assessment-email")).toHaveValue("demo@example.com");
    await expect(page.locator("#lead-email")).toHaveValue("");
    await page.locator("#assessment-form").getByRole("button").click();
    await expect(page.locator("#assessment-form")).toBeVisible();
    assert.equal(await page.locator("#assessment-consent").evaluate((element) => element.validity.valueMissing), true);
    await page.locator("#assessment-consent").check();
    await page.locator("#assessment-email").fill("invalid");
    await page.locator("#assessment-form").getByRole("button").click();
    assert.equal(await page.locator("#assessment-email").evaluate((element) => element.validity.typeMismatch), true);
    await page.locator("#assessment-email").fill("");
    await page.locator("#restrictions").fill('<img src=x onerror="alert(1)">');
    for (const [goal, coach] of [["sport", "Dr. Amanda Chen"], ["muscle", "David Kim"], ["plant", "Sofia Reyes"], ["habits", "Marcus Johnson"]]) {
      await page.locator("#goal").selectOption(goal);
      await page.locator("#assessment-form").getByRole("button").click();
      await expect(page.locator("#result-coach")).toHaveText(coach);
      await expect(page.locator("#result-preferences")).toContainText('<img src=x onerror="alert(1)">');
      assert.equal(await page.locator("#result-preferences img").count(), 0);
      await page.getByRole("button", { name: "Edit my answers" }).click();
    }
    await page.locator("#preference").selectOption("Vegan");
    await page.locator("#assessment-form").getByRole("button").click();
    await expect(page.locator("#result-coach")).toHaveText("Sofia Reyes");
    await page.getByRole("button", { name: "Preview a coach call" }).click();
    await expect(page.locator("#assessment-dialog")).not.toBeVisible();
    await expect(page.locator("#booking-dialog")).toBeVisible();
    await expect(page.locator("#booking-coach")).toHaveValue("sofia");
    await expect(page.locator("#restrictions")).toHaveValue("");
    await expect(page.locator("#assessment-email")).toHaveValue("");
  } finally { await context.close(); }
});
check("Coach-call preview rejects past dates, whitespace and missing consent without real booking", async () => {
  const { page, context } = await visit();
  try {
    await page.getByRole("button", { name: "Book a Call with David" }).click();
    await expect(page.locator("#booking-coach")).toHaveValue("david");
    await page.locator("#booking-date").fill("2000-01-01");
    await page.locator("#booking-time").selectOption("12:30");
    await page.locator("#booking-name").fill("Demo");
    await page.locator("#booking-consent").check();
    await page.locator("#booking-form").getByRole("button").click();
    assert.equal(await page.locator("#booking-date").evaluate((element) => element.validity.rangeUnderflow), true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
    await page.locator("#booking-date").fill(date);
    await page.locator("#booking-name").fill("   ");
    await page.locator("#booking-form").getByRole("button").click();
    assert.equal(await page.locator("#booking-name").evaluate((element) => element.validity.customError), true);
    await page.locator("#booking-name").fill("<b>Demo</b>");
    await page.locator("#booking-consent").uncheck();
    await page.locator("#booking-form").getByRole("button").click();
    await expect(page.locator("#booking-result")).not.toBeVisible();
    await page.locator("#booking-consent").check();
    await page.locator("#booking-form").getByRole("button").click();
    await expect(page.locator("#booking-result")).toContainText("<b>Demo</b>, here is your local preview:");
    await expect(page.locator("#booking-result")).toContainText("David Kim");
    await expect(page.locator("#booking-result")).toContainText("This is not a booking");
    assert.equal(await page.locator("#booking-result b").count(), 0);
    await page.getByRole("button", { name: "Close coach call", exact: true }).click();
    await page.getByRole("button", { name: "Book a Call with Marcus" }).click();
    await expect(page.locator("#booking-name")).toHaveValue("");
    await expect(page.locator("#booking-result")).not.toBeVisible();
  } finally { await context.close(); }
});
check("Actual sample download contains correct meal sums, approximate macros and safety disclosures", async () => {
  const { page, context } = await visit();
  try {
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: "Save this sample" }).click();
    const download = await pending;
    assert.equal(download.suggestedFilename(), "fuelright-sample-day.txt");
    const bytes = await readFile(await download.path(), "utf8");
    assert.match(bytes, /2,020 cal \| 141g protein/);
    assert.match(bytes, /2,058 kcal/);
    assert.match(bytes, /not a personalized meal plan or medical advice/);
    const meals = [...bytes.matchAll(/— (\d+) cal, (\d+)g protein/g)];
    assert.equal(meals.length, 5);
    assert.equal(meals.reduce((total, meal) => total + Number(meal[1]), 0), 2020);
    assert.equal(meals.reduce((total, meal) => total + Number(meal[2]), 0), 141);
    for (const summary of await page.locator(".faq-list summary").all()) {
      await summary.click();
      assert.equal(await summary.evaluate((element) => element.parentElement.open), true);
    }
    await page.getByRole("button", { name: "About & privacy", exact: true }).click();
    await expect(page.locator("#about-dialog")).toContainText("not independently verified");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "About & privacy", exact: true })).toBeFocused();
  } finally { await context.close(); }
});
check("Desktop/mobile rendering, real image/font loading, navigation, touch and keyboard dialogs", async () => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const { page, context } = await visit({ viewport: { width, height: 1000 }, isMobile: width < 600, hasTouch: width < 600 });
    try {
      for (const image of await page.locator("img[src]").all()) {
        if (await image.isVisible()) await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => { element.loading = "eager"; return element.decode(); });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const bounds = await page.evaluate(() => ({ inner: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.equal(bounds.inner, width);
      assert.ok(bounds.scroll <= width + 1, JSON.stringify({ width, ...bounds }));
      assert.equal(await page.evaluate(() => document.fonts.check('700 16px "Outfit"') && document.fonts.check('400 16px "Source Sans 3"')), true);
      if (width < 600) {
        const undersized = await page.evaluate(() => [...document.querySelectorAll("button,a,summary,input,select")].filter((element) => {
          if (element.closest("dialog") || element.closest(".skip")) return false;
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && box.height < 43.9;
        }).map((element) => ({ text: element.textContent.trim().slice(0, 50), height: element.getBoundingClientRect().height })));
        assert.deepEqual(undersized, []);
        await page.getByRole("button", { name: "Open navigation", exact: true }).tap();
        await page.getByRole("link", { name: "Coaching plans", exact: true }).tap();
        await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
        await page.locator("[data-billing=annual]").tap();
        await page.getByRole("button", { name: "Start Now — Pro", exact: true }).tap();
        await expect(page.locator("#support")).toHaveValue("pro");
        assert.equal(await page.locator("#assessment-dialog").evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true);
        await page.getByRole("button", { name: "Close assessment", exact: true }).tap();
        await page.locator("[data-billing=monthly]").tap();
      } else {
        await page.locator(".hero-cta").click();
        for (let i = 0; i < 16; i++) {
          await page.keyboard.press("Tab");
          assert.equal(await page.evaluate(() => !!document.activeElement?.closest("#assessment-dialog")), true);
        }
        await page.keyboard.press("Escape");
        await expect(page.locator(".hero-cta")).toBeFocused();
      }
      if (width === 1440 || width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const name = width === 1440 ? "desktop" : "mobile";
        await page.screenshot({ path: path.join(checks, `${name}.png`) });
        await page.screenshot({ path: path.join(checks, `${name}-full.png`), fullPage: true });
      }
    } finally { await context.close(); }
  }
});
check("Fresh receipt is persisted only after all six checks and zero browser/network failures", async () => {
  assert.equal(completed.length, 6);
  assert.deepEqual(problems, []);
  await writeFile(path.join(checks, "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), modelId: "gpt-6.1-sol",
    digest: await StaticHomepage.validateStaticOutput(exported, "nutrition-coaching", "GPT-6"),
    tests: [...completed, "Receipt integrity"], testCount: 7, errors: problems,
    viewports: [1440, 1024, 768, 390, 320],
    runtime: "Real installed Playwright Chromium; nested static URL; local GET requests only; no storage writes",
    screenshots: ["desktop.png", "desktop-full.png", "mobile.png", "mobile-full.png"],
    limitations: "Fictional coaches/credentials/testimonials; local support-tier suggestion and call preview only; no medical assessment, backend, service enrollment, app or clinical outcomes verified.",
  }, null, 2) + "\n");
});
