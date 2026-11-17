import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "..", "..", "..", "..");
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const { registerGeneratedPage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "deploy-site.mjs")));
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "589-harbor-town-delivery-game");
assert.equal(job.modelId, "gpt-6.1-sol");
assert.equal(folder, job.output);
const tags = ["Driving", "Coastal", "Low Poly"];
const metadataFile = path.join(folder, "metadata.json");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const qaFile = path.join(checks, "qa.json");
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const group = config.pages[job.prompt];
const shared = (Array.isArray(group) ? group : group?.pages)?.[0];
const slug = shared?.slug || "harbor-town-delivery-game";
const title = shared?.title || "Harbor Town Delivery Game";
const hash = data => crypto.createHash("sha256").update(data).digest("hex");
const mode = process.argv[2] || "qa";

async function assertLock()
{
    const pid = Number((await fs.readFile(job.promptLock, "utf8")).trim());
    const manifest = await WorkspaceFiles.json(job.stateFile);
    assert.equal(manifest.runId, job.runId);
    assert.equal(manifest.ownedLock.prompt, job.prompt);
    assert.equal(manifest.ownedLock.pid, pid);
    process.kill(pid, 0);
}
await assertLock();

if (mode === "prepare")
{
    assert.equal(await WorkspaceFiles.info(metadataFile), null, "Refusing to overwrite an existing metadata record");
    const metadata = { modelId: job.modelId, tags, staticDir: "out", generated: false, preview: false, config_added: false, validated: false };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await fs.mkdir(path.join(folder, "vendor", "lucide", "icons"), { recursive: true });
    await fs.mkdir(path.join(folder, "licenses"), { recursive: true });
    await fs.mkdir(path.join(folder, "assets"), { recursive: true });
    for (const name of ["three.module.min.js", "three.core.min.js"])
    {
        await fs.copyFile(path.join(folder, "node_modules", "three", "build", name), path.join(folder, "vendor", name));
    }
    const iconNames = ["package", "truck", "pause", "volume-2", "volume-x", "rotate-ccw", "circle-help", "arrow-right", "arrow-up", "arrow-down", "arrow-left", "anchor", "clock", "check", "navigation"];
    for (const name of ["createElement", "defaultAttributes", ...iconNames.map(name => `icons/${name}`)])
    {
        const parts = name.split("/");
        const original = await fs.readFile(path.join(folder, "node_modules", "lucide", "dist", "esm", ...parts) + ".js", "utf8");
        await fs.writeFile(path.join(folder, "vendor", "lucide", ...parts) + ".js", original.replace(/^\/\/# sourceMappingURL=.*$/gm, ""));
    }
    for (const name of ["fredoka", "dm-sans"])
    {
        await fs.copyFile(path.join(folder, "node_modules", "@fontsource-variable", name, "files", `${name}-latin-wght-normal.woff2`), path.join(folder, "assets", `${name}-latin.woff2`));
        await fs.copyFile(path.join(folder, "node_modules", "@fontsource-variable", name, "LICENSE"), path.join(folder, "licenses", `${name}-OFL.txt`));
    }
    for (const [name, file] of [["three", "LICENSE"], ["lucide", "LICENSE"]])
    {
        await fs.copyFile(path.join(folder, "node_modules", name, file), path.join(folder, "licenses", `${name}-LICENSE.txt`));
    }
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), hash(JSON.stringify([await WorkspaceFiles.text(job.file), await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))])) + "\n");
    await syncStatic();
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    console.log(JSON.stringify({ source: "passed", staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"), metadata }));
}
else if (mode === "sync")
{
    await syncStatic();
    console.log(await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"));
}
else if (mode === "qa")
{
    await runQA();
}
else if (mode === "preview")
{
    const qa = await WorkspaceFiles.json(qaFile);
    assert(qa.passed && qa.visualReviewed && qa.resourcesClosed);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    const metadata = await WorkspaceFiles.json(metadataFile);
    console.log(await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview));
}
else if (mode === "finish")
{
    await finish();
}
else throw Error(`Unknown mode ${mode}`);

async function syncStatic()
{
    await fs.mkdir(exported, { recursive: true });
    await fs.copyFile(path.join(folder, "index.html"), path.join(exported, "index.html"));
    const html = (await fs.readFile(path.join(exported, "index.html"), "utf8")).replaceAll("./src/", "./game/");
    await fs.writeFile(path.join(exported, "index.html"), html);
    for (const [source, target] of [["src", "game"], ["vendor", "vendor"], ["assets", "assets"], ["licenses", "licenses"]])
    {
        await fs.cp(path.join(folder, source), path.join(exported, target), { recursive: true });
    }
    for (const name of ["LICENSE", "NOTICE"]) await fs.copyFile(path.join(folder, name), path.join(exported, name));
}

async function runQA()
{
    const tests = [];
    const errors = [];
    const qa = { passed: false, prompt: job.prompt, modelId: job.modelId, sourceCheck: await StaticHomepage.checkSource(folder), staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"), tests, errors, viewports: [], screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") }, visualReviewed: false, resourcesClosed: false, date: new Date().toISOString() };
    let server;
    let browser;
    function passed(name, evidence)
    {
        tests.push({ name, passed: true, evidence });
        console.log("PASS", name);
    }
    const state = page => page.evaluate(() => window.harborGame.getState());
    async function overflow(page, label)
    {
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
        assert(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, JSON.stringify(dimensions));
        passed(`${label}: no horizontal overflow`, dimensions);
    }
    async function attach(context)
    {
        context.on("page", page =>
        {
            page.on("pageerror", error => errors.push(`page: ${error.message}`));
            page.on("console", message =>
            {
                if (message.type() === "error") errors.push(`console: ${message.text()}`);
            });
            page.on("requestfailed", request => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
            page.on("response", response =>
            {
                if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
            });
        });
    }
    async function load(context)
    {
        const page = await context.newPage();
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.waitForFunction(() => window.harborGame?.getState().webgl === true);
        await page.evaluate(() => document.fonts.ready);
        assert((await page.locator("body").innerText()).includes("Copper Quay Couriers"));
        assert(await page.locator("#world").isVisible());
        return page;
    }
    async function keyboardDrive(page, x, z)
    {
        const result = await page.evaluate(async ({ x, z }) =>
        {
            const pressed = new Set();
            const setKeys = desired =>
            {
                for (const code of pressed)
                {
                    if (!desired.includes(code))
                    {
                        document.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }));
                        pressed.delete(code);
                    }
                }
                for (const code of desired)
                {
                    if (!pressed.has(code))
                    {
                        document.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
                        pressed.add(code);
                    }
                }
            };
            const start = performance.now();
            try
            {
                while (performance.now() - start < 18000)
                {
                    const s = window.harborGame.getState();
                    if (s.phase !== "playing") return { success: false, reason: s.phase, van: s.van };
                    const dx = x - s.van.x;
                    const dz = z - s.van.z;
                    const distance = Math.hypot(dx, dz);
                    if (distance < 1.15 && Math.abs(s.van.speed) < 1) return { success: true, van: s.van };
                    const desired = Math.atan2(-dx, -dz);
                    const error = Math.atan2(Math.sin(desired - s.van.heading), Math.cos(desired - s.van.heading));
                    const keys = [];
                    if (Math.abs(error) > 0.07) keys.push(error > 0 ? "ArrowLeft" : "ArrowRight");
                    if (Math.abs(error) < 0.22 && distance > Math.max(0.9, s.van.speed ** 2 / 110 + 0.25)) keys.push("ArrowUp");
                    else keys.push("Space");
                    setKeys(keys);
                    await new Promise(resolve => setTimeout(resolve, 25));
                }
                return { success: false, reason: "navigation deadline", van: window.harborGame.getState().van, target: { x, z } };
            }
            finally
            {
                setKeys([]);
            }
        }, { x, z });
        assert(result.success, JSON.stringify(result));
        return result.van;
    }
    try
    {
        server = await startPreviewServer(exported, { workspace });
        assert.equal((await fetch(server.url)).status, 200);
        assert(new URL(server.url).pathname.endsWith(`/pages/${slug}/GPT-6/index.html`));
        browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
        const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
        await attach(desktop);
        const page = await load(desktop);
        qa.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
        await overflow(page, "Desktop before play");
        await page.screenshot({ path: qa.screenshots.desktop });
        passed("Desktop real WebGL town, local fonts and first-screen start card", { phase: (await state(page)).phase, url: server.url });
        await page.getByRole("button", { name: "Start my shift", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().phase === "playing");
        await page.keyboard.press("e");
        await page.waitForFunction(() => window.harborGame.getState().cargo === 6);
        await page.locator("#target-marker").waitFor({ state: "visible" });
        assert.equal(await page.locator("#target-marker").textContent(), "01");
        passed("Start shift and load all six real parcels with E at the depot", await state(page));
        await page.keyboard.press("e");
        assert.equal((await state(page)).delivered, 0);
        passed("Delivery is rejected when not near the next address", (await state(page)).message);
        await page.keyboard.press("p");
        await page.waitForFunction(() => window.harborGame.getState().phase === "paused");
        const paused = await state(page);
        await page.waitForTimeout(500);
        assert.equal((await state(page)).remaining, paused.remaining);
        await page.getByRole("button", { name: "Back to the bay", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().phase === "playing");
        passed("Pause freezes countdown; resume continues the same round", { remaining: paused.remaining });
        await page.getByRole("button", { name: "How to play", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().help);
        assert.equal((await state(page)).phase, "paused");
        await page.getByRole("button", { name: "Got it, let's go", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().phase === "playing");
        passed("Instructions open without losing play state and pause the clock");
        await page.getByRole("button", { name: "Sound off", exact: true }).click();
        assert.equal(await page.getByRole("button", { name: "Sound on", exact: true }).getAttribute("aria-pressed"), "true");
        await page.getByRole("button", { name: "Sound on", exact: true }).click();
        await page.locator("#world").focus();
        passed("Opt-in local synthesized sound toggles accessibly");
        const start = await state(page);
        await page.keyboard.down("w");
        await page.waitForTimeout(450);
        await page.keyboard.up("w");
        await page.keyboard.down("Space");
        await page.waitForTimeout(300);
        await page.keyboard.up("Space");
        assert((await state(page)).van.z < start.van.z - 1);
        await page.keyboard.press("r");
        await page.waitForTimeout(80);
        const recovered = await state(page);
        assert.equal(recovered.van.speed, 0);
        assert([-28, 0, 28].includes(recovered.van.x) && [-28, 0, 28].includes(recovered.van.z));
        passed("WASD moves the actual van; Space brakes; R recovers to a real road junction", recovered.van);
        const routes =
        [
            [[-28, -14]],
            [[-28, -28], [0, -28], [0, -14]],
            [[0, -28], [28, -28], [28, -14]],
            [[28, 14]],
            [[28, 28], [0, 28], [0, 14]],
            [[0, 0], [-28, 0], [-28, 14]]
        ];
        for (let index = 0; index < routes.length; index++)
        {
            for (const [x, z] of routes[index]) await keyboardDrive(page, x, z);
            await page.keyboard.press("e");
            await page.waitForFunction(count => window.harborGame.getState().delivered === count, index + 1);
            await page.waitForFunction(count => document.querySelectorAll(".delivered").length === count, index + 1);
            const after = await state(page);
            assert.equal(after.cargo, 5 - index);
            assert.equal(await page.locator(".delivered").count(), index + 1);
            passed(`Actual keyboard road navigation and delivery ${index + 1}`, { destination: index + 1, cargo: after.cargo, delivered: after.delivered, score: after.score, van: after.van });
        }
        const won = await state(page);
        assert.equal(won.phase, "won");
        assert.equal(won.score, 600 + Math.floor(won.remaining) * 2);
        assert.equal(won.cargo, 0);
        assert.equal(won.best, won.score);
        assert(await page.getByRole("heading", { name: "You made the bay's day." }).isVisible());
        passed("Six deliveries win with exact time-bonus scoring and saved best", won);
        await overflow(page, "Desktop after full round");
        await page.screenshot({ path: path.join(checks, "desktop-win.png") });
        await page.getByRole("button", { name: "Start a new shift", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().phase === "playing");
        assert.equal((await state(page)).cargo, 0);
        assert.equal((await state(page)).score, 0);
        assert.equal((await state(page)).best, won.score);
        page.once("dialog", dialog => dialog.accept());
        await page.getByRole("button", { name: "Reset shift", exact: true }).click();
        await page.waitForTimeout(100);
        assert((await state(page)).remaining > 178);
        assert.equal((await state(page)).delivered, 0);
        passed("Result replay and confirmed reset clear round state but preserve best");
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForFunction(() => window.harborGame?.getState().phase === "ready");
        assert.equal((await state(page)).best, won.score);
        passed("Personal best survives real document reload");
        await page.getByRole("button", { name: "Start my shift", exact: true }).click();
        await page.waitForFunction(() => window.harborGame.getState().phase === "playing");
        await page.clock.install();
        await page.clock.fastForward(181000);
        await page.waitForFunction(() => window.harborGame.getState().phase === "timeout");
        assert.equal((await state(page)).remaining, 0);
        assert(await page.getByRole("heading", { name: "That's your shift, skipper." }).isVisible());
        passed("Real countdown reaches timeout and offers a replay", await state(page));
        await desktop.close();
        const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        await attach(mobile);
        const phone = await load(mobile);
        qa.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        await overflow(phone, "Mobile before play");
        await phone.screenshot({ path: qa.screenshots.mobile, fullPage: true });
        await phone.getByRole("button", { name: "Start my shift", exact: true }).tap();
        await phone.waitForFunction(() => window.harborGame.getState().phase === "playing");
        await phone.getByRole("button", { name: "Load parcels", exact: true }).tap();
        await phone.waitForFunction(() => window.harborGame.getState().cargo === 6);
        const phoneStart = await state(phone);
        const accel = phone.getByRole("button", { name: "Accelerate", exact: true });
        const rect = await accel.boundingBox();
        const cdp = await mobile.newCDPSession(phone);
        const hold = async (x, y, duration) =>
        {
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
            await phone.waitForTimeout(duration);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await phone.waitForTimeout(80);
        };
        await hold(rect.x + rect.width / 2, rect.y + rect.height / 2, 700);
        const brakeBox = await phone.getByRole("button", { name: "Brake", exact: true }).boundingBox();
        await hold(brakeBox.x + brakeBox.width / 2, brakeBox.y + brakeBox.height / 2, 400);
        const phoneMoved = await state(phone);
        assert(phoneMoved.van.z < phoneStart.van.z - 2);
        assert(Math.abs(phoneMoved.van.speed) < 0.1);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }] });
        await phone.waitForFunction(() => window.harborGame.getState().van.z < -9);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await hold(brakeBox.x + brakeBox.width / 2, brakeBox.y + brakeBox.height / 2, 400);
        await phone.getByRole("button", { name: "Deliver parcel", exact: true }).tap();
        await phone.waitForFunction(() => window.harborGame.getState().delivered === 1);
        assert.equal((await state(phone)).cargo, 5);
        assert.equal((await state(phone)).score, 100);
        passed("Mobile actual touch driving reaches the first doorway and delivers a parcel", await state(phone));
        const leftBox = await phone.getByRole("button", { name: "Steer left", exact: true }).boundingBox();
        await hold(leftBox.x + leftBox.width / 2, leftBox.y + leftBox.height / 2, 350);
        assert((await state(phone)).van.heading > phoneMoved.van.heading + 0.2);
        passed("Real mobile touch loads cargo, accelerates van, brakes and steers", { before: phoneStart.van, after: (await state(phone)).van });
        await phone.getByRole("button", { name: "Back to the road", exact: true }).tap();
        assert.equal((await state(phone)).van.speed, 0);
        await phone.getByRole("button", { name: "Pause shift", exact: true }).tap();
        await phone.waitForFunction(() => window.harborGame.getState().phase === "paused");
        const mobilePaused = await state(phone);
        await phone.waitForTimeout(200);
        assert.equal((await state(phone)).remaining, mobilePaused.remaining);
        await phone.getByRole("button", { name: "Back to the bay", exact: true }).tap();
        await phone.waitForFunction(() => window.harborGame.getState().phase === "playing");
        passed("Mobile recovery and pause/resume function without keyboard");
        await overflow(phone, "Mobile after touch interactions");
        await phone.screenshot({ path: path.join(checks, "mobile-playing.png"), fullPage: true });
        assert.equal(await phone.locator("html").getAttribute("lang"), "en");
        assert.equal(await phone.getByRole("link", { name: "Template by VibeFather", exact: false }).getAttribute("href"), "https://vibefather.ai/t/harbor-town-delivery-game");
        passed("English document and required VibeFather attribution retained");
        await mobile.close();
        assert.deepEqual(errors, []);
        passed("No HTTP, request, resource, console or page errors in either viewport", errors);
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
        await WorkspaceFiles.saveJson(qaFile, qa);
    }
}

