// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/062-api-documentation-website/Opus-5.5/page.test.mjs
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
  const { context, page } = await open({ width: 1440, height: 900 });
  await check("header: logo, version selector, search, status, dark toggle, Get API Key; sidebar with collapsible groups", async () => {
    assert.match(await text(page, ".logo"), /Tasklane\s*\/\s*API Reference/);
    assert.equal(await page.locator("[data-version] option").count(), 3);
    assert.match(await text(page, "[data-status]"), /API Status: Operational/);
    for (const g of ["Getting Started", "Core Resources", "Webhooks", "SDKs & Libraries", "Guides"]) assert.ok((await text(page, "[data-nav]")).includes(g), g);
    assert.equal(await page.locator(".grp").count(), 6);
    await page.click(".grp:nth-child(1) > button"); assert.ok(await page.$eval(".grp:nth-child(1)", (e) => e.classList.contains("closed")));
    assert.equal(await page.getAttribute(".grp:nth-child(1) > button", "aria-expanded"), "false");
    await page.click(".grp:nth-child(1) > button");
    assert.equal((await css(page, ".layout", "gridTemplateColumns")).split(" ")[0], "260px");
  });
  await check("sections: quick start, auth, errors, rate limits, pagination, endpoints, webhooks, changelog badges, SDKs, support", async () => {
    assert.equal(await page.locator(".steps li").count(), 3);
    for (const id of ["introduction", "quick-start", "authentication", "errors", "rate-limits", "pagination", "filtering", "batch-operations", "users", "list-users", "get-user", "create-user", "update-user", "delete-user", "webhooks-setup", "webhooks-events", "webhooks-payloads", "webhooks-security", "sdk-javascript", "sdk-go", "changelog", "support"]) assert.equal(await page.locator(`#${id}`).count(), 1, id);
    assert.match(await text(page, "#errors"), /400[\s\S]*401[\s\S]*404[\s\S]*429[\s\S]*500/);
    assert.equal(await page.locator(".events li").count(), 11);
    assert.equal(await page.locator(".chg .badge.br").count(), 1); assert.equal(await page.locator(".chg .badge.dep").count(), 1);
    assert.match(await text(page, ".support"), /Developer community[\s\S]*Stack Overflow[\s\S]*Support email[\s\S]*Status page/);
    assert.notEqual(await css(page, ".m.GET", "backgroundColor"), await css(page, ".m.DELETE", "backgroundColor"));
  });
  await check("syntax highlighting (URLs not comments); language tabs switch every example and persist", async () => {
    assert.ok(await page.locator("#get-user .t-s").count() > 0);
    assert.equal(await page.locator('[data-snip="get-user"] .t-c').count(), 0);
    assert.match(await text(page, '[data-snip="get-user"]'), /^curl -X GET "https:\/\/api\.tasklane\.example\/v2\/users\/usr_123"/);
    await page.click('#get-user [data-lang-tab="python"]');
    assert.match(await text(page, '[data-snip="get-user"]'), /import requests[\s\S]*requests\.get\(/);
    assert.match(await text(page, '[data-snip="create-user"]'), /requests\.post\([\s\S]*json=/);
    assert.equal(await page.getAttribute('#create-user [data-lang-tab="python"]', "aria-selected"), "true");
    await page.click('#get-user [data-lang-tab="go"]'); assert.match(await text(page, '[data-snip="get-user"]'), /http\.NewRequest\("GET"/);
    await page.click('#get-user [data-lang-tab="php"]'); assert.match(await text(page, '[data-snip="create-user"]'), /GuzzleHttp[\s\S]*'json' => \[/);
    await page.click('#get-user [data-lang-tab="ruby"]'); assert.match(await text(page, '[data-snip="update-user"]'), /Net::HTTP::Put/);
    await page.click('#get-user [data-lang-tab="js"]'); assert.match(await text(page, '[data-snip="get-user"]'), /await fetch\(/);
    assert.equal(await page.evaluate(() => localStorage.getItem("tl-lang")), "js");
    await page.click('#get-user [data-lang-tab="curl"]');
  });
  await check("copy button copies code and shows Copied", async () => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.click("#get-user [data-tabs-for] [data-copy]");
    await page.waitForTimeout(200);
    assert.match(await text(page, "#get-user [data-tabs-for] [data-copy]"), /Copied/);
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /curl -X GET/);
  });
  await check("playground: simulated 200, 404 unknown id, 401 bad key, 400 invalid JSON, create then retrieve, live snippet", async () => {
    await page.click("[data-try=get-user]");
    const send = async () => { await page.click("[data-send=get-user]"); await page.waitForTimeout(400); return text(page, "[data-out=get-user]"); };
    assert.match(await send(), /^200[\s\S]*simulated[\s\S]*"name": "Ada Lovelace"/);
    await page.fill('[data-pg=get-user] [data-pf="id"]', "usr_999"); assert.match(await text(page, '[data-snip="get-user"]'), /users\/usr_999/);
    assert.match(await send(), /^404[\s\S]*resource_missing/);
    await page.fill('[data-pg=get-user] [data-pf="__key"]', "nope"); assert.match(await send(), /^401[\s\S]*invalid_api_key/);
    await page.click("[data-try=create-user]"); await page.fill('[data-pg=create-user] [data-pf="__body"]', "{bad"); await page.click("[data-send=create-user]"); await page.waitForTimeout(400);
    assert.match(await text(page, "[data-out=create-user]"), /^400[\s\S]*invalid_json/);
    await page.click("[data-reset=create-user]"); await page.click("[data-send=create-user]"); await page.waitForTimeout(400);
    const out = await text(page, "[data-out=create-user]"); assert.match(out, /^201[\s\S]*"email": "linus@example\.com"/);
    const id = out.match(/"id": "(usr_\d+)"/)[1];
    await page.fill('[data-pg=get-user] [data-pf="__key"]', "tl_test_demo"); await page.fill('[data-pg=get-user] [data-pf="id"]', id);
    assert.match(await send(), /Linus Ng/);
  });
  await check("Get API Key dialog creates a tl_test_ key and applies it to examples", async () => {
    await page.click("[data-getkey]");
    const k = await page.inputValue("[data-keyval]"); assert.match(k, /^tl_test_[a-z0-9]{18}$/);
    await page.click("[data-usekey]"); assert.equal(await page.evaluate(() => document.querySelector("dialog").open), false);
    assert.ok((await text(page, '[data-snip="list-users"]')).includes(k));
    assert.equal(await page.evaluate(() => localStorage.getItem("tl-key")), k);
  });
  await check("version selector rewrites paths and shows deprecation banner; switch back to latest", async () => {
    await page.selectOption("[data-version]", "1");
    assert.equal(await page.isVisible("[data-ver-banner]"), true); assert.match(await text(page, "[data-ver-banner]"), /deprecated/);
    assert.match(await text(page, "#get-user .path"), /^\/v1\/users/); assert.match(await text(page, "#versioning"), /retired on June 30, 2027/);
    await page.click("[data-latest]"); assert.equal(await page.isVisible("[data-ver-banner]"), false); assert.match(await text(page, "#get-user .path"), /^\/v2\//);
  });
  await check("search: / focuses, highlighted results, Enter navigates; dark mode persists; status dialog", async () => {
    await page.click("h1"); await page.keyboard.press("/");
    assert.equal(await page.evaluate(() => document.activeElement.hasAttribute("data-q")), true);
    await page.keyboard.type("webhook");
    assert.ok(await page.locator("[data-res] [data-hit]").count() >= 3); assert.ok(await page.locator("[data-res] mark").count() > 0);
    await page.fill("[data-q]", "delete a"); await page.keyboard.press("Enter"); await page.waitForTimeout(1200);
    await page.waitForFunction(() => Math.abs(document.getElementById("delete-user").getBoundingClientRect().top - 76) < 8, null, { timeout: 4000 });
    await page.fill("[data-q]", "zzzz"); assert.match(await text(page, "[data-res]"), /No results/);
    await page.keyboard.press("Escape");
    const light = await css(page, "body", "backgroundColor");
    await page.click("[data-theme-btn]"); assert.equal(await page.getAttribute("html", "data-theme"), "dark");
    assert.notEqual(await css(page, "body", "backgroundColor"), light);
    await page.reload({ waitUntil: "networkidle" }); assert.equal(await page.getAttribute("html", "data-theme"), "dark");
    await page.click("[data-theme-btn]"); assert.equal(await page.getAttribute("html", "data-theme"), null);
    await page.click("[data-status]"); assert.match(await text(page, "[data-dlg-body]"), /REST API[\s\S]*Webhooks[\s\S]*Sample status data/); await page.click("[data-close]");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, drawer nav opens and closes on link, single column, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    await p.click("[data-burger]"); assert.ok(await p.$eval("[data-side]", (e) => e.classList.contains("open")));
    await p.click('[data-link="errors"]'); await p.waitForTimeout(400);
    assert.ok(!(await p.$eval("[data-side]", (e) => e.classList.contains("open"))));
    assert.ok(await p.$eval("#errors", (e) => Math.abs(e.getBoundingClientRect().top) < 120));
    assert.equal((await css(p, ".layout", "gridTemplateColumns")).split(" ").length, 1);
    const small = await p.evaluate(() => [...document.querySelectorAll(".icon-btn, .btn, .ver select, .search input, .tabs button, .copy, .btn-o, details.resp > summary, .support a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
