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
test("Hikari independent Japanese dining experience", { timeout: 150000 }, async (t) => {
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
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => list.forEach((image) => { image.loading = "eager"; }));
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => image.decode())));
  }
  async function closeDetails(page) {
    await page.locator("#info-dialog .close").click();
    await expect(page.locator("#info-content")).toBeEmpty();
  }
  const field = (page, name) => page.locator(`#reservation-form [name="${name}"]`);
  const dateString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  function future(day, offset = 8) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    while (date.getDay() !== day) date.setDate(date.getDate() + 1);
    return dateString(date);
  }
  await t.test("real public subpath renders local Japanese fonts, original copy, icons and source-matched output", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(new URL(page.url()).pathname, "/pages/sushi-restaurant/GPT-6/index.html");
      await expect(page).toHaveTitle("Hikari · The Art of Sushi, Perfected");
      await images(page);
      for (const font of ["Noto", "Yuji"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)), []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      for (const id of new Set(await page.locator('use[href^="assets/icons.svg"]').evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`), id);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
      assert.match(await validateStaticOutput(path.join(model, "out"), "sushi-restaurant", "GPT-6"), /^[a-f0-9]{64}$/);
      await expect(page.locator(".hero")).toContainText("14-seat");
      await expect(page.locator("#omakase")).toContainText("18-course");
      await expect(page.locator("#story")).toContainText("James Beard semifinalist 2025");
      await expect(page.locator("#story")).toContainText("Fictional biography");
      await expect(page.locator("body")).not.toContainText("017-");
      assert.equal(await page.locator(".hero").evaluate((element) => getComputedStyle(element).height), "1000px");
      await expect(page.locator("header")).not.toHaveClass(/scrolled/);
      await page.locator("#menu").scrollIntoViewIfNeeded();
      await expect(page.locator("header")).toHaveClass(/scrolled/);
      assert.equal(await page.locator("header").evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(15, 23, 42)");
    } finally { await context.close(); }
  });
  await t.test("three source selections, eighteen-course illustrative outline and sake details are operable", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".seasonal-copy h3")).toHaveText(["Otoro (Bluefin Tuna Belly)", "Uni (Sea Urchin)", "Sakura Masu (Cherry Trout)"]);
      await expect(page.locator(".seasonal-photo>span")).toHaveText(["Peak Season", "Chef's Choice", "Limited"]);
      await expect(page.locator(".seasonal")).toContainText("ARCHIVED SEASONAL CONCEPT");
      for (const index of [0, 1, 2]) {
        await page.locator(`[data-item="${index}"]`).click();
        await expect(page.locator("#info-content")).toContainText("not verified sourcing");
        await expect(page.locator("#info-content img")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("#info-dialog")).not.toBeVisible();
        await expect(page.locator(`[data-item="${index}"]`)).toBeFocused();
      }
      await page.getByRole("button", { name: "View Full Menu", exact: true }).click();
      await expect(page.locator(".menu-detail article")).toHaveCount(3);
      await page.getByRole("button", { name: "Omakase Outline" }).click();
      await expect(page.locator(".menu-detail li")).toHaveCount(18);
      await expect(page.locator(".menu-detail")).toContainText("$185 per person");
      await page.getByRole("button", { name: "Sake List", exact: true }).last().click();
      await expect(page.locator(".menu-detail article")).toHaveCount(4);
      await expect(page.locator(".menu-detail")).toContainText("+$65 per person");
      await expect(page.locator(".menu-detail")).toContainText("21+ with valid ID");
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("six asymmetric gallery photos support warm hover, wraparound arrows, Escape and focus restoration", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".gallery-grid figure")).toHaveCount(6);
      assert.equal(await page.locator(".gallery-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 3);
      await page.locator('[data-photo="0"]').hover();
      assert.equal(await page.locator('[data-photo="0"] .gallery-overlay').evaluate((element) => getComputedStyle(element).opacity), "1");
      await page.locator('[data-photo="0"]').click();
      await expect(page.locator("#lightbox-caption")).toContainText("The Counter");
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/plating.jpg");
      await page.getByRole("button", { name: "Next photo" }).click();
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/interior.jpg");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#lightbox-image")).toHaveAttribute("src", "assets/aburi.jpg");
      await page.keyboard.press("Escape");
      await expect(page.locator('[data-photo="0"]')).toBeFocused();
      await expect(page.locator(".stars .icon")).toHaveCount(9);
    } finally { await context.close(); }
  });
  await t.test("reservation honors Tue–Sat, exact 48-hour notice, distinct bar slots and local-only safe preview", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator('#reservation-form [name="time"] option:disabled')).toHaveCount(5);
      await expect(page.locator(".estimate")).toContainText("$370");
      await field(page, "date").fill(future(0));
      assert.match(await field(page, "date").evaluate((input) => input.validationMessage), /closed Sunday and Monday/);
      await page.locator("#reservation-form").getByRole("button", { name: "Request Reservation" }).click();
      await expect(page.locator("#reservation-result")).toBeHidden();
      await field(page, "date").fill(future(2));
      await field(page, "time").selectOption("20:30");
      await field(page, "guests").selectOption("8");
      await expect(page.locator(".form-guidance")).toContainText("separate 6–8");
      await expect(page.locator(".estimate")).toContainText("$1,480");
      await field(page, "pairing").check();
      await expect(page.locator(".estimate")).toContainText("$2,000");
      assert.equal(await field(page, "adult").evaluate((input) => input.required), true);
      await page.locator("#reservation-form").getByRole("button", { name: "Request Reservation" }).click();
      await expect(page.locator("#reservation-result")).toBeHidden();
      await field(page, "adult").check();
      await field(page, "requests").fill('<img src=x onerror="window.unsafe=1"> Local dietary note');
      await page.locator("#reservation-form").getByRole("button", { name: "Request Reservation" }).click();
      await expect(page.locator("#reservation-result")).toContainText("$2,000");
      await expect(page.locator("#reservation-result")).toContainText("<img src=x");
      await expect(page.locator("#reservation-result")).toContainText("No request was sent");
      assert.equal(await page.locator("#reservation-result img").count(), 0);
      assert.equal(await page.evaluate(() => window.unsafe), undefined);
      await expect(field(page, "requests")).toHaveValue("");
      await page.locator('#reservation-form input[value="bar"]').check();
      await expect(page.locator('#reservation-form [name="time"] option:disabled')).toHaveCount(0);
      await expect(page.locator(".pairing")).toBeHidden();
      assert.equal(await field(page, "adult").isDisabled(), true);
      await field(page, "date").fill(future(6));
      await field(page, "time").selectOption("19:30");
      await expect(page.locator(".estimate")).toContainText("no estimate supplied");
      await page.locator("#reservation-form").getByRole("button", { name: "Request Reservation" }).click();
      await expect(page.locator("#reservation-result")).toContainText("À La Carte Bar");
      await expect(page.locator("#reservation-result")).toContainText("7:30 PM");
      const target = future(2);
      const targetMs = new Date(`${target}T18:00:00`).getTime();
      await page.clock.setFixedTime(targetMs - 47 * 3600000);
      await page.locator('#reservation-form input[value="omakase"]').check();
      await field(page, "date").fill(target);
      await field(page, "time").selectOption("18:00");
      assert.match(await field(page, "date").evaluate((input) => input.validationMessage), /48 hours/);
      await field(page, "time").selectOption("20:30");
      assert.equal(await field(page, "date").evaluate((input) => input.checkValidity()), true);
      await page.clock.setFixedTime(targetMs - 48 * 3600000);
      await field(page, "time").selectOption("18:00");
      assert.equal(await field(page, "date").evaluate((input) => input.checkValidity()), true);
    } finally { await context.close(); }
  });
  await t.test("private dining restricts 6–8 whole guests, previews safe text and removes temporary contact data", async () => {
    const { page, context } = await visit();
    try {
      await page.locator('footer [data-info="private"]').click();
      const form = page.locator("#private-form");
      await form.locator('[name="name"]').fill('<img src=x onerror="window.unsafe=1">');
      await form.locator('[name="email"]').fill("preview@example.test");
      await form.locator('[name="occasion"]').fill("Local anniversary");
      await form.locator('[name="message"]').fill("<script>window.unsafe=1</script> Accessibility question");
      for (const value of ["5", "9", "6.5"]) {
        await form.locator('[name="guests"]').fill(value);
        assert.equal(await form.locator('[name="guests"]').evaluate((input) => input.checkValidity()), false);
        await form.getByRole("button", { name: "Preview Enquiry" }).click();
        await expect(form).toBeVisible();
      }
      await form.locator('[name="guests"]').fill("8");
      await form.getByRole("button", { name: "Preview Enquiry" }).click();
      await expect(page.locator("#info-content .result")).toContainText("8 guests");
      await expect(page.locator("#info-content .result")).toContainText("<script>window.unsafe=1</script>");
      await expect(form).toHaveCount(0);
      assert.equal(await page.locator("#info-content script, #info-content img").count(), 0);
      assert.equal(await page.evaluate(() => window.unsafe), undefined);
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("all footer actions, newsletter and truthful location are local without external calls or storage", async () => {
    const { page, context } = await visit();
    try {
      for (const button of await page.locator("footer [data-info]").all()) {
        await button.click();
        await expect(page.locator("#info-dialog")).toBeVisible();
        assert.ok((await page.locator("#info-content").innerText()).trim().length > 40);
        await closeDetails(page);
      }
      await page.locator("#newsletter-email").fill("preview@example.test");
      await page.getByRole("button", { name: "Subscribe" }).click();
      await expect(page.locator("#newsletter-status")).toContainText("stores no address");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      await expect(page.locator("#location")).toContainText("no city");
      await expect(page.locator(".map-label")).toContainText("NOT A VERIFIED MAP");
      await expect(page.locator(".form-note")).toContainText("sends no email");
      assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie]), [0, 0, ""]);
    } finally { await context.close(); }
  });
  await t.test("five widths, mobile navigation, usable touch targets and actual review swipe remain responsive", async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const { page, context } = await visit({ viewport: { width, height: 1000 } });
      try {
        await images(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow ${width}`);
        if (width <= 650) {
          assert.equal(await page.locator(".seasonal-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 1);
          assert.equal(await page.locator(".gallery-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 2);
          await page.getByRole("button", { name: "Open navigation" }).click();
          await expect(page.locator("#mobile-nav")).toBeVisible();
          await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "true");
          await page.keyboard.press("Escape");
          await expect(page.locator(".nav-toggle")).toBeFocused();
          await page.getByRole("button", { name: "Open navigation" }).click();
          await page.locator("#mobile-nav").getByRole("link", { name: "Gallery" }).click();
          await expect(page.locator("#mobile-nav")).not.toBeVisible();
          const tiny = await page.locator("button:visible,a:visible").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().height < 43.9 || element.getBoundingClientRect().width < 43.9).map((element) => element.textContent.trim() || element.getAttribute("aria-label")));
          assert.deepEqual(tiny, [], `Small touch targets ${width}`);
        }
        assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).animationName), "none");
        if (width === 1440 || width === 390) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
        }
      } finally { await context.close(); }
    }
    const { page, context } = await visit({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
    try {
      await images(page);
      await page.locator(".review-track").scrollIntoViewIfNeeded();
      const box = await page.locator(".review-track").boundingBox();
      const cdp = await context.newCDPSession(page);
      const y = Math.max(100, Math.min(780, box.y + 100));
      const x = box.x + 295;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      for (let step = 1; step <= 8; step++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * 25, y }] });
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForFunction(() => document.querySelector(".review-track").scrollLeft > 30);
      assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).animationName), "kenburns");
      await page.locator("#omakase").scrollIntoViewIfNeeded();
      await expect(page.locator(".omakase-copy")).toHaveClass(/visible/);
      await cdp.detach();
    } finally { await context.close(); }
  });
  assert.deepEqual(errors, []);
  assert.equal(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin), true);
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest: await validateStaticOutput(path.join(model, "out"), "sushi-restaurant", "GPT-6"), browser: browser.version(), widths: [1440, 1024, 768, 390, 320], errors,
    checks: ["Actual public subpath with local Japanese fonts, photos and icons", "Three archived source selections and eighteen-course sample outline", "Six-photo asymmetric gallery and keyboard lightbox", "Tue–Sat reservation, exact 48-hour notice, bar and omakase slots", "185/65 prices, 21+ pairing confirmation and safe local preview", "Private 6–8 whole guests and temporary contact cleanup", "All footer actions, newsletter and truthful non-geocoded map", "Five widths, 44px touch targets, actual review swipe and reduced motion", "Actual desktop/mobile full-page screenshots"],
  }, null, 2) + "\n");
});
