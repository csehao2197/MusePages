// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/029-music-producer-portfolio/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const { chromium } = await import(pathToFileURL(path.join(root, "node_modules/playwright/index.mjs")).href);
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/generate-preview.mjs")).href);
const server = await startPreviewServer(path.join(here, "out"), { workspace: root });
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
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
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); // keep automated clicks from racing smooth scroll
  return { context, page };
}
const text = (p, s) => p.textContent(s);
const st = (p) => p.evaluate(() => MuseKvolt.state());

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero: label, 120px name, tagline, CTAs, stats, animated EQ; nav solid on scroll", async () => {
    assert.match(await text(page, ".label"), /Producer · Songwriter · Engineer/);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontSize), "120px");
    assert.equal(await text(page, ".tagline"), "Crafting hits from Atlanta to the world");
    assert.equal(await text(page, ".hstats"), "50M+ streams · 200+ placements · 12 years in the game");
    assert.equal(await page.locator("[data-eq] i").count(), 48);
    assert.equal(await page.locator("[data-nav].solid").count(), 0);
    await page.evaluate(() => scrollTo(0, 400)); await page.waitForTimeout(450);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector("[data-nav]")).backgroundColor), "rgb(10, 10, 15)");
  });
  await check("beats grid: 6 cards with genre pill, BPM/key, price", async () => {
    assert.equal(await page.locator(".beat").count(), 6);
    assert.match(await text(page, '[data-beat="0"]'), /Midnight Drive[\s\S]*Trap \/ R&B[\s\S]*142 BPM · F# Minor[\s\S]*From \$29\.99/);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector("[data-beats]")).gridTemplateColumns.split(" ").length), 3);
  });
  await check("playing a beat synthesizes audio, shows the persistent player, live waveform and advancing time", async () => {
    await page.click('[data-play="0"]');
    await page.waitForFunction(() => MuseKvolt.state().playing);
    assert.equal(await page.locator("[data-player]").isVisible(), true);
    assert.equal(await text(page, "[data-pl-title]"), "Midnight Drive");
    assert.equal(await text(page, "[data-pl-dur]"), "3:45");
    assert.equal(await page.locator('[data-beat="0"] [data-wave]').isVisible(), true);
    assert.equal(await page.getAttribute('[data-play="0"]', "aria-pressed"), "true");
    await page.waitForTimeout(1200);
    const s = await st(page); assert.ok(s.time > 0.6, `time advanced (${s.time})`);
    const energy = await page.evaluate(() => { const c = document.querySelector('[data-beat="0"] [data-wave]').getContext("2d").getImageData(0, 0, 600, 96).data; let n = 0; for (let i = 3; i < c.length; i += 4) if (c[i]) n++; return n; });
    assert.ok(energy > 300, "waveform drawn");
    assert.ok(await page.evaluate(() => [...document.querySelectorAll("[data-eq] i")].some((b) => b.style.transform)), "EQ follows the audio");
  });
  await check("player controls: pause/resume, next/prev, seek, volume", async () => {
    await page.click('[data-pl="toggle"]');
    await page.waitForFunction(() => MuseKvolt.state().paused);
    const t1 = (await st(page)).time; await page.waitForTimeout(500); assert.ok(Math.abs((await st(page)).time - t1) < 0.05, "time frozen while paused");
    await page.click('[data-pl="toggle"]'); await page.waitForFunction(() => !MuseKvolt.state().paused);
    await page.click('[data-pl="next"]'); await page.waitForFunction(() => MuseKvolt.state().beat === "Velvet Hours");
    await page.click('[data-pl="prev"]'); await page.click('[data-pl="prev"]'); await page.waitForFunction(() => MuseKvolt.state().beat === "Gold Static");
    await page.$eval("[data-pl-seek]", (el) => { el.value = 500; el.dispatchEvent(new Event("input")); el.dispatchEvent(new Event("change")); });
    await page.waitForTimeout(200);
    const t = (await st(page)).time; assert.ok(t > 90 && t < 100, `seeked to ~half of 3:11 (${t})`);
    await page.$eval("[data-pl-vol]", (el) => { el.value = 30; el.dispatchEvent(new Event("input")); });
    assert.equal((await st(page)).vol, 30);
  });
  await check("license tiers and checkout flow (incl. exclusive offer minimum)", async () => {
    assert.match(await text(page, ".tiers"), /Basic[\s\S]*\$29\.99[\s\S]*Premium[\s\S]*\$79\.99[\s\S]*Exclusive[\s\S]*\$499\+/);
    assert.match(await text(page, ".tier.pop"), /Most Popular/);
    await page.click('[data-tier="Exclusive"]');
    assert.equal(await page.isVisible("[data-offer]"), true);
    assert.match(await text(page, "[data-lic-sum]"), /Gold Static · Exclusive license[\s\S]*\$499\.00/);
    await page.click("[data-lic] [type=submit]");
    assert.match(await text(page, "[data-lic-err]"), /email/);
    await page.fill("[data-lic] [name=email]", "artist@label.example"); await page.fill("[data-lic] [name=offer]", "300");
    await page.click("[data-lic] [type=submit]");
    assert.match(await text(page, "[data-lic-err]"), /start at \$499/);
    await page.fill("[data-lic] [name=offer]", "750");
    await page.click("[data-lic] [type=submit]");
    assert.match(await text(page, "[data-lic-done-text]"), /\$750\.00 for exclusive rights to “Gold Static”[\s\S]*Demo/);
    await page.keyboard.press("Escape");
    await page.click("[data-pl-license]");
    assert.match(await text(page, "[data-lic-sum]"), /Premium license[\s\S]*\$79\.99/);
    await page.keyboard.press("Escape");
  });
  await check("discography row with platform overlay links and sample-content note", async () => {
    assert.equal(await page.locator(".dc").count(), 6);
    assert.match(await text(page, "[data-disc]"), /Lil Baby[\s\S]*Venom[\s\S]*2025[\s\S]*24M streams/);
    await page.hover(".dc >> nth=0"); await page.waitForTimeout(350);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".dc-links")).opacity), "1");
    assert.match(await text(page, ".sample"), /illustrative sample content/);
    assert.equal(await page.evaluate(() => { const d = document.querySelector(".dc-art"); return d.offsetWidth; }), 240);
  });
  await check("about, clients, testimonials, services", async () => {
    assert.match(await text(page, ".about-copy"), /Born Kevin Volt in East Atlanta[\s\S]*Tree Sound Studios[\s\S]*500\+ beats produced[\s\S]*Berklee-certified/);
    assert.equal(await page.locator(".logos li").count(), 6);
    assert.equal(await page.locator(".tm").count(), 3);
    assert.equal(await page.locator(".svc").count(), 4);
  });
  await check("contact form validation + success; newsletter; legal dialog", async () => {
    await page.click("[data-book]");
    assert.equal(await page.inputValue("[data-form] [name=service]"), "Studio Session");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email[\s\S]*description/);
    await page.fill("[data-form] [name=name]", "Jay Monroe"); await page.fill("[data-form] [name=email]", "jay@music.example");
    await page.fill("[data-form] [name=desc]", "Two-day session to track my EP vocals."); await page.fill("[data-form] [name=ref]", "not a url");
    await page.click("[data-form] [type=submit]"); assert.match(await text(page, "[data-err]"), /reference link/);
    await page.fill("[data-form] [name=ref]", "https://soundcloud.com/example/track");
    await page.click("[data-form] [type=submit]");
    assert.match(await text(page, "[data-sent-text]"), /Thanks, Jay[\s\S]*studio session request[\s\S]*under 4 hours/);
    await page.fill("#news-email", "fan@mail.example"); await page.click("[data-news] [type=submit]");
    assert.match(await text(page, "[data-news-msg]"), /on the list/);
    await page.click('[data-legal="License Agreement"]');
    assert.match(await text(page, "[data-legal-text]"), /Prod\. KVOLT/);
    await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: 64px name, 1-col beats, Premium first, swipe discography, simplified player, overlay menu, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector("h1")).fontSize), "64px");
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector(".tagline")).fontSize), "16px");
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector("[data-beats]")).gridTemplateColumns.split(" ").length), 1);
    const tiers = await p.$$eval(".tier", (els) => els.map((e) => [e.querySelector("h3").textContent, e.getBoundingClientRect().top]).sort((a, b) => a[1] - b[1])[0][0]);
    assert.equal(tiers, "Premium");
    assert.equal(await p.evaluate(() => { const d = document.querySelector("[data-disc]"); return d.scrollWidth > d.clientWidth; }), true);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    assert.equal(await p.locator("[data-menu] .socials a").count(), 4);
    await p.click('[data-menu] nav a[href="#beats"]');
    await p.click('[data-play="1"]');
    await p.waitForFunction(() => MuseKvolt.state().playing);
    assert.equal(await p.locator('[data-pl="next"]').isVisible(), false);
    assert.equal(await p.locator('[data-pl="toggle"]').isVisible(), true);
    assert.equal(await p.locator("[data-pl-license]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .burger, .b-play, [data-player] button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
