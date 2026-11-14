import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";

const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));

test("Ember & Bloom static homepage", async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  const contexts = [];
  async function visit(options = {}, blockStorage = false) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    contexts.push(context);
    if (blockStorage) await context.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
    });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => failed.push(request.url()));
    page.on("response", (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
    await context.route("**/*", (route) => {
      requests.push({ url: route.request().url(), method: route.request().method() });
      return new URL(route.request().url()).origin === new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    return { page, context, errors, failed, requests };
  }
  try {
    await t.test("local assets, section links and an actual downloadable menu work at the public subpath", async () => {
      const { page, errors, failed, requests } = await visit();
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model, "out"), "artisan-coffee-shop", "GPT-6"), /^[a-f0-9]{64}$/);
      await expect(page).toHaveTitle(/Ember & Bloom/);
      assert.equal(await page.locator(".drink-card").count(), 4);
      assert.equal(await page.locator(".menu-card dl > div").count(), 18);
      assert.equal(await page.locator(".location-card").count(), 4);
      assert.equal(await page.locator(".product-card").count(), 3);
      const missingAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash));
      assert.deepEqual(missingAnchors, []);
      for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 700) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(40);
      }
      assert.deepEqual(await page.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src)), []);
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.getByRole("link", { name: "Download Full Menu (PDF)" }).click(),
      ]);
      assert.equal(download.suggestedFilename(), "ember-bloom-menu.pdf");
      assert.equal(await download.failure(), null);
      const pdf = await page.request.get(new URL("assets/ember-bloom-menu.pdf", service.url).href);
      assert.equal(pdf.status(), 200);
      assert.equal(pdf.headers()["content-type"], "application/pdf");
      assert.deepEqual(await pdf.body(), await readFile(path.join(model, "assets", "ember-bloom-menu.pdf")));
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      assert.ok(requests.every((request) => request.method === "GET"));
    });

    await t.test("cart totals, quantities, persistence, removal and demo checkout stay consistent", async () => {
      const { page, errors } = await visit();
      await page.locator('[data-add="ethiopia"]').click();
      await page.locator('[data-add="ethiopia"]').click();
      await page.locator('[data-add="colombia"]').click();
      await expect(page.locator(".cart-count")).toHaveText("3");
      await page.locator("[data-open-cart]").click();
      await expect(page.locator("#cart-total")).toHaveText("$55.00");
      await page.getByRole("button", { name: "Decrease Ethiopia Yirgacheffe quantity" }).click();
      await expect(page.locator("#cart-total")).toHaveText("$36.00");
      await page.reload({ waitUntil: "networkidle" });
      await expect(page.locator(".cart-count")).toHaveText("2");
      await page.locator("[data-open-cart]").click();
      await page.getByRole("button", { name: "Increase Colombia Huila quantity" }).click();
      await expect(page.locator("#cart-total")).toHaveText("$53.00");
      await page.locator("#demo-checkout").click();
      await expect(page.locator("#cart-message")).toContainText("no payment");
      await page.locator(".cart-item").filter({ hasText: "Ethiopia Yirgacheffe" }).getByRole("button", { name: "Remove", exact: true }).click();
      await expect(page.locator("#cart-total")).toHaveText("$34.00");
      await page.getByRole("button", { name: "Remove", exact: true }).click();
      await expect(page.locator(".cart-empty")).toBeVisible();
      await expect(page.locator(".cart-count")).toHaveText("0");
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-open-cart]")).toBeFocused();
      await page.evaluate(() => localStorage.setItem("ember-bloom-coffee-bag-v1", '{"unknown":20,"ethiopia":-2,"colombia":1.5,"ember":null}'));
      await page.reload({ waitUntil: "networkidle" });
      await expect(page.locator(".cart-count")).toHaveText("0");
      assert.deepEqual(errors, []);
    });

    await t.test("orders validate inputs, recalculate totals and truthfully confirm a local demo", async () => {
      const { page, errors, requests } = await visit();
      await page.getByRole("button", { name: "Order Matcha Rose Latte" }).click();
      await expect(page.locator("#pickup-drink")).toHaveValue("matcha");
      await page.locator("#pickup-quantity").fill("3");
      await page.locator("#pickup-location").selectOption("Alberta Arts");
      await expect(page.locator("#pickup-total")).toHaveText("$21.00");
      await page.locator("#pickup-name").fill("   ");
      await page.getByRole("button", { name: "Preview Pickup Order" }).click();
      await expect(page.locator("#pickup-result")).toBeHidden();
      await page.locator("#pickup-name").fill("Alex");
      await page.locator("#pickup-quantity").fill("11");
      await page.getByRole("button", { name: "Preview Pickup Order" }).click();
      await expect(page.locator("#pickup-result")).toBeHidden();
      await page.locator("#pickup-quantity").fill("3");
      await page.getByRole("button", { name: "Preview Pickup Order" }).click();
      await expect(page.locator("#pickup-confirmation")).toContainText("3 x Matcha Rose Latte at Alberta Arts, totaling $21.00");
      await expect(page.locator("#pickup-confirmation")).toContainText("Nothing has been sent");
      await page.getByRole("button", { name: "Back to Browsing" }).click();
      assert.ok(requests.every((request) => request.method === "GET"));
      assert.deepEqual(errors, []);
    });

    await t.test("email forms and supporting links give real, non-submitting feedback", async () => {
      const { page, errors, requests } = await visit();
      await page.locator("#newsletter-email").fill("not-an-email");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-message")).toBeEmpty();
      await page.locator("#newsletter-email").fill("reader@example.com");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-message")).toContainText("FIRSTBREW10");
      await page.locator("#join-rewards").click();
      await page.locator("#rewards-email").fill("reader@example.com");
      await page.getByRole("button", { name: "Join the Demo" }).click();
      await expect(page.locator("#rewards-message")).toContainText("No account was created");
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Visit Our Roastery" }).click();
      await expect(page.locator("#info-body")).toContainText("Saturdays at 10am");
      await page.locator("#info-link").click();
      await expect(page.locator("#info-dialog")).not.toBeVisible();
      await page.getByRole("button", { name: "Privacy", exact: true }).click();
      await expect(page.locator("#info-body")).toContainText("not sent, stored");
      assert.ok(requests.every((request) => request.method === "GET" && !request.url.includes("reader%40")));
      assert.deepEqual(errors, []);
    });

    await t.test("mobile navigation, touch swiping, dots, keyboard controls and narrow layouts work", async () => {
      const { page, context, errors, failed } = await visit({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await page.locator("#mobile-toggle").click();
      await expect(page.locator("#mobile-toggle")).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#mobile-nav [data-pickup]")).toBeVisible();
      await page.locator('#mobile-nav a[href="#brewing"], #mobile-nav a[href="#menu"]').first().click();
      await expect(page.locator("#mobile-nav")).not.toBeVisible();
      await expect(page.locator("#mobile-toggle")).toHaveAttribute("aria-expanded", "false");
      const track = page.locator("#drink-track");
      await track.scrollIntoViewIfNeeded();
      await page.locator('[data-slide="3"]').click();
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(700);
      await track.focus();
      await page.keyboard.press("Home");
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBe(0);
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(250);
      await page.keyboard.press("Home");
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBe(0);
      await track.scrollIntoViewIfNeeded();
      const box = await track.boundingBox();
      const cdp = await context.newCDPSession(page);
      const y = Math.round(box.y + Math.min(box.height / 2, 160));
      for (let index = 0; index <= 8; index++) {
        await cdp.send("Input.dispatchTouchEvent", { type: index === 0 ? "touchStart" : "touchMove", touchPoints: [{ x: Math.round(box.x + 260 - index * 25), y }] });
        await page.waitForTimeout(25);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
      await cdp.detach();
      for (const width of [320, 390, 768, 1200, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal page overflow at ${width}px`);
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
    });

    await t.test("the cart remains usable when browser storage is unavailable", async () => {
      const { page, errors } = await visit({}, true);
      await page.locator('[data-add="ember"]').click();
      await page.locator("[data-open-cart]").click();
      await expect(page.locator("#cart-total")).toHaveText("$15.00");
      await page.getByRole("button", { name: "Remove", exact: true }).click();
      await expect(page.locator(".cart-empty")).toBeVisible();
      assert.deepEqual(errors, []);
    });
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    await browser.close();
    await service.close();
  }
});
