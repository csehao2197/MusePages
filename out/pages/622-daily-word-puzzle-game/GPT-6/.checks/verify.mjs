import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile, readdir, stat } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const root = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checks = path.join(folder, ".checks");
const exported = path.join(folder, "out");
const workflow = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const game = await import(pathToFileURL(path.join(folder, "game.mjs")));
const { answers, accepted, content } = await import(pathToFileURL(path.join(folder, "content.mjs")));
const qa = {
    prompt: "622-daily-word-puzzle-game",
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    tests: [],
    errors: [],
    viewports: [
        { name: "desktop", width: 1200, height: 900, deviceScaleFactor: 1 },
        { name: "mobile", width: 390, height: 844, deviceScaleFactor: 1, reducedMotion: true },
        { name: "wide", width: 1440, height: 900 },
        { name: "narrow", width: 320, height: 700 }
    ],
    screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
const contexts = [];

async function test(name, action)
{
    await action();
    qa.tests.push({ name, passed: true });
    console.log(`PASS ${name}`);
}

function memory()
{
    const data = new Map();
    return { getItem: (key) => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
}

function submit(store, word)
{
    for (const letter of word) store.input(letter);
    return store.input("Enter");
}

function observe(page)
{
    page.on("pageerror", (error) => qa.errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") qa.errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => qa.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()}: ${response.url()}`);
        if (!response.url().startsWith("http://127.0.0.1:")) qa.errors.push(`Unexpected external request: ${response.url()}`);
    });
}

async function noOverflow(page)
{
    const sizes = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, JSON.stringify(sizes));
}

async function openPage(options = {}, init)
{
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, ...options });
    contexts.push(context);
    if (init) await context.addInitScript(init);
    const page = await context.newPage();
    observe(page);
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveText(content.headline);
    await noOverflow(page);
    return { context, page };
}

