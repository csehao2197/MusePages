// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/042-coding-bootcamp/Opus-5.5/page.test.mjs
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
  await check("dismissible indigo announcement, sticky nav, hero copy, CTAs, trust row, illustration", async () => {
    assert.equal(await css(page, "[data-announce]", "backgroundColor"), "rgb(79, 70, 229)");
    assert.match(await text(page, "[data-announce]"), /Summer 2026 cohort now open — Classes start June 15/);
    await page.click("[data-announce-x]"); assert.equal(await page.locator("[data-announce]").isHidden(), true);
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await text(page, "h1"), "Launch Your Tech Career in 12 Weeks");
    assert.match(await text(page, ".trust"), /4\.8★ on Course Report[\s\S]*Licensed by State Board of Education[\s\S]*1,200\+ Graduates/);
    assert.equal(await page.locator(".hero-art svg").count(), 1);
  });
  await check("outcomes count up on a dark band and the report opens", async () => {
    assert.equal(await css(page, ".outcomes", "backgroundColor"), "rgb(30, 27, 75)");
    await page.locator("[data-stats]").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-n="1200"]').textContent === "1,200+");
    assert.deepEqual(await page.$$eval(".stats b", (b) => b.map((x) => x.textContent)), ["93%", "$78K", "1,200+", "300+"]);
    await page.click(".outcomes [data-report]"); assert.match(await text(page, "[data-dlg-body]"), /Outcomes report summary/); await page.keyboard.press("Escape");
  });
  await check("program cards: colored top borders, facts, hover lift, Learn More with real syllabus PDF, compare table", async () => {
    assert.equal(await page.locator(".prog").count(), 3);
    assert.deepEqual(await page.$$eval(".prog", (p) => p.map((x) => getComputedStyle(x).borderTopColor)), ["rgb(59, 130, 246)", "rgb(16, 185, 129)", "rgb(139, 92, 246)"]);
    assert.match(await text(page, ".prog >> nth=1"), /12 weeks full-time \/ 24 weeks part-time[\s\S]*Python, SQL, TensorFlow, Tableau[\s\S]*4 portfolio projects \+ capstone[\s\S]*\$13,900/);
    await page.hover(".prog >> nth=0"); await page.waitForTimeout(300);
    assert.match(await css(page, ".prog:first-child", "transform"), /matrix\(1, 0, 0, 1, 0, -6\)/);
    await page.click('.prog [data-learn="2"]');
    assert.match(await text(page, "[data-dlg-body]"), /UX Design[\s\S]*Figma · Adobe XD · Maze · Hotjar/);
    const pdf = await page.request.get(new URL(await page.getAttribute("[data-dlg-body] a[download]", "href"), server.url).href);
    assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
    await page.keyboard.press("Escape");
    await page.click("[data-compare]");
    assert.equal(await page.locator(".cmp tbody tr").count(), 7);
    assert.match(await text(page, ".cmp"), /Pay upfront\$13,900\$12,900\$10,900/);
    await page.keyboard.press("Escape");
  });
  await check("timeline with 4 numbered steps; 4 testimonials with employers; partner marquee", async () => {
    assert.deepEqual(await page.$$eval(".steps h3", (h) => h.map((x) => x.textContent)), ["Apply Online", "Interview & Prep", "Immersive Learning", "Career Launch"]);
    assert.equal(await page.$eval(".steps", (e) => getComputedStyle(e, "::before").borderTopStyle), "dotted");
    assert.equal(await page.locator(".tm").count(), 4);
    assert.match(await text(page, ".tms"), /Maria Chen[\s\S]*Shopify[\s\S]*Jamal Williams[\s\S]*Capital One[\s\S]*Priya Patel[\s\S]*IBM[\s\S]*Alex Rivera[\s\S]*Stripe/);
    assert.equal(await page.locator("[data-track] ul:first-child li").count(), 8);
    assert.equal(await css(page, "[data-track] li", "filter"), "grayscale(1)");
  });
  await check("financing recalculates per program; info session registration; FAQ with 8 items", async () => {
    assert.match(await text(page, "[data-fins]"), /\$13,900[\s\S]*\$1,241\.67[\s\S]*Most popular[\s\S]*Income Share Agreement/);
    await page.selectOption("[data-fin-prog]", "2");
    assert.match(await text(page, "[data-fins]"), /\$10,900[\s\S]*\$991\.67/);
    assert.match(await text(page, "#financing .fine"), /GI Bill® and MyCAA accepted/);
    assert.equal(await page.locator(".ev").count(), 3);
    await page.click('[data-reg="1"]');
    await page.fill("[data-reg-form] [name=name]", "Lee"); await page.fill("[data-reg-form] [name=email]", "lee@mail.example"); await page.click("[data-reg-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /You're registered[\s\S]*Campus Tour/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".ev >> nth=1"), /Registered/);
    assert.equal(await page.locator("[data-faq] details").count(), 8);
    await page.locator("[data-faq] summary").nth(2).click();
    assert.match(await text(page, "[data-faq] details[open]"), /\$50K\+/);
  });
  await check("apply flow validates and confirms; gradient final CTA; footer syllabus downloads", async () => {
    assert.match(await css(page, ".final", "backgroundImage"), /rgb\(79, 70, 229\)[\s\S]*rgb\(124, 58, 237\)/);
    await page.click(".final [data-apply]");
    await page.click("[data-app-form] [type=submit]");
    assert.match(await text(page, "[data-app-err]"), /first name[\s\S]*email[\s\S]*20\+/);
    await page.fill("[data-app-form] [name=first]", "Sam"); await page.fill("[data-app-form] [name=email]", "sam@mail.example");
    await page.selectOption("[data-app-form] [name=prog]", "1"); await page.selectOption("[data-app-form] [name=sched]", "Part-time");
    await page.fill("[data-app-form] [name=why]", "I want to move from accounting into data analysis.");
    await page.click("[data-app-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Application received[\s\S]*Sam[\s\S]*part-time Data Science interview/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator('.foot a[download][href$=".pdf"]').count(), 3);
    assert.match(await text(page, ".foot"), /© 2026 LaunchCode Academy\. All rights reserved\./);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked programs, vertical timeline, 2x2 stats, 1-col testimonials, sticky Apply bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".progs", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".steps", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".stats", "gridTemplateColumns")).split(" ").length, 2);
    assert.equal((await css(p, ".tms", "gridTemplateColumns")).split(" ").length, 1);
    await p.evaluate(() => document.getElementById("programs").scrollIntoView()); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect().top)) < 844);
    await p.click("[data-menu-btn]"); assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .faq summary, .foot-cols a, .socials a, .ann-x, select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
