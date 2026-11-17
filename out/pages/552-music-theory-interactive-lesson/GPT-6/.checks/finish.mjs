import path from "node:path";
import {fileURLToPath} from "node:url";
import {readFile, readdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import {WorkspaceFiles, StaticHomepage} from "../../../../../src/workflows/script/render-prompt-page.mjs";
import {registerGeneratedPage} from "../../../../../src/workflows/script/deploy-site.mjs";

const workspace = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.output, folder);
assert.equal(job.prompt, "552-music-theory-interactive-lesson");
assert.equal(job.modelId, "gpt-6.1-sol");
const manifest = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(manifest.runId, job.runId);
assert.equal(manifest.ownedLock.pid, lockPid);
assert.equal(manifest.ownedLock.prompt, job.prompt);
process.kill(lockPid, 0);
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.ok(metadata.tags.length > 0);
assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(qa.passed, true);
assert.deepEqual(qa.errors, []);
assert.equal(qa.resourcesClosed, true);
const exported = path.join(folder, "out");
const configFile = path.join(workspace, "deploy", "config.json");
const beforeConfig = await WorkspaceFiles.json(configFile);
const shared = beforeConfig.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug ?? "music-theory-interactive-lesson";
const title = shared?.title ?? "Music Theory Interactive Lesson";
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest);
const sha = (value) => createHash("sha256").update(value).digest("hex");
const inputHash = sha(JSON.stringify([await WorkspaceFiles.text(job.file), await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))]));
assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), inputHash);
await StaticHomepage.checkSource(folder);
async function verifySource(directory, relative = "")
{
    for (const entry of await readdir(directory, {withFileTypes: true}))
    {
        const file = path.join(relative, entry.name);
        if (file === "preview.png") continue;
        if (entry.isDirectory()) await verifySource(path.join(directory, entry.name), file);
        else assert.equal(sha(await readFile(path.join(exported, file))), sha(await readFile(path.join(folder, file))), `Source/export mismatch: ${file}`);
    }
}
await verifySource(exported);
if (process.argv[2] === "preview")
{
    const preview = await StaticHomepage.ensurePreview(workspace, {folder, file: metadataFile}, exported, digest, undefined, metadata.preview);
    const bytes = await readFile(path.join(exported, "preview.png"));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 900);
    const evidence = {preview, staticDigest: digest, imageSHA256: sha(bytes), width: 1200, height: 900, flagsNotYetPromoted: metadata};
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "preview-evidence.json"), evidence);
    console.log(JSON.stringify(evidence, null, 2));
}
else if (process.argv[2] === "complete")
{
    const previewEvidence = await WorkspaceFiles.json(path.join(folder, ".checks", "preview-evidence.json"));
    assert.equal(previewEvidence.staticDigest, digest);
    assert.equal(previewEvidence.imageSHA256, sha(await readFile(path.join(exported, "preview.png"))));
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${previewEvidence.imageSHA256}`);
    const screenshots = {};
    for (const name of ["desktop", "mobile", "mobile-exercise"])
    {
        const file = path.join(folder, ".checks", `${name}.png`);
        const bytes = await readFile(file);
        assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        screenshots[name] = {path: file, sha256: sha(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), openedWithView: true};
    }
    qa.visualReviewed = true;
    qa.visualEvidence =
    {
        screenshots,
        preview: {path: path.join(exported, "preview.png"), openedWithView: true, sha256: previewEvidence.imageSHA256},
        assessment: "已实际打开最终桌面、移动端首屏、移动测验画面与新 preview。桌面标题、酸黄与珊瑚主色、舞台图片、圆环及全宽琴键层级清晰；移动首屏圆环与两排琴键完整落在 390×844 内。测验答案触控区域、反馈文字及底部 dock 有清楚对比，长读数正确省略，无横向溢出。"
    };
    qa.resolvedValidationIssues =
    [
        "首次 Node fetch 的 TLS 握手失败；改用成功的 Windows HTTPS 传输取得原始许可图片与 Fontsource 5.3.0 文件，没有绕过 TLS。",
        "初次波形采样过早且测试 analyser 未连接到拉取链；将只用于 QA 的 analyser 接零增益输出并等待后，实测峰值非零。",
        "初次图片断言没有等待原生懒加载；逐图滚动并 decode 后所有图成功加载。",
        "调整移动 dock mini keyboard 为要求的 150px；补充标签点击的圆环映射、测验中其他教学控件的实际静默可视报告及 reduced-motion 胜利动画门控。"
    ];
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const added = await registerGeneratedPage(workspace, {prompt: job.prompt, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: "out"});
    const afterConfig = await WorkspaceFiles.json(configFile);
    const options = afterConfig.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
    assert.equal(options.length, 1);
    const registration = options[0];
    assert.equal(registration.enabled, false);
    assert.equal(registration.deployed, false);
    assert.equal(registration.slug, slug);
    assert.equal(registration.staticDir, "out");
    assert.deepEqual(registration.tags, metadata.tags);
    for (const [key, value] of Object.entries(beforeConfig.pages))
    {
        if (key !== job.prompt) assert.deepEqual(afterConfig.pages[key], value, `Unrelated registration changed: ${key}`);
    }
    for (const [key, value] of Object.entries(beforeConfig))
    {
        if (key !== "pages") assert.deepEqual(afterConfig[key], value);
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const finalMetadata = await WorkspaceFiles.json(metadataFile);
    const report =
    {
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags: finalMetadata.tags,
        generated: finalMetadata.generated,
        preview: finalMetadata.preview,
        validated: finalMetadata.validated,
        config_added: finalMetadata.config_added,
        flags: {generated: finalMetadata.generated, preview: finalMetadata.preview, validated: finalMetadata.validated, config_added: finalMetadata.config_added},
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        qaFile,
        screenshots,
        previewFile: path.join(exported, "preview.png"),
        inputSHA256: inputHash,
        staticDigest: digest,
        previewSHA256: previewEvidence.imageSHA256,
        sourceExportEqualityVerified: true,
        tests: {passed: qa.passed, assertionGroups: qa.assertions.length, assertions: qa.assertions, viewports: qa.viewports, errors: qa.errors, audioEvidence: qa.audioEvidence},
        visualReviewed: true,
        visualEvidence: qa.visualEvidence,
        registration: {added, unique: true, enabled: registration.enabled, deployed: registration.deployed, title: registration.title, slug: registration.slug, unrelatedConfigPreserved: true},
        identityAndLock: {runId: job.runId, ownedLockPid: lockPid, liveCoordinatorVerified: true, actualModelExplicitlySelected: true, lockNotModified: true},
        provenance: job.provenance,
        assetsEvidenceFile: path.join(folder, ".checks", "asset-evidence.json"),
        summary: "已完成单页真实音乐学习核心：24 键实时 Web Audio、音程与调性联动、可拖拽/键盘控制五度圈、九种正确拼写和弦、三组泛用进行、四个实际达成的小胜利、八轮随机根音与重排听辨测验。验证了 440/880 Hz 振荡器与非零波形、10 复音偷声及释放、多指/滑奏、隐藏答案、0/7/8 分成绩与重开、移动端和不同宽度，无浏览器错误或横向溢出。登记默认关闭，未构建或部署。",
        limitations:
        [
            "依照本轮无构建授权使用原生 HTML/CSS/浏览器模块静态适配，不是要求的 Vite 5、React 18、TypeScript、Tailwind 3.4、Motion 工程或 minified dist。",
            "CSS easing 近似圆环弹簧；和弦图形直接更新而非 spring morph，成绩即时更新而非计数动画。基础淡入、按键发光、舞台光束、单次波浪与减少动态效果已实现。",
            "章节文案、任务、测验和课程数据在 content.js；部分动态 UI 标签由 app.js 根据共同状态生成，未采用指定 src/content.ts 目录布局。",
            "学校、人物、数据、地址及联系方式为明确标注的虚构示例，不提供真实报名；浏览器设备的静音开关可能阻止听见声音，QA 验证合成波形而非人工试听。",
            "需求与提供图片使用 CC BY-NC 4.0，仅限非商业用途；商业用途需原作者另行许可。没有后台、外部 API、分析或真实事务。"
        ],
        blocker: null,
        buildsRun: false,
        deploymentsRun: false,
        resourcesClosed: true,
        resolvedValidationIssues: qa.resolvedValidationIssues,
        recordedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    console.log(JSON.stringify({prompt: report.prompt, status: report.status, flags: report.flags, assertionGroups: report.tests.assertionGroups, reportFile: job.reportFile, registration: report.registration}, null, 2));
}
else throw Error("Use preview or complete");
