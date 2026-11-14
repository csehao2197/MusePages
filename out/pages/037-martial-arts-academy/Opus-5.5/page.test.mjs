// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/037-martial-arts-academy/Opus-5.5/page.test.mjs
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
  await page.evaluate(() => MuseIronPath.stop());
  return { context, page };
}
const text = (p, s) => p.textContent(s);
const css = (p, s, prop) => p.$eval(s, (el, k) => getComputedStyle(el)[k], prop);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("sticky charcoal nav with red 'Path', phone and CTA; hero copy, CTAs, trust badges, parallax", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgb(17, 24, 39)");
    assert.equal(await css(page, ".logo em", "color"), "rgb(220, 38, 38)");
    assert.equal(await page.locator(".nav-in > .phone").isVisible(), true);
    assert.ok((await page.$eval(".logo", (e) => e.getBoundingClientRect().height)) < 50, "logo on one line");
    assert.equal(await text(page, ".badge-top"), "Charlotte's #1 Rated Academy");
    assert.equal(await text(page, "h1"), "Forge Your Strength. Find Your Path.");
    assert.match(await text(page, ".trust"), /4\.9★ Google \(340 reviews\)[\s\S]*USA Boxing Certified[\s\S]*IBJJF Affiliated/);
    await page.evaluate(() => scrollTo(0, 300)); await page.waitForTimeout(100);
    assert.match(await page.$eval("[data-parallax]", (e) => e.style.transform), /translateY\(9\dpx\)/);
    await page.evaluate(() => scrollTo(0, 0));
  });
  await check("program tabs: BJJ default with 4 classes; Muay Thai and MMA panels; arrow-key navigation", async () => {
    assert.deepEqual(await page.$$eval("[data-tab]", (t) => t.map((x) => x.textContent)), ["Brazilian Jiu-Jitsu", "Muay Thai", "MMA"]);
    assert.equal(await page.locator(".cls").count(), 4);
    assert.match(await text(page, "[data-panel]"), /23 IBJJF medals in 2025 · 4 state champions[\s\S]*Fundamentals[\s\S]*White–Blue belt[\s\S]*Mon\/Wed\/Fri 6 PM/);
    await page.click('[data-tab="1"]');
    assert.match(await text(page, "[data-panel]"), /art of eight limbs[\s\S]*28-4 combined record[\s\S]*Fight Team/);
    await page.focus('[data-tab="1"]'); await page.keyboard.press("ArrowRight");
    assert.equal(await page.evaluate(() => MuseIronPath.tab()), 2);
    assert.equal(await page.locator(".cls").count(), 3);
    assert.match(await text(page, "[data-panel]"), /2 pro fighters on roster[\s\S]*Open Mat[\s\S]*Sun 11 AM/);
    assert.equal(await page.getAttribute('[data-tab="2"]', "aria-selected"), "true");
    await page.click('.cls >> nth=0 >> [data-try]');
    await page.waitForTimeout(700);
    assert.equal(await page.inputValue("[data-form] [name=program]"), "MMA");
  });
  await check("why cards, belt progression with counts on dark band, coach cards with hover View Bio", async () => {
    assert.equal(await page.locator(".whys article").count(), 4);
    assert.equal(await css(page, "#why", "backgroundColor"), "rgb(249, 250, 251)");
    assert.equal(await css(page, "#belts", "backgroundColor"), "rgb(17, 24, 39)");
    assert.deepEqual(await page.$$eval(".belt-name", (b) => b.map((x) => x.textContent)), ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"]);
    assert.deepEqual(await page.$$eval(".belt-n b", (b) => b.map((x) => x.textContent)), ["89", "34", "12", "5", "3"]);
    assert.match(await text(page, ".belt-note"), /skill, not time/);
    assert.equal(await page.locator(".coach").count(), 4);
    assert.equal(await css(page, ".coach:nth-child(2) .view-bio", "opacity"), "0");
    await page.hover(".coach >> nth=1"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".coach:nth-child(2) .view-bio", "opacity"), "1");
    await page.click('[data-bio="1"]');
    assert.match(await text(page, "[data-dlg-body]"), /Coach Sana Patel[\s\S]*Kru rank[\s\S]*24-3/);
    await page.keyboard.press("Escape");
  });
  await check("pricing tiers with badges and promo code applying 50% off first month", async () => {
    assert.match(await text(page, ".plan.pop"), /Most Popular[\s\S]*All Access[\s\S]*\$169/);
    assert.match(await text(page, ".plans"), /Best for Families[\s\S]*Family Plan[\s\S]*\$249[\s\S]*\+\$59\/month/);
    assert.match(await text(page, ".nocontract"), /Month-to-month/);
    await page.click('[data-plan="All Access"]');
    await page.fill("[data-promo] [name=code]", "nope"); await page.click("[data-promo] [type=submit]");
    assert.match(await text(page, "[data-sum]"), /isn't valid/);
    await page.fill("[data-promo] [name=code]", "ironpath50"); await page.click("[data-promo] [type=submit]");
    assert.match(await text(page, "[data-sum]"), /\$84\.50[\s\S]*IRONPATH50 applied/);
    await page.keyboard.press("Escape");
  });
  await check("testimonials; facility strip with arrows; trial form with date validation", async () => {
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await page.locator(".tm .stars .i").count(), 15);
    assert.equal(await page.locator(".ph").count(), 6);
    await page.locator(".tour").scrollIntoViewIfNeeded();
    const s0 = await page.evaluate(() => MuseIronPath.strip());
    await page.click('[data-tour="1"]'); await page.waitForTimeout(700);
    assert.ok(await page.evaluate(() => MuseIronPath.strip()) > s0);
    assert.match(await css(page, ".trial", "backgroundImage"), /linear-gradient/);
    await page.fill("[data-form] [name=name]", "Tasha Reed"); await page.fill("[data-form] [name=email]", "tasha@mail.example"); await page.fill("[data-form] [name=phone]", "704-555-0199");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /date in the next 60 days/);
    const min = await page.getAttribute("[data-date]", "min");
    await page.fill("[data-date]", min); await page.selectOption("[data-form] [name=program]", "Muay Thai");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-done-text]"), /Tasha, your free Muay Thai class is requested for [A-Z][a-z]+day, [A-Z][a-z]+ \d+/);
    assert.match(await text(page, ".foot"), /1840 South Blvd, Charlotte, NC 28203[\s\S]*© 2026 Iron Path Academy\. All rights reserved\./);
    assert.equal(await page.locator(".foot .socials a").count(), 4);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: dark drawer, tab dropdown, stacked classes, vertical belts, Most Popular first, swipe strip, sticky Free Trial bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-menu-open]"); await p.waitForTimeout(300);
    assert.equal(await p.getAttribute("[data-drawer]", "aria-hidden"), "false");
    assert.equal(await css(p, "[data-drawer]", "backgroundColor"), "rgb(17, 24, 39)");
    await p.click("[data-menu-close]"); await p.waitForTimeout(300);
    assert.equal(await p.locator("[data-tabs]").isVisible(), false);
    await p.selectOption("[data-tab-select]", "1");
    assert.match(await text(p, "[data-panel] h3"), /Muay Thai/);
    assert.equal((await css(p, ".classes", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".belts", "gridTemplateColumns")).split(" ").length, 1);
    const pop = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), first = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pop < first);
    assert.equal(await css(p, "[data-strip]", "scrollSnapType"), "x mandatory");
    await p.evaluate(() => scrollTo(0, 2000)); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect().top)) < 844);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .foot-cols a, .socials a, select, input")].filter((b) => b.offsetParent && !b.closest(".drawer") && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
