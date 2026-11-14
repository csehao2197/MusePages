// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/041-yoga-studio/Opus-5.5/page.test.mjs
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
const rows = (p) => p.$$eval(".row .cls b", (b) => b.map((x) => x.textContent));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("sticky nav with location selector and taupe CTA; hero copy, CTAs and cream gradient overlay", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.equal(await css(page, ".nav-cta", "backgroundColor"), "rgb(124, 111, 91)");
    assert.deepEqual(await page.$$eval("[data-loc-select] option", (o) => o.map((x) => x.textContent)), ["South Lamar", "Domain"]);
    assert.equal(await text(page, "h1"), "Breathe. Move. Transform.");
    assert.equal(await text(page, ".eyebrow"), "Austin's Home for Mindful Movement");
    assert.match(await page.$eval(".hero", (e) => getComputedStyle(e, "::after").backgroundImage), /rgba\(253, 248, 240/);
  });
  await check("7 class cards with colored strips, durations, levels and hover 'Book This Class'", async () => {
    assert.equal(await page.locator(".ccard").count(), 7);
    assert.match(await text(page, ".ccard >> nth=1"), /Hot Power Yoga[\s\S]*95°F[\s\S]*75 min[\s\S]*Intermediate\+/);
    assert.equal(await css(page, ".ccard", "borderTopLeftRadius"), "16px");
    assert.ok(await page.$eval("[data-classes]", (e) => e.scrollWidth > e.clientWidth));
    await page.hover(".ccard >> nth=0"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".ccard:first-child .c-book", "opacity"), "1");
    await page.click('.ccard [data-type="yin"]');
    assert.equal(await page.evaluate(() => MuseInhale.loc()), "Domain");
    assert.deepEqual(await rows(page), ["Yin Yoga"]);
  });
  await check("schedule: location tabs, type pills, instructor link, teal Book vs gray Waitlist, booking", async () => {
    await page.click('[data-type-pill=""]'); await page.click('[data-loc="South Lamar"]');
    assert.deepEqual(await rows(page), ["Vinyasa Flow", "Hot Power Yoga", "Yoga Sculpt", "Restorative"]);
    assert.match(await text(page, ".row >> nth=1"), /7:30 AM[\s\S]*Devon K\.[\s\S]*Hot Room[\s\S]*Full \(Waitlist\)/);
    assert.equal(await css(page, '.row:nth-child(1) [data-book-row]', "backgroundColor"), "rgb(45, 212, 191)");
    assert.equal(await css(page, '[data-book-row="1"]', "backgroundColor"), "rgb(231, 229, 228)");
    await page.click('[data-loc="Livestream"]'); assert.deepEqual(await rows(page), ["Meditation & Breathwork"]);
    assert.match(await text(page, ".row"), /Unlimited/);
    await page.click('[data-loc="South Lamar"]'); await page.click('[data-type-pill="sculpt"]'); assert.deepEqual(await rows(page), ["Yoga Sculpt"]);
    await page.click('[data-type-pill=""]');
    await page.click('.row [data-who="Lena M."]');
    assert.deepEqual(await rows(page), ["Yin Yoga", "Restorative"]);
    await page.click("[data-clear-who]");
    await page.click('[data-book-row="0"]');
    await page.fill("[data-book] [name=name]", "Ana Lee"); await page.fill("[data-book] [name=email]", "ana@mail.example"); await page.click("[data-b-submit]");
    assert.match(await text(page, "[data-b-text]"), /Vinyasa Flow · 6:00 AM/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, ".row >> nth=0"), /7 spots left[\s\S]*Booked/);
  });
  await check("guides with hover View Schedule; pricing tiers, offer banner, inclusions", async () => {
    assert.deepEqual(await page.$$eval(".guide h3", (h) => h.map((x) => x.textContent)), ["Maya R.", "Devon K.", "Lena M.", "Carlos G."]);
    await page.hover(".guide >> nth=0"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".guide:first-child .g-link", "opacity"), "1");
    assert.match(await text(page, ".offer"), /First class FREE[\s\S]*30 days unlimited for \$79/);
    assert.match(await text(page, ".plan.pop"), /Most Popular[\s\S]*Monthly Unlimited[\s\S]*\$149/);
    assert.match(await text(page, ".plans"), /Best Value[\s\S]*\$129[\s\S]*Billed \$1,548\/year — save \$240/);
    assert.match(await text(page, ".incl"), /mat rental, filtered water/);
  });
  await check("on-demand previews, workshops registration, testimonials, two locations, claim form", async () => {
    assert.equal(await page.locator(".vid").count(), 4);
    await page.click('[data-vid="2"]'); assert.match(await text(page, "[data-v-title]"), /Quick Desk Break Stretch/);
    await page.keyboard.press("Escape");
    assert.equal(await css(page, "#ondemand", "backgroundColor"), "rgb(41, 37, 36)");
    assert.equal(await css(page, ".od-foot .btn", "backgroundColor"), "rgba(0, 0, 0, 0)");
    assert.equal(await page.locator(".ws").count(), 3);
    await page.click('[data-ws="2"]'); assert.match(await text(page, "[data-b-title]"), /200-Hour Teacher Training/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".tms .tm").count(), 3);
    assert.match(await text(page, ".rating"), /4\.9\/5 from 1,120 reviews/);
    assert.match(await text(page, "[data-locs]"), /2401 S Lamar Blvd[\s\S]*11005 Burnet Rd, Suite 120/);
    assert.match(await css(page, ".final", "backgroundImage"), /rgb\(124, 111, 91\)[\s\S]*rgb\(163, 146, 107\)/);
    await page.fill("#cl-email", "bad"); await page.click("[data-claim] [type=submit]"); assert.match(await text(page, "[data-claim-msg]"), /valid email/);
    await page.fill("#cl-email", "me@mail.example"); await page.click("[data-claim] [type=submit]"); assert.match(await text(page, "[data-claim-msg]"), /on its way/);
    assert.equal(await page.locator(".foot .socials a").count(), 4);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: cream overlay menu, swipe cards, schedule accordion, Most Popular first, 2x2 on-demand, floating Book Class, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-menu-open]");
    assert.equal(await css(p, "[data-menu]", "backgroundColor"), "rgb(253, 248, 240)");
    await p.click("[data-menu-close]");
    assert.equal(await p.locator(".grp summary").first().isVisible(), true);
    await p.locator(".grp summary").first().click();
    assert.equal(await p.locator(".grp details").first().evaluate((d) => d.open), false);
    const pop = await p.$eval(".plan.pop", (e) => e.getBoundingClientRect().top), first = await p.$eval(".plan:first-child", (e) => e.getBoundingClientRect().top);
    assert.ok(pop < first);
    assert.equal((await css(p, ".vids", "gridTemplateColumns")).split(" ").length, 2);
    await p.evaluate(() => document.getElementById("pricing").scrollIntoView()); await p.waitForTimeout(400);
    assert.ok((await p.$eval("[data-fab]", (e) => e.getBoundingClientRect().bottom)) <= 844);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .tab, .pill, .link, .ins, .socials a, .foot-cols a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
