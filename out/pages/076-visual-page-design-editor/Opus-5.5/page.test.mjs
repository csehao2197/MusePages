// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/076-visual-page-design-editor/Opus-5.5/page.test.mjs
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
  const count = () => p.evaluate(() => window.__ts.doc.order.length);
  const fr = (n) => p.evaluate((x) => window.__ts.byName(x), n);
  const ctr = (n) => p.evaluate((x) => { const r = window.__ts.el(window.__ts.byName(x).id).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, n);
  const z = () => p.evaluate(() => window.__ts.view.z);
  const dragBy = async (from, dx, dy, mods = []) => { for (const k of mods) await p.keyboard.down(k); await p.mouse.move(from.x, from.y); await p.mouse.down(); await p.mouse.move(from.x + dx / 2, from.y + dy / 2, { steps: 4 }); await p.mouse.move(from.x + dx, from.y + dy, { steps: 4 }); await p.mouse.up(); for (const k of mods) await p.keyboard.up(k); };
  const handle = (h) => p.$eval(`[data-${h === "rot" ? "rot" : `h="${h}"`}]`, (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });

  await check("seed design, layer list and empty-state panel render", async () => {
    assert.equal(await count(), 23);
    assert.equal(await p.locator("[data-layer]").count(), 23);
    assert.equal(await text(p, ".blabel"), "Desktop");
    assert.match(await p.title(), /Landing page — Tessera/);
    assert.match(await text(p, "[data-props]"), /Select a frame/);
    assert.equal(await p.getAttribute("[data-undo]", "disabled"), "");
  });
  await check("click selects, drag moves (Alt skips snapping), handles resize and rotate", async () => {
    await p.mouse.click((await ctr("Hero tile A")).x - 30, (await ctr("Hero tile A")).y - 20);
    assert.deepEqual(await p.evaluate(() => window.__ts.sel.length), 1);
    assert.match(await text(p, "[data-selname]"), /Hero tile A/);
    assert.equal(await p.inputValue('[data-k="x"]'), "640");
    const zz = await z();
    await dragBy({ x: (await ctr("Hero tile A")).x - 30, y: (await ctr("Hero tile A")).y - 20 }, 58, 29, ["Alt"]);
    let f = await fr("Hero tile A");
    assert.ok(Math.abs(f.x - (640 + 58 / zz)) <= 1.5 && Math.abs(f.y - (140 + 29 / zz)) <= 1.5, JSON.stringify(f));
    assert.equal(await p.inputValue('[data-k="x"]'), String(f.x));
    await p.fill('[data-k="rot"]', "0"); await p.press('[data-k="rot"]', "Enter");
    await dragBy(await handle("se"), 58, 29);
    const g = await fr("Hero tile A");
    assert.ok(Math.abs(g.w - (300 + 58 / zz)) <= 1.5 && Math.abs(g.h - (220 + 29 / zz)) <= 1.5 && g.x === f.x, JSON.stringify(g));
    const c = await ctr("Hero tile A"), r = await handle("rot");
    await p.mouse.move(r.x, r.y); await p.mouse.down(); await p.keyboard.down("Shift"); await p.mouse.move(c.x + 150, c.y + 3, { steps: 6 }); await p.mouse.up(); await p.keyboard.up("Shift");
    assert.equal((await fr("Hero tile A")).rot, 90);
    assert.equal(await p.inputValue('[data-k="rot"]'), "90");
  });
  await check("undo and redo walk the history", async () => {
    await p.click("[data-undo]"); assert.equal((await fr("Hero tile A")).rot, 0);
    await p.click("[data-redo]"); assert.equal((await fr("Hero tile A")).rot, 90);
    await p.keyboard.press("Control+z"); assert.equal((await fr("Hero tile A")).rot, 0);
  });
  await check("snapping pulls edges into line and shows a guide", async () => {
    await p.click('[data-layer] >> text="CTA"');
    const c0 = await ctr("CTA"), c = { x: c0.x - 25, y: c0.y - 8 }, zz = await z();
    await p.mouse.move(c.x, c.y); await p.mouse.down(); await p.mouse.move(c.x + 3, c.y, { steps: 2 }); await p.mouse.move(c.x + 5, c.y, { steps: 2 });
    assert.ok(await p.locator("[data-guides] i").count() >= 1);
    assert.equal((await fr("CTA")).x, 72);
    await p.mouse.up();
    assert.equal(await p.locator("[data-guides] i").count(), 0);
    await dragBy(c, 5, 0, ["Alt"]);
    assert.ok(Math.abs((await fr("CTA")).x - (72 + 5 / zz)) <= 1, JSON.stringify([await fr("CTA"), zz, await p.evaluate(() => window.__ts.sel.map((i) => window.__ts.doc.frames[i].name)), c]));
    await dragBy((await ctr("CTA label")), 0, -60);
    assert.equal(await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]].name), "CTA label");
    await p.keyboard.press("Control+z");
    await p.keyboard.press("Control+z");
  });
  await check("properties: position, rotation, opacity, radius, hex and picker swatch", async () => {
    await p.click("[data-layer] >> text=Hero tile B");
    await p.fill('[data-k="x"]', "500"); await p.press('[data-k="x"]', "Enter");
    await p.fill('[data-k="rot"]', "-30"); await p.press('[data-k="rot"]', "Enter");
    await p.fill('[data-k="radius"]', "4"); await p.press('[data-k="radius"]', "Enter");
    let f = await fr("Hero tile B");
    assert.deepEqual([f.x, f.rot, f.radius], [500, -30, 4]);
    assert.match(await p.evaluate((id) => window.__ts.el(id).style.transform, f.id), /rotate\(-30deg\)/);
    await p.$eval("[data-opacity]", (e) => { e.value = 40; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); });
    assert.equal((await fr("Hero tile B")).opacity, 40);
    assert.equal(await p.evaluate((id) => window.__ts.el(id).style.opacity, f.id), "0.4");
    await p.fill('[data-hex="fill"]', "3ccf91"); await p.press('[data-hex="fill"]', "Enter");
    assert.equal((await fr("Hero tile B")).fill, "#3CCF91");
    await p.click('[data-pick="fill"]'); assert.ok(await p.isVisible("[data-sv]"));
    await p.click('[data-swatch="#8B5CF6"]');
    assert.equal((await fr("Hero tile B")).fill, "#8B5CF6");
    const sv = await p.$eval("[data-sv]", (e) => { const r = e.getBoundingClientRect(); return { x: r.left + 2, y: r.top + 2 }; });
    await p.mouse.click(sv.x, sv.y);
    assert.match((await fr("Hero tile B")).fill, /^#F[0-9A-F]F[0-9A-F]F[0-9A-F]$/);
    assert.equal(await p.inputValue('[data-hex="fill"]'), (await fr("Hero tile B")).fill);
  });
  await check("add frame button, frame tool drawing, duplicate, nudge and delete", async () => {
    await p.click("[data-add]");
    assert.equal(await count(), 24);
    assert.match(await text(p, "[data-selname]"), /Frame 24/);
    await p.keyboard.press("Escape");
    await p.focus("[data-stage]"); await p.keyboard.press("f");
    assert.equal(await p.getAttribute("[data-tool=frame]", "aria-pressed"), "true");
    await dragBy({ x: 300, y: 760 }, 120, 80);
    assert.equal(await count(), 25);
    const nf = await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]]);
    assert.ok(nf.w > 150 && nf.h > 100, JSON.stringify(nf));
    assert.equal(await p.getAttribute("[data-tool=select]", "aria-pressed"), "true");
    await p.keyboard.press("Control+d"); assert.equal(await count(), 26);
    const dup = await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]]);
    assert.equal(dup.x, nf.x + 20);
    await p.keyboard.press("Shift+ArrowRight");
    assert.equal(await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]].x), nf.x + 30);
    await p.keyboard.press("Delete"); assert.equal(await count(), 25);
  });
  await check("multi-select, align top and distribute", async () => {
    await p.click("[data-layer] >> text=Stat card 1");
    await p.fill('[data-k="y"]', "500"); await p.press('[data-k="y"]', "Enter");
    await p.click("[data-layer] >> text=Stat card 2", { modifiers: ["Shift"] });
    await p.click("[data-layer] >> text=Stat card 3", { modifiers: ["Shift"] });
    assert.match(await text(p, "[data-props] .sel-name"), /3 frames/);
    await p.click('[data-align="top"]');
    assert.deepEqual([(await fr("Stat card 1")).y, (await fr("Stat card 2")).y, (await fr("Stat card 3")).y], [500, 500, 500]);
    await p.click('[data-dist="h"]');
    const xs = [(await fr("Stat card 1")).x, (await fr("Stat card 2")).x, (await fr("Stat card 3")).x];
    assert.equal(xs[1] - xs[0], xs[2] - xs[1]);
    await p.click('[data-act="fwd"]');
  });
  await check("layers: rename, hide, lock, keyboard and drag reordering", async () => {
    const li = p.locator("[data-layer]", { hasText: "Sticky note" });
    await li.locator("[data-nm]").dblclick();
    await p.fill("[data-layers] .nm input", "Reminder"); await p.press("[data-layers] .nm input", "Enter");
    assert.ok(await fr("Reminder"));
    const id = (await fr("Reminder")).id;
    await p.click(`[data-vis="${id}"]`);
    assert.equal(await p.evaluate((i) => window.__ts.el(i).style.display, id), "none");
    await p.click(`[data-vis="${id}"]`);
    await p.click(`[data-lock="${id}"]`);
    assert.equal(await css(p, `.fr[data-id="${id}"]`, "pointerEvents"), "none");
    await p.click(`[data-lock="${id}"]`);
    const before = await p.evaluate((i) => window.__ts.doc.order.indexOf(i), id);
    await p.focus(`[data-layer="${id}"]`); await p.keyboard.press("Alt+ArrowDown");
    assert.equal(await p.evaluate((i) => window.__ts.doc.order.indexOf(i), id), before - 1);
    const nav = (await fr("Nav")).id, logo = (await fr("Logo")).id, idx = (a) => p.evaluate((i) => window.__ts.doc.order.indexOf(i), a);
    const n0 = await idx(nav);
    await p.dragAndDrop(`[data-layer="${nav}"]`, `[data-layer="${logo}"]`, { targetPosition: { x: 60, y: 4 } });
    assert.equal((await idx(nav)) - (await idx(logo)), 1);
    await p.keyboard.press("Control+z");
    assert.equal(await idx(nav), n0);
  });
  await check("text: double-click to edit, text tool creates and edits text", async () => {
    const c = await ctr("Subhead");
    await p.mouse.dblclick(c.x, c.y);
    assert.equal(await p.locator("[contenteditable]").count(), 1);
    await p.keyboard.type("Frames for everyone.");
    await p.keyboard.press("Escape");
    assert.equal((await fr("Subhead")).text, "Frames for everyone.");
    assert.equal(await p.locator("[contenteditable]").count(), 0);
    await p.focus("[data-stage]"); await p.keyboard.press("t");
    await p.mouse.click(1000, 780);
    await p.keyboard.type("Hello canvas"); await p.keyboard.press("Escape");
    const t = await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]]);
    assert.deepEqual([t.kind, t.text, t.color], ["text", "Hello canvas", "#ECEDF0"]);
    await p.fill('[data-k="fs"]', "40"); await p.press('[data-k="fs"]', "Enter");
    assert.ok((await p.evaluate(() => window.__ts.doc.frames[window.__ts.sel[0]].h)) >= 46);
  });
  await check("pan with Space-drag, scroll zoom, zoom buttons and fit", async () => {
    await p.keyboard.press("Escape");
    const v0 = await p.evaluate(() => ({ ...window.__ts.view }));
    await p.focus("[data-stage]");
    await p.keyboard.down(" "); await dragBy({ x: 700, y: 820 }, 100, -40); await p.keyboard.up(" ");
    const v1 = await p.evaluate(() => ({ ...window.__ts.view }));
    assert.deepEqual([Math.round(v1.x - v0.x), Math.round(v1.y - v0.y)], [100, -40]);
    await p.mouse.move(700, 450); await p.mouse.wheel(0, -200);
    assert.ok((await z()) > v1.z);
    await p.click("[data-zoom='0']"); assert.equal(await text(p, "[data-zoom='0']"), "100%");
    await p.click("[data-zoom='1']"); assert.equal(await text(p, "[data-zoom='0']"), "125%");
    await p.click("[data-fit]"); assert.ok((await z()) < 1);
  });
  await check("shortcuts dialog, persistence and demo reset", async () => {
    await p.focus("[data-stage]"); await p.keyboard.press("Shift+Slash");
    assert.ok(await p.isVisible("[data-keysdlg]"));
    await p.click("[data-keysdlg] [data-close]"); assert.ok(!(await p.isVisible("[data-keysdlg]")));
    await p.fill("[data-pname]", "Spring launch"); await p.press("[data-pname]", "Enter");
    const n = await count();
    await p.waitForTimeout(350);
    await p.reload({ waitUntil: "networkidle" });
    assert.equal(await count(), n);
    assert.equal((await fr("Subhead")).text, "Frames for everyone.");
    assert.match(await p.title(), /Spring launch/);
    await p.click("[data-reset]");
    assert.equal(await count(), 23);
    await p.keyboard.press("Control+z");
    assert.equal(await count(), n);
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: bottom sheets, tap to select, no overflow, 44px targets", async () => {
    const p = m.page;
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390));
    assert.ok(!(await p.isVisible("[data-props]")) || (await p.$eval("[data-pane=props]", (e) => getComputedStyle(e).visibility)) === "hidden");
    await p.tap("[data-mtab=layers]");
    await p.waitForTimeout(300);
    assert.equal(await p.$eval("[data-pane=layers]", (e) => getComputedStyle(e).visibility), "visible");
    await p.tap("[data-layer] >> text=Headline");
    await p.tap("[data-mtab=props]");
    await p.waitForTimeout(300);
    assert.match(await text(p, "[data-selname]"), /Headline/);
    const sb = await p.$eval(".selbox", (e) => e.getBoundingClientRect().top), pt = await p.$eval("[data-pane=props]", (e) => e.getBoundingClientRect().top);
    assert.ok(sb > 100 && sb < pt, `${sb} ${pt}`);
    const small = await p.evaluate(() => [...document.querySelectorAll(".tools button, .zoom button, .kbtn, .mtabs button, .add, [data-pane=props] .btn, [data-pane=props] .align button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.getAttribute("aria-label") || b.textContent.trim()));
    assert.deepEqual(small, []);
    await p.tap('[data-act="dup"]');
    assert.equal(await p.evaluate(() => window.__ts.doc.order.length), 24);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
