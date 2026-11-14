// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/045-music-academy/Opus-5.5/page.test.mjs
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
  await check("sticky blurred nav with phone + violet CTA; 85vh hero with overlay, copy, CTAs and trust row", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.match(await css(page, "[data-nav]", "backdropFilter"), /blur/);
    assert.match(await text(page, ".nav-in > .call"), /\(615\) 555-0192/);
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(124, 58, 237)");
    assert.equal(await page.$eval(".hero", (e) => Math.round(e.getBoundingClientRect().height)), 765);
    assert.match(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundImage), /rgba\(17, 7, 32, 0\.65\)/);
    assert.equal(await text(page, "h1"), "Where Every Note Tells a Story");
    assert.match(await text(page, ".trust"), /37 Years Teaching[\s\S]*1,200\+ Students[\s\S]*24 Instruments[\s\S]*4\.9★ Google Rating/);
    assert.ok(await page.$eval(".hero-in", (e) => e.getBoundingClientRect().width <= 650));
  });
  await check("program cards: colored top borders, prices, level paths, hover lift, details dialog with pricing", async () => {
    assert.equal(await css(page, "#programs", "backgroundColor"), "rgb(250, 245, 255)");
    assert.deepEqual(await page.$$eval(".prog", (p) => p.map((x) => getComputedStyle(x).borderTopColor)), ["rgb(124, 58, 237)", "rgb(5, 150, 105)", "rgb(217, 119, 6)", "rgb(225, 29, 72)"]);
    assert.match(await text(page, ".prog >> nth=0"), /Piano & Keyboard[\s\S]*Starting at \$45\/lesson[\s\S]*Pre-Conservatory/);
    await page.hover(".prog >> nth=1"); await page.waitForTimeout(300);
    assert.match(await css(page, ".prog:nth-child(2)", "transform"), /-6\)$/);
    await page.click('[data-prog="2"]');
    assert.match(await text(page, "[data-dlg-body]"), /Voice & Vocal[\s\S]*30 min\$48\$192/);
    await page.click("[data-dlg-body] [data-pick]");
    assert.equal(await page.inputValue("[data-trial] [name=inst]"), "Voice");
    await page.click("[data-all-programs]");
    assert.match(await text(page, "[data-dlg-body]"), /Early Childhood Music \(ages 3-5\)/);
    await page.keyboard.press("Escape");
  });
  await check("why section: 4 benefits, illustration right; faculty: 4 cards with 120px headshots and tags", async () => {
    assert.equal(await page.locator(".benefits li").count(), 4);
    const c = await page.$eval(".why-copy", (e) => e.getBoundingClientRect().left), i = await page.$eval(".why-img", (e) => e.getBoundingClientRect().left);
    assert.ok(i > c);
    assert.deepEqual(await page.$$eval(".fac h3", (h) => h.map((x) => x.textContent)), ["Dr. Elena Vasquez", "Marcus Williams", "Amara Johnson", "Kenji Tanaka"]);
    assert.equal(await css(page, ".f-img", "width"), "120px");
    assert.equal(await page.locator(".fac .tags li").count(), 14);
  });
  await check("events with violet left border; RSVP and audition application flows", async () => {
    assert.equal(await page.locator(".ev").count(), 3);
    assert.equal(await css(page, ".ev", "borderLeftColor"), "rgb(124, 58, 237)");
    assert.match(await text(page, ".ev >> nth=0"), /Saturday, April 18, 2026 · 3:00 PM[\s\S]*Crescendo Main Hall/);
    await page.click('[data-ev="0"]');
    await page.fill("[data-ev-form] [name=name]", "Jo"); await page.fill("[data-ev-form] [name=email]", "jo@mail.example"); await page.click("[data-ev-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /See you there!/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".ev >> nth=0"), /guest list/);
    await page.click('[data-ev="2"]');
    await page.fill("[data-ev-form] [name=name]", "Ana"); await page.fill("[data-ev-form] [name=email]", "ana@mail.example"); await page.click("[data-ev-form] [type=submit]");
    assert.match(await text(page, "[data-ev-err]"), /instrument/);
    await page.fill("[data-ev-form] [name=inst]", "Cello"); await page.click("[data-ev-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Application received/);
    await page.keyboard.press("Escape");
  });
  await check("testimonials with quote mark and 5 stars; violet trial form validates and confirms; location details", async () => {
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await page.locator(".tm .stars .i").count(), 15);
    assert.equal(await css(page, ".tm blockquote", "fontStyle"), "italic");
    assert.equal(await css(page, ".trial", "backgroundColor"), "rgb(124, 58, 237)");
    await page.click("[data-trial] [type=submit]");
    assert.match(await text(page, "[data-t-err]"), /name[\s\S]*email[\s\S]*phone/);
    await page.fill("[data-trial] [name=name]", "Maya Lee"); await page.fill("[data-trial] [name=email]", "parent@mail.example"); await page.fill("[data-trial] [name=phone]", "615-555-0100");
    await page.selectOption("[data-trial] [name=inst]", "Violin"); await page.selectOption("[data-trial] [name=age]", "6-12");
    await page.click("[data-trial] [type=submit]");
    assert.match(await text(page, "[data-t-text]"), /Maya Lee's free 30-minute violin trial \(age group 6-12\)/);
    assert.match(await text(page, ".info"), /412 Broadway, Nashville, TN 37203[\s\S]*Monday-Friday8:00 AM - 9:00 PM[\s\S]*MTA Route 5/);
    assert.equal(await page.locator(".map svg, .ext svg").count(), 2);
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(30, 16, 51)");
    assert.match(await text(page, ".accr"), /NAMM[\s\S]*MTNA/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: Book Trial in nav, overlay menu, 65vh hero, swipe programs + testimonials with dots, stacked form, map first, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-mini").isVisible(), true);
    const h = await p.$eval(".hero", (e) => e.getBoundingClientRect().height); assert.ok(h >= 520 && h <= 560);
    await p.click("[data-menu-open]"); assert.equal(await p.locator("[data-menu]").isVisible(), true); await p.click("[data-menu-close]");
    assert.ok(await p.$eval("[data-progs]", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval("[data-tms]", (e) => e.scrollWidth > e.clientWidth));
    await p.click('[data-dot="2"]'); await p.waitForTimeout(600);
    assert.equal(await p.getAttribute('[data-dot="2"]', "aria-current"), "true");
    assert.equal((await css(p, ".tform", "gridTemplateColumns")).split(" ").length, 1);
    const map = await p.$eval(".map", (e) => e.getBoundingClientRect().top), info = await p.$eval(".info", (e) => e.getBoundingClientRect().top);
    assert.ok(map < info);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .foot-cols a, .legal a, .dots button, input, select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
