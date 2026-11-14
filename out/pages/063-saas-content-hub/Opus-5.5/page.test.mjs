// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/063-saas-content-hub/Opus-5.5/page.test.mjs
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
  await check("sticky nav with Resources dropdown (5 items, keyboard), border on scroll; 50vh gradient hero with 480px search and 7 pills", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    await page.click("[data-dd-btn]"); assert.equal(await page.isVisible("[data-dd-menu]"), true);
    assert.match(await text(page, "[data-dd-menu]"), /Blog[\s\S]*Guides[\s\S]*Webinars[\s\S]*Case Studies[\s\S]*API Docs/);
    await page.keyboard.press("ArrowDown"); assert.match(await page.evaluate(() => document.activeElement.textContent), /Guides/);
    await page.keyboard.press("Escape"); assert.equal(await page.isVisible("[data-dd-menu]"), false);
    assert.equal(await css(page, "[data-nav] .btn", "backgroundColor"), "rgb(37, 99, 235)");
    assert.ok(await page.$eval(".hero", (e) => e.getBoundingClientRect().height) >= 450);
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(239, 246, 255\)/);
    assert.equal(await text(page, "h1"), "The Flowline Blog");
    assert.equal(await css(page, ".search", "maxWidth"), "480px");
    assert.equal(await page.isVisible("[data-clear]"), false);
    assert.deepEqual(await page.$$eval("[data-pill]", (b) => b.map((x) => x.textContent)), ["All", "Productivity", "Engineering", "Remote Work", "Leadership", "Product Updates", "Customer Stories"]);
    assert.equal(await css(page, '[data-pill="All"]', "backgroundColor"), "rgb(37, 99, 235)");
    await page.evaluate(() => scrollTo(0, 400)); await page.waitForTimeout(300);
    assert.ok(await page.$eval("[data-nav]", (e) => e.classList.contains("scrolled")));
  });
  await check("featured 400px card 55/45 with brief copy; 3-col grid of 9 cards; newsletter after row 2; badge colors; 300px rail", async () => {
    assert.equal(Math.round(await page.$eval(".featured", (e) => e.getBoundingClientRect().height)), 400);
    assert.match(await text(page, ".featured"), /PRODUCTIVITY[\s\S]*The 4-Day Work Week: How We Boosted Output by 23%[\s\S]*Sarah Chen[\s\S]*Head of People[\s\S]*Mar 10, 2026[\s\S]*8 min read[\s\S]*Read Article/);
    assert.equal((await css(page, ".grid", "gridTemplateColumns")).split(" ").length, 3);
    assert.equal(await css(page, ".grid", "columnGap"), "32px");
    const titles = await page.$$eval("[data-card] h3", (h) => h.map((x) => x.textContent));
    assert.deepEqual(titles, ["Async-First: 7 Rules for Teams That Ship Faster", "Building a Culture of Ownership in Remote Teams", "What We Shipped in February 2026", "How Designlab Reduced Project Delays by 40%", "The Manager's Guide to Running Better Standups", "Why We Replaced Meetings With Flowline Briefs", "CI/CD for Non-Engineers: A Visual Guide", "From Chaos to Clarity: Our Planning Framework", "Introducing Flowline AI: Your Smart Assistant"]);
    assert.equal(await page.$eval("[data-grid]", (g) => [...g.children].indexOf(g.querySelector("[data-news]"))), 6);
    assert.match(await text(page, "[data-news]"), /Get smarter about work, weekly[\s\S]*Join 12,000\+ managers and makers/);
    assert.equal(await css(page, "[data-news]", "backgroundColor"), "rgb(30, 58, 95)");
    const badge = async (n) => page.$eval(`[data-card]:nth-of-type(${n}) .badge`, (e) => getComputedStyle(e).color);
    assert.equal(await badge(1), "rgb(124, 58, 237)"); assert.equal(await badge(3), "rgb(220, 38, 38)"); assert.equal(await badge(4), "rgb(8, 145, 178)");
    assert.equal(await css(page, "[data-card] h3", "fontSize"), "20px");
    assert.equal(Math.round(await page.$eval(".rail", (e) => e.getBoundingClientRect().width)), 300);
    assert.match(await text(page, "[data-popular]"), /The 4-Day Work Week\.\.\.[\s\S]*14\.2K reads[\s\S]*5\.7K reads/);
    assert.equal(await text(page, "[data-showing]"), "Showing 9 of 108 articles");
    assert.match(await text(page, "[data-pages]"), /1\s*2\s*3\s*…\s*12/);
  });
  await check("topic counts match catalog; topic card and pill filter; search with highlightless results and empty state", async () => {
    assert.deepEqual(await page.$$eval("[data-topic] small", (s) => s.map((x) => x.textContent)), ["28 articles", "22 articles", "19 articles", "15 articles", "14 articles", "10 articles"]);
    await page.click('[data-topic="Leadership"]'); await page.waitForTimeout(200);
    assert.equal(await text(page, "[data-count]"), "15 articles"); assert.equal(await page.getAttribute('[data-pill="Leadership"]', "aria-pressed"), "true");
    assert.ok((await page.$$eval("[data-card] .badge", (b) => b.map((x) => x.textContent))).every((t) => t === "Leadership"));
    assert.equal(await page.isVisible("[data-featured]"), false);
    await page.click('[data-pill="Productivity"]'); assert.equal(await text(page, "[data-count]"), "28 articles");
    assert.equal(await text(page, "[data-card] h3"), "The 4-Day Work Week: How We Boosted Output by 23%");
    await page.click('[data-pill="All"]'); await page.fill("[data-q]", "remote"); await page.waitForTimeout(300);
    assert.match(await text(page, "[data-feed-title]"), /Results for “remote”/);
    const n = await page.locator("[data-card]").count(); assert.ok(n > 3);
    await page.fill("[data-q]", "zzqx"); await page.waitForTimeout(300);
    assert.equal(await page.isVisible("[data-empty]"), true); assert.equal(await page.isVisible("[data-pager]"), false);
    await page.click("[data-reset]"); assert.equal(await page.inputValue("[data-q]"), ""); assert.equal(await text(page, "[data-showing]"), "Showing 9 of 108 articles");
  });
  await check("Load More appends 9; page numbers swap pages; last page", async () => {
    await page.click("[data-more]"); assert.equal(await page.locator("[data-card]").count(), 18); assert.equal(await text(page, "[data-showing]"), "Showing 18 of 108 articles");
    assert.equal(await page.locator('[data-pages] [aria-current="page"]').count(), 2);
    await page.click('[data-pages] [aria-label="Page 12"]'); assert.equal(await page.locator("[data-card]").count(), 8);
    assert.equal(await page.isVisible("[data-more]"), false); assert.ok(await page.$eval('[data-pages] [aria-label="Next page"]', (b) => b.disabled));
    await page.click('[data-pages] [aria-label="Previous page"]'); assert.equal(await page.locator("[data-card]").count(), 9);
    await page.click('[data-pages] [aria-label="Page 1"]');
  });
  await check("reader dialog opens from card and featured with deep link, closes and clears hash; popular list opens article", async () => {
    await page.click("[data-card]:nth-of-type(4) h3 a");
    assert.equal(await page.evaluate(() => document.querySelector("dialog").open), true);
    assert.match(await text(page, "[data-dlg-body] h2"), /Designlab/); assert.match(page.url(), /#post\/how-designlab-reduced-project-delays-by-40$/);
    await page.keyboard.press("Escape"); assert.equal(await page.evaluate(() => document.querySelector("dialog").open), false); assert.doesNotMatch(page.url(), /#post/);
    await page.click("[data-popular] li:nth-child(3) button"); assert.match(await text(page, "[data-dlg-body] h2"), /Introducing Flowline AI/);
    await page.click("[data-more-topic]"); assert.equal(await text(page, "[data-count]"), "14 articles");
    await page.click('[data-pill="All"]');
    await page.goto(server.url + "#post/the-4-day-work-week-how-we-boosted-output-by-23", { waitUntil: "networkidle" });
    assert.match(await text(page, "[data-dlg-body] h2"), /4-Day Work Week/); await page.click("[data-close]");
  });
  await check("newsletter validates and persists; free resources: PDF gate download, CSV template, simulated masterclass player", async () => {
    await page.click("[data-news-form] button"); assert.match(await text(page, "[data-news-msg]"), /valid email/);
    await page.fill("#news-email", "lee@team.example"); await page.click("[data-news-form] button");
    assert.match(await text(page, "[data-news-msg]"), /subscribed as lee@team\.example/); assert.equal(await page.isVisible("[data-news-form]"), false);
    await page.click('[data-free="playbook"]'); assert.equal(await page.inputValue("#gate-email"), "lee@team.example");
    const [pdf] = await Promise.all([page.waitForEvent("download"), page.click("[data-gate] button")]);
    assert.equal(pdf.suggestedFilename(), "remote-team-playbook.pdf");
    const fs = await import("node:fs"); const pbuf = fs.readFileSync(await pdf.path(), "latin1"); assert.match(pbuf, /^%PDF-1\.4[\s\S]*Remote Team Playbook[\s\S]*%%EOF$/);
    await page.click("[data-close]");
    const [csv] = await Promise.all([page.waitForEvent("download"), page.click('[data-free="scorecard"]')]);
    assert.equal(csv.suggestedFilename(), "project-health-scorecard.csv"); assert.match(fs.readFileSync(await csv.path(), "utf8"), /Area,Question,Score/);
    await page.click('[data-free="masterclass"]'); assert.equal(await page.locator("[data-ch]").count(), 5);
    await page.click("[data-play]"); await page.waitForTimeout(700); assert.ok(parseFloat(await page.$eval("[data-prog]", (e) => e.style.width)) > 0);
    await page.click("[data-close]");
    await page.reload({ waitUntil: "networkidle" }); assert.match(await text(page, "[data-news-msg]"), /subscribed/);
  });
  await check("Case Studies menu item filters Customer Stories; nav search icon focuses search; CTA and footer", async () => {
    await page.click("[data-dd-btn]"); await page.click('[data-dd-menu] [data-topic-link]'); assert.equal(await text(page, "[data-count]"), "10 articles");
    await page.click('[data-pill="All"]');
    await page.click("[data-search-open]"); assert.equal(await page.evaluate(() => document.activeElement.id), "q");
    assert.equal(await css(page, ".cta", "backgroundColor"), "rgb(239, 246, 255)");
    assert.match(await text(page, ".cta"), /Ready to work smarter\?[\s\S]*ship 2x faster[\s\S]*Start Free Trial[\s\S]*Book a Demo/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, hamburger menu, scrollable pills, stacked featured, 1-col grid, stacked newsletter, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible(".links"), false);
    await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-mmenu]"), true); assert.match(await text(p, "[data-mmenu]"), /Case Studies/);
    await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-mmenu]"), false);
    assert.equal(await css(p, ".pills", "overflowX"), "auto"); assert.ok(await p.$eval(".pills", (e) => e.scrollWidth > e.clientWidth));
    const a = await p.$eval(".featured .art", (e) => e.getBoundingClientRect()), t = await p.$eval(".featured .txt", (e) => e.getBoundingClientRect()); assert.ok(t.top >= a.bottom - 1);
    assert.equal((await css(p, ".grid", "gridTemplateColumns")).split(" ").length, 1);
    const inp = await p.$eval("#news-email", (e) => e.getBoundingClientRect()), btn = await p.$eval("[data-news-form] .btn", (e) => e.getBoundingClientRect());
    assert.ok(btn.top >= inp.bottom); assert.ok(Math.abs(inp.width - btn.width) < 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".icon-btn, .btn, .btn-o, .pill, .pages button, .pop button, .free button, .topic, .foot nav a, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.id));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
