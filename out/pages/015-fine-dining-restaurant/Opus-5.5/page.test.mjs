// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/015-fine-dining-restaurant/Opus-5.5/page.test.mjs
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
  await check("nav is transparent over the hero and turns black on scroll", async () => {
    assert.equal(await page.locator(".nav.solid").count(), 0);
    await page.mouse.wheel(0, 700);
    await page.waitForFunction(() => document.querySelector(".nav").classList.contains("solid"));
    await page.waitForTimeout(500); // background fades in over .4s
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".nav")).backgroundColor), "rgb(15, 15, 15)");
  });
  await check("tasting menu lists seven courses with five pairings, toggles pairings and vegetarian", async () => {
    assert.equal(await page.locator(".course").count(), 7);
    assert.equal(await page.locator(".pairing:visible").count(), 5);
    await page.click("[data-pairings]");
    assert.equal(await page.locator(".pairing:visible").count(), 0);
    await page.click("[data-pairings]");
    await page.click("[data-veg]");
    assert.match(await page.textContent("[data-courses]"), /Wild Mushroom Wellington/);
    assert.doesNotMatch(await page.textContent("[data-courses]"), /Duck|Scallop|Turbot/);
    await page.click("[data-veg]");
  });
  await check("gallery images move with parallax while scrolling", async () => {
    await page.locator(".gallery").scrollIntoViewIfNeeded();
    const a = await page.locator(".gi-inner").first().evaluate((el) => el.style.transform);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    const b = await page.locator(".gi-inner").first().evaluate((el) => el.style.transform);
    assert.match(b, /translate3d/);
    assert.notEqual(a, b);
  });
  await check("wine list modal filters by category", async () => {
    await page.click("[data-winelist]");
    assert.equal(await page.locator("[data-wl] li").count(), 13);
    await page.click("[data-wl-filter] >> text=Red");
    assert.equal(await page.locator("[data-wl] li").count(), 4);
    await page.click('[data-modal="wine"] [data-close]');
  });
  await check("private dining inquiry enforces 8–24 guests and estimates cost", async () => {
    await page.click(".private-box [data-open=private]");
    const m = '[data-modal="private"]';
    await page.fill(`${m} [name=guests]`, "16");
    assert.match(await page.textContent("[data-pd-est]"), /\$2,400 for 16/);
    await page.fill(`${m} [name=name]`, "Iris Chen");
    await page.fill(`${m} [name=email]`, "iris@example.com");
    const d = new Date(Date.now() + 20 * 864e5);
    await page.fill(`${m} [name=date]`, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.fill(`${m} [name=guests]`, "30");
    await page.click(`${m} [type=submit]`);
    assert.match(await page.textContent(`${m} [data-err]`), /8 to 24/);
    await page.fill(`${m} [name=guests]`, "16");
    await page.click(`${m} [type=submit]`);
    assert.match(await page.textContent(`${m} [data-done]`), /iris@example.com.*16/);
    await page.click(`${m} .m-done [data-close]`);
  });
  await check("reservation calendar disables Mon/Tue and past days, checks availability and confirms", async () => {
    await page.locator("#reserve").scrollIntoViewIfNeeded();
    const disabledDows = await page.$$eval("[data-cal-grid] button:disabled", (bs) => bs.map((b) => new Date(`${b.dataset.day}T00:00:00`)).filter((d) => d >= new Date(new Date().toDateString())).map((d) => d.getDay()));
    assert.ok(disabledDows.every((d) => d === 1 || d === 2));
    await page.click("[data-res] [type=submit]");
    assert.match(await page.textContent("[data-res-msg]"), /choose a date/);
    let found = false;
    for (const b of await page.$$("[data-cal-grid] button:not(:disabled)")) {
      await b.click();
      if (await page.locator('input[name=seating][value="8:30 PM"]').isEnabled()) { found = true; break; }
    }
    if (!found) { await page.click("[data-cal-next]"); await page.click("[data-cal-grid] button:not(:disabled) >> nth=0"); }
    await page.selectOption("[data-party]", "4");
    await page.check('input[name=seating]:not(:disabled) >> nth=0', { force: true });
    await page.click("[data-res] [type=submit]");
    assert.match(await page.textContent("[data-res-msg]"), /(table is available|few tables remain) for 4/);
    await page.click("[data-confirm]");
    assert.match(await page.textContent("[data-res-msg]"), /name and a valid email/);
    await page.fill("[data-res] [name=name]", "Leo Marsh");
    await page.fill("[data-res] [name=email]", "leo@example.com");
    await page.click("[data-confirm]");
    assert.match(await page.textContent("[data-res-msg]"), /Reserved: 4 guests.*AU-\d+/);
  });
  await check("9+ party opens the private dining inquiry", async () => {
    await page.selectOption("[data-party]", "9");
    assert.equal(await page.locator('[data-modal="private"]').isVisible(), true);
    assert.equal(await page.inputValue("[data-party]"), "8");
    await page.keyboard.press("Escape");
  });
  await check("hours highlight today and status is shown", async () => {
    assert.equal(await page.locator(".hours .today").count(), 1);
    assert.match(await page.textContent("[data-status]"), /Open now|Opens tonight|Closed · reopens/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, overlay nav, sticky reserve bar, 2-column gallery", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    await m.page.click("[data-burger]");
    assert.equal(await m.page.locator("#overlay").isVisible(), true);
    await m.page.click("#overlay >> text=Wine");
    assert.equal(await m.page.locator("#overlay").isVisible(), false);
    assert.equal(await m.page.locator(".sticky").isVisible(), true);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".masonry")).columnCount), "2");
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".press-row")).flexDirection), "column");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
