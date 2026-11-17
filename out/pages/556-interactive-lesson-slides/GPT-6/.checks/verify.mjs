import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const modelFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const results = [];
const errors = [];
const viewports = [{ width: 1200, height: 900 }, { width: 390, height: 844 }, { width: 1440, height: 900 }];
const report =
{
    passed: false,
    modelId: "gpt-6.1-sol",
    viewports,
    deviceScaleFactor: 1,
    results,
    errors,
    visualReviewed: false,
    resourcesClosed: false,
    screenshots: [".checks\\desktop.png", ".checks\\mobile.png"],
    startedAt: new Date().toISOString()
};
let server;
let browser;

async function check(name, run)
{
    await run();
    results.push({ name, passed: true });
    console.log("PASS", name);
}

async function route(page, n)
{
    await page.evaluate(n => { location.hash = `/slide/${n}`; }, n);
    await page.waitForFunction(n => document.querySelector(".page-counter")?.textContent.trim().replace(/\s+/g, " ") === `${n} / 12`, n);
    await page.waitForTimeout(220);
}

async function noOverflow(page)
{
    const sizes = await page.evaluate(() =>
    {
        const surface = document.querySelector(".slide-surface");
        const content = document.querySelector(".slide-content");
        return {
            body: [document.documentElement.scrollWidth, innerWidth],
            surface: [surface.scrollWidth, surface.clientWidth],
            stage: [surface.scrollHeight, surface.clientHeight],
            content: [content.scrollHeight, content.clientHeight]
        };
    });
    assert.ok(sizes.body[0] <= sizes.body[1], JSON.stringify(sizes));
    assert.ok(sizes.surface[0] <= sizes.surface[1] + 1, JSON.stringify(sizes));
    if (page.viewportSize().width >= 768)
    {
        assert.ok(sizes.stage[0] <= 721, `Desktop slide clips vertically: ${JSON.stringify(sizes)}`);
        assert.ok(sizes.content[0] <= 721, `Desktop content clips vertically: ${JSON.stringify(sizes)}`);
    }
}

