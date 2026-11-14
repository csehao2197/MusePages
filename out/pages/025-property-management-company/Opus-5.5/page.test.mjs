// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/025-property-management-company/Opus-5.5/page.test.mjs
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
const slide = (p, sel, v) => p.$eval(sel, (el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, v);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero, trust bar and audience cards match the brief", async () => {
    assert.equal(await text(page, "h1"), "Your Property, Our Priority.");
    assert.match(await text(page, ".eyebrow"), /Managing 1,200\+ Properties Across Greater Austin/);
    assert.match(await text(page, "[data-trust]"), /Licensed & Insured[\s\S]*BBB A\+ Rated[\s\S]*NARPM Member[\s\S]*4\.8★ Google Reviews \(340\+\)/);
    assert.match(await text(page, ".aud.owner"), /98%Occupancy Rate[\s\S]*21-DayAvg\. Fill Time[\s\S]*15%Avg\. ROI Increase/);
    assert.match(await text(page, ".aud.tenant"), /120\+Available Rentals[\s\S]*24\/7Maintenance Line/);
    const [o, t] = await page.$$eval(".aud", (els) => els.map((e) => getComputedStyle(e).borderTopColor));
    assert.equal(o, "rgb(29, 78, 216)"); assert.equal(t, "rgb(16, 185, 129)");
  });
  await check("service cards expand a detail panel with a pricing note", async () => {
    assert.equal(await page.locator(".sv").count(), 6);
    const b = page.locator("[data-sv]").nth(2);
    await b.click();
    assert.equal(await b.getAttribute("aria-expanded"), "true");
    assert.match(await text(page, "#sv-2"), /No markup on vendor invoices/);
    await b.click();
    assert.equal(await page.locator("#sv-2").isVisible(), false);
  });
  await check("portfolio filters and opens available listings only", async () => {
    assert.equal(await page.locator(".pc").count(), 6);
    assert.match(await text(page, "[data-rail-track]"), /\$12,400\/mo total/);
    await page.click('[data-f="Available"]');
    assert.equal(await page.locator(".pc:visible").count(), 3);
    await page.click('[data-listing="3"]');
    assert.match(await text(page, "[data-ls-title]"), /1BR\/1BA Condo — Downtown/);
    assert.match(await text(page, "[data-ls-body]"), /\$1,650[\s\S]*Apply Online/);
    await page.click("[data-apply]");
    assert.match(await text(page, "[data-toast]"), /demo/);
    await page.click('[data-f="Occupied"]');
    assert.equal(await page.locator(".pc:visible [data-listing]").count(), 0);
    await page.click("[data-view-all]");
    assert.equal(await page.locator(".pc:visible").count(), 6);
  });
  await check("ROI calculator is internally consistent and reacts in real time", async () => {
    assert.equal(await text(page, '[data-r="now"]'), "$19,440");
    assert.equal(await text(page, '[data-r="ks"]'), "$23,285");
    assert.equal(await text(page, '[data-r="fee"]'), "$1,863/year");
    assert.equal(await text(page, '[data-r="net"]'), "+$1,982/year");
    assert.match(await text(page, '[data-r="msg"]'), /extra \$165\/month/);
    await slide(page, "#units", "8"); await slide(page, "#rent", "1500"); await slide(page, "#vac", "0");
    const r = await page.evaluate(() => MuseKeystone.roi());
    assert.equal(r.gross, 144000);
    assert.ok(Math.abs(r.net - (144000 * 1.1 * 0.98 * 0.92 - 144000)) < 0.01);
    assert.equal(await text(page, '[data-o="units"]'), "8");
    await slide(page, "#units", "1"); await slide(page, "#rent", "1800"); await slide(page, "#vac", "10");
  });
  await check("pricing tiers and FAQ accordion", async () => {
    assert.match(await text(page, ".tier.pop"), /Most Popular[\s\S]*Portfolio[\s\S]*8%/);
    assert.match(await text(page, ".pr-note"), /No setup fees · No cancellation penalties · Pricing based on collected rent, not listed rent/);
    assert.equal(await page.locator("[data-qa]").count(), 6);
    await page.click("[data-qa] >> nth=2");
    assert.match(await text(page, "#qa-2"), /average fill time is 21 days/);
    assert.equal(await page.locator(".qa.open").count(), 1);
  });
  await check("free analysis form validates and carries the chosen plan", async () => {
    await page.click('[data-plan="Portfolio"]');
    await page.waitForTimeout(700);
    await page.click("[data-fin] [type=submit]");
    assert.match(await text(page, "[data-fin-err]"), /address[\s\S]*email[\s\S]*phone/);
    await page.fill("[data-fin] [name=address]", "4512 Avenue F, Austin, TX 78751"); await page.fill("[data-fin] [name=email]", "owner@example.com"); await page.fill("[data-fin] [name=phone]", "512-555-0100");
    await page.click("[data-fin] [type=submit]");
    assert.match(await text(page, "[data-fin-text]"), /4512 Avenue F[\s\S]*Portfolio plan[\s\S]*Demo/);
  });
  await check("tenant portal: sign-in validation, rent preview and maintenance ticket", async () => {
    await page.click(".nav-portal");
    await page.click('[data-pt-panel="login"] [type=submit]');
    assert.match(await text(page, '[data-pt-panel="login"] [data-pt-err]'), /email[\s\S]*password/);
    await page.click('[data-pt="pay"]');
    await page.fill('[data-pt-panel="pay"] [name=unit]', "1904 Aldrich St, Unit B"); await page.fill('[data-pt-panel="pay"] [name=amt]', "1,450");
    await page.click('[data-pt-panel="pay"] [type=submit]');
    assert.match(await text(page, "[data-pt-done-text]"), /\$1,450 for 1904 Aldrich St[\s\S]*no payment was made/);
    await page.click('[data-pt="maint"]');
    await page.fill('[data-pt-panel="maint"] [name=unit]', "1904 Aldrich St"); await page.check('[name="urg"][value="Emergency"]'); await page.fill('[data-pt-panel="maint"] [name=desc]', "Water heater leaking in garage");
    await page.click('[data-pt-panel="maint"] [type=submit]');
    assert.match(await text(page, "[data-pt-done-text]"), /Request #KPG-\d{6}[\s\S]*Emergency[\s\S]*24\/7 line/);
    await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, portal icon, stacked layout, swipe rail, Portfolio first, bottom bar switches audience", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-portal").isVisible(), true);
    assert.equal(await p.locator(".nav-analysis").isVisible(), false);
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector(".svc")).gridTemplateColumns.split(" ").length), 1);
    assert.equal(await p.evaluate(() => { const r = document.querySelector("[data-rail-track]"); return r.scrollWidth > r.clientWidth && getComputedStyle(r).scrollSnapType.startsWith("x"); }), true);
    const [first] = await p.$$eval(".tier", (els) => els.map((e) => ({ t: e.querySelector("h3").textContent, y: e.getBoundingClientRect().top })).sort((a, b) => a.y - b.y));
    assert.equal(first.t, "Portfolio");
    assert.equal(await p.locator("[data-mbar-owner]").isVisible(), true);
    await p.evaluate(() => document.querySelector("#properties").scrollIntoView({ block: "center", behavior: "instant" }));
    await p.waitForTimeout(400);
    assert.equal(await p.locator("[data-mbar-tenant]").isVisible(), true);
    await p.evaluate(() => document.querySelector("#roi").scrollIntoView({ block: "center", behavior: "instant" }));
    await p.waitForTimeout(400);
    assert.equal(await p.locator("[data-mbar-owner]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll("main button, main a.btn, [data-mbar] a, .nav a.btn, .nav button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
