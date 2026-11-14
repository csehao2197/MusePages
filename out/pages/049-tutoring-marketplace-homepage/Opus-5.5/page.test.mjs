// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/049-tutoring-marketplace-homepage/Opus-5.5/page.test.mjs
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
  await check("sticky nav with links and purple CTA; hero 55/45 with badge, headline, search, pills and illustrated collage", async () => {
    assert.equal(await css(page, "[data-nav]", "position"), "sticky");
    assert.deepEqual(await page.$$eval(".nav-links a", (a) => a.map((x) => x.textContent)), ["Find a Tutor", "Subjects", "How It Works", "Pricing", "For Tutors"]);
    assert.equal(await css(page, ".nav-r .btn-primary", "backgroundColor"), "rgb(124, 58, 237)");
    assert.match(await text(page, ".eyebrow"), /Rated 4\.9\/5 by 50,000\+ students/);
    assert.equal(await text(page, "h1"), "Learn Anything, From Anyone, Anywhere");
    const c = await page.$eval(".hero-copy", (e) => e.getBoundingClientRect().width), a = await page.$eval(".collage", (e) => e.getBoundingClientRect().width);
    assert.ok(c > a);
    assert.equal(await page.locator(".pills button").count(), 6);
    assert.equal(await page.locator(".collage > .lap > svg").count(), 3);
    assert.match(await css(page, ".hero", "backgroundImage"), /rgb\(245, 243, 255\)/);
  });
  await check("search: autocomplete with keyboard, filters narrow results, pills search, booking flow", async () => {
    await page.fill("[data-q]", "pyt");
    assert.match(await text(page, "[data-suggest]"), /Python/);
    await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    assert.match(await text(page, "[data-dlg-body]"), /Tutors for “Python”[\s\S]*Raj Patel/);
    await page.keyboard.press("Escape");
    await page.click("[data-ftoggle]"); assert.equal(await page.locator("[data-filters]").isVisible(), true);
    await page.fill("[data-q]", "Spanish"); await page.keyboard.press("Escape"); await page.check("[data-filters] [name=native]"); await page.selectOption("[data-filters] [name=max]", "30");
    await page.click(".search [type=submit]");
    const t = await text(page, "[data-dlg-body]");
    assert.match(t, /native speakers/); assert.match(t, /Carlos Mendez/); assert.match(t, /Ana Silva/);
    await page.keyboard.press("Escape");
    await page.click("[data-filters] [name=native]"); await page.selectOption("[data-filters] [name=max]", "999");
    await page.click('[data-pill="SAT Prep"]'); assert.match(await text(page, "[data-dlg-body]"), /Emily Park/);
    await page.click('[data-dlg-body] [data-book="emily"]');
    await page.click("[data-book-form] [type=submit]"); assert.match(await text(page, "[data-err]"), /a time, your name, a valid email/);
    await page.click('[data-slot="2"]'); await page.fill("[data-book-form] [name=name]", "Jason W"); await page.fill("[data-book-form] [name=email]", "j@mail.example");
    await page.click("[data-book-form] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Your free lesson is booked![\s\S]*Emily Park/);
    await page.keyboard.press("Escape");
  });
  await check("trust stats + press; 3 steps with purple numbers and dotted line; 8 subject cards open filtered results", async () => {
    assert.match(await text(page, ".stats"), /12,000\+[\s\S]*150\+[\s\S]*50,000\+[\s\S]*4\.9\/5[\s\S]*1M\+/);
    assert.match(await text(page, ".press"), /EdSurge[\s\S]*TechCrunch[\s\S]*Forbes[\s\S]*Education Week/);
    assert.equal(await page.locator(".steps li").count(), 3);
    assert.equal(await css(page, ".n", "backgroundColor"), "rgb(124, 58, 237)");
    assert.equal(await page.$eval(".steps", (e) => getComputedStyle(e, "::before").borderTopStyle), "dotted");
    assert.equal(await page.locator(".subj").count(), 8);
    assert.match(await text(page, ".subj >> nth=3"), /Test Prep[\s\S]*SAT, ACT, GRE, GMAT, IELTS[\s\S]*1,500 tutors[\s\S]*From \$35\/hr/);
    await page.hover(".subj >> nth=0"); await page.waitForTimeout(300);
    assert.equal(await css(page, ".subj:nth-child(1)", "borderTopColor"), "rgb(196, 181, 253)");
    await page.click('[data-subj="Music"]'); assert.match(await text(page, "[data-dlg-body]"), /Music tutors[\s\S]*(Amelia Grant|Sofia Rossi)/); await page.keyboard.press("Escape");
    await page.click("[data-all-subjects]"); await page.click('[data-term="Mandarin"]'); assert.match(await text(page, "[data-dlg-body]"), /Mei Lin/); await page.keyboard.press("Escape");
  });
  await check("featured tutors: 4 brief tutors first, verified, ratings, online dots, carousel arrows, intro video", async () => {
    assert.deepEqual(await page.$$eval(".tutor h3", (h) => h.slice(0, 4).map((x) => x.textContent)), ["Dr. Sarah Chen", "Carlos Mendez", "Emily Park", "Raj Patel"]);
    assert.match(await text(page, ".tutor >> nth=0"), /PhD in Mathematics[\s\S]*Math & Statistics[\s\S]*4\.98[\s\S]*\(412 reviews\)[\s\S]*\$45\/hr[\s\S]*1,200\+ lessons taught/);
    assert.equal(await page.locator(".tutor >> nth=0").locator(".online").count(), 1);
    const x0 = await page.$eval("[data-tutors]", (e) => e.scrollLeft);
    await page.click("[data-next]"); await page.waitForTimeout(700);
    assert.ok(await page.$eval("[data-tutors]", (e) => e.scrollLeft) > x0);
    await page.click('[data-intro="carlos"]'); await page.waitForTimeout(900);
    assert.match(await text(page, "[data-cap]"), /Hola/); await page.keyboard.press("Escape");
    await page.click("[data-browse]"); assert.match(await text(page, "[data-dlg-body]"), /18 tutors/); await page.keyboard.press("Escape");
  });
  await check("alternating features with whiteboard demo and smart-match quiz; stories with results", async () => {
    assert.equal(await page.locator(".feat").count(), 3);
    const l = await page.$eval(".feat.rev .f-img", (e) => e.getBoundingClientRect().left), r = await page.$eval(".feat.rev .f-copy", (e) => e.getBoundingClientRect().left);
    assert.ok(l > r);
    await page.click("[data-demo]");
    const box = await page.locator("[data-board]").boundingBox();
    await page.mouse.move(box.x + 50, box.y + 100); await page.mouse.down(); await page.mouse.move(box.x + 200, box.y + 160, { steps: 6 }); await page.mouse.up();
    assert.equal(await page.getAttribute("[data-board]", "data-drawn"), "1");
    await page.keyboard.press("Escape");
    await page.click("[data-match]");
    for (const k of [0, 0, 0]) { await page.click(`.q-opts label >> nth=${k}`); await page.click("[data-qnext]"); }
    assert.match(await text(page, "[data-dlg-body]"), /Your top matches[\s\S]*Dr\. Sarah Chen[\s\S]*% match/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".story").count(), 3);
    assert.equal(await css(page, ".story", "borderLeftColor"), "rgb(124, 58, 237)");
    assert.match(await text(page, ".stories"), /\+200 points[\s\S]*F → A[\s\S]*Conversational fluency/);
  });
  await check("pricing ranges, free-lesson callout, bundle calculator, guarantee; tutors CTA apply; FAQ; final signup", async () => {
    assert.match(await text(page, "[data-ranges]"), /Languages\$20–\$50\/hr[\s\S]*Test Prep\$35–\$80\/hr[\s\S]*Programming\$30–\$70\/hr/);
    assert.match(await text(page, ".free"), /First Lesson Free/);
    assert.match(await text(page, "[data-calc-out]"), /10 lessons at \$40\/hr: \$400 → \$340 \(save \$60\)/);
    await page.selectOption("[data-calc-n]", "20"); assert.match(await text(page, "[data-calc-out]"), /\$800 → \$680/);
    assert.match(await text(page, ".guarantee"), /100% Satisfaction Guarantee/);
    assert.equal(await css(page, "#teach", "backgroundColor"), "rgb(245, 243, 255)");
    await page.click("#teach [data-apply]");
    await page.fill("[data-ap] [name=name]", "Lena K"); await page.fill("[data-ap] [name=email]", "lena@mail.example"); await page.fill("[data-ap] [name=rate]", "90");
    await page.click("[data-ap] [type=submit]"); assert.match(await text(page, "[data-err]"), /\$25 to \$80/);
    await page.fill("[data-ap] [name=rate]", "40"); await page.click("[data-ap] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Application received[\s\S]*\$2,400\/month/);
    await page.keyboard.press("Escape");
    await page.click("[data-faq] details:nth-child(2) summary"); await page.click("[data-faq] details:nth-child(5) summary"); await page.waitForTimeout(200);
    assert.deepEqual(await page.$$eval("[data-faq] details", (d) => d.map((x) => x.open)), [false, false, false, false, true]);
    assert.match(await css(page, ".final", "backgroundImage"), /rgb\(76, 29, 149\)[\s\S]*rgb\(124, 58, 237\)/);
    await page.click("[data-signup] [type=submit]"); assert.match(await text(page, "[data-su-msg]"), /valid email/);
    await page.fill("#su", "me@mail.example"); await page.click("[data-signup] [type=submit]");
    assert.equal(await page.inputValue("[data-su-form] [name=email]"), "me@mail.example");
    await page.click("[data-su-form] [type=submit]"); assert.match(await text(page, "[data-dlg-body]"), /Welcome to BrightMinds!/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".f-col").count(), 4);
    assert.equal(await page.locator(".socials a").count(), 5);
    assert.match(await text(page, ".f-bot"), /© 2026 BrightMinds Inc\. · Privacy · Terms · Accessibility/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: menu, stacked hero, full-width search + filters, 2-col subjects, scroll tutors, image-first features, sticky Find a Tutor bar, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-burger]"); assert.equal(await p.locator("[data-mnav]").isVisible(), true); await p.click("[data-burger]");
    assert.ok(await p.$eval(".hero-copy", (e) => e.getBoundingClientRect().top) < await p.$eval(".collage", (e) => e.getBoundingClientRect().top));
    assert.ok(await p.$eval(".search", (e) => e.getBoundingClientRect().width) >= 350);
    await p.click("[data-ftoggle]"); assert.equal(await p.locator("[data-filters]").isVisible(), true);
    assert.equal((await css(p, ".subjects", "gridTemplateColumns")).split(" ").length, 2);
    assert.ok(await p.$eval("[data-tutors]", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval(".feat.rev .f-img", (e) => e.getBoundingClientRect().top) < await p.$eval(".feat.rev .f-copy", (e) => e.getBoundingClientRect().top));
    assert.equal((await css(p, ".pricing", "gridTemplateColumns")).split(" ").length, 1);
    assert.doesNotMatch(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => document.querySelector("#subjects").scrollIntoView()); await p.waitForTimeout(400);
    assert.match(await p.getAttribute("[data-mbar]", "class"), /show/);
    await p.evaluate(() => scrollTo(0, 0));
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .pills button, .subj, .t-play, .socials a, .f-col a, .f-bot a, .apps a, select, input:not([type=checkbox])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
