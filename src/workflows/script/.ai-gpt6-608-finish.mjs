import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { WorkspaceFiles as W, StaticHomepage as S } from "./render-prompt-page.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "608-music-streaming-app-with-lyrics");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await W.json(job.stateFile);
const pid = Number((await W.text(job.promptLock)).trim());
assert.equal(state.activePrompt, job.prompt);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, pid);
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const qaFile = path.join(folder, ".checks", "qa.json");
const qa = await W.json(qaFile);
const metadataFile = path.join(folder, "metadata.json");
const metadata = await W.json(metadataFile);
assert.equal(metadata.modelId, job.modelId);
assert.equal(metadata.generated, true);
assert.equal(qa.passed, true);
assert.equal(qa.resourcesClosed, true);
assert.deepEqual(qa.errors, []);
assert.ok(metadata.tags.length && metadata.tags.every(tag => typeof tag === "string" && tag.trim() === tag && tag.length > 0));
assert.equal(new Set(metadata.tags).size, metadata.tags.length);
const configFile = path.join(root, "deploy", "config.json");
const before = await W.json(configFile);
const existingGroup = before.pages[job.prompt];
const shared = (Array.isArray(existingGroup) ? existingGroup : existingGroup?.pages)?.[0];
const slug = shared?.slug || "music-streaming-app-with-lyrics";
const title = shared?.title || job.provenance.title;
const digest = await S.validateStaticOutput(exported, slug, "GPT-6");
assert.equal(digest, qa.staticDigest);
assert.equal(await S.checkSource(folder), "html");
const input = createHash("sha256").update(JSON.stringify([
    await W.text(job.file),
    await W.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"))
])).digest("hex");
assert.equal((await W.text(path.join(folder, ".generation-input.sha256"))).trim(), input);
const sha = async file => createHash("sha256").update(await readFile(file)).digest("hex");

