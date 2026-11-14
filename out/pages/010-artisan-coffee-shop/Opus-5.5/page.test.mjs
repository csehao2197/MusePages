// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/010-artisan-coffee-shop/Opus-5.5/page.test.mjs
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
async function open(viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, acceptDownloads: true });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  return { context, page };
}

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("all four drink cards fit the desktop row", async () => {
    const r = await page.evaluate(() => { const rail = document.querySelector('[data-rail="drinks"]'); return rail.scrollWidth - rail.clientWidth; });
    assert.ok(r <= 8, `rail overflows by ${r}px`);
  });
  await check("adding drinks and beans updates badge, totals and quantities", async () => {
    assert.equal(await page.locator("[data-count]").isVisible(), false);
    await page.click('[data-add="lavender-latte"]');
    await page.click('[data-add="lavender-latte"]');
    await page.click('[data-add="eth-yirg"]');
    assert.equal(await page.textContent("[data-count]"), "3");
    await page.click("[data-cart-open]");
    assert.equal(await page.textContent("[data-subtotal]"), "$32.00");
    await page.click('[data-q="0"][data-d="-1"]');
    assert.equal(await page.textContent("[data-subtotal]"), "$25.50");
  });
  await check("cart persists across reload", async () => {
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.textContent("[data-count]"), "2");
  });
  await check("pickup checkout confirms and clears the cart", async () => {
    await page.click("[data-order]");
    await page.selectOption("[data-pickup]", { index: 2 });
    await page.click("[data-checkout]");
    assert.match(await page.textContent("[data-confirm-text]"), /EB-\d{4} · \$25\.50 · pickup at Alberta Arts/);
    await page.click('[data-modal="confirm"] [data-close]');
    assert.equal(await page.locator("[data-count]").isVisible(), false);
  });
  await check("menu PDF downloads as a valid PDF", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-pdf]")]);
    assert.equal(dl.suggestedFilename(), "ember-and-bloom-menu.pdf");
    const file = await dl.path();
    const { readFile } = await import("node:fs/promises");
    const pdf = (await readFile(file)).toString("latin1");
    assert.ok(pdf.startsWith("%PDF-1.4") && pdf.trimEnd().endsWith("%%EOF"));
    const xref = +pdf.match(/startxref\n(\d+)/)[1];
    assert.equal(pdf.slice(xref, xref + 4), "xref");
  });
  await check("newsletter validates email", async () => {
    await page.fill("#email", "not-an-email");
    await page.click("[data-subscribe] button");
    assert.match(await page.textContent("[data-sub-msg]"), /valid email/);
    await page.fill("#email", "maya@example.com");
    await page.click("[data-subscribe] button");
    assert.match(await page.textContent("[data-sub-msg]"), /You're in/);
  });
  await check("rewards form validates and confirms", async () => {
    await page.click("[data-rewards]");
    await page.click("[data-rewards-form] [type=submit]");
    assert.notEqual(await page.textContent('[data-modal="rewards"] [data-err]'), "");
    await page.fill('[data-rewards-form] [name="name"]', "Ana");
    await page.fill('[data-rewards-form] [name="email"]', "ana@example.com");
    await page.click("[data-rewards-form] [type=submit]");
    assert.equal(await page.locator('[data-modal="rewards"] .done').isVisible(), true);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no horizontal overflow", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
  });
  await check("mobile: drawer opens with Order Ahead and closes on Escape", async () => {
    await m.page.click("[data-drawer-open]");
    assert.equal(await m.page.locator("#drawer [data-order]").isVisible(), true);
    await m.page.keyboard.press("Escape");
    assert.equal(await m.page.locator("#drawer").isVisible(), false);
  });
  await check("mobile: products swipe horizontally", async () => {
    const w = await m.page.evaluate(() => { const r = document.querySelector('[data-rail="products"]'); return r.scrollWidth > r.clientWidth; });
    assert.equal(w, true);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
