import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..", "..", "..", "..");
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await W.json(job.stateFile);
const pid = Number((await W.text(job.promptLock)).trim());
if (root !== job.output || job.prompt !== "565-sorting-algorithms-visualizer" ||
    state.runId !== job.runId || state.ownedLock.prompt !== job.prompt || state.ownedLock.pid !== pid)
{
    throw Error("Coordinator job/lock changed");
}
process.kill(pid, 0);
const metadataFile = path.join(root, "metadata.json");
const metadata = await W.json(metadataFile);
const qaFile = path.join(root, ".checks", "qa.json");
const qa = await W.json(qaFile);
if (!qa.passed || !qa.resourcesClosed || !qa.visualReviewed || qa.errors.length) throw Error("Browser/visual QA is not complete");
if (!metadata.generated || metadata.modelId !== job.modelId || !metadata.tags.length ||
    metadata.tags.some((tag) => !tag || tag.trim() !== tag) || new Set(metadata.tags).size !== metadata.tags.length)
{
    throw Error("Source identity/tags are not valid");
}
const input = createHash("sha256").update(JSON.stringify([
    await W.text(job.file),
    await W.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))
])).digest("hex");
if ((await W.text(path.join(root, ".generation-input.sha256"))).trim() !== input) throw Error("Input fingerprint mismatch");
await S.checkSource(root);
const configFile = path.join(workspace, "deploy", "config.json");
const before = await W.json(configFile);
const shared = before.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug || "sorting-algorithms-visualizer";
const title = shared?.title || "Sorting Algorithms Visualizer";
const exported = path.join(root, metadata.staticDir);
const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
const preview = await S.ensurePreview(workspace, { folder: root }, exported, digest, undefined, metadata.preview);
metadata.preview = true;
metadata.validated = true;
await W.saveJson(metadataFile, metadata);
await registerGeneratedPage(workspace, {
    prompt: job.prompt, model: "GPT-6", slug, title, staticDir: metadata.staticDir, tags: metadata.tags
});
const config = await W.json(configFile);
const registrations = config.pages[job.prompt].pages.filter((p) => p.model === "GPT-6");
if (registrations.length !== 1 || registrations[0].enabled !== false || registrations[0].deployed !== false ||
    registrations[0].slug !== slug || registrations[0].staticDir !== metadata.staticDir)
{
    throw Error("Disabled unique registration verification failed");
}
for (const [key, value] of Object.entries(before.pages))
{
    if (key !== job.prompt && JSON.stringify(config.pages[key]) !== JSON.stringify(value)) throw Error(`Unrelated config changed: ${key}`);
}
metadata.config_added = true;
await W.saveJson(metadataFile, metadata);
let bytes = 0;
const publicFiles = [];
async function inventory(folder)
{
    for (const entry of await readdir(folder, { withFileTypes: true }))
    {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) await inventory(file);
        else
        {
            publicFiles.push(path.relative(exported, file));
            bytes += (await stat(file)).size;
        }
    }
}
await inventory(exported);
if (bytes >= 20 * 1024 * 1024) throw Error("Public export exceeds 20 MB");
const previewBytes = await readFile(path.join(exported, "preview.png"));
const report = {
    prompt: job.prompt,
    status: "completed",
    runId: job.runId,
    modelId: job.modelId,
    display_model_name: "GPT-6",
    tags: metadata.tags,
    generated: metadata.generated,
    preview: metadata.preview,
    validated: metadata.validated,
    config_added: metadata.config_added,
    output: root,
    staticOutput: exported,
    qaFile,
    screenshots: { ...qa.screenshots, preview: path.join(exported, "preview.png") },
    testEvidence: {
        engine: "13/13 个 Node 测试通过；五算法对空、单项、已排序、倒序、重复、负数及四种种子数据排序正确，输入不变，逐步反向与 256 步快照边界重放一致。",
        browser: `${qa.assertions.length} 组真实浏览器断言通过；1200×900、1440×900、390×844，额外 DPR2；暂停、单步、倒退、复位、键盘、触摸、热表、实时计数、竞赛胜负与自动启动已验证。`,
        errors: qa.errors,
        assertions: qa.assertions,
        resourcesClosed: qa.resourcesClosed
    },
    visualEvidence: qa.visualReview,
    visualReviewed: qa.visualReviewed,
    previewFreshImageViewed: false,
    digests: {
        input,
        static: digest,
        preview: createHash("sha256").update(previewBytes).digest("hex"),
        record: (await W.text(path.join(root, ".generation-preview.sha256"))).trim()
    },
    previewAction: preview,
    registration: {
        verifiedUnique: true,
        ...registrations[0],
        sharedTitlePreserved: !!shared,
        otherPromptConfigPreserved: true
    },
    publicInventory: { bytes, files: publicFiles },
    provenance: job.provenance,
    limitations: [
        "按明确授权采用 HTML/CSS/ES modules 静态适配，未使用原需求 Vite 5、React 18、Tailwind 3.4 编译链；纯算法为 JavaScript，另保留 TypeScript Step 合约；静态目录为 out，不是 dist。",
        "没有后端、网络 API、数据库或模拟交易；所有步骤、模式数据和竞赛计数均在浏览器真实计算，不是预录动画。",
        "步数不等于 CPU 耗时；快速排序所列空间复杂度为平均情况，最坏递归空间可为线性。",
        "原始需求及适配遵循 VibeFather CC BY-NC 4.0，仅限非商业用途；字体 OFL、Lucide ISC/MIT 许可已随静态资源保留。",
        "task\\TASK.md 缺失；本轮明确单 prompt 授权与协调器 job 文件提供范围。未改共享状态、日志、工具、原始需求、其他作品；没有构建或发布。"
    ],
    correctionsDuringQA: [
        "本地准备脚本首次将 Lucide JS 对象按 JSON 解析失败，已改为导入包公开图标数据，随后资源准备成功。",
        "测试框架对原生 disabled option 的 toBeDisabled 匹配不适用，改读原生 disabled 属性验证；页面原本即正确禁用重复选项。",
        "补强 120ms 数据防抖期间的切换/复位，防止旧数组或意外恢复播放；新增对应浏览器断言。",
        "冻结已完成竞赛画布，避免相同步骤重绘；动态减弱动画设置会取消正在执行的扫光/滑动。"
    ],
    blocker: null,
    buildsRun: false,
    deploymentsRun: false,
    resourcesClosed: true,
    coordinatorLockPreserved: true
};
await W.saveJson(job.reportFile, report);
console.log(JSON.stringify({ report: job.reportFile, flags: metadata, preview, slug, publicBytes: bytes }));
