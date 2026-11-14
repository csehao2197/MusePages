// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/055-flash-sale-page/Opus-5.5/page.test.mjs
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
  await check("announcement + nav (active Deals, 280px search, cart badge); 50vh hero with glowing 72px headline and live countdown to midnight", async () => {
    assert.equal(await css(page, ".announce", "backgroundColor"), "rgb(245, 158, 11)");
    assert.equal(await css(page, ".announce", "color"), "rgb(31, 41, 55)");
    assert.match(await text(page, ".ann-track span"), /FLASH SALE: Up to 70% off — Ends tonight at midnight!/);
    assert.equal(await text(page, ".links a.on"), "Deals");
    assert.equal(await css(page, ".search", "width"), "280px");
    assert.equal(await css(page, "h1", "fontSize"), "72px");
    assert.equal(await css(page, "h1", "color"), "rgb(245, 158, 11)");
    assert.match(await css(page, "h1", "textShadow"), /rgba\(245, 158, 11/);
    assert.ok(await page.$eval(".hero", (e) => e.getBoundingClientRect().height) >= 450);
    assert.equal(await css(page, ".box", "width"), "80px");
    assert.match(await css(page, ".box", "fontFamily"), /JetBrains Mono/);
    const exp = await page.evaluate(() => { const m = new Date(); m.setHours(24, 0, 0, 0); return Math.floor((m - Date.now()) / 1000); });
    const shown = await page.evaluate(() => ["h", "m", "s"].map((k) => Number(document.querySelector(`[data-u="${k}"]`).textContent)));
    const secs = shown[0] * 3600 + shown[1] * 60 + shown[2]; assert.ok(Math.abs(secs - exp) <= 3, `${secs} vs ${exp}`);
    const s1 = await text(page, '[data-u="s"]'); await page.waitForTimeout(1100); assert.notEqual(await text(page, '[data-u="s"]'), s1);
    assert.equal(await page.locator(".float").count(), 3);
  });
  await check("deal of the day: save badge, prices, savings, features, ticking countdown, red stock line, add to cart updates stock + badge", async () => {
    assert.match(await text(page, ".dotd"), /SAVE 45%[\s\S]*DEAL OF THE DAY[\s\S]*Sony WH-1000XM5 Wireless Headphones[\s\S]*4\.8 — 2,341 reviews[\s\S]*\$349\.99[\s\S]*\$189\.99[\s\S]*You save \$160\.00 \(45%\)/);
    assert.equal(await page.locator(".dotd .feats li").count(), 3);
    assert.match(await text(page, "[data-dotd-cd]"), /^04:2[12]:\d\d$/);
    assert.equal(await css(page, ".low", "color"), "rgb(220, 38, 38)");
    assert.equal(await page.$eval(".dotd .bar i", (e) => e.style.width), "78%");
    await page.click('[data-add="dotd"]');
    assert.equal(await text(page, "[data-dotd-left]"), "11");
    assert.equal(await text(page, "[data-count]"), "1");
    assert.equal(await page.getAttribute(".cart-btn", "aria-label"), "Cart, 1 item");
  });
  await check("category tabs with counts filter grid + lightning; search filters; amber underline", async () => {
    assert.deepEqual(await page.$$eval("[data-cat]", (b) => b.map((x) => x.textContent)), ["All Deals (15)", "Laptops (4)", "Audio (2)", "Smartphones (2)", "Cameras (2)", "Gaming (2)", "Accessories (2)", "Smart Home (1)"]);
    assert.equal(await css(page, "[data-cats-bar]", "position"), "sticky");
    await page.click('[data-cat="Laptops"]');
    assert.equal(await css(page, '[data-cat="Laptops"]', "borderBottomColor"), "rgb(245, 158, 11)");
    assert.equal(await page.locator("[data-grid] .card").count(), 2); assert.equal(await page.locator("[data-ld] .card").count(), 2);
    assert.match(await text(page, "[data-note]"), /4 deals in Laptops/);
    await page.click('[data-cat="All Deals"]');
    await page.fill("[data-q]", "kindle"); assert.equal(await page.locator("[data-grid] .card").count(), 1); await page.fill("[data-q]", "");
  });
  await check("deals grid: 9 cards in 3 columns with discount badges, prices, timers, stock colors and urgency banner", async () => {
    assert.equal(await page.locator("[data-grid] .card").count(), 9);
    assert.equal((await css(page, "[data-grid]", "gridTemplateColumns")).split(" ").length, 3);
    assert.equal(await css(page, "[data-grid]", "columnGap"), "24px");
    assert.deepEqual(await page.$$eval("[data-grid] .disc", (d) => d.map((x) => x.textContent)), ["-25%", "-32%", "-36%", "-20%", "-38%", "-37%", "-40%", "-27%", "-35%"]);
    assert.match(await text(page, '[data-card="mba"]'), /MacBook Air M3[\s\S]*\$1,199[\s\S]*\$899[\s\S]*Ends in \dh \d\dm/);
    assert.equal(await page.$eval('[data-card="tv"] .bar i', (e) => getComputedStyle(e).getPropertyValue("--c").trim()), "#EF4444");
    assert.equal(await page.$eval('[data-card="kp"] .bar i', (e) => getComputedStyle(e).getPropertyValue("--c").trim()), "#22C55E");
    assert.equal(await page.$eval('[data-card="ipad"] .bar i', (e) => getComputedStyle(e).getPropertyValue("--c").trim()), "#EAB308");
    assert.match(await text(page, '[data-card="bose"]'), /Almost gone!/);
    assert.equal(await css(page, '[data-card="mba"] .c-price b', "color"), "rgb(217, 119, 6)");
    assert.equal(await css(page, '[data-card="mba"] .c-price s', "textDecorationLine"), "line-through");
    const order = await page.$$eval("[data-grid] > *", (els) => els.map((e) => e.className));
    assert.equal(order[6], "urgent");
    assert.match(await text(page, ".urgent"), /\d+ items sold in the last hour[\s\S]*Don't wait!/);
    assert.match(await css(page, ".urgent .fire", "animationName"), /pulse/);
    await page.click('[data-wish="gp"]'); assert.equal(await page.getAttribute('[data-wish="gp"]', "aria-pressed"), "true");
    await page.hover('[data-card="nsw"]'); await page.waitForTimeout(300); assert.notEqual(await css(page, '[data-card="nsw"]', "boxShadow"), "none");
  });
  await check("adding the last units sells out; lightning deals with extra 10% and seconds countdown; grab-scroll; recent with viewed notes; cart drawer math; alerts; trust bar", async () => {
    await page.click('[data-add="bose"]'); await page.click('[data-add="bose"]');
    assert.match(await text(page, '[data-card="bose"]'), /Sold out/);
    assert.equal(await page.isDisabled('[data-card="bose"] .btn-amber'), true);
    assert.equal(await page.locator("[data-ld] .card").count(), 6);
    assert.equal(await page.locator("[data-ld] .extra").count(), 6);
    assert.match(await text(page, '[data-card="xps"]'), /\$999[\s\S]*\$674\.10[\s\S]*Ends in 0[12]:\d\d:\d\d/);
    assert.equal(await css(page, '[data-ld] .card', "width"), "220px");
    const ldBox = await page.locator("[data-ld]").boundingBox();
    await page.mouse.move(ldBox.x + 300, ldBox.y + 60); await page.mouse.down(); await page.mouse.move(ldBox.x + 60, ldBox.y + 60, { steps: 6 }); await page.mouse.up();
    assert.ok(await page.$eval("[data-ld]", (e) => e.scrollLeft) > 100);
    assert.equal(await page.locator("[data-recent] .card").count(), 4);
    assert.match(await text(page, "[data-recent]"), /You viewed this 2 hours ago — now 30% off!/);
    await page.click(".cart-btn");
    assert.equal(await page.locator("[data-cart-list] li").count(), 2);
    assert.match(await text(page, "[data-cart-foot]"), /Subtotal\$367\.99[\s\S]*You save\$280/);
    await page.click('[data-inc="dotd"]'); assert.match(await text(page, "[data-cart-foot]"), /Subtotal\$557\.98/);
    await page.click('[data-dec="bose"]'); assert.match(await text(page, '[data-card="bose"]'), /Add to Cart/);
    await page.click("[data-checkout]"); assert.match(await text(page, "[data-toast]"), /checkout is disabled/);
    await page.keyboard.press("Escape"); assert.equal(await page.locator("[data-drawer]").isHidden(), true);
    assert.equal(await css(page, ".alerts", "backgroundColor"), "rgb(255, 251, 235)");
    await page.click("[data-alert] [type=submit]"); assert.match(await text(page, "[data-al-msg]"), /valid email/);
    await page.fill("#al-e", "me@mail.example"); await page.click("[data-alert] [type=submit]"); assert.match(await text(page, "[data-al-msg]"), /on the list/);
    assert.match(await text(page, ".trustbar"), /Free shipping on orders \$50\+[\s\S]*30-day easy returns[\s\S]*Secure checkout[\s\S]*Price match guarantee/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: scrolling announcement, 40px headline + 56px boxes, horizontal deal cards, stacked featured deal, sticky View Cart bar after adding, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.match(await css(p, ".ann-track", "animationName"), /marquee/);
    assert.equal(await css(p, "h1", "fontSize"), "40px");
    assert.equal(await css(p, ".box", "width"), "56px");
    assert.equal(await css(p, "[data-grid] .card", "display"), "grid");
    assert.equal((await css(p, ".dotd", "gridTemplateColumns")).split(" ").length, 1);
    assert.ok(await p.$eval("[data-cats]", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval("[data-ld]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await p.locator("[data-mbar]").isVisible(), false);
    await p.click('[data-add="mba"]'); await p.click('[data-add="app"]'); await p.click('[data-add="kp"]');
    assert.equal(await p.locator("[data-mbar]").isVisible(), true);
    assert.equal(await text(p, "[data-mbar] button"), "View Cart (3)");
    await p.click("[data-mbar] button"); assert.equal(await p.locator("[data-drawer]").isVisible(), true); await p.click("[data-close-cart]");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn-amber, .btn-dark, .icon-btn, .wish, .cat-scroll button, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
