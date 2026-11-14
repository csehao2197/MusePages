import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));
test("Aurelian independent static fine dining experience", { timeout: 120000 }, async (t) => {
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
  const field = (page, name, form = "#reservation-form") => page.locator(`${form} [name="${name}"]`);
  const validity = (input, reason) => input.evaluate((element, key) => element.validity[key], reason);
  function nextDay(day) {
    const date = new Date();
    date.setDate(date.getDate() + ((day - date.getDay() + 6) % 7) + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => list.forEach((image) => { image.loading = "eager"; }));
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => image.decode())));
  }
  await t.test("real public subpath works offline with fonts, icons, source agreement and resolved anchors", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(new URL(page.url()).pathname, "/pages/fine-dining-restaurant/GPT-6/index.html");
      await expect(page).toHaveTitle("Aurelian | Season, Terroir & Craft");
      await images(page);
      for (const font of ["Cormorant", "Montserrat"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)), []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      for (const id of new Set(await page.locator('use[href^="assets/icons.svg"]').evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`), id);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model, "out"), "fine-dining-restaurant", "GPT-6"), /^[a-f0-9]{64}$/);
      assert.equal(await page.locator(".hero").evaluate((element) => getComputedStyle(element).height), "1000px");
      await expect(page.locator("body")).not.toContainText("015-");
    } finally { await context.close(); }
  });
  await t.test("seven original courses, five pairings and business prices remain exact and honestly archived", async () => {
    const { page, context } = await visit();
    try {
      assert.deepEqual(await page.locator(".course h3").allTextContents(), [
        "Potato Velouté, Truffle Foam, Chive Oil",
        "Hokkaido Scallop, Cauliflower Purée,Golden Raisin, Brown Butter",
        "Roasted Beet Tartare, Goat Cheese Mousse,Walnut, Aged Balsamic",
        "Wild Turbot, Fennel,Saffron Broth, Sea Beans",
        "Dry-Aged Duck Breast, Roasted Fig,Parsnip, Jus Gras",
        "Yuzu Sorbet, Champagne Granita, Mint",
        "Dark Chocolate Soufflé, Crème Fraîche,Smoked Salt Caramel",
      ]);
      assert.deepEqual(await page.locator(".course .pairing").allTextContents(), [
        "2024 Chablis Premier Cru, Domaine Raveneau", "2023 Sancerre Rosé, Domaine Vacheron",
        "2022 Meursault, Domaine Roulot", "2021 Chambolle-Musigny, Domaine Roumier", "2020 Banyuls, Domaine de la Rectorie",
      ]);
      await expect(page.locator(".menu-prices")).toContainText("$185 per person");
      await expect(page.locator(".menu-prices")).toContainText("Wine Pairing — $95");
      await expect(page.locator("#menu")).toContainText("Vegetarian Tasting Menu Available");
      await expect(page.locator("#menu")).toContainText("Archived seasonal concept");
      await expect(page.locator("#press")).toContainText("#8 Best New Restaurant");
      await expect(page.locator("#press")).toContainText("fictional concept copy");
      assert.equal(await page.locator(".press-strip article").count(), 5);
      assert.equal(await page.locator(".michelin-stars .icon").count(), 2);
      await expect(page.locator(".raw-note")).toHaveText("Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.");
      await expect(page.locator("#visit")).toContainText("$35");
      await expect(page.getByRole("link", { name: "Get Directions" })).toHaveAttribute("href", /maps\/search\/\?api=1&query=127/);
    } finally { await context.close(); }
  });
  await t.test("six-photo masonry and wrapping lightbox support hover, keyboard and focus restoration", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(await page.locator(".editorial-gallery figure").count(), 6);
      assert.equal(await page.locator(".editorial-gallery").evaluate((element) => getComputedStyle(element).columnCount), "3");
      const first = page.locator('[data-photo="0"]');
      await first.hover();
      await expect(first.locator(".photo-caption")).toHaveCSS("opacity", "1");
      await first.click();
      await expect(page.locator("#photo-caption")).toHaveText("A study in balance");
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator("#photo-caption")).toHaveText("Set for something special");
      await page.getByRole("button", { name: "Next photograph", exact: true }).click();
      await expect(page.locator("#photo-caption")).toHaveText("A study in balance");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#photo-large")).toHaveAttribute("alt", "A warmly lit dining room with timber details and hanging lights");
      await page.getByRole("button", { name: "Previous photograph", exact: true }).click();
      await page.keyboard.press("Escape");
      await expect(first).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("bottle details and full concept wine list actually filter all nine wines", async () => {
    const { page, context } = await visit();
    try {
      for (const [index, title, price] of [[0, "2021 Barolo", "$145"], [1, "2022 Pouilly-Fumé", "$110"], [2, "2020 Châteauneuf-du-Pape", "$280"], [3, "NV Champagne", "$320"]]) {
        await page.locator(`[data-bottle="${index}"]`).click();
        await expect(page.locator("#info-title")).toHaveText(title);
        await expect(page.locator("#info-content")).toContainText(price);
        await expect(page.locator("#info-content")).toContainText("not a current offer");
        await page.keyboard.press("Escape");
        await expect(page.locator(`[data-bottle="${index}"]`)).toBeFocused();
      }
      await page.getByRole("button", { name: "View Full Wine List" }).click();
      for (const [type, count] of [["All", 9], ["Red", 3], ["White", 3], ["Sparkling", 1], ["Rosé", 1], ["Sweet", 1], ["All", 9]]) {
        await page.locator(`[data-wine-type="${type}"]`).click();
        await expect(page.locator(`[data-wine-type="${type}"]`)).toHaveAttribute("aria-pressed", "true");
        assert.equal(await page.locator(".wine-row").count(), count);
      }
      await page.getByRole("button", { name: "Close details", exact: true }).click();
      await expect(page.getByRole("button", { name: "View Full Wine List" })).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("reservation schedule, party limits, 21+ pairing and accurate subtotal never claim live booking", async () => {
    const { page, context } = await visit();
    try {
      assert.deepEqual(await field(page, "party").locator("option").evaluateAll((list) => list.map((option) => option.value)), ["1", "2", "3", "4", "5", "6", "7", "8"]);
      assert.deepEqual(await field(page, "seating").locator("option").evaluateAll((list) => list.map((option) => option.value)), ["17:30", "20:30"]);
      await field(page, "date").fill("2000-01-01");
      assert.equal(await validity(field(page, "date"), "rangeUnderflow"), true);
      for (const day of [1, 2]) {
        await field(page, "date").fill(nextDay(day));
        assert.equal(await validity(field(page, "date"), "customError"), true);
      }
      for (const day of [0, 3, 4, 5, 6]) {
        await field(page, "date").fill(nextDay(day));
        assert.equal(await validity(field(page, "date"), "valid"), true);
      }
      await field(page, "date").fill(nextDay(3));
      await field(page, "party").selectOption("1");
      await page.getByRole("button", { name: "Check Availability", exact: true }).click();
      await expect(page.locator("#availability-result")).toBeFocused();
      await expect(page.locator("#availability-result")).toContainText("1 guest");
      await expect(page.locator("#availability-result")).toContainText("$185");
      await expect(page.locator("#availability-result")).toContainText("no table has been reserved");
      await expect(field(page, "date")).toHaveValue("");
      await field(page, "party").selectOption("8");
      await expect(page.locator("#availability-result")).toBeHidden();
      await field(page, "date").fill(nextDay(0));
      await field(page, "seating").selectOption("20:30");
      await field(page, "occasion").selectOption("Anniversary");
      await field(page, "pairing").check();
      assert.equal(await validity(field(page, "adult"), "valueMissing"), true);
      await page.getByRole("button", { name: "Check Availability", exact: true }).click();
      await expect(page.locator("#availability-result")).toBeHidden();
      await field(page, "adult").check();
      await page.getByRole("button", { name: "Check Availability", exact: true }).click();
      await expect(page.locator("#availability-result")).toContainText("8:30 PM, New York time · 8 guests · Anniversary");
      assert.deepEqual(await page.locator("#availability-result dd").allTextContents(), ["$1,480", "$760", "$2,240"]);
      await page.getByRole("button", { name: "Explore Private Dining", exact: true }).click();
      await expect(page.locator(".private-form")).toBeVisible();
      await page.keyboard.press("Escape");
      await field(page, "pairing").uncheck();
      await expect(page.locator("#wine-age")).toBeHidden();
      await expect(field(page, "adult")).toBeDisabled();
    } finally { await context.close(); }
  });
  await t.test("private inquiry validates 8–24 integers, dates and email; safe previews clear personal data", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "Inquire About Private Dining" }).click();
      const f = (name) => field(page, name, ".private-form");
      await expect(page.locator(".private-total")).toContainText("$1,200");
      for (const [value, reason] of [["7", "rangeUnderflow"], ["25", "rangeOverflow"], ["8.5", "stepMismatch"]]) {
        await f("guests").fill(value);
        assert.equal(await validity(f("guests"), reason), true);
      }
      await f("guests").fill("24");
      await expect(page.locator(".private-total")).toContainText("$3,600");
      await f("name").fill("   ");
      assert.equal(await validity(f("name"), "customError"), true);
      await f("name").fill("<b>Test Guest</b>");
      await f("email").fill("invalid");
      assert.equal(await validity(f("email"), "typeMismatch"), true);
      await f("email").fill("guest@example.test");
      await f("date").fill(nextDay(1));
      assert.equal(await validity(f("date"), "customError"), true);
      await f("date").fill(nextDay(5));
      await f("message").fill("   ");
      assert.equal(await validity(f("message"), "customError"), true);
      await f("message").fill('<img src=x onerror="alert(1)">');
      await page.getByRole("button", { name: "Preview Inquiry" }).click();
      await expect(page.locator(".private-result")).toBeFocused();
      await expect(page.locator(".private-result")).toContainText("<b>Test Guest</b> · 24 guests");
      await expect(page.locator(".private-result")).toContainText("$3,600");
      await expect(page.locator(".private-result")).toContainText("No message was sent");
      assert.equal(await page.locator(".private-result b,.private-result img").count(), 0);
      for (const name of ["name", "email", "date", "message"]) await expect(f(name)).toHaveValue("");
      await page.keyboard.press("Escape");
      await expect(page.locator(".private-form")).toHaveCount(0);
    } finally { await context.close(); }
  });
  await t.test("newsletter, policies and social dialogs are local-only and motion effects honor preferences", async () => {
    const { page, context } = await visit({ reducedMotion: "no-preference" });
    try {
      await expect(page.locator(".header")).not.toHaveClass(/solid/);
      await page.locator(".editorial-gallery [data-photo='0']").evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(page.locator(".header")).toHaveClass(/solid/);
      const image = page.locator(".editorial-gallery img").first();
      const before = await image.evaluate((element) => element.style.getPropertyValue("--shift"));
      await page.evaluate(() => scrollBy({ top: 120, behavior: "instant" }));
      await expect.poll(() => image.evaluate((element) => element.style.getPropertyValue("--shift"))).not.toBe(before);
      assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).animationName), "kenburns");
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).animationName), "none");
      for (const [key, text] of [["privacy", "no analytics"], ["terms", "fictional restaurant"], ["instagram", "no connected Instagram"], ["facebook", "no connected Facebook"]]) {
        await page.locator(`[data-info="${key}"]`).click();
        await expect(page.locator("#info-content")).toContainText(text);
        await page.keyboard.press("Escape");
      }
      await page.locator("#newsletter-email").fill("invalid");
      assert.equal(await validity(page.locator("#newsletter-email"), "typeMismatch"), true);
      await page.locator("#newsletter-email").fill("guest@example.test");
      await page.getByRole("button", { name: "Subscribe", exact: true }).click();
      await expect(page.locator("#newsletter-status")).toContainText("no subscription created");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } finally { await context.close(); }
  });
  await t.test("five responsive widths, mobile navigation, two-column gallery and real touch wine scrolling", async () => {
    for (const width of [320, 390, 768, 1200, 1440]) {
      const { page, context } = await visit({ viewport: { width, height: 900 }, isMobile: width <= 650, hasTouch: width <= 650 });
      try {
        await images(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px document overflow`);
        assert.equal(await page.locator(".hero-image").evaluate((element) => getComputedStyle(element).animationName), "none");
        if (width <= 950) {
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await expect(page.locator("#mobile-nav")).toBeVisible();
          await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "true");
          await page.keyboard.press("Tab");
          assert.equal(await page.evaluate(() => document.querySelector("#mobile-nav").contains(document.activeElement)), true);
          await page.keyboard.press("Escape");
          await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
          await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
          await page.getByRole("button", { name: "Open navigation", exact: true }).click();
          await page.locator("#mobile-nav").getByRole("link", { name: "Menu", exact: true }).click();
          await expect(page.locator("#mobile-nav")).toBeHidden();
        }
        if (width <= 650) {
          await expect(page.locator(".mobile-bar")).toBeVisible();
          assert.equal(await page.locator(".editorial-gallery").evaluate((element) => getComputedStyle(element).columnCount), "2");
          assert.equal(await page.locator(".booking-fields").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 1);
          assert.equal(await page.locator(".press-strip").evaluate((element) => getComputedStyle(element).display), "block");
        }
        if (width === 390) {
          await page.locator(".bottles").scrollIntoViewIfNeeded();
          const box = await page.locator(".bottles").boundingBox();
          const client = await context.newCDPSession(page);
          const x = box.x + box.width * .85;
          const y = box.y + box.height * .25;
          await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
          for (let step = 1; step <= 8; step++) {
            await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - box.width * .75 * step / 8, y }] });
            await page.waitForTimeout(20);
          }
          await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await expect.poll(() => page.locator(".bottles").evaluate((element) => element.scrollLeft)).toBeGreaterThan(box.width / 2);
          await client.detach();
        }
        await page.getByRole("button", { name: "Inquire About Private Dining" }).click();
        assert.equal(await page.locator("#info-dialog").evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true, `${width}px dialog overflow`);
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
    checkedAt: new Date().toISOString(), digest: await StaticHomepage.validateStaticOutput(path.join(model, "out"), "fine-dining-restaurant", "GPT-6"),
    widths: [320, 390, 768, 1200, 1440], browser: "Chromium", errors,
    checks: ["source/export match", "offline public subpath and assets", "seven exact courses and five pairings", "archived menu and disclosed fictional recognition",
      "six-image masonry and wrapping accessible lightbox", "nine-wine filters and four bottle details", "Wednesday–Sunday date validation", "party limits and accurate food/wine estimates",
      "21+ opt-in validation", "private inquiry 8–24 integer guests", "safe text and contact clearing", "local-only newsletter and policy/social dialogs",
      "real parallax, Ken Burns and reduced motion", "mobile focus navigation", "actual touch wine scrolling", "five responsive widths without overflow"],
  }, null, 2) + "\n");
});
