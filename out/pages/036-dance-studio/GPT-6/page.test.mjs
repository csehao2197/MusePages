import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";

const root = import.meta.dirname, output = path.join(root, "out"), checks = path.join(root, ".checks");
async function guard() {
  const file = path.resolve(root, "..", "..", "..", ".generation-locks", "036-dance-studio.lock");
  const lock = JSON.parse(await readFile(file, "utf8"));
  assert.equal(lock.session, "eccb5b0b-bbe8-44e2-97e8-4c615c652be2");
  assert.equal(lock.prompt, "036-dance-studio");
  assert.ok(Date.now() - (await stat(file)).mtimeMs < 1800000, "Owned guard must be unexpired");
  process.kill(lock.pid, 0);
}
async function files(dir, prefix = "") {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(path.join(dir, entry.name), name)); else result.push(name);
  } return result;
}
test("Rhythm & Flow focused static/browser acceptance", { timeout: 180000 }, async (t) => {
  await guard();
  const errors = [], requests = [], completed = [];
  let browser, service, context;
  const step = async (name, fn) => { await t.test(name, async () => { try { await fn(); completed.push(name); } catch (error) { errors.push(`${name}: ${error.message}`); throw error; } }); };
  try {
    await step("export equality, public paths and static boundary", async () => {
      for (const file of ["index.html", "style.css", "app.js", ...await files(path.join(root, "assets")).then((all) => all.map((name) => path.join("assets", name)))]) assert.deepEqual(await readFile(path.join(root, file)), await readFile(path.join(output, file)), file);
      assert.equal((await files(output)).some((file) => /(?:page\.test|metadata|README|\.checks|config)/i.test(file)), false);
      assert.ok(await validateStaticOutput(output, "dance-studio", "GPT-6"));
    });
    service = await startPreviewServer(output);
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    function observe(p) {
      p.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      p.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()}`));
      p.on("response", (response) => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
      p.on("request", (request) => { requests.push({ method: request.method(), url: request.url() }); if (!request.url().startsWith(new URL(service.url).origin)) errors.push(`External runtime request: ${request.url()}`); if (request.method() !== "GET") errors.push(`Non-GET request: ${request.method()}`); });
    }
    observe(page);
    await step("nested mount, images, fonts and current Austin day", async () => {
      const response = await page.goto(service.url, { waitUntil: "networkidle" }); assert.equal(response.status(), 200);
      await page.evaluate(async () => { document.querySelectorAll("img").forEach((image) => { image.loading = "eager"; }); await Promise.all([...document.fonts].map((font) => font.load())); await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())); });
      await expect(page.locator("h1")).toHaveText("MOVE.EXPRESS.TRANSFORM.");
      const day = await page.evaluate(() => (new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })).getDay() + 6) % 7);
      await expect(page.locator(`#day-${day}`)).toHaveAttribute("aria-selected", "true");
      assert.equal(await page.evaluate(() => [...document.fonts].every((font) => font.status === "loaded")), true);
      assert.equal(new URL(page.url()).pathname, "/pages/dance-studio/GPT-6/index.html");
    });
    await step("five style filters, seven distinct days, keyboard wrapping and full week", async () => {
      await page.locator('[data-style="Ballet"]').first().click(); await expect(page.locator(".class-row")).toHaveCount(1); await expect(page.locator(".class-row h3")).toHaveText("Ballet Basics");
      for (const style of ["Hip-Hop", "Contemporary", "Salsa & Latin", "Breaking", "Ballet"]) { await page.locator("#schedule-filter").selectOption(style); await expect(page.locator(".class-row")).toHaveCount(1); }
      await page.locator("#schedule-filter").selectOption("All styles");
      for (let day = 0; day < 7; day++) { await page.locator(`#day-${day}`).click(); await expect(page.locator(".class-row")).toHaveCount(5); }
      await expect(page.locator(".class-time").first()).toHaveText("10:00 AM");
      await page.locator("#day-0").click(); await expect(page.locator(".class-time").first()).toHaveText("5:00 PM");
      await page.locator("#day-6").click();
      await page.locator("#day-6").focus(); await page.keyboard.press("ArrowRight"); await expect(page.locator("#day-0")).toBeFocused();
      await page.keyboard.press("End"); await expect(page.locator("#day-6")).toBeFocused();
      await page.keyboard.press("Home"); await expect(page.locator("#day-0")).toBeFocused();
      await page.locator("#next-day").click(); await expect(page.locator("#day-1")).toHaveAttribute("aria-selected", "true");
      await page.locator("#previous-day").click(); await expect(page.locator("#day-0")).toHaveAttribute("aria-selected", "true");
      await page.locator("#full-schedule").click(); await expect(page.locator(".week-day")).toHaveCount(7);
      await page.keyboard.press("Escape"); await expect(page.locator("#detail-dialog")).not.toBeVisible(); await expect(page.locator("#full-schedule")).toBeFocused();
    });
    await step("class booking, whitespace/email/radio validation and safe local summary", async () => {
      await page.locator('[data-class="Hip-Hop"]').click(); await expect(page.locator('[name=style]')).toHaveValue("Hip-Hop");
      await expect(page.locator("#booking-selection")).toContainText("Hip-Hop Foundations");
      await page.locator("[name=name]").fill("   "); await page.locator("[name=email]").fill("sample@example.com");
      await page.locator("#trial-form button[type=submit]").click(); await expect(page.locator("#confirmation")).not.toBeVisible(); await expect(page.locator("#form-error")).toContainText("valid email");
      const unsafe = '<img src=x onerror="window.injected=true">';
      await page.locator("[name=name]").fill(unsafe); await page.locator("[name=email]").fill("bad");
      await page.locator('[name=experience][value="Never Danced"]').check(); await page.locator("#trial-form button[type=submit]").click(); await expect(page.locator("#confirmation")).not.toBeVisible();
      await page.locator("[name=email]").fill("  sample@example.com  "); await page.locator("#trial-form button[type=submit]").click();
      await expect(page.locator("#confirmation")).toBeVisible(); await expect(page.locator("#confirmation-text")).toContainText(unsafe);
      assert.equal(await page.locator("#confirmation-text img").count(), 0); assert.equal(await page.evaluate(() => window.injected), undefined);
      assert.equal(await page.locator("[name=email]").inputValue(), "");
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      await page.locator("#reset-form").click(); await expect(page.locator("[name=name]")).toBeFocused(); await expect(page.locator("#booking-selection")).toHaveText("");
    });
    await step("profiles, plan interest and every local information action", async () => {
      for (let index = 0; index < 4; index++) { await page.locator(`[data-profile="${index}"]`).click(); await expect(page.locator("#dialog-content")).toContainText("Fictional"); await page.keyboard.press("Escape"); }
      await page.locator('[data-profile="1"]').click(); await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(() => !!document.activeElement.closest("dialog")), true, "Native dialog traps keyboard focus");
      await page.locator("#dialog-content .button").click(); await expect(page.locator("#schedule-filter")).toHaveValue("Salsa & Latin"); await expect(page.locator(".class-row")).toHaveCount(1);
      await page.locator('[data-plan="Class Pack (10) — $180"]').click(); await expect(page.locator("#dialog-content")).toContainText("no checkout");
      await page.locator("#dialog-content .button").click(); await expect(page.locator("#booking-selection")).toContainText("Class Pack");
      await page.locator("[name=name]").fill("Demo Dancer"); await page.locator("[name=email]").fill("demo@example.com"); await page.locator('[name=experience][value="Some Experience"]').check(); await page.locator("#trial-form button[type=submit]").click(); await expect(page.locator("#confirmation-text")).toContainText("Class Pack");
      await page.locator("#reset-form").click();
      for (const value of ["about", "careers", "press", "events", "blog", "partnerships", "location", "parking", "faq", "contact", "social", "privacy", "terms", "accessibility", "credits"]) {
        await page.locator(`[data-info="${value}"]`).first().click(); await expect(page.locator("#dialog-title")).not.toBeEmpty(); await expect(page.locator("#dialog-content")).not.toBeEmpty(); await page.keyboard.press("Escape");
      }
    });
    await step("photo lightbox and actual local reel playback/pause/cleanup", async () => {
      await page.locator('[data-gallery="0"]').click(); await expect(page.locator("#dialog-content img")).toBeVisible(); await page.keyboard.press("Escape");
      await page.locator("[data-reel]").click(); await expect(page.locator("#dialog-content")).toContainText("not footage");
      await page.locator("video").evaluate(async (video) => { await video.play(); });
      await page.waitForFunction(() => document.querySelector("video")?.currentTime > .2);
      const duration = await page.locator("video").evaluate((video) => { video.pause(); return video.duration; }); assert.ok(duration > 4 && duration < 9);
      await page.keyboard.press("Escape"); await expect(page.locator("video")).toHaveCount(0); await expect(page.locator("[data-reel]")).toBeFocused();
      await page.locator('[data-gallery="7"]').click(); await expect(page.locator("video")).toBeVisible(); await page.keyboard.press("Escape");
    });
    await step("responsive widths, local anchors, screenshots and reduced motion", async () => {
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 }); await page.goto(service.url, { waitUntil: "networkidle" });
        await page.evaluate(async () => { document.querySelectorAll("img").forEach((image) => { image.loading = "eager"; }); await Promise.all([...document.fonts].map((font) => font.load())); await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())); });
        const layout = await page.evaluate(() => ({ viewport: innerWidth, actual: document.documentElement.scrollWidth, brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((href) => !document.querySelector(href)), scroll: getComputedStyle(document.documentElement).scrollBehavior }));
        assert.ok(layout.actual <= layout.viewport, `No overflow at ${width}: ${JSON.stringify(layout)}`); assert.deepEqual(layout.brokenAnchors, []); assert.equal(layout.scroll, "auto");
        if (width <= 390) {
          const small = await page.evaluate(() => [...document.querySelectorAll("button,a,select,input:not([type=radio])")].filter((el) => { const rect = el.getBoundingClientRect(); return rect.width && rect.height && getComputedStyle(el).visibility !== "hidden" && !el.closest("dialog") && !el.classList.contains("skip") && (rect.width < 43.9 || rect.height < 43.9); }).map((el) => ({ text: el.textContent.trim().slice(0, 45), class: el.className, w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })));
          assert.deepEqual(small, [], `44px targets at ${width}`);
        }
        if (width === 1440) { await guard(); await page.screenshot({ path: path.join(checks, "desktop-1440.png"), fullPage: true }); await page.screenshot({ path: path.join(checks, "desktop-fold.png") }); }
        if (width === 390) { await guard(); await page.screenshot({ path: path.join(checks, "mobile-390.png"), fullPage: true }); await page.screenshot({ path: path.join(checks, "mobile-fold.png") }); }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator("#schedule").scrollIntoViewIfNeeded(); await guard(); await page.screenshot({ path: path.join(checks, "schedule-desktop.png") });
      await page.locator("#trial").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, "trial-desktop.png") });
      await page.setViewportSize({ width: 390, height: 900 }); await page.goto(service.url, { waitUntil: "networkidle" }); await page.locator("#schedule").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, "schedule-mobile.png") });
      await page.locator("#trial").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, "trial-mobile.png") });
    });
    await step("mobile menu, touch day swiping, swipe carousel and sticky trial", async () => {
      const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
      try {
        const p = await mobile.newPage(); p.setDefaultTimeout(12000); observe(p); await p.goto(service.url, { waitUntil: "networkidle" });
        await p.locator(".menu").tap(); await expect(p.locator("#navigation")).toBeVisible(); await p.keyboard.press("Escape"); await expect(p.locator(".menu")).toBeFocused();
        await p.locator(".menu").tap(); await p.locator('#navigation a[href="#schedule"]').tap(); await expect(p.locator(".menu")).toHaveAttribute("aria-expanded", "false");
        await p.locator("#day-0").tap(); await p.locator("#class-list").scrollIntoViewIfNeeded();
        const box = await p.locator("#class-list").boundingBox(), cdp = await mobile.newCDPSession(p);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 320, y: box.y + 100 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 170, y: box.y + 100 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await expect(p.locator("#day-1")).toHaveAttribute("aria-selected", "true");
        await p.locator("#classes").scrollIntoViewIfNeeded(); await p.locator(".style-grid").evaluate((el) => { el.scrollLeft = el.scrollWidth; }); assert.ok(await p.locator(".style-grid").evaluate((el) => el.scrollLeft > 400));
        await p.locator(".mobile-trial").tap(); await expect(p.locator("#trial-form")).toBeVisible();
        await cdp.detach();
      } finally { await mobile.close(); }
    });
    await step("no runtime failures, external calls, submissions or persistent personal data", async () => {
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0); assert.ok(requests.length > 30);
      assert.deepEqual(errors, []);
      await guard();
      const digest = await validateStaticOutput(output, "dance-studio", "GPT-6");
      await mkdir(checks, { recursive: true });
      await writeFile(path.join(checks, "validation.json"), JSON.stringify({ checkedAt: new Date().toISOString(), digest, errors: [], tests: [...completed, "no runtime failures, external calls, submissions or persistent personal data"], nodeTestCount: 10, browser: "Playwright Chromium", requests: { total: requests.length, methods: [...new Set(requests.map((r) => r.method))], external: 0, failures: 0 }, viewports: [1440, 1024, 768, 390, 320], mobileTargets: "44px minimum checked at 390 and 320", syntax: "node --check app.js passed separately", cleanup: "Browser contexts and localhost random-port server closed in finally" }, null, 2) + "\n");
    });
  } finally { await context?.close(); await browser?.close(); await service?.close(); }
  assert.deepEqual(errors, []);
});
