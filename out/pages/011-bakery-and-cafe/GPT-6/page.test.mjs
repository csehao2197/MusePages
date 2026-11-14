import test from "node:test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";

const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));

test("Golden Crumb static homepage", async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const failures = [];
  const methods = [];
  t.after(async () => { await browser.close(); await service.close(); });
  async function visit(options = {}, storage = null, clock = false) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    if (storage === "blocked") {
      await context.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw Error("Storage blocked"); } }));
    } else if (storage === "untrusted") {
      await context.addInitScript(() => localStorage.setItem("golden-crumb-cart-v1", JSON.stringify([
        { id: "sourdough", quantity: 999 }, { id: "sourdough", quantity: 1 },
        { id: "<img onerror=alert(1)>", quantity: 1 }, { id: "almond-croissant", quantity: -2 },
      ])));
    }
    const page = await context.newPage();
    if (clock) await page.clock.install();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => failures.push(request.url()));
    page.on("response", (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await context.route("**/*", (route) => {
      methods.push(route.request().method());
      return new URL(route.request().url()).origin === new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    return { page, context };
  }
  const bag = (page) => page.locator(".bag-button").click();
  const closeBag = (page) => page.getByRole("button", { name: "Close shopping bag", exact: true }).click();
  async function dates(page) {
    return page.evaluate(() => {
      const next = (weekday) => {
        const value = new Date();
        value.setDate(value.getDate() + ((weekday - value.getDay() + 6) % 7) + 1);
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
      };
      return { monday: next(1), tuesday: next(2), sunday: next(0) };
    });
  }
  await t.test("all local assets, anchors, categories and the full menu work at the public subpath", async () => {
    const { page, context } = await visit();
    try {
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model, "out"), "bakery-and-cafe", "GPT-6"), /^[a-f0-9]{64}$/);
      assert.match(new URL(page.url()).pathname, /^\/pages\/bakery-and-cafe\/GPT-6\/index\.html$/);
      await expect(page).toHaveTitle("Golden Crumb | Artisan Bakery & Cafe");
      assert.equal(await page.locator(".special-card").count(), 3);
      for (const [name, count] of [["Breads", 6], ["Pastries", 6], ["Breakfast", 4], ["Lunch", 4], ["Coffee & Drinks", 6]]) {
        await page.getByRole("tab", { name, exact: true }).click();
        assert.equal(await page.locator("#menu-items .menu-item").count(), count);
        await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
      }
      await page.getByRole("tab", { name: "Breads", exact: true }).click();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Pastries", exact: true })).toBeFocused();
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Coffee & Drinks", exact: true })).toBeFocused();
      await page.getByRole("button", { name: "View Full Menu", exact: true }).click();
      assert.equal(await page.locator("#full-menu-content .full-menu-row").count(), 26);
      await page.locator('#full-menu-content [data-add="baguette"]').click();
      await page.getByRole("button", { name: "View Your Bag", exact: true }).click();
      await expect(page.locator("#cart-total")).toHaveText("$4.50");
      await closeBag(page);
      const missing = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash));
      assert.deepEqual(missing, []);
      for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(35);
      }
      await expect.poll(() => page.locator("img[src]").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length)).toBe(0);
      assert.equal(await page.evaluate(() => document.fonts.check("16px Dancing")), true);
    } finally { await context.close(); }
  });
  await t.test("bag quantities, cent-exact totals, removal, persistence and limits stay consistent", async () => {
    const { page, context } = await visit();
    try {
      await page.locator('.special-card [data-add="sourdough"]').click();
      await page.locator('.special-card [data-add="almond-croissant"]').click({ clickCount: 2 });
      await page.locator('#menu-items [data-add="baguette"]').click();
      await expect(page.locator(".bag-button [data-cart-count]")).toHaveText("4");
      await bag(page);
      await expect(page.locator("#cart-total")).toHaveText("$24.50");
      await page.getByRole("button", { name: "Increase Sourdough Boule quantity", exact: true }).click();
      await expect(page.locator("#cart-total")).toHaveText("$33.00");
      await page.getByRole("button", { name: "Decrease Sourdough Boule quantity", exact: true }).click();
      await page.locator('[data-remove="almond-croissant"]').click();
      await expect(page.locator("#cart-total")).toHaveText("$13.00");
      await page.reload({ waitUntil: "networkidle" });
      await bag(page);
      await expect(page.locator("#cart-total")).toHaveText("$13.00");
      assert.equal(await page.locator(".cart-line").count(), 2);
      await closeBag(page);
      for (let i = 0; i < 22; i++) await page.locator('#menu-items [data-add="baguette"]').click();
      await bag(page);
      await expect(page.locator("#cart-total")).toHaveText("$98.50");
      await expect(page.getByRole("button", { name: "Increase Baguette quantity", exact: true })).toBeDisabled();
      await page.locator('[data-remove="baguette"]').click();
      await page.getByRole("button", { name: "Decrease Sourdough Boule quantity", exact: true }).click();
      await expect(page.locator("#cart-empty")).toBeVisible();
      await expect(page.locator("#pickup-form")).toBeHidden();
    } finally { await context.close(); }
  });
  await t.test("pickup validates closed days, Sunday offerings and windows, then honestly previews without saving contact data", async () => {
    const { page, context } = await visit();
    try {
      const days = await dates(page);
      await page.locator('.special-card [data-add="sourdough"]').click();
      await bag(page);
      await page.locator("#pickup-name").fill("Test Guest");
      await page.locator("#pickup-email").fill("guest@example.test");
      await page.locator("#pickup-date").fill("2000-01-01");
      await page.locator("#pickup-date").dispatchEvent("change");
      assert.equal(await page.locator("#pickup-date").evaluate((input) => input.validity.rangeUnderflow), true);
      await page.locator("#pickup-date").fill(days.monday);
      await page.locator("#pickup-date").dispatchEvent("change");
      await expect(page.locator("#pickup-note")).toContainText("Closed on Mondays");
      assert.equal(await page.locator("#pickup-date").evaluate((input) => input.validity.customError), true);
      await page.locator("#pickup-date").fill(days.sunday);
      await page.locator("#pickup-date").dispatchEvent("change");
      await expect(page.locator("#pickup-note")).toContainText("bread or meals");
      assert.equal(await page.locator("#pickup-date").evaluate((input) => input.validity.customError), true);
      await page.locator("#pickup-date").fill(days.tuesday);
      await page.locator("#pickup-date").dispatchEvent("change");
      await page.locator("#pickup-time").selectOption("09:30");
      await page.getByRole("button", { name: "Preview Pickup Order", exact: true }).click();
      await expect(page.locator("#pickup-success")).toContainText("$8.50");
      await expect(page.locator("#pickup-success")).toContainText("No order was sent, payment taken or pickup reserved");
      assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("golden-crumb-cart-v1"))), []);
      assert.equal(await page.evaluate(() => JSON.stringify(localStorage).includes("guest@example.test")), false);
      await closeBag(page);
      await page.locator('.special-card [data-add="almond-croissant"]').click();
      await bag(page);
      await page.locator("#pickup-name").fill("Test Guest");
      await page.locator("#pickup-email").fill("guest@example.test");
      await page.locator("#pickup-date").fill(days.sunday);
      await page.locator("#pickup-date").dispatchEvent("change");
      assert.equal(await page.locator("#pickup-date").evaluate((input) => input.validity.valid), true);
      assert.equal(await page.locator('#pickup-time option[value="14:00"]').count(), 0);
      await page.locator("#pickup-time").selectOption("13:30");
      await page.getByRole("button", { name: "Preview Pickup Order", exact: true }).click();
      await expect(page.locator("#pickup-success")).toContainText("$5.75");
    } finally { await context.close(); }
  });
  await t.test("catering, gift subscriptions, email, story, social previews and map controls provide working local feedback", async () => {
    const { page, context } = await visit();
    try {
      const days = await dates(page);
      await page.getByRole("button", { name: "Request a Catering Quote", exact: true }).click();
      await page.locator("#catering-name").fill("Test Guest");
      await page.locator("#catering-email").fill("guest@example.test");
      await page.locator("#catering-date").fill(days.tuesday);
      await page.locator("#catering-guests").fill("9");
      assert.equal(await page.locator("#catering-guests").evaluate((input) => input.validity.rangeUnderflow), true);
      await page.locator("#catering-guests").fill("201");
      assert.equal(await page.locator("#catering-guests").evaluate((input) => input.validity.rangeOverflow), true);
      await page.locator("#catering-guests").fill("40");
      await page.locator("#catering-type").selectOption({ label: "Office breakfast" });
      await page.getByRole("button", { name: "Preview My Request", exact: true }).click();
      await expect(page.locator("#catering-form .form-note")).toContainText("40 guests");
      await expect(page.locator("#catering-form .form-note")).toContainText("No quote request was sent");
      await expect(page.locator("#catering-email")).toHaveValue("");
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Subscribe Now", exact: true }).click();
      await page.locator("#subscription-plan").selectOption("gift");
      await page.locator("#subscription-name").fill("Test Guest");
      await page.locator("#subscription-email").fill("guest@example.test");
      assert.equal(await page.locator('#subscription-form [name="local"]').evaluate((input) => input.validity.valueMissing), true);
      await page.locator('#subscription-form [name="local"]').check();
      await page.getByRole("button", { name: "Preview My Bread Box", exact: true }).click();
      await expect(page.locator("#subscription-form .form-note")).toContainText("$128 total");
      await expect(page.locator("#subscription-form .form-note")).toContainText("No subscription was created");
      await page.keyboard.press("Escape");
      await page.locator("#newsletter-email").fill("not-an-email");
      assert.equal(await page.locator("#newsletter-email").evaluate((input) => input.validity.typeMismatch), true);
      await page.locator("#newsletter-email").fill("guest@example.test");
      await page.getByRole("button", { name: "Join", exact: true }).click();
      await expect(page.locator("#newsletter-form .form-note")).toContainText("CRUMB10");
      await expect(page.locator("#newsletter-form .form-note")).toContainText("No email was sent");
      await page.getByRole("button", { name: "Read Our Full Story", exact: true }).click();
      await expect(page.locator("#info-content")).toContainText("fictional bakery story");
      await page.keyboard.press("Escape");
      await page.locator(".footer-main").getByRole("button", { name: "Instagram", exact: true }).click();
      await expect(page.locator("#info-content")).toContainText("No live social account is connected");
      await page.keyboard.press("Escape");
      for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Zoom map in", exact: true }).click();
      await expect(page.getByRole("button", { name: "Zoom map in", exact: true })).toBeDisabled();
      assert.equal(await page.locator("#neighborhood-map").evaluate((image) => image.style.transform), "scale(2)");
      for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Zoom map out", exact: true }).click();
      await expect(page.getByRole("button", { name: "Zoom map out", exact: true })).toBeDisabled();
      assert.equal(await page.evaluate(() => JSON.stringify(localStorage).includes("guest@example.test")), false);
    } finally { await context.close(); }
  });
  await t.test("responsive layouts, mobile navigation, gallery focus and actual touch review swipes work", async () => {
    await mkdir(path.join(model, ".checks"), { recursive: true });
    for (const width of [320, 390, 768, 1200, 1440]) {
      const { page, context } = await visit({ viewport: { width, height: 900 }, isMobile: width < 651, hasTouch: width < 651 });
      try {
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px initial overflow`);
        await page.getByRole("tab", { name: "Coffee & Drinks", exact: true }).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px menu overflow`);
        if (width === 390) {
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await expect(page.locator("#nav-dialog")).toBeVisible();
          await page.locator("#nav-dialog").getByRole("link", { name: "Catering", exact: true }).click();
          await expect(page.locator("#nav-dialog")).toBeHidden();
          await expect(page.locator("#site-header")).toHaveClass(/is-scrolled/);
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await page.keyboard.press("Escape");
          await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
          await page.locator('[data-photo="1"]').click();
          await expect(page.locator("#lightbox")).toBeVisible();
          await page.keyboard.press("ArrowRight");
          await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/barista.jpg");
          await page.keyboard.press("Escape");
          await expect(page.locator('[data-photo="1"]')).toBeFocused();
          await page.locator("#review-carousel").scrollIntoViewIfNeeded();
          const box = await page.locator("#review-carousel").boundingBox();
          const session = await context.newCDPSession(page);
          const y = box.y + 100;
          await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width * .8, y }] });
          for (let i = 1; i <= 5; i++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * (.8 - i * .12), y }] });
          await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await expect(page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
          await page.locator("#review-carousel").focus();
          await page.keyboard.press("End");
          await expect(page.locator('[data-review-dot="3"]')).toHaveAttribute("aria-current", "true");
          await page.keyboard.press("ArrowRight");
          await expect(page.locator('[data-review-dot="0"]')).toHaveAttribute("aria-current", "true");
          await page.locator(".mobile-order button").click();
          await expect(page.locator("#cart-dialog")).toBeVisible();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "mobile bag overflow");
          await closeBag(page);
        }
        for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 700) {
          await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
          await page.waitForTimeout(25);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px full-page overflow`);
        if (width === 390 || width === 1440) {
          await page.getByRole("tab", { name: "Breads", exact: true }).click();
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
          await page.screenshot({ path: path.join(model, ".checks", width === 390 ? "mobile.png" : "desktop.png"), fullPage: true });
          await page.screenshot({ path: path.join(model, ".checks", width === 390 ? "mobile-top.png" : "desktop-top.png") });
        }
      } finally { await context.close(); }
    }
  });
  await t.test("reviews auto-advance every five seconds, pause on hover/focus and honor explicit pause and reduced motion", async () => {
    const { page, context } = await visit({ reducedMotion: "no-preference" }, null, true);
    try {
      await page.locator("#review-carousel").scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      await page.clock.runFor(5000);
      await expect(page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
      await page.locator("#review-carousel").hover();
      await page.clock.runFor(10000);
      await expect(page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
      await page.mouse.move(1, 1);
      await page.locator('[data-review-dot="1"]').focus();
      await page.clock.runFor(5000);
      await expect(page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
      await page.locator("#review-pause").click();
      await expect(page.locator("#review-pause")).toHaveText("Play reviews");
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(1, 1);
      await page.clock.runFor(10000);
      await expect(page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
      await page.locator("#review-pause").click();
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(1, 1);
      await page.clock.runFor(5000);
      await expect(page.locator('[data-review-dot="2"]')).toHaveAttribute("aria-current", "true");
    } finally { await context.close(); }
    const reduced = await visit({}, null, true);
    try {
      await expect(reduced.page.locator("#review-pause")).toHaveText("Play reviews");
      await reduced.page.clock.runFor(15000);
      await expect(reduced.page.locator('[data-review-dot="0"]')).toHaveAttribute("aria-current", "true");
      await reduced.page.locator("#review-pause").click();
      await reduced.page.evaluate(() => document.activeElement.blur());
      await reduced.page.mouse.move(1, 1);
      await reduced.page.clock.runFor(5000);
      await expect(reduced.page.locator('[data-review-dot="1"]')).toHaveAttribute("aria-current", "true");
    } finally { await reduced.context.close(); }
  });
  await t.test("unavailable storage and untrusted saved quantities cannot break the bag or inject markup", async () => {
    const blocked = await visit({}, "blocked");
    try {
      await blocked.page.locator('.special-card [data-add="sourdough"]').click();
      await bag(blocked.page);
      await expect(blocked.page.locator("#cart-total")).toHaveText("$8.50");
      await expect(blocked.page.locator("#cart-storage-note")).toContainText("storage is unavailable");
      await blocked.page.getByRole("button", { name: "Increase Sourdough Boule quantity", exact: true }).click();
      await expect(blocked.page.locator("#cart-total")).toHaveText("$17.00");
    } finally { await blocked.context.close(); }
    const untrusted = await visit({}, "untrusted");
    try {
      await bag(untrusted.page);
      await expect(untrusted.page.locator("#cart-total")).toHaveText("$170.00");
      assert.equal(await untrusted.page.locator(".cart-line").count(), 1);
      await expect(untrusted.page.getByRole("button", { name: "Increase Sourdough Boule quantity", exact: true })).toBeDisabled();
      assert.equal(await untrusted.page.locator("[onerror]").count(), 0);
    } finally { await untrusted.context.close(); }
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  assert.ok(methods.every((method) => method === "GET"));
});
