import path from "node:path";
import { pathToFileURL } from "node:url";
import { readFile, readdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, PromptPageWorkflow, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const workspace = process.cwd();
const stateFile = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const state = await WorkspaceFiles.json(stateFile);
const record = state.records.find((entry) => entry.prompt === process.argv[2]);
if (!record) throw Error("Exact manifest prompt required");
const original = await WorkspaceFiles.text(record.file);
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
if (record.provenance?.license_file) await WorkspaceFiles.text(path.join(workspace, record.provenance.license_file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const model = { modelId: "gpt-6.1-sol", directory: "GPT-6" };
state.status = "running";
state.activePrompt = record.prompt;
state.currentAction = "Authorized static/browser/preview-only poststeps; generated source preserved";
await WorkspaceFiles.saveJson(stateFile, state);

await PromptPageWorkflow.withPromptLock(workspace, record.prompt, async () =>
{
    const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt, content: original }, model);
    if (!current.metadata?.generated) throw Error("Poststep requires valid generated=true source");
    if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-input.sha256"))).trim() !== hash(JSON.stringify([original, design]))) throw Error("Input changed; confirmation required");
    await StaticHomepage.checkSource(current.folder);
    const metadata = current.metadata;
    const checks = await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", record.prompt, "GPT-6", ".checks");
    const privateTest = path.join(checks, "resume-functional.mjs");
    const visualMarker = path.join(checks, "resume-visual.json");
    const reportFile = path.join(workspace, "src", "workflows", "script", `.ai-gpt6-poststep-report-${record.prompt.match(/^\d+/)[0]}.json`);
    if (await WorkspaceFiles.info(visualMarker)) throw Error("Owned visual marker already exists; investigate recovery before advancing");
    const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const group = config.pages[record.prompt];
    const option = (Array.isArray(group) ? group : group?.pages ?? []).find((entry) => entry.model === "GPT-6");
    if (!option || option.staticDir !== metadata.staticDir) throw Error("Poststep registration conflict");
    const exported = await WorkspaceFiles.inside(current.folder, ...metadata.staticDir.split("/"));
    const before = await StaticHomepage.validateStaticOutput(exported, option.slug, "GPT-6");
    const sourceHashes = {};
    for (const name of ["index.html", "style.css", "app.js"])
    {
        sourceHashes[name] = hash(await readFile(path.join(current.folder, name)));
    }
    metadata.preview = false;
    metadata.validated = false;
    await WorkspaceFiles.saveJson(current.file, metadata);
    try
    {
        const source = (await WorkspaceFiles.text(path.join(current.folder, "verify.mjs")))
            .replaceAll("path.dirname(fileURLToPath(import.meta.url))", JSON.stringify(current.folder))
            .replaceAll("'src','workflows','generate-preview.mjs'", "'src','workflows','script','generate-preview.mjs'")
            .replaceAll("'src','workflows','render-prompt-page.mjs'", "'src','workflows','script','render-prompt-page.mjs'");
        await WorkspaceFiles.saveText(privateTest, source);
        await new Promise((resolve, reject) =>
        {
            const child = spawn(process.execPath, [privateTest], { cwd: workspace, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
            let output = "";
            child.stdout.on("data", (chunk) => output += chunk);
            child.stderr.on("data", (chunk) => output += chunk);
            child.once("error", reject);
            child.once("close", (code) => code === 0 ? resolve() : reject(Error(`Existing functional suite failed (${code}): ${output.slice(-6000)}`)));
        });
        const functional = await WorkspaceFiles.json(path.join(current.folder, "verification.json"));
        if (functional.passed !== true || functional.errors?.length) throw Error("Actual functional evidence failed");
        const digest = await StaticHomepage.validateStaticOutput(exported, option.slug, "GPT-6");
        if (digest !== before) throw Error("Unexpected static content change during QA; source retained");
        for (const [name, value] of Object.entries(sourceHashes))
        {
            if (hash(await readFile(path.join(current.folder, name))) !== value) throw Error(`Unexpected generated source change: ${name}`);
        }
        await StaticHomepage.ensurePreview(workspace, current, exported, digest, undefined, true);
        const errors = [];
        const assertions = [];
        const server = await startPreviewServer(exported, { workspace });
        let browser;
        try
        {
            browser = await chromium.launch({ headless: true });
            for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
            {
                const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
                try
                {
                    const page = await context.newPage();
                    page.on("pageerror", (error) => errors.push(error.message));
                    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
                    page.on("requestfailed", (request) => errors.push(request.failure()?.errorText ?? request.url()));
                    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
                    const response = await page.goto(server.url, { waitUntil: "networkidle" });
                    if (response.status() !== 200) throw Error("Actual public homepage not HTTP 200");
                    await page.evaluate(() =>
                    {
                        for (const image of document.images) image.loading = "eager";
                    });
                    await page.waitForFunction(() => document.fonts.status === "loaded" &&
                        [...document.images].filter((image) => image.getAttribute("src") &&
                            image.getClientRects().length > 0).every((image) => image.complete &&
                                image.naturalWidth > 0), undefined, { timeout: 15000 });
                    if (!await page.locator("h1").isVisible() || (await page.locator("body").innerText()).trim().length < 100) throw Error("Blank homepage");
                    if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw Error("Supplemental viewport overflow");
                    const file = path.join(checks, viewport.width === 1200 ? "desktop.png" : "mobile.png");
                    await page.screenshot({ path: file, animations: "disabled" });
                    assertions.push(`${viewport.width}x${viewport.height}: actual public HTTP 200, nonblank heading/content, loaded visible images/fonts, no horizontal overflow`);
                }
                finally
                {
                    await context.close();
                }
            }
        }
        finally
        {
            if (browser) await browser.close();
            await server.close();
        }
        if (errors.length) throw Error(errors.join("\n"));
        const qa = { passed: true, prompt: record.prompt, modelId: model.modelId, poststepOnly: true, functionalSuite: { file: path.join(current.folder, "verify.mjs"), assertions: functional.checks, passed: true, viewports: functional.widths ?? functional.viewports, errors: functional.errors ?? [] }, assertions, errors, viewports: ["1200x900", "390x844"], staticDigest: digest, sourceHashes, sourceRetained: true, browserResourcesClosed: true, visualReviewed: false, screenshots: [path.join(checks, "desktop.png"), path.join(checks, "mobile.png")], preview: path.join(exported, "preview.png") };
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        console.log(JSON.stringify({ readyForVisual: record.prompt, screenshots: qa.screenshots, preview: qa.preview, marker: visualMarker, assertions: functional.checks }));
        while (!await WorkspaceFiles.info(visualMarker)) await new Promise((resolve) => setTimeout(resolve, 1000));
        const visual = await WorkspaceFiles.json(visualMarker);
        if (visual.visualReviewed !== true || !visual.notes) throw Error("Actual image-view acceptance required");
        qa.visualReviewed = true;
        qa.visualReview = visual;
        qa.checkedAt = new Date().toISOString();
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        metadata.preview = true;
        metadata.validated = true;
        await WorkspaceFiles.saveJson(current.file, metadata);
        await WorkspaceFiles.saveJson(reportFile, { prompt: record.prompt, status: "poststep-completed", modelId: model.modelId, tags: metadata.tags, ...Object.fromEntries(["generated", "preview", "validated", "config_added"].map((key) => [key, metadata[key]])), poststepOnly: true, qa: path.join(checks, "qa.json"), screenshots: qa.screenshots, visualReviewed: true, tests: functional.checks, registration: "Existing verified option and all selections preserved unchanged", sourceRetained: true, builds: "not run", deployments: "not run", resourcesClosed: true });
        console.log(JSON.stringify({ completed: record.prompt, reportFile, flags: metadata }));
    }
    catch (error)
    {
        metadata.preview = false;
        metadata.validated = false;
        await WorkspaceFiles.saveJson(current.file, metadata);
        await WorkspaceFiles.saveJson(reportFile, { prompt: record.prompt, status: "failed", modelId: model.modelId, tags: metadata.tags, ...Object.fromEntries(["generated", "preview", "validated", "config_added"].map((key) => [key, metadata[key]])), blocker: error.message, sourceRetained: true, resourcesClosed: true });
        throw error;
    }
    finally
    {
        await unlink(privateTest).catch(() => {});
        await unlink(visualMarker).catch(() => {});
    }
});
