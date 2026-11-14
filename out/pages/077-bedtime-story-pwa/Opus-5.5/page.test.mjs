// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/077-bedtime-story-pwa/Opus-5.5/page.test.mjs
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
  if (opts.init) await page.addInitScript(opts.init);
  page.on("dialog", (d) => d.accept());
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
  const ttsStub = () => {
    window.__spoken = [];
    const synth = { speaking: false, getVoices: () => [{ name: "Test Calm Voice", lang: "en-US" }], speak(u) { window.__spoken.push(u.text); setTimeout(() => { u.onstart?.(); setTimeout(() => u.onend?.(), 250); }, 50); }, cancel() {}, addEventListener() {} };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  };
  const d = await open({ width: 1440, height: 900 }, { init: ttsStub });
  const p = d.page;
  const db = () => p.evaluate(() => window.__dreamio.db);
  await check("home: hero, last-played card, playlist of seeded stories", async () => {
    assert.match(await p.title(), /Dreamio/);
    assert.equal(await p.locator("[data-grid] .story").count(), 3);
    assert.match(await text(p, ".tonight"), /The Moon Who Lost Her Hum/);
    assert.match(await text(p, "[data-count]"), /3 stories/);
    assert.equal(await p.getAttribute("[data-nav=home]", "aria-current"), "page");
  });
  await check("playlist sorts, filters by child and toggles favorites", async () => {
    await p.selectOption("[data-sort]", "old");
    assert.match(await text(p, "[data-grid] .story h3"), /Pip and the Cloud Whale/);
    await p.click("[data-cf=theo]");
    assert.equal(await p.locator("[data-grid] .story").count(), 1);
    assert.match(await text(p, "[data-grid] .story h3"), /Lighthouse/);
    await p.click("[data-cf=all]");
    await p.selectOption("[data-sort]", "fav");
    const pip = p.locator(".story", { hasText: "Pip and the Cloud Whale" });
    await pip.locator("[data-fav]").click();
    assert.equal(await pip.locator("[data-fav]").getAttribute("aria-pressed"), "true");
    assert.equal((await db()).stories.find((s) => s.title.startsWith("Pip")).fav, true);
    await p.selectOption("[data-sort]", "new");
  });
  await check("create: ideas and typed prompts build pages in a chat; draft survives reload", async () => {
    await p.click(".nav a[href='#/create']");
    await p.waitForSelector("[data-hero]");
    assert.equal(await p.getAttribute("[data-nav=create]", "aria-current"), "page");
    await p.selectOption("[data-hero]", "theo");
    await p.click("[data-idea] >> nth=0");
    await p.waitForSelector("[data-pages] p b");
    assert.equal(await p.locator("[data-pages] p").count(), 1);
    assert.match(await text(p, "[data-pages]"), /^Page 1Once upon a time.*Theo found a little dragon who is afraid of the dark/);
    await p.fill("#idea", "he flies to the moon on a paper boat");
    await p.press("#idea", "Enter");
    await p.waitForFunction(() => document.querySelectorAll("[data-pages] p").length === 2);
    assert.match(await text(p, "[data-msgs]"), /he flies to the moon on a paper boat/);
    assert.match(await text(p, "[data-dtitle]"), /Theo and the Little Dragon/);
    await p.fill("#idea", "x"); await p.press("#idea", "Enter");
    assert.match(await text(p, "[data-toasts]"), /few words/);
    await p.reload({ waitUntil: "networkidle" });
    assert.equal(await p.locator("[data-pages] p").count(), 2);
    await p.click("[data-finish]");
    await p.waitForURL(/#\/story\//);
    const st = (await db()).stories[0];
    assert.equal(st.scenes.length, 3); assert.equal(st.hero, "Theo"); assert.equal(st.childId, "theo");
    assert.match(st.scenes[2], /Goodnight, Theo\.$/);
    assert.equal(await text(p, "[data-title]"), st.title);
  });
  await check("create images: storyboard with one illustration per page and an optional photo", async () => {
    assert.equal(await p.locator("[data-board] .scene svg").count(), 0);
    await p.click('[data-look="pj"][data-c="#FF9DB5"]');
    await p.click("[data-mkimg]");
    await p.waitForFunction(() => document.querySelectorAll("[data-board] .scene svg").length === 3, null, { polling: 100 });
    await p.waitForSelector(".chip.ok >> text=Pictures");
    assert.match(await p.innerHTML("[data-board] .scene >> nth=0"), /#FF9DB5/);
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGP8z8Dwn4GBgYGJgYGBAQAj8gL+JYGGWwAAAABJRU5ErkJggg==", "base64");
    await p.setInputFiles("[data-photo]", { name: "kid.png", mimeType: "image/png", buffer: png });
    await p.waitForSelector(".photo img");
    await p.click("[data-mkimg]");
    await p.waitForFunction(() => document.querySelectorAll("[data-board] .scene svg image").length >= 2, null, { polling: 100 });
    await p.waitForSelector("[data-iprog][hidden]", { state: "attached" });
    await p.click("[data-rmphoto]");
    assert.equal(await p.locator(".photo img").count(), 0);
  });
  await check("generate voices and choose a soundtrack", async () => {
    await p.selectOption("[data-style]", "whisper");
    await p.fill("[data-instr]", "Slow down at the end");
    await p.click("[data-mkvoice]");
    await p.waitForSelector(".chip.ok >> text=Narration");
    const st = (await db()).stories[0];
    assert.deepEqual([st.voice.voice, st.voice.style, st.voice.instructions], ["Test Calm Voice", "whisper", "Slow down at the end"]);
    await p.selectOption("[data-track]", "stars");
    await p.click("[data-listen]");
    assert.equal(await p.evaluate(() => window.__dreamio.Music.key), "stars");
    await p.click("[data-listen]");
    assert.equal(await p.evaluate(() => window.__dreamio.Music.key), "");
    await p.click("[data-preview]");
    assert.ok((await p.evaluate(() => window.__spoken.length)) >= 1);
  });
  await check("player: slow-fade slides, subtitles, music and narration-synced auto advance", async () => {
    await p.click("[data-playlink]");
    await p.waitForSelector("[data-player]");
    assert.equal(await text(p, "[data-pnum]"), "Page 1 of 3");
    assert.equal(await p.evaluate(() => window.__dreamio.Music.key), "stars");
    assert.ok((await css(p, ".p-img", "transitionDuration")).startsWith("1.6"));
    await p.click("[data-cc]");
    assert.equal(await p.getAttribute("[data-cc]", "aria-pressed"), "false");
    assert.ok(await p.evaluate(() => document.querySelector("[data-sub]").classList.contains("off")));
    await p.click("[data-cc]");
    await p.click("[data-mus]"); assert.equal(await p.evaluate(() => window.__dreamio.Music.key), "");
    await p.click("[data-mus]");
    await p.click("[data-pp]");
    assert.equal(await p.getAttribute("[data-pp]", "aria-label"), "Pause narration");
    await p.waitForFunction(() => document.querySelector("[data-pnum]").textContent === "Page 2 of 3", null, { polling: 100, timeout: 6000 });
    await p.waitForSelector("[data-end]:not([hidden])", { timeout: 10000 });
    assert.match(await text(p, "[data-end]"), /Sweet dreams, Theo/);
    assert.ok(await p.evaluate(() => window.__spoken.length >= 4));
    await p.click("[data-again]");
    assert.equal(await text(p, "[data-pnum]"), "Page 1 of 3");
    await p.click("[data-pp]");
  });
  await check("player: manual paging for read-aloud stories, keyboard and segments", async () => {
    await p.goto(`${server.url}#/`, { waitUntil: "networkidle" });
    await p.locator(".story", { hasText: "Pip and the Cloud Whale" }).locator("a[aria-label^='Play']").click();
    await p.waitForSelector("[data-player]");
    assert.ok(await p.isDisabled("[data-pp]"));
    assert.match(await text(p, "[data-hint]"), /Generate voices/);
    await p.click("[data-next]"); assert.equal(await text(p, "[data-pnum]"), "Page 2 of 4");
    await p.keyboard.press("ArrowRight"); assert.equal(await text(p, "[data-pnum]"), "Page 3 of 4");
    await p.keyboard.press("ArrowLeft"); assert.equal(await text(p, "[data-pnum]"), "Page 2 of 4");
    await p.click("[data-go='3']"); assert.equal(await text(p, "[data-pnum]"), "Page 4 of 4");
    assert.match(await text(p, "[data-sub]"), /already asleep/);
    await p.click("[data-next]"); assert.ok(await p.isVisible("[data-end]"));
    await p.keyboard.press("Escape");
    await p.waitForURL(/#\/story\//);
    await p.waitForSelector("[data-player]", { state: "detached" });
  });
  await check("children profiles: add with validation and remove", async () => {
    await p.click("[data-kids]");
    assert.equal(await p.locator("[data-kidlist] li").count(), 2);
    await p.click("[data-addkid]"); assert.match(await text(p, "[data-kiderr]"), /enter a name/);
    await p.fill("[name=kname]", "mila"); await p.click("[data-addkid]"); assert.match(await text(p, "[data-kiderr]"), /already/);
    await p.fill("[name=kname]", "Ava"); await p.fill("[name=kage]", "7"); await p.click("[data-addkid]");
    assert.equal(await p.locator("[data-kidlist] li").count(), 3);
    await p.locator("[data-kidlist] li", { hasText: "Ava" }).locator("[data-rmkid]").click();
    assert.equal(await p.locator("[data-kidlist] li").count(), 2);
    await p.keyboard.press("Escape");
  });
  await check("delete story and persistence across reload", async () => {
    await p.goto(`${server.url}#/`, { waitUntil: "networkidle" });
    await p.locator(".story", { hasText: "Little Dragon" }).locator("h3 a").click();
    await p.click("[data-del]");
    await p.waitForURL(/#\/$/);
    await p.waitForSelector("[data-grid] .story");
    assert.equal(await p.locator("[data-grid] .story").count(), 3);
    await p.reload({ waitUntil: "networkidle" });
    assert.equal(await p.locator("[data-grid] .story").count(), 3);
    assert.equal(await p.locator(".story", { hasText: "Pip and the Cloud Whale" }).locator("[data-fav]").getAttribute("aria-pressed"), "true");
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true, init: ttsStub });
  await check("mobile: home, create and player fit 390px with 44px targets", async () => {
    const p = m.page;
    const fits = () => p.evaluate(() => document.documentElement.scrollWidth <= 390);
    const small = (sel) => p.evaluate((s) => [...document.querySelectorAll(s)].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.getAttribute("aria-label") || b.textContent.trim()), sel);
    assert.ok(await fits());
    assert.deepEqual(await small(".nav a, .nav-btn, .btn, .icon-btn, .sortsel"), []);
    await p.tap(".nav a[href='#/create']");
    await p.tap("[data-idea] >> nth=1");
    await p.waitForSelector("[data-pages] p b");
    assert.ok(await fits());
    await p.goto(`${server.url}#/`, { waitUntil: "networkidle" });
    await p.locator(".story").first().locator("a[aria-label^='Play']").tap();
    await p.waitForSelector("[data-player]");
    assert.ok(await fits());
    assert.ok(await p.evaluate(() => { const r = document.querySelector("[data-bar]").getBoundingClientRect(); return r.right <= 390 && r.left >= 0; }));
    assert.deepEqual(await small("[data-player] .icon-btn"), []);
    const fr = await p.$eval(".p-frame", (e) => e.getBoundingClientRect()), sub = await p.$eval("[data-sub]", (e) => e.getBoundingClientRect());
    assert.ok(fr.bottom <= sub.top + 1);
    await p.tap("[data-next]"); assert.equal(await text(p, "[data-pnum]"), "Page 2 of 6");
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
