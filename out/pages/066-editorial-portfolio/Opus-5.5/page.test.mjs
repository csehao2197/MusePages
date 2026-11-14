// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/066-editorial-portfolio/Opus-5.5/page.test.mjs
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
  await check("meta/OG, sticky nav with 5 anchors + View Resumé CTA; full-viewport hero, serif type, palette", async () => {
    assert.match(await page.title(), /Mara Ellison — Frontend Engineer & UI Craftsman/);
    assert.ok(await page.getAttribute('meta[property="og:title"]', "content"));
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.deepEqual(await page.$$eval("[data-links] a", (a) => a.map((x) => [x.textContent, x.getAttribute("href")])), [["About", "#about"], ["Experience", "#experience"], ["Projects", "#projects"], ["Contact", "#contact"], ["Resume", "#resume"], ["View Resumé", "#resume"]]);
    assert.equal(await css(page, ".links .cta", "borderTopColor"), "rgb(30, 58, 95)");
    assert.ok(await page.$eval("[data-hero]", (e) => e.getBoundingClientRect().height) >= 900 - 68 - 1);
    assert.match(await css(page, "h1 .nm", "fontFamily"), /Playfair Display/);
    assert.match(await css(page, "body", "fontFamily"), /DM Sans/);
    assert.equal(await css(page, "body", "backgroundColor"), "rgb(250, 250, 245)");
    assert.match(await text(page, "h1"), /Mara\s*Ellison\s*Frontend Engineer & UI Craftsman/);
    assert.equal(await page.isVisible(".scroll"), true);
  });
  await check("hero layers react to mouse movement", async () => {
    const before = await page.$eval(".ly.disc", (e) => getComputedStyle(e).transform);
    await page.mouse.move(200, 200); await page.mouse.move(1200, 700, { steps: 4 }); await page.waitForTimeout(800);
    const after = await page.$eval(".ly.disc", (e) => getComputedStyle(e).transform);
    assert.notEqual(after, before); assert.equal(await page.getAttribute("[data-hero]", "data-moved"), "1");
    assert.notEqual(await page.$eval(".cover", (e) => e.style.transform), "");
  });
  await check("about: two-column with portrait alt text and serif pull quote; skills & experience as one section (no progress bars)", async () => {
    const t = await page.$eval(".about-t", (e) => e.getBoundingClientRect()), p = await page.$eval(".portrait", (e) => e.getBoundingClientRect());
    assert.ok(p.left > t.right - 1); assert.ok((await page.locator(".about-t p").count()) >= 3);
    assert.match(await page.getAttribute("[data-portrait] svg", "aria-label"), /portrait of Mara Ellison/);
    assert.match(await css(page, ".pull p", "fontFamily"), /Playfair/);
    assert.equal(await page.locator(".toolkit > div").count(), 4); assert.equal(await page.locator("[data-timeline] li").count(), 4);
    assert.equal(await page.locator("progress, [role=progressbar], .lvl").count(), 0);
    assert.match(await text(page, "[data-timeline] li:first-child"), /2022 — Now[\s\S]*Northlight[\s\S]*Staff Frontend Engineer/);
    const tk = await page.$eval(".toolkit", (e) => e.getBoundingClientRect()), tl = await page.$eval(".timeline", (e) => e.getBoundingClientRect());
    assert.ok(Math.abs(tk.top - tl.top) < 2, "toolkit and timeline side by side");
  });
  await check("projects: 4 cards in varied sizes; inline expansion one-at-a-time with 5-part case study; collapse control", async () => {
    assert.equal(await page.locator(".pc").count(), 4);
    const widths = await page.$$eval(".pc", (c) => c.map((x) => Math.round(x.getBoundingClientRect().width)));
    assert.ok(new Set(widths).size >= 3, `varied widths ${widths}`);
    await page.click("[data-open=atlas]"); await page.waitForTimeout(700);
    assert.equal(await page.getAttribute("[data-open=atlas]", "aria-expanded"), "true");
    assert.equal(await page.$eval("#cs-atlas", (e) => e.inert), false);
    assert.match(await text(page, "#cs-atlas"), /01 Context[\s\S]*02 Role & Approach[\s\S]*03 Outcome[\s\S]*04 Stack[\s\S]*GitHub/);
    assert.ok(await page.$eval("#cs-atlas", (e) => e.getBoundingClientRect().height) > 300);
    const atlasBottom = await page.$eval("[data-pc=atlas] .pc-sum", (e) => e.getBoundingClientRect().bottom), csTop = await page.$eval("#cs-atlas", (e) => e.getBoundingClientRect().top);
    assert.ok(csTop >= atlasBottom - 1, "case study appears below its card");
    await page.click("[data-open=tidepool]"); await page.waitForTimeout(700);
    assert.equal(await page.getAttribute("[data-open=atlas]", "aria-expanded"), "false"); assert.equal(await page.$eval("#cs-atlas", (e) => e.inert), true);
    assert.equal(await page.locator(".pc.open").count(), 1);
    await page.click("[data-close=tidepool]"); await page.waitForTimeout(700);
    assert.equal(await page.locator(".pc.open").count(), 0); assert.equal(await page.evaluate(() => document.activeElement.dataset.open), "tidepool");
    await page.keyboard.press("Enter"); await page.waitForTimeout(300); await page.keyboard.press("Tab"); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".pc.open").count(), 0);
  });
  await check("contact: centered CTA, scheduler (5 weekdays, slots, validation, booking + .ics), email and GitHub/LinkedIn icons", async () => {
    assert.equal(await css(page, ".contact", "textAlign"), "center");
    assert.equal(await text(page, "#contact-h"), "Let's work together.");
    assert.equal(await page.locator("[data-day]").count(), 5);
    const wk = await page.$$eval("[data-day]", (b) => b.map((x) => x.textContent.slice(0, 3))); assert.ok(wk.every((d) => !["Sat", "Sun"].includes(d)));
    assert.equal(await page.isVisible("[data-book]"), false);
    await page.click("[data-day='2']"); const free = page.locator("[data-slot]:not([disabled])").first(); await free.click();
    assert.equal(await page.isVisible("[data-book]"), true); assert.match(await text(page, "[data-sel]"), /at \d\d:\d\d CET · 30 min video call/);
    await page.click("[data-book] [type=submit]"); assert.match(await text(page, "[data-book-msg]"), /name and a valid email/);
    await page.fill("[data-book] [name=name]", "Ana"); await page.fill("[data-book] [name=email]", "ana@studio.example"); await page.click("[data-book] [type=submit]");
    assert.match(await text(page, "[data-book-msg]"), /Booked for[\s\S]*Add to calendar[\s\S]*no invitation was sent/);
    assert.match(await page.getAttribute("[data-book-msg] a", "href"), /^data:text\/calendar.*BEGIN%3AVCALENDAR/);
    assert.equal(await page.getAttribute(".mail a", "href"), "mailto:hello@maraellison.example");
    assert.deepEqual(await page.$$eval("#contact .social a", (a) => a.map((x) => x.getAttribute("aria-label"))), ["GitHub", "LinkedIn"]);
  });
  await check("resume: inline sheet rendered from the same content, Download PDF serves a valid static PDF, View Resumé scrolls to it", async () => {
    assert.match(await text(page, "[data-paper]"), /Mara Ellison[\s\S]*Experience[\s\S]*Selected projects[\s\S]*Skills[\s\S]*Education/);
    assert.equal(await page.getAttribute("[data-dl]", "download"), "mara-ellison-resume.pdf");
    const res = await page.request.get(new URL("assets/resume.pdf", page.url()).href);
    assert.equal(res.status(), 200); assert.equal(res.headers()["content-type"], "application/pdf");
    const body = (await res.body()).toString("latin1"); assert.match(body, /^%PDF-1\.4[\s\S]*Mara Ellison[\s\S]*Staff Frontend Engineer[\s\S]*%%EOF\s*$/);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-dl]")]); assert.equal(dl.suggestedFilename(), "mara-ellison-resume.pdf");
    await page.evaluate(() => scrollTo(0, 0)); await page.click(".links .cta"); await page.waitForTimeout(1200);
    assert.ok(Math.abs(await page.$eval("#resume", (e) => e.getBoundingClientRect().top) - 72) < 6);
    assert.equal(await page.getAttribute('[data-spy="resume"]', "aria-current"), "true");
    assert.match(await text(page, ".foot"), /© 2026 Mara Ellison/); assert.equal(await page.locator(".foot .social a").count(), 2);
  });
  await context.close();

  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await check("reduced motion: no reveal hiding, hero layers stay still", async () => {
    const p = await rm.newPage(); p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await p.locator(".rv").count(), 0);
    await p.mouse.move(200, 200); await p.mouse.move(1200, 700, { steps: 4 }); await p.waitForTimeout(300);
    assert.equal(await p.$eval(".ly.disc", (e) => e.style.transform), "");
  });
  await rm.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: single column, hamburger, cursor effects off, touch targets, no overflow", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible("[data-links]"), false); await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-links]"), true);
    await p.click('[data-links] a[href="#projects"]'); assert.equal(await p.isVisible("[data-links]"), false);
    assert.equal((await css(p, ".pgrid", "gridTemplateColumns")).split(" ").length, 1);
    await p.tap("[data-open=meridian]"); await p.waitForTimeout(700); assert.equal(await p.getAttribute("[data-open=meridian]", "aria-expanded"), "true");
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.getAttribute("[data-hero]", "data-moved"), null);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .link, .burger, .close, .days button, .slots button, .social a, .scroll")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
