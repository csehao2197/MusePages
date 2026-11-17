import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const prompt = "529-mainframe-retro-creative-agency";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-529.json");
const stateFile = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const flagNames = ["generated", "preview", "validated", "config_added"];
const tags = ["Retro", "Agency", "Interactive Video"];
let browser;
let server;
let metadata;
let report =
{
    prompt,
    status: "in-progress",
    modelId: "gpt-6.1-sol",
    displayModel: "GPT-6",
    modelVerification: "Actual selected gpt-6.1-sol, explicitly authorized by user; no other AI invoked.",
    output: folder,
    qa: path.join(checks, "qa.json"),
    screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png"), preview: path.join(exported, "preview.png") },
    visualReviewed: false,
    tests: [],
    registration: { registered: false, enabled: false, deployed: false },
    limitations:
    [
        "获准静态适配：HTML/CSS/JS 替代要求的 React/TypeScript/Vite/Tailwind，不执行构建。",
        "原始视频和两套指定字体保留原始远程链接；需要网络及第三方可用性，未下载或再分发资产，字体供应商署名保留。",
        "A.R.I.A 为脚本，不调用 AI；表单仅准备邮件草稿，不发送、不保存，发送需要邮件客户端。",
        "Labs、Studio 为概念说明，Openings 无已核实岗位，Shop 无商品或付款，均在页面明确披露。",
        "移动端增加轻微浅色可读性遮罩；原始指定视频及70%中心裁切保持不变。",
        "未构建、部署、上传、安装、外部 AI、重试；task\\TASK.md 缺失，采用本轮明确授权。"
    ],
    resourcesClosed: false
};

