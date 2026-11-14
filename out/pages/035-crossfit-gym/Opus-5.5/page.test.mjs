// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/035-crossfit-gym/Opus-5.5/page.test.mjs
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

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("dark nav + red CTA; hero overlay, eyebrow, headline, CTAs; red class-time ticker", async () => {
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgb(15, 23, 42)");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(239, 68, 68)");
    assert.equal(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundColor), "rgba(15, 23, 42, 0.7)");
    assert.equal(await text(page, ".eyebrow"), "San Diego's #1 Rated CrossFit Box");
    assert.equal(await text(page, "h1"), "Stronger Starts Here.");
    assert.ok(parseFloat(await css(page, "h1", "fontSize")) >= 64);
    assert.equal(await css(page, ".ticker", "backgroundColor"), "rgb(239, 68, 68)");
    assert.match(await text(page, "[data-ticker]"), /5:30 AM✦6:30 AM✦9:00 AM✦12:00 PM✦4:30 PM✦5:30 PM✦6:30 PM/);
    assert.notEqual(await css(page, ".ticker-track", "animationName"), "none");
  });
  await check("today's WOD: Rx/Scale toggle swaps modifications; top-3 leaderboard", async () => {
    assert.equal(await text(page, ".date"), "Thursday, March 12, 2026");
    assert.equal(await text(page, ".wod h3"), "TIDAL WAVE");
    assert.match(await text(page, ".moves"), /400m Run[\s\S]*Power Cleans \(135\/95 lbs\)[\s\S]*Box Jumps[\s\S]*Bar Muscle-Ups/);
    assert.match(await text(page, ".cap"), /25 minutes/);
    await page.click('[data-ver="scaled"]');
    assert.match(await text(page, ".moves"), /Power Cleans \(95\/65 lbs\)[\s\S]*Box Step-Ups[\s\S]*Pull-Ups/);
    assert.equal(await page.locator("[data-scale-note]").isVisible(), true);
    await page.click('[data-ver="rx"]');
    assert.equal(await page.locator("[data-scale-note]").isHidden(), true);
    assert.deepEqual(await page.$$eval(".board li", (l) => l.map((x) => x.textContent.replace(/\s+/g, " ").trim())), ["Jake M.16:42Rx", "Sarah L.17:15Rx", "Marcus D.18:03Scaled"]);
  });
  await check("programs: 3 cards with badges, 4:3 images, hover zoom + red bottom border, details dialog", async () => {
    assert.deepEqual(await page.$$eval(".prog .badge", (b) => b.map((x) => x.textContent)), ["Most Popular", "Beginners", "Advanced"]);
    const r = await page.$eval(".prog-img", (e) => e.offsetWidth / e.offsetHeight); assert.ok(Math.abs(r - 4 / 3) < 0.02);
    await page.hover(".prog >> nth=1"); await page.waitForTimeout(350);
    assert.equal(await css(page, ".prog:nth-child(2)", "borderBottomColor"), "rgb(239, 68, 68)");
    await page.click('[data-prog="1"]');
    assert.equal(await text(page, "[data-title]"), "Iron Foundations");
    await page.keyboard.press("Escape");
  });
  await check("schedule: 7 tabs with today highlighted, 8 weekday rows with availability, reserve + waitlist", async () => {
    assert.equal(await page.locator(".day").count(), 7);
    assert.equal(await page.locator(".day.today").count(), 1);
    assert.equal(await page.locator('.day.today[aria-selected="true"]').count(), 1);
    await page.click('[data-day="0"]');
    assert.equal(await page.locator(".row").count(), 8);
    assert.match(await text(page, ".row >> nth=0"), /5:30 AM[\s\S]*CrossFit[\s\S]*Coach: Mike[\s\S]*6 spots left/);
    assert.match(await text(page, ".row >> nth=1"), /Full[\s\S]*Join Waitlist/);
    assert.match(await text(page, ".row >> nth=5"), /4:30 PM[\s\S]*Open Gym[\s\S]*Self-directed[\s\S]*Open/);
    assert.equal(await page.$eval(".row:nth-child(4) .dot", (e) => getComputedStyle(e).backgroundColor), "rgb(234, 179, 8)");
    await page.click('[data-reserve="0-0"]');
    await page.fill("[data-form] [name=name]", "Kai Lee"); await page.fill("[data-form] [name=email]", "kai@mail.example");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-done-text]"), /Kai, you're on the roster for Mon 5:30 AM CrossFit with Coach Mike/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".row >> nth=0"), /Reserved/);
    await page.click('[data-day="5"]');
    assert.equal(await page.locator(".row").count(), 3);
  });
  await check("coaches, stories, pricing with annual toggle, collage + Instagram, map + info", async () => {
    assert.deepEqual(await page.$$eval(".coach h3", (h) => h.map((x) => x.textContent)), ["Mike Torres", "Priya Sharma", "Sarah Kim", "Alex Rivera"]);
    assert.equal(await css(page, ".c-photo", "width"), "120px");
    assert.equal(await page.locator(".story").count(), 3);
    assert.equal(await css(page, ".hl b", "color"), "rgb(239, 68, 68)");
    assert.equal(await text(page, '[data-price="185"]'), "$185");
    await page.click(".annual");
    assert.equal(await text(page, '[data-price="185"]'), "$157");
    assert.match(await text(page, '[data-billed="225"]'), /\$2,295 billed yearly/);
    assert.equal(await css(page, ".plan.best", "borderTopColor"), "rgb(239, 68, 68)");
    assert.match(await text(page, ".incl"), /free intro class \+ movement assessment/);
    assert.equal(await page.locator(".collage figure").count(), 6);
    assert.equal(await page.locator(".posts a").count(), 3);
    assert.match(await text(page, ".info"), /1847 Garnet Avenue[\s\S]*\(619\) 555-0142[\s\S]*info@irontidecrossfit\.com[\s\S]*Free lot/);
    assert.match(await page.getAttribute(".info .btn", "href"), /google\.com\/maps\/dir/);
  });
  await check("final CTA opens intro booking with validation; footer", async () => {
    await page.click(".final [data-book]");
    await page.fill("[data-form] [name=name]", "Ana"); await page.fill("[data-form] [name=email]", "bad");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-err]"), /valid email/);
    await page.fill("[data-form] [name=email]", "ana@mail.example"); await page.fill("[data-form] [name=phone]", "123");
    await page.click("[data-submit]"); assert.match(await text(page, "[data-err]"), /10-digit/);
    await page.fill("[data-form] [name=phone]", "6195550100"); await page.click("[data-submit]");
    assert.match(await text(page, "[data-done-text]"), /Ana, a coach will reach out/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".foot-cols > div").count(), 4);
    assert.match(await text(page, ".foot"), /© 2026 Iron Tide CrossFit\. Affiliated with CrossFit LLC\.[\s\S]*Privacy · Terms · Waiver/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: Free Class mini, stacked WOD, schedule cards, coach snap scroll, Unlimited first, 2-col collage, map above info, sticky CTA, 48px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-mini").isVisible(), true);
    const wod = await p.$eval(".wod", (e) => e.getBoundingClientRect().bottom), board = await p.$eval(".board", (e) => e.getBoundingClientRect().top);
    assert.ok(board >= wod);
    assert.ok(await p.$eval("[data-coaches]", (e) => e.scrollWidth > e.clientWidth));
    const best = await p.$eval(".plan.best", (e) => e.getBoundingClientRect().top), first = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(best < first);
    assert.equal(await css(p, ".collage", "columnCount"), "2");
    const map = await p.$eval(".map", (e) => e.getBoundingClientRect().bottom), info = await p.$eval(".info", (e) => e.getBoundingClientRect().top);
    assert.ok(map <= info);
    await p.evaluate(() => scrollTo(0, 2200)); await p.waitForTimeout(400);
    const bar = await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect()); assert.ok(bar.top < 844);
    await p.click("[data-menu-btn]"); assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .day, .link, .scale-toggle button, .foot-cols a, .legal a, .mnav a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 48).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
