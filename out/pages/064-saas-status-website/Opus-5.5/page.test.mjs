// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/064-saas-status-website/Opus-5.5/page.test.mjs
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
  await check("minimal header; green operational banner with degraded note and last-updated time", async () => {
    assert.match(await text(page, ".logo"), /CloudSync\s*Status/);
    assert.match(await text(page, "[data-goto-sub]"), /Subscribe to Updates/);
    assert.equal(await css(page, "[data-goto-sub]", "borderTopColor"), "rgb(59, 130, 246)");
    assert.match(await text(page, ".visit"), /Visit CloudSync/);
    assert.equal(await page.getAttribute("[data-banner]", "data-state"), "operational");
    assert.equal(await css(page, "[data-banner]", "backgroundColor"), "rgb(236, 253, 245)");
    assert.equal(await text(page, "[data-banner-text]"), "All Systems Operational");
    assert.match(await text(page, "[data-banner-sub]"), /Webhooks is reporting degraded performance/);
    assert.equal(await text(page, "[data-updated]"), "Last updated 2 minutes ago");
  });
  await check("component list: 10 rows, Webhooks degraded, expandable with sub-components and 7-day bars", async () => {
    const rows = await page.$$eval("[data-comp]", (b) => b.map((x) => [x.querySelector(".nm").textContent, x.querySelector(".st").textContent]));
    assert.equal(rows.length, 10);
    assert.deepEqual(rows.map((r) => r[0]), ["Web Application", "API (v2)", "Database Cluster", "File Storage & CDN", "Authentication Service", "Webhooks", "Email Delivery", "Search & Indexing", "Mobile API", "Background Jobs"]);
    assert.ok(rows.every(([n, s]) => (n === "Webhooks" ? s === "Degraded Performance" : s === "Operational")));
    assert.equal(await css(page, ".comps > li + li", "borderTopColor"), "rgb(229, 231, 235)");
    await page.click("[data-comp=hooks]"); assert.equal(await page.getAttribute("[data-comp=hooks]", "aria-expanded"), "true");
    assert.match(await text(page, "#cd-hooks"), /Delivery \(US-East\)\s*Degraded Performance[\s\S]*Retry queue\s*Operational/);
    assert.equal(await page.locator("#cd-hooks .d7 li").count(), 7); assert.match(await text(page, "#cd-hooks .d7 li:last-child"), /99\.06%[\s\S]*Fri/);
    await page.click("[data-comp=hooks]"); assert.equal(await page.isVisible("#cd-hooks"), false);
  });
  await check("90-day uptime: 90 bars per row, colors from incidents, computed summaries, 99.97% badge, hover + keyboard tooltip", async () => {
    assert.equal(await page.locator('[data-bars="api"][data-mode="d"] i').count(), 90);
    assert.match(await text(page, "[data-overall]"), /99\.97% over 90 days/);
    const s = await page.evaluate(() => window.__status); assert.ok(s.overall > 99.97 && s.overall < 99.98);
    assert.equal(await page.getAttribute('[data-bars="cdn"][data-mode="d"] i:nth-child(80)', "class"), "out");
    assert.equal(await page.getAttribute('[data-bars="db"][data-mode="d"] i:nth-child(85)', "class"), "mnt");
    assert.equal(await page.getAttribute('[data-bars="api"][data-mode="d"] i:nth-child(88)', "class"), "deg");
    assert.equal(await page.getAttribute('[data-bars="hooks"][data-mode="d"] i:nth-child(90)', "class"), "deg");
    assert.equal(await page.locator(".urow-h .pct").count(), 10); assert.match(await text(page, ".urow-h .pct"), /^99\.99% uptime$/);
    assert.equal(await css(page, ".urow-h .pct", "color"), "rgb(4, 120, 87)");
    await page.hover('[data-bars="cdn"][data-mode="d"] i:nth-child(80)');
    assert.equal(await page.isVisible("[data-tip]"), true); assert.match(await text(page, "[data-tip]"), /Mar 3, 2026[\s\S]*94\.44% uptime[\s\S]*File upload failures/);
    await page.focus('[data-bars="api"][data-mode="d"]'); assert.match(await text(page, "[data-tip]"), /Mar 13, 2026[\s\S]*100\.00% uptime[\s\S]*No incidents/);
    await page.keyboard.press("ArrowLeft"); await page.keyboard.press("ArrowLeft"); assert.match(await text(page, "[data-tip]"), /Mar 11, 2026[\s\S]*99\.68% uptime[\s\S]*Elevated API response times/);
    await page.keyboard.press("Escape"); assert.equal(await page.isVisible("[data-tip]"), false);
  });
  await check("active incident card: Minor, details, progress at Monitoring, 3 updates newest first", async () => {
    const c = await text(page, "[data-active]");
    assert.match(c, /Minor[\s\S]*Degraded Webhook Delivery Performance[\s\S]*Webhooks[\s\S]*March 13, 2026 at 9:42 AM UTC[\s\S]*2h 15m/i);
    assert.deepEqual(await page.$$eval(".prog li", (l) => l.map((x) => x.className.trim())), ["done", "done", "done now", ""]);
    assert.equal(await text(page, '.prog [aria-current="step"]'), "Monitoring");
    assert.deepEqual(await page.$$eval("[data-active] .tl time", (t) => t.map((x) => x.textContent)), ["11:57 AM", "10:30 AM", "9:42 AM"]);
    assert.equal(await css(page, ".inc", "backgroundColor"), "rgb(255, 251, 235)");
  });
  await check("past incidents: 14 date groups, spec incidents, timelines, post-mortem dialog, full history toggle", async () => {
    assert.equal(await page.locator("[data-past] .day").count(), 14);
    assert.match(await text(page, "[data-past] .day:nth-child(1)"), /March 12, 2026\s*No incidents reported/);
    assert.match(await text(page, "[data-past] .day:nth-child(2)"), /March 11, 2026[\s\S]*Resolved[\s\S]*Elevated API Response Times[\s\S]*45 min[\s\S]*API \(v2\)[\s\S]*Investigating \(2:10 PM\)[\s\S]*Identified \(2:25 PM\)[\s\S]*Monitoring \(2:40 PM\)[\s\S]*Resolved \(2:55 PM\)/);
    assert.match(await text(page, "[data-past] .day:nth-child(5)"), /March 8, 2026[\s\S]*Scheduled Maintenance: Database Migration[\s\S]*2h[\s\S]*Planned maintenance completed successfully\. No user-facing impact\./);
    assert.match(await text(page, "[data-past] .day:nth-child(10)"), /March 3, 2026[\s\S]*File Upload Failures[\s\S]*1h 20m[\s\S]*File Storage & CDN/);
    await page.click("[data-past] .day:nth-child(10) summary"); assert.equal(await page.locator("[data-past] .day:nth-child(10) details .tl li").count(), 4);
    await page.click("[data-pm]"); assert.match(await text(page, "[data-dlg-body]"), /Post-Mortem[\s\S]*Root cause[\s\S]*What we're changing/); await page.keyboard.press("Escape");
    await page.click("[data-full]"); assert.equal(await page.isVisible("[data-full-list]"), true); assert.match(await text(page, "[data-full-list]"), /February 2026[\s\S]*January 2026[\s\S]*December 2025[\s\S]*Webhook delivery outage/);
    assert.match(await text(page, "[data-full]"), /Hide Older Incidents/);
  });
  await check("maintenance card with blue border, countdown, notify link pre-selects maintenance; metrics cards and toggle", async () => {
    assert.equal(await css(page, "[data-mnt]", "borderLeftColor"), "rgb(59, 130, 246)");
    assert.match(await text(page, "[data-mnt]"), /Infrastructure Upgrade — US-West Region[\s\S]*March 18, 2026, 2:00 AM - 4:00 AM UTC[\s\S]*< 5 minutes[\s\S]*Starts in 4d 14h/);
    assert.equal(await css(page, ".legend .dot.mnt", "width"), "10px");
    await page.uncheck('[data-prefs] input[value="maintenance"]'); await page.click("[data-notify-mnt]"); await page.waitForTimeout(700);
    assert.equal(await page.isChecked('[data-prefs] input[value="maintenance"]'), true); assert.equal(await page.evaluate(() => document.activeElement.id), "sub-email");
    assert.equal(await page.locator(".mc").count(), 3);
    assert.match(await text(page, "[data-metrics]"), /API Response Time\s*45ms\s*avg[\s\S]*p50 32ms[\s\S]*p95 89ms[\s\S]*p99 142ms[\s\S]*Error Rate\s*0\.02%[\s\S]*Below threshold[\s\S]*Throughput\s*12\.4K\s*req\/s[\s\S]*Peak 18\.2K req\/s/);
    const box = await page.$eval('[data-spark="tp"]', (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width]; });
    await page.mouse.move(box[0] + box[2] - 2, box[1] + 30); assert.match(await text(page, '[data-spark="tp"] .rd'), /UTC/);
    await page.click("[data-met-tog]"); assert.equal(await page.isVisible("#metrics"), false); await page.click("[data-met-tog]");
  });
  await check("subscribe: exclusive major/all checkboxes, email validation + success, Slack dialog, real RSS feed", async () => {
    assert.equal(await css(page, ".subs", "backgroundColor"), "rgb(239, 246, 255)");
    await page.check('[data-prefs] input[value="major"]'); assert.equal(await page.isChecked('[data-prefs] input[value="all"]'), false);
    await page.click("[data-email-form] button"); assert.match(await text(page, "[data-email-msg]"), /valid email/);
    await page.fill("#sub-email", "ops@acme.example"); await page.click("[data-email-form] button");
    assert.match(await text(page, "[data-email-msg]"), /Subscribed ops@acme\.example to only major outages and scheduled maintenance/);
    await page.click("[data-slack]"); assert.match(await text(page, "[data-dlg-body]"), /Slack[\s\S]*No connection to Slack is made/i); await page.click("[data-close]");
    const href = await page.getAttribute("[data-rss]", "href"); const res = await page.request.get(new URL(href, page.url()).href);
    assert.equal(res.status(), 200); assert.match(await res.text(), /<rss version="2\.0">[\s\S]*Degraded Webhook Delivery Performance/);
    assert.match(await text(page, ".subs .priv"), /We'll only send status-related notifications\. Unsubscribe anytime\./);
  });
  await check("demo states: partial (yellow) and major (red) banners with incidents; operational shows No active incidents", async () => {
    await page.click("[data-scn=partial]"); await page.waitForTimeout(400); assert.equal(await text(page, "[data-banner-text]"), "Partial System Outage");
    assert.equal(await css(page, "[data-banner]", "backgroundColor"), "rgb(255, 251, 235)"); assert.equal(await page.locator("[data-active] .inc").count(), 2);
    assert.match(await text(page, '[data-comp="cdn"] .st'), /Outage/);
    await page.click("[data-scn=major]"); await page.waitForTimeout(400); assert.equal(await text(page, "[data-banner-text]"), "Major System Outage");
    assert.equal(await css(page, "[data-banner]", "backgroundColor"), "rgb(254, 242, 242)"); assert.match(await text(page, "[data-active]"), /critical/i);
    await page.click("[data-scn=operational]"); assert.match(await text(page, "[data-active]"), /No active incidents/); assert.equal(await text(page, "[data-banner-sub]"), "");
    assert.match(await text(page, ".foot"), /CloudSync Home[\s\S]*API Documentation[\s\S]*Support[\s\S]*Privacy Policy[\s\S]*@CloudSyncStatus[\s\S]*Powered by CloudSync Status[\s\S]*© 2026 CloudSync Inc\./);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: no overflow, weekly uptime summary (13 bars), stacked metrics/subscribe, tap tooltip, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.isVisible('[data-bars="api"][data-mode="d"]'), false); assert.equal(await p.locator('[data-bars="api"][data-mode="w"] i').count(), 13);
    assert.equal(await p.getAttribute('[data-bars="cdn"][data-mode="w"] i:nth-child(12)', "class"), "out");
    await p.tap('[data-bars="cdn"][data-mode="w"] i:nth-child(12)'); assert.match(await text(p, "[data-tip]"), /–[\s\S]*File upload failures/);
    assert.equal((await css(p, ".metrics", "gridTemplateColumns")).split(" ").length, 1);
    assert.equal((await css(p, ".opts", "gridTemplateColumns")).split(" ").length, 1);
    const inp = await p.$eval("#sub-email", (e) => e.getBoundingClientRect()), btn = await p.$eval("[data-email-form] .btn", (e) => e.getBoundingClientRect()); assert.ok(btn.top >= inp.bottom);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .btn-o, .btn-dark, .crow, .link-btn, .pm, .pinc summary, .mnt-f a, .seg button, .foot nav a, .social a, .prefs label, input[type=email]")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.id));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
