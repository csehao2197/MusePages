// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/056-gift-card-purchase/Opus-5.5/page.test.mjs
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
const fs = await import("node:fs/promises");
const os = await import("node:os");

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("sticky nav with active Gift Cards; 40vh lavender→pink hero with fanned cards and trust badges", async () => {
    assert.equal(await css(page, ".nav", "position"), "sticky");
    assert.equal(await text(page, ".links a.on"), "Gift Cards");
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(243, 232, 255\)[\s\S]*rgb\(253, 242, 248\)/);
    assert.ok(await page.$eval(".hero", (e) => e.getBoundingClientRect().height) >= 360);
    assert.equal(await text(page, "h1"), "Give the Gift of Choice");
    assert.match(await text(page, ".trust"), /Instant Delivery[\s\S]*Never Expires[\s\S]*Redeemable on Everything/);
    assert.match(await css(page, "h1", "fontFamily"), /Plus Jakarta Sans/);
  });
  await check("design selector: 8 thumbnails 120x80, enlarged 400x250 preview, flip shows back, custom upload replaces design", async () => {
    assert.deepEqual(await page.$$eval("[data-design]", (b) => b.map((x) => x.getAttribute("aria-label"))), ["Birthday", "Thank You", "Congratulations", "Holiday", "Love", "Just Because", "Wedding", "Graduation"]);
    const th = await page.$eval(".dz .th", (e) => [e.getBoundingClientRect().width, e.getBoundingClientRect().height]); assert.deepEqual(th, [120, 80]);
    const fl = await page.$eval("[data-flip]", (e) => [Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)]); assert.deepEqual(fl, [400, 250]);
    await page.click('[data-design="wedding"]'); assert.equal(await text(page, "[data-s-design]"), "Wedding"); assert.equal(await page.getAttribute('[data-design="wedding"]', "aria-checked"), "true");
    await page.click("[data-flip-btn]"); await page.waitForTimeout(800);
    assert.match(await css(page, ".back", "transform"), /matrix\(1, 0, 0, 1, 0, 0\)|none/);
    assert.ok(await page.$eval("[data-flip]", (e) => e.classList.contains("flipped")));
    await page.click("[data-flip-btn]");
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
    await page.setInputFiles("[data-upload]", { name: "photo.png", mimeType: "image/png", buffer: png });
    await page.waitForTimeout(300);
    assert.equal(await text(page, "[data-s-design]"), "Your photo");
    assert.equal(await page.locator("[data-front] image").count(), 1);
    await page.click('[data-design="birthday"]');
  });
  await check("amounts: 7 presets, purple selected state, custom amount with $10–$1,000 validation, corporate link", async () => {
    assert.deepEqual(await page.$$eval("[data-amt]", (b) => b.map((x) => x.textContent)), ["$25", "$50", "$75", "$100", "$150", "$200", "$500"]);
    assert.equal(await page.getAttribute('[data-amt="75"]', "aria-checked"), "true");
    assert.equal(await css(page, '[data-amt="75"]', "borderTopColor"), "rgb(124, 58, 237)");
    await page.click('[data-amt="150"]'); assert.equal(await text(page, "[data-s-total]"), "$150.00");
    await page.fill("[data-custom]", "5"); assert.match(await text(page, "[data-amt-msg]"), /minimum gift card amount is \$10/); assert.equal(await page.getAttribute("[data-custom]", "aria-invalid"), "true");
    await page.fill("[data-custom]", "1500"); assert.match(await text(page, "[data-amt-msg]"), /maximum.*\$1,000/);
    await page.fill("[data-custom]", "120"); assert.equal(await text(page, "[data-s-amount]"), "$120.00"); assert.equal(await page.locator('[data-amt][aria-checked="true"]').count(), 0);
    assert.equal(await page.getAttribute(".bulk a", "href"), "#corporate");
  });
  await check("personalization updates preview, back of card, summary and email preview in real time; 200-char counter", async () => {
    await page.fill("[data-to]", "Jamie"); await page.fill("[data-from]", "Alex"); await page.fill("[data-msg]", "Happy birthday Jamie! Have fun.");
    assert.match(await page.$eval("[data-front] svg", (e) => e.textContent), /For Jamie/);
    assert.match(await text(page, "[data-back]"), /To: Jamie[\s\S]*Happy birthday Jamie![\s\S]*From: Alex/);
    assert.match(await text(page, "[data-s-msg]"), /Happy birthday Jamie/);
    assert.match(await text(page, "[data-em-subject]"), /Alex sent you a \$120 Lumina gift card!/);
    assert.equal(await text(page, "[data-count]"), "31 / 200");
    assert.equal(await page.getAttribute("[data-msg]", "maxlength"), "200");
    await page.fill("[data-msg]", "x".repeat(250)); assert.equal(await text(page, "[data-count]"), "200 / 200"); await page.fill("[data-msg]", "Happy birthday Jamie! Have fun.");
  });
  await check("delivery: digital validation + scheduling with calendar reminder .ics; physical address, premium +$5, ETA, mockup; add to cart + buy now; sticky summary", async () => {
    assert.equal(await css(page, ".summary", "position"), "sticky");
    await page.click(".summary [data-add]"); assert.match(await text(page, "[data-err]"), /recipient's email/);
    await page.fill("[data-email]", "jamie@mail.example");
    await page.click('[data-when="later"]'); assert.equal(await page.isVisible("[data-date]"), true);
    assert.match(await text(page, "[data-s-delivery]"), /Digital · [A-Z][a-z]{2} \d+/);
    await page.check("[data-remind]");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click(".summary [data-add]")]);
    assert.equal(dl.suggestedFilename(), "lumina-gift-reminder.ics");
    assert.match(await fs.readFile(await dl.path(), "utf8"), /DTSTART;VALUE=DATE:\d{8}[\s\S]*Jamie/);
    assert.match(await text(page, "[data-dlg-body]"), /Added to your cart[\s\S]*\$120\.00 digital gift card for Jamie/);
    await page.keyboard.press("Escape");
    assert.equal(await text(page, "[data-badge]"), "1");
    await page.click('[data-mode="physical"]'); assert.equal(await page.isVisible('[data-pane="physical"]'), true); assert.equal(await page.isHidden('[data-pane="digital"]'), true);
    await page.click(".summary [data-add]"); assert.match(await text(page, "[data-err]"), /shipping address/);
    for (const [k, v] of [["name", "Jamie Lee"], ["street", "12 Rose St"], ["city", "Portland"], ["state", "OR"], ["zip", "97201"]]) await page.fill(`[data-ship="${k}"]`, v);
    await page.check("[data-premium]");
    assert.equal(await text(page, "[data-s-pack]"), "Premium (+$5)"); assert.equal(await text(page, "[data-s-total]"), "$125.00");
    assert.match(await text(page, ".eta"), /3-5 business days/);
    assert.ok(await page.$eval("[data-mock]", (e) => e.classList.contains("premium")));
    await page.click("[data-buy]"); assert.match(await text(page, "[data-dlg-body]"), /Express checkout[\s\S]*\$125\.00/); await page.keyboard.press("Escape");
    assert.match(await text(page, ".pay"), /VISA[\s\S]*Mastercard[\s\S]*Apple.Pay[\s\S]*G.Pay[\s\S]*PayPal/);
    assert.match(await text(page, ".disc"), /non-refundable/);
    assert.equal(await css(page, ".summary [data-add]", "backgroundColor"), "rgb(124, 58, 237)");
  });
  await check("balance checker formats input, finds sample card with transactions, handles unknown/short numbers; FAQ one-open; corporate sales form", async () => {
    await page.fill("[data-cardno]", "40001234"); await page.click("[data-bal] [type=submit]"); assert.match(await text(page, "[data-bal-out]"), /16 digits/);
    await page.fill("[data-cardno]", "4000999988887777"); assert.equal(await page.inputValue("[data-cardno]"), "4000 9999 8888 7777");
    await page.click("[data-bal] [type=submit]"); assert.match(await text(page, "[data-bal-out]"), /No gift card found ending in 7777/);
    await page.click("[data-sample]"); assert.match(await text(page, "[data-bal-out]"), /\$62\.40[\s\S]*Active · never expires[\s\S]*Online order[\s\S]*−\$37\.60/);
    await page.click("[data-faq] details:nth-child(2) summary"); await page.click("[data-faq] details:nth-child(6) summary"); await page.waitForTimeout(150);
    assert.deepEqual(await page.$$eval("[data-faq] details", (d) => d.map((x) => x.open)), [false, false, false, false, false, true]);
    assert.equal(await css(page, "#corporate", "backgroundColor"), "rgb(245, 243, 255)");
    await page.click("[data-sales]"); await page.click("[data-sales-form] [type=submit]"); assert.match(await text(page, "[data-sales-err]"), /work email/);
    await page.fill("[data-sales-form] [name=email]", "hr@co.example"); await page.fill("[data-sales-form] [name=co]", "Acme"); await page.click("[data-sales-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Acme/); await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: 2-row design grid, amounts wrap, collapsible summary below personalization, sticky add bar with amount, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, "[data-designs]", "gridTemplateRows")).split(" ").length, 2);
    assert.ok(await p.$eval('[data-amt="500"]', (e) => e.getBoundingClientRect().top) > await p.$eval('[data-amt="25"]', (e) => e.getBoundingClientRect().top));
    const sumTop = await p.$eval(".summary", (e) => e.getBoundingClientRect().top), per = await p.$eval("#personal", (e) => e.getBoundingClientRect().top), del = await p.$eval("#delivery", (e) => e.getBoundingClientRect().top);
    assert.ok(per < sumTop && sumTop < del);
    assert.equal(await p.$eval("[data-sum]", (e) => e.open), false);
    await p.click("[data-sum] > summary"); assert.equal(await p.$eval("[data-sum]", (e) => e.open), true);
    assert.equal(await css(p, "[data-mbar]", "position"), "fixed");
    assert.equal(await text(p, "[data-mbar-amt]"), "$75.00");
    await p.click('[data-amt="200"]'); assert.equal(await text(p, "[data-mbar-amt]"), "$200.00");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn-p, .btn-o, .chip, .amt, .toggle button, .seg button, .icon-btn, .link, .faq summary, input:not([type=checkbox]):not([type=file]), textarea")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.placeholder));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
