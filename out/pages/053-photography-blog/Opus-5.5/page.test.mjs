// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/053-photography-blog/Opus-5.5/page.test.mjs
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
  await check("transparent nav over full-viewport hero turns white on scroll; Ken Burns hero with gold-underlined badge, headline, meta, gold link", async () => {
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgba(0, 0, 0, 0)");
    assert.match(await text(page, ".logo"), /aperture journal/);
    assert.equal(await css(page, ".logo", "fontWeight"), "300");
    assert.deepEqual(await page.$$eval(".links a", (a) => a.map((x) => x.textContent)), ["Stories", "Destinations", "Gear", "About", "Prints"]);
    assert.equal(await page.$eval(".hero", (e) => e.getBoundingClientRect().height), 900);
    assert.match(await css(page, ".hero-img", "animationName"), /kenburns/);
    assert.equal(await css(page, ".hero .cat", "borderBottomColor"), "rgb(212, 168, 83)");
    assert.equal(await text(page, "h1"), "First Light on the Tre Cime: A Dolomites Morning");
    assert.match(await css(page, "h1", "fontFamily"), /Instrument Serif/);
    assert.match(await text(page, ".hero .meta"), /March 8, 2026 · 12 photos · 8 min read/);
    assert.equal(await css(page, ".gold-link", "color"), "rgb(212, 168, 83)");
    await page.click(".gold-link"); assert.match(await text(page, "[data-dlg-body]"), /Rifugio Locatelli/); await page.keyboard.press("Escape");
    await page.evaluate(() => scrollTo(0, 400)); await page.waitForTimeout(500);
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgb(255, 255, 255)");
  });
  await check("recent stories: asymmetric 2 large + 3 small grid with overlays and 1px dividers", async () => {
    assert.equal(await page.locator(".post").count(), 5);
    assert.equal(await css(page, ".ed", "rowGap"), "1px");
    const l1 = await page.$eval(".post.l1", (e) => e.getBoundingClientRect()), s3 = await page.$eval(".post.s3", (e) => e.getBoundingClientRect()), l2 = await page.$eval(".post.l2", (e) => e.getBoundingClientRect());
    assert.ok(l1.height > l2.height * 2); assert.ok(Math.abs(s3.width - l2.width) < 2);
    assert.match(await text(page, ".post.l1"), /Photo Essay[\s\S]*Iceland's Diamond Beach at Midnight Sun[\s\S]*Jun 2025 · 18 photos/);
    assert.match(await text(page, ".post.s2"), /Behind the Scenes[\s\S]*Lightroom[\s\S]*Jan 2026/);
    await page.click(".post.l2"); assert.match(await text(page, "[data-dlg-body]"), /2026 Kit Breakdown/); await page.keyboard.press("Escape");
  });
  await check("destinations: dark band, 6 tinted 3:4 cards, arrow scrolling, destination dialog", async () => {
    assert.equal(await css(page, "#destinations", "backgroundColor"), "rgb(10, 10, 10)");
    assert.equal(await page.locator(".dest").count(), 6);
    const r = await page.$eval(".dest", (e) => e.getBoundingClientRect().height / e.getBoundingClientRect().width); assert.ok(Math.abs(r - 4 / 3) < 0.02);
    assert.match(await text(page, ".dests"), /Iceland8 stories[\s\S]*Norway7 stories[\s\S]*New Zealand3 stories/);
    const x0 = await page.$eval("[data-dests]", (e) => e.scrollLeft); await page.click("[data-dest-next]"); await page.waitForTimeout(700);
    assert.ok(await page.$eval("[data-dests]", (e) => e.scrollLeft) > x0);
    await page.click('[data-dest="3"]'); assert.match(await text(page, "[data-dlg-body]"), /Scottish Highlands[\s\S]*Rain, Fog/); await page.keyboard.press("Escape");
  });
  await check("mosaic: 9 frames with spans, zoom cursor, lightbox with EXIF and keyboard nav", async () => {
    assert.equal(await page.locator(".mosaic li").count(), 9);
    assert.equal(await page.locator(".mosaic .w2").count(), 3); assert.equal(await page.locator(".mosaic .t2").count(), 2);
    assert.equal(await css(page, ".mosaic button", "cursor"), "zoom-in");
    await page.click('[data-work="4"]');
    assert.match(await text(page, "[data-lb-info]"), /Aurora reflection, Reine, Norway[\s\S]*Sony A7R V[\s\S]*14mm f\/1\.8 GM[\s\S]*f\/2 · 6s · ISO 1600[\s\S]*Reine, Lofoten/);
    await page.keyboard.press("ArrowRight"); assert.match(await text(page, "[data-lb-info]"), /Fitz Roy/);
    await page.click("[data-lb-prev]"); await page.click("[data-lb-prev]"); assert.match(await text(page, "[data-lb-info]"), /Seceda/);
    await page.keyboard.press("Escape"); assert.equal(await page.locator("[data-lb][open]").count(), 0);
  });
  await check("gear: warm gray band, 3 reviews with gold score badges; before/after slider with steps and EXIF", async () => {
    assert.equal(await css(page, "#gear", "backgroundColor"), "rgb(245, 245, 244)");
    assert.deepEqual(await page.$$eval(".score", (s) => s.map((x) => x.firstChild.textContent)), ["9.2", "8.5", "9.0"]);
    assert.equal(await css(page, ".score", "backgroundColor"), "rgb(212, 168, 83)");
    await page.click('[data-review="1"]'); assert.match(await text(page, "[data-dlg-body]"), /stiffness in wind/); await page.keyboard.press("Escape");
    const box = await page.locator("[data-ba]").boundingBox();
    await page.locator("[data-ba]").scrollIntoViewIfNeeded();
    const b2 = await page.locator("[data-ba]").boundingBox();
    await page.mouse.click(b2.x + b2.width * 0.25, b2.y + b2.height / 2);
    const pos = Number(await page.$eval("[data-ba]", (e) => e.style.getPropertyValue("--pos").replace("%", "")));
    assert.ok(pos > 15 && pos < 35, `pos ${pos}`);
    await page.click('[data-step="4"]'); assert.equal(await page.$eval("[data-ba]", (e) => e.style.getPropertyValue("--pos")), "20%");
    await page.focus("[data-ba-range]"); await page.keyboard.press("ArrowRight"); assert.equal(await page.inputValue("[data-ba-range]"), "21");
    assert.match(await css(page, ".ba-raw", "filter"), /saturate/);
    assert.match(await text(page, ".exif"), /Sony A7R V · 16-35mm f\/2\.8 GM · f\/11 · 1\/15s · ISO 100 · tripod/);
    assert.equal(await page.locator("[data-steps] li").count(), 5);
    assert.ok(box.width > 0);
  });
  await check("about, newsletter with gold button over night photo, prints with frames and pricing dialog, cookies, footer", async () => {
    assert.match(await text(page, "#about"), /Elena Voss[\s\S]*Travel & Landscape Photographer[\s\S]*42[\s\S]*countries[\s\S]*200\+[\s\S]*85K[\s\S]*National Geographic[\s\S]*Lonely Planet/);
    assert.equal(await css(page, ".btn-gold", "backgroundColor"), "rgb(212, 168, 83)");
    await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /valid email/);
    await page.fill("#nl-e", "me@mail.example"); await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /Welcome aboard/);
    await page.click("[data-issue]"); assert.match(await text(page, "[data-dlg-body]"), /Sold My Drone/); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".print").count(), 4);
    assert.match(await text(page, ".prints"), /Tre Cime Sunrise24x36" · From \$189[\s\S]*Best Seller[\s\S]*Aurora Over Reine24x36" · From \$199/);
    await page.click('[data-print="0"]'); assert.equal(await text(page, "[data-price]"), "$189");
    await page.selectOption("[data-pf] [name=frame]", "90"); assert.equal(await text(page, "[data-price]"), "$279");
    await page.click("[data-pf] [type=submit]"); assert.match(await text(page, "[data-toast]"), /added to cart/);
    await page.click("[data-cookies]"); await page.check("[data-ck]"); await page.click("[data-ck-save]");
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("aj-cookies"))), { analytics: true });
    assert.match(await text(page, ".copy"), /All photographs © 2026 Elena Voss \/ Aperture Journal\. Do not reproduce without permission\./);
    await page.click(".nav-r [data-search-open]"); await page.fill("[data-search-in]", "patagonia"); await page.click("[data-search-res] button");
    assert.match(await text(page, "[data-dlg-body]"), /Torres del Paine/); await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: logo + hamburger dark overlay, full-viewport hero, stacked stories, snapping destinations, 2-col mosaic, touch slider, 2x2 prints, no floating bars, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".links").isVisible(), false);
    await p.click("[data-burger]"); assert.equal(await css(p, "[data-menu]", "backgroundColor"), "rgba(10, 10, 10, 0.97)"); await p.click("[data-menu-close]");
    assert.equal(await p.$eval(".hero", (e) => Math.round(e.getBoundingClientRect().height)), 844);
    assert.equal((await css(p, ".ed", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".dests", "scrollSnapType"), "x mandatory");
    assert.equal((await css(p, ".mosaic", "gridTemplateColumns")).split(" ").length, 2);
    assert.equal((await css(p, ".prints", "gridTemplateColumns")).split(" ").length, 2);
    await p.locator("[data-ba]").scrollIntoViewIfNeeded();
    const b = await p.locator("[data-ba]").boundingBox();
    await p.touchscreen.tap(b.x + b.width * 0.8, b.y + b.height / 2);
    const pos = Number(await p.$eval("[data-ba]", (e) => e.style.getPropertyValue("--pos").replace("%", ""))); assert.ok(pos > 65, `pos ${pos}`);
    assert.equal(await p.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && e.offsetParent !== null && !e.matches(".nav, .toast, .nav *")).length), 0);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".icon-btn, .text-link, .gold-link, .dest, .mosaic button, .btn-gold, .inline, .print, .f-cols a, .f-cols button, input:not([type=range])")].filter((x) => x.offsetParent && x.getBoundingClientRect().height < 44).map((x) => x.textContent.trim() || x.getAttribute("aria-label") || x.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
