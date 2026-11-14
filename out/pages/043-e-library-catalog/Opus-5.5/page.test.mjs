// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/043-e-library-catalog/Opus-5.5/page.test.mjs
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
  const context = await browser.newContext({ viewport, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, permissions: ["clipboard-read", "clipboard-write"] });
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
const count = (p) => p.evaluate(() => MuseShelf.count());

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero: headline, 640px search with suggestions (keyboard), quick chips, stats", async () => {
    assert.equal(await text(page, "h1"), "Explore 12,000+ Learning Resources");
    assert.equal(await css(page, "[data-search-wrap]", "maxWidth"), "640px");
    assert.equal(await page.getAttribute("[data-q]", "placeholder"), "Search by title, author, topic, or ISBN...");
    await page.fill("[data-q]", "neural");
    assert.equal(await page.locator("[data-sugg]").isVisible(), true);
    assert.match(await text(page, "[data-sugg]"), /Neural Networks in Climate Modeling/);
    await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    assert.equal(await count(page), 1);
    assert.match(await text(page, "[data-pills]"), /Neural Networks/);
    await page.click("[data-clear]");
    assert.equal(await count(page), 48);
    assert.match(await text(page, ".stats"), /12,450 Resources[\s\S]*1,200\+ Authors[\s\S]*86 Subjects[\s\S]*Free for Members/);
    await page.click('[data-chip="open"]');
    assert.ok(await page.$$eval(".card .acc", (a) => a.every((x) => x.textContent === "Open Access")));
    await page.click('[data-chip="open"]');
  });
  await check("sidebar facets: type, subject expand, level, language, availability, year range, removable pills, clear all", async () => {
    assert.match(await text(page, "[data-f-type]"), /E-Books4,230[\s\S]*Research Papers3,890[\s\S]*Podcasts800/);
    await page.check('[data-g="types"][value="video"]');
    assert.ok(await page.$$eval(".card", (c) => c.every((x) => x.classList.contains("t-video"))));
    const v = await count(page);
    await page.check('[data-g="subjects"][value="Mathematics"]');
    assert.ok(await count(page) < v);
    await page.click("[data-more-subjects]");
    assert.equal(await page.locator("[data-more]").isVisible(), true);
    assert.equal(await text(page, "[data-fcount]"), "(2)");
    await page.click('[data-pill="subjects"]');
    assert.equal(await count(page), v);
    await page.$eval("[data-y0]", (e) => { e.value = 2024; e.dispatchEvent(new Event("input")); });
    assert.ok(await page.$$eval(".card .by", (b) => b.length > 0));
    assert.match(await text(page, "[data-pills]"), /2024–2026/);
    await page.click("[data-pills] [data-clear-all]");
    assert.equal(await count(page), 48);
    assert.equal(await page.isChecked('[data-g="types"][value="video"]'), false);
  });
  await check("results header count, sort, pagination 1–24 of 48, grid ↔ list view", async () => {
    assert.match(await text(page, "[data-count]"), /Showing 1–24 of 48 results/);
    assert.equal(await page.locator(".card").count(), 24);
    await page.click('[data-page="2"]');
    assert.match(await text(page, "[data-count]"), /Showing 25–48 of 48/);
    await page.click('[data-page="1"]');
    await page.selectOption("[data-sort]", "rated");
    const r = await page.$$eval(".card .rate", (s) => s.slice(0, 3).map((x) => parseFloat(x.textContent)));
    assert.ok(r[0] >= r[1] && r[1] >= r[2]);
    await page.selectOption("[data-sort]", "relevance");
    assert.equal((await css(page, "[data-cards]", "gridTemplateColumns")).split(" ").length, 3);
    await page.click('[data-view="list"]');
    assert.equal(await css(page, ".card .thumb", "width"), "60px");
    await page.click('[data-view="grid"]');
  });
  await check("brief's four cards with type colors, access badges, rating/journal/progress and actions", async () => {
    const c = (i) => page.locator(`[data-id="${i}"]`);
    assert.match(await c(0).textContent(), /E-Book[\s\S]*Free[\s\S]*Algorithms: Design and Analysis[\s\S]*Dr\. Sarah Mitchell[\s\S]*4\.8[\s\S]*342 ratings[\s\S]*Read Now/);
    assert.match(await c(1).textContent(), /1h 24m[\s\S]*Video[\s\S]*Prof\. James Carter, MIT[\s\S]*4\.9[\s\S]*518[\s\S]*Watch Now/);
    assert.match(await c(2).textContent(), /Paper[\s\S]*Open Access[\s\S]*\(2025\)[\s\S]*Nature Machine Intelligence · 89 citations[\s\S]*Read Paper[\s\S]*Cite/);
    assert.match(await c(3).textContent(), /Tutorial[\s\S]*3 hours · 12 modules[\s\S]*4\.7[\s\S]*45% Complete[\s\S]*Continue/);
    assert.deepEqual(await page.$$eval('[data-id="0"] .type, [data-id="1"] .type, [data-id="2"] .type, [data-id="3"] .type', (t) => t.map((x) => getComputedStyle(x).color)), ["rgb(59, 130, 246)", "rgb(124, 58, 237)", "rgb(5, 150, 105)", "rgb(249, 115, 22)"]);
    await page.hover('[data-id="4"]'); await page.waitForTimeout(250);
    assert.equal(await page.$eval('[data-id="4"]', (e) => getComputedStyle(e, "::before").opacity), "1");
  });
  await check("actions: cite dialog + copy, bookmark updates reading list, open adds to recently viewed, share copies link", async () => {
    await page.click('[data-cite="2"]');
    assert.match(await text(page, "[data-cite-text]"), /Park, J\., Williams, R\., & Liu, X\. \(2025\)\. Neural Networks/);
    await page.click("[data-copy] >> nth=0");
    await page.waitForTimeout(150);
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Nature Machine Intelligence/);
    await page.keyboard.press("Escape");
    const before = +(await text(page, "[data-rl-count] >> nth=0"));
    await page.click('[data-save="1"]');
    assert.equal(+(await text(page, "[data-rl-count] >> nth=0")), before + 1);
    assert.equal(await page.getAttribute('[data-save="1"]', "aria-pressed"), "true");
    assert.match(await text(page, "[data-rl]"), /Introduction to Behavioral Economics/);
    await page.click('.acts [data-open="0"]');
    assert.match(await text(page, "[data-dlg-body]"), /Algorithms: Design and Analysis[\s\S]*Chapter 1/);
    await page.keyboard.press("Escape");
    assert.equal((await page.evaluate(() => MuseShelf.recent()))[0], 0);
    assert.match(await text(page, "[data-recent] li >> nth=0"), /Algorithms/);
    await page.click('[data-share="0"]');
    await page.waitForTimeout(150);
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /#resource-0$/);
  });
  await check("collections, recently viewed clear, newsletter, footer", async () => {
    assert.equal(await page.locator(".col").count(), 3);
    assert.match(await text(page, "[data-cols]"), /Machine Learning Essentials28 resources · by Dr\. Liu/);
    await page.click('.col >> nth=2');
    assert.ok(await count(page) >= 1);
    await page.click("[data-clear]");
    await page.click("[data-clear-history]");
    assert.equal(await page.locator("[data-recent] li").count(), 0);
    assert.equal(await page.locator("[data-recent-empty]").isVisible(), true);
    await page.fill("#news-email", "a@b.example"); await page.click("[data-news] [type=submit]");
    assert.match(await text(page, "[data-news-msg]"), /Subscribed/);
    assert.match(await text(page, ".copy"), /Making knowledge accessible to everyone/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: Filters (n) drawer, 1-column cards, sticky search, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-filters-open]"); await p.waitForTimeout(350);
    assert.equal(await p.locator("[data-filters]").evaluate((e) => e.classList.contains("open")), true);
    await p.check('[data-g="levels"][value="Beginner"]');
    await p.click(".f-apply");
    assert.equal(await text(p, "[data-fcount]"), "(1)");
    assert.equal((await css(p, "[data-cards]", "gridTemplateColumns")).split(" ").length, 1);
    await p.evaluate(() => scrollTo(0, 1600)); await p.waitForTimeout(250);
    assert.equal(await p.locator("[data-search-wrap]").evaluate((e) => e.classList.contains("stuck")), true);
    assert.ok(Math.abs(await p.$eval("[data-search-wrap]", (e) => e.getBoundingClientRect().top)) < 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .chip, .pill, .pg, .link, select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
