import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const workspace = path.resolve(folder, "..", "..", "..", "..");
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const qa = { passed: false, visualReviewed: false, viewports: [], assertions: [], errors: [], resourcesClosed: false };
let service;
let browser;
function passed(name)
{
    qa.assertions.push({ name, passed: true });
}
async function noOverflow(page, label)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, label);
    passed(`No horizontal overflow: ${label}`);
}
async function closeDialog(page)
{
    if (await page.locator("#dialog").evaluate((element) => element.open)) await page.locator("#close-dialog").click();
}
try
{
    qa.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "learning-management-platform", "GPT-6");
    passed("Independent static output and final public subpath");
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    const response = await fetch(service.url);
    assert.equal(response.status, 200);
    assert.equal((await fetch(new URL("/", service.url))).status, 404);
    passed("Responsive HTTP server serves only the target static export");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 600;
        const label = mobile ? "mobile" : "desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push(`${label} page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push(`${label} console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => qa.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (result) =>
        {
            if (result.status() >= 400) qa.errors.push(`${label} HTTP ${result.status()}: ${result.url()}`);
        });
        const initial = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(initial.status(), 200);
        assert.equal(await page.locator("h1").textContent(), "My learning");
        assert.ok((await page.locator("main").innerText()).length > 700);
        assert.equal(await page.locator("#courses .course-card").count(), 3);
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.equal(await page.evaluate(() => devicePixelRatio), 1);
        passed(`${label}: visible meaningful English homepage, 3 courses, DPR 1`);
        await noOverflow(page, `${label} initial`);
        await page.screenshot({ path: path.join(checks, `${label}.png`), fullPage: false });
        await page.screenshot({ path: path.join(checks, `${label}-full.png`), fullPage: true });
        qa.viewports.push({ ...viewport, deviceScaleFactor: 1, screenshot: path.join(checks, `${label}.png`), initialCourses: 3 });
        await page.keyboard.press("/");
        assert.equal(await page.locator("#search").evaluate((element) => document.activeElement === element), true);
        await page.keyboard.type("brand");
        assert.equal(await page.locator("#courses .course-card").count(), 1);
        await page.locator("#search").fill("no-such-course");
        assert.match(await page.locator("#courses").innerText(), /No courses found/);
        await page.locator("#search").fill("");
        passed(`${label}: keyboard search shortcut, matching search, empty search state`);
        await page.locator("#hero-resume").focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#dialog").evaluate((element) => element.open), true);
        assert.match(await page.locator("#dialog-title").innerText(), /Frame the right problem/);
        for (let tab = 0; tab < 8; tab++)
        {
            await page.keyboard.press(tab < 4 ? "Tab" : "Shift+Tab");
            assert.equal(await page.evaluate(() => document.querySelector("#dialog").contains(document.activeElement)), true);
        }
        passed(`${label}: native dialog keyboard focus remains within the modal`);
        await page.locator("#practice-quiz").click();
        await page.getByLabel("Build every feature you can imagine").check();
        await page.getByRole("button", { name: "Check answer" }).click();
        assert.match(await page.locator("#quiz-result").textContent(), /Not quite/);
        await page.getByLabel("Understand the person and their needs").check();
        await page.getByRole("button", { name: "Check answer" }).click();
        assert.match(await page.locator("#quiz-result").textContent(), /Exactly/);
        await page.locator("#back-lesson").click();
        await page.locator("#complete-lesson").click();
        assert.match(await page.locator("#dialog-title").textContent(), /Test your assumptions/);
        await page.locator("#complete-lesson").click();
        assert.match(await page.locator("#dialog-kicker").textContent(), /COURSE COMPLETED/);
        await page.locator("#show-certificates").click();
        await page.waitForURL(/#certificates$/);
        await expect(page.locator(".certificate")).toHaveCount(1);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("[data-certificate]").click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), "forma-design-demo-certificate.txt");
        passed(`${label}: real reading lessons, correct/incorrect quiz, completion, certificate download`);
        await noOverflow(page, `${label} certificates`);
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator(".certificate")).toHaveCount(1);
        await page.getByRole("link", { name: "Explore courses", exact: true }).click();
        await page.waitForURL(/#catalog$/);
        await page.locator('[data-enroll="writing"]').waitFor();
        await page.locator('[data-enroll="writing"]').click();
        assert.equal(await page.locator('[data-enroll="writing"]').count(), 0);
        assert.equal(await page.locator('[data-resume="writing"]').count(), 1);
        await page.locator('[data-resume="writing"]').click();
        assert.match(await page.locator("#dialog-title").textContent(), /Notice the ordinary/);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#dialog").evaluate((element) => element.open), false);
        passed(`${label}: persistent progress, local enrollment, lesson opening, Escape dismissal`);
        await noOverflow(page, `${label} catalog after enrollment`);
        await page.getByRole("link", { name: "My calendar", exact: true }).click();
        await page.waitForURL(/#calendar$/);
        await page.locator(".calendar-heading").waitFor();
        assert.match(await page.locator(".calendar-heading h2").textContent(), /November 2026/);
        await page.locator("#next-month").click();
        assert.match(await page.locator(".calendar-heading h2").textContent(), /December 2026/);
        await page.locator("#previous-month").click();
        await page.locator("#calendar-session").click();
        await page.locator("#reminder").check();
        await closeDialog(page);
        await page.locator("#schedule-settings").click();
        assert.equal(await page.locator("#reminder").isChecked(), true);
        await noOverflow(page, `${label} calendar and reminder dialog`);
        await closeDialog(page);
        passed(`${label}: calendar month navigation, sample session, persisted local reminder`);
        await page.locator("#search").fill("brand");
        await page.waitForURL(/#catalog$/);
        await expect(page.locator("#other-view .course-card")).toHaveCount(1);
        assert.equal(await page.locator("#search").inputValue(), "brand");
        passed(`${label}: searching from calendar preserves query when opening catalog`);
        await page.locator("#notifications").click();
        await page.locator("#mark-read").click();
        assert.equal(await page.locator("#notifications").getAttribute("aria-label"), "Notifications, all read");
        await closeDialog(page);
        await page.getByRole("link", { name: "My learning", exact: true }).click();
        await page.waitForURL(/#learning$/);
        await page.locator('[data-filter="completed"]').click();
        assert.equal(await page.locator("#courses .course-card").count(), 1);
        await page.locator("#view-all").click();
        assert.equal(await page.locator("#courses .course-card").count(), 4);
        await page.locator("#customize").click();
        await page.locator("#show-weekly").uncheck();
        await page.locator("#save-customization").click();
        assert.equal(await page.locator("#weekly-widget").isVisible(), false);
        passed(`${label}: read notifications, completed/all filters, dashboard customization`);
        await page.locator("#top-profile").click();
        await page.getByLabel("Display name").fill("Jordan <learner>");
        await page.getByLabel("Preview role").selectOption("Instructor");
        await page.getByRole("button", { name: "Save demo profile" }).click();
        assert.equal(await page.locator("#greeting-name").textContent(), "Jordan");
        await page.getByRole("link", { name: "Explore courses", exact: true }).click();
        await page.waitForURL(/#catalog$/);
        await page.locator("#create-course").waitFor();
        await page.locator("#create-course").click();
        await page.getByLabel("Course title").fill("A focused <test> course");
        await page.getByLabel("Course brief").fill("Observe one need. Sketch a solution. Test it with a real person.");
        await page.getByRole("button", { name: "Create local course", exact: true }).click();
        assert.match(await page.locator("#other-view").innerText(), /A focused <test> course/);
        assert.equal(await page.locator("#other-view test").count(), 0);
        await page.locator('.course-card').last().locator("button").click();
        assert.match(await page.locator(".lesson-paper").innerText(), /Observe one need/);
        await noOverflow(page, `${label} authored course lesson`);
        await closeDialog(page);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator(".course-card").count(), 5);
        passed(`${label}: mock role switch, course authoring, escaped user text, persistent authored lesson`);
        await page.locator("#top-profile").click();
        await page.getByLabel("Preview role").selectOption("Student");
        await page.getByRole("button", { name: "Save demo profile" }).click();
        assert.equal(await page.locator("#create-course").count(), 0);
        await noOverflow(page, `${label} final`);
        passed(`${label}: student role has no authoring controls (local preview only)`);
        await context.close();
    }
    const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await fallbackContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage",
        {
            get()
            {
                throw new Error("Storage blocked");
            }
        });
    });
    const fallback = await fallbackContext.newPage();
    await fallback.goto(service.url, { waitUntil: "networkidle" });
    await fallback.locator("#hero-resume").click();
    await fallback.locator("#complete-lesson").click();
    assert.match(await fallback.locator("#dialog-title").textContent(), /Test your assumptions/);
    await closeDialog(fallback);
    await fallback.locator("#demo-info").click();
    assert.match(await fallback.locator("#dialog-content").textContent(), /Browser storage is unavailable/);
    passed("Blocked browser storage: functional session-only progress with truthful disclosure");
    await fallbackContext.close();
    assert.deepEqual(qa.errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
