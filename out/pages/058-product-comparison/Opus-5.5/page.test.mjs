// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/058-product-comparison/Opus-5.5/page.test.mjs
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
async function open(viewport, opts = {}) {
  const context = await browser.newContext({ viewport, isMobile: !!opts.mobile, hasTouch: !!opts.mobile });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  return { context, page };
}
const text = (p, s) => p.textContent(s);
const css = (p, s, prop) => p.$eval(s, (el, k) => getComputedStyle(el)[k], prop);
const specRow = (p, label) => p.$$eval(`[data-spec="${label}"] .cell`, (c) => c.map((x) => x.textContent.trim()));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("nav (active Compare, wishlist + cart badges, account dropdown); breadcrumb, title, edit + share", async () => {
    assert.equal(await css(page, ".nav", "position"), "sticky");
    assert.equal(await text(page, ".links a.on"), "Compare");
    assert.equal(await text(page, "[data-wish-count]"), "2");
    await page.click("[data-acct]"); assert.equal(await page.isVisible("[data-acct-menu]"), true); await page.keyboard.press("Escape"); assert.equal(await page.isHidden("[data-acct-menu]"), true);
    assert.match(await text(page, ".crumbs"), /Home[\s\S]*Headphones[\s\S]*Compare/);
    assert.equal(await text(page, "h1"), "Compare Wireless Noise-Cancelling Headphones");
    assert.equal(await css(page, ".logo", "color"), "rgb(26, 26, 46)");
  });
  await check("product header row: 200px images, names, ratings, prices with strikethrough, purple Add to Cart, color swatches", async () => {
    assert.deepEqual(await page.$$eval(".head .p-name", (n) => n.map((x) => x.textContent)), ["Sony WH-1000XM5", "Bose QuietComfort Ultra", "Apple AirPods Max"]);
    assert.equal(await page.$eval(".head .p-img", (e) => e.getBoundingClientRect().width), 200);
    assert.match(await text(page, '.head [data-col="sony"]'), /4\.7 \(2,341 reviews\)[\s\S]*\$348[\s\S]*\$399/);
    assert.match(await text(page, '.head [data-col="apple"]'), /4\.5 \(3,104 reviews\)[\s\S]*\$549/);
    assert.equal(await page.$$eval('.head [data-col="sony"] .stars .i.off', (s) => s.length), 0);
    assert.equal(await page.$$eval('.head [data-col="apple"] .stars .i.off', (s) => s.length), 1);
    assert.equal(await css(page, '.head [data-add="sony"]', "backgroundColor"), "rgb(124, 58, 237)");
    assert.equal(await css(page, '.head [data-add="sony"]', "borderTopLeftRadius"), "8px");
    assert.deepEqual(await page.$$eval(".head .swatches", (s) => s.map((x) => x.children.length)), [3, 3, 5]);
    await page.click('[data-swatch="apple:2"]'); assert.equal(await text(page, '.head [data-col="apple"] .sw-name'), "Sky Blue");
    assert.equal(await css(page, ".cmp", "gridTemplateColumns").then((v) => v.split(" ")[0]), "200px");
  });
  await check("quick verdict sits directly below the header row", async () => {
    const order = await page.$$eval("[data-cmp] > [role=row]", (r) => r.slice(0, 3).map((x) => x.className));
    assert.deepEqual(order, ["head", "vrow", "grp"]);
    assert.match(await text(page, ".vrow"), /Our Pick: Sony WH-1000XM5[\s\S]*Save \$51 vs retail[\s\S]*not influenced by brand partnerships/);
    assert.equal(await css(page, ".vrow .verdict", "backgroundColor"), "rgb(245, 243, 255)");
  });
  await check("spec table: brief values, checks/crosses, computed Best highlights, alternating rows", async () => {
    assert.deepEqual(await specRow(page, "Battery Life"), ["Battery Life", "30 hoursBest", "24 hours", "20 hours"]);
    assert.deepEqual(await specRow(page, "Weight"), ["Weight", "250gBest", "250gBest", "384g"]);
    assert.deepEqual(await specRow(page, "Price"), ["Price", "$348Best", "$379", "$549"]);
    assert.deepEqual(await specRow(page, "Spatial Audio"), ["Spatial Audio", "360 Reality Audio", "Immersive Audio", "Dolby AtmosBest"]);
    assert.deepEqual(await specRow(page, "Water/Sweat Resistance"), ["Water/Sweat Resistance", "IPX4Best", "None", "None"]);
    assert.deepEqual(await specRow(page, "Multipoint Connection"), ["Multipoint Connection", "Yes", "Yes", "No"]);
    assert.deepEqual(await specRow(page, "Codec Support"), ["Codec Support", "LDAC, SBC, AAC", "aptX Adaptive, SBC, AAC", "AAC only"]);
    assert.equal(await page.$eval('[data-spec="Battery Life"] .cell.best', (e) => getComputedStyle(e).backgroundColor), "rgb(240, 253, 244)");
    assert.equal(await page.$eval('[data-spec="Multipoint Connection"] .cell:nth-child(4) .no', (e) => getComputedStyle(e).color), "rgb(239, 68, 68)");
    assert.equal(await page.locator("[data-spec]").count(), 17);
    assert.ok(await page.locator(".r-alt").count() > 5);
  });
  await check("compare-at-a-glance hides identical rows; spec chips filter groups; edit comparison + remove + share URL", async () => {
    await page.click(".diff"); assert.equal(await page.locator('[data-spec="Warranty"]').count(), 0); assert.equal(await page.locator('[data-spec="Transparency Mode"]').count(), 0); assert.equal(await page.locator('[data-spec="Price"]').count(), 1);
    await page.click(".diff"); assert.equal(await page.locator("[data-spec]").count(), 17);
    await page.click('[data-g="Audio"]'); assert.equal(await page.locator('[data-spec="Driver Size"]').count(), 0); await page.click('[data-g="Audio"]');
    await page.click('[data-remove="bose"]'); assert.equal(await page.locator(".head .p-name").count(), 2);
    assert.match(await page.evaluate(() => location.search), /compare=sony,apple/);
    assert.deepEqual(await specRow(page, "Weight"), ["Weight", "250gBest", "384g"]);
    assert.equal(await page.locator(".pc").count(), 2);
    await page.click("[data-edit]"); await page.check('.pick input[value="bose"]'); await page.click("[data-apply]");
    assert.equal(await page.locator(".head .p-name").count(), 3);
    await page.click("[data-edit]"); await page.uncheck('.pick input[value="bose"]'); await page.uncheck('.pick input[value="apple"]'); await page.click("[data-apply]");
    assert.match(await text(page, "[data-ed-err]"), /at least 2/); await page.keyboard.press("Escape");
  });
  await check("compact sticky bar appears after scrolling past header; add to cart updates badge", async () => {
    assert.equal(await page.isHidden("[data-mini]") || (await page.$eval("[data-mini]", (e) => !e.classList.contains("show"))), true);
    await page.evaluate(() => document.querySelector('[data-spec="Bluetooth Version"] .cell').scrollIntoView({ block: "center" })); await page.waitForTimeout(400);
    assert.ok(await page.$eval("[data-mini]", (e) => e.classList.contains("show")));
    assert.match(await text(page, "[data-mini]"), /Sony XM5\$348[\s\S]*Bose QC Ultra\$379[\s\S]*AirPods Max\$549/);
    await page.click('[data-mini] [data-add="bose"]'); assert.equal(await text(page, "[data-cart-count]"), "1");
  });
  await check("ratings bars with brand colors and winners; pros/cons; experts; buyers; best-for; FAQ; cross-sells; footer", async () => {
    await page.locator("[data-rates]").scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
    assert.equal(await page.locator(".rate").count(), 6);
    assert.deepEqual(await page.$$eval(".rate:first-child .bar i", (b) => b.map((x) => getComputedStyle(x).backgroundColor)), ["rgb(37, 99, 235)", "rgb(5, 150, 105)", "rgb(107, 114, 128)"]);
    assert.equal(await page.locator(".rate:first-child .win").count(), 2);
    assert.match(await page.$eval(".rate:nth-child(6) .bar-row", (e) => e.textContent), /4\.7/);
    assert.equal(await page.locator(".pc li.pro").count(), 15); assert.equal(await page.locator(".pc li.con").count(), 11);
    assert.match(await text(page, "[data-experts]"), /9\.2\/10[\s\S]*Alex Chen[\s\S]*Audio Editor/);
    assert.match(await text(page, "[data-buyers]"), /Michael R\.[\s\S]*Sarah T\.[\s\S]*David L\./);
    assert.equal(await page.locator(".bf").count(), 3);
    assert.equal(await css(page, ".bf", "borderLeftColor"), "rgb(124, 58, 237)");
    await page.click('.bf [data-add="apple"]'); assert.equal(await text(page, "[data-cart-count]"), "2");
    await page.click("[data-faq] details:nth-child(2) summary"); assert.match(await text(page, "[data-faq] details:nth-child(2) p"), /IPX4/);
    assert.equal(await page.locator(".xc").count(), 4);
    assert.match(await text(page, "[data-cross]"), /Sony WF-1000XM5 Earbuds\$278[\s\S]*Audio-Technica ATH-M50xBT2\$179/);
    assert.equal(await text(page, ".pay"), "VISAMastercardAmexPayPalApple PayGoogle PayKlarna");
    await page.click("[data-nl] [type=submit]"); assert.match(await text(page, "[data-nl-msg]"), /valid email/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: logo+search+cart+hamburger, swipeable table one product at a time with arrows, sticky label column, bottom bar follows product, stacked sections, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible("[data-burger]"), true); assert.equal(await p.isHidden("[data-wish-btn]"), true);
    assert.ok(await p.$eval("[data-cmp]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await css(p, "[data-cmp] .lab", "position"), "sticky");
    assert.equal(await text(p, "[data-mlabel]"), "1 of 3: Sony XM5");
    assert.equal(await text(p, "[data-mbar-name]"), "Sony WH-1000XM5");
    await p.click("[data-mnext]"); await p.waitForTimeout(700);
    assert.equal(await text(p, "[data-mlabel]"), "2 of 3: Bose QC Ultra");
    assert.equal(await text(p, "[data-mbar-name]"), "Bose QuietComfort Ultra");
    const x = await p.$eval('.head [data-col="bose"]', (e) => e.getBoundingClientRect().left); assert.ok(x >= 100 && x <= 140, `bose col left ${x}`);
    await p.$eval("[data-cmp]", (e) => (e.scrollLeft = e.scrollWidth)); await p.waitForTimeout(400);
    assert.equal(await text(p, "[data-mlabel]"), "3 of 3: AirPods Max");
    await p.click("[data-mbar-add]"); assert.equal(await text(p, "[data-cart-count]"), "1");
    assert.equal((await css(p, ".bestfor", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".pros", "gridTemplateColumns")).split(" ").length, 1);
    await p.click(".diff"); assert.equal(await p.locator('[data-spec="Warranty"]').count(), 0);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .link, .icon-btn, .chips button, .swatches button, .faq summary, input:not([type=checkbox])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
