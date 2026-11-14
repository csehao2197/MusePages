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

test("Savory Affairs independently deployable catering homepage", async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [];
  const requests = [];
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
  const field = (page, name) => page.locator(`#inquiry-form [name="${name}"]`);
  const future = () => {
    const value = new Date();
    value.setDate(value.getDate() + 30);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  };
  async function loadImages(page) {
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(20);
    }
    await page.locator("img[src]").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  }

  await t.test("all public resources, font faces, SVG symbols and anchors resolve without runtime network services", async () => {
    const { page, context } = await visit();
    try {
      const digest = await validateStaticOutput(path.join(model, "out"), "catering-services", "GPT-6");
      assert.match(digest, /^[a-f0-9]{64}$/);
      assert.match(new URL(page.url()).pathname, /^\/pages\/catering-services\/GPT-6\/index\.html$/);
      await expect(page).toHaveTitle("Savory Affairs | Catering & Gatherings");
      assert.equal(await page.locator("h1").count(), 1);
      await loadImages(page);
      for (const font of ["Inter", "Cormorant"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      const missing = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash));
      assert.deepEqual(missing, []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      const symbols = await page.locator("use").evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1]));
      for (const id of new Set(symbols)) assert.ok(sprite.includes(`id="${id}"`), `Missing icon ${id}`);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(
        await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"), `${file} export differs`);
    } finally { await context.close(); }
  });
  await t.test("menu tabs support pointer, roving keyboard focus and matching inquiry choices", async () => {
    const { page, context } = await visit();
    try {
      for (const [name, price, food] of [["Classic", "$35", "Caesar salad"], ["Premium", "$55", "Pan-seared salmon or filet mignon"], ["Luxury", "$85", "Lobster tail or wagyu strip steak"]]) {
        await page.getByRole("tab", { name, exact: true }).click();
        await expect(page.getByRole("tabpanel")).toContainText(price);
        await expect(page.getByRole("tabpanel")).toContainText(food);
        assert.equal(await page.getByRole("tabpanel").count(), 1);
        await page.getByRole("tabpanel").getByRole("link", { name: "Make this menu yours" }).click();
        await expect(field(page, "package")).toHaveValue(name.toLowerCase());
      }
      await page.getByRole("tab", { name: "Classic", exact: true }).click();
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByRole("tab", { name: "Luxury", exact: true })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(page.getByRole("tab", { name: "Classic", exact: true })).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Premium", exact: true })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Luxury", exact: true })).toBeFocused();
      for (const [label, value] of [["Plan a corporate event", "Corporate"], ["Plan a wedding", "Wedding"], ["Plan a private party", "Private Party"]]) {
        await page.getByRole("link", { name: label, exact: true }).click();
        await expect(field(page, "event")).toHaveValue(value);
      }
    } finally { await context.close(); }
  });
  await t.test("gallery filters constrain lightbox navigation and closing restores trigger focus", async () => {
    const { page, context } = await visit();
    try {
      for (const [category, count] of [["Corporate", 2], ["Wedding", 2], ["Private", 2], ["All gatherings", 6]]) {
        await page.getByRole("button", { name: category, exact: true }).click();
        assert.equal(await page.locator(".gallery-grid figure:visible").count(), count);
      }
      await page.getByRole("button", { name: "Wedding", exact: true }).click();
      const trigger = page.getByRole("button", { name: "View garden wedding at Willow House", exact: true });
      await trigger.click();
      await expect(page.locator("#lightbox")).toBeVisible();
      await expect(page.locator("#lightbox-caption")).toContainText("Willow House");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#lightbox-caption")).toContainText("Oak & Vine");
      await page.getByRole("button", { name: "Next event photo", exact: true }).click();
      await expect(page.locator("#lightbox-caption")).toContainText("Willow House");
      await page.getByRole("button", { name: "Previous event photo", exact: true }).click();
      await expect(page.locator("#lightbox-caption")).toContainText("Oak & Vine");
      await page.keyboard.press("Escape");
      await expect(page.locator("#lightbox")).toBeHidden();
      await expect(trigger).toBeFocused();
      await page.getByRole("button", { name: "All gatherings", exact: true }).click();
    } finally { await context.close(); }
  });
  await t.test("testimonials, FAQ details and honest social previews are interactive", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "Next testimonial", exact: true }).click();
      await expect(page.locator(".review:visible")).toContainText("Michael R.");
      await page.getByRole("button", { name: "Previous testimonial", exact: true }).click();
      await expect(page.locator(".review:visible")).toContainText("Sarah & James");
      await page.getByRole("button", { name: "Show Priya testimonial", exact: true }).click();
      await expect(page.locator(".review:visible")).toContainText("custom vegan menu");
      await page.locator(".review-carousel").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator(".review:visible")).toContainText("Sarah & James");
      for (const details of await page.locator(".faq-list details").all()) {
        await details.locator("summary").click();
        await expect(details.locator("p")).toBeVisible();
      }
      for (const social of ["Instagram", "Facebook", "Pinterest"]) {
        await page.getByRole("button", { name: `${social} demo`, exact: true }).click();
        await expect(page.locator("#social-message")).toContainText(social);
        await expect(page.locator("#social-dialog")).toContainText("no connected social accounts");
        await page.getByRole("button", { name: "Back to the gathering", exact: true }).click();
        await expect(page.getByRole("button", { name: `${social} demo`, exact: true })).toBeFocused();
      }
    } finally { await context.close(); }
  });
  await t.test("inquiry checks required fields, ranges, dates and whitespace, calculates exact food-only prices and never submits or stores data", async () => {
    const { page, context } = await visit();
    try {
      const validity = (name, reason) => field(page, name).evaluate((input, key) => input.validity[key], reason);
      await page.locator('#inquiry-form button[type="submit"]').click();
      assert.equal(await validity("name", "valueMissing"), true);
      await field(page, "name").fill("   ");
      assert.equal(await validity("name", "customError"), true);
      await field(page, "name").fill("Test Guest");
      await field(page, "email").fill("invalid");
      assert.equal(await validity("email", "typeMismatch"), true);
      await field(page, "email").fill("guest@example.test");
      await field(page, "phone").fill("not-a-phone");
      assert.equal(await validity("phone", "patternMismatch"), true);
      await field(page, "phone").fill("+1 (555) 234-5678");
      assert.equal(await validity("phone", "valid"), true);
      await field(page, "event").selectOption("Wedding");
      await field(page, "date").fill("2000-01-01");
      assert.equal(await validity("date", "rangeUnderflow"), true);
      await field(page, "date").fill(future());
      for (const [guests, reason] of [["19", "rangeUnderflow"], ["501", "rangeOverflow"], ["20.5", "stepMismatch"]]) {
        await field(page, "guests").fill(guests);
        assert.equal(await validity("guests", reason), true);
      }
      await field(page, "guests").fill("20");
      await expect(page.locator("#estimate")).toHaveText("$700 for 20 guests");
      await field(page, "package").selectOption("premium");
      await expect(page.locator("#estimate")).toHaveText("$1,100 for 20 guests");
      await field(page, "package").selectOption("luxury");
      await field(page, "guests").fill("500");
      await expect(page.locator("#estimate")).toHaveText("$42,500 for 500 guests");
      await field(page, "venue").fill("  ");
      assert.equal(await validity("venue", "customError"), true);
      await field(page, "venue").fill("A lovely local garden");
      const input = '<img src=x onerror="window.unexpected=true">';
      await field(page, "notes").fill(input);
      await page.locator('#inquiry-form button[type="submit"]').click();
      await expect(page.locator("#inquiry-result")).toBeFocused();
      await expect(page.locator("#inquiry-result")).toContainText("$42,500");
      await expect(page.locator("#inquiry-result")).toContainText("has not been sent");
      await expect(page.locator("#result-details")).toContainText(input);
      assert.equal(await page.locator("#result-details img").count(), 0);
      assert.equal(await page.evaluate(() => window.unexpected), undefined);
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      await page.getByRole("button", { name: "Create another sample inquiry", exact: true }).click();
      await expect(field(page, "name")).toBeFocused();
      await expect(field(page, "email")).toHaveValue("");
      await expect(page.locator("#result-details")).toBeEmpty();
      await expect(page.locator("#estimate")).toContainText("20 to 500");
    } finally { await context.close(); }
  });
  await t.test("mobile navigation, touch swipes, reduced motion and responsive layouts remain usable", async () => {
    await mkdir(path.join(model, ".checks"), { recursive: true });
    for (const width of [320, 390, 768, 1200, 1440]) {
      const { page, context } = await visit({ viewport: { width, height: 900 }, isMobile: width <= 600, hasTouch: width <= 600 });
      try {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px initial overflow`);
        await loadImages(page);
        if (width <= 850) {
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await expect(page.locator("#navigation")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await page.locator("#navigation").getByRole("link", { name: "Sample menus", exact: true }).click();
          await expect(page.locator("#navigation")).toBeHidden();
        }
        await page.getByRole("tab", { name: "Luxury", exact: true }).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px menu overflow`);
        await page.getByRole("button", { name: "View garden wedding at Willow House", exact: true }).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px dialog overflow`);
        await page.keyboard.press("Escape");
        if (width === 390) {
          await page.locator(".review-carousel").scrollIntoViewIfNeeded();
          const box = await page.locator(".review blockquote:visible").boundingBox();
          const client = await context.newCDPSession(page);
          const startX = box.x + box.width * .85;
          const endX = box.x + box.width * .15;
          const y = box.y + Math.min(box.height / 2, 45);
          await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y }] });
          for (let step = 1; step <= 6; step++) {
            await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * step / 6, y }] });
          }
          await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await expect(page.locator(".review:visible")).toContainText("Michael R.");
          await client.detach();
        }
        await page.evaluate(() => scrollTo({ top: 100, behavior: "instant" }));
        await page.waitForTimeout(40);
        assert.equal(await page.locator(".hero-image").evaluate((image) => getComputedStyle(image).transform), "none");
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        if ([390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
        }
      } finally { await context.close(); }
    }
  });
  await t.test("normal-motion parallax works and disabling motion clears the transform", async () => {
    const { page, context } = await visit({ reducedMotion: "no-preference" });
    try {
      await page.evaluate(() => scrollTo({ top: 220, behavior: "instant" }));
      await expect.poll(() => page.locator(".hero-image").evaluate((image) => getComputedStyle(image).transform)).not.toBe("none");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => page.locator(".hero-image").evaluate((image) => getComputedStyle(image).transform)).toBe("none");
    } finally { await context.close(); }
  });
  assert.deepEqual(errors, []);
  assert.ok(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin));
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(),
    digest: await validateStaticOutput(path.join(model, "out"), "catering-services", "GPT-6"),
    widths: [320, 390, 768, 1200, 1440], browser: "Chromium", errors,
    checks: ["offline public subpath", "source/export agreement", "resources and fonts", "tabs and keyboard",
      "gallery filtering and lightbox focus", "testimonials and touch", "form validation and exact estimates",
      "safe text rendering", "no submission or persistent storage", "FAQ and social dialogs", "reduced motion", "responsive overflow"],
  }, null, 2) + "\n");
});
