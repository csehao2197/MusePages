import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "569-hand-drawn-scroll-explainer");
const folder = job.output;
const checks = path.join(folder, ".checks");
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const group = config.pages[job.prompt];
const shared = (group?.pages ?? group ?? [])[0];
const slug = shared?.slug ?? "hand-drawn-scroll-explainer";
const exported = path.join(folder, "out");
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
const results = {
    prompt: job.prompt,
    modelId: job.modelId,
    urlPath: `/pages/${slug}/GPT-6/index.html`,
    staticDigest: digest,
    assertions: [],
    errors: [],
    viewports: [],
    visualReviewed: false,
    resourcesClosed: false
};
let browser;
let server;
function passed(text)
{
    results.assertions.push(text);
}
async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        visual: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.equal(dimensions.viewport, page.viewportSize().width, `${label}: layout viewport`);
    assert.ok(dimensions.visual <= dimensions.viewport + 1, `${label}: visual viewport expands from overflow`);
    assert.ok(dimensions.document <= dimensions.viewport + 1, `${label}: ${JSON.stringify(dimensions)}`);
    assert.ok(dimensions.body <= dimensions.viewport + 1, `${label}: body overflows`);
    passed(`${label}: no horizontal overflow`);
}
try
{
    server = await startPreviewServer(exported, { workspace });
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 900;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        page.on("pageerror", (error) => results.errors.push(error.message));
        page.on("console", (message) =>
        {
            if (message.type() === "error")
            {
                results.errors.push(message.text());
            }
        });
        page.on("requestfailed", (request) => results.errors.push(`Request failed: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400)
            {
                results.errors.push(`HTTP ${response.status()}: ${response.url()}`);
            }
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        assert.equal(new URL(page.url()).pathname, `/pages/${slug}/GPT-6/index.html`);
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
        assert.ok(await page.locator("h1").isVisible());
        assert.match(await page.locator("h1").innerText(), /A little leaf/);
        assert.equal(await page.locator(".scene").count(), 6);
        assert.ok((await page.locator("body").innerText()).length > 2500);
        await noOverflow(page, `${viewport.width}: initial`);
        await page.screenshot({ path: path.join(checks, mobile ? "mobile.png" : "desktop.png"), fullPage: false, animations: "disabled" });
        const hiddenOffset = await page.locator("#scene-1 .scene-doodle .glyph path").first().evaluate((element) => Number(element.style.strokeDashoffset));
        assert.ok(hiddenOffset > 100, "Offscreen scene begins undrawn");
        await page.locator(".intro .primary").click();
        await page.waitForFunction(() => Number(document.querySelector("#scene-1").dataset.progress) > 0.8);
        const drawnOffset = await page.locator("#scene-1 .scene-doodle .glyph path").first().evaluate((element) => Number(element.style.strokeDashoffset));
        assert.ok(drawnOffset < hiddenOffset / 5, "Scrolling must draw real SVG paths");
        assert.equal(await page.locator('[data-trail="1"]').getAttribute("aria-current"), "step");
        passed(`${viewport.width}: start link changes chapter and scrubs real SVG stroke length`);
        for (let id = 1; id <= 6; id++)
        {
            await page.evaluate((sceneId) =>
            {
                const element = document.querySelector(`#scene-${sceneId}`);
                window.scrollTo(0, element.offsetTop + 40);
            }, id);
            await page.waitForFunction((sceneId) => Number(document.querySelector(`#scene-${sceneId}`).dataset.progress) >= 0.99, id);
            const lengths = await page.locator(`#scene-${id} svg path`).evaluateAll((elements) => elements.map((element) => Number(element.style.strokeDashoffset)));
            assert.ok(lengths.every((length) => length < 0.1), `Scene ${id} all strokes complete`);
            const letters = await page.locator(`#scene-${id} .bubble-text span`).evaluateAll((elements) => elements.every((element) => element.style.opacity === "1"));
            assert.ok(letters, `Scene ${id} bubble is fully written`);
            assert.equal(await page.locator(`[data-trail="${id}"]`).getAttribute("aria-current"), "step");
            await noOverflow(page, `${viewport.width}: scene ${id} drawn`);
            if (id === 2)
            {
                await page.screenshot({ path: path.join(checks, mobile ? "scene-mobile.png" : "scene-desktop.png"), animations: "disabled" });
            }
        }
        passed(`${viewport.width}: all six scene illustrations, highlight strokes, arrow labels and narrator bubbles finish drawing`);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('.trail [data-trail="4"]').click();
        await page.waitForFunction(() => document.querySelector('[data-trail="4"]').getAttribute("aria-current") === "step");
        passed(`${viewport.width}: chapter trail navigates to carbon dioxide`);
        await page.locator(".header-link").click();
        await page.waitForFunction(() => document.querySelector('[data-trail="7"]').getAttribute("aria-current") === "step");
        assert.ok(await page.locator(".flow").isVisible());
        assert.equal(await page.locator(".flow .glyph").count(), 6);
        assert.match(await page.locator(".lab-result").innerText(), /kitchen is open/);
        const light = page.locator('[data-supply="0"]');
        await light.scrollIntoViewIfNeeded();
        await light.focus();
        await page.keyboard.press("Space");
        assert.equal(await light.getAttribute("aria-pressed"), "false");
        assert.match(await page.locator(".lab-result").innerText(), /No sunlight/);
        await page.keyboard.press("Enter");
        assert.equal(await light.getAttribute("aria-pressed"), "true");
        assert.match(await page.locator(".lab-result").innerText(), /kitchen is open/);
        passed(`${viewport.width}: native keyboard Space and Enter toggle energy supply and actual model outcome`);
        for (let index = 1; index < 3; index++)
        {
            const button = page.locator(`[data-supply="${index}"]`);
            if (mobile)
            {
                await button.tap();
            }
            else
            {
                await button.click();
            }
            assert.equal(await button.getAttribute("aria-pressed"), "false");
        }
        assert.match(await page.locator(".lab-result").innerText(), /No water/);
        assert.match(await page.locator(".lab-result").innerText(), /No carbon dioxide/);
        assert.equal(await page.locator(".lab-result").getAttribute("data-active"), "false");
        await page.locator(".restore").click();
        assert.equal(await page.locator('.supply[aria-pressed="true"]').count(), 3);
        assert.equal(await page.locator(".lab-result").getAttribute("data-active"), "true");
        passed(`${viewport.width}: independent water/CO₂ withdrawal, multi-input explanation and restore work${mobile ? " with actual touch" : ""}`);
        await noOverflow(page, `${viewport.width}: after experiment`);
        await page.screenshot({ path: path.join(checks, mobile ? "lab-mobile.png" : "lab-desktop.png"), animations: "disabled" });
        const printCalled = await page.evaluate(() =>
        {
            let called = false;
            window.print = () => { called = true; };
            document.querySelector(".print").click();
            return called;
        });
        assert.ok(printCalled);
        await page.emulateMedia({ media: "print" });
        for (const selector of [".topbar", ".intro", ".scene", ".lab", "footer", ".trail"])
        {
            assert.equal(await page.locator(selector).first().isVisible(), false, `${selector} hidden in print`);
        }
        assert.ok(await page.locator(".flow").isVisible());
        assert.ok(await page.locator(".cheat-sheet").isVisible());
        passed(`${viewport.width}: print action invokes browser printing; print CSS keeps only recap and notes`);
        await page.emulateMedia({ media: "screen" });
        await page.locator(".replay").click();
        await page.waitForFunction(() => window.scrollY < 10);
        await noOverflow(page, `${viewport.width}: after replay`);
        const partiallyDrawn = await page.evaluate(() =>
        {
            const scene = document.querySelector("#scene-2");
            window.scrollTo(0, scene.offsetTop - innerHeight * 0.54);
            return true;
        });
        assert.ok(partiallyDrawn);
        await page.waitForFunction(() =>
        {
            const progress = Number(document.querySelector("#scene-2").dataset.progress);
            return progress > 0.35 && progress < 0.7;
        });
        const partialLetters = await page.locator("#scene-2 .bubble-text span").evaluateAll((elements) => ({
            shown: elements.filter((element) => element.style.opacity === "1").length,
            total: elements.length
        }));
        assert.ok(partialLetters.shown > 0 && partialLetters.shown < partialLetters.total);
        passed(`${viewport.width}: intermediate scroll really reveals part, not all, of the speech bubble`);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForFunction(() => [...document.querySelectorAll(".scene svg path")].every((element) => Number(element.style.strokeDashoffset) === 0));
        assert.ok(await page.locator(".bubble-text span").evaluateAll((elements) => elements.every((element) => element.style.opacity === "1")));
        passed(`${viewport.width}: reduced-motion mode fully draws every scene and reveals all speech`);
        results.viewports.push({ ...viewport, deviceScaleFactor: 1, touch: mobile, passed: true });
        await context.close();
    }
    assert.deepEqual(results.errors, []);
    results.passed = true;
}
catch (error)
{
    results.passed = false;
    results.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    results.resourcesClosed = true;
    results.checkedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), results);
    console.log(JSON.stringify(results, null, 2));
}
