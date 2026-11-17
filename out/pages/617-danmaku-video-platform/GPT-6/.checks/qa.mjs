import path from "node:path";
import assert from "node:assert/strict";
import { cp, readFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
for (const name of ["index.html", "styles.css", "app.js", "content.js", "film.js", "LICENSE.txt", "assets"])
{
    await cp(path.join(folder, name), path.join(exported, name), { recursive: true });
}
const result =
{
    prompt: job.prompt,
    modelId: job.modelId,
    passed: false,
    checkedAt: new Date().toISOString(),
    viewports: { desktop: { width: 1200, height: 900, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 1 } },
    staticDigest: await StaticHomepage.validateStaticOutput(exported, "danmaku-video-platform", "GPT-6"),
    assertions: [],
    consoleErrors: [],
    pageErrors: [],
    requestErrors: [],
    httpErrors: [],
    externalRequests: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
const record = (name, detail) =>
{
    result.assertions.push({ name, passed: true, detail });
    console.log(`PASS ${name}`);
};
const observe = (page) =>
{
    page.on("console", (message) =>
    {
        if (message.type() === "error") result.consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => result.pageErrors.push(error.message));
    page.on("requestfailed", (request) => result.requestErrors.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.httpErrors.push({ url: response.url(), status: response.status() });
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith("http://127.0.0.1:") && !request.url().startsWith("blob:http://127.0.0.1:") && !request.url().startsWith("data:")) result.externalRequests.push(request.url());
    });
};
async function noOverflow(page, name)
{
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(dimensions.scroll <= dimensions.viewport + 1, JSON.stringify(dimensions));
    record(name, dimensions);
}
async function ready(page)
{
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
}
async function seek(page, seconds)
{
    await page.locator("#seek").evaluate((input, value) =>
    {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }, seconds);
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeCloseTo(seconds, 0);
    await page.waitForTimeout(100);
}
try
{
    server = await startPreviewServer(exported, { workspace: root });
    result.mount = new URL(server.url).pathname;
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: result.viewports.desktop, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await desktop.newPage();
    observe(page);
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await ready(page);
    await expect(page.locator("h1")).toHaveText("Stay curious.");
    await expect(page.locator("#feed .film-card")).toHaveCount(6);
    assert.ok(await page.evaluate(() => document.body.innerText.trim().length > 700));
    assert.ok(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)));
    assert.ok(await page.evaluate(() => document.fonts.check('500 20px "Space Grotesk"') && document.fonts.check('400 14px "Inter"')));
    record("Desktop HTTP, meaningful English homepage, six loaded original thumbnails and local fonts", { status: 200, cards: 6 });
    await noOverflow(page, "Desktop initial no horizontal overflow");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    result.screenshots.desktop = path.join(checks, "desktop.png");

    await page.keyboard.press("/");
    await expect(page.locator("#search")).toBeFocused();
    await page.locator("#search").fill("ocean");
    await expect(page.locator("#feed .film-card")).toHaveCount(1);
    await expect(page.locator(".intro")).toBeHidden();
    await expect(page.locator("#feed h3")).toHaveText("The Ocean Has a Rhythm");
    await page.locator("#search").fill("not-a-film");
    await expect(page.locator(".empty")).toBeVisible();
    await page.locator("#search").fill("");
    await page.getByRole("button", { name: "Urban stories", exact: true }).click();
    await expect(page.locator("#feed .film-card")).toHaveCount(2);
    await page.getByRole("button", { name: "All films", exact: true }).click();
    await page.locator("#sort").selectOption("title");
    const titles = await page.locator("#feed h3").allTextContents();
    assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b)));
    record("Keyboard search, empty search state, real category filtering and title sorting", { sortedTitles: titles });

    await page.getByRole("button", { name: "Saved films", exact: true }).click();
    await expect(page.locator(".empty")).toBeVisible();
    await page.getByRole("button", { name: "Discover", exact: true }).click();
    await page.locator(".hero-copy .primary").click();
    await ready(page);
    await expect(page.locator("#film-title")).toHaveText("A City Before It Wakes");
    await expect.poll(() => page.locator("#film").evaluate((video) => video.readyState)).toBeGreaterThanOrEqual(2);
    const media = await page.locator("#film").evaluate((video) =>
        ({ duration: video.duration, width: video.videoWidth, height: video.videoHeight, src: video.currentSrc, ready: video.readyState }));
    assert.ok(Math.abs(media.duration - 24) < 0.1);
    assert.equal(media.width, 960);
    await page.locator("#big-play").click();
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeGreaterThan(1.7);
    await page.locator("#play").click();
    const paused = await page.locator("#film").evaluate((video) => video.currentTime);
    await page.waitForTimeout(350);
    assert.ok(Math.abs(await page.locator("#film").evaluate((video) => video.currentTime) - paused) < 0.03);
    record("Actual local WebM decoding, 960×540 video playback and stable pause", media);

    await seek(page, 5);
    await expect(page.locator("#current-time")).toHaveText("0:05");
    assert.ok(await page.locator(".danmaku:not([hidden])").count() >= 3);
    const transforms = await page.locator(".danmaku:not([hidden])").evaluateAll((nodes) => nodes.map((node) => node.style.transform));
    await page.waitForTimeout(200);
    assert.deepEqual(await page.locator(".danmaku:not([hidden])").evaluateAll((nodes) => nodes.map((node) => node.style.transform)), transforms);
    await page.locator("#player").focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeCloseTo(10, 0);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("m");
    await expect(page.locator("#overlay-toggle")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".danmaku:not([hidden])")).toHaveCount(0);
    await page.keyboard.press("m");
    const movingComment = page.locator(".danmaku").filter({ hasText: "There it is. That little detail." });
    const beforeMotion = await movingComment.evaluate((node) => node.style.transform);
    await page.keyboard.press("Space");
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeGreaterThan(5.3);
    assert.notEqual(await movingComment.evaluate((node) => node.style.transform), beforeMotion);
    await page.keyboard.press("Space");
    record("Seek/pause synchronization and keyboard play, seek, overlay controls", { pausedTransforms: transforms.length });

    await page.locator("#comment-filter").selectOption({ label: "Questions" });
    await expect(page.locator(".comment-row")).toHaveCount(1);
    await expect(page.locator(".comment-row p")).toContainText("How is this made");
    await page.locator("#sparse").check();
    await expect(page.locator("#sparse")).toBeChecked();
    await page.locator("#comment-filter").selectOption({ label: "All comments" });
    await page.locator("#sparse").uncheck();
    await page.locator("#density button").nth(4).click();
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeCloseTo(6, 0);
    await seek(page, 5);
    const before = await page.locator(".comment-row").count();
    await page.locator("#comment-text").fill("The little train makes this moment.");
    await page.locator("#comment-kind").selectOption({ label: "Reactions" });
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.locator(".comment-row")).toHaveCount(before + 1);
    await expect(page.locator("#comment-count")).toHaveText(String(before + 1));
    const densityCount = await page.locator("#density button").evaluateAll((buttons) =>
        buttons.reduce((total, button) => total + Number(button.title.split(" ")[0]), 0));
    assert.equal(densityCount, before + 1);
    await seek(page, 6);
    await expect(page.locator(".danmaku.mine")).toBeVisible();
    await page.locator("#comment-filter").selectOption({ label: "My comments" });
    await expect(page.locator(".comment-row")).toHaveCount(1);
    await expect(page.locator(".comment-row p")).toContainText("The little train makes this moment.");
    record("Timed local injection, actual danmaku visibility, density update, type/my-comment filters and seekable map", { before, after: before + 1, densityCount });

    await seek(page, 23.7);
    await page.locator("#play").click();
    await expect.poll(() => page.locator("#film").evaluate((video) => video.ended)).toBe(true);
    await expect(page.locator("#play")).toHaveAttribute("aria-label", "Replay film");
    await page.locator("#play").click();
    await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeLessThan(1);
    await page.locator("#play").click();
    record("Real film end and replay reset the actual media clock");

    await page.locator("#save").click();
    await expect(page.locator("#save")).toHaveAttribute("aria-pressed", "true");
    await page.locator("#follow").click();
    await expect(page.locator("#follow")).toHaveAttribute("aria-pressed", "true");
    await page.locator("#share").click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(clipboard.includes("#/watch?id=city"));
    await page.reload();
    await ready(page);
    await expect(page.locator("#save")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#follow")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#comment-filter")).toHaveValue("My comments");
    await expect(page.locator(".comment-row")).toHaveCount(1);
    await page.locator("#comment-filter").selectOption({ label: "All comments" });
    await seek(page, 6.5);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(checks, "desktop-watch.png") });
    result.screenshots.desktopWatch = path.join(checks, "desktop-watch.png");
    await noOverflow(page, "Desktop after watch interactions no horizontal overflow");
    record("Persistent saved/follow/comment/preferences state and real share clipboard", { clipboard });

    await page.getByRole("button", { name: "Saved films", exact: true }).click();
    await expect(page.locator("#feed .film-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Following", exact: true }).click();
    await expect(page.locator("#feed .film-card")).toHaveCount(2);
    await page.getByRole("button", { name: "Discover", exact: true }).click();
    await page.locator("#sort").selectOption("trending");
    await page.locator('[data-film="form"] .thumb').click();
    await ready(page);
    await expect(page.locator("#film-title")).toHaveText("A Little Room for Play");
    record("Saved/followed feeds and related catalogue navigation", { saved: 1, followedFilms: 2 });

    const videos = ["form", "tide", "clay", "night", "garden"];
    const decoded = [];
    for (const id of videos)
    {
        await page.goto(`${server.url}#/watch?id=${id}`);
        await ready(page);
        await expect.poll(() => page.locator("#film").evaluate((video) => video.readyState)).toBeGreaterThanOrEqual(2);
        await page.locator("#big-play").click();
        await expect.poll(() => page.locator("#film").evaluate((video) => video.currentTime)).toBeGreaterThan(0.25);
        await page.locator("#play").click();
        await seek(page, 8);
        const info = await page.locator("#film").evaluate((video) =>
            ({ seconds: video.currentTime, duration: video.duration, frames: video.getVideoPlaybackQuality().totalVideoFrames }));
        assert.ok(info.frames > 0);
        assert.equal(info.duration, 12);
        decoded.push({ id, ...info });
    }
    record("All five additional original local clips decode, play and seek", decoded);
    await page.locator('.film-card .thumb').first().click();
    await expect(page.locator("#film-title")).toHaveText("A City Before It Wakes");
    record("Related-film hash navigation changes actual film");

    const mobileContext = await browser.newContext({ viewport: result.viewports.mobile, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    observe(mobile);
    await mobile.goto(server.url);
    await ready(mobile);
    await noOverflow(mobile, "Mobile initial no horizontal overflow");
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    result.screenshots.mobile = path.join(checks, "mobile.png");
    await mobile.getByRole("button", { name: "Nature", exact: true }).tap();
    await expect(mobile.locator("#feed .film-card")).toHaveCount(2);
    await mobile.locator('[data-film="tide"] .thumb').tap();
    await ready(mobile);
    await mobile.locator("#big-play").tap();
    await expect.poll(() => mobile.locator("#film").evaluate((video) => video.currentTime)).toBeGreaterThan(0.5);
    await mobile.locator("#play").tap();
    await mobile.locator("#seek").focus();
    await mobile.keyboard.press("ArrowRight");
    const keyboardSeek = await mobile.locator("#film").evaluate((video) => video.currentTime);
    assert.ok(keyboardSeek > 0.6);
    await seek(mobile, 3);
    await mobile.locator("#comment-text").fill("A lovely rhythm to these waves.");
    await mobile.getByRole("button", { name: "Send", exact: true }).tap();
    await expect(mobile.locator(".comment-row p").filter({ hasText: "A lovely rhythm to these waves." })).toBeVisible();
    await mobile.locator("#save").tap();
    await mobile.locator("#follow").tap();
    await mobile.locator("#overlay-toggle").tap();
    await expect(mobile.locator("#overlay-toggle")).toHaveAttribute("aria-pressed", "false");
    await mobile.locator("#overlay-toggle").tap();
    await seek(mobile, 4);
    await noOverflow(mobile, "Mobile after actual playback, keyboard seeking and comment/save/follow interactions no overflow");
    await mobile.evaluate(() => window.scrollTo(0, 0));
    await mobile.screenshot({ path: path.join(checks, "mobile-watch.png") });
    result.screenshots.mobileWatch = path.join(checks, "mobile-watch.png");
    const touchSizes = await mobile.locator(".player-controls button, .send, .action, .density button").evaluateAll((buttons) =>
        buttons.map((button) => ({ name: button.getAttribute("aria-label") || button.textContent, width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })));
    assert.ok(touchSizes.every((size) => size.width >= 43.5 && size.height >= 43.5), JSON.stringify(touchSizes));
    record("Mobile actual media, keyboard range seeking, touch controls and local comment workflow", { viewport: result.viewports.mobile, touchSizes });
    await mobile.getByRole("button", { name: "Your local profile", exact: true }).tap();
    await expect(mobile.locator("dialog")).toBeVisible();
    await expect(mobile.locator("dialog")).toContainText("no accounts");
    await mobile.keyboard.press("Escape");
    await expect(mobile.locator("dialog")).not.toBeVisible();
    record("Honest local profile disclosure, accessible modal and Escape dismissal");
    await mobileContext.close();

    const fallbackContext = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await fallbackContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Unavailable", "SecurityError"); } });
        Object.defineProperty(navigator, "clipboard", { value: undefined });
    });
    const fallback = await fallbackContext.newPage();
    observe(fallback);
    await fallback.goto(`${server.url}#/watch`);
    await ready(fallback);
    await fallback.locator("#save").click();
    await expect(fallback.locator("#save")).toHaveAttribute("aria-pressed", "true");
    await fallback.locator("#share").click();
    await expect(fallback.locator("dialog input")).toHaveValue(/#\/watch\?id=city/);
    await fallback.keyboard.press("Escape");
    record("Storage-blocked memory fallback and clipboard-unavailable selectable-link fallback");
    await fallbackContext.close();
    await desktop.close();
    assert.deepEqual(result.consoleErrors, []);
    assert.deepEqual(result.pageErrors, []);
    assert.deepEqual(result.requestErrors, []);
    assert.deepEqual(result.httpErrors, []);
    assert.deepEqual(result.externalRequests, []);
    record("Zero console/page/request/HTTP errors and zero external runtime requests");
    result.passed = true;
}
catch (error)
{
    result.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
}
console.log(`QA ${result.passed ? "passed" : "failed"}: ${result.assertions.length} assertion groups. Resources closed.`);
