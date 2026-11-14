// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/016-food-truck-festival/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
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
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, acceptDownloads: true });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  return { context, page };
}
const visibleNames = (page) => page.locator(".truck:not([hidden]) h3").allTextContents();

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("lineup shows 8 trucks and filters by cuisine", async () => {
    assert.equal(await page.locator(".truck").count(), 8);
    await page.click('[data-c="Asian"]');
    assert.deepEqual(await visibleNames(page), ["Bao Down", "Umami Lab"]);
    await page.click('[data-c="Vegan"]');
    assert.deepEqual(await visibleNames(page), ["Green Machine"]);
    await page.click('[data-c="All"]');
  });
  await check("clicking a map zone filters the lineup, combined with cuisine", async () => {
    await page.click('.zone-poly[data-z="A"]', { force: true });
    assert.deepEqual(await visibleNames(page), ["Taco Libre", "Holy Smoke BBQ", "Naan Stop"]);
    assert.match(await page.textContent("[data-zone-note]"), /Zone A/);
    await page.click('[data-c="BBQ"]');
    assert.deepEqual(await visibleNames(page), ["Holy Smoke BBQ"]);
    await page.click('[data-c="Seafood"]');
    assert.equal(await page.locator("[data-empty]").isVisible(), true);
    await page.click("[data-clear-zone]");
    assert.deepEqual(await visibleNames(page), ["Catch of the Day"]);
    await page.click('[data-c="All"]');
  });
  await check("map legend zone button and list view toggle", async () => {
    await page.click('[data-legend-z="C"]');
    assert.deepEqual(await visibleNames(page), ["Green Machine", "Sugar Rush"]);
    await page.click("[data-clear-zone]");
    await page.click('[data-view="list"]');
    assert.equal(await page.locator("[data-map-list]").isVisible(), true);
    assert.match(await page.textContent("[data-map-list]"), /Zone B · Center[\s\S]*Bao Down, Catch of the Day, Umami Lab/);
    await page.click('[data-view="map"]');
  });
  await check("PDF map downloads with valid structure", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-pdf]")]);
    const pdf = (await readFile(await dl.path())).toString("latin1");
    const x = +pdf.match(/startxref\n(\d+)/)[1];
    assert.equal(pdf.slice(x, x + 4), "xref");
    assert.match(pdf, /ZONE A \\\(West\\\)/); // parentheses are escaped in PDF strings
  });
  await check("schedule tabs switch days via click and arrow keys", async () => {
    assert.equal(await page.locator("[data-sched] li").count(), 6);
    await page.click("#d1");
    assert.match(await page.textContent("[data-sched]"), /Headliner: Neon Flavor/);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("[data-sched]"), /Awards ceremony/);
  });
  await check("tickets: quantities, CREW20 needs 8+, total and confirmation", async () => {
    await page.click('[data-buy="weekend"]');
    assert.equal(await page.textContent("[data-total]"), "$35.00");
    await page.fill("#promo", "CREW20");
    await page.click("[data-apply]");
    assert.match(await page.textContent("[data-promo-msg]"), /add 7 more/);
    for (let i = 0; i < 7; i++) await page.click('[data-q="weekend"][data-d="1"]');
    assert.equal(await page.textContent("[data-sub]"), "$280.00");
    assert.equal(await page.textContent("[data-total]"), "$224.00");
    await page.click('[data-q="day"][data-d="1"]');
    assert.equal(await page.locator("[data-day-pick]").isVisible(), true);
    await page.click("[data-co] [type=submit]");
    assert.match(await page.textContent('[data-modal="checkout"] [data-err]'), /valid email/);
    await page.fill("[data-co] [name=email]", "crew@example.com");
    await page.click("[data-co] [type=submit]");
    assert.match(await page.textContent('[data-modal="checkout"] [data-done]'), /9 tickets · \$236\.00 · day pass for Friday/);
    await page.click('[data-modal="checkout"] .done [data-close]');
  });
  await check("music previews play and only one plays at a time", async () => {
    await page.click('[data-player="0"] .play');
    await page.waitForTimeout(1300);
    assert.equal(await page.getAttribute('[data-player="0"] .play', "aria-pressed"), "true");
    assert.notEqual(await page.textContent('[data-player="0"] [data-t]'), "0:00 / 0:30 preview");
    await page.click('[data-player="2"] .play');
    assert.equal(await page.getAttribute('[data-player="0"] .play', "aria-pressed"), "false");
    assert.equal(await page.getAttribute('[data-player="2"] .play', "aria-pressed"), "true");
    await page.click('[data-player="2"] .play');
  });
  await check("FAQ has 8 questions that expand", async () => {
    assert.equal(await page.locator(".faq details").count(), 8);
    await page.click(".faq summary >> text=What if it rains?");
    assert.equal(await page.locator(".faq details[open]").count(), 1);
  });
  await check("newsletter validates email", async () => {
    await page.fill("#news-email", "bad");
    await page.click("[data-news] button");
    assert.match(await page.textContent("[data-news-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, yellow overlay nav, sticky ticket bar", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    await m.page.click("[data-burger]");
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("#overlay")).backgroundColor), "rgb(254, 240, 138)");
    await m.page.click("#overlay >> text=Schedule");
    assert.equal(await m.page.locator("#overlay").isVisible(), false);
    assert.equal(await m.page.locator(".sticky-bar").isVisible(), true);
  });
  await check("mobile: 2-col trucks, scrollable map, best value first, music scroll", async () => {
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".trucks")).gridTemplateColumns.split(" ").length), 2);
    assert.equal(await m.page.evaluate(() => { const s = document.querySelector(".map-scroll"); return s.scrollWidth > s.clientWidth; }), true);
    const [best, day] = await Promise.all([m.page.locator(".tier.best").boundingBox(), m.page.locator(".tier >> nth=0").boundingBox()]);
    assert.ok(best.y < day.y);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".artists")).display), "flex");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
