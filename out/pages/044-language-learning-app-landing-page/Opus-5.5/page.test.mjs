// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/044-language-learning-app-landing-page/Opus-5.5/page.test.mjs
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
  await check("sticky nav, purple CTA, site-language switch translates nav and hero", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(124, 58, 237)");
    assert.equal(await text(page, "h1"), "Speak a New Language in 30 Days");
    await page.selectOption("[data-ui-lang]", "es");
    assert.equal(await text(page, "h1"), "Habla un nuevo idioma en 30 días");
    assert.equal(await text(page, ".nav-links a >> nth=2"), "Precios");
    await page.selectOption("[data-ui-lang]", "fr");
    assert.equal(await text(page, "h1"), "Parlez une nouvelle langue en 30 jours");
    await page.selectOption("[data-ui-lang]", "en");
    assert.match(await text(page, ".mini"), /4\.8★ App Store[\s\S]*2M\+ Learners[\s\S]*15 Languages[\s\S]*AI-Powered/);
    assert.equal(await page.locator(".phone .msg").count(), 4);
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(245, 243, 255\)/);
  });
  await check("watch modal cycles steps; press logos bar", async () => {
    await page.click("[data-watch]");
    assert.match(await text(page, "[data-demo-cap]"), /Chat with your AI partner/);
    await page.waitForTimeout(2800);
    assert.match(await text(page, "[data-demo-cap]"), /Earn XP/);
    await page.keyboard.press("Escape");
    assert.deepEqual(await page.$$eval(".press li:not(.dup)", (l) => l.map((x) => x.textContent)), ["TechCrunch", "WIRED", "The Verge", "Forbes", "EdSurge"]);
    assert.equal(await css(page, ".press", "backgroundColor"), "rgb(249, 250, 251)");
  });
  await check("5 language cards with drawn flags; selecting one updates the lesson preview; keyboard arrows", async () => {
    assert.equal(await page.locator(".lang").count(), 5);
    assert.equal(await page.locator(".lang .flag svg").count(), 5);
    assert.doesNotMatch(await text(page, "[data-langs]"), /[\u{1F1E6}-\u{1F1FF}]/u);
    assert.match(await text(page, '[data-lang="2"]'), /Japanese[\s\S]*180\+ lessons · 18M speakers learning/);
    await page.click('[data-lang="2"]');
    assert.equal(await page.getAttribute('[data-lang="2"]', "aria-checked"), "true");
    assert.match(await text(page, "[data-preview]"), /Japanese · Lesson 1[\s\S]*駅[\s\S]*eki[\s\S]*station/);
    await page.focus('[data-lang="2"]'); await page.keyboard.press("ArrowRight");
    assert.match(await text(page, "[data-preview]"), /German/);
    await page.hover('[data-lang="0"]'); await page.waitForTimeout(300);
    assert.match(await css(page, '[data-lang="0"]', "transform"), /matrix\(1\.04/);
  });
  await check("3 numbered steps with illustrations and dotted connector", async () => {
    assert.deepEqual(await page.$$eval(".steps h3", (h) => h.map((x) => x.textContent)), ["AI Conversation Partner", "Gamified Daily Lessons", "Pronunciation Coach"]);
    assert.equal(await page.locator(".s-art svg").count(), 3);
    assert.equal(await page.$eval(".steps", (e) => getComputedStyle(e, "::before").borderTopStyle), "dotted");
  });
  await check("mini lesson: wrong match shakes, tap and drag matches, confetti success, reset", async () => {
    await page.locator("[data-lesson]").scrollIntoViewIfNeeded();
    await page.click('[data-src="0"]'); await page.click('[data-dst="1"]');
    assert.match(await text(page, "[data-l-hint]"), /Not quite/);
    await page.click('[data-src="0"]'); await page.click('[data-dst="0"]');
    await page.click('[data-src="1"]'); await page.click('[data-dst="1"]');
    await page.dragAndDrop('[data-src="2"]', '[data-dst="2"]');
    assert.equal(await page.evaluate(() => MuseLingua.matched()), 3);
    await page.click('[data-src="3"]'); await page.click('[data-dst="3"]');
    assert.equal(await page.locator("[data-l-done]").isVisible(), true);
    assert.match(await text(page, "[data-l-done]"), /¡Perfecto! 4\/4[\s\S]*\+40 XP/);
    await page.click("[data-l-reset]");
    assert.equal(await text(page, "[data-l-score]"), "0/4");
  });
  await check("features, progress dashboard, testimonials, pricing toggle, FAQ animation", async () => {
    assert.equal(await page.locator(".feats article").count(), 6);
    assert.match(await text(page, ".dash"), /32day streak[\s\S]*1,240words learned[\s\S]*B1 Intermediate68%/);
    assert.equal(await page.locator(".bars span").count(), 7);
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await page.locator(".tm .stars .i").count(), 15);
    assert.deepEqual(await page.$$eval(".plan .price b", (b) => b.map((x) => x.textContent)), ["$0", "$9.99", "$14.99"]);
    await page.click('[data-bill="a"]');
    assert.deepEqual(await page.$$eval(".plan .price b", (b) => b.map((x) => x.textContent)), ["$0", "$5.99", "$8.99"]);
    assert.equal(await css(page, ".plan.pop", "borderTopColor"), "rgb(124, 58, 237)");
    assert.equal(await page.locator(".plan .btn").count(), 3);
    await page.click('.plan.pop [data-trial]');
    await page.fill("[data-signup] [name=email]", "learner@mail.example"); await page.click("[data-signup] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Pro plan is ready/);
    await page.keyboard.press("Escape");
    const q = page.locator("[data-fq]").nth(4);
    await q.click(); await page.waitForTimeout(350);
    assert.equal(await q.getAttribute("aria-expanded"), "true");
    assert.match(await page.locator(".fq-a").nth(4).textContent(), /microphone works/);
    assert.match(await page.locator(".pm").nth(4).evaluate((e) => getComputedStyle(e).transform), /matrix\(0\.707/);
  });
  await check("final gradient CTA with store badges; footer columns", async () => {
    assert.match(await css(page, ".final", "backgroundImage"), /rgb\(124, 58, 237\)[\s\S]*rgb\(109, 40, 217\)/);
    assert.equal(await page.locator(".store").count(), 2);
    assert.equal(await page.locator(".foot-cols > div").count(), 4);
    assert.match(await text(page, ".foot-bot"), /© 2026 LinguaLeap\. Privacy Policy · Terms of Service/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: drawer, scrolling language cards and press bar, stacked features, Pro first, sticky Start Free, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-menu-open]"); await p.waitForTimeout(300);
    assert.equal(await p.getAttribute("[data-drawer]", "aria-hidden"), "false");
    await p.click("[data-menu-close]"); await p.waitForTimeout(300);
    assert.ok(await p.$eval("[data-langs]", (e) => e.scrollWidth > e.clientWidth));
    assert.notEqual(await css(p, ".press ul", "animationName"), "none");
    assert.equal((await css(p, ".feats", "gridTemplateColumns")).split(" ").length, 1);
    const pro = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), free = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pro < free);
    await p.evaluate(() => document.getElementById("demo").scrollIntoView()); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect().top)) < 844);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .tile, .lang, .say, [data-fq], .bill button, .foot-cols a, .socials a, select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
