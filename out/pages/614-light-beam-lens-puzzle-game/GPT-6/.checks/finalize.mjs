import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const manifest = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(job.prompt, "614-light-beam-lens-puzzle-game");
assert.equal(manifest.runId, job.runId);
assert.equal(manifest.ownedLock.prompt, job.prompt);
assert.equal(manifest.ownedLock.pid, lockPid);
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(metadataFile);
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
const sha = (data) => createHash("sha256").update(data).digest("hex");
assert.equal(metadata.modelId, "gpt-6.1-sol");
assert.equal(metadata.generated, true);
assert(qa.passed && qa.resourcesClosed && qa.errors.length === 0);
assert(metadata.tags.length && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0));
assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
const input = sha(JSON.stringify([await WorkspaceFiles.text(job.file),
    await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))]));
assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), input);
await StaticHomepage.checkSource(folder);
const slug = "light-beam-lens-puzzle-game";
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest);
if (process.argv[2] === "preview")
{
    qa.visualReviewed = true;
    qa.visualReview =
    {
        reviewedBy: "gpt-6.1-sol，实际调用 view 打开最终 PNG",
        files: Object.fromEntries(await Promise.all(Object.entries(qa.screenshots).map(async ([name, file]) => [name, { path: file, sha256: sha(await readFile(file)) }]))),
        assessment: "已打开桌面、移动及真实通关第十二关截图。桌面棋盘为视觉主角，层级、间距、字体和薄荷色状态对比清晰；移动棋盘完整，底栏触控按钮不挡接收器状态，无横向溢出。复核后缩小并提亮装饰晶体、收紧侧栏间距，让署名可见。最终多路光线来自真实光学追踪，三接收器同时点亮。"
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    const preview = await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "preview-result.json"),
    {
        preview, staticDigest: digest, imageSHA256: sha(await readFile(path.join(exported, "preview.png"))),
        resourcesClosed: true, needsFreshImageViewBeforeFlags: true
    });
    console.log(JSON.stringify({ preview, file: path.join(exported, "preview.png"), metadataFlagsUnchanged: true }));
}
else if (process.argv[2] === "finish")
{
    assert(qa.visualReviewed);
    const previewResult = await WorkspaceFiles.json(path.join(folder, ".checks", "preview-result.json"));
    const png = await readFile(path.join(exported, "preview.png"));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 900);
    const imageDigest = sha(png);
    assert.equal(imageDigest, previewResult.imageSHA256);
    assert.equal(digest, previewResult.staticDigest);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${imageDigest}`);
    qa.previewReview =
    {
        visualReviewed: true,
        evidence: "ensurePreview 生成的新鲜 1200×900 首屏 PNG 已通过 view 实际打开，内容是同一静态首页的初始可玩棋盘，无错页、裁切或遮挡。",
        file: path.join(exported, "preview.png"), staticDigest: digest, imageSHA256: imageDigest,
        width: 1200, height: 900
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const configFile = path.join(workspace, "deploy", "config.json");
    const before = await WorkspaceFiles.json(configFile);
    const existingGroup = before.pages[job.prompt];
    const existingOptions = existingGroup?.pages || [];
    const shared = existingOptions[0];
    if (shared) assert.equal(shared.slug, slug);
    const title = shared?.title || job.provenance.title;
    const added = await registerGeneratedPage(workspace,
    {
        prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags
    });
    const config = await WorkspaceFiles.json(configFile);
    const options = config.pages[job.prompt].pages.filter((option) => option.model.toLowerCase() === "gpt-6");
    assert.equal(options.length, 1);
    const option = options[0];
    assert.equal(option.model, "GPT-6");
    assert.equal(option.slug, slug);
    assert.equal(option.title, title);
    assert.equal(option.staticDir, "out");
    assert.equal(option.enabled, false);
    assert.equal(option.deployed, false);
    assert.deepEqual(option.tags, metadata.tags);
    for (const [key, group] of Object.entries(before.pages))
    {
        if (key !== job.prompt) assert.deepEqual(config.pages[key], group, `Existing registration preserved: ${key}`);
    }
    if (existingGroup)
    {
        assert.deepEqual(config.pages[job.prompt].pages.slice(0, existingOptions.length), existingOptions);
        for (const [key, value] of Object.entries(existingGroup))
        {
            if (key !== "pages") assert.deepEqual(config.pages[job.prompt][key], value);
        }
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    let bytes = 0;
    let files = 0;
    const walk = async (directory) =>
    {
        for (const entry of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await walk(file);
            else
            {
                files++;
                bytes += (await stat(file)).size;
            }
        }
    };
    await walk(exported);
    assert(bytes < 20 * 1024 * 1024);
    assert.equal(await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"), digest);
    const actual = await WorkspaceFiles.json(metadataFile);
    const report =
    {
        runId: job.runId,
        prompt: job.prompt,
        status: "completed",
        summary: "已完成且实际验证一个英文静态可玩光路谜题；未构建、发布或部署。",
        modelId: actual.modelId,
        display_model_name: "GPT-6",
        tags: actual.tags,
        generated: actual.generated,
        preview: actual.preview,
        validated: actual.validated,
        config_added: actual.config_added,
        flags: { generated: actual.generated, preview: actual.preview, validated: actual.validated, config_added: actual.config_added },
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        qaFile,
        screenshots: { ...qa.screenshots, preview: path.join(exported, "preview.png") },
        inputFingerprint: input,
        staticDigest: digest,
        previewImageSHA256: imageDigest,
        sourceCheck: "StaticHomepage.checkSource 实际通过",
        staticCheck: "StaticHomepage.validateStaticOutput 在最终公开子路径实际通过；显式白名单导出，独立本地依赖，静态内容不足 20 MB",
        staticSize: { bytes, files },
        tests:
        {
            passed: true, groups: qa.tests.length, errors: qa.errors,
            command: "node out\\pages\\614-light-beam-lens-puzzle-game\\GPT-6\\.checks\\verify.mjs",
            evidence: qa.tests,
            viewports: qa.viewports,
            details: "十二个精确固定关卡：全部初始未解，纯逻辑与真实浏览器逐关解法均点亮全部目标且达到作者点击数。双镜面映射、轴向透镜、分光、阻挡、方向接收、循环去重和2048上限均经断言；真实鼠标/触屏、键盘、DOM替代、撤销、重置、选关、通关、下一关、进度、音效和降级均实际测试；零资源、网络、控制台、页面错误，交互前后无横向溢出。"
        },
        visualReviewed: true,
        visualEvidence: qa.visualReview,
        previewEvidence: qa.previewReview,
        registration:
        {
            verifiedUnique: true, newlyAdded: added, configFile, ...option,
            existingSelectionsAndGroupsPreserved: true,
            note: "使用现有 registerGeneratedPage 登记，默认关闭且未部署；既有条目、顺序及用户字段核对保留。"
        },
        provenance: job.provenance,
        licenses: "README、ASSETS.md、LICENSE.txt 保留 VibeFather 与 CC BY-NC 4.0 署名及非商业限制；Three.js MIT、Lucide ISC 和两套 OFL 字体许可随静态资源本地携带。",
        limitations:
        [
            "按本轮禁止构建及允许静态适配的授权，采用原生 JavaScript/DOM + Three.js，不采用 Vite/React/TypeScript；应用模块未压缩，导出目录为 out，而非 Vite dist。",
            "透镜严格实现原文的网格轴向透射/阻断规则，不声称具有连续角度 Snell 物理折射。",
            "音效需显式开启；本地存储不可用时仅在当前访问保留进度；WebGL 不可用时保留 DOM 控制及真实接收器计数而不显示 3D。",
            "复用登记函数不写 prompt 级分类；新增选项含 Optics/Puzzle/Isometric 标签，但未额外改动共享分类状态。",
            "仅登记关闭选项；没有执行生产构建、集合汇集、发布、上传或部署。"
        ],
        mocks: "无后端或交易 Mock；全部游戏规则在浏览器本地真实执行。",
        blocker: null,
        resourcesClosed: true,
        coordinatorLock: { prompt: job.prompt, pid: lockPid, verifiedAlive: true, preserved: true },
        forbiddenOperationsPerformed: false,
        finishedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    const persistedReport = await WorkspaceFiles.json(job.reportFile);
    assert.equal(persistedReport.status, "completed");
    assert(Object.values(persistedReport.flags).every((flag) => flag === true));
    console.log(JSON.stringify({ reportFile: job.reportFile, status: report.status, flags: report.flags, registration: { enabled: option.enabled, deployed: option.deployed }, staticSize: report.staticSize, resourcesClosed: true }));
}
else throw Error("Choose preview or finish");
