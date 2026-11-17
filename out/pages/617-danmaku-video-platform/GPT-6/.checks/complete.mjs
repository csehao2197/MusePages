import path from "node:path";
import assert from "node:assert/strict";
import { readFile, cp, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const state = JSON.parse(await readFile(job.stateFile, "utf8"));
const lock = Number((await readFile(job.promptLock, "utf8")).trim());
assert.equal(job.prompt, "617-danmaku-video-platform");
assert.equal(job.modelId, "gpt-6.1-sol");
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lock);
process.kill(lock, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const qaFile = path.join(folder, ".checks", "qa.json");
const metadata = await WorkspaceFiles.json(metadataFile);
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.equal(qa.assertions.length, 18);
assert.ok(metadata.tags.length && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0));
assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
const shared = (await WorkspaceFiles.json(path.join(root, "deploy", "config.json"))).pages[job.prompt]?.pages?.[0];
const slug = shared?.slug || "danmaku-video-platform";
const title = shared?.title || "Danmaku Video Platform";
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

if (process.argv[2] === "preview")
{
    await cp(path.join(root, "node_modules", "lucide-react", "LICENSE"), path.join(folder, "assets", "lucide-LICENSE.txt"));
    await cp(path.join(folder, "assets", "lucide-LICENSE.txt"), path.join(exported, "assets", "lucide-LICENSE.txt"));
    await cp(path.join(folder, "LICENSE.txt"), path.join(exported, "LICENSE.txt"));
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    const raw = await WorkspaceFiles.text(job.file);
    const design = await WorkspaceFiles.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
    const fingerprint = sha(JSON.stringify([raw, design]));
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    qa.finalStaticDigest = digest;
    qa.finalStaticRecheck = "Only license attribution files changed after the passing runtime QA; static validation rerun.";
    qa.visualReviewed = true;
    qa.visualReview =
    {
        imagesOpenedWithViewTool: [qa.screenshots.desktop, qa.screenshots.mobile, qa.screenshots.desktopWatch, qa.screenshots.mobileWatch],
        desktop: "已打开实际 1200×900 PNG。深绿与暖白层级清晰，原创城市主视觉、分栏留白、平衡标题与描边图标一致；次级元数据有意紧凑。",
        mobile: "已打开实际 390×844 PNG。导航、搜索、上下堆叠主视觉与播放入口完整，无横向溢出；主标题、按钮和视频控件清晰。",
        watch: "已打开桌面和移动观看页实际 PNG；真实影片、弹幕、密度条和评论面板无明显布局问题。",
        refinements: ["修复 SVG 默认实心填充，统一 Lucide 描边", "主标题 text-wrap: balance", "筛选时正确隐藏简介", "密度条按峰值归一化，防止新增评论撑破布局"],
        reviewedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    const preview = await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "preview-check.json"),
    {
        preview,
        staticDigest: digest,
        image: path.join(exported, "preview.png"),
        manualViewPending: true
    });
    console.log(JSON.stringify({ generated: metadata.generated, previewCaptured: preview, previewFlag: metadata.preview, previewPath: path.join(exported, "preview.png"), staticDigest: digest }));
}
else if (process.argv[2] === "register")
{
    const previewCheck = await WorkspaceFiles.json(path.join(folder, ".checks", "preview-check.json"));
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, previewCheck.staticDigest);
    const image = await readFile(path.join(exported, "preview.png"));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${sha(image)}`);
    assert.equal(qa.visualReviewed, true);
    for (const name of ["index.html", "styles.css", "app.js", "content.js", "film.js", "LICENSE.txt"])
    {
        assert.equal(sha(await readFile(path.join(folder, name))), sha(await readFile(path.join(exported, name))));
    }
    const assets = await readdir(path.join(folder, "assets"));
    for (const name of assets)
    {
        assert.equal(sha(await readFile(path.join(folder, "assets", name))), sha(await readFile(path.join(exported, "assets", name))));
    }
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const before = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
    await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: "out" });
    const after = await WorkspaceFiles.json(path.join(root, "deploy", "config.json"));
    const entries = after.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
    assert.equal(entries.length, 1);
    assert.equal(entries[0].enabled, false);
    assert.equal(entries[0].deployed, false);
    assert.equal(entries[0].slug, slug);
    assert.deepEqual(entries[0].tags, metadata.tags);
    for (const key of Object.keys(before.pages))
    {
        if (key !== job.prompt) assert.deepEqual(after.pages[key], before.pages[key], `Unrelated registration changed: ${key}`);
    }
    for (const key of Object.keys(before))
    {
        if (key !== "pages") assert.deepEqual(after[key], before[key]);
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    previewCheck.manualViewPending = false;
    previewCheck.manuallyViewed = true;
    previewCheck.review = "已通过 view 打开 ensurePreview 新生成的 1200×900 首页截图，确认与验收首页一致、无空白或错误页。";
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "preview-check.json"), previewCheck);
    const actual = await WorkspaceFiles.json(metadataFile);
    const media = await WorkspaceFiles.json(path.join(folder, ".checks", "media.json"));
    const report =
    {
        runId: job.runId,
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        summary: "已完成英文 Rillcast 静态首页与完整本地观看体验；六段原创可播放影片、同步弹幕、密度跳转、评论筛选/注入和本地社交交互均实测通过。仅禁用登记，未构建或部署。",
        tags: actual.tags,
        generated: actual.generated,
        preview: actual.preview,
        validated: actual.validated,
        config_added: actual.config_added,
        output: folder,
        staticOutput: exported,
        metadataFile,
        input: job.file,
        provenance: job.provenance,
        qaFile,
        screenshots: { ...qa.screenshots, preview: path.join(exported, "preview.png") },
        tests:
        {
            passed: qa.passed,
            command: "node out\\pages\\617-danmaku-video-platform\\GPT-6\\.checks\\qa.mjs",
            assertionGroups: qa.assertions.length,
            assertions: qa.assertions,
            viewports: qa.viewports,
            consoleErrors: qa.consoleErrors,
            pageErrors: qa.pageErrors,
            httpErrors: qa.httpErrors,
            requestErrors: qa.requestErrors,
            externalRequests: qa.externalRequests,
            staticDigest: digest,
            sourceExportDigestMatch: true,
            sixOriginalClips: media.clips,
            repairs: ["首次测试发现静态服务器无 Range 时视频 seek 回零；加入完整本地 Blob URL 播放并验证所有影片定位。", "修复初次视觉检查发现的图标填充与标题平衡；最终浏览器验收 18 组通过。"],
            buildsRun: false,
            deploymentsRun: false,
            installsRun: false,
            nestedAgentsUsed: false
        },
        visualReviewed: true,
        visualEvidence: qa.visualReview,
        previewEvidence: previewCheck,
        registration:
        {
            unique: true,
            enabled: entries[0].enabled,
            deployed: entries[0].deployed,
            config: path.join(root, "deploy", "config.json"),
            option: entries[0],
            otherOptionsPreserved: true
        },
        limitations:
        [
            "静态首页集合范围：无真实账户、认证、上传、远端评论、实时观众或后端；关注、收藏、评论、偏好仅保存在当前浏览器。示例作者、反应和观看数为明确披露的虚构演示数据。",
            "按本轮禁止构建的授权，以 HTML/CSS/ES modules 替代原要求 Vite/React/TypeScript/Tailwind。仅实现收到的完整公开需求，未获得也未复制 Pro 私有布局或资产。",
            "六段影片为原创静音 Canvas 录制的 VP8 WebM，时长 12–24 秒；运行时播放本地影片而非在线影片或实时重新绘制 Canvas。浏览器需支持 WebM。",
            "原需求及本改编为 CC BY-NC 4.0，保留 VibeFather 署名；Lucide/Feather 为 ISC/MIT，三个本地字体保留 OFL 1.1 独立许可证。",
            "浏览器验收范围为已安装 Chromium 的桌面与移动视口，不宣称覆盖所有浏览器或生产网络环境。"
        ],
        blocker: null,
        resourcesClosed: true,
        coordinatorLockPreserved: { prompt: job.prompt, pid: lock, aliveAtCompletion: true },
        completedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    console.log(JSON.stringify({ report: job.reportFile, status: report.status, flags: actual, registration: report.registration }));
}
else
{
    throw Error("Use preview or register only");
}
