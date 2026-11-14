// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/034-fitness-challenge-landing-page/Opus-5.5/page.test.mjs
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
const clock = (p) => p.$$eval(".hero [data-u]", (b) => b.map((x) => x.textContent).join(":"));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("sticky dark nav; hero overlay, live countdown boxes, headline, CTA, counter, avatars", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgb(15, 23, 42)");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(249, 115, 22)");
    assert.equal(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundColor), "rgba(15, 23, 42, 0.75)");
    assert.equal(await page.locator(".hero [data-countdown] > div").count(), 4);
    assert.equal(await css(page, ".countdown > div", "backgroundColor"), "rgb(30, 41, 59)");
    assert.equal(await css(page, ".countdown > div", "borderTopLeftRadius"), "8px");
    const a = await clock(page); await page.waitForTimeout(1300); const b = await clock(page);
    assert.match(a, /^06:14:2\d:\d\d$/); assert.notEqual(a, b, "countdown ticks");
    assert.equal(await text(page, "h1"), "30 Days. Zero Excuses. Total Transformation.");
    assert.match(await text(page, ".hero .sub"), /Starts April 1st, 2026/);
    await page.waitForFunction(() => document.querySelector("[data-signed]").textContent === "2,847");
    assert.equal(await page.locator(".avs .av").count(), 5);
    assert.equal(await text(page, "[data-others]"), "2,842");
    assert.equal(await page.$eval(".hero-in", (e) => e.getBoundingClientRect().width <= 700), true);
  });
  await check("6 feature cards with icons (no emoji) and glow hover", async () => {
    assert.equal(await page.locator(".features article").count(), 6);
    assert.equal(await page.locator(".features .f-ico svg").count(), 6);
    assert.doesNotMatch(await page.textContent("main"), /[\u{1F300}-\u{1FAFF}]/u);
    await page.hover(".features article >> nth=0"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".features article:first-child", "borderTopColor"), "rgba(249, 115, 22, 0.3)");
  });
  await check("week 1: 7 scrollable 200px cards, difficulty stripes, days 4-7 locked, preview dialog", async () => {
    assert.equal(await page.locator(".day").count(), 7);
    assert.equal(await css(page, ".day", "width"), "200px");
    assert.equal(await page.locator(".day.locked").count(), 4);
    assert.deepEqual(await page.$$eval(".day", (d) => d.map((x) => getComputedStyle(x).borderTopColor)), ["rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(234, 179, 8)", "rgb(239, 68, 68)", "rgb(34, 197, 94)"]);
    assert.ok(await page.$eval("[data-days]", (e) => e.scrollWidth > e.clientWidth));
    await page.click('[data-scroll="1"]'); await page.waitForTimeout(600);
    assert.ok(await page.$eval("[data-days]", (e) => e.scrollLeft > 0));
    await page.click('[data-open-day="2"]');
    assert.match(await text(page, "[data-wk-body]"), /Upper Body Blitz[\s\S]*Pike push-ups[\s\S]*Superman holds/);
    await page.keyboard.press("Escape");
    await page.click('[data-day="6"] .unlock');
    assert.equal(await page.locator("[data-dlg]").isVisible(), true);
    await page.keyboard.press("Escape");
  });
  await check("results with blurred before/after slots and 5-star ratings", async () => {
    assert.equal(await page.locator(".res").count(), 3);
    assert.match(await text(page, "[data-results]"), /Marcus T\., 34[\s\S]*Lost 12 lbs[\s\S]*Priya K\., 28[\s\S]*Derek & Sam W\., both 41/);
    assert.equal(await page.locator(".res .ba svg filter feGaussianBlur").count(), 3);
    assert.equal(await page.locator(".res .stars .i").count(), 15);
  });
  await check("how it works timeline, leaderboard with medals, tooltip and join row", async () => {
    assert.deepEqual(await page.$$eval(".steps h3", (h) => h.map((x) => x.textContent)), ["Sign Up", "Prep Week", "30 Days of Action", "Celebrate"]);
    assert.equal(await css(page, ".num", "backgroundColor"), "rgb(249, 115, 22)");
    assert.equal(await page.locator(".row").count(), 5);
    assert.match(await text(page, ".row.r1"), /FitMomJess[\s\S]*30\/30[\s\S]*847[\s\S]*30-day streak/);
    assert.equal(await page.locator(".rank-b.m1, .rank-b.m2, .rank-b.m3").count(), 3);
    await page.click("[data-tip]"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".tip", "opacity"), "1");
    assert.match(await text(page, ".tip"), /10\/workout, 5\/check-in, 15\/streak bonus, 20\/photo update/);
    assert.match(await text(page, ".lb-you"), /Your name could be here[\s\S]*Join Now/);
  });
  await check("pricing: free vs glowing pro with strike-through, refund note; join flow increments counter", async () => {
    assert.match(await text(page, ".plan.pro"), /Most Popular[\s\S]*\$29[\s\S]*\$49[\s\S]*Coach Maya/);
    assert.equal(await css(page, ".plan.pro", "borderTopColor"), "rgb(249, 115, 22)");
    assert.match(await text(page, ".guarantee"), /100% refund within 7 days/);
    await page.click('[data-join="pro"]');
    assert.match(await text(page, "[data-plan-label]"), /Pro tier · \$29/);
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-err]"), /first name[\s\S]*email/);
    await page.fill("[data-form] [name=name]", "Alex"); await page.fill("[data-form] [name=email]", "alex@mail.example");
    await page.click('.levels label:has-text("Beast mode")'); await page.click(".check");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-done-text]"), /Alex, you're challenger #2,848 at Beast mode level with a partner match on Pro[\s\S]*Demo/);
    assert.equal(await text(page, "[data-signed]"), "2,848");
    await page.keyboard.press("Escape");
  });
  await check("FAQ +/- accordion animates open and closed", async () => {
    const d = page.locator("[data-faq] details").nth(1);
    await d.locator("summary").click(); await page.waitForTimeout(350);
    assert.equal(await d.evaluate((e) => e.open), true);
    assert.match(await d.textContent(), /48 hours/);
    assert.equal(await d.locator(".pm").evaluate((e) => getComputedStyle(e, "::after").transform), "matrix(1, 0, 0, 1, 0, 0)");
    await d.locator("summary").click(); await page.waitForTimeout(350);
    assert.equal(await d.evaluate((e) => e.open), false);
  });
  await check("final CTA with second countdown, urgency and capacity bar; footer", async () => {
    assert.equal(await page.locator(".final [data-countdown] > div").count(), 4);
    assert.match(await text(page, ".final"), /No credit card required\. Cancel anytime\.[\s\S]*limited to 5,000 challengers/);
    assert.ok(parseFloat(await page.$eval("[data-cap-bar]", (e) => e.style.width)) > 56);
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(2, 6, 23)");
    assert.equal(await page.locator(".foot .socials a").count(), 3);
    assert.match(await text(page, ".foot"), /Made with[\s\S]*in Austin, TX[\s\S]*© 2026 PulseUp Fitness\. All rights reserved\./);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: Join mini CTA, single-column features, swipe days, vertical timeline, leaderboard cards, PRO first, sticky Join bar, 48px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".nav-mini").isVisible(), true);
    assert.ok(await p.$eval(".hero", (e) => e.offsetHeight >= 844 * 0.8 - 72));
    assert.equal((await css(p, ".features", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".steps", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".lb-head", "display"), "none");
    const pro = await p.$eval(".plan.pro", (e) => e.getBoundingClientRect().top), free = await p.$eval(".plan:not(.pro)", (e) => e.getBoundingClientRect().top);
    assert.ok(pro < free, "PRO first");
    await p.evaluate(() => scrollTo(0, 2000)); await p.waitForTimeout(400);
    const bar = await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect());
    assert.ok(bar.top < 844 && bar.bottom <= 845);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .d-btn, .unlock, .faq summary, .foot-top a, .link")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 48).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
