import path from "node:path";
import { pathToFileURL } from "node:url";
import { readFile, copyFile, cp, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

const root = process.cwd();
const load = (file) => import(pathToFileURL(path.join(root, file)).href);
const { WorkspaceFiles: W, StaticHomepage: S } = await load("src\\workflows\\script\\render-prompt-page.mjs");
const { startPreviewServer } = await load("src\\workflows\\script\\generate-preview.mjs");
const { chromium } = await load("node_modules\\@playwright\\test\\index.mjs");
const job = await W.json(path.join(root, "src\\workflows\\script\\.ai-gpt6-current-job.json"));
assert.equal(job.prompt, "540-music-lessons-school-website");
const state = await W.json(job.stateFile);
assert.equal(state.activePrompt, job.prompt);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal((await W.text(job.promptLock)).trim(), String(state.ownedLock.pid));
process.kill(state.ownedLock.pid, 0);
const folder = job.output;
const out = await W.ensureDirectory(root, path.relative(root, folder), "out");
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    publicModel: "GPT-6",
    testedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    resourcesClosed: false,
    screenshots: [path.join(folder, ".checks", "desktop.png"), path.join(folder, ".checks", "mobile.png")]
};
let browser;
let service;
const test = async (name, fn) =>
{
    await fn();
    qa.assertions.push({ name, passed: true });
};
try
{
    const sourceType = await S.checkSource(folder);
    assert.equal(sourceType, "html");
    const metadata = await W.json(path.join(folder, "metadata.json"));
    metadata.generated = true;
    await W.saveJson(path.join(folder, "metadata.json"), metadata);
    for (const name of ["index.html", "styles.css", "app.js", "content.js", "favicon.svg", "LICENSE", "NOTICE"])
    {
        await copyFile(path.join(folder, name), path.join(out, name));
    }
    await cp(path.join(folder, "fonts"), path.join(out, "fonts"), { recursive: true });
    await cp(path.join(folder, "licenses"), path.join(out, "licenses"), { recursive: true });
    await cp(path.join(folder, "public", "images"), path.join(out, "images"), { recursive: true });
    qa.staticDigest = await S.validateStaticOutput(out, "music-lessons-school-website", "GPT-6");
    qa.assertions.push({ name: "Source and independent final-subpath static validation", passed: true });
    const raw = await W.text(job.file);
    const design = await W.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
    assert.equal((await W.text(path.join(folder, ".generation-input.sha256"))).trim(), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex"));
    service = await startPreviewServer(out, { workspace: root });
    qa.url = service.url;
    assert(service.url.includes("/pages/music-lessons-school-website/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        const prefix = mobile ? "Mobile" : "Desktop";
        qa.viewports.push({ ...viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const noOverflow = async () =>
        {
            const size = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
            assert(size.document <= size.width && size.body <= size.width, JSON.stringify(size));
        };
        const filter = async (name, value) =>
        {
            await page.locator(`.filter[data-filter="${name}"][data-value="${value}"]`).click();
        };
        await test(`${prefix}: HTTP 200, nonblank hero, six instruments, loaded local fonts`, async () =>
        {
            const response = await page.goto(service.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.locator("h1").waitFor();
            assert.match(await page.locator("h1").innerText(), /lesson room/);
            assert.equal(await page.locator(".instrument-card").count(), 6);
            await page.evaluate(() => document.fonts.ready);
            assert(await page.evaluate(() => document.fonts.check("700 40px Petrona") && document.fonts.check("400 15px Mulish")));
            await noOverflow();
        });
        await page.screenshot({ path: qa.screenshots[mobile ? 1 : 0], fullPage: false });
        if (!mobile)
        {
            await page.locator("#finder").screenshot({ path: path.join(folder, ".checks", "desktop-finder.png") });
        }
        else
        {
            await page.locator("#practice").screenshot({ path: path.join(folder, ".checks", "mobile-practice.png") });
            await page.evaluate(() => scrollTo(0, 0));
        }
        if (mobile)
        {
            await test("Mobile: single-line header, keyboard menu open/Escape/link close", async () =>
            {
                const header = await page.locator(".header-inner").boundingBox();
                assert(header.height <= 72);
                await page.locator(".menu").focus();
                await page.keyboard.press("Enter");
                assert.equal(await page.locator(".menu").getAttribute("aria-expanded"), "true");
                await page.keyboard.press("Escape");
                assert.equal(await page.locator(".menu").getAttribute("aria-expanded"), "false");
                await page.locator(".menu").click();
                await page.locator("#navigation a[href='#practice']").click();
                assert.equal(await page.locator(".menu").getAttribute("aria-expanded"), "false");
            });
        }
        await test(`${prefix}: default piano returns both Ben and Dana`, async () =>
        {
            assert.equal(await page.locator("#matches .match").count(), 2);
            assert.match(await page.locator("#matches").innerText(), /Ben Osei/);
            assert.match(await page.locator("#matches").innerText(), /Dana Whitehorse/);
        });
        await test(`${prefix}: online piano and advanced drums no-match recovery`, async () =>
        {
            await filter("format", "Online");
            assert.equal(await page.locator(".no-match").count(), 1);
            assert.match(await page.locator(".no-match").innerText(), /online teachers match everywhere/);
            await page.locator("#loosen").click();
            assert.equal(await page.locator("#matches .match").count(), 2);
            await filter("instrument", "Drums");
            await filter("level", "Advanced");
            assert.equal(await page.locator(".no-match").count(), 1);
            await page.locator("#loosen").click();
            assert.equal(await page.locator("#matches .match").count(), 1);
        });
        await test(`${prefix}: child guitar excluded; tween advanced online Carmen matches`, async () =>
        {
            await filter("instrument", "Guitar");
            await filter("age", "Child 6–10");
            assert.equal(await page.locator(".no-match").count(), 1);
            await filter("age", "Tween 11–13");
            await filter("level", "Advanced");
            await filter("format", "Online");
            assert.equal(await page.locator("#matches .match").count(), 1);
            assert.match(await page.locator("#matches").innerText(), /Carmen Ruiz/);
        });
        await test(`${prefix}: finder survives reload; opening carries teacher, instrument, age, level, format`, async () =>
        {
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator('.filter[data-filter="format"][data-value="Online"]').getAttribute("aria-pressed"), "true");
            await page.locator('.opening[data-opening="Fri 3:30"]').click();
            assert.match(await page.locator(".selected-lesson").innerText(), /Carmen Ruiz/);
            assert.match(await page.locator(".selected-lesson").innerText(), /Fri 3:30/);
            assert.equal(await page.locator("#trial-instrument").inputValue(), "Guitar");
            assert.equal(await page.locator("#age").inputValue(), "12");
            assert.match(await page.locator(".selected-context").innerText(), /Tween 11–13 · Advanced/);
            assert.equal(await page.locator('.trial-format[data-format="Online"]').getAttribute("aria-pressed"), "true");
        });
        await test(`${prefix}: no native popups; required/age/phone inline validation`, async () =>
        {
            await page.locator("#trial-form button[type=submit]").click();
            assert.equal(await page.locator("#student").getAttribute("aria-invalid"), "true");
            await page.locator("#student").fill("Alex");
            await page.locator("#age").fill("5");
            await page.locator("#guardian").fill("Sam");
            await page.locator("#phone").fill("123");
            await page.locator("#trial-form button[type=submit]").click();
            assert.match(await page.locator("#age-error").innerText(), /6 to 120/);
            assert.match(await page.locator("#phone-error").innerText(), /7–15/);
            await page.locator("#age").fill("8");
            await page.locator("#phone").fill("5556483390");
            await page.locator("#trial-form button[type=submit]").click();
            assert.match(await page.locator("#age-error").innerText(), /age range/);
        });
        await test(`${prefix}: local booking success, saved teacher/opening/filter details, reload and book another`, async () =>
        {
            await page.locator("#age").fill("12");
            await page.locator("#notes").fill("Loves folk songs.");
            if (mobile)
            {
                await page.locator("#trial-form button[type=submit]").scrollIntoViewIfNeeded();
                const submit = await page.locator("#trial-form button[type=submit]").boundingBox();
                const bar = await page.locator(".sticky").boundingBox();
                assert(submit.y + submit.height <= bar.y, "Sticky bar covers submit");
            }
            await page.locator("#trial-form button[type=submit]").click();
            assert.match(await page.locator(".success").innerText(), /See you at the house, Alex/);
            const value = await page.evaluate(() => JSON.parse(localStorage.getItem("cadence-house-music-booking")));
            assert.equal(value.teacher, "Carmen Ruiz");
            assert.equal(value.opening, "Fri 3:30");
            assert.equal(value.finder.level, "Advanced");
            assert.equal(value.format, "Online");
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator(".success").count(), 1);
            await page.locator("#another").click();
            assert.equal(await page.locator("#trial-form").count(), 1);
        });
        await test(`${prefix}: keyboard practice full 0/10/20/30/45+/0 cycle and goal`, async () =>
        {
            const monday = page.locator('.day[data-day="0"]');
            await monday.focus();
            for (const expected of ["10", "20", "30", "45"])
            {
                await page.keyboard.press("Enter");
                assert.equal(await monday.getAttribute("data-value"), expected);
            }
            assert.equal(await page.locator("#total").innerText(), "45");
            await page.keyboard.press("Enter");
            assert.equal(await monday.getAttribute("data-value"), "0");
            for (let day = 0; day < 3; day++)
            {
                for (let tap = 0; tap < 4; tap++) await page.locator(`.day[data-day="${day}"]`).click();
            }
            assert.equal(await page.locator("#total").innerText(), "135");
            assert.equal(await page.locator(".goal").getAttribute("aria-valuenow"), "100");
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator("#total").innerText(), "135");
        });
        await test(`${prefix}: archived-week streaks derive from history, empty week breaks streak`, async () =>
        {
            await page.locator("#reset-week").click();
            assert.equal(await page.locator("#total").innerText(), "0");
            await page.locator('.day[data-day="1"]').click();
            assert.match(await page.locator("#streak").innerText(), /2-week streak/);
            await page.locator("#reset-week").click();
            await page.locator("#reset-week").click();
            await page.locator('.day[data-day="2"]').click();
            assert.match(await page.locator("#streak").innerText(), /1-week streak/);
        });
        await test(`${prefix}: removable opening/teacher and instrument-grid handoff`, async () =>
        {
            await page.locator('[data-instrument="Violin"]').click();
            await filter("format", "Either");
            await page.locator(".teacher-trial").click();
            assert.match(await page.locator(".selected-lesson").innerText(), /Amara Lin/);
            await page.locator('[data-remove="teacher"]').click();
            assert.equal(await page.locator("[data-remove]").count(), 0);
        });
        await test(`${prefix}: malformed stored JSON/data recover without errors`, async () =>
        {
            await page.evaluate(() =>
            {
                localStorage.setItem("cadence-house-music-finder", '{"instrument":"Not an instrument"}');
                localStorage.setItem("cadence-house-music-practice", '{"days":[999]}');
                localStorage.setItem("cadence-house-music-booking", "{malformed");
            });
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator("#matches .match").count(), 2);
            assert.equal(await page.locator("#total").innerText(), "0");
            assert.equal(await page.locator("#trial-form").count(), 1);
        });
        await test(`${prefix}: all photographs load; reduced motion, phone links, no overflow or browser/resource errors`, async () =>
        {
            for (const selector of ["#events", "#teachers", "#trial", "footer"])
            {
                await page.locator(selector).scrollIntoViewIfNeeded();
                await page.waitForTimeout(80);
            }
            await page.waitForLoadState("networkidle");
            assert(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)));
            assert.equal(await page.locator(".hero-image > img").evaluate((image) => getComputedStyle(image).animationName), "none");
            assert.equal(await page.locator(".phone").getAttribute("href"), "tel:5556483390");
            await noOverflow();
            assert.deepEqual(errors, []);
        });
        qa.errors.push(...errors);
        await context.close();
    }
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack || String(error));
    console.error(error);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
