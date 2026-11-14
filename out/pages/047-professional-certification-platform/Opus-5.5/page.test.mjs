// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/047-professional-certification-platform/Opus-5.5/page.test.mjs
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
  await check("grid hero 60/40 with CTAs, metrics and shimmering certificate; auto-scrolling logos pause on hover", async () => {
    assert.match(await css(page, ".hero", "backgroundImage"), /linear-gradient/);
    assert.equal(await text(page, "h1"), "Certifications That Actually Get You Hired");
    assert.equal(await css(page, ".hero .btn-primary", "backgroundColor"), "rgb(37, 99, 235)");
    assert.match(await text(page, ".metrics"), /45,000\+[\s\S]*92%[\s\S]*500\+/);
    const cw = await page.$eval(".hero-copy", (e) => e.getBoundingClientRect().width), aw = await page.$eval(".hero-art", (e) => e.getBoundingClientRect().width);
    assert.ok(cw > aw * 1.3);
    assert.match(await css(page, ".shimmer", "animationName"), /shimmer/);
    assert.equal(await page.locator(".marquee li").count(), 16);
    assert.equal(await css(page, ".marquee ul", "animationPlayState"), "running");
    await page.hover(".marquee"); assert.equal(await css(page, ".marquee ul", "animationPlayState"), "paused");
  });
  await check("catalog: 5 tabs with counts, 6 cards, filter, view all 12, difficulty bars, details dialog and checkout", async () => {
    assert.deepEqual(await page.$$eval("[data-tab]", (t) => t.map((x) => x.textContent)), ["All (12)", "Cloud & Infrastructure (4)", "Data & Analytics (3)", "Cybersecurity (3)", "AI & Machine Learning (2)"]);
    assert.equal(await page.locator(".card").count(), 6);
    assert.match(await text(page, ".card >> nth=0"), /Expert level[\s\S]*Cloud Architecture Professional[\s\S]*80 hrs study \+ 3 hr exam[\s\S]*\$549[\s\S]*2,340 certified/);
    assert.equal(await css(page, ".card:nth-child(1) .diff i:nth-of-type(3)", "backgroundColor"), "rgb(239, 68, 68)");
    assert.equal(await css(page, ".card:nth-child(5) .diff i:nth-of-type(2)", "backgroundColor"), "rgb(226, 232, 240)");
    await page.click("[data-all]"); assert.equal(await page.locator(".card").count(), 12);
    await page.click('[data-tab="sec"]'); assert.equal(await page.locator(".card").count(), 3);
    await page.click('[data-tab="ai"]'); assert.equal(await page.locator(".card").count(), 2);
    await page.click('[data-tab="all"]');
    await page.click('[data-details="DEA"]');
    assert.match(await text(page, "[data-dlg-body]"), /Data Engineering Associate[\s\S]*50 hrs[\s\S]*\$399/);
    await page.click("[data-buy-cert]");
    assert.equal(await page.inputValue("[data-co] select"), "DEA");
    await page.click("[data-co] [type=submit]"); assert.match(await text(page, "[data-err]"), /valid email/);
    await page.fill("[data-co] [name=name]", "Lee Park"); await page.fill("[data-co] [name=email]", "lee@mail.example"); await page.click("[data-co] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /You're set, Lee![\s\S]*Data Engineering Associate/);
    await page.keyboard.press("Escape");
  });
  await check("4 steps with blue numbers on #EFF6FF; free assessment recommends a cert", async () => {
    assert.equal(await css(page, "#how", "backgroundColor"), "rgb(239, 246, 255)");
    assert.equal(await page.locator(".steps li").count(), 4);
    assert.equal(await css(page, ".num", "backgroundColor"), "rgb(37, 99, 235)");
    await page.click("[data-quiz]");
    await page.click("[data-next]"); assert.match(await text(page, "[data-err]"), /Choose/);
    for (const k of [1, 0, 0]) { await page.click(`.q label >> nth=${k}`); await page.click("[data-next]"); }
    assert.match(await text(page, "[data-dlg-body]"), /Data Analytics Fundamentals/);
    await page.keyboard.press("Escape");
  });
  await check("learning preview mockup + 6 features; ROI stats count up; 3 stories", async () => {
    assert.match(await text(page, ".mock"), /67%[\s\S]*Module 5: Distributed Systems[\s\S]*14-day streak[\s\S]*Next study session/);
    assert.equal(await page.locator(".feats li").count(), 6);
    await page.locator(".stats").scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
    assert.deepEqual(await page.$$eval(".stats b", (b) => b.map((x) => x.textContent)), ["$24,000", "92%", "3.2x"]);
    assert.equal(await css(page, ".stats article:nth-child(1) b", "color"), "rgb(22, 163, 74)");
    assert.match(await text(page, ".source"), /n=4,200/);
    assert.equal(await page.locator(".stories article").count(), 3);
  });
  await check("employer verification: empty, sample ID, email and unknown lookups; Talk to Sales", async () => {
    await page.click("[data-verify] [type=submit]"); assert.match(await text(page, "[data-v-out]"), /Enter a credential ID/);
    await page.click('[data-sample="CP-CAP-7F3K-2291"]'); await page.waitForTimeout(800);
    assert.match(await text(page, "[data-v-out]"), /Valid credential[\s\S]*Jordan Avery[\s\S]*Cloud Architecture Professional/);
    await page.fill("#v-in", "AMARA.OSEI@mail.example"); await page.click("[data-verify] [type=submit]"); await page.waitForTimeout(800);
    assert.match(await text(page, "[data-v-out]"), /Amara Osei/);
    await page.fill("#v-in", "CP-XXX-0000-0000"); await page.click("[data-verify] [type=submit]"); await page.waitForTimeout(800);
    assert.match(await text(page, "[data-v-out]"), /No active credential/);
    await page.click(".emp-f [data-sales]");
    await page.fill("[data-sales-form] [name=email]", "hr@co.example"); await page.fill("[data-sales-form] [name=co]", "Acme"); await page.click("[data-sales-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /request received/);
    await page.keyboard.press("Escape");
  });
  await check("pricing: popular middle scaled with blue border; compare table; testimonials; FAQ; final signup", async () => {
    assert.match(await text(page, ".plan.pop"), /MOST POPULAR[\s\S]*\$999\/year/);
    assert.match(await css(page, ".plan.pop", "transform"), /matrix\(1\.04/);
    assert.equal(await css(page, ".plan.pop", "borderTopColor"), "rgb(37, 99, 235)");
    await page.click("[data-compare]"); assert.equal(await page.locator(".cmp tbody tr").count(), 12); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await css(page, ".tm", "borderLeftWidth"), "4px");
    assert.equal(await page.locator(".tm .stars .i").count(), 15);
    assert.equal(await page.locator(".tm .li").count(), 3);
    await page.click(".faq details:nth-child(2) summary"); await page.click(".faq details:nth-child(6) summary"); await page.waitForTimeout(200);
    assert.deepEqual(await page.$$eval(".faq details", (d) => d.map((x) => x.open)), [false, false, false, false, false, true]);
    assert.equal(await css(page, ".final", "backgroundColor"), "rgb(30, 41, 59)");
    await page.click("[data-signup] [type=submit]"); assert.match(await text(page, "[data-su-msg]"), /valid email/);
    await page.fill("#su-email", "me@mail.example"); await page.click("[data-signup] [type=submit]");
    assert.match(await text(page, "[data-su-msg]"), /Free account created/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: art above headline, 1-col grid, scrollable tabs, vertical steps, snap pricing, floating CTA bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.ok(await p.$eval(".hero-art", (e) => e.getBoundingClientRect().top) < await p.$eval("h1", (e) => e.getBoundingClientRect().top));
    assert.equal((await css(p, ".grid", "gridTemplateColumns")).split(" ").length, 1);
    assert.ok(await p.$eval("[data-tabs]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal((await css(p, ".steps", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".plans", "scrollSnapType"), "x mandatory");
    assert.ok(await p.$eval(".plans", (e) => e.scrollWidth > e.clientWidth));
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector("#how").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .tab, .tm .li, .faq summary, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
