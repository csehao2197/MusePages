// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/033-creative-agency-team/Opus-5.5/page.test.mjs
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
const shown = (p) => p.evaluate(() => MuseMosaic.shown());

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero: warm background, headline, group illustration with 3 overlapping stat badges", async () => {
    assert.equal(await css(page, ".hero", "backgroundColor"), "rgb(255, 251, 235)");
    assert.equal(await text(page, "h1"), "The People Behind the Pixels");
    assert.match(await text(page, ".sub"), /32 creatives, engineers, and strategists/);
    assert.equal(await css(page, ".photo-img", "borderTopLeftRadius"), "16px");
    assert.deepEqual(await page.$$eval(".badges li", (l) => l.map((x) => x.textContent.trim().replace(/\s+/g, " "))), ["8 Countries", "32 Team Members", "6 Years Average Tenure"]);
    const img = await page.$eval(".photo-img", (e) => e.getBoundingClientRect().bottom), badge = await page.$eval(".badges", (e) => e.getBoundingClientRect());
    assert.ok(badge.top < img && badge.bottom > img, "badges overlap the photo's bottom edge");
  });
  await check("leadership: 4 cards, 120px circular headshots with brand border, hover tint", async () => {
    assert.deepEqual(await page.$$eval(".leader h3", (h) => h.map((x) => x.textContent)), ["Rachel Kim", "Marcus Chen", "Priya Sharma", "David Okafor"]);
    assert.equal(await css(page, ".lead-photo", "width"), "120px");
    assert.equal(await css(page, ".lead-photo", "borderTopLeftRadius"), "50%");
    assert.deepEqual(await page.$$eval(".leader", (l) => l.map((x) => x.querySelectorAll(".socials a").length)), [2, 2, 2, 2]);
    await page.hover(".leader >> nth=1"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".leader:nth-child(2)", "backgroundColor"), "rgb(255, 247, 237)");
  });
  await check("crew: department counts, filter, expand to 32, hover reveals socials", async () => {
    assert.deepEqual(await page.$$eval(".pill", (p) => p.map((x) => x.textContent.trim())), ["All (32)", "Design (10)", "Engineering (12)", "Strategy (5)", "Operations (5)"]);
    assert.equal(await shown(page), 12);
    assert.match(await text(page, ".mate >> nth=0"), /Sofia Reyes[\s\S]*Senior Designer[\s\S]*typeface in under 3 seconds/);
    await page.click('[data-dept="Engineering"]');
    assert.equal(await shown(page), 12);
    assert.ok(await page.$$eval(".mate", (m) => m.every((x) => x.dataset.dept === "Engineering")));
    await page.click('[data-dept="Strategy"]'); assert.equal(await shown(page), 5);
    await page.click('[data-dept="All"]');
    await page.click("[data-more]");
    assert.equal(await shown(page), 32);
    assert.equal(await page.locator(".more").isHidden(), true);
    await page.hover(".mate >> nth=2"); await page.waitForTimeout(350);
    assert.equal(await page.$eval(".mate:nth-child(3) .mate-social", (e) => getComputedStyle(e).transform), "none");
    assert.equal((await css(page, "[data-crew]", "gridTemplateColumns")).split(" ").length, 4);
  });
  await check("culture values, 4-image collage, 6 perks with colored left borders", async () => {
    assert.deepEqual(await page.$$eval(".values h3", (h) => h.map((x) => x.textContent)), ["Craft Over Speed", "Radical Transparency", "Remote-First, Human-Always"]);
    assert.equal(await page.locator(".collage svg").count(), 4);
    assert.equal(await page.locator(".perks article").count(), 6);
    assert.equal(await css(page, ".perks article", "borderLeftWidth"), "4px");
    const colors = await page.$$eval(".perks article", (a) => a.map((x) => getComputedStyle(x).borderLeftColor));
    assert.notEqual(colors[0], colors[1]);
  });
  await check("jobs list opens role dialog; validation and success; open application", async () => {
    assert.equal(await page.locator(".job").count(), 4);
    assert.match(await text(page, ".jobs"), /Senior Product Designer[\s\S]*Remote \(US\/EU\)[\s\S]*Full-Stack Engineer \(Next\.js\)[\s\S]*Design Intern — Summer 2026[\s\S]*Internship/);
    await page.hover(".job-btn >> nth=1"); await page.waitForTimeout(300);
    assert.equal(await page.$eval(".job:nth-child(2) .job-btn", (e) => getComputedStyle(e).backgroundColor), "rgb(255, 241, 214)");
    await page.click(".job-btn >> nth=1");
    assert.equal(await text(page, "[data-dlg-title]"), "Full-Stack Engineer (Next.js)");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-err]"), /name[\s\S]*email/);
    await page.fill("[data-form] [name=name]", "Jo Park"); await page.fill("[data-form] [name=email]", "jo@dev.example"); await page.fill("[data-form] [name=link]", "github.com/jo");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-err]"), /https/);
    await page.fill("[data-form] [name=link]", "https://github.com/jo");
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-done-text]"), /Thanks, Jo[\s\S]*Full-Stack Engineer[\s\S]*Demo/);
    await page.keyboard.press("Escape");
    await page.click('[data-apply="open"]');
    assert.equal(await text(page, "[data-dlg-title]"), "Introduce yourself");
    await page.keyboard.press("Escape");
  });
  await check("testimonial, numbers infographic, stack, footer CTA", async () => {
    assert.equal(await css(page, ".bigquote", "backgroundColor"), "rgb(245, 243, 255)");
    assert.match(await text(page, ".bigquote"), /Sofia Reyes[\s\S]*4 years at Mosaic/);
    assert.equal(await page.locator(".q-av svg").count(), 1);
    assert.equal(await css(page, "#numbers", "backgroundColor"), "rgb(255, 247, 237)");
    assert.deepEqual(await page.$$eval(".nums b", (b) => b.map((x) => x.textContent)), ["120+", "4.9/5", "98%", "15", "8", "6 yrs"]);
    assert.equal(await css(page, ".nums b", "fontSize"), "48px");
    assert.equal(await css(page, ".nums b", "color"), "rgb(249, 115, 22)");
    assert.equal(await page.locator(".stack .chips li").count(), 15);
    assert.equal(await css(page, ".foot", "backgroundColor"), "rgb(28, 25, 23)");
    await page.click('.foot [data-apply="project"]');
    assert.equal(await text(page, "[data-dlg-title]"), "Start a Project");
    await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: badges below photo, 1-col leaders, 2-col crew, scrolling pills and collage, full-width job cards, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const img = await p.$eval(".photo-img", (e) => e.getBoundingClientRect().bottom), badge = await p.$eval(".badges", (e) => e.getBoundingClientRect().top);
    assert.ok(badge >= img, "stats stack below the photo");
    assert.equal((await css(p, ".leaders", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, "[data-crew]", "gridTemplateColumns")).split(" ").length, 2);
    assert.ok(await p.$eval("[data-pills]", (e) => e.scrollWidth > e.clientWidth));
    assert.equal(await css(p, ".collage", "display"), "flex");
    assert.ok(await p.$eval(".collage", (e) => e.scrollWidth > e.clientWidth));
    assert.equal((await css(p, ".nums", "gridTemplateColumns")).split(" ").length, 2);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .pill, .socials a, .mate-social a, .job-btn, .icon-btn, .mnav a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
