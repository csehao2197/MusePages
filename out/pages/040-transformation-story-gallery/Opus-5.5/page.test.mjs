// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/040-transformation-story-gallery/Opus-5.5/page.test.mjs
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
  const context = await browser.newContext({ viewport, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, permissions: ["clipboard-read", "clipboard-write"] });
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
const count = (p) => p.evaluate(() => MuseAscend.count());

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero headline, stats, CTA and draggable before/after slider", async () => {
    assert.equal(await text(page, "h1"), "Real People. Real Results.");
    assert.match(await text(page, ".hstats"), /500\+Transformations[\s\S]*25 lbsAverage lost[\s\S]*95%Kept it off/);
    const s = page.locator(".hero-slider");
    const box = await s.boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2); await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2); await page.mouse.up();
    const dragged = +(await s.getAttribute("data-pos"));
    assert.ok(dragged <= 22, "drag moves the divider");
    await page.focus(".hero-slider .ba-range"); await page.keyboard.press("ArrowRight");
    assert.equal(+(await s.getAttribute("data-pos")), dragged + 1, "keyboard moves the divider");
  });
  await check("featured Sarah M. spotlight with stats, quote and full story", async () => {
    assert.match(await text(page, "#featured"), /Sarah M\.[\s\S]*65 lbs[\s\S]*8 months[\s\S]*38% → 22%[\s\S]*wear a swimsuit again/);
    await page.click('#featured [data-story="sarah"]');
    const b = await text(page, "[data-story-body]");
    assert.match(b, /Sarah Mitchell[\s\S]*Elementary school teacher[\s\S]*Austin, TX[\s\S]*March 2025/);
    assert.match(b, /The journey[\s\S]*Why I decided to change[\s\S]*Goals set/);
    assert.match(b, /Stats breakdown[\s\S]*218 lbs → 153 lbs[\s\S]*38% → 22%[\s\S]*Waist/);
    assert.match(b, /The program[\s\S]*In their own words[\s\S]*Trainer's note — Coach Leah Ortiz/);
    assert.equal(await page.locator(".prog-photos figure").count(), 4);
    assert.equal(await page.locator("[data-sb-slider] .ba-range").count(), 1);
    await page.keyboard.press("Escape");
  });
  await check("filters, search and sort update the 12-story gallery", async () => {
    assert.equal(await page.locator(".card").count(), 12);
    await page.selectOption('[data-f="goal"]', "Muscle Gain");
    assert.equal(await count(page), 3);
    await page.selectOption('[data-f="gender"]', "Female");
    assert.equal(await page.locator(".card").count(), 1);
    assert.match(await text(page, ".card"), /Mei C\., 31/);
    await page.click(".filters [data-reset]");
    await page.selectOption('[data-f="age"]', "60+");
    assert.deepEqual(await page.$$eval(".card h3", (h) => h.map((x) => x.textContent).sort()), ["Robert H., 63", "Tom G., 66"]);
    await page.click(".filters [data-reset]");
    await page.selectOption("[data-sort]", "biggest");
    assert.match(await text(page, ".card >> nth=0"), /Sarah M\./);
    await page.selectOption("[data-sort]", "popular");
    assert.match(await text(page, ".card >> nth=0"), /Sarah M\.[\s\S]*1,840/);
    await page.fill("[data-q]", "firefighter");
    assert.equal(await page.locator(".card").count(), 1);
    await page.fill("[data-q]", "zzz");
    assert.equal(await page.locator("[data-empty]").isVisible(), true);
    await page.click("[data-empty] [data-reset]");
    assert.equal(await page.locator(".card").count(), 12);
  });
  await check("cards reveal After on hover and via the Before/After toggle", async () => {
    const card = page.locator(".card").nth(1);
    await card.scrollIntoViewIfNeeded(); await page.mouse.move(2, 2); await page.waitForTimeout(450);
    assert.equal(await card.locator(".f-after").evaluate((e) => getComputedStyle(e).opacity), "0");
    await card.hover(); await page.waitForTimeout(450);
    assert.equal(await card.locator(".f-after").evaluate((e) => getComputedStyle(e).opacity), "1");
    await page.mouse.move(5, 5);
    await card.locator('[data-show="after"]').click(); await page.mouse.move(5, 5); await page.waitForTimeout(450);
    assert.equal(await card.locator(".flip").getAttribute("data-state"), "after");
    assert.equal(await card.locator(".f-after").evaluate((e) => getComputedStyle(e).opacity), "1");
  });
  await check("video stories play an animated reveal; program cards filter the gallery; stats count up", async () => {
    assert.equal(await page.locator(".vid").count(), 4);
    await page.click('[data-video="1"]');
    assert.match(await text(page, "[data-v-title]"), /Firefighter fit/);
    await page.waitForTimeout(800);
    assert.ok(await page.evaluate(() => MuseAscend.vt()) > 0.4);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".prog").count(), 5);
    await page.click('.prog:has-text("Nutrition Coaching")');
    assert.equal(await page.inputValue('[data-f="program"]'), "Nutrition Coaching");
    assert.equal(await count(page), 4);
    await page.click(".filters [data-reset]");
    await page.locator("[data-bigstats]").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-n="15000"]').textContent === "15,000+");
    assert.deepEqual(await page.$$eval("[data-n]", (b) => b.map((x) => x.textContent)), ["28 lbs", "12%", "87%", "91%", "15,000+"]);
  });
  await check("comparison gallery: next, dots, auto-play animates divider, share copies link", async () => {
    assert.match(await text(page, "[data-cp-info]"), /James K\./);
    await page.click('[data-cp="1"]');
    assert.match(await text(page, "[data-cp-info]"), /Aisha B\./);
    await page.click('[data-dot="4"]');
    assert.match(await text(page, "[data-cp-info]"), /Kevin W\./);
    await page.click("[data-autoplay]");
    const a = await page.getAttribute("[data-cp-slider]", "data-pos"); await page.waitForTimeout(600);
    assert.notEqual(await page.getAttribute("[data-cp-slider]", "data-pos"), a);
    await page.click("[data-autoplay]");
    await page.click("[data-cp-info] [data-share]");
    await page.waitForTimeout(200);
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /#story-/);
  });
  await check("disclaimer, story submission with photo upload + consent, consultation, FAQ, social feed", async () => {
    assert.match(await text(page, ".disclaimer"), /Results vary by individual[\s\S]*consistently[\s\S]*unedited[\s\S]*illustrated stand-ins[\s\S]*physician/);
    await page.setInputFiles("[data-files]", { name: "before.png", mimeType: "image/png", buffer: Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8cfc0f01f0005000201a3f1b1b70000000049454e44ae426082", "hex") });
    assert.equal(await page.locator("[data-thumbs] img").count(), 1);
    await page.fill("[data-submit-form] [name=name]", "Jordan Lee"); await page.fill("[data-submit-form] [name=email]", "jordan@mail.example");
    await page.fill("[data-submit-form] [name=story]", "I started at 240 pounds and could not climb stairs without stopping.");
    await page.click("[data-submit-form] [type=submit]");
    assert.match(await text(page, "[data-sub-err]"), /consent/);
    await page.check("[data-submit-form] [name=consent]");
    await page.click("[data-submit-form] [type=submit]");
    assert.match(await text(page, "[data-sub-text]"), /Jordan[\s\S]*1 photo[\s\S]*Demo/);
    await page.click(".cta [data-consult]");
    await page.fill("[data-consult-form] [name=name]", "Ana"); await page.fill("[data-consult-form] [name=email]", "ana@mail.example");
    await page.click("[data-consult-form] [type=submit]");
    assert.match(await text(page, "[data-cs-text]"), /Ana, a coach will email/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-faq] details").count(), 5);
    assert.equal(await page.locator(".feed .post").count(), 6);
    assert.match(await text(page, ".tags"), /#TransformationTuesday/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, single-column cards with swipe toggle, stacked sections, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, "[data-grid]", "gridTemplateColumns")).split(" ").length, 1);
    const card = p.locator(".card").nth(0);
    await card.scrollIntoViewIfNeeded();
    const box = await card.locator(".flip").boundingBox();
    await p.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); const t = (cx) => new Touch({ identifier: 1, target: el, clientX: cx, clientY: y }); el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [t(x)], changedTouches: [t(x)] })); el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [t(x - 120)] })); }, { x: box.x + box.width * 0.7, y: box.y + box.height * 0.4 });
    assert.equal(await card.locator(".flip").getAttribute("data-state"), "after");
    await p.click("[data-menu-btn]"); assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .seg button, .prog, .faq summary, .mnav a, select, input[type=search]")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
