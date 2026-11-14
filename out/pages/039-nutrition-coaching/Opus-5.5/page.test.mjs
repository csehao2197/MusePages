// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/039-nutrition-coaching/Opus-5.5/page.test.mjs
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
  await check("hero split layout, headline, CTA, trust badges, green gradient, meal spread art", async () => {
    assert.equal(await text(page, "h1"), "Eat Smarter. Perform Better. Feel Amazing.");
    assert.match(await text(page, ".hero .sub"), /backed by science/);
    assert.deepEqual(await page.$$eval(".badges li", (l) => l.map((x) => x.textContent.trim())), ["500+ Clients Coached", "Certified Nutritionists", "No Fad Diets"]);
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(240, 255, 244\)/);
    const c = await page.$eval(".hero-copy", (e) => e.getBoundingClientRect().left), a = await page.$eval(".hero-art", (e) => e.getBoundingClientRect().left);
    assert.ok(a > c + 400, "art on the right");
    assert.equal(await page.locator(".spread svg").count(), 1);
  });
  await check("problems with X icons → solutions with checks", async () => {
    assert.equal(await page.locator(".problems .mk.no").count(), 3);
    assert.equal(await page.locator(".solutions .mk.yes").count(), 3);
    assert.match(await text(page, ".solutions"), /Weekly 1-on-1 check-ins with your coach/);
  });
  await check("plans: 3 tiers, Pro highlighted, annual toggle saves 20%", async () => {
    assert.deepEqual(await page.$$eval(".plan .price b", (b) => b.map((x) => x.textContent)), ["$99", "$179", "$299"]);
    assert.match(await text(page, ".plan.pop"), /Most Popular[\s\S]*Pro/);
    assert.equal(await css(page, ".plan.pop", "borderTopColor"), "rgb(16, 185, 129)");
    await page.click("[data-annual]");
    assert.equal(await page.getAttribute("[data-annual]", "aria-checked"), "true");
    assert.deepEqual(await page.$$eval(".plan .price b", (b) => b.map((x) => x.textContent)), ["$79", "$143", "$239"]);
    assert.match(await text(page, ".plan.pop .billed"), /\$1716 billed yearly · save \$432/);
    assert.equal(await page.locator(".plan .btn").count(), 3);
  });
  await check("how-it-works alternating timeline; 4 coaches with Book a Call; 3 result cards with green left border", async () => {
    assert.equal(await page.locator(".timeline li").count(), 4);
    const l = await page.$$eval(".t-card", (c) => c.map((x) => Math.round(x.getBoundingClientRect().left)));
    assert.ok(l[0] < l[1] && l[2] < l[1], "cards alternate sides");
    assert.deepEqual(await page.$$eval(".coach h3", (h) => h.map((x) => x.textContent)), ["Dr. Amanda Chen", "Marcus Johnson", "Sofia Reyes", "David Kim"]);
    await page.click('[data-call="2"]');
    assert.match(await text(page, "#as-title"), /Sofia Reyes/);
    await page.fill("[data-quiz] [name=email]", "me@mail.example"); await page.click("[data-q-next]");
    assert.match(await text(page, "[data-q-body]"), /Call booked[\s\S]*Tomorrow 9:00 AM with Sofia Reyes/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".res").count(), 3);
    assert.match(await page.$eval(".res", (e) => getComputedStyle(e, "::before").backgroundImage), /linear-gradient/);
  });
  await check("sample day: 5 meals, brief's totals, swapping a meal recalculates", async () => {
    assert.equal(await page.locator(".ml").count(), 5);
    assert.match(await text(page, ".ml >> nth=2"), /12:30 PM[\s\S]*Grilled chicken quinoa bowl[\s\S]*550 cal · 42g protein/);
    assert.equal(await text(page, "[data-tot-cal]"), "2,020");
    assert.deepEqual(await page.$$eval("[data-macro]", (b) => b.map((x) => x.textContent)), ["141g", "198g", "78g"]);
    await page.click('[data-swap="3"]');
    assert.match(await text(page, ".ml >> nth=3"), /Protein shake/);
    assert.equal(await text(page, "[data-tot-cal]"), "2,010");
    assert.equal(await text(page, '[data-macro="p"]'), "159g");
    await page.click('[data-swap="3"]');
    assert.equal(await text(page, "[data-tot-cal]"), "2,020");
    assert.match(await text(page, ".totals .note"), /100% customized/);
  });
  await check("FAQ accordion; lead capture validates then opens the assessment, which recommends a plan", async () => {
    const f = page.locator("[data-faq] details");
    await f.nth(2).locator("summary").click();
    assert.match(await f.nth(2).textContent(), /4-6 weeks/);
    assert.match(await css(page, ".lead", "backgroundImage"), /rgb\(16, 185, 129\)[\s\S]*rgb\(5, 150, 105\)/);
    await page.fill("#lead-email", "bad"); await page.click("[data-lead] [type=submit]");
    assert.match(await text(page, "[data-lead-err]"), /valid email/);
    await page.fill("#lead-email", "sam@mail.example"); await page.click("[data-lead] [type=submit]");
    assert.equal(await page.locator("[data-dlg]").isVisible(), true);
    await page.click("[data-q-next]"); assert.match(await text(page, "[data-q-err]"), /Pick one/);
    await page.click('.opt:has-text("Build muscle")'); await page.click("[data-q-next]");
    await page.click('.opt:has-text("Pescatarian")'); await page.click("[data-q-next]");
    await page.click('.opt:has-text("Nuts")'); await page.click("[data-q-next]");
    await page.click('.opt:has-text("15–30 minutes")'); await page.click("[data-q-next]");
    await page.click('.opt:has-text("Weekly check-ins")'); await page.click("[data-q-next]");
    assert.equal(await page.inputValue("[data-quiz] [name=email]"), "sam@mail.example");
    await page.click("[data-q-next]");
    assert.match(await text(page, "[data-q-body]"), /We recommend Pro[\s\S]*David Kim[\s\S]*Avoiding nuts[\s\S]*sam@mail\.example/);
    await page.click("[data-q-next]");
    assert.equal(await page.locator("[data-dlg]").isVisible(), false);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: single-column stack, Pro first, vertical timeline, stacked lead form, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const copy = await p.$eval(".hero-copy", (e) => e.getBoundingClientRect().bottom), art = await p.$eval(".hero-art", (e) => e.getBoundingClientRect().top);
    assert.ok(art >= copy);
    assert.equal((await css(p, ".ps", "gridTemplateColumns")).split(" ").length, 1);
    const pro = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), st = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pro < st);
    assert.equal(await css(p, ".lead-form", "flexDirection"), "column");
    await p.click("[data-menu-btn]"); assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .switch, .faq summary, .mnav a, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44 && !b.classList.contains("switch")).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.id));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
