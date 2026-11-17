import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const checks = path.join(job.output, ".checks");
const results =
{
    prompt: job.prompt,
    modelId: job.modelId,
    passed: false,
    visualReviewed: false,
    tests: [],
    viewports: [],
    browserErrors: [],
    resourcesClosed: false
};
let server;
let browser;
const record = (name, evidence) => results.tests.push({ name, passed: true, evidence });
const watch = (page) =>
{
    page.on("pageerror", (error) => results.browserErrors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            results.browserErrors.push(`console: ${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => results.browserErrors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            results.browserErrors.push(`http: ${response.status()} ${response.url()}`);
        }
    });
};
async function noOverflow(page, stage)
{
    const dimensions = await page.evaluate(() =>
    ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${stage}: ${JSON.stringify(dimensions)}`);
    return dimensions;
}

try
{
    server = await startPreviewServer(path.join(job.output, "out"), { workspace: root });
    assert.match(server.url, /\/pages\/coding-bootcamp-website\/GPT-6\/index\.html$/);
    const http = await fetch(server.url);
    assert.equal(http.status, 200);
    assert.equal((await fetch(new URL("/metadata.json", server.url))).status, 404);
    record("Final public subpath and isolated static server", { url: server.url, homepage: 200, repositoryMetadata: 404 });
    browser = await chromium.launch({ headless: true });

    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        watch(page);
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("h1")).toHaveText("Sixteen weeks to full-stack web development.");
        await expect(page.locator("h1")).toBeVisible();
        await page.waitForTimeout(800);
        const before = await noOverflow(page, `${viewport.width}: before interactions`);
        const visibleCharacters = (await page.locator("main").innerText()).length;
        assert.ok(visibleCharacters > 3500, `Homepage has only ${visibleCharacters} visible characters`);
        assert.equal(await page.locator(".phase").count(), 4);
        assert.equal(await page.locator("tbody tr").count(), 3);
        assert.equal(await page.locator(".stat").count(), 4);
        assert.equal(await page.locator(".plan").count(), 3);
        assert.equal(await page.locator(".instructor").count(), 3);
        assert.equal(await page.locator("details").count(), 5);
        assert.equal(await page.evaluate(() => document.fonts.check('600 40px "Zilla Slab"')), true);
        assert.equal(await page.evaluate(() => document.fonts.check('400 16px "Inter"')), true);
        await page.screenshot({ path: path.join(checks, mobile ? "mobile.png" : "desktop.png") });
        record(`${viewport.width}: visible content, expected section counts, local fonts and first-screen screenshot`, { viewport, before, visibleCharacters });

        await page.locator(".header .primary").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(/#apply$/);
        await page.waitForTimeout(900);
        await expect(page.locator("#name")).toBeInViewport();
        await page.locator("#name").focus();
        await page.keyboard.press("Tab");
        await expect(page.locator("#email")).toBeFocused();
        await expect(page.locator("#name-error")).toHaveText("Please enter your name.");
        assert.equal(await page.locator("#name").getAttribute("aria-invalid"), "true");
        await page.locator("#email").fill("invalid");
        await page.keyboard.press("Tab");
        await expect(page.locator("#email-error")).toHaveText("Enter a valid email address.");
        await page.keyboard.press("Tab");
        await expect(page.locator("#track-error")).toHaveText("Choose a sample cohort.");
        await page.locator("#why").fill("Too short");
        await page.keyboard.press("Tab");
        await expect(page.locator("#why-error")).toContainText("at least 40");
        await expect(page.locator(".submit")).toBeDisabled();
        await expect(page.locator("#character-count")).toHaveText("9");
        record(`${viewport.width}: keyboard apply navigation, focus order and blur validation`, { invalid: ["name", "email", "track", "why"], submitDisabled: true, counter: 9 });

        await page.locator("#name").fill("Alex Morgan");
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#track").selectOption("winter");
        await page.locator("#why").fill("x".repeat(39));
        await expect(page.locator(".submit")).toBeDisabled();
        await page.locator("#why").fill("x".repeat(40));
        await expect(page.locator(".submit")).toBeEnabled();
        record(`${viewport.width}: exact 39/40 character validation boundary`, { at39: "disabled", at40: "enabled" });
        const why = "I am changing careers and want to learn to build accessible full-stack applications.";
        await page.locator("#why").fill(why);
        const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("copperline:app")));
        assert.equal(stored.track, "winter");
        assert.equal(stored.format, "Part-time");
        assert.equal(stored.why, why);
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("#name")).toHaveValue("Alex Morgan");
        await expect(page.locator("#why")).toHaveValue(why);
        await expect(page.locator("#track")).toHaveValue("winter");
        await expect(page.locator(".submit")).toBeEnabled();
        record(`${viewport.width}: draft persistence and cohort format`, { key: "copperline:app", track: "winter", format: "Part-time" });

        let submissions = 0;
        page.on("request", (request) =>
        {
            if (request.method() !== "GET")
            {
                submissions += 1;
            }
        });
        await page.locator(".submit").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#success-panel")).toBeVisible();
        await expect(page.locator("#success-panel")).toBeFocused();
        await expect(page.locator("#success-panel")).toContainText("Nothing was sent. No seat has been reserved.");
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("copperline:app")).sent), true);
        assert.equal(submissions, 0);
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("#success-panel")).toBeVisible();
        await page.locator("#edit-application").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#name")).toBeFocused();
        await expect(page.locator("#application-form")).toBeVisible();
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("copperline:app")).sent), false);
        record(`${viewport.width}: keyboard local save, reload success, edit and no submission`, { networkSubmissions: submissions, sentReloaded: true, editRestored: true });
        await page.evaluate(() => localStorage.setItem("unrelated-test-key", "preserve"));
        await page.locator("#clear-draft").click();
        await expect(page.locator("#name")).toHaveValue("");
        await expect(page.locator(".submit")).toBeDisabled();
        assert.equal(await page.evaluate(() => localStorage.getItem("copperline:app")), null);
        assert.equal(await page.evaluate(() => localStorage.getItem("unrelated-test-key")), "preserve");
        await page.evaluate(() => localStorage.removeItem("unrelated-test-key"));
        record(`${viewport.width}: clear draft is isolated to the application key`, { unrelatedStoragePreserved: true });

        await page.locator(".plan-choice").nth(1).click();
        await expect(page.locator(".plan").nth(1)).toHaveClass(/selected/);
        await expect(page.locator(".plan-status")).toContainText("Selected for comparison: Installments");
        await expect(page).toHaveURL(/#apply$/);
        await page.locator(".plan-choice").first().click();
        await expect(page.locator(".plan").first()).toHaveClass(/selected/);
        assert.equal(await page.locator(".plan.selected").count(), 1);
        record(`${viewport.width}: tuition comparison changes selection and navigates to application`, { checkout: false, exclusiveSelection: true });

        for (let index = 0; index < 5; index += 1)
        {
            const summary = page.locator("summary").nth(index);
            await summary.focus();
            await page.keyboard.press("Enter");
            await expect(page.locator("details").nth(index)).toHaveAttribute("open", "");
            await page.keyboard.press("Space");
            assert.equal(await page.locator("details").nth(index).getAttribute("open"), null);
        }
        record(`${viewport.width}: all five FAQ rows toggle by Enter and Space`, { rows: 5 });

        await page.locator("#instructors").scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        assert.equal(await page.locator(".instructor img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 100)), true);
        await page.locator(".instructors").screenshot({ path: path.join(checks, mobile ? "mobile-instructors.png" : "desktop-instructors.png") });
        await page.locator("#outcomes").scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
        assert.deepEqual(await page.locator(".stat-value").allTextContents(), ["87%", "+$21k", "420", "14"]);
        await page.locator("#tuition").scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.locator(".plans").screenshot({ path: path.join(checks, mobile ? "mobile-tuition.png" : "desktop-tuition.png") });
        await page.locator("#apply").scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.locator(".application-card").screenshot({ path: path.join(checks, mobile ? "mobile-application.png" : "desktop-application.png") });
        const after = await noOverflow(page, `${viewport.width}: after interactions`);
        if (mobile)
        {
            assert.equal(await page.locator("tbody tr").first().evaluate((element) => getComputedStyle(element).display), "block");
            await expect(page.locator(".nav-link").first()).toBeHidden();
        }
        const localLinks = await page.locator('a[href^="./"]').evaluateAll((links) => [...new Set(links.map((link) => link.href))]);
        for (const link of localLinks)
        {
            assert.equal((await page.request.get(link)).status(), 200);
        }
        const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
        assert.equal(resources.every((url) => new URL(url).origin === locationOrigin(server.url)), true);
        record(`${viewport.width}: exact local portraits, final counter values, local links and no overflow after interaction`, { after, sameOriginResourcesOnly: true, mobileStackedTable: mobile });
        results.viewports.push({ ...viewport, deviceScaleFactor: 1, passed: true, before, after });
        await context.close();
    }

    const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    watch(reducedPage);
    await reducedPage.goto(server.url, { waitUntil: "networkidle" });
    await expect(reducedPage.locator("h1")).toBeVisible();
    assert.equal(await reducedPage.locator(".will-reveal").count(), 0);
    assert.deepEqual(await reducedPage.locator(".stat-value").allTextContents(), ["87%", "+$21k", "420", "14"]);
    assert.equal(await reducedPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
    const wide = await noOverflow(reducedPage, "1440 reduced motion");
    await reducedPage.keyboard.press("Tab");
    await expect(reducedPage.locator(".skip-link")).toBeFocused();
    assert.equal(await reducedPage.locator(".skip-link").evaluate((element) => getComputedStyle(element).outlineStyle), "solid");
    await reducedPage.keyboard.press("Enter");
    await expect(reducedPage).toHaveURL(/#main$/);
    await reducedPage.setViewportSize({ width: 320, height: 760 });
    await noOverflow(reducedPage, "320 reduced motion");
    results.viewports.push({ width: 1440, height: 900, reducedMotion: true, passed: true, dimensions: wide });
    record("Reduced motion, 1440px and 320px layouts, skip link and visible keyboard focus", { finalCountersWithoutAnimation: true, noReveal: true, outline: "solid" });
    await reducedContext.close();

    const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await deniedContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage denied", "SecurityError"); } });
    });
    const deniedPage = await deniedContext.newPage();
    watch(deniedPage);
    await deniedPage.goto(server.url, { waitUntil: "networkidle" });
    await expect(deniedPage.locator(".draft-status")).toContainText("Browser storage is unavailable.");
    await deniedPage.locator("#name").fill("Alex Morgan");
    await deniedPage.locator("#email").fill("alex@example.com");
    await deniedPage.locator("#track").selectOption("autumn");
    await deniedPage.locator("#why").fill("A valid application that must not claim to save when browser storage is blocked.");
    await expect(deniedPage.locator(".submit")).toBeDisabled();
    await expect(deniedPage.locator("#success-panel")).toBeHidden();
    await noOverflow(deniedPage, "storage denied mobile");
    record("Blocked browser storage fails honestly with no false application saved", { submitDisabled: true, explicitMessage: true });
    await deniedContext.close();

    async function bytes(directory)
    {
        let total = 0;
        for (const entry of await fs.readdir(directory, { withFileTypes: true }))
        {
            total += entry.isDirectory() ? await bytes(path.join(directory, entry.name)) : (await fs.stat(path.join(directory, entry.name))).size;
        }
        return total;
    }
    const staticBytes = await bytes(path.join(job.output, "out"));
    assert.ok(staticBytes < 7 * 1024 * 1024);
    assert.deepEqual(results.browserErrors, []);
    record("Static payload budget and clean browser runtime", { bytesBeforePreview: staticBytes, limit: 7 * 1024 * 1024, errors: [] });
    results.passed = true;
}
catch (error)
{
    results.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    results.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), results);
    console.log(JSON.stringify({ passed: results.passed, tests: results.tests.length, errors: results.browserErrors, failure: results.failure, resourcesClosed: results.resourcesClosed }));
}

function locationOrigin(url)
{
    return new URL(url).origin;
}