try
{
    server = await startPreviewServer(path.join(modelFolder, "out"), { workspace });
    assert.ok(server.url.includes("/pages/interactive-lesson-slides/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: viewports[0], deviceScaleFactor: 1 });
    const page = await context.newPage();
    const captureErrors = page =>
    {
        page.on("pageerror", error => errors.push(`page: ${error.message}`));
        page.on("console", message =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", request => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response =>
        {
            if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`);
        });
        page.on("request", request =>
        {
            if (!request.url().startsWith(new URL(server.url).origin) && !request.url().startsWith("data:") && !request.url().startsWith("about:"))
            {
                errors.push(`Unexpected runtime network: ${request.url()}`);
            }
        });
    };
    captureErrors(page);
    await check("Desktop actual final-subpath homepage and local resources", async () =>
    {
        const response = await page.goto(server.url);
        assert.equal(response.status(), 200);
        await page.waitForSelector(".slide-surface h1");
        await page.evaluate(() => document.fonts.ready);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(650);
        assert.equal(await page.title(), "How Sorting Works | Tallow Street Code School");
        assert.equal(new URL(page.url()).hash, "#/slide/1");
        assert.ok((await page.locator("main").innerText()).includes("Put eight books in order"));
        assert.ok(await page.locator(".title-art img").evaluate(img => img.complete && img.naturalWidth > 100));
        await noOverflow(page);
        await page.screenshot({ path: path.join(modelFolder, ".checks", "desktop.png") });
        assert.deepEqual(errors, []);
    });
    await check("Real navigation, hash history, and keyboard quiz with retry", async () =>
    {
        await page.getByRole("button", { name: "Start the lesson", exact: true }).click();
        await page.waitForURL(/#\/slide\/2$/);
        await page.waitForFunction(() => document.querySelector(".page-counter")?.textContent.trim().replace(/\s+/g, " ") === "2 / 12");
        await page.keyboard.press("ArrowRight");
        await page.waitForURL(/#\/slide\/3$/);
        await page.waitForSelector(".option");
        await page.keyboard.press("2");
        await page.getByText("Not quite.", { exact: true }).waitFor();
        assert.equal(await page.locator(".option:disabled").count(), 4);
        assert.equal(await page.locator(".option.correct-answer").count(), 1);
        await noOverflow(page);
        await page.getByRole("button", { name: "Try again", exact: true }).click();
        await page.keyboard.press("1");
        await page.getByText("Right.", { exact: true }).waitFor();
        assert.ok((await page.locator(".score-pill").first().innerText()).includes("1/5"));
        await page.reload();
        await page.getByText("Right.", { exact: true }).waitFor();
        const a = await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).answers[3]);
        assert.equal(a.correct, true);
        assert.equal(a.attempts, 2);
        await route(page, 4);
        await page.goBack();
        await page.waitForURL(/#\/slide\/3$/);
        await page.goForward();
        await page.waitForURL(/#\/slide\/4$/);
    });
    await check("Insertion-sort stepper changes the shelf and counts all 15 shifts", async () =>
    {
        for (let i = 0; i < 7; i++) await page.getByRole("button", { name: "Next step", exact: true }).click();
        assert.equal(await page.locator(".shift-counter").innerText(), "Shifts so far: 15");
        assert.deepEqual(await page.locator("#step-diagram .book text").allTextContents(), ["1", "2", "3", "4", "5", "6", "7", "8"]);
        await noOverflow(page);
        await page.getByRole("button", { name: "Back", exact: true }).click();
        assert.equal(await page.locator(".shift-counter").innerText(), "Shifts so far: 11");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForFunction(() => document.querySelector('[data-action="stepPlay"]')?.disabled);
        assert.equal(await page.getByRole("button", { name: "Play", exact: true }).isDisabled(), true);
        await page.emulateMedia({ reducedMotion: "no-preference" });
    });
    await check("Reorder check gives per-position feedback, touch/keyboard up/down controls work", async () =>
    {
        await route(page, 5);
        await page.getByRole("button", { name: "Check order", exact: true }).click();
        await page.getByText("Close. The marked rows are out of place.", { exact: true }).waitFor();
        await noOverflow(page);
        await page.getByRole("button", { name: "Try again", exact: true }).click();
        for (const index of [2, 1, 4, 3, 2, 4])
        {
            await page.locator(`.reorder-row[data-index="${index}"] button[aria-label="Move step up"]`).click();
        }
        await page.getByRole("button", { name: "Check order", exact: true }).click();
        await page.getByText("That is the whole algorithm.", { exact: true }).waitFor();
        assert.equal(await page.locator(".reorder-row.correct").count(), 5);
        await noOverflow(page);
    });
    await check("Shift quiz and fill-in check, Enter submit and selective retry", async () =>
    {
        await route(page, 6);
        await page.keyboard.press("2");
        await page.getByText("Right.", { exact: true }).waitFor();
        await route(page, 8);
        await page.getByRole("textbox", { name: "Number of comparisons", exact: true }).fill(" Seven ");
        await page.getByRole("textbox", { name: "Number of shifts", exact: true }).fill("2");
        await page.getByRole("textbox", { name: "Number of shifts", exact: true }).press("Enter");
        await page.getByText("Not yet. Trace the first two books by hand.", { exact: true }).waitFor();
        await page.getByRole("button", { name: "Try again", exact: true }).click();
        assert.equal(await page.getByRole("textbox", { name: "Number of comparisons", exact: true }).inputValue(), " Seven ");
        assert.equal(await page.getByRole("textbox", { name: "Number of shifts", exact: true }).inputValue(), "");
        await page.getByRole("textbox", { name: "Number of shifts", exact: true }).fill(" NONE ");
        await page.getByRole("textbox", { name: "Number of shifts", exact: true }).press("Enter");
        await page.getByText("Exactly. The best case does almost no work.", { exact: true }).waitFor();
        await noOverflow(page);
        await route(page, 10);
        await page.keyboard.press("3");
        await page.getByText("Right.", { exact: true }).waitFor();
        await route(page, 12);
        assert.equal(await page.locator(".recap-score").innerText(), "5 / 5");
        assert.equal(await page.getByRole("button", { name: "Retry what I missed", exact: true }).count(), 0);
        await noOverflow(page);
    });
    await check("Real CodeMirror, runnable sort, descending edit, caught error lines, script escaping", async () =>
    {
        await route(page, 7);
        await page.getByRole("button", { name: "Run", exact: true }).click();
        await page.waitForFunction(() => document.querySelector("#console-log").textContent.includes("sorted: 1 2 3 4 5 6 7 8"));
        assert.equal(await page.locator(".log-line").count(), 9);
        const source = await page.locator(".cm-content").innerText();
        const descending = source.replace("books[gap - 1] > current", "books[gap - 1] < current");
        await page.locator(".cm-content").click();
        await page.keyboard.press("ControlOrMeta+A");
        await page.keyboard.insertText(descending);
        await page.keyboard.press("ControlOrMeta+Enter");
        await page.waitForFunction(() => document.querySelector("#console-log").textContent.includes("sorted: 8 7 6 5 4 3 2 1"));
        await noOverflow(page);
        await page.locator(".cm-content").click();
        await page.keyboard.press("ControlOrMeta+A");
        await page.keyboard.insertText('console.log("before");\nthrow new Error("classroom-test");');
        await page.keyboard.press("ControlOrMeta+Enter");
        await page.getByText("Error on line 2", { exact: true }).waitFor();
        assert.ok((await page.locator("#console-log").innerText()).includes("classroom-test"));
        await page.locator(".cm-content").click();
        await page.keyboard.press("ControlOrMeta+A");
        await page.keyboard.insertText('console.log("</script>"); console.log(typeof document.cookie);');
        await page.keyboard.press("ControlOrMeta+Enter");
        await page.waitForFunction(() => document.querySelector("#console-log").textContent.includes("</script>"));
        assert.ok((await page.locator("#console-log").innerText()).includes("SecurityError"));
        await page.locator(".cm-content").click();
        await page.keyboard.press("ControlOrMeta+A");
        await page.keyboard.insertText('console.error("A learner message");');
        await page.keyboard.press("ControlOrMeta+Enter");
        await page.waitForFunction(() => document.querySelector("#code-status").textContent.startsWith("Ran in "));
        await page.getByRole("button", { name: "Reset", exact: true }).click();
        assert.ok((await page.locator(".cm-content").innerText()).includes("insertionSort"));
        assert.equal(await page.locator("#code-status").innerText(), "Not run yet");
        assert.deepEqual(errors, []);
    });
    await check("Annotations persist per slide, eraser and undo are actual tools", async () =>
    {
        await route(page, 11);
        await page.getByRole("button", { name: "Start drawing", exact: true }).click();
        const canvas = page.locator("#marks");
        const r = await canvas.boundingBox();
        await page.mouse.move(r.x + r.width * .3, r.y + r.height * .25);
        await page.mouse.down();
        await page.mouse.move(r.x + r.width * .4, r.y + r.height * .32, { steps: 10 });
        await page.mouse.up();
        const count = await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[11].length);
        assert.equal(count, 3);
        await page.getByRole("button", { name: "Undo mark", exact: true }).click();
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[11].length), 2);
        await page.getByRole("button", { name: "Clear slide", exact: true }).click();
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[11].length), 0);
        await page.getByRole("button", { name: "Undo mark", exact: true }).click();
        await page.getByRole("button", { name: "Eraser", exact: true }).click();
        const marks = await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[11]);
        const [x, y] = marks[0].points[0];
        const c = await page.locator("#marks").boundingBox();
        await page.mouse.click(c.x + x * c.width, c.y + y * c.height);
        assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[11].length) < 2);
        await page.getByRole("button", { name: "Done", exact: true }).click();
        await noOverflow(page);
        await page.reload();
        await page.waitForSelector(".board-layout");
    });
    await check("Outline persistence, shortcuts focus, link copying, invalid hash correction", async () =>
    {
        await page.keyboard.press("o");
        assert.ok(await page.locator("#app").evaluate(el => el.classList.contains("collapsed")));
        await page.reload();
        await page.waitForSelector("#app.collapsed");
        await page.keyboard.press("o");
        await page.keyboard.press("?");
        await page.getByRole("dialog", { name: "Keyboard shortcuts" }).waitFor();
        assert.equal(await page.getByRole("button", { name: "Close", exact: true }).evaluate(el => el === document.activeElement), true);
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog"));
        assert.equal(await page.locator("dialog").count(), 0);
        await page.getByRole("button", { name: "Copy link", exact: true }).click();
        await page.waitForFunction(() => document.querySelector("#announcement").textContent.includes("copied"));
        await page.evaluate(() => { location.hash = "/slide/99"; });
        await page.waitForURL(/#\/slide\/12$/);
        await page.evaluate(() => { location.hash = "/slide/-4"; });
        await page.waitForURL(/#\/slide\/1$/);
        await noOverflow(page);
    });
    await check("Every desktop slide renders without clipping or horizontal overflow", async () =>
    {
        for (let n = 1; n <= 12; n++)
        {
            await route(page, n);
            assert.ok(await page.locator(".slide-content").evaluate(el => el.innerText.trim().length > 40));
            await noOverflow(page);
        }
    });
    await check("Actual drag reordering, presentation mode, and 1440px no-overflow layout", async () =>
    {
        await route(page, 5);
        await page.getByRole("button", { name: "Try again", exact: true }).click();
        const before = await page.locator(".reorder-text").allTextContents();
        const grip = await page.locator('[data-drag="0"]').boundingBox();
        const row = await page.locator('.reorder-row[data-index="1"]').boundingBox();
        await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
        await page.mouse.down();
        await page.mouse.move(row.x + 30, row.y + row.height / 2, { steps: 10 });
        await page.mouse.up();
        assert.deepEqual((await page.locator(".reorder-text").allTextContents()).slice(0, 2), [before[1], before[0]]);
        await page.getByRole("button", { name: "Present", exact: true }).click();
        await page.waitForSelector("#app.presenting");
        await noOverflow(page);
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("#app").classList.contains("presenting"));
        await page.setViewportSize(viewports[2]);
        for (let n = 1; n <= 12; n++)
        {
            await route(page, n);
            await noOverflow(page);
        }
        await page.setViewportSize(viewports[0]);
    });
    await check("Recap reset requires confirmation and clears actual persisted progress", async () =>
    {
        await route(page, 12);
        await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
        await page.getByRole("button", { name: "Keep learning", exact: true }).click();
        assert.equal(await page.locator(".recap-score").innerText(), "4 / 5");
        await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
        await page.getByRole("button", { name: "Yes, reset", exact: true }).click();
        await page.waitForSelector(".title-layout");
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")));
        assert.deepEqual(saved.answers, {});
        assert.deepEqual(saved.marks, {});
        assert.ok(saved.code.includes("books[gap - 1] > current"));
    });
    const mobileContext = await browser.newContext({ viewport: viewports[1], deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobileContext.newPage();
    captureErrors(phone);
    await check("Mobile actual homepage, menu drawer and quiz interaction", async () =>
    {
        assert.equal((await phone.goto(server.url)).status(), 200);
        await phone.waitForSelector(".title-art img");
        await phone.evaluate(() => document.fonts.ready);
        await phone.waitForLoadState("networkidle");
        await phone.waitForTimeout(650);
        await noOverflow(phone);
        await phone.screenshot({ path: path.join(modelFolder, ".checks", "mobile.png") });
        await phone.getByRole("button", { name: "Open lesson outline", exact: true }).tap();
        await phone.locator('.outline-row[href="#/slide/3"]').tap();
        await phone.waitForURL(/#\/slide\/3$/);
        await phone.waitForFunction(() => !document.querySelector(".drawer-scrim"));
        assert.equal(await phone.locator(".drawer-scrim").count(), 0);
        await phone.getByRole("button", { name: "A About 1 more", exact: true }).tap();
        await phone.getByText("Right.", { exact: true }).waitFor();
        assert.equal(await phone.locator(".mobile-top .score-pill").innerText(), "1/5");
        await noOverflow(phone);
    });
    await check("Mobile touch drawing and actual JavaScript running", async () =>
    {
        await route(phone, 4);
        await phone.getByRole("button", { name: "Next step", exact: true }).tap();
        assert.equal(await phone.locator(".shift-counter").innerText(), "Shifts so far: 1");
        await phone.getByRole("button", { name: "Draw", exact: true }).tap();
        const r = await phone.locator("#marks").boundingBox();
        await phone.touchscreen.tap(r.x + r.width * .5, r.y + Math.min(r.height * .3, 200));
        await phone.getByRole("button", { name: "Done", exact: true }).tap();
        assert.equal(await phone.evaluate(() => JSON.parse(localStorage.getItem("tallow-street-code-school-how-sorting-works")).marks[4].length), 1);
        await noOverflow(phone);
        await route(phone, 7);
        await phone.getByRole("button", { name: "Run", exact: true }).tap();
        await phone.waitForFunction(() => document.querySelector("#console-log").textContent.includes("sorted: 1 2 3 4 5 6 7 8"));
        await noOverflow(phone);
    });
    await check("Every mobile slide uses flow layout and has no horizontal overflow", async () =>
    {
        for (let n = 1; n <= 12; n++)
        {
            await route(phone, n);
            assert.equal(await phone.locator(".slide-surface").evaluate(el => getComputedStyle(el).transform), "none");
            await noOverflow(phone);
        }
    });
    await check("Storage unavailable still permits lesson and scoring", async () =>
    {
        const isolated = await browser.newContext({ viewport: viewports[1] });
        await isolated.addInitScript(() =>
        {
            Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Unavailable", "SecurityError"); } });
        });
        const noStorage = await isolated.newPage();
        captureErrors(noStorage);
        await noStorage.goto(`${server.url}#/slide/3`);
        await noStorage.getByRole("button", { name: "A About 1 more", exact: true }).click();
        await noStorage.getByText("Right.", { exact: true }).waitFor();
        await noOverflow(noStorage);
        await isolated.close();
    });
    await check("Static source, independent export and no browser errors", async () =>
    {
        assert.equal(await StaticHomepage.checkSource(modelFolder), "html");
        report.staticDigest = await StaticHomepage.validateStaticOutput(path.join(modelFolder, "out"), "interactive-lesson-slides", "GPT-6");
        assert.deepEqual(errors, []);
    });
    report.passed = true;
}
catch (error)
{
    report.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    report.resourcesClosed = true;
    report.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(modelFolder, ".checks", "qa.json"), report);
}
