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
test("StreetBite independent static festival experience", { timeout: 150000 }, async (t) => {
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
  const closeDetails = async (page) => {
    await page.locator("#info-dialog .close").click();
    await expect(page.locator("#info-content")).toBeEmpty();
  };
  await t.test("real public subpath resolves local fonts, sprites, photos, downloads and source agreement", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(new URL(page.url()).pathname, "/pages/food-truck-festival/GPT-6/index.html");
      await expect(page).toHaveTitle("StreetBite Fest | Good Food. Great Company.");
      await images(page);
      for (const font of ["Bricolage", "Inter"]) assert.equal(await page.evaluate((name) => document.fonts.check(`16px ${name}`), font), true);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)), []);
      const sprite = await readFile(path.join(model, "out", "assets", "icons.svg"), "utf8");
      for (const id of new Set(await page.locator('use[href^="assets/icons.svg"]').evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`), id);
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model, "out"), "food-truck-festival", "GPT-6"), /^[a-f0-9]{64}$/);
      await expect(page.locator("body")).not.toContainText("016-");
      await expect(page.locator(".archive-note")).toContainText("Saturday–Monday");
      assert.equal(await page.locator(".vendor-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 4);
    } finally { await context.close(); }
  });
  await t.test("nine cuisine filters combine with clickable zones, reset and safe searchable supplied directory", async () => {
    const { page, context } = await visit();
    try {
      assert.deepEqual(await page.locator(".vendor-card h3").allTextContents(), ["Taco Libre", "Bao Down", "Holy Smoke BBQ", "Green Machine", "Catch of the Day", "Sugar Rush", "Naan Stop", "Umami Lab"]);
      assert.equal(await page.locator(".vendor-badge").count(), 3);
      for (const [cuisine, count] of [["All", 8], ["Mexican", 1], ["Asian", 1], ["BBQ", 1], ["Vegan", 1], ["Seafood", 1], ["Desserts", 1], ["Fusion", 2], ["Mediterranean", 1]]) {
        await page.locator(`[data-cuisine="${cuisine}"]`).click();
        await expect(page.locator(".vendor-card")).toHaveCount(count);
        await expect(page.locator(`[data-cuisine="${cuisine}"]`)).toHaveAttribute("aria-pressed", "true");
      }
      await page.locator('.map-legend [data-zone="B"]').click();
      await expect(page.locator(".empty-vendors")).toBeVisible();
      await expect(page.locator("#vendor-count")).toHaveText("0 of 8 featured trucks · Zone B · Mediterranean");
      await page.locator(".reset-filters").click();
      await expect(page.locator(".vendor-card")).toHaveCount(8);
      await page.locator('.map-legend [data-zone="A"]').click();
      await expect(page.locator(".vendor-card")).toHaveCount(3);
      await page.locator(".reset-filters").click();
      await page.getByRole("button", { name: "Meet Green Machine" }).click();
      await expect(page.locator("#info-content img")).toHaveAttribute("alt", /falafel/);
      await page.locator("#vendor-map").click();
      await expect(page.locator("#info-dialog")).not.toBeVisible();
      await expect(page.locator('.map-legend [data-zone="C"]')).toBeFocused();
      await page.getByRole("button", { name: "View All 50+ Trucks" }).click();
      await expect(page.locator("#directory article")).toHaveCount(8);
      await page.locator("#lineup-search").fill("corn dog");
      await expect(page.locator("#directory h3")).toHaveText("Umami Lab");
      await page.locator("#lineup-search").fill('<img src=x onerror="window.unsafe=1">');
      await expect(page.locator("#directory article")).toHaveCount(0);
      assert.equal(await page.evaluate(() => window.unsafe), undefined);
      await page.locator("#lineup-search").fill("");
      await page.locator("#lineup-cuisine").selectOption("Fusion");
      await expect(page.locator("#directory article")).toHaveCount(2);
      await closeDetails(page);
    } finally { await context.close(); }
  });
  await t.test("thirteen map places, actual PDF, list access, zoom reset and facility explanations work", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(await page.locator(".map-pins button").count(), 13);
      await page.getByRole("button", { name: "Zoom map", exact: true }).click();
      await expect(page.locator(".map-canvas")).toHaveClass(/zoomed/);
      assert.equal(await page.locator(".map-viewport").evaluate((element) => element.scrollWidth > element.clientWidth), true);
      await page.locator("#map-reset").click();
      await expect(page.locator(".map-canvas")).not.toHaveClass(/zoomed/);
      await page.getByRole("button", { name: "List View", exact: true }).click();
      await expect(page.locator(".map-viewport")).toBeHidden();
      await expect(page.locator(".map-list")).toBeVisible();
      assert.equal(await page.locator(".map-list button").count(), 13);
      await page.locator(".map-list").getByRole("button", { name: /Beer & Cocktail Garden/ }).click();
      await expect(page.locator("#info-content")).toContainText("21+ with valid ID");
      await closeDetails(page);
      await page.locator(".map-list").getByRole("button", { name: /Zone C/ }).click();
      await expect(page.locator(".vendor-card")).toHaveCount(2);
      await page.getByRole("button", { name: "Map View", exact: true }).click();
      await expect(page.locator(".map-viewport")).toBeVisible();
      const url = await page.getByRole("link", { name: "Download PDF Map", exact: true }).getAttribute("href");
      const pdf = await page.request.get(new URL(url, page.url()).href);
      assert.equal(pdf.status(), 200);
      const bytes = await pdf.body();
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
      assert.ok(bytes.length > 20000);
      assert.equal((await readFile(path.join(model, "assets", "festival-map.pdf"))).equals(bytes), true);
    } finally { await context.close(); }
  });
  await t.test("all nineteen source events and roving keyboard day tabs preserve honest dates and business numbers", async () => {
    const { page, context } = await visit();
    try {
      await expect(page.locator(".day-tabs [role=tab]")).toHaveText(["Friday Jul 25", "Saturday Jul 26", "Sunday Jul 27"]);
      await expect(page.locator(".timeline-row")).toHaveCount(6);
      await expect(page.locator("#schedule-panel")).toContainText("12 contestants. 5 minutes.");
      await page.getByRole("tab", { name: "Friday Jul 25" }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Saturday Jul 26" })).toBeFocused();
      await expect(page.locator(".timeline-row")).toHaveCount(7);
      await expect(page.locator("#schedule-panel")).toContainText("$15 add-on");
      await expect(page.locator("#schedule-panel")).toContainText("The Street Food Revolution");
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Sunday Jul 27" })).toHaveAttribute("aria-selected", "true");
      await expect(page.locator(".timeline-row")).toHaveCount(6);
      await expect(page.locator("#schedule-panel")).toContainText("Best Truck, Best Dessert, Most Creative, People's Choice.");
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Friday Jul 25" })).toBeFocused();
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByRole("tab", { name: "Sunday Jul 27" })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(page.locator('#day-0')).toHaveAttribute("tabindex", "0");
      await expect(page.locator('#day-1')).toHaveAttribute("tabindex", "-1");
      await expect(page.locator(".schedule-caveat")).toContainText("Saturday–Monday");
    } finally { await context.close(); }
  });
  await t.test("ticket tiers calculate exact totals and group boundaries, reject invalid quantities and issue no tickets", async () => {
    const { page, context } = await visit();
    try {
      for (const [tier, price] of [["day", "$15.00"], ["weekend", "$35.00"], ["vip", "$89.00"]]) {
        await page.locator(`[data-ticket="${tier}"]`).click();
        await expect(page.locator(".ticket-summary")).toContainText(price);
        assert.equal(await page.locator('[name="day"]').isDisabled(), tier !== "day");
        await closeDetails(page);
      }
      await page.locator('[data-ticket="weekend"]').click();
      const form = page.locator("#ticket-form");
      await form.locator('[name="quantity"]').fill("7");
      await form.locator('[name="code"]').fill(" crew20 ");
      await expect(page.locator(".ticket-summary>div:last-child dd")).toHaveText("$245.00");
      await expect(page.locator(".coupon-status")).toContainText("at least 8");
      await form.locator('[name="quantity"]').fill("8");
      await expect(page.locator(".ticket-summary>div:last-child dd")).toHaveText("$224.00");
      await expect(page.locator(".ticket-summary")).toContainText("−$56.00");
      await form.locator('[name="pass"]').selectOption("vip");
      await expect(page.locator(".ticket-summary>div:last-child dd")).toHaveText("$569.60");
      for (const [value, reason] of [["0", "rangeUnderflow"], ["21", "rangeOverflow"], ["1.5", "stepMismatch"]]) {
        await form.locator('[name="quantity"]').fill(value);
        assert.equal(await form.locator('[name="quantity"]').evaluate((input, key) => input.validity[key], reason), true);
        await form.getByRole("button", { name: "Preview My Festival Plan" }).click();
        await expect(form).toBeVisible();
        await expect(page.locator(".ticket-summary")).toContainText("Enter 1–20 whole guests");
      }
      await form.locator('[name="quantity"]').fill("8");
      await form.locator('[name="code"]').fill("WRONG");
      await expect(page.locator(".ticket-summary>div:last-child dd")).toHaveText("$712.00");
      await form.locator('[name="pass"]').selectOption("day");
      await form.locator('[name="code"]').fill("CREW20");
      await form.locator('[name="day"]').selectOption("2026-07-26");
      await form.getByRole("button", { name: "Preview My Festival Plan" }).click();
      await expect(page.locator("#info-content .result")).toContainText("$96.00");
      await expect(page.locator("#info-content .result")).toContainText("July 26, 2026 — Sunday");
      await expect(page.locator("#info-content .result")).toContainText("No ticket issued");
      await expect(form).toHaveCount(0);
      await closeDetails(page);
      await expect(page.locator('[data-ticket="weekend"]')).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("original local demo audio really plays, advances, pauses exclusively and resets on completion", async () => {
    const { page, context } = await visit();
    try {
      await page.getByRole("button", { name: "Play Neon Flavor demo loop" }).click();
      await page.waitForFunction(() => document.querySelector("#audio-0").currentTime > .25);
      await expect(page.locator('[data-audio="0"]')).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: "Play The Saucy Peppers demo loop" }).click();
      await page.waitForFunction(() => document.querySelector("#audio-1").currentTime > .2);
      assert.equal(await page.locator("#audio-0").evaluate((audio) => audio.paused), true);
      await page.getByRole("button", { name: "Pause The Saucy Peppers demo loop" }).click();
      assert.equal(await page.locator("#audio-1").evaluate((audio) => audio.paused), true);
      await page.getByRole("button", { name: "Play Rosemary & Thyme demo loop" }).click();
      await page.waitForFunction(() => document.querySelector("#audio-2").currentTime > .2);
      await page.waitForFunction(() => {
        const audio = document.querySelector("#audio-2");
        return audio.paused && audio.currentTime === 0;
      }, undefined, { timeout: 12000 });
      await expect(page.locator('[data-audio="2"]')).toHaveAttribute("aria-pressed", "false");
      assert.equal(await page.locator("#audio-2").evaluate((audio) => audio.currentTime), 0);
      await expect(page.locator("#music")).toContainText("not artist recordings");
    } finally { await context.close(); }
  });
  await t.test("eight FAQs, every footer action, safe local form preview and newsletter work without persistence", async () => {
    const { page, context } = await visit();
    try {
      assert.equal(await page.locator(".faq-items details").count(), 8);
      for (const question of await page.locator(".faq-items summary").all()) {
        await question.click();
        assert.equal(await question.evaluate((element) => element.parentElement.open), true);
        await question.click();
      }
      await page.locator('footer [data-info="privacy"]').click();
      await expect(page.locator("#info-content")).toContainText("no analytics");
      await page.keyboard.press("Escape");
      await expect(page.locator('#info-dialog')).not.toBeVisible();
      for (const button of await page.locator("footer [data-info]").all()) {
        await button.click();
        await expect(page.locator("#info-dialog")).toBeVisible();
        assert.ok((await page.locator("#info-content").innerText()).trim().length > 40);
        await closeDetails(page);
      }
      for (const name of ["vendor", "sponsor", "volunteer", "contact"]) {
        await page.locator(`footer [data-info="${name}"]`).click();
        const form = page.locator("#interest-form");
        await form.getByRole("button", { name: /^Preview/ }).click();
        await expect(form).toBeVisible();
        await form.locator('[name="name"]').fill('<img src=x onerror="window.unsafe=1">');
        await form.locator('[name="email"]').fill("preview@example.test");
        if (await form.locator('[name="organization"]').count()) await form.locator('[name="organization"]').fill("Local sample");
        if (await form.locator('[name="needs"]').count()) await form.locator('[name="needs"]').fill("20 ft, 30 A");
        await form.locator('[name="message"]').fill("<script>window.unsafe=1</script>Local preview only");
        await form.getByRole("button", { name: /^Preview/ }).click();
        await expect(page.locator("#info-content .result")).toContainText("<script>window.unsafe=1</script>");
        assert.equal(await page.locator("#info-content .result img, #info-content .result script").count(), 0);
        assert.equal(await page.evaluate(() => window.unsafe), undefined);
        await closeDetails(page);
      }
      await page.locator("#newsletter-email").fill("preview@example.test");
      await page.getByRole("button", { name: "Sign Me Up" }).click();
      await expect(page.locator("#newsletter-status")).toContainText("No email was stored");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie]), [0, 0, ""]);
      await expect(page.locator('.sponsor-row .sponsor')).toHaveCount(6);
      const news = await page.locator('footer [data-info="directions"]').count();
      assert.equal(news, 1);
    } finally { await context.close(); }
  });
  await t.test("five responsive widths, mobile navigation, real swipe and reduced-motion behavior work", async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const { page, context } = await visit({ viewport: { width, height: 1000 } });
      try {
        await images(page);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`);
        const columns = await page.locator(".vendor-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
        if (width === 1024 || width === 768) assert.equal(columns, 3);
        if (width === 390) assert.equal(columns, 2);
        if (width <= 650) {
          await expect(page.locator(".mobile-bar")).toBeVisible();
          const firstTicket = await page.locator(".ticket-card").evaluateAll((cards) => [...cards].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0].querySelector("h3").textContent);
          assert.equal(firstTicket, "Weekend Pass");
          await page.getByRole("button", { name: "Open navigation" }).click();
          await expect(page.locator("#mobile-nav")).toBeVisible();
          await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "true");
          await page.keyboard.press("Escape");
          await expect(page.locator("#mobile-nav")).not.toBeVisible();
          await expect(page.locator(".nav-toggle")).toBeFocused();
          await page.getByRole("button", { name: "Open navigation" }).click();
          await page.locator("#mobile-nav").getByRole("link", { name: "Lineup" }).click();
          await expect(page.locator("#mobile-nav")).not.toBeVisible();
        }
        assert.equal(await page.locator(".confetti i").first().evaluate((element) => getComputedStyle(element).animationName), "none");
        if (width === 1440 || width === 390) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.screenshot({ path: path.join(model, ".checks", `desktop-mobile-${width}.png`), fullPage: true });
        }
      } finally { await context.close(); }
    }
    const { page, context } = await visit({ viewport: { width: 320, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
    try {
      await images(page);
      assert.equal(await page.locator(".confetti i").first().evaluate((element) => getComputedStyle(element).animationName), "confetti");
      const cdp = await context.newCDPSession(page);
      async function swipe(selector) {
        const element = page.locator(selector);
        await element.scrollIntoViewIfNeeded();
        const box = await element.boundingBox();
        const y = Math.max(100, Math.min(780, box.y + 80));
        const x = box.x + Math.min(box.width - 15, 265);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
        for (let step = 1; step <= 8; step++) {
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * 23, y }] });
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await page.waitForFunction((selector) => document.querySelector(selector).scrollLeft > 20, selector);
      }
      await swipe(".vendor-grid");
      await swipe(".artist-grid");
      await cdp.detach();
    } finally { await context.close(); }
  });
  assert.deepEqual(errors, []);
  assert.equal(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin), true);
  const digest = await StaticHomepage.validateStaticOutput(path.join(model, "out"), "food-truck-festival", "GPT-6");
  await writeFile(path.join(model, ".checks", "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest, browser: browser.version(), widths: [1440, 1024, 768, 390, 320], errors,
    checks: ["Actual public subpath with local resources", "Eight source vendors, nine filters and combined zones", "Thirteen map places, list, zoom and real PDF", "Nineteen events with keyboard tabs and date conflict disclosure", "Three ticket prices, CREW20 boundary and quantity validity", "Actual local audio playback, exclusivity and completion", "Eight FAQs and every footer action", "Safe ephemeral forms and no storage or external requests", "Five widths, actual touch swipe and reduced motion", "Desktop and mobile full-page screenshots"],
  }, null, 2) + "\n");
});
