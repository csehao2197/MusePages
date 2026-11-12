// Browser checks for the static portfolio. Run from the repo root:
//   node out/pages/027-graphic-designer-portfolio/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const outDir = path.join(here, "out");
const { chromium } = await import(pathToFileURL(path.join(root, "node_modules/playwright/index.mjs")).href);
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/generate-preview.mjs")).href);
const server = await startPreviewServer(outDir, { workspace: root });
const base = server.url.replace(/index\.html$/, "");
const browser = await chromium.launch();
const errors = [], results = [];
const check = async (name, fn) => { await fn(); results.push(`ok - ${name}`); };
async function open(viewport, rel = "", opts = {}) {
  const context = await browser.newContext({ viewport, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, reducedMotion: opts.reduce ? "reduce" : "no-preference" });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/ERR_INTERNET_DISCONNECTED/.test(m.text())) errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(base + rel, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); // avoid clicks racing smooth scrolling in automation
  return { context, page };
}
const text = (p, s) => p.textContent(s);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("homepage SEO: unique title, description, canonical, OG image, JSON-LD Person + ProfessionalService", async () => {
    assert.match(await page.title(), /^Iris Calder — Brand identity & packaging designer/);
    assert.match(await page.getAttribute('meta[name="description"]', "content"), /brand identity/i);
    assert.equal(await page.getAttribute('link[rel="canonical"]', "href"), "https://www.iriscalder.example/");
    assert.match(await page.getAttribute('meta[property="og:image"]', "content"), /assets\/og\/home\.png$/);
    const ld = JSON.parse(await page.textContent('script[type="application/ld+json"]'));
    assert.deepEqual(ld["@graph"].map((x) => x["@type"]).slice(0, 2), ["Person", "ProfessionalService"]);
    assert.match(await text(page, ".sample"), /Sample portfolio/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main, header, footer, nav").count() >= 4, true);
  });
  await check("hero: CTAs, availability with timezone, rotating featured pair with pause", async () => {
    assert.equal(await page.getAttribute(".ctas a:first-child", "href"), "#work");
    assert.match(await text(page, ".hero .avail"), /Booking new projects[\s\S]*Lisbon, Portugal[\s\S]*UTC\+0/);
    await page.click('[data-goto="1"]');
    assert.equal(await page.evaluate(() => MuseHero.index()), 1);
    assert.match(await text(page, ".hero-slide.on figcaption"), /Lumen Film Festival 2026/);
    assert.equal(await page.getAttribute("[data-hero-pause]", "aria-label"), "Resume rotation");
  });
  await check("selected work: 8 cards in source order, each with name, client, discipline, year, summary and sized lazy image", async () => {
    const cards = page.locator("[data-grid] > li");
    assert.equal(await cards.count(), 8);
    const info = await cards.evaluateAll((ls) => ls.map((li) => { const img = li.querySelector("img"); return { h: li.querySelector("h3").textContent, meta: li.querySelector(".pc-meta").textContent, sum: li.querySelector(".pc-sum").textContent.length, alt: img.alt.length, w: img.getAttribute("width"), hgt: img.getAttribute("height"), lazy: img.loading }; }));
    info.forEach((c) => { assert.match(c.meta, /20\d\d/); assert.ok(c.sum > 30 && c.alt > 30 && c.w && c.hgt); assert.equal(c.lazy, "lazy"); });
    assert.equal(info[0].h, "Saltmarsh Oyster Co.");
    assert.equal(await page.locator("[data-grid] a.pc-link").count(), 3);
    assert.match(await text(page, '[data-grid] li:last-child'), /Self-initiated[\s\S]*Case study in preparation/);
  });
  await check("filters are buttons with pressed state, keep order and announce results", async () => {
    await page.focus('[data-filter="packaging"]'); await page.keyboard.press("Enter");
    assert.equal(await page.getAttribute('[data-filter="packaging"]', "aria-pressed"), "true");
    assert.deepEqual(await page.locator("[data-grid] > li:not([hidden]) h3").allTextContents(), ["Saltmarsh Oyster Co.", "Tide & Timber Bakery", "Verdant Gin"]);
    assert.equal(await text(page, "[data-filter-status]"), "Showing 3 projects in Packaging");
    await page.click('[data-filter="all"]');
    assert.equal(await page.locator("[data-grid] > li:not([hidden])").count(), 8);
  });
  await check("services, process, about and labelled placeholders (no invented praise or results)", async () => {
    assert.equal(await page.locator(".svc").count(), 4);
    assert.match(await text(page, ".services"), /Ideal fit[\s\S]*Typical deliverables[\s\S]*Engagement/);
    assert.match(await text(page, "#services .note"), /no fixed prices/);
    assert.match(await text(page, ".quote.placeholder"), /Testimonial placeholder/);
    assert.equal(await page.locator(".process > li").count(), 4);
    assert.match(await text(page, ".process"), /Discover[\s\S]*Define[\s\S]*Design[\s\S]*Two included revision rounds[\s\S]*Deliver/);
    assert.match(await page.getAttribute(".portrait img", "alt"), /portrait of Iris Calder/i);
    const pdfHref = await page.getAttribute('a[download]', "href");
    const pdf = (await readFile(path.join(outDir, pdfHref))).toString("latin1");
    assert.equal(pdf.slice(+pdf.match(/startxref\n(\d+)/)[1]).slice(0, 4), "xref");
  });
  await check("inquiry form: inline + summary validation, loading, success", async () => {
    await page.click('[data-service="Packaging design"]');
    assert.equal(await page.inputValue("#f-type"), "Packaging");
    await page.click("[data-submit]");
    assert.equal(await page.locator("[data-err-summary]").isVisible(), true);
    assert.match(await text(page, "[data-err-summary]"), /Please fix 4 fields/);
    assert.equal(await page.getAttribute("#f-name", "aria-invalid"), "true");
    assert.match(await text(page, "#e-email"), /email address/);
    await page.fill("#f-name", "Joana Silva"); await page.fill("#f-email", "joana@cafe.example"); await page.fill("#f-site", "cafe.example");
    await page.fill("#f-summary", "A new identity and packaging range for our roastery's retail coffee bags this spring.");
    await page.$eval("#f-consent", (el) => { if (!el.checked) el.click(); });
    await page.click("[data-submit]");
    assert.match(await text(page, "[data-err-summary]"), /full web address/);
    await page.fill("#f-site", "https://cafe.example");
    await page.click("[data-submit]");
    assert.equal(await page.getAttribute("[data-submit]", "aria-busy"), "true");
    await page.waitForSelector("[data-ok]:not([hidden])");
    assert.match(await text(page, "[data-ok-text]"), /Thanks, Joana[\s\S]*packaging project[\s\S]*nothing was actually sent/);
  });
  await check("inquiry error state when offline keeps answers and offers retry", async () => {
    const { context: c2, page: p2 } = await open({ width: 1280, height: 900 }, "?type=Campaign#contact");
    assert.equal(await p2.inputValue("#f-type"), "Campaign");
    await p2.fill("#f-name", "Sam Lee"); await p2.fill("#f-email", "sam@fest.example"); await p2.fill("#f-summary", "Key visual and templates for a three-day music festival in late spring.");
    await p2.$eval("#f-consent", (el) => { if (!el.checked) el.click(); });
    await c2.setOffline(true);
    await p2.click("[data-submit]");
    await p2.waitForSelector("[data-bad]:not([hidden])");
    assert.equal(await p2.inputValue("#f-name"), "Sam Lee");
    await c2.setOffline(false);
    await p2.click("[data-retry]");
    await p2.waitForSelector("[data-ok]:not([hidden])");
    await c2.close();
  });
  await check("accent colour is configurable and persists", async () => {
    await page.click('[data-accent="#2747A6"]');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()), "#2747A6");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.getAttribute('[data-accent="#2747A6"]', "aria-pressed"), "true");
    await page.click('[data-accent="#C2502F"]');
  });
  await context.close();

  const cs = await open({ width: 1440, height: 900 }, "work/saltmarsh-oyster-co/");
  await check("case study page: clean URL, own SEO, facts, system, applications, process, outcome placeholder, next + CTA", async () => {
    const p = cs.page;
    assert.match(await p.title(), /^Saltmarsh Oyster Co\. — Brand Identity case study/);
    assert.equal(await p.getAttribute('link[rel="canonical"]', "href"), "https://www.iriscalder.example/work/saltmarsh-oyster-co/");
    assert.equal(JSON.parse(await p.textContent('script[type="application/ld+json"]'))["@graph"][0]["@type"], "CreativeWork");
    assert.match(await text(p, ".facts"), /Client[\s\S]*Industry[\s\S]*Year[\s\S]*Role[\s\S]*Collaborators[\s\S]*Deliverables/);
    assert.match(await text(p, ".cs-body"), /The challenge[\s\S]*Audience & constraints[\s\S]*Creative direction[\s\S]*Key decisions[\s\S]*The system[\s\S]*Applications[\s\S]*Process material[\s\S]*Outcome/);
    assert.equal(await p.locator(".swatches li").count(), 4);
    assert.equal(await p.locator(".seq-item").count(), 6);
    assert.match(await text(p, ".seq-item.rejected figcaption"), /lighthouse/);
    assert.match(await text(p, ".phx.block"), /^Placeholder: .*No results are claimed/);
    assert.match(await text(p, ".quote.placeholder"), /Testimonial placeholder/);
    assert.equal(await p.getAttribute(".cs-cta a", "href"), "../../index.html?type=Brand%20Identity#contact");
    await p.click(".cs-next .nx");
    await p.waitForURL(/work\/lumen-film-festival\/$/);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
    await p.waitForFunction(() => [...document.images].every((i) => i.complete));
    assert.deepEqual(await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).length), 0);
  });
  await cs.context.close();

  await check("checklist, sitemap and robots", async () => {
    const { context: c, page: p } = await open({ width: 1280, height: 900 }, "checklist/");
    const n = await p.locator("[data-cl]").count();
    assert.ok(n > 60);
    await p.check("#c0"); await p.reload({ waitUntil: "networkidle" });
    assert.equal(await p.isChecked("#c0"), true);
    assert.equal(await text(p, "[data-progress]"), `1 of ${n} items ready`);
    assert.match(await text(p, ".checklist"), /Production domain[\s\S]*Lead image[\s\S]*Outcome or measurable result[\s\S]*Client testimonial/);
    await c.close();
    const sm = await readFile(path.join(outDir, "sitemap.xml"), "utf8");
    assert.equal((sm.match(/<loc>/g) || []).length, 4);
    assert.match(sm, /<loc>https:\/\/www\.iriscalder\.example\/work\/field-notes-quarterly\/<\/loc>/);
    assert.match(await readFile(path.join(outDir, "robots.txt"), "utf8"), /Sitemap: https:\/\/www\.iriscalder\.example\/sitemap\.xml/);
  });

  const m = await open({ width: 390, height: 844 }, "", { mobile: true, reduce: true });
  await check("mobile + reduced motion: no overflow, 44px targets, menu, single-column order, art-directed hero crop, no rotation", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".hdr .cta").isVisible(), false);
    await p.click("[data-menu-btn]");
    assert.equal(await p.locator("[data-menu]").isVisible(), true);
    await p.keyboard.press("Escape");
    assert.equal(await p.locator("[data-menu]").isVisible(), false);
    const small = await p.evaluate(() => [...document.querySelectorAll("a.btn, button, .filters button, .nav a, .menu-btn")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim()));
    assert.deepEqual(small, []);
    assert.match(await p.evaluate(() => document.querySelector(".hero-slide.on img").currentSrc), /saltmarsh-oyster-co-crop\.svg$/);
    const tops = await p.locator("[data-grid] > li").evaluateAll((ls) => ls.map((l) => l.getBoundingClientRect().top));
    assert.deepEqual([...tops].sort((a, b) => a - b), tops);
    assert.equal(await p.getAttribute("[data-hero-pause]", "aria-label"), "Resume rotation");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