if (process.argv[2] === "preview")
{
    const action = await S.ensurePreview(root, { folder }, exported, digest, undefined, metadata.preview);
    qa.preview = { action, file: path.join(exported, "preview.png"), sha256: await sha(path.join(exported, "preview.png")), staticDigest: digest, visualReviewed: false };
    qa.visualReviewed = true;
    qa.visualReview =
    {
        desktop: "已打开实际 1200×900 PNG：深梅色层级统一，杏色主播放按钮与四联封面突出，衬线标题和边栏比例清晰，无裁切或横向溢出。",
        mobile: "已打开实际 390×844 PNG：精简首屏文案后，播放与加入队列按钮完整可见，固定播放器上方露出显著封面；导航、留白与文字对比清晰。",
        nowPlaying: "已打开额外桌面与移动播放页 PNG：原始唱片纹理、同步歌词侧线及时间标记可读，移动界面不重复完整传输控件。",
        refinements: ["移动首页压缩重复标题区与字号，增加首屏封面露出", "区分 Add to queue 与 Open queue 的动作标签", "静态服务缺少 Range 时，以完整本地 WAV Blob 保证真实音频跳转"]
    };
    qa.screenshotDigests = { desktop: await sha(qa.screenshots.desktop), mobile: await sha(qa.screenshots.mobile) };
    await W.saveJson(qaFile, qa);
    console.log(JSON.stringify({ action, preview: qa.preview.file, sha256: qa.preview.sha256, awaitingFreshPreviewVisualReview: true }));
}
else if (process.argv[2] === "complete")
{
    assert.equal(qa.visualReviewed, true);
    assert.equal(await sha(qa.screenshots.desktop), qa.screenshotDigests.desktop);
    assert.equal(await sha(qa.screenshots.mobile), qa.screenshotDigests.mobile);
    assert.equal(await sha(path.join(exported, "preview.png")), qa.preview.sha256);
    assert.equal(await S.ensurePreview(root, { folder }, exported, digest, undefined, true), "preserved");
    const fingerprint = (await W.text(path.join(folder, ".generation-preview.sha256"))).trim();
    assert.equal(fingerprint, `${digest} ${qa.preview.sha256}`);
    qa.preview.visualReviewed = true;
    qa.preview.visualAssessment = "已打开本次 ensurePreview 真实 1200×900 首屏 PNG，与最终静态首页一致；四联封面、标题、主按钮和常驻播放器清晰，未见错位、遮挡或空白。";
    metadata.preview = true;
    metadata.validated = true;
    await W.saveJson(metadataFile, metadata);
    await registerGeneratedPage(root, { prompt: job.prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const after = await W.json(configFile);
    for (const [prompt, group] of Object.entries(before.pages))
    {
        if (prompt !== job.prompt) assert.deepEqual(after.pages[prompt], group, `Unrelated registration changed: ${prompt}`);
    }
    const options = after.pages[job.prompt].pages;
    const matched = options.filter(option => option.model === "GPT-6");
    assert.equal(matched.length, 1);
    const registered = matched[0];
    assert.equal(registered.enabled, false);
    assert.equal(registered.deployed, false);
    assert.equal(registered.slug, slug);
    assert.equal(registered.title, title);
    assert.equal(registered.staticDir, "out");
    assert.deepEqual(registered.tags, metadata.tags);
    metadata.config_added = true;
    await W.saveJson(metadataFile, metadata);
    await W.saveJson(qaFile, qa);
    const readme = await W.text(path.join(folder, "README.md"));
    await W.saveText(path.join(folder, "README.md"), readme.replace("Browser and visual verification pending.",
        `Passed ${qa.tests.length} recorded verification groups in Chromium at 1200×900, 1440×900, and 390×844 (DPR 1). No HTTP/resource/request/console/page errors or page-level horizontal overflow were observed across all three views before and after interaction. All six tracks were individually played using real decoded WAV audio. A nonzero Web Audio analyser waveform and advancing HTMLAudio currentTime were asserted; this verifies software audio signal, not physical loudspeaker audibility.\n\nPlayback/navigation continuity, synchronized and clickable lyrics, keyboard seeking, volume/mute, natural queue advance/final stop/replay, queue edits and focus return, local comments/likes/saves/search, paused reload, confirmed reset, unavailable storage, and reduced motion passed. Both actual desktop/mobile Library PNGs and both additional Now Playing PNGs were opened and visually reviewed. The mobile hero was refined to reveal cover art above the fixed player. The fresh \`ensurePreview\` 1200×900 first-screen PNG was also opened and reviewed. Static and screenshot SHA-256 fingerprints were verified.\n\nLocal WAVs are fully fetched into Blob URLs before playback, so seeking works even on static hosts without byte-range support. These are the six real bundled files, not streams or simulated output. Public resources remain below 20 MB.\n\nRegistration was verified unique with \`enabled: false\`, \`deployed: false\`. All previous configuration entries were preserved. No production build, dist, publish, or deployment ran.`));
    const saved = await W.json(metadataFile);
    const report =
    {
        prompt: job.prompt,
        status: "completed",
        modelId: job.modelId,
        display_model_name: "GPT-6",
        tags: saved.tags,
        flags: { generated: saved.generated, preview: saved.preview, validated: saved.validated, config_added: saved.config_added },
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        metadata: metadataFile,
        inputFingerprint: input,
        staticDigest: digest,
        qaFile,
        screenshots: { ...qa.screenshots, nowPlayingDesktop: path.join(folder, ".checks", "now-playing-desktop.png"), nowPlayingMobile: path.join(folder, ".checks", "now-playing-mobile.png"), preview: qa.preview.file },
        screenshotDigests: qa.screenshotDigests,
        preview: qa.preview,
        tests: { passed: qa.passed, recordedGroups: qa.tests.length, assertions: qa.tests, errors: qa.errors, viewports: qa.viewports, audio: qa.audio, staticBytesBeforePreview: qa.staticBytes },
        visualReviewed: qa.visualReviewed,
        visualEvidence: qa.visualReview,
        provenance: job.provenance,
        registration: { unique: true, config: configFile, prompt: job.prompt, ...registered, existingOtherGroupsPreserved: true },
        summary: "已完成 Stillform 原创音乐资料库静态首页及榜单/播放视图。六段原创本地音频、真实播放与跳转、音频时间驱动歌词、队列及本地评论收藏均经浏览器验证；桌面与移动截图及最终预览已实际打开审阅。",
        limitations: [
            "按本轮授权采用无构建原生 HTML/CSS/ES 模块静态适配，不声称使用原始 Vite/React/TypeScript/Tailwind/Motion 栈。",
            "六段音频是原创程序合成的 18 秒器乐预览，歌词为原创同步伴读文本，并非演唱录音；未使用任何商业音乐、采样或现有歌词。",
            "无后端、账户、多用户评论、真实在线榜单或音乐流服务；所有人物、评论、播放量和排名均明确为虚构示例。",
            "收藏、点赞、评论及队列仅保存在当前设备；浏览器禁用存储时退化为内存会话；重新加载暂停于 0:00。",
            "已验证浏览器解码音频信号和实际时间推进，未把软件测试声称为物理扬声器试听。",
            "原始需求及适配遵循 CC BY-NC 4.0；指定封面按模板明确再分发许可保留署名，字体与图标许可证随静态资源保留。",
            "仅登记且保持关闭/未部署；未运行生产构建、dist、publish 或上传。"
        ],
        blocker: null,
        resourcesClosed: qa.resourcesClosed,
        coordinatorLockPreserved: { pid, prompt: job.prompt, stillAlive: true },
        buildsRun: false,
        deploymentsRun: false,
        completedAt: new Date().toISOString()
    };
    await W.saveJson(job.reportFile, report);
    console.log(JSON.stringify({ status: report.status, flags: report.flags, tests: report.tests.recordedGroups, report: job.reportFile, registration: { enabled: registered.enabled, deployed: registered.deployed }, resourcesClosed: true }));
}
else throw Error("Choose preview or complete.");
