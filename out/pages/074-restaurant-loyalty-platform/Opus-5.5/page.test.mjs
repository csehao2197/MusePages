// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/074-restaurant-loyalty-platform/Opus-5.5/page.test.mjs
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
const signIn = async (p, id, route) => { await go(p, "home").catch(() => {}); if (await p.locator("[data-signout]").count()) await p.click("[data-signout]"); await p.waitForSelector("[data-persona]"); await p.click(`[data-persona="${id}"]`); await p.waitForSelector(`[data-view][data-route="${route}"]`); };
const pts = (p) => p.$eval("[data-mypts]", (e) => +e.textContent.trim());

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const A = await ctx.newPage(), B = await ctx.newPage();
  for (const p of [A, B]) { p.on("pageerror", (e) => errors.push(e.message)); p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); }
  await A.goto(server.url, { waitUntil: "networkidle" }); await B.goto(server.url, { waitUntil: "networkidle" });
  await check("landing with 3 demo roles; protected routes require sign-in", async () => {
    assert.match(await text(A, "h1"), /Every visit counts\. Every tenth one wins\./); assert.equal(await A.locator("[data-persona]").count(), 3);
    await A.evaluate(() => { location.hash = "#/scan"; }); await A.waitForSelector('[data-view][data-route="home"]'); assert.match(await text(A, "[data-toasts]"), /Please sign in/);
  });
  await check("user: punch cards with progress, QR/code dialog, points; role-guarded admin pages", async () => {
    await signIn(A, 1, "cards");
    assert.equal(await A.locator("[data-card]").count(), 5); assert.equal(await pts(A), 340);
    assert.match(await text(A, '[data-card="1"]'), /Bean & Brew[\s\S]*7 of 10 punches[\s\S]*3 to go/); assert.match(await text(A, '[data-card="4"]'), /Raffle entered/);
    await A.click('[data-showcode="1"]'); assert.equal(await text(A, "[data-code]"), "PCH-0001-AC"); assert.ok(await A.locator(".qr svg rect").count() > 100);
    await B.evaluate(() => { location.hash = "#/users"; });
    await signIn(B, 7, "scan"); await B.evaluate(() => { location.hash = "#/users"; }); await B.waitForSelector('[data-view][data-route="denied"]'); assert.match(await text(B, "h1"), /Not allowed/); await go(B, "scan");
  });
  await check("real-time QR validation: staff scan in another tab updates the user's open card instantly; restaurant scoping; completion → raffle + new card", async () => {
    await B.fill("[data-scanform] [name=code]", "pch-0001-ac"); await B.click("[data-scanform] [type=submit]");
    assert.match(await text(B, "[data-scanres]"), /Punched Ava Chen: 8\/10 · \+10 points/);
    await A.waitForFunction(() => document.querySelector("[data-livecount]")?.textContent === "8/10 punches", null, { polling: 150 }); assert.match(await text(A, "[data-toasts]"), /\+1 punch at Bean & Brew \(8\/10\)/);
    await B.fill("[data-scanform] [name=code]", "PCH-0002-AC"); await B.click("[data-scanform] [type=submit]"); assert.match(await text(B, "[data-scanres]"), /belongs to Taco Luz/);
    await B.fill("[data-scanform] [name=code]", "PCH-9999-XX"); await B.click("[data-scanform] [type=submit]"); assert.match(await text(B, "[data-scanres]"), /not recognized/);
    await B.click('[data-quickscan="PCH-0001-AC"]'); await B.click('[data-quickscan="PCH-0001-AC"]');
    assert.match(await text(B, "[data-scanres]"), /Card complete![\s\S]*entered into the Bean & Brew raffle/); assert.match(await text(B, "[data-scanlog]"), /Ava Chen · Bean & Brew → 10\/10/);
    await A.keyboard.press("Escape"); await A.waitForFunction(() => document.querySelectorAll("[data-card]").length === 6, null, { polling: 150 });
    assert.match(await text(A, '[data-card="1"]'), /Raffle entered/); assert.equal(await pts(A), 370);
  });
  await check("prizes: redeem with enough punches (deducts punches, pending redemption with expiry); insufficient disabled", async () => {
    await go(A, "prizes"); await A.selectOption("[data-prest]", "1");
    assert.ok(await A.$eval('[data-redeem="1"]', (b) => b.disabled), "new Bean & Brew card has 0 punches");
    await A.selectOption("[data-prest]", "4"); await A.click('[data-redeem="7"]'); assert.match(await text(A, "[data-dlg-body]"), /uses 6 punches/); await A.click("[data-dlg-body] [type=submit]");
    assert.match(await text(A, "[data-myreds]"), /Extra toppings bowl[\s\S]*Sakura Ramen[\s\S]*pending/);
    await go(A, "cards"); assert.match(await text(A, '[data-card="3"]'), /3 of 10 punches/);
  });
  await check("points: transfer validation, balance update, history, achievement unlock + share", async () => {
    await go(A, "points"); await A.fill("[data-transfer] [name=pts]", "0"); await A.click("[data-transfer] [type=submit]"); assert.match(await text(A, "[data-terr]"), /at least 1 point/);
    await A.fill("[data-transfer] [name=pts]", "5000"); await A.click("[data-transfer] [type=submit]"); assert.match(await text(A, "[data-terr]"), /You only have 370 points/);
    assert.ok(await A.$eval('[data-badge="transfer_100"]', (b) => b.classList.contains("lock")));
    await A.selectOption("[data-transfer] [name=to]", "2"); await A.fill("[data-transfer] [name=pts]", "75"); await A.fill("[data-transfer] [name=msg]", "Tacos on me"); await A.click("[data-transfer] [type=submit]");
    assert.equal(await text(A, "[data-balance]"), "295 pts"); assert.match(await text(A, "[data-hist]"), /Sent to Ben Ortiz · “Tacos on me”\s*−75/);
    assert.match(await text(A, "[data-toasts]"), /Achievement unlocked: Big spender/); assert.ok(!(await A.$eval('[data-badge="transfer_100"]', (b) => b.classList.contains("lock"))));
  });
  await check("leaderboard ranks by points, highlights me, live updates can be paused", async () => {
    await go(A, "leaderboard"); const ps = await A.$$eval("[data-lb] .p", (e) => e.map((x) => +x.textContent)); assert.deepEqual(ps, [...ps].sort((a, b) => b - a)); assert.equal(await A.locator("[data-lb] li.me").count(), 1);
    await A.waitForTimeout(4300); const after = await A.$$eval("[data-lb] .p", (e) => e.map((x) => +x.textContent).reduce((s, x) => s + x, 0)); assert.ok(after > ps.reduce((s, x) => s + x, 0), "live activity adds points");
    await A.uncheck("[data-live]"); const frozen = await A.$$eval("[data-lb] .p", (e) => e.map((x) => x.textContent).join()); await A.waitForTimeout(4300); assert.equal(await A.$$eval("[data-lb] .p", (e) => e.map((x) => x.textContent).join()), frozen);
  });
  await check("restaurant admin: prize CRUD with validation, availability toggle; redemptions (scoped, mark redeemed, expired); raffle draw", async () => {
    await go(B, "manage"); assert.equal(await B.locator("[data-pid]").count(), 3);
    await B.click("[data-newprize]"); await B.fill("[data-dlg-body] [name=name]", "Cold brew"); await B.fill("[data-dlg-body] [name=description]", "16 oz cold brew."); await B.fill("[data-dlg-body] [name=requiredPunches]", "12"); await B.click("[data-dlg-body] [type=submit]");
    assert.match(await text(B, "[data-dlg-body]"), /Whole number 1–10/); await B.fill("[data-dlg-body] [name=requiredPunches]", "6"); await B.fill("[data-dlg-body] [name=expirationDays]", "10"); await B.click("[data-dlg-body] [type=submit]");
    assert.equal(await B.locator("[data-pid]").count(), 4); const cb = B.locator('[data-pid]:has-text("Cold brew")'); await cb.locator("[data-avail]").uncheck(); assert.match(await text(B, "[data-toasts]"), /Cold brew is now hidden/);
    await cb.locator("[data-editprize]").click(); await B.fill("[data-dlg-body] [name=quantity]", "33"); await B.click("[data-dlg-body] [type=submit]"); assert.match(await B.locator('[data-pid]:has-text("Cold brew")').textContent(), /33/);
    await B.locator('[data-pid]:has-text("Cold brew") [data-delprize]').click(); await B.click("[data-dlg-body] [type=submit]"); assert.equal(await B.locator("[data-pid]").count(), 3);
    await go(B, "redemptions"); const rt = await text(B, "[data-rtable]"); assert.doesNotMatch(rt, /Extra toppings bowl/, "other restaurant hidden"); assert.match(rt, /Ema Rossi[\s\S]*expired/);
    await B.locator('[data-rid]:has-text("Ben Ortiz") [data-markred]').click(); assert.equal(await B.locator('[data-rid]:has-text("Ben Ortiz") [data-st]').textContent(), "redeemed");
    await go(B, "raffle"); assert.match(await text(B, "h2"), /2 entries · Bean & Brew/); await B.click("[data-draw]"); assert.match(await text(B, "[data-winner]"), /Ava Chen|Chloe Kim/); await B.keyboard.press("Escape"); assert.equal(await B.locator("[data-entries] .pill.ok").count(), 1);
  });
  await check("analytics: KPIs, 14-day bar chart with tooltip, table view consistent with KPI", async () => {
    await go(B, "analytics"); assert.equal(await B.locator("[data-achart] path.bar").count() <= 14, true); assert.equal(await B.locator("[data-achart] [data-hit]").count(), 14);
    await B.focus('[data-achart] [data-hit="13"]'); assert.match(await text(B, "[data-achart] [data-tip]"), /\d+ punches/);
    await B.click("[data-atable]"); const sum = await B.$$eval("[data-adata] tbody td.r", (t) => t.reduce((s, x) => s + +x.textContent, 0)); assert.equal(sum, +(await text(B, "[data-k-punches]")));
    await B.click("[data-atable]");
  });
  await check("system admin: all-restaurant analytics, add restaurant, role management takes effect", async () => {
    await signIn(B, 8, "analytics"); assert.match(await text(B, ".ph p"), /All restaurants/); const all = +(await text(B, "[data-k-punches]"));
    await B.selectOption("[data-arest]", "1"); assert.ok(+(await text(B, "[data-k-punches]")) < all);
    await go(B, "admin-restaurants"); await B.click("[data-newrest]"); await B.fill("[data-dlg-body] [name=name]", "Bean & brew"); await B.fill("[data-dlg-body] [name=description]", "Dupe"); await B.fill("[data-dlg-body] [name=address]", "1 Main St"); await B.click("[data-dlg-body] [type=submit]"); assert.match(await text(B, "[data-dlg-body]"), /already exists/);
    await B.fill("[data-dlg-body] [name=name]", "Pho Real"); await B.click("[data-dlg-body] [type=submit]"); assert.equal(await B.locator("[data-rest-id]").count(), 7);
    await go(B, "users"); await B.selectOption('[data-uid="2"] [data-role]', "staff"); await B.selectOption('[data-uid="2"] [data-staffrest]', "3");
    await signIn(B, 7, "scan"); await signIn(B, 8, "analytics");
    const ben = await B.evaluate(() => window.__punchly.db().users.find((u) => u.id === 2)); assert.equal(ben.isStaff, true); assert.deepEqual(ben.staffRestaurantIds, [3]);
  });
  await ctx.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow across roles, scrollable tabs, 44px targets", async () => {
    const p = m.page; await p.click('[data-persona="1"]'); await p.waitForSelector('[data-view][data-route="cards"]');
    for (const r of ["cards", "restaurants", "prizes", "points", "leaderboard"]) { await go(p, r); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, r); }
    await p.click("[data-signout]"); await p.click('[data-persona="8"]'); await p.waitForSelector('[data-view][data-route="analytics"]');
    for (const r of ["analytics", "admin-restaurants", "users", "manage", "redemptions", "raffle", "scan"]) { await go(p, r); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, r); }
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .icon-btn, .tabs a, .persona")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
