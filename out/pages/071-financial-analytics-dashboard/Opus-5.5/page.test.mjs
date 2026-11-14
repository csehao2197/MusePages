// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/071-financial-analytics-dashboard/Opus-5.5/page.test.mjs
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

const go = async (p, r) => { await p.evaluate((h) => { location.hash = h; }, `#/${r}`); await p.waitForSelector(`[data-view][data-route="${r}"]`); };
const order = async (p, side, price, qty) => { await p.check(`[data-order] [name=side][value="${side}"]`, { force: true }); await p.fill("[data-order] [name=price]", String(price)); await p.fill("[data-order] [name=qty]", String(qty)); await p.click("[data-submit]"); return text(p, "[data-omsg]"); };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("landing: hero, 4 module cards, CV positioning, educational disclaimer", async () => {
    assert.match(await text(page, "h1"), /Money, risk and markets/); assert.equal(await page.locator(".feat").count(), 4);
    assert.match(await text(page, ".disclaimer"), /Not financial advice/); assert.match(await text(page, ".cv"), /price-time priority/);
  });
  await check("dashboard: KPIs, health score breakdown, category bars, budget meters; transaction CRUD updates everything", async () => {
    await page.click('.feat[href="#/dashboard"]'); await page.waitForSelector('[data-view][data-route="dashboard"]');
    assert.equal(await text(page, "[data-k-inc]"), "$5,650"); assert.equal(await text(page, "[data-k-exp]"), "$3,592"); assert.equal(await text(page, "[data-k-net]"), "$2,058");
    const s1 = parseInt(await text(page, "[data-score]")); assert.ok(s1 >= 80 && s1 <= 100, `score ${s1}`);
    assert.ok(await page.locator("[data-hbars] path.bar1").count() >= 9); assert.match(await text(page, "[data-hbars]"), /Housing[\s\S]*\$1,800/);
    assert.equal(await page.locator("[data-meters] .meter-row").count(), 10);
    await page.click("[data-addtx]"); await page.click("[data-dlg] [type=submit]"); assert.ok(await page.locator("[data-dlg] [aria-invalid=true]").count() >= 2);
    await page.selectOption("[data-dlg] [name=type]", "expense"); await page.fill("[data-dlg] [name=desc]", "New laptop"); await page.fill("[data-dlg] [name=amount]", "1500"); await page.selectOption("[data-dlg] [name=category]", "Shopping"); await page.click("[data-dlg] [type=submit]");
    assert.equal(await text(page, "[data-k-exp]"), "$5,092"); const s2 = parseInt(await text(page, "[data-score]")); assert.ok(s2 < s1, "score drops");
    assert.match(await text(page, '[data-meters] .meter-row:has-text("Shopping")'), /\$1,635 \/ \$200[\s\S]*Over/);
    await page.click('[data-txf="income"]'); assert.equal(await page.locator("[data-tx]").count(), 3); await page.click('[data-txf="all"]');
    await page.click('[data-tx]:has-text("New laptop") [data-etx]'); await page.fill("[data-dlg] [name=amount]", "500"); await page.click("[data-dlg] [type=submit]"); assert.equal(await text(page, "[data-k-exp]"), "$4,092");
    await page.click('[data-tx]:has-text("New laptop") [data-dtx]'); assert.equal(await text(page, "[data-k-exp]"), "$3,592");
    await page.click("[data-budgets]"); await page.fill('[data-dlg] [name="b_Food"]', "500"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, '[data-meters] .meter-row:has-text("Food")'), /\$587 \/ \$500[\s\S]*Over/);
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector('[data-view][data-route="dashboard"]'); assert.match(await text(page, '[data-meters] .meter-row:has-text("Food")'), /\$500/);
  });
  await check("portfolio: 100% validation, tall segmented bar (legend, table view), risk score/volatility, concentration warnings", async () => {
    await go(page, "portfolio");
    assert.equal(await text(page, "[data-total]"), "100%"); assert.equal(await page.locator('[role="alert"]').count(), 0);
    assert.equal(await page.locator("[data-seg] > div").count(), 6); assert.equal(await page.locator(".legend li").count(), 6);
    assert.equal(await page.$eval("[data-seg] > div", (d) => getComputedStyle(d).backgroundColor), "rgb(42, 120, 214)"); assert.equal(await page.$eval("[data-seg] > div", (d) => d.getBoundingClientRect().height), 28);
    const r1 = parseInt(await text(page, "[data-risk]")), v1 = parseFloat(await text(page, "[data-vol]")); assert.ok(r1 >= 3 && r1 <= 6 && v1 > 5 && v1 < 16);
    assert.match(await text(page, "[data-warnings]"), /VTI is 40%/);
    await page.click("[data-alloct]"); assert.match(await text(page, "[data-alloc-table]"), /Equities\s*55%/); await page.click("[data-alloct]");
    await page.fill('[data-asset]:has-text("VTI") [data-weight]', "30"); await page.press('[data-asset]:has-text("VTI") [data-weight]', "Tab");
    assert.equal(await text(page, "[data-total]"), "90%"); assert.match(await text(page, '[role="alert"]'), /10\.0% unallocated/);
    await page.click("[data-addasset]"); await page.fill("[data-dlg] [name=ticker]", "vti"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-dlg]"), /Already in the portfolio/);
    await page.fill("[data-dlg] [name=ticker]", "ETH"); assert.equal(await page.inputValue("[data-dlg] [name=weight]"), "10"); await page.selectOption("[data-dlg] [name=cls]", "Crypto"); await page.click("[data-dlg] [type=submit]");
    assert.equal(await text(page, "[data-total]"), "100%"); assert.match(await text(page, "[data-warnings]"), /Crypto is 14%/);
    assert.ok(parseFloat(await text(page, "[data-vol]")) > v1, "more crypto → more volatility");
  });
  await check("assistant: context-aware answers with disclaimer, guardrail refusal, anonymized context preview", async () => {
    await go(page, "ai");
    await page.click('[data-ask]:has-text("How am I doing")'); await page.waitForTimeout(500);
    const a1 = await text(page, ".bubble.bot:last-child"); assert.match(a1, /savings rate[\s\S]*health score is \d+\/100[\s\S]*not financial advice/);
    await page.fill("#ask", "Should I buy Bitcoin right now?"); await page.press("#ask", "Enter"); await page.waitForTimeout(500);
    const a2 = await text(page, ".bubble.bot:last-child"); assert.match(a2, /can't recommend buying, selling or holding/); assert.match(a2, /not financial advice/);
    await page.click('[data-ask]:has-text("Am I over budget")'); await page.waitForTimeout(500); assert.match(await text(page, ".bubble.bot:last-child"), /over budget in Food/);
    await page.click('[data-ask]:has-text("Explain the order book")'); await page.waitForTimeout(500); assert.match(await text(page, ".bubble.bot:last-child"), /price-time priority/);
    assert.ok((await page.locator(".bubble.bot .disc").count()) >= 5);
    await page.click("[data-ctx]"); const ctx = JSON.parse(await text(page, "[data-ctxjson]")); assert.ok("savings_rate_pct" in ctx && "portfolio" in ctx); assert.doesNotMatch(JSON.stringify(ctx), /Paycheck|Grocery|Rent"|VTI/); await page.keyboard.press("Escape");
  });
  await check("order book: validation, resting orders, price-time priority with partial fills, sweep across levels, cancel, trade history + chart", async () => {
    await go(page, "trading");
    assert.match(await text(page, "[data-spread]"), /0\.10[\s\S]*100\.000/);
    assert.match(await order(page, "buy", "abc", 0), /^$/); assert.equal(await page.locator("[data-order] [aria-invalid=true]").count(), 2);
    assert.match(await order(page, "sell", "100.00", 5), /no match; 5 resting at 100\.00/);
    await order(page, "sell", "100.00", 5);
    assert.match(await order(page, "buy", "100.00", 7), /filled 7 @ avg 100\.00 across 2 trades/);
    const st = await page.$$eval("[data-mine] tbody tr", (r) => r.map((x) => [x.cells[2].textContent, x.querySelector("[data-status]").textContent]));
    assert.deepEqual(st, [["7/7", "filled"], ["2/5", "partial"], ["5/5", "filled"]], "older order at the same price filled first");
    assert.match(await order(page, "buy", "100.10", 20), /filled 20 @ avg 100\.04 across 3 trades/);
    const eng = await page.evaluate(() => ({ ask: [window.__engine.asks[0].price, window.__engine.asks[0].rem], bid: window.__engine.bids[0].price, trades: window.__engine.trades.length }));
    assert.deepEqual(eng.ask, [10005, 9]); assert.equal(eng.bid, 9995); assert.equal(eng.trades, 5);
    assert.equal(await page.locator("[data-trades] tr").count(), 5); assert.match(await text(page, "[data-last]"), /Last 100\.05/);
    assert.equal(await page.locator("[data-tline] path.ln").count(), 1);
    await order(page, "buy", "99.97", 4); assert.match(await text(page, "[data-book]"), /99\.97YOU/);
    await page.click("[data-mine] tbody tr:first-child [data-cancel]"); assert.equal(await text(page, "[data-mine] tbody tr:first-child [data-status]"), "canceled"); assert.doesNotMatch(await text(page, "[data-book]"), /99\.97/);
    await page.click("[data-bots]"); await page.waitForTimeout(2700); await page.click("[data-bots]");
    assert.ok(await page.evaluate(() => window.__engine.bids.length + window.__engine.asks.length) > 0);
    await page.click("[data-resetbook]"); assert.equal(await page.locator("[data-mine] tbody tr").count(), 0);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow on any page, icon nav, stacked layouts, 44px targets", async () => {
    const p = m.page;
    for (const r of ["home", "dashboard", "portfolio", "ai", "trading"]) { await go(p, r); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, r); }
    await go(p, "dashboard");
    const small = await p.evaluate(() => [...document.querySelectorAll(".nav a, .btn, .btn-o, .icon-btn, .chips button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
