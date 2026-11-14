// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/069-gohealth-commerce-platform/Opus-5.5/page.test.mjs
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
const signIn = async (p, email, pw, route) => { await go(p, "#/login", "login"); await p.fill("[name=email]", email); await p.fill("[name=password]", pw); await p.click("[data-auth] [type=submit]"); if (route) await p.waitForSelector(`[data-view][data-route="${route}"]`); };
const today = async (p) => p.$$eval("[data-ctable] tbody tr", (r) => { const c = r[r.length - 1].cells; return { orders: +c[1].textContent, revenue: +c[2].textContent.replace(/[$,]/g, "") }; });

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await page.waitForSelector('[data-view][data-route="home"]');
  await check("storefront: hero, 6 category tiles, 16 products, filter by category, search, sort, product detail", async () => {
    assert.match(await page.title(), /GoHealth/); assert.equal(await page.locator(".tile").count(), 6); assert.equal(await page.locator(".pc").count(), 16);
    assert.ok(await page.isVisible('.acct a.btn[href="#/register"]')); assert.equal(await css(page, '.acct a.btn', "backgroundColor"), "rgb(22, 163, 74)");
    await page.click('[data-cats] a[href="#/c/teas"]'); await page.waitForSelector('[data-view][data-route="c/teas"]'); assert.equal(await page.locator(".pc").count(), 3); assert.equal(await page.getAttribute('[data-cats] a[href="#/c/teas"]', "aria-current"), "page");
    await page.selectOption("[data-sort]", "low"); const pr = await page.$$eval(".pc .price", (e) => e.map((x) => +x.textContent.replace(/[$,]/g, ""))); assert.deepEqual(pr, [...pr].sort((a, b) => a - b));
    await page.fill("[data-q]", "protein"); await page.press("[data-q]", "Enter"); await page.waitForSelector('[data-view][data-route="search/protein"]'); assert.deepEqual(await page.$$eval(".pc h3", (h) => h.map((x) => x.textContent)), ["Plant Protein Vanilla"]);
    await page.click(".pc h3 a"); await page.waitForSelector('[data-view][data-route="p/p8"]'); assert.match(await text(page, "h1"), /Plant Protein Vanilla/); assert.match(await text(page, ".pdp"), /\$39\.99/);
    assert.match(await text(page, ".alert.info"), /Sign in to add items/);
  });
  await check("purchase flow: add while signed out → login prompt → add completes after sign-in and returns to product", async () => {
    await page.click('[data-dq="1"]'); await page.click("[data-add-qty]");
    await page.waitForSelector('[data-view][data-route="login"]'); assert.match(page.url(), /#\/login\?next=%23%2Fp%2Fp8$/); assert.match(await text(page, "[data-toasts]"), /Please sign in/);
    await page.fill("[name=email]", "demo@gohealth.example"); await page.fill("[name=password]", "wrongpass"); await page.click("[data-auth] [type=submit]");
    await page.waitForSelector("[data-auth-err]:not([hidden])"); assert.match(await text(page, "[data-auth-err]"), /Incorrect email or password/);
    await page.click("[data-pw]"); assert.equal(await page.getAttribute("[name=password]", "type"), "text"); assert.equal(await page.getAttribute("[data-pw]", "aria-label"), "Hide password"); await page.click("[data-pw]"); assert.equal(await page.getAttribute("[name=password]", "type"), "password");
    await page.fill("[name=password]", "demo1234"); await page.click("[data-auth] [type=submit]");
    await page.waitForSelector('[data-view][data-route="p/p8"]'); assert.equal(await text(page, "[data-cart-n]"), "2"); assert.match(await text(page, "[data-toasts]"), /Added Plant Protein Vanilla/);
    assert.match(await text(page, "[data-acct]"), /Orders[\s\S]*Jamie[\s\S]*Sign out/);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("gh-users")).every((u) => !("password" in u) && /^[0-9a-f]{64}$/.test(u.hash))), true);
  });
  await check("cart persists (reload), quantity/remove, totals; protected routes redirect when signed out", async () => {
    await go(page, "#/p/p5", "p/p5"); await page.click("[data-add-qty]");
    await go(page, "#/cart", "cart"); assert.equal(await page.locator("[data-line]").count(), 2);
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector('[data-view][data-route="cart"]'); assert.equal(await page.locator("[data-line]").count(), 2);
    assert.equal(await text(page, "[data-sub]"), "$87.97");
    await page.click('[data-line="p5"] [data-lq="1"]'); assert.equal(await text(page, "[data-sub]"), "$95.96");
    await page.click('[data-line="p5"] [data-lrm]'); assert.equal(await page.locator("[data-line]").count(), 1); assert.equal(await text(page, "[data-total]"), "$86.38");
    await page.click("[data-logout]"); await page.waitForSelector('[data-view][data-route="home"]');
    for (const r of ["cart", "orders", "checkout", "admin"]) { await page.evaluate((h) => { location.hash = h; }, `#/${r}`); await page.waitForSelector('[data-view][data-route="login"]'); assert.match(page.url(), new RegExp(`next=%23%2F${r}$`)); }
    await page.fill("[name=email]", "demo@gohealth.example"); await page.fill("[name=password]", "demo1234"); await page.click("[data-auth] [type=submit]"); await page.waitForSelector('[data-view][data-route="denied"]');
    assert.match(await text(page, "h1"), /Admins only/);
    await go(page, "#/cart", "cart"); assert.equal(await page.locator("[data-line]").count(), 1, "cart restored for the same user");
  });
  let placed;
  await check("checkout validates (Luhn, expiry), places order, order history + detail + PDF invoice", async () => {
    await page.click('a[href="#/checkout"]'); await page.waitForSelector('[data-view][data-route="checkout"]');
    await page.click("[data-place]"); assert.ok(await page.locator("[data-co] [aria-invalid=true]").count() >= 5);
    await page.fill("[name=street]", "12 Elm Street"); await page.fill("[name=city]", "Portland"); await page.fill("[name=zip]", "97201");
    await page.fill("[name=card]", "4242424242424241"); await page.fill("[name=exp]", "01/20"); await page.fill("[name=cvc]", "12"); await page.click("[data-place]");
    assert.match(await text(page, "[name=card] ~ .e"), /invalid/); assert.match(await text(page, "[name=exp] ~ .e"), /future/);
    await page.fill("[name=card]", "4242424242424242"); assert.equal(await page.inputValue("[name=card]"), "4242 4242 4242 4242"); await page.fill("[name=exp]", "12/30"); await page.fill("[name=cvc]", "123");
    await page.click("[data-place]"); await page.waitForURL(/#\/orders\/GH-/); await page.waitForSelector(".pdp, .two");
    placed = page.url().split("/").pop(); assert.match(await text(page, ".ph"), /Processing/); assert.match(await text(page, "aside"), /\$86\.38[\s\S]*12 Elm Street[\s\S]*ending 4242/);
    assert.equal(await page.isVisible("[data-cart-n]"), false);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-invoice]")]); assert.equal(dl.suggestedFilename(), `invoice-${placed}.pdf`);
    const fs = await import("node:fs"); assert.match(fs.readFileSync(await dl.path(), "latin1"), /^%PDF-1\.4[\s\S]*Invoice[\s\S]*Plant Protein Vanilla[\s\S]*%%EOF$/);
    await go(page, "#/orders", "orders"); assert.equal(await page.locator(".ord .card").count(), 1); assert.match(await text(page, ".ord"), new RegExp(placed));
  });
  await check("admin: 7-day chart is accurate (today's bar/table/KPI include the new order), metric toggle, tooltip, table view, PDF report", async () => {
    await page.click("[data-logout]"); await signIn(page, "admin@gohealth.example", "admin1234", "admin");
    await page.click('[data-tview]'); const t1 = await today(page);
    const sums = await page.$$eval("[data-ctable] tbody tr", (r) => r.reduce((s, x) => s + +x.cells[1].textContent, 0)); assert.equal(sums, +(await text(page, "[data-k-orders]")));
    assert.equal(await page.locator("[data-ctable] tbody tr").count(), 7);
    const seededToday = await page.evaluate(() => { const o = JSON.parse(localStorage.getItem("gh-orders")); return o.length; }); assert.equal(seededToday, 1);
    assert.match(await text(page, "[data-recent] tr:first-child"), new RegExp(placed));
    // remove this browser's order and confirm today's numbers drop by exactly that order
    const total = await page.evaluate(() => { const o = JSON.parse(localStorage.getItem("gh-orders")); const t = o[0].total; localStorage.setItem("gh-orders-bak", JSON.stringify(o)); localStorage.setItem("gh-orders", "[]"); return t; });
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector('[data-view][data-route="admin"]'); await page.click("[data-tview]");
    const t0 = await today(page); assert.equal(t1.orders - t0.orders, 1); assert.ok(Math.abs(t1.revenue - t0.revenue - total) < 0.011);
    await page.evaluate(() => localStorage.setItem("gh-orders", localStorage.getItem("gh-orders-bak")));
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector('[data-view][data-route="admin"]');
    assert.equal(await page.locator("[data-chart] path.bar-m").count(), 7); assert.equal(await page.locator("[data-chart] [data-hit]").count(), 7);
    await page.hover('[data-hit="3"]'); assert.equal(await page.isVisible("[data-tip]"), true); assert.match(await text(page, "[data-tip]"), /orders[\s\S]*revenue/);
    await page.focus('[data-hit="6"]'); assert.match(await text(page, "[data-tip]"), new RegExp(`${t1.orders} orders`));
    await page.click('[data-metric="revenue"]'); assert.equal(await text(page, "#ch-h"), "Revenue per day"); assert.match(await page.getAttribute("[data-chart] svg", "aria-label"), /^Revenue per day/);
    assert.equal(await page.locator("[data-chart] .vlab").count() <= 2, true, "selective direct labels");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-report]")]); assert.equal(dl.suggestedFilename(), "gohealth-7-day-report.pdf");
  });
  await check("category CRUD: create (validated, unique), rename, delete with product reassignment; storefront updates immediately", async () => {
    await page.click('.side a[href="#/admin/categories"]'); await page.waitForSelector('[data-view][data-route="admin/categories"]');
    await page.click("[data-new] [type=submit]"); assert.match(await text(page, "[data-cerr]"), /at least 2/);
    await page.fill("#newcat", "herbal teas"); await page.click("[data-new] [type=submit]"); assert.match(await text(page, "[data-cerr]"), /already exists/);
    await page.fill("#newcat", "Kids' Health"); await page.click("[data-new] [type=submit]"); assert.equal(await page.locator("[data-cid]").count(), 7); assert.match(await text(page, "[data-cats]"), /Kids' Health/);
    await page.click('[data-cid="teas"] [data-edit]'); await page.fill("[data-edin]", "Organic Teas"); await page.keyboard.press("Enter");
    assert.match(await text(page, '[data-cid="teas"]'), /Organic Teas/); assert.match(await text(page, "[data-cats]"), /Organic Teas/);
    await page.click('[data-cid="superfoods"] [data-del]'); assert.match(await text(page, "[data-dlg-body]"), /2 products will move to Uncategorized/); await page.click("[data-confirm]");
    assert.equal(await page.locator('[data-cid="superfoods"]').count(), 0); assert.match(await text(page, "[data-cats]"), /Uncategorized/);
    await go(page, "#/c/uncategorized", "c/uncategorized"); assert.deepEqual(await page.$$eval(".pc h3", (h) => h.map((x) => x.textContent).sort()), ["Chia Seeds", "Organic Spirulina"]);
    await go(page, "#/c/teas", "c/teas"); assert.match(await text(page, "h1"), /Organic Teas/);
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector('[data-view][data-route="c/teas"]'); assert.match(await text(page, "h1"), /Organic Teas/);
  });
  await check("register: validation, duplicate email, new account signs in", async () => {
    await page.click("[data-logout]"); await go(page, "#/register", "register");
    await page.click("[data-auth] [type=submit]"); assert.equal(await page.locator("[data-auth] [aria-invalid=true]").count(), 3);
    await page.fill("[name=name]", "Sam Lee"); await page.fill("[name=email]", "demo@gohealth.example"); await page.fill("[name=password]", "password1"); await page.click("[data-auth] [type=submit]");
    await page.waitForSelector("[data-auth-err]:not([hidden])"); assert.match(await text(page, "[data-auth-err]"), /already exists/);
    await page.fill("[name=email]", "sam@mail.example"); await page.fill("[name=password]", "password1"); await page.click("[data-auth] [type=submit]");
    await page.waitForSelector('[data-view][data-route="home"]'); assert.match(await text(page, "[data-acct]"), /Sam/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow across store/auth/admin, category menu, 2-col grid, chart fits, 44px targets", async () => {
    const p = m.page; await p.waitForSelector('[data-view][data-route="home"]');
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".grid", "gridTemplateColumns")).split(" ").length, 2);
    await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-cats]"), true); await p.click('[data-cats] a[href="#/c/sleep"]'); await p.waitForSelector('[data-view][data-route="c/sleep"]'); assert.equal(await p.isVisible("[data-cats]"), false);
    await signIn(p, "admin@gohealth.example", "admin1234", "admin");
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.ok(await p.$eval("[data-chart] svg", (s) => s.getBoundingClientRect().right) <= 390);
    await p.tap('[data-hit="2"]'); assert.equal(await p.isVisible("[data-tip]"), true);
    await go(p, "#/admin/categories", "admin/categories"); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .btn-d, .icon-btn, .cart-link, .acct a, .acct button, .seg button, .side a, .qty button, .crud input, .pw button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
