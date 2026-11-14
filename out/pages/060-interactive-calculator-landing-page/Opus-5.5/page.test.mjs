// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/060-interactive-calculator-landing-page/Opus-5.5/page.test.mjs
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
const money = (s) => Number(String(s).replace(/[^\d.-]/g, "").replace("−", "-"));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("hero headline, subheadline, trust and time indicators", async () => {
    assert.equal(await text(page, "h1"), "Calculate Your Potential Savings");
    assert.match(await text(page, ".sub"), /how much time and money you could save with Ledgerly/);
    assert.match(await text(page, ".trust"), /Used by 10,000\+ companies[\s\S]*Takes less than 2 minutes/);
  });
  await check("3-step wizard with progress bar, size slider, tooltips, validation; live preview matches model", async () => {
    assert.equal(await page.getAttribute("[data-pbar]", "aria-valuenow"), "33");
    assert.equal(await text(page, "[data-size-out]"), "51–200 employees");
    await page.fill("[data-size]", "4"); assert.equal(await text(page, "[data-size-out]"), "500+ employees");
    await page.fill("[data-size]", "2");
    assert.equal(await page.locator("[data-ind] option").count(), 8);
    await page.click("[data-next]"); assert.equal(await page.getAttribute("[data-pbar]", "aria-valuenow"), "67");
    await page.hover('[data-tip]'); assert.equal(await page.isVisible("[data-tipbox]"), true); assert.match(await text(page, "[data-tipbox]"), /Data entry/);
    await page.mouse.move(5, 300);
    await page.fill('[data-in="rate"]', "3"); await page.click("[data-next]"); assert.match(await text(page, "[data-err]"), /average hourly rate/i);
    await page.fill('[data-in="rate"]', "45");
    await page.fill('[data-in="hours"]', "40"); await page.fill('[data-in="tools"]', "800");
    await page.click("[data-inc]"); assert.equal(await page.inputValue('[data-in="team"]'), "5"); await page.click("[data-dec]");
    await page.waitForTimeout(600);
    // model: labor 40*52*45=93,600; tools 9,600; save .7*93,600 + .6*9,600 + .04*93,600 - 9,600 = 65,424
    assert.equal(await text(page, "[data-pv-savings]"), "$65,424");
    assert.equal(await text(page, "[data-pv-hours]"), "1,456");
    await page.fill('[data-in="hours"]', "80"); await page.waitForTimeout(600);
    assert.equal(await text(page, "[data-pv-savings]"), "$134,688");
    await page.fill('[data-in="hours"]', "40"); await page.waitForTimeout(600);
    await page.click("[data-next]"); assert.equal(await page.getAttribute("[data-pbar]", "aria-valuenow"), "100");
    assert.match(await text(page, "[data-next]"), /See my results/);
    await page.check('[data-goals] input[value="accuracy"]', { force: true });
  });
  await check("results: summary card, breakdown math, charts, recommendations, story and social proof", async () => {
    await page.click("[data-next]"); await page.waitForTimeout(700);
    assert.equal(await page.isVisible("[data-results]"), true);
    assert.equal(await text(page, "[data-r-savings]"), "$65,424/year");
    assert.equal(await text(page, "[data-r-hours]"), "1,456");
    assert.equal(await text(page, "[data-r-roi]"), "682%");
    assert.equal(await text(page, "[data-r-current]"), "$103,200");
    assert.equal(await text(page, "[data-r-projected]"), "$37,776");
    assert.equal(await text(page, "[data-r-net]"), "$65,424");
    assert.equal(await text(page, "[data-r-payback2]"), "1.5 months");
    assert.equal(money(await text(page, "[data-r-current]")) - money(await text(page, "[data-r-projected]")), money(await text(page, "[data-r-net]")));
    assert.equal(await page.locator("[data-bars] rect").count(), 4);
    assert.equal(await page.locator("[data-pie] circle").count(), 4);
    assert.match(await text(page, "[data-timeline]"), /Break-even · 1\.5 months/);
    assert.match(await text(page, "[data-plan]"), /51–200[\s\S]*Growth plan[\s\S]*\$800/);
    assert.equal(await page.locator("[data-features] li").count(), 3);
    assert.match(await text(page, "[data-features]"), /AI invoice capture[\s\S]*Duplicate detection/);
    assert.match(await text(page, "[data-avg-proof]"), /save an average of \$61,000/);
    assert.equal(await page.locator(".logos li").count(), 6);
  });
  await check("results gate: blurred preview, work-email validation, unlock reveals comparison + line items; PDF download only after unlock", async () => {
    assert.equal(await page.isHidden("[data-full]"), true);
    await page.click("[data-pdf]"); assert.match(await text(page, "[data-toast]"), /unlock the PDF/);
    await page.click("[data-lead] [type=submit]"); assert.match(await text(page, "[data-lead-err]"), /work email/);
    await page.fill("[data-lead] [name=email]", "me@gmail.com"); await page.click("[data-lead] [type=submit]"); assert.match(await text(page, "[data-lead-err]"), /use your work email/);
    await page.fill("[data-lead] [name=email]", "cfo@acme.example"); await page.click("[data-lead] [type=submit]");
    assert.equal(await page.isVisible("[data-full]"), true); assert.equal(await page.isHidden("[data-gate]"), true);
    assert.match(await text(page, "[data-compare]"), /You today10\.0 hrs[\s\S]*Manufacturing average9\.5 hrs[\s\S]*Top performers3\.3 hrs[\s\S]*You with Ledgerly3\.0 hrs/);
    assert.match(await text(page, "[data-lines]"), /Labor cost savings[\s\S]*\$65,520[\s\S]*Tool consolidation[\s\S]*\$5,760[\s\S]*Error reduction[\s\S]*\$3,744[\s\S]*Ledgerly subscription[\s\S]*−\$9,600[\s\S]*Net annual savings\$65,424/);
    const fs = await import("node:fs/promises");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-pdf]")]);
    assert.equal(dl.suggestedFilename(), "ledgerly-savings-report.pdf");
    const pdf = await fs.readFile(await dl.path(), "latin1");
    assert.match(pdf, /^%PDF-1\.4/); assert.match(pdf, /Net annual savings: \$65,424/); assert.match(pdf, /%%EOF$/);
    const xref = Number(pdf.match(/startxref\n(\d+)/)[1]); assert.equal(pdf.slice(xref, xref + 4), "xref");
  });
  await check("next steps: trial, demo booking, share link reproduces results; methodology, FAQ, ROI guide, save", async () => {
    await page.click("[data-trial]"); assert.equal(await page.inputValue("[data-tf] [name=email]"), "cfo@acme.example"); await page.keyboard.press("Escape");
    await page.click("[data-demo]"); await page.click("[data-df] [type=submit]"); assert.match(await text(page, "[data-dferr]"), /Pick a time/);
    await page.click('[data-slot="1"]'); await page.click("[data-df] [type=submit]"); assert.match(await text(page, "[data-dlg-body]"), /Demo booked/); await page.keyboard.press("Escape");
    await page.click("[data-share]"); const url = await page.inputValue("[data-share-url]"); assert.match(url, /hours=40&rate=45&tools=800&team=4/); await page.keyboard.press("Escape");
    assert.ok(await page.locator("[data-assume] li").count() >= 4);
    assert.match(await text(page, ".disc"), /Your results may vary/);
    await page.click('[data-case="1"]'); assert.match(await text(page, "[data-dlg-body]"), /Brightwave/); await page.keyboard.press("Escape");
    await page.click("[data-faq] details:nth-child(3) summary"); assert.match(await text(page, "[data-faq] details:nth-child(3) p"), /in your browser/);
    await page.click("[data-guide] [type=submit]"); assert.match(await text(page, "[data-g-msg]"), /valid email/);
    await page.fill("#g-email", "me@acme.example"); await page.click("[data-guide] [type=submit]"); assert.match(await text(page, "[data-g-msg]"), /ROI Guide/);
    await page.click("[data-save]"); assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ledgerly-calc")).hours), 40);
    const p2 = await context.newPage(); await p2.goto(url.replace(/hours=40/, "hours=60"), { waitUntil: "networkidle" });
    assert.equal(await p2.isVisible("[data-results]"), true); await p2.waitForTimeout(700);
    assert.equal(await p2.textContent("[data-r-net]"), "$100,056");
    await p2.close();
  });
  await check("exit intent appears once after engagement and offers email capture", async () => {
    const p3 = await context.newPage(); await p3.goto(server.url, { waitUntil: "networkidle" });
    await p3.evaluate(() => localStorage.removeItem("ledgerly-calc"));
    await p3.reload({ waitUntil: "networkidle" });
    await p3.dispatchEvent("body", "mouseout", { clientY: -5 }); assert.equal(await p3.locator("[data-dlg][open]").count(), 0);
    await p3.click("[data-next]");
    await p3.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { clientY: -5, relatedTarget: null, bubbles: true })));
    assert.match(await p3.textContent("[data-dlg-body]"), /Wait! Don't lose your results/);
    await p3.click("[data-xf] [type=submit]"); assert.match(await p3.textContent("[data-xferr]"), /valid email/);
    await p3.fill("[data-xf] [name=email]", "me@acme.example"); await p3.click("[data-xf] [type=submit]"); assert.match(await p3.textContent("[data-dlg-body]"), /Sent!/);
    await p3.keyboard.press("Escape");
    await p3.evaluate(() => document.dispatchEvent(new MouseEvent("mouseout", { clientY: -5, relatedTarget: null, bubbles: true })));
    assert.equal(await p3.locator("[data-dlg][open]").count(), 0);
    await p3.close();
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: large inputs, stacked layout, sticky savings bar while scrolling, results flow, 44px targets", async () => {
    const p = m.page;
    await p.evaluate(() => localStorage.removeItem("ledgerly-calc")); await p.reload({ waitUntil: "networkidle" });
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".calc", "gridTemplateColumns")).split(" ").length, 1);
    await p.click("[data-next]");
    assert.ok(await p.$eval('[data-in="hours"]', (e) => e.getBoundingClientRect().height) >= 56);
    await p.evaluate(() => scrollTo(0, document.querySelector(".preview").getBoundingClientRect().bottom + scrollY + 200)); await p.waitForTimeout(300);
    assert.equal(await p.isVisible("[data-mbar]"), true);
    assert.match(await p.textContent("[data-mb-savings]"), /^\$[\d,]+\/yr$/);
    await p.evaluate(() => scrollTo(0, 0));
    await p.click("[data-next]"); await p.click("[data-next]"); await p.waitForTimeout(600);
    assert.equal(await p.isVisible("[data-results]"), true);
    assert.equal((await css(p, ".sum-card", "gridTemplateColumns")).split(" ").length, 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-g, .link, .stepper button, .goals span, .faq summary, select, input:not([type=checkbox]):not([type=range])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim().slice(0, 30) || b.getAttribute("aria-label") || b.name));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
