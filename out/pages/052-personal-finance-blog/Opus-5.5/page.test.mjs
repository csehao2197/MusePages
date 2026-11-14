// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/052-personal-finance-blog/Opus-5.5/page.test.mjs
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
  await check("sticky nav with W-trend logo, 6 links, pill Subscribe; 55/45 hero 52px serif, CTA to featured; trust bar", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, "[data-nav]", "borderBottomColor"), "rgb(229, 231, 235)");
    assert.equal(await page.locator(".logo .w path").count(), 2);
    assert.deepEqual(await page.$$eval(".nav-links a", (a) => a.map((x) => x.textContent)), ["Budgeting", "Investing", "Debt", "Earning More", "Tools", "About"]);
    assert.equal(await css(page, ".nav-sub", "backgroundColor"), "rgb(5, 150, 105)");
    assert.equal(await css(page, ".nav-sub", "borderTopLeftRadius"), "999px");
    assert.equal(await text(page, "h1"), "Money Advice That Actually Makes Sense");
    assert.equal(await css(page, "h1", "fontSize"), "52px");
    assert.match(await css(page, "h1", "fontFamily"), /Lora/);
    assert.equal(await page.getAttribute(".hero .btn", "href"), "#featured");
    assert.match(await text(page, ".trust"), /Featured in:[\s\S]*NerdWallet[\s\S]*Business Insider[\s\S]*The New York Times[\s\S]*Refinery29/);
  });
  await check("featured article card 40/60 with badge, byline and reader; 4 pillars with colored top borders filter articles", async () => {
    const fi = await page.$eval(".f-img", (e) => e.getBoundingClientRect().width), fa = await page.$eval(".feature", (e) => e.getBoundingClientRect().width);
    assert.ok(Math.abs(fi / fa - 0.4) < 0.02);
    assert.match(await text(page, ".feature"), /Investing[\s\S]*How to Start Investing With \$100[\s\S]*By Sarah Mitchell · March 8, 2026 · 12 min read/);
    assert.equal(await css(page, ".feature", "borderTopLeftRadius"), "16px");
    await page.click(".feature .link"); assert.match(await text(page, "[data-dlg-body]"), /index fund/); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".pillar").count(), 4);
    assert.match(await text(page, ".pillars"), /Budgeting[\s\S]*23 guides[\s\S]*Investing[\s\S]*18 guides[\s\S]*Paying Off Debt[\s\S]*15 guides[\s\S]*Earning More[\s\S]*21 guides/);
    assert.equal(await page.$eval(".pillar", (e) => getComputedStyle(e, "::before").height), "4px");
    await page.click('.pillar[data-topic="Investing"]'); await page.waitForTimeout(500);
    assert.match(await text(page, "[data-filter-t]"), /3 Investing guides/);
    await page.click("[data-clear]"); assert.equal(await page.locator(".art").count(), 6);
  });
  await check("latest grid 3x2 with 16:9 thumbs, badges and read times; view all", async () => {
    assert.equal((await css(page, ".arts", "gridTemplateColumns")).split(" ").length, 3);
    assert.deepEqual(await page.$$eval(".art h3", (h) => h.map((x) => x.textContent.slice(0, 20))), ["The 50/30/20 Budget ", "I Paid Off $47,000 i", "5 High-Yield Savings", "Roth IRA vs Traditio", "How I Turned a $200/", "The Only 3 Credit Ca"]);
    const r = await page.$eval(".thumb", (e) => e.getBoundingClientRect().width / e.getBoundingClientRect().height); assert.ok(Math.abs(r - 16 / 9) < 0.03);
    assert.match(await text(page, ".art >> nth=1"), /Debt[\s\S]*15 min read/);
    await page.click("[data-view-all]"); assert.equal(await page.locator(".art").count(), 10); await page.click("[data-clear]");
  });
  await check("budget calculator: example state, live 50/30/20 split, donut segments, validation", async () => {
    assert.equal(await css(page, "#calc", "backgroundColor"), "rgb(240, 253, 244)");
    assert.equal(await text(page, '[data-amt="needs"]'), "$2,250");
    assert.match(await text(page, "[data-pay-hint]"), /example/);
    await page.fill("[data-pay]", "6000");
    assert.deepEqual([await text(page, '[data-amt="needs"]'), await text(page, '[data-amt="wants"]'), await text(page, '[data-amt="save"]'), await text(page, "[data-total]")], ["$3,000", "$1,800", "$1,200", "$6,000"]);
    assert.equal(await page.getAttribute('[data-seg="wants"]', "stroke-dashoffset"), "-50");
    assert.match(await page.getAttribute('[data-seg="save"]', "stroke-dasharray"), /^19\.4 /);
    assert.deepEqual(await page.$$eval(".seg", (s) => s.map((x) => x.getAttribute("stroke"))), ["#059669", "#3B82F6", "#8B5CF6"]);
    await page.fill("[data-pay]", "abc"); assert.match(await text(page, "[data-pay-hint]"), /positive dollar amount/); assert.equal(await text(page, '[data-amt="needs"]'), "$0");
    await page.fill("[data-pay]", "4500"); await page.locator("[data-pay]").blur(); assert.equal(await page.inputValue("[data-pay]"), "4,500");
  });
  await check("dark newsletter section with validation, perks and social proof", async () => {
    assert.equal(await css(page, "#newsletter", "backgroundColor"), "rgb(17, 24, 39)");
    assert.equal(await css(page, "#newsletter h2", "fontSize"), "36px");
    await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /valid email/);
    await page.fill("#nl-e", "me@mail.example"); await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /subscribed/);
    assert.match(await text(page, ".proof"), /The only newsletter I actually open every week[\s\S]*r\/personalfinance/);
    assert.equal(await page.locator(".proof .stars .i").count(), 5);
  });
  await check("tools: CSV downloads and working snowball vs avalanche calculator; investment quiz; about; footer", async () => {
    const fs = await import("node:fs/promises");
    const [d1] = await Promise.all([page.waitForEvent("download"), page.click('.tool [data-dl="budget"]')]);
    assert.equal(d1.suggestedFilename(), "penny-wise-monthly-budget.csv");
    assert.match(await fs.readFile(await d1.path(), "utf8"), /Category,Type,Planned[\s\S]*TOTAL/);
    const [d2] = await Promise.all([page.waitForEvent("download"), page.click('.tool [data-dl="networth"]')]);
    assert.equal(d2.suggestedFilename(), "penny-wise-net-worth-tracker.csv");
    await page.click(".tool [data-debt]");
    const sb = await text(page, '[data-res="snowball"]'), av = await text(page, '[data-res="avalanche"]');
    const interest = (s) => Number(s.match(/\$([\d,]+) interest/)[1].replace(/,/g, ""));
    assert.ok(interest(av) <= interest(sb));
    assert.match(sb, /\d+ months/);
    await page.fill("[name=extra]", "1000"); await page.click("[data-debt-form] [type=submit]");
    const months = (s) => Number(s.match(/(\d+) months/)[1]);
    assert.ok(months(await text(page, '[data-res="avalanche"]')) < months(av));
    await page.keyboard.press("Escape");
    await page.click('.f-col [data-quiz]');
    for (let i = 0; i < 3; i++) { await page.click(".q-opts label >> nth=0"); await page.click("[data-qn]"); }
    assert.match(await text(page, "[data-dlg-body]"), /401\(k\) match[\s\S]*high-interest debt/); await page.keyboard.press("Escape");
    assert.equal(await css(page, ".ab-photo", "width"), "160px");
    assert.match(await text(page, "#about"), /Hi, I'm Sarah[\s\S]*CFA® Charterholder · Former JP Morgan analyst/);
    assert.equal(await page.locator(".f-col").count(), 4);
    assert.match(await text(page, ".f-bot"), /should not be considered financial advice[\s\S]*How We Make Money/);
    await page.click("[data-money]"); assert.match(await text(page, "[data-dlg-body]"), /affiliate/); await page.keyboard.press("Escape");
    await page.click("[data-search-open]"); await page.fill("[data-search-in]", "roth"); await page.click("[data-search-res] button");
    assert.match(await text(page, "[data-dlg-body]"), /Roth IRA vs Traditional/); await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: logo + search + hamburger, 36px heading, text above art, 1-col pillars, horizontal article cards, stacked newsletter, 200px donut, footer accordion, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-sub").isVisible(), false);
    await p.click("[data-burger]"); assert.equal(await p.locator("[data-mnav]").isVisible(), true); await p.click("[data-burger]");
    assert.equal(await css(p, "h1", "fontSize"), "36px");
    assert.ok(await p.$eval("h1", (e) => e.getBoundingClientRect().top) < await p.$eval(".hero-art", (e) => e.getBoundingClientRect().top));
    assert.equal((await css(p, ".pillars", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".art", "flexDirection"), "row");
    assert.equal(await css(p, ".nl-form", "flexDirection"), "column");
    assert.equal(await css(p, ".donut-wrap", "width"), "200px");
    assert.equal(await p.locator(".f-col[open]").count(), 0);
    await p.click(".f-col:nth-child(2) summary"); assert.equal(await p.locator(".f-col[open]").count(), 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .pillar, .f-col summary, .f-col[open] a, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
