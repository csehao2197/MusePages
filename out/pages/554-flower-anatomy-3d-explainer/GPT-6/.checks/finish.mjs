import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "554-flower-anatomy-3d-explainer");
assert.equal(job.modelId, "gpt-6.1-sol");
const durable = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(durable.runId, job.runId);
assert.equal(durable.ownedLock.prompt, job.prompt);
assert.equal(durable.ownedLock.pid, pid);
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(qa.passed, true);
assert.equal(qa.errors.length, 0);
assert.equal(qa.resourcesClosed, true);
const configFile = path.join(root, "deploy", "config.json");
const before = await WorkspaceFiles.json(configFile);
const existing = before.pages[job.prompt];
const entries = Array.isArray(existing) ? existing : existing?.pages ?? [];
const slug = entries[0]?.slug ?? "flower-anatomy-3d-explainer";
const title = entries[0]?.title ?? "Flower Anatomy 3D Explainer";
assert.equal(slug, "flower-anatomy-3d-explainer");
await StaticHomepage.checkSource(folder);
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest, "QA must cover the exact final static files");
if (process.argv[2] === "preview")
{
    const outcome = await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
    console.log(JSON.stringify({ outcome, digest, preview: path.join(exported, "preview.png"), metadataUnchangedUntilVisualReview: true }));
}
else if (process.argv[2] === "complete")
{
    const preview = await readFile(path.join(exported, "preview.png"));
    assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(preview.readUInt32BE(16), 1200);
    assert.equal(preview.readUInt32BE(20), 900);
    const previewHash = createHash("sha256").update(preview).digest("hex");
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${previewHash}`);
    const imageEvidence = {};
    for (const name of ["desktop", "mobile", "cutaway", "fertilization"])
    {
        const file = path.join(folder, ".checks", `${name}.png`);
        const image = await readFile(file);
        imageEvidence[name] = { path: file, sha256: createHash("sha256").update(image).digest("hex"), width: image.readUInt32BE(16), height: image.readUInt32BE(20), openedWithView: true };
    }
    imageEvidence.preview = { path: path.join(exported, "preview.png"), sha256: previewHash, width: 1200, height: 900, openedWithView: true };
    qa.visualReviewed = true;
    qa.visualReview =
    {
        reviewedAt: new Date().toISOString(),
        images: imageEvidence,
        findings: [
            "已打开最终桌面与移动 PNG：纸色/墨绿层级清晰，花体为真正着色三维网格，桌面三栏均衡，移动端上下堆叠与可见控件无横向溢出。",
            "首轮移动 PNG 暴露隐藏标签被通用按钮 display 样式覆盖；已增加 [hidden] 强制隐藏并复验默认三标签、44px 触控区域及同列最小 12px 间距。",
            "已打开最终子房剖面与受精截图：修正前侧四分之一开口方向及子房位置，实际可见内部隔室、浅色胚珠与到达胚珠的金色花粉管。",
            "已打开本次 ensurePreview 产生的 1200×900 首屏预览；内容与最终首页一致，无占位图、空白画布或错误页。"
        ]
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const registrationAdded = await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const after = await WorkspaceFiles.json(configFile);
    const registered = after.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
    assert.equal(registered.length, 1);
    assert.equal(registered[0].enabled, false);
    assert.equal(registered[0].deployed, false);
    assert.deepEqual(registered[0].tags, metadata.tags);
    assert.equal(registered[0].slug, slug);
    assert.equal(registered[0].staticDir, "out");
    const projectedAfter = structuredClone(after);
    if (!existing) delete projectedAfter.pages[job.prompt];
    else projectedAfter.pages[job.prompt] = before.pages[job.prompt];
    assert.deepEqual(projectedAfter, before, "Other prompt entries, switches, ordering, weights and config fields preserved");
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    let bytes = 0;
    let files = 0;
    async function count(directory)
    {
        for (const entry of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await count(file);
            else
            {
                bytes += (await stat(file)).size;
                files++;
            }
        }
    }
    await count(exported);
    assert.ok(bytes < 20 * 1024 * 1024);
    const report =
    {
        prompt: job.prompt,
        runId: job.runId,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags: metadata.tags,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        qaFile,
        screenshots: imageEvidence,
        testEvidence: { assertions: qa.assertions.length, passed: qa.passed, errors: qa.errors, viewports: qa.viewports, staticDigest: digest, bytes, files },
        visualReviewed: true,
        visualEvidence: qa.visualReview.findings,
        implementation: "真实 Three.js WebGL 百合参数化网格；六花被、六雄蕊、三裂柱头、花柱、上位三室子房、九枚示意胚珠；可旋转缩放、四态解剖、前四分之一去除的实体剖面、投影标签及聚焦。共用持续挂载画布，四阶段 12 秒授粉、24 个 InstancedMesh 花粉、金色花粉管、五题测验及本机数字最高分均实际运行。",
        registration: { added: registrationAdded, uniqueVerified: true, option: registered[0], unrelatedConfigPreserved: true, category: after.pages[job.prompt].category ?? null, note: "使用现有登记函数；新选项关闭，未执行 dist/publish/上传。该函数没有设置共享分类，未擅自改动配置辅助流程。" },
        provenance: job.provenance,
        license: "已完整读取并保留 VibeFather 署名、CC BY-NC 4.0 链接及非商业限制，Third-party Three.js MIT、Lucide ISC、Fontsource OFL 原文随静态资源保存。",
        inputFingerprint: (await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(),
        lockVerification: { runId: durable.runId, prompt: durable.ownedLock.prompt, pid, alive: true, coordinatorLockPreserved: true },
        limitations: [
            "依据明确授权采用原生 HTML/CSS/ES 模块静态适配，不是原规格的 Vite 5 / React 18 / TypeScript 编译工程；没有执行构建。",
            "解剖使用阻尼过渡，镜头重置/聚焦即时；子房以去除前四分之一网格实现剖面而非运行时 clipping plane。保留真实内部三维隔室及胚珠。",
            "主要课程内容、题目及可变标本颜色/比例集中于 src/content.ts；通用界面提示仍在 HTML/JS 中，低级网格构造尺寸在 flowerScene.js 中。没有提供任意物种自动切换能力。",
            "模型、颗粒、器官尺寸与时序是教学示意，不是精确生物模拟；无后台、API、真实传粉观测或生产服务。",
            "缺失 task/TASK.md，已如实记录；本轮明确单任务授权及现有 progress.log 已核对，未修改目标或日志。"
        ],
        blocker: null,
        buildsRun: false,
        deploymentsRun: false,
        nestedAgentsUsed: false,
        resourcesClosed: true,
        completedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    const saved = await WorkspaceFiles.json(job.reportFile);
    assert.equal(saved.prompt, job.prompt);
    assert.equal(saved.status, "completed");
    console.log(JSON.stringify({ reportFile: job.reportFile, flags: saved.flags, assertions: qa.assertions.length, bytes, registration: registered[0], resourcesClosed: true }));
}
else throw Error("Use preview or complete");
