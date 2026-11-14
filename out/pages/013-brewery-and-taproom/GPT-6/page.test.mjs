import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-pages.mjs";
const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));

test("Iron Ridge static brewery homepage", async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [];
  const requests = [];
  await mkdir(path.join(model, ".checks"), { recursive: true });
  async function visit(options = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    const page = await context.newPage();
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
  const tour = (page, name) => page.locator(`#tour-form [name="${name}"]`);
  function nextDay(weekday) {
    const date = new Date();
    date.setDate(date.getDate() + ((weekday - date.getDay() + 6) % 7) + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  async function loadImages(page) {
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(20);
    }
    await page.locator("img[src]").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  }
  await t.test("all public resources, PDF, fonts, SVG references and anchors work at the actual subpath", async () => {
    const { page, context } = await visit();
    try {
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model, "out"), "brewery-and-taproom", "GPT-6"), /^[a-f0-9]{64}$/);
      assert.match(new URL(page.url()).pathname, /^\/pages\/brewery-and-taproom\/GPT-6\/index\.html$/);
      await expect(page).toHaveTitle("Iron Ridge Brewing Co. | Asheville Taproom");
      await loadImages(page);
      for (const name of ["Inter", "Oswald"]) assert.equal(await page.evaluate((font) => document.fonts.check(`16px ${font}`), name), true);
      const missing = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash));
      assert.deepEqual(missing, []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      const symbols = await page.locator("use").evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1]));
      for (const id of new Set(symbols)) assert.ok(sprite.includes(`id="${id}"`), `Missing icon ${id}`);
      const response = await page.request.get(new URL("assets/beer-menu.pdf", service.url).href);
      assert.equal(response.status(), 200);
      const pdf = await response.body();
      assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
      assert.ok(pdf.length > 20000);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
    } finally { await context.close(); }
  });
  await t.test("twelve beers keep all styles, stats and tasting notes and filter independently", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(await page.locator(".tap-card").count(), 12);
      for (const [family, count] of [["hoppy", 3], ["light", 3], ["malty", 4], ["wild", 2], ["all", 12]]) {
        await page.locator(`[data-family="${family}"]`).click();
        assert.equal(await page.locator(".tap-card:visible").count(), count);
      }
      const summit = page.locator(".tap-card", { hasText: "Summit Haze" });
      await expect(summit).toContainText("6.8");
      await expect(summit).toContainText("55");
      await expect(summit).toContainText("Citra & Mosaic");
      await expect(summit).toContainText("NEW");
      await expect(page.locator(".tap-card", { hasText: "Night Shift" })).toContainText("10.2");
      await expect(page.locator(".tap-card", { hasText: "Night Shift" })).toContainText("BREWERY ONLY");
    } finally { await context.close(); }
  });
  await t.test("tour schedules, date and guest boundaries, contact fields and age confirmation gate honest exact-price previews", async () => {
    const { page, context } = await visit();
    try {
      const trigger = page.getByRole("button", { name: "Book standard", exact: true });
      await trigger.click();
      const valid = (name, reason) => tour(page, name).evaluate((input, key) => input.validity[key], reason);
      await tour(page, "date").fill("2000-01-01");
      assert.equal(await valid("date", "rangeUnderflow"), true);
      await tour(page, "date").fill(nextDay(1));
      assert.equal(await valid("date", "customError"), true);
      await tour(page, "date").fill(nextDay(6));
      assert.equal(await valid("date", "valid"), true);
      for (const [value, reason] of [["0", "rangeUnderflow"], ["13", "rangeOverflow"], ["1.5", "stepMismatch"]]) {
        await tour(page, "guests").fill(value);
        assert.equal(await valid("guests", reason), true);
      }
      await tour(page, "guests").fill("12");
      await expect(page.locator("#tour-total")).toHaveText("$180");
      await tour(page, "type").selectOption("vip");
      assert.equal(await valid("date", "customError"), true);
      assert.equal(await tour(page, "time").locator("option").count(), 1);
      await expect(tour(page, "time")).toHaveValue("17:00");
      await expect(page.locator("#tour-total")).toHaveText("$540");
      await tour(page, "date").fill(nextDay(5));
      await tour(page, "name").fill("  ");
      assert.equal(await valid("name", "customError"), true);
      await tour(page, "name").fill("<b>Test Guest</b>");
      await tour(page, "email").fill("invalid");
      assert.equal(await valid("email", "typeMismatch"), true);
      await tour(page, "email").fill("guest@example.test");
      await tour(page, "phone").fill("wrong");
      assert.equal(await valid("phone", "patternMismatch"), true);
      await tour(page, "phone").fill("+1 (555) 234-5678");
      assert.equal(await valid("phone", "valid"), true);
      assert.equal(await valid("adult", "valueMissing"), true);
      await tour(page, "adult").check();
      await page.getByRole("button", { name: "Preview tour booking", exact: true }).click();
      await expect(page.locator("#tour-result")).toBeFocused();
      await expect(page.locator("#tour-summary")).toContainText("$540");
      await expect(page.locator("#tour-summary")).toContainText("<b>Test Guest</b>");
      assert.equal(await page.locator("#tour-summary b").count(), 0);
      await expect(page.locator("#tour-result")).toContainText("No tour has been booked");
      await expect(tour(page, "email")).toHaveValue("");
      await page.getByRole("button", { name: "Plan another sample tour", exact: true }).click();
      await expect(tour(page, "type")).toBeFocused();
      await expect(tour(page, "type")).toHaveValue("standard");
      await expect(tour(page, "guests")).toHaveValue("1");
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("map/list selections, ZIP groups, no-results recovery and bounded zoom stay synchronized", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator("#location-count")).toHaveText("8 sample locations");
      await page.locator("#zip").fill("abc");
      assert.equal(await page.locator("#zip").evaluate((input) => input.validity.patternMismatch), true);
      await page.locator("#zip").fill("28801");
      await expect(page.locator("#location-count")).toHaveText("7 sample locations");
      assert.equal(await page.locator(".map-pin").count(), 7);
      await page.locator("#zip").fill("28655");
      await expect(page.locator("#location-count")).toHaveText("2 sample locations");
      await page.getByRole("button", { name: "Select Fonta Flora State of Confusion on map", exact: true }).click();
      await expect(page.locator("#map-selected")).toContainText("Fonta Flora");
      await expect(page.locator('.location[data-location="4"]')).toHaveAttribute("aria-pressed", "true");
      await page.locator("#zip").fill("99999");
      await expect(page.locator("#location-count")).toHaveText("0 sample locations");
      await expect(page.locator("#map-selected")).toBeEmpty();
      await expect(page.locator(".no-locations")).toContainText("Try 28801");
      await page.getByRole("button", { name: "Show all", exact: true }).click();
      await page.locator('.location[data-location="5"]').click();
      await expect(page.locator("#map-selected")).toContainText("Burial Beer");
      await expect(page.locator('.map-pin[data-location="5"]')).toHaveAttribute("aria-pressed", "true");
      for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Zoom map in", exact: true }).click();
      await expect(page.getByRole("button", { name: "Zoom map in", exact: true })).toBeDisabled();
      for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Zoom map out", exact: true }).click();
      await expect(page.getByRole("button", { name: "Zoom map out", exact: true })).toBeDisabled();
    } finally { await context.close(); }
  });
  await t.test("event details export a tentative DEMO calendar and shop options produce no real purchases", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "View Trivia Night event", exact: true }).click();
      await expect(page.locator("#info-dialog")).toContainText("fictional event");
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download sample calendar event", exact: true }).click();
      const download = await downloadPromise;
      const calendar = await readFile(await download.path(), "utf8");
      assert.match(calendar, /BEGIN:VCALENDAR/);
      assert.match(calendar, /SUMMARY:DEMO: Trivia Night/);
      assert.match(calendar, /STATUS:TENTATIVE/);
      assert.match(calendar, /DTSTART:\d{8}T\d{6}Z/);
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "See all events", exact: true }).click();
      assert.equal(await page.locator(".all-events button").count(), 4);
      await page.keyboard.press("Escape");
      for (const [id, label, total] of [["pack", "Mixed 12-Pack", "$72"], ["hoodie", "Flagship Hoodie", "$110"], ["flight", "Tasting Flight Board", "$56"], ["gift", "Gift Card", "$200"]]) {
        await page.getByRole("button", { name: `View ${label}`, exact: true }).click();
        await page.locator('#product-form [name="quantity"]').fill("0");
        assert.equal(await page.locator('#product-form [name="quantity"]').evaluate((input) => input.validity.rangeUnderflow), true);
        await page.locator('#product-form [name="quantity"]').fill("11");
        assert.equal(await page.locator('#product-form [name="quantity"]').evaluate((input) => input.validity.rangeOverflow), true);
        await page.locator('#product-form [name="quantity"]').fill("2");
        if (id === "gift") await page.locator("#product-option").selectOption("100");
        if (id === "hoodie") await page.locator("#product-option").selectOption("XL");
        await expect(page.locator("#product-total")).toHaveText(total);
        await page.locator('#product-form [name="adult"]').check();
        await page.getByRole("button", { name: "Preview sample order", exact: true }).click();
        await expect(page.locator("#product-result")).toContainText("no order placed or payment taken");
        await expect(page.locator("#product-result")).toContainText(total);
        await page.keyboard.press("Escape");
      }
      await page.getByRole("button", { name: "Visit full shop", exact: true }).click();
      assert.equal(await page.locator(".catalog-list button").count(), 4);
      await page.locator('[data-catalog-product="hoodie"]').click();
      await expect(page.locator("#product-title")).toHaveText("Flagship Hoodie");
      await page.keyboard.press("Escape");
    } finally { await context.close(); }
  });
  await t.test("food, contact, social, story and policy dialogs work; newsletter and inquiries never transmit or save data", async () => {
    const { page, context } = await visit();
    try {
      for (const [key, text] of [["food", "margherita"], ["parking", "fictional venue"], ["privacy", "no analytics"], ["terms", "imagined brewery"], ["story", "fictional brand"], ["instagram", "no connected Instagram"], ["facebook", "No live Facebook"], ["untappd", "No live Untappd"]]) {
        await page.locator(`[data-info="${key}"]:visible`).first().click();
        await expect(page.locator("#info-content")).toContainText(text);
        await page.keyboard.press("Escape");
      }
      for (const key of ["private", "distribution"]) {
        await page.locator(`[data-info="${key}"]:visible`).first().click();
        for (const [name, value] of [["name", "Test Guest"], ["email", "guest@example.test"], ["subject", "An imagined gathering"], ["message", "Please preview a local inquiry."]]) {
          await page.locator(`.contact-form [name="${name}"]`).fill(value);
        }
        await page.getByRole("button", { name: "Preview inquiry", exact: true }).click();
        await expect(page.locator(".contact-result")).toContainText("No message was sent");
        await expect(page.locator('.contact-form [name="email"]')).toHaveValue("");
        await page.keyboard.press("Escape");
      }
      await page.locator("#newsletter-email").fill("invalid");
      assert.equal(await page.locator("#newsletter-email").evaluate((input) => input.validity.typeMismatch), true);
      await page.locator("#newsletter-email").fill("guest@example.test");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-status")).toContainText("no subscription created");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } finally { await context.close(); }
  });
  await t.test("responsive layouts, mobile navigation, actual touch scrolling and footer accordions remain usable", async () => {
    for (const width of [320, 390, 768, 1200, 1440]) {
      const { page, context } = await visit({ viewport: { width, height: 900 }, isMobile: width <= 650, hasTouch: width <= 650 });
      try {
        await loadImages(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px document overflow`);
        if (width <= 1050) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await expect(page.locator("#navigation")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await page.locator("#navigation").getByRole("link", { name: "Taproom", exact: true }).click();
          await expect(page.locator("#navigation")).toBeHidden();
        }
        if (width === 390) {
          await page.getByRole("button", { name: "Show garden photo", exact: true }).click();
          await expect(page.getByRole("button", { name: "Show garden photo", exact: true })).toHaveAttribute("aria-current", "true");
          await page.locator(".taproom-slides").focus();
          await page.keyboard.press("ArrowRight");
          await expect(page.getByRole("button", { name: "Show flight photo", exact: true })).toHaveAttribute("aria-current", "true");
          await page.getByRole("button", { name: "Show bar photo", exact: true }).click();
          await page.locator(".taproom-slides").scrollIntoViewIfNeeded();
          const box = await page.locator(".taproom-slides").boundingBox();
          const client = await context.newCDPSession(page);
          const startX = box.x + box.width * .85;
          const endX = box.x + box.width * .1;
          const y = box.y + box.height * .5;
          await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y }] });
          for (let step = 1; step <= 8; step++) {
            await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * step / 8, y }] });
            await page.waitForTimeout(20);
          }
          await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await expect.poll(() => page.locator(".taproom-slides").evaluate((element) => element.scrollLeft)).toBeGreaterThan(box.width / 2);
          await client.detach();
          await page.locator(".footer-columns summary").first().click();
          await expect(page.locator(".footer-columns details").first()).toHaveAttribute("open", "");
        }
        await page.getByRole("button", { name: "Book VIP", exact: true }).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px tour dialog overflow`);
        await page.keyboard.press("Escape");
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
      } finally { await context.close(); }
    }
  });
  assert.deepEqual(errors, []);
  assert.ok(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin));
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest: await StaticHomepage.validateStaticOutput(path.join(model, "out"), "brewery-and-taproom", "GPT-6"),
    widths: [320, 390, 768, 1200, 1440], browser: "Chromium", errors,
    checks: ["offline public subpath", "static/source agreement", "resources, PDF and fonts", "beer filters and data",
      "scheduled tour validation and age confirmation", "exact prices and safe text", "calendar download",
      "map/list/ZIP synchronization", "product options", "local-only contact and subscription", "touch and keyboard", "responsive overflow"],
  }, null, 2) + "\n");
});
