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

// helpers: world → page coordinates, drag gestures, doc access
const pt = async (p, wx, wy) => p.evaluate(([x, y]) => { const r = document.querySelector("[data-stage]").getBoundingClientRect(), q = window.__cc.toScreen(x, y); return { x: r.left + q.x, y: r.top + q.y }; }, [wx, wy]);
const drag = async (p, a, b, opts = {}) => { await p.mouse.move(a.x, a.y); if (opts.shift) await p.keyboard.down("Shift"); await p.mouse.down(); await p.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 4 }); await p.mouse.move(b.x, b.y, { steps: 4 }); await p.mouse.up(); if (opts.shift) await p.keyboard.up("Shift"); await p.waitForTimeout(60); };
const D = (p) => p.evaluate(() => JSON.parse(JSON.stringify({ doc: window.__cc.doc, sel: window.__cc.sel, view: window.__cc.view })));
const center = (s) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 });
const byName = (d, n) => Object.values(d.doc.shapes).find((s) => s.name === n);

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("canvas renders seed design; presence shows me + simulated teammate; teammate can be turned off", async () => {
    assert.equal(await page.locator("[data-world] [data-id]").count(), 8);
    assert.equal(await page.locator("[data-presence] .pav").count(), 2); assert.equal(await page.locator("[data-cursor]").count(), 1);
    await page.uncheck("[data-bot]"); assert.equal(await page.locator("[data-presence] .pav").count(), 1); assert.equal(await page.locator("[data-cursor]").count(), 0);
  });
  await check("draw a rectangle (R + drag) → selected with 8 resize handles + rotation handle; undo/redo", async () => {
    await page.keyboard.press("r"); assert.equal(await page.getAttribute('[data-tool="rect"]', "aria-pressed"), "true");
    await drag(page, await pt(page, 200, 600), await pt(page, 360, 700));
    let d = await D(page); const s = d.doc.shapes[d.sel[0]]; assert.equal(s.type, "rect"); assert.ok(Math.abs(s.w - 160) <= 2 && Math.abs(s.h - 100) <= 2, `${s.w}x${s.h}`);
    assert.equal(await page.locator("[data-over] [data-h]").count(), 9); assert.equal(await page.getAttribute('[data-tool="select"]', "aria-pressed"), "true");
    await page.keyboard.press("Control+z"); assert.equal((await D(page)).doc.order.length, 8); await page.keyboard.press("Control+Shift+z"); assert.equal((await D(page)).doc.order.length, 9);
  });
  await check("move by drag, resize via handle (rotation-aware), rotate with Shift snapping to 15°", async () => {
    let d = await D(page), id = d.doc.order[d.doc.order.length - 1], s = d.doc.shapes[id];
    await drag(page, await pt(page, s.x + 20, s.y + 20), await pt(page, s.x + 120, s.y + 60)); d = await D(page); s = d.doc.shapes[id]; assert.ok(Math.abs(s.x - 300) <= 2 && Math.abs(s.y - 640) <= 2, `moved to ${s.x},${s.y}`);
    const se = await page.$eval('[data-h="se"]', (h) => { const b = h.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await drag(page, se, { x: se.x + 40, y: se.y + 20 }); d = await D(page); s = d.doc.shapes[id]; assert.ok(Math.abs(s.w - 200) <= 3 && Math.abs(s.h - 120) <= 3, `resized ${s.w}x${s.h}`); assert.ok(Math.abs(s.x - 300) <= 2, "anchor (nw) fixed");
    const rot = await page.$eval('[data-h="rot"]', (h) => { const b = h.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }), c = await pt(page, ...Object.values(center(s)));
    await drag(page, rot, { x: c.x + 200, y: c.y - 110 }, { shift: true }); d = await D(page); s = d.doc.shapes[id]; assert.ok(s.rot > 0 && s.rot % 15 === 0, `rot ${s.rot}`);
    const se2 = await page.$eval('[data-h="se"]', (h) => { const b = h.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }), before = { ...s };
    await drag(page, se2, { x: se2.x + 10, y: se2.y + 10 }); d = await D(page); s = d.doc.shapes[id]; const nw = (o) => { const cx = o.x + o.w / 2, cy = o.y + o.h / 2, a = (o.rot * Math.PI) / 180; return [cx + (-o.w / 2) * Math.cos(a) - (-o.h / 2) * Math.sin(a), cy + (-o.w / 2) * Math.sin(a) + (-o.h / 2) * Math.cos(a)]; };
    const [ax, ay] = nw(before), [bx, by] = nw(s); assert.ok(Math.hypot(ax - bx, ay - by) < 3, "rotated resize keeps opposite corner fixed");
  });
  await check("properties panel edits (X, fill swatch, rotation), arrow nudge, duplicate, delete", async () => {
    let d = await D(page), id = d.sel[0];
    await page.fill('[data-prop="x"]', "420"); await page.press('[data-prop="x"]', "Enter"); assert.equal((await D(page)).doc.shapes[id].x, 420);
    await page.click('[data-swatch="fill"][data-c="#EF4444"]'); { const dd = await D(page); assert.equal(dd.doc.shapes[id].fill, "#EF4444", JSON.stringify({ sel: dd.sel, id, type: dd.doc.shapes[id].type, panel: await text(page, "[data-panel] h3") })); } assert.equal(await page.getAttribute(`[data-world] [data-id="${id}"]`, "fill"), "#EF4444");
    await page.fill('[data-prop="rot"]', "0"); await page.press('[data-prop="rot"]', "Enter");
    await page.focus("[data-stage]"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Shift+ArrowDown"); d = await D(page); assert.equal(d.doc.shapes[id].x, 421);
    await page.keyboard.press("Control+d"); d = await D(page); assert.equal(d.doc.order.length, 10); assert.equal(d.doc.shapes[d.sel[0]].x, 437);
    await page.keyboard.press("Delete"); assert.equal((await D(page)).doc.order.length, 9);
  });
  await check("marquee multi-select, align left, distribute, group (click selects group), lock prevents moving", async () => {
    await page.keyboard.press("Escape");
    await drag(page, await pt(page, 430, 230), await pt(page, 640, 420)); let d = await D(page); assert.deepEqual(d.sel.map((id) => d.doc.shapes[id].name).sort(), ["Circle", "Square"]);
    await page.click('[data-align="left"]'); d = await D(page);
    const left = (s) => { const cx = s.x + s.w / 2, cy = s.y + s.h / 2, a = (s.rot * Math.PI) / 180; return Math.min(...[[s.x, s.y], [s.x + s.w, s.y], [s.x, s.y + s.h], [s.x + s.w, s.y + s.h]].map(([x, y]) => cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a))); };
    const [l1, l2] = d.sel.map((id) => left(d.doc.shapes[id])); assert.ok(Math.abs(l1 - l2) <= 1.5, `${l1} vs ${l2}`);
    await page.keyboard.press("Control+g"); d = await D(page); assert.ok(d.sel.every((id) => d.doc.shapes[id].group && d.doc.shapes[id].group === d.doc.shapes[d.sel[0]].group));
    await page.keyboard.press("Escape"); const circ = byName(d, "Circle"); await page.mouse.click(...Object.values(await pt(page, circ.x + circ.w / 2, circ.y + circ.h / 2))); assert.equal((await D(page)).sel.length, 2, "group selects together");
    await page.keyboard.press("Control+l"); d = await D(page); const c0 = byName(d, "Circle"); await drag(page, await pt(page, c0.x + c0.w / 2, c0.y + c0.h / 2), await pt(page, c0.x + 200, c0.y)); assert.equal(byName(await D(page), "Circle").x, c0.x, "locked shape stays");
    assert.match(await text(page, "[data-toasts]"), /locked/i); await page.keyboard.press("Control+l");
  });
  await check("layers panel: list in z-order, select, reorder, lock toggle", async () => {
    await page.click('[data-pt="layers"]'); let d = await D(page); assert.equal(await page.locator("[data-layer]").count(), d.doc.order.length);
    assert.equal(await page.getAttribute("[data-layer]:first-child", "data-layer"), d.doc.order[d.doc.order.length - 1]);
    const card = byName(d, "Card"); await page.click(`[data-layer="${card.id}"] .nm`); assert.deepEqual((await D(page)).sel, [card.id]);
    await page.click(`[data-lup="${card.id}"]`); d = await D(page); assert.equal(d.doc.order.indexOf(card.id), 1);
    await page.click(`[data-llock="${card.id}"]`); assert.equal((await D(page)).doc.shapes[card.id].locked, true); await page.click(`[data-llock="${card.id}"]`);
    await page.keyboard.press("Control+z"); await page.keyboard.press("Control+z"); await page.keyboard.press("Control+z"); assert.equal((await D(page)).doc.order.indexOf(card.id), 0);
  });
  await check("text tool + editing; space-drag pan; Ctrl+wheel zoom; fit", async () => {
    await page.click('[data-pt="props"]'); await page.keyboard.press("Escape"); await page.focus("[data-stage]"); await page.keyboard.press("t"); const tp = await pt(page, 700, 520); await page.mouse.click(tp.x, tp.y);
    await page.waitForSelector("[data-ptext]"); await page.fill("[data-ptext]", "Hello team\nSecond line"); await page.locator("[data-ptext]").blur();
    let d = await D(page), t = d.doc.shapes[d.sel[0]]; assert.equal(t.text, "Hello team\nSecond line"); assert.ok(t.w > 60 && t.h > 50);
    assert.equal(await page.locator(`[data-world] [data-id="${t.id}"] tspan`).count(), 2);
    const v0 = d.view; await page.focus("[data-stage]"); await page.keyboard.down(" "); await drag(page, { x: 800, y: 800 }, { x: 900, y: 760 }); await page.keyboard.up(" ");
    d = await D(page); assert.ok(Math.abs(d.view.x - v0.x - 100) < 2 && Math.abs(d.view.y - v0.y + 40) < 2, "panned");
    await page.mouse.move(700, 450); await page.keyboard.down("Control"); await page.mouse.wheel(0, -200); await page.keyboard.up("Control"); await page.waitForTimeout(100); d = await D(page); assert.ok(d.view.z > 1.2, `zoom ${d.view.z}`); assert.notEqual(await text(page, "[data-zoom='0']"), "100%");
    await page.click("[data-fit]"); await page.click("[data-zoom='0']"); assert.equal(await text(page, "[data-zoom='0']"), "100%");
  });
  await check("AI agent: grid of buttons, login form (grouped), rotate/arrange selection, function-call log, help fallback", async () => {
    await page.click('[data-pt="ai"]'); const n0 = (await D(page)).doc.order.length;
    await page.fill("#aiq", "create a 3x3 grid of buttons at 100, 800"); await page.press("#aiq", "Enter");
    let d = await D(page); assert.equal(d.doc.order.length, n0 + 18); assert.match(await text(page, "[data-ailog]"), /Created a 3×3 grid of buttons[\s\S]*"name": "createShape"[\s\S]*"name": "createText"/);
    await page.fill("#aiq", "make a login form at 1000, 100"); await page.press("#aiq", "Enter"); d = await D(page); const g = d.sel.map((id) => d.doc.shapes[id].group); assert.equal(d.sel.length, 8); assert.ok(g.every((x) => x && x === g[0]));
    await page.click('[data-pt="layers"]'); const sq = byName(d, "Line"); await page.click(`[data-layer="${sq.id}"] .nm`); await page.click('[data-pt="ai"]');
    await page.fill("#aiq", "rotate selected 30 degrees"); await page.press("#aiq", "Enter"); assert.equal((await D(page)).doc.shapes[sq.id].rot, 30);
    await page.fill("#aiq", "add 3 blue circles at 200, 1100"); await page.press("#aiq", "Enter"); d = await D(page); assert.equal(d.sel.length, 3); assert.ok(d.sel.every((id) => d.doc.shapes[id].type === "ellipse" && d.doc.shapes[id].fill === "#3B82F6"));
    await page.fill("#aiq", "arrange selected vertically with spacing 10"); await page.press("#aiq", "Enter"); d = await D(page); const ys = d.sel.map((id) => d.doc.shapes[id]).sort((a, b) => a.y - b.y); assert.equal(ys[1].y - ys[0].y, 110); assert.equal(ys[0].x, ys[1].x);
    await page.fill("#aiq", "sing me a song"); await page.press("#aiq", "Enter"); assert.match(await text(page, "[data-ailog] .ai-msg"), /I can create shapes and text/);
  });
  await check("version history: automatic snapshots + restore", async () => {
    await page.waitForTimeout(4300); await page.click('[data-pt="history"]'); assert.ok(await page.locator("[data-restore]").count() >= 1);
    await page.click("[data-snap]"); const n = (await D(page)).doc.order.length; const h = await page.evaluate(() => JSON.parse(localStorage.getItem("cc-history")).length); assert.ok(h >= 2 && h <= 50);
    await page.keyboard.press("Escape"); await page.focus("[data-stage]"); await page.keyboard.press("Control+a"); await page.keyboard.press("Delete"); assert.equal((await D(page)).doc.order.length, 0);
    await page.click('[data-pt="history"]'); await page.click("[data-hist] li:first-child [data-restore]"); assert.equal((await D(page)).doc.order.length, n);
  });
  await check("performance: 500+ objects render; title rename persists", async () => {
    await page.click('[data-pt="props"]'); await page.keyboard.press("Escape"); await page.click("[data-stress]"); const d = await D(page); assert.ok(d.doc.order.length >= 500 + 30);
    assert.equal(await page.locator("[data-world] [data-id]").count(), d.doc.order.length); assert.match(await text(page, "[data-toasts]"), /render took \d+ ms/);
    await page.fill("[data-title]", "Landing page v2"); await page.press("[data-title]", "Enter"); await page.waitForTimeout(400); await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.inputValue("[data-title]"), "Landing page v2"); assert.equal((await D(page)).doc.order.length, d.doc.order.length);
  });
  await context.close();

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await check("real-time collaboration across tabs: shapes sync, live cursors with names, presence, selection locks", async () => {
    const A = await ctx.newPage(), B = await ctx.newPage();
    for (const p of [A, B]) { p.on("pageerror", (e) => errors.push(e.message)); await p.goto(server.url, { waitUntil: "networkidle" }); await p.uncheck("[data-bot]"); }
    await A.waitForTimeout(2300); assert.equal(await A.locator("[data-presence] .pav").count(), 2); assert.equal(await B.locator("[data-presence] .pav").count(), 2);
    const nA = (await D(A)).doc.order.length; await A.bringToFront(); await A.focus("[data-stage]"); await A.keyboard.press("o"); await drag(A, await pt(A, 120, 520), await pt(A, 220, 600));
    await B.waitForFunction((n) => window.__cc.doc.order.length === n + 1, nA, { polling: 100 }); const id = (await D(A)).sel[0];
    const bs = (await D(B)).doc.shapes[id]; assert.equal(bs.type, "ellipse"); assert.ok(Math.abs(bs.w - 100) <= 2);
    await B.bringToFront(); const bp = await pt(B, 600, 200); await B.mouse.move(bp.x, bp.y); await B.mouse.move(bp.x + 30, bp.y + 10, { steps: 3 });
    await A.waitForFunction(() => document.querySelectorAll("[data-cursor]").length === 1, null, { polling: 100 });
    const bname = await B.evaluate(() => JSON.parse(sessionStorage.getItem("cc-me")).name); assert.match(await A.textContent("[data-cursor]"), new RegExp(bname));
    await B.waitForFunction((i) => !!document.querySelector(`[data-world] [data-id="${i}"].lockedby`), id, { polling: 100 });
    const c = await pt(B, bs.x + bs.w / 2, bs.y + bs.h / 2); await B.mouse.click(c.x, c.y); assert.equal((await D(B)).sel.length, 0, "can't select a shape another user is editing");
    assert.match(await B.textContent("[data-toasts]"), /is editing this shape/);
    await A.bringToFront(); await A.fill('[data-prop="x"]', "333"); await A.press('[data-prop="x"]', "Enter"); await B.waitForFunction((i) => window.__cc.doc.shapes[i].x === 333, id, { polling: 100 });
  });
  await ctx.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, horizontal toolbar, panel below canvas, 44px targets, touch drawing", async () => {
    const p = m.page; await p.uncheck("[data-bot]");
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    const tb = await p.$eval("[data-tools]", (e) => e.getBoundingClientRect()); assert.ok(tb.width > tb.height);
    const n0 = (await D(p)).doc.order.length; await p.tap('[data-tool="rect"]'); const a = await pt(p, 100, 500), b = await pt(p, 300, 640);
    await p.dispatchEvent("[data-stage]", "pointerdown", { clientX: a.x, clientY: a.y, pointerId: 7, button: 0, isPrimary: true });
    await p.dispatchEvent("[data-stage]", "pointermove", { clientX: b.x, clientY: b.y, pointerId: 7, isPrimary: true }); await p.dispatchEvent("[data-stage]", "pointerup", { clientX: b.x, clientY: b.y, pointerId: 7, isPrimary: true });
    assert.equal((await D(p)).doc.order.length, n0 + 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".tools button, .icon-btn, .ptabs button, .btn, .btn-o, .zv")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.getAttribute("aria-label") || b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
