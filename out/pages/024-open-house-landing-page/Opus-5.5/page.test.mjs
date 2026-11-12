// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/024-open-house-landing-page/Opus-5.5/page.test.mjs
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
const dl = async (page, sel) => { const [d] = await Promise.all([page.waitForEvent("download"), page.click(sel)]); return { body: (await readFile(await d.path())).toString("latin1"), name: d.suggestedFilename() }; };
const future = (days) => { const d = new Date(Date.now() + days * 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero shows the address, price and stats with a Ken Burns animation", async () => {
    assert.match(await text(page, "h1"), /4821 Ridgewood Terrace[\s\S]*Scottsdale, AZ 85262/);
    assert.equal(await text(page, ".hero .price"), "$2,450,000");
    assert.match(await text(page, ".hero .stats"), /5 Bed · 4\.5 Bath · 4,820 sq ft · 0\.75 Acre Lot · Built 2021/);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".hero-art")).animationName), "kenburns");
  });
  await check("eight highlight cards in a 4-column grid", async () => {
    assert.equal(await page.locator(".glance li").count(), 8);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".glance")).gridTemplateColumns.split(" ").length), 4);
  });
  await check("gallery lightbox opens any photo with a 1 of 12 counter", async () => {
    assert.equal(await page.locator("[data-ph]").count(), 12);
    await page.click('[data-ph="0"]');
    assert.equal(await text(page, "[data-lb-count]"), "1 of 12");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await text(page, "[data-lb-count]"), "12 of 12");
    assert.equal(await text(page, "[data-lb-cap]"), "3-car garage");
    await page.click('[data-lb="1"]');
    assert.equal(await text(page, "[data-lb-cap]"), "Exterior front");
    await page.keyboard.press("Escape");
  });
  await check("spec table and spec sheet PDF", async () => {
    assert.equal(await page.locator("[data-specs] tr").count(), 14);
    assert.match(await text(page, "[data-specs]"), /32,670 sq ft[\s\S]*TPO membrane[\s\S]*\$14,280\/year[\s\S]*AZ-2026-48210/);
    const { body, name } = await dl(page, "[data-spec-pdf]");
    assert.equal(name, "4821-Ridgewood-Terrace-Spec-Sheet.pdf");
    const x = +body.match(/startxref\n(\d+)/)[1];
    assert.equal(body.slice(x, x + 4), "xref");
    assert.match(body, /Saguaro High School/);
  });
  await check("map points of interest sync with the distance list", async () => {
    assert.match(await text(page, "[data-poi-list]"), /Pinnacle Peak Trail[\s\S]*2\.1 mi[\s\S]*Scottsdale Airport[\s\S]*8\.7 mi/);
    await page.hover('[data-pl="1"]');
    assert.match(await page.getAttribute('.poi[data-poi="1"]', "class"), /on/);
    assert.match(await text(page, "[data-poi-card]"), /Grayhawk Golf Club3\.8 miles/);
    await page.hover('.poi[data-poi="4"]');
    assert.match(await page.getAttribute('[data-pl="4"]', "class"), /on/);
  });
  await check("RSVP validates, reserves a slot and offers a calendar file", async () => {
    assert.equal(await page.locator("[data-slots] option").count(), 9);
    await page.click("[data-rsvp] [type=submit]");
    assert.match(await text(page, "[data-err]"), /full name[\s\S]*email[\s\S]*phone[\s\S]*time slot[\s\S]*agent/);
    await page.fill("[data-rsvp] [name=name]", "Daniel Ortiz"); await page.fill("[data-rsvp] [name=email]", "daniel@example.com"); await page.fill("[data-rsvp] [name=phone]", "480 555 0101");
    await page.selectOption("[data-slots]", "12:30 PM"); await page.check('[name="agent"][value="Yes"]');
    await page.click("[data-rsvp] [type=submit]");
    assert.match(await text(page, "[data-done-text]"), /Thanks, Daniel![\s\S]*12:30 PM[\s\S]*April 4, 2026[\s\S]*coordinate with your agent[\s\S]*Demo/);
    const { body } = await dl(page, "[data-ics]");
    assert.match(body, /DTSTART:20260404T193000Z/);
    await page.click("[data-again]");
    assert.match(await page.locator('[data-slots] option[value="12:30 PM"]').textContent(), /1 spot left/);
  });
  await check("private showing dialog validates and confirms", async () => {
    await page.click('.alt [data-contact="showing"]');
    assert.equal(await text(page, "[data-cm-title]"), "Request a Private Showing");
    await page.click("[data-cm-submit]");
    assert.match(await text(page, "[data-cm-err]"), /name[\s\S]*email/);
    await page.fill("[data-cform] [name=name]", "Ana Lee"); await page.fill("[data-cform] [name=email]", "ana@example.com"); await page.fill("[data-cform] [name=date]", future(4));
    await page.click("[data-cm-submit]");
    assert.match(await text(page, "[data-cm-done-text]"), /Thanks, Ana![\s\S]*private showing on/);
    await page.keyboard.press("Escape");
  });
  await check("mortgage calculator reacts to down payment, term and rate", async () => {
    assert.equal(await text(page, "[data-total]"), "$14,488/mo");
    assert.match(await text(page, "[data-legend]"), /Principal & Interest\$12,713[\s\S]*Property Tax\$1,190[\s\S]*HOA\$285[\s\S]*Insurance\$300/);
    await page.locator("#down").fill("30");
    assert.equal(await text(page, "[data-down-amt]"), "$735,000 (30%)");
    await page.click('[data-term] [data-v="15"]');
    const p = await page.evaluate(() => MuseOpenHouse.payment().parts[0]);
    const L = 2450000 * 0.7, r = 0.0675 / 12, f = Math.pow(1 + r, 180);
    assert.ok(Math.abs(p - (L * r * f) / (f - 1)) < 0.01);
    await page.fill("[data-calc] [name=rate]", "0");
    assert.equal(await text(page, "[data-total]"), `$${Math.round(L / 180 + 1190 + 285 + 300).toLocaleString("en-US")}/mo`);
    await page.click('[data-contact="preapproval"]');
    assert.match(await page.inputValue("[data-cform] [name=msg]"), /\$735,000 \(30%\)/);
    await page.keyboard.press("Escape");
  });
  await check("agent profile and similar listings", async () => {
    assert.match(await text(page, "#agent"), /Victoria Reeves[\s\S]*ABR, CRS, SRES[\s\S]*320\+[\s\S]*\$180M\+[\s\S]*4\.9/);
    assert.equal(await page.getAttribute('.ag-ctas a', "href"), "tel:+14805550192");
    assert.match(await text(page, "[data-similar]"), /\$1,895,000[\s\S]*7930 E Raintree Dr[\s\S]*\$2,780,000[\s\S]*Just Listed[\s\S]*\$3,150,000/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, simplified nav, 2-col highlights, carousels, scrollable plan, floating RSVP", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await text(p, ".nav-cta .short"), "RSVP");
    assert.equal(await p.locator(".links").isVisible(), false);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu] a").count(), 5);
    await p.click('[data-menu] a[href="#gallery"]');
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector(".glance")).gridTemplateColumns.split(" ").length), 2);
    assert.equal(await p.evaluate(() => { const g = document.querySelector("[data-gallery]"); return g.scrollWidth > g.clientWidth; }), true);
    assert.equal(await p.locator("[data-dots] i").count(), 12);
    await p.evaluate(() => { const g = document.querySelector("[data-gallery]"); g.scrollLeft = g.firstElementChild.getBoundingClientRect().width * 2 + 24; });
    await p.waitForTimeout(200);
    assert.equal(await p.locator("[data-dots] i.on").evaluate((el) => [...el.parentElement.children].indexOf(el)), 2);
    assert.equal(await p.evaluate(() => { const g = document.querySelector("[data-plan]"); return g.scrollWidth > g.clientWidth; }), true);
    assert.equal(await p.evaluate(() => { const s = document.querySelector("[data-similar]"); return s.scrollWidth > s.clientWidth; }), true);
    await p.evaluate(() => document.querySelector("#details").scrollIntoView());
    await p.waitForTimeout(400);
    assert.equal(await p.locator("[data-float]:not(.away)").isVisible(), true);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
