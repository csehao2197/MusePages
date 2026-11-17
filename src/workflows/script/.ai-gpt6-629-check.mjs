import { readFile, writeFile, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as icons from "lucide-react";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "629-editorial-music-player-now-playing");
assert.equal(job.modelId, "gpt-6.1-sol");
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const tags = ["Music", "Editorial", "Duotone"];
const slug = "editorial-music-player-now-playing";
const title = "Editorial Music Player (Now Playing)";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const durations = [32, 36, 40, 32];
const names = ["slow-afternoon", "amber-windows", "somewhere-still", "last-light"];
const phase = process.argv[2];

async function guard()
{
    const state = JSON.parse(await readFile(job.stateFile, "utf8"));
    const pid = Number((await readFile(job.promptLock, "utf8")).trim());
    assert.equal(state.runId, job.runId);
    assert.equal(state.ownedLock.prompt, job.prompt);
    assert.equal(state.ownedLock.pid, pid);
    process.kill(pid, 0);
}

function wave(index)
{
    const rate = 22050;
    const length = durations[index] * rate;
    const buffer = Buffer.alloc(44 + length * 2);
    buffer.write("RIFF");
    buffer.writeUInt32LE(buffer.length - 8, 4);
    buffer.write("WAVEfmt ", 8);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(rate, 24);
    buffer.writeUInt32LE(rate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(length * 2, 40);
    const roots = [130.8128, 146.8324, 110, 164.8138];
    const ratios = [1, 1.259921, 1.498307, 1.887749];
    for (let sample = 0; sample < length; sample++)
    {
        const t = sample / rate;
        const fade = Math.min(1, t / 2, (durations[index] - t) / 3);
        const chord = Math.floor(t / 8) % 4;
        const base = roots[index] * [1, .890899, .749154, 1][chord];
        let value = 0;
        for (let voice = 0; voice < 4; voice++)
        {
            const frequency = base * ratios[voice];
            value += .055 * Math.sin(2 * Math.PI * frequency * t + .15 * Math.sin(t * .7 + voice));
            value += .012 * Math.sin(2 * Math.PI * frequency * 2 * t);
        }
        const beat = t % .75;
        const note = Math.floor(t / .75);
        const melody = roots[index] * 2 * [1, 1.498307, 1.259921, 2, 1.887749, 1.498307, 1.259921, 1][note % 8];
        const bell = Math.exp(-beat * 6) * Math.min(1, beat * 80);
        value += .10 * bell * (Math.sin(2 * Math.PI * melody * beat) + .25 * Math.sin(2 * Math.PI * melody * 3 * beat));
        buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * fade)) * 32767), 44 + sample * 2);
    }
    return buffer;
}

await guard();
await mkdir(checks, { recursive: true });

