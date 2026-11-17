import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "557-solar-system-3d-explainer");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lockPid);
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const file = path.join(folder, "metadata.json");
const metadata = await WorkspaceFiles.json(file);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.equal(metadata.staticDir, "out");
assert.ok(metadata.tags.length && metadata.tags.every(tag => typeof tag === "string" && tag.trim() === tag && tag.length));
assert.equal(new Set(metadata.tags).size, metadata.tags.length);
const configFile = path.join(workspace, "deploy", "config.json");
const config = await WorkspaceFiles.json(configFile);
const shared = config.pages[job.prompt]?.pages?.[0] ?? { slug: "solar-system-3d-explainer", title: "Solar System 3D Explainer" };
await StaticHomepage.checkSource(folder);
const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await WorkspaceFiles.json(qaFile);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.deepEqual(qa.errors, []);
assert.equal(digest, qa.staticDigest);
for (const name of ["index.html", "styles.css", "main.js", "content.js", "scene.js", "LICENSE"])
{
    assert.deepEqual(await readFile(path.join(folder, name)), await readFile(path.join(exported, name)));
}
const previewEvidenceFile = path.join(folder, ".checks", "preview.json");
if (process.argv[2] === "preview")
{
    const preview = await StaticHomepage.ensurePreview(workspace, { folder, file }, exported, digest, undefined, metadata.preview);
    const image = await readFile(path.join(exported, "preview.png"));
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 900);
    await WorkspaceFiles.saveJson(previewEvidenceFile,
    {
        preview,
        staticDigest: digest,
        imageSHA256: createHash("sha256").update(image).digest("hex"),
        width: 1200,
        height: 900,
        capturedFromActualHomepage: true,
        resourcesClosed: true
    });
    console.log("Actual preview captured. Metadata remains pending visual review.");
}
else if (process.argv[2] === "finalize")
{
    const preview = await WorkspaceFiles.json(previewEvidenceFile);
    assert.equal(preview.staticDigest, digest);
    const png = await readFile(path.join(exported, "preview.png"));
    const imageDigest = createHash("sha256").update(png).digest("hex");
    assert.equal(preview.imageSHA256, imageDigest);
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${imageDigest}`);
    const visualNotes =
    {
        desktop: "已打开实际 1200×900 PNG：衬线标题与金色强调有清晰层次；椭圆轨道、真实球体与右侧事实面板留白均衡，底部时间和天体控件可辨识。暗背景文字对比清晰，无内容截断或横向溢出。",
        mobile: "已打开实际 390×844 PNG：标题、缩放后的三维轨道及事实区形成单列阅读；尺度控件随纵向滚动可达，天体选择条局部横向滚动而非整页溢出。字体层次与边距保持一致。",
        preview: "已另行打开 ensurePreview 新生成的 1200×900 实际首屏，与已检查的桌面布局一致，无错误页、空白或占位截图。"
    };
    qa.visualReviewed = true;
    qa.visualEvidence = visualNotes;
    qa.preview = preview;
    await WorkspaceFiles.saveJson(qaFile, qa);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(file, metadata);
    try
    {
        await registerGeneratedPage(workspace,
        {
            prompt: job.prompt,
            model: "GPT-6",
            slug: shared.slug,
            title: shared.title,
            staticDir: "out",
            tags: metadata.tags
        });
        const after = await WorkspaceFiles.json(configFile);
        const entries = after.pages[job.prompt].pages.filter(page => page.model === "GPT-6");
        assert.equal(entries.length, 1);
        assert.equal(entries[0].slug, shared.slug);
        assert.equal(entries[0].title, shared.title);
        assert.equal(entries[0].staticDir, "out");
        assert.equal(entries[0].enabled, false);
        assert.equal(entries[0].deployed, false);
        assert.deepEqual(entries[0].tags, metadata.tags);
        const beforeOther = structuredClone(config);
        const afterOther = structuredClone(after);
        delete beforeOther.pages[job.prompt];
        delete afterOther.pages[job.prompt];
        assert.deepEqual(afterOther, beforeOther);
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(file, metadata);
        const report =
        {
            prompt: job.prompt,
            status: "completed",
            summary: "已完成真实 WebGL 2 太阳系教学首页，静态、桌面、移动、键盘、触控、尺度与时间核心交互验证通过；仅默认关闭登记，未构建或部署。",
            runId: job.runId,
            modelId: job.modelId,
            display_model_name: "GPT-6",
            tags: metadata.tags,
            flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
            output: folder,
            staticDir: exported,
            original: job.file,
            provenance: job.provenance,
            publicPath: `/pages/${shared.slug}/GPT-6/index.html`,
            qa: qaFile,
            screenshots: { ...qa.screenshots, preview: path.join(exported, "preview.png") },
            tests: qa.tests,
            testCount: qa.tests.length,
            errors: qa.errors,
            visualReviewed: true,
            visualEvidence: visualNotes,
            previewEvidence: preview,
            inputDigest: qa.inputDigest,
            staticDigest: digest,
            registration: { unique: true, model: "GPT-6", slug: shared.slug, title: shared.title, staticDir: "out", tags: entries[0].tags, enabled: entries[0].enabled, deployed: entries[0].deployed, otherConfigPreserved: true },
            limitations:
            [
                "依据用户授权采用无构建原生 WebGL 2 / ES 模块静态适配，未使用需求指定的 Vite / TypeScript / three.js / Tailwind / GSAP；采用系统字体及动态近平面/远平面，不冒称完全复刻指定技术栈。",
                "原始公开需求未包含会员专享章节、精确设计令牌与资产细则；本页为公开简报的原创实现，没有复制或分发私有演示资产。",
                "圆形共面轨道与自选起始相位用于教学，非实时星历；无卫星、物理大气、阴影、真实地理贴图或小行星带几何，仅表现土星主环，环的不透明度为示意。",
                "网站文字分布于 HTML 与 content.js；所有天体数值和教学事实集中于 content.js，不宣称全部界面文字均已配置化。",
                "移动端采用纵向阅读与局部横向天体选择条；真比例天体可能小于像素，实时读数根据当前相机投影改变。",
                "task\\TASK.md 实际不存在；以本次明确单项指令与协调器 job 为授权边界。无后端、无假 API、无秘密读取。",
                "仅登记默认关闭选项；未执行 build、dist、publish、上传或部署。"
            ],
            blocker: null,
            resourcesClosed: true,
            lock: { verifiedLivePid: lockPid, ownedByCoordinator: true, leftUntouched: true }
        };
        await WorkspaceFiles.saveJson(job.reportFile, report);
        console.log(JSON.stringify({ reportFile: job.reportFile, status: report.status, flags: report.flags, tests: report.testCount, resourcesClosed: true }));
    }
    catch (error)
    {
        metadata.config_added = false;
        await WorkspaceFiles.saveJson(file, metadata);
        await WorkspaceFiles.saveJson(job.reportFile, { prompt: job.prompt, status: "blocked", modelId: job.modelId, tags: metadata.tags, flags: metadata, output: folder, qa: qaFile, visualReviewed: true, blocker: error.stack, resourcesClosed: true });
        throw error;
    }
}
else
{
    throw Error("Use preview or finalize.");
}
