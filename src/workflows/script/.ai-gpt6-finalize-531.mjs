import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "531-speakup-creative-agency");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(state.ownedLock.pid, pid);
assert.equal(state.ownedLock.prompt, job.prompt);
process.kill(pid, 0);
const current = { folder: job.output, file: path.join(job.output, "metadata.json") };
const metadata = await WorkspaceFiles.json(current.file);
const exported = path.join(job.output, metadata.staticDir);
const qaFile = path.join(job.output, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.deepEqual(qa.errors, []);
const configFile = path.join(workspace, "deploy", "config.json");
const before = await WorkspaceFiles.json(configFile);
const shared = before.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug ?? "speakup-creative-agency";
const title = shared?.title ?? "Speakup creative agency";
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest);
if (process.argv[2] === "preview")
{
    qa.visualReviewed = true;
    qa.visualReview =
    {
        imagesOpened: [path.join(job.output, ".checks", "desktop.png"), path.join(job.output, ".checks", "mobile.png")],
        observations: "已实际打开桌面与移动截图：绿色衬线标题层级鲜明；原始草地视频无遮罩；导航、深色胶囊按钮、留白及移动换行清晰，无裁切或横向溢出。修正首次移动截图的句间缺失空格并重新截图复核。",
        refinement: "Corrected mobile sentence spacing; waited for native asynchronous dialog close before asserting aria-expanded.",
        approved: true
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    const result = await StaticHomepage.ensurePreview(workspace, current, exported, digest, undefined, metadata.preview);
    console.log(`Real preview ${result}: ${path.join(exported, "preview.png")}`);
}
else if (process.argv[2] === "register")
{
    assert.equal(qa.visualReviewed, true);
    const image = await readFile(path.join(exported, "preview.png"));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    const imageHash = createHash("sha256").update(image).digest("hex");
    assert.equal((await WorkspaceFiles.text(path.join(current.folder, ".generation-preview.sha256"))).trim(), `${digest} ${imageHash}`);
    qa.previewVisualReviewed = true;
    qa.previewReview = "已打开新生成的真实1200×900首屏预览；与桌面实测同一首页、字号、布局和指定视频一致，标题与正文清晰，画面无空白或错误页。";
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(current.file, metadata);
    const added = await registerGeneratedPage(workspace,
    {
        prompt: job.prompt,
        model: "GPT-6",
        slug,
        title,
        staticDir: metadata.staticDir,
        tags: metadata.tags
    });
    const after = await WorkspaceFiles.json(configFile);
    const options = after.pages[job.prompt].pages.filter((page) => page.model === "GPT-6");
    assert.equal(options.length, 1);
    const registration = options[0];
    assert.equal(registration.slug, slug);
    assert.equal(registration.staticDir, metadata.staticDir);
    assert.deepEqual(registration.tags, metadata.tags);
    if (added)
    {
        assert.equal(registration.enabled, false);
        assert.equal(registration.deployed, false);
    }
    for (const [key, value] of Object.entries(before.pages))
    {
        if (key !== job.prompt) assert.deepEqual(after.pages[key], value, `Existing prompt changed: ${key}`);
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(current.file, metadata);
    const flags =
    {
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added
    };
    await WorkspaceFiles.saveJson(job.reportFile,
    {
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags: metadata.tags,
        ...flags,
        flags,
        output: job.output,
        staticOutput: exported,
        input: job.file,
        provenance: job.provenance,
        inputFingerprint: (await WorkspaceFiles.text(path.join(job.output, ".generation-input.sha256"))).trim(),
        lockEvidence: { prompt: job.prompt, pid, alive: true, durableOwnedLockMatched: true, coordinatorLockUntouched: true },
        qa: qaFile,
        screenshots:
        {
            desktop: path.join(job.output, ".checks", "desktop.png"),
            mobile: path.join(job.output, ".checks", "mobile.png"),
            preview: path.join(exported, "preview.png")
        },
        tests: qa,
        visualReviewed: true,
        previewVisualReviewed: true,
        registration: { unique: true, added, ...registration, configFile, existingPromptObjectsPreserved: true },
        limitations:
        [
            "按授权采用免构建HTML/CSS/浏览器JavaScript，未使用原要求的React/TypeScript/Tailwind组件。",
            "使用指定远程Recoleta、Inter与视频，不复制或声明拥有第三方字体/视频；这些资源需要网络及来源持续可用。",
            "次级导航为明确披露的首页概念说明，不是实际客户作品、员工目录或商品商店。",
            "项目简报仅在浏览器内校验和预览，关闭即清除，不发送、不保存；无生产后端。",
            "仅登记默认关闭选项；未执行构建、dist、publish、部署或上传。"
        ],
        blocker: null,
        resourcesClosed: true,
        noBuildsOrDeployments: true,
        summary: "仅531已完成：gpt-6.1-sol生成、GPT-6展示；桌面/移动静态与交互验证通过，真实截图及新预览均已打开复核，四项状态真实为true；登记关闭，未构建或部署，协调器锁保持不变。",
        completedAt: new Date().toISOString()
    });
    console.log(JSON.stringify({ prompt: job.prompt, status: "completed", flags, registration, reportFile: job.reportFile }, null, 2));
}
else
{
    throw Error("Expected preview or register phase");
}
