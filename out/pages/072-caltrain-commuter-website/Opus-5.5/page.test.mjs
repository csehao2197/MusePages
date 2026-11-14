// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/072-caltrain-commuter-website/Opus-5.5/page.test.mjs
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

const at = async (p, time, dow = 2) => { await p.goto(`${server.url}?at=${time}&dow=${dow}`, { waitUntil: "networkidle" }); await p.waitForSelector("[data-wx] .wx2, [data-wx] .wx-err, [data-perr]:not([hidden])"); };
const toMin = (s) => { const m = s.match(/(\d+):(\d\d) (AM|PM)/); return ((+m[1] % 12) + (m[3] === "PM" ? 12 : 0)) * 60 + +m[2]; };
const settle = (p) => p.waitForSelector('[data-trains-card][aria-busy="false"]').then(() => p.waitForSelector('[data-wx-card][aria-busy="false"]'));

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("32 stations in both selectors; SF → Palo Alto shows 5 next trains with times, duration, direction, type; next highlighted", async () => {
    await at(page, "07:40");
    assert.equal(await page.locator("[data-from] option").count(), 32); assert.equal(await page.locator("[data-to] option").count(), 32);
    assert.equal(await page.$eval("[data-from] option:first-child", (o) => o.textContent), "San Francisco (4th & King)"); assert.equal(await page.$eval("[data-to] option:last-child", (o) => o.textContent), "Gilroy");
    assert.equal(await page.locator("[data-trains] .tr").count(), 5); assert.equal(await page.locator(".tr.next").count(), 1); assert.ok(await page.$eval(".tr:first-child", (e) => e.classList.contains("next")));
    const deps = await page.$$eval(".tr .dep", (d) => d.map((x) => x.firstChild.textContent)); const mins = deps.map(toMin); assert.ok(mins.every((m, i) => !i || m >= mins[i - 1] - 6));
    for (const tr of await page.$$(".tr")) { const t = await tr.textContent(); assert.match(t, /Arrives Palo Alto \d+:\d\d (AM|PM)/); assert.match(t, /Southbound/); assert.match(t, /(Local|Limited|Express)/); assert.match(t, /Train \d{3}/); assert.match(t, /\d+ min\s*trip time/); }
    assert.match(await text(page, ".tr.next .dep small"), /^Next · in \d+/);
    assert.match(await text(page, "[data-clock]"), /7:40 AM/);
  });
  await check("express is faster than local; delays tie to the warning alert", async () => {
    const rows = await page.$$eval(".tr", (r) => r.map((x) => [x.querySelector(".tag").textContent, parseInt(x.querySelector(".dur").textContent)]));
    const loc = rows.find((r) => r[0] === "Local"), fast = rows.find((r) => r[0] !== "Local"); assert.ok(loc && fast && fast[1] < loc[1], JSON.stringify(rows));
    assert.match(await text(page, "[data-alerts]"), /warning[\s\S]*Southbound delays/i);
    assert.ok(await page.locator(".alert.warning").count() === 1);
  });
  await check("swap reverses to northbound; same station is rejected; Gilroy route only on trains serving the south end", async () => {
    await page.click("[data-swap]"); await settle(page); assert.match(await text(page, "[data-trip-sub]"), /Palo Alto → San Francisco \(4th & King\) · Northbound/);
    assert.match(await text(page, ".tr:first-child"), /Northbound/);
    await page.selectOption("[data-to]", "paloalto"); await page.waitForSelector("[data-perr]:not([hidden])"); assert.equal(await text(page, "[data-perr]"), "Choose two different stations."); assert.equal(await page.locator(".tr").count(), 0);
    await page.selectOption("[data-from]", "sf"); await page.selectOption("[data-to]", "gilroy"); await settle(page);
    const kinds = await page.$$eval(".tr .tag:first-child", (t) => t.map((x) => x.textContent)); assert.ok(kinds.every((k) => k === "Express"));
    assert.match(await text(page, ".tr:first-child .dep"), /4:37 PM/);
  });
  await check("weather: both stations with °F, description, icon, wind, humidity; difference callout; 3-hour destination forecast", async () => {
    await page.selectOption("[data-to]", "mountainview"); await settle(page);
    for (const w of ["[data-wx-o]", "[data-wx-d]"]) { const t = await text(page, w); assert.match(t, /\d+°F/); assert.match(t, /mph wind/); assert.match(t, /% humidity/); assert.ok(await page.locator(`${w} .now svg[aria-label]`).count()); }
    assert.match(await text(page, "[data-wx-o]"), /Origin[\s\S]*San Francisco/); assert.match(await text(page, "[data-wx-d]"), /Destination[\s\S]*Mountain View/);
    const o = parseInt(await text(page, "[data-wx-o] .temp")), d = parseInt(await text(page, "[data-wx-d] .temp"));
    assert.match(await text(page, "[data-diff]"), d - o >= 3 ? new RegExp(`${d - o}° warmer at Mountain View`) : /Similar|cooler/);
    assert.equal(await page.locator(".fc li").count(), 3); assert.match(await text(page, ".fc"), /Next 3 hours at Mountain View[\s\S]*8:00 AM[\s\S]*9:00 AM[\s\S]*10:00 AM/);
  });
  await check("weather outage: error with cached data and retry; trains unaffected; recovery", async () => {
    await page.check("[data-fail]"); await page.click("[data-refresh]"); await settle(page);
    assert.match(await text(page, ".wx-err"), /Weather is unavailable[\s\S]*Showing cached weather from 7:40 AM[\s\S]*Mountain View \d+°F/);
    assert.equal(await page.locator(".tr").count(), 5);
    await page.uncheck("[data-fail]"); await page.click("[data-retry]"); await settle(page); assert.equal(await page.locator(".wx2").count(), 1);
  });
  await check("saved routes: save with name, validation, quick load, edit, delete, max 5, persists", async () => {
    await page.click("[data-save]"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-ne]"), /Give your route a name/);
    await page.fill("[data-dlg] [name=name]", "Home to Work"); await page.click("[data-dlg] [type=submit]");
    assert.equal(await page.locator("[data-route-i]").count(), 1); assert.match(await text(page, "[data-route-i]"), /Home to Work\s*SF → MTV/); assert.ok(await page.$eval("[data-route-i]", (e) => e.classList.contains("on")));
    await page.selectOption("[data-from]", "sanmateo"); await page.selectOption("[data-to]", "sjdiridon"); await settle(page);
    await page.click("[data-save]"); await page.fill("[data-dlg] [name=name]", "home to work"); await page.click("[data-dlg] [type=submit]"); assert.match(await text(page, "[data-ne]"), /already have a route/);
    await page.fill("[data-dlg] [name=name]", "Gym"); await page.click("[data-dlg] [type=submit]"); assert.equal(await page.locator("[data-route-i]").count(), 2);
    await page.click('[data-route-i="0"] [data-use]'); await settle(page); assert.equal(await page.inputValue("[data-from]"), "sf"); assert.equal(await page.inputValue("[data-to]"), "mountainview");
    await page.click('[data-route-i="1"] [data-redit]'); await page.fill("[data-dlg] [name=name]", "Morning"); await page.check("[data-dlg] [name=use]"); await page.click("[data-dlg] [type=submit]");
    assert.match(await text(page, '[data-route-i="1"]'), /Morning\s*SF → MTV/);
    for (const n of ["A", "B", "C"]) { await page.click("[data-save]"); await page.fill("[data-dlg] [name=name]", n); await page.click("[data-dlg] [type=submit]"); }
    assert.equal(await page.locator("[data-route-i]").count(), 5); await page.click("[data-save]"); assert.match(await text(page, "[data-toast]"), /up to 5 routes/);
    await page.click('[data-route-i="4"] [data-rdel]'); assert.equal(await page.locator("[data-route-i]").count(), 4);
    await at(page, "07:40"); assert.equal(await page.locator("[data-route-i]").count(), 4); assert.equal(await page.inputValue("[data-to]"), "mountainview");
  });
  await check("alerts: dismiss info (persists), weekend schedule (hourly locals only), late-night shows tomorrow's trains", async () => {
    await page.click('[data-dismiss="bikes"]'); assert.equal(await page.locator('[data-alert="bikes"]').count(), 0); await at(page, "07:40"); assert.equal(await page.locator('[data-alert="bikes"]').count(), 0);
    await at(page, "10:00", 6); assert.match(await text(page, "[data-alerts]"), /Weekend schedule in effect/); assert.equal(await page.locator(".alert.warning").count(), 0);
    const kinds = await page.$$eval(".tr .tag:first-child", (t) => t.map((x) => x.textContent)); assert.ok(kinds.every((k) => k === "Local"));
    const mins = (await page.$$eval(".tr .dep", (d) => d.map((x) => x.firstChild.textContent))).map(toMin); assert.equal(mins[1] - mins[0], 60);
    await at(page, "23:55", 2); assert.match(await text(page, "[data-trains]"), /Tomorrow/);
  });
  await context.close();

  const cctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await check("auto-refresh every 60 s updates the clock and train countdowns", async () => {
    const p = await cctx.newPage(); p.on("pageerror", (e) => errors.push(e.message));
    await p.clock.install(); await at(p, "08:10");
    const before = await text(p, ".tr.next .dep small"); assert.match(await text(p, "[data-updated]"), /8:10 AM/);
    await p.clock.fastForward("01:01"); await p.waitForTimeout(200);
    assert.match(await text(p, "[data-updated]"), /8:11 AM/); assert.match(await text(p, "[data-clock]"), /8:11 AM/); assert.notEqual(await text(p, ".tr.next .dep small"), before);
  });
  await cctx.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked layout, no overflow, weather stacked, 44px targets", async () => {
    const p = m.page; await at(p, "07:40");
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal((await css(p, ".wx2", "gridTemplateColumns")).split(" ").length, 1);
    const small = await p.evaluate(() => [...document.querySelectorAll("button, select, .sim")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