async function finish()
{
    const qa = await WorkspaceFiles.json(qaFile);
    assert(qa.passed && qa.visualReviewed && qa.resourcesClosed && qa.previewVisuallyReviewed);
    const metadata = await WorkspaceFiles.json(metadataFile);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(qa.staticDigest, digest);
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    const input = hash(JSON.stringify([await WorkspaceFiles.text(job.file), await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))]));
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), input);
    const image = await fs.readFile(path.join(exported, "preview.png"));
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${hash(image)}`);
    assert.equal(await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, true), "preserved");
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await registerGeneratedPage(workspace, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const actual = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const entries = actual.pages[job.prompt].pages.filter(entry => entry.model === "GPT-6");
    assert.equal(entries.length, 1);
    assert.equal(entries[0].slug, slug);
    assert.equal(entries[0].enabled, false);
    assert.equal(entries[0].deployed, false);
    assert.deepEqual(entries[0].tags, metadata.tags);
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await WorkspaceFiles.saveJson(job.reportFile,
    {
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        output: folder,
        staticDir: exported,
        qaFile,
        screenshots: qa.screenshots,
        previewFile: path.join(exported, "preview.png"),
        tests: { passed: qa.passed, count: qa.tests.length, assertions: qa.tests, errors: qa.errors, viewports: qa.viewports, staticDigest: digest, inputFingerprint: input, previewFingerprint: `${digest} ${hash(image)}` },
        visual: { reviewed: qa.visualReviewed, previewReviewed: qa.previewVisuallyReviewed, evidence: qa.visualEvidence },
        registration: { unique: true, enabled: entries[0].enabled, deployed: entries[0].deployed, slug, title, preservedExistingEdits: true },
        limitations: ["按授权采用无构建 HTML/CSS/JavaScript 浏览器 ES 模块，未使用 Vite/TypeScript 编译流程。", "原始文件仅包含公开 brief；未访问付费内容，采用本地原创低多边形场景，不冒充原版演示。", "需要 WebGL2；碰撞采用简化包围盒，成绩只在设备本地保存。", "未构建、未汇集、未部署。"],
        blocker: null,
        resourcesClosed: true,
        summary: "已完成可实际驾驶、装载与六站配送的 3D 港镇游戏；键盘及真实触屏操作、计分胜利、超时、暂停恢复和重置均经浏览器验证。桌面/移动截图及真实预览已打开审阅，仅登记为禁用，未发布。"
    });
    console.log(JSON.stringify({ status: "completed", metadata, registration: entries[0], reportFile: job.reportFile }));
}
