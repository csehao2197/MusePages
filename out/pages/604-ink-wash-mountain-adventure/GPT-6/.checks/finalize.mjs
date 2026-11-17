import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { registerGeneratedPage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "deploy-site.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "604-ink-wash-mountain-adventure");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await W.json(job.stateFile);
const pid = Number((await W.text(job.promptLock)).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, pid);
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await W.json(qaFile);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.equal(qa.results.length, 14);
assert.deepEqual(qa.errors, []);
const fingerprint = createHash("sha256").update(JSON.stringify([await W.text(job.file), await W.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"))])).digest("hex");
assert.equal((await W.text(path.join(folder, ".generation-input.sha256"))).trim(), fingerprint);
const beforeConfig = await W.json(path.join(root, "deploy", "config.json"));
const existing = beforeConfig.pages[job.prompt]?.pages || [];
const slug = existing[0]?.slug || "ink-wash-mountain-adventure";
const title = existing[0]?.title || "Ink Wash Mountain Adventure";
assert.equal(await S.checkSource(folder), "html");
const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
const checkedPreview = await W.json(path.join(folder, ".checks", "preview-verification.json"));
assert.equal(checkedPreview.staticDigest, digest);
const screenshots = {};
for (const [name, relative, width, height] of [
    ["desktop", ".checks\\desktop.png", 1200, 900],
    ["mobile", ".checks\\mobile.png", 390, 844],
    ["preview", "out\\preview.png", 1200, 900],
    ["summit", ".checks\\summit.png", 1200, 900]
])
{
    const file = path.join(folder, relative);
    const png = await fs.readFile(file);
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
    screenshots[name] = { path: file, width, height, sha256: createHash("sha256").update(png).digest("hex"), openedWithView: true };
}
assert.equal((await W.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${screenshots.preview.sha256}`);
async function equalPublic(directory)
{
    for (const entry of await fs.readdir(directory, { withFileTypes: true }))
    {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) await equalPublic(file);
        else if (file !== path.join(exported, "preview.png"))
        {
            const relative = path.relative(exported, file);
            assert.deepEqual(await fs.readFile(file), await fs.readFile(path.join(folder, relative)), `Source/export mismatch: ${relative}`);
        }
    }
}
await equalPublic(exported);
qa.visualReviewed = true;
qa.visualReview =
{
    method: "实际使用 view 工具打开最终 desktop.png、mobile.png、preview.png；另已打开真实登顶结果截图 summit.png。",
    observations: [
        "桌面：山道、近处玩家和第一训练守卫构成主体，衬线标题与克制 HUD 有清楚层级；暖纸底与墨绿色、朱砂角色形成区分。",
        "手机：标题、Breath、横排进度与守卫标签互不重叠；目标位于玩家下方，方向键与动作按钮均位于视口内。",
        "已修正早期画面过暗、文字对比不足及手机进度与目标标签重叠；最终真实截图无横向溢出和明显裁切。",
        "标准预览为实际静态首页 1200×900 首屏，不是设计稿、游戏宣传落地页或其他模型结果。"
    ],
    screenshots
};
qa.staticDigest = digest;
qa.inputFingerprint = fingerprint;
qa.sourceExportEqual = true;
qa.unitTests = { command: "node --test out\\pages\\604-ink-wash-mountain-adventure\\GPT-6\\.checks\\simulation.test.mjs", passed: 4, failed: 0 };
qa.iterationNotes = "早期 QA 发现视觉对比及自动化时序/选择器问题；已修正。最终完整重跑 14 组通过。前次选择器失败记录保存在 .checks\\qa-before-selector-correction.json。";
await W.saveJson(qaFile, qa);
const metadataFile = path.join(folder, "metadata.json");
const metadata = await W.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.ok(metadata.tags.length && metadata.tags.every((tag) => tag === tag.trim() && tag.length));
assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
metadata.preview = true;
metadata.validated = true;
await W.saveJson(metadataFile, metadata);
const added = await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
const afterConfig = await W.json(path.join(root, "deploy", "config.json"));
for (const [key, value] of Object.entries(beforeConfig.pages))
{
    if (key !== job.prompt) assert.deepEqual(afterConfig.pages[key], value, `Unrelated registration changed: ${key}`);
}
assert.deepEqual(afterConfig.categories, beforeConfig.categories);
const registered = afterConfig.pages[job.prompt].pages.filter((option) => option.model.toLowerCase() === "gpt-6");
assert.equal(registered.length, 1);
assert.equal(registered[0].enabled, false);
assert.equal(registered[0].deployed, false);
assert.equal(registered[0].slug, slug);
assert.equal(registered[0].staticDir, "out");
assert.deepEqual(registered[0].tags, metadata.tags);
metadata.config_added = true;
await W.saveJson(metadataFile, metadata);
const actualMetadata = await W.json(metadataFile);
assert.deepEqual(actualMetadata, metadata);
const report =
{
    runId: job.runId,
    prompt: job.prompt,
    status: "completed",
    modelId: job.modelId,
    display_model_name: "GPT-6",
    summary: "已完成原创全英文水墨山道三维动作训练游戏；键盘真实通关三位守卫、登顶与重新开始，触屏真实完成第一守卫并验证失败后保留已学关卡。未构建或部署。",
    tags: metadata.tags,
    generated: actualMetadata.generated,
    preview: actualMetadata.preview,
    validated: actualMetadata.validated,
    config_added: actualMetadata.config_added,
    metadata: actualMetadata,
    output: folder,
    staticOutput: exported,
    publicPath: `/pages/${slug}/GPT-6/index.html`,
    qaFile,
    screenshots,
    input: { file: job.file, fullMarkdownRead: true, fullDesignRead: true, fingerprint, provenance: job.provenance, licenseRead: true },
    lock: { runId: job.runId, pid, matchedDurableOwnedLock: true, aliveAtFinalization: true, coordinatorLockPreserved: true },
    implementation: [
        "真实 Three.js 三维山道、第三人称角色、三个各自拥有警示/扫击/恢复时序的机械训练守卫。",
        "固定 1/60 秒本地模拟，三段连击、攻击距离、Breath 消耗恢复、闪避无敌窗口、受击失衡、训练门与登顶圆圈判定。",
        "重试只重置当前课，已校准守卫保留；完整重新开始重置全部进度；个人最佳主动时间与声音偏好仅存在本地。",
        "原创程序化岩石、松树、门架、角色与着色器；纸纹、水墨分层、动态雨与可选合成雨声/远雷；静态地形实例化及渲染工作上限。",
        "键盘、鼠标路径点击与动作按钮、触屏长按方向及动作键、帮助、暂停与结果弹窗。"
    ],
    tests: { browserGroupsPassed: 14, browserGroupsFailed: 0, unitTestsPassed: 4, unitTestsFailed: 0, errors: qa.errors, assertions: qa.results, staticValidation: "passed", sourceExportEqual: true, inputFingerprint: fingerprint, staticDigest: digest, previewResult: checkedPreview.preview, previewDigestVerified: true },
    visualReviewed: true,
    visualEvidence: qa.visualReview,
    registration: { added, uniqueVerified: true, option: registered[0], unrelatedOptionsPreserved: true, deployed: false, enabled: false },
    limitations: [
        "采用获授权的 HTML/CSS/浏览器 JavaScript 静态适配，未执行原始 Vite/TypeScript 构建；模块按功能分离但文案不是单一 TypeScript 文件；Lucide 为本地 UMD 包。",
        "原始输入仅为公开 Brief，不含付费 Pro 的精确页面、资产、坐标或时序；本实现的几何、界面和战斗参数为原创，不宣称复刻未提供的私有设计。",
        "全部界面文字使用英文，印章也以英文 R 替代汉字书法，并在 README 记录。",
        "实测 Chromium 桌面 1200×900 与触屏 390×844；未声称覆盖所有浏览器、GPU 或手机横屏。需要 WebGL。",
        "保留 VibeFather 署名及 CC BY-NC 4.0 非商业限制，依赖许可随静态资源提供；未使用第三方演示图片。",
        "没有后端、外部 API、在线纪录或交易服务，也没有假战斗 Mock；未运行生产构建、dist、publish 或上传。"
    ],
    blocker: null,
    resourcesClosed: true,
    resourceClosure: "所有自有 Playwright 浏览器和仅托管目标静态目录的临时服务均已在 finally 中关闭；ensurePreview 的浏览器/服务已正常关闭；未启动常驻服务。协调器锁持有进程保持不动。",
    completedAt: new Date().toISOString()
};
await W.saveJson(job.reportFile, report);
const durable = await W.json(job.reportFile);
assert.equal(durable.prompt, job.prompt);
assert.equal(durable.status, "completed");
console.log(JSON.stringify({ reportFile: job.reportFile, status: durable.status, flags: actualMetadata, registered: registered[0], staticDigest: digest, resourcesClosed: true }, null, 2));
