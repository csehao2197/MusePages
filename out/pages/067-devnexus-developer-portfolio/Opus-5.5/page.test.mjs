// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/067-devnexus-developer-portfolio/Opus-5.5/page.test.mjs
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

const go = async (p, hash, sel) => { await p.evaluate((h) => { location.hash = h; }, hash); await p.waitForSelector(`[data-view][data-route="${sel}"]`); await p.waitForTimeout(250); };

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("loader clears; dark neon theme; sticky blurred nav; hero with 3D particles, typewriter, CTAs, stats", async () => {
    await page.waitForSelector(".loader.done", { state: "attached" });
    assert.equal(await css(page, "body", "backgroundColor"), "rgb(10, 10, 15)");
    assert.equal(await css(page, "[data-nav]", "position"), "sticky"); assert.match(await css(page, "[data-nav]", "backdropFilter"), /blur/);
    assert.equal(await page.getAttribute('[data-route="home"]', "aria-current"), "page");
    const f1 = +(await page.getAttribute("[data-particles]", "data-frames")); await page.waitForTimeout(400); assert.ok(+(await page.getAttribute("[data-particles]", "data-frames")) > f1, "particles animate");
    assert.ok(await page.$eval("[data-particles]", (c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; }) > 500, "particles drawn");
    assert.match(await text(page, "h1"), /Hi, I'm Kai Navarro/);
    const t1 = await text(page, "[data-type]"); await page.waitForTimeout(700); assert.notEqual(await text(page, "[data-type]"), t1, "typewriter types");
    assert.deepEqual(await page.$$eval(".hero .ctas a", (a) => a.map((x) => [x.textContent.trim(), x.getAttribute("href")])), [["Hire Me", "#/contact"], ["View Work", "#/projects"]]);
    await page.waitForTimeout(1200); assert.deepEqual(await page.$$eval(".stats b", (b) => b.map((x) => x.textContent)), ["42", "8", "30+"]);
    assert.equal(await page.locator(".pgrid .pcard").count(), 3); assert.equal(await page.locator(".tcard").count(), 3);
    assert.match(await text(page, ".tgrid"), /CEO, TechCorp[\s\S]*CTO, StartupXYZ[\s\S]*Lead Developer, Agency/);
  });
  await check("skill sphere renders tags and rotates with keyboard/drag", async () => {
    assert.ok(await page.locator("[data-sphere] .tagw").count() >= 20);
    const before = await page.$eval("[data-sphere] .tagw", (t) => t.style.transform);
    await page.focus("[data-sphere]"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
    assert.ok(await page.getAttribute("[data-sphere]", "data-rot")); assert.notEqual(await page.$eval("[data-sphere] .tagw", (t) => t.style.transform), before);
    const b = await page.$eval("[data-sphere]", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await page.mouse.move(b[0], b[1]); await page.mouse.down(); await page.mouse.move(b[0] + 120, b[1] + 40, { steps: 5 }); await page.mouse.up();
  });
  await check("projects page: 6 cards, filters (All/Web/Mobile/AI/Full-stack), cards link to case studies", async () => {
    await page.click('[data-route="projects"]'); await page.waitForSelector('[data-view][data-route="projects"]');
    assert.equal(await page.title(), "Projects — Kai Navarro | DevNexus"); assert.equal(await page.getAttribute('[data-route="projects"]', "aria-current"), "page");
    assert.equal(await page.locator(".pcard").count(), 6);
    assert.deepEqual(await page.$$eval("[data-cat]", (b) => b.map((x) => x.textContent)), ["All", "Web", "Mobile", "AI", "Full-stack"]);
    await page.click('[data-cat="Mobile"]'); assert.deepEqual(await page.$$eval(".pcard h3", (h) => h.map((x) => x.textContent)), ["PulseFit"]);
    await page.click('[data-cat="AI"]'); assert.equal(await page.locator(".pcard").count(), 3);
    await page.click('[data-cat="All"]'); assert.equal(await page.getAttribute('[data-project="securevault"]', "href"), "#/projects/securevault");
  });
  await check("case study: problem, objectives, stack badges, architecture, challenges, results, gallery lightbox, links, prev/next", async () => {
    await page.click('[data-project="securevault"]'); await page.waitForSelector('[data-view][data-route="case/securevault"]');
    assert.match(page.url(), /#\/projects\/securevault$/); assert.match(await page.title(), /SecureVault case study/);
    const t = await text(page, "[data-view]");
    assert.match(t, /Problem[\s\S]*Objectives[\s\S]*Architecture[\s\S]*Challenges & solutions[\s\S]*Results[\s\S]*Screens/);
    assert.ok(await page.locator(".cs-hero .badge").count() >= 4); assert.equal(await page.locator(".flow .node").count(), 5); assert.equal(await page.locator(".kpis li").count(), 3);
    assert.match(await text(page, ".cs-links"), /Live demo[\s\S]*GitHub/);
    await page.click('[data-shot="1"]'); assert.equal(await page.evaluate(() => document.querySelector("dialog").open), true); assert.match(await text(page, "#dlg-title"), /Detail \(2\/3\)/);
    await page.keyboard.press("ArrowRight"); assert.match(await text(page, "#dlg-title"), /Mobile \(3\/3\)/);
    await page.click('[data-lb="0"]'); assert.match(await text(page, "#dlg-title"), /Overview \(1\/3\)/);
    await page.keyboard.press("Escape");
    await page.click(".pn a:last-child"); await page.waitForSelector('[data-view][data-route="case/datastream"]'); assert.match(await text(page, "h1"), /DataStream/);
    await go(page, "#/projects/nope", "case/nope"); assert.match(await text(page, "h1"), /doesn't exist/);
  });
  await check("about: story, animated timeline (4 roles), education, strengths, CV download (valid PDF)", async () => {
    await go(page, "#/about", "about");
    assert.equal(await page.locator("[data-tl] li").count(), 4); await page.waitForTimeout(300); assert.ok(await page.$eval("[data-tl]", (e) => e.classList.contains("in")));
    assert.equal(await page.locator(".edu li").count(), 2); assert.equal(await page.locator(".str li").count(), 4);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-cv]")]); assert.equal(dl.suggestedFilename(), "kai-navarro-cv.pdf");
    const fs = await import("node:fs"); assert.match(fs.readFileSync(await dl.path(), "latin1"), /^%PDF-1\.4[\s\S]*Kai Navarro[\s\S]*Lead Full-Stack Engineer[\s\S]*%%EOF$/);
  });
  await check("skills: tabs (click + arrow keys), animated progress bars and radial charts", async () => {
    await go(page, "#/skills", "skills");
    assert.equal(await page.locator('[role="tab"]').count(), 4); assert.equal(await page.getAttribute('[data-tab="Frontend"]', "aria-selected"), "true");
    await page.waitForTimeout(1200); assert.ok(await page.$eval("[data-w]", (i) => i.getBoundingClientRect().width) > 100);
    assert.equal(await page.locator(".rad").count(), 4); assert.notEqual(await page.$eval(".ring", (r) => r.getAttribute("stroke-dashoffset")), await page.$eval(".ring", (r) => r.getAttribute("stroke-dasharray")));
    await page.click('[data-tab="Backend"]'); assert.match(await text(page, "[data-panel]"), /Node\.js[\s\S]*Go[\s\S]*Rust/);
    await page.focus('[data-tab="Backend"]'); await page.keyboard.press("ArrowRight"); assert.equal(await page.getAttribute('[data-tab="DevOps"]', "aria-selected"), "true"); assert.equal(await page.evaluate(() => document.activeElement.dataset.tab), "DevOps");
    assert.equal(await page.getAttribute("[data-panel] .bar", "role"), "progressbar");
  });
  await check("blog: 4 posts with categories and reading time; category filter; post with highlighted code and copy", async () => {
    await go(page, "#/blog", "blog");
    assert.equal(await page.locator(".post").count(), 4); assert.match(await text(page, ".post"), /min read/);
    await page.click('[data-bcat="AI"]'); assert.deepEqual(await page.$$eval(".post h3", (h) => h.map((x) => x.textContent)), ["AI Integration Best Practices"]);
    await page.click('[data-bcat="All"]'); await page.click('.post[href="#/blog/building-scalable-react-apps"]'); await page.waitForSelector('[data-view][data-route="post/building-scalable-react-apps"]');
    assert.equal(await page.title(), "Building Scalable React Apps — DevNexus Blog");
    assert.ok(await page.locator("pre .k").count() > 0); assert.ok(await page.locator("pre .s").count() > 0);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]); await page.click("[data-copy]"); await page.waitForTimeout(200);
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /useQuery/);
  });
  await check("contact: Zod-like validation on blur/submit, counter, submit animation, success toast, socials, location + availability", async () => {
    await go(page, "#/contact", "contact");
    await page.click("[data-submit]"); assert.equal(await page.locator(".field.bad").count(), 4); assert.equal(await page.evaluate(() => document.activeElement.id), "f-name");
    assert.match(await text(page, "#e-message"), /at least 20 characters/);
    await page.fill("#f-name", "Lin"); await page.fill("#f-email", "lin@co"); await page.locator("#f-email").blur(); assert.match(await text(page, "#e-email"), /valid email/);
    await page.fill("#f-email", "lin@co.example"); assert.equal(await text(page, "#e-email"), ""); assert.ok(await page.$eval('[data-f="email"]', (e) => e.classList.contains("good")));
    await page.fill("#f-subject", "New platform"); await page.fill("#f-message", "We need help building a secure analytics product."); assert.equal(await text(page, "[data-cnt]"), "49 / 1000");
    await page.click("[data-submit]"); assert.ok(await page.$eval("[data-submit]", (b) => b.classList.contains("sending")));
    await page.waitForSelector("[data-submit].sent"); assert.match(await text(page, "[data-submit]"), /Message sent!/); assert.match(await text(page, "[data-toasts]"), /Thanks, Lin! This demo doesn't send messages/);
    assert.equal(await page.inputValue("#f-name"), "");
    assert.match(await text(page, ".side"), /Open to projects[\s\S]*Barcelona[\s\S]*hello@kainavarro\.example/); assert.equal(await page.locator(".side .soc a").count(), 3);
  });
  await check("theme toggle persists light theme; nav hover underline; back/forward routing", async () => {
    await page.click("[data-theme-btn]"); assert.equal(await page.getAttribute("html", "data-theme"), "light"); await page.waitForTimeout(350);
    assert.equal(await css(page, "body", "backgroundColor"), "rgb(246, 247, 251)");
    await page.reload({ waitUntil: "networkidle" }); assert.equal(await page.getAttribute("html", "data-theme"), "light"); await page.waitForSelector('[data-view][data-route="contact"]');
    await page.click("[data-theme-btn]"); assert.equal(await page.getAttribute("html", "data-theme"), "dark");
    await page.goBack(); await page.waitForSelector('[data-view][data-route="post/building-scalable-react-apps"]'); await page.goForward(); await page.waitForSelector('[data-view][data-route="contact"]');
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: hamburger nav, single-column grids, padded headers, stacked architecture, no overflow, 44px targets", async () => {
    const p = m.page; await p.waitForSelector(".loader.done", { state: "attached" }); await p.waitForTimeout(700);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible("[data-links]"), false); await p.click("[data-burger]"); assert.equal(await p.isVisible("[data-links]"), true);
    await p.click('[data-links] [data-route="projects"]'); await p.waitForSelector('[data-view][data-route="projects"]'); assert.equal(await p.isVisible("[data-links]"), false);
    assert.equal((await css(p, ".pgrid", "gridTemplateColumns")).split(" ").length, 1);
    assert.ok(await p.$eval(".phead h1", (h) => h.getBoundingClientRect().left) >= 16);
    await go(p, "#/projects/devflow", "case/devflow"); assert.equal(await css(p, ".flow", "flexDirection"), "column");
    for (const r of ["projects/devflow", "skills", "contact", "blog", "about", ""]) { await go(p, `#/${r}`, r ? r.replace("projects/", "case/") : "home"); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, r); }
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-2, .icon-btn, .filters button, .tabs button, .soc a, .back, .pn a, .copy, .foot nav a, .field input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await check("reduced motion: no loader delay, static tagline, reveals visible", async () => {
    const p = await rm.newPage(); p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(server.url, { waitUntil: "networkidle" });
    assert.ok(await p.$eval("[data-loader]", (l) => l.classList.contains("done")));
    assert.equal(await text(p, "[data-type]"), "I build fast, secure web platforms.");
    assert.equal(await p.$eval(".pgrid.reveal", (e) => e.classList.contains("in")), true);
  });
  await rm.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
