// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/050-university-alumni-network/Opus-5.5/page.test.mjs
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
  await check("60vh hero over illustrated campus with gradient, CTAs, overlapping white stat bar with icons", async () => {
    const h = await page.$eval(".hero", (e) => e.getBoundingClientRect().height);
    assert.ok(h >= 900 * 0.6 - 1);
    assert.equal(await text(page, "h1"), "Welcome Back, Crestfield Alumni");
    assert.match(await text(page, ".hero .sub"), /45,000\+ graduates\. One powerful network\./);
    assert.match(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundImage), /linear-gradient/);
    assert.equal(await page.locator(".hero-bg svg").count(), 1);
    assert.equal(await css(page, ".hero .btn-purple", "backgroundColor"), "rgb(147, 51, 234)");
    assert.equal(await css(page, ".btn-ghost-w", "borderTopColor"), "rgb(255, 255, 255)");
    assert.match(await text(page, ".statbar"), /45,200\+[\s\S]*Alumni[\s\S]*72[\s\S]*Countries[\s\S]*340\+[\s\S]*Events\/Year[\s\S]*\$12\.8M[\s\S]*Raised in 2025/);
    assert.equal(await page.locator(".statbar .i").count(), 4);
    const heroBottom = await page.$eval(".hero", (e) => e.getBoundingClientRect().bottom), barTop = await page.$eval(".statbar", (e) => e.getBoundingClientRect().top);
    assert.ok(barTop < heroBottom);
  });
  await check("spotlight 3 cards with 120px portraits, quotes, Read Story dialogs", async () => {
    assert.equal(await page.locator(".sp-card").count(), 3);
    assert.equal(await css(page, ".sp-photo", "width"), "120px");
    assert.match(await text(page, ".sp-card >> nth=1"), /Marcus Rivera[\s\S]*Class of 2015[\s\S]*Founder & CEO of GreenLoop Technologies[\s\S]*entrepreneurship program/);
    await page.click('[data-story="2"]'); assert.match(await text(page, "[data-dlg-body]"), /Priya Anand, Class of 2019[\s\S]*satellite/); await page.keyboard.press("Escape");
    await page.click("[data-all-stories]"); await page.click('[data-story-dlg="0"]'); assert.match(await text(page, "[data-dlg-body]"), /Meridian Health/); await page.keyboard.press("Escape");
  });
  await check("events: date columns, color-coded badges, register flow, save-the-date .ics, full calendar", async () => {
    assert.equal(await page.locator(".ev").count(), 4);
    assert.deepEqual(await page.$$eval(".ev .badge", (b) => b.map((x) => x.textContent)), ["Reunion", "Networking", "Virtual", "Homecoming"]);
    assert.equal(new Set(await page.$$eval(".ev .badge", (b) => b.map((x) => getComputedStyle(x).backgroundColor))).size, 4);
    assert.deepEqual(await page.$$eval(".ev .btn", (b) => b.map((x) => x.textContent.trim())), ["Register", "RSVP", "Join", "Save the Date"]);
    await page.click('[data-ev="0"]');
    await page.fill("[data-ev-form] [name=name]", "Lee Park"); await page.fill("[data-ev-form] [name=email]", "lee@mail.example"); await page.fill("[data-ev-form] [name=year]", "1830");
    await page.click("[data-ev-form] [type=submit]"); assert.match(await text(page, "[data-err]"), /class year/);
    await page.fill("[data-ev-form] [name=year]", "2016"); await page.selectOption("[data-ev-form] [name=guests]", "1"); await page.click("[data-ev-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Lee Park \('16\)[\s\S]*with 1 guest/); await page.keyboard.press("Escape");
    assert.match(await text(page, '[data-ev="0"]'), /Registered/);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click('[data-ev="3"]')]);
    assert.equal(dl.suggestedFilename(), "crestfield-homecoming-2026.ics");
    const fs = await import("node:fs/promises"); assert.match(await fs.readFile(await dl.path(), "utf8"), /DTSTART:20261010T090000[\s\S]*DTEND:20261012T170000/);
    await page.click("[data-calendar]"); assert.ok(await page.locator(".cal tr").count() >= 8); await page.keyboard.press("Escape");
  });
  await check("directory: 4 preview cards, search + 4 filters, login gate on Connect, full results after login", async () => {
    assert.deepEqual(await page.$$eval(".al h3", (h) => h.map((x) => x.textContent)), ["Jordan Blake, '12", "Aisha Okonkwo, '18", "Tom Nakamura, '05", "Elena Petrova, '21"]);
    assert.match(await text(page, ".al >> nth=1"), /Software Engineer, Stripe[\s\S]*London, UK/);
    assert.equal(await page.locator(".ds-filters select").count(), 4);
    await page.fill("[data-dir-q]", "new york"); assert.match(await text(page, "[data-dir-count]"), /3 matches/);
    await page.fill("[data-dir-q]", ""); await page.selectOption("[name=industry]", "Technology");
    assert.match(await text(page, "[data-dir-count]"), /^4 matches/);
    await page.selectOption("[name=year]", "2010s"); assert.match(await text(page, "[data-dir-count]"), /3 matches/);
    await page.selectOption("[name=industry]", ""); assert.match(await text(page, "[data-dir-count]"), /9 matches[\s\S]*showing 4/); assert.equal(await page.locator(".al").count(), 4);
    await page.selectOption("[name=year]", ""); await page.selectOption("[name=industry]", "");
    await page.fill("[data-dir-q]", "zzzz"); assert.match(await text(page, "[data-dir-grid]"), /No alumni match/); await page.fill("[data-dir-q]", "");
    await page.click('[data-connect="Jordan Blake"]');
    assert.match(await text(page, "[data-dlg-body]"), /Log in to connect with Jordan Blake/);
    await page.fill("[data-li] [name=email]", "alum@mail.example"); await page.fill("[data-li] [name=pw]", "secret"); await page.click("[data-li] [type=submit]");
    assert.match(await text(page, '[data-connect="Jordan Blake"]'), /Request sent/);
    assert.match(await text(page, "[data-login-note]"), /Logged in as alum@mail\.example/);
    await page.selectOption("[name=industry]", "Technology"); assert.equal(await page.locator(".al").count(), 4); await page.selectOption("[name=industry]", "");
  });
  await check("mentorship split on tinted bg with stats, illustration, testimonial and validated form", async () => {
    assert.equal(await css(page, "#mentor", "backgroundColor"), "rgb(238, 242, 247)");
    assert.match(await text(page, ".m-stats"), /820[\s\S]*1,400\+[\s\S]*94%/);
    assert.match(await text(page, ".m-quote"), /Kai Torres, '20/);
    await page.click("[data-mentor]");
    await page.fill("[data-m-form] [name=name]", "Ana Ruiz"); await page.click("[data-m-form] [type=submit]");
    assert.match(await text(page, "[data-err]"), /way you can help/);
    await page.check('[data-m-form] [value="Interview prep"]'); await page.click("[data-m-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /paying it forward[\s\S]*interview prep/); await page.keyboard.press("Escape");
  });
  await check("giving: animated progress bars, campaign figures, gift updates the annual fund and donors", async () => {
    assert.match(await text(page, ".fund-main"), /Annual Fund 2026 — Goal: \$3,000,000[\s\S]*\$2,180,000[\s\S]*73%[\s\S]*4,200 donors/);
    assert.deepEqual(await page.$$eval(".fund", (f) => f.map((x) => x.querySelector("h3").textContent + "|" + x.querySelector(".nums").textContent)), ["STEM Scholarship Fund|$420,000 / $500,000 goal84%", "Library Renovation|$1.1M / $2M goal55%", "Athletics Program|$280,000 / $400,000 goal70%"]);
    await page.locator(".fund-main").scrollIntoViewIfNeeded(); await page.waitForTimeout(1700);
    const w = await page.$eval('[data-bar="annual"]', (b) => b.querySelector("i").getBoundingClientRect().width / b.getBoundingClientRect().width);
    assert.ok(w > 0.7 && w < 0.76);
    assert.equal(await css(page, '[data-bar="annual"] i', "backgroundImage").then((v) => /rgb\(22, 163, 74\)/.test(v)), true);
    await page.click('.fund-main [data-give="annual"]');
    await page.fill("[data-g-form] [name=other]", "20000"); assert.equal(await text(page, "[data-g-submit]"), "Give $20,000");
    await page.fill("[data-g-form] [name=name]", "Pat Kim"); await page.fill("[data-g-form] [name=email]", "pat@mail.example"); await page.click("[data-g-submit]");
    assert.match(await text(page, "[data-dlg-body]"), /\$20,000 to the Annual Fund 2026/); await page.keyboard.press("Escape");
    assert.equal(await text(page, '[data-raised="annual"]'), "$2,200,000");
    assert.equal(await text(page, "[data-donors]"), "4,201");
  });
  await check("chapters: map pins highlight cards, 6 chapter cards with flags, join requires login (already), find chapter", async () => {
    assert.equal(await page.locator(".pin").count(), 6);
    assert.equal(await page.locator(".chap").count(), 6);
    assert.equal(await page.locator(".chap .flag svg").count(), 6);
    await page.click('.pin[data-pin="5"]');
    assert.match(await text(page, "[data-map-tip]"), /Singapore — 680 members/);
    assert.equal(await page.getAttribute('[data-chap="5"]', "class"), "chap on");
    await page.click('[data-join="0"]'); assert.match(await text(page, '[data-chap="0"]'), /3,801 members[\s\S]*Joined/);
    await page.click("[data-find-chapter]"); await page.fill("[data-fc] [name=city]", "Oakland"); await page.click("[data-fc] [type=submit]");
    assert.match(await text(page, "[data-fc-out]"), /San Francisco/); await page.keyboard.press("Escape");
  });
  await check("news cards with 16:9 thumbs and badges; benefits 8-up grid; join banner signup; footer", async () => {
    assert.equal(await page.locator(".nw").count(), 3);
    const r = await page.$eval(".nw-img", (e) => e.getBoundingClientRect().width / e.getBoundingClientRect().height); assert.ok(Math.abs(r - 16 / 9) < 0.02);
    assert.match(await text(page, ".news"), /#28[\s\S]*March 5, 2026[\s\S]*Announcement[\s\S]*Forbes 30 Under 30/);
    await page.click('[data-news-i="1"]'); assert.match(await text(page, "[data-dlg-body]"), /free for life/); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".bn").count(), 8);
    assert.equal(await page.locator(".bn[open]").count(), 8);
    assert.equal((await css(page, ".benefits", "gridTemplateColumns")).split(" ").length, 4);
    assert.match(await css(page, ".join", "backgroundImage"), /repeating-linear-gradient/);
    await page.click("[data-signup] [type=submit]"); assert.match(await text(page, "[data-su-msg]"), /valid email/);
    assert.equal(await page.locator(".f-col").count(), 4);
    assert.equal(await page.locator(".socials a").count(), 5);
    assert.match(await text(page, ".foot"), /One University Drive, Crestfield, MA 02140[\s\S]*© 2026 Crestfield University Alumni Association\. All rights reserved\./);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: menu, swipe spotlight with dots, stacked events, Filters toggle, 2-col chapters, benefits accordion, sticky Join bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-burger]"); assert.equal(await p.locator("[data-mnav]").isVisible(), true); await p.click("[data-burger]");
    assert.ok(await p.$eval("[data-spot]", (e) => e.scrollWidth > e.clientWidth));
    await p.click('[data-dot="2"]'); await p.waitForTimeout(700); assert.equal(await p.getAttribute('[data-dot="2"]', "aria-current"), "true");
    assert.ok(await p.$eval(".ev-date", (e) => e.getBoundingClientRect().bottom) <= await p.$eval(".ev h3", (e) => e.getBoundingClientRect().top));
    assert.equal(await p.locator("[data-dir-filters]").isVisible(), false);
    await p.click("[data-dir-ftoggle]"); assert.equal(await p.locator("[data-dir-filters]").isVisible(), true);
    assert.equal((await css(p, ".chapters", "gridTemplateColumns")).split(" ").length, 2);
    assert.equal(await p.locator(".bn[open]").count(), 0);
    await p.click(".bn:nth-child(3) summary"); assert.equal(await p.locator(".bn[open]").count(), 1);
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector("#events").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .dots button, .bn summary, .socials a, .f-col a, select, input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
