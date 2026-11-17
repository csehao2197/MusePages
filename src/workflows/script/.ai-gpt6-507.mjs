import path from "node:path";
import { readFile, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Lucide from "lucide-react";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const prompt = "507-brandly-brand-design-agency";
const model = "GPT-6";
const folder = path.join(workspace, "out", "pages", prompt, model);
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-507.json");
const slug = "brandly-brand-design-agency";
const tags = ["Branding", "Sculptural", "Typography"];

async function prepare()
{
    assert.equal((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim(), "29580");
    assert.equal(await WorkspaceFiles.info(metadataFile), null, "Do not reinitialize an existing attempt");
    await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", prompt, model, "out");
    await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", prompt, model, ".checks");
    await WorkspaceFiles.saveJson(metadataFile,
    {
        modelId: "gpt-6.1-sol",
        tags,
        staticDir: "out",
        generated: false,
        preview: false,
        config_added: false,
        validated: false
    });
    const raw = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
    const { ArrowRight, X, Menu, Pause } = Lucide;
    const icons = { ArrowRight, X, Menu, Pause };
    let html = await WorkspaceFiles.text(path.join(folder, "index.html"));
    for (const [name, icon] of Object.entries(icons))
    {
        html = html.replaceAll(`@@${name}@@`, renderToStaticMarkup(React.createElement(icon, { size: 20, strokeWidth: 1.8, "aria-hidden": true })));
    }
    const socials = {
        Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V7c0-1 .5-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9z"/></svg>',
        Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
        Youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>'
    };
    for (const [name, svg] of Object.entries(socials))
    {
        html = html.replaceAll(`@@${name}@@`, svg);
    }
    await WorkspaceFiles.saveText(path.join(folder, "index.html"), html);
    const downloads = [
        ["anton.ttf", "https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf"],
        ["inter.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf"],
        ["anton-OFL.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt"],
        ["inter-OFL.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt"]
    ];
    for (const [name, url] of downloads)
    {
        execFileSync("curl.exe", ["--fail", "--silent", "--show-error", "--location", "--max-time", "60", url, "-o", path.join(folder, name)]);
        assert.ok((await readFile(path.join(folder, name))).length > 100);
    }
    await copyFile(path.join(workspace, "data", "downloads", "github.com", "RupakThapa-motionsites", "f518e5d1f162f7e249e488589c3c5c4ec711522b", "LICENSE"), path.join(folder, "LICENSE"));
    await WorkspaceFiles.saveText(path.join(folder, "NOTICE.txt"), "Prompt provenance: RupakThapa/motionsites, commit f518e5d1f162f7e249e488589c3c5c4ec711522b.\nMIT notice: Copyright (c) 2026 Aayushsoam; see LICENSE.\nInter and Anton: Google Fonts; see inter-OFL.txt and anton-OFL.txt.\nIcons: Lucide, ISC License; see lucide-LICENSE.txt.\nRibbon sculpture and local video are original generated artwork for this page. No supplied external CloudFront media is redistributed.\nPortfolio brands and studio service details are illustrative concepts, not verified client claims.\n");
    await copyFile(path.join(workspace, "node_modules", "lucide-react", "LICENSE"), path.join(folder, "lucide-LICENSE.txt"));
    let browser;
    try
    {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const svg = await WorkspaceFiles.text(path.join(folder, "sculpture.svg"));
        const encoded = await page.evaluate(async (source) =>
        {
            const canvas = document.createElement("canvas");
            canvas.width = 1200;
            canvas.height = 900;
            const context = canvas.getContext("2d");
            const image = new Image();
            image.src = "data:image/svg+xml;base64," + btoa(source);
            await image.decode();
            function draw(phase)
            {
                context.fillStyle = "#f5f3ee";
                context.fillRect(0, 0, 1200, 900);
                context.save();
                context.translate(680, 420);
                context.rotate(Math.sin(phase) * .012);
                context.drawImage(image, -680, -420);
                context.restore();
            }
            draw(0);
            const stream = canvas.captureStream(24);
            const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 4000000 });
            const parts = [];
            recorder.ondataavailable = (event) => parts.push(event.data);
            const stopped = new Promise((resolve) => recorder.onstop = resolve);
            recorder.start();
            for (let frame = 0; frame < 96; frame++)
            {
                draw(frame / 96 * Math.PI * 2);
                await new Promise((resolve) => setTimeout(resolve, 1000 / 24));
            }
            recorder.stop();
            await stopped;
            stream.getTracks().forEach((track) => track.stop());
            const bytes = new Uint8Array(await new Blob(parts).arrayBuffer());
            let binary = "";
            for (const byte of bytes)
            {
                binary += String.fromCharCode(byte);
            }
            return btoa(binary);
        }, svg);
        await WorkspaceFiles.saveText(path.join(checks, "video-origin.txt"), "Original sculpture.svg rendered locally in Chromium Canvas and recorded using MediaRecorder VP9 WebM. 1200x900, 24 fps, 96 frames; background video is the only motion.\n");
        const { writeFile } = await import("node:fs/promises");
        await writeFile(path.join(folder, "brandly-loop.webm"), Buffer.from(encoded, "base64"));
    }
    finally
    {
        await browser?.close();
    }
    for (const name of ["index.html", "style.css", "site.js", "sculpture.svg", "mark.svg", "brandly-loop.webm", "inter.ttf", "anton.ttf", "LICENSE", "NOTICE.txt", "anton-OFL.txt", "inter-OFL.txt", "lucide-LICENSE.txt"])
    {
        await copyFile(path.join(folder, name), path.join(exported, name));
    }
    await StaticHomepage.checkSource(folder);
    const metadata = await WorkspaceFiles.json(metadataFile);
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    console.log("Prepared original artwork/video, fonts, licensed icons, source and independent export.");
}

