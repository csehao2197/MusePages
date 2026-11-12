// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/014-farm-to-table-restaurant/Opus-5.5/page.test.mjs
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
const nextDow = (dow, minDays = 1) => { const d = new Date(); d.setDate(d.getDate() + minDays); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero vine line drawing animates to completion", async () => {
    await page.waitForTimeout(2300);
    const offsets = await page.$$eval(".draw path", (ps) => ps.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)));
    assert.ok(offsets.every((o) => o < 0.01), `offsets ${offsets}`);
  });
  await check("menu tabs show starters, mains and desserts with keyboard support", async () => {
    assert.equal(await page.locator(".dish").count(), 4);
    assert.match(await page.textContent(".dish >> nth=0"), /Heirloom Tomato Gazpacho.*\$14/);
    await page.click("#tab-mains");
    assert.match(await page.textContent("[data-panel]"), /Grass-Fed Ribeye[\s\S]*\$42/);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator(".dish").count(), 3);
    assert.equal(await page.inputValue("[data-tab-select]"), "2");
  });
  await check("farm Learn More highlights the farm and its map pin", async () => {
    await page.click('[data-learn="creamery"]');
    assert.equal(await page.locator('.farm.on').getAttribute("data-farm"), "creamery");
    assert.equal(await page.locator('[data-mpin="creamery"].on').count(), 1);
    assert.match(await page.textContent("[data-farm-note]"), /22 miles west/);
  });
  await check("gallery lightbox opens with captions and arrow navigation", async () => {
    await page.click('[data-g="hands"]');
    assert.match(await page.textContent("[data-lb-cap]"), /hands plating/);
    await page.click('[data-lb-step="1"]');
    assert.match(await page.textContent("[data-lb-cap]"), /patio/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-lb]").isVisible(), false);
  });
  await check("farm dinner booking totals seats and reduces availability", async () => {
    await page.click('[data-open="farm"]');
    await page.fill('[data-modal="farm"] [name=name]', "Mara Ellis");
    await page.fill('[data-modal="farm"] [name=email]', "mara@example.com");
    await page.selectOption("[data-seat-select]", "3");
    assert.equal(await page.textContent("[data-farm-total]"), "$375");
    await page.click('[data-modal="farm"] [type=submit]');
    assert.match(await page.textContent('[data-modal="farm"] [data-done]'), /3 seats held for Mara.*\$375/);
    assert.equal(await page.textContent("[data-seats]"), "11 of 40 seats left");
    await page.click('[data-modal="farm"] .m-done [data-close]');
  });
  await check("private dining inquiry rejects Mondays", async () => {
    await page.click('[data-open="private"]');
    const f = '[data-modal="private"]';
    await page.fill(`${f} [name=name]`, "Theo Grant");
    await page.fill(`${f} [name=email]`, "theo@example.com");
    await page.fill(`${f} [name=date]`, nextDow(1, 8));
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-err]`), /Tuesday–Sunday/);
    await page.fill(`${f} [name=date]`, nextDow(5, 8));
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent(`${f} [data-done]`), /Theo.*12 guests.*Friday/);
    await page.click(`${f} .m-done [data-close]`);
  });
  await check("reviews auto-advance every 6 seconds and use dots", async () => {
    await page.mouse.move(2, 2);
    const start = await page.evaluate(() => MuseReviews.index());
    await page.waitForTimeout(6300);
    assert.equal(await page.evaluate(() => MuseReviews.index()), (start + 1) % 3);
    await page.click("[data-rv-dots] button >> nth=2");
    assert.match(await page.textContent('.rv[aria-hidden="false"] blockquote'), /risotto/);
  });
  await check("reservation times follow the day: dinner, Sunday brunch, Monday closed", async () => {
    await page.fill("[data-res] [name=date]", nextDow(3, 2));
    await page.dispatchEvent("[data-res] [name=date]", "change");
    const wed = await page.locator("[data-time] option").allTextContents();
    assert.equal(wed[1], "5:00 PM"); assert.equal(wed.at(-1), "9:30 PM"); assert.equal(wed.length, 11); // placeholder + 10 half-hour slots
    await page.fill("[data-res] [name=date]", nextDow(0, 2));
    await page.dispatchEvent("[data-res] [name=date]", "change");
    const sun = await page.locator("[data-time] option").allTextContents();
    assert.equal(sun[1], "10:00 AM"); assert.equal(sun.at(-1), "1:30 PM");
    await page.fill("[data-res] [name=date]", nextDow(1, 2));
    await page.dispatchEvent("[data-res] [name=date]", "change");
    assert.match(await page.textContent("[data-day-note]"), /closed on Mondays/);
    assert.equal(await page.locator("[data-party] option").count(), 12);
  });
  await check("reservation validates and confirms", async () => {
    const f = "[data-res]";
    await page.click(`${f} [type=submit]`);
    assert.notEqual(await page.textContent("[data-res-err]"), "");
    await page.fill(`${f} [name=date]`, nextDow(6, 2));
    await page.dispatchEvent(`${f} [name=date]`, "change");
    await page.selectOption("[data-time]", "7:00 PM");
    await page.selectOption("[data-party]", "4");
    await page.fill(`${f} [name=name]`, "Ana Ruiz");
    await page.fill(`${f} [name=email]`, "ana@example.com");
    await page.fill(`${f} [name=phone]`, "555 482 7700");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-res-text]"), /Ana.*table for 4 on Saturday.*7:00 PM.*HH-\d{4}/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, tabs become a dropdown, sticky reserve button", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.locator(".tabs").isVisible(), false);
    await m.page.selectOption("[data-tab-select]", "1");
    assert.match(await m.page.textContent("[data-panel]"), /Pan-Seared Trout/);
    assert.equal(await m.page.locator(".sticky-cta").isVisible(), true);
  });
  await check("mobile: gallery is a swipe carousel and farm cards stack", async () => {
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-gallery]")).display), "flex");
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".farms")).gridTemplateColumns.split(" ").length), 1);
    await m.page.locator("[data-gallery]").evaluate((g) => g.scrollTo({ left: g.querySelector(".gi").offsetWidth + 12 }));
    await m.page.waitForTimeout(300);
    assert.equal(await m.page.locator("[data-gdots] i.on").evaluate((el) => [...el.parentElement.children].indexOf(el)), 1);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
