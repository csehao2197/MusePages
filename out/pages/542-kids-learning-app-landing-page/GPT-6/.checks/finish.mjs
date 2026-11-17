import path from "node:path";
import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const qaFile = path.join(folder, ".checks", "qa.json");
const sha = (value) => createHash("sha256").update(value).digest("hex");
let report;
try
{
    const durable = await WorkspaceFiles.json(job.stateFile);
    const pid = Number((await readFile(job.promptLock, "utf8")).trim());
    assert.equal(job.prompt, "542-kids-learning-app-landing-page");
    assert.equal(job.modelId, "gpt-6.1-sol");
    assert.equal(durable.runId, job.runId);
    assert.equal(durable.activePrompt, job.prompt);
    assert.equal(durable.ownedLock.prompt, job.prompt);
    assert.equal(durable.ownedLock.pid, pid);
    process.kill(pid, 0);
    const metadata = await WorkspaceFiles.json(metadataFile);
    const qa = await WorkspaceFiles.json(qaFile);
    assert.equal(metadata.modelId, job.modelId);
    assert.equal(metadata.generated, true);
    assert.equal(metadata.staticDir, "out");
    assert.equal(qa.passed, true);
    assert.equal(qa.resourcesClosed, true);
    assert.equal(qa.visualReviewed, true);
    assert(metadata.tags.length > 0 && metadata.tags.every((tag) => tag && tag === tag.trim()) && new Set(metadata.tags).size === metadata.tags.length);
    const inputDigest = sha(JSON.stringify([await readFile(job.file, "utf8"), await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8")]));
    assert.equal((await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim(), inputDigest);
    await StaticHomepage.checkSource(folder);
    const configFile = path.join(root, "deploy", "config.json");
    const before = await WorkspaceFiles.json(configFile);
    const shared = before.pages[job.prompt];
    const entries = Array.isArray(shared) ? shared : shared?.pages || [];
    const slug = entries[0]?.slug || "kids-learning-app-landing-page";
    const title = entries[0]?.title || job.provenance.title;
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    if (process.argv[2] === "preview")
    {
        const preview = await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
        qa.previewCapture = { result: preview, file: path.join(exported, "preview.png"), staticDigest: digest };
        await WorkspaceFiles.saveJson(qaFile, qa);
        console.log(JSON.stringify({ preview, file: qa.previewCapture.file }));
    }
    else if (process.argv[2] === "register")
    {
        assert.equal(qa.previewVisualReviewed, true);
        const previewFile = path.join(exported, "preview.png");
        const png = await readFile(previewFile);
        assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(png.readUInt32BE(16), 1200);
        assert.equal(png.readUInt32BE(20), 900);
        const imageDigest = sha(png);
        assert.equal((await readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim(), `${digest} ${imageDigest}`);
        metadata.preview = true;
        metadata.validated = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const added = await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: metadata.staticDir });
        const after = await WorkspaceFiles.json(configFile);
        const registered = after.pages[job.prompt].pages.filter((entry) => entry.model === "GPT-6");
        assert.equal(registered.length, 1);
        assert.equal(registered[0].slug, slug);
        assert.equal(registered[0].title, title);
        assert.equal(registered[0].staticDir, "out");
        assert.deepEqual(registered[0].tags, metadata.tags);
        if (added)
        {
            assert.equal(registered[0].enabled, false);
            assert.equal(registered[0].deployed, false);
        }
        const beforeOther = structuredClone(before);
        const afterOther = structuredClone(after);
        delete beforeOther.pages[job.prompt];
        delete afterOther.pages[job.prompt];
        assert.deepEqual(afterOther, beforeOther);
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        let staticBytes = 0;
        const staticFiles = [];
        async function inventory(directory)
        {
            for (const entry of await readdir(directory, { withFileTypes: true }))
            {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) await inventory(file);
                else
                {
                    const info = await stat(file);
                    staticBytes += info.size;
                    staticFiles.push(path.relative(exported, file));
                }
            }
        }
        await inventory(exported);
        assert(staticBytes < 20 * 1024 * 1024);
        const assets = [];
        for (const name of ["hero-companions", "learning-playground", "calm-corner"])
        {
            const filename = `${name}.webp`;
            const original = await readFile(path.join(folder, "public", "images", filename));
            assert.equal(sha(await readFile(path.join(exported, "images", filename))), sha(original));
            assets.push({ filename, source: `https://media.vibefather.ai/assets/21e11a21-3f2a-4103-8f50-f7f622e8e2dd/${filename}`, bytes: original.length, sha256: sha(original) });
        }
        report =
        {
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
            flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
            output: folder,
            staticOutput: exported,
            publicPath: `/pages/${slug}/GPT-6/index.html`,
            qaFile,
            screenshots: { ...qa.screenshots, desktopFull: path.join(folder, ".checks", "desktop-full.png"), mobileFull: path.join(folder, ".checks", "mobile-full.png"), preview: previewFile },
            summary: "已完成 Mallowpath 英文黏土风格首页及真实浏览器交互预览，未构建、未部署。",
            implementation: ["三张指定原始素材、本地七款 Latin 字体、原包 Lucide 内联 SVG、CSS 实时蓝色手机。", "三个年龄段各两道阅读和数学练习；全部单词拆音、特定提示、正确反馈、下一题、暂停与重新开始。", "共享年龄课程与家长下一步，两个样例周期的真实数组、计算指标/占比与可访问表格。", "月付/年付派生价格，年龄/偏好/时长本地例程表单、三种时长分配、调整、键盘焦点陷阱、Escape 关闭与焦点恢复。", "仅接受设备本地英语语音，远程声音明确拒绝；无声音仍可完整使用练习。"],
            tests: { passed: qa.passed, assertions: qa.assertions, assertionCount: qa.assertions.length, viewports: qa.viewports, errors: qa.errors, externalRequests: qa.externalRequests, staticChecked: qa.staticChecked, screenshotMethod: "真实 Chromium，DPR 1；1200×900 桌面、390×844 手机；另有已实际绘制整页截图。" },
            visualReviewed: true,
            visualEvidence: qa.visualEvidence,
            previewVisualReviewed: true,
            previewEvidence: qa.previewVisualEvidence,
            digests: { input: inputDigest, static: digest, previewImage: imageDigest, previewRecord: `${digest} ${imageDigest}` },
            assets,
            provenance: job.provenance,
            sourceAttribution: "VibeFather 原始 prompt；CC BY-NC 4.0。README、ASSETS、LICENSE 与字体/图标原许可证已保留。素材作者为 VibeFather，非本次模型生成。",
            registration: { verifiedUnique: true, added, option: registered[0], disabled: registered[0].enabled === false, deployed: registered[0].deployed, otherConfigPreserved: true, configFile },
            staticBoundary: { checked: true, bytes: staticBytes, files: staticFiles, privateQAExcluded: true },
            limitations: ["按用户明确授权改为无需构建的 HTML/CSS/浏览器 JavaScript 静态适配，不使用原需求 Vite/React 运行时，不执行 npm build 或 TypeScript/Vite 编译；源码格式化保留，未做生产压缩。", "全部课程状态、家长指标和例程仅为本页内存预览，刷新重置；不提供账户、后台、支付、订阅或持久化。", "朗读取决于设备本地英语声音；测试分别模拟远程-only/本地声音，未声称设备一定安装真实本地语音。", "仅非商业模板使用；商业使用需另行授权。", "task\\TASK.md 当前不存在；本轮范围与权限以已核实的 current-job 和用户单任务指令为准。"],
            refinements: ["修复导航 Plans 链接小于 44px 的触控宽度。", "查看初次整页截图后，补充逐图 decode/滚动绘制，确保下方两张素材真实出现在整页证据中。", "压缩移动首屏留白并合并年龄行，默认阅读答案全部位于 844px 首屏；保持点击目标至少 44px。", "使用顶部对齐稳定长篇阅读切换时的左侧文字位置；修正字体署名为实际许可证持有人。"],
            blocker: null,
            lockEvidence: { prompt: job.prompt, pid, verifiedAlive: true, durableManifestMatches: true, coordinatorHelperUnmodified: true },
            resourcesClosed: qa.resourcesClosed,
            buildsRun: false,
            deploymentRun: false,
            nestedAgentsUsed: false
        };
        await WorkspaceFiles.saveJson(job.reportFile, report);
        console.log(JSON.stringify({ status: report.status, flags: report.flags, assertionCount: report.tests.assertionCount, reportFile: job.reportFile }));
    }
    else throw Error("Expected preview or register stage");
}
catch (error)
{
    const metadata = await WorkspaceFiles.json(metadataFile).catch(() => null);
    const qa = await WorkspaceFiles.json(qaFile).catch(() => null);
    report = { prompt: job.prompt, status: "blocked", modelId: job.modelId, display_model_name: "GPT-6", tags: metadata?.tags || [], flags: metadata ? { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added } : null, output: folder, qaFile, screenshots: qa?.screenshots || {}, blocker: `本项后续验证或登记阶段存在真实阻塞：${error.message}`, resourcesClosed: qa?.resourcesClosed ?? true, buildsRun: false, deploymentRun: false };
    await WorkspaceFiles.saveJson(job.reportFile, report);
    console.error(error);
    process.exitCode = 1;
}
