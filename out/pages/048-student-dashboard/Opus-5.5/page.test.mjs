// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/048-student-dashboard/Opus-5.5/page.test.mjs
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
  await check("top bar: search results, notification/message badges, profile dropdown", async () => {
    assert.equal(await css(page, ".top", "borderBottomColor"), "rgb(229, 231, 235)");
    assert.equal(await css(page, ".search", "maxWidth"), "480px");
    await page.fill("[data-search-in]", "tree");
    assert.match(await text(page, "[data-search-res]"), /Binary Tree Implementation[\s\S]*Assignment/);
    await page.fill("[data-search-in]", "machine"); await page.keyboard.press("Enter");
    assert.match(await text(page, "[data-dlg-body]"), /Introduction to Machine Learning[\s\S]*45% complete/);
    await page.keyboard.press("Escape");
    assert.equal(await text(page, "[data-notif-count]"), "3");
    await page.click('[data-pop="notif"]'); assert.equal(await page.locator("[data-notif-list] li").count(), 3);
    await page.click("[data-notif-read]"); assert.equal(await text(page, "[data-notif-count]"), "");
    await page.click('[data-pop="msg"]'); assert.match(await text(page, "[data-msg-list]"), /Prof\. Sarah Chen/);
    await page.waitForTimeout(800); assert.equal(await text(page, "[data-msg-count]"), "");
    await page.click('[data-pop="me"]');
    assert.deepEqual(await page.$$eval('[data-pop-panel="me"] button', (b) => b.map((x) => x.textContent.trim())), ["My Profile", "Settings", "Help Center", "Sign Out"]);
    await page.keyboard.press("Escape"); assert.equal(await page.locator('[data-pop-panel="me"]').isHidden(), true);
  });
  await check("sidebar 260px with student card, 8 nav items, indigo active border, help card; collapses to icons", async () => {
    assert.equal(await page.$eval(".side", (e) => Math.round(e.getBoundingClientRect().width)), 260);
    assert.match(await text(page, ".me-card"), /Alex Thompson[\s\S]*Computer Science, Year 2/);
    assert.equal(await page.locator(".side-nav a").count(), 8);
    assert.equal(await page.$eval(".side-nav a.on", (e) => getComputedStyle(e, "::before").backgroundColor), "rgb(79, 70, 229)");
    assert.match(await text(page, ".help"), /Need Help\?/);
    await page.click("[data-collapse]"); await page.waitForTimeout(450);
    assert.equal(await page.$eval(".side", (e) => Math.round(e.getBoundingClientRect().width)), 76);
    assert.equal(await page.locator(".side-nav a span >> nth=0").isVisible(), false);
    await page.click("[data-collapse]");
  });
  await check("welcome: time-aware greeting, computed summary, semester badge, join countdown; 4 stat cards", async () => {
    const h = await page.evaluate(() => new Date().getHours());
    assert.equal(await text(page, "h1"), `Good ${h < 12 ? "morning" : h < 18 ? "afternoon" : "evening"}, Alex`);
    const n = await page.$$eval("[data-due] li", (l) => l.length);
    assert.equal(n, 4);
    assert.match(await text(page, "[data-summary]"), /You have \d assignments? due this week and 1 upcoming quiz\./);
    assert.match(await text(page, ".sem"), /Spring 2026/);
    assert.match(await text(page, "[data-join-cd]"), /in (45|44) min/);
    await page.click("[data-join]"); assert.match(await text(page, "[data-dlg-body]"), /Binary Trees/); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".stat").count(), 4);
    assert.match(await text(page, ".stats"), /3\.72[\s\S]*\+0\.08[\s\S]*5 of 5[\s\S]*100%[\s\S]*this week[\s\S]*14 days[\s\S]*Keep it going!/);
    assert.equal(await page.locator(".stat .spark").count(), 1);
  });
  await check("courses: 3 cards with progress, next class, grade; view all 5; click opens detail", async () => {
    assert.equal(await page.locator(".course").count(), 3);
    assert.match(await text(page, ".course >> nth=0"), /Data Structures & Algorithms[\s\S]*Prof\. Sarah Chen[\s\S]*68%[\s\S]*Wed, 10:00 AM — Lecture: Binary Trees[\s\S]*A- \(92%\)/);
    assert.deepEqual(await page.$$eval(".course .bar", (b) => b.map((x) => x.getAttribute("aria-valuenow"))), ["68", "45", "72"]);
    await page.click("[data-all-courses]"); assert.equal(await page.locator(".course").count(), 5); await page.click("[data-all-courses]");
    await page.click(".course >> nth=2"); assert.match(await text(page, "[data-dlg-body]"), /Technical Writing[\s\S]*Prof\. Maria Garcia/);
    await page.keyboard.press("Escape");
  });
  await check("due soon: urgency colors and actions; submit flow marks assignment submitted", async () => {
    assert.deepEqual(await page.$$eval("[data-due] li b", (b) => b.map((x) => x.textContent)), ["ML Problem Set 4", "Binary Tree Implementation", "Essay Draft: Technical Ethics", "Database ER Diagram"]);
    assert.deepEqual(await page.$$eval("[data-due] .urg", (u) => u.map((x) => getComputedStyle(x).backgroundColor)), ["rgb(239, 68, 68)", "rgb(245, 158, 11)", "rgb(16, 185, 129)", "rgb(16, 185, 129)"]);
    assert.match(await text(page, "[data-due] li >> nth=0"), /Due tomorrow, 11:59 PM/);
    await page.click('[data-act="a1"]');
    await page.click("[data-sub] [type=submit]"); assert.match(await text(page, "[data-err]"), /attach/);
    await page.setInputFiles("[data-sub] input[type=file]", { name: "ps4.ipynb", mimeType: "application/json", buffer: Buffer.from("{}") });
    await page.click("[data-sub] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Submitted![\s\S]*ML Problem Set 4 · ps4\.ipynb/);
    await page.keyboard.press("Escape");
    assert.match(await text(page, "[data-due] li:last-child"), /ML Problem Set 4[\s\S]*Submitted/);
    assert.equal(await text(page, "[data-due-badge]"), "3");
    await page.click('[data-act="a2"]'); assert.equal(await text(page, '[data-act="a2"]'), "Continue");
  });
  await check("week schedule: 7 days, today highlighted, event details + join, .ics download", async () => {
    assert.equal(await page.locator(".day").count(), 7);
    assert.equal(await css(page, ".day.today .day-h", "backgroundColor"), "rgb(79, 70, 229)");
    const wk = await text(page, ".week");
    for (const re of [/Data Structures10:00–11:30 AMRoom 204 \/ Zoom/, /ML Lab2:00–4:00 PMCS Lab 3/, /Study Group5:00–6:00 PMLibrary/]) assert.match(wk, re);
    await page.click('[data-ev="0-0"]');
    assert.match(await text(page, "[data-ev-detail]"), /Data Structures — Lecture: Heaps/);
    await page.click("[data-join-ev]"); assert.match(await text(page, "[data-dlg-body]"), /Join virtual class/); await page.keyboard.press("Escape");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-ics]")]);
    assert.equal(dl.suggestedFilename(), "brightpath-week.ics");
    const fs = await import("node:fs/promises");
    const ics = await fs.readFile(await dl.path(), "utf8");
    assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 11);
    assert.match(ics, /DTSTART:\d{8}T140000[\s\S]*SUMMARY:ML Lecture/);
  });
  await check("grades table with feedback dialog and all grades; heatmap 84 cells with tooltip, summary and course bars", async () => {
    assert.equal(await page.locator("[data-grade]").count(), 3);
    assert.match(await text(page, '[data-grade="0"]'), /ML Quiz 3[\s\S]*88\/100[\s\S]*B\+[\s\S]*Good work on backpropagation[\s\S]*Oct 5/);
    await page.click('[data-grade="1"]'); assert.match(await text(page, "[data-dlg-body]"), /Edge cases/); await page.keyboard.press("Escape");
    await page.click("[data-all-grades]"); assert.equal(await page.locator(".tbl tbody tr").count(), 5); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".cell").count(), 84);
    await page.hover(".cell >> nth=0");
    assert.match(await text(page, "[data-tip]"), /^[A-Z][a-z]{2} \d+: [\d.]+ hours studied$/);
    assert.match(await text(page, "[data-act-sum]"), /This week: [\d.]+ hrs · Last week: [\d.]+ hrs · Average: [\d.]+ hrs\/week/);
    assert.equal(await page.locator("[data-bars] > div").count(), 5);
  });
  await check("announcements mark-all-read; 2x2 quick links; footer with version", async () => {
    assert.equal(await page.locator(".ann li").count(), 3);
    assert.equal(await page.locator(".ann li.unread").count(), 2);
    assert.match(await text(page, ".ann li >> nth=0"), /midterm moved to Oct 20[\s\S]*Pinned/);
    await page.click("[data-ann-read]"); assert.equal(await page.locator(".ann li.unread").count(), 0);
    assert.equal(await page.locator(".ql a").count(), 4);
    assert.equal((await css(page, ".ql", "gridTemplateColumns")).split(" ").length, 2);
    assert.match(await text(page, ".foot"), /BrightPath Learning Platform — Spring 2026[\s\S]*Privacy Policy[\s\S]*Terms[\s\S]*Accessibility[\s\S]*Contact Support[\s\S]*v3\.2\.1[\s\S]*Powered by BrightPath/);
    await page.click(".foot [data-support]");
    await page.fill("[data-sup] textarea", "Cannot open the lab VM"); await page.click("[data-sup] [type=submit]");
    assert.match(await text(page, "[data-dlg-body]"), /Ticket created/);
    await page.keyboard.press("Escape");
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, { mobile: true });
  await check("mobile: bottom tab bar + More sheet, stacked courses, daily schedule with swipe nav, scrollable heatmap and actions, 44px targets", async () => {
    const p = m.page;
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.equal(await p.locator(".side").isVisible(), false);
    assert.deepEqual(await p.$$eval(".tabbar > *", (t) => t.map((x) => x.textContent.trim())), ["Dashboard", "Courses", "Assignments", "Schedule", "More"]);
    await p.click("[data-more]"); assert.equal(await p.locator("[data-sheet]").isVisible(), true); await p.click("[data-sheet] [href='#grades']");
    assert.equal(await p.locator("[data-sheet]").isHidden(), true);
    assert.equal((await css(p, ".courses", "gridTemplateColumns")).split(" ").length, 1);
    const w = await p.$eval(".week", (e) => e.clientWidth), d = await p.$eval(".day", (e) => e.getBoundingClientRect().width);
    assert.ok(Math.abs(w - d) < 2);
    assert.equal(await text(p, "[data-day-label]"), "Today");
    const before = await p.$eval(".week", (e) => e.scrollLeft);
    await p.click(await p.$eval(".week", (e) => e.scrollLeft) > 0 ? "[data-day-prev]" : "[data-day-next]"); await p.waitForTimeout(700);
    assert.notEqual(await p.$eval(".week", (e) => e.scrollLeft), before);
    assert.notEqual(await text(p, "[data-day-label]"), "Today");
    assert.ok(await p.$eval(".heat-wrap", (e) => e.scrollWidth > e.clientWidth));
    assert.ok(await p.$eval(".qa", (e) => e.scrollWidth > e.clientWidth));
    const due = await p.$eval("#due", (e) => e.getBoundingClientRect().top), cs = await p.$eval("#courses", (e) => e.getBoundingClientRect().top);
    assert.ok(due > cs);
    const small = await p.evaluate(() => [...document.querySelectorAll(".btn, .icon-btn, .link, .tabbar > *, .ev, .g-row:not(.head), .ql a, .foot nav a")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim() || b.getAttribute("aria-label")));
    assert.deepEqual(small, []);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(`${results.join("\n")}\n\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
