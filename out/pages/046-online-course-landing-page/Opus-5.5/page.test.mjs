// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/046-online-course-landing-page/Opus-5.5/page.test.mjs
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
  await check("sticky nav with enroll; hero copy, CTAs, trust row and dashboard mockup; logos colorize on hover", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.match(await text(page, ".eyebrow"), /12-Week Online Bootcamp — Next Cohort Starts April 14/);
    assert.equal(await text(page, "h1"), "Go From Zero to Full-Stack Developer in 12 Weeks");
    assert.match(await text(page, ".hero .btn-primary"), /Enroll Now — \$599\s*\$1,199/);
    assert.match(await text(page, ".trust"), /4\.9\/5 rating[\s\S]*2,800\+ graduates[\s\S]*94% completion rate[\s\S]*Money-back guarantee/);
    assert.equal(await page.locator(".laptop .dash").isVisible(), true);
    assert.equal(await page.locator(".logos li").count(), 6);
    await page.hover(".logos li >> nth=2"); await page.waitForTimeout(350);
    assert.equal(await css(page, ".logos li:nth-child(3)", "color"), "rgb(99, 91, 255)");
  });
  await check("8 learn items; 6-module accordion with totals 54 / 12 / 1; expand all", async () => {
    assert.equal(await page.locator(".learn li").count(), 8);
    assert.equal(await page.locator(".mod").count(), 6);
    assert.equal(await text(page, "[data-total]"), "54 lessons • 12 hands-on projects • 1 capstone");
    assert.equal(await page.getAttribute("#mod-h-0", "aria-expanded"), "true");
    await page.click("#mod-h-2"); await page.waitForTimeout(350);
    assert.equal(await page.getAttribute("#mod-h-2", "aria-expanded"), "true");
    assert.match(await text(page, "#mod-b-2"), /Task manager app/);
    assert.ok(await page.$eval("#mod-b-2", (e) => e.getBoundingClientRect().height > 100));
    await page.click("[data-expand-all]");
    assert.equal(await page.locator(".mod.open").count(), 6);
    assert.equal(await text(page, "[data-expand-all]"), "Collapse all");
    await page.click("[data-expand-all]");
    assert.equal(await page.locator(".mod.open").count(), 0);
  });
  await check("instructor, 3 format cards, 3 testimonials; pricing with Best Value; FAQ one-at-a-time", async () => {
    assert.match(await text(page, ".inst-copy"), /Alex Rivera[\s\S]*Ex-Shopify[\s\S]*500\+ students mentored/);
    assert.equal(await page.locator(".socials a").count(), 3);
    assert.equal(await page.locator(".formats article").count(), 3);
    assert.equal(await page.locator(".tm").count(), 3);
    assert.match(await text(page, ".plan.best"), /Best Value[\s\S]*\$599[\s\S]*\$1,199/);
    assert.match(await text(page, ".plan:not(.best)"), /\$219\/month[\s\S]*\$657 total/);
    assert.equal(await css(page, ".plan.best", "borderTopColor"), "rgb(99, 102, 241)");
    assert.match(await text(page, ".secure"), /Stripe/);
    await page.click(".faq details:nth-child(1) summary"); await page.click(".faq details:nth-child(3) summary"); await page.waitForTimeout(200);
    assert.deepEqual(await page.$$eval(".faq details", (d) => d.map((x) => x.open)), [false, false, true, false, false, false]);
  });
  await check("preview modal plays captions; enroll dialog validates, switches plans and confirms", async () => {
    await page.click(".hero [data-preview]");
    await page.click("[data-play]"); await page.waitForTimeout(2200);
    assert.match(await text(page, "[data-cap]"), /Module 3/);
    assert.match(await text(page, "[data-ptime]"), /0:0[12] \/ 0:38/);
    await page.click("[data-to-enroll]");
    assert.match(await text(page, "[data-sum]"), /One-Time Payment\$599 today/);
    await page.click('[data-plan="plan"]');
    assert.match(await text(page, "[data-sum]"), /\$657 total/);
    await page.click("[data-enroll-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name and a valid email/);
    await page.fill("[name=name]", "Jordan Lee"); await page.fill("[name=email]", "jordan@mail.example");
    await page.click("[data-enroll-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /You're in, Jordan![\s\S]*3-Month Plan/);
    await page.click("[data-close-ok]");
    assert.match(await text(page, ".nav-cta"), /Enrolled/);
  });
  await check("dark final CTA with live countdown and spots", async () => {
    assert.equal(await css(page, ".final", "backgroundColor"), "rgb(30, 27, 75)");
    const s1 = await text(page, '[data-cd-u="s"]'); await page.waitForTimeout(1100);
    assert.notEqual(await text(page, '[data-cd-u="s"]'), s1);
    assert.ok(Number(await text(page, '[data-cd-u="d"]')) >= 0);
    assert.match(await text(page, "[data-cd-date]"), /April 14, 20\d\d/);
    assert.match(await text(page, ".spots"), /35 spots available per cohort/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: single column, sticky bottom CTA after hero, hidden over final CTA, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".learn", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".tms", "gridTemplateColumns")).split(" ").length, 1);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector("#curriculum").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector(".final").scrollIntoView()); await p.waitForTimeout(400);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .socials a, .mod-h, .faq summary")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
