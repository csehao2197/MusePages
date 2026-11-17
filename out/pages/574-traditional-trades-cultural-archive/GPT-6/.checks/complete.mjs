import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "574-traditional-trades-cultural-archive");
assert.equal(job.modelId, "gpt-6.1-sol");
const manifest = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(manifest.runId, job.runId);
assert.equal(manifest.ownedLock.prompt, job.prompt);
assert.equal(manifest.ownedLock.pid, pid);
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
const current = { folder, file: metadataFile };
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.deepEqual(qa.errors, []);
const configFile = path.join(root, "deploy", "config.json");
const beforeConfig = await WorkspaceFiles.json(configFile);
const existing = beforeConfig.pages[job.prompt]?.pages || [];
const slug = existing[0]?.slug || "traditional-trades-cultural-archive";
const title = existing[0]?.title || "Traditional Trades Cultural Archive";
assert.equal(slug, "traditional-trades-cultural-archive");
const staticDigest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(staticDigest, qa.staticDigest);
const raw = await WorkspaceFiles.text(job.file);
const design = await WorkspaceFiles.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const inputDigest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), inputDigest);
await StaticHomepage.checkSource(folder);
if (process.argv[2] === "preview")
{
    const result = await StaticHomepage.ensurePreview(root, current, exported, staticDigest, undefined, metadata.preview);
    console.log(JSON.stringify({ preview: result, image: path.join(exported, "preview.png"), metadataUnchangedUntilManualReview: true }));
}
else if (process.argv[2] === "record-reviewed")
{
    const image = await fs.readFile(path.join(exported, "preview.png"));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    const imageDigest = createHash("sha256").update(image).digest("hex");
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${staticDigest} ${imageDigest}`);
    for (const name of ["index.html", "style.css", "app.js"])
    {
        assert.deepEqual(await fs.readFile(path.join(folder, name)), await fs.readFile(path.join(exported, name)));
    }
    assert.ok(metadata.tags.length > 0);
    assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
    assert.ok(metadata.tags.every((tag) => tag.trim() === tag && tag.length > 0 && !/gpt|placeholder|574/i.test(tag)));
    qa.visualReviewed = true;
    qa.visualReview = {
        reviewedAt: new Date().toISOString(),
        method: "实际使用 view 工具打开桌面、移动、档案列表、桌面故事和移动故事 PNG；另行打开 ensurePreview 新生成的 1200×900 preview.png。",
        observations: [
            "桌面：奶油白大号衬线标题与金色斜体建立层级；原创灯下修笔双手插画形成右侧视觉重心，留白和边界清晰。",
            "档案：四列原创工具版画与编号、城市信息对齐；修复悬停描述导致的卡片顶端不齐。",
            "移动：390px 下品牌、标题、按钮和双列档案适配；改善小屏统计文字并添加 320px 标题缩放。",
            "故事：桌面图文分栏、移动纵向排列，正文对比和行距清晰；长文在原生对话框内部正常滚动。",
            "所有图像为真实网页截图而非设计稿；全英文和非纪实插画/虚构故事提示可见。"
        ],
        screenshotsOpened: [...qa.screenshots, path.join(exported, "preview.png")],
        refinements: ["修复档案卡片顶部对齐", "增加每篇故事的独立观察段至 200–300 英文词", "修复 Chromium v 模式电话 pattern 转义", "优化窄屏标题和统计字号"]
    };
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.generated = true;
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const added = await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: metadata.staticDir, tags: metadata.tags });
    const savedConfig = await WorkspaceFiles.json(configFile);
    const options = savedConfig.pages[job.prompt].pages.filter((option) => option.model === "GPT-6");
    assert.equal(options.length, 1);
    const option = options[0];
    assert.equal(option.enabled, false);
    assert.equal(option.deployed, false);
    assert.equal(option.slug, slug);
    assert.equal(option.title, title);
    assert.equal(option.staticDir, "out");
    assert.deepEqual(option.tags, metadata.tags);
    for (const [key, value] of Object.entries(beforeConfig.pages))
    {
        if (key !== job.prompt)
        {
            assert.deepEqual(savedConfig.pages[key], value, `Unrelated registration changed: ${key}`);
        }
    }
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const report = {
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
        input: job.file,
        provenance: job.provenance,
        inputDigest,
        staticDigest,
        previewImageDigest: imageDigest,
        qaFile,
        screenshots: { desktop: path.join(folder, ".checks", "desktop.png"), mobile: path.join(folder, ".checks", "mobile.png"), preview: path.join(exported, "preview.png"), supplementary: qa.screenshots.slice(2) },
        tests: { passed: qa.passed, groupsPassed: qa.tests.length, checks: qa.tests, errors: qa.errors, viewports: qa.viewports, extraWidths: [320, 768], actualCommand: "node out\\pages\\574-traditional-trades-cultural-archive\\GPT-6\\.checks\\verify.mjs", productionBuildRun: false },
        visualReviewed: qa.visualReviewed,
        visualEvidence: qa.visualReview,
        registration: { verifiedUnique: true, added, configFile, prompt: job.prompt, ...option, otherRegistrationsPreserved: true },
        lock: { verified: true, coordinatorPid: pid, manifestOwnedLockMatched: true, retained: true, releasedOrReacquired: false },
        features: ["12 个职业的独立版画、200–300 英文词虚构故事及可访问弹窗", "职业分类、城市/名称/拼音搜索与空态", "12 组受限音量合成音效、主动开启悬停音效", "15 个可键盘访问的示意地图站点及档案联动", "12 职业概念对比、键盘滑杆及循环切换", "仅本地表单校验/确认和浏览器访问计数", "真实可下载原创 SVG 素材页"],
        limitations: [
            "以授权纯静态 HTML/CSS/JavaScript 替代 React/Vite/TypeScript、Tailwind、Framer Motion 及运行时路由；无构建。",
            "原创本地 SVG 版画替代生成照片；时光对比为工作语境概念插画，不是十年前/现在的历史实拍。",
            "全部可见内容为英文；中文题名和书法改编为英文衬线及 VT 标记，职业名附拉丁字母转写。",
            "故事均标明虚构；城市关联来自原始创作简报，额外三站为待探索点；没有伪称真实 28 位匠人采访、真实地址或普遍濒绝。",
            "未安装 EdgeOne skill、未创建 Edge Functions/KV 服务或部署；表单不发送/保存姓名电话，访问数仅当前浏览器 localStorage，声音非实录。",
            "地图为示意图；素材下载为原创单个 SVG 资料页而非纪实照片 ZIP。",
            "未创建缺失的 task\\TASK.md；读取现有 progress.log 后依当前任务授权执行，未改共享状态、协调日志或现有辅助脚本。"
        ],
        blocker: null,
        resourcesClosed: true,
        resourceEvidence: { qaBrowserClosed: qa.resourcesClosed, qaServerClosed: qa.resourcesClosed, ensurePreviewReturnedAfterOwnCleanup: true, coordinatorLockHolderUntouched: true },
        summary: "已完成该单项全英文静态文化档案首页；静态/桌面/移动/键盘交互及真实截图视觉验收通过，四项元数据均为实际验证后的 true。发布配置仅禁用登记，未构建或部署。",
        completedAt: new Date().toISOString()
    };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    console.log(JSON.stringify({ prompt: job.prompt, status: report.status, flags: report.flags, tests: report.tests.groupsPassed, visualReviewed: true, registration: { enabled: option.enabled, deployed: option.deployed }, report: job.reportFile }));
}
else
{
    throw Error("Use preview, then view the actual PNGs, then record-reviewed.");
}
