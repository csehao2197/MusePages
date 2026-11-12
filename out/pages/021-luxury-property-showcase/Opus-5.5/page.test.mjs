// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/021-luxury-property-showcase/Opus-5.5/page.test.mjs
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
  await check("details bar sticks below the nav while scrolling", async () => {
    await page.evaluate(() => scrollTo(0, 2500));
    await page.waitForTimeout(300);
    const top = await page.locator("[data-details]").evaluate((el) => el.getBoundingClientRect().top);
    assert.equal(Math.round(top), 68);
    assert.match(await page.textContent("[data-details]"), /4 Bedrooms[\s\S]*3\.5 Bathrooms[\s\S]*3,800 sq ft[\s\S]*42nd Floor[\s\S]*2 Parking Spaces/);
  });
  await check("gallery has 16 photos and lightbox shows the counter", async () => {
    assert.equal(await page.locator("[data-g]").count(), 16);
    await page.click('[data-g="2"]');
    assert.equal(await page.textContent("[data-lb-count]"), "3 of 16");
    await page.keyboard.press("ArrowLeft"); await page.keyboard.press("ArrowLeft"); await page.keyboard.press("ArrowLeft");
    assert.equal(await page.textContent("[data-lb-count]"), "16 of 16");
    await page.keyboard.press("Escape");
  });
  await check("floor plan rooms are selectable from plan and list, PDF downloads", async () => {
    await page.click('.room[data-room="office"]', { force: true });
    assert.match(await page.textContent("[data-plan-info]"), /Home Office — 12' × 14'/);
    await page.click('[data-rl="living"]');
    assert.match(await page.textContent("[data-plan-info]"), /Living Room — 24' × 30'/);
    assert.equal(await page.locator(".room.on").getAttribute("data-room"), "living");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-plan-pdf]")]);
    const pdf = (await readFile(await dl.path())).toString("latin1");
    const x = +pdf.match(/startxref\n(\d+)/)[1];
    assert.equal(pdf.slice(x, x + 4), "xref");
    assert.match(pdf, / re S/);
  });
  await check("features show six groups with four items each", async () => {
    assert.equal(await page.locator(".feat").count(), 6);
    assert.equal(await page.locator(".feat li").count(), 24);
  });
  await check("virtual tour pans by keyboard and hotspots; video mode plays", async () => {
    await page.locator("[data-tour]").scrollIntoViewIfNeeded();
    await page.click('[data-stop="2"]');
    await page.waitForTimeout(900);
    assert.equal(await page.evaluate(() => MuseTour.room()), "Terrace");
    await page.focus("[data-tour]");
    for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(900);
    assert.equal(await page.evaluate(() => MuseTour.room()), "Living Room");
    await page.click('[data-mode="video"]');
    await page.click("[data-vplay]");
    await page.waitForTimeout(1100);
    assert.notEqual(await page.textContent("[data-vtime]"), "0:00 / 2:30");
    await page.click("[data-vplay]");
    await page.click('[data-mode="3d"]');
  });
  await check("mortgage calculator matches the prompt and reacts to inputs", async () => {
    assert.equal(await page.textContent("[data-pay]"), "$21,793/mo");
    assert.equal(await page.textContent("[data-down-amt]"), "$840,000");
    await page.fill("[data-calc] [name=rate]", "6");
    await page.dispatchEvent("[data-calc] [name=rate]", "input");
    assert.equal(await page.textContent("[data-pay]"), "$20,145/mo");
    await page.selectOption("[data-calc] [name=term]", "15");
    assert.match(await page.textContent("[data-pay]"), /\$28,354\/mo/);
  });
  await check("viewing form validates and confirms", async () => {
    const f = "[data-view-form]";
    await page.click(`${f} [type=submit]`);
    assert.notEqual(await page.textContent("[data-view-err]"), "");
    const d = new Date(Date.now() + 4 * 864e5);
    await page.fill(`${f} [name=name]`, "Julian Hart"); await page.fill(`${f} [name=email]`, "julian@example.com"); await page.fill(`${f} [name=phone]`, "212 555 0100");
    await page.fill(`${f} [name=date]`, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.selectOption(`${f} [name=time]`, "6:00 PM (twilight)");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-view-text]"), /Julian.*6:00 PM/);
  });
  await check("similar properties list the three comparables", async () => {
    assert.match(await page.textContent("[data-similar]"), /\$3,800,000[\s\S]*The Apex, Unit 38A[\s\S]*\$4,500,000[\s\S]*Harborview Tower, PH2[\s\S]*\$3,950,000[\s\S]*One Park Place, Unit 52B/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, collapsible details, swipe gallery, accordion features, zoomable plan, floating CTA", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.locator(".dlist").isVisible(), false);
    await m.page.click("[data-details-toggle]");
    assert.equal(await m.page.locator(".dlist").isVisible(), true);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-gallery]")).display), "flex");
    assert.equal(await m.page.locator(".feat ul:not([hidden])").count(), 1);
    await m.page.click("[data-ft] >> nth=3");
    assert.equal(await m.page.locator(".feat ul:not([hidden])").count(), 2);
    assert.equal(await m.page.evaluate(() => { const v = document.querySelector("[data-plan-view]"); return v.scrollWidth > v.clientWidth; }), true);
    await m.page.evaluate(() => document.querySelector("#features").scrollIntoView());
    await m.page.waitForTimeout(500);
    assert.equal(await m.page.locator("[data-float]:not(.away)").count(), 1);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
