import assert from "node:assert/strict";
import path from "node:path";
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const slug = "3d-wooden-fish-tapping-toy";
const metadataFile = path.join(folder, "metadata.json");
const metadata = await W.json(metadataFile);
const mode = process.argv[2] || "qa";
const durable = await W.json(job.stateFile);
assert.equal(durable.runId, job.runId);
assert.equal(durable.ownedLock.prompt, job.prompt);
assert.equal((await W.text(job.promptLock)).trim(), String(durable.ownedLock.pid));
process.kill(durable.ownedLock.pid, 0);
assert.equal(metadata.modelId, "gpt-6.1-sol");
assert.equal(job.prompt, "613-3d-wooden-fish-tapping-toy");

if (mode === "prepare")
{
    const require = createRequire(import.meta.url);
    const { minify } = require("next/dist/compiled/terser");
    for (const dir of ["fonts", "licenses", "vendor"])
    {
        await mkdir(path.join(exported, dir), { recursive: true });
    }
    const previous = path.join(root, "out", "pages", "612-jelly-squish-physics-toy", "GPT-6", "node_modules", "three");
    for (const name of ["three.module.min.js", "three.core.min.js"])
    {
        await copyFile(path.join(previous, "build", name), path.join(exported, "vendor", name));
    }
    await copyFile(path.join(previous, "LICENSE"), path.join(exported, "licenses", "three-LICENSE.txt"));
    const fonts = path.join(root, "out", "pages", "600-movie-rating-community", "GPT-6", "assets");
    for (const name of ["instrument-serif-latin-400-normal.woff2", ...[400, 500, 600].map((w) => `dm-sans-latin-${w}-normal.woff2`)])
    {
        await copyFile(path.join(fonts, "fonts", name), path.join(exported, "fonts", name));
    }
    for (const name of ["instrument-serif", "dm-sans"])
    {
        await copyFile(path.join(fonts, "licenses", `${name}-LICENSE.txt`), path.join(exported, "licenses", `${name}-LICENSE.txt`));
    }
    await copyFile(path.join(folder, "LICENSE"), path.join(exported, "LICENSE"));
    await copyFile(path.join(folder, "index.html"), path.join(exported, "index.html"));
    const css = await W.text(path.join(folder, "src", "style.css"));
    await W.saveText(path.join(exported, "style.css"), css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1"));
    for (const [source, target] of [["app.js", "app.js"], ["content.ts", "content.js"]])
    {
        const result = await minify(await W.text(path.join(folder, "src", source)), { module: true, sourceMap: false, format: { comments: false } });
        assert.ok(result.code);
        await W.saveText(path.join(exported, target), result.code);
    }
    await S.checkSource(folder);
    metadata.generated = true;
    metadata.preview = false;
    metadata.validated = false;
    await W.saveJson(metadataFile, metadata);
    console.log(JSON.stringify({ source: "passed", staticDigest: await S.validateStaticOutput(exported, slug, "GPT-6") }));
    process.exit(0);
}

if (mode === "finalize")
{
    const qa = await W.json(path.join(checks, "qa.json"));
    assert.equal(qa.passed, true);
    assert.equal(qa.visualReviewed, true);
    assert.equal(qa.previewVisualReviewed, true);
    const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    assert.equal(await S.ensurePreview(root, { folder }, exported, digest, undefined, true), "preserved");
    metadata.generated = true;
    metadata.preview = true;
    metadata.validated = true;
    await W.saveJson(metadataFile, metadata);
    await registerGeneratedPage(root,
    {
        prompt: job.prompt,
        model: "GPT-6",
        slug,
        title: "3D Wooden Fish Tapping Toy",
        staticDir: "out",
        tags: metadata.tags
    });
    const config = await W.json(path.join(root, "deploy", "config.json"));
    const options = config.pages[job.prompt].pages.filter((p) => p.model === "GPT-6");
    assert.equal(options.length, 1);
    assert.equal(options[0].enabled, false);
    assert.equal(options[0].deployed, false);
    assert.deepEqual(options[0].tags, metadata.tags);
    metadata.config_added = true;
    await W.saveJson(metadataFile, metadata);
    const report =
    {
        prompt: job.prompt,
        runId: job.runId,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags: metadata.tags,
        input: job.file,
        provenance: job.provenance,
        reportFile: job.reportFile,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        output: folder,
        staticOutput: exported,
        qa: path.join(checks, "qa.json"),
        screenshots: [path.join(checks, "desktop.png"), path.join(checks, "mobile.png")],
        previewFile: path.join(exported, "preview.png"),
        staticDigest: digest,
        inputFingerprint: (await W.text(path.join(folder, ".generation-input.sha256"))).trim(),
        previewFingerprint: (await W.text(path.join(folder, ".generation-preview.sha256"))).trim(),
        tests: qa.assertions,
        visualReviewed: true,
        visualEvidence: qa.visualNotes,
        screenshotDigests: qa.screenshotDigests,
        previewVisualReviewed: true,
        registration: { unique: true, enabled: false, deployed: false, slug, title: options[0].title },
        limitations:
        [
            "按授权采用原生静态模块替代 Vite/TypeScript 构建；仅做浏览器脚本语法压缩，未运行任何构建。",
            "全部可见文案为英文，使用 Today、Rhythm、+1 calm，无中文功德或书法。",
            "声音为真实 Web Audio 合成；已验证输出波形非零，未声称真人试听。",
            "无后端或远程 API；每日计数和偏好仅保存在本机，受浏览器存储策略限制。",
            "WebGL 不可用时明确显示 Canvas 2D 降级，常规页面使用真实 Three.js 三维模型。",
            "环境音不在重新载入或隐藏后自动恢复，需用户明确开启。",
            "CC BY-NC 4.0 非商业适配；依赖及字体保留各自许可证。"
        ],
        blocker: null,
        resourcesClosed: qa.resourcesClosed,
        summary: "已完成真实三维木鱼、合成敲击声、独立环境音、每日与会话计数、节奏连击、自动敲击和隐藏暂停。静态、桌面、手机、键盘与降级测试通过，实际截图已审阅；仅禁用登记，未构建或部署。"
    };
    await W.saveJson(job.reportFile, report);
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
}

const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    passed: false,
    visualReviewed: false,
    previewVisualReviewed: false,
    viewports: { desktop: { width: 1200, height: 900, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 1 } },
    assertions: [],
    errors: [],
    audio: {},
    resourcesClosed: false
};
let service;
let browser;
const pass = (text) => qa.assertions.push(text);
const failures = [];
function observe(page)
{
    page.on("pageerror", (e) => failures.push(`page: ${e.message}`));
    page.on("console", (e) => { if (e.type() === "error") failures.push(`console: ${e.text()}`); });
    page.on("requestfailed", (r) => failures.push(`request: ${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) => { if (r.status() >= 400) failures.push(`http: ${r.status()} ${r.url()}`); });
    page.on("request", (r) => { if (!r.url().startsWith("http://127.0.0.1:") && !r.url().startsWith("data:")) failures.push(`external: ${r.url()}`); });
}
async function noOverflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
async function count(page, id = "session")
{
    return Number((await page.locator(`#${id}`).innerText()).replaceAll(",", ""));
}
async function instrumentation(context)
{
    await context.addInitScript(() =>
    {
        window.__audio = { created: 0, oscillators: 0, starts: 0, peak: 0 };
        if (window.AudioContext)
        {
            const Native = window.AudioContext;
            window.AudioContext = class extends Native
            {
                constructor(...args)
                {
                    super(...args);
                    window.__audio.created++;
                    window.__ctx = this;
                    const analyser = this.createAnalyser();
                    analyser.fftSize = 512;
                    analyser.connect(this.destination);
                    const originalGain = this.createGain.bind(this);
                    this.createGain = (...values) =>
                    {
                        const gain = originalGain(...values);
                        const originalConnect = gain.connect.bind(gain);
                        gain.connect = (destination, ...rest) => originalConnect(destination === this.destination ? analyser : destination, ...rest);
                        return gain;
                    };
                    const createOscillator = this.createOscillator.bind(this);
                    this.createOscillator = (...values) =>
                    {
                        window.__audio.oscillators++;
                        const osc = createOscillator(...values);
                        const start = osc.start.bind(osc);
                        osc.start = (...params) => { window.__audio.starts++; return start(...params); };
                        return osc;
                    };
                    window.__sample = setInterval(() =>
                    {
                        if (this.state !== "running") return;
                        const samples = new Float32Array(512);
                        analyser.getFloatTimeDomainData(samples);
                        for (const value of samples) window.__audio.peak = Math.max(window.__audio.peak, Math.abs(value));
                    }, 10);
                }
            };
        }
    });
}
try
{
    service = await startPreviewServer(exported, { workspace: root });
    assert.equal((await fetch(service.url)).status, 200);
    assert.ok(service.url.endsWith("/pages/3d-wooden-fish-tapping-toy/GPT-6/index.html"));
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    pass("最终公开子路径 HTTP 200；预览服务仅托管目标静态目录，仓库 README 返回 404");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: qa.viewports.desktop, deviceScaleFactor: 1 });
    await instrumentation(context);
    const page = await context.newPage();
    observe(page);
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("data-renderer"), "webgl");
    await page.locator("canvas").waitFor({ state: "visible" });
    assert.ok((await page.locator("h1").innerText()).length > 5);
    assert.equal(await page.evaluate(() => window.__audio.created), 0);
    assert.equal(await count(page), 0);
    await noOverflow(page);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    pass("桌面 1200×900、DPR1：真实 WebGL 场景可见、页面非空、字体就绪、初始无音频上下文及横向溢出");
    const sceneBox = await page.locator("canvas").boundingBox();
    await page.mouse.click(sceneBox.x + 5, sceneBox.y + 5);
    assert.equal(await count(page), 0);
    await page.mouse.click(sceneBox.x + sceneBox.width * .5, sceneBox.y + sceneBox.height * .5);
    assert.equal(await count(page), 1);
    pass("射线拾取：空白区域不敲击；点击真实三维木鱼恰好增加一次计数");
    await page.locator("#strike").click();
    await page.locator("#strike").focus();
    await page.keyboard.press("Enter");
    assert.equal(await count(page), 3);
    assert.equal(await page.locator("#rhythmHint").innerText(), "In rhythm");
    await page.locator("#strike").press("Space");
    assert.equal(await count(page), 4);
    await page.locator("#strike").blur();
    await page.keyboard.press("Space");
    assert.equal(await count(page), 5);
    pass("按钮点击、焦点 Enter/Space 与全局 Space 均只敲一次；连续三次出现 In rhythm");
    await page.waitForTimeout(1700);
    assert.equal(await count(page, "combo"), 0);
    pass("1.6 秒无敲击后连击归零，今日/会话计数不丢失");
    qa.audio = await page.evaluate(() => ({ ...window.__audio, state: window.__ctx?.state }));
    assert.ok(qa.audio.created === 1 && qa.audio.oscillators >= 3 && qa.audio.peak > .0001);
    pass("首次手势后才创建真实 AudioContext；合成振荡器启动且实际输出分析波形非零");
    await page.locator("#sound").click();
    const beforeSilent = await page.evaluate(() => window.__audio.oscillators);
    const beforeSilentCount = await count(page);
    await page.locator("#strike").click();
    assert.equal(await count(page), beforeSilentCount + 1);
    assert.equal(await page.evaluate(() => window.__audio.oscillators), beforeSilent);
    await page.locator("#ambience").click();
    await page.waitForTimeout(350);
    assert.equal(await page.locator("#ambience").getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "false");
    assert.ok(await page.evaluate(() => window.__audio.oscillators) > beforeSilent);
    await page.locator("#ambience").click();
    pass("关闭敲击音后视觉/计数继续且无新增敲击振荡器；环境音可独立开启和关闭");
    const beforeSettingSpace = await count(page);
    await page.locator("#sound").focus();
    await page.keyboard.press("Space");
    assert.equal(await count(page), beforeSettingSpace);
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "true");
    pass("设置控件上的 Space 不触发全局敲击；控件保留正确 pressed/switch 语义和键盘支持");
    const start = await count(page);
    await page.locator("#auto").click();
    assert.equal(await page.locator("#auto").getAttribute("aria-label"), "Stop auto");
    await page.waitForTimeout(2550);
    assert.equal(await count(page), start + 2);
    await page.locator("#auto").click();
    const stopped = await count(page);
    await page.waitForTimeout(1350);
    assert.equal(await count(page), stopped);
    pass("自动敲击每 1.2 秒恰好一次，切换停止后不再增加");
    await page.locator("#auto").click();
    await page.locator("#ambience").click();
    await page.evaluate(() =>
    {
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(1350);
    const hidden = await count(page);
    assert.equal(await page.locator("#auto").getAttribute("aria-checked"), "false");
    assert.equal(await page.locator("#ambience").getAttribute("aria-pressed"), "false");
    assert.equal(await page.evaluate(() => window.__ctx.state), "suspended");
    await page.evaluate(() =>
    {
        Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(1350);
    assert.equal(await count(page), hidden);
    pass("visibilitychange 隐藏路径停止自动/环境音并挂起真实音频；返回不自行恢复");
    await noOverflow(page);
    const today = await count(page, "today");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await count(page), 0);
    assert.equal(await count(page, "today"), today);
    pass("重载保留今日总数并重置会话，不自动播放声音");
    await page.addInitScript(() => localStorage.setItem("hushwood.v1", JSON.stringify({ day: "old-day", today: 123, sound: true })));
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await count(page, "today"), 0);
    await page.locator("#strike").click();
    assert.equal(await count(page, "today"), 1);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("hushwood.v1")));
    assert.notEqual(saved.day, "old-day");
    pass("本地日键过期后今日归零，第一次敲击写入新日键与准确计数；界面不显示日期");
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page);
    const footer = await page.locator("footer").boundingBox();
    assert.ok(footer.y + footer.height <= 900);
    await page.locator("#strike").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator("#strike").evaluate((el) => getComputedStyle(el).outlineWidth), "2px");
    assert.equal(await page.evaluate(() => /[\u3400-\u9fff]/u.test(document.body.innerText)), false);
    pass("原需求 1440×900 构图完整包含页脚，无溢出；键盘焦点 2px 可见，全部可见文案无中文字符");
    await context.close();
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    observe(mobile);
    await mobile.goto(service.url, { waitUntil: "networkidle" });
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile);
    await mobile.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    const box = await mobile.locator("canvas").boundingBox();
    await mobile.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(await count(mobile), 1);
    await mobile.locator("#strike").tap();
    assert.equal(await count(mobile), 2);
    for (const id of ["strike", "sound", "ambience", "auto"])
    {
        const rect = await mobile.locator(`#${id}`).boundingBox();
        assert.ok(rect.height >= 44 && rect.width >= 44);
    }
    await mobile.locator("#auto").tap();
    await mobile.waitForTimeout(1250);
    assert.equal(await count(mobile), 3);
    await mobile.locator("#auto").tap();
    await noOverflow(mobile);
    assert.equal(await mobile.locator("kbd").isVisible(), false);
    pass("手机 390×844 真实触摸射线/按钮/自动敲击成功，无双触发；控件均≥44px，设置两行，交互前后无横向溢出");
    await mobileContext.close();
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    observe(reducedPage);
    await reducedPage.goto(service.url, { waitUntil: "networkidle" });
    await reducedPage.locator("#strike").click();
    assert.equal(await count(reducedPage), 1);
    assert.equal(await reducedPage.locator(".floating").getAttribute("class"), "floating");
    await noOverflow(reducedPage);
    pass("减少动态效果设置下正常计数，不启动浮动消息；静态三维模型保持可用");
    await reducedContext.close();
    const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await fallbackContext.addInitScript(() =>
    {
        const native = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args)
        {
            if (type.startsWith("webgl")) throw Error("Intentional WebGL-unavailable QA");
            return native.call(this, type, ...args);
        };
        Object.defineProperty(window, "AudioContext", { value: undefined });
        Object.defineProperty(window, "webkitAudioContext", { value: undefined });
        Storage.prototype.getItem = () => { throw Error("Intentional storage unavailable QA"); };
        Storage.prototype.setItem = () => { throw Error("Intentional storage unavailable QA"); };
    });
    const fallbackPage = await fallbackContext.newPage();
    observe(fallbackPage);
    await fallbackPage.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(await fallbackPage.locator("html").getAttribute("data-renderer"), "canvas");
    assert.equal(await fallbackPage.locator(".fallback-note").isVisible(), true);
    await fallbackPage.locator("#strike").click();
    assert.equal(await count(fallbackPage), 1);
    await noOverflow(fallbackPage);
    pass("同时禁用 WebGL/AudioContext/localStorage 时明确 Canvas 降级，仍可敲击计数，无未捕获异常");
    await fallbackContext.close();
    assert.deepEqual(failures, []);
    qa.staticDigest = await S.validateStaticOutput(exported, slug, "GPT-6");
    qa.preview = await S.ensurePreview(root, { folder }, exported, qa.staticDigest, undefined, false);
    qa.previewSha256 = createHash("sha256").update(await readFile(path.join(exported, "preview.png"))).digest("hex");
    pass("静态独立资源与公开子路径检查通过；ensurePreview 实际截取 1200×900 首屏并保存双摘要");
    const totalBytes = async (directory) =>
    {
        let total = 0;
        for (const item of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, item.name);
            total += item.isDirectory() ? await totalBytes(file) : (await stat(file)).size;
        }
        return total;
    };
    qa.staticBytes = await totalBytes(exported);
    assert.ok(qa.staticBytes < 20 * 1024 * 1024);
    pass("完整静态目录小于 20 MB，无远程运行时请求、HTTP/资源/控制台/页面错误");
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
    qa.errors.push(...failures);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), qa);
}
console.log(JSON.stringify(qa, null, 2));
