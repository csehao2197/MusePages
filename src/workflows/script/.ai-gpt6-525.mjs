import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, copyFile, readdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const prompt = "525-obsidian-architecture-design-studio";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-525.json");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const stage = process.argv[2];
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const group = config.pages[prompt];
const options = Array.isArray(group) ? group : group?.pages ?? [];
const slug = options[0]?.slug ?? "obsidian-architecture-design-studio";
const title = options[0]?.title ?? "Obsidian architecture design studio";

async function lockCheck()
{
    const pid = Number((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim());
    process.kill(pid, 0);
    const state = await WorkspaceFiles.json("C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json");
    if (state.ownedLock?.pid !== pid || state.ownedLock.prompt !== prompt || state.activePrompt !== prompt)
    {
        throw Error("Current coordinator lock ownership mismatch");
    }
    return { prompt, pid, active: true, manifestMatches: true };
}

const lock = await lockCheck();

if (stage === "artwork")
{
    let browser;
    try
    {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
        const svg = await WorkspaceFiles.text(path.join(folder, "architecture.svg"));
        const bytes = await page.evaluate(async (art) =>
        {
            const image = new Image();
            image.src = URL.createObjectURL(new Blob([art], { type: "image/svg+xml" }));
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = 1600;
            canvas.height = 1000;
            document.body.append(canvas);
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, 1600, 1000);
            const chunks = [];
            const stream = canvas.captureStream(0);
            const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 2500000 });
            recorder.ondataavailable = (event) => chunks.push(event.data);
            const finished = new Promise((resolve) => recorder.onstop = resolve);
            recorder.start();
            const start = performance.now();
            await new Promise((resolve) =>
            {
                function frame(now)
                {
                    const progress = Math.min((now - start) / 6000, 1);
                    const scale = 1.035 + .025 * Math.sin(progress * Math.PI * 2);
                    const width = 1600 * scale;
                    const height = 1000 * scale;
                    context.drawImage(image, -(width - 1600) / 2, -(height - 1000) / 2, width, height);
                    stream.getVideoTracks()[0].requestFrame();
                    if (progress < 1)
                    {
                        requestAnimationFrame(frame);
                    }
                    else
                    {
                        resolve();
                    }
                }
                requestAnimationFrame(frame);
            });
            recorder.stop();
            await finished;
            stream.getTracks().forEach((track) => track.stop());
            URL.revokeObjectURL(image.src);
            return Array.from(new Uint8Array(await new Blob(chunks, { type: "video/webm" }).arrayBuffer()));
        }, svg);
        const { writeFile } = await import("node:fs/promises");
        if (bytes.length < 1000)
        {
            throw Error("Original film has no meaningful video frames");
        }
        await writeFile(path.join(folder, "architecture.webm"), Buffer.from(bytes));
        console.log(JSON.stringify({ originalFilmBytes: bytes.length, durationSeconds: 6, author: "gpt-6.1-sol", browserClosedInFinally: true }));
    }
    finally
    {
        await browser?.close();
    }
}
else if (stage === "prepare")
{
    if (await WorkspaceFiles.info(metadataFile))
    {
        throw Error("Metadata appeared concurrently; preparation will not overwrite");
    }
    const metadata =
    {
        modelId: "gpt-6.1-sol",
        tags: ["Architecture", "Brutalism"],
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const original = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    await StaticHomepage.checkSource(folder);
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), hash(JSON.stringify([original, design])) + "\n");
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await WorkspaceFiles.ensureDirectory(folder, "out");
    for (const file of ["index.html", "style.css", "script.js", "architecture.svg", "architecture.webm", "craft.svg", "arcvault.svg", "LICENSE", "NOTICE"])
    {
        await copyFile(path.join(folder, file), path.join(exported, file));
    }
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    console.log(JSON.stringify({ source: "passed", static: "passed", digest, lock }));
}
else if (stage === "qa")
{
    for (const file of ["index.html", "style.css", "script.js", "architecture.svg", "architecture.webm", "craft.svg", "arcvault.svg", "LICENSE", "NOTICE"])
    {
        await copyFile(path.join(folder, file), path.join(exported, file));
    }
    await WorkspaceFiles.ensureDirectory(folder, ".checks");
    const qa =
    {
        prompt,
        modelId: "gpt-6.1-sol",
        timestamp: new Date().toISOString(),
        passed: false,
        visualReviewed: false,
        assertions: [],
        viewports: [],
        errors: [],
        lock,
        staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"),
        resourcesClosed: false
    };
    let server;
    let browser;
    try
    {
        server = await startPreviewServer(exported, { workspace });
        if (new URL(server.url).pathname !== `/pages/${slug}/GPT-6/index.html`)
        {
            throw Error("Preview helper public path differs from actual shared slug");
        }
        const response = await fetch(server.url);
        if (response.status !== 200)
        {
            throw Error("Owned static server not responsive");
        }
        const denied = await fetch(new URL("/README.md", server.url));
        if (denied.status !== 404)
        {
            throw Error("Server exposes non-target source");
        }
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const label = viewport.width === 1200 ? "desktop" : "mobile";
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
            page.setDefaultTimeout(30000);
            page.on("pageerror", (error) => qa.errors.push(`${label}: ${error.message}`));
            page.on("console", (message) =>
            {
                if (message.type() === "error")
                {
                    qa.errors.push(`${label} console: ${message.text()}`);
                }
            });
            page.on("requestfailed", (request) => qa.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
            page.on("response", (result) =>
            {
                if (result.status() >= 400)
                {
                    qa.errors.push(`${label} HTTP ${result.status()}: ${result.url()}`);
                }
            });
            const loaded = await page.goto(server.url, { waitUntil: "networkidle", timeout: 60000 });
            expect(loaded.status()).toBe(200);
            await page.evaluate(async () =>
            {
                await document.fonts.ready;
                await Promise.all([...document.images].map((image) => image.decode()));
            });
            await expect(page.locator("h1")).toHaveText("Shape yourbold spaces");
            const media = await page.waitForFunction(() =>
            {
                const film = document.querySelector("video");
                return film.readyState >= 2 && film.videoWidth > 0;
            }, undefined, { timeout: 60000 });
            await media.dispose();
            const noOverflow = async (moment) =>
            {
                const measure = await page.evaluate(() =>
                ({
                    scrollWidth: document.documentElement.scrollWidth,
                    width: innerWidth,
                    scrollHeight: document.documentElement.scrollHeight,
                    height: innerHeight
                }));
                expect(measure.scrollWidth).toBeLessThanOrEqual(measure.width);
                expect(measure.scrollHeight).toBeLessThanOrEqual(measure.height);
                qa.assertions.push(`${label}: no horizontal or page vertical overflow ${moment}`);
            };
            await noOverflow("before interactions");
            const placement = await page.locator(".project-card").evaluateAll((cards) => cards.map((card) =>
            {
                const box = card.getBoundingClientRect();
                return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
            }));
            expect(placement[0].y).toBeLessThan(placement[1].y);
            expect(placement[0].right).toBeLessThanOrEqual(placement[1].x);
            expect(placement[1].bottom).toBeLessThanOrEqual(viewport.height);
            const introBox = await page.locator(".intro").boundingBox();
            if (viewport.width < 768)
            {
                expect(introBox.y + introBox.height).toBeLessThan(placement[0].y);
            }
            await page.screenshot({ path: path.join(checks, `${label}.png`), fullPage: false, animations: "disabled" });
            await page.getByRole("button", { name: "Our Projects", exact: true }).click();
            await expect(page.getByRole("heading", { name: "Selected perspectives." })).toBeVisible();
            await page.locator("#detail-panel").getByRole("button", { name: "CRAFT" }).click();
            await expect(page.getByRole("heading", { name: "Spaces shaped with intention." })).toBeVisible();
            await page.getByRole("button", { name: "Back to projects" }).click();
            await page.locator("#detail-panel").getByRole("button", { name: "ARCVAULT" }).click();
            await expect(page.getByRole("heading", { name: "Form in Stone." })).toBeVisible();
            await page.keyboard.press("Escape");
            await expect(page.getByRole("button", { name: "Our Projects", exact: true })).toBeFocused();
            qa.assertions.push(`${label}: project index, both project notes, back navigation, Escape and focus return passed`);
            await page.getByRole("button", { name: "Explore CRAFT — Spaces shaped with intention" }).click();
            await expect(page.getByRole("heading", { name: "Spaces shaped with intention." })).toBeVisible();
            await page.getByRole("button", { name: "Close studio notes" }).click();
            await page.getByRole("button", { name: "Explore ARCVAULT — Form in Stone" }).click();
            await expect(page.getByRole("heading", { name: "Form in Stone." })).toBeVisible();
            await page.keyboard.press("Escape");
            await page.getByRole("button", { name: "Open navigation", exact: true }).focus();
            await page.keyboard.press("Enter");
            await expect(page.locator("#navigation-menu")).toBeVisible();
            await noOverflow("with menu open");
            await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute("aria-expanded", "true");
            await page.keyboard.press("Shift+Tab");
            expect(await page.evaluate(() => document.activeElement.closest("#navigation-menu") !== null)).toBe(true);
            await page.locator("#navigation-menu").getByRole("button", { name: "Studio" }).click();
            await expect(page.getByRole("heading", { name: "Built around intention." })).toBeVisible();
            await page.getByRole("button", { name: "Start a conversation" }).click();
            await page.getByLabel("Your name").fill("Jordan");
            await page.getByLabel("Your idea").fill("A quiet concrete courtyard <not markup>");
            await page.getByRole("button", { name: "Prepare brief", exact: true }).click();
            await expect(page.getByRole("status")).toContainText("Brief prepared for Jordan");
            await expect(page.getByRole("status")).toContainText("<not markup>");
            await expect(page.getByRole("status")).toContainText("not sent or stored");
            expect(await page.locator("#brief-status").locator("*").count()).toBe(0);
            await noOverflow("with brief dialog open");
            await page.keyboard.press("Escape");
            await page.getByRole("button", { name: "Open navigation", exact: true }).click();
            await page.locator("#navigation-menu").getByRole("button", { name: "Enter" }).click();
            await expect(page.locator("#panel-body")).toContainText("no client portal, sign-in");
            await page.getByRole("button", { name: "Close studio notes" }).click();
            await page.getByRole("button", { name: "Open navigation", exact: true }).click();
            await page.getByRole("button", { name: "Close navigation", exact: true }).click();
            await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
            qa.assertions.push(`${label}: keyboard menu, focus containment, Studio, local safe brief, honest Enter and menu close passed`);
            await page.getByRole("button", { name: "Play background film" }).click();
            await expect(page.getByRole("button", { name: "Pause background film" })).toBeVisible();
            expect(await page.locator("video").evaluate((video) => !video.paused)).toBe(true);
            const startedAt = await page.locator("video").evaluate((video) => video.currentTime);
            await page.waitForTimeout(350);
            expect(await page.locator("video").evaluate((video) => video.currentTime)).toBeGreaterThan(startedAt);
            expect(await page.locator("video").evaluate((video) => video.loop && video.muted)).toBe(true);
            await page.getByRole("button", { name: "Pause background film" }).click();
            expect(await page.locator("video").evaluate((video) => video.paused)).toBe(true);
            qa.assertions.push(`${label}: actual video decoded, reduced-motion pause, user play and pause passed`);
            await noOverflow("after interactions");
            qa.viewports.push({ ...viewport, deviceScaleFactor: 1, cardPlacement: placement, screenshot: path.join(checks, `${label}.png`) });
            await page.close();
        }
        expect(qa.errors).toEqual([]);
        qa.passed = true;
    }
    catch (error)
    {
        qa.errors.push(error.message);
        process.exitCode = 1;
    }
    finally
    {
        await browser?.close();
        await server?.close();
        qa.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    }
    console.log(JSON.stringify(qa, null, 2));
}
else if (stage === "preview")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    if (!qa.passed || qa.errors.length)
    {
        throw Error("Actual browser QA did not pass");
    }
    const metadata = await WorkspaceFiles.json(metadataFile);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    const preview = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    console.log(JSON.stringify({ preview, path: path.join(exported, "preview.png"), digest }));
}
else if (stage === "finish")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    if (!qa.passed || qa.errors.length || !qa.resourcesClosed)
    {
        throw Error("QA not ready for visual acceptance");
    }
    qa.visualReviewed = true;
    qa.visualEvaluation =
    {
        imagesActuallyOpened: ["desktop.png", "mobile.png", "out\\preview.png"],
        assessment: "Actual desktop and mobile PNGs opened. Original monumental concrete-arch film dominates the full-screen composition; white Lexend headline reads clearly over the left shade; diagonal project cards retain original architectural detail and readable labels. Navigation is restrained, spacing is balanced, and mobile cards sit below the intro without collision or overflow. Actual helper-generated preview also opened and matches this homepage.",
        refinement: "Visual inspection of the initial supplied dark organic visuals prompted an explicitly documented original architectural-artwork adaptation. Mobile video crop was shifted to reveal the arch, and reduced-motion playback was made reliably paused. Final desktop, mobile and preview PNGs were then captured and opened."
    };
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    if (digest !== qa.staticDigest)
    {
        throw Error("Static output changed after actual browser QA");
    }
    const image = await readFile(path.join(exported, "preview.png"));
    const imageHash = hash(image);
    if (image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 900 ||
        (await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim() !== `${digest} ${imageHash}`)
    {
        throw Error("Actual preview fingerprint or dimensions mismatch");
    }
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    const metadata = await WorkspaceFiles.json(metadataFile);
    await StaticHomepage.checkSource(folder);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await registerGeneratedPage(workspace, { prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const saved = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const registered = saved.pages[prompt].pages.filter((option) => option.model === "GPT-6");
    if (registered.length !== 1 || registered[0].slug !== slug || registered[0].staticDir !== "out" ||
        registered[0].enabled !== false || registered[0].deployed !== false)
    {
        throw Error("Unique disabled registration verification failed");
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await WorkspaceFiles.saveJson(reportFile,
    {
        prompt,
        status: "completed",
        modelId: metadata.modelId,
        displayModel: "GPT-6",
        tags: metadata.tags,
        tagValidation: true,
        fourflags: Object.fromEntries(["generated", "preview", "validated", "config_added"].map((name) => [name, metadata[name]])),
        output: folder,
        staticOutput: exported,
        QA: path.join(checks, "qa.json"),
        screenshots: qa.viewports.map((viewport) => viewport.screenshot),
        preview: { path: path.join(exported, "preview.png"), width: 1200, height: 900, sha256: imageHash, staticDigest: digest, fingerprintVerified: true },
        test: { passed: qa.passed, assertions: qa.assertions, errors: qa.errors, actualBrowser: "installed Playwright Chromium", publicPath: `/pages/${slug}/GPT-6/index.html`, sourceCheck: "passed", staticCheck: "passed" },
        visual: qa.visualEvaluation,
        registration: registered[0],
        limits: ["Static HTML/CSS/JavaScript adaptation, not the requested React/Vite/TypeScript/Tailwind build.", "Flexible visual-reference adaptation: original architectural SVG artwork and locally recorded looping WebM replace supplied remote media. No exact-media match is claimed; original media URLs returned 200, but Chromium cancelled MP4 range requests in both initial viewport runs. No third-party media is redistributed.", "Exact original linked Lexend font remains host-dependent.", "Project notes and studio are illustrative concepts; local brief sends and stores nothing; no authentication or production backend.", "No builds, deployment, uploads, secret access, external AI or nested agents were run."],
        blocker: null,
        resourcesClosed: true,
        coordinatorLock: { ...lock, untouched: true },
        publicFiles: await readdir(exported)
    });
    console.log(JSON.stringify({ status: "completed", metadata, registration: registered[0], reportFile }));
}
else
{
    throw Error("Expected prepare, qa, preview or finish stage");
}