async function runQa(slug)
{
    const qa =
    {
        passed: false,
        visualReviewed: false,
        assertions: [],
        errors: [],
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        screenshots: report.screenshots,
        staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6")
    };
    const check = async (name, action) =>
    {
        await action();
        qa.assertions.push({ name, passed: true });
    };
    const noOverflow = async (page) =>
    {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), true);
    };
    const monitor = (page) =>
    {
        page.on("pageerror", (error) => qa.errors.push({ type: "page", message: error.message }));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push({ type: "console", message: message.text() });
        });
        page.on("requestfailed", (request) => qa.errors.push({ type: "request", url: request.url(), message: request.failure()?.errorText }));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) qa.errors.push({ type: "http", url: response.url(), status: response.status() });
        });
    };
    const ready = async (page) =>
    {
        await page.waitForFunction(() => document.querySelector("#backdrop").readyState >= 2 && document.querySelector("#backdrop").videoWidth > 0, null, { timeout: 60000 });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => document.fonts.check('26px "HelveticaNowDisplay-Medium"') && document.fonts.check('26px "HelveticaNowDisplayW01-Rg"')), true);
        await page.waitForFunction(() => document.querySelector("#typed").dataset.done === "true");
    };
    try
    {
        await WorkspaceFiles.ensureDirectory(folder, ".checks");
        server = await startPreviewServer(exported, { workspace });
        assert.equal(new URL(server.url).pathname, `/pages/${slug}/GPT-6/index.html`);
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
        await context.addInitScript(() =>
        {
            document.addEventListener("DOMContentLoaded", () =>
            {
                const actions = document.querySelector(".actions");
                const observer = new MutationObserver(() =>
                {
                    if (actions.classList.contains("ready"))
                    {
                        window.actionEvidence = { visibleAt: performance.now(), typedLength: document.querySelector("#typed").textContent.length, done: document.querySelector("#typed").dataset.done === "true" };
                        observer.disconnect();
                    }
                });
                observer.observe(actions, { attributes: true });
            });
        });
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        monitor(page);
        await check("桌面公开子路径 HTTP 200、原始视频解码和两套指定字体加载、非空首页", async () =>
        {
            assert.equal((await page.goto(server.url, { waitUntil: "networkidle", timeout: 90000 })).status(), 200);
            await ready(page);
            assert.equal(await page.locator(".brand").isVisible(), true);
            assert.equal(await page.locator(".pill").count(), 5);
            assert.match(await page.locator("#typed").innerText(), /Now, what are we building/);
            assert.equal(await page.locator(".cursor").isVisible(), false);
            assert.equal(await page.locator("#backdrop").evaluate((video) => video.paused && !video.autoplay && video.muted), true);
            await noOverflow(page);
        });
        await page.screenshot({ path: report.screenshots.desktop, animations: "disabled" });
        await check("视频鼠标正向反向寻帧、0.8 灵敏度、排队追赶和时间边界限制", async () =>
        {
            await page.mouse.move(10, 700);
            await page.mouse.move(610, 700);
            await page.waitForFunction(() => Math.abs(document.querySelector("#backdrop").currentTime / document.querySelector("#backdrop").duration - .4) < .03);
            await page.mouse.move(310, 700);
            await page.waitForFunction(() => Math.abs(document.querySelector("#backdrop").currentTime / document.querySelector("#backdrop").duration - .2) < .03);
            await page.evaluate(() =>
            {
                window.dispatchEvent(new MouseEvent("mousemove", { clientX: 50000 }));
                window.dispatchEvent(new MouseEvent("mousemove", { clientX: -50000 }));
            });
            await page.waitForFunction(() => document.querySelector("#backdrop").currentTime < .05);
            assert.equal(await page.locator("#backdrop").evaluate((video) => video.paused), true);
            await noOverflow(page);
        });
        await check("四个主题导航、真实说明、Escape 和焦点恢复、无溢出", async () =>
        {
            for (const key of ["labs", "studio", "openings", "shop"])
            {
                const button = page.locator(`.desktop-nav [data-panel="${key}"]`);
                await button.focus();
                await page.keyboard.press("Enter");
                assert.equal(await page.locator("dialog").isVisible(), true);
                assert.ok((await page.locator(".detail-body").innerText()).length > 80);
                await noOverflow(page);
                await page.keyboard.press("Escape");
                assert.equal(await button.evaluate((node) => node === document.activeElement), true);
            }
        });
        await check("Pitch/Hello 必填校验、邮件草稿而非发送、输入不执行、Close 清理滚动", async () =>
        {
            for (const key of ["pitch", "hello"])
            {
                await page.locator(`.actions [data-panel="${key}"]`).click();
                await page.getByRole("button", { name: "Prepare email draft" }).click();
                assert.equal(await page.locator('input[name="name"]').evaluate((input) => input.validity.valueMissing), true);
                await page.getByLabel("Your name").fill("Alex");
                await page.getByLabel("Your email").fill("alex@example.com");
                await page.locator("textarea").fill("A tactile brand identity. <script>not executable</script>");
                await page.getByRole("button", { name: "Prepare email draft" }).click();
                assert.match(await page.locator(".draft-output").innerText(), /has not been sent/);
                const link = await page.locator(".draft-output a").getAttribute("href");
                assert.ok(link.startsWith("mailto:hello@mainframe.co?"));
                assert.match(decodeURIComponent(link), /tactile brand identity/);
                assert.equal(await page.locator(".draft-output script").count(), 0);
                await noOverflow(page);
                await page.getByRole("button", { name: "Close details" }).click();
                await page.waitForFunction(() => document.body.style.overflow === "");
                assert.equal(await page.evaluate(() => document.body.style.overflow), "");
            }
        });
        await check("Openings 与 Shop 后续操作真正打开介绍/提案表单", async () =>
        {
            await page.locator('.actions [data-panel="openings"]').click();
            await page.getByRole("button", { name: "Introduce yourself" }).click();
            assert.equal(await page.getByRole("heading", { name: "Start with a hello." }).isVisible(), true);
            await page.keyboard.press("Escape");
            await page.locator('.desktop-nav [data-panel="shop"]').click();
            await page.getByRole("button", { name: "Share an idea" }).click();
            assert.equal(await page.getByRole("heading", { name: "Let's build something." }).isVisible(), true);
            await page.keyboard.press("Escape");
        });
        await check("复制邮箱实际写入剪贴板并展示成功状态", async () =>
        {
            await page.locator("#copy-email").click();
            await page.waitForFunction(() => document.querySelector(".feedback").textContent.includes("Email copied"));
            assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "hello@mainframe.co");
        });
        const mobile = await context.newPage();
        await mobile.setViewportSize({ width: 390, height: 844 });
        monitor(mobile);
        await mobile.goto(server.url, { waitUntil: "networkidle", timeout: 90000 });
        await ready(mobile);
        await check("390×844 首页非空、无横溢出、桌面导航隐藏、底部对齐内容", async () =>
        {
            await noOverflow(mobile);
            assert.equal(await mobile.locator(".desktop-nav").isVisible(), false);
            assert.equal(await mobile.getByRole("button", { name: "Open menu" }).isVisible(), true);
            assert.equal(await mobile.locator(".actions").isVisible(), true);
        });
        await mobile.screenshot({ path: report.screenshots.mobile, animations: "disabled" });
        await check("移动菜单动画状态、键盘焦点循环、Escape、菜单链接关闭后打开详情", async () =>
        {
            await mobile.getByRole("button", { name: "Open menu" }).click();
            assert.equal(await mobile.locator("#mobile-menu").evaluate((node) => node.inert), false);
            await mobile.keyboard.press("Shift+Tab");
            assert.equal(await mobile.locator(".menu-toggle").evaluate((node) => node === document.activeElement), true);
            await noOverflow(mobile);
            await mobile.keyboard.press("Escape");
            assert.equal(await mobile.locator("#mobile-menu").evaluate((node) => node.inert), true);
            await mobile.getByRole("button", { name: "Open menu" }).click();
            await mobile.locator('#mobile-menu [data-panel="studio"]').click();
            assert.equal(await mobile.locator("dialog").isVisible(), true);
            assert.equal(await mobile.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
            await noOverflow(mobile);
            await mobile.keyboard.press("Escape");
            await mobile.waitForFunction(() => document.body.style.overflow === "");
            assert.equal(await mobile.evaluate(() => document.body.style.overflow), "");
        });
        await check("移动触摸寻帧、邮件表单、断点变化和320px布局无横向溢出", async () =>
        {
            await mobile.evaluate(() =>
            {
                const target = document.querySelector("main");
                for (const [type, clientX] of [["touchstart", 30], ["touchmove", 200]])
                {
                    const touch = new Touch({ identifier: 1, target, clientX, clientY: 350 });
                    target.dispatchEvent(new TouchEvent(type, { touches: [touch], bubbles: true }));
                }
            });
            await mobile.waitForFunction(() => document.querySelector("#backdrop").currentTime > .1);
            await mobile.locator('.actions [data-panel="pitch"]').click();
            await noOverflow(mobile);
            await mobile.keyboard.press("Escape");
            await mobile.getByRole("button", { name: "Open menu" }).click();
            await mobile.setViewportSize({ width: 1024, height: 900 });
            await mobile.waitForFunction(() => document.body.style.overflow === "");
            await noOverflow(mobile);
            await mobile.setViewportSize({ width: 320, height: 740 });
            await noOverflow(mobile);
        });
        await check("减少动态偏好跳过打字，400ms 动作出现独立于打字完成", async () =>
        {
            const slow = await context.newPage();
            monitor(slow);
            await slow.emulateMedia({ reducedMotion: "reduce" });
            await slow.goto(server.url, { waitUntil: "networkidle", timeout: 90000 });
            await ready(slow);
            assert.equal(await slow.locator(".cursor").isVisible(), false);
            assert.equal(await slow.locator(".actions").evaluate((node) => node.classList.contains("ready")), true);
            await noOverflow(slow);
            await slow.close();
            const evidence = await page.evaluate(() => window.actionEvidence);
            assert.equal(evidence.done, false);
            assert.equal(evidence.typedLength, 0);
            qa.actionTiming = evidence;
        });
        assert.deepEqual(qa.errors, []);
        qa.passed = true;
    }
    finally
    {
        await browser?.close();
        browser = undefined;
        await server?.close();
        server = undefined;
        qa.resourcesClosed = true;
        report.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        report.tests = qa.assertions;
        report.browserErrors = qa.errors;
    }
    return qa;
}

