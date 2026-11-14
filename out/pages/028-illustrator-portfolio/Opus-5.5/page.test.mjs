// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/028-illustrator-portfolio/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
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
  const context = await browser.newContext({ viewport, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, acceptDownloads: true, colorScheme: opts.dark ? "dark" : "light", reducedMotion: opts.reduce ? "reduce" : "no-preference" });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); // keep automated clicks from racing smooth scroll
  return { context, page };
}
const text = (p, s) => p.textContent(s);
const visibleTiles = (p) => p.locator(".tile:not([hidden])");

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero is full-viewport with name, tagline, scroll cue; nav turns solid on scroll; parallax moves art", async () => {
    const h = await page.locator(".hero").boundingBox(); assert.equal(Math.round(h.height), 900);
    assert.equal(await text(page, "h1"), "Maya Torres");
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontSize), "64px");
    assert.equal(await text(page, ".tagline"), "Illustrator & Visual Storyteller");
    assert.equal(await page.locator("[data-nav].solid").count(), 0);
    await page.evaluate(() => scrollTo(0, 300)); await page.waitForTimeout(150);
    assert.equal(await page.locator("[data-nav].solid").count(), 1);
    assert.match(await page.evaluate(() => document.querySelector("[data-parallax]").style.transform), /translate3d\(0px, 10\dpx/);
  });
  await check("masonry gallery: 3 columns, 6 shown, Load More to 18, every visible tile has artwork", async () => {
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector("[data-grid]")).gridTemplateColumns.split(" ").length), 3);
    assert.equal(await visibleTiles(page).count(), 6);
    await page.click("[data-more]"); await page.click("[data-more]");
    assert.equal(await visibleTiles(page).count(), 18);
    assert.equal(await page.locator("[data-more]").isVisible(), false);
    assert.equal(await text(page, "[data-count]"), "Showing 18 of 18 pieces");
    assert.equal(await page.locator(".tile:not([hidden]) [data-art] svg").count(), 18);
    const spans = await visibleTiles(page).evaluateAll((ts) => new Set(ts.map((t) => t.style.gridRowEnd)).size);
    assert.ok(spans >= 3, "mixed aspect ratios produce different row spans");
    assert.equal(await page.locator('.tile[data-cat="Motion"] .badge').count(), 2);
  });
  await check("filters: rose underline on active, fade swap, announcement", async () => {
    await page.click('[data-f="Editorial"]');
    await page.waitForTimeout(400);
    assert.equal(await page.getAttribute('[data-f="Editorial"]', "aria-pressed"), "true");
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('[data-f="Editorial"]'), "::after").backgroundColor), "rgb(225, 29, 72)");
    assert.deepEqual(await page.locator(".tile:not([hidden]) .ov b").allTextContents(), ["Bloomberg Businessweek: AI Issue", "New Yorker: Urban Solitude", "Wired Magazine: Quantum Computing", "Night Shift"]);
    assert.match(await text(page, "[data-status]"), /Editorial: 4 pieces/);
    await page.click('[data-f="all"]'); await page.waitForTimeout(400);
    assert.equal(await visibleTiles(page).count(), 6);
  });
  await check("project overlay shows the brief's Bloomberg details, carousel and sub-grid; Esc closes", async () => {
    await page.click('.tile[data-i="1"] button');
    assert.equal(await text(page, "[data-pj-title]"), "Bloomberg Businessweek: AI Issue");
    assert.match(await text(page, ".pj-meta"), /Client\s*Bloomberg[\s\S]*Category\s*Editorial Illustration[\s\S]*Year\s*2025[\s\S]*Tools\s*Procreate, Photoshop/);
    assert.match(await text(page, "[data-pj-desc]"), /^A series of 4 illustrations exploring the visual language of artificial intelligence/);
    assert.equal(await text(page, "[data-car-count]"), "1 of 3");
    await page.keyboard.press("ArrowRight"); assert.equal(await text(page, "[data-car-count]"), "2 of 3");
    await page.click('[data-car-step="-1"]'); await page.click('[data-car-step="-1"]'); assert.equal(await text(page, "[data-car-count]"), "3 of 3");
    assert.equal(await page.locator("[data-sub] > div").count(), 2);
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.querySelector("[data-modal=project]").open), false);
  });
  await check("about stats and CV PDF; services prefill the contact form", async () => {
    assert.match(await text(page, ".stats"), /Years Experience\s*8\+[\s\S]*Projects\s*200\+[\s\S]*Clients Worldwide\s*40\+/);
    assert.match(await text(page, ".about-copy"), /Portland, Oregon[\s\S]*Rhode Island School of Design[\s\S]*The New Yorker, Bloomberg, HarperCollins, Oatly and Wired/);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-cv]")]);
    const pdf = (await readFile(await dl.path())).toString("latin1"); assert.equal(pdf.slice(+pdf.match(/startxref\n(\d+)/)[1], +pdf.match(/startxref\n(\d+)/)[1] + 4), "xref");
    assert.match(await text(page, ".cards"), /\$800[\s\S]*1–2 weeks[\s\S]*\$2,000[\s\S]*3–6 weeks[\s\S]*\$1,500[\s\S]*2–4 weeks/);
    await page.click('[data-inquire="Book"]');
    assert.equal(await page.inputValue("[data-form] [name=type]"), "Book");
  });
  await check("shop teaser: 4 prints, quick view updates price by size and reserves (demo)", async () => {
    assert.equal(await page.locator(".print").count(), 4);
    assert.match(await text(page, ".print"), /The Midnight Garden — Limited Print[\s\S]*12\/50 remaining[\s\S]*\$120/);
    assert.equal(await page.evaluate(() => document.querySelector(".print .p-img").getBoundingClientRect().width), 280);
    await page.click('[data-print="0"]');
    await page.selectOption("[data-pr-size]", { index: 1 }); assert.equal(await text(page, "[data-pr-price]"), "$160");
    await page.click("[data-reserve]"); assert.match(await text(page, "[data-pr-msg]"), /Demo/);
    await page.keyboard.press("Escape");
  });
  await check("testimonials auto-scroll and pause on hover", async () => {
    await page.locator("[data-tm]").scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
    const a = (await page.evaluate(() => MuseMaya.tm())).left; await page.waitForTimeout(700); const b = (await page.evaluate(() => MuseMaya.tm())).left;
    assert.ok(b > a, "scrolls automatically");
    await page.hover("[data-tm]");
    const c = (await page.evaluate(() => MuseMaya.tm())).left; await page.waitForTimeout(500);
    assert.equal((await page.evaluate(() => MuseMaya.tm())).left, c);
    assert.match(await text(page, "[data-tm-track]"), /brought our cover story to life[\s\S]*authentically Oatly[\s\S]*exceeded our expectations/);
    assert.match(await text(page, ".sample-note"), /illustrative sample content/);
  });
  await check("contact form validates and confirms; dark mode toggles and persists", async () => {
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email[\s\S]*message/);
    await page.fill("[data-form] [name=name]", "Priya Shah"); await page.fill("[data-form] [name=email]", "priya@studio.example");
    await page.selectOption("[data-form] [name=budget]", "$3K–5K"); await page.fill("[data-form] [name=msg]", "A cover for our spring poetry anthology, due in April.");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-sent-text]"), /Thanks, Priya[\s\S]*48 hours[\s\S]*book project \(\$3K–5K\)[\s\S]*Demo/);
    await page.click("[data-theme-toggle]");
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
    assert.equal(await page.getAttribute("[data-theme-toggle]", "aria-pressed"), "true");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: single-column masonry, full-screen menu, full-screen modal with swipe, scrollable prints, no overflow", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector("[data-grid]")).gridTemplateColumns.split(" ").length), 1);
    await p.click("[data-menu-btn]");
    const ov = await p.locator("[data-overlay]").boundingBox(); assert.ok(ov.width === 390 && ov.height >= 844);
    await p.click('[data-overlay] a[href="#about"]');
    assert.equal(await p.locator("[data-overlay]").isVisible(), false);
    const photo = await p.locator(".about-photo").boundingBox(), copy = await p.locator(".about-copy").boundingBox();
    assert.ok(photo.y < copy.y, "photo stacks above the bio");
    await p.locator('.tile[data-i="0"] button').tap();
    const md = await p.locator("[data-modal=project]").boundingBox(); assert.ok(md.width >= 389 && md.height >= 843);
    const car = await p.locator("[data-car]").boundingBox();
    await p.evaluate(({ x, y }) => { const el = document.querySelector("[data-car]"); const t = (type, cx) => el.dispatchEvent(new TouchEvent(type, { bubbles: true, touches: type === "touchend" ? [] : [new Touch({ identifier: 1, target: el, clientX: cx, clientY: y })], changedTouches: [new Touch({ identifier: 1, target: el, clientX: cx, clientY: y })] })); t("touchstart", x + 250); t("touchend", x + 50); }, { x: car.x, y: car.y + 50 });
    assert.equal(await text(p, "[data-car-count]"), "2 of 3");
    await p.click("[data-modal=project] [data-close]");
    assert.equal(await p.evaluate(() => { const s = document.querySelector("[data-prints]"); return s.scrollWidth > s.clientWidth; }), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".nav .ib, .filters button, .btn, .print button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).length);
    assert.equal(small, 0);
  });
  await m.context.close();

  const r = await open({ width: 1280, height: 800 }, { reduce: true, dark: true });
  await check("reduced motion + OS dark: no parallax, no auto-scroll, content visible, dark theme by default", async () => {
    const p = r.page;
    assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), "dark");
    await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(150);
    assert.equal(await p.evaluate(() => document.querySelector("[data-parallax]").style.transform), "");
    const a = (await p.evaluate(() => MuseMaya.tm())).left; await p.waitForTimeout(400);
    assert.equal((await p.evaluate(() => MuseMaya.tm())).left, a);
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector("#work-h")).opacity), "1");
  });
  await r.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
