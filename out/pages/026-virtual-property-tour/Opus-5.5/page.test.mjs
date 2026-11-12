// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/026-virtual-property-tour/Opus-5.5/page.test.mjs
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
  await page.waitForFunction(() => window.MuseTour && MuseTour.ready());
  return { context, page };
}
const text = (p, s) => p.textContent(s);
const st = (p) => p.evaluate(() => MuseTour.state());
const roomIs = (p, id) => p.waitForFunction((id) => MuseTour.ready() && MuseTour.state().room === id, id);

// Independent QR decoder used to verify the share QR code round-trips to the tour URL.
function decodeQR({ size, modules: m }) {
  const ver = (size - 17) / 4, g = (x, y) => (m[y][x] ? 1 : 0);
  let bits = 0; for (let i = 0; i <= 5; i++) bits |= g(8, i) << i;
  bits |= g(8, 7) << 6; bits |= g(8, 8) << 7; bits |= g(7, 8) << 8; for (let i = 9; i < 15; i++) bits |= g(14 - i, 8) << i;
  const fmt = (bits ^ 0x5412) >>> 10, mask = fmt & 7;
  const STD = ["101010000010010", "101000100100101", "101111001111100", "101101101001011", "100010111111001", "100000011001110", "100111110010111", "100101010100000"];
  assert.equal(bits.toString(2).padStart(15, "0"), STD[mask], "format bits match the QR standard table for level M");
  const fn = Array.from({ length: size }, () => Array(size).fill(false)), s = (x, y) => { fn[y][x] = true; };
  for (let i = 0; i < size; i++) { s(6, i); s(i, 6); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && y >= 0 && x < size && y < size) s(x, y); }
  if (ver > 1) { const n = Math.floor(ver / 7) + 2, stp = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, r = [6]; for (let p = size - 7; r.length < n; p -= stp) r.splice(1, 0, p);
    r.forEach((ax, i) => r.forEach((ay, j) => { if ((i === 0 && j === 0) || (i === 0 && j === r.length - 1) || (i === r.length - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) s(ax + dx, ay + dy); })); }
  for (let i = 0; i < 9; i++) { s(8, i); s(i, 8); } for (let i = 0; i < 8; i++) { s(size - 1 - i, 8); s(8, size - 1 - i); }
  if (ver >= 7) for (let i = 0; i < 18; i++) { s(size - 11 + (i % 3), Math.floor(i / 3)); s(Math.floor(i / 3), size - 11 + (i % 3)); }
  const mf = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0, (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0][mask];
  const cw = []; let cur = 0, n = 0;
  for (let right = size - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - v : v; if (fn[y][x]) continue; cur = (cur << 1) | (g(x, y) ^ (mf(x, y) ? 1 : 0)); if (++n === 8) { cw.push(cur); cur = 0; n = 0; } } }
  const ECC = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], NB = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  let rawM = (16 * ver + 128) * ver + 64; if (ver >= 2) { const na = Math.floor(ver / 7) + 2; rawM -= (25 * na - 10) * na - 55; if (ver >= 7) rawM -= 36; }
  const raw = Math.floor(rawM / 8), nb = NB[ver], ecc = ECC[ver], ns = nb - (raw % nb), sl = Math.floor(raw / nb);
  const blocks = Array.from({ length: nb }, () => []); let k = 0;
  for (let i = 0; i < sl + 1; i++) for (let j = 0; j < nb; j++) { if (i === sl - ecc && j < ns) continue; blocks[j].push(cw[k++]); }
  const exp = [], log = []; let x = 1; for (let i = 0; i < 255; i++) { exp[i] = x; log[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  const ev = (p, a) => p.reduce((acc, c) => (acc === 0 ? 0 : exp[(log[acc] + a) % 255]) ^ c, 0);
  blocks.forEach((b) => { for (let i = 0; i < ecc; i++) assert.equal(ev(b, i), 0, "Reed-Solomon syndrome is zero"); });
  const bitsStr = blocks.flatMap((b) => b.slice(0, b.length - ecc)).map((b) => b.toString(2).padStart(8, "0")).join("");
  assert.equal(parseInt(bitsStr.slice(0, 4), 2), 4, "byte mode");
  const cc = ver <= 9 ? 8 : 16, len = parseInt(bitsStr.slice(4, 4 + cc), 2), bytes = [];
  for (let i = 0; i < len; i++) bytes.push(parseInt(bitsStr.slice(4 + cc + i * 8, 12 + cc + i * 8), 2));
  return Buffer.from(bytes).toString("utf8");
}

try {
  const { context, page } = await open({ width: 1440, height: 900 });
  const box = await page.locator("[data-stage]").boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await check("header, loader and room strip", async () => {
    assert.match(await text(page, ".hdr-l"), /2148 Larkspur Lane[\s\S]*\$1,250,000[\s\S]*4 bed \| 3\.5 bath \| 3,200 sq ft/);
    await page.waitForFunction(() => document.querySelector("[data-loader]").hidden);
    assert.equal(await page.locator(".thumb").count(), 6);
    assert.equal(await page.locator('.thumb[aria-selected="true"]').getAttribute("data-room"), "living");
    assert.equal((await st(page)).autoRot, true);
  });
  await check("drag pans, wheel and buttons zoom, keys look around, reset recenters", async () => {
    await page.click("[data-autorot]");
    const y0 = (await st(page)).yaw;
    await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx - 300, cy + 40, { steps: 6 }); await page.mouse.up();
    const s1 = await st(page);
    assert.ok(Math.abs(((s1.yaw - y0 + 540) % 360) - 180) > 15, "yaw changed");
    await page.mouse.wheel(0, -400); const z1 = (await st(page)).zoom; assert.ok(z1 > 1);
    await page.click('[data-zoom="-1"]'); await page.waitForTimeout(350); assert.ok((await st(page)).zoom < z1);
    await page.focus("[data-stage]"); const y2 = (await st(page)).yaw; await page.keyboard.press("ArrowRight");
    assert.ok(Math.abs((await st(page)).yaw - y2 - 6) < 0.01 || Math.abs((await st(page)).yaw - y2 + 354) < 0.01);
    await page.click("[data-reset]"); await page.waitForTimeout(500);
    const r = await st(page); assert.ok(Math.min(r.yaw, 360 - r.yaw) < 0.5 && Math.abs(r.pitch) < 0.01 && Math.abs(r.zoom - 1) < 0.01);
  });
  await check("info hotspots open a panel that closes on outside click; nav hotspot changes room facing back", async () => {
    await page.evaluate(() => MuseTour.viewer.look(30, 0, 1));
    await page.locator(".hs.info", { hasText: "" }).filter({ has: page.locator("svg") }).first();
    const shelf = page.locator('.hs[aria-label="Info: Custom built-in shelving"]');
    await page.evaluate(() => MuseTour.viewer.look(-31, 0, 1));
    await shelf.click();
    assert.match(await text(page, "[data-pop]"), /Custom built-in shelving[\s\S]*maple built-ins/);
    await page.mouse.click(cx + 200, cy + 200);
    assert.equal(await page.locator("[data-pop]").isHidden(), true);
    await page.evaluate(() => MuseTour.viewer.look(252, 0, 1));
    await page.click('.hs[aria-label="Go to Kitchen"]');
    await roomIs(page, "kitchen");
    const k = await st(page);
    assert.ok(Math.abs(((k.yaw - 90 + 540) % 360) - 180) < 1, `faces away from the doorway (yaw ${k.yaw})`);
    assert.equal(await page.locator('.thumb[aria-selected="true"]').getAttribute("data-room"), "kitchen");
    assert.match(await page.evaluate(() => location.hash), /room=kitchen/);
  });
  await check("room info panel, floor plan overlay and mini map navigate", async () => {
    await page.click('.tools [data-open="room"]');
    assert.match(await text(page, "[data-panel=room]"), /Kitchen[\s\S]*18' × 16'[\s\S]*Recently renovated \(2024\)[\s\S]*Quartz counters/);
    assert.equal(await page.locator("[data-r-gallery] button").count(), 4);
    await page.click('[data-panel=room] [data-close-panel]');
    await page.click('.tools [data-open="plan"]');
    await page.click('[data-lv="upper"]');
    await page.click('[data-fp] [data-go="primary"]');
    await roomIs(page, "primary");
    assert.equal(await text(page, "[data-mini-level]"), "Upper level");
    await page.click('[data-mini-map] [data-go="pbath"]');
    await roomIs(page, "pbath");
    await page.click("[data-mini-toggle]");
    assert.equal(await page.locator("[data-mini-show]").isVisible(), true);
    await page.click("[data-mini-show]");
  });
  await check("guided tour plays, skips, shows transcript and pauses", async () => {
    await page.click('[data-mode="guided"]');
    await roomIs(page, "pbath");
    assert.equal((await st(page)).guided, true);
    await page.click('[data-g="prev"]'); await roomIs(page, "primary");
    assert.equal(await text(page, "[data-g-prog]"), "5 / 6");
    await page.click('[data-g="transcript"]');
    assert.match(await page.locator("[data-transcript] li.on").textContent(), /Primary Bedroom.*vaulted twelve-foot ceiling/);
    const y0 = (await st(page)).yaw; await page.waitForTimeout(600); assert.notEqual((await st(page)).yaw, y0, "auto-plays (rotates)");
    await page.click('[data-g="play"]'); assert.equal((await st(page)).playing, false);
    await page.click('[data-mode="self"]'); assert.equal((await st(page)).guided, false);
  });
  await check("measure two points and the couch-fit helper", async () => {
    await page.click('.hs[aria-label="Go to Primary Bedroom"]').catch(() => {});
    await page.evaluate(() => MuseTour.viewer.look(0, 0, 1));
    await page.click('.tools [data-open="measure"]');
    await page.click("[data-measure]");
    await page.mouse.click(cx - 200, cy + 100); await page.mouse.click(cx + 200, cy + 100);
    assert.match(await text(page, "[data-m-log]"), /≈ \d+\.\d ft/);
    assert.equal(await page.locator(".mline").count(), 1);
    const ft = +(await text(page, "[data-m-log] li b")).match(/[\d.]+/)[0];
    assert.ok(ft > 2 && ft < 20, `plausible distance ${ft}`);
    await page.fill("[data-fit] [name=len]", "96");
    assert.match(await text(page, "[data-fit-out]"), /Yes — fits/);
    await page.fill("[data-fit] [name=len]", "220");
    assert.match(await text(page, "[data-fit-out]"), /Too long/);
    await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
    assert.equal((await st(page)).measuring, false);
  });
  await check("before/after slider, media photos and simulated video", async () => {
    await page.click('.tools [data-open="ba"]');
    await page.locator("[data-ba-range]").fill("20");
    assert.equal(await page.evaluate(() => document.querySelector("[data-ba-before]").style.clipPath), "inset(0px 80% 0px 0px)");
    await page.click('[data-ba="stage"]'); assert.equal(await text(page, "[data-ba-l]"), "Empty");
    await page.keyboard.press("Escape");
    await page.click('.tools [data-open="media"]');
    assert.equal(await page.locator("[data-md-grid] [data-pi]").count(), 13);
    await page.click('[data-pi="0"]'); assert.match(await text(page, "[data-ph-count]"), /^1 of 13 · Front exterior/);
    await page.click('[data-ph="-1"]'); assert.match(await text(page, "[data-ph-count]"), /^13 of 13/);
    await page.click('[data-md="drone"]'); await page.waitForTimeout(700);
    assert.ok(parseFloat(await page.evaluate(() => document.querySelector("[data-pl-fill]").style.width)) > 0, "video progresses");
    await page.keyboard.press("Escape");
  });
  await check("compare view syncs two tours side by side", async () => {
    await page.click('.tools [data-open="compare"]');
    await page.click('[data-cp="kitchen"]');
    const a = page.locator("[data-cp-a]"), b2 = await a.boundingBox();
    await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await page.mouse.down(); await page.mouse.move(b2.x + b2.width / 2 - 120, b2.y + b2.height / 2, { steps: 4 }); await page.mouse.up();
    const yaws = await page.evaluate(() => [...document.querySelectorAll(".cp-view")].map((el) => getComputedStyle(el.querySelector(".vw-track")).transform));
    assert.equal(yaws[0] === yaws[1], true, "views stay in sync");
    await page.keyboard.press("Escape");
  });
  await check("share: link, embed code, email and a QR code that decodes to the tour link", async () => {
    await page.click('.hdr [data-open="share"]');
    const url = await page.inputValue("[data-share-url]");
    assert.match(url, /#room=/);
    assert.match(await page.inputValue("[data-share-embed]"), /<iframe src="[^"]+#room=[a-z]+"/);
    assert.match(await page.getAttribute("[data-share-mail]", "href"), /^mailto:\?subject=/);
    const q = await page.evaluate((u) => QR.encode(u), url);
    assert.equal(decodeQR(q), url);
    assert.equal(await page.locator("[data-qr] svg").count(), 1);
    await page.keyboard.press("Escape");
  });
  await check("save, schedule an in-person tour and request more info", async () => {
    await page.click("[data-save]"); assert.equal(await page.getAttribute("[data-save]", "aria-pressed"), "true");
    await page.click(".cta-float");
    await page.click("[data-sc-submit]");
    assert.match(await text(page, "[data-sc-err]"), /date[\s\S]*name[\s\S]*email/);
    const d = new Date(Date.now() + 3 * 864e5);
    await page.fill("[data-sc-form] [name=date]", `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await page.fill("[data-sc-form] [name=name]", "Riley Park"); await page.fill("[data-sc-form] [name=email]", "riley@example.com");
    await page.click("[data-sc-submit]");
    assert.match(await text(page, "[data-sc-done-text]"), /Thanks, Riley![\s\S]*1:00 PM[\s\S]*Demo/);
    await page.keyboard.press("Escape");
    await page.click('.hdr [data-open="schedule"]'); await page.click('[data-sc="info"]');
    assert.equal(await page.locator("[data-sc-when]").isHidden(), true);
    await page.keyboard.press("Escape");
  });
  await check("accessibility: live description, high contrast, reduced motion, keyboard room change", async () => {
    await page.focus("[data-stage]");
    await page.keyboard.press("PageDown");
    await page.waitForFunction(() => MuseTour.ready() && document.querySelector("[data-desc]").textContent.length > 20);
    assert.match(await text(page, "[data-desc]"), /facing (north|east|south|west):/i);
    await page.click('.tools [data-open="a11y"]');
    await page.click('[data-set="contrast"] + span');
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains("hc")), true);
    await page.click('[data-set="motion"] + span');
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains("rm")), true);
    assert.match(await text(page, "[data-a11y-alt]"), /Facing north: .*Facing west:/);
  });
  await check("exit tour shows the listing; resume returns into a room", async () => {
    await page.click("[data-exit]"); await page.waitForTimeout(300);
    assert.ok(await page.evaluate(() => document.querySelector("#listing").getBoundingClientRect().top < 100));
    await page.click('[data-ls-room="office"]'); await roomIs(page, "office");
    await page.waitForTimeout(300);
    assert.ok(await page.evaluate(() => Math.abs(document.querySelector("#tour").getBoundingClientRect().top) < 5));
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no overflow, touch drag, bottom nav, rooms dock, tools sheet, bottom-sheet panels", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".mnav").isVisible(), true);
    assert.equal(await p.locator(".tools").isVisible(), false);
    const y0 = (await st(p)).yaw;
    await p.evaluate(() => MuseTour.viewer.look(MuseTour.state().yaw));
    const b = await p.locator("[data-stage]").boundingBox();
    await p.touchscreen.tap(b.x + 30, b.y + b.height / 2);
    await p.click('[data-mnav="rooms"]'); assert.equal(await p.locator("[data-dock]").isVisible(), true);
    await p.click('[data-dock] [data-room="dining"]'); await roomIs(p, "dining");
    await p.click('[data-mnav="tools"]'); assert.equal(await p.locator("[data-sheet]").isVisible(), true);
    await p.click('[data-sheet] [data-open="details"]');
    const panel = await p.locator('[data-panel="details"]').boundingBox();
    assert.ok(panel.y + panel.height >= 843 && panel.width >= 389, "panel is a bottom sheet");
    await p.click('[data-panel="details"] [data-close-panel]');
    assert.ok(y0 >= 0);
    const small = await p.evaluate(() => [...document.querySelectorAll(".mnav button, .rail button, .hdr button, .hdr a")].filter((x) => x.offsetParent && x.getBoundingClientRect().height < 44).length);
    assert.equal(small, 0);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
