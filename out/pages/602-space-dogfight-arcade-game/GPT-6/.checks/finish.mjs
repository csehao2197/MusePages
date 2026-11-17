import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const workspace = process.cwd();
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const qaFile = path.join(checks, "qa.json");
const metaFile = path.join(folder, "metadata.json");
assert.equal(job.prompt, "602-space-dogfight-arcade-game");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await W.json(job.stateFile);
const lockPID = Number((await W.text(job.promptLock)).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lockPID);
process.kill(lockPID, 0);
const qa = await W.json(qaFile);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.equal(qa.errors.length, 0);
assert.equal(qa.tests.length, 18);
const metadata = await W.json(metaFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.equal(metadata.tags.length > 0, true);
assert.equal(metadata.tags.every(tag => tag === tag.trim() && tag.length > 0), true);
assert.equal(new Set(metadata.tags).size, metadata.tags.length);
const configFile = path.join(workspace, "deploy", "config.json");
const config = await W.json(configFile);
const shared = config.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug ?? "space-dogfight-arcade-game";
const title = shared?.title ?? "Space Dogfight Arcade Game";
assert.equal(slug, "space-dogfight-arcade-game");
const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest);
assert.equal(await S.checkSource(folder), "html");
const rawInput = await W.text(job.file);
const design = await W.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const inputDigest = createHash("sha256").update(JSON.stringify([rawInput, design])).digest("hex");
assert.equal((await W.text(path.join(folder, ".generation-input.sha256"))).trim(), inputDigest);
const hash = async file => createHash("sha256").update(await readFile(file)).digest("hex");