try
{
    await test("Dictionary: forty original answers, eighty extras, unique five-letter words, strict validation and wrap", () =>
    {
        assert.equal(answers.length, 40);
        assert.equal(accepted.length, 120);
        assert.equal(new Set(accepted).size, 120);
        assert.ok(accepted.every((word) => /^[A-Z]{5}$/.test(word)));
        assert.equal(game.isValid("crane"), true);
        assert.equal(game.isValid("ZZZZZ"), false);
        assert.equal(game.isValid("CRANE "), false);
        assert.equal(game.pickAnswer(40), "CRANE");
        assert.equal(game.pickAnswer(1), "PLANT");
    });
    await test("Duplicate scoring: exact matches first, repeated letters consume only remaining occurrences", () =>
    {
        assert.deepEqual(game.judge("EAGER", "CRANE"), ["near", "near", "miss", "miss", "near"]);
        assert.deepEqual(game.judge("APPLE", "PLANT"), ["near", "near", "miss", "near", "miss"]);
        assert.deepEqual(game.judge("BERRY", "BREAD"), ["hit", "near", "near", "miss", "miss"]);
        assert.deepEqual(game.judge("ALONE", "APPLE"), ["hit", "near", "miss", "miss", "hit"]);
        assert.deepEqual(game.judge("EAGER", "EAGER"), Array(5).fill("hit"));
    });
    await test("Persistent store: invalid guesses, bounded typing, immutable playing-next, wins, loss, streaks and reset", () =>
    {
        const storage = memory();
        let store = game.createStore(storage);
        store.next();
        assert.equal(store.get().round.answerIndex, 0);
        assert.equal(submit(store, "ZZZZZ").error, content.invalid);
        assert.equal(store.get().round.rows.length, 0);
        store.input("Z");
        assert.equal(store.get().round.current.length, 5);
        for (let i = 0; i < 5; i++) store.input("Backspace");
        assert.ok(store.input("Enter").error);
        submit(store, "CRANE");
        assert.deepEqual(store.get().stats, { played: 1, wins: 1, streak: 1, best: 1, distribution: [1, 0, 0, 0, 0, 0] });
        store = game.createStore(storage);
        assert.equal(store.get().round.status, "won");
        assert.equal(store.get().stats.played, 1);
        store.next();
        for (let i = 0; i < 6; i++) submit(store, "EAGER");
        assert.equal(store.get().round.status, "lost");
        assert.deepEqual(store.get().stats, { played: 2, wins: 1, streak: 0, best: 1, distribution: [1, 0, 0, 0, 0, 0] });
        assert.equal(store.get().history.length, 2);
        store.next();
        submit(store, "BRICK");
        assert.equal(store.get().stats.streak, 1);
        store.next();
        submit(store, "MOUSE");
        assert.equal(store.get().stats.best, 2);
        store.resetStats();
        assert.deepEqual(store.get().stats, game.emptyStats());
        assert.equal(store.get().history.length, 0);
    });
    await test("Malformed storage and unavailable storage remain playable; original share contains no emoji", () =>
    {
        const broken = memory();
        broken.setItem(game.storageKey, "{bad");
        assert.equal(game.createStore(broken).warning(), content.recovered);
        const unavailable = game.createStore({ getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); } });
        submit(unavailable, "CRANE");
        assert.equal(unavailable.get().round.status, "won");
        assert.equal(unavailable.warning(), content.storageWarning);
        assert.equal(game.shareResult(unavailable.get().round), "Larkspur — solved in 1/6 (sample puzzle 1)\n▉ ▉ ▉ ▉ ▉");
    });
    await test("Real independent static source, byte-identical public resources and under-three-megabyte export", async () =>
    {
        assert.equal(await workflow.StaticHomepage.checkSource(folder), "html");
        qa.staticDigest = await workflow.StaticHomepage.validateStaticOutput(exported, "daily-word-puzzle-game", "GPT-6");
        let bytes = 0;
        async function walk(directory)
        {
            for (const entry of await readdir(directory, { withFileTypes: true }))
            {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) await walk(file);
                else
                {
                    if (entry.name === "preview.png") continue;
                    bytes += (await stat(file)).size;
                    assert.deepEqual(await readFile(file), await readFile(path.join(folder, path.relative(exported, file))));
                }
            }
        }
        await walk(exported);
        qa.staticBytesExcludingPreview = bytes;
        assert.ok(bytes < 3 * 1024 * 1024);
    });
    server = await startPreviewServer(exported, { workspace: root });
    const health = await fetch(server.url);
    assert.equal(health.status, 200);
    qa.servedUrl = server.url;
    await test("Preview server responds at final public subpath and does not expose repository or private source", async () =>
    {
        assert.ok(server.url.endsWith("/pages/daily-word-puzzle-game/GPT-6/index.html"));
        for (const suffix of ["/", "/README.md", "/metadata.json", "/.checks/qa.json"])
        {
            const url = suffix === "/" ? new URL("/", server.url) : new URL(`.${suffix}`, server.url);
            assert.equal((await fetch(url)).status, 404);
        }
    });
    browser = await chromium.launch({ headless: true });
    const { page: desktop, context: desktopContext } = await openPage();
    await desktopContext.grantPermissions(["clipboard-read", "clipboard-write"]);
    await test("Desktop first-visit help: native focus containment, blocked game input, keyboard dismissal and self-hosted fonts", async () =>
    {
        await expect(desktop.locator("#help-dialog")).toBeVisible();
        await desktop.keyboard.type("CRANE");
        assert.equal(await desktop.evaluate(() => JSON.parse(localStorage.getItem("larkspur:stats")).round.current), "");
        await desktop.locator("#help-start").focus();
        await desktop.keyboard.press("Tab");
        await expect(desktop.locator("#close-help")).toBeFocused();
        await desktop.keyboard.press("Shift+Tab");
        await expect(desktop.locator("#help-start")).toBeFocused();
        await desktop.keyboard.press("Escape");
        await expect(desktop.locator("#help-dialog")).not.toBeVisible();
        await expect(desktop.locator("#help-button")).toBeFocused();
        assert.equal(await desktop.evaluate(() => document.fonts.check('600 24px "Bricolage Grotesque"') && document.fonts.check('400 14px "Inter"')), true);
        await noOverflow(desktop);
    });
    await test("Stats keyboard opening, real zero baseline, reset cancellation and return to game", async () =>
    {
        await desktop.locator("#stats-button").focus();
        await desktop.keyboard.press("Enter");
        await expect(desktop.locator("#stats-panel")).toBeVisible();
        await expect(desktop.locator("#standalone-stats dd").first()).toHaveText("0");
        await desktop.locator("#standalone-stats .reset-trigger").click();
        await expect(desktop.locator("#standalone-stats .reset-confirm")).toBeVisible();
        await desktop.locator("#standalone-stats .cancel-reset").click();
        await expect(desktop.locator("#standalone-stats .reset-confirm")).not.toBeVisible();
        await desktop.locator("#back-button").click();
        await expect(desktop.locator("#keyboard")).toBeVisible();
    });
    await test("Desktop physical input: short/unknown guesses rejected, max length, delete, real staggered flip and keyboard precedence", async () =>
    {
        await desktop.keyboard.type("AB");
        await desktop.locator('[data-key="Enter"]').focus();
        await desktop.keyboard.press("Enter");
        await expect(desktop.locator("#toast")).toHaveText(content.needLetters);
        await desktop.keyboard.press("Backspace");
        await desktop.keyboard.press("Backspace");
        await desktop.keyboard.type("ZZZZZZZ");
        assert.equal(await desktop.evaluate(() => JSON.parse(localStorage.getItem("larkspur:stats")).round.current), "ZZZZZ");
        await desktop.keyboard.press("Enter");
        await expect(desktop.locator("#toast")).toHaveText(content.invalid);
        assert.equal(await desktop.evaluate(() => JSON.parse(localStorage.getItem("larkspur:stats")).round.rows.length), 0);
        for (let i = 0; i < 5; i++) await desktop.keyboard.press("Backspace");
        await desktop.keyboard.type("EAGER");
        await desktop.keyboard.press("Enter");
        await expect(desktop.locator(".tile-row").first()).toHaveClass(/flipping/);
        await desktop.keyboard.type("CRANE");
        assert.equal(await desktop.evaluate(() => JSON.parse(localStorage.getItem("larkspur:stats")).round.current), "");
        await expect(desktop.locator('.tile[data-row="0"][data-col="4"]')).toHaveAttribute("data-state", "near");
        await expect(desktop.locator('[data-key="E"]')).toBeEnabled();
        assert.deepEqual(await desktop.locator('.tile[data-row="0"]').evaluateAll((tiles) => tiles.map((tile) => tile.dataset.state)), ["near", "near", "miss", "miss", "near"]);
        await expect(desktop.locator('[data-key="E"]')).toHaveAttribute("data-state", "near");
        await expect(desktop.locator('[data-key="G"]')).toHaveAttribute("data-state", "miss");
        await desktop.keyboard.type("CR");
        await desktop.reload();
        await expect(desktop.locator("#help-dialog")).not.toBeVisible();
        await expect(desktop.locator('.tile[data-row="1"][data-col="1"]')).toHaveText("R");
        await desktop.waitForTimeout(2250);
        await desktop.evaluate(() => scrollTo(0, 0));
        await noOverflow(desktop);
        await desktop.screenshot({ path: qa.screenshots.desktop });
        const layout = await desktop.locator("footer").boundingBox();
        assert.ok(layout.y + layout.height <= 900, `Desktop game should fit the first screen: ${JSON.stringify(layout)}`);
    });
    await test("Desktop actual win, one-time stats, history, exact clipboard text and restored completed round", async () =>
    {
        await desktop.locator('[data-key="A"]').focus();
        await desktop.keyboard.type("ANE");
        await desktop.keyboard.press("Enter");
        await expect(desktop.locator("#result-panel")).toBeVisible();
        await expect(desktop.locator("#result-heading")).toHaveText("Solved in 2/6");
        await expect(desktop.locator("#answer")).toHaveText("CRANE");
        await expect(desktop.locator("#keyboard")).not.toBeVisible();
        await expect(desktop.locator("#result-stats dd").first()).toHaveText("1");
        await expect(desktop.locator("#result-stats .bar.winning")).toHaveText("1");
        await expect(desktop.locator('[data-key="E"]')).toHaveAttribute("data-state", "hit");
        await desktop.locator("#result-stats summary").click();
        await expect(desktop.locator("#result-stats .history li")).toHaveCount(1);
        await desktop.locator("#copy-button").click();
        await expect(desktop.locator("#toast")).toHaveText(content.copied);
        const clipboard = await desktop.evaluate(() => navigator.clipboard.readText());
        assert.equal(clipboard.replaceAll("\r\n", "\n"), "Larkspur — solved in 2/6 (sample puzzle 1)\n◪ ◪ ▢ ▢ ◪\n▉ ▉ ▉ ▉ ▉");
        await desktop.reload();
        await expect(desktop.locator("#result-heading")).toHaveText("Solved in 2/6");
        await expect(desktop.locator("#result-stats dd").first()).toHaveText("1");
        await noOverflow(desktop);
    });
    await test("Clipboard denial: truthful fallback offers the actual selectable result", async () =>
    {
        await desktop.evaluate(() =>
        {
            navigator.clipboard.writeText = async () => { throw new DOMException("Test permission denial", "NotAllowedError"); };
        });
        await desktop.locator("#copy-button").click();
        await expect(desktop.locator("#share-fallback")).toBeVisible();
        await expect(desktop.locator("#share-fallback")).toHaveValue(/solved in 2\/6/);
        await expect(desktop.locator("#toast")).toHaveText(content.copyFallback);
        await desktop.locator("#next-button").click();
        await expect(desktop.locator("#puzzle-label")).toHaveText("PUZZLE 02");
        assert.equal(await desktop.evaluate(() => JSON.parse(localStorage.getItem("larkspur:stats")).stats.played), 1);
    });
    const { page: mobile } = await openPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    async function tapWord(word)
    {
        for (const letter of word) await mobile.locator(`[data-key="${letter}"]`).tap();
        await mobile.locator('[data-key="Enter"]').tap();
    }
    await test("Mobile touch and reduced motion: help, real round win, next answer, repeated-letter states, no overflow", async () =>
    {
        await mobile.locator("#help-start").tap();
        await mobile.locator('[data-key="Z"]').tap();
        await mobile.locator('[data-key="Backspace"]').tap();
        await tapWord("CRANE");
        await expect(mobile.locator("#result-heading")).toHaveText("Solved in 1/6");
        await expect(mobile.locator(".tile-row.flipping")).toHaveCount(0);
        assert.equal(await mobile.locator(".tile").first().evaluate((tile) => getComputedStyle(tile).animationName), "none");
        await mobile.locator("#next-button").tap();
        await tapWord("APPLE");
        assert.deepEqual(await mobile.locator('.tile[data-row="0"]').evaluateAll((tiles) => tiles.map((tile) => tile.dataset.state)), ["near", "near", "miss", "near", "miss"]);
        await expect(mobile.locator('[data-key="P"]')).toHaveAttribute("data-state", "near");
        for (const letter of "PLA") await mobile.locator(`[data-key="${letter}"]`).tap();
        await mobile.waitForTimeout(2250);
        await mobile.evaluate(() => scrollTo(0, 0));
        await noOverflow(mobile);
        await mobile.screenshot({ path: qa.screenshots.mobile });
        const layout = await mobile.locator("footer").boundingBox();
        assert.ok(layout.y + layout.height <= 844, `Mobile game should fit the first screen: ${JSON.stringify(layout)}`);
    });
    await test("Mobile genuine six-guess loss, streak reset, history, reload idempotence and reset confirmation", async () =>
    {
        for (let i = 0; i < 3; i++) await mobile.locator('[data-key="Backspace"]').tap();
        for (let i = 0; i < 5; i++) await tapWord("EAGER");
        await expect(mobile.locator("#result-heading")).toHaveText("Out of tries");
        await expect(mobile.locator("#answer")).toHaveText("PLANT");
        await expect(mobile.locator("#loss-copy")).toContainText("There's no tomorrow");
        const stats = await mobile.locator("#result-stats dd").allTextContents();
        assert.deepEqual(stats, ["2", "50%", "0", "1"]);
        await mobile.locator("#result-stats summary").tap();
        await expect(mobile.locator("#result-stats .history li")).toHaveCount(2);
        await mobile.reload();
        await expect(mobile.locator("#result-stats dd").first()).toHaveText("2");
        await mobile.locator("#result-stats .reset-trigger").tap();
        await mobile.locator("#result-stats .confirm-reset").tap();
        await expect(mobile.locator("#result-stats dd").first()).toHaveText("0");
        await mobile.reload();
        await expect(mobile.locator("#result-stats dd").first()).toHaveText("0");
        await mobile.locator("#next-button").tap();
        await expect(mobile.locator("#puzzle-label")).toHaveText("PUZZLE 03");
        await noOverflow(mobile);
    });
    await test("Responsive 1440px and 320px layouts, meaningful visible content before and after interaction", async () =>
    {
        await desktop.setViewportSize({ width: 1440, height: 900 });
        await noOverflow(desktop);
        await desktop.keyboard.type("BRICK");
        await noOverflow(desktop);
        await mobile.setViewportSize({ width: 320, height: 700 });
        await noOverflow(mobile);
        await mobile.locator("#help-button").tap();
        await expect(mobile.locator("#help-dialog")).toBeVisible();
        await noOverflow(mobile);
        await mobile.locator("#close-help").tap();
        await mobile.locator('[data-key="B"]').tap();
        await noOverflow(mobile);
    });
    await test("Browser recovery from corrupt saved JSON and denied localStorage, with real playable fallback", async () =>
    {
        const { page: corrupt } = await openPage({}, () => localStorage.setItem("larkspur:stats", "{bad"));
        await expect(corrupt.locator("#toast")).toHaveText(content.recovered);
        await corrupt.locator("#help-start").click();
        await corrupt.keyboard.type("CRANE");
        await expect(corrupt.locator('.tile[data-row="0"][data-col="4"]')).toHaveText("E");
        const { page: denied } = await openPage({ reducedMotion: "reduce" }, () =>
        {
            Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Test denied storage", "SecurityError"); } });
        });
        await expect(denied.locator("#toast")).toHaveText(content.storageWarning);
        await denied.locator("#help-start").click();
        await denied.keyboard.type("CRANE");
        await denied.keyboard.press("Enter");
        await expect(denied.locator("#result-heading")).toHaveText("Solved in 1/6");
        await noOverflow(denied);
    });
    await test("No HTTP, request, external-network, console or page errors across all actual browser interactions", () =>
    {
        assert.deepEqual(qa.errors, []);
    });
    qa.passed = true;
}
catch (error)
{
    qa.failure = { message: error.message, stack: error.stack };
    console.error(error);
    process.exitCode = 1;
}
finally
{
    for (const context of contexts) await context.close();
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    qa.finishedAt = new Date().toISOString();
    await workflow.WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, tests: qa.tests.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
