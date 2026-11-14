// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/031-agency-portfolio/Opus-5.5/page.test.mjs
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
const count = (p) => p.evaluate(() => MuseForge.count());

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("nav with active Work, dark CTA; hero headline and counters count up", async () => {
    assert.match(await text(page, ".logo"), /Forge & Co\./);
    assert.equal(await text(page, ".nav-links a.on"), "Work");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(17, 24, 39)");
    assert.equal(await text(page, "h1"), "Work That Works");
    await page.waitForFunction(() => document.querySelector("[data-count='180']").textContent === "180+");
    assert.deepEqual(await page.$$eval(".counters li", (l) => l.map((x) => `${x.querySelector("b").textContent} ${x.querySelector("span").textContent}`)), ["180+ Projects Delivered", "94% Client Retention", "12 Industry Awards", "8 Years Running"]);
  });
  await check("filter pills, counts, fade-in and sticky filter bar", async () => {
    assert.equal(await page.locator(".pill").count(), 7);
    assert.equal(await text(page, "[data-result]"), "Showing 24 projects");
    assert.equal(await count(page), 24);
    assert.equal(await css(page, ".pill.on", "backgroundColor"), "rgb(17, 24, 39)");
    await page.click('[data-cat="Mobile Apps"]');
    assert.equal(await text(page, "[data-result]"), "Showing 5 projects");
    assert.ok(await page.$$eval(".card", (c) => c.every((x) => x.textContent.includes("Mobile Apps"))));
    assert.equal(await page.locator("[data-featured]").isHidden(), true);
    await page.click('[data-cat="Branding"]');
    assert.equal(await text(page, "[data-result]"), `Showing ${await count(page)} projects`);
    assert.equal(await page.locator("[data-grid-a]").evaluate((g) => g.classList.contains("fade")), true);
    await page.click('[data-cat="All"]');
    await page.evaluate(() => scrollTo(0, 1600)); await page.waitForTimeout(200);
    const top = await page.$eval("[data-filters]", (e) => e.getBoundingClientRect().top);
    assert.equal(Math.round(top), 76, "filter bar sticks under the nav");
  });
  await check("masonry grid of 3 columns, ratio variety, hover overlay and 1.02 scale", async () => {
    assert.equal(await css(page, "[data-grid-a]", "columnCount"), "3");
    assert.ok(await page.locator(".card.r-square").count() > 3 && await page.locator(".card.r-wide").count() > 3 && await page.locator(".card.r-tall").count() > 1);
    await page.locator('[data-id="bloom"] .card-hit').scrollIntoViewIfNeeded();
    await page.hover('[data-id="bloom"] .card-hit'); await page.waitForTimeout(400);
    assert.equal(await css(page, '[data-id="bloom"] .overlay', "opacity"), "1");
    assert.equal(await css(page, '[data-id="bloom"] .overlay', "backgroundColor"), "rgba(17, 24, 39, 0.9)");
    assert.match(await text(page, '[data-id="bloom"] .overlay'), /E-commerce[\s\S]*Web Design[\s\S]*Bloom E-commerce[\s\S]*Bloom Skincare[\s\S]*View Case Study/);
    assert.equal(await css(page, '[data-id="bloom"] .card-img', "transform"), "matrix(1.02, 0, 0, 1.02, 0, 0)");
  });
  await check("featured case study sits after the first 6 projects", async () => {
    const order = await page.evaluate(() => { const a = document.querySelector("[data-grid-a]"), f = document.querySelector("[data-featured]"); return [a.children.length, !!(a.compareDocumentPosition(f) & 4)]; });
    assert.deepEqual(order, [6, true]);
    assert.equal(await css(page, "[data-featured]", "backgroundColor"), "rgb(17, 24, 39)");
    assert.match(await text(page, "[data-featured]"), /How We Helped Solaris Energy Increase Leads by 340%[\s\S]*\+340%qualified leads[\s\S]*\+127%organic traffic[\s\S]*2\.8s → 0\.9sload time/);
    await page.click('[data-featured] [data-case-open="solaris"]');
    assert.equal(await text(page, "[data-case-title]"), "Solaris Rebrand");
    assert.match(await text(page, "[data-case-cols]"), /\+340% qualified leads/);
    await page.click('[data-case-step="1"]');
    assert.equal(await text(page, "[data-case-title]"), "Bloom E-commerce");
    await page.keyboard.press("Escape");
  });
  await check("list view toggle", async () => {
    await page.click('[data-view="list"]');
    assert.equal(await page.getAttribute('[data-view="list"]', "aria-pressed"), "true");
    assert.equal(await css(page, "[data-grid-a]", "columnCount"), "1");
    assert.equal(await css(page, '[data-id="solaris"]', "display"), "grid");
    assert.equal(await page.locator('[data-id="solaris"] .row-brief').isVisible(), true);
    await page.click('[data-view="grid"]');
  });
  await check("16 grayscale client logos in two opposite marquees", async () => {
    assert.equal(await page.locator("[data-marquee='0'] ul:first-child .lg").count(), 16);
    assert.equal(await css(page, ".lg", "filter"), "grayscale(1)");
    assert.equal(await page.$eval(".marquee.rev .track", (e) => getComputedStyle(e).animationDirection), "reverse");
  });
  await check("services cards open details; stats count up; CTA opens brief form", async () => {
    assert.equal(await page.locator(".svc").count(), 3);
    await page.click('[data-service="web"]');
    assert.equal(await text(page, "[data-info-title]"), "Web Design & Development");
    await page.keyboard.press("Escape");
    await page.locator(".stats").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("[data-count='4.9']").textContent === "4.9★");
    assert.deepEqual(await page.$$eval(".stats b", (b) => b.map((x) => x.textContent)), ["$42M+", "3.2x", "18", "4.9★"]);
    await page.click(".cta [data-process]");
    assert.match(await text(page, "[data-info-body]"), /Discover[\s\S]*Grow/);
    await page.keyboard.press("Escape");
    await page.click(".cta [data-start]");
    await page.click("[data-brief-form] [type=submit]");
    assert.match(await text(page, "[data-brief-err]"), /what you need[\s\S]*name[\s\S]*email/);
    await page.click('.needs label:has(input[value="Website"])');
    await page.fill("[data-brief-form] [name=name]", "Riley Park"); await page.fill("[data-brief-form] [name=email]", "riley@brand.example");
    await page.click("[data-brief-form] [type=submit]");
    assert.match(await text(page, "[data-brief-text]"), /Thanks, Riley[\s\S]*website[\s\S]*Demo/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".foot"), /Clutch Top Agency 2026[\s\S]*© 2026 Forge & Co\. Creative Agency/);
    assert.equal(await page.locator(".foot .socials a").count(), 5);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: 1 column, scrolling filter bar, stacked featured, single logo row, 2x2 stats, sticky CTA, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await css(p, "[data-grid-a]", "columnCount"), "1");
    assert.ok(await p.$eval("[data-pills]", (e) => e.scrollWidth > e.clientWidth), "filters scroll horizontally");
    const img = await p.$eval(".feat-img", (e) => e.getBoundingClientRect().top), copy = await p.$eval(".feat-copy", (e) => e.getBoundingClientRect().top);
    assert.ok(img < copy);
    assert.equal(await p.locator(".marquee.rev").isVisible(), false);
    assert.equal((await css(p, ".stats", "gridTemplateColumns")).split(" ").length, 2);
    await p.evaluate(() => scrollTo(0, 1200)); await p.waitForTimeout(400);
    const bar = await p.$eval(".sticky-cta", (e) => e.getBoundingClientRect());
    assert.ok(bar.bottom <= 844 && bar.top > 700, "sticky Start a Project visible at bottom");
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".pill, .view, .btn, .burger, .link, .socials a, .mnav a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
