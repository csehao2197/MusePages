// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/036-dance-studio/Opus-5.5/page.test.mjs
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
const st = (p) => p.evaluate(() => ({ day: MuseRhythm.day(), filter: MuseRhythm.filter(), today: MuseRhythm.today }));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("transparent nav turns white on scroll; hero copy, 64px headline, CTAs, overlapping stats bar", async () => {
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgba(0, 0, 0, 0)");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(225, 29, 72)");
    assert.equal(await css(page, "h1", "fontSize"), "64px");
    assert.equal(await text(page, "h1"), "Move. Express. Transform.");
    assert.equal(await css(page, ".hero .sub", "fontSize"), "20px");
    assert.deepEqual(await page.$$eval(".stats li", (l) => l.map((x) => `${x.querySelector("b").textContent.trim()} ${x.querySelector("span").textContent}`)),["2,400+ Students", "5 Dance Styles", "14 Instructors", "4.9 Google Rating"]);
    const hero = await page.$eval(".hero", (e) => e.getBoundingClientRect().bottom), stats = await page.$eval(".stats", (e) => e.getBoundingClientRect().bottom);
    assert.ok(stats > hero, "stats bar overlaps into the next section");
    await page.evaluate(() => scrollTo(0, 300)); await page.waitForTimeout(350);
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgb(255, 255, 255)");
  });
  await check("Watch Us Dance opens an animated reel with play/pause and progress", async () => {
    await page.evaluate(() => scrollTo(0, 0));
    await page.click(".hero [data-reel]");
    assert.equal(await page.locator("[data-reel-dlg]").isVisible(), true);
    await page.waitForTimeout(1300);
    const t1 = await page.evaluate(() => MuseRhythm.elapsed()); assert.ok(t1 > 1);
    await page.click("[data-reel-toggle]"); await page.waitForTimeout(500);
    assert.equal(await page.evaluate(() => MuseRhythm.playing()), false);
    assert.equal(await page.$eval("[data-reel-stage]", (e) => e.classList.contains("paused")), true);
    await page.keyboard.press("Escape");
  });
  await check("5 style cards (3:4, level badges, rose bar on hover) filter the schedule", async () => {
    assert.equal(await page.locator(".style").count(), 5);
    const r = await page.$eval(".style", (e) => e.offsetWidth / e.offsetHeight); assert.ok(Math.abs(r - 0.75) < 0.02);
    assert.match(await text(page, '[data-style="salsa"]'), /All Levels[\s\S]*Salsa & Latin[\s\S]*Partner work/);
    await page.hover('[data-style="ballet"]'); await page.waitForTimeout(300);
    assert.equal(await page.$eval('[data-style="ballet"]', (e) => getComputedStyle(e, "::after").transform), "matrix(1, 0, 0, 1, 0, 0)");
    await page.click('[data-style="breaking"]');
    assert.equal((await st(page)).filter, "breaking");
    assert.ok(await page.$$eval(".slot b", (b) => b.length > 0 && b.every((x) => /Break/.test(x.textContent))));
    assert.equal(await text(page, "[data-filter-label]"), "Showing Breaking classes");
    await page.click("[data-clear-filter]");
    assert.equal((await st(page)).filter, null);
  });
  await check("schedule: today tab underlined in rose, Monday slots, low-spot warning, Book on hover, booking flow", async () => {
    const s = await st(page);
    assert.equal(await page.locator(".day.today").count(), 1);
    assert.equal(await page.$eval(".day.today", (e) => getComputedStyle(e, "::after").backgroundColor), "rgb(225, 29, 72)");
    await page.click('[data-day="0"]');
    assert.equal(await page.locator(".slot").count(), 5);
    assert.match(await text(page, ".slot >> nth=1"), /6:00 PM[\s\S]*Hip-Hop Foundations[\s\S]*with Maya[\s\S]*Studio A[\s\S]*Beginner/);
    assert.match(await text(page, ".slot >> nth=2"), /Contemporary Flow[\s\S]*Intermediate[\s\S]*4 spots left/);
    assert.equal(await page.$eval(".slot:nth-child(3) .spots", (e) => getComputedStyle(e).color), "rgb(225, 29, 72)");
    assert.equal(await page.locator(".slot .av.sm svg").count(), 5);
    assert.equal(await css(page, ".slot:nth-child(2) .s-book", "opacity"), "0");
    await page.hover(".slot >> nth=1"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".slot:nth-child(2) .s-book", "opacity"), "1");
    await page.click(".slot:nth-child(2) .s-book");
    await page.fill("[data-book-form] [name=email]", "me@mail.example"); await page.click("[data-bk-submit]");
    assert.match(await text(page, "[data-bk-text]"), /Hip-Hop Foundations · Mon 6:00 PM · Studio A/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".slot >> nth=1"), /8 spots left[\s\S]*Booked/);
    await page.click('[data-step="1"]'); assert.equal((await st(page)).day, 1);
    void s;
  });
  await check("instructors 2x2 with 120px portraits; trial form validation + success; gallery play; testimonials; pricing", async () => {
    assert.deepEqual(await page.$$eval(".ins h3", (h) => h.map((x) => x.textContent)), ["Maya Chen", "Carlos Rivera", "Ava Williams", "Kai Nakamura"]);
    assert.equal((await css(page, "[data-instructors]", "gridTemplateColumns")).split(" ").length, 2);
    assert.equal(await css(page, ".av.lg", "width"), "120px");
    assert.equal(await css(page, ".trial-form", "backgroundColor"), "rgb(255, 241, 242)");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email/);
    await page.fill("[data-form] [name=name]", "Sam Ortiz"); await page.fill("[data-form] [name=email]", "sam@mail.example");
    await page.selectOption("[data-form] [name=style]", "Salsa & Latin"); await page.click('.radios label:has-text("Some Experience")');
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-done-text]"), /Sam, your free Salsa & Latin class is held\. We suggest Mon 8:30 PM Salsa Social\. \(Some Experience/);
    assert.equal(await page.locator(".g").count(), 8);
    assert.equal(await page.locator(".g .play").count(), 4);
    await page.click('.g button[data-reel="Week 1 vs week 12"]');
    assert.match(await text(page, "[data-reel-title]"), /Week 1 vs week 12/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await css(page, ".tm blockquote", "fontStyle"), "italic");
    assert.match(await text(page, ".plan.pop"), /Most Popular[\s\S]*Monthly Unlimited[\s\S]*\$149/);
    assert.match(await text(page, ".small"), /15% off all plans[\s\S]*\$85\/hour/);
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(30, 30, 46)");
    assert.match(await text(page, ".foot"), /412 East 6th Street, Suite 200, Austin, TX 78701[\s\S]*© 2026 Rhythm & Flow Dance Studio/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: Book mini CTA, 2x2 stats, snap style carousel, day-at-a-time slots, 1-col instructors, form above image, 2-col gallery, popular plan first, sticky bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-mini").isVisible(), true);
    assert.equal((await css(p, ".stats", "gridTemplateColumns")).split(" ").length, 2);
    assert.ok(await p.$eval("[data-styles]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await css(p, "[data-styles]", "scrollSnapType"), "x mandatory");
    assert.equal((await css(p, "[data-instructors]", "gridTemplateColumns")).split(" ").length, 1);
    const f = await p.$eval(".trial-form", (e) => e.getBoundingClientRect().top), img = await p.$eval(".trial-img", (e) => e.getBoundingClientRect().top);
    assert.ok(f < img);
    assert.equal(await css(p, "[data-gallery]", "columnCount"), "2");
    const pop = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), first = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pop < first);
    await p.evaluate(() => scrollTo(0, 1800)); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect().top)) < 844);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .day, .style, .link, .radios span, .foot-cols a, .legal a, .socials a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
