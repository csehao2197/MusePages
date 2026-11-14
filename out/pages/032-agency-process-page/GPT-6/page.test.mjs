import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";

const folder = path.dirname(fileURLToPath(import.meta.url));
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
test("Frameshift static homepage browser verification", { timeout: 180000 }, async t => {
  await mkdir(checks, { recursive: true });
  let browser, service, context;
  const failures = [], requests = [], executed = [];
  try {
    service = await startPreviewServer(exported);
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", acceptDownloads: true });
    context.on("request", request => { requests.push({ method: request.method(), url: request.url() }); });
    const page = await context.newPage();
    page.on("pageerror", error => failures.push(error.message));
    page.on("requestfailed", request => failures.push(`requestfailed ${request.url()}`));
    page.on("response", response => { if (response.status() >= 400) failures.push(`HTTP ${response.status()} ${response.url()}`); });
    await page.goto(service.url, { waitUntil: "networkidle" });
    const check = async (name, fn) => {
      let passed = false;
      await t.test(name, async () => { await fn(); passed = true; });
      assert.equal(passed, true, `Subtest failed: ${name}`);
      executed.push(name);
    };
    await check("static export equality, nested mount, local fonts/images and PDF", async () => {
      for (const name of ["index.html", "style.css", "app.js"]) assert.deepEqual(await readFile(path.join(folder, name)), await readFile(path.join(exported, name)));
      for (const name of await readdir(path.join(folder, "assets"))) assert.deepEqual(await readFile(path.join(folder, "assets", name)), await readFile(path.join(exported, "assets", name)));
      assert.match(new URL(page.url()).pathname, /^\/pages\/agency-process-page\/GPT-6\/index.html$/);
      assert.equal(await page.title(), "Our Process — Frameshift");
      assert.equal(await page.locator("h1").count(), 1);
      assert.match((await page.locator("h1").innerText()).replace(/\s+/g, " "), /From idea to launch in 12 weeks/);
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
      assert.equal(await page.evaluate(() => document.fonts.check('700 16px Jakarta') && document.fonts.check('400 16px Inter')), true);
      const [download] = await Promise.all([page.waitForEvent("download"), page.getByText("Download Process PDF", { exact: true }).click()]);
      assert.equal(download.suggestedFilename(), "frameshift-process.pdf");
      assert.match((await readFile(await download.path())).toString(), /^%PDF-1.4/);
    });
    await check("phase navigation updates active step and each deliverable section exists", async () => {
      for (const id of ["discover", "design", "develop", "deliver"]) {
        await page.locator(`.phase-link[href="#${id}"]`).click();
        await page.waitForFunction(target => document.querySelector(`.phase-link[href="#${target}"]`).getAttribute("aria-current") === "step", id);
        assert.equal(await page.locator(`#${id} .deliverables li`).count(), 5);
      }
    });
    await check("FAQ accordion supports keyboard and single expanded answer", async () => {
      const summaries = page.locator(".faq-list summary");
      await summaries.nth(0).focus(); await page.keyboard.press("Enter");
      assert.equal(await page.locator(".faq-list details[open]").count(), 1);
      await summaries.nth(1).focus(); await page.keyboard.press("Space");
      await page.waitForTimeout(80);
      assert.equal(await page.locator(".faq-list details[open]").count(), 1);
      assert.equal(await page.locator(".faq-list details").nth(1).getAttribute("open"), "");
      assert.match(await page.locator(".faq-list details[open] p").innerText(), /standalone/);
    });
    await check("calendar month bounds, unavailable dates, changing selections and local preview", async () => {
      await page.locator("#contact").scrollIntoViewIfNeeded();
      assert.equal(await page.locator("#prev-month").isDisabled(), true);
      assert.equal(await page.locator("#confirm-call").isDisabled(), true);
      const firstLabel = await page.locator("#month-label").innerText();
      await page.locator("#next-month").click(); assert.notEqual(await page.locator("#month-label").innerText(), firstLabel);
      assert.equal(await page.locator("#prev-month").isDisabled(), false);
      const disabled = await page.locator(".day:disabled").evaluateAll(nodes => nodes.map(node => node.dataset.date));
      assert.ok(disabled.length >= 8);
      assert.ok(disabled.every(date => [0,6].includes(new Date(`${date}T00:00:00Z`).getUTCDay())));
      const dates = page.locator(".day:not(:disabled)");
      await dates.nth(0).click(); assert.equal(await page.locator(".slot").count(), 3);
      await page.locator(".slot").nth(1).click(); await page.locator("#confirm-call").click();
      assert.match(await page.locator("#booking-status").innerText(), /11:00 UTC.*Nothing has been booked or sent/);
      await dates.nth(1).click(); assert.equal(await page.locator("#confirm-call").isDisabled(), true);
      assert.equal(await page.locator(".slot[aria-pressed=true]").count(), 0);
      assert.doesNotMatch(await page.locator("#booking-status").innerText(), /Demo call preview/);
      for (let i = 0; i < 10; i++) await page.locator("#next-month").click();
      assert.equal(await page.locator("#next-month").isDisabled(), true);
      for (let i = 0; i < 11; i++) await page.locator("#prev-month").click();
      assert.equal(await page.locator("#month-label").innerText(), firstLabel);
      assert.equal(await page.locator("#prev-month").isDisabled(), true);
    });
    await check("newsletter rejects whitespace and unsafe text, trims valid email and clears it", async () => {
      const email = page.locator("#email"), submit = page.getByRole("button", { name: "Subscribe", exact: true });
      for (const value of ["   ", "not-an-email", "<img src=x onerror=alert(1)>@example.com"]) {
        await email.fill(value); await submit.click();
        assert.equal(await email.getAttribute("aria-invalid"), "true");
        assert.match(await page.locator("#email-status").innerText(), /valid email/);
        assert.equal(await page.locator("#email-status img").count(), 0);
      }
      await email.fill("  person@example.com  "); await submit.click();
      assert.match(await page.locator("#email-status").innerText(), /Email cleared; no subscription/);
      assert.equal(await email.inputValue(), "");
      assert.equal(await email.getAttribute("aria-invalid"), null);
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    });
    await check("local information dialogs and keyboard focus restoration", async () => {
      const trigger = page.getByRole("button", { name: "Privacy", exact: true });
      await trigger.click(); assert.equal(await page.locator("#info-dialog").isVisible(), true);
      assert.match(await page.locator("#info-body").innerText(), /No information is submitted, stored/);
      await page.keyboard.press("Escape"); assert.equal(await page.locator("#info-dialog").isVisible(), false);
      assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
      for (const key of ["blog", "mobile", "industries", "about", "careers", "social", "terms"]) {
        await page.locator(`[data-info="${key}"]`).last().click();
        assert.ok((await page.locator("#info-body").innerText()).length > 40);
        await page.locator("#info-done").click();
      }
    });
    await check("five viewport widths have no overflow and mobile targets are at least 44px", async () => {
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => scrollTo(0, 0));
        await page.evaluate(async () => { await document.fonts.ready; });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
        const bad = await page.evaluate(() => [...document.querySelectorAll("body *")].filter(node => {
          const box = node.getBoundingClientRect(); const style = getComputedStyle(node);
          return box.width && style.position !== "fixed" && style.display !== "none" && (box.right > innerWidth + 1 || box.left < -1) && !node.closest("dialog");
        }).map(node => `${node.tagName}.${node.className}`));
        assert.deepEqual(bad, [], `offscreen elements at ${width}`);
        if (width <= 390) {
          const small = await page.evaluate(() => [...document.querySelectorAll("a,button,input,summary")].filter(node => {
            const box = node.getBoundingClientRect(); return box.width > 0 && box.height > 0 && !node.closest("dialog") && !node.classList.contains("skip") && (box.width < 43.9 || box.height < 43.9);
          }).map(node => `${node.tagName} ${node.getAttribute("aria-label") || node.textContent.trim()} ${node.getBoundingClientRect().width}x${node.getBoundingClientRect().height}`));
          assert.deepEqual(small, [], `small mobile targets at ${width}`);
        }
      }
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(service.url, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(checks, "desktop-1440-firstfold.png"), animations: "disabled" });
      await page.screenshot({ path: path.join(checks, "desktop-1440.png"), fullPage: true, animations: "disabled" });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(service.url, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(checks, "mobile-390-firstfold.png"), animations: "disabled" });
      await page.screenshot({ path: path.join(checks, "mobile-390.png"), fullPage: true, animations: "disabled" });
      await page.setViewportSize({ width: 320, height: 900 });
      await page.locator("#scheduler").scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(checks, "mobile-320-calendar.png"), animations: "disabled" });
    });
    await check("mobile touch menu, modal focus containment, Escape and navigation", async () => {
      const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
      mobile.on("request", request => requests.push({ method: request.method(), url: request.url() }));
      try {
        const tab = await mobile.newPage();
        tab.on("pageerror", error => failures.push(error.message));
        tab.on("requestfailed", request => failures.push(`requestfailed ${request.url()}`));
        tab.on("response", response => { if (response.status() >= 400) failures.push(`HTTP ${response.status()} ${response.url()}`); });
        await tab.goto(service.url, { waitUntil: "networkidle" });
        await tab.locator(".menu-toggle").tap();
        assert.equal(await tab.locator("#mobile-menu").isVisible(), true);
        for (let i = 0; i < 13; i++) {
          await tab.keyboard.press("Tab");
          assert.equal(await tab.evaluate(() => document.activeElement.closest("#mobile-menu") !== null), true);
        }
        await tab.keyboard.press("Escape");
        assert.equal(await tab.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
        await tab.locator(".menu-toggle").tap();
        await tab.locator('#mobile-menu a[href="#process"]').tap();
        assert.equal(await tab.locator("#mobile-menu").isVisible(), false);
        assert.equal(new URL(tab.url()).hash, "#process");
        await tab.locator(".mobile-book").tap();
        assert.equal(new URL(tab.url()).hash, "#contact");
        await tab.locator(".day:not(:disabled)").first().tap();
        await tab.locator(".slot").first().tap();
        await tab.locator("#confirm-call").tap();
        assert.match(await tab.locator("#booking-status").innerText(), /Nothing has been booked/);
      } finally { await mobile.close(); }
    });
    await check("counter animation settles with motion enabled", async () => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(service.url, { waitUntil: "networkidle" });
      await page.locator(".stats").scrollIntoViewIfNeeded(); await page.waitForTimeout(1400);
      assert.deepEqual(await page.locator(".stats strong").allTextContents(), ["80+", "12 weeks", "4.9/5", "92%"]);
    });
    await check("zero browser failures, external calls, submissions or storage", async () => {
      assert.deepEqual(failures, []);
      assert.ok(requests.length > 10);
      assert.ok(requests.every(request => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin));
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.equal(await page.locator('a[href^="http"]').count(), 0);
    });
    if (failures.length) throw Error(failures.join("\n"));
    const digest = await validateStaticOutput(exported, "agency-process-page", "GPT-6");
    await writeFile(path.join(checks, "validation.json"), JSON.stringify({ checkedAt: new Date().toISOString(), digest, errors: [], tests: executed, requestCount: requests.length, network: "GET loopback only; no external calls or submissions", viewports: [1440, 1024, 768, 390, 320], browser: "Chromium", screenshots: ["desktop-1440.png", "mobile-390.png"], cleanup: "browser/context/server closed in finally" }, null, 2));
  } finally { try { await context?.close(); } finally { try { await browser?.close(); } finally { await service?.close(); } } }
});
