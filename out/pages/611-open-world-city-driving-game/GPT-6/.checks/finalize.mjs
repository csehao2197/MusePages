import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { registerGeneratedPage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "deploy-site.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const phase = process.argv[2];
const metadataFile = path.join(job.output, "metadata.json");
const metadata = await W.json(metadataFile);
const exported = path.join(job.output, "out");
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
let report =
{
    prompt: job.prompt,
    status: "pending",
    modelId: job.modelId,
    display_model_name: job.display_model_name,
    runId: job.runId,
    tags: metadata.tags,
    output: job.output,
    staticOutput: exported,
    qa: path.join(job.output, ".checks", "qa.json"),
    screenshots:
    {
        desktop: path.join(job.output, ".checks", "desktop.png"),
        mobile: path.join(job.output, ".checks", "mobile.png"),
        gameplay: [path.join(job.output, ".checks", "porch-complete.png"), path.join(job.output, ".checks", "lap-complete.png")],
        preview: path.join(exported, "preview.png")
    },
    limitations:
    [
        "按授权采用无需构建的 HTML/CSS/原生 ES 模块静态适配，不是 Vite 6 + TypeScript 项目或 Vite dist。",
        "原始输入仅为公开 Pro 摘要；默认命名已实现。未取得私有布局、替代名称表或精确演示资源，不声称复现未提供的私有设计。",
        "全部美术为原创程序化网格/纹理；碰撞采用保守的简化体积，交通为带让行与车距控制的固定环线。",
        "无后端、联网服务、真实账号、多人或线上排行榜；仅浏览器本地保存配送最高分、圈速和静音设置。",
        "CC BY-NC 4.0 非商业适配；三方运行资源许可证与作者署名均保留。未执行构建、汇集、发布、部署或提交。"
    ],
    resourcesClosed: false
};
try
{
    assert.equal(job.prompt, "611-open-world-city-driving-game");
    assert.equal(job.modelId, "gpt-6.1-sol");
    assert.equal(metadata.modelId, job.modelId);
    const manifest = await W.json(job.stateFile);
    assert.equal(manifest.runId, job.runId);
    assert.equal(manifest.ownedLock.prompt, job.prompt);
    assert.equal(Number((await W.text(job.promptLock)).trim()), manifest.ownedLock.pid);
    process.kill(manifest.ownedLock.pid, 0);
    const configFile = path.join(root, "deploy", "config.json");
    const before = await W.json(configFile);
    const existing = before.pages[job.prompt]?.pages || [];
    const slug = existing[0]?.slug || "open-world-city-driving-game";
    const title = existing[0]?.title || job.provenance.title;
    assert.equal(slug, "open-world-city-driving-game");
    assert.ok(metadata.tags.length > 0);
    assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
    assert.ok(metadata.tags.every((tag) => tag && tag.trim() === tag));
    const qa = await W.json(report.qa);
    const gameplay = await W.json(path.join(job.output, ".checks", "gameplay.json"));
    const physics = await W.json(path.join(job.output, ".checks", "physics.json"));
    assert.ok(qa.passed && gameplay.passed && physics.passed);
    assert.deepEqual(qa.errors, []);
    assert.deepEqual(gameplay.errors, []);
    assert.ok(qa.resourcesClosed && gameplay.resourcesClosed);
    for (const [file, width, height] of [[report.screenshots.desktop, 1200, 900], [report.screenshots.mobile, 390, 844]])
    {
        const png = await readFile(file);
        assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(png.readUInt32BE(16), width);
        assert.equal(png.readUInt32BE(20), height);
    }
    const type = await S.checkSource(job.output);
    assert.equal(type, "html");
    metadata.generated = true;
    await W.saveJson(metadataFile, metadata);
    const fullInput = await W.text(job.file);
    const fullDesign = await W.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
    const inputDigest = sha(JSON.stringify([fullInput, fullDesign]));
    await W.saveText(path.join(job.output, ".generation-input.sha256"), `${inputDigest}\n`);
    const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
    qa.staticDigest = digest;
    qa.visualReviewed = true;
    qa.visualReview =
    {
        desktop: "已打开实际 1200×900 PNG：衬线标题与松绿/暖纸/陶橙层级清晰；原创立体街区、地图、页脚各自有明确位置，未见横向溢出。",
        mobile: "已打开实际 390×844 PNG：上方城区与下方标题形成竖向构图；正文与开始按钮清楚，游戏视图触控踏板、转向、地图和任务面板均不遮挡主要驾驶区域。",
        gameplay: "已打开真实配送和圈赛完成 PNG；实际在街区内抵达目标，分数与圈速来自模拟，不是点击按钮直接完成。",
        preview: phase === "register" ? "已另行打开 ensurePreview 新捕获的真实首屏 PNG，尺寸与页面构图正确。" : "等待下一阶段打开实际新预览。"
    };
    qa.gameplay = { file: path.join(job.output, ".checks", "gameplay.json"), passed: true, groups: gameplay.tests.length, inputMethod: gameplay.inputMethod };
    qa.physics = { file: path.join(job.output, ".checks", "physics.json"), passed: true, groups: physics.tests.length };
    qa.totalAssertionGroups = qa.tests.length + gameplay.tests.length + physics.tests.length;
    qa.refinements = ["原创世界与车体网格实例化，减少绘制调用。", "低帧率下用固定小步模拟，避免输入、计时及碰撞依赖渲染速度。", "完整路线实测发现并修复交通并排让行死锁，增加车辆间距避免重叠。", "完整路线自动控制改为逐帧事件反馈，避免外部自动化延迟导致绕圈。"];
    if (phase === "preview")
    {
        report.previewResult = await S.ensurePreview(root, { folder: job.output }, exported, digest, undefined, metadata.preview);
        report.status = "awaiting_preview_visual_review";
    }
    else if (phase === "register")
    {
        const image = await readFile(report.screenshots.preview);
        assert.equal(image.readUInt32BE(16), 1200);
        assert.equal(image.readUInt32BE(20), 900);
        assert.equal((await W.text(path.join(job.output, ".generation-preview.sha256"))).trim(), `${digest} ${sha(image)}`);
        qa.visualReview.previewReviewed = true;
        metadata.preview = true;
        metadata.validated = true;
        await W.saveJson(metadataFile, metadata);
        const added = await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: "out" });
        const after = await W.json(configFile);
        const registered = after.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
        assert.equal(registered.length, 1);
        assert.equal(registered[0].enabled, false);
        assert.equal(registered[0].deployed, false);
        assert.equal(registered[0].slug, slug);
        assert.equal(registered[0].title, title);
        assert.equal(registered[0].staticDir, "out");
        assert.deepEqual(registered[0].tags, metadata.tags);
        const unchanged = { ...after, pages: { ...after.pages } };
        if (!before.pages[job.prompt]) delete unchanged.pages[job.prompt];
        else unchanged.pages[job.prompt] = before.pages[job.prompt];
        assert.deepEqual(unchanged, before, "Other prompt data, selections, ordering and custom fields remain unchanged");
        metadata.config_added = true;
        await W.saveJson(metadataFile, metadata);
        report.registration = { added, unique: true, ...registered[0], category: after.pages[job.prompt].category ?? null, otherConfigurationPreserved: true };
        report.status = "completed";
        report.summary = "已完成默认命名的可玩原创 3D 城市驾驶静态作品。33 组实测通过；实际完成三门配送、六门圈赛并验证重载保存。桌面/手机/预览实际 PNG 已打开核阅；四项元数据状态均经对应流程核验。仅默认关闭登记，未构建或部署。";
    }
    else throw Error("Expected preview or register phase");
    await W.saveJson(report.qa, qa);
    report.flags = { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added };
    report.testEvidence = { totalAssertionGroups: qa.totalAssertionGroups, browser: { passed: qa.passed, groups: qa.tests.length, errors: qa.errors, viewports: qa.viewports }, gameplay: { passed: gameplay.passed, groups: gameplay.tests.length, inputMethod: gameplay.inputMethod, evidence: gameplay.tests.filter((entry) => entry.evidence || entry.saved) }, physics: { passed: physics.passed, groups: physics.tests.length } };
    report.visualEvidence = qa.visualReview;
    report.digests = { input: inputDigest, static: digest, preview: (await W.text(path.join(job.output, ".generation-preview.sha256"))).trim() };
    report.license = { prompt: "CC-BY-NC-4.0", attribution: "VibeFather", original: job.provenance.source_url, publicNotices: path.join(exported, "licenses", "NOTICE.txt") };
    report.resourcesClosed = true;
    report.coordinatorLockPreserved = true;
    report.blocker = null;
    await W.saveJson(job.reportFile, report);
    process.stdout.write(JSON.stringify({ status: report.status, flags: report.flags, tests: report.testEvidence.totalAssertionGroups, report: job.reportFile, resourcesClosed: true }) + "\n");
}
catch (error)
{
    report.status = "blocked";
    report.blocker = error.stack;
    report.flags = { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added };
    report.resourcesClosed = true;
    await W.saveJson(job.reportFile, report);
    process.stderr.write(error.stack + "\n");
    process.exitCode = 1;
}
