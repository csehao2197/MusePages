import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";
const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));
test("Terroir & Vine independent wine-bar experience", { timeout: 150000 }, async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [];
  const requests = [];
  await mkdir(path.join(model, ".checks"), { recursive: true });
  async function visit(options = {}, clock = false) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    if (clock) await page.clock.install();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed", (request) => errors.push(`Failed: ${request.url()}`));
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await context.route("**/*", (route) => {
      requests.push({ method: route.request().method(), url: route.request().url() });
      return new URL(route.request().url()).origin === new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    return { page, context };
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => list.forEach((image) => { image.loading = "eager"; }));
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => image.decode())));
  }
  async function closeDetails(page) {
    await page.locator("#info-dialog .close").click();
    await expect(page.locator("#info-content")).toBeEmpty();
  }
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  function future(day) {
    const date = new Date();
    date.setDate(date.getDate() + 8);
    while (date.getDay() !== day) date.setDate(date.getDate() + 1);
    return localDate(date);
  }
  await t.test("real public subpath, original content and complete local resources match static sources", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(new URL(page.url()).pathname, "/pages/wine-bar/GPT-6/index.html");
      await expect(page).toHaveTitle("Terroir & Vine | Curated Wines. Crafted Experiences.");
      await images(page);
      for (const font of ["Cormorant", "Inter"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      for (const filename of ["icons.svg", "flags.svg"]) {
        const sprite = await readFile(path.join(model, "out", "assets", filename), "utf8");
        for (const id of new Set(await page.locator(`use[href^="assets/${filename}"]`).evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`), id);
      }
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)), []);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
      assert.match(await validateStaticOutput(path.join(model, "out"), "wine-bar", "GPT-6"), /^[a-f0-9]{64}$/);
      await expect(page.locator("#about")).toContainText("family-owned vineyards across France, Italy, and Spain");
      await expect(page.locator("#visit")).toContainText("30% off all wines by the glass");
      await expect(page.locator("footer")).toContainText("Must be 21+ to enter. Please drink responsibly.");
      await expect(page.locator("body")).not.toContainText("018-");
      await expect(page.locator("header")).not.toHaveClass(/scrolled/);
      await page.locator("#wines").scrollIntoViewIfNeeded();
      await expect(page.locator("header")).toHaveClass(/scrolled/);
      assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).transform), "none");
    } finally { await context.close(); }
  });
  await t.test("three wine details, accent-insensitive search, style filters, sorting and 30% pricing are meaningful", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".wine-copy h3")).toHaveText(["2021 Château Margaux", "2022 Penfolds Bin 389", "2023 Cloudy BaySauvignon Blanc"]);
      await expect(page.locator(".wine-bottom strong")).toHaveText(["$28", "$22", "$18"]);
      for (const index of [0, 1, 2]) {
        await page.locator(`[data-wine="${index}"]`).click();
        await expect(page.locator(".detail-layout img")).toHaveAttribute("alt", /not the actual producer label/);
        await expect(page.locator(".detail-layout")).toContainText("Original concept price");
        await page.keyboard.press("Escape");
        await expect(page.locator(`[data-wine="${index}"]`)).toBeFocused();
      }
      await page.getByRole("button", { name: "View Full Wine List" }).click();
      await expect(page.locator(".wine-results article")).toHaveCount(3);
      await page.locator('#wine-sort').selectOption("low");
      await expect(page.locator(".wine-results strong")).toHaveText(["$18.00", "$22.00", "$28.00"]);
      await page.locator("#happy-preview").check();
      await expect(page.locator(".wine-results strong")).toHaveText(["$12.60", "$15.40", "$19.60"]);
      await page.getByRole("button", { name: "White", exact: true }).click();
      await expect(page.locator(".wine-results h3")).toHaveText("2023 Cloudy Bay Sauvignon Blanc");
      await page.getByRole("button", { name: "Red", exact: true }).click();
      await expect(page.locator(".wine-results article")).toHaveCount(2);
      await page.locator("#wine-search").fill("CHATEAU");
      await expect(page.locator(".wine-results h3")).toHaveText("2021 Château Margaux");
      await page.locator("#wine-search").fill("<img src=x onerror='window.unsafe=1'>");
      await expect(page.locator(".wine-results")).toContainText("No selections match");
      await expect(page.locator(".wine-results img")).toHaveCount(0);
      await page.locator("#wine-search").fill("");
      await page.getByRole("button", { name: "All wines" }).click();
      await page.locator("#wine-sort").selectOption("high");
      await expect(page.locator(".wine-results strong")).toHaveText(["$19.60", "$15.40", "$12.60"]);
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("all supplied events and age-gated integer quantities generate accurate safe local tasting previews", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".event-card h3")).toHaveText(["Old World vs. New World", "Italian Wine Masterclass", "Blind Tasting Challenge"]);
      await expect(page.locator(".event-card .event-meta")).toHaveText([/Sat, April 12 · 7:00 PM.*\$65\/person/, /Fri, April 18 · 6:30 PM.*\$85\/person/, /Sat, April 26 · 7:30 PM.*\$45\/person/]);
      await expect(page.locator(".event-card .event-bottom>p")).toHaveText(["8 spots left*", "12 spots left*", "20 spots left*"]);
      await page.getByRole("button", { name: "View All Events" }).click();
      await expect(page.locator(".event-list article")).toHaveCount(3);
      await page.locator('.event-list [data-event="1"]').click();
      const form = page.locator("#booking-form");
      await expect(form.locator('[name="event"]')).toHaveValue("1");
      await form.locator('[name="name"]').fill('<img src=x onerror="window.unsafe=1">');
      await form.locator('[name="email"]').fill("preview@example.test");
      await form.locator('[name="message"]').fill("<script>window.unsafe=1</script>");
      await form.locator('[name="guests"]').fill("12");
      await expect(page.locator(".form-estimate")).toContainText("$1020.00");
      await form.locator('[name="event"]').selectOption("0");
      assert.equal(await form.locator('[name="guests"]').evaluate((input) => input.checkValidity()), false);
      for (const value of ["0", "9", "2.5"]) {
        await form.locator('[name="guests"]').fill(value);
        await form.getByRole("button", { name: "Preview Tasting" }).click();
        await expect(form).toBeVisible();
        assert.equal(await form.locator('[name="guests"]').evaluate((input) => input.checkValidity()), false);
      }
      await form.locator('[name="event"]').selectOption("2");
      await form.locator('[name="guests"]').fill("20");
      await expect(page.locator(".form-estimate")).toContainText("$900.00");
      await form.getByRole("button", { name: "Preview Tasting" }).click();
      await expect(form).toBeVisible();
      await form.locator('[name="adult"]').check();
      await form.getByRole("button", { name: "Preview Tasting" }).click();
      await expect(page.locator(".preview-result")).toContainText("year unspecified");
      await expect(page.locator(".preview-result")).toContainText("$900.00");
      await expect(page.locator(".preview-result")).toContainText("<script>window.unsafe=1</script>");
      await expect(page.locator("#info-content input")).toHaveCount(0);
      await expect(page.locator("#info-content img,#info-content script")).toHaveCount(0);
      assert.equal(await page.evaluate(() => window.unsafe), undefined);
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("private enquiry respects 8–24 whole guests, closed Mondays and date minimum without inventing prices", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "Inquire About Events" }).click();
      const form = page.locator("#booking-form");
      await form.locator('[name="name"]').fill("Local Guest");
      await form.locator('[name="email"]').fill("preview@example.test");
      await form.locator('[name="date"]').fill(future(1));
      assert.match(await form.locator('[name="date"]').evaluate((input) => input.validationMessage), /Closed Monday/);
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      await form.locator('[name="date"]').fill(localDate(yesterday));
      assert.equal(await form.locator('[name="date"]').evaluate((input) => input.checkValidity()), false);
      await form.locator('[name="date"]').fill(future(2));
      for (const value of ["7", "25", "8.5"]) {
        await form.locator('[name="guests"]').fill(value);
        assert.equal(await form.locator('[name="guests"]').evaluate((input) => input.checkValidity()), false);
      }
      for (const value of ["8", "24"]) {
        await form.locator('[name="guests"]').fill(value);
        assert.equal(await form.locator('[name="guests"]').evaluate((input) => input.checkValidity()), true);
      }
      await expect(page.locator(".form-estimate")).toContainText("pricing on enquiry");
      await form.locator('[name="occasion"]').selectOption("Corporate event");
      await form.locator('[name="adult"]').check();
      await form.getByRole("button", { name: "Preview Enquiry" }).click();
      await expect(page.locator(".preview-result")).toContainText("24 guests · Corporate event");
      await expect(page.locator(".preview-result")).toContainText("Nothing was submitted");
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("six-photo asymmetric gallery, keyboard loop, complete footer, newsletter and schematic map are honest and operable", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".gallery-grid figure")).toHaveCount(6);
      await page.locator('[data-photo="0"]').hover();
      assert.equal(await page.locator('[data-photo="0"] .gallery-overlay').evaluate((element) => getComputedStyle(element).opacity), "1");
      await page.locator('[data-photo="0"]').click();
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/alcove.jpg");
      await page.getByRole("button", { name: "Next photo" }).click();
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/bar.jpg");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/cheese.jpg");
      await page.keyboard.press("Escape");
      await expect(page.locator('[data-photo="0"]')).toBeFocused();
      for (const button of await page.locator("footer [data-info],footer [data-book],.map-button").all()) {
        await button.click();
        await expect(page.locator("#info-dialog")).toBeVisible();
        assert.ok((await page.locator("#info-content").innerText()).trim().length > 40);
        await closeDetails(page);
      }
      await page.locator("#newsletter-email").fill("preview@example.test");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-status")).toContainText("stores no address");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie]), [0, 0, ""]);
    } finally { await context.close(); }
  });
  await t.test("five-second reviews pause on hover, focus, manual control, dialogs and reduced motion; parallax is motion-aware", async () => {
    const { page, context } = await visit({ reducedMotion: "no-preference" }, true);
    try {
      await images(page);
      await page.locator("#reviews").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector(".hero-image").style.transform !== "translateY(0px)");
      await page.mouse.move(0, 0);
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("James & Linda K.");
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("David R. · Yelp");
      await page.locator(".review-view").hover();
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("David R. · Yelp");
      await page.mouse.move(0, 0);
      await page.locator(".review-view").focus();
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("David R. · Yelp");
      await page.locator("#review-pause").click();
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(0, 0);
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("David R. · Yelp");
      await expect(page.locator("#review-pause")).toHaveAttribute("aria-label", "Resume automatic reviews");
      await page.locator("#review-pause").click();
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(0, 0);
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("Sarah M. · Google Review");
      await page.locator('[data-review="2"]').click();
      await expect(page.locator('[data-review="2"]')).toHaveAttribute("aria-current", "true");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#review-author")).toHaveText("Sarah M. · Google Review");
      await page.keyboard.press("End");
      await expect(page.locator("#review-author")).toHaveText("David R. · Yelp");
      await page.keyboard.press("Home");
      await expect(page.locator("#review-author")).toHaveText("Sarah M. · Google Review");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator("#review-pause")).toBeDisabled();
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(0, 0);
      await page.clock.fastForward(11000);
      await expect(page.locator("#review-author")).toHaveText("Sarah M. · Google Review");
      assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).transform), "none");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.locator(".nav-book").click();
      await page.clock.fastForward(5100);
      await expect(page.locator("#review-author")).toHaveText("Sarah M. · Google Review");
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("five widths, 44px mobile targets, slide-out navigation and actual touch swipes preserve responsive behavior", async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const { page, context } = await visit({ viewport: { width, height: 1000 } });
      try {
        await images(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow ${width}`);
        if (width <= 650) {
          assert.equal(await page.locator(".wine-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 1);
          assert.equal(await page.locator(".gallery-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 2);
          await page.getByRole("button", { name: "Open navigation" }).click();
          await expect(page.locator("#mobile-nav")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.locator(".nav-toggle")).toBeFocused();
          await page.getByRole("button", { name: "Open navigation" }).click();
          await page.locator("#mobile-nav").getByRole("link", { name: "Wines", exact: true }).click();
          await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
          const tiny = await page.locator("button:visible,a:visible").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().height < 43.9 || element.getBoundingClientRect().width < 43.9).map((element) => element.textContent.trim() || element.getAttribute("aria-label")));
          assert.deepEqual(tiny, [], `Small touch targets ${width}`);
        }
        if (width === 1440 || width === 390) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
        }
      } finally { await context.close(); }
    }
    const { page, context } = await visit({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
    try {
      const cdp = await context.newCDPSession(page);
      async function swipe(selector) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        const box = await page.locator(selector).boundingBox();
        const y = Math.max(100, Math.min(780, box.y + 100));
        const x = box.x + 295;
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
        for (let step = 1; step <= 8; step++) {
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * 25, y }] });
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      }
      await swipe(".event-grid");
      await page.waitForFunction(() => document.querySelector(".event-grid").scrollLeft > 30);
      await swipe(".review-view");
      await expect(page.locator("#review-author")).toHaveText("James & Linda K.");
      await cdp.detach();
    } finally { await context.close(); }
  });
  assert.deepEqual(errors, []);
  assert.equal(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin), true);
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest: await validateStaticOutput(path.join(model, "out"), "wine-bar", "GPT-6"), browser: browser.version(), widths: [1440, 1024, 768, 390, 320], errors,
    checks: ["Actual public subpath, local fonts, photos, sprites and source agreement", "Three wine details, accent-insensitive search, style filter and price sorting", "30% sample happy-hour pricing: 19.60, 15.40 and 12.60", "All original event dates, prices and non-live example availability", "Age-gated integer tasting quantities and private 8–24 guests with weekday/date checks", "Safe local previews, contact cleanup, all footer and newsletter actions", "Six-photo asymmetric gallery, cyclic keyboard lightbox and focus restoration", "Five-second review rotation, hover/focus/manual/modal/reduced-motion pauses", "Five widths, 44px mobile targets, actual event/review touch swipes", "Actual desktop/mobile full-page screenshots; no external calls or storage"],
  }, null, 2) + "\n");
});
