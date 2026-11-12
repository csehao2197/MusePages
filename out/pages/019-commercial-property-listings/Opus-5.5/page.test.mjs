// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/019-commercial-property-listings/Opus-5.5/page.test.mjs
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
const count = (page) => page.locator("[data-count] b").textContent().then(Number);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("all 18 sample listings show, paginated 9 per page with the featured banner", async () => {
    assert.equal(await count(page), 18);
    assert.equal(await page.locator(".card").count(), 9);
    assert.equal(await page.locator(".featured").count(), 1);
    await page.click('[data-pg="2"]');
    assert.equal(await page.locator(".card").count(), 9);
    assert.match(await page.textContent("[data-pager] p"), /Showing 10-18 of 18/);
    await page.click('[data-pg="1"]');
  });
  await check("prompt listings render with spec'd prices", async () => {
    const txt = await page.textContent("[data-cards]");
    assert.match(txt, /Frost Tower — Suite 2400[\s\S]*\$52\.00 \/SF\/year[\s\S]*\$54,167\/month/);
    assert.match(txt, /\$42\.00 \/SF\/year NNN[\s\S]*\$11,200\/month/);
  });
  await check("sidebar type + class filters, active chips and removal", async () => {
    await page.check('[data-set="types"][value="Office"]');
    assert.equal(await count(page), 7);
    await page.check('[data-set="cls"][value="A"]');
    assert.equal(await count(page), 4);
    assert.deepEqual(await page.locator("[data-active] button").allTextContents(), ["Office", "Class A"]);
    await page.click("[data-active] button >> nth=1");
    assert.equal(await count(page), 7);
    await page.click("[data-clear] >> nth=0");
    assert.equal(await count(page), 18);
  });
  await check("lease price slider and manual inputs narrow results", async () => {
    await page.fill('[data-mm="lease-lo"]', "50");
    await page.dispatchEvent('[data-mm="lease-lo"]', "change");
    const names = await page.evaluate(() => MuseVG.visible());
    assert.ok(names.includes("Frost Tower — Suite 2400") && !names.includes("South Congress Creative Loft"));
    assert.ok(names.includes("East Austin Distribution Center"), "sale listings unaffected by lease range");
    await page.click("[data-clear] >> nth=0");
  });
  await check("search with location autocomplete, transaction and quick chips", async () => {
    await page.fill("[data-q]", "east");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.equal(await page.inputValue("[data-q]"), "East Austin, Austin, TX");
    await page.click("[data-search] button[type=submit]");
    assert.equal(await count(page), 2);
    await page.selectOption("[data-tx]", "sale");
    await page.click("[data-search] button[type=submit]");
    assert.deepEqual(await page.evaluate(() => MuseVG.visible()), ["East Austin Distribution Center"]);
    await page.click("[data-clear] >> nth=0");
    await page.click('[data-chip="green"]');
    assert.equal(await count(page), 5); // Republic, Round Rock, Plaza Saltillo, Seaholm, Domain 12
    await page.click('[data-chip="green"]');
    await page.fill("[data-q]", "Chicago, IL");
    await page.click("[data-search] button[type=submit]");
    assert.equal(await count(page), 0);
    assert.match(await page.textContent(".empty"), /Austin market only/);
    await page.click(".empty [data-clear]");
  });
  await check("sorting by price and size", async () => {
    await page.selectOption("[data-sort]", "sls");
    assert.equal((await page.evaluate(() => MuseVG.visible()))[0], "Montopolis Industrial Land");
    await page.selectOption("[data-sort]", "ssl");
    assert.equal((await page.evaluate(() => MuseVG.visible()))[0], "Arboretum Retail — Suite 140");
    await page.selectOption("[data-sort]", "new");
  });
  await check("list view and card photo carousel", async () => {
    await page.click('[data-view="list"]');
    assert.match(await page.getAttribute("[data-cards]", "class"), /list/);
    await page.hover(".card >> nth=0");
    await page.click(".card >> nth=0 >> .ph-nav.n");
    await page.waitForTimeout(500);
    assert.ok(await page.locator(".card >> nth=0 >> [data-track]").evaluate((t) => t.scrollLeft > 0));
    await page.click('[data-view="grid"]');
  });
  await check("details modal calculates rent and a tour can be requested", async () => {
    await page.click('[data-detail="0"] >> nth=0');
    assert.match(await page.textContent("[data-out]"), /\$54,167\/mo/);
    await page.fill("[data-sf]", "6000");
    await page.dispatchEvent("[data-sf]", "input");
    assert.match(await page.textContent("[data-out]"), /\$26,000\/mo/);
    await page.click('[data-modal="detail"] [data-tour]');
    const t = '[data-modal="tour"]';
    const d = new Date(Date.now() + 5 * 864e5);
    await page.fill(`${t} [name=date]`, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.fill(`${t} [name=name]`, "Ben Ortiz");
    await page.fill(`${t} [name=email]`, "ben@example.com");
    await page.click(`${t} [type=submit]`);
    assert.match(await page.textContent(`${t} [data-done]`), /Frost Tower/);
    await page.click(`${t} .done [data-close]`);
  });
  await check("map view: clusters zoom in, pins open cards, search-this-area filters", async () => {
    await page.click('[data-view="map"]');
    const clusters = await page.locator("[data-cluster]").count();
    assert.ok(clusters >= 1);
    await page.locator("[data-cluster]").first().click();
    assert.ok(await page.locator("[data-cluster]").count() < clusters || (await page.locator("[data-pin]").count()) > 0);
    await page.locator("[data-pin]").first().click();
    assert.equal(await page.locator("[data-pincard]").isVisible(), true);
    assert.equal(await page.locator("[data-search-area]").isVisible(), true);
    await page.click("[data-search-area]");
    const n = await count(page);
    assert.ok(n > 0 && n < 18, `area count ${n}`);
    assert.match(await page.textContent("[data-active]"), /Map area/);
    await page.click("[data-clear] >> nth=0");
  });
  await check("draw on map filters to the drawn polygon", async () => {
    await page.click("[data-zoom=\"-1\"]"); await page.click("[data-zoom=\"-1\"]");
    await page.click("[data-draw]");
    const box = await page.locator("[data-map]").boundingBox();
    for (const [fx, fy] of [[0.25, 0.55], [0.75, 0.55], [0.75, 0.95], [0.25, 0.95]]) await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
    await page.click("[data-draw-done]");
    const n = await count(page);
    assert.ok(n > 0 && n < 18, `drawn count ${n}`);
    assert.match(await page.textContent("[data-active]"), /Drawn area/);
    await page.click("[data-clear] >> nth=0");
    await page.click('[data-view="grid"]');
  });
  await check("save search, market CSV and lead form routing", async () => {
    await page.click('[data-open="save"]');
    assert.match(await page.textContent("[data-save-sum]"), /18 properties/);
    await page.fill('[data-modal="save"] [name=email]', "ben@example.com");
    await page.click('[data-modal="save"] [type=submit]');
    assert.match(await page.textContent('[data-modal="save"] [data-done]'), /daily digest/);
    await page.click('[data-modal="save"] .done [data-close]');
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-report]")]);
    assert.match(await readFile(await dl.path(), "utf8"), /Office Vacancy,14\.2%/);
    const f = "[data-lead]";
    await page.click(`${f} [type=submit]`);
    assert.notEqual(await page.textContent("[data-lead-err]"), "");
    await page.fill(`${f} [name=name]`, "Ana Diaz"); await page.fill(`${f} [name=email]`, "ana@example.com");
    await page.selectOption(`${f} [name=ptype]`, "Industrial"); await page.selectOption(`${f} [name=size]`, "15,000-50,000");
    await page.check(`${f} [name=sub][value="Round Rock"]`, { force: true });
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-lead-text]"), /Tom Bradley \(Industrial\).*Round Rock/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, filters drawer with badge, map toggle, single-column cards", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-cards]")).gridTemplateColumns.split(" ").length), 1);
    await m.page.click(".mbar [data-filters-open]");
    await m.page.waitForTimeout(350);
    assert.equal(await m.page.locator("[data-filters].open").count(), 1);
    await m.page.check('[data-set="types"][value="Retail"]');
    assert.equal(await m.page.textContent("[data-apply-count]"), "3");
    await m.page.click(".f-apply [data-filters-close]");
    assert.equal(await m.page.textContent("[data-fbadge2]"), "1");
    await m.page.click("[data-mbar-map]");
    assert.equal(await m.page.locator("[data-mapbox]").isVisible(), true); // container is zero-height; children are fixed
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector("[data-maplist]")).position), "fixed");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
