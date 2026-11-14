import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";

const folder = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(folder, "../../../..");
const prompt = "034-fitness-challenge-landing-page";
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const slug = "fitness-challenge-landing-page";
const outcomes = [];
const errors = new Set();
const requests = [];
async function guard() {
  const contents = await readFile(path.join(root, "out", ".generation-locks", `${prompt}.lock`), "utf8");
  const [pid, session] = contents.trim().split(/\r?\n/);
  const lock = contents.trimStart().startsWith("{") ? JSON.parse(contents) : { pid: Number(pid), session };
  assert.ok(lock.session);
  if (lock.prompt !== undefined) assert.equal(lock.prompt, prompt);
  assert.ok(Number.isInteger(lock.pid) && lock.pid > 0);
  process.kill(lock.pid, 0);
}
async function equality(directory = "") {
  for (const entry of await readdir(path.join(folder, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (relative === "assets") await equality(relative);
    } else if (directory === "assets" || ["index.html", "style.css", "app.js"].includes(relative)) {
      assert.deepEqual(await readFile(path.join(folder, relative)), await readFile(path.join(exported, relative)), relative);
    }
  }
}
function observe(page, origin) {
  page.on("pageerror", (error) => errors.add(error.message));
  page.on("requestfailed", (request) => errors.add(`requestfailed ${request.url()}`));
  page.on("response", (response) => { if (response.status() >= 400) errors.add(`HTTP ${response.status()} ${response.url()}`); });
  page.on("request", (request) => {
    requests.push({ method: request.method(), url: request.url() });
    if (!request.url().startsWith(origin)) errors.add(`External request ${request.url()}`);
    if (request.method() !== "GET") errors.add(`Unexpected method ${request.method()}`);
  });
}
test("IGNITE 30 real Chromium static homepage", { timeout: 180000 }, async (t) => {
  await guard();
  await mkdir(checks, { recursive: true });
  const service = await startPreviewServer(exported, { workspace: root });
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", acceptDownloads: true });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    observe(page, new URL(service.url).origin);
    await page.goto(service.url, { waitUntil: "networkidle" });
    let allPassed = true;
    const check = async (name, fn) => {
      await t.test(name, async () => {
        try { await fn(); outcomes.push(name); }
        catch (error) { allPassed = false; throw error; }
      });
    };
    await check("public nested mount, source equality, assets, fonts, honest historical state", async () => {
      assert.equal(new URL(page.url()).pathname, `/pages/${slug}/GPT-6/index.html`);
      await equality();
      assert.equal(await page.title(), "IGNITE 30 · PulseUp Fitness");
      assert.equal(await page.locator(".workout-card").count(), 7);
      assert.equal(await page.locator(".countdown b").allTextContents().then((items) => items.join("")), "00000000");
      const state = await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => image.decode()));
        return { fonts: document.fonts.status, images: [...document.images].every((image) => image.complete && image.naturalWidth > 0), badLinks: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((hash) => !document.getElementById(hash.slice(1))), local: localStorage.length, session: sessionStorage.length };
      });
      assert.equal(state.fonts, "loaded"); assert.equal(state.images, true); assert.deepEqual(state.badLinks, []);
      assert.equal(state.local, 0); assert.equal(state.session, 0);
      const sprite = await readFile(path.join(exported, "assets", "icons.svg"), "utf8");
      const ids = await page.locator("svg use").evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1]));
      ids.forEach((id) => assert.ok(sprite.includes(`id="${id}"`), `Missing icon ${id}`));
      assert.match(await page.locator(".concept-bar").textContent(), /fictional/);
    });
    await check("plan validation, unsafe text, Pro choice, unlock and keyboard dialog behavior", async () => {
      await page.locator('[data-join="Pro"]').click();
      await page.locator("#intention").fill("Try movement");
      await page.locator('#plan-form button[type="submit"]').click();
      assert.equal(await page.locator("#acknowledge").evaluate((input) => input.validity.valueMissing), true);
      assert.equal(await page.locator("#plan-result").isVisible(), false);
      await page.locator("#intention").fill("   ");
      await page.locator("#acknowledge").check();
      await page.locator('#plan-form button[type="submit"]').click();
      assert.equal(await page.locator("#plan-form").isVisible(), true);
      assert.match(await page.locator("#plan-error").textContent(), /non-space/);
      const unsafe = '<img src=x onerror="window.injection=1">';
      await page.locator("#intention").fill(unsafe);
      await page.locator("#level").selectOption("Intermediate");
      await page.locator('#plan-form button[type="submit"]').click();
      assert.match(await page.locator("#plan-result").textContent(), /Pro concept · Intermediate/);
      assert.ok((await page.locator("#plan-result").textContent()).includes(unsafe));
      assert.equal(await page.locator("#plan-result img").count(), 0);
      assert.equal(await page.evaluate(() => window.injection), undefined);
      for (let count = 0; count < 10; count++) {
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.closest("dialog")?.id), "join-dialog");
      }
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#join-dialog").isVisible(), false);
      assert.equal(await page.locator("[data-day='3']").textContent().then((text) => text.includes("Preview workout")), true);
    });
    await check("workout checks, repeat-safe progress and practice timer start/pause/reset/end", async () => {
      await page.locator('[data-day="0"]').click();
      assert.equal(await page.locator("#complete-workout").isDisabled(), true);
      await page.locator("#start-timer").click();
      await page.waitForTimeout(1150);
      assert.notEqual(await page.locator("#timer").textContent(), "00:20");
      await page.locator("#start-timer").click();
      const paused = await page.locator("#timer").textContent();
      await page.waitForTimeout(1100);
      assert.equal(await page.locator("#timer").textContent(), paused);
      await page.locator("#reset-timer").click();
      assert.equal(await page.locator("#timer").textContent(), "00:20");
      await page.clock.install();
      await page.locator("#start-timer").click();
      await page.clock.runFor(21000);
      assert.equal(await page.locator("#timer").textContent(), "00:00");
      assert.match(await page.locator("#workout-status").textContent(), /complete/);
      for (const checkbox of await page.locator("#exercise-list input").all()) await checkbox.check();
      await page.locator("#complete-workout").click();
      assert.match(await page.locator("#local-progress").textContent(), /^1 SAMPLE SESSION CHECKED OFF$/);
      await page.keyboard.press("Escape");
      await page.locator('[data-day="0"]').click();
      for (const checkbox of await page.locator("#exercise-list input").all()) await checkbox.check();
      await page.locator("#complete-workout").click();
      assert.match(await page.locator("#local-progress").textContent(), /^1 SAMPLE SESSION CHECKED OFF$/);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#timer").textContent(), "00:20");
    });
    await check("nutrition download, all FAQs, stories, scoring and every footer information action", async () => {
      const downloadPromise = page.waitForEvent("download");
      await page.locator('a[download]').click();
      const download = await downloadPromise;
      assert.equal(download.suggestedFilename(), "ignite-nutrition-framework.txt");
      assert.equal(await download.failure(), null);
      const guide = await page.request.get(new URL("assets/nutrition-framework.txt", service.url).href);
      assert.equal(guide.ok(), true); assert.match(await guide.text(), /not personalized/);
      for (const details of await page.locator(".faqs details").all()) {
        const summary = details.locator("summary");
        await summary.focus(); await page.keyboard.press("Enter");
        assert.equal(await details.getAttribute("open"), "");
        assert.equal(await details.locator("p").isVisible(), true);
        await page.keyboard.press("Enter");
        assert.equal(await details.getAttribute("open"), null);
      }
      await page.locator("#more-stories").click(); assert.equal(await page.locator("#extra-stories").isVisible(), true);
      await page.locator("#more-stories").click(); assert.equal(await page.locator("#extra-stories").isVisible(), false);
      await page.locator(".points summary").click(); assert.match(await page.locator(".points p").textContent(), /10 per workout/);
      for (const button of await page.locator("[data-info]").all()) {
        await button.click(); assert.equal(await page.locator("#info-dialog").isVisible(), true);
        assert.ok((await page.locator("#info-text").textContent()).length > 40);
        await page.keyboard.press("Escape");
      }
    });
    await check("1440/1024/768/390/320 layouts, 48px mobile controls and reduced motion", async () => {
      await page.reload({ waitUntil: "networkidle" });
      assert.match(await page.locator("#local-progress").textContent(), /^0 /);
      assert.match(await page.locator('[data-day="3"]').textContent(), /unlock/);
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => window.scrollTo(0, 0));
        const sizes = await page.evaluate(() => ({ width: innerWidth, actual: document.documentElement.scrollWidth, scroll: getComputedStyle(document.documentElement).scrollBehavior }));
        assert.ok(sizes.actual <= width, `Overflow ${width}: ${JSON.stringify(sizes)}`);
        assert.equal(sizes.scroll, "auto");
        if (width <= 768) {
          const small = await page.locator("button,a,summary,select,input:not([type=checkbox])").evaluateAll((elements) => elements.filter((element) => { const r = element.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(element).visibility !== "hidden" && (r.width < 47.9 || r.height < 47.9); }).map((element) => ({ text: element.textContent.trim().slice(0, 40), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
          assert.deepEqual(small, [], `Small controls at ${width}`);
        }
      }
    });
    await check("touch menu, horizontal swipe, locked-day flow, Free preview and full-page mobile targets", async () => {
      const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, reducedMotion: "reduce" });
      try {
        const mobile = await mobileContext.newPage();
        observe(mobile, new URL(service.url).origin);
        await mobile.goto(service.url, { waitUntil: "networkidle" });
        await mobile.locator(".menu").tap();
        assert.equal(await mobile.locator("#navigation").isVisible(), true);
        await mobile.locator('#navigation a[href="#workouts"]').tap();
        assert.equal(await mobile.locator(".menu").getAttribute("aria-expanded"), "false");
        await mobile.locator("#workout-rail").scrollIntoViewIfNeeded();
        const rect = await mobile.locator("#workout-rail").boundingBox();
        const cdp = await mobileContext.newCDPSession(mobile);
        const y = Math.min(rect.y + 120, 600);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 340, y }] });
        for (const x of [300, 240, 180, 120, 60]) {
          await mobile.waitForTimeout(50);
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await mobile.waitForTimeout(1200);
        assert.ok(await mobile.locator("#workout-rail").evaluate((rail) => rail.scrollLeft) > 0);
        await mobile.locator("#next-day").tap();
        await mobile.waitForFunction(() => {
          const box = document.querySelector('[data-day="3"]').getBoundingClientRect();
          return box.left >= 0 && box.right <= innerWidth;
        });
        await mobile.locator('[data-day="3"]').tap();
        await mobile.locator("#join-dialog").waitFor({ state: "visible" });
        assert.equal(await mobile.locator("#join-dialog").isVisible(), true);
        assert.equal(await mobile.locator("#plan-tier").textContent(), "Free");
        await mobile.locator("#intention").fill("Make time for movement");
        await mobile.locator("#acknowledge").check();
        await mobile.locator('#plan-form button[type="submit"]').tap();
        await mobile.locator("#plan-result button").tap();
        await mobile.locator("#next-day").tap();
        await mobile.locator("#next-day").tap();
        await mobile.waitForFunction(() => {
          const box = document.querySelector('[data-day="6"]').getBoundingClientRect();
          return box.left >= 0 && box.right <= innerWidth;
        });
        await mobile.locator('[data-day="6"]').tap();
        assert.match(await mobile.locator("#workout-title").textContent(), /ACTIVE RECOVERY/);
        await mobile.locator('#workout-dialog [data-close]').tap();
        const small = await mobile.locator("main button,main a,main summary,footer button,footer a").evaluateAll((elements) => elements.filter((element) => { const r = element.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 47.9 || r.height < 47.9); }).map((element) => ({ text: element.textContent.trim().slice(0, 40), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
        assert.deepEqual(small, []);
        await mobile.reload({ waitUntil: "networkidle" });
        await mobile.evaluate(() => window.scrollTo(0, 0));
        await mobile.screenshot({ path: path.join(checks, "mobile-hero.png"), fullPage: false, animations: "disabled" });
        await mobile.screenshot({ path: path.join(checks, "mobile-390.png"), fullPage: true, animations: "disabled" });
        await mobile.locator("#workouts").screenshot({ path: path.join(checks, "mobile-workouts.png"), animations: "disabled" });
      } finally { await mobileContext.close(); }
    });
    await check("desktop screenshots, storage/transport audit and clean browser receipt", async () => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.reload({ waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(checks, "desktop-1440.png"), fullPage: true, animations: "disabled" });
      await page.screenshot({ path: path.join(checks, "desktop-hero.png"), fullPage: false, animations: "disabled" });
      await page.locator("#pricing").screenshot({ path: path.join(checks, "desktop-pricing.png"), animations: "disabled" });
      const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie }));
      assert.deepEqual(storage, { local: 0, session: 0, cookie: "" });
      assert.deepEqual([...errors], []);
      assert.ok(requests.length > 10);
      const source = await readFile(path.join(folder, "app.js"), "utf8");
      assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|sendBeacon)\s*\(|\b(localStorage|sessionStorage)\s*\.\s*(setItem|getItem|removeItem|clear)\s*\(/);
    });
    assert.equal(allPassed, true, "Every browser subtest must pass before issuing a success receipt");
    await guard();
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    await writeFile(path.join(checks, "validation.json"), JSON.stringify({ checkedAt: new Date().toISOString(), digest, errors: [...errors], tests: outcomes, browser: await browser.version(), widths: [1440, 1024, 768, 390, 320], touch: "Actual Chromium CDP touch swipe, tap menu, Free plan and locked-day unlock", requests: { count: requests.length, methods: [...new Set(requests.map((request) => request.method))], origins: [...new Set(requests.map((request) => new URL(request.url).origin))], failed: 0, external: 0 }, storage: "No persistence, cookies, POST or external runtime requests", screenshots: ["desktop-1440.png", "desktop-hero.png", "desktop-pricing.png", "mobile-hero.png", "mobile-390.png", "mobile-workouts.png"] }, null, 2) + "\n");
    await context.close();
  } finally { try { await browser?.close(); } finally { await service.close(); } }
});
