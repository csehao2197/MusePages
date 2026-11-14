// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/065-personal-portfolio/Opus-5.5/page.test.mjs
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
  await check("SEO metadata, semantic landmarks, hero with name/role/tagline, CTAs, portrait alt text", async () => {
    assert.equal(await page.title(), "Jordan Reyes — Full-Stack Developer");
    assert.ok((await page.getAttribute('meta[name="description"]', "content")).length > 40);
    assert.equal(await page.getAttribute('meta[property="og:title"]', "content"), "Jordan Reyes — Full-Stack Developer");
    assert.equal(await page.locator("header, main, footer, nav[aria-label=Main]").count(), 4);
    assert.equal(await page.locator("h1").count(), 1);
    assert.match(await text(page, "h1"), /Jordan Reyes[\s\S]*I build fast, accessible web apps/);
    assert.match(await text(page, ".ctas"), /View Projects[\s\S]*Contact[\s\S]*Download CV/);
    assert.match(await page.getAttribute("[data-me] svg", "aria-label"), /portrait of Jordan Reyes/);
    assert.equal(await page.getAttribute(".ctas .btn", "href"), "#projects");
  });
  await check("projects: 6 cards with name, description, stack and links; filters; case-study dialog with deep link", async () => {
    assert.equal(await page.locator(".pc").count(), 6);
    for (const pc of await page.$$(".pc")) { assert.ok(await pc.$("h3")); assert.ok((await pc.$$(".stack li")).length >= 3); assert.ok(await pc.$('[aria-label$="on GitHub"], [aria-label$="source on GitHub"]')); }
    await page.click('[data-kind="Frontend"]'); assert.equal(await page.locator(".pc").count(), 2); assert.equal(await text(page, "[data-pcount]"), "2 projects · Frontend");
    await page.click('[data-kind="Mobile"]'); assert.deepEqual(await page.$$eval(".pc h3", (h) => h.map((x) => x.textContent)), ["Shelfie"]);
    await page.click('[data-kind="All"]'); assert.equal(await page.locator(".pc").count(), 6);
    await page.click('[data-detail="commitly"]');
    assert.equal(await page.evaluate(() => document.querySelector("dialog").open), true); assert.match(page.url(), /#project\/commitly$/);
    assert.match(await text(page, "[data-dlg-body]"), /Commitly[\s\S]*The problem[\s\S]*My role[\s\S]*Outcome[\s\S]*Stack/);
    await page.keyboard.press("Escape"); assert.equal(await page.evaluate(() => document.activeElement.dataset.detail), "commitly");
    await page.waitForFunction(() => !document.querySelector("dialog").open); await page.waitForTimeout(150); await page.evaluate(() => { location.hash = "#project/pulseboard"; }); await page.waitForSelector("#dlg-title", { timeout: 5000 }); assert.match(await text(page, "#dlg-title"), /Pulseboard/); await page.click("[data-close]");
  });
  await check("about, skills (4 groups) and experience timeline", async () => {
    assert.match(await text(page, "#about"), /Performance first[\s\S]*Accessible by default[\s\S]*Clear communication/);
    assert.equal(await page.locator(".sg").count(), 4); assert.match(await text(page, "[data-skills]"), /TypeScript[\s\S]*React[\s\S]*Node\.js[\s\S]*Docker/);
    await page.locator("#skills").scrollIntoViewIfNeeded(); await page.waitForTimeout(400); assert.ok(await page.$eval("[data-skills]", (e) => e.classList.contains("in")));
    assert.equal(await page.locator("[data-exp] > li").count(), 4); assert.match(await text(page, "[data-exp] > li:first-child"), /2023 — Present[\s\S]*Senior Full-Stack Engineer/);
  });
  await check("contact: email + socials, copy email, validated form composes a mailto link (nothing sent)", async () => {
    assert.equal(await page.getAttribute("[data-email]", "href"), "mailto:hello@jordanreyes.example");
    assert.equal(await page.locator(".socials a").count(), 3);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.click("[data-copy-email]"); await page.waitForTimeout(200); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "hello@jordanreyes.example");
    await page.click("[data-form] [type=submit]"); assert.match(await text(page, "[data-form-msg]"), /your name, a valid email, a message/);
    assert.equal(await page.getAttribute("[name=name]", "aria-invalid"), "true");
    await page.fill("[name=name]", "Sam Lee"); await page.fill("[name=email]", "sam@co.example"); await page.selectOption("[name=topic]", "Full-time role"); await page.fill("[name=msg]", "We're hiring a senior front-end engineer for our design system team.");
    await page.click("[data-form] [type=submit]");
    const href = await page.getAttribute("[data-mailto]", "href");
    assert.match(href, /^mailto:hello@jordanreyes\.example\?subject=Full-time%20role%20%E2%80%94%20from%20Sam%20Lee&body=We're%20hiring/);
  });
  await check("CV downloads as a valid PDF; theme toggle persists; scroll spy marks active nav link", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-cv]")]);
    assert.equal(dl.suggestedFilename(), "jordan-reyes-cv.pdf");
    const fs = await import("node:fs"); assert.match(fs.readFileSync(await dl.path(), "latin1"), /^%PDF-1\.4[\s\S]*Jordan Reyes[\s\S]*Senior Full-Stack Engineer[\s\S]*%%EOF$/);
    const light = await css(page, "body", "backgroundColor");
    await page.click("[data-theme-btn]"); assert.equal(await page.getAttribute("html", "data-theme"), "dark"); await page.waitForTimeout(350);
    assert.notEqual(await css(page, "body", "backgroundColor"), light);
    await page.reload({ waitUntil: "networkidle" }); assert.equal(await page.getAttribute("html", "data-theme"), "dark"); assert.equal(await page.getAttribute("[data-theme-btn]", "aria-label"), "Switch to light theme");
    await page.click("[data-theme-btn]");
    await page.evaluate(() => document.getElementById("experience").scrollIntoView({ behavior: "instant" })); await page.waitForTimeout(500);
    assert.equal(await page.getAttribute(".nav a.on", "data-link"), "experience");
  });
  await check("keyboard: skip link and all interactive elements reachable", async () => {
    await page.evaluate(() => { scrollTo(0, 0); document.body.tabIndex = -1; document.body.focus(); document.body.removeAttribute("tabindex"); }); await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.className), "skip");
    const unreachable = await page.evaluate(() => [...document.querySelectorAll("a[href], button, input, select, textarea")].filter((e) => e.offsetParent && e.tabIndex < 0).length);
    assert.equal(unreachable, 0);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, burger menu, single-column grids, scrollable filters, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible(".nav"), false); await p.click("[data-burger]"); assert.equal(await p.isVisible(".nav"), true);
    await p.click('.nav a[href="#projects"]'); assert.equal(await p.isVisible(".nav"), false);
    assert.equal((await css(p, ".pgrid", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".skills", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".filters", "overflowX"), "auto");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .btn-g, .icon-btn, .filters button, .pc .links a, .pc .links button, .socials a, .foot nav a, .top, .cform input, .cform select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
