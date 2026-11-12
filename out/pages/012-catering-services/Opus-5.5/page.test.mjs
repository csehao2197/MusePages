// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/012-catering-services/Opus-5.5/page.test.mjs
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
const future = (days) => { const d = new Date(Date.now() + days * 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero background moves with parallax on scroll", async () => {
    await page.mouse.wheel(0, 400);
    await page.waitForFunction(() => /translate3d\(0px, [1-9]/.test(document.querySelector("[data-parallax]").style.transform));
    assert.equal(await page.locator(".nav.solid").count(), 1);
  });
  await check("service cards lift on hover", async () => {
    const card = page.locator(".svc").first();
    await card.hover();
    await page.waitForTimeout(400);
    assert.match(await card.evaluate((el) => getComputedStyle(el).transform), /matrix\(1, 0, 0, 1, 0, -/);
  });
  await check("menu tabs switch packages via click and keyboard", async () => {
    assert.equal(await page.locator("#p-classic").isVisible(), true);
    await page.click("#t-premium");
    assert.equal(await page.locator("#p-premium").isVisible(), true);
    assert.equal(await page.locator("#p-classic").isVisible(), false);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("#p-luxury"), /wagyu/);
  });
  await check("choosing a package pre-fills the inquiry and estimate", async () => {
    await page.click('[data-choose="Luxury"]');
    await page.selectOption("[data-inquiry] [name=type]", "Wedding");
    await page.fill("[data-inquiry] [name=guests]", "120");
    assert.equal(await page.textContent("[data-est]"), "$10,200");
    await page.selectOption("[data-inquiry] [name=package]", "");
    assert.equal(await page.textContent("[data-est]"), "$9,000 – $13,200");
  });
  await check("gallery filters by category and opens lightbox within the filter", async () => {
    await page.click('[data-filter="Corporate"]');
    assert.equal(await page.locator(".ev:not([hidden])").count(), 2);
    await page.click(".ev:not([hidden]) [data-ev] >> nth=0");
    assert.match(await page.textContent("[data-lb-cap]"), /Northbeam/);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("[data-lb-cap]"), /Meridian/);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("[data-lb-cap]"), /Northbeam/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-lb]").isVisible(), false);
    await page.click('[data-filter="all"]');
  });
  await check("testimonial slider navigates with dots and arrows", async () => {
    await page.click("[data-sdots] button >> nth=2");
    assert.match(await page.textContent('.quote[aria-hidden="false"] blockquote'), /vegan/);
    await page.click('[data-s="1"]');
    assert.match(await page.textContent('.quote[aria-hidden="false"] blockquote'), /wedding reception/);
  });
  await check("inquiry form validates guest range and date, then confirms", async () => {
    const f = "[data-inquiry]";
    await page.fill(`${f} [name=name]`, "Dana Whitfield");
    await page.fill(`${f} [name=email]`, "dana@example.com");
    await page.fill(`${f} [name=phone]`, "(555) 111-2222");
    await page.fill(`${f} [name=guests]`, "800");
    await page.fill(`${f} [name=date]`, future(2));
    await page.fill(`${f} [name=venue]`, "Riverside Hall");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [name=guests] + small`), /20 to 500/);
    assert.match(await page.textContent(`${f} [name=date] + small`), /one week/);
    await page.fill(`${f} [name=guests]`, "120");
    await page.fill(`${f} [name=date]`, future(60));
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-done-text]"), /Thanks, Dana.*wedding.*120 guests.*SA-\d{5}/);
    await page.click("[data-again]");
    assert.equal(await page.locator(f).isVisible(), true);
  });
  await check("FAQ keeps one answer open at a time", async () => {
    await page.click(".faq details >> nth=3 >> summary");
    await page.waitForFunction(() => document.querySelectorAll(".faq details[open]").length === 1);
    assert.match(await page.textContent(".faq details[open]"), /Full refund 30\+ days/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, menu toggles, stacked cards", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    await m.page.click("[data-burger]");
    assert.equal(await m.page.locator("#mnav").isVisible(), true);
    await m.page.click("#mnav >> text=FAQ");
    assert.equal(await m.page.locator("#mnav").isVisible(), false);
    const cols = await m.page.evaluate(() => getComputedStyle(document.querySelector(".svc-grid")).gridTemplateColumns.split(" ").length);
    assert.equal(cols, 1);
  });
  await check("mobile: testimonial swipe advances", async () => {
    const box = await m.page.locator("[data-slides]").boundingBox();
    await m.page.locator("[data-slides]").scrollIntoViewIfNeeded();
    const b = await m.page.locator("[data-slides]").boundingBox();
    const cdp = await m.context.newCDPSession(m.page);
    const y = b.y + 60;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 120, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.ok(box);
    assert.match(await m.page.textContent('.quote[aria-hidden="false"] blockquote'), /corporate events/);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
