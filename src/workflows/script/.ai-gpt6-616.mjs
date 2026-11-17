import path from "node:path";
import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
if (job.prompt !== "616-short-video-feed-app" || job.modelId !== "gpt-6.1-sol")
{
    throw Error("Wrong job or generator identity");
}
const manifest = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await readFile(job.promptLock, "utf8")).trim());
if (manifest.runId !== job.runId || manifest.ownedLock?.prompt !== job.prompt || manifest.ownedLock?.pid !== lockPid)
{
    throw Error("Coordinator manifest and attached prompt lock do not match");
}
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const slug = "short-video-feed-app";
const title = "Short Video Feed App";
const tags = ["Short Video", "Slow Living", "Motion Art"];
const action = process.argv[2];
const ids = ["sun-room", "quiet-tide", "morning-cup", "somewhere-slow", "balance", "green-hour"];
await mkdir(checks, { recursive: true });

async function exportFiles()
{
    await mkdir(exported, { recursive: true });
    for (const name of ["index.html", "style.css", "content.js", "app.js", "icons.js", "LICENSE.txt"])
    {
        await copyFile(path.join(folder, name), path.join(exported, name));
    }
}

if (action === "assets")
{
    if (await WorkspaceFiles.info(metadataFile))
    {
        throw Error("Assets generation is only permitted for this initial empty target, not a retry");
    }
    await WorkspaceFiles.saveJson(metadataFile,
    {
        modelId: job.modelId,
        tags,
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    });
    const iconNames = ["Flame", "Compass", "UsersRound", "Bookmark", "CircleUserRound", "Plus", "Ellipsis", "Search", "ArrowUp", "ArrowDown", "Mouse", "Sparkles", "X", "Volume2", "VolumeX", "Heart", "MessageCircle", "Send", "Play", "Pause", "Repeat2"];
    const icons = Object.fromEntries(iconNames.map((name) => [name, renderToStaticMarkup(createElement(lucide[name], { "aria-hidden": true }))]));
    await writeFile(path.join(folder, "icons.js"), `export const icons = ${JSON.stringify(icons, null, 4)};\n`);
    await mkdir(path.join(folder, "assets"), { recursive: true });
    await writeFile(path.join(folder, "assets", "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#f6f5f0"/><path d="M22 5c1 10-10 10-10 20a8 8 0 0 0 16 0c0-7-6-9-6-20Z" fill="#b7783d"/><path d="M20 22c1 4-4 5-4 8a4 4 0 0 0 8 0c0-4-4-4-4-8Z" fill="#f6f5f0"/></svg>');
    let browser;
    try
    {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ viewport: { width: 720, height: 1080 }, deviceScaleFactor: 1 });
        await page.setContent('<html><body style="margin:0"><canvas width="720" height="1080"></canvas></body></html>');
        for (let scene = 0; scene < ids.length; scene++)
        {
            const result = await page.evaluate(async (scene) =>
            {
                const canvas = document.querySelector("canvas");
                const ctx = canvas.getContext("2d");
                const W = 720;
                const H = 1080;
                const TAU = Math.PI * 2;
                function gradient(x, y, x2, y2, colors)
                {
                    const gradient = ctx.createLinearGradient(x, y, x2, y2);
                    colors.forEach((color, index) => gradient.addColorStop(index / (colors.length - 1), color));
                    return gradient;
                }
                function shape(points, fill)
                {
                    ctx.beginPath();
                    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
                    ctx.closePath();
                    ctx.fillStyle = fill;
                    ctx.fill();
                }
                function ellipse(x, y, rx, ry, fill)
                {
                    ctx.beginPath();
                    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
                    ctx.fillStyle = fill;
                    ctx.fill();
                }
                function sphere(x, y, radius, light, dark)
                {
                    const g = ctx.createRadialGradient(x - radius * .4, y - radius * .45, 0, x + radius * .1, y + radius * .1, radius * 1.15);
                    g.addColorStop(0, light);
                    g.addColorStop(1, dark);
                    ellipse(x, y, radius, radius, g);
                }
                function arch(x, y, width, height, fill)
                {
                    ctx.beginPath();
                    ctx.moveTo(x, y + height);
                    ctx.lineTo(x, y + width / 2);
                    ctx.arc(x + width / 2, y + width / 2, width / 2, Math.PI, 0);
                    ctx.lineTo(x + width, y + height);
                    ctx.closePath();
                    ctx.fillStyle = fill;
                    ctx.fill();
                }
                const grain = document.createElement("canvas");
                grain.width = W;
                grain.height = H;
                const grainContext = grain.getContext("2d");
                const pixels = grainContext.createImageData(W, H);
                let seed = 164273;
                for (let i = 0; i < pixels.data.length; i += 4)
                {
                    seed = (seed * 1664525 + 1013904223) >>> 0;
                    const value = seed >>> 24;
                    pixels.data[i] = value;
                    pixels.data[i + 1] = value;
                    pixels.data[i + 2] = value;
                    pixels.data[i + 3] = 14;
                }
                grainContext.putImageData(pixels, 0, 0);
                function render(time)
                {
                    const phase = time / 5 * TAU;
                    const drift = Math.sin(phase);
                    ctx.clearRect(0, 0, W, H);
                    ctx.fillStyle = gradient(0, 0, W, H, scene === 1 ? ["#b6c8ba", "#718e80"] : scene === 5 ? ["#deddbd", "#acb98a"] : ["#e8dbc1", "#c5b393"]);
                    ctx.fillRect(0, 0, W, H);
                    if (scene === 0)
                    {
                        ctx.fillStyle = gradient(0, 0, 720, 0, ["#cec0a3", "#f0e2c6", "#ddc9a7"]);
                        ctx.fillRect(0, 0, 720, 800);
                        arch(235, 152, 410, 670, "#b8a484");
                        arch(253, 165, 387, 650, gradient(260, 200, 580, 800, ["#a29170", "#c3ae87", "#d9c7a2"]));
                        shape([[0, 0], [240, 0], [590 + drift * 10, 810], [285, 810]], "#fff3cf48");
                        ctx.fillStyle = "#b29c78";
                        ctx.fillRect(0, 788, 720, 292);
                        ctx.fillStyle = gradient(0, 790, 0, 1080, ["#dcc6a0", "#b99f77"]);
                        ctx.fillRect(0, 800, 720, 280);
                        shape([[244, 790], [455, 796], [715, 1080], [405, 1080]], "#8d795c38");
                        ctx.save();
                        ctx.filter = "blur(15px)";
                        ellipse(395 + drift * 8, 756, 150, 21, "#5f4b334d");
                        ctx.restore();
                        ctx.fillStyle = gradient(244, 0, 470, 0, ["#dbc8a7", "#e7d5b6", "#c5af89"]);
                        ctx.fillRect(244, 672, 237, 130);
                        ellipse(362, 672, 119, 26, "#e5d4b4");
                        ellipse(362, 802, 119, 12, "#c8b18b");
                        sphere(362 + Math.sin(phase) * 15, 454 + Math.cos(phase) * 15, 151, "#ed9e4b", "#9d3e26");
                        ctx.save();
                        ctx.translate(363, 455 + Math.cos(phase) * 15);
                        ctx.rotate(-.43 + drift * .03);
                        ctx.beginPath();
                        ctx.ellipse(0, 0, 188, 42, 0, 0, Math.PI);
                        ctx.strokeStyle = "#f4d19b";
                        ctx.lineWidth = 9;
                        ctx.stroke();
                        ctx.restore();
                        for (let step = 0; step < 5; step++)
                        {
                            const x = step * 29 - 70;
                            const y = 880 - step * 38;
                            shape([[x, y], [x + 90, y - 28], [x + 160, y + 10], [x + 68, y + 40]], "#e1cba5");
                            shape([[x + 68, y + 40], [x + 160, y + 10], [x + 160, 1080], [x + 68, 1080]], step % 2 ? "#b39b74" : "#c2a982");
                        }
                        ctx.save();
                        ctx.globalAlpha = .4;
                        ctx.strokeStyle = "#f3e7d0";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(81, 0);
                        ctx.lineTo(81, 660);
                        ctx.stroke();
                        ctx.restore();
                    }
                    else if (scene === 1)
                    {
                        ctx.fillStyle = gradient(0, 740, 0, H, ["#d0d5bf", "#7d9a83"]);
                        ctx.fillRect(0, 735, W, 345);
                        ellipse(370, 795, 255, 72, "#345e5355");
                        ctx.beginPath();
                        ctx.moveTo(140, 540);
                        ctx.bezierCurveTo(170, 920, 580, 920, 610, 540);
                        ctx.fillStyle = gradient(140, 0, 610, 0, ["#a6b5a4", "#e2e4cf", "#a4bca7"]);
                        ctx.fill();
                        ellipse(375, 541, 235, 72, "#dce4cb");
                        ellipse(375, 540, 215, 54, "#658e7b");
                        ctx.save();
                        ctx.beginPath();
                        ctx.ellipse(375, 540, 215, 54, 0, 0, TAU);
                        ctx.clip();
                        for (let i = 0; i < 10; i++)
                        {
                            ctx.beginPath();
                            ctx.ellipse(375 + drift * 9, 539, 50 + ((i * 28 + time * 35) % 255), 9 + ((i * 5 + time * 7) % 45), 0, 0, TAU);
                            ctx.strokeStyle = "#ccddc388";
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                        ctx.restore();
                        sphere(402 + drift * 38, 435 + Math.cos(phase) * 14, 53, "#efcb8d", "#ad8b59");
                        for (let i = 0; i < 3; i++)
                        {
                            ellipse(160 + i * 40, 844 + i * 7, 42 - i * 6, 14 - i * 2, ["#939a7e", "#d5d0ae", "#6f7d64"][i]);
                        }
                        ctx.fillStyle = "#e9efd52b";
                        ctx.fillRect(80, 0, 32, 735);
                        ctx.fillRect(130, 0, 12, 735);
                    }
                    else if (scene === 2)
                    {
                        ctx.fillStyle = "#d5bc96";
                        ctx.fillRect(0, 740, W, 340);
                        shape([[140, 0], [460, 0], [720, 900], [450, 960]], "#fff1bd77");
                        ctx.save();
                        ctx.filter = "blur(12px)";
                        ellipse(385, 794, 227, 55, "#7b5b3c55");
                        ctx.restore();
                        ellipse(365, 757, 231, 66, "#d1b188");
                        ellipse(365, 743, 228, 64, "#eddbb6");
                        ellipse(365, 738, 160, 35, "#c5a77e");
                        ctx.beginPath();
                        ctx.ellipse(522, 594, 70, 83, 0, 0, TAU);
                        ctx.strokeStyle = "#e6ceaa";
                        ctx.lineWidth = 27;
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(200, 530);
                        ctx.bezierCurveTo(210, 810, 490, 810, 511, 530);
                        ctx.fillStyle = gradient(200, 0, 515, 0, ["#bb784b", "#dfb17a", "#b97e4c"]);
                        ctx.fill();
                        ellipse(356, 531, 156, 43, "#f2d3a3");
                        ellipse(356, 531, 141, 32, "#66432f");
                        ellipse(350, 526, 126, 24, "#81563a");
                        for (let i = 0; i < 3; i++)
                        {
                            ctx.beginPath();
                            ctx.moveTo(290 + i * 65, 480);
                            ctx.bezierCurveTo(235 + i * 65 + drift * 27, 403, 340 + i * 50 - drift * 20, 337, 299 + i * 50 + drift * 20, 228);
                            ctx.strokeStyle = `rgba(255,244,218,${.22 - i * .025})`;
                            ctx.lineWidth = 13 - i * 2;
                            ctx.lineCap = "round";
                            ctx.stroke();
                        }
                        shape([[65, 820], [160, 790], [236, 859], [140, 892]], "#b39c74");
                        shape([[65, 808], [160, 778], [236, 847], [140, 880]], "#e9d8b8");
                    }
                    else if (scene === 3)
                    {
                        ctx.fillStyle = gradient(0, 0, 0, 690, ["#a4b8af", "#d5d7bd"]);
                        ctx.fillRect(0, 0, W, H);
                        sphere(521, 245 + drift * 5, 76, "#f4e3b1", "#ddbf84");
                        shape([[0, 570], [200, 381], [430, 637], [720, 428], [720, 1080], [0, 1080]], "#8d9d89");
                        shape([[0, 717], [251, 536], [500, 772], [720, 605], [720, 1080], [0, 1080]], "#d3b88f");
                        ctx.fillStyle = "#bca17c";
                        ctx.fillRect(0, 790, W, 290);
                        arch(188, 192, 324, 730, "#ede1c5");
                        arch(231, 235, 238, 686, "#9d9f82");
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(231, 921);
                        ctx.lineTo(231, 354);
                        ctx.arc(350, 354, 119, Math.PI, 0);
                        ctx.lineTo(469, 921);
                        ctx.clip();
                        ctx.fillStyle = gradient(0, 250, 0, 850, ["#b7c8bb", "#e7d6ae"]);
                        ctx.fillRect(230, 230, 240, 700);
                        shape([[230, 670], [330, 530 + drift * 4], [470, 711], [470, 1080], [230, 1080]], "#a5ae8f");
                        shape([[230, 790], [375, 637], [470, 745], [470, 1080], [230, 1080]], "#d5b58c");
                        ctx.restore();
                        shape([[188, 921], [231, 921], [503, 1080], [388, 1080]], "#89745248");
                        for (let i = 0; i < 8; i++)
                        {
                            ellipse(350 + Math.sin(i * 1.7) * (i * 15), 930 + i * 19, 20 + i * 2, 5 + i, "#e8d4af");
                        }
                        for (let i = 0; i < 12; i++)
                        {
                            ellipse(80 + (i * 137 + time * 7) % 580, 100 + i * 65, 1.5, 1.5, "#f7edd1aa");
                        }
                    }
                    else if (scene === 4)
                    {
                        ctx.fillStyle = gradient(0, 700, 0, H, ["#b6b69b", "#929a7d"]);
                        ctx.fillRect(0, 790, W, 290);
                        shape([[140, 0], [360, 0], [720, 821], [520, 821]], "#fff6d856");
                        ellipse(367, 839, 190, 36, "#5e665333");
                        ctx.save();
                        ctx.translate(365, 719);
                        ctx.rotate(drift * .035);
                        ellipse(0, 0, 130, 99, gradient(-130, -70, 130, 99, ["#69785e", "#384f3e"]));
                        ellipse(5, -131, 88, 52, gradient(-88, -170, 88, -80, ["#e6c590", "#ba8e59"]));
                        ctx.save();
                        ctx.translate(5, -232);
                        ctx.rotate(-.13 + drift * .08);
                        ellipse(0, 0, 113, 48, gradient(-100, -50, 100, 40, ["#c18c67", "#975e45"]));
                        ctx.restore();
                        sphere(0, -346, 68, "#e6dfc2", "#acaf90");
                        ctx.restore();
                        ctx.save();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#65765b44";
                        ctx.beginPath();
                        ctx.arc(365, 500, 249, -.9, .7);
                        ctx.stroke();
                        ctx.restore();
                    }
                    else
                    {
                        ctx.fillStyle = "#e1d7b4";
                        ctx.fillRect(0, 780, W, 300);
                        ctx.fillStyle = "#e8e2c4";
                        ctx.fillRect(56, 103, 589, 627);
                        ctx.fillStyle = gradient(0, 100, 650, 700, ["#aebf9b", "#d4d7ae"]);
                        ctx.fillRect(75, 120, 550, 586);
                        ctx.fillStyle = "#eee4c6";
                        ctx.fillRect(337, 120, 22, 586);
                        ctx.fillRect(75, 362, 550, 20);
                        shape([[75, 706], [337, 706], [704, 1080], [435, 1080]], "#f8eccb66");
                        ellipse(369, 861, 179, 35, "#78845a44");
                        ctx.fillStyle = gradient(240, 650, 474, 850, ["#c18c61", "#e1b682", "#bd8257"]);
                        ctx.beginPath();
                        ctx.moveTo(238, 667);
                        ctx.lineTo(271, 847);
                        ctx.quadraticCurveTo(360, 880, 449, 847);
                        ctx.lineTo(481, 667);
                        ctx.fill();
                        ellipse(360, 667, 122, 29, "#e4bd8c");
                        ellipse(360, 667, 106, 20, "#797050");
                        for (let i = 0; i < 7; i++)
                        {
                            const stemX = 360 + Math.sin(i * 1.8) * 16;
                            const leafX = 357 + Math.sin(i * 2.4) * 125 + drift * (i + 1);
                            const leafY = 250 + i * 44;
                            ctx.beginPath();
                            ctx.moveTo(stemX, 671);
                            ctx.quadraticCurveTo(350 + drift * 8, leafY + 140, leafX, leafY);
                            ctx.strokeStyle = "#5c7043";
                            ctx.lineWidth = 4;
                            ctx.stroke();
                            ctx.save();
                            ctx.translate(leafX, leafY);
                            ctx.rotate(Math.sin(i * 2.4) * .8 + drift * .03);
                            ellipse(0, 0, 32, 72, gradient(-30, 0, 32, 0, ["#425e3c", "#8ba06c"]));
                            ctx.beginPath();
                            ctx.moveTo(0, 61);
                            ctx.lineTo(0, -60);
                            ctx.strokeStyle = "#bcc99755";
                            ctx.lineWidth = 1;
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                    ctx.drawImage(grain, 0, 0);
                    const vignette = ctx.createRadialGradient(360, 480, 200, 360, 480, 820);
                    vignette.addColorStop(0, "#27211300");
                    vignette.addColorStop(1, "#27211325");
                    ctx.fillStyle = vignette;
                    ctx.fillRect(0, 0, W, H);
                }
                render(0);
                const poster = canvas.toDataURL("image/png").split(",")[1];
                const stream = canvas.captureStream(24);
                const chunks = [];
                const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 2200000 });
                const complete = new Promise((resolve) => recorder.onstop = resolve);
                recorder.ondataavailable = (event) => chunks.push(event.data);
                recorder.start();
                const start = performance.now();
                await new Promise((resolve) =>
                {
                    function tick()
                    {
                        const time = (performance.now() - start) / 1000;
                        render(Math.min(time, 5));
                        if (time < 5)
                        {
                            requestAnimationFrame(tick);
                        }
                        else
                        {
                            resolve();
                        }
                    }
                    tick();
                });
                recorder.stop();
                await complete;
                stream.getTracks().forEach((track) => track.stop());
                const blob = new Blob(chunks, { type: "video/webm" });
                const bytes = new Uint8Array(await blob.arrayBuffer());
                let binary = "";
                for (let i = 0; i < bytes.length; i += 16384)
                {
                    binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
                }
                return { poster, video: btoa(binary), bytes: bytes.length };
            }, scene);
            await writeFile(path.join(folder, "assets", `${ids[scene]}.png`), Buffer.from(result.poster, "base64"));
            await writeFile(path.join(folder, "assets", `${ids[scene]}.webm`), Buffer.from(result.video, "base64"));
            console.log(`Original clip ${ids[scene]}: ${result.bytes} bytes`);
        }
    }
    finally
    {
        await browser?.close();
    }
    await exportFiles();
    await mkdir(path.join(exported, "assets"), { recursive: true });
    for (const name of await readdir(path.join(folder, "assets")))
    {
        await copyFile(path.join(folder, "assets", name), path.join(exported, "assets", name));
    }
    const metadata = await WorkspaceFiles.json(metadataFile);
    await StaticHomepage.checkSource(folder);
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const raw = await readFile(job.file, "utf8");
    const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
    console.log("Source checked; original clips exported; generated=true. QA/preview/registration remain false.");
}

if (action === "qa")
{
    await exportFiles();
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    let browser;
    let server;
    const evidence = { prompt: job.prompt, staticDigest: digest, assertions: [], videos: [], errors: [], viewports: [], visualReviewed: false, resourcesClosed: false };
    const check = (label) => evidence.assertions.push(label);
    const noOverflow = async (page, label) =>
    {
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        check(label);
    };
    const attachErrors = (page) =>
    {
        page.on("pageerror", (error) => evidence.errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error")
            {
                evidence.errors.push(`console: ${message.text()}`);
            }
        });
        page.on("response", (response) =>
        {
            if (response.status() >= 400)
            {
                evidence.errors.push(`HTTP ${response.status()}: ${response.url()}`);
            }
        });
        page.on("requestfailed", (request) =>
        {
            if (request.failure()?.errorText !== "net::ERR_ABORTED")
            {
                evidence.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`);
            }
        });
    };
    try
    {
        server = await startPreviewServer(exported, { workspace });
        expect(server.url).toContain("/pages/short-video-feed-app/GPT-6/index.html");
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
        const page = await context.newPage();
        attachErrors(page);
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        expect(response.status()).toBe(200);
        evidence.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
        await expect(page.locator(".story.active h2")).toHaveText("A little room for wonder.");
        await noOverflow(page, "Desktop initial no horizontal overflow");
        expect(await page.locator(".story.active video").evaluate((video) => video.readyState >= 2 && video.videoWidth === 720 && !video.paused)).toBe(true);
        const before = await page.locator(".story.active video").evaluate((video) => video.currentTime);
        await page.waitForTimeout(300);
        const after = await page.locator(".story.active video").evaluate((video) => video.currentTime);
        expect(after).not.toBe(before);
        check("HTTP 200, nonblank homepage; real 720px WebM actively advances");
        await page.locator(".story.active video").evaluate((video) => { video.currentTime = 0; video.pause(); });
        await page.screenshot({ path: path.join(checks, "desktop.png") });
        await page.locator('.story.active [data-action="play"]').click();
        await expect(page.locator(".story.active")).not.toHaveClass(/paused/);
        await page.locator('.story.active [data-action="like"]').click();
        await expect(page.locator('.story.active [data-action="like"]')).toHaveAttribute("aria-pressed", "true");
        await page.locator('.story.active [data-action="save"]').click();
        await page.locator('.story.active .follow-button').click();
        await expect(page.locator('.story.active .follow-button')).toHaveText("Following");
        check("Like, save and follow actual browser state transitions");
        await page.locator('.story.active [data-action="comments"]').click();
        await page.getByRole("textbox", { name: "Your comment" }).fill("A thoughtful local test comment.");
        await page.getByRole("button", { name: "Post", exact: true }).click();
        await expect(page.locator(".comments-list")).toContainText("A thoughtful local test comment.");
        await page.keyboard.press("Escape");
        await expect(page.locator("#drawer")).not.toBeVisible();
        check("Comment submitted visibly, stored locally; Escape closes modal");
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator('.story.active [data-action="like"]')).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator('.story.active [data-action="save"]')).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator('.story.active .follow-button')).toHaveAttribute("aria-pressed", "true");
        await page.locator('.story.active [data-action="comments"]').click();
        await expect(page.locator(".comments-list")).toContainText("A thoughtful local test comment.");
        await page.getByRole("button", { name: "Close dialog" }).click();
        check("Likes, saves, follow and comments persist after reload");
        await page.locator('.story.active [data-action="share"]').click();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("?story=sun-room");
        check("Sharing copies an actual story deep link");
        await page.locator("#feed").focus();
        await page.keyboard.press("ArrowDown");
        await expect(page.locator(".story.active")).toHaveAttribute("data-story", "quiet-tide");
        await page.keyboard.press("Space");
        await expect(page.locator(".story.active")).toHaveClass(/paused/);
        await page.keyboard.press("Space");
        await expect(page.locator(".story.active")).not.toHaveClass(/paused/);
        await page.keyboard.press("m");
        await expect(page.locator('.story.active [data-action="sound"]')).toHaveAttribute("aria-pressed", "true");
        await page.keyboard.press("m");
        await page.locator(".story.active .progress").fill("65");
        expect(await page.locator(".story.active video").evaluate((video) => video.currentTime)).toBeGreaterThan(2.5);
        check("Keyboard next, Space pause/play, ambient sound toggle and actual seeking");
        for (let index = 0; index < ids.length; index++)
        {
            const video = page.locator(`[data-story="${ids[index]}"] video`);
            await video.evaluate(async (element) =>
            {
                if (element.readyState < 2)
                {
                    await new Promise((resolve, reject) =>
                    {
                        element.addEventListener("loadeddata", resolve, { once: true });
                        element.addEventListener("error", reject, { once: true });
                        element.load();
                    });
                }
            });
            const properties = await video.evaluate((element) => ({ width: element.videoWidth, height: element.videoHeight, duration: element.duration, decoded: element.readyState >= 2 }));
            expect(properties.width).toBe(720);
            expect(properties.height).toBe(1080);
            expect(properties.duration).toBeGreaterThan(4.5);
            evidence.videos.push({ id: ids[index], ...properties });
        }
        check("All six independently decoded local WebM clips are 720×1080, >4.5 seconds");
        await page.locator('.navigation [data-nav="following"]').click();
        await expect(page.locator(".story")).toHaveCount(2);
        await page.locator('.navigation [data-nav="saved"]').click();
        await expect(page.locator(".story")).toHaveCount(1);
        check("Following and saved feeds filter by actual local state");
        await page.locator('.navigation [data-nav="home"]').click();
        await page.getByRole("button", { name: "Little rituals", exact: true }).click();
        await expect(page.locator(".story")).toHaveCount(2);
        await page.getByRole("button", { name: "All stories", exact: true }).click();
        await page.getByRole("searchbox", { name: "Search stories" }).fill("cup");
        await expect(page.locator(".story")).toHaveCount(1);
        await page.getByRole("searchbox", { name: "Search stories" }).fill("not-a-real-story");
        await expect(page.locator(".empty-state")).toBeVisible();
        await page.getByRole("button", { name: "Explore all stories", exact: true }).click();
        await expect(page.locator(".story")).toHaveCount(6);
        check("Topic filters, text search, empty state and reset work");
        await page.locator('.story.active .creator-link').click();
        await expect(page.locator(".profile-hero h1")).toHaveText("Hearthline Studio");
        await expect(page.locator(".media-card")).toHaveCount(2);
        await page.locator(".media-card").nth(1).click();
        await expect(page.locator(".story.active")).toHaveAttribute("data-story", "somewhere-slow");
        await noOverflow(page, "Desktop after interactions no horizontal overflow");
        check("Creator profile has actual media grid and reopens selected video");
        await page.goto(`${server.url}?story=balance`, { waitUntil: "networkidle" });
        await expect(page.locator(".story.active")).toHaveAttribute("data-story", "balance");
        await page.goto(`${server.url}?story=unknown`, { waitUntil: "networkidle" });
        await expect(page.locator(".story.active")).toHaveAttribute("data-story", "sun-room");
        check("Valid story parameter opens requested story; invalid falls back to first");
        await page.getByRole("button", { name: "Create a story", exact: true }).click();
        await expect(page.locator("#dialog-content")).toContainText("not uploaded or published");
        await page.locator("#upload").setInputFiles(path.join(folder, "assets", "sun-room.webm"));
        await expect(page.locator(".story.active")).toHaveAttribute("data-story", "your-preview");
        await expect(page.locator(".story.active video")).toHaveJSProperty("readyState", 4);
        await page.locator('.story.active [data-action="share"]').click();
        await expect(page.locator("#toast")).toContainText("cannot be shared");
        check("Device-video selection creates playable local-only preview; no upload or remote sharing");
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.locator("#feed").hover();
        await page.mouse.wheel(0, 640);
        await expect(page.locator(".story.active")).not.toHaveAttribute("data-story", "sun-room");
        check("Desktop wheel scrolling snaps to another actual story");
        await context.close();
        const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        const mobile = await mobileContext.newPage();
        attachErrors(mobile);
        await mobile.goto(server.url, { waitUntil: "networkidle" });
        evidence.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        await expect(mobile.locator(".mobile-nav")).toBeVisible();
        await noOverflow(mobile, "Mobile initial no horizontal overflow");
        await mobile.locator(".story.active video").evaluate((video) => { video.currentTime = 0; video.pause(); });
        await mobile.screenshot({ path: path.join(checks, "mobile.png") });
        await mobile.locator('.story.active [data-action="play"]').tap();
        await expect(mobile.locator(".story.active")).not.toHaveClass(/paused/);
        await mobile.locator('.story.active [data-action="like"]').tap();
        await expect(mobile.locator('.story.active [data-action="like"]')).toHaveAttribute("aria-pressed", "true");
        await mobile.locator('.story.active [data-action="comments"]').tap();
        await mobile.getByRole("textbox", { name: "Your comment" }).fill("A mobile moment.");
        await mobile.getByRole("button", { name: "Post", exact: true }).tap();
        await expect(mobile.locator(".comments-list")).toContainText("A mobile moment.");
        await mobile.getByRole("button", { name: "Close dialog" }).tap();
        await mobile.locator('.story.active .follow-button').tap();
        await mobile.locator('.mobile-nav [data-nav="following"]').tap();
        await expect(mobile.locator(".story")).toHaveCount(2);
        await mobile.locator('.mobile-nav [data-nav="home"]').tap();
        const session = await mobileContext.newCDPSession(mobile);
        await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 650 }] });
        for (const y of [570, 470, 370, 270, 160, 110])
        {
            await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y }] });
            await mobile.waitForTimeout(35);
        }
        await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await expect(mobile.locator(".story.active")).not.toHaveAttribute("data-story", "sun-room");
        check("Mobile tap playback, like, comment, follow, following filter and genuine touch scroll");
        await mobile.getByRole("button", { name: "Search stories", exact: true }).tap();
        await mobile.getByRole("searchbox", { name: "Search stories" }).fill("green");
        await expect(mobile.locator(".story")).toHaveCount(1);
        await noOverflow(mobile, "Mobile after interactions/search no horizontal overflow");
        check("Mobile expanding search returns the matching video");
        await mobileContext.close();
        const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
        await fallback.addInitScript(() =>
        {
            Object.defineProperty(window, "localStorage", { get() { throw new Error("Disabled storage"); } });
        });
        const fallbackPage = await fallback.newPage();
        attachErrors(fallbackPage);
        await fallbackPage.goto(server.url, { waitUntil: "networkidle" });
        expect(await fallbackPage.locator(".story.active video").evaluate((video) => video.paused)).toBe(true);
        await fallbackPage.locator('.story.active [data-action="like"]').click();
        await expect(fallbackPage.locator('.story.active [data-action="like"]')).toHaveAttribute("aria-pressed", "true");
        await expect(fallbackPage.locator("#toast")).toContainText("storage unavailable");
        await noOverflow(fallbackPage, "Reduced-motion/storage-disabled mobile remains usable");
        check("Reduced motion starts paused; blocked localStorage gracefully falls back to memory");
        await fallback.close();
        expect(evidence.errors).toEqual([]);
        check("No HTTP, failed resource, console or page errors in desktop/mobile/fallback tests");
        evidence.passed = true;
    }
    catch (error)
    {
        evidence.passed = false;
        evidence.failure = error.stack;
        throw error;
    }
    finally
    {
        await browser?.close();
        await server?.close();
        evidence.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), evidence);
        console.log(JSON.stringify({ passed: evidence.passed, assertions: evidence.assertions, errors: evidence.errors, resourcesClosed: evidence.resourcesClosed }, null, 2));
    }
}

if (action === "preview")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    if (!qa.passed || !qa.visualReviewed)
    {
        throw Error("Successful browser QA and explicit visual review are required");
    }
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    if (qa.staticDigest !== digest)
    {
        throw Error("Static content changed after QA");
    }
    const metadata = await WorkspaceFiles.json(metadataFile);
    const result = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    console.log(`Preview ${result}; verified actual browser/static output.`);
}

if (action === "finish")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    const metadata = await WorkspaceFiles.json(metadataFile);
    if (!qa.passed || !qa.visualReviewed || !qa.previewVisualReviewed || !metadata.preview || !metadata.validated)
    {
        throw Error("Actual QA and fresh preview visual review required before registration");
    }
    const staticDigest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    const inputFingerprint = (await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim();
    const input = await readFile(job.file, "utf8");
    const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    const previewFingerprint = (await readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim();
    const previewSHA256 = createHash("sha256").update(await readFile(path.join(exported, "preview.png"))).digest("hex");
    if (staticDigest !== qa.staticDigest || previewFingerprint !== `${staticDigest} ${previewSHA256}` ||
        inputFingerprint !== createHash("sha256").update(JSON.stringify([input, design])).digest("hex"))
    {
        throw Error("Input/static/preview fingerprint verification failed");
    }
    const configBefore = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const oldGroup = configBefore.pages[job.prompt];
    const oldOption = oldGroup?.pages?.[0];
    if (oldOption && (oldOption.slug !== slug || oldOption.title !== title))
    {
        throw Error("Existing shared title/slug differ; preserve existing mapping");
    }
    await registerGeneratedPage(workspace, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags });
    const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    for (const [key, value] of Object.entries(configBefore))
    {
        if (key !== "pages" && JSON.stringify(config[key]) !== JSON.stringify(value))
        {
            throw Error(`Unrelated configuration changed: ${key}`);
        }
    }
    for (const [key, value] of Object.entries(configBefore.pages))
    {
        if (key !== job.prompt && JSON.stringify(config.pages[key]) !== JSON.stringify(value))
        {
            throw Error("Unrelated prompt configuration changed");
        }
    }
    const entries = config.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
    if (entries.length !== 1 || entries[0].enabled !== false || entries[0].deployed !== false || JSON.stringify(entries[0].tags) !== JSON.stringify(tags))
    {
        throw Error("Unique disabled registration verification failed");
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const report =
    {
        prompt: job.prompt,
        input: job.file,
        provenance: job.provenance,
        runId: job.runId,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        output: folder,
        staticOutput: exported,
        sourceType: "HTML/CSS/browser ES modules, original locally encoded WebM clips",
        license: { name: "CC-BY-NC-4.0", notice: path.join(folder, "LICENSE.txt"), publicNotice: path.join(exported, "LICENSE.txt"), attribution: "Prompt by VibeFather; source collection by liyupi; Lucide ISC icon notice retained" },
        digests: { inputFingerprint, staticDigest, previewFingerprint, previewSHA256 },
        qaFile: path.join(checks, "qa.json"),
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png"), preview: path.join(exported, "preview.png") },
        lockVerification: { pid: lockPid, ownedLockMatches: true, processAlive: true, coordinatorPreserved: true },
        evidence: { assertions: qa.assertions, videos: qa.videos, errors: qa.errors, viewports: qa.viewports, validationIterations: qa.validationIterations, visualReview: qa.visualReview, visualReviewed: qa.visualReviewed, previewVisualReviewed: qa.previewVisualReviewed, previewReview: qa.previewReview },
        registration: { unique: true, ...entries[0] },
        summary: "已完成 Hearthline 独立静态首页：六段原创本地真实 WebM 视频、单条滚动播放、播放暂停/拖动、点赞收藏评论关注、筛选搜索、创作者网格、键盘与移动触屏操作。桌面/移动实测通过；已打开审阅两张真实 QA 截图及新预览。登记默认关闭，未构建或发布。",
        limitations: ["采用获准的 HTML/CSS/ES-module 静态适配，不是 Vite/React/TypeScript/Tailwind 产物；系统字体替代指定字体。", "按本轮明确要求使用六段原创动画视频，覆盖原始公开 prompt 的照片模拟、禁用视频文件要求；没有复制第三方视频或付费 demo。", "仅公开原始需求可用，Pro 私有布局与资产未提供；不声称精确复刻私有 demo。", "社交计数/种子评论和创作者为示例。点赞收藏关注与新增评论仅浏览器本地，无生产认证、实时社交或后端。", "设备视频仅会话内本地预览，不上传、不发布；音轨为用户开启后生成的双音振荡器。", "原 prompt 与改编受 CC BY-NC 4.0 限制；未部署、未构建。", "task\\TASK.md 不存在；以本轮明确单项 job 作为范围授权。"],
        blocker: null,
        resourcesClosed: qa.resourcesClosed,
        unrelatedConfigPreserved: true,
        buildRun: false,
        deployed: false
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    console.log(JSON.stringify({ status: report.status, flags: metadata, report: job.reportFile, resourcesClosed: report.resourcesClosed }, null, 2));
}