if (phase === "prepare")
{
    assert.equal(await WorkspaceFiles.info(metadataFile), null, "Prepare only accepts this fresh task output.");
    await WorkspaceFiles.saveJson(metadataFile,
    {
        modelId: job.modelId, tags, staticDir: "out",
        generated: false, preview: false, config_added: false, validated: false
    });
    const assets = await WorkspaceFiles.ensureDirectory(root, path.relative(root, folder), "assets");
    const fontSource = path.join(root, "out", "pages", "046-online-course-landing-page", "GPT-6", "assets");
    for (const name of ["inter.ttf", "sora.ttf", "INTER-OFL.txt", "SORA-OFL.txt"])
    {
        await copyFile(path.join(fontSource, name), path.join(assets, name));
    }
    await copyFile(path.join(root, "node_modules", "lucide-react", "LICENSE"), path.join(assets, "LUCIDE-LICENSE.txt"));
    await copyFile(path.join(root, job.provenance.license_file), path.join(assets, "PROMPT-LICENSE.txt"));
    const iconNames = ["ChevronDown", "Ellipsis", "Heart", "Shuffle", "SkipBack", "Play", "Pause", "SkipForward", "Repeat", "Volume1", "Volume2", "VolumeX", "ListMusic", "X", "AudioLines", "ArrowUp", "ArrowDown", "Check", "Signal", "Wifi", "BatteryFull"];
    const symbols = iconNames.map((name) =>
    {
        const id = name.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([a-z])(\d)/g, "$1-$2").toLowerCase();
        return renderToStaticMarkup(React.createElement(icons[name])).replace(/<svg[^>]*>/, `<symbol id="${id}" viewBox="0 0 24 24">`).replace("</svg>", "</symbol>");
    });
    await writeFile(path.join(assets, "icons.svg"), `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`);
    await writeFile(path.join(assets, "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="#16261f"/><circle cx="20" cy="20" r="11" fill="none" stroke="#ff6a4d"/><circle cx="20" cy="20" r="4" fill="#ff6a4d"/></svg>');
    await writeFile(path.join(assets, "grain.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/></filter><path fill="#fff" filter="url(#n)" d="M0 0h160v160H0z"/></svg>');
    for (let index = 0; index < names.length; index++)
    {
        const buffer = wave(index);
        assert.ok(buffer.readInt16LE(10044) !== 0);
        await writeFile(path.join(assets, `${names[index]}.wav`), buffer);
    }
    await writeFile(path.join(assets, "NOTICE.txt"), `OFF HOURS — CREDITS\n\nPrompt: ${job.provenance.title}, Superdesign, CC0-1.0.\n${job.provenance.source_url}\nSee PROMPT-LICENSE.txt.\n\nThe Quiet Hours is fictional. Slow afternoon (32s), Amber windows (36s),\nSomewhere, still (40s), and Last light (32s) are original synthesized\ninstrumental studies created specifically for this page. No third-party\nsongs, samples, lyrics, artist voices or commercial recordings are used.\nOriginal audio, composition and sunset artwork: CC0-1.0.\nhttps://creativecommons.org/publicdomain/zero/1.0/legalcode\n\nSora and Inter: SIL Open Font License 1.1; see SORA-OFL.txt and INTER-OFL.txt.\nLucide: ISC/MIT; see LUCIDE-LICENSE.txt.\n`);
    await StaticHomepage.checkSource(folder);
    const metadata = await WorkspaceFiles.json(metadataFile);
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const input = await readFile(job.file, "utf8");
    const design = await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), hash(JSON.stringify([input, design])) + "\n");
    await StaticHomepage.copyHtml(folder, exported);
    console.log(JSON.stringify({ generated: true, staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"), originalAudioSeconds: durations }));
}
else if (phase === "qa")
{
    const qa = { passed: false, modelId: job.modelId, tests: [], errors: [], viewports: [], visualReviewed: false, resourcesClosed: false };
    let browser;
    let server;
    try
    {
        qa.staticDigest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
        server = await startPreviewServer(exported, { workspace: root });
        assert.equal(new URL(server.url).pathname, `/pages/${slug}/GPT-6/index.html`);
        assert.equal((await fetch(server.url)).status, 200);
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const mobile = viewport.width === 390;
            const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
            const page = await context.newPage();
            page.on("pageerror", (error) => qa.errors.push(error.message));
            page.on("console", (message) =>
            {
                if (message.type() === "error") qa.errors.push(message.text());
            });
            page.on("requestfailed", (request) => qa.errors.push(`${request.url()}: ${request.failure()?.errorText}`));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()}: ${response.url()}`);
            });
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.evaluate(() => document.fonts.ready);
            assert.ok(await page.locator("h1").isVisible());
            assert.equal(await page.locator(".track-button").count(), 4);
            const overflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            await overflow();
            await page.screenshot({ path: path.join(checks, mobile ? "mobile.png" : "desktop.png") });
            assert.equal(await page.locator("audio").evaluate((audio) => audio.paused), true);
            await page.getByRole("button", { name: "Play", exact: true }).click();
            await page.waitForFunction(() => document.querySelector("audio").currentTime > .3 && !document.querySelector("audio").paused);
            await page.getByRole("button", { name: "Pause", exact: true }).click();
            assert.equal(await page.locator("audio").evaluate((audio) => audio.paused), true);
            await page.locator("#seek").focus();
            await page.keyboard.press("End");
            await page.keyboard.press("ArrowLeft");
            const seekEvidence = await page.locator("audio").evaluate((audio) => ({ time: audio.currentTime, duration: audio.duration, source: audio.currentSrc, range: document.querySelector("#seek").value, seekable: audio.seekable.length ? audio.seekable.end(0) : 0, readyState: audio.readyState }));
            assert.ok(seekEvidence.time > 30);
            await page.locator("#seek").press("Home");
            const seekBox = await page.locator("#seek").boundingBox();
            if (mobile) await page.touchscreen.tap(seekBox.x + seekBox.width * .65, seekBox.y + seekBox.height / 2);
            else
            {
                await page.mouse.move(seekBox.x + 3, seekBox.y + seekBox.height / 2);
                await page.mouse.down();
                await page.mouse.move(seekBox.x + seekBox.width * .65, seekBox.y + seekBox.height / 2, { steps: 8 });
                await page.mouse.up();
            }
            await page.waitForFunction(() => document.querySelector("audio").currentTime > 18 && document.querySelector("audio").currentTime < 24);
            await page.locator("#volume").focus();
            await page.keyboard.press("Home");
            assert.equal(await page.locator("audio").evaluate((audio) => audio.volume), 0);
            await page.keyboard.press("End");
            assert.equal(await page.locator("audio").evaluate((audio) => audio.volume), 1);
            await page.getByRole("button", { name: "Mute", exact: true }).click();
            assert.equal(await page.locator("audio").evaluate((audio) => audio.muted), true);
            await page.getByRole("button", { name: "Unmute", exact: true }).click();
            await page.getByRole("button", { name: "Save Slow afternoon", exact: true }).click();
            assert.equal(await page.locator("#like").getAttribute("aria-pressed"), "true");
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator("#like").getAttribute("aria-pressed"), "true");
            await page.getByRole("button", { name: "Play Amber windows", exact: true }).click();
            await page.waitForLoadState("networkidle");
            await page.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").duration === 36);
            assert.equal(await page.locator("h1").textContent(), "Amber windows");
            await page.getByRole("button", { name: "Next track", exact: true }).click();
            await page.waitForLoadState("networkidle");
            assert.equal(await page.locator("h1").textContent(), "Somewhere, still");
            await page.getByRole("button", { name: "Previous track", exact: true }).click();
            await page.waitForLoadState("networkidle");
            assert.equal(await page.locator("h1").textContent(), "Amber windows");
            await page.getByRole("button", { name: "Queue", exact: true }).click();
            await page.getByRole("button", { name: "Move Amber windows up", exact: true }).click();
            assert.equal(await page.locator(".queue-row").first().getAttribute("data-id"), "1");
            await overflow();
            await page.getByRole("button", { name: "Done", exact: true }).click();
            await page.locator("#repeat").click();
            await page.locator("audio").evaluate((audio) => audio.currentTime = audio.duration - .2);
            await page.waitForFunction(() => document.querySelector("audio").currentTime < 2 && !document.querySelector("audio").paused);
            assert.equal(await page.locator("h1").textContent(), "Amber windows");
            await page.locator("#repeat").click();
            await page.locator("audio").evaluate((audio) => audio.currentTime = audio.duration - .2);
            await page.waitForFunction(() => document.querySelector("h1").textContent === "Slow afternoon");
            await page.waitForLoadState("networkidle");
            await page.locator("#shuffle").click();
            await page.locator("#next").click();
            await page.waitForLoadState("networkidle");
            assert.notEqual(await page.locator("h1").textContent(), "Slow afternoon");
            assert.equal(await page.locator("#shuffle").getAttribute("aria-pressed"), "true");
            await page.locator("#play").click();
            await page.locator("body").click({ position: { x: 5, y: 5 } });
            await page.keyboard.press("Space");
            await page.waitForFunction(() => !document.querySelector("audio").paused);
            await page.keyboard.press("Space");
            assert.equal(await page.locator("audio").evaluate((audio) => audio.paused), true);
            await page.locator("#collapse").click();
            assert.equal(await page.locator("#listening").isVisible(), false);
            await page.locator("#collapse").click();
            assert.equal(await page.locator("#listening").isVisible(), true);
            await page.locator("#more").click();
            assert.equal(await page.locator("dialog").isVisible(), true);
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("dialog").isVisible(), false);
            await overflow();
            const audioEvidence = await page.evaluate(async ({ names, durations }) =>
            {
                const context = new AudioContext();
                try
                {
                    const recordings = [];
                    for (let index = 0; index < names.length; index++)
                    {
                        const bytes = await (await fetch(`assets/${names[index]}.wav`)).arrayBuffer();
                        const decoded = await context.decodeAudioData(bytes);
                        const samples = decoded.getChannelData(0);
                        let energy = 0;
                        for (let i = 0; i < samples.length; i++) energy += samples[i] ** 2;
                        recordings.push({ name: names[index], duration: decoded.duration, expected: durations[index], rms: Math.sqrt(energy / samples.length), channels: decoded.numberOfChannels });
                    }
                    return recordings;
                }
                finally
                {
                    await context.close();
                }
            }, { names, durations });
            for (const recording of audioEvidence)
            {
                assert.equal(recording.duration, recording.expected);
                assert.ok(recording.rms > .03);
            }
            qa.viewports.push({ ...viewport, deviceScaleFactor: 1, beforeAfterOverflow: false, audioEvidence });
            qa.tests.push(`${mobile ? "mobile" : "desktop"}: HTTP, fonts, visible UI, no overflow before/after and during queue editing, no autoplay, real advancing playback/pause, keyboard seek and volume, ${mobile ? "touch seek" : "pointer-drag seek"}, mute, saved persistence, queue selection, next/previous, reorder, actual ended repeat and queue advance, shuffle, Space toggle, collapse, modal Escape, all four original WAV recordings decoded and non-silent`);
            await context.close();
        }
        assert.deepEqual(qa.errors, []);
        qa.passed = true;
    }
    catch (error)
    {
        qa.failure = error.stack;
        throw error;
    }
    finally
    {
        if (browser) await browser.close();
        if (server) await server.close();
        qa.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        console.log(JSON.stringify(qa));
    }
}
else if (phase === "preview")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    assert.equal(qa.passed, true);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    const metadata = await WorkspaceFiles.json(metadataFile);
    console.log(await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview));
}
else if (phase === "finish")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    assert.equal(qa.passed, true);
    assert.equal(qa.visualReviewed, true);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    const previewDigest = hash(await readFile(path.join(exported, "preview.png")));
    assert.equal((await readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim(), `${digest} ${previewDigest}`);
    const metadata = await WorkspaceFiles.json(metadataFile);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const before = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
    const group = before.pages[job.prompt];
    const existing = (Array.isArray(group) ? group : group?.pages) || [];
    const shared = existing[0] || { slug, title };
    assert.equal(shared.slug, slug);
    await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug: shared.slug, title: shared.title, tags, staticDir: "out" });
    const after = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
    const registered = after.pages[job.prompt].pages.filter((page) => page.model === "GPT-6");
    assert.equal(registered.length, 1);
    assert.equal(registered[0].enabled, false);
    assert.equal(registered[0].deployed, false);
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await WorkspaceFiles.saveJson(job.reportFile,
    {
        prompt: job.prompt, status: "completed", modelId: job.modelId, display_model_name: "GPT-6", tags,
        generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added,
        output: folder, staticDir: exported, qa: path.join(checks, "qa.json"),
        screenshots: [path.join(checks, "desktop.png"), path.join(checks, "mobile.png"), path.join(exported, "preview.png")],
        tests: qa.tests, viewports: qa.viewports, errors: qa.errors,
        visualReviewed: true, visualEvidence: qa.visualEvidence,
        digests: { input: (await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim(), static: digest, preview: previewDigest },
        registration: registered[0], resourcesClosed: qa.resourcesClosed,
        limitations: ["虚构艺人；四首原创合成器短曲，不是商业音乐库，无歌词与第三方采样。", "纯静态 HTML/CSS/JavaScript，无账户、流媒体服务或后端；收藏仅保存在当前浏览器，队列仅当前会话。", "未执行构建、dist、publish 或部署。", "task\\TASK.md 缺失；本轮明确单项授权与已核验的实时协调器任务清单用于限定范围。"],
        resolvedIssues: ["初次 QA 发现临时静态服务器不支持 Range 导致 WAV 无法随机定位；页面改为完整读取本地 WAV Blob，随后实际键盘、鼠标拖动和移动触摸定位均验证通过。"],
        summary: "已完成真实静态播放器、原创本地音频、桌面与移动交互验证、两端截图和实际预览视觉检查；仅默认关闭登记。"
    });
    console.log(JSON.stringify({ completed: true, flags: metadata, registration: registered[0], report: job.reportFile }));
}
else
{
    throw Error("Expected prepare, qa, preview or finish.");
}
