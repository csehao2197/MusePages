import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const job = JSON.parse(await fs.readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const checks = path.join(job.output, ".checks");
const results = [];
const errors = [];
const requests = new Set();
const screenshots = {};
const viewports = { desktop: { width: 1200, height: 900 }, mobile: { width: 390, height: 844 } };
let service;
let browser;
let failure;
let resourcesClosed = false;

async function check(name, run)
{
    await run();
    results.push({ name, passed: true });
}

async function overflow(page, name)
{
    await check(name, async () =>
    {
        const sizes = await page.evaluate(() => ({
            document: document.documentElement.scrollWidth,
            viewport: innerWidth,
            panel: document.querySelector("#document-panel").scrollWidth,
            panelWidth: document.querySelector("#document-panel").clientWidth
        }));
        assert.ok(sizes.document <= sizes.viewport, JSON.stringify(sizes));
        assert.ok(sizes.panel <= sizes.panelWidth + 1, JSON.stringify(sizes));
    });
}

try
{
    service = await startPreviewServer(path.join(job.output, "out"), { workspace });
    await check("Static server is responsive at the final model subpath and does not expose source", async () =>
    {
        assert.ok(service.url.includes("/pages/lesson-plan-design-assistant/GPT-6/index.html"));
        assert.equal((await fetch(service.url)).status, 200);
        assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
        assert.equal((await fetch(new URL("metadata.json", service.url))).status, 404);
    });
    browser = await chromium.launch({ headless: true });
    for (const [device, viewport] of Object.entries(viewports))
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, acceptDownloads: true, reducedMotion: "reduce", isMobile: device === "mobile", hasTouch: device === "mobile" });
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on("pageerror", (error) => errors.push(`${device} page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`${device} console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`${device} request failed: ${request.url()}`));
        page.on("request", (request) => requests.add(request.url()));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`${device} HTTP ${response.status()}: ${response.url()}`);
        });
        await check(`${device}: meaningful English homepage and real 60-minute-session content`, async () =>
        {
            const response = await page.goto(service.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.getByRole("heading", { name: "Thoughtful lessons, beautifully planned." }).waitFor({ state: "visible" });
            assert.equal(await page.locator("html").getAttribute("lang"), "en");
            const text = await page.locator("#document-view").innerText();
            assert.ok(text.includes("Session 2: Deepen & practise"));
            assert.ok(text.includes("1/2 = 2/4 = 4/8"));
            assert.equal((text.match(/Connect \/ 5 minutes/g) || []).length, 2);
            assert.equal((text.match(/Explore \/ 22 minutes/g) || []).length, 2);
            assert.equal((text.match(/Practise \/ 18 minutes/g) || []).length, 2);
            assert.equal((text.match(/Transfer \/ 10 minutes/g) || []).length, 2);
            assert.equal((text.match(/Reflect & next steps \/ 5 minutes/g) || []).length, 2);
            assert.equal(5 + 22 + 18 + 10 + 5, 60);
            assert.ok((await page.locator("body").innerText()).includes("Deterministic template assistance, not AI inference."));
        });
        await overflow(page, `${device}: no horizontal overflow before interaction`);
        screenshots[device] = path.join(checks, `${device}.png`);
        await page.screenshot({ path: screenshots[device], fullPage: false, animations: "disabled" });

        await check(`${device}: advanced learner group creates three complete sessions with selected focus`, async () =>
        {
            await page.locator('input[value="Advanced"]').check();
            assert.equal(await page.locator("#duration").inputValue(), "3 × 60 minutes");
            await page.locator("#focus").selectOption("Whole-child learning");
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            const text = await page.locator("#document-view").innerText();
            assert.ok(text.includes("Session 3: Investigate & transfer"));
            assert.ok(text.includes("180") || (await page.locator("#document-meta").innerText()).includes("180"));
            assert.ok(text.includes("respectful peer-feedback"));
            assert.equal((text.match(/Connect \/ 5 minutes/g) || []).length, 3);
            assert.equal((text.match(/Reflect & next steps \/ 5 minutes/g) || []).length, 3);
        });
        await check(`${device}: document tabs support keyboard arrows, Home and End`, async () =>
        {
            await page.locator("#tab-teacher").focus();
            await page.keyboard.press("ArrowRight");
            assert.equal(await page.locator("#tab-handout").getAttribute("aria-selected"), "true");
            assert.ok((await page.locator("#document-view").innerText()).includes("My thinking space"));
            await page.keyboard.press("End");
            assert.equal(await page.locator("#tab-practice").getAttribute("aria-selected"), "true");
            const text = await page.locator("#document-view").innerText();
            assert.ok(text.includes("6 foundation (60%) / 3 improve (30%) / 1 challenge (10%)"));
            assert.ok(text.includes("10. Explain why multiplying both parts by 3"));
            assert.ok(text.includes("Reference answers & reasoning"));
            await page.keyboard.press("Home");
            assert.equal(await page.locator("#tab-teacher").getAttribute("aria-selected"), "true");
        });
        await check(`${device}: real Markdown download contains the generated lesson pack`, async () =>
        {
            const downloadEvent = page.waitForEvent("download");
            await page.locator("#export-all").click();
            const download = await downloadEvent;
            assert.equal(download.suggestedFilename(), "understanding-equivalent-fractions-lesson-pack.md");
            const target = path.join(checks, `${device}-export.md`);
            await download.saveAs(target);
            const text = await fs.readFile(target, "utf8");
            assert.ok(text.includes("Session 3: Investigate & transfer"));
            assert.ok(text.includes("STUDENT HANDOUT"));
            assert.ok(text.includes("HOME PRACTICE"));
            assert.ok(text.includes("Reference answers & reasoning"));
        });
        await check(`${device}: document edits persist through reload and cancel protects edited drafts`, async () =>
        {
            await page.locator("#tab-handout").click();
            await page.locator("#edit").click();
            await page.locator("#editor").fill("# My classroom notes\nLocal edit preserved. Add paper strips for table four.");
            await page.locator("#edit").click();
            assert.ok((await page.locator("#document-view").innerText()).includes("Local edit preserved."));
            await page.reload({ waitUntil: "networkidle" });
            assert.ok((await page.locator("#document-view").innerText()).includes("Local edit preserved."));
            assert.equal(await page.locator('input[value="Advanced"]').isChecked(), true);
            page.once("dialog", (dialog) => dialog.dismiss());
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            assert.ok((await page.locator("#document-view").innerText()).includes("Local edit preserved."));
        });
        await check(`${device}: custom topic is escaped, generic support is disclosed, unchecked outputs are excluded`, async () =>
        {
            await page.locator("#topic").fill('<img src=x onerror="alert(1)"> Classroom inquiry');
            await page.locator("#curriculum").fill("Teacher-selected local curriculum");
            await page.locator("#grade").selectOption("Grade 8");
            await page.locator("#subject").selectOption("History");
            await page.locator('input[value="Foundation"]').check();
            await page.locator("#handout").uncheck();
            await page.locator("#practice").uncheck();
            page.once("dialog", (dialog) => dialog.accept());
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            const text = await page.locator("#document-view").innerText();
            assert.ok(text.includes('<img src=x onerror="alert(1)">'));
            assert.equal(await page.locator("#document-view img").count(), 0);
            assert.ok(text.includes("Generic deterministic scaffold"));
            assert.ok(text.includes("subject-specific examples and answers require teacher completion"));
            assert.ok(text.includes("Grade 8 · History · Foundation"));
            assert.equal(await page.locator("#tab-handout").isDisabled(), true);
            assert.equal(await page.locator("#tab-practice").isDisabled(), true);
            assert.equal(await page.locator("#document-meta").innerText(), "2 sessions · 120 minutes");
        });
        await check(`${device}: curated water-cycle template, required inputs and guide work`, async () =>
        {
            await page.locator('[data-template="water"]').click();
            assert.equal(await page.locator("#subject").inputValue(), "Science");
            assert.equal(await page.locator("#topic").inputValue(), "Exploring the water cycle");
            await page.locator("#handout").check();
            await page.locator("#practice").check();
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            const text = await page.locator("#document-view").innerText();
            assert.ok(text.includes("Water vapour is invisible."));
            assert.ok(text.includes("No pupil-handled hot water."));
            await page.locator("#topic").fill("   ");
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            assert.equal(await page.locator("#topic").evaluate((element) => element === document.activeElement), true);
            assert.ok((await page.locator("#document-view").innerText()).includes("Exploring the water cycle"));
            await page.locator("#guide-open").click();
            assert.equal(await page.locator("#guide").evaluate((element) => element.open), true);
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("#guide").evaluate((element) => element.open), false);
        });
        await overflow(page, `${device}: no horizontal overflow after generation, edits and tab interactions`);
        await check(`${device}: persuasive writing includes honest evidence guidance and an individual document export`, async () =>
        {
            await page.locator('[data-template="writing"]').click();
            await page.getByRole("button", { name: "Create lesson plan" }).click();
            assert.ok((await page.locator("#document-view").innerText()).includes("without inventing statistics"));
            await page.locator("#tab-practice").click();
            assert.ok((await page.locator("#document-view").innerText()).includes("They cannot be verified and can mislead readers."));
            const event = page.waitForEvent("download");
            await page.locator("#export").click();
            const download = await event;
            assert.equal(download.suggestedFilename(), "writing-to-persuade-practice.md");
            const target = path.join(checks, `${device}-practice-export.md`);
            await download.saveAs(target);
            assert.ok((await fs.readFile(target, "utf8")).includes("HOME PRACTICE"));
        });
        await context.close();
    }
    await check("No browser, console, HTTP or request failures; every browser request is local", async () =>
    {
        assert.deepEqual(errors, []);
        assert.ok([...requests].some((url) => url.endsWith("/styles.css")));
        assert.ok([...requests].some((url) => url.endsWith("/app.js")));
        for (const request of requests) assert.equal(new URL(request).origin, new URL(service.url).origin);
    });
}
catch (error)
{
    failure = error.stack;
    process.exitCode = 1;
}
finally
{
    try
    {
        await browser?.close();
    }
    finally
    {
        await service?.close();
        resourcesClosed = true;
    }
    const report = {
        passed: !failure, timestamp: new Date().toISOString(), prompt: job.prompt,
        modelId: job.modelId, url: service?.url, viewports, deviceScaleFactor: 1,
        assertions: results, errors, failure: failure || null, screenshots,
        requests: [...requests], visualReviewed: false, resourcesClosed
    };
    await fs.writeFile(path.join(checks, "qa.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify({ passed: report.passed, assertions: results.length, errors, failure, screenshots, resourcesClosed }));
}
