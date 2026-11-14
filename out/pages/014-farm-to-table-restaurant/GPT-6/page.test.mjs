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

test("Harvest & Hearth static seasonal restaurant", { timeout: 120000 }, async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [];
  const requests = [];
  await mkdir(path.join(model, ".checks"), { recursive: true });
  async function visit(options = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
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
  function nextDay(day) {
    const date = new Date();
    date.setDate(date.getDate() + ((day - date.getDay() + 6) % 7) + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  async function loadImages(page) {
    await page.locator("img[src]").evaluateAll((images) => images.forEach((image) => { image.loading = "eager"; }));
    for (let top = 0; top < await page.evaluate(() => document.documentElement.scrollHeight); top += 650) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
      await page.waitForTimeout(20);
    }
    await page.locator("img[src]").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  }
  const field = (page, name, form = "#reservation-form") => page.locator(`${form} [name="${name}"]`);
  const valid = (input, reason) => input.evaluate((element, key) => element.validity[key], reason);
  await t.test("source/export agreement, local resources, fonts, anchors and icons work offline at the real public URL", async () => {
    const { page, context } = await visit();
    try {
      assert.match(new URL(page.url()).pathname, /^\/pages\/farm-to-table-restaurant\/GPT-6\/index\.html$/);
      await expect(page).toHaveTitle("Harvest & Hearth | From Our Farms to Your Fork");
      await loadImages(page);
      for (const font of ["Playfair", "Lato"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)), []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      for (const id of new Set(await page.locator('use[href^="assets/icons.svg"]').evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`), id);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
      assert.match(await validateStaticOutput(path.join(model, "out"), "farm-to-table-restaurant", "GPT-6"), /^[a-f0-9]{64}$/);
    } finally { await context.close(); }
  });
  await t.test("desktop tabs use roving keyboard focus; full menu retains all eleven dishes and original prices", async () => {
    const { page, context } = await visit();
    try {
      const cases = [
        ["Starters", ["Heirloom Tomato Gazpacho", "Burrata & Stone Fruit", "Farm Egg Tartine", "Spring Pea Soup"], ["$14", "$18", "$16", "$13"]],
        ["Mains", ["Pan-Seared Trout", "Grass-Fed Ribeye", "Wild Mushroom Risotto", "Heritage Pork Chop"], ["$32", "$42", "$28", "$36"]],
        ["Desserts", ["Lavender Crème Brûlée", "Seasonal Fruit Galette", "Dark Chocolate Torte"], ["$14", "$15", "$16"]],
      ];
      for (const [tab, dishes, prices] of cases) {
        await page.getByRole("tab", { name: tab, exact: true }).click();
        await expect(page.getByRole("tab", { name: tab })).toHaveAttribute("aria-selected", "true");
        assert.deepEqual(await page.locator('[role="tabpanel"]:visible h3').allTextContents(), dishes);
        assert.deepEqual(await page.locator('[role="tabpanel"]:visible .dish>strong').allTextContents(), prices);
      }
      await page.keyboard.press("Home");
      await expect(page.getByRole("tab", { name: "Starters" })).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Mains" })).toBeFocused();
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Desserts" })).toBeFocused();
      await page.getByRole("button", { name: "View Full Menu", exact: true }).click();
      assert.equal(await page.locator("#info-content .dish").count(), 11);
      await expect(page.locator("#info-content")).toContainText("Archived");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "View Full Menu", exact: true })).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("farm stories are local dialogs and the six-image lightbox wraps, navigates and restores focus", async () => {
    const { page, context } = await visit();
    try {
      for (const [index, title] of ["Sunnyside Organic Farm", "Blue Ridge Creamery", "Willow Creek Ranch"].entries()) {
        await page.locator(`[data-farm="${index}"]`).click();
        await expect(page.locator("#info-title")).toHaveText(title);
        await expect(page.locator("#info-content")).toContainText("Fictional partner");
        await page.getByRole("button", { name: "Close details", exact: true }).click();
        await expect(page.locator(`[data-farm="${index}"]`)).toBeFocused();
      }
      const first = page.locator('[data-photo="0"]');
      await first.click();
      await expect(page.locator("#photo-caption")).toHaveText("Nature, on a plate");
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator("#photo-caption")).toHaveText("An occasion to slow down");
      await page.getByRole("button", { name: "Next photo", exact: true }).click();
      await expect(page.locator("#photo-caption")).toHaveText("Nature, on a plate");
      await page.getByRole("button", { name: "Previous photo", exact: true }).click();
      await expect(page.locator("#photo-large")).toHaveAttribute("alt", "Red wine being poured into a glass at a dinner setting");
      await page.keyboard.press("Escape");
      await expect(first).toBeFocused();
      assert.equal(await page.locator(".gallery figure").count(), 6);
      assert.equal(await page.locator(".gallery").evaluate((element) => getComputedStyle(element).columnCount), "3");
    } finally { await context.close(); }
  });
  await t.test("reservation dates respect Monday closure and Sunday brunch; safe local results clear private fields", async () => {
    const { page, context } = await visit();
    try {
      await field(page, "date").fill("2000-01-01");
      assert.equal(await valid(field(page, "date"), "rangeUnderflow"), true);
      await field(page, "date").fill(nextDay(1));
      assert.equal(await valid(field(page, "date"), "customError"), true);
      await field(page, "date").fill(nextDay(0));
      assert.equal(await valid(field(page, "date"), "valid"), true);
      assert.deepEqual(await field(page, "time").locator("option").evaluateAll((options) => options.map((option) => option.value)), ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"]);
      await field(page, "date").fill(nextDay(2));
      assert.equal(await field(page, "time").locator("option").count(), 10);
      await field(page, "time").selectOption("21:30");
      assert.equal(await field(page, "party").locator("option").count(), 12);
      await field(page, "party").selectOption("12");
      await field(page, "name").fill("   ");
      assert.equal(await valid(field(page, "name"), "customError"), true);
      await field(page, "name").fill("<b>Test Guest</b>");
      await field(page, "email").fill("invalid");
      assert.equal(await valid(field(page, "email"), "typeMismatch"), true);
      await field(page, "email").fill("guest@example.test");
      await field(page, "phone").fill("abcdefg");
      assert.equal(await valid(field(page, "phone"), "patternMismatch"), true);
      await field(page, "phone").fill("+1 (555) 234-5678");
      assert.equal(await valid(field(page, "phone"), "valid"), true);
      await field(page, "requests").fill('<img src=x onerror="alert(1)">');
      await page.getByRole("button", { name: "Book Now", exact: true }).click();
      await expect(page.locator("#reservation-result")).toBeFocused();
      await expect(page.locator("#reservation-result")).toContainText("<b>Test Guest</b> · 12 guest(s)");
      await expect(page.locator("#reservation-result")).toContainText("9:30 PM");
      await expect(page.locator("#reservation-result")).toContainText("No table has been reserved");
      assert.equal(await page.locator("#reservation-result img,#reservation-result b").count(), 0);
      for (const name of ["name", "email", "phone", "requests", "date"]) await expect(field(page, name)).toHaveValue("");
    } finally { await context.close(); }
  });
  await t.test("archived dinner, private-party boundaries, local social/policy details and newsletter are honest", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "Reserve Your Spot", exact: true }).click();
      await expect(page.locator("#info-content")).toContainText("$125 per person");
      await expect(page.locator("#info-content")).toContainText("cannot be booked");
      assert.equal(await page.locator("#info-content form").count(), 0);
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Inquire Now", exact: true }).click();
      const privateField = (name) => field(page, name, ".private-form");
      for (const [value, reason] of [["0", "rangeUnderflow"], ["25", "rangeOverflow"], ["1.5", "stepMismatch"]]) {
        await privateField("guests").fill(value);
        assert.equal(await valid(privateField("guests"), reason), true);
      }
      await privateField("date").fill(nextDay(1));
      assert.equal(await valid(privateField("date"), "customError"), true);
      await privateField("date").fill(nextDay(0));
      await privateField("guests").fill("24");
      await privateField("name").fill("Test Guest");
      await privateField("email").fill("guest@example.test");
      await privateField("message").fill("   ");
      assert.equal(await valid(privateField("message"), "customError"), true);
      await privateField("message").fill("<b>Birthday</b>");
      await page.getByRole("button", { name: "Preview Inquiry", exact: true }).click();
      await expect(page.locator(".private-result")).toContainText("24 guests");
      await expect(page.locator(".private-result")).toContainText("<b>Birthday</b>");
      await expect(page.locator(".private-result")).toContainText("No message was sent");
      assert.equal(await page.locator(".private-result b").count(), 0);
      await expect(privateField("email")).toHaveValue("");
      await page.keyboard.press("Escape");
      for (const [key, text] of [["directions", "fictional restaurant address"], ["privacy", "no analytics"], ["instagram", "no connected Instagram"], ["facebook", "no connected Facebook"], ["yelp", "not a verified review"]]) {
        await page.locator(`[data-info="${key}"]`).click();
        await expect(page.locator("#info-content")).toContainText(text);
        await page.keyboard.press("Escape");
      }
      await page.locator("#newsletter-email").fill("invalid");
      assert.equal(await valid(page.locator("#newsletter-email"), "typeMismatch"), true);
      await page.locator("#newsletter-email").fill("guest@example.test");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-status")).toContainText("no subscription created");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } finally { await context.close(); }
  });
  await t.test("reviews wrap, support keyboard and dots, honor reduced motion and actually advance every six seconds", async () => {
    const { page, context } = await visit({ reducedMotion: "no-preference" });
    try {
      await page.locator(".review-stage").scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await expect(page.locator(".review-stage article:visible")).toContainText("Sarah M.");
      await expect(page.locator(".review-stage article:visible")).toContainText("James & Lina T.", { timeout: 7000 });
      await page.getByRole("button", { name: "Pause reviews", exact: true }).click();
      await expect(page.getByRole("button", { name: "Resume reviews", exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.locator(".review-stage").focus();
      await page.keyboard.press("End");
      await expect(page.locator(".review-stage article:visible")).toContainText("Devon R.");
      await page.getByRole("button", { name: "Next review", exact: true }).click();
      await expect(page.locator(".review-stage article:visible")).toContainText("Sarah M.");
      await page.getByRole("button", { name: "Show review by Devon R.", exact: true }).click();
      await expect(page.locator(".review-stage article:visible")).toContainText("Devon R.");
      await page.locator(".review-stage").focus();
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator(".review-stage article:visible")).toContainText("Devon R.");
      assert.equal(await page.locator(".review-stars:visible .icon").count(), 5);
    } finally { await context.close(); }
  });
  await t.test("five responsive widths, mobile selector and sticky CTA, real touch gallery scrolling and modal fit", async () => {
    for (const width of [320, 390, 768, 1200, 1440]) {
      const { page, context } = await visit({ viewport: { width, height: 900 }, isMobile: width <= 600, hasTouch: width <= 600 });
      try {
        await loadImages(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px document overflow`);
        await expect(page.getByRole("button", { name: "Resume reviews", exact: true })).toHaveAttribute("aria-pressed", "true");
        assert.equal(await page.locator(".vine").evaluate((element) => getComputedStyle(element).animationName), "none");
        if (width <= 850) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await expect(page.locator("#navigation")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await page.locator("#navigation").getByRole("link", { name: "Our Farms", exact: true }).click();
          await expect(page.locator("#navigation")).toBeHidden();
        }
        if (width <= 600) {
          await page.locator("#menu-course").selectOption("mains");
          await expect(page.locator("#panel-mains")).toBeVisible();
          await expect(page.locator("#panel-starters")).toBeHidden();
          await expect(page.locator(".mobile-reserve")).toBeVisible();
          assert.equal(await page.locator(".farm-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 1);
        }
        if (width === 390) {
          await page.getByRole("button", { name: "Show photo: Under the evening sky", exact: true }).click();
          await expect(page.getByRole("button", { name: "Show photo: Under the evening sky", exact: true })).toHaveAttribute("aria-current", "true");
          await page.locator(".gallery").focus();
          await page.keyboard.press("Home");
          await page.keyboard.press("ArrowRight");
          await expect(page.getByRole("button", { name: "Show photo: A little room for good company", exact: true })).toHaveAttribute("aria-current", "true");
          await page.keyboard.press("Home");
          await page.locator(".gallery").scrollIntoViewIfNeeded();
          const box = await page.locator(".gallery").boundingBox();
          const client = await context.newCDPSession(page);
          const x = box.x + box.width * .85;
          const y = box.y + box.height * .45;
          await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
          for (let step = 1; step <= 8; step++) {
            await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - box.width * .75 * step / 8, y }] });
            await page.waitForTimeout(20);
          }
          await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await expect.poll(() => page.locator(".gallery").evaluate((element) => element.scrollLeft)).toBeGreaterThan(box.width / 2);
          await client.detach();
        }
        await page.getByRole("button", { name: "Inquire Now", exact: true }).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px inquiry overflow`);
        await page.keyboard.press("Escape");
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.mouse.move(0, 0);
        if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
      } finally { await context.close(); }
    }
  });
  assert.deepEqual(errors, []);
  assert.ok(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin));
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest: await validateStaticOutput(path.join(model, "out"), "farm-to-table-restaurant", "GPT-6"),
    widths: [320, 390, 768, 1200, 1440], browser: "Chromium", errors,
    checks: ["source/export match", "offline public subpath and assets", "eleven menu dishes/prices", "accessible menu tabs and mobile dropdown", "farm details",
      "six-image lightbox and focus restoration", "reservation dates and Sunday brunch", "contact validation and safe text", "archived event",
      "private party limits 1-24", "local-only subscription and inquiries", "actual six-second review autoplay", "mobile touch gallery", "responsive overflow"],
  }, null, 2) + "\n");
});
