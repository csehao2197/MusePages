import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "599-cozy-isometric-farm-game");
assert.equal(job.modelId, "gpt-6.1-sol");
assert.equal(job.output, folder);
const manifest = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(pid, manifest.ownedLock.pid);
assert.equal(manifest.ownedLock.prompt, job.prompt);
assert.equal(manifest.runId, job.runId);
process.kill(pid, 0);
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.ok(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0));
assert.equal(new Set(metadata.tags).size, metadata.tags.length);
const config = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
const group = config.pages[job.prompt];
const previous = group?.pages?.[0];
const slug = previous?.slug || "cozy-isometric-farm-game";
const title = previous?.title || "Cozy Isometric Farm Game";
const exported = path.join(folder, metadata.staticDir);
const qa = await WorkspaceFiles.json(path.join(folder, ".checks", "qa.json"));
assert.equal(qa.passed, true);
assert.equal(qa.errors.length, 0);
assert.equal(qa.resourcesClosed, true);
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
if (process.argv[2] === "preview")
{
    const preview = await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
    console.log(JSON.stringify({ preview, digest, image: path.join(exported, "preview.png"), flags: metadata }));
}
else if (process.argv[2] === "finalize")
{
    assert.ok(process.argv.includes("--images-reviewed"), "Requires actual screenshot review before finalization");
    const previewBytes = await readFile(path.join(exported, "preview.png"));
    assert.equal(previewBytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(previewBytes.readUInt32BE(16), 1200);
    assert.equal(previewBytes.readUInt32BE(20), 900);
    const previewHash = createHash("sha256").update(previewBytes).digest("hex");
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${previewHash}`);
    const fingerprint = createHash("sha256").update(JSON.stringify([await WorkspaceFiles.text(job.file), await WorkspaceFiles.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"))])).digest("hex");
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), fingerprint);
    qa.visualReviewed = true;
    qa.visualReview =
    {
        language: "zh-CN",
        imagesOpened: [".checks\\desktop.png", ".checks\\mobile.png", ".checks\\desktop-wide.png", "out\\preview.png"],
        evaluation: "已实际打开全部所列PNG。桌面左右栏与农场场景平衡，暖色衬底和深绿工具有清楚层次，字体一致。手机首屏完整呈现田地及四种工具，标题、状态与控件未被裁剪；后续日程和商店自然纵向滚动，无横向溢出。保留精确SVG投影，窄屏菱形触区小于44px的限制已披露。",
        reviewedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: metadata.staticDir, tags: metadata.tags });
    const registered = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
    const options = registered.pages[job.prompt].pages.filter((option) => option.model === "GPT-6");
    assert.equal(options.length, 1);
    assert.equal(options[0].enabled, false);
    assert.equal(options[0].deployed, false);
    assert.equal(options[0].slug, slug);
    assert.equal(options[0].staticDir, metadata.staticDir);
    assert.deepEqual(options[0].tags, metadata.tags);
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const readme = path.join(folder, "README.md");
    await WorkspaceFiles.saveText(readme, (await WorkspaceFiles.text(readme)).replace("Formal preview and registration evidence is appended only after verification.",
        `Formal \`out\\preview.png\` is a real 1200×900 first-screen capture, opened for visual review. Static and image SHA-256 values match \`.generation-preview.sha256\`; full raw input/DESIGN fingerprint matches \`.generation-input.sha256\`. Unique \`GPT-6\` registration verified at \`${slug}\`, \`enabled=false\`, \`deployed=false\`; all four metadata flags are true. No builds or deployments. Public export is below 20 MB.`));
    let bytes = 0;
    async function size(directory)
    {
        for (const entry of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await size(file);
            else bytes += (await readFile(file)).length;
        }
    }
    await size(exported);
    assert.ok(bytes < 20 * 1024 * 1024);
    await WorkspaceFiles.saveJson(job.reportFile,
    {
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        language: "zh-CN",
        summary: "已完成原创可玩的静态等距农场，完整耕地、种植、浇水、生长、收获、购种、日程推进、本地存档和重置闭环，非静态玩具或虚假经济。",
        tags: metadata.tags,
        generated: metadata.generated,
        preview: metadata.preview,
        validated: metadata.validated,
        config_added: metadata.config_added,
        flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        qaFile: path.join(folder, ".checks", "qa.json"),
        screenshots: { desktop: path.join(folder, ".checks", "desktop.png"), mobile: path.join(folder, ".checks", "mobile.png"), wide: path.join(folder, ".checks", "desktop-wide.png"), preview: path.join(exported, "preview.png") },
        testEvidence: { passed: qa.passed, groups: qa.results.length, results: qa.results, errors: qa.errors, viewports: qa.viewports, staticDigest: digest, previewDigest: previewHash, inputDigest: fingerprint, exportBytes: bytes },
        visualReviewed: true,
        visualEvidence: qa.visualReview,
        registration: { unique: true, option: options[0], enabled: false, deployed: false },
        license: { prompt: "CC-BY-NC-4.0", author: "VibeFather", source: job.provenance.source_url, assets: "原创SVG/CSS；Lucide ISC/Feather MIT；Fraunces及Nunito Sans OFL，许可文本随静态资源保留。" },
        limitations:
        [
            "按本轮明确授权采用HTML/CSS/ES模块静态适配，未执行原始Vite/React/TypeScript生产构建；不是原框架逐字实现。",
            "游戏经济和进度均为真实浏览器内确定性状态，不含后端、多人或云同步；存档仅保留在当前浏览器和源。",
            "保留精确6×6、2:1菱形几何，窄屏单块高度低于44px；支持触屏实测、Tab/Enter/Space及方向键。",
            "移动端工具栏滚动时粘在顶部而非底部，避免覆盖主要内容。",
            "原需求说30块草地，但36块减去明确指定的5块特殊状态应为31块；以精确指定初始坐标为准。",
            "复用现有本地Fontsource字体和Lucide依赖，Nunito Sans使用可变字体而非四个独立文件。",
            "未取得task\\TASK.md文件；本轮明确单任务job作为范围依据，未修改目标或共享日志。",
            "首次QA因动画SVG的Playwright稳定性等待超时；改用菱形中心的真实鼠标/触屏输入后全部通过，未使用强制点击或合成游戏交易。"
        ],
        blocker: null,
        resourcesClosed: qa.resourcesClosed,
        lock: { verifiedCoordinatorPid: pid, preserved: true },
        buildsRun: false,
        deploymentsRun: false,
        writtenAt: new Date().toISOString()
    });
    console.log(JSON.stringify({ status: "completed", flags: metadata, registration: options[0], bytes, reportFile: job.reportFile, resourcesClosed: true }));
}
else throw Error("Use preview or finalize");
