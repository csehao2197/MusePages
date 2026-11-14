// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/075-collaborative-design-canvas/Opus-5.5/page.test.mjs
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
  const d = await open({ width: 1440, height: 900 });
  const p = d.page;
  const count = () => p.evaluate(() => window.__cc.doc.order.length);
  const center = async (id) => p.evaluate((i) => { const s = window.__cc.doc.shapes[i], r = document.querySelector("[data-stage]").getBoundingClientRect(), q = window.__cc.toScreen(s.x + s.w / 2, s.y + s.h / 2); return { x: r.left + q.x, y: r.top + q.y }; }, id);
  await check("seed canvas, presence and simulated teammate render", async () => {
    assert.equal(await count(), 8);
    assert.equal(await p.locator("[data-world] .shape").count(), 8);
    assert.match(await text(p, "[data-pcount]"), /2 online/);
    await p.waitForSelector("[data-cursor='bot']");
    assert.match(await p.title(), /CollabCanvas/);
  });
  await p.evaluate(() => window.__cc.setBot(false));
  await check("draw rectangle with the R tool, undo and redo", async () => {
    await p.click("[data-stage]", { position: { x: 900, y: 600 } });
    await p.keyboard.press("r");
    assert.equal(await p.getAttribute("[data-tool=rect]", "aria-pressed"), "true");
    await p.mouse.move(800, 600); await p.mouse.down(); await p.mouse.move(900, 680, { steps: 5 }); await p.mouse.up();
    assert.equal(await count(), 9);
    const id = await p.evaluate(() => window.__cc.sel[0]);
    const s = await p.evaluate((i) => window.__cc.doc.shapes[i], id);
    assert.equal(s.type, "rect"); assert.ok(s.w >= 95 && s.h >= 75);
    await p.keyboard.press("Control+z"); assert.equal(await count(), 8);
    await p.keyboard.press("Control+y"); assert.equal(await count(), 9);
    const c = await center(id); await p.mouse.click(c.x, c.y);
    assert.deepEqual(await p.evaluate(() => window.__cc.sel), [id]);
  });
  await check("move by drag, nudge with arrows, resize via handle", async () => {
    const id = await p.evaluate(() => window.__cc.sel[0]);
    const before = await p.evaluate((i) => ({ ...window.__cc.doc.shapes[i] }), id);
    const c = await center(id);
    await p.mouse.move(c.x, c.y); await p.mouse.down(); await p.mouse.move(c.x + 40, c.y + 20, { steps: 5 }); await p.mouse.up();
    let s = await p.evaluate((i) => window.__cc.doc.shapes[i], id);
    assert.equal(s.x - before.x, 40); assert.equal(s.y - before.y, 20);
    await p.keyboard.press("Shift+ArrowRight");
    s = await p.evaluate((i) => window.__cc.doc.shapes[i], id); assert.equal(s.x - before.x, 50);
    await p.waitForTimeout(50);
    const h = await p.$eval("[data-h=se]", (e) => { const r = e.getBoundingClientRect(); return { x: r.left + 5, y: r.top + 5 }; });
    await p.mouse.move(h.x, h.y); await p.mouse.down(); await p.mouse.move(h.x + 30, h.y + 30, { steps: 5 }); await p.mouse.up();
    s = await p.evaluate((i) => window.__cc.doc.shapes[i], id);
    assert.ok(Math.abs(s.w - before.w - 30) <= 1 && Math.abs(s.h - before.h - 30) <= 1, JSON.stringify([s, before]));
  });
  await check("properties panel edits rotation and fill", async () => {
    const id = await p.evaluate(() => window.__cc.sel[0]);
    await p.fill("[data-prop=rot]", "30"); await p.press("[data-prop=rot]", "Enter");
    assert.equal(await p.evaluate((i) => window.__cc.doc.shapes[i].rot, id), 30);
    await p.click("[data-swatch=fill][data-c='#EF4444']");
    await p.waitForTimeout(100);
    assert.equal(await p.getAttribute(`[data-world] [data-id="${id}"]`, "fill"), "#EF4444");
  });
  await check("duplicate, delete, select all, group and ungroup", async () => {
    await p.focus("[data-stage]");
    await p.keyboard.press("Control+d"); assert.equal(await count(), 10);
    await p.keyboard.press("Delete"); assert.equal(await count(), 9);
    await p.keyboard.press("Control+a");
    assert.equal(await p.evaluate(() => window.__cc.sel.length), 9);
    await p.click("[data-act=group]");
    assert.equal(await p.evaluate(() => new Set(window.__cc.doc.order.map((i) => window.__cc.doc.shapes[i].group)).size), 1);
    await p.click("[data-act=ungroup]");
    assert.equal(await p.evaluate(() => window.__cc.doc.order.every((i) => !window.__cc.doc.shapes[i].group)), true);
    await p.focus("[data-stage]"); await p.keyboard.press("Escape");
  });
  await check("layers panel lists shapes and locks one", async () => {
    await p.click("[data-pt=layers]");
    assert.equal(await p.locator("[data-layer]").count(), 9);
    const first = await p.getAttribute("[data-layer]", "data-layer");
    await p.click(`[data-llock="${first}"]`);
    assert.equal(await p.evaluate((i) => window.__cc.doc.shapes[i].locked, first), true);
    await p.click(`[data-llock="${first}"]`);
    assert.equal(await p.evaluate((i) => window.__cc.doc.shapes[i].locked, first), false);
  });
  await check("AI: grid of buttons, login form, rotate, help fallback", async () => {
    await p.click("[data-pt=ai]");
    await p.fill("#aiq", "create a 3x3 grid of buttons"); await p.press("#aiq", "Enter");
    assert.equal(await count(), 9 + 18);
    assert.match(await text(p, "[data-ailog]"), /3×3 grid of buttons/);
    await p.click("[data-aichip]:has-text('make a login form')");
    assert.equal(await count(), 27 + 8);
    assert.equal(await p.evaluate(() => new Set(window.__cc.sel.map((i) => window.__cc.doc.shapes[i].group)).size), 1);
    await p.fill("#aiq", "rotate selected 45 degrees"); await p.press("#aiq", "Enter");
    assert.ok(await p.evaluate(() => window.__cc.sel.every((i) => window.__cc.doc.shapes[i].rot === 45)));
    await p.fill("#aiq", "hello there"); await p.press("#aiq", "Enter");
    assert.match(await text(p, "[data-ailog]"), /I can create shapes/);
  });
  await check("realtime sync across two tabs (BroadcastChannel)", async () => {
    const p2 = await d.context.newPage();
    p2.on("pageerror", (e) => errors.push(e.message));
    await p2.goto(server.url, { waitUntil: "networkidle" });
    await p2.evaluate(() => window.__cc.setBot(false));
    await p2.waitForFunction(() => document.querySelectorAll(".pav").length >= 2, null, { polling: 150 });
    assert.equal(await p2.evaluate(() => window.__cc.doc.order.length), await count());
    await p.bringToFront();
    await p.fill("#aiq", "add a blue circle at 100, 700"); await p.press("#aiq", "Enter");
    const n = await count();
    await p2.waitForFunction((k) => window.__cc.doc.order.length === k, n, { polling: 150 });
    await p.mouse.move(600, 700); await p.mouse.move(620, 710);
    await p2.waitForFunction(() => document.querySelectorAll("[data-cursor]").length >= 1, null, { polling: 150 });
    await p2.close();
  });
  await check("history snapshot and restore", async () => {
    await p.click("[data-pt=history]");
    await p.click("[data-snap]");
    const n = await count();
    await p.focus("[data-stage]"); await p.keyboard.press("Control+a"); await p.keyboard.press("Delete");
    assert.equal(await count(), 0);
    await p.click("[data-restore]");
    assert.equal(await count(), n);
  });
  await check("zoom controls, fit and 500-shape perf test", async () => {
    await p.click("[data-zoom='1']"); await p.waitForFunction(() => document.querySelector("[data-zoom='0']").textContent === "125%");
    await p.click("[data-zoom='0']"); await p.waitForFunction(() => document.querySelector("[data-zoom='0']").textContent === "100%");
    await p.focus("[data-stage]"); await p.keyboard.press("Escape");
    await p.click("[data-pt=props]");
    const n = await count();
    await p.click("[data-stress]");
    assert.equal(await count(), n + 500);
    await p.waitForFunction(() => document.querySelector("[data-zoom='0']").textContent !== "100%");
  });
  await check("state persists after reload", async () => {
    const n = await count();
    await p.waitForTimeout(400);
    await p.reload({ waitUntil: "networkidle" });
    assert.equal(await count(), n);
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile layout: no overflow, stacked panel, 44px tools", async () => {
    const p = m.page;
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390));
    const st = await p.$eval("[data-stage]", (e) => e.getBoundingClientRect()), sd = await p.$eval(".side", (e) => e.getBoundingClientRect());
    assert.ok(st.bottom <= sd.top + 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".tools button, .ptabs button, .zoom button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.getAttribute("aria-label") || b.textContent));
    assert.deepEqual(small, []);
    await p.tap("[data-pt=ai]");
    await p.fill("#aiq", "add 3 green squares"); await p.press("#aiq", "Enter");
    assert.equal(await p.evaluate(() => window.__cc.doc.order.length), 11);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
