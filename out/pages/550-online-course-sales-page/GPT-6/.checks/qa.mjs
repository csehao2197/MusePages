import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "550-online-course-sales-page");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lockPid);
process.kill(lockPid, 0);

const folder = job.output;
const exported = path.join(folder, "out");
const checks = await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, folder), ".checks");
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.info(metadataFile) ? await WorkspaceFiles.json(metadataFile) :
{
    modelId: job.modelId,
    tags: ["Game Design", "Pixel Art"],
    staticDir: "out",
    generated: false,
    preview: false,
    config_added: false,
    validated: false
};
assert.equal(metadata.modelId, job.modelId);
await WorkspaceFiles.saveJson(metadataFile, metadata);
const result =
{
    prompt: job.prompt,
    modelId: job.modelId,
    timestamp: new Date().toISOString(),
    passed: false,
    source: false,
    static: false,
    preview: false,
    visualReviewed: false,
    resourcesClosed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots:
    {
        desktop: path.join(checks, "desktop.png"),
        mobile: path.join(checks, "mobile.png")
    }
};
let browser;
let server;
const record = (name) => result.assertions.push(name);
const overflowCheck = async (page, stage) =>
{
    const sizes = await page.evaluate(() =>
    ({
        inner: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(sizes.document <= sizes.inner + 1 && sizes.body <= sizes.inner + 1, `${stage}: horizontal overflow ${JSON.stringify(sizes)}`);
    record(`${stage}: no horizontal overflow (${sizes.inner}px)`);
};
const route = [["right", 2], ["up", 2], ["right", 7], ["down", 2], ["left", 4], ["down", 2], ["left", 4], ["right", 9]];

try
{
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    result.source = true;
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const rawPrompt = await WorkspaceFiles.text(job.file);
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    const inputDigest = createHash("sha256").update(JSON.stringify([rawPrompt, design])).digest("hex");
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), `${inputDigest}\n`);
    await StaticHomepage.copyHtml(folder, exported);
    const digest = await StaticHomepage.validateStaticOutput(exported, "online-course-sales-page", "GPT-6");
    result.static = true;
    result.staticDigest = digest;
    result.inputDigest = inputDigest;
    record("StaticHomepage.checkSource and validateStaticOutput passed at final public subpath");
    for (const name of ["index.html", "style.css", "app.js", "content.js", "favicon.svg", "LICENSE", "NOTICE"])
    {
        assert.deepEqual(await readFile(path.join(folder, name)), await readFile(path.join(exported, name)));
    }
    const entries = await readdir(exported);
    assert.ok(!entries.some((name) => /metadata|README|ASSETS|package|checks/.test(name)));
    record("Source/export equality and private-file exclusions passed");
    server = await startPreviewServer(exported, { workspace });
    result.url = server.url;
    assert.ok(server.url.includes("/pages/online-course-sales-page/GPT-6/index.html"));
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/", server.url))).status, 404);
    record("Owned preview server responsive; only target static directory served");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ name: "desktop", width: 1200, height: 900 }, { name: "mobile", width: 390, height: 844 }])
    {
        const context = await browser.newContext(
        {
            viewport: { width: viewport.width, height: viewport.height },
            deviceScaleFactor: 1,
            isMobile: viewport.name === "mobile",
            hasTouch: viewport.name === "mobile",
            reducedMotion: "reduce"
        });
        const page = await context.newPage();
        const issues = [];
        const network = [];
        page.on("console", (message) =>
        {
            if (message.type() === "error") issues.push(`console: ${message.text()}`);
        });
        page.on("pageerror", (error) => issues.push(`page: ${error.message}`));
        page.on("requestfailed", (request) => issues.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            network.push({ status: response.status(), url: response.url() });
            if (response.status() >= 400) issues.push(`HTTP ${response.status()} ${response.url()}`);
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await page.locator("#modules details").last().waitFor();
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.ok(await page.locator("h1").isVisible());
        assert.ok((await page.locator("main").innerText()).length > 4500);
        assert.equal(await page.locator("#modules details").count(), 6);
        assert.equal(await page.locator(".lesson-list li").count(), 24);
        assert.equal(await page.locator("#faq-list details").count(), 8);
        assert.equal(await page.locator(".result-card").count(), 3);
        assert.equal(await page.evaluate(() => devicePixelRatio), 1);
        await overflowCheck(page, `${viewport.name} initial`);
        await page.screenshot({ path: result.screenshots[viewport.name], fullPage: false });
        record(`${viewport.name}: visible English homepage, all sections, six modules/24 lessons/eight FAQs/three results`);

        await page.locator("#watch-intro").click();
        assert.ok(await page.locator("#intro-modal").isVisible());
        assert.match(await page.locator("#intro-modal").innerText(), /no recorded video/);
        assert.match(await page.locator("#intro-modal").innerText(), /1:24/);
        await overflowCheck(page, `${viewport.name} intro modal`);
        await page.keyboard.press("Escape");
        assert.ok(!await page.locator("#intro-modal").isVisible());
        assert.equal(await page.evaluate(() => document.activeElement.id), "watch-intro");
        await page.locator("#watch-intro").click();
        await page.locator("#intro-to-sample").click();
        assert.ok(!await page.locator("#intro-modal").isVisible());
        assert.equal(await page.evaluate(() => document.activeElement.id), "game-start");
        record(`${viewport.name}: honest intro opens, Escape restores focus, sample link focuses playable game`);

        const second = page.locator("#modules summary").nth(1);
        await second.focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#modules details").nth(1).getAttribute("open"), "");
        assert.ok(await page.locator("#modules details").nth(1).locator(".module-outcome").isVisible());
        await page.locator("#modules summary").nth(3).click();
        assert.ok(await page.locator("#modules details").nth(3).locator(".lesson-list").isVisible());
        await overflowCheck(page, `${viewport.name} expanded curriculum`);
        const faq = page.locator("#faq-list summary").nth(5);
        await faq.click();
        assert.match(await page.locator("#faq-list details").nth(5).innerText(), /\$165 total/);
        await page.locator("#faq-list summary").nth(7).focus();
        await page.keyboard.press("Space");
        assert.ok(await page.locator("#faq-list details").nth(7).locator(".faq-answer").isVisible());
        await overflowCheck(page, `${viewport.name} expanded FAQ`);
        record(`${viewport.name}: curriculum and FAQ work with click, Enter and Space`);

        await page.locator('[data-plan="three"]').click();
        assert.equal(await page.locator('[data-plan="three"]').getAttribute("aria-pressed"), "true");
        assert.match(await page.locator("#plan-detail").innerText(), /3 monthly payments of \$55\. \$165 total/);
        for (const cta of await page.locator("[data-plan-cta]").all())
        {
            assert.match(await cta.innerText(), /\$55 × 3/);
        }
        await overflowCheck(page, `${viewport.name} installment prices`);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator('[data-plan="three"]').getAttribute("aria-pressed"), "true");
        assert.match(await page.locator(".header-enroll").innerText(), /\$55 × 3/);
        record(`${viewport.name}: exact installment total, shared CTA prices, persisted selection after reload`);

        await page.locator(".enroll-button").click();
        assert.ok(await page.locator("#enroll-modal").isVisible());
        assert.match(await page.locator("#enroll-plan").innerText(), /\$165 USD total/);
        assert.ok(await page.locator("#confirm-enroll").isDisabled());
        await page.locator("#demo-consent").check();
        assert.ok(await page.locator("#confirm-enroll").isEnabled());
        await page.locator("#confirm-enroll").click();
        assert.match(await page.locator("#enroll-status").innerText(), /Nothing was charged or submitted/);
        assert.ok(await page.locator("#confirm-enroll").isDisabled());
        await overflowCheck(page, `${viewport.name} enrollment confirmation`);
        await page.locator('#enroll-modal [data-close]').click();
        await page.locator('[data-plan="full"]').click();
        assert.match(await page.locator("#plan-detail").innerText(), /One payment of \$149/);
        assert.match(await page.locator(".final-cta [data-enroll]").innerText(), /\$149/);
        await page.locator(".final-cta [data-enroll]").click();
        assert.ok(!await page.locator("#demo-consent").isChecked());
        assert.match(await page.locator("#enroll-plan").innerText(), /\$149 USD total/);
        await page.keyboard.press("Escape");
        record(`${viewport.name}: demo enrollment requires acknowledgement, no purchase, final CTA and full-pay switch work`);

        await page.locator("#game-start").click();
        assert.equal(await page.locator("#game-score").innerText(), "0 / 5 stars");
        for (const [direction, count] of route)
        {
            for (let index = 0; index < count; index++)
            {
                if (viewport.name === "desktop")
                {
                    const keys = { left: "a", right: "ArrowRight", up: "w", down: "ArrowDown" };
                    await page.locator("#sample-game").press(keys[direction]);
                }
                else
                {
                    await page.locator(`[data-move="${direction}"]`).tap();
                }
            }
        }
        assert.equal(await page.locator("#game-score").innerText(), "5 / 5 stars");
        assert.match(await page.locator("#game-message").innerText(), /You did it!/);
        await page.locator("#game-start").click();
        assert.equal(await page.locator("#game-score").innerText(), "0 / 5 stars");
        assert.match(await page.locator("#game-message").innerText(), /Collect all 5/);
        for (let index = 0; index < 20; index++)
        {
            await page.locator("#sample-game").press("ArrowLeft");
        }
        assert.equal(await page.locator("#game-score").innerText(), "0 / 5 stars");
        await overflowCheck(page, `${viewport.name} game completion and restart`);
        record(`${viewport.name}: actual ${viewport.name === "mobile" ? "touch" : "keyboard/WASD"} gameplay collects all five stars, wins, restarts, clamps at world edge`);

        await page.evaluate(async () =>
        {
            for (const image of document.images)
            {
                if (!image.complete) await image.decode();
            }
        });
        assert.ok(await page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0)));
        await overflowCheck(page, `${viewport.name} final`);
        assert.equal(issues.length, 0, issues.join("\n"));
        assert.ok(network.length >= 8);
        assert.ok(network.every((entry) => new URL(entry.url).origin === new URL(server.url).origin));
        result.viewports.push({ ...viewport, deviceScaleFactor: 1, assertionsPassed: true, errors: issues, responses: network.length, allRequestsLocal: true });
        record(`${viewport.name}: all images decoded, all requests local, zero console/page/request/HTTP errors`);
        await context.close();
    }
    const storageContext = await browser.newContext();
    await storageContext.addInitScript(() =>
    {
        Storage.prototype.getItem = () => { throw new Error("Storage denied"); };
        Storage.prototype.setItem = () => { throw new Error("Storage denied"); };
    });
    const storagePage = await storageContext.newPage();
    const storageErrors = [];
    storagePage.on("pageerror", (error) => storageErrors.push(error.message));
    await storagePage.goto(server.url, { waitUntil: "networkidle" });
    await storagePage.locator('[data-plan="three"]').click();
    assert.match(await storagePage.locator("#plan-price").innerText(), /\$55/);
    assert.deepEqual(storageErrors, []);
    await storageContext.close();
    record("Denied localStorage does not break homepage or plan changes");
    await browser.close();
    browser = null;
    await server.close();
    server = null;
    result.previewStatus = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    result.preview = true;
    result.previewFile = path.join(exported, "preview.png");
    const bytes = await readFile(result.previewFile);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 900);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${createHash("sha256").update(bytes).digest("hex")}`);
    record("ensurePreview generated a real 1200×900 homepage; static/image SHA256 fingerprint verified");
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack || error.message);
    metadata.preview = false;
    metadata.validated = false;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
