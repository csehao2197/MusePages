import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile, copyFile, readdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage as S } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "623-arcade-game-studio-landing-page");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await W.json(job.stateFile);
const owner = Number((await readFile(job.promptLock, "utf8")).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, owner);
process.kill(owner, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const qaFile = path.join(checks, "qa.json");
const config = await W.json(path.join(root, "deploy", "config.json"));
const shared = config.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug ?? "arcade-game-studio-landing-page";
const title = shared?.title ?? "Arcade Game Studio Landing Page";
const tags = ["Arcade", "Pixel Art", "Indie Games"];
const phase = process.argv[2];
await mkdir(checks, { recursive: true });

if (phase === "prepare")
{
    assert.equal(await W.info(metadataFile), null);
    await W.saveJson(metadataFile, { modelId: job.modelId, tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false });
    await mkdir(path.join(folder, "assets"), { recursive: true });
    await mkdir(path.join(folder, "licenses"), { recursive: true });
    const records = [];
    for (const [family, filename, upstream] of [
        ["press-start-2p", "press-start-2p", "pressstart2p"],
        ["vt323", "vt323", "vt323"]
    ])
    {
        const fontUrl = `https://cdn.jsdelivr.net/npm/@fontsource/${family}/files/${family}-latin-400-normal.woff2`;
        const response = await fetch(fontUrl);
        assert(response.ok, `Font HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        assert.equal(buffer.subarray(0, 4).toString(), "wOF2");
        await writeFile(path.join(folder, "assets", `${filename}.woff2`), buffer);
        const licenseUrl = `https://raw.githubusercontent.com/google/fonts/main/ofl/${upstream}/OFL.txt`;
        const licenseResponse = await fetch(licenseUrl);
        assert(licenseResponse.ok);
        const license = await licenseResponse.text();
        assert(license.includes("SIL OPEN FONT LICENSE"));
        await W.saveText(path.join(folder, "licenses", `${filename}.txt`), license);
        records.push({ fontUrl, licenseUrl, bytes: buffer.length, sha256: createHash("sha256").update(buffer).digest("hex") });
    }
    await W.saveJson(path.join(checks, "assets.json"), records);
    await mkdir(exported, { recursive: true });
    await syncPublic();
    assert.equal(await S.checkSource(folder), "html");
    const metadata = await W.json(metadataFile);
    metadata.generated = true;
    await W.saveJson(metadataFile, metadata);
    const raw = await readFile(job.file, "utf8");
    const design = await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await W.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
    console.log(JSON.stringify({ source: "passed", staticDigest: await S.validateStaticOutput(exported, slug, "GPT-6"), records }));
}
else if (phase === "sync")
{
    await syncPublic();
    console.log(await S.validateStaticOutput(exported, slug, "GPT-6"));
}
else if (phase === "qa")
{
    const qa =
    {
        passed: false,
        sourceCheck: await S.checkSource(folder),
        staticDigest: await S.validateStaticOutput(exported, slug, "GPT-6"),
        tests: [],
        errors: [],
        viewports: [],
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
        visualReviewed: false,
        resourcesClosed: false
    };
    let server;
    let browser;
    try
    {
        server = await startPreviewServer(exported, { workspace: root });
        assert(new URL(server.url).pathname.startsWith(`/pages/${slug}/GPT-6/`));
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
        const page = await context.newPage();
        listen(page, qa);
        assert.equal((await page.goto(server.url)).status(), 200);
        await page.waitForSelector(".cartridge");
        await page.evaluate(() => document.fonts.ready);
        await page.locator("#game").waitFor();
        await overflow(page);
        assert(await page.locator("h1").isVisible());
        assert.equal(await page.locator("#game").getAttribute("width"), "320");
        assert.equal(await page.locator("#game").getAttribute("height"), "180");
        assert.equal(await page.locator("#game").getAttribute("data-state"), "attract");
        assert.equal(await page.locator("audio, video").count(), 0);
        assert(await page.evaluate(() => document.fonts.check('8px "Press Start 2P"')));
        await page.screenshot({ path: qa.screenshots.desktop, fullPage: true });
        qa.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
        qa.tests.push("Desktop HTTP 200, actual final public subpath, nonblank heading, local fonts loaded, 320×180 canvas, no audio, no initial overflow");

        await page.locator("#start-game").click();
        await expectState(page, "playing");
        await page.keyboard.press("Space");
        await page.waitForFunction(() => Number(document.querySelector("#game").dataset.y) < 140);
        await page.waitForTimeout(850);
        await page.keyboard.down("ArrowDown");
        assert.equal(await page.locator("#game").getAttribute("data-duck"), "true");
        await page.keyboard.up("ArrowDown");
        assert.equal(await page.locator("#game").getAttribute("data-duck"), "false");
        await page.keyboard.press("p");
        await expectState(page, "paused");
        const pausedScore = await page.locator("#game").getAttribute("data-score");
        await page.waitForTimeout(350);
        assert.equal(await page.locator("#game").getAttribute("data-score"), pausedScore);
        await page.keyboard.press("p");
        await expectState(page, "playing");
        qa.tests.push("Real keyboard start/jump (y changes), held duck/release, pause freezes score, resume");

        let jumped = false;
        let ducked = false;
        let firstCleared = false;
        let secondCleared = false;
        const startedAt = Date.now();
        while (Date.now() - startedAt < 12000 && !secondCleared)
        {
            const data = await page.locator("#game").evaluate((canvas) => ({ ...canvas.dataset }));
            assert.equal(data.state, "playing", `Runner must survive well-timed controls: ${JSON.stringify(data)}`);
            const obstacles = JSON.parse(data.obstacles || "[]");
            const first = obstacles.find((obstacle) => obstacle.type === "chimney");
            const second = obstacles.find((obstacle) => obstacle.type === "lantern");
            if (first && first.x < 94 && first.x > 63 && !jumped)
            {
                await page.keyboard.press("Space");
                jumped = true;
            }
            if (first && first.x < 25) firstCleared = true;
            if (second && second.x < 105 && second.x > 63 && !ducked)
            {
                await page.keyboard.down("ArrowDown");
                ducked = true;
            }
            if (second && second.x < 25)
            {
                secondCleared = true;
                await page.keyboard.up("ArrowDown");
            }
            await page.waitForTimeout(35);
        }
        assert(jumped && ducked && firstCleared && secondCleared, "Actually jump chimney and duck lantern");
        assert(Number(await page.locator("#game").getAttribute("data-speed")) > 82);
        await page.waitForFunction(() => document.querySelector("#game").dataset.state === "game-over", { timeout: 15000 });
        const finalScore = Number(await page.locator("#game").getAttribute("data-score"));
        assert(finalScore > 50);
        qa.tests.push(`Survived real chimney collision window by jumping and low lantern by ducking; speed increased; unavoided later collision ended run at ${finalScore}`);
        await page.locator('[data-action="save"]').click();
        await page.locator("#initials").fill("abc");
        await page.locator("#score-form").evaluate((form) => form.requestSubmit());
        assert((await page.locator("#scores").innerText()).includes("ABC"));
        await page.reload();
        await page.waitForSelector(".cartridge");
        assert((await page.locator("#scores").innerText()).includes("ABC"));
        await page.locator("#reset-scores").click();
        await page.locator("#cancel-reset").click();
        assert((await page.locator("#scores").innerText()).includes("ABC"));
        await page.locator("#reset-scores").click();
        await page.locator("#confirm-reset").click();
        assert(!(await page.locator("#scores").innerText()).includes("ABC"));
        qa.tests.push("Initials normalized to ABC, actual earned score persisted through reload; reset cancellation preserves and confirmation clears");

        await page.locator('[data-game="tide"]').click();
        assert(await page.locator("#game-detail").isVisible());
        assert((await page.locator("#detail-content").innerText()).includes("No playable build"));
        await page.keyboard.press("Escape");
        assert(!(await page.locator("#game-detail").isVisible()));
        await page.locator('[data-game="dash"]').click();
        await page.locator("#detail-content button").click();
        await expectState(page, "playing");
        await page.locator("#pause-game").click();
        await expectState(page, "paused");
        await page.locator("#email").fill("player@example.com");
        await page.locator('#newsletter-form button[type="submit"]').click();
        assert((await page.locator("#newsletter-status").innerText()).includes("no subscription"));
        await overflow(page);
        qa.tests.push("Cartridge details and Escape, playable cartridge launches runner, explicit pause, truthful local newsletter feedback; no post-interaction overflow");
        await page.evaluate(() => localStorage.setItem("lanternbyte-games:lantern-dash:v1", JSON.stringify([
            { initials: "AAA", score: 40 }, { initials: "BBB", score: 70 }, { initials: "CCC", score: 20 },
            { initials: "DDD", score: 90 }, { initials: "EEE", score: 10 }, { initials: "FFF", score: 60 },
            { initials: "<X>", score: 999 }, { initials: "BAD", score: -3 }
        ])));
        await page.reload();
        await page.waitForSelector(".cartridge");
        const ranked = await page.locator("#scores li").allTextContents();
        assert.equal(ranked.length, 5);
        assert(ranked[0].includes("DDD"));
        assert(ranked[1].includes("BBB"));
        assert(ranked[4].includes("CCC"));
        assert(!ranked.join("").includes("BAD") && !ranked.join("").includes("EEE"));
        await page.locator("#reset-scores").click();
        await page.locator("#confirm-reset").click();
        await overflow(page);
        qa.tests.push("Isolated localStorage fixtures: top-five cap, descending score order and malformed/negative-entry rejection");

        const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        const phone = await mobile.newPage();
        listen(phone, qa);
        assert.equal((await phone.goto(server.url)).status(), 200);
        await phone.waitForSelector(".cartridge");
        await phone.evaluate(() => document.fonts.ready);
        await overflow(phone);
        await phone.screenshot({ path: qa.screenshots.mobile, fullPage: true });
        qa.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        await phone.locator("#start-game").tap();
        await expectState(phone, "playing");
        await phone.locator("#jump").tap();
        await phone.waitForFunction(() => Number(document.querySelector("#game").dataset.y) < 140);
        await phone.waitForTimeout(850);
        await phone.locator("#duck").scrollIntoViewIfNeeded();
        const box = await phone.locator("#duck").boundingBox();
        const touch = await mobile.newCDPSession(phone);
        await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
        assert.equal(await phone.locator("#game").getAttribute("data-duck"), "true");
        await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.equal(await phone.locator("#game").getAttribute("data-duck"), "false");
        assert(box.width >= 44 && box.height >= 44);
        await phone.locator("#pause-game").tap();
        await expectState(phone, "paused");
        await phone.locator("#pause-game").tap();
        await expectState(phone, "playing");
        await phone.locator("#pause-game").tap();
        await phone.locator('[data-game="post"]').tap();
        assert(await phone.locator("#game-detail").isVisible());
        await phone.locator(".close-dialog").tap();
        await overflow(phone);
        qa.tests.push("390×844 real touch start and A jump, held B pointer duck/release, 44px touch targets, mobile pause/resume, cartridge modal, no overflow before/after");

        const denied = await browser.newContext({ reducedMotion: "reduce" });
        await denied.addInitScript(() =>
        {
            Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
        });
        const privatePage = await denied.newPage();
        listen(privatePage, qa);
        await privatePage.goto(server.url);
        await privatePage.waitForSelector(".cartridge");
        assert((await privatePage.locator("#storage-note").innerText()).includes("STORAGE UNAVAILABLE"));
        await privatePage.locator("#reset-scores").click();
        await privatePage.locator("#confirm-reset").click();
        assert.equal(await privatePage.locator(".ticker > div").evaluate((node) => getComputedStyle(node).animationName), "none");
        await privatePage.locator("#start-game").click();
        await expectState(privatePage, "playing");
        await privatePage.waitForFunction(() => document.querySelector("#game").dataset.state === "game-over", { timeout: 12000 });
        await privatePage.locator('[data-action="save"]').click();
        await privatePage.locator("#initials").fill("MEM");
        await privatePage.locator("#score-form").evaluate((form) => form.requestSubmit());
        assert((await privatePage.locator("#scores").innerText()).includes("MEM"));
        qa.tests.push("Storage-denied browser: read/write guarded, real earned score saved in memory, reset safe; reduced-motion ticker disabled while core game remains playable");
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
        await browser?.close();
        await server?.close();
        qa.resourcesClosed = true;
        await W.saveJson(qaFile, qa);
        console.log(JSON.stringify(qa));
    }
}
else if (phase === "preview")
{
    const qa = await W.json(qaFile);
    assert(qa.passed);
    const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
    const action = await S.ensurePreview(root, { folder }, exported, digest, undefined, false);
    await W.saveJson(path.join(checks, "preview.json"), { action, staticDigest: digest, viewport: { width: 1200, height: 900, deviceScaleFactor: 1 }, resourcesClosed: true });
    console.log(action);
}
else if (phase === "finish")
{
    const qa = await W.json(qaFile);
    assert(qa.passed && qa.visualReviewed && qa.resourcesClosed);
    const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    assert.equal(await S.ensurePreview(root, { folder }, exported, digest, undefined, true), "preserved");
    const metadata = await W.json(metadataFile);
    metadata.preview = true;
    metadata.validated = true;
    await W.saveJson(metadataFile, metadata);
    await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, tags, staticDir: "out" });
    const after = await W.json(path.join(root, "deploy", "config.json"));
    const options = after.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
    assert.equal(options.length, 1);
    assert.equal(options[0].enabled, false);
    assert.equal(options[0].deployed, false);
    assert.deepEqual(options[0].tags, tags);
    metadata.config_added = true;
    await W.saveJson(metadataFile, metadata);
    await W.saveJson(job.reportFile,
    {
        prompt: job.prompt, status: "completed", modelId: job.modelId, display_model_name: "GPT-6", tags,
        runId: job.runId, completedAt: new Date().toISOString(),
        input: job.file, design: path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"),
        provenance: job.provenance, licenseFile: path.join(root, job.provenance.license_file),
        reportFile: job.reportFile,
        inputFingerprint: (await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim(),
        previewFingerprint: (await readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim(),
        generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added,
        output: folder, staticDir: exported, qa: qaFile, screenshots: qa.screenshots,
        previewFile: path.join(exported, "preview.png"), sourceCheck: "passed", staticDigest: digest,
        tests: ["1200×900 桌面与 390×844 触屏页面均正常、无横向溢出", "真实键盘跳过烟囱、下蹲通过低空灯笼，速度增加；未躲避后碰撞结束", "暂停冻结分数、恢复继续；真实得分三字母录入并刷新持久化；重置确认与取消有效", "前五名截取和排序、异常记录过滤通过", "移动真实触控跳跃/按住下蹲、暂停恢复和弹窗通过", "禁用存储时得分转内存；减少动态效果设置有效", "游戏详情与诚实的本地订阅反馈通过；无请求、控制台或页面错误"],
        testEvidence: qa.tests, viewports: qa.viewports, errors: qa.errors, visualReviewed: qa.visualReviewed, visualEvidence: qa.visualEvidence,
        registration: { unique: true, ...options[0] },
        limitations: ["按授权采用无构建原生 ES 模块，未使用 Vite/TypeScript 构建", "仅基于原始公开需求独立设计；未访问付费演示", "虚构工作室；另外两款游戏是明确标注的概念", "订阅仅本地反馈、不发送邮件；分数仅浏览器本地或内存保存", "未执行构建、集合发布或部署"],
        blocker: null, resourcesClosed: true, lockOwnerUntouched: owner,
        resolvedFindings: ["初次自动游玩起跳过早，已调整测试操作时机并实测成功越障", "控制面板透视使 44px 按钮实际触控框略小，已改为 46px 并重新验证"],
        summary: "完成原创像素街机首页与真实可玩的跳跃/下蹲跑酷；桌面、移动、键盘、存储禁用及视觉检查通过，预览和摘要有效，已唯一登记且默认禁用、未部署。"
    });
    console.log(JSON.stringify({ metadata, registration: options[0], report: job.reportFile }));
}
else
{
    throw Error("Expected prepare, sync, qa, preview or finish");
}

async function syncPublic()
{
    for (const filename of ["index.html", "main.js", "content.js", "scores.js", "pixelart.js"])
    {
        await copyFile(path.join(folder, filename), path.join(exported, filename));
    }
    for (const dirname of ["assets", "styles", "game", "licenses"])
    {
        await mkdir(path.join(exported, dirname), { recursive: true });
        for (const file of await readdir(path.join(folder, dirname)))
        {
            await copyFile(path.join(folder, dirname, file), path.join(exported, dirname, file));
        }
    }
    await copyFile(path.join(folder, "LICENSE.txt"), path.join(exported, "LICENSE.txt"));
}
async function overflow(page)
{
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "No horizontal page overflow");
}
async function expectState(page, value)
{
    await page.waitForFunction((wanted) => document.querySelector("#game").dataset.state === wanted, value);
}
function listen(page, qa)
{
    page.on("pageerror", (error) => qa.errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") qa.errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => qa.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()} ${response.url()}`);
    });
}
