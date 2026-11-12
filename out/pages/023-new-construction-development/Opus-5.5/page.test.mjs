// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/023-new-construction-development/Opus-5.5/page.test.mjs
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
const text = (p, s) => p.textContent(s);
async function pdfOf(page, sel) {
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click(sel)]);
  const pdf = (await readFile(await dl.path())).toString("latin1");
  const x = +pdf.match(/startxref\n(\d+)/)[1];
  assert.equal(pdf.slice(x, x + 4), "xref");
  return { pdf, name: dl.suggestedFilename() };
}
const future = (days) => { const d = new Date(Date.now() + days * 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero, badge and counter bar match the brief", async () => {
    assert.equal(await text(page, "h1"), "Your New Home at Ridgeline at Cedar Creek");
    assert.match(await text(page, ".badge-float"), /Phase 2 Now Selling · 14 Homesites Remaining/);
    await page.locator("[data-counters]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    assert.match(await text(page, "[data-counters]"), /\$425,000[\s\S]*3–5 Bedrooms[\s\S]*1,800–3,200 sq ft[\s\S]*0\.25–0\.40 Acre Lots/);
  });
  await check("community brochure downloads as a valid PDF", async () => {
    const { pdf, name } = await pdfOf(page, "[data-brochure]");
    assert.equal(name, "Ridgeline-at-Cedar-Creek-Brochure.pdf");
    assert.match(pdf, /RIDGELINE AT CEDAR CREEK/);
    assert.match(pdf, /The Crestview/);
  });
  await check("floor plan filters combine and reset", async () => {
    assert.equal(await page.locator(".plan:visible").count(), 4);
    await page.click('[data-chips="beds"] [data-v="4"]');
    assert.equal(await text(page, "[data-plan-count]"), "Showing 2 of 4 floor plans");
    await page.selectOption("[data-price]", "450000-550000");
    assert.deepEqual(await page.locator(".plan:visible h3").allTextContents(), ["The Ashford"]);
    await page.click('[data-chips="stories"] [data-v="1"]');
    assert.equal(await page.locator("[data-plans-empty]").isVisible(), true);
    await page.click("[data-reset]");
    await page.locator("[data-sqmax]").fill("2500");
    assert.deepEqual(await page.locator(".plan:visible h3").allTextContents(), ["The Oakmont", "The Ashford"]);
    await page.$eval("[data-reset]", (b) => b.click());
    assert.equal(await page.locator(".plan:visible").count(), 4);
    assert.match(await text(page, '[data-plan="ashford"]'), /Most Popular[\s\S]*4 bed[\s\S]*3 bath[\s\S]*2,456 sq ft[\s\S]*2-story[\s\S]*\$498,000/);
    assert.match(await text(page, '[data-plan="crestview"]'), /Model Home Open/);
  });
  await check("floor plan modal shows levels, dimensions and requests pricing", async () => {
    await page.click('[data-view-plan="belmont"]');
    assert.equal(await page.locator("[data-levels] button").count(), 2);
    assert.match(await text(page, "[data-dims]"), /Great Room20' × 26'/);
    await page.click('[data-lv="1"]');
    assert.match(await text(page, "[data-dims]"), /Bonus Room16' × 22'/);
    assert.equal(await page.locator("[data-custom] li").count(), 4);
    await page.click("[data-req-price]");
    await page.waitForTimeout(800);
    assert.equal(await page.isChecked('[name="plans"][value="The Belmont"]'), true);
    assert.equal(await page.isChecked('[name="intent"][value="Get Pricing Info"]'), true);
  });
  await check("site plan has 86 lots with the brief's status counts", async () => {
    assert.equal(await page.locator(".lot").count(), 86);
    assert.deepEqual(await page.evaluate(() => MuseRidge.lots()), { md: 3, sd: 46, av: 14, uc: 23 });
    assert.match(await text(page, "[data-lot-summary]"), /14 Available · 23 Under Contract · 46 Sold · 3 Model Homes/);
    assert.match(await text(page, "#availability svg"), /Phase 1 · Sold out[\s\S]*Phase 2 · Selling now[\s\S]*Phase 3 · Coming Q4 2026/);
  });
  await check("available lot opens a popover; other statuses only show tooltips", async () => {
    await page.locator("[data-site]").scrollIntoViewIfNeeded();
    await page.hover('[data-lot="37"]');
    assert.match(await text(page, "[data-ltip]"), /Lot 37 · Under contract/);
    await page.click('[data-lot="37"]');
    assert.equal(await page.locator("[data-pop]").isVisible(), false);
    await page.click('[data-lot="47"]');
    assert.match(await text(page, "[data-pop]"), /Lot 47 · 0\.31 acres[\s\S]*South-facing backyard[\s\S]*The Oakmont, The Ashford, The Belmont[\s\S]*Backs to green space/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-pop]").isVisible(), false);
    await page.click('[data-lot="38"]');
    await page.click("[data-lot-req]");
    await page.waitForTimeout(800);
    assert.match(await page.inputValue("[name=msg]"), /Lot 38/);
  });
  await check("Check Availability highlights lots that fit the plan", async () => {
    await page.click('[data-avail="crestview"]');
    const fits = await page.evaluate(() => [...document.querySelectorAll('.lot[data-s="av"]')].filter((g) => g.style.opacity === "1").length);
    assert.ok(fits > 0 && fits < 14);
    assert.match(await text(page, "[data-toast]"), new RegExp(`${fits} available homesites fit The Crestview`));
  });
  await check("virtual tour pans by buttons and keys; gallery lightbox cycles", async () => {
    await page.click('[data-vtour="ashford"]');
    assert.equal(await page.evaluate(() => MuseRidge.pano()), "Kitchen");
    await page.click('[data-pan="1"]');
    assert.equal(await text(page, "[data-pano-room]"), "Primary Bath");
    await page.focus("[data-pano]");
    for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowLeft");
    assert.equal(await page.evaluate(() => MuseRidge.pano()), "Great Room");
    await page.click("[data-modal=tour] [data-close]");
    assert.equal(await page.locator(".thumb").count(), 6);
    await page.click('[data-g="5"]');
    assert.equal(await text(page, "[data-lb-count]"), "6 of 6");
    await page.keyboard.press("ArrowRight");
    assert.equal(await text(page, "[data-lb-cap]"), "Kitchen");
    await page.keyboard.press("Escape");
  });
  await check("features comparison and spec sheet PDF", async () => {
    assert.match(await text(page, "[data-compare]"), /Granite countertops[\s\S]*Quartz waterfall island[\s\S]*Hardwood throughout[\s\S]*Motorized blinds[\s\S]*Energy Star certified/);
    const { pdf } = await pdfOf(page, "[data-specs]");
    assert.match(pdf, /GE Caf/);
  });
  await check("financing cards and pre-qualification estimate", async () => {
    assert.match(await text(page, "#financing"), /5\.99%[\s\S]*\$12,000[\s\S]*\$15,000[\s\S]*April 30, 2026[\s\S]*VA \$0-down[\s\S]*\*Rate as of March 2026/);
    await page.click("[data-prequal]");
    await page.click("[data-pq] [type=submit]");
    assert.match(await text(page, "[data-pq-out]"), /\$470,000[\s\S]*The Oakmont/);
    await page.fill("[data-pq] [name=income]", "");
    await page.click("[data-pq] [type=submit]");
    assert.match(await text(page, "[data-pq-err]"), /income/);
    await page.keyboard.press("Escape");
  });
  await check("contact form validates then confirms", async () => {
    await page.click("[data-again]").catch(() => {});
    await page.fill("[name=first]", "");
    await page.click("[data-contact] [type=submit]");
    assert.match(await text(page, "[data-err]"), /first name[\s\S]*last name[\s\S]*email[\s\S]*phone/);
    await page.fill("[name=first]", "Maya"); await page.fill("[name=last]", "Chen"); await page.fill("[name=email]", "maya@example.com"); await page.fill("[name=phone]", "919 555 0199");
    await page.check('[name="plans"][value="The Oakmont"]'); await page.check('[name="intent"][value="Schedule a Tour"]');
    await page.fill("[name=date]", future(5));
    await page.click("[data-contact] [type=submit]");
    assert.match(await text(page, "[data-sent-text]"), /Thanks, Maya![\s\S]*schedule your tour[\s\S]*The Oakmont[\s\S]*Demo/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, hamburger, filter accordion, lot list, tabs, footer accordion, sticky bar", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    await p.click('[data-menu] a[href="#plans"]');
    assert.equal(await p.locator("[data-menu]").isVisible(), false);
    assert.equal(await p.locator("[data-filters]").isVisible(), false);
    await p.click("[data-filter-toggle]");
    assert.equal(await p.locator("[data-filters]").isVisible(), true);
    assert.equal(await p.locator("[data-site-wrap]").isVisible(), false);
    const first = await p.locator(".lot-card b").first().textContent();
    assert.match(first, /Lot 36/);
    assert.equal(await p.locator(".lot-card.av").count(), 14);
    await p.click("[data-all-lots]");
    assert.equal(await p.locator(".lot-card").count(), 86);
    await p.click('[data-view="map"]');
    assert.equal(await p.evaluate(() => { const w = document.querySelector("[data-site-wrap]"); return w.scrollWidth > w.clientWidth; }), true);
    assert.equal(await p.locator('.crow .prem-c').first().isVisible(), false);
    await p.click('[data-ftab="prem"]');
    assert.equal(await p.locator('.crow .prem-c').nth(1).isVisible(), true);
    assert.equal(await p.locator("[data-fd][open]").count(), 0);
    assert.equal(await p.locator("[data-sticky]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll("main button, .chips button, [data-sticky] a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
