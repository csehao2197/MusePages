import path from "node:path";
import { readFile, readdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const prompt = "516-eathan-creative-director-portfolio";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const metaFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-516.json");
const statePath = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const lockPid = Number((await readFile(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`), "utf8")).trim());
const owned = (await WorkspaceFiles.json(statePath)).ownedLock;
assert.equal(owned.prompt, prompt);
assert.equal(owned.pid, lockPid);
process.kill(lockPid, 0);
const raw = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const fingerprint = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const shared = config.pages[prompt]?.pages?.[0] ?? { slug: "eathan-creative-director-portfolio", title: "Eathan Creative Director Portfolio" };
const tags = ["Portfolio", "High Contrast"];
const mode = process.argv[2];

if (mode === "init")
{
    assert.equal(await WorkspaceFiles.info(folder), null, "Existing output must not be overwritten");
    await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", prompt, "GPT-6");
    await WorkspaceFiles.saveJson(metaFile, { modelId: "gpt-6.1-sol", tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false });
    console.log("Initial metadata saved; coordinator lock verified.");
}
else if (mode === "qa")
{
    const metadata = await WorkspaceFiles.json(metaFile);
    assert.equal(metadata.modelId, "gpt-6.1-sol");
    await StaticHomepage.checkSource(folder);
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metaFile, metadata);
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), fingerprint);
    await WorkspaceFiles.ensureDirectory(folder, "out");
    for (const name of ["index.html", "style.css", "app.js", "portrait.svg", "LICENSE"])
    {
        await copyFile(path.join(folder, name), path.join(exported, name));
    }
    const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
    const checks = await WorkspaceFiles.ensureDirectory(folder, ".checks");
    let service;
    let browser;
    const errors = [];
    const results = [];
    try
    {
        service = await startPreviewServer(exported, { workspace });
        assert.equal((await fetch(service.url)).status, 200);
        browser = await chromium.launch({ headless: true });
        for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
        {
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("console", (message) =>
            {
                if (message.type() === "error") errors.push(message.text());
            });
            page.on("requestfailed", (request) => errors.push(request.url()));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`);
            });
            assert.equal((await page.goto(service.url, { waitUntil: "networkidle" })).status(), 200);
            await page.evaluate(() => document.fonts.ready);
            assert.match(await page.locator("h1").innerText(), /DESIGN WITH/);
            assert.ok(await page.locator(".portrait").isVisible());
            const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} horizontal overflow`);
            await overflow();
            await page.screenshot({ path: path.join(checks, `${name}.png`) });
            await page.getByRole("button", { name: /^COMMISSION/ }).click();
            await page.getByRole("button", { name: /^PROJECTS/ }).click();
            await page.getByRole("button", { name: "Open FORM project" }).click();
            assert.ok(await page.getByText("A quieter kind of bold.").isVisible());
            await overflow();
            await page.getByRole("button", { name: "Back to menu" }).click();
            await page.getByRole("button", { name: /^LET'S WORK/ }).click();
            assert.equal(await page.locator("#contact-form").evaluate((form) => form.checkValidity()), false);
            await page.getByLabel("Your name").fill("Alex Designer");
            await page.getByLabel("Email address").fill("alex@example.com");
            await page.getByLabel("Project type").selectOption("Brand & website");
            await page.getByLabel("Tell me about your project").fill("A new identity and digital portfolio for our independent studio.");
            await page.getByRole("button", { name: /Prepare inquiry/ }).click();
            assert.ok(await page.getByText("Your inquiry is ready.").isVisible());
            assert.ok((await page.getByRole("link", { name: "Download inquiry" }).getAttribute("download")).includes("inquiry"));
            await overflow();
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("dialog").isVisible(), false);
            assert.equal(await page.evaluate(() => document.activeElement?.textContent.trim()), "COMMISSION");
            await page.getByRole("button", { name: "About Eathan" }).click();
            assert.match(await page.locator("dialog h2").innerText(), /Independent\s+by choice\./);
            await page.getByRole("button", { name: "Back to menu" }).click();
            await page.getByRole("button", { name: /^RESUME/ }).click();
            assert.ok(await page.getByRole("link", { name: "Download resume" }).isVisible());
            await page.keyboard.press("Escape");
            if (name === "desktop")
            {
                await page.getByRole("button", { name: /^PROCESS$/ }).click();
                assert.ok(await page.getByText("Find the right question.").isVisible());
                await page.keyboard.press("Escape");
                await page.getByRole("button", { name: /^LABS$/ }).click();
                await page.getByLabel("Field energy").fill("80");
                assert.equal(await page.locator("#energy-value").innerText(), "80%");
                await page.keyboard.press("Escape");
            }
            await overflow();
            results.push({ name, viewport, deviceScaleFactor: 1, http: 200, visibleHomepage: true, overflowBeforeAndAfter: false, assertions: ["Project case study", "Drawer back navigation", "Contact validation and downloadable inquiry", "Escape dismissal and focus restoration", "About", "Resume download", ...(name === "desktop" ? ["Process", "Interactive particle energy"] : [])] });
            await page.close();
        }
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
        await page.goto(service.url);
        await page.waitForTimeout(4600);
        assert.ok(["IMPACT", "INTENT"].includes(await page.locator("#hero-word").innerText()));
        await page.mouse.move(600, 400);
        assert.equal(await page.evaluate(() => document.querySelector("canvas").width), 1200);
        await page.waitForTimeout(100);
        assert.ok(await page.evaluate(() =>
        {
            const data = document.querySelector("canvas").getContext("2d").getImageData(520, 320, 160, 160).data;
            for (let i = 0; i < data.length; i += 4)
            {
                if (data[i] > 100 && data[i + 1] > 150 && data[i + 2] < 50) return true;
            }
            return false;
        }), "Pointer repulsion highlights nearby particles in acid lime");
        results.push({ name: "motion", assertions: ["Four-second headline rotation", "Live pointer-reactive canvas"], passed: true });
        await page.close();
        assert.deepEqual(errors, []);
    }
    finally
    {
        if (browser) await browser.close();
        if (service) await service.close();
    }
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), { passed: true, staticDigest: digest, sourceCheck: "passed", staticValidation: "passed", tests: results, errors, visualReviewed: false, resourcesClosed: true });
    const previewAction = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    await WorkspaceFiles.saveJson(path.join(checks, "preview.json"), { previewAction, digest });
    console.log(JSON.stringify({ passed: true, tests: results, previewAction, resourcesClosed: true }));
}
else if (mode === "finish")
{
    const qa = await WorkspaceFiles.json(path.join(folder, ".checks", "qa.json"));
    assert.equal(qa.passed, true);
    assert.equal(process.argv[3], "visual-reviewed");
    qa.visualReviewed = true;
    qa.visual = { imagesOpened: ["desktop.png", "mobile.png", "out\\preview.png"], assessment: "Desktop: clear outlined/acid-lime headline hierarchy, sculptural original grayscale portrait, balanced corner biography and status. Mobile: portrait remains prominent, headline scales without clipping; readable biography, commission control and footer; drawer stays within viewport. Consistent contrast and restrained blue field." };
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    const metadata = await WorkspaceFiles.json(metaFile);
    const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
    assert.equal(await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, true), "preserved");
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metaFile, metadata);
    await registerGeneratedPage(workspace, { prompt, model: "GPT-6", slug: shared.slug, title: shared.title, tags, staticDir: "out" });
    const updated = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const registrations = updated.pages[prompt].pages.filter((page) => page.model === "GPT-6");
    assert.equal(registrations.length, 1);
    assert.equal(registrations[0].enabled, false);
    assert.equal(registrations[0].deployed, false);
    const beforeOtherPages = structuredClone(config);
    const afterOtherPages = structuredClone(updated);
    delete beforeOtherPages.pages[prompt];
    delete afterOtherPages.pages[prompt];
    assert.deepEqual(afterOtherPages, beforeOtherPages, "Unrelated configuration preserved");
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metaFile, metadata);
    await WorkspaceFiles.saveJson(reportFile, {
        prompt, status: "completed-static-adaptation", action: "generated-validated-previewed-disabled-registration",
        modelId: metadata.modelId, display_model_name: "GPT-6", tags,
        generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added,
        output: folder, input: { fullOriginalRead: true, fullDesignRead: true, fingerprint },
        lock: { pid: lockPid, processRunning: true, ownedLockMatched: true, modified: false },
        QA: { ...qa, path: path.join(folder, ".checks", "qa.json") }, tests: qa.tests,
        screenshots: { desktop: path.join(folder, ".checks", "desktop.png"), mobile: path.join(folder, ".checks", "mobile.png"), preview: path.join(exported, "preview.png") },
        visual: qa.visual, registration: { registered: true, count: 1, ...registrations[0] },
        limitations: ["Original authored character illustration replaces the externally referenced cut-out; not an exact likeness of Eathan, no external photo reused or ownership asserted.", "Build-free HTML/CSS/Canvas JavaScript adaptation, not React/Vite/TypeScript/Tailwind/Framer Motion/Three.js or exact WebGL geometry/postprocessing.", "Fictional portfolio case studies and resume; inquiry is local downloadable text, never sent or stored on a backend.", "No build, deployment, external AI, agents or secret access."],
        blocker: null, resourcesClosed: true, provenance: { source: "https://github.com/frostmute/msites-prompt-collection/blob/d4974f4296e2851e05eabddb9240170cc423dd46/motionsites-prompts/135-eathan-portfolio/working-prompt.md", license: "MIT", author: "Nomaan Khan", externalPhotoUsed: false },
        completedAt: new Date().toISOString()
    });
    console.log("Complete: four verified flags true; disabled and undeployed registration; private report saved.");
}
else
{
    throw Error("Expected init, qa or finish");
}
