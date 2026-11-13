import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";

const folder = import.meta.dirname;
const workspace = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const errors = [];
const requests = [];
const testDetails = [];
const screenshots = [];
const alive = async () => {
  const contents = await readFile(path.join(workspace, "out", ".generation-locks", "035-crossfit-gym.lock"), "utf8");
  const [pid, session] = contents.trim().split(/\r?\n/);
  const lock = contents.trimStart().startsWith("{") ? JSON.parse(contents) : { pid: Number(pid), session };
  assert.ok(lock.session);
  if (lock.prompt !== undefined) assert.equal(lock.prompt, "035-crossfit-gym");
  assert.ok(Number.isInteger(lock.pid) && lock.pid > 0);
  process.kill(lock.pid, 0);
};
async function equalFiles(source, target) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) await equalFiles(from, to);
    else assert.deepEqual(await readFile(from), await readFile(to), `Export mismatch: ${entry.name}`);
  }
}
test("Iron Tide static homepage — focused real-browser validation", { timeout: 180000 }, async (t) => {
  await alive();
  const service = await startPreviewServer(exported, { workspace });
  let browser;
  let context;
  let mobileContext;
  let passed = true;
  async function check(name, run) {
    await t.test(name, async () => {
      try {
        await run();
        testDetails.push({ name, passed: true });
      } catch (error) {
        passed = false;
        throw error;
      }
    });
  }
  function observe(page) {
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on("request", (request) => {
      const { url, method } = { url: request.url(), method: request.method() };
      requests.push({ url, method });
      if (!url.startsWith(new URL(service.url).origin)) errors.push(`External runtime request: ${url}`);
      if (!["GET", "HEAD"].includes(method)) errors.push(`Unexpected runtime method: ${method}`);
    });
  }
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    observe(page);
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }));
    });
    await check("export identity, nested mount, local assets, fonts and safe disclosures", async () => {
      assert.match(service.url, /\/pages\/crossfit-gym\/GPT-6\/index\.html$/);
      for (const file of ["index.html", "style.css", "app.js"]) assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)));
      await equalFiles(path.join(folder, "assets"), path.join(exported, "assets"));
      assert.equal(await page.title(), "Iron Tide — Stronger Starts Here");
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("main section").count(), 12);
      assert.equal(await page.locator(".program-card").count(), 3);
      assert.equal(await page.locator(".coach").count(), 4);
      assert.equal(await page.locator(".story").count(), 3);
      assert.match(await page.locator(".footer-bottom").innerText(), /Not affiliated/);
      const fonts = await page.evaluate(() => [document.fonts.check("800 40px Barlow"), document.fonts.check("400 14px Inter")]);
      assert.deepEqual(fonts, [true, true]);
      assert.equal(await page.evaluate(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0)), true);
      assert.equal(await page.locator("body").innerText().then((text) => text.includes("035-")), false);
      const badAnchors = await page.evaluate(() => [...document.querySelectorAll("a[href]")].filter((link) => {
        const href = link.getAttribute("href");
        return !href.startsWith("#") || !document.querySelector(href);
      }).map((link) => link.outerHTML));
      assert.deepEqual(badAnchors, []);
      assert.equal(await page.locator("form[action],iframe").count(), 0);
    });
    await check("workout scaling, ticker state and keyboard operation", async () => {
      const toggle = page.locator("#scale-toggle");
      await toggle.click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      assert.match(await page.locator("#scale-options").innerText(), /95\/65/);
      assert.match(await page.locator("#scale-options").innerText(), /step-ups/);
      assert.match(await page.locator("#scale-options").innerText(), /assisted pull-ups/);
      await toggle.press("Enter");
      assert.equal(await page.locator("#scale-options").isVisible(), false);
      await page.locator(".ticker-pause").click();
      assert.equal(await page.locator(".ticker-pause").getAttribute("aria-pressed"), "true");
      await page.locator(".ticker-pause").click();
      assert.equal(await page.locator(".ticker-pause").getAttribute("aria-pressed"), "false");
    });
    await check("all seven schedule days, exact sample rows, arrow/Home/End and waitlist distinction", async () => {
      for (const [day, expected] of [["Mon", 8], ["Tue", 8], ["Wed", 8], ["Thu", 8], ["Fri", 8], ["Sat", 4], ["Sun", 2]]) {
        await page.locator(`[data-day="${day}"]`).click();
        assert.equal(await page.locator(".schedule-row").count(), expected);
        assert.equal(await page.locator(`#day-${day.toLowerCase()}`).getAttribute("aria-selected"), "true");
        assert.equal(await page.locator("#day-panel").getAttribute("aria-labelledby"), `day-${day.toLowerCase()}`);
      }
      await page.locator('[data-day="Sun"]').press("ArrowRight");
      assert.equal(await page.locator('[data-day="Mon"]').getAttribute("aria-selected"), "true");
      await page.locator('[data-day="Mon"]').press("End");
      assert.equal(await page.locator('[data-day="Sun"]').getAttribute("aria-selected"), "true");
      await page.locator('[data-day="Sun"]').press("Home");
      assert.equal(await page.locator('[data-day="Mon"]').getAttribute("aria-selected"), "true");
      await page.locator('[data-day="Thu"]').click();
      assert.match(await page.locator(".schedule-row").nth(1).innerText(), /6:30.*AM[\s\S]*Priya[\s\S]*Full/);
      await page.locator(".schedule-row").nth(1).locator("button").click();
      assert.match(await page.locator("#intro-selection").innerText(), /Waitlist preview · Thu 6:30 AM/);
      await page.keyboard.press("Escape");
      await page.locator(".schedule-row").first().locator("button").click();
      assert.match(await page.locator("#intro-selection").innerText(), /Reservation preview · Thu 5:30 AM/);
      await page.keyboard.press("Escape");
    });
    await check("annual arithmetic, plan amounts, unchanged drop-in and restored monthly state", async () => {
      await page.locator("#annual-toggle").click();
      assert.equal(await page.locator("#annual-toggle").getAttribute("aria-checked"), "true");
      assert.deepEqual(await page.locator("[data-monthly]").allTextContents(), ["$157.25", "$191.25"]);
      assert.match(await page.locator('[data-billing="185"]').innerText(), /\$1,887 billed annually/);
      assert.match(await page.locator('[data-billing="225"]').innerText(), /\$2,295 billed annually/);
      assert.equal(await page.locator(".price-card").first().locator(".price strong").innerText(), "$25");
      await page.locator("#annual-toggle").press("Space");
      assert.deepEqual(await page.locator("[data-monthly]").allTextContents(), ["$185", "$225"]);
      for (const button of await page.locator(".price-card>button").all()) {
        await button.click();
        assert.equal(await page.locator("#intro-dialog").isVisible(), true);
        assert.match(await page.locator(".local-notice").innerText(), /No reservation, purchase, or waitlist entry/);
        await page.keyboard.press("Escape");
      }
    });
    await check("every program/information action, native disclosure and keyboard dialog focus", async () => {
      for (const button of await page.locator("[data-program],[data-info]").all()) {
        await button.click();
        assert.equal(await page.locator("#info-dialog").isVisible(), true);
        assert.ok((await page.locator("#info-body").innerText()).trim().length > 50);
        await page.keyboard.press("Escape");
        assert.equal(await button.evaluate((element) => element === document.activeElement), true);
      }
      await page.locator("[data-program=foundations]").first().click();
      await page.locator("#info-intro").click();
      assert.equal(await page.locator("#info-dialog").isVisible(), false);
      assert.equal(await page.locator("#intro-dialog").isVisible(), true);
      await page.locator('[aria-label="Close intro planner"]').focus();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.locator("#intro-dialog").evaluate((dialog) => dialog.contains(document.activeElement)), true);
      await page.keyboard.press("Escape");
      for (const summary of await page.locator("details summary").all()) {
        await summary.click();
        assert.equal(await summary.evaluate((element) => element.parentElement.open), true);
        await summary.press("Enter");
        assert.equal(await summary.evaluate((element) => element.parentElement.open), false);
      }
    });
    await check("trimmed validation, unsafe text inertness, ephemeral state, reset and no booking claims", async () => {
      await page.locator(".nav-cta").click();
      await page.locator("#first-name").fill("   ");
      await page.locator("#intro-form button[type=submit]").click();
      assert.match(await page.locator("#form-error").innerText(), /not only spaces/);
      assert.equal(await page.locator("#intro-result").isVisible(), false);
      await page.locator("#first-name").fill("Taylor");
      await page.locator("#intro-form button[type=submit]").click();
      assert.match(await page.locator("#form-error").innerText(), /Choose your experience/);
      const unsafe = "<img src=x onerror=window.bad=1>";
      await page.locator("#first-name").fill(unsafe);
      await page.locator("#experience").selectOption({ index: 1 });
      await page.locator("#preference").selectOption("Weekend");
      await page.locator("#intro-form button[type=submit]").click();
      assert.match(await page.locator("#intro-result").innerText(), /Nothing has been sent, saved, reserved, waitlisted, purchased, or charged/);
      assert.ok((await page.locator("#intro-result").innerText()).includes(unsafe));
      assert.match(await page.locator("#intro-result").innerText(), /Weekend/);
      assert.equal(await page.locator("#intro-result img").count(), 0);
      assert.equal(await page.evaluate(() => window.bad), undefined);
      await page.locator(".form-reset").click();
      assert.equal(await page.locator("#first-name").inputValue(), "");
      assert.equal(await page.locator("#intro-result").isVisible(), false);
      await page.locator("#first-name").fill("Not saved");
      await page.keyboard.press("Escape");
      await page.locator(".nav-cta").click();
      assert.equal(await page.locator("#first-name").inputValue(), "");
      assert.equal(await page.locator("#experience").inputValue(), "");
      await page.keyboard.press("Escape");
      assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    });
    await check("responsive 1440/1024/768/390/320 layouts, real screenshots and reduced motion", async () => {
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);
        const sizes = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
        const overflowing = sizes.document > sizes.viewport ? await page.evaluate(() => [...document.querySelectorAll("body *")].filter((element) => {
          const r = element.getBoundingClientRect();
          return r.width && (r.right > innerWidth || element.scrollWidth > element.clientWidth + 1) && !element.closest(".coach-grid,.day-tabs,.ticker");
        }).map((element) => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right, scroll: element.scrollWidth, text: element.textContent.slice(0, 60) }))) : [];
        assert.ok(sizes.document <= sizes.viewport, `${width}px document overflow: ${JSON.stringify({ ...sizes, overflowing })}`);
        if (width <= 390) {
          const small = await page.evaluate(() => [...document.querySelectorAll("a,button,summary,input,select")].filter((element) => {
            const r = element.getBoundingClientRect();
            return r.width && r.height && getComputedStyle(element).visibility !== "hidden" && !element.closest("dialog:not([open])") && !element.classList.contains("skip") && (r.width < 48 || r.height < 48);
          }).map((element) => ({ text: element.textContent.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
          assert.deepEqual(small, [], `${width}px undersized touch targets`);
          const order = await page.locator(".price-card").evaluateAll((cards) => cards.map((card) => ({ title: card.querySelector("h3").textContent, y: card.getBoundingClientRect().top })));
          assert.equal(order.sort((a, b) => a.y - b.y)[0].title, "Unlimited");
        }
        if ([1440, 390].includes(width)) {
          const file = `${width === 1440 ? "desktop" : "mobile"}-${width}.png`;
          await alive();
          await page.screenshot({ path: path.join(checks, file), fullPage: true, animations: "disabled" });
          screenshots.push(file);
          const firstfold = file.replace(".png", "-firstfold.png");
          await page.screenshot({ path: path.join(checks, firstfold), animations: "disabled" });
          screenshots.push(firstfold);
        }
      }
      assert.equal(await page.locator(".ticker-track").evaluate((element) => getComputedStyle(element).animationName), "none");
    });
    await check("touch menu, tab scrolling, coach swipe and local mobile intro", async () => {
      mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
      const mobile = await mobileContext.newPage();
      observe(mobile);
      await mobile.goto(service.url, { waitUntil: "networkidle" });
      await mobile.locator(".menu").tap();
      assert.equal(await mobile.locator(".menu").getAttribute("aria-expanded"), "true");
      await mobile.locator("#navigation a[href='#schedule']").tap();
      assert.equal(await mobile.locator(".menu").getAttribute("aria-expanded"), "false");
      await mobile.locator("[data-day=Sun]").tap();
      assert.equal(await mobile.locator(".schedule-row").count(), 2);
      const coaches = mobile.locator(".coach-grid");
      await coaches.scrollIntoViewIfNeeded();
      const bounds = await coaches.boundingBox();
      const cdp = await mobileContext.newCDPSession(mobile);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: bounds.x + bounds.width - 30, y: bounds.y + 80 }] });
      for (let step = 1; step <= 8; step++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: bounds.x + bounds.width - 30 - (bounds.width - 65) * step / 8, y: bounds.y + 80 }] });
        await mobile.waitForTimeout(35);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await mobile.waitForTimeout(1000);
      assert.ok(await coaches.evaluate((element) => element.scrollLeft > 0), "Coach track must respond to a real touch swipe");
      await mobile.locator(".mobile-sticky button").tap();
      await mobile.locator("#intro-dialog").waitFor({ state: "visible" });
      assert.equal(await mobile.locator("#intro-dialog").isVisible(), true);
      await mobile.locator("#first-name").fill("Taylor");
      await mobile.locator("#experience").selectOption({ index: 1 });
      await mobile.locator("#intro-form button[type=submit]").tap();
      await mobile.locator("#intro-result").waitFor({ state: "visible" });
      assert.equal(await mobile.locator("#intro-result").isVisible(), true);
      await mobile.locator("[aria-label='Close intro planner']").tap();
      assert.deepEqual(await mobile.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    });
    await check("zero browser, HTTP, runtime egress or storage failures", async () => {
      assert.ok(requests.length > 10);
      assert.deepEqual(errors, []);
      assert.deepEqual(await context.cookies(), []);
      assert.deepEqual(await mobileContext.cookies(), []);
      const script = await readFile(path.join(exported, "app.js"), "utf8");
      assert.doesNotMatch(script, /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
    });
    if (passed && errors.length === 0) {
      await alive();
      const digest = await validateStaticOutput(exported, "crossfit-gym", "GPT-6");
      await writeFile(path.join(checks, "validation.json"), JSON.stringify({
        checkedAt: new Date().toISOString(), digest, errors: [], tests: testDetails,
        browser: "Playwright Chromium, real nested static mount", widths: [1440, 1024, 768, 390, 320],
        requestCount: requests.length, methods: [...new Set(requests.map((request) => request.method))],
        externalRequests: 0, screenshots, storage: "no cookies, localStorage or sessionStorage",
        cleanup: "contexts/browser/static server closed in finally",
      }, null, 2) + "\n");
    }
  } finally {
    await mobileContext?.close();
    await context?.close();
    await browser?.close();
    await service.close();
  }
});
