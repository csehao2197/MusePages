import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Atom } from "lucide-react";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const prompt = "527-kineticforge-digital-studio";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-527.json");
const stateFile = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const flags = (metadata) => Object.fromEntries(["generated", "preview", "validated", "config_added"].map((name) => [name, metadata?.[name] ?? null]));
let browser;
let server;
let ownedLock;
let resourcesClosed = false;
let report =
{
    prompt,
    status: "in-progress",
    modelId: "gpt-6.1-sol",
    publicModel: "GPT-6",
    output: folder,
    qa: path.join(checks, "qa.json"),
    screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
    visualReviewed: false,
    tests: [],
    registration: { registered: false, enabled: false, deployed: false },
    limitations:
    [
        "获准静态适配：HTML/CSS/JS 替代 React/TypeScript/Vite/Tailwind 运行时；Atom 由安装的 lucide-react 通过 React 静态渲染获得。",
        "视频与字体保留原始远程链接，需要网络及第三方主机可用性；未复制视频、字体或声称拥有许可。",
        "伙伴/历史文案来自需求，未验证商业关联；项目为明确标识的示意概念。",
        "联系表单仅在浏览器准备摘要，不发送、不持久保存；无后端。",
        "未执行构建、部署、上传、外部 AI、安装或重试；task\\TASK.md 当前不存在，具体范围采用用户本轮明确授权。"
    ],
    resourcesClosed: false
};

async function verifyLock()
{
    const state = await WorkspaceFiles.json(stateFile);
    const lockPid = Number((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim());
    assert.equal(state.ownedLock.prompt, prompt);
    assert.equal(state.ownedLock.pid, lockPid);
    process.kill(lockPid, 0);
    ownedLock = { pid: lockPid, ownedLockMatched: true, processRunning: true, untouched: true };
    report.lock = ownedLock;
    const metadata = await WorkspaceFiles.json(metadataFile);
    assert.equal(metadata.modelId, report.modelId);
    return metadata;
}

async function exportSources()
{
    await WorkspaceFiles.ensureDirectory(folder, "out");
    const icon = renderToStaticMarkup(createElement(Atom, { size: 24, strokeWidth: 1.5, "aria-hidden": true }));
    const html = await WorkspaceFiles.text(path.join(folder, "index.html"));
    if (html.includes('<span id="atom-icon" aria-hidden="true"></span>'))
    {
        await WorkspaceFiles.saveText(path.join(folder, "index.html"), html.replace('<span id="atom-icon" aria-hidden="true"></span>', `<span id="atom-icon" aria-hidden="true">${icon}</span>`));
    }
    const licensePath = path.join(workspace, "data", "downloads", "github.com", "frostmute-msites-prompt-collection", "d4974f4296e2851e05eabddb9240170cc423dd46", "LICENSE");
    await WorkspaceFiles.saveText(path.join(folder, "LICENSE"), await WorkspaceFiles.text(licensePath));
    await WorkspaceFiles.saveText(path.join(folder, "NOTICE"), await WorkspaceFiles.text(path.join(workspace, "node_modules", "lucide-react", "LICENSE")));
    for (const filename of ["index.html", "index.css", "app.js", "LICENSE", "NOTICE"])
    {
        await WorkspaceFiles.saveText(path.join(exported, filename), await WorkspaceFiles.text(path.join(folder, filename)));
    }
    const raw = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), hash(JSON.stringify([raw, design])) + "\n");
}