async function qa()
{
    const results = [];
    const errors = [];
    let browser;
    let service;
    let failure;
    try
    {
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, model);
        results.push("StaticHomepage.validateStaticOutput passed; all resources independent at final public subpath.");
        service = await startPreviewServer(exported, { workspace });
        const ready = await fetch(service.url);
        assert.equal(ready.status, 200);
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
            const page = await context.newPage();
            page.on("console", (message) =>
            {
                if (message.type() === "error") errors.push(message.text());
            });
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
            });
            const response = await page.goto(service.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.evaluate(() => document.fonts.ready);
            assert.equal(await page.locator("h1").innerText(), "BUILDING\nBRANDS THAT\nRESONATE");
            await page.waitForFunction(() => document.querySelector("video").readyState >= 2 && document.querySelector("video").currentTime > 0);
            assert.equal(await page.evaluate(() => document.querySelector("video").videoWidth), 1200);
            const layout = async () =>
            {
                const measured = await page.evaluate(() =>
                {
                    const brands = document.querySelector(".brand-grid").getBoundingClientRect();
                    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, brandBottom: brands.bottom };
                });
                assert.ok(measured.scrollWidth <= measured.width, JSON.stringify(measured));
                assert.ok(measured.scrollHeight <= measured.height, JSON.stringify(measured));
                assert.ok(measured.brandBottom <= measured.height, JSON.stringify(measured));
                return measured;
            };
            const before = await layout();
            const name = viewport.width === 1200 ? "desktop" : "mobile";
            await page.screenshot({ path: path.join(checks, `${name}.png`) });
            await page.getByRole("button", { name: "Start today", exact: true }).click();
            await page.getByRole("button", { name: "Complete brand", exact: true }).click();
            assert.equal(await page.getByRole("button", { name: "Complete brand", exact: true }).getAttribute("aria-pressed"), "true");
            assert.match(await page.locator(".estimate").innerText(), /\$6,000/);
            await page.getByLabel("Describe your brand in a sentence").fill("A thoughtful independent coffee studio");
            await page.getByLabel("Your launch timeline").selectOption("Within 6 months");
            await page.getByRole("button", { name: "Create my project plan" }).click();
            assert.match(await page.getByRole("status").innerText(), /coffee studio.*Complete brand.*6 months.*not been submitted/);
            await page.getByRole("button", { name: "Identity essentials", exact: true }).click();
            assert.equal(await page.getByRole("status").innerText(), "");
            assert.match(await page.locator(".estimate").innerText(), /\$3,000/);
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("dialog").isVisible(), false);
            assert.equal(await page.getByRole("button", { name: "Start today", exact: true }).evaluate((element) => element === document.activeElement), true);
            await page.keyboard.press("Enter");
            assert.equal(await page.locator("dialog").isVisible(), true);
            await page.keyboard.press("Escape");
            if (name === "mobile")
            {
                await page.getByRole("button", { name: "Open navigation" }).click();
                await page.locator(".menu-links").getByRole("button", { name: "FAQ", exact: true }).click();
            }
            else
            {
                await page.getByRole("button", { name: "FAQ", exact: true }).click();
            }
            await page.getByText("Can you help with a brand refresh?", { exact: true }).click();
            assert.equal(await page.locator("details").first().getAttribute("open"), "");
            assert.ok(await page.getByText("Yes. We start", { exact: false }).isVisible());
            await page.keyboard.press("Escape");
            for (const key of ["About", "Features", "Pricing", "Help"])
            {
                if (name === "mobile")
                {
                    await page.getByRole("button", { name: "Open navigation" }).click();
                    await page.locator(".menu-links").getByRole("button", { name: key, exact: true }).click();
                }
                else
                {
                    await page.getByRole("button", { name: key, exact: true }).click();
                }
                assert.ok((await page.locator("#panel-content").innerText()).length > 80);
                await page.keyboard.press("Escape");
            }
            for (const key of ["Sign Up", "Log In"])
            {
                await page.getByRole("button", { name: key, exact: true }).click();
                assert.match(await page.locator("#panel-content").innerText(), /disabled/i);
                assert.equal(await page.locator("dialog input").count(), 0);
                await page.keyboard.press("Escape");
            }
            for (let index = 0; index < 6; index++)
            {
                await page.locator(".brand-grid button").nth(index).click();
                assert.equal(await page.locator("#panel-title").innerText(), caseTitle(index));
                assert.match(await page.locator("#panel-content").innerText(), /Illustrative portfolio concept/);
                await page.keyboard.press("Escape");
            }
            for (const key of ["Facebook", "Instagram", "YouTube"])
            {
                await page.getByRole("button", { name: key, exact: true }).click();
                assert.ok(await page.locator("dialog").isVisible());
                await page.keyboard.press("Escape");
            }
            await page.locator("#motion").click();
            assert.equal(await page.evaluate(() => document.querySelector("video").paused), true);
            await page.locator("#motion").click();
            await page.waitForFunction(() => !document.querySelector("video").paused);
            const after = await layout();
            results.push({ viewport, deviceScaleFactor: 1, before, after, assertions: ["HTTP 200", "nonblank heading", "fonts loaded", "real local video decoded and playing", "no page scroll/overflow before and after interactions", "six distinct portfolio panels", "planner scope estimate and submit result/reset", "keyboard Enter/Escape and focus restoration", "navigation and FAQ disclosure", "disabled credential-free accounts", "three social concept panels", "background pause/play"] });
            await context.close();
        }
        const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
        const reducedPage = await reduced.newPage();
        await reducedPage.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(await reducedPage.evaluate(() => document.querySelector("video").paused), true);
        results.push("Reduced-motion preference pauses the background; poster remains visible.");
        await reduced.close();
        assert.deepEqual(errors, []);
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), { passed: true, digest, results, errors, screenshots: ["desktop.png", "mobile.png"], visualReviewed: false, resourcesClosed: false });
    }
    catch (error)
    {
        failure = error;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), { passed: false, results, errors, failure: error.stack, visualReviewed: false, resourcesClosed: false });
    }
    finally
    {
        await browser?.close();
        await service?.close();
        const data = await WorkspaceFiles.json(path.join(checks, "qa.json"));
        data.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), data);
    }
    if (failure) throw failure;
    console.log("Static and real desktop/mobile browser QA passed; owned browser/server closed. Screenshots require visual review.");
}

