// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/059-product-reviews/Opus-5.5/page.test.mjs
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
const num = (s) => Number(String(s).replace(/[^\d]/g, ""));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("product summary + breadcrumb; overview with computed average, 1,247 reviews, recommend %, distribution and category ratings", async () => {
    assert.match(await text(page, ".crumbs"), /Home[\s\S]*Footwear[\s\S]*Trailblazer Hiking Boot[\s\S]*Reviews/);
    assert.match(await text(page, ".psum"), /Trailblazer Waterproof Hiking Boot[\s\S]*\$149\.00[\s\S]*View Product/);
    assert.equal(await text(page, "[data-avg]"), "4.6");
    assert.equal(await text(page, "[data-total-text]"), "Based on 1,247 reviews");
    assert.equal(await text(page, "[data-rec]"), "94%");
    assert.deepEqual(await page.$$eval("[data-dstar] .n", (n) => n.map((x) => x.textContent)), ["847 (68%)", "312 (25%)", "56 (4%)", "20 (2%)", "12 (1%)"]);
    assert.match(await text(page, "[data-catratings]"), /Quality4\.8\/5[\s\S]*Value for Money4\.5\/5[\s\S]*Ease of Use4\.6\/5[\s\S]*Durability4\.7\/5[\s\S]*Shipping\/Packaging4\.4\/5/);
  });
  await check("clicking a distribution bar filters reviews; star checkboxes and chips stay in sync; active filter pills remove", async () => {
    await page.click('[data-dstar="2"]');
    assert.match(await text(page, "[data-showing]"), /of 20 reviews$/);
    assert.ok(await page.$$eval("[data-cards] .card .c-title [role=img]", (s) => s.every((x) => x.getAttribute("aria-label").startsWith("2 out"))));
    assert.equal(await page.isChecked('[data-scheck][value="2"]'), true);
    await page.check('[data-scheck][value="1"]'); assert.match(await text(page, "[data-showing]"), /of 32 reviews$/);
    await page.click("[data-active] button"); assert.match(await text(page, "[data-showing]"), /of (12|20) reviews$/);
    await page.click("[data-filters] [data-clear]"); assert.match(await text(page, "[data-showing]"), /Showing 1–20 of 1,247 reviews/);
  });
  await check("filters: verified, media, recency, size, color; sorting; search with highlights; mention chips", async () => {
    await page.check("[data-fmedia]", { force: true }); const withMedia = num((await text(page, "[data-showing]")).split("of")[1]);
    assert.ok(withMedia > 80 && withMedia < 160, `media ${withMedia}`);
    assert.ok(await page.$$eval("[data-cards] .card", (c) => c.every((x) => x.querySelector(".thumbs"))));
    await page.uncheck("[data-fmedia]", { force: true });
    await page.check("[data-verified]", { force: true }); const ver = num((await text(page, "[data-showing]")).split("of")[1]); assert.ok(ver > 1000 && ver < 1150); await page.uncheck("[data-verified]", { force: true });
    await page.selectOption("[data-recent]", "30"); const rec = num((await text(page, "[data-showing]")).split("of")[1]); assert.ok(rec >= 50 && rec <= 60, `recent ${rec}`); await page.selectOption("[data-recent]", "all");
    await page.selectOption("[data-size]", "10"); assert.ok(await page.$$eval(".list .c-var", (v) => v.every((x) => x.textContent.startsWith("Size 10 "))));
    await page.selectOption("[data-color]", "Forest Green"); assert.ok(await page.$$eval(".list .c-var", (v) => v.every((x) => x.textContent.includes("Forest Green"))));
    await page.click("[data-filters] [data-clear]");
    await page.selectOption("[data-sort]", "low"); assert.equal(await page.$eval(".list .card .c-title [role=img]", (e) => e.getAttribute("aria-label")), "1 out of 5 stars");
    await page.selectOption("[data-sort]", "helpful"); assert.match(await text(page, ".list .card h3"), /Survived 200 trail miles/);
    await page.selectOption("[data-sort]", "recent");
    await page.fill("[data-q]", "blisters"); await page.waitForTimeout(300);
    assert.ok(await page.locator(".list mark").count() > 0); assert.match(await text(page, "[data-active]"), /“blisters”/);
    await page.fill("[data-q]", ""); await page.waitForTimeout(300);
    await page.click('[data-mention="4"]'); assert.match(await text(page, "[data-active]"), /Mentions: Waterproof/);
    const wp = num((await text(page, "[data-showing]")).split("of")[1]); assert.equal(String(wp), (await text(page, '[data-mention="4"] small')).match(/\d[\d,]*/)[0].replace(/,/g, ""));
    await page.click("[data-filters] [data-clear]");
  });
  await check("highlights computed pros/cons; gallery + lightbox with review context and navigation; all photos dialog", async () => {
    assert.equal(await page.locator("[data-mentions] button").count(), 6);
    assert.equal(await page.locator("[data-pros] li").count(), 4); assert.equal(await page.locator("[data-cons] li").count(), 4);
    assert.equal(await page.locator("[data-gallery] li").count(), 16);
    assert.ok(await page.locator("[data-gallery] .vid").count() >= 1);
    await page.click('[data-media="0"]'); assert.match(await text(page, "[data-lb-ctx]"), /1 of \d+/);
    await page.keyboard.press("ArrowRight"); assert.match(await text(page, "[data-lb-ctx]"), /2 of \d+/);
    await page.click("[data-lb-ctx] [data-goto]"); await page.waitForTimeout(300);
    assert.equal(await page.locator("[data-lb][open]").count(), 0);
    await page.click("[data-all-photos]"); assert.ok(await page.locator(".all-ph button").count() > 16); await page.keyboard.press("Escape");
  });
  await check("featured reviews: 3 most helpful with full text, helpful counts and staff response", async () => {
    assert.equal(await page.locator("[data-featured] .card").count(), 3);
    assert.match(await text(page, "[data-featured]"), /312[\s\S]*people found this helpful[\s\S]*245[\s\S]*198/);
    assert.match(await text(page, "[data-featured]"), /Response from Northwind Outfitters[\s\S]*Verified seller/);
    assert.equal(await page.locator("[data-featured] .clamp").count(), 0);
  });
  await check("review cards: verified badge, variant, read more, helpful vote (persisted), report, share; seller responses; 20 per page with jump", async () => {
    const first = page.locator(".list .card").first();
    assert.match(await first.textContent(), /Size [\d.]+ · (Timber Brown|Slate Gray|Forest Green)/);
    assert.ok(await page.locator(".list .ver").count() > 10);
    const id = await first.getAttribute("data-rid");
    const yes = await page.locator(`.list [data-vote="${id}:y"]`).textContent();
    await page.click(`.list [data-vote="${id}:y"]`);
    assert.equal(num(await page.locator(`.list [data-vote="${id}:y"]`).textContent()), num(yes) + 1);
    assert.equal(await page.getAttribute(`.list [data-vote="${id}:y"]`, "aria-pressed"), "true");
    assert.equal(await page.evaluate((k) => JSON.parse(localStorage.getItem("nw-votes"))[k], id), "y");
    await page.click(`.list [data-report="${id}"]`); await page.click("[data-rsend]"); assert.match(await text(page, "[data-err], [data-rerr]"), /reason/);
    await page.click("[data-dlg-body] input[value='1']"); await page.click("[data-rsend]");
    assert.match(await page.locator(`.list [data-rid="${id}"] .sp`).textContent(), /Reported/);
    await page.selectOption("[data-sort]", "helpful");
    assert.ok(await page.locator(".list [data-more]").count() > 0);
    await page.click(".list [data-more]"); assert.equal(await page.getAttribute(".list [data-more]", "aria-expanded"), "true");
    await page.selectOption("[data-sort]", "low"); assert.ok(await page.locator(".list .resp").count() > 3);
    await page.selectOption("[data-sort]", "recent");
    assert.equal(await page.locator(".list .card").count(), 20);
    await page.click('[data-pager] [data-page="1"]'); assert.match(await text(page, "[data-showing]"), /Showing 21–40 of 1,247/);
    await page.fill("[data-jump]", "63"); await page.dispatchEvent("[data-jump]", "change"); assert.match(await text(page, "[data-showing]"), /Showing 1,241–1,247 of 1,247/);
    await page.click('[data-pager] [data-page="0"]');
  });
  await check("write a review: validation, guest vs verified flow, local photo upload, pending review appears first", async () => {
    await page.click("[data-wform] [type=submit]");
    assert.match(await text(page, "[data-werr]"), /star rating[\s\S]*title[\s\S]*50 characters[\s\S]*recommend/);
    await page.click('[data-mode="verify"]'); await page.fill("[data-v-email]", "me@mail.example"); await page.fill("[data-v-order]", "NW-00000"); await page.click("[data-v-go]");
    assert.match(await text(page, "[data-v-msg]"), /couldn't find/);
    await page.fill("[data-v-order]", "nw-48213"); await page.click("[data-v-go]"); assert.match(await text(page, "[data-v-msg]"), /Order verified/);
    await page.click('[data-rs="5"]'); assert.equal(await text(page, "[data-rate-l]"), "5 — Excellent");
    await page.fill("[data-wform] [name=name]", "Test H."); await page.fill("[data-wform] [name=title]", "Dry feet in the Cascades");
    await page.fill("[data-wbody]", "Hiked 30 miles in steady rain and my feet never got wet. Comfortable from day one."); assert.match(await text(page, "[data-wcount]"), /characters/);
    await page.check("[data-wform] input[value=yes]");
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
    await page.setInputFiles("[data-files]", { name: "trail.png", mimeType: "image/png", buffer: png });
    assert.equal(await page.locator("[data-previews] img").count(), 1);
    await page.click("[data-wform] [type=submit]"); await page.waitForTimeout(400);
    const top = page.locator(".list .card").first();
    assert.match(await top.textContent(), /Test H\.[\s\S]*Verified Purchase[\s\S]*Pending moderation[\s\S]*Dry feet in the Cascades/);
    assert.equal(await top.locator(".thumbs img").count(), 1);
    assert.equal(await text(page, "[data-total-text]"), "Based on 1,247 reviews");
  });
  await check("guidelines expandable; related products; footer", async () => {
    assert.equal(await page.locator(".guide details").count(), 4);
    await page.click(".guide details:nth-of-type(4) summary"); assert.match(await text(page, ".guide details:nth-of-type(4)"), /Incentivized/);
    assert.equal(await page.locator(".rp").count(), 4);
    assert.match(await text(page, "[data-related]"), /Merino Hiking Socks[\s\S]*Trekking Poles/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked overview, sticky quick filters + Filters drawer, card layout, sticky write/filters bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".overview", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".quick", "position"), "sticky");
    assert.equal(await p.isVisible(".quick .f-open"), true);
    await p.click(".quick .f-open"); await p.waitForTimeout(350); assert.ok(await p.$eval("[data-filters]", (e) => e.classList.contains("open")));
    await p.click('[data-filters] [data-scheck][value="5"]'); await p.click("[data-filters] .f-apply"); await p.waitForTimeout(300);
    assert.ok(!(await p.$eval("[data-filters]", (e) => e.classList.contains("open"))));
    assert.match(await text(p, "[data-showing]"), /of 847 reviews/);
    assert.equal(await text(p, "[data-fc]"), "1");
    assert.equal(await css(p, ".mbar", "position"), "fixed");
    await p.click('[data-qstar="5"]'); assert.match(await text(p, "[data-showing]"), /of 1,247 reviews/);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .vote, .small-b, .more, .q-chips button, .mentions button, .dist button, .pager button, .rate-btns button, .seg button, select, input:not([type=checkbox]):not([type=radio]):not([type=file])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44 && !(b.closest(".filters") && !b.closest(".filters").classList.contains("open"))).map((b) => b.textContent.trim().slice(0, 30) || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
