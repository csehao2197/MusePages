import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const folder = import.meta.dirname;
const root = path.resolve(folder, "..", "..", "..", "..");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "generate-preview.mjs")));
const { validateStaticOutput } = await import(pathToFileURL(path.join(root, "src", "workflows", "render-prompt-pages.mjs")));
async function guard() {
  const contents = await readFile(path.join(root, "out", ".generation-locks", "033-creative-agency-team.lock"), "utf8");
  const [pid, session] = contents.trim().split(/\r?\n/);
  const lock = contents.trimStart().startsWith("{") ? JSON.parse(contents) : { pid: Number(pid), session };
  assert.ok(lock.session);
  if (lock.prompt !== undefined) assert.equal(lock.prompt, "033-creative-agency-team");
  assert.ok(Number.isInteger(lock.pid) && lock.pid > 0);
  process.kill(lock.pid, 0);
}
async function files(dir, prefix = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(prefix, entry.name);
    if (entry.isDirectory()) found.push(...await files(path.join(dir, entry.name), name));
    else found.push(name);
  }
  return found;
}
async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = "eager";
      await image.decode();
      if (!image.naturalWidth) throw Error(`Image failed: ${image.src}`);
    }
  });
}
const issues = [];
const requests = [];
function observe(page) {
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => issues.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
  page.on("response", (response) => { if (response.status() >= 400) issues.push(`HTTP ${response.status()}: ${response.url()}`); });
  page.on("request", (request) => {
    requests.push({ method: request.method(), url: request.url() });
    if (!request.url().startsWith("http://127.0.0.1:")) issues.push(`External request: ${request.url()}`);
    if (!["GET", "HEAD"].includes(request.method())) issues.push(`Unexpected method: ${request.method()}`);
  });
}