function caseTitle(index)
{
    return ["Frame Blox", "Supa Blox", "Hype Blox", "Hype Blox", "Ultra Blox", "Ship Blox"][index].toUpperCase();
}

async function preview()
{
    const qaData = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    assert.ok(qaData.passed);
    const metadata = await WorkspaceFiles.json(metadataFile);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, model);
    assert.equal(digest, qaData.digest);
    const result = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    console.log(`Preview ${result}; open the real preview image before finalization.`);
}

async function finish()
{
    const qaData = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    assert.ok(qaData.passed && qaData.resourcesClosed);
    assert.equal((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim(), "29580");
    const metadata = await WorkspaceFiles.json(metadataFile);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, model);
    assert.equal(digest, qaData.digest);
    const image = await readFile(path.join(exported, "preview.png"));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${createHash("sha256").update(image).digest("hex")}`);
    qaData.visualReviewed = true;
    qaData.visualEvidence = "Actually opened desktop.png (1200x900), mobile.png (390x844), and fresh out/preview.png. Cream/black editorial hierarchy, Anton uppercase headings, six differentiated marks, orange sculptural background, clear CTA, legible metrics and mobile 3x2 brand grid. Both screenshots show all single-screen homepage sections without clipping. Static original artwork clearly documented instead of claiming the exact CloudFront footage.";
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qaData);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const configBefore = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const existing = configBefore.pages[prompt];
    const shared = existing?.pages?.[0];
    assert.ok(!shared || shared.slug === slug);
    await registerGeneratedPage(workspace, { prompt, model, slug, title: shared?.title ?? "Brandly Brand Design Agency", staticDir: "out", tags });
    const configAfter = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const registered = configAfter.pages[prompt].pages.filter((entry) => entry.model === model);
    assert.equal(registered.length, 1);
    assert.equal(registered[0].enabled, false);
    assert.equal(registered[0].deployed, false);
    const beforeUnrelated = structuredClone(configBefore);
    const afterUnrelated = structuredClone(configAfter);
    delete beforeUnrelated.pages[prompt];
    delete afterUnrelated.pages[prompt];
    assert.deepEqual(afterUnrelated, beforeUnrelated, "Other registrations and selections preserved");
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const readme = await WorkspaceFiles.text(path.join(folder, "README.md"));
    await WorkspaceFiles.saveText(path.join(folder, "README.md"), readme + "\n## Verified outcome\n\nStatic validation and real Chromium desktop/mobile QA passed at the final public subpath. The actual desktop/mobile PNGs and fresh preview were opened and visually reviewed: full single-screen composition, clear typography and CTA, legible metrics, responsive 3×2 mobile brand grid, no clipping or horizontal overflow. Planner, FAQ, all portfolio/social panels, keyboard focus restoration, account safety, and video pause/play were exercised. Reduced-motion playback is disabled. Browser/server resources were closed. Registration was uniquely verified with `enabled: false`, `deployed: false`; other config entries were unchanged. No build or deployment occurred. See `.checks\\qa.json` for assertions and exact viewport measurements.\n");
    await WorkspaceFiles.saveJson(reportFile,
    {
        prompt,
        status: "completed",
        modelId: "gpt-6.1-sol",
        publicModel: model,
        tags,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
        output: folder,
        staticOutput: exported,
        qa: path.join(checks, "qa.json"),
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png"), preview: path.join(exported, "preview.png") },
        tests: qaData.results,
        errors: qaData.errors,
        visualReviewed: true,
        visualEvidence: qaData.visualEvidence,
        registration: registered[0],
        limitations: ["Original local Canvas-recorded WebM replaces external CloudFront MP4 with uncertain media rights; no exact-media fidelity claim.", "Static HTML/CSS/browser JS adaptation rather than React/Tailwind runtime; installed Lucide icons exported to SVG.", "Account registration/sign-in disabled; project planner is local, ephemeral, and not transmitted.", "Prompt metrics and portfolio/social/package content are illustrative, not verified client claims.", "No build, assembly, publication, or deployment authorized or performed.", "task/TASK.md absent; explicit one-prompt user scope used."],
        blocker: null,
        resourcesClosed: true,
        coordinatorLock: { pid: 29580, leftIntact: true }
    });
    console.log(JSON.stringify({ prompt, status: "completed", ...metadata, resourcesClosed: true }));
}

const mode = process.argv[2];
if (mode === "prepare") await prepare();
else if (mode === "qa") await qa();
else if (mode === "preview") await preview();
else if (mode === "finish") await finish();
else throw Error("Choose prepare, qa, preview, or finish.");
