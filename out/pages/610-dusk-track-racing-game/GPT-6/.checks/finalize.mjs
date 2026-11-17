import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const state = JSON.parse(await readFile(job.stateFile, "utf8"));
assert.equal(job.prompt, "610-dusk-track-racing-game");
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(Number((await readFile(job.promptLock, "utf8")).trim()), state.ownedLock.pid);
process.kill(state.ownedLock.pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const metadata = JSON.parse(await readFile(metadataFile, "utf8"));
const qa = JSON.parse(await readFile(path.join(folder, ".checks", "qa.json"), "utf8"));
const heat = JSON.parse(await readFile(path.join(folder, ".checks", "full-heat.json"), "utf8"));
assert.equal(qa.passed, true);
assert.equal(heat.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.equal(heat.resourcesClosed, true);
assert.equal(metadata.modelId, "gpt-6.1-sol");
assert.ok(metadata.tags.length && metadata.tags.every((t) => t && t === t.trim()));
assert.equal(new Set(metadata.tags.map((t) => t.toLowerCase())).size, metadata.tags.length);
await S.checkSource(folder);
const configFile = path.join(root, "deploy", "config.json");
const before = JSON.parse(await readFile(configFile, "utf8"));
const group = before.pages[job.prompt];
const shared = group?.pages?.[0] || { slug: "dusk-track-racing-game", title: job.provenance.title };
const digest = await S.validateStaticOutput(exported, shared.slug, "GPT-6");
const sha = (data) => createHash("sha256").update(data).digest("hex");
const inputDigest = sha(JSON.stringify([await readFile(job.file, "utf8"), await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8")]));
assert.equal((await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim(), inputDigest);
const preview = await S.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
assert.equal(preview, "preserved");
const previewHash = sha(await readFile(path.join(exported, "preview.png")));
assert.equal((await readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim(), `${digest} ${previewHash}`);
const imageHashes = {};
for (const name of ["desktop", "mobile", "desktop-racing", "mobile-racing", "podium"])
{
    imageHashes[name] = sha(await readFile(path.join(folder, ".checks", `${name}.png`)));
}
qa.visualReviewed = true;
qa.visualReview =
{
    method: "实际使用 view 工具打开桌面、手机、两张比赛画面、领奖台及最终 preview.png；非仅检查 PNG 头。",
    desktop: "1200×900：左侧透明暗色面板、醒目窄体标题、右侧真实赛车与暖色赛道；按钮和正文对比清楚，留白和层级明确。",
    mobile: "390×844：已调整镜头；赛车完整位于底部面板上方，面板未超过 58vh。开始、控制和声音按钮可用，无横向溢出。",
    race: "手机比赛界面：暂停/声音/时速分隔清晰，排名、圈数、实时时间、固定小地图及双侧触控不重叠；越界提示来自真实驾驶。",
    preview: "已打开 ensurePreview 新生成的 1200×900 真实首页截图，与当前导出一致。",
    podium: "实际浏览器三圈结束后的领奖台可读，四名车手具有实际独立完赛时间，新最佳圈和重开/清除幽灵按钮清晰。",
    imageHashes,
    reviewedAt: new Date().toISOString()
};
await W.saveJson(path.join(folder, ".checks", "qa.json"), qa);
metadata.generated = true;
metadata.preview = true;
metadata.validated = true;
await W.saveJson(metadataFile, metadata);
await registerGeneratedPage(root, {
    prompt: job.prompt,
    model: "GPT-6",
    slug: shared.slug,
    title: shared.title,
    staticDir: metadata.staticDir,
    tags: metadata.tags
});
const after = JSON.parse(await readFile(configFile, "utf8"));
const registered = after.pages[job.prompt].pages.filter((p) => p.model.toLowerCase() === "gpt-6");
assert.equal(registered.length, 1);
assert.equal(registered[0].enabled, false);
assert.equal(registered[0].deployed, false);
assert.deepEqual(registered[0].tags, metadata.tags);
const oldOthers = structuredClone(before);
const newOthers = structuredClone(after);
delete oldOthers.pages[job.prompt];
delete newOthers.pages[job.prompt];
assert.deepEqual(newOthers, oldOthers);
if (group)
{
    const newGroup = structuredClone(after.pages[job.prompt]);
    newGroup.pages = newGroup.pages.filter((p) => p.model !== "GPT-6");
    const oldGroup = structuredClone(group);
    oldGroup.pages = oldGroup.pages.filter((p) => p.model !== "GPT-6");
    assert.deepEqual(newGroup, oldGroup);
}
metadata.config_added = true;
await W.saveJson(metadataFile, metadata);
const publicFiles = [];
async function walk(directory)
{
    for (const entry of await readdir(directory, { withFileTypes: true }))
    {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) await walk(file);
        else publicFiles.push({ file: path.relative(exported, file), bytes: (await stat(file)).size });
    }
}
await walk(exported);
const report =
{
    prompt: job.prompt,
    status: "completed",
    summary: "已完成可实际驾驶的静态 3D 三圈比赛，通过核心规则、真实浏览器整场比赛和桌面/手机交互验证，已登记但未启用或部署。",
    runId: job.runId,
    modelId: job.modelId,
    display_model_name: "GPT-6",
    tags: metadata.tags,
    generated: metadata.generated,
    preview: metadata.preview,
    validated: metadata.validated,
    config_added: metadata.config_added,
    metadata,
    input: job.file,
    output: folder,
    staticOutput: exported,
    publicPath: `/pages/${shared.slug}/GPT-6/index.html`,
    provenance: job.provenance,
    license: "已保留 VibeFather 署名、CC BY-NC 4.0 提示及来源链接；Three.js MIT 和三套字体 OFL 文件随静态资源保存。",
    lock: { verifiedRunId: state.runId, verifiedPrompt: state.ownedLock.prompt, verifiedPid: state.ownedLock.pid, alive: true, coordinatorLockRetained: true },
    features: [
        "按给定控制点缩放的 1000 米闭合赛道、倾斜弯道、门、障碍物和原创代码车辆/环境",
        "真实油门、刹车、倒车、转向、越界限速及回检查点、碰撞、漂移蓄能与加速",
        "按顺序的检查点与三圈判定、三名对手、实时排序和独立完赛时间、倒计时/暂停/领奖台/重开",
        "浏览器本地最佳圈及幽灵回放/清除、固定小地图、键盘和手机多点触控、默认关闭的合成音效",
        "隐藏页面暂停、清除卡住的输入、减少动态效果、WebGL 回退、一次性质量降级"
    ],
    qaFile: path.join(folder, ".checks", "qa.json"),
    fullHeatFile: path.join(folder, ".checks", "full-heat.json"),
    screenshots: {
        desktop: path.join(folder, ".checks", "desktop.png"),
        mobile: path.join(folder, ".checks", "mobile.png"),
        mobileRace: path.join(folder, ".checks", "mobile-racing.png"),
        podium: path.join(folder, ".checks", "podium.png"),
        preview: path.join(exported, "preview.png")
    },
    tests: {
        passed: true,
        checks: qa.assertions,
        primaryBrowserErrors: qa.errors,
        realBrowserHeat: heat,
        sourceCheck: "StaticHomepage.checkSource passed",
        staticCheck: "StaticHomepage.validateStaticOutput passed",
        sharedOptionsPreserved: true,
        sourceExportEquality: true,
        inputFingerprint: inputDigest,
        staticDigest: digest,
        previewImageSHA256: previewHash,
        previewFingerprintVerified: true,
        publicFiles,
        publicBytes: publicFiles.reduce((sum, item) => sum + item.bytes, 0)
    },
    qaIterationNotes: [
        "首轮规则测试受之前 Reset 提示持续时间影响，已隔离测试状态后通过；游戏 Reset 行为未被绕过。",
        "首轮浏览器等待使用了零高度 body 的可见性条件，已改为等待真实首帧完成标记；仍要求实际可见标题、截图和游戏交互。",
        "首轮手机截图中赛车被开始面板遮住一部分，已调整停放镜头并重新运行全部 QA、重新截图及打开复核。"
    ],
    visualReviewed: true,
    visualEvidence: qa.visualReview,
    registration: {
        unique: true,
        prompt: job.prompt,
        model: "GPT-6",
        option: registered[0],
        enabled: registered[0].enabled,
        deployed: registered[0].deployed
    },
    limitations: [
        "遵照本轮禁止构建的授权边界，以原生 JavaScript 模块和本地 Three.js 静态适配 Vite/TypeScript 方案；未运行生产构建或打包压缩。",
        "这是浏览器内单机街机比赛，对手并非联网玩家；不包含后端、多人或全球榜单。",
        "字体和渲染库依赖仅安装在本模型目录；画面为原创低多边形代码场景，不声称与任何演示截图逐像素一致。",
        "保存受当前浏览器存储权限影响；实际性能受设备 WebGL 能力影响。"
    ],
    missingTaskFile: "task\\TASK.md 不存在；本轮明确单项任务和协调任务清单已提供范围，未改动用户目标或共享日志。",
    blocker: null,
    buildsRun: false,
    deployed: false,
    nestedAgentsUsed: false,
    resourcesClosed: true,
    resourceClosure: "两套 QA 与 ensurePreview 所有自有浏览器和临时静态服务均在 finally 关闭；协调器持有的提示锁进程未改动。",
    reportedAt: new Date().toISOString()
};
await W.saveJson(job.reportFile, report);
const saved = JSON.parse(await readFile(job.reportFile, "utf8"));
assert.equal(saved.status, "completed");
assert.equal(saved.config_added, true);
console.log(JSON.stringify({ reportFile: job.reportFile, status: saved.status, flags: metadata, registration: registered[0], staticDigest: digest }));