test("Mosaic Studio static homepage — actual Chromium acceptance", { timeout: 180000 }, async (t) => {
  await guard();
  const service = await startPreviewServer(exported, { workspace: root });
  let browser;
  const passed = [];
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    observe(page);
    await t.test("source/export byte equality, required sections and nested mount", async () => {
      for (const file of ["index.html", "style.css", "app.js", ...await files(path.join(folder, "assets")).then((list) => list.map((name) => path.join("assets", name)))]) {
        assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)), file);
      }
      assert.match(service.url, /\/pages\/creative-agency-team\/GPT-6\/index\.html$/);
      assert.ok(await validateStaticOutput(exported, "creative-agency-team", "GPT-6"));
      await page.goto(service.url, { waitUntil: "networkidle" });
      await ready(page);
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
      assert.equal(await page.locator(".skip").evaluate((el) => el.getBoundingClientRect().top), 10);
      await page.keyboard.press("Enter");
      assert.equal(new URL(page.url()).hash, "#main");
      await expect(page).toHaveTitle("Our People — Mosaic Studio");
      for (const heading of ["Leadership", "Meet the Crew", "How We Work", "Why People Stay", "Join the Studio", "Mosaic by the Numbers", "What We Work With"]) await expect(page.getByRole("heading", { name: new RegExp(heading) })).toBeVisible();
      assert.equal(await page.locator(".leader").count(), 4);
      assert.equal(await page.locator(".benefits-grid article").count(), 6);
      assert.equal(await page.locator(".numbers-grid article").count(), 6);
      assert.equal(await page.locator(".tool-pills>span").count(), 15);
      assert.equal(await page.evaluate(() => document.fonts.check('600 30px "General Sans"') && document.fonts.check('400 15px Inter')), true);
      passed.push("static/source equality, 10 sections, 15 tools, all local images decode and fonts load");
    });
    await t.test("32 unique roster profiles, truthful filter counts and expansion reset", async () => {
      await expect(page.locator(".team-card")).toHaveCount(8);
      await page.locator("#expand-team").click();
      await expect(page.locator(".team-card")).toHaveCount(32);
      const names = await page.locator(".team-copy h3").allTextContents();
      assert.equal(new Set(names).size, 32);
      for (const [department, count] of [["Design",10],["Engineering",12],["Strategy",5],["Operations",5]]) {
        await page.locator(`[data-filter="${department}"]`).click();
        await expect(page.locator(".team-card")).toHaveCount(count);
        assert.deepEqual(await page.locator(".team-card").evaluateAll((cards) => [...new Set(cards.map((card) => card.dataset.department))]), [department]);
        await expect(page.locator("#expand-team")).toBeHidden();
        await expect(page.locator("#team-status")).toHaveText(`Showing ${count} of ${count} ${department} members.`);
      }
      await page.locator('[data-filter="All"]').click();
      await expect(page.locator(".team-card")).toHaveCount(8);
      await page.locator("#expand-team").click();
      await page.locator("#expand-team").click();
      await expect(page.locator(".team-card")).toHaveCount(8);
      await expect(page.locator("#expand-team")).toHaveAttribute("aria-expanded", "false");
      passed.push("32 unique fictional members; filters 10/12/5/5, expand/collapse, live status");
    });
    await t.test("leadership and crew social previews, keyboard focus and Escape", async () => {
      const profile = page.getByRole("button", { name: "Rachel Kim LinkedIn demo", exact: true });
      await profile.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#studio-dialog")).toBeVisible();
      await expect(page.locator("#profile-description")).toHaveText("Rachel Kim · LinkedIn profile preview");
      for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)), true);
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)), true);
      await page.keyboard.press("Escape");
      await expect(profile).toBeFocused();
      const crewProfile = page.getByRole("button", { name: "Sofia Reyes LinkedIn demo", exact: true });
      await crewProfile.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#profile-description")).toContainText("Sofia Reyes");
      await page.getByRole("button", { name: "Close dialog", exact: true }).click();
      passed.push("social mocks, Enter activation, modal focus containment, Escape and focus restoration");
    });
    await t.test("all four role details and archived internship application path", async () => {
      for (let i = 0; i < 4; i++) {
        await page.locator(`[data-job="${i}"]`).click();
        await expect(page.locator("#studio-dialog")).toBeVisible();
        await expect(page.locator(".job-description li")).toHaveCount(3);
        if (i === 3) await expect(page.locator("#dialog-content")).toContainText("Archived example");
        await page.locator("#role-apply").click();
        await expect(page.locator("#preview-form")).toBeVisible();
        await expect(page.locator("#dialog-content")).toContainText("Nothing is sent, saved, or uploaded.");
        await page.keyboard.press("Escape");
      }
      passed.push("4 role detail dialogs, archived internship disclosure, local application entry");
    });
    await t.test("application validation, trim, unsafe text, edit and privacy reset", async () => {
      await page.locator("[data-apply]").click();
      const name = page.locator('[name="name"]');
      const portfolio = page.locator('[name="portfolio"]');
      const note = page.locator('[name="note"]');
      const submit = page.getByRole("button", { name: "Create local preview" });
      await name.fill("    "); await submit.click();
      await expect(page.locator("#form-error")).toContainText("not only spaces");
      await name.fill('  <img src=x onerror="window.injected=true">  ');
      for (const invalid of ["javascript:alert(1)", "https://user:password@example.com", "not a url"]) {
        await portfolio.fill(invalid); await submit.click();
        await expect(page.locator("#form-error")).toContainText("http:// or https://");
      }
      await portfolio.fill("https://example.com/portfolio");
      await note.fill("             "); await submit.click();
      await expect(page.locator("#form-error")).toContainText("10 non-space");
      const unsafe = '<script>window.injected=true</script> I care about accessible craft.';
      await note.fill(`  ${unsafe}  `); await submit.click();
      await expect(page.locator("#preview-result")).toBeVisible();
      await expect(page.locator("#preview-name")).toHaveText('Name: <img src=x onerror="window.injected=true">');
      await expect(page.locator("#preview-note")).toHaveText(unsafe);
      assert.equal(await page.locator("#preview-result img,#preview-result script").count(), 0);
      assert.equal(await page.evaluate(() => window.injected), undefined);
      await page.locator("#edit-preview").click();
      await expect(name).toHaveValue('  <img src=x onerror="window.injected=true">  ');
      await name.fill("Alex Example");
      await submit.click();
      await expect(page.locator("#preview-name")).toHaveText("Name: Alex Example");
      await page.locator("#studio-dialog").screenshot({ path:path.join(checks,"application-local-preview.png") });
      await page.keyboard.press("Escape");
      await page.locator("[data-apply]").click();
      await expect(name).toHaveValue("");
      await expect(note).toHaveValue("");
      await page.keyboard.press("Escape");
      passed.push("whitespace, invalid/unsafe/credentialed URLs, inert unsafe text, trim, edit, clear-on-close");
    });
    await t.test("work concepts, project preview and in-memory-only state", async () => {
      await page.locator("footer [data-work]").click();
      await expect(page.locator(".project-case")).toHaveCount(3);
      await page.locator("#work-project").click();
      await page.locator('[name="name"]').fill("Example Collective");
      await page.locator('[name="project"]').selectOption("Brand experience");
      await page.locator('[name="note"]').fill("A thoughtful new community arts experience.");
      await page.getByRole("button", { name: "Create local preview" }).click();
      await expect(page.locator("#preview-role")).toHaveText("Project type: Brand experience");
      await expect(page.locator("#preview-result")).toContainText("not submitted");
      await page.keyboard.press("Escape");
      await page.locator("footer [data-project]").click();
      await expect(page.locator('[name="name"]')).toHaveValue("");
      await page.keyboard.press("Escape");
      assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
      assert.equal((await context.cookies()).length, 0);
      const licenseResponse = page.waitForResponse((response) => response.url().endsWith("/assets/CREDITS.txt"));
      await page.getByRole("link", { name:"Assets & licenses" }).click();
      const license = await licenseResponse;
      assert.equal(license.status(), 200);
      assert.match(await license.text(), /ITF Free Font License/);
      await page.goBack({ waitUntil:"networkidle" });
      passed.push("3 original concept summaries, project category preview, no cookies or web storage");
    });
    await t.test("1440/1024/768/390/320 layouts and 44px mobile targets", async () => {
      for (const width of [1440,1024,768,390,320]) {
        await page.setViewportSize({ width, height: 1000 });
        await ready(page);
        const layout = await page.evaluate(() => ({
          width: innerWidth, actual: document.documentElement.scrollWidth,
          team: getComputedStyle(document.querySelector(".team-grid")).gridTemplateColumns.split(" ").length,
          leaders: getComputedStyle(document.querySelector(".leadership-grid")).gridTemplateColumns.split(" ").length,
          badTargets: [...document.querySelectorAll("button,a,input,select,textarea,[tabindex='0']")].filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && r.bottom > 0 && el.getClientRects().length && (r.width < 43.9 || r.height < 43.9);
          }).map((el) => ({ name: el.getAttribute("aria-label") || el.textContent.trim().slice(0,40), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }))
        }));
        assert.ok(layout.actual <= width, JSON.stringify(layout));
        assert.equal(layout.team, width > 1100 ? 4 : width > 600 ? 3 : 2);
        assert.equal(layout.leaders, width > 1100 ? 4 : width > 600 ? 2 : 1);
        if (width <= 390) assert.deepEqual(layout.badTargets, [], JSON.stringify(layout.badTargets));
      }
      assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
      assert.equal(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior), "auto");
      passed.push("five exact viewport widths, responsive grid counts, no document overflow, 44px mobile controls, reduced motion");
    });
    await t.test("touch navigation, department selection and swipeable collage", async () => {
      const mobile = await browser.newContext({ viewport: { width:390, height:844 }, isMobile:true, hasTouch:true, deviceScaleFactor:1, reducedMotion:"reduce" });
      try {
        const touch = await mobile.newPage(); observe(touch);
        await touch.goto(service.url, { waitUntil:"networkidle" });
        await touch.getByRole("button", { name:"Open navigation", exact:true }).tap();
        await expect(touch.locator("#navigation")).toBeVisible();
        await touch.locator("#navigation a[href='#crew']").tap();
        await expect(touch.locator("#navigation")).toBeHidden();
        await touch.locator('[data-filter="Engineering"]').tap();
        await expect(touch.locator(".team-card")).toHaveCount(12);
        await touch.locator('[data-filter="All"]').tap();
        const collage = touch.locator(".collage");
        await collage.scrollIntoViewIfNeeded();
        const b = await collage.boundingBox();
        const cdp = await mobile.newCDPSession(touch);
        await cdp.send("Input.dispatchTouchEvent", { type:"touchStart", touchPoints:[{ x:b.x+b.width-35, y:b.y+110 }] });
        for (let step=1;step<=8;step++) await cdp.send("Input.dispatchTouchEvent", { type:"touchMove", touchPoints:[{ x:b.x+b.width-35-step*30, y:b.y+110 }] });
        await cdp.send("Input.dispatchTouchEvent", { type:"touchEnd", touchPoints:[] });
        await expect.poll(() => collage.evaluate((el) => el.scrollLeft)).toBeGreaterThan(30);
        await cdp.detach();
        passed.push("real touch context: menu, nav dismissal, filters and CDP touch swipe of collage");
      } finally { await mobile.close(); }
    });
    await t.test("desktop and mobile rendered screenshots", async () => {
      await page.setViewportSize({ width:1440, height:1000 });
      await page.goto(service.url, { waitUntil:"networkidle" }); await ready(page);
      await page.locator("h1").click();
      await page.screenshot({ path:path.join(checks,"desktop-1440.png"), fullPage:true });
      await page.locator("#crew").screenshot({ path:path.join(checks,"crew-desktop.png") });
      await page.locator("#careers").screenshot({ path:path.join(checks,"careers-desktop.png") });
      await page.setViewportSize({ width:390, height:844 });
      await page.goto(service.url, { waitUntil:"networkidle" }); await ready(page);
      await page.locator("h1").click();
      await page.screenshot({ path:path.join(checks,"mobile-390.png"), fullPage:true });
      await page.screenshot({ path:path.join(checks,"mobile-first-screen.png") });
      await page.locator("#crew").screenshot({ path:path.join(checks,"crew-mobile.png") });
      await page.locator("#careers").screenshot({ path:path.join(checks,"careers-mobile.png") });
      passed.push("actual fresh desktop 1440 and mobile 390 screenshots: full page, crew, careers, mobile first screen");
    });
    await t.test("no runtime failures, external calls, submissions or private export files", async () => {
      assert.deepEqual(issues, []);
      assert.ok(requests.length > 50);
      assert.ok(requests.every((request) => ["GET","HEAD"].includes(request.method) && request.url.startsWith(new URL(service.url).origin)));
      const publicFiles = await files(exported);
      assert.equal(publicFiles.some((file) => /(?:^|[\\/])(?:metadata\.json|page\.test\.mjs|README\.md|node_modules|\.checks|package\.json)$/.test(file)), false);
      passed.push(`${requests.length} requests observed: loopback GET only; zero pageerror, >=400 HTTP or requestfailed`);
    });
    assert.equal(passed.length, 10, "All acceptance groups must pass before receipt");
    assert.deepEqual(issues, []);
    await guard();
    const digest = await validateStaticOutput(exported, "creative-agency-team", "GPT-6");
    await writeFile(path.join(checks, "validation.json"), JSON.stringify({
      checkedAt: new Date().toISOString(), digest, errors:[], testGroups:passed.length,
      command:"node --test out\\pages\\033-creative-agency-team\\GPT-6\\page.test.mjs",
      checks:passed, network:{ requests:requests.length, methods:[...new Set(requests.map((request)=>request.method))], external:0, failed:0, httpErrors:0, pageErrors:0 },
      widths:[1440,1024,768,390,320], reducedMotion:true, browser:"Installed Playwright Chromium", staticMount:"/pages/creative-agency-team/GPT-6/index.html"
    }, null, 2)+"\n");
    await context.close();
  } finally {
    await browser?.close();
    await service.close();
  }
});
