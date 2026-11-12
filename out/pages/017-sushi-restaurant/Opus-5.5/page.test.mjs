// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/017-sushi-restaurant/Opus-5.5/page.test.mjs
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
const dateIn = (minDays, dows) => { const d = new Date(); d.setDate(d.getDate() + minDays); while (!dows.includes(d.getDay())) d.setDate(d.getDate() + 1); return d; };
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("nav turns navy on scroll and sections fade in", async () => {
    for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 250); await page.waitForTimeout(40); }
    await page.waitForTimeout(1000);
    assert.equal(await page.locator(".nav.solid").count(), 1);
    assert.equal(await page.evaluate(() => document.querySelectorAll(".reveal:not(.in)").length), 0);
  });
  await check("three seasonal cards with badges and origins", async () => {
    assert.deepEqual(await page.locator(".card .badge").allTextContents(), ["Peak Season", "Chef's Choice", "Limited"]);
    assert.match(await page.textContent(".card >> nth=1"), /Hokkaido, hand-harvested/);
  });
  await check("full menu modal lists nigiri and sake", async () => {
    await page.click(".seasonal [data-open=menu]");
    assert.match(await page.textContent("[data-full-menu]"), /Otoro[\s\S]*Dassai 23/);
    await page.keyboard.press("Escape");
  });
  await check("gallery lightbox navigates with keys", async () => {
    await page.click('[data-g="4"]');
    assert.match(await page.textContent("[data-lb-cap]"), /noren.*5 \/ 6/);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("[data-lb-cap]"), /omakase course.*6 \/ 6/);
    await page.keyboard.press("ArrowRight");
    assert.match(await page.textContent("[data-lb-cap]"), /1 \/ 6/);
    await page.keyboard.press("Escape");
  });
  await check("omakase restricts times to 6:00/8:30 and bar offers seven slots", async () => {
    assert.deepEqual(await page.locator("[data-time] option").allTextContents(), ["6:00 PM", "8:30 PM"]);
    await page.check("[name=pref][value=bar]", { force: true });
    assert.equal(await page.locator("[data-time] option").count(), 7);
    await page.check("[name=pref][value=omakase]", { force: true });
  });
  await check("closed days and 48-hour omakase notice are enforced", async () => {
    const f = "[data-res]";
    await page.fill(`${f} [name=name]`, "Mina Park");
    await page.fill(`${f} [name=email]`, "mina@example.com");
    await page.fill(`${f} [name=date]`, iso(dateIn(3, [1])));
    await page.dispatchEvent(`${f} [name=date]`, "change");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-err]"), /closed Sunday and Monday/);
    const soon = new Date(); soon.setDate(soon.getDate() + 1);
    if (![0, 1].includes(soon.getDay())) {
      await page.fill(`${f} [name=date]`, iso(soon));
      await page.dispatchEvent(`${f} [name=date]`, "change");
      await page.click(`${f} [type=submit]`);
      assert.match(await page.textContent("[data-err]"), /48 hours/);
    }
  });
  await check("party of 6+ suggests private dining and a valid request confirms", async () => {
    const f = "[data-res]";
    await page.selectOption("[data-party]", "6");
    assert.match(await page.textContent("[data-hint]"), /private dining/);
    await page.fill(`${f} [name=date]`, iso(dateIn(5, [2, 3, 4, 5, 6])));
    await page.dispatchEvent(`${f} [name=date]`, "change");
    await page.selectOption("[data-time]", "8:30 PM");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-done-text]"), /Omakase counter for 6 on .* at 8:30 PM.*HK-\d{4}/);
  });
  await check("newsletter validates email", async () => {
    await page.fill("#news-email", "x");
    await page.click("[data-news] button");
    assert.match(await page.textContent("[data-news-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, slide-down menu, stacked cards, 2-col gallery, swipe reviews", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    await m.page.click("[data-burger]");
    assert.equal(await m.page.locator("#mnav").isVisible(), true);
    await m.page.click("#mnav >> text=Gallery");
    assert.equal(await m.page.locator("#mnav").isVisible(), false);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".cards")).gridTemplateColumns.split(" ").length), 1);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".gallery")).gridTemplateColumns.split(" ").length), 2);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-reviews]")).display), "flex");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
