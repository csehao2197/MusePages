// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/022-neighborhood-guide/Opus-5.5/page.test.mjs
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
const text = (p, s) => p.textContent(s);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("default detail shows Maplewood Heights with the brief's stats", async () => {
    assert.equal(await text(page, "[data-crumb]"), "Maplewood Heights");
    assert.match(await text(page, "[data-desc]"), /^Maplewood Heights is a tree-lined residential neighborhood/);
    assert.match(await text(page, "[data-kstats]"), /28,400[\s\S]*\$94,000[\s\S]*\$485,000[\s\S]*\$2,100\/mo/);
    assert.equal(await page.locator(".nb-card").count(), 6);
    assert.match(await text(page, '[data-nb="maplewood"]'), /Walk Score: 82[\s\S]*\$485,000[\s\S]*Family-Friendly[\s\S]*Great Schools[\s\S]*Quiet Streets/);
  });
  await check("score rings fill when scrolled into view", async () => {
    assert.match(await text(page, "[data-scores]"), /82[\s\S]*Very Walkable[\s\S]*65[\s\S]*Excellent Transit[\s\S]*71[\s\S]*Very Bikeable[\s\S]*88[\s\S]*Very Safe/);
    await page.locator("[data-scores]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const off = await page.locator('[data-score="0"] .arc').getAttribute("stroke-dashoffset");
    assert.equal(off, (2 * Math.PI * 48 * 0.18).toFixed(1));
  });
  await check("amenity filters hide pins and list rows; list hover syncs map", async () => {
    assert.match(await text(page, "[data-cats]"), /Dining \(42\)/);
    assert.equal(await page.locator('[data-pin][data-cat="school"]').count(), 3);
    await page.click('[data-cat="dining"]');
    assert.equal(await page.locator('[data-pin][data-cat="dining"]:visible').count(), 0);
    assert.equal(await page.locator('#amlist li[data-cat="dining"]:visible').count(), 0);
    await page.click('[data-cat="dining"]');
    assert.equal(await page.locator('[data-pin][data-cat="dining"]:visible').count(), 5);
    const i = await page.locator('[data-li-b]', { hasText: "Farmers Market (Saturdays)" }).getAttribute("data-li-b");
    await page.hover(`[data-li-b="${i}"]`);
    assert.equal(await page.locator(`[data-pin="${i}"]`).getAttribute("class"), "pin hl");
    assert.match(await text(page, "[data-tip]"), /Farmers Market/);
    await page.hover(`[data-pin="0"]`, { force: true });
    assert.equal(await page.locator('[data-li-b="0"]').getAttribute("class"), "hl");
  });
  await check("schools table has color-coded ratings and source", async () => {
    assert.equal(await page.locator("[data-schools] tr").count(), 4);
    assert.match(await text(page, "[data-schools]"), /Maplewood Elementary[\s\S]*K-5[\s\S]*9\/10[\s\S]*0\.4 mi[\s\S]*380[\s\S]*Little Acorns Montessori \(Private\)[\s\S]*Pre-K-3[\s\S]*85/);
    assert.equal(await page.locator("[data-schools] .rate.g").count(), 4);
    assert.match(await text(page, "#schools"), /Ratings from GreatSchools\.org/);
  });
  await check("commutes and market snapshot match the brief", async () => {
    assert.match(await text(page, "[data-commutes]"), /Downtown[\s\S]*22 min[\s\S]*35 min[\s\S]*Airport[\s\S]*40 min[\s\S]*Tech District[\s\S]*18 min[\s\S]*28 min[\s\S]*University[\s\S]*15 min[\s\S]*20 min/);
    assert.match(await text(page, "[data-mgrid]"), /\$485,000[\s\S]*\+4\.2% YoY[\s\S]*18 days[\s\S]*-3 days YoY[\s\S]*\$245[\s\S]*24/);
    assert.equal(await page.locator("[data-chart] .hit").count(), 12);
    await page.hover('[data-chart] [data-h="11"]', { force: true });
    assert.equal(await text(page, ".ctip"), "Oct '26: $485,000");
    await page.click("[data-listings]");
    assert.match(await text(page, "[data-toast]"), /Maplewood Heights homes/);
  });
  await check("reviews show three residents and the 4.7 average", async () => {
    assert.equal(await page.locator(".rv").count(), 3);
    assert.match(await text(page, "[data-avg]"), /4\.7\/5 from 156 reviews/);
    assert.match(await text(page, "[data-reviews]"), /Martinez Family[\s\S]*Sarah T\.[\s\S]*James W\./);
  });
  await check("search autocomplete selects a neighborhood and re-renders every section", async () => {
    await page.click("[data-q]");
    assert.match(await text(page, "[data-ac]"), /Popular neighborhoods/);
    await page.fill("[data-q]", "9540");
    assert.equal(await page.locator("[data-ac-i]").count(), 1);
    await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    await page.waitForTimeout(700);
    assert.equal(await page.evaluate(() => MuseGuide.current()), "harbor");
    assert.equal(await text(page, "[data-crumb]"), "Harbor Point");
    assert.equal(await text(page, "[data-schools-h]"), "Schools in Harbor Point");
    assert.equal(await text(page, "[data-cta-h]"), "Ready to Explore Harbor Point?");
    assert.equal(await page.locator('.nb-card.on').getAttribute("data-nb"), "harbor");
    await page.fill("[data-q]", "zzzz"); await page.press("[data-q]", "Enter");
    assert.match(await text(page, "[data-search-msg]"), /No neighborhoods match/);
    await page.click('[data-nb="maplewood"]');
    await page.waitForTimeout(500);
    assert.equal(await text(page, "[data-name]"), "Maplewood Heights");
  });
  await check("compare teaser and side-by-side modal highlight the best values", async () => {
    assert.match(await text(page, "[data-teaser] thead"), /Maplewood Heights[\s\S]*Cedar Grove[\s\S]*Willow Creek/);
    assert.match(await text(page, "[data-teaser] tbody"), /Median home price[\s\S]*Walk Score[\s\S]*School rating[\s\S]*Commute to downtown/);
    await page.click("[data-open-compare]");
    assert.equal(await page.locator("[data-pick]").count(), 3);
    await page.selectOption("[data-pick] >> nth=2", "harbor");
    const walkRow = page.locator("[data-full-cmp] tbody tr", { hasText: "Walk Score" });
    assert.equal(await walkRow.locator("td.best").textContent(), "91");
    await page.keyboard.press("Escape");
  });
  await check("tour request validates then confirms; alerts validate email", async () => {
    await page.click("[data-open-tour]");
    await page.click("[data-tour-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email[\s\S]*date/);
    const d = new Date(Date.now() + 3 * 864e5);
    await page.fill("[data-tour-form] [name=name]", "Dana Kim"); await page.fill("[data-tour-form] [name=email]", "dana@example.com");
    await page.fill("[data-tour-form] [name=date]", `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.click("[data-tour-form] [type=submit]");
    assert.match(await text(page, "[data-done]"), /Thanks, Dana![\s\S]*Maplewood Heights[\s\S]*Demo/);
    await page.click(".done [data-close]");
    await page.fill("#alert-email", "bad");
    await page.click("[data-alerts] [type=submit]");
    assert.match(await text(page, "[data-alert-msg]"), /valid email/);
    await page.fill("#alert-email", "dana@example.com");
    await page.click("[data-alerts] [type=submit]");
    assert.match(await text(page, "[data-alert-msg]"), /subscribed to Maplewood Heights/);
  });
  await context.close();

  const t = await open({ width: 900, height: 1000 });
  await check("tablet: full-width map with collapsible sidebar", async () => {
    assert.equal(await t.page.locator("[data-list-toggle]").isVisible(), true);
    await t.page.click("[data-list-toggle]");
    assert.equal(await t.page.locator("#amlist").isVisible(), false);
    assert.equal(await t.page.getAttribute("[data-list-toggle]", "aria-expanded"), "false");
    await t.page.click("[data-list-toggle]");
    assert.equal(await t.page.locator("#amlist").isVisible(), true);
  });
  await t.context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, swipeable cards, single-column stack", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.evaluate(() => { const r = document.querySelector("[data-cards]"); return r.scrollWidth > r.clientWidth && getComputedStyle(r).scrollSnapType.startsWith("x"); }), true);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".reviews")).gridTemplateColumns.split(" ").length), 1);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
