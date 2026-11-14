// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/070-personal-financial-planner/Opus-5.5/page.test.mjs
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

const go = async (p, tab) => { await p.click(`[data-tab="${tab}"]`); await p.waitForSelector(`[data-view][data-route="${tab}"]`); };
const $num = (s) => +String(s).replace(/[^0-9.\-−]/g, "").replace("−", "-");
const fs = await import("node:fs");

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("dashboard: balance, income, expenses, net, forecast chart, goal progress, top suggestions; balance edit flows into forecast", async () => {
    assert.equal(await page.inputValue("[data-bal]"), "4200");
    assert.equal(await text(page, "[data-k-inc]"), "$5,908"); assert.equal(await text(page, "[data-k-exp]"), "$4,419"); assert.equal(await text(page, "[data-k-net]"), "+$1,489");
    assert.equal(await page.locator(".mini-goal").count(), 3); assert.equal(await page.getAttribute(".mini-goal .meter", "aria-valuenow"), "35");
    assert.ok(await page.locator("[data-line] path.line").count() === 1); assert.ok((await page.locator(".sugs .sug").count()) >= 1);
    await go(page, "forecast"); const end1 = $num(await text(page, "[data-end]"));
    await go(page, "dashboard"); await page.fill("[data-bal]", "5200"); await page.press("[data-bal]", "Tab");
    await go(page, "forecast"); assert.ok(Math.abs($num(await text(page, "[data-end]")) - end1 - 1000) <= 1);
    await go(page, "dashboard"); await page.fill("[data-bal]", "4200"); await page.press("[data-bal]", "Tab");
  });
  await check("income CRUD with frequency conversion and validation", async () => {
    await go(page, "income"); assert.equal(await page.locator("[data-row]").count(), 2);
    await page.click('[data-new="income"]'); await page.click("[data-dlg] [type=submit]"); assert.ok(await page.locator("[data-dlg] [aria-invalid=true]").count() >= 2);
    await page.fill("[data-dlg] [name=name]", "Tutoring"); await page.fill("[data-dlg] [name=amount]", "100"); await page.selectOption("[data-dlg] [name=freq]", "weekly"); await page.click("[data-dlg] [type=submit]");
    assert.equal(await page.locator("[data-row]").count(), 3); assert.match(await text(page, "[data-row]:last-child"), /Tutoring[\s\S]*\$100\.00[\s\S]*Weekly[\s\S]*\$433\.33/); assert.equal(await text(page, "[data-total]"), "$6,341.67");
    await page.click('[data-row]:last-child [data-edit="income"]'); await page.fill("[data-dlg] [name=amount]", "150"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-row]:last-child"), /\$650\.00/);
    await page.click('[data-row]:last-child [data-del="income"]'); assert.match(await text(page, "[data-dlg]"), /Delete “Tutoring”/); await page.click("[data-dlg] .btn-d");
    assert.equal(await page.locator("[data-row]").count(), 2); assert.equal(await text(page, "[data-total]"), "$5,908.33");
  });
  await check("expenses: recurring vs one-time with due day/date, filter, category bar chart", async () => {
    await go(page, "expenses"); assert.equal(await page.locator("[data-row]").count(), 16);
    await page.click('[data-ef="once"]'); assert.equal(await page.locator("[data-row]").count(), 3);
    await page.click('[data-ef="all"]');
    assert.equal(await page.locator("[data-bars] [data-bar]").count(), 10); assert.match(await text(page, '[data-bars] [data-bar="0"]'), /Housing[\s\S]*\$1,650/);
    await page.click('[data-new="expense"]'); await page.check('[data-dlg] [name=type][value="once"]', { force: true }); assert.equal(await page.locator("[data-dlg] [name=date]").count(), 1);
    await page.fill("[data-dlg] [name=name]", "New laptop"); await page.fill("[data-dlg] [name=amount]", "1400"); await page.selectOption("[data-dlg] [name=category]", "Shopping"); await page.click("[data-dlg] [type=submit]");
    assert.equal(await page.locator("[data-row]").count(), 17); assert.match(await text(page, "[data-view]"), /New laptop/);
    await page.click('[data-new="expense"]'); await page.fill("[data-dlg] [name=name]", "Pet care"); await page.fill("[data-dlg] [name=amount]", "60"); await page.fill("[data-dlg] [name=day]", "40"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-dlg]"), /Day 1–31/);
    await page.fill("[data-dlg] [name=day]", "8"); await page.click("[data-dlg] [type=submit]"); assert.equal(await page.locator("[data-row]").count(), 18);
  });
  await check("goals: required monthly savings, add savings (moves from balance), validation", async () => {
    await go(page, "goals"); assert.equal(await page.locator(".goal").count(), 3); assert.match(await text(page, ".goal:nth-child(2) .need"), /Save \$\d[\d,]* per month/);
    await page.click(".goal:nth-child(2) [data-contrib]"); await page.fill("[data-dlg] [name=amt]", "300"); await page.click("[data-dlg] [type=submit]");
    assert.match(await text(page, ".goal:nth-child(2) .amt"), /\$1,500/); await go(page, "dashboard"); assert.equal(await page.inputValue("[data-bal]"), "3900");
    await go(page, "goals"); await page.click('[data-new="goal"]'); await page.fill("[data-dlg] [name=name]", "New bike"); await page.fill("[data-dlg] [name=target]", "800"); await page.fill("[data-dlg] [name=saved]", "900"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-dlg]"), /Can't exceed the target/);
    await page.fill("[data-dlg] [name=saved]", "200"); await page.click("[data-dlg] [type=submit]"); assert.equal(await page.locator(".goal").count(), 4); assert.match(await text(page, ".goal:last-child"), /New bike[\s\S]*25%/);
  });
  await check("forecast: 12 months, each row reconciles (prev + income − recurring − one-time − goals), keyboard tooltip, table view", async () => {
    await go(page, "forecast");
    await page.focus("[data-line] [data-hit]"); await page.keyboard.press("ArrowRight"); assert.equal(await page.isVisible("[data-line] [data-tip]"), true); assert.match(await text(page, "[data-line] [data-tip]"), /Income[\s\S]*Recurring[\s\S]*To goals[\s\S]*End balance/);
    await page.click("[data-fct]"); const rows = await page.$$eval("[data-fctable] tbody tr", (r) => r.map((x) => [...x.cells].map((c) => c.textContent)));
    assert.equal(rows.length, 12);
    let prev = +(await page.evaluate(() => JSON.parse(localStorage.getItem("planwise-plan")).balance));
    const n = (s) => (s.trim() === "–" ? 0 : +s.replace(/[^0-9.]/g, "") * (/[−-]/.test(s) ? -1 : 1));
    for (const r of rows) { const end = n(r[5]), calc = prev + n(r[1]) - n(r[2]) - n(r[3]) - n(r[4]); assert.ok(Math.abs(end - calc) <= 2, `row ${r[0]}: ${end} vs ${calc}`); prev = end; }
    assert.match(rows.map((r) => r[0]).join(" "), /New laptop/);
  });
  await check("suggestions react to the plan (shortfall → cuts/extend; removing a goal → surplus)", async () => {
    await go(page, "suggestions"); const t = await text(page, "[data-sugs]");
    assert.match(t, /month short of your goals/); assert.match(t, /Or move “/); assert.match(t, /Upcoming: Holiday gifts/);
    await go(page, "goals"); await page.click('.goal:has-text("House down payment") [data-del="goal"]'); await page.click("[data-dlg] .btn-d");
    await go(page, "suggestions"); const t2 = await text(page, "[data-sugs]"); assert.doesNotMatch(t2, /month short/); assert.match(t2, /left over each month/);
  });
  await check("save plan → JSON file; load it back after changes; invalid file rejected; CSV export; persistence across reload", async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-save]")]); assert.match(dl.suggestedFilename(), /^planwise-plan-\d{4}-\d{2}-\d{2}\.json$/);
    const saved = JSON.parse(fs.readFileSync(await dl.path(), "utf8")); assert.equal(saved.goals.length, 3); assert.equal(saved.income.length, 2); assert.equal(saved.expenses.length, 18);
    await page.click("[data-reset]"); await page.click('[data-r="empty"]'); await go(page, "income"); assert.match(await text(page, ".empty"), /No income yet/);
    await page.reload({ waitUntil: "networkidle" }); await page.waitForSelector("[data-view][data-route]"); await go(page, "income"); assert.match(await text(page, ".empty"), /No income yet/);
    await page.setInputFiles("[data-load]", { name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"hello":1}') }); await page.waitForSelector(".toast.err"); assert.match(await text(page, "[data-toasts]"), /isn't a valid Planwise plan/);
    await page.setInputFiles("[data-load]", await dl.path()); await page.waitForSelector("[data-dlg][open]"); assert.match(await text(page, "[data-dlg]"), /2 income sources, 18 expenses and 3 goals/); await page.click("[data-dlg] .btn-d");
    assert.equal(await page.locator("[data-row]").count(), 2);
    const [csv] = await Promise.all([page.waitForEvent("download"), page.click("[data-csv]")]); const c = fs.readFileSync(await csv.path(), "utf8");
    assert.match(c, /^section,name,amount/); assert.match(c, /income,Salary,2450,Every 2 weeks,,5308\.33/); assert.match(c, /"Utilities & internet"|Utilities & internet/); assert.match(c, /goal,Emergency fund,,,\d{4}-\d{2}-\d{2},,10000,3500/);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: top tab bar, no overflow on every tab, chart tap tooltip, 44px targets", async () => {
    const p = m.page; await p.waitForSelector("[data-view][data-route]");
    for (const t of ["dashboard", "income", "expenses", "goals", "forecast", "suggestions"]) { await go(p, t); assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390, t); }
    await go(p, "forecast"); await p.tap("[data-line] [data-hit]"); assert.equal(await p.isVisible("[data-line] [data-tip]"), true);
    await go(p, "income");
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .icon-btn, .tabs a, .filters button, .file .btn-o")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