if (process.argv.includes("--preview"))
{
    qa.visualReviewed = true;
    qa.visualReview =
    {
        imagesOpened: ["desktop.png", "mobile.png", "desktop-play.png", "mobile-play.png", "retry.png"],
        findings: "已实际打开桌面、手机标题图及实玩/失败图。深色玻璃卡片、琥珀主按钮与冰蓝 HUD 层级清晰；正文和控制键对比充分。手机战机位于卡片上方、主按钮完整可见；说明在卡片内滚动，实玩摇杆和四键互不遮挡。",
        refinements: ["修复手机首屏战机被卡片遮挡，调整相机目标。", "保持手机启动按钮在内部滚动容器内可见。", "共享重合顶点的岩石径向位移，修复三角面裂隙。"],
        desktopSHA256: await hash(path.join(checks, "desktop.png")),
        mobileSHA256: await hash(path.join(checks, "mobile.png"))
    };
    await W.saveJson(qaFile, qa);
    const action = await S.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview);
    await W.saveJson(path.join(checks, "preview.json"),
    {
        action, file: path.join(exported, "preview.png"), imageSHA256: await hash(path.join(exported, "preview.png")), staticDigest: digest, visualReviewed: false
    });
    console.log(JSON.stringify({ action, preview: path.join(exported, "preview.png"), flags: metadata }));
}
else if (process.argv.includes("--complete"))
{
    assert.equal(qa.visualReviewed, true);
    const preview = await W.json(path.join(checks, "preview.json"));
    const image = await readFile(preview.file);
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    assert.equal(preview.imageSHA256, await hash(preview.file));
    assert.equal((await W.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${preview.imageSHA256}`);
    assert.equal(await S.ensurePreview(workspace, { folder }, exported, digest, undefined, true), "preserved");
    preview.visualReviewed = true;
    preview.visualNote = "已实际打开本次 ensurePreview 生成的 1200×900 PNG，确认是真实 WebGL 标题画面：战机、岩石、玻璃卡片、字体和 Launch patrol 均正常，无错误回退。";
    await W.saveJson(path.join(checks, "preview.json"), preview);
    metadata.preview = true;
    metadata.validated = true;
    await W.saveJson(metaFile, metadata);
    const before = await W.json(configFile);
    await registerGeneratedPage(workspace, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const after = await W.json(configFile);
    const matches = after.pages[job.prompt].pages.filter(option => option.model.toLowerCase() === "gpt-6");
    assert.equal(matches.length, 1);
    assert.equal(matches[0].model, "GPT-6");
    assert.equal(matches[0].enabled, false);
    assert.equal(matches[0].deployed, false);
    assert.equal(matches[0].staticDir, "out");
    assert.equal(matches[0].slug, slug);
    assert.deepEqual(matches[0].tags, metadata.tags);
    const preservedBefore = structuredClone(before);
    const preservedAfter = structuredClone(after);
    delete preservedBefore.pages[job.prompt];
    delete preservedAfter.pages[job.prompt];
    assert.deepEqual(preservedAfter, preservedBefore);
    if (before.pages[job.prompt])
    {
        const group = structuredClone(after.pages[job.prompt]);
        group.pages = group.pages.filter(option => option.model !== "GPT-6");
        assert.deepEqual(group, before.pages[job.prompt]);
    }
    metadata.config_added = true;
    await W.saveJson(metaFile, metadata);
    assert.equal(await S.validateStaticOutput(exported, slug, "GPT-6"), digest);
    const assets = [];
    async function inventory(directory)
    {
        for (const name of await readdir(directory))
        {
            const file = path.join(directory, name);
            if ((await stat(file)).isDirectory()) await inventory(file);
            else assets.push({ path: path.relative(exported, file), bytes: (await stat(file)).size });
        }
    }
    await inventory(exported);
    assert.ok(assets.reduce((sum, item) => sum + item.bytes, 0) < 20 * 1024 * 1024);
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
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        provenance: job.provenance,
        qaFile,
        screenshots:
        {
            desktop: path.join(checks, "desktop.png"),
            mobile: path.join(checks, "mobile.png"),
            desktopGameplay: path.join(checks, "desktop-play.png"),
            mobileGameplay: path.join(checks, "mobile-play.png"),
            retry: path.join(checks, "retry.png"),
            preview: preview.file
        },
        tests:
        {
            source: "StaticHomepage.checkSource 实际通过",
            static: "StaticHomepage.validateStaticOutput 在最终公开子路径实际通过",
            browserGroups: qa.tests.length,
            passed: qa.passed,
            errors: qa.errors,
            viewports: qa.viewports,
            evidence: qa.tests,
            fixtureDisclosure: "碰撞、生命值归零与清波测试将真实弹丸和敌机放置到确定性位置后执行真实碰撞代码；同时独立验证键盘/指针/触摸发射、真实锁定制导和未经修改的敌方追击开火。未将夹具数据冒称人工通关。",
            inputDigest,
            staticDigest: digest,
            previewImageDigest: preview.imageSHA256,
            previewFingerprintVerified: true,
            previewReuseVerification: "preserved"
        },
        visualReviewed: true,
        visualEvidence: qa.visualReview,
        previewVisualReview: preview.visualNote,
        features: ["可操作三维追尾飞行、边界回转", "键盘、指针、手机摇杆", "敌机追击/分离/开火AI", "双方弹丸与碰撞、护盾恢复、滚转短暂无敌", "锁定进度和单发制导导弹", "推进/滚转冷却", "分数、清波成功、递增敌机波次", "护盾耗尽失败、再飞一次和返回标题", "雷达、低动态偏好、合成音效"],
        registration:
        {
            verifiedUnique: true,
            model: "GPT-6",
            title,
            slug,
            enabled: false,
            deployed: false,
            otherConfigPreserved: true
        },
        limitations:
        [
            "获授权的无构建静态适配采用原生 JavaScript/CSS 与本地 three.js，未建立 Vite/TypeScript/Tailwind 编译链；未执行任何构建。",
            "按本轮要求增加分数和清波成功反馈；保留原始无限波次，没有虚构最终战役胜利或后台。",
            "粒子为有界 Mesh 池而非 InstancedMesh；省略导弹尾迹及命中船体自发光，音调序列简化，浏览器模块未压缩。",
            "桌面标题卡40px边距与偏移追尾构图、手机相机朝向和固定可见主按钮为响应式适配；手机手册需要在卡片内滚动。",
            "部分静态标签仍在 HTML/main.js，变量生成句子在 content.js；实际自托管字体为 Oxanium 600、Source Sans 3 400、IBM Plex Mono 400。",
            "仅非商业 CC BY-NC 4.0 提示词改编；保留 VibeFather 署名，商用须另获许可。",
            "未执行 dist、publish、上传或线上验证，登记默认禁用且未部署；task\\TASK.md 缺失，按当前明确单项任务和任务清单授权执行。"
        ],
        blocker: null,
        resourcesClosed: true,
        coordinatorLockPreserved: true,
        buildsRun: false,
        deploymentsRun: false,
        publicAssets: { count: assets.length, bytes: assets.reduce((sum, item) => sum + item.bytes, 0), files: assets },
        summary: "已完成唯一指定太空缠斗作品。18组实际静态/桌面/手机玩法检查通过，零浏览器及资源错误、前后均无横向溢出；已打开两种视口真实截图及新鲜预览完成视觉检查。四项元数据状态均经核验为true，唯一登记保持禁用、未部署，所有自有浏览器和临时服务已关闭。"
    };
    await W.saveJson(job.reportFile, report);
    const saved = await W.json(job.reportFile);
    assert.equal(saved.prompt, job.prompt);
    assert.equal(saved.status, "completed");
    assert.equal(saved.resourcesClosed, true);
    console.log(JSON.stringify({ report: job.reportFile, status: saved.status, flags: metadata, tests: qa.tests.length, registration: report.registration, resourcesClosed: true }));
}
else throw Error("Choose --preview or --complete after actual image review.");
