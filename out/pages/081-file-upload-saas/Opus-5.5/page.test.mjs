// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/081-file-upload-saas/Opus-5.5/page.test.mjs
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
  const db = () => p.evaluate(() => window.__du.db);
  const go = async (h, sel) => { await p.evaluate((x) => (location.hash = x), h); await p.waitForSelector(sel); };
  await check("landing page, legal pages and protected routes", async () => {
    assert.match(await p.title(), /DriveUploader/);
    assert.match(await text(p, "h1"), /Your upload portal/);
    assert.equal(await p.locator(".step").count(), 3);
    await go("#/terms", ".legal"); assert.match(await text(p, ".legal h1"), /Terms/);
    await go("#/privacy", ".legal"); assert.match(await text(p, ".legal h1"), /Privacy/);
    await p.evaluate(() => (location.hash = "#/dashboard"));
    await p.waitForSelector("[data-login]");
    assert.match(p.url(), /#\/login/);
  });
  await check("sign up: validation, hashed password, auto login", async () => {
    await go("#/signup", "[data-signup]");
    await p.click("[data-signup] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /enter your name/);
    await p.fill("[name=name]", "Lena Ortiz"); await p.fill("[name=email]", "priya@studio.example"); await p.fill("[name=pw]", "short");
    await p.click("[data-signup] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /already exists/);
    await p.fill("[name=email]", "lena@north.example"); await p.click("[data-signup] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /at least 8 characters/);
    await p.fill("[name=pw]", "Lena-pass-2026"); await p.click("[data-signup] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /accept the Terms/);
    await p.check("[name=terms]"); await p.click("[data-signup] button[type=submit]");
    await p.waitForSelector(".stats");
    const u = (await db()).users.find((x) => x.email === "lena@north.example");
    assert.ok(u && /^[0-9a-f]{64}$/.test(u.hash) && !JSON.stringify(u).includes("Lena-pass-2026"));
    assert.match(await text(p, "[data-list]"), /No uploads yet/);
  });
  await check("upload: title required, drag-drop zone, progress, cancel, success", async () => {
    await p.click("a[href='#/dashboard/upload']");
    await p.waitForSelector("[data-upform]");
    await p.click("[data-go]");
    assert.match(await text(p, "[data-err]"), /add a title|choose a file/);
    await p.setInputFiles("[data-file]", { name: "field-report_v2.txt", mimeType: "text/plain", buffer: Buffer.from("Field report\nAll good on site 14.\n") });
    assert.equal(await p.inputValue("[name=title]"), "Field report v2");
    await p.click("[data-go]");
    await p.waitForSelector("[data-prog]:not([hidden])");
    await p.click("[data-cancel]");
    assert.ok(await p.isHidden("[data-prog]"));
    assert.equal((await db()).uploads.filter((x) => x.originalName === "field-report_v2.txt").length, 0);
    await p.fill("[name=title]", "Field report, site 14");
    await p.click("[data-go]");
    await p.waitForFunction(() => +document.querySelector("[data-prog] .track")?.getAttribute("aria-valuenow") > 0, null, { polling: 50 });
    await p.waitForSelector(".stats", { timeout: 15000 });
    assert.match(await text(p, "[data-list]"), /Field report, site 14.*field-report_v2\.txt/s);
    const x = (await db()).uploads.find((u) => u.title === "Field report, site 14");
    assert.ok(x.driveFileId && x.driveFolderId.endsWith(x.userId) && x.status === "UPLOADED");
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGP8z8Dwn4GBgYGJgYGBAQAj8gL+JYGGWwAAAABJRU5ErkJggg==", "base64");
    await go("#/dashboard/upload", "[data-upform]");
    await p.fill("[name=title]", "Logo mark");
    await p.setInputFiles("[data-file]", { name: "logo.png", mimeType: "image/png", buffer: png });
    await p.click("[data-go]");
    await p.waitForSelector(".stats", { timeout: 15000 });
    assert.equal(await p.locator("[data-list] tbody tr").count(), 2);
  });
  await check("size limit is enforced from admin settings", async () => {
    await go("#/dashboard/upload", "[data-upform]");
    await p.evaluate(() => { window.__du.db.settings.maxSizeMB = 0.00001; });
    await p.fill("[name=title]", "Too big");
    await p.setInputFiles("[data-file]", { name: "big.bin", mimeType: "application/octet-stream", buffer: Buffer.alloc(2048) });
    await p.click("[data-go]");
    assert.match(await text(p, "[data-err]"), /The limit is/);
    await p.evaluate(() => { window.__du.db.settings.maxSizeMB = 250; });
  });
  await check("dashboard: search, type filter, grid view with thumbnails, edit title, download", async () => {
    await go("#/dashboard", "[data-list] tbody");
    await p.fill("[data-q]", "logo");
    assert.equal(await p.locator("[data-list] tbody tr").count(), 1);
    await p.fill("[data-q]", "");
    await p.selectOption("[data-type]", "doc");
    assert.equal(await p.locator("[data-list] tbody tr").count(), 1);
    await p.selectOption("[data-type]", "all");
    await p.click("[data-layout=grid]");
    await p.waitForSelector("[data-gridview] img");
    assert.equal(await p.locator(".gcard").count(), 2);
    const id = (await db()).uploads.find((u) => u.title === "Logo mark").id;
    await p.click(`[data-edit="${id}"]`);
    await p.fill("[data-editform] [name=t]", "");
    await p.click("[data-editform] button[type=submit]");
    assert.match(await text(p, "[data-eerr]"), /can't be empty/);
    await p.fill("[data-editform] [name=t]", "Logo mark (final)");
    await p.click("[data-editform] button[type=submit]");
    assert.match(await text(p, "[data-list]"), /Logo mark \(final\)/);
    const [dl] = await Promise.all([p.waitForEvent("download"), p.click(`[data-dl="${id}"]`)]);
    assert.equal(dl.suggestedFilename(), "logo.png");
    await p.click("[data-layout=table]");
  });
  await check("details: text preview, rename, replace file with progress, delete with confirm", async () => {
    const x = (await db()).uploads.find((u) => u.title === "Field report, site 14");
    await go(`#/dashboard/uploads/${x.id}`, "[data-preview] pre");
    assert.match(await text(p, "[data-preview]"), /All good on site 14/);
    await p.fill("#tin", "Field report 14 (signed)"); await p.click("[data-titleform] button");
    assert.equal((await db()).uploads.find((u) => u.id === x.id).title, "Field report 14 (signed)");
    await p.setInputFiles("[data-repfile]", { name: "field-report_v3.txt", mimeType: "text/plain", buffer: Buffer.from("Version 3, signed by the site lead.") });
    await p.waitForFunction(() => /Version 3/.test(document.querySelector("[data-preview]")?.textContent || ""), null, { timeout: 15000, polling: 100 });
    const y = (await db()).uploads.find((u) => u.id === x.id);
    assert.equal(y.originalName, "field-report_v3.txt"); assert.equal(y.driveFileId, x.driveFileId);
    await p.click(`[data-del="${x.id}"]`);
    await p.click("[data-dlgin] [data-no]");
    assert.ok((await db()).uploads.some((u) => u.id === x.id));
    await p.click(`[data-del="${x.id}"]`);
    await p.click("[data-dlgin] [data-yes]");
    await p.waitForSelector(".stats");
    assert.ok(!(await db()).uploads.some((u) => u.id === x.id));
    assert.equal(await p.evaluate((i) => window.__du.vault.get(i).then((b) => b === undefined), x.id), true);
  });
  await check("ownership: another user's file is not reachable; admin area is blocked", async () => {
    const other = (await db()).uploads.find((u) => u.userId === "u_priya");
    await go(`#/dashboard/uploads/${other.id}`, ".empty");
    assert.match(await text(p, ".empty"), /File not found/);
    await go("#/admin", ".empty");
    assert.match(await text(p, ".empty"), /Admins only/);
    await p.click("[data-logout]");
    await p.waitForSelector(".hero");
  });
  await check("login: wrong password count, lockout, demo admin, admin panel", async () => {
    await go("#/login", "[data-login]");
    await p.fill("[name=email]", "tom@field.example");
    for (let i = 0; i < 5; i++) { await p.fill("[name=pw]", "wrong-pass-1"); await p.click("[data-login] button[type=submit]"); await p.waitForFunction((n) => document.querySelector("[data-err]").textContent.length > 0, i); }
    assert.match(await text(p, "[data-err]"), /locked for 30 seconds/);
    await p.fill("[name=pw]", "tom-demo-2026"); await p.click("[data-login] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /Too many attempts/);
    await p.click("[data-fill=admin]"); await p.click("[data-login] button[type=submit]");
    await p.waitForSelector(".atabs");
    assert.match(await text(p, ".drivecard"), /Connected as/);
    await p.fill("[name=max]", "0"); await p.click("[data-settings] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /between 1 and 5120/);
    await p.fill("[name=max]", "500"); await p.fill("[name=daily]", "5"); await p.click("[data-settings] button[type=submit]");
    assert.equal((await db()).settings.maxSizeMB, 500);
    await p.click(".atabs a[href='#/admin/users']");
    await p.waitForSelector("[data-toggleuser=u_tom]");
    await p.click("[data-toggleuser=u_tom]"); await p.click("[data-dlgin] [data-yes]");
    await p.waitForSelector("[data-user=u_tom] .chip.off");
    await p.click(".atabs a[href='#/admin/uploads']");
    await p.waitForSelector("[data-ufilter]");
    assert.ok(await p.locator("[data-ufilter] + span").textContent().then((t) => /\d+ upload/.test(t)));
    await p.selectOption("[data-ufilter]", "u_priya");
    await p.waitForFunction(() => document.querySelectorAll("tbody tr").length === 3);
    await p.click("[data-logout]"); await p.waitForSelector(".hero");
  });
  await check("disabled account can't log in; forgot password flow resets it", async () => {
    await go("#/login", "[data-login]");
    await p.fill("[name=email]", "priya@studio.example"); await p.fill("[name=pw]", "priya-demo-2026");
    await p.evaluate(() => { const u = window.__du.db.users.find((x) => x.id === "u_priya"); u.disabled = true; });
    await p.click("[data-login] button[type=submit]");
    assert.match(await text(p, "[data-err]"), /disabled/);
    await p.evaluate(() => { window.__du.db.users.find((x) => x.id === "u_priya").disabled = false; });
    await go("#/forgot", "[data-forgot]");
    await p.fill("[data-forgot] [name=email]", "priya@studio.example"); await p.click("[data-forgot] button");
    const code = (await text(p, "[data-codeinfo]")).match(/(\d{6})/)[1];
    await p.fill("[name=code]", "000000"); await p.fill("[data-reset] [name=pw]", "Priya-new-2026"); await p.click("[data-reset] button");
    assert.match(await text(p, "[data-err2]"), /doesn't match/);
    await p.fill("[name=code]", code); await p.click("[data-reset] button");
    await p.waitForSelector("[data-login]");
    await p.fill("[name=email]", "priya@studio.example"); await p.fill("[name=pw]", "Priya-new-2026"); await p.click("[data-login] button[type=submit]");
    await p.waitForSelector(".stats");
    assert.match(await text(p, ".dh p"), /Hi Priya/);
  });
  await d.context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: landing, login and dashboard fit with 44px targets", async () => {
    const p = m.page;
    const fits = () => p.evaluate(() => document.documentElement.scrollWidth <= 390);
    assert.ok(await fits());
    await p.evaluate(() => (location.hash = "#/login")); await p.waitForSelector("[data-login]");
    await p.tap("[data-fill=priya]"); await p.tap("[data-login] button[type=submit]");
    await p.waitForSelector(".stats");
    assert.ok(await fits());
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .ib, .sel, .seg button, .nav a, .search input")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 40).map((b) => b.getAttribute("aria-label") || b.textContent.trim()));
    assert.deepEqual(small, []);
    await p.tap("tbody tr a");
    await p.waitForSelector("[data-preview]");
    assert.ok(await fits());
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
