// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/032-agency-process-page/Opus-5.5/page.test.mjs
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
  await check("sticky nav with active Process; hero copy, CTAs, isometric art, 6 client names", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await text(page, ".nav-links a.on"), "Process");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(99, 102, 241)");
    assert.equal(await text(page, "h1"), "From Idea to Launch in 12 Weeks");
    assert.match(await text(page, ".lead"), /four-phase methodology/);
    assert.equal(await page.locator(".hero-art svg").count(), 1);
    assert.deepEqual(await page.$$eval(".logos li", (l) => l.map((x) => x.textContent)), ["Stripe", "Notion", "Linear", "Figma", "Vercel", "Plaid"]);
    const pdf = await page.request.get(new URL("assets/frameshift-process.pdf", server.url).href);
    assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
  });
  await check("timeline: 4 nodes, active node solid indigo, progress follows scrolling and clicks", async () => {
    assert.deepEqual(await page.$$eval(".timeline b", (b) => b.map((x) => x.textContent)), ["Discover", "Design", "Develop", "Deliver"]);
    assert.equal(await css(page, '[data-node="0"] .node', "backgroundColor"), "rgb(99, 102, 241)");
    await page.evaluate(() => document.getElementById("develop").scrollIntoView());
    await page.waitForFunction(() => MuseFrameshift.active() === 2);
    assert.equal(await page.$eval("[data-timeline]", (e) => e.style.getPropertyValue("--progress")), String(2 / 3));
    assert.equal(await page.locator('[data-node="1"].done').count(), 1);
    await page.evaluate(() => scrollTo(0, document.querySelector(".overview").offsetTop - 80));
    await page.click('[data-node="3"]');
    await page.waitForTimeout(300);
    assert.ok(Math.abs(await page.$eval("#deliver", (e) => e.getBoundingClientRect().top) - 88) < 6, "jumped to Deliver");
  });
  await check("four phase sections: badges, 5 deliverables each, collaboration notes, alternating art", async () => {
    assert.deepEqual(await page.$$eval(".badge", (b) => b.map((x) => x.textContent)), ["Phase 1 · Weeks 1-2", "Phase 2 · Weeks 3-6", "Phase 3 · Weeks 7-10", "Phase 4 · Weeks 11-12"]);
    assert.deepEqual(await page.$$eval(".phase", (p) => p.map((x) => x.querySelectorAll(".deliver li").length)), [5, 5, 5, 5]);
    assert.equal(await page.locator(".collab").count(), 4);
    assert.equal(await css(page, ".deliver .i", "color"), "rgb(16, 185, 129)");
    assert.equal(await css(page, "#design", "backgroundColor"), "rgb(248, 250, 252)");
    const side = await page.$$eval(".phase", (p) => p.map((x) => x.querySelector(".phase-art").getBoundingClientRect().left > x.querySelector(".phase-copy").getBoundingClientRect().left));
    assert.deepEqual(side, [true, false, true, false]);
    assert.equal(await page.locator(".phase-art svg").count(), 4);
  });
  await check("numbers count up on a dark indigo band", async () => {
    assert.equal(await css(page, ".numbers", "backgroundColor"), "rgb(30, 27, 75)");
    await page.locator("[data-stats]").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("[data-count='92']").textContent === "92%");
    assert.deepEqual(await page.$$eval(".stats b", (b) => b.map((x) => x.textContent)), ["80+", "12 Weeks", "4.9/5", "92%"]);
  });
  await check("testimonials, toolkit hover tint, one-open FAQ", async () => {
    assert.equal(await page.locator(".tm").count(), 2);
    assert.match(await text(page, ".tms"), /David Park[\s\S]*Launched in 11 weeks[\s\S]*Camille Okonkwo[\s\S]*Launched in 14 weeks/);
    assert.equal(await page.locator(".tools li").count(), 14);
    await page.hover('.tools li:has-text("TypeScript")'); await page.waitForTimeout(300);
    assert.equal(await page.locator('.tools li:has-text("TypeScript") .i').evaluate((e) => getComputedStyle(e).color), "rgb(49, 120, 198)");
    const faq = page.locator("[data-faq] details");
    assert.equal(await faq.count(), 6);
    await faq.nth(0).locator("summary").click();
    await faq.nth(3).locator("summary").click();
    await page.waitForTimeout(100);
    assert.deepEqual(await page.$$eval("[data-faq] details", (d) => d.map((x) => x.open)), [false, false, false, true, false, false]);
    assert.match(await text(page, "[data-faq] details[open] p"), /40% of our clients/);
  });
  await check("booking picker: choose day and slot, validate email, confirm (demo)", async () => {
    assert.match(await css(page, ".book", "backgroundImage"), /linear-gradient/);
    await page.click("[data-book-form] [type=submit]");
    assert.match(await text(page, "[data-book-err]"), /day and time[\s\S]*email/);
    await page.click(".day.open >> nth=0");
    assert.ok(await page.locator(".slot").count() >= 4);
    await page.click(".slot >> nth=1");
    await page.fill("#bk-email", "founder@startup.example");
    await page.click("[data-book-form] [type=submit]");
    assert.match(await text(page, "[data-book-text]"), /at \d+:\d\d[\s\S]*founder@startup\.example[\s\S]*Demo/);
    await page.click("[data-book-reset]");
    assert.equal(await page.locator("[data-book-done]").isHidden(), true);
    assert.match(await text(page, ".assure"), /No commitment · Free consultation · Response within 24 hours/);
  });
  await check("footer: 4 columns, newsletter, badges, legal", async () => {
    assert.equal(await page.locator(".foot-cols > div").count(), 4);
    await page.fill("#news-email", "x"); await page.click("[data-news] [type=submit]");
    assert.match(await text(page, "[data-news-msg]"), /valid email/);
    await page.fill("#news-email", "pm@co.example"); await page.click("[data-news] [type=submit]");
    assert.match(await text(page, "[data-news-msg]"), /Subscribed/);
    assert.match(await text(page, ".foot"), /Clutch[\s\S]*DesignRush[\s\S]*© 2026 Frameshift Studio\. All rights reserved\.[\s\S]*Privacy · Terms/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: overlay menu, vertical timeline, stacked phases, 2x2 stats, 3-col tools, sticky Book a Call, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-menu-open]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    await p.click('[data-menu] a[href="#process"]');
    assert.equal(await p.locator("[data-menu]").isHidden(), true);
    assert.equal((await css(p, "[data-timeline]", "gridTemplateColumns")).split(" ").length, 1);
    const art = await p.$eval("#design .phase-art", (e) => e.getBoundingClientRect().top), copy = await p.$eval("#design .phase-copy", (e) => e.getBoundingClientRect().top);
    assert.ok(art > copy, "image below text");
    assert.equal((await css(p, ".stats", "gridTemplateColumns")).split(" ").length, 2);
    assert.equal((await css(p, ".tools", "gridTemplateColumns")).split(" ").length, 3);
    await p.evaluate(() => scrollTo(0, 2400)); await p.waitForTimeout(400);
    const bar = await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect());
    assert.ok(bar.top < 844 && bar.bottom <= 845, "sticky bar visible");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .day.open, .slot, .faq summary, .foot-cols a, .timeline a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 40).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
