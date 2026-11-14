// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/054-podcast-website/Opus-5.5/page.test.mjs
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
  await check("hero: 400px cover, title, tagline, hosts, rating, 5 brand-colored platform buttons, episode count, slate gradient", async () => {
    assert.equal(await page.$eval(".cover", (e) => e.getBoundingClientRect().width), 400);
    assert.equal(await text(page, "h1"), "Ship It");
    assert.match(await css(page, "h1", "fontFamily"), /Space Grotesk/);
    assert.match(await text(page, ".hero-copy"), /Stories from the builders shaping the future of tech[\s\S]*Hosted by Maya Park & Diego Santos[\s\S]*4\.9 · 12K\+ ratings[\s\S]*187 episodes · New episodes every Tuesday/);
    assert.deepEqual(await page.$$eval(".plat", (p) => p.map((x) => x.textContent.trim())), ["Apple Podcasts", "Spotify", "YouTube", "Google Podcasts", "RSS"]);
    assert.equal(await css(page, '.plat[data-plat="Spotify"] .ic', "backgroundColor"), "rgb(29, 185, 84)");
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(15, 23, 42\)[\s\S]*rgb\(30, 41, 59\)/);
    await page.click('.plat[data-plat="RSS"]'); assert.match(await page.inputValue("[data-copy-src]"), /feed\.xml/); await page.keyboard.press("Escape");
  });
  await check("featured episode with working demo player: play/pause, time advances, seek, speed cycles, volume/mute; notes, transcript, share", async () => {
    assert.match(await text(page, ".feat"), /EP 187 · March 4, 2026[\s\S]*How Figma Rebuilt Their Multiplayer Engine[\s\S]*with Dylan Field, CEO of Figma[\s\S]*58 min/);
    assert.deepEqual(await page.$$eval(".tags li", (t) => t.map((x) => x.textContent)), ["#design-tools", "#engineering", "#scaling"]);
    assert.equal(await text(page, "[data-dur]"), "58:00");
    await page.click("[data-speed]"); assert.equal(await text(page, "[data-speed]"), "1.25x"); await page.click("[data-speed]"); await page.click("[data-speed]"); assert.equal(await text(page, "[data-speed]"), "2x");
    await page.click("[data-pp]"); assert.equal(await page.getAttribute("[data-pp]", "aria-label"), "Pause episode 187");
    await page.waitForTimeout(1600);
    const s = Number(await page.inputValue("[data-seek]")); assert.ok(s >= 2, `seek ${s}`);
    assert.equal(await page.locator("[data-mini]").isVisible(), true);
    assert.match(await text(page, "[data-mini-title]"), /EP 187/);
    await page.click("[data-pp]"); assert.equal(await page.getAttribute("[data-pp]", "aria-label"), "Play episode 187");
    await page.$eval("[data-seek]", (el) => { el.value = 1800; el.dispatchEvent(new Event("input", { bubbles: true })); });
    assert.equal(await text(page, "[data-cur]"), "30:00");
    await page.click("[data-mute]"); assert.equal(await page.getAttribute("[data-mute]", "aria-label"), "Unmute");
    assert.equal(await css(page, "[data-mini-pp]", "backgroundColor"), "rgb(245, 158, 11)");
    await page.click('.actions [data-notes="187"]'); await page.click('[data-jump="187:2040"]');
    assert.equal(await text(page, "[data-cur]"), "34:00"); await page.click("[data-pp]");
    await page.click('[data-transcript="187"]'); assert.match(await text(page, "[data-dlg-body]"), /Transcript[\s\S]*Dylan:/); await page.keyboard.press("Escape");
    await page.click('[data-share="187"]'); assert.match(await page.inputValue("[data-copy-src]"), /#ep-187$/); await page.keyboard.press("Escape");
  });
  await check("episode list: brief episodes in order, search, topic tabs, sort, load more, row play switches player", async () => {
    assert.equal(await page.locator(".ep").count(), 8);
    assert.match(await text(page, ".ep >> nth=0"), /EP 186[\s\S]*Inside Linear's Product Philosophy[\s\S]*with Karri Saarinen[\s\S]*Mar 4[\s\S]*47 min/);
    assert.match(await text(page, ".ep >> nth=5"), /EP 181[\s\S]*Designing for AI-First Products[\s\S]*Anna Kowalski[\s\S]*Jan 28[\s\S]*44 min/);
    await page.click("[data-more]"); assert.equal(await page.locator(".ep").count(), 16); assert.equal(await page.isVisible("[data-more]"), true);
    await page.click("[data-more]"); assert.equal(await page.locator(".ep").count(), 17); assert.equal(await page.isHidden("[data-more]"), true);
    await page.click('[data-tab="AI"]'); assert.equal(await page.locator(".ep").count(), 3); assert.match(await text(page, "[data-result]"), /3 episodes/);
    await page.click('[data-tab="All"]'); await page.fill("[data-q]", "rust"); assert.equal(await page.locator(".ep").count(), 1);
    await page.fill("[data-q]", "zzz"); assert.match(await text(page, "[data-eps]"), /No episodes match/); await page.fill("[data-q]", "");
    await page.click("[data-sort-toggle]"); await page.selectOption("[data-sort-sel]", "long"); assert.match(await text(page, ".ep >> nth=0"), /EP 177/); await page.selectOption("[data-sort-sel]", "new");
    await page.hover(".ep >> nth=1"); await page.waitForTimeout(250); assert.equal(await css(page, ".ep:nth-child(2)", "backgroundColor"), "rgb(30, 41, 59)");
    await page.click('[data-play="185"]'); assert.match(await text(page, "[data-mini-title]"), /EP 185 · Scaling to 10M Users/);
    assert.equal(await page.getAttribute('[data-play="185"]', "aria-label"), "Pause episode 185");
    assert.equal(await page.getAttribute('.ep[data-ep="185"]', "class"), "ep on");
    await page.click("[data-mini-pp]"); assert.equal(await page.getAttribute('[data-play="185"]', "aria-label"), "Play episode 185");
  });
  await check("popular cards with play counts; guests 3-col with monograms; hosts; newsletter; sponsors + media kit; stats; footer", async () => {
    assert.match(await text(page, "[data-pop]"), /2\.1M plays[\s\S]*Notion[\s\S]*1\.8M plays[\s\S]*Vercel[\s\S]*1\.5M plays[\s\S]*Stripe[\s\S]*1\.2M plays[\s\S]*Design System/);
    await page.click('.pc [data-play="156"]'); assert.match(await text(page, "[data-mini-title]"), /EP 156/); await page.click("[data-mini-pp]");
    assert.equal(await page.locator(".g").count(), 6);
    assert.equal((await css(page, ".guests", "gridTemplateColumns")).split(" ").length, 3);
    assert.match(await text(page, ".g >> nth=3"), /Emmett Shear[\s\S]*Co-founder, Twitch[\s\S]*EP 128/);
    await page.click('[data-guest-ep="187"]'); assert.match(await text(page, "[data-dlg-body]"), /Chapters/); await page.keyboard.press("Escape");
    assert.equal(await css(page, ".h-photo", "borderTopLeftRadius"), "20px");
    assert.equal(await page.locator(".host .soc a").count(), 4);
    await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /valid email/);
    await page.fill("#nl-e", "me@mail.example"); await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-sub-msg]"), /You're in/);
    assert.match(await text(page, ".sponsors"), /Vercel[\s\S]*LinearB[\s\S]*Datadog/);
    await page.click(".kit [data-kit]"); await page.click("[data-kit-form] [type=submit]"); assert.match(await text(page, "[data-err]"), /work email/); await page.keyboard.press("Escape");
    assert.match(await text(page, ".metrics"), /2M\+[\s\S]*187[\s\S]*120\+[\s\S]*18K/);
    assert.match(await text(page, ".ratings"), /Apple Podcasts 4\.9★[\s\S]*Spotify 4\.8★/);
    assert.match(await text(page, ".foot"), /RSS Feed[\s\S]*Media Kit[\s\S]*Privacy Policy[\s\S]*Instagram[\s\S]*© 2026 Ship It Podcast\. All rights reserved\./);
    assert.equal(await css(page, "body", "backgroundColor"), "rgb(15, 23, 42)");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: centered stacked hero, 2-col platform buttons, full-width episode cards, guest + popular scroll, sticky mini player, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const c = await p.$eval(".cover", (e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; }); assert.ok(Math.abs(c - 195) < 2);
    assert.equal((await css(p, ".plats", "gridTemplateColumns")).split(" ").length, 2);
    assert.ok(await p.$eval(".ep", (e) => e.getBoundingClientRect().width) > 350);
    assert.ok(await p.$eval("[data-guests]", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval("[data-pop]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await p.locator("[data-mini]").isVisible(), false);
    await p.click('[data-play="184"]');
    assert.equal(await p.locator("[data-mini]").isVisible(), true);
    assert.equal(await css(p, "[data-mini]", "position"), "fixed");
    await p.waitForTimeout(1200); assert.ok(await p.$eval("[data-mini-prog]", (e) => parseFloat(e.style.width)) > 0);
    const small = await p.evaluate(() => [...document.querySelectorAll(".pp, .plat, .chip, .speed, .tabs button, .link, .icon-btn, .btn-o, .btn-a, .soc a, .f-grid a, input:not([type=range])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
