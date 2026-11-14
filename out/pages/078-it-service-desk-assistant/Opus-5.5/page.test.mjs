// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/078-it-service-desk-assistant/Opus-5.5/page.test.mjs
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
  await d.context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(server.url).origin });
  const lastAi = () => p.locator(".m-ai[data-msg]").last();
  const ask = async (q) => { const n = await p.locator(".m-ai[data-msg]").count(); await p.fill("#ask", q); await p.press("#ask", "Enter"); await p.waitForFunction((k) => document.querySelectorAll(".m-ai[data-msg]").length > k, n, { polling: 100 }); return (await lastAi().textContent()); };
  await check("landing: hero, ticket context and origin-checked handshake", async () => {
    assert.match(await p.title(), /TicketWise/);
    assert.match(await text(p, "[data-ticket] h3"), /Outlook keeps asking for password/);
    assert.equal(await p.locator(".notes li").count(), 5);
    await p.waitForFunction(() => /Authenticated as Jordan Lee/.test(document.querySelector("[data-log]").textContent), null, { polling: 100 });
    assert.match(await text(p, "[data-who]"), /Jordan Lee/);
    assert.match(await text(p, "[data-rate]"), /30\/30/);
    assert.equal(await p.locator(".cmd").count(), 9);
    assert.match(await text(p, ".t-meta"), /1 day(?!s)/);
  });
  await check("slash autocomplete filters, navigates with arrows and runs on Enter", async () => {
    await p.fill("#ask", "/");
    await p.dispatchEvent("#ask", "input");
    assert.equal(await p.locator("[data-ac] [role=option]").count(), 9);
    await p.fill("#ask", "/s"); await p.dispatchEvent("#ask", "input");
    assert.deepEqual(await p.$$eval("[data-ac] [role=option] b", (b) => b.map((x) => x.textContent)), ["/summary", "/suggest", "/similar"]);
    assert.equal(await p.getAttribute("#ask", "aria-expanded"), "true");
    await p.press("#ask", "ArrowDown");
    assert.equal(await p.getAttribute("[data-ac] [aria-selected=true]", "data-cmd"), "/suggest");
    const n = await p.locator(".m-ai[data-msg]").count();
    await p.press("#ask", "Enter");
    await p.waitForFunction((k) => document.querySelectorAll(".m-ai[data-msg]").length > k, n, { polling: 100 });
    assert.match(await lastAi().textContent(), /Troubleshooting suggestions.*Quick win.*dsregcmd/s);
    assert.ok(await p.isHidden("[data-ac]"));
    await p.fill("#ask", "/es"); await p.dispatchEvent("#ask", "input"); await p.press("#ask", "Tab");
    assert.equal(await p.inputValue("#ask"), "/escalate ");
    await p.press("#ask", "Escape"); await p.fill("#ask", "");
  });
  await check("every command answers from the ticket data, rendered as markdown", async () => {
    assert.match(await ask("/summary"), /Issue:.*Current status:.*Impact:/s);
    assert.ok(await lastAi().locator("strong").count() >= 3);
    assert.match(await ask("/next"), /Recommended next steps.*Call Priya after 2 PM.*Escalate\?Not now/s);
    const sim = await ask("/similar");
    assert.match(sim, /#47702/); assert.match(sim, /#48102/); assert.doesNotMatch(sim, /#47811/); assert.match(sim, /older match skipped/);
    assert.ok(await lastAi().locator("table").count() >= 2);
    assert.match(await ask("/config"), /HDG-LT-014.*Microsoft 365 tenant/s);
    assert.match(await ask("/draft"), /Hi Priya,.*Kind regards.*Jordan Lee/s);
    assert.match(await ask("/escalate"), /Escalation notes.*Steps taken.*Evidence.*Ask/s);
    assert.match(await ask("/5whys"), /5 Whys.*Likely root cause/s);
    assert.equal(await lastAi().locator("ol li").count(), 5);
    assert.match(await ask("/nope"), /Unknown command/);
  });
  await check("free-text questions use contact, history and note search", async () => {
    assert.match(await ask("who should I call?"), /Priya Nair.*\(555\) 014-2231.*asked for a call/s);
    assert.match(await ask("what has been tried so far"), /Already tried.*Office quick repair/s);
    assert.match(await ask("anything about the payroll export"), /From the notes:.*payroll/s);
    assert.match(await ask("tell me about kangaroos"), /couldn't find that/);
  });
  await check("copy puts rich text and plain text on the clipboard", async () => {
    await lastAi().locator("[data-copy]").click();
    await p.waitForSelector(".copy.done");
    const plain = await p.evaluate(() => navigator.clipboard.readText());
    assert.match(plain, /couldn't find that/);
    await p.locator(".m-ai[data-msg]", { hasText: "Draft reply" }).locator("[data-copy]").click();
    await p.locator(".m-ai[data-msg]", { hasText: "Draft reply" }).locator(".copy.done").waitFor();
    const html = await p.evaluate(async () => { const items = await navigator.clipboard.read(); const b = await items[0].getType("text/html"); return b.text(); });
    assert.match(html, /<blockquote>.*Hi Priya,/s);
  });
  await check("history is per ticket and per session; /refresh clears it", async () => {
    const before = await p.locator(".m-ai[data-msg]").count();
    await p.selectOption("[data-ticketsel]", "47956");
    assert.match(await text(p, "[data-ticket]"), /Closed · Resolved/);
    assert.equal(await p.locator(".m-ai[data-msg]").count(), 0);
    assert.match(await ask("/summary"), /Resolution:.*HDG-Staff-Forms/s);
    await p.selectOption("[data-ticketsel]", "48213");
    assert.equal(await p.locator(".m-ai[data-msg]").count(), before);
    await p.reload({ waitUntil: "networkidle" });
    await p.waitForFunction(() => document.querySelectorAll(".m-ai[data-msg]").length > 0, null, { polling: 100 });
    assert.equal(await p.locator(".m-ai[data-msg]").count(), before);
    await p.fill("#ask", "/refresh"); await p.press("#ask", "Escape"); await p.press("#ask", "Enter");
    assert.equal(await p.locator(".m-ai[data-msg]").count(), 0);
    assert.match(await text(p, "[data-log]"), /Authenticated/);
  });
  await check("rate limit: 30 requests per minute then a clear error", async () => {
    await p.selectOption("[data-ticketsel]", "48231");
    assert.match(await text(p, "[data-rate]"), /\/30/);
    const used = 30 - parseInt(await text(p, "[data-rate]"), 10);
    for (let i = used; i < 30; i++) await ask("/config");
    assert.match(await text(p, "[data-rate]"), /^0\/30/);
    await p.fill("#ask", "/summary"); await p.press("#ask", "Escape"); await p.press("#ask", "Enter");
    await p.waitForSelector(".m-ai.err");
    assert.match(await text(p, ".m-ai.err"), /Rate limit reached.*30 requests per minute/s);
  });
  await check("Pod Mode Only guard and command cards run in the demo", async () => {
    await p.check("[data-standalone]");
    assert.ok(await p.isVisible("[data-podonly]"));
    assert.match(await text(p, "[data-podonly]"), /Pod Mode Only/);
    await p.uncheck("[data-standalone]");
    assert.ok(await p.isHidden("[data-podonly]"));
    await p.click(".cmd [data-run='/refresh']");
    assert.equal(await p.locator(".m-ai[data-msg]").count(), 0);
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: stacked host, no overflow, 44px targets, commands work", async () => {
    const p = m.page;
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390));
    const tk = await p.$eval("[data-ticket]", (e) => e.getBoundingClientRect()), pod = await p.$eval("[data-pod]", (e) => e.getBoundingClientRect());
    assert.ok(tk.bottom <= pod.top + 1);
    await p.tap("[data-quick] [data-run='/summary']");
    await p.waitForSelector(".m-ai[data-msg]");
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390));
    const small = await p.evaluate(() => [...document.querySelectorAll(".pod button, .tsel select, .send, .cmd button, .btn")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 40).map((b) => b.getAttribute("aria-label") || b.textContent.trim()));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
