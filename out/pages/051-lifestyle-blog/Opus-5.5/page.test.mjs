// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/051-lifestyle-blog/Opus-5.5/page.test.mjs
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
  await check("announcement bar, sticky nav with centered serif logo, links and shop; 70vh hero with gradient, pill, byline and hover zoom", async () => {
    assert.equal(await css(page, ".announce", "backgroundColor"), "rgb(250, 245, 255)");
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.match(await css(page, ".logo", "fontFamily"), /Playfair Display/);
    const l = await page.$eval(".logo", (e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; }); assert.ok(Math.abs(l - 720) < 8);
    assert.deepEqual(await page.$$eval(".nav-l a", (a) => a.map((x) => x.textContent)), ["Wellness", "Travel", "Culture", "Food", "Style"]);
    const h = await page.$eval(".hero", (e) => e.getBoundingClientRect().height); assert.equal(Math.round(h), 630);
    assert.equal(await css(page, ".hero .pill", "backgroundColor"), "rgb(217, 70, 239)");
    assert.equal(await text(page, ".hero h1"), "The Case for Doing Less: Why Rest Is the New Productivity Hack");
    assert.match(await text(page, ".byline"), /By Mia Chen · 8 min read · March 12, 2026/);
    assert.match(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundImage), /rgba\(0, 0, 0, 0\.6\)/);
    await page.hover(".hero-txt > p:not(.byline)"); await page.waitForTimeout(1300);
    assert.match(await css(page, ".hero-img", "transform"), /matrix\(1\.04/);
  });
  await check("sticky category bar filters Latest (Interviews, Gift Guides) and nav links filter; All restores mixed grid", async () => {
    assert.equal(await css(page, "[data-cats]", "position"), "sticky");
    assert.equal(await page.locator("[data-cat]").count(), 8);
    assert.equal(await page.locator(".latest .card").count(), 7);
    assert.deepEqual(await page.$$eval(".latest .card", (c) => c.map((x) => x.className.replace("card", "").trim())), ["big", "small", "small", "", "", "", "wide"]);
    await page.click('[data-cat="Wellness"]'); await page.waitForTimeout(600);
    assert.equal(await css(page, '[data-cat="Wellness"]', "backgroundColor"), "rgb(217, 70, 239)");
    assert.match(await text(page, "[data-filter-note]"), /5 Wellness stories/);
    assert.ok(await page.$eval("[data-cats]", (e) => e.classList.contains("stuck")));
    await page.click('[data-cat="Interviews"]'); assert.match(await text(page, "[data-latest]"), /Dieter Rams/);
    await page.click('[data-cat="Gift Guides"]'); assert.match(await text(page, "[data-latest]"), /Gift Guide/);
    await page.click('.nav-l [data-cat-link="Food"]'); assert.equal(await page.getAttribute('[data-cat="Food"]', "aria-selected"), "true");
    await page.click('[data-cat="All"]'); assert.equal(await page.locator(".latest .wide").count(), 1);
  });
  await check("editor's picks: 3 cards 3:2 with pills, serif headlines, bylines; save heart persists; article reader opens", async () => {
    assert.equal(await page.locator(".picks .card").count(), 3);
    const r = await page.$eval(".picks .img", (e) => e.getBoundingClientRect().width / e.getBoundingClientRect().height); assert.ok(Math.abs(r - 1.5) < 0.02);
    assert.match(await text(page, ".picks"), /Copenhagen[\s\S]*By Astrid Nygaard · 6 min[\s\S]*Japanese Pantry[\s\S]*By Kenji Matsuda · 5 min[\s\S]*15 Pieces[\s\S]*By Elena Vasquez · 7 min/);
    assert.match(await css(page, ".picks h3", "fontFamily"), /Playfair/);
    await page.click('.picks [data-save="sauna"]');
    assert.equal(await page.getAttribute('.picks [data-save="sauna"]', "aria-pressed"), "true");
    assert.equal(await page.locator("[data-dlg][open]").count(), 0);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("tse-saved"))), ["sauna"]);
    await page.click('.picks [data-open-article="pantry"]');
    assert.match(await text(page, "[data-dlg-body]"), /Japanese Pantry Staples[\s\S]*By Kenji Matsuda · 5 min read/);
    await page.keyboard.press("Escape");
  });
  await check("newsletter: lavender grain, 60/40, illustration, validation and success", async () => {
    assert.equal(await css(page, "#newsletter", "backgroundColor"), "rgb(250, 245, 255)");
    assert.match(await page.$eval("#newsletter", (e) => getComputedStyle(e, "::before").backgroundImage), /feTurbulence/);
    assert.equal(await page.locator("#newsletter .cup").count(), 1);
    assert.equal(await text(page, "#newsletter .btn"), "Subscribe — It's Free");
    await page.click("#newsletter [type=submit]"); assert.match(await text(page, "#newsletter [data-msg]"), /valid email/);
    await page.fill("#nl-email", "reader@mail.example"); await page.click("#newsletter [type=submit]");
    assert.match(await text(page, "#newsletter [data-msg]"), /You're in!/);
  });
  await check("trending 5 numbered cards in a scroll strip; collection with 4 links; instagram 6 tiles with hover overlay + lightbox", async () => {
    assert.equal(await page.locator(".tr").count(), 5);
    assert.deepEqual(await page.$$eval(".tr .num", (n) => n.map((x) => x.textContent)), ["1", "2", "3", "4", "5"]);
    assert.match(await text(page, ".trend"), /12K reads[\s\S]*9\.8K reads[\s\S]*8\.2K[\s\S]*7\.1K[\s\S]*6\.5K/);
    assert.equal(await css(page, ".trend", "scrollSnapType"), "x mandatory");
    assert.equal(await css(page, ".coll", "backgroundColor"), "rgb(253, 244, 255)");
    assert.equal(await page.locator(".coll-list li").count(), 4);
    await page.click("[data-explore]"); assert.match(await text(page, "[data-dlg-body]"), /The Slow Living Guide/); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".ig li").count(), 6);
    await page.hover(".ig li:nth-child(2) button"); await page.waitForTimeout(350);
    assert.equal(await css(page, ".ig li:nth-child(2) .ov", "opacity"), "1");
    await page.click(".ig li:nth-child(2) button"); assert.match(await text(page, "[data-dlg-body]"), /@thesundayedit[\s\S]*3\.1K likes/); await page.keyboard.press("Escape");
  });
  await check("search overlay filters by title/author; shop picks, team and write-for-us pitch; footer", async () => {
    await page.click("[data-search-open]"); await page.fill("[data-search-in]", "kenji");
    assert.equal(await page.locator("[data-search-res] button").count(), 3);
    await page.fill("[data-search-in]", "oaxaca"); await page.click("[data-search-res] button");
    assert.match(await text(page, "[data-dlg-body]"), /Mezcal Country/); await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-search]").isHidden(), true);
    await page.click(".nav-r [data-shop]"); assert.equal(await page.locator(".products li").count(), 6); await page.keyboard.press("Escape");
    await page.click(".about [data-team]"); assert.equal(await page.locator(".team-list li").count(), 6); await page.keyboard.press("Escape");
    await page.click(".about [data-pitch]"); await page.fill("[data-pitch-form] [name=name]", "Ren"); await page.click("[data-pitch-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /pitch/);
    await page.fill("[data-pitch-form] [name=email]", "ren@mail.example"); await page.fill("[data-pitch-form] [name=pitch]", "An essay about learning to cook for one after a long relationship.");
    await page.click("[data-pitch-form] [type=submit]"); assert.match(await text(page, "[data-dlg-body]"), /Thank you, Ren!/); await page.keyboard.press("Escape");
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(28, 25, 23)");
    assert.equal(await page.locator(".f-col").count(), 4);
    assert.match(await text(page, ".f-bot"), /© 2026 The Sunday Edit\. Made with[\s\S]*in Brooklyn\.[\s\S]*Privacy · Terms · Accessibility/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: hamburger left/logo center/search+subscribe right, 50vh hero, scrolling picks/pills/trending/IG, stacked grid, sticky subscribe bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const b = await p.$eval("[data-burger]", (e) => e.getBoundingClientRect().left), lg = await p.$eval(".logo", (e) => e.getBoundingClientRect().left), s = await p.$eval("[data-search-open]", (e) => e.getBoundingClientRect().left);
    assert.ok(b < lg && lg < s);
    await p.click("[data-burger]"); assert.equal(await p.locator("[data-mnav]").isVisible(), true); await p.click("[data-burger]");
    const h = await p.$eval(".hero", (e) => e.getBoundingClientRect().height); assert.ok(h >= 380 && h <= 430);
    assert.ok(await p.$eval("[data-picks]", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval(".cat-scroll", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval(".trend", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval(".ig", (e) => e.scrollWidth > e.clientWidth));
    const igW = await p.$eval(".ig li", (e) => e.getBoundingClientRect().width), igC = await p.$eval(".ig", (e) => e.clientWidth); assert.ok(Math.abs(igC / igW - 4) < 0.4);
    assert.equal((await css(p, ".latest", "gridTemplateColumns")).split(" ").length, 1);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector(".trend-sec").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .cat-scroll button, .save, .sub-link, .ig button, .coll-list button, .f-col a, .f-bot a, input")].filter((x) => x.offsetParent && x.getBoundingClientRect().height < 44).map((x) => x.textContent.trim() || x.getAttribute("aria-label") || x.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
