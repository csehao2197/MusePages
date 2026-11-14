// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/030-ux-ui-designer-portfolio/Opus-5.5/page.test.mjs
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
  await check("hero copy, CTAs, dotted grid, three rendered mockups; sticky blurred nav", async () => {
    assert.equal(await text(page, ".eyebrow"), "UX/UI Designer · San Francisco");
    assert.equal(await text(page, "h1"), "I design digital products that people actually enjoy using.");
    assert.match(await text(page, ".hero .lead"), /Senior Product Designer at Notion/);
    assert.equal(await page.locator(".hero-ctas .btn-primary").textContent(), "View My Work");
    assert.equal(await css(page, ".hero", "backgroundColor"), "rgb(250, 250, 250)");
    assert.match(await css(page, ".hero", "backgroundSize"), /40px 40px/);
    assert.equal(await page.locator(".hero-art svg").count(), 3);
    assert.match(await css(page, ".stage", "transform"), /matrix/);
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgba(255, 255, 255, 0.85)");
    assert.match(await css(page, "[data-nav]", "backdropFilter"), /blur/);
    await page.hover(".nav-cta"); await page.waitForTimeout(260);
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(99, 102, 241)");
  });
  await check("resume download is a real PDF", async () => {
    const res = await page.request.get(new URL(await page.getAttribute("[data-resume]", "href"), server.url).href);
    assert.equal(res.status(), 200);
    assert.equal((await res.body()).subarray(0, 5).toString(), "%PDF-");
    assert.equal(await page.getAttribute("[data-resume]", "download"), "");
  });
  await check("selected work: 4 alternating cards with tags, metrics, art and hover lift", async () => {
    assert.equal(await text(page, ".count"), "4 Projects");
    assert.equal(await page.locator(".project").count(), 4);
    assert.equal(await page.locator(".project.flip").count(), 2);
    assert.match(await text(page, '[data-project="0"]'), /Product Design · Mobile · 2025[\s\S]*Notion Calendar Redesign[\s\S]*34%faster task creation[\s\S]*4\.8★App Store rating/);
    assert.match(await text(page, '[data-project="3"]'), /WCAG 2\.1 compliant[\s\S]*40%fewer missed appointments/);
    assert.equal(await page.locator(".p-media svg").count(), 4);
    assert.equal(await css(page, ".project", "borderTopLeftRadius"), "24px");
    assert.equal(await css(page, ".p-media", "borderTopLeftRadius"), "16px");
    const a = await page.$eval('[data-project="1"] .p-media', (e) => e.getBoundingClientRect().left);
    const b = await page.$eval('[data-project="0"] .p-media', (e) => e.getBoundingClientRect().left);
    assert.ok(a > b + 300, "image side alternates");
    await page.hover('[data-project="1"] h3'); await page.waitForTimeout(260);
    assert.match(await css(page, '[data-project="1"]', "transform"), /matrix\(1, 0, 0, 1, 0, -4\)/);
  });
  await check("case study dialog opens, steps through projects and closes", async () => {
    await page.click('[data-open-case="2"]');
    assert.equal(await page.locator("[data-case]").isVisible(), true);
    assert.equal(await text(page, "[data-case-title]"), "Figma Plugin Manager");
    assert.match(await text(page, "[data-case-body]"), /Problem[\s\S]*Process[\s\S]*Outcome/);
    await page.click('[data-case-step="1"]');
    assert.equal(await text(page, "[data-case-title]"), "HealthTrack Patient Portal");
    await page.click('[data-case-step="1"]');
    assert.equal(await text(page, "[data-case-title]"), "Notion Calendar Redesign");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-case]").isVisible(), false);
  });
  await check("process: 4 steps with icon circles, dashed connectors and quote", async () => {
    assert.deepEqual(await page.$$eval(".steps h3", (h) => h.map((x) => x.textContent)), ["Discover", "Define", "Design", "Deliver"]);
    assert.equal(await css(page, ".step-ico", "width"), "48px");
    assert.equal(await css(page, ".step-ico", "backgroundColor"), "rgb(238, 242, 255)");
    assert.equal(await page.$eval(".steps li:nth-child(2)", (e) => getComputedStyle(e, "::after").borderTopStyle), "dashed");
    assert.match(await text(page, ".pull"), /making things work for real people/);
    assert.equal(await css(page, ".pull", "borderLeftColor"), "rgb(99, 102, 241)");
  });
  await check("tools: 12 chips with icons and indigo hover", async () => {
    assert.equal(await page.locator(".chips li").count(), 12);
    assert.equal(await page.locator(".chips li svg").count(), 12);
    await page.hover(".chips li >> nth=0"); await page.waitForTimeout(260);
    assert.equal(await css(page, ".chips li", "backgroundColor"), "rgb(238, 242, 255)");
    assert.equal(await css(page, ".chips li", "borderTopColor"), "rgb(99, 102, 241)");
  });
  await check("about, facts with icons (no emoji), LinkedIn; 4 testimonials", async () => {
    assert.match(await text(page, ".about-copy"), /7 years of experience[\s\S]*hiking in Marin/);
    assert.equal(await page.locator(".facts li svg").count(), 3);
    assert.doesNotMatch(await page.textContent("body"), /[\u{1F300}-\u{1FAFF}☕]/u);
    assert.equal(await page.locator(".tm").count(), 4);
    assert.equal(await css(page, ".tm", "borderLeftWidth"), "3px");
    assert.match(await text(page, ".tms"), /Elena Park[\s\S]*Product Manager at Figma/);
  });
  await check("contact form validates, succeeds (demo) and resets", async () => {
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email[\s\S]*message/);
    assert.equal(await page.getAttribute("#f-name", "aria-invalid"), "true");
    await page.fill("#f-name", "Jordan Lee"); await page.fill("#f-email", "jordan@company.example");
    await page.selectOption("#f-type", "Design System"); await page.fill("#f-msg", "We need a token-based design system for our app.");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-sent-text]"), /Thanks, Jordan[\s\S]*design system inquiry[\s\S]*Demo/);
    await page.click("[data-reset]");
    assert.equal(await page.inputValue("#f-name"), "");
    assert.match(await text(page, ".direct"), /ava@avachen\.design/);
    assert.equal(await page.locator("#contact .socials a").count(), 4);
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(17, 24, 39)");
    assert.match(await text(page, ".foot"), /Designed and built with Figma \+ code[\s\S]*© 2026 Ava Chen/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked hero, drawer, single-column cards, vertical process, 3-per-row chips, full-width submit, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const copy = await p.$eval(".hero-copy", (e) => e.getBoundingClientRect().bottom), art = await p.$eval(".hero-art", (e) => e.getBoundingClientRect().top);
    assert.ok(art >= copy, "text above mockups");
    await p.click("[data-menu-open]"); await p.waitForTimeout(350);
    assert.equal(await p.getAttribute("[data-drawer]", "aria-hidden"), "false");
    await p.click('[data-drawer] a[href="#process"]'); await p.waitForTimeout(350);
    assert.equal(await p.getAttribute("[data-drawer]", "aria-hidden"), "true");
    const media = await p.$eval('[data-project="1"] .p-media', (e) => e.getBoundingClientRect().top), body = await p.$eval('[data-project="1"] .p-body', (e) => e.getBoundingClientRect().top);
    assert.ok(media < body, "image on top for flipped card");
    assert.equal((await css(p, ".steps", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await p.$eval(".steps li:nth-child(1)", (e) => getComputedStyle(e, "::after").borderLeftStyle), "dashed");
    assert.equal((await css(p, ".chips", "gridTemplateColumns")).split(" ").length, 3);
    assert.equal((await css(p, ".tms", "gridTemplateColumns")).split(" ").length, 1);
    const w = await p.$eval(".submit", (e) => [e.offsetWidth, e.parentElement.clientWidth - 44]);
    assert.equal(w[0], w[1]);
    const small = await p.evaluate(() => [...document.querySelectorAll("a, button, .chips li, input, select, textarea")].filter((b) => b.offsetParent && !b.closest(".skip, .drawer") && b.getBoundingClientRect().height < 44 && !b.closest("p.direct")).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
