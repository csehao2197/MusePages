// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/068-handmade-footwear-store/Opus-5.5/page.test.mjs
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

const go = async (p, hash, route) => { await p.evaluate((h) => { location.hash = h; }, hash); await p.waitForSelector(`[data-view][data-route="${route}"]`); };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("homepage communicates what/handmade/custom/nationwide; unique title, meta, H1; JSON-LD products; image alt text", async () => {
    assert.match(await page.title(), /Handmade Slippers & Slides in Lagos/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.match(await text(page, "h1"), /Handmade slippers & slides, made to order in Lagos/);
    assert.match(await text(page, ".usps"), /Handmade[\s\S]*Custom edits on approval[\s\S]*Nationwide delivery[\s\S]*Paystack/);
    assert.match(await text(page, ".announce"), /Nationwide delivery/);
    const ld = JSON.parse(await page.$eval('script[type="application/ld+json"]', (s) => s.textContent));
    const prods = ld["@graph"].filter((x) => x["@type"] === "Product"); assert.equal(prods.length, 12);
    assert.ok(prods.every((p) => p.offers.priceCurrency === "NGN" && p.offers.price >= 12000 && /MadeToOrder/.test(p.offers.availability)));
    const noAlt = await page.$$eval("[data-view] svg[role=img]", (s) => s.filter((x) => !x.getAttribute("aria-label")).length); assert.equal(noAlt, 0);
    assert.equal(await page.locator(".grid .pc").count(), 8); assert.equal(await page.locator(".work figure").count(), 12);
    assert.match(await text(page, ".steps"), /We review & quote[\s\S]*Nothing is charged yet/);
  });
  await check("shop: category filters, sort by price, search with empty state linking to custom orders", async () => {
    await page.click('[data-nav="shop"]'); await page.waitForSelector('[data-view][data-route="shop"]');
    assert.equal(await page.locator(".pc").count(), 12); assert.equal(await page.getAttribute('[data-nav="shop"]', "aria-current"), "page");
    await page.click('.filters a[href="#/shop/slippers"]'); await page.waitForSelector('[data-view][data-route="shop/slippers"]');
    assert.equal(await page.locator(".pc").count(), 3); assert.match(await page.title(), /Handmade Slippers/);
    await page.selectOption("[data-sort]", "low"); await page.waitForTimeout(100);
    const prices = await page.$$eval(".pc p b", (b) => b.map((x) => +x.textContent.replace(/\D/g, ""))); assert.deepEqual(prices, [...prices].sort((a, b) => a - b)); assert.equal(prices[0], 12000);
    await page.selectOption("[data-sort]", "featured");
    await page.fill("[data-q]", "rose"); await page.press("[data-q]", "Enter"); await page.waitForSelector('[data-view][data-route="shop/rose"]');
    assert.deepEqual(await page.$$eval(".pc h3", (h) => h.map((x) => x.textContent)), ["Rose Garden Slide"]);
    await page.fill("[data-q]", "sneakers"); await page.press("[data-q]", "Enter"); await page.waitForSelector(".empty"); assert.equal(await page.getAttribute(".empty a", "href"), "#/custom");
  });
  await check("product page: large image + 3 views, price, colour & size selection, size guide, approval-based custom edit, delivery/returns info", async () => {
    await go(page, "#/product/amaka-buckle-slide", "product/amaka-buckle-slide");
    assert.match(await page.title(), /Amaka Buckle Slide — Handmade Slide/);
    assert.match(await text(page, ".price"), /From\s*₦15,000/);
    assert.equal(await page.locator("[data-thumbs] button").count(), 3);
    await page.click('[data-thumbs] [data-v="1"]'); assert.equal(await page.getAttribute('[data-thumbs] [data-v="1"]', "aria-current"), "true");
    await page.check('[name=color][value="tan"]', { force: true }); assert.equal(await text(page, "[data-cname]"), "Tan"); assert.match(await page.getAttribute("[data-main] svg", "aria-label"), /in Tan/);
    await page.click("[data-guide]"); assert.match(await text(page, "[data-dlg-body]"), /Size guide[\s\S]*Foot length/); await page.click("[data-dlg-close]");
    await page.click("[data-add] [type=submit]"); assert.equal(await text(page, "[data-size-err]"), "Please choose your size.");
    await page.check('[name=size][value="41"]', { force: true });
    await page.click(".custom summary"); assert.match(await text(page, ".custom"), /subject to approval[\s\S]*Remove buckle/);
    await page.fill("#note", "Remove the buckle please"); await page.click("[data-add] [type=submit]"); assert.match(await text(page, "[data-ack-err]"), /confirm/);
    await page.check("[name=ack]"); await page.click("[data-add] [type=submit]");
    await page.waitForSelector("[data-drawer].open"); assert.match(await text(page, "[data-cart-body]"), /Amaka Buckle Slide[\s\S]*Tan · EU 41[\s\S]*Custom edit \(pending approval\): Remove the buckle please/);
    assert.equal(await text(page, "[data-cnt]"), "1"); assert.match(await text(page, "[data-cart-foot]"), /never charged automatically/);
    assert.match(await text(page, ".facts"), /Delivery[\s\S]*Returns & exchanges/);
  });
  await check("cart drawer: quantity, remove, persistence, focus handling", async () => {
    await page.click('[data-cart-body] [data-q="1"]'); assert.equal(await text(page, "[data-sub]"), "₦30,000"); assert.equal(await text(page, "[data-cnt]"), "2");
    await page.keyboard.press("Escape"); assert.equal(await page.$eval("[data-drawer]", (d) => d.inert), true);
    await go(page, "#/product/rose-garden-slide", "product/rose-garden-slide"); await page.check('[name=size][value="38"]', { force: true }); await page.click("[data-add] [type=submit]"); await page.waitForSelector("[data-drawer].open");
    assert.equal(await page.locator("[data-line]").count(), 2);
    await page.click("[data-line]:last-child [data-rm]"); assert.equal(await page.locator("[data-line]").count(), 1);
    await page.reload({ waitUntil: "networkidle" }); assert.equal(await text(page, "[data-cnt]"), "2");
  });
  await check("checkout: no account, validation (NG phone), state-driven delivery methods + fees, gift options, clear breakdown, simulated Paystack, confirmation", async () => {
    await go(page, "#/checkout", "checkout");
    assert.equal(await page.locator("input[type=password]").count(), 0);
    await page.click("[data-pay]"); assert.ok(await page.locator("[aria-invalid=true]").count() >= 4); assert.equal(await text(page, "[data-method-err]"), "Choose a delivery method");
    await page.fill("[name=name]", "Ada Okafor"); await page.fill("[name=phone]", "12345"); await page.fill("[name=email]", "ada@mail.example");
    await page.selectOption("[name=state]", "Lagos");
    assert.equal(await page.isVisible("[data-zone-wrap]"), true); assert.ok(await page.$eval('[name=method][value="waybill"]', (r) => r.disabled));
    assert.equal(await page.$eval('[name=method][value="dispatch"]', (r) => r.checked), true); assert.equal(await text(page, "[data-fee]"), "₦2,500");
    await page.selectOption("[name=zone]", "1"); assert.equal(await text(page, "[data-fee]"), "₦3,500");
    await page.check('[name=method][value="pickup"]'); assert.equal(await text(page, "[data-fee]"), "Free"); assert.equal(await page.isVisible("[data-addr-wrap]"), false);
    await page.selectOption("[name=state]", "Oyo"); assert.ok(await page.$eval('[name=method][value="pickup"]', (r) => r.disabled)); assert.equal(await page.$eval('[name=method][value="waybill"]', (r) => r.checked), true); assert.equal(await text(page, "[data-fee]"), "₦4,000");
    await page.selectOption("[name=state]", "Kano"); assert.equal(await text(page, "[data-fee]"), "₦5,500");
    await page.check("[name=packaging]"); await page.check("[name=card]"); await page.fill("[name=cardmsg]", "Happy birthday Tolu!");
    assert.equal(await text(page, "[data-total]"), "₦39,000"); assert.match(await text(page, "[data-pay]"), /Pay ₦39,000 with Paystack/);
    assert.match(await text(page, ".co"), /custom edit requests[\s\S]*full refund/);
    await page.fill("[name=address]", "12 Zoo Road, Gyadi-Gyadi, Kano"); await page.click("[data-pay]"); assert.match(await text(page, "[name=phone] ~ .e"), /Nigerian phone/);
    await page.fill("[name=phone]", "0803 123 4567"); await page.click("[data-pay]");
    assert.match(await text(page, "[data-dlg-body]"), /Simulated payment[\s\S]*₦39,000[\s\S]*takes no money/);
    await page.click("[data-simpay]"); await page.waitForSelector(".done .ref");
    assert.match(page.url(), /#\/order\/DFP-[A-Z0-9]{6}$/); assert.match(await text(page, ".done"), /Thank you, Ada![\s\S]*Custom edits reviewed[\s\S]*Waybill to Kano[\s\S]*₦39,000[\s\S]*Happy birthday Tolu!/);
    assert.equal(await page.isVisible("[data-cnt]"), false);
  });
  await check("custom order page: photo upload preview, validation, reference + WhatsApp share link", async () => {
    await page.click('[data-nav="custom"]'); await page.waitForSelector('[data-view][data-route="custom"]');
    assert.match(await text(page, ".ph"), /Nothing is charged until you approve the quote/);
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    await page.setInputFiles("[data-file]", [{ name: "inspo.png", mimeType: "image/png", buffer: png }, { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("x") }]);
    assert.equal(await page.locator("[data-prev] img").count(), 1); assert.match(await text(page, "[data-toast]"), /isn't an image/);
    await page.click("[data-custom] [type=submit]"); assert.equal(await page.getAttribute("[name=size]", "aria-invalid"), "true");
    await page.selectOption("[data-custom] [name=size]", "40"); await page.fill("[data-custom] [name=desc]", "Recreate in wine with a gold chain"); await page.fill("[data-custom] [name=name]", "Bisi"); await page.fill("[data-custom] [name=phone]", "+2348031234567");
    await page.click("[data-custom] [type=submit]"); assert.match(await text(page, "[data-cr-out]"), /Request CR-[A-Z0-9]+ is ready for review/);
    assert.match(await page.getAttribute("[data-wa]", "href"), /^https:\/\/wa\.me\/\?text=.*EU%2040.*wine/);
  });
  await check("required info pages exist with unique titles and H1s", async () => {
    const titles = new Set();
    for (const r of ["about", "contact", "faq", "shipping", "privacy", "terms"]) { await go(page, `#/${r}`, r); titles.add(await page.title()); assert.equal(await page.locator("[data-view] h1").count(), 1, r); }
    assert.equal(titles.size, 6);
    await go(page, "#/shipping", "shipping"); assert.match(await text(page, ".prose"), /Pickup[\s\S]*Dispatch rider[\s\S]*Waybill[\s\S]*case by case/);
    await go(page, "#/faq", "faq"); await page.click(".faq details:nth-child(2) summary"); assert.match(await text(page, ".faq details:nth-child(2) p"), /reviewed first/);
    await go(page, "#/product/nope", "product/nope"); assert.match(await text(page, "h1"), /not found/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile-first: menu, 2-col grid, stacked PDP and checkout, no overflow on every route, 44px targets", async () => {
    const p = m.page;
    for (const [h, r] of [["#/", "home"], ["#/shop", "shop"], ["#/product/ikoyi-mule", "product/ikoyi-mule"], ["#/custom", "custom"], ["#/shipping", "shipping"]]) { await go(p, h, r); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, r); }
    await go(p, "#/shop", "shop"); assert.equal((await css(p, ".grid", "gridTemplateColumns")).split(" ").length, 2);
    await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-links]"), true); await p.click('[data-links] [data-nav="about"]'); await p.waitForSelector('[data-view][data-route="about"]'); assert.equal(await p.isVisible("[data-links]"), false);
    await go(p, "#/product/ikoyi-mule", "product/ikoyi-mule"); await p.check('[name=size][value="40"]', { force: true }); await p.click("[data-add] [type=submit]"); await p.waitForSelector("[data-drawer].open");
    assert.ok(Math.round(await p.$eval("[data-drawer]", (d) => d.getBoundingClientRect().width)) <= 390);
    await p.click('[data-cart-foot] a[href="#/checkout"]'); await p.waitForSelector('[data-view][data-route="checkout"]');
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .icon-btn, .cart-btn, .chips span, .filters a, .filters select, .qty button, .rm, .foot nav a, .radio label, .check, input:not([type=radio]):not([type=checkbox]):not(.sr), select")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim().slice(0, 30) || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
