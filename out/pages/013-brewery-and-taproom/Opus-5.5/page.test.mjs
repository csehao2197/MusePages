// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/013-brewery-and-taproom/Opus-5.5/page.test.mjs
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

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hours badge reflects the Asheville schedule", async () => {
    assert.match(await page.textContent("[data-hours-text]"), /^(Open Today: \d{1,2}(AM|PM)–\d{1,2}PM|Opens Today at \d{1,2}(AM|PM)|Closed · Open Tomorrow \d{1,2}(AM|PM))$/);
    assert.equal(await page.locator(".hours .today").count(), 1);
  });
  await check("tap list shows 12 beers with family borders and filters", async () => {
    assert.equal(await page.locator(".beer").count(), 12);
    assert.equal(await page.locator(".beer .tag").count(), 4);
    await page.click('button[data-fam="hop"]');
    assert.equal(await page.locator(".beer:not([hidden])").count(), 3);
    await page.click('button[data-fam="dark"]');
    assert.deepEqual(await page.locator(".beer:not([hidden]) h3").allTextContents(), ["Dark Hollow", "Night Shift"]);
    await page.click('button[data-fam="all"]');
  });
  await check("beer menu PDF downloads with valid structure", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#tap [data-pdf]")]);
    const pdf = (await readFile(await dl.path())).toString("latin1");
    const x = +pdf.match(/startxref\n(\d+)/)[1];
    assert.equal(pdf.slice(x, x + 4), "xref");
    assert.match(pdf, /NIGHT SHIFT/);
  });
  await check("VIP tour booking offers Fridays, totals guests and validates age", async () => {
    await page.click('[data-book="vip"]');
    const dates = await page.locator("[data-dates] option").allTextContents();
    assert.ok(dates.length >= 6 && dates.every((d) => d.startsWith("Fri")));
    await page.click('[data-g="1"]');
    await page.click('[data-g="1"]');
    assert.equal(await page.textContent("[data-total]"), "$180");
    for (let i = 0; i < 12; i++) await page.click('[data-g="1"]');
    assert.equal(await page.inputValue("[name=guests]"), "12");
    await page.fill("[data-tour-form] [name=name]", "Sam Cole");
    await page.fill("[data-tour-form] [name=phone]", "(828) 555-0199");
    await page.fill("[data-tour-form] [name=email]", "sam@example.com");
    await page.click("[data-tour-form] [type=submit]");
    assert.match(await page.textContent("[data-tour-form] [data-err]"), /21 or older/);
    await page.check("[data-tour-form] [name=age]");
    await page.click("[data-tour-form] [type=submit]");
    assert.match(await page.textContent('[data-modal="tour"] [data-done]'), /VIP Brewer's Experience for 12 on Friday.*\$540/);
    await page.click('[data-modal="tour"] .done [data-close]');
  });
  await check("standard tour lists weekend dates only", async () => {
    await page.click('.tour:not(.vip) [data-book]');
    const dates = await page.locator("[data-dates] option").allTextContents();
    assert.ok(dates.every((d) => /^(Sat|Sun)/.test(d)));
    assert.deepEqual(await page.locator("[data-times] option").allTextContents(), ["1:00 PM", "3:00 PM"]);
    await page.keyboard.press("Escape");
  });
  await check("event Add to calendar produces an .ics file", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click('[data-ics="trivia"]')]);
    const ics = await readFile(await dl.path(), "utf8");
    assert.match(ics, /BEGIN:VEVENT[\s\S]*RRULE:FREQ=WEEKLY;BYDAY=WE[\s\S]*SUMMARY:Trivia Night/);
  });
  await check("beer finder filters by zip and highlights pins", async () => {
    await page.fill("[data-zip]", "28655");
    assert.deepEqual(await page.locator(".locs li:not([hidden]) b").allTextContents(), ["Fonta Flora State of Confusion", "Ingles Markets"]);
    assert.equal(await page.locator(".pin.dim").count(), 6);
    await page.fill("[data-zip]", "28801");
    // Exact 28801 stockists plus the rest of the 288xx Asheville area.
    assert.equal(await page.locator(".locs li:not([hidden])").count(), 7);
    await page.fill("[data-zip]", "90210");
    assert.match(await page.textContent("[data-loc-count]"), /No stockists/);
    await page.fill("[data-zip]", "");
    await page.click('[data-pin="3"]');
    assert.equal(await page.getAttribute('[data-loc="3"]', "class"), "loc on");
  });
  await check("newsletter validates email", async () => {
    await page.fill("#news-email", "x@");
    await page.click("[data-news] button");
    assert.match(await page.textContent("[data-news-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, Visit CTA, badge below CTAs, single-column taps", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.locator(".btn-mini").isVisible(), true);
    const [cta, badge] = await Promise.all([m.page.locator(".ctas").boundingBox(), m.page.locator("[data-hours-badge]").boundingBox()]);
    assert.ok(badge.y > cta.y);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".taps")).gridTemplateColumns.split(" ").length), 1);
  });
  await check("mobile: footer columns are collapsible accordions", async () => {
    assert.equal(await m.page.locator(".col[open]").count(), 0);
    await m.page.click(".col >> nth=1 >> summary");
    assert.equal(await m.page.locator(".col[open]").count(), 1);
  });
  await check("mobile: taproom gallery swipes with dots", async () => {
    await m.page.evaluate(() => { const c = document.querySelector("[data-collage]"); c.scrollTo({ left: c.clientWidth }); });
    await m.page.waitForTimeout(300);
    assert.equal(await m.page.locator("[data-col-dots] i.on").evaluate((el) => [...el.parentElement.children].indexOf(el)), 1);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