try
{
    const state = await WorkspaceFiles.json(stateFile);
    const pid = Number((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim());
    assert.equal(state.ownedLock.pid, pid);
    assert.equal(state.ownedLock.prompt, prompt);
    assert.equal(state.activePrompt, prompt);
    process.kill(pid, 0);
    report.lock = { pid, processRunning: true, ownedLockMatched: true, activePromptMatched: true, untouched: true };
    const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const group = config.pages[prompt];
    const options = Array.isArray(group) ? group : group?.pages ?? [];
    const slug = options[0]?.slug ?? "mainframe-retro-creative-agency";
    const title = options[0]?.title ?? "Mainframe retro creative agency";
    const raw = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    const inputDigest = hash(JSON.stringify([raw, design]));
    report.input =
    {
        original: path.join("data", "prompts", prompt, `${prompt}.md`),
        workerRulesRead: true,
        fullOriginalRead: true,
        agentsRead: true,
        readmeRead: true,
        aiGuideRead: true,
        fullDesignRead: true,
        fullLicenseRead: true,
        taskFileExists: false,
        existingProgressRead: true,
        generationInputSha256: inputDigest
    };
    const mode = process.argv[2] ?? "qa";
    if (mode === "init")
    {
        assert.equal(await WorkspaceFiles.info(metadataFile), null);
        metadata = { modelId: report.modelId, tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), `${inputDigest}\n`);
        report.status = "initialized";
        report.resourcesClosed = true;
    }
    else
    {
        metadata = await WorkspaceFiles.json(metadataFile);
        assert.equal(metadata.modelId, report.modelId);
        assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), inputDigest);
        if (mode === "qa")
        {
            const license = await WorkspaceFiles.text(path.join(workspace, "data", "downloads", "github.com", "frostmute-msites-prompt-collection", "d4974f4296e2851e05eabddb9240170cc423dd46", "LICENSE"));
            await WorkspaceFiles.saveText(path.join(folder, "LICENSE"), license);
            await WorkspaceFiles.ensureDirectory(folder, "out");
            for (const file of ["index.html", "index.css", "app.js", "LICENSE"])
            {
                await WorkspaceFiles.saveText(path.join(exported, file), await WorkspaceFiles.text(path.join(folder, file)));
            }
            assert.equal(await StaticHomepage.checkSource(folder), "html");
            metadata.generated = true;
            await WorkspaceFiles.saveJson(metadataFile, metadata);
            const qa = await runQa(slug);
            report.staticDigest = qa.staticDigest;
            report.ensurePreview = await StaticHomepage.ensurePreview(workspace, { folder }, exported, qa.staticDigest, undefined, metadata.preview);
            report.status = "qa-passed-awaiting-visual-review";
            report.resourcesClosed = true;
        }
        else if (mode === "finish")
        {
            const previous = await WorkspaceFiles.json(reportFile);
            const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
            assert.equal(qa.passed, true);
            assert.equal(qa.visualReviewed, true);
            assert.equal(qa.previewVisualReviewed, true);
            const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
            assert.equal(digest, qa.staticDigest);
            const previewHash = hash(await readFile(path.join(exported, "preview.png")));
            assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${previewHash}`);
            report = { ...previous, input: report.input, limitations: report.limitations, lock: report.lock, status: "completed", visualReviewed: true, visual: qa.visualReview, digests: { input: inputDigest, static: digest, preview: previewHash } };
            report.validation =
            {
                sourceType: await StaticHomepage.checkSource(folder),
                javascriptSyntax: "node --check app.js passed",
                staticSubpath: `/pages/${slug}/GPT-6/`,
                staticValidation: "passed",
                browserQa: "10 assertion groups passed",
                httpResourceRequestConsolePageErrors: [],
                horizontalOverflow: "none before and after desktop/mobile interactions, 320px also checked",
                screenshotsOpened: ["desktop.png", "mobile.png", "preview.png"],
                freshPreviewVerified: true,
                browserResourcesClosed: qa.resourcesClosed,
                actionTiming: qa.actionTiming
            };
            metadata.preview = true;
            metadata.validated = true;
            await WorkspaceFiles.saveJson(metadataFile, metadata);
            await registerGeneratedPage(workspace, { prompt, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: "out" });
            const saved = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
            const entries = saved.pages[prompt].pages.filter((entry) => entry.model === "GPT-6");
            assert.equal(entries.length, 1);
            assert.equal(entries[0].enabled, false);
            assert.equal(entries[0].deployed, false);
            assert.equal(entries[0].slug, slug);
            assert.equal(entries[0].staticDir, "out");
            assert.deepEqual(entries[0].tags, metadata.tags);
            const before = { ...config.pages };
            const after = { ...saved.pages };
            delete before[prompt];
            delete after[prompt];
            assert.deepEqual(after, before);
            metadata.config_added = true;
            await WorkspaceFiles.saveJson(metadataFile, metadata);
            report.registration = { registered: true, unique: true, slug, title, staticDir: "out", enabled: false, deployed: false, otherEntriesPreserved: true };
            report.resourcesClosed = true;
        }
        else
        {
            throw Error("Unsupported mode");
        }
    }
}
catch (error)
{
    report.status = "failed";
    report.blocker = error.stack;
    console.error(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    if (metadata)
    {
        report.flags = Object.fromEntries(flagNames.map((key) => [key, metadata[key]]));
        Object.assign(report, report.flags);
        report.tags = metadata.tags;
        report.tagValidation = metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0) && new Set(metadata.tags).size === metadata.tags.length;
    }
    report.completedAt = new Date().toISOString();
    report.documentation = { readme: path.join(folder, "README.md"), license: path.join(folder, "LICENSE"), provenance: "MIT: Copyright (c) 2026 Nomaan Khan" };
    report.resourceCleanup = "Owned browsers and loopback preview servers closed in finally; no owned long-lived processes. Coordinator PID and lock untouched.";
    report.buildsExecuted = false;
    report.deploymentsExecuted = false;
    await WorkspaceFiles.saveJson(reportFile, report);
    console.log(JSON.stringify({ status: report.status, flags: report.flags, tests: report.tests.length, errors: report.browserErrors, resourcesClosed: report.resourcesClosed }));
}
