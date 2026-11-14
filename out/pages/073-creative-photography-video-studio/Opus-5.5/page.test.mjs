// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/073-creative-photography-video-studio/Opus-5.5/page.test.mjs
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

const waText = (href) => decodeURIComponent(new URL(href).searchParams.get("text"));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("Indonesian, dark cinematic homepage: hero reel, categories, persistent WhatsApp CTA, nav sections", async () => {
    assert.equal(await page.getAttribute("html", "lang"), "id");
    assert.equal(await css(page, "body", "backgroundColor"), "rgb(11, 11, 12)"); assert.match(await css(page, "body", "fontFamily"), /DM Sans/);
    assert.match(await text(page, "h1"), /Abadikan momen\.[\s\S]*Ceritakan secara sinematik\./);
    assert.equal(await page.locator("[data-reel] > div").count(), 4); assert.equal(await page.locator("[data-reel] > div.on").count(), 1);
    assert.deepEqual(await page.$$eval(".cat h3", (h) => h.map((x) => x.textContent)), ["Yearbook", "Wedding Organizer", "Foto Graduation", "Video Graduation"]);
    assert.equal(await css(page, ".wa-float", "position"), "fixed"); assert.match(await page.getAttribute(".wa-float", "href"), /^https:\/\/wa\.me\/\?text=/); assert.equal(await page.getAttribute(".wa-float", "target"), "_blank");
    assert.deepEqual(await page.$$eval("[data-links] a", (a) => a.map((x) => x.getAttribute("href"))), ["#portofolio", "#layanan", "#tentang", "#kontak"]);
    for (const id of ["portofolio", "layanan", "tentang", "kontak"]) assert.equal(await page.locator(`#${id}`).count(), 1);
    assert.equal(await page.locator(".test").count(), 3); assert.equal(await page.locator("[data-faq] details").count(), 6);
  });
  await check("portfolio: 12 items, category filter, lightbox with details, prev/next + keyboard, simulated video preview", async () => {
    assert.equal(await page.locator("[data-grid] .item").count(), 12);
    await page.click('[data-f="wo"]'); assert.equal(await page.locator("[data-grid] .item").count(), 3); assert.equal(await text(page, "[data-pcount]"), "3 karya · Wedding Organizer");
    await page.click('[data-f="all"]');
    await page.click('[data-open="1"]'); assert.equal(await page.evaluate(() => document.querySelector("[data-lb]").open), true);
    assert.match(await text(page, "[data-lb-body]"), /Akad di Rumah Joglo[\s\S]*Klien\s*Nadia & Raka[\s\S]*Lokasi\s*Yogyakarta[\s\S]*Durasi\s*3:02/);
    assert.match(waText(await page.getAttribute("[data-lbwa]", "href")), /Akad di Rumah Joglo[\s\S]*Wedding Organizer/);
    await page.click("[data-vplay]"); await page.waitForTimeout(700); assert.ok(parseFloat(await page.$eval("[data-vprog]", (e) => e.style.width)) > 0); assert.equal(await page.getAttribute("[data-vplay]", "aria-pressed"), "true");
    await page.click("[data-next]"); assert.match(await text(page, "#lb-title"), /Toga & Senja/); assert.equal(await page.locator("[data-vplay]").count(), 0);
    await page.keyboard.press("ArrowLeft"); assert.match(await text(page, "#lb-title"), /Akad di Rumah Joglo/);
    await page.keyboard.press("Escape"); assert.equal(await page.evaluate(() => document.querySelector("[data-lb]").open), false); assert.equal(await page.evaluate(() => document.activeElement.dataset.open), "1");
  });
  await check("packages: tabs per category (click + arrows), names/descriptions/features/IDR prices, Pilih Paket opens WhatsApp with package", async () => {
    assert.equal(await page.locator("[data-pkgs] .pkg").count(), 3); assert.match(await text(page, "[data-pkgs]"), /Yearbook Basic[\s\S]*Rp 175\.000[\s\S]*Yearbook Signature[\s\S]*Rp 245\.000/);
    assert.equal(await page.locator(".pkg.pop").count(), 1);
    await page.click('[data-pt="wo"]'); assert.match(await text(page, "[data-pkgs]"), /Intimate[\s\S]*Rp 6\.500\.000[\s\S]*Signature[\s\S]*Rp 12\.000\.000[\s\S]*Cinematic[\s\S]*Rp 19\.500\.000/);
    assert.match(waText(await page.getAttribute('[data-pick="Signature"]', "href")), /paket Wedding Organizer – Signature \(Rp 12\.000\.000\)/);
    await page.focus('[data-pt="wo"]'); await page.keyboard.press("ArrowRight"); assert.equal(await page.getAttribute('[data-pt="fg"]', "aria-selected"), "true"); assert.match(await text(page, "[data-pkgs]"), /Solo[\s\S]*Rp 450\.000/);
    await page.click('.cat[data-cat-go="vg"]'); assert.equal(await page.getAttribute('[data-pt="vg"]', "aria-selected"), "true");
    for (const p of await page.$$(".pkg")) { assert.ok((await p.$$("li")).length >= 4); assert.ok(await p.$(".d")); }
  });
  await check("FAQ single-open; quick form validates and opens a prefilled WhatsApp chat", async () => {
    await page.click("[data-faq] details:nth-child(2) summary"); await page.click("[data-faq] details:nth-child(3) summary");
    await page.waitForTimeout(150); assert.equal(await page.locator("[data-faq] details[open]").count(), 1);
    await page.click("[data-quick] [type=submit]"); assert.match(await text(page, "[data-qerr]"), /Isi nama/);
    await page.fill("[data-quick] [name=nama]", "Putri"); await page.selectOption("[data-svc-select]", "fg"); await page.fill("[data-quick] [name=tanggal]", "2026-12-20"); await page.fill("[data-quick] [name=pesan]", "Sesi untuk 3 orang.");
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.click("[data-quick] [type=submit]")]);
    const msg = waText(await page.$eval("[data-quick]", (f) => f.dataset.lastUrl)); await popup.close().catch(() => {});
    assert.match(msg, /saya Putri\. Saya tertarik layanan Foto Graduation untuk tanggal 20 Desember 2026\. Sesi untuk 3 orang\./);
  });
  await context.close();

  const rm = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await check("reduced motion: hero reel static, content visible", async () => {
    const p = await rm.newPage(); p.on("pageerror", (e) => errors.push(e.message)); await p.goto(server.url, { waitUntil: "networkidle" });
    await p.waitForTimeout(300); assert.equal(await p.locator(".rv").count(), 0); assert.equal(await p.$eval("[data-reel] > div.on", (d) => getComputedStyle(d).animationName), "none");
  });
  await rm.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile-first: hamburger, single-column grid, compact WhatsApp FAB, no overflow, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-links]"), true); await p.click('[data-links] a[href="#layanan"]'); assert.equal(await p.isVisible("[data-links]"), false);
    assert.equal((await css(p, ".grid", "gridTemplateColumns")).split(" ").length, 1);
    const fab = await p.$eval(".wa-float", (e) => e.getBoundingClientRect()); assert.ok(fab.width >= 56 && fab.height >= 56 && fab.right <= 390);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .filters button, .tabs button, .faq summary, .f input, .f select, .wa-float")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