async function runQa(slug)
{
    const qa =
    {
        passed: false,
        visualReviewed: false,
        timestamp: new Date().toISOString(),
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        assertions: [],
        errors: [],
        screenshots: report.screenshots,
        staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"),
        resourcesClosed: false
    };
    await WorkspaceFiles.ensureDirectory(folder, ".checks");
    const check = async (name, action) =>
    {
        await action();
        qa.assertions.push({ name, passed: true });
    };
    try
    {
        server = await startPreviewServer(exported, { workspace });
        assert.equal(new URL(server.url).pathname, `/pages/${slug}/GPT-6/index.html`);
        assert.equal((await fetch(server.url)).status, 200);
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: qa.viewports[0], deviceScaleFactor: 1 });
        const page = await context.newPage();
        page.setDefaultTimeout(30000);
        const responses = new Map();
        const monitor = (target) =>
        {
            target.on("pageerror", (error) => qa.errors.push({ type: "page", message: error.message }));
            target.on("console", (message) =>
            {
                if (message.type() === "error")
                {
                    qa.errors.push({ type: "console", message: message.text() });
                }
            });
            target.on("requestfailed", (request) => qa.errors.push({ type: "request", url: request.url(), error: request.failure()?.errorText }));
            target.on("response", (response) =>
            {
                responses.set(response.url(), response.status());
                if (response.status() >= 400)
                {
                    qa.errors.push({ type: "http", url: response.url(), status: response.status() });
                }
            });
        };
        const noOverflow = async (target) =>
        {
            assert.equal(await target.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), true);
        };
        const waitVideos = async (target) =>
        {
            await target.waitForFunction(() => [...document.querySelectorAll("video")].every((video) => video.readyState >= 2 && video.videoWidth > 0 && !video.error), null, { timeout: 60000 });
            await target.evaluate(() => document.fonts.ready);
            assert.equal(await target.evaluate(() => document.fonts.check('16px "Helvetica Now Var"')), true);
        };
        monitor(page);
        await check("桌面实际子路径 HTTP 200，首页可见且原始远程视频和字体解码成功", async () =>
        {
            assert.equal((await page.goto(server.url, { waitUntil: "networkidle", timeout: 90000 })).status(), 200);
            await waitVideos(page);
            assert.equal(await page.title(), "Kinetic Forge");
            assert.equal(await page.locator("h1").isVisible(), true);
            assert.match(await page.locator("h1").innerText(), /Transforming the/);
            assert.equal(await page.locator("main > section").count(), 2);
            assert.equal(await page.locator("#atom-icon svg").count(), 1);
            await noOverflow(page);
        });
        await page.screenshot({ path: report.screenshots.desktop, animations: "disabled" });
        await check("滚动进入第二节时两段视频 700ms 交叉淡化并播放，六个指定客户标识存在", async () =>
        {
            await page.locator(".desktop-nav a").click();
            await page.waitForFunction(() => document.body.dataset.activeVideo === "2");
            await page.waitForTimeout(1000);
            assert.equal(await page.locator("#hero-video").evaluate((node) => getComputedStyle(node).opacity), "0");
            assert.equal(await page.locator("#studio-video").evaluate((node) => getComputedStyle(node).opacity), "1");
            assert.equal(await page.locator("#studio-video").evaluate((node) => node.paused), false);
            assert.equal(await page.locator(".client-grid > div").count(), 6);
            await noOverflow(page);
        });
        await page.screenshot({ path: path.join(checks, "desktop-studio.png"), animations: "disabled" });
        await check("Learn more 实际打开工作方式；Escape 关闭并恢复焦点和滚动", async () =>
        {
            await page.getByRole("button", { name: "Learn more here" }).click();
            assert.equal(await page.getByRole("heading", { name: "Built on collaboration." }).isVisible(), true);
            assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("dialog").evaluate((node) => node.open), false);
            assert.equal(await page.getByRole("button", { name: "Learn more here" }).evaluate((node) => node === document.activeElement), true);
            await noOverflow(page);
        });
        await check("键盘打开 expertise，projects 显示真实可用且明确标识的示例详情", async () =>
        {
            await page.locator('.desktop-nav [data-open="expertise"]').focus();
            await page.keyboard.press("Enter");
            assert.equal(await page.getByRole("heading", { name: "From idea to interaction." }).isVisible(), true);
            assert.equal(await page.locator(".detail-list li").count(), 3);
            await page.keyboard.press("Escape");
            await page.locator('.desktop-nav [data-open="projects"]').click();
            assert.match(await page.locator(".dialog-content").innerText(), /not verified client case studies/);
            await page.getByRole("button", { name: "Close details" }).click();
            await noOverflow(page);
        });
        await check("联系表单验证必填项且只生成未发送摘要，安全显示输入文字", async () =>
        {
            await page.locator('.desktop-nav [data-open="contact"]').click();
            await page.getByRole("button", { name: "Prepare my brief" }).click();
            assert.equal(await page.locator('input[name="name"]').evaluate((node) => node.validity.valueMissing), true);
            await page.getByLabel("Your name").fill("Alex Designer");
            await page.getByLabel("Email address").fill("alex@example.com");
            await page.getByLabel("What can we help with?").selectOption("Interface design");
            await page.getByLabel("A little about your project").fill("An accessible product interface. <strong>Plain text</strong>");
            await page.getByRole("button", { name: "Prepare my brief" }).click();
            assert.match(await page.locator(".brief-output").innerText(), /has not been sent/);
            assert.match(await page.locator(".brief-output").innerText(), /Interface design/);
            assert.equal(await page.locator(".brief-output strong").count(), 0);
            await noOverflow(page);
            await page.keyboard.press("Escape");
            await page.locator('.desktop-nav [data-open="contact"]').click();
            assert.equal(await page.getByLabel("Your name").inputValue(), "");
            await page.keyboard.press("Escape");
        });
        await check("滚回首页恢复视频一，暂停和恢复播放按钮实际生效", async () =>
        {
            await page.locator(".brand").click();
            await page.waitForFunction(() => document.body.dataset.activeVideo === "1");
            await page.waitForTimeout(1000);
            await page.getByRole("button", { name: "Pause background videos" }).click();
            assert.equal(await page.locator("#hero-video").evaluate((node) => node.paused), true);
            await page.getByRole("button", { name: "Play background videos" }).click();
            await page.waitForFunction(() => !document.querySelector("#hero-video").paused);
            await noOverflow(page);
        });
        const mobile = await context.newPage();
        await mobile.setViewportSize({ width: 390, height: 844 });
        monitor(mobile);
        await mobile.goto(server.url, { waitUntil: "networkidle", timeout: 90000 });
        await waitVideos(mobile);
        await check("390×844 移动首页非空，无横向溢出，桌面导航隐藏", async () =>
        {
            assert.equal(await mobile.locator("h1").isVisible(), true);
            assert.equal(await mobile.locator(".desktop-nav").isVisible(), false);
            assert.equal(await mobile.getByRole("button", { name: "Open menu" }).isVisible(), true);
            await noOverflow(mobile);
        });
        await mobile.screenshot({ path: report.screenshots.mobile, animations: "disabled" });
        await check("移动菜单打开、锁滚动、焦点循环、Escape 关闭和恢复", async () =>
        {
            await mobile.getByRole("button", { name: "Open menu" }).click();
            assert.equal(await mobile.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
            assert.equal(await mobile.evaluate(() => document.body.style.overflow), "hidden");
            await mobile.keyboard.press("Shift+Tab");
            assert.equal(await mobile.locator(".menu-toggle").evaluate((node) => node === document.activeElement), true);
            await mobile.keyboard.press("Escape");
            assert.equal(await mobile.evaluate(() => document.body.style.overflow), "");
            assert.equal(await mobile.locator("#mobile-menu").evaluate((node) => node.inert), true);
            await noOverflow(mobile);
        });
        await check("移动菜单链接关闭菜单，studio 导航触发视频切换，详情可用且无溢出", async () =>
        {
            await mobile.getByRole("button", { name: "Open menu" }).click();
            await mobile.locator("#mobile-menu a").click();
            await mobile.waitForFunction(() => document.body.dataset.activeVideo === "2");
            assert.equal(await mobile.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
            assert.equal(await mobile.evaluate(() => document.body.style.overflow), "");
            await mobile.locator("#studio").scrollIntoViewIfNeeded();
            await mobile.waitForTimeout(800);
            await noOverflow(mobile);
            await mobile.screenshot({ path: path.join(checks, "mobile-studio.png"), animations: "disabled" });
            await mobile.getByRole("button", { name: "Open menu" }).click();
            await mobile.locator('#mobile-menu [data-open="expertise"]').click();
            assert.equal(await mobile.getByRole("heading", { name: "From idea to interaction." }).isVisible(), true);
            await noOverflow(mobile);
            await mobile.getByRole("button", { name: "Close details" }).click();
            await mobile.waitForFunction(() => document.body.style.overflow === "");
            assert.equal(await mobile.evaluate(() => document.body.style.overflow), "");
        });
        await check("开启菜单时切换至桌面断点恢复滚动；320px 狭窄屏幕不溢出", async () =>
        {
            await mobile.getByRole("button", { name: "Open menu" }).click();
            await mobile.setViewportSize({ width: 1024, height: 900 });
            await mobile.waitForFunction(() => document.body.style.overflow === "");
            await noOverflow(mobile);
            await mobile.setViewportSize({ width: 320, height: 740 });
            await noOverflow(mobile);
        });
        await check("减少动态偏好暂停背景并允许用户主动恢复", async () =>
        {
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.waitForFunction(() => [...document.querySelectorAll("video")].every((video) => video.paused));
            assert.equal(await page.getByRole("button", { name: "Play background videos" }).isVisible(), true);
            await noOverflow(page);
        });
        qa.responses = [...responses].map(([url, status]) => ({ url, status }));
        assert.deepEqual(qa.errors, []);
        qa.passed = true;
    }
    finally
    {
        await browser?.close();
        browser = undefined;
        await server?.close();
        server = undefined;
        resourcesClosed = true;
        qa.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        report.tests = qa.assertions;
        report.browserErrors = qa.errors;
    }
    return qa;
}

