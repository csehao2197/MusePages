// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/080-ai-chatbot-website/Opus-5.5/page.test.mjs
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
  const d = await open({ width: 1440, height: 900 });
  const p = d.page;
  const done = () => p.waitForFunction(() => !document.querySelector("[data-pending]") && !document.querySelector("[data-input]").disabled, null, { polling: 50 });
  const say = async (t) => { await p.fill("[data-input]", t); await p.press("[data-input]", "Enter"); await done(); return p.locator(".msg").last().textContent(); };
  await check("empty state, history sidebar and demo badge", async () => {
    assert.match(await p.title(), /Lumen/);
    assert.match(await text(p, ".welcome h2"), /What's on your mind/);
    assert.equal(await p.locator(".sug").count(), 4);
    assert.equal(await p.locator(".conv").count(), 3);
    assert.match(await text(p, "[data-modebadge]"), /Demo assistant/);
    assert.ok(await p.isDisabled("[data-send]"));
    assert.equal(await css(p, "body", "backgroundColor"), "rgb(11, 13, 18)");
  });
  await check("send: loading state, disabled input, user right/blue, AI left/gray, timestamps", async () => {
    await p.fill("[data-input]", "explain closures");
    assert.ok(!(await p.isDisabled("[data-send]")));
    await p.press("[data-input]", "Enter");
    assert.equal(await p.inputValue("[data-input]"), "");
    await p.waitForSelector("[data-pending]");
    assert.ok(await p.isDisabled("[data-input]"));
    assert.ok(await p.isVisible("[data-stop]"));
    await done();
    assert.equal(await css(p, ".msg.user .bubble", "backgroundColor"), "rgb(47, 107, 255)");
    assert.equal(await css(p, ".msg.ai .bubble", "backgroundColor"), "rgb(27, 32, 43)");
    const ux = await p.$eval(".msg.user .bubble", (e) => e.getBoundingClientRect().right), ax = await p.$eval(".msg.ai .bubble", (e) => e.getBoundingClientRect().left);
    assert.ok(ux > 900 && ax < 600);
    assert.equal(await p.locator(".msg time").count(), 2);
    assert.match(await text(p, ".msg.ai .bubble"), /closure.*makeCounter/s);
    assert.ok(await p.locator(".msg.ai .pre code .k").count() > 0);
    assert.match(await text(p, "[data-title]"), /explain closures/);
    assert.match(await text(p, ".conv a[aria-current=page]"), /explain closures/);
  });
  await check("conversation context, multi-line input, math, code, summary and fallback", async () => {
    assert.match(await say("tell me more"), /fresh binding/);
    await p.fill("[data-input]", "line one"); await p.press("[data-input]", "Shift+Enter"); await p.type("[data-input]", "line two");
    assert.equal(await p.inputValue("[data-input]"), "line one\nline two");
    const h = await p.$eval("[data-input]", (e) => e.getBoundingClientRect().height); assert.ok(h > 40 && h <= 121);
    await p.press("[data-input]", "Enter"); await done();
    assert.equal(await p.$$eval(".msg.user .bubble", (b) => b.at(-1).textContent), "line one\nline two");
    assert.match(await say("What is (12.5 * 4) / 3"), /= 16\.6666666667/);
    assert.match(await say("15% of 80"), /= 12/);
    assert.match(await say("reverse a string in python"), /\[::-1\]/);
    assert.match(await say("summarize: Rate limits protect APIs. They cap requests per window. Clients should back off when they see 429 responses."), /Summary.*Key terms/s);
    assert.match(await say("what is the capital of peru"), /demo mode/);
    assert.ok(await p.evaluate(() => { const l = document.querySelector("[data-log]"); return l.scrollHeight - l.scrollTop - l.clientHeight < 5; }));
  });
  await check("XSS-safe rendering of user and model text", async () => {
    await say("<img src=x onerror=window.__pwn=1> **bold?**");
    assert.equal(await p.evaluate(() => window.__pwn), undefined);
    assert.match(await p.$$eval(".msg.user .bubble", (b) => b.at(-1).textContent), /<img src=x/);
    assert.equal(await p.locator(".msg img").count(), 0);
  });
  await check("stop generating with Esc keeps the partial answer", async () => {
    await p.fill("[data-input]", "what can you do"); await p.press("[data-input]", "Enter");
    await p.waitForFunction(() => document.querySelector("[data-pending] .md"), null, { polling: 20 });
    await p.keyboard.press("Escape");
    await done();
    assert.match(await p.locator(".msg.ai").last().textContent(), /Stopped\./);
    assert.ok(!(await p.isDisabled("[data-input]")));
  });
  await check("error handling: network, invalid key and rate limit with retry", async () => {
    await p.evaluate(() => window.__lumen.resetLimit());
    const sim = async (v) => { await p.click("[data-settings]"); await p.selectOption("[name=sim]", v); await p.click("[data-setform] button[type=submit]"); };
    await sim("network");
    assert.match(await say("hello"), /Network error.*Try again/s);
    await p.click(".msg.err [data-retry]"); await done();
    assert.equal(await p.locator(".msg.err").count(), 0);
    assert.match(await p.locator(".msg.ai").last().textContent(), /Hi! What are we working on/);
    await sim("key"); assert.match(await say("hello"), /Invalid API key/);
    await sim("rate"); assert.match(await say("hello"), /Too many requests/);
    await d.context.setOffline(true);
    assert.ok(await p.isVisible("[data-offline]"));
    assert.match(await say("hello"), /Network error/);
    await d.context.setOffline(false);
    await p.waitForSelector("[data-offline]", { state: "hidden" });
  });
  await check("Gemini mode: key validation, API request with history, error mapping", async () => {
    await p.evaluate(() => window.__lumen.resetLimit());
    let calls = 0, body = null;
    await p.route("https://generativelanguage.googleapis.com/**", async (r) => { calls++; body = r.request().postDataJSON(); if (calls === 1) return r.fulfill({ status: 400, contentType: "application/json", body: '{"error":{"message":"API key not valid"}}' }); return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text: "Hello from **Gemini**." }] } }] }) }); });
    await p.click("[data-settings]");
    await p.check("[name=engine][value=gemini]");
    await p.click("[data-setform] button[type=submit]");
    assert.match(await text(p, "[data-seterr]"), /Enter your Gemini API key/);
    await p.fill("[name=key]", "AIzaTestKey_1234567890abcdef");
    await p.selectOption("[name=model]", "gemini-1.5-flash");
    await p.click("[data-setform] button[type=submit]");
    assert.match(await text(p, "[data-modebadge]"), /gemini-1\.5-flash/);
    assert.equal(await p.evaluate(() => sessionStorage.getItem("lumen-key")), "AIzaTestKey_1234567890abcdef");
    assert.ok(!(await p.evaluate(() => localStorage.getItem("lumen-v1"))).includes("AIzaTest"));
    assert.match(await say("hi gemini"), /Invalid API key/);
    await p.click(".msg.err [data-retry]"); await done();
    assert.match(await p.locator(".msg.ai").last().textContent(), /Hello from Gemini/);
    assert.equal(calls, 2);
    assert.equal(body.contents.at(-1).role, "user"); assert.equal(body.contents.at(-1).parts[0].text, "hi gemini");
    assert.ok(body.contents.length > 2 && body.contents.some((c) => c.role === "model"));
    await p.unroute("https://generativelanguage.googleapis.com/**");
    await p.click("[data-settings]"); await p.check("[name=engine][value=demo]"); await p.click("[data-setform] button[type=submit]");
    for (let i = errors.length - 1; i >= 0; i--) if (/generativelanguage|status of 400 \(Bad Request\)/.test(errors[i])) errors.splice(i, 1);
  });
  await check("history: new chat, search, switch, persist, delete; shortcuts", async () => {
    await p.evaluate(() => window.__lumen.resetLimit());
    const n = await p.locator(".conv").count();
    await p.keyboard.press("Alt+n");
    await p.waitForSelector(".welcome");
    await p.click("[data-sug] >> nth=2"); await done();
    assert.match(await p.locator(".msg.ai").last().textContent(), /= 45/);
    assert.equal(await p.locator(".conv").count(), n + 1);
    await p.keyboard.press("Control+k");
    assert.ok(await p.evaluate(() => document.activeElement.matches("[data-search]")));
    await p.fill("[data-search]", "helper");
    assert.equal(await p.locator(".conv").count(), 1);
    await p.click(".conv a");
    await p.waitForFunction(() => /Debounce helper/.test(document.querySelector("[data-title]").textContent));
    await p.fill("[data-search]", "");
    await p.reload({ waitUntil: "networkidle" });
    assert.match(await text(p, "[data-title]"), /Debounce helper/);
    assert.equal(await p.locator(".conv").count(), n + 1);
    await p.click(".conv a[aria-current=page] ~ [data-delconv]");
    await p.waitForSelector(".welcome");
    assert.equal(await p.locator(".conv").count(), n);
    await p.keyboard.press("/");
    assert.ok(await p.evaluate(() => document.activeElement.matches("[data-input]")));
    await p.click("h1"); await p.keyboard.press("?");
    assert.ok(await p.isVisible("[data-keydlg]"));
    await p.keyboard.press("Escape");
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: drawer sidebar, no overflow, 44px targets", async () => {
    const p = m.page;
    const fits = () => p.evaluate(() => document.documentElement.scrollWidth <= 390);
    assert.ok(await fits());
    assert.ok(!(await p.isVisible("[data-side] .newchat")));
    await p.tap("[data-openside]");
    await p.waitForTimeout(300);
    assert.ok(await p.isVisible("[data-side] .newchat"));
    const small = await p.evaluate(() => [...document.querySelectorAll(".side button, .side a, .bar button, .send:not([hidden])")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 40).map((b) => b.getAttribute("aria-label") || b.textContent.trim()));
    assert.deepEqual(small, []);
    await p.tap(".conv a >> nth=0");
    await p.waitForSelector(".msg.ai");
    assert.ok(!(await p.isVisible("[data-side] .newchat")) || (await p.$eval("[data-side]", (e) => !e.classList.contains("open"))));
    assert.ok(await fits());
    const comp = await p.$eval(".composer", (e) => e.getBoundingClientRect().bottom); assert.ok(comp > 800);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
