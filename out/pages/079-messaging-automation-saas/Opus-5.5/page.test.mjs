// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/079-messaging-automation-saas/Opus-5.5/page.test.mjs
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
  page.on("dialog", (d) => d.accept());
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
  const d = await open({ width: 1440, height: 900 });
  const p = d.page;
  const db = () => p.evaluate(() => window.__trigly.db);
  const go = async (h, sel) => { await p.evaluate((x) => (location.hash = x), h); await p.waitForSelector(sel); };
  await check("landing: hero, features, pricing, FAQ and disclaimer", async () => {
    assert.match(await p.title(), /Trigly/);
    assert.match(await text(p, "h1"), /Every comment becomes a conversation/);
    assert.equal(await p.locator(".feat").count(), 5);
    assert.equal(await p.locator(".plan").count(), 2);
    assert.match(await text(p, ".plan.pro .price"), /\$99/);
    await p.click(".faq summary >> nth=2");
    assert.ok(await p.isVisible(".faq details >> nth=2 >> p"));
    assert.match(await text(p, ".foot"), /not affiliated/);
    assert.ok(await p.isHidden("[data-app]"));
  });
  await check("playground: keyword triggers, static vs Smart AI, no-match and DM mode", async () => {
    await p.click("[data-pgchip] >> nth=0");
    assert.match(await text(p, "[data-pgout]"), /GUIDE.*Lighting guide.*MESSAGE.*Public reply.*here's the lighting guide: trigly\.link\/light5/s);
    await p.fill("#pgtext", "how much is the preset pack?"); await p.press("#pgtext", "Enter");
    const out = await text(p, "[data-pgout]");
    assert.match(out, /Preset pricing.*SMARTAI.*\$19.*trigly\.link\/presets/s);
    const reply = await p.$$eval("[data-pgout] .bub", (b) => b.at(-1).textContent);
    assert.ok((reply.match(/[.!?](\s|$)/g) || []).length <= 2, reply);
    await p.fill("#pgtext", "love this edit"); await p.press("#pgtext", "Enter");
    assert.match(await text(p, "[data-pgout]"), /No automation matched/);
    await p.check("[data-pgform] input[value=dm]");
    await p.fill("#pgtext", "open to a collab?"); await p.press("#pgtext", "Enter");
    assert.match(await text(p, "[data-pgout]"), /Brand collabs.*hello@mayashoots\.example/s);
    assert.match(await text(p, "[data-pgout]"), /Direct message reply/);
  });
  await check("sign in: validation, then profile stored and dashboard shown", async () => {
    await p.click(".top-cta .btn.primary");
    await p.waitForSelector("[data-signin]");
    await p.click("[data-signin] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /first and last name/);
    await p.fill("[name=first]", "Ana"); await p.fill("[name=last]", "Ruiz"); await p.fill("[name=email]", "nope");
    await p.click("[data-signin] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /valid email/);
    await p.fill("[name=email]", "ana@studio.example"); await p.click("[data-signin] button[type=submit]");
    await p.waitForSelector(".tiles");
    const u = (await db()).user;
    assert.deepEqual([u.first, u.last, u.email], ["Ana", "Ruiz", "ana@studio.example"]);
    assert.match(u.id, /^user_/);
    assert.match(await text(p, ".pane-h h1"), /Hi Ana/);
  });
  await check("overview: totals, stacked chart with tooltip and table view", async () => {
    assert.equal(await text(p, "[data-tc]"), "424"); assert.equal(await text(p, "[data-td]"), "325");
    assert.equal(await p.locator("[data-chart] .col").count(), 14);
    const w = await p.$eval("[data-chart] .col rect.seg", (r) => +r.getAttribute("width")); assert.ok(w <= 24);
    await p.hover("[data-chart] .col >> nth=5");
    assert.match(await text(p, "[data-tip]"), /DMs \d+.*Comments \d+/s);
    await p.click("[data-tbl]");
    assert.equal(await p.locator("[data-tblbox] tbody tr").count(), 14);
    assert.ok(await p.isHidden("[data-chart]"));
    await p.click("[data-tbl]");
  });
  await check("integrations: simulated OAuth connect with validation and webhook verification", async () => {
    await p.click(".side a[href$=integrations]");
    await p.waitForSelector("[data-connect]");
    assert.ok(await p.isDisabled("[data-verify]"));
    await p.click("[data-connect]");
    await p.fill("[data-handle]", "bad handle!"); await p.click("[data-allow]");
    assert.match(await text(p, "[data-cerr]"), /Use a handle/);
    await p.fill("[data-handle]", "@ana.ruiz"); await p.click("[data-allow]");
    await p.waitForSelector("[data-disconnect]");
    assert.equal((await db()).integration.handle, "@ana.ruiz");
    await p.click("[data-verify]");
    assert.match(await text(p, "[data-wh]"), /hub\.challenge=(\d+).*200 OK · \d+/s);
    const [, a, b] = (await text(p, "[data-wh]")).match(/hub\.challenge=(\d+).*200 OK · (\d+)/s);
    assert.equal(a, b);
    await p.waitForSelector(".status >> text=Verified");
  });
  await check("automations: toggle, create with validation, keywords, post targeting, save", async () => {
    await p.click(".side a[href$=automations]");
    await p.waitForSelector("[data-alist]");
    assert.equal(await p.locator(".auto").count(), 3);
    await p.click("[data-toggle=a3]");
    assert.equal(await p.getAttribute("[data-toggle=a3]", "aria-checked"), "true");
    assert.equal((await db()).automations.find((a) => a.id === "a3").active, true);
    await p.click("button[data-new]");
    await p.waitForSelector("[data-editor]");
    await p.fill("[data-name]", "Golden hour presets");
    await p.click("[data-editor] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /at least one keyword/);
    await p.fill("[data-kwin]", "golden, Preset"); await p.press("[data-kwin]", "Enter");
    await p.fill("[data-kwin]", "golden"); await p.press("[data-kwin]", "Enter");
    assert.deepEqual(await p.$$eval("[data-chips] .chip", (c) => c.map((x) => x.textContent.trim())), ["golden", "preset"]);
    await p.click("[data-rmkw=preset]");
    await p.click("[data-post=p3]");
    await p.click("[data-editor] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /Write the message/);
    await p.fill("[data-message]", "Hi {name}! The golden hour preset is at trigly.link/golden");
    await p.click("[data-editor] button[type=submit]");
    const a = (await db()).automations.at(-1);
    assert.deepEqual([a.name, a.keywords, a.posts, a.mode, a.triggers], ["Golden hour presets", ["golden"], ["p3"], "MESSAGE", ["comment"]]);
    assert.match(await text(p, "[data-toasts]"), /saved/);
  });
  await check("webhook simulation: post targeting, counters, history and first-match order", async () => {
    await p.click(".sw[data-toggle]");
    await p.selectOption("#simpost", "p2");
    await p.fill("#simtext", "golden please"); await p.press("#simtext", "Enter");
    assert.match(await text(p, "[data-simout]"), /No automation matched/);
    await p.selectOption("#simpost", "p3");
    await p.fill("#simname", "Lee"); await p.fill("#simtext", "golden please"); await p.press("#simtext", "Enter");
    assert.match(await text(p, "[data-simout]"), /Golden hour presets.*Sent you a DM, Lee!.*Hi Lee! The golden hour preset/s);
    assert.equal(await text(p, "[data-cc]"), "1");
    assert.equal(await p.locator("[data-hist] li").count(), 1);
    await p.selectOption("#simpost", "p1");
    await p.fill("#simtext", "GUIDE pls"); await p.press("#simtext", "Enter");
    assert.match(await text(p, "[data-simout]"), /Lighting guide/);
    assert.equal((await db()).automations.find((x) => x.id === "a1").counts.comment, 413);
  });
  await check("Smart AI is gated on Free, unlocked by test checkout", async () => {
    await p.click(".modec:has(input[value=SMARTAI])");
    await p.waitForSelector("[data-dlg][open]");
    assert.match(await text(p, "[data-dlgin]"), /Unlock Smart AI/);
    assert.ok(await p.isChecked("[name=mode][value=MESSAGE]"));
    await p.click("[data-checkout]");
    await p.fill("[name=card]", "4000 0000 0000 0002"); await p.click("[data-pay] button[type=submit]");
    assert.match(await text(p, "[data-payerr]"), /declined/);
    await p.fill("[name=card]", "4242 4242 4242 4242"); await p.click("[data-pay] button[type=submit]");
    await p.waitForSelector("[data-dlg]:not([open])", { state: "attached" });
    assert.equal((await db()).plan, "PRO");
    await go("#/automation/a2", "[data-simform]");
    await p.check("[name=simsrc][value=dm]");
    await p.fill("#simtext", "what does it cost?"); await p.press("#simtext", "Enter");
    assert.match(await text(p, "[data-simout]"), /Preset pricing.*SMARTAI.*\$19/s);
  });
  await check("delete, persistence, sign out", async () => {
    await go("#/dashboard/automations", "[data-alist]");
    const n = await p.locator(".auto").count();
    await p.click(".auto >> nth=-1 >> [data-del]");
    assert.equal(await p.locator(".auto").count(), n - 1);
    await p.reload({ waitUntil: "networkidle" });
    await p.waitForSelector("[data-alist]");
    assert.equal(await p.locator(".auto").count(), n - 1);
    assert.equal((await db()).plan, "PRO");
    await p.click("[data-signout]");
    await p.waitForFunction(() => !document.querySelector("[data-landing]").hidden);
    assert.equal((await db()).user, null);
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: landing and dashboard fit 390px with 44px targets", async () => {
    const p = m.page;
    const fits = () => p.evaluate(() => document.documentElement.scrollWidth <= 390);
    const small = (s) => p.evaluate((q) => [...document.querySelectorAll(q)].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.getAttribute("aria-label") || b.textContent.trim()), s);
    assert.ok(await fits());
    assert.deepEqual(await small(".btn, .top-cta a, .pg-chips button, .faq summary"), []);
    await p.tap(".top-cta .btn.primary");
    await p.tap("[data-demo]");
    await p.waitForSelector(".tiles");
    assert.ok(await fits());
    await p.tap(".side a[href$=automations]");
    await p.waitForSelector(".auto");
    assert.ok(await fits());
    assert.deepEqual(await small(".side a, .auto .ib, .btn"), []);
    assert.ok(await p.$eval(".sw", (s) => { const r = s.getBoundingClientRect(), b = getComputedStyle(s, "::before"); return r.height - parseFloat(b.top) - parseFloat(b.bottom) >= 44; }));
    await p.tap(".auto h3 a");
    await p.waitForSelector("[data-editor]");
    assert.ok(await fits());
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
