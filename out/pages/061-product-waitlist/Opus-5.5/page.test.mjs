// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/061-product-waitlist/Opus-5.5/page.test.mjs
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
  await check("fixed transparent nav turns white on scroll; only X link; 80vh hero with pill, 56px headline, 480px form, counter, trust line", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "fixed");
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgba(0, 0, 0, 0)");
    assert.equal(await page.locator("[data-nav] a").count(), 2);
    assert.match(await text(page, ".xlink"), /Follow us on X/);
    assert.ok(await page.$eval(".hero", (e) => e.getBoundingClientRect().height) >= 720);
    assert.equal(await text(page, ".pill"), "LAUNCHING SPRING 2026");
    assert.equal(await css(page, "h1", "fontSize"), "56px");
    assert.equal(await text(page, "h1"), "Email that works for you, not against you");
    assert.equal(await css(page, ".hero .signup", "maxWidth"), "480px");
    assert.equal(await css(page, "#email1", "height"), "52px");
    assert.equal(await css(page, ".hero .btn", "backgroundColor"), "rgb(99, 102, 241)");
    await page.waitForTimeout(1600); assert.equal(await text(page, ".hero [data-count]"), "4,832");
    assert.match(await text(page, ".trust"), /We respect your inbox \(obviously\)\./);
    await page.evaluate(() => scrollTo(0, 300)); await page.waitForTimeout(400);
    assert.equal(await css(page, "[data-nav]", "backgroundColor"), "rgba(255, 255, 255, 0.96)");
    await page.evaluate(() => scrollTo(0, 0));
  });
  await check("feature cards (border hover), timeline with dashed connector, referral preview locked, tweets masonry, FAQ", async () => {
    assert.equal(await page.locator(".feat").count(), 3);
    assert.equal(await css(page, ".feat", "padding"), "32px");
    await page.hover(".feat:nth-child(2)"); await page.waitForTimeout(350); assert.equal(await css(page, ".feat:nth-child(2)", "borderTopColor"), "rgb(99, 102, 241)");
    assert.equal(await page.locator(".steps .n").count(), 3);
    assert.equal(await page.$eval(".steps", (e) => getComputedStyle(e, "::before").borderTopStyle), "dashed");
    assert.ok(await page.$eval("[data-ref]", (e) => e.classList.contains("locked")));
    assert.match(await text(page, "[data-preview-tag]"), /Preview/);
    await page.click('[data-share="x"]', { force: true }); assert.match(await text(page, "[data-toast]"), /Join the waitlist first/);
    assert.equal(await page.locator(".tw").count(), 6);
    assert.equal(await css(page, ".tweets", "columnCount"), "2");
    assert.match(await text(page, ".tweets"), /@designlead[\s\S]*@sarahdev[\s\S]*@markfounder[\s\S]*@emilywrites[\s\S]*@alexops[\s\S]*@jakepm/);
    await page.click("[data-faq] details:nth-child(5) summary"); assert.match(await text(page, "[data-faq] details:nth-child(5) p"), /Never/);
  });
  await check("signup validates, assigns position #4,833, increments counters, unlocks personal referral link, share URLs, copy, simulated referral moves up 100", async () => {
    await page.click(".hero [type=submit]"); assert.match(await text(page, ".hero [data-msg]"), /valid email/);
    await page.fill("#email1", "ada@mail.example"); await page.click(".hero [type=submit]");
    assert.match(await text(page, ".hero [data-msg]"), /You're #4,833/);
    await page.waitForTimeout(1600);
    assert.deepEqual(await page.$$eval("[data-count]", (c) => c.map((x) => x.textContent)), ["4,833", "4,833"]);
    assert.ok(await page.$eval("[data-ref]", (e) => e.classList.contains("live")));
    const link = await page.inputValue("[data-reflink]"); assert.match(link, /^https:\/\/kite\.email\/r\/[a-z0-9]{6}$/); assert.notEqual(link, "https://kite.email/r/abc123");
    assert.equal(await text(page, "[data-pos]"), "#4,833");
    assert.match(await page.getAttribute('[data-share="x"]', "href"), /^https:\/\/x\.com\/intent\/tweet\?text=.*kite\.email%2Fr%2F/);
    assert.match(await page.getAttribute('[data-share="li"]', "href"), /linkedin\.com\/sharing/);
    assert.match(await page.getAttribute('[data-share="em"]', "href"), /^mailto:/);
    assert.match(await page.getAttribute('[data-share="wa"]', "href"), /^https:\/\/wa\.me\//);
    await page.click("[data-sim]"); await page.click("[data-sim]");
    assert.equal(await text(page, "[data-pos]"), "#4,633"); assert.equal(await text(page, "[data-refs]"), "2"); assert.equal(await text(page, "[data-jumped]"), "200");
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("kite-waitlist")).refs), 2);
    await page.fill("#email2", "ada@mail.example"); await page.click(".final [type=submit]"); assert.match(await text(page, ".final [data-msg]"), /already on the list at #4,633/);
    await page.reload({ waitUntil: "networkidle" }); assert.equal(await text(page, "[data-pos]"), "#4,633");
  });
  await check("final CTA on deep indigo with white button; minimal footer", async () => {
    assert.equal(await css(page, ".final", "backgroundColor"), "rgb(30, 27, 75)");
    assert.equal(await css(page, ".final .btn-w", "backgroundColor"), "rgb(255, 255, 255)");
    assert.match(await text(page, ".final"), /Don't miss your spot[\s\S]*first 1,000 users get Kite Pro free for 3 months/);
    assert.match(await text(page, ".foot"), /Email, reimagined[\s\S]*Privacy Policy[\s\S]*Terms[\s\S]*X \(Twitter\)[\s\S]*LinkedIn[\s\S]*© 2026 Kite, Inc\./);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: 48px headline, stacked full-width input/button, stacked cards + vertical timeline, 2x2 share grid, sticky Join bar after hero, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await css(p, "h1", "fontSize"), "48px");
    const inp = await p.$eval("#email1", (e) => e.getBoundingClientRect()), btn = await p.$eval(".hero .btn", (e) => e.getBoundingClientRect());
    assert.ok(btn.top >= inp.bottom); assert.ok(Math.abs(inp.width - btn.width) < 1); assert.equal(Math.round(inp.height), 52);
    assert.equal((await css(p, ".features", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal(await p.$eval(".steps", (e) => getComputedStyle(e, "::before").borderLeftStyle), "dashed");
    assert.equal((await css(p, ".shares", "gridTemplateColumns")).split(" ").length, 2);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector(".features").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    assert.equal(await text(p, "[data-mbar-btn]"), "Join Waitlist");
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-w, .btn-o, .xlink, .share, .sim, .faq summary, .foot nav a, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.id));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
