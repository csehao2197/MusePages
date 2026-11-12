// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/011-bakery-and-cafe/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const { chromium } = await import(pathToFileURL(path.join(root, "node_modules/playwright/index.mjs")).href);
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/generate-preview.mjs")).href);
const server = await startPreviewServer(path.join(here, "out"), { workspace: root });
const browser = await chromium.launch();
const errors = [], results = [];
const check = async (name, fn) => { await fn(); results.push(`ok - ${name}`); };
async function open(viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  return { context, page };
}

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("page loads at the top with a transparent nav that turns solid on scroll", async () => {
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.equal(await page.locator(".nav.solid").count(), 0);
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(() => document.querySelector(".nav").classList.contains("solid"));
    await page.evaluate(() => scrollTo(0, 0));
  });
  await check("menu tabs switch panels with click and arrow keys", async () => {
    assert.match(await page.textContent("[data-panel]"), /Rye Pumpernickel/);
    assert.equal(await page.locator("[data-panel] .item").count(), 6);
    await page.click(".tab >> text=Lunch");
    assert.match(await page.textContent("[data-panel]"), /Tomato Basil Soup/);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.getAttribute(".tab >> nth=4", "aria-selected"), "true");
    assert.match(await page.textContent("[data-panel]"), /Masala Chai/);
  });
  await check("adding specials and menu items fills the order", async () => {
    await page.click('.special [data-add="sourdough"]');
    await page.click('.special [data-add="almond-croissant"]');
    await page.click('[data-panel] [data-add="espresso"]');
    assert.equal(await page.textContent("[data-count]"), "3");
    await page.click("[data-cart-open]");
    assert.equal(await page.textContent("[data-subtotal]"), "$17.50");
    await page.click('[data-q="2"][data-d="1"]');
    assert.equal(await page.textContent("[data-subtotal]"), "$20.75");
    assert.ok(await page.locator("[data-windows] input").count() > 0);
  });
  await check("checkout confirms with a pickup window and clears the order", async () => {
    await page.click("[data-checkout]");
    assert.match(await page.textContent("[data-confirm-text]"), /GC-\d{4} · \$20\.75 · ready/);
    await page.click('[data-modal="confirm"] [data-close]');
    assert.equal(await page.locator("[data-count]").isVisible(), false);
  });
  await check("gallery lightbox opens, navigates and closes", async () => {
    await page.click('[data-g="2"]');
    assert.equal(await page.textContent("[data-lb-cap]"), "Latte art at the bar");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.textContent("[data-lb-cap]"), "The morning case");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-lightbox]").isVisible(), false);
  });
  await check("reviews auto-advance every 5s and pause on hover/toggle", async () => {
    await page.evaluate(() => scrollTo(0, 0));
    await page.mouse.move(5, 5);
    const start = await page.evaluate(() => MuseCarousel.index());
    await page.waitForTimeout(5300);
    assert.equal(await page.evaluate(() => MuseCarousel.index()), (start + 1) % 4);
    await page.hover("[data-carousel]");
    assert.equal(await page.evaluate(() => MuseCarousel.paused()), true);
    await page.click("[data-dots] button >> nth=3");
    assert.match(await page.textContent(".review:not([aria-hidden=true]) blockquote"), /bread box/);
    await page.mouse.move(5, 5);
    await page.click("[data-play]");
    assert.equal(await page.evaluate(() => MuseCarousel.paused()), true);
  });
  await check("catering quote validates guest range and confirms", async () => {
    await page.click('[data-open="catering"]');
    const f = '[data-modal="catering"]';
    await page.fill(`${f} [name=name]`, "Priya");
    await page.fill(`${f} [name=email]`, "priya@example.com");
    await page.fill(`${f} [name=guests]`, "500");
    await page.click(`${f} [type=submit]`);
    assert.equal(await page.getAttribute(`${f} [name=guests]`, "aria-invalid"), "");
    await page.fill(`${f} [name=guests]`, "40");
    const d = new Date(Date.now() + 14 * 864e5);
    await page.fill(`${f} [name=date]`, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-done-text]`), /40 guests/);
    await page.click(`${f} .done [data-close]`);
  });
  await check("bread box gift subscription confirms recipient", async () => {
    await page.click('[data-open="subscribe"]');
    const f = '[data-modal="subscribe"]';
    await page.click(`${f} .seg label >> nth=1`);
    assert.equal(await page.textContent(`${f} [data-name-label]`), "Recipient's name");
    await page.fill(`${f} [name=name]`, "Grandma Rose");
    await page.fill(`${f} [name=address]`, "12 Oak Lane");
    await page.fill(`${f} [name=email]`, "rose@example.com");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-done-text]`), /Grandma Rose's gift box arrives .*Saturday/);
    await page.click(`${f} .done [data-close]`);
  });
  await check("crumb club validates email", async () => {
    await page.fill("#club-email", "nope");
    await page.click("[data-club] button");
    assert.match(await page.textContent("[data-club-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, sticky Order Now bar, full-screen menu", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.locator(".mobile-bar").isVisible(), true);
    await m.page.click("[data-overlay-open]");
    assert.equal(await m.page.locator("#overlay").isVisible(), true);
    await m.page.click("#overlay nav a >> text=Catering");
    assert.equal(await m.page.locator("#overlay").isVisible(), false);
  });
  await check("mobile: tabs scroll as pills and gallery is 2 columns", async () => {
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".masonry")).columnCount), "2");
    assert.equal(await m.page.evaluate(() => { const t = document.querySelector("[data-tabs]"); return t.scrollWidth > t.clientWidth; }), true);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
