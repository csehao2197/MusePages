// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/018-wine-bar/Opus-5.5/page.test.mjs
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
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const next = (dows, min) => { const d = new Date(); d.setDate(d.getDate() + min); while (!dows.includes(d.getDay())) d.setDate(d.getDate() + 1); return iso(d); };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("parallax moves the hero background and nav turns solid", async () => {
    await page.mouse.wheel(0, 400);
    await page.waitForFunction(() => /translate3d\(0px, [1-9]/.test(document.querySelector("[data-parallax]").style.transform));
    assert.equal(await page.locator(".nav.solid").count(), 1);
  });
  await check("featured wine cards show flags, prices and lift on hover", async () => {
    assert.equal(await page.locator(".wine .flag").count(), 3);
    assert.deepEqual(await page.locator(".w-foot b").allTextContents(), ["$28/glass", "$22/glass", "$18/glass"]);
    const card = page.locator(".wine").first();
    await card.hover(); await page.waitForTimeout(450);
    assert.match(await card.evaluate((el) => getComputedStyle(el).transform), /matrix\(1, 0, 0, 1, 0, -/);
  });
  await check("wine list filters by color and search", async () => {
    await page.click("#wines [data-open=list]");
    assert.equal(await page.locator("[data-wl] li").count(), 12);
    await page.click("[data-wl-seg] >> text=White");
    assert.equal(await page.locator("[data-wl] li").count(), 4);
    await page.fill("[data-wl-search]", "sancerre");
    assert.equal(await page.locator("[data-wl] li").count(), 1);
    await page.click('[data-modal="list"] [data-close]');
  });
  await check("adding wines carries into the tasting booking with total and age gate", async () => {
    await page.click('[data-pour="2021 Château Margaux"]');
    await page.click(".nav-cta");
    assert.match(await page.textContent("[data-pick-list]"), /Château Margaux/);
    const f = '[data-modal="tasting"]';
    await page.fill(`${f} [name=date]`, next([2, 3, 4, 5, 6], 3));
    await page.fill(`${f} [name=guests]`, "4");
    await page.dispatchEvent(`${f} [name=guests]`, "input");
    assert.equal(await page.textContent("[data-ttotal]"), "$192");
    await page.fill(`${f} [name=name]`, "Ava Lin");
    await page.fill(`${f} [name=email]`, "ava@example.com");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-err]`), /21 or older/);
    await page.check(`${f} [name=age]`);
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-done]`), /4 guests .* \$192, featuring 2021 Château Margaux/);
    await page.click(`${f} .done [data-close]`);
  });
  await check("event booking reduces spots and updates the availability dot", async () => {
    assert.equal(await page.getAttribute(".ev >> nth=0 >> .avail", "class"), "avail amber");
    await page.click('[data-ev="0"]');
    await page.selectOption("[data-ev-seats]", "6");
    assert.equal(await page.textContent("[data-ev-total]"), "$390");
    await page.fill('[data-modal="event"] [name=email]', "ava@example.com");
    await page.click('[data-modal="event"] [type=submit]');
    assert.match(await page.textContent(".ev >> nth=0 >> .avail"), /2 spots left/);
    await page.click('[data-modal="event"] .done [data-close]');
  });
  await check("private event inquiry enforces 8–24 guests and rejects Mondays", async () => {
    await page.click(".ex-grid [data-open=inquiry]");
    const f = '[data-modal="inquiry"]';
    await page.fill(`${f} [name=name]`, "Noah Grant");
    await page.fill(`${f} [name=email]`, "noah@example.com");
    await page.fill(`${f} [name=date]`, next([1], 8));
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-err]`), /Mondays/);
    await page.fill(`${f} [name=date]`, next([5], 8));
    await page.fill(`${f} [name=guests]`, "4");
    await page.click(`${f} [type=submit]`);
    assert.notEqual(await page.textContent(`${f} [data-err]`), "");
    await page.fill(`${f} [name=guests]`, "16");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-done]`), /for 16/);
    await page.click(`${f} .done [data-close]`);
  });
  await check("gallery lightbox and 5-second testimonial auto-advance", async () => {
    await page.click('[data-g="4"]');
    assert.match(await page.textContent("[data-lb-cap]"), /sommelier/);
    await page.keyboard.press("Escape");
    await page.mouse.move(2, 2);
    const start = await page.evaluate(() => MuseTesti.index());
    await page.waitForTimeout(5300);
    assert.equal(await page.evaluate(() => MuseTesti.index()), (start + 1) % 3);
  });
  await check("visit section highlights today and newsletter validates", async () => {
    assert.equal(await page.locator(".hours .today").count(), 1);
    await page.fill("#news-email", "x");
    await page.click("[data-news] button");
    assert.match(await page.textContent("[data-news-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, slide-out drawer, stacked wines, scrolling events, 2-col gallery", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    await m.page.click("[data-burger]");
    assert.equal(await m.page.locator("#drawer").isVisible(), true);
    await m.page.click("#drawer >> text=Events");
    assert.equal(await m.page.locator("#drawer").isVisible(), false);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".wines")).gridTemplateColumns.split(" ").length), 1);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-events]")).display), "flex");
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".gallery")).columnCount), "2");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
