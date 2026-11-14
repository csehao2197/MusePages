// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/038-membership-comparison/Opus-5.5/page.test.mjs
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
const prices = (p) => p.$$eval(".plan .price b", (b) => b.map((x) => x.textContent));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero, promo banner, 4 tiers with Most Popular highlight; monthly/annual toggle", async () => {
    assert.equal(await text(page, "h1"), "Find Your Perfect Membership");
    assert.match(await text(page, "[data-promo]"), /Join today, get your first month FREE/);
    assert.deepEqual(await page.$$eval(".plan h2", (h) => h.map((x) => x.textContent)), ["Basic", "Standard", "Premium", "Elite"]);
    assert.deepEqual(await prices(page), ["$29", "$49", "$79", "$149"]);
    assert.match(await text(page, ".plan.pop"), /Most Popular[\s\S]*Standard[\s\S]*Our best value/);
    assert.equal(await css(page, ".plan.pop .btn", "backgroundColor"), "rgb(109, 40, 217)");
    assert.equal(await css(page, ".plan:first-child .btn", "backgroundColor"), "rgb(255, 255, 255)");
    await page.click('[data-bill="annual"]');
    assert.deepEqual(await prices(page), ["$24", "$39", "$65", "$125"]);
    assert.match(await text(page, '[data-plan="standard"] .billed'), /\$468 billed yearly · save 20%/);
    assert.match(await text(page, ".cmp thead"), /\$39\/mo/);
    await page.click('[data-bill="monthly"]');
    await page.click("[data-promo-x]"); assert.equal(await page.locator("[data-promo]").isHidden(), true);
  });
  await check("comparison table: 12 rows, checks/X marks, sticky header with names and prices", async () => {
    assert.equal(await page.locator(".cmp tbody tr").count(), 12);
    assert.match(await text(page, ".cmp tbody tr:nth-child(5)"), /Group Classes\s*5\/month\s*Unlimited\s*Unlimited/);
    assert.match(await text(page, ".cmp tbody tr:nth-child(9)"), /Guest Passes\s*2\/month\s*4\/month/);
    assert.ok(await page.locator(".cmp .yes").count() > 15 && await page.locator(".cmp .no").count() > 10);
    assert.equal(await css(page, ".cmp thead th", "position"), "sticky");
    await page.evaluate(() => { const t = document.querySelector(".cmp tbody tr:nth-child(8)"); scrollTo(0, t.getBoundingClientRect().top + scrollY - 300); });
    await page.waitForTimeout(200);
    const top = await page.$eval(".cmp thead th:nth-child(2)", (e) => e.getBoundingClientRect().top);
    assert.ok(Math.abs(top - 68) < 3, `header pinned below nav (${top})`);
  });
  await check("classes by tier with popular highlights and schedule preview; facility access by tier", async () => {
    assert.match(await text(page, "[data-cls-list]"), /Unlimited classes from the Standard and Premium lists/);
    await page.click('[data-cls="basic"]');
    assert.match(await text(page, "[data-cls-list]"), /No group classes on Basic/);
    assert.equal(await page.locator(".cls li.ok").count(), 0);
    await page.click('[data-cls="elite"]');
    assert.equal(await page.locator(".cls li.lock").count(), 0);
    assert.ok(await page.locator(".sched-list li.hot").count() >= 3);
    assert.equal(await page.locator(".area").count(), 8);
    assert.equal(await page.locator(".area.locked").count(), 4);
    await page.click('[data-fac="elite"]'); assert.equal(await page.locator(".area.locked").count(), 0);
    await page.click('[data-fac="basic"]'); assert.equal(await page.locator(".area.locked").count(), 6);
  });
  await check("add-ons calculator totals monthly and one-time costs (towel included on Premium)", async () => {
    await page.check('[data-addon="pt"]'); await page.check('[data-addon="locker"]'); await page.check('[data-addon="towel"]');
    assert.equal(await text(page, "[data-total-month]"), "$74");
    assert.equal(await text(page, "[data-total-once]"), "$150");
    await page.selectOption("[data-calc-tier]", "premium");
    assert.equal(await text(page, "[data-total-month]"), "$94");
    assert.match(await text(page, "[data-calc]"), /Towel Service \(for Basic\/Standard\)Included/);
  });
  await check("testimonials by tier, one-open FAQ, offers, guarantee, 4-step flow, location selector", async () => {
    assert.deepEqual(await page.$$eval(".tier-chip", (c) => c.map((x) => x.textContent)), ["Basic member", "Premium member", "Elite member"]);
    const faq = page.locator("[data-faq] details");
    assert.equal(await faq.count(), 6);
    await faq.nth(1).locator("summary").click(); await faq.nth(3).locator("summary").click(); await page.waitForTimeout(80);
    assert.deepEqual(await page.$$eval("[data-faq] details", (d) => d.map((x) => x.open)), [false, false, false, true, false, false]);
    assert.equal(await page.locator(".offers article").count(), 5);
    assert.match(await text(page, ".guarantee"), /30-Day Money Back Guarantee[\s\S]*No hidden fees, ever[\s\S]*up to 3 months[\s\S]*Easy cancellation/);
    assert.equal(await page.locator(".flow li").count(), 4);
    await page.click('[data-loc="2"]');
    assert.equal(await page.getAttribute('[data-loc="2"]', "aria-checked"), "true");
    assert.match(await page.getAttribute("[data-map] svg", "aria-label"), /Cherry Creek/);
  });
  await check("join wizard: plan → start date → payment → orientation → welcome", async () => {
    await page.click('[data-plan="premium"] .btn');
    assert.equal(await page.isChecked('[data-wizard] [name=tier][value=premium]'), true);
    await page.click("[data-w-next]");
    await page.fill("[data-wizard] [name=start]", "2001-01-01"); await page.click("[data-w-next]");
    assert.match(await text(page, "[data-w-err]"), /within the next 30 days/);
    const min = await page.getAttribute("[data-wizard] [name=start]", "min");
    await page.fill("[data-wizard] [name=start]", min); await page.click("[data-w-next]");
    assert.match(await text(page, ".sumline"), /Premium · \$79\/mo[\s\S]*Due today: \$0\.00/);
    await page.fill("[data-wizard] [name=cname]", "Lee Park"); await page.fill("[data-wizard] [name=card]", "4242 4242 4242 4242"); await page.click("[data-w-next]");
    await page.click('.pk:has-text("Saturday 10:00 AM")'); await page.click("[data-w-next]");
    assert.match(await text(page, "[data-step-body]"), /Welcome to Kinetic![\s\S]*Premium \(monthly\)[\s\S]*Cherry Creek[\s\S]*Saturday 10:00 AM/);
    await page.click("[data-w-next]");
    assert.equal(await page.locator("[data-join-dlg]").isVisible(), false);
  });
  await check("final CTA: day pass, tour and advisor chat", async () => {
    await page.click("[data-pass]");
    await page.fill("[data-mini] [name=name]", "Ana"); await page.fill("[data-mini] [name=email]", "ana@mail.example"); await page.click("[data-mini] [type=submit]");
    assert.match(await text(page, "[data-mini-text]"), /Day pass on its way/);
    await page.keyboard.press("Escape");
    await page.click("[data-chat-open]");
    await page.click('[data-chat-quick] button:has-text("pool")');
    await page.waitForFunction(() => document.querySelectorAll("[data-chat-log] .m.bot").length >= 2);
    assert.match(await text(page, "[data-chat-log]"), /Premium \(\$79\/mo\) and Elite/);
    assert.match(await text(page, ".final"), /\(303\) 555-0147/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked plans (Standard first), scrollable table with sticky feature column, sticky Join bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const pop = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), first = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pop < first);
    assert.ok(await p.$eval(".table-wrap", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await css(p, ".cmp tbody th", "position"), "sticky");
    await p.evaluate(() => document.getElementById("compare").scrollIntoView()); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-mbar]", (e) => e.getBoundingClientRect().top)) < 844);
    assert.match(await text(p, "[data-mbar]"), /Standard · \$49\/mo[\s\S]*Join Now/);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .bill, .tt, .tp, .addon, .loc, .faq summary, .link, .icon-btn")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
