// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/020-home-valuation-landing-page/Opus-5.5/page.test.mjs
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
async function open(viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  return { context, page };
}

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("sample report shows the spec'd values and comps", async () => {
    const t = await page.textContent("[data-sample]");
    assert.match(t, /742 Evergreen Terrace, Springfield[\s\S]*\$485,000 – \$520,000[\s\S]*Confidence: High/);
    assert.match(t, /738 Evergreen Terrace[\s\S]*\$498,000[\s\S]*801 Oak Avenue[\s\S]*\$512,000[\s\S]*655 Maple Drive[\s\S]*\$475,000/);
    assert.match(t, /6\.2%/);
  });
  await check("invalid address shows a validation message", async () => {
    await page.fill(".hero [data-addr]", "home");
    await page.click(".hero button[type=submit]");
    assert.match(await page.textContent(".hero [data-addr-err]"), /house number/);
  });
  await check("autocomplete supports keyboard selection and produces a high-confidence estimate", async () => {
    await page.fill(".hero [data-addr]", "");
    await page.type(".hero [data-addr]", "cedar");
    assert.ok(await page.locator(".hero [data-ac] [data-i]").count() > 0);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    const v = await page.inputValue(".hero [data-addr]");
    assert.match(v, /Cedar Lane, Oakwood, OR 97405/);
    await page.click(".hero button[type=submit]");
    await page.waitForSelector("[data-result] .report");
    const t = await page.textContent("[data-result]");
    assert.match(t, /Cedar Lane[\s\S]*Confidence: High/);
    const [lo, hi] = (t.match(/\$[\d,]+ – \$[\d,]+/)[0]).split(" – ").map((s) => +s.replace(/[$,]/g, ""));
    assert.ok(hi > lo && lo > 150000);
    assert.equal(await page.inputValue("[data-cma-addr]"), v);
  });
  await check("same address always yields the same estimate; unknown address is medium confidence", async () => {
    const first = await page.textContent("[data-result] .r-value");
    await page.click(".hero button[type=submit]");
    assert.equal(await page.textContent("[data-result] .r-value"), first);
    await page.fill(".hero [data-addr]", "99 Nowhere Road, Springfield, OR");
    await page.click(".hero button[type=submit]");
    assert.match(await page.textContent("[data-result]"), /Confidence: Medium[\s\S]*couldn't match/);
  });
  await check("bottom banner form works independently", async () => {
    await page.fill(".banner [data-addr]", "742 Evergreen Terrace, Springfield, OR 97477");
    await page.click(".banner button[type=submit]");
    assert.match(await page.textContent("[data-result] .r-prop"), /742 Evergreen Terrace/);
  });
  await check("market chart tooltip responds to keyboard", async () => {
    await page.focus("[data-chart] .hit");
    assert.match(await page.textContent("[data-ctip]"), /\$472,000.*Mar 2026/);
    await page.keyboard.press("ArrowLeft"); await page.keyboard.press("ArrowLeft");
    assert.match(await page.textContent("[data-ctip]"), /\$468,000.*Jan 2026/);
  });
  await check("FAQ keeps one answer open at a time", async () => {
    await page.click("#fq-0"); await page.click("#fq-2");
    assert.equal(await page.locator('.qa button[aria-expanded="true"]').count(), 1);
    assert.equal(await page.getAttribute("#fq-2", "aria-expanded"), "true");
  });
  await check("CMA form validates and confirms with prefilled address", async () => {
    const f = "[data-cma]";
    await page.click(`${f} [type=submit]`);
    assert.notEqual(await page.textContent("[data-cma-err]"), "");
    await page.fill(`${f} [name=name]`, "Lena Ford"); await page.fill(`${f} [name=email]`, "lena@example.com"); await page.fill(`${f} [name=phone]`, "(555) 220-1144");
    await page.selectOption(`${f} [name=when]`, "Just curious");
    await page.click(`${f} [type=submit]`);
    assert.match(await page.textContent("[data-cma-text]"), /Lena.*742 Evergreen Terrace.*no pressure/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, stacked address bar, vertical steps, 2x2 stats, floating CTA", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".hero .addr")).flexDirection), "column");
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".steps")).gridTemplateColumns.split(" ").length), 1);
    assert.equal(await m.page.evaluate(() => getComputedStyle(document.querySelector(".stats")).gridTemplateColumns.split(" ").length), 2);
    assert.equal(await m.page.evaluate(() => { const r = document.querySelector(".report-scroll"); return r.scrollWidth > r.clientWidth; }), true);
    await m.page.evaluate(() => document.querySelector("#market").scrollIntoView());
    await m.page.waitForTimeout(500);
    assert.equal(await m.page.locator("[data-float]:not(.away)").count(), 1);
    await m.page.click("[data-float]");
    await m.page.waitForTimeout(800);
    assert.equal(await m.page.evaluate(() => document.activeElement.matches(".hero [data-addr]")), true);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