try
{
    let metadata = await verifyLock();
    const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const group = config.pages[prompt];
    const options = Array.isArray(group) ? group : group?.pages ?? [];
    const slug = options[0]?.slug ?? "kineticforge-digital-studio";
    const title = options[0]?.title ?? "KineticForge digital studio";
    const mode = process.argv[2] ?? "qa";
    if (mode === "qa")
    {
        await exportSources();
        assert.equal(await StaticHomepage.checkSource(folder), "html");
        metadata.generated = true;
        metadata.preview = false;
        metadata.validated = false;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const qa = await runQa(slug);
        report.status = "qa-passed-awaiting-visual-review";
        report.staticDigest = qa.staticDigest;
        report.preview = await StaticHomepage.ensurePreview(workspace, { folder }, exported, qa.staticDigest, undefined, metadata.preview);
        report.previewPath = path.join(exported, "preview.png");
        report.previewSha256 = hash(await readFile(report.previewPath));
        resourcesClosed = true;
    }
    else if (mode === "finish")
    {
        const previous = await WorkspaceFiles.json(reportFile);
        const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
        assert.equal(qa.passed, true);
        assert.equal(qa.visualReviewed, true);
        assert.equal(qa.previewVisualReviewed, true);
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
        assert.equal(qa.staticDigest, digest);
        const previewHash = hash(await readFile(path.join(exported, "preview.png")));
        assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${previewHash}`);
        report = { ...previous, lock: ownedLock, tests: qa.assertions, visualReviewed: true, visual: qa.visualReview, status: "completed" };
        metadata.preview = true;
        metadata.validated = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        await registerGeneratedPage(workspace, { prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
        const saved = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
        const registered = saved.pages[prompt].pages.filter((entry) => entry.model === "GPT-6");
        assert.equal(registered.length, 1);
        assert.equal(registered[0].slug, slug);
        assert.equal(registered[0].staticDir, "out");
        assert.equal(registered[0].enabled, false);
        assert.equal(registered[0].deployed, false);
        const before = { ...config.pages };
        const after = { ...saved.pages };
        delete before[prompt];
        delete after[prompt];
        assert.deepEqual(after, before);
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        report.registration = { registered: true, unique: true, enabled: false, deployed: false, slug, title, staticDir: "out", otherEntriesPreserved: true };
        resourcesClosed = true;
    }
    else
    {
        throw Error("Only scoped qa and finish modes are supported");
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
    const metadata = await WorkspaceFiles.json(metadataFile);
    report.flags = flags(metadata);
    report.tags = metadata.tags;
    report.tagValidation = metadata.tags.length > 0 && metadata.tags.every((tag) => tag.trim() === tag && tag.length > 0) && new Set(metadata.tags).size === metadata.tags.length;
    report.resourcesClosed = resourcesClosed;
    report.timestamp = new Date().toISOString();
    await WorkspaceFiles.saveJson(reportFile, report);
    console.log(JSON.stringify({ prompt, status: report.status, flags: report.flags, tests: report.tests.length, errors: report.browserErrors, resourcesClosed: report.resourcesClosed }));
}
