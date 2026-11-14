// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/057-loyalty-rewards-portal/Opus-5.5/page.test.mjs
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
  await check("gradient banner with greeting, member date, 4,280 points and computed distance to Platinum with progress bar", async () => {
    assert.match(await css(page, ".banner", "backgroundImage"), /rgb\(124, 58, 237\)[\s\S]*rgb\(37, 99, 235\)/);
    assert.equal(await text(page, "h1"), "Welcome back, Sarah!");
    assert.match(await text(page, ".hi"), /Member since Jan 2024/);
    assert.equal(await text(page, "[data-balance]"), "4,280");
    assert.equal(await text(page, "[data-away]"), "You're 1,721 points away from Platinum!");
    await page.waitForTimeout(1500);
    const w = await page.$eval("[data-slim] i", (e) => e.getBoundingClientRect().width / e.parentElement.getBoundingClientRect().width); assert.ok(Math.abs(w - 4280 / 6001) < 0.02);
  });
  await check("tier bar: 4 colored tiers with perks, Gold current with glow, marker at 4,280; 4 Gold benefits", async () => {
    assert.deepEqual(await page.$$eval(".tier h3", (h) => h.map((x) => x.textContent)), ["Bronze", "Silver", "Gold", "Platinum"]);
    assert.deepEqual(await page.$$eval(".tier", (t) => t.map((x) => getComputedStyle(x).getPropertyValue("--c").trim())), ["#CD7F32", "#9CA3AF", "#F59E0B", "#7C3AED"]);
    assert.match(await text(page, ".tlist"), /Earn 1pt per \$1[\s\S]*5% birthday discount[\s\S]*Free shipping on all orders[\s\S]*Early access \+ personal shopper/);
    assert.equal(await page.getAttribute('[data-tier="Gold"]', "class"), "tier cur");
    assert.match(await css(page, ".tier.cur", "boxShadow"), /rgba\(245, 158, 11/);
    const p = Number((await page.$eval("[data-marker]", (e) => e.style.left)).replace("%", "")); assert.ok(Math.abs(p - (50 + (1279 / 3000) * 25)) < 0.5, `${p}`);
    assert.equal(await page.locator(".benefits article").count(), 4);
  });
  await check("points history: brief rows with green/red points and consistent balances, filters, pagination of 47", async () => {
    const rows = await page.$$eval("[data-hist] tr", (r) => r.slice(0, 5).map((x) => [...x.children].map((c) => c.textContent)));
    assert.deepEqual(rows, [["Mar 10, 2026", "Purchase — Order #8834", "+240", "4,280"], ["Mar 5, 2026", "Redeemed — $10 Store Credit", "−500", "4,040"], ["Feb 28, 2026", "Bonus — Double Points Weekend", "+380", "4,540"], ["Feb 20, 2026", "Purchase — Order #8791", "+160", "4,160"], ["Feb 14, 2026", "Bonus — Valentine's Day Promo", "+200", "4,000"]]);
    assert.equal(await css(page, "[data-hist] tr:nth-child(1) td:nth-child(3)", "color"), "rgb(22, 163, 74)");
    assert.equal(await css(page, "[data-hist] tr:nth-child(2) td:nth-child(3)", "color"), "rgb(220, 38, 38)");
    assert.equal(await text(page, "[data-showing]"), "Showing 1–10 of 47 transactions");
    await page.click("[data-next]"); assert.equal(await text(page, "[data-showing]"), "Showing 11–20 of 47 transactions");
    const ok = await page.evaluate(() => { const r = [...document.querySelectorAll("[data-hist] tr")].map((x) => [...x.children].map((c) => c.textContent)); const num = (s) => Number(s.replace(/[^\d]/g, "")) * (/[−-]/.test(s) ? -1 : 1); for (let i = 0; i < r.length - 1; i++) if (num(r[i][3]) - num(r[i][2]) !== num(r[i + 1][3])) return false; return true; });
    assert.ok(ok, "balances chain");
    await page.click('[data-h="expired"]'); assert.match(await text(page, "[data-hist]"), /Points expired/);
    await page.click('[data-h="redeemed"]'); assert.ok(await page.$$eval("[data-hist] tr", (r) => r.every((x) => x.textContent.includes("Redeemed"))));
    await page.click('[data-h="all"]');
  });
  await check("catalog: 6 rewards sorted low→high, category filter, insufficient points state, redeem flow updates balance, history and snapshot but not tier", async () => {
    assert.deepEqual(await page.$$eval(".rw h3", (h) => h.map((x) => x.textContent)), ["$5 Store Credit", "Free Express Shipping", "$10 Store Credit", "20% Off Next Order", "Exclusive Tote Bag", "VIP Shopping Event Access"]);
    await page.click('[data-c="Experiences"]'); assert.equal(await page.locator(".rw").count(), 1); await page.click('[data-c="All"]');
    await page.selectOption("[data-sort]", "hl"); assert.equal(await text(page, ".rw h3 >> nth=0"), "VIP Shopping Event Access"); await page.selectOption("[data-sort]", "lh");
    const before = await text(page, "[data-snap] .st:nth-child(2) b");
    await page.click('[data-redeem="vip"]'); assert.match(await text(page, "[data-dlg-body]"), /New balance1,280 pts/);
    await page.click("[data-confirm]"); assert.match(await text(page, "[data-dlg-body]"), /ELV-VIP-\d{4}/); await page.click("[data-done]");
    assert.equal(await text(page, "[data-balance]"), "1,280");
    assert.equal(await text(page, "[data-hist] tr:first-child td:nth-child(2)"), "Redeemed — VIP Shopping Event Access");
    assert.equal(await text(page, "[data-hist] tr:first-child td:nth-child(4)"), "1,280");
    assert.notEqual(await text(page, "[data-snap] .st:nth-child(2) b"), before);
    assert.equal(await page.getAttribute('[data-tier="Gold"]', "class"), "tier cur");
    assert.equal(await text(page, '[data-redeem="tote"]'), "Need 220 more pts");
    assert.equal(await page.isDisabled('[data-redeem="tote"]'), true);
    assert.equal(await text(page, '[data-redeem="20off"]'), "Redeem");
  });
  await check("ways to earn: connect +100 (once), review +50 with validation; referral link + stats + leaderboard; promotions countdown + reminder .ics", async () => {
    await page.click("[data-connect]"); assert.equal(await text(page, "[data-balance]"), "1,380"); assert.match(await text(page, "[data-away]"), /1,621 points away/);
    await page.click("[data-connect]"); assert.equal(await text(page, "[data-balance]"), "1,380");
    await page.click("[data-review]"); await page.fill("[data-rv] textarea", "short"); await page.click("[data-rv] [type=submit]"); assert.match(await text(page, "[data-rv-err]"), /20 characters/);
    await page.fill("[data-rv] textarea", "Beautiful fabric and it fits perfectly, would buy again."); await page.click("[data-rv] [type=submit]");
    assert.equal(await text(page, "[data-balance]"), "1,430");
    assert.equal(await page.inputValue("[data-ref]"), "elevate.com/ref/sarah2024");
    assert.match(await text(page, ".ref"), /12[\s\S]*friends invited[\s\S]*8[\s\S]*signed up[\s\S]*3,500[\s\S]*#14/);
    assert.equal(await page.locator(".earn article").count(), 4);
    assert.equal(await css(page, ".earn article", "borderLeftWidth"), "4px");
    const d = Number(await text(page, '[data-pu="d"]')), h = Number(await text(page, '[data-pu="h"]')); assert.equal(d, 9); assert.ok(h >= 13 && h <= 14);
    const fs = await import("node:fs/promises");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-remind]")]);
    assert.equal(dl.suggestedFilename(), "elevate-platinum-flash-sale.ics"); assert.match(await fs.readFile(await dl.path(), "utf8"), /20260328/);
    assert.equal(await page.getAttribute("[data-remind]", "aria-pressed"), "true");
  });
  await check("snapshot cards with sparklines; challenges with animated progress; badges 6 earned + 3 locked with tooltips; FAQ animation; join form", async () => {
    assert.equal(await page.locator(".st").count(), 4); assert.equal(await page.locator(".st .spark").count(), 4);
    assert.match(await text(page, ".st:nth-child(3)"), /Referral Bonus[\s\S]*3,500 pts[\s\S]*7 successful referrals/);
    await page.locator("[data-chal]").scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
    assert.deepEqual(await page.$$eval(".pbar i", (b) => b.map((x) => x.style.width)), ["33%", "60%", "0%"]);
    assert.match(await text(page, "[data-chal]"), /Weekend Warrior[\s\S]*1\/3[\s\S]*Expires Mar 16[\s\S]*Review Rockstar[\s\S]*3\/5[\s\S]*Social Butterfly[\s\S]*0\/2/);
    assert.equal(await page.locator(".badge").count(), 9); assert.equal(await page.locator(".badge.locked").count(), 3);
    assert.equal(await text(page, "[data-bcount]"), "6/15");
    await page.hover(".badge:nth-child(6) button"); assert.equal(await page.isVisible(".badge:nth-child(6) .tip"), true); assert.match(await text(page, ".badge:nth-child(6) .tip"), /Early Bird[\s\S]*Earned Dec 1, 2025/);
    await page.click("[data-faq] details:nth-child(2) summary"); await page.waitForTimeout(350);
    assert.equal(await page.$eval("[data-faq] details:nth-child(2)", (d) => d.open), true);
    await page.click("[data-faq] details:nth-child(2) summary"); await page.waitForTimeout(350);
    assert.equal(await page.$eval("[data-faq] details:nth-child(2)", (d) => d.open), false);
    assert.equal(await css(page, ".join", "backgroundColor"), "rgb(30, 27, 75)");
    await page.click("[data-join]"); await page.click("[data-jf] [type=submit]"); assert.match(await text(page, "[data-jerr]"), /valid email/); await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: centered banner, vertical tier stepper, history as cards, single-column rewards, sticky balance + Redeem bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await css(p, ".banner-in", "flexDirection"), "column");
    assert.equal(await css(p, ".tlist", "gridTemplateColumns").then((v) => v.split(" ").length), 1);
    const t1 = await p.$eval('[data-tier="Bronze"]', (e) => e.getBoundingClientRect().top), t4 = await p.$eval('[data-tier="Platinum"]', (e) => e.getBoundingClientRect().top); assert.ok(t4 > t1 + 200);
    assert.equal(await css(p, ".hist thead", "display"), "none");
    assert.equal(await css(p, ".hist tr", "display"), "grid");
    assert.equal((await css(p, ".rewards", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await css(p, ".mbar", "position"), "fixed");
    assert.equal(await text(p, "[data-mbal]"), "4,280 pts");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-p, .btn-gold, .e-cta, .tabs button, .pg, .icon-btn, .badge button, .faq summary, select, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
