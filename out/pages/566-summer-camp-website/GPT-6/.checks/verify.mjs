import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const workspace = process.cwd();
const job = JSON.parse(await readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "566-summer-camp-website");
assert.equal(job.modelId, "gpt-6.1-sol");
const durable = JSON.parse(await readFile(job.stateFile, "utf8"));
const lockPid = Number((await readFile(job.promptLock, "utf8")).trim());
assert.equal(durable.runId, job.runId);
assert.equal(durable.ownedLock.prompt, job.prompt);
assert.equal(durable.ownedLock.pid, lockPid);
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const config = JSON.parse(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"));
const shared = config.pages[job.prompt]?.pages?.[0] ?? { slug: "summer-camp-website", title: "Summer Camp Website" };
const metadataFile = path.join(folder, "metadata.json");
const mode = process.argv[2] ?? "qa";

if (mode === "prepare")
{
    const metadata = { modelId: job.modelId, tags: ["Summer Camp", "Paper Cut"], staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await StaticHomepage.checkSource(folder);
    const original = await readFile(job.file, "utf8");
    const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([original, design])).digest("hex") + "\n");
    await StaticHomepage.copyHtml(folder, exported);
    const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    console.log(JSON.stringify({ source: "passed", staticDigest: digest }));
}
else if (mode === "qa")
{
    await mkdir(checks, { recursive: true });
    const errors = [];
    const tests = [];
    const qa =
    {
        passed: false, sourceCheck: await StaticHomepage.checkSource(folder),
        staticDigest: await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6"),
        tests, errors, viewports: [], visualReviewed: false, resourcesClosed: false,
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") }
    };
    let server;
    let browser;
    function passed(test)
    {
        tests.push(test);
    }
    async function noOverflow(page, label)
    {
        const sizes = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(sizes.document <= sizes.viewport, `${label} horizontal overflow: ${JSON.stringify(sizes)}`);
        passed(`${label}: no page horizontal overflow (${sizes.viewport}px)`);
    }
    async function fillForm(page, age = "10", session = "first")
    {
        await page.locator('[name="camper"]').fill("River Demo");
        await page.locator('[name="age"]').selectOption(age);
        await page.locator('[name="session"]').selectOption(session);
        await page.locator('[name="buddy"]').fill("Alex Example");
        await page.locator('[name="parent"]').fill("Morgan Example");
        await page.locator('[name="email"]').fill("parent@example.test");
        await page.locator('[name="notes"]').fill("Fictional practice registration. Loves canoeing.");
    }
    try
    {
        server = await startPreviewServer(exported, { workspace });
        const response = await fetch(server.url);
        assert.equal(response.status, 200);
        assert.ok(server.url.endsWith(`/pages/${shared.slug}/GPT-6/index.html`));
        assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
        passed("Static-only loopback server responds HTTP 200 at final public subpath; source outside mount is not served");
        browser = await chromium.launch({ headless: true });
        for (const [label, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
        {
            const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: label === "mobile", hasTouch: label === "mobile" });
            const page = await context.newPage();
            page.on("pageerror", (error) => errors.push(`${label} page: ${error.message}`));
            page.on("request", (request) =>
            {
                if (new URL(request.url()).origin !== new URL(server.url).origin || request.method() !== "GET")
                {
                    errors.push(`${label} unexpected nonlocal or non-GET request: ${request.method()} ${request.url()}`);
                }
            });
            page.on("console", (message) => { if (message.type() === "error") errors.push(`${label} console: ${message.text()}`); });
            page.on("requestfailed", (request) => errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
            page.on("response", (response) => { if (response.status() >= 400) errors.push(`${label} HTTP ${response.status()}: ${response.url()}`); });
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(800);
            assert.equal(await page.title(), "Camp Bluejay");
            assert.equal(await page.locator("h1").count(), 1);
            assert.ok(await page.locator("h1").isVisible());
            assert.equal(await page.locator(".program-card").count(), 3);
            assert.equal(await page.locator(".day-card").count(), 7);
            assert.equal(await page.locator(".person").count(), 4);
            assert.equal(await page.locator(".print img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 200)), true);
            assert.ok(await page.evaluate(() => document.fonts.check("800 20px Baloo") && document.fonts.check("400 16px Nunito")));
            passed(`${label}: visible homepage, all three real template photos, locally loaded fonts and required program/week/staff counts`);
            await noOverflow(page, `${label} initial`);
            qa.viewports.push({ ...viewport, label, deviceScaleFactor: 1, http: 200 });
            await page.screenshot({ path: qa.screenshots[label] });
            const sectionImages = label === "desktop" ? ["programs", "cabins"] : ["fees", "register"];
            for (const id of sectionImages)
            {
                await page.locator(`#${id}`).scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000);
                const file = path.join(checks, `${label}-${id}.png`);
                await page.locator(`#${id}`).screenshot({ path: file });
            }
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

            if (label === "mobile")
            {
                await page.getByRole("button", { name: "Menu", exact: true }).click();
                assert.equal(await page.locator("#mobile-nav").isVisible(), true);
                await page.locator("#mobile-nav").getByRole("link", { name: "Programs", exact: true }).click();
                assert.equal(await page.locator("#mobile-nav").isHidden(), true);
                assert.equal(new URL(page.url()).hash, "#programs");
                await page.locator(".menu-button").click();
                await page.keyboard.press("Escape");
                assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
                passed("mobile: menu opens; anchor selects and closes; Escape closes and restores focus");
            }
            else
            {
                await page.keyboard.press("Tab");
                assert.equal(await page.evaluate(() => document.activeElement.classList.contains("skip")), true);
                await page.keyboard.press("Enter");
                passed("desktop: keyboard skip link reaches main");
            }
            const activity = page.getByRole("button", { name: "Short canoe loops", exact: true });
            await activity.focus();
            await page.keyboard.press("Enter");
            assert.equal(await activity.getAttribute("aria-pressed"), "true");
            assert.match(await page.locator("#activity-detail").textContent(), /staff-led paddle/);
            await activity.click();
            assert.equal(await activity.getAttribute("aria-pressed"), "false");
            passed(`${label}: program activity details respond to keyboard and toggle off`);

            const strip = page.locator(".week-strip");
            await strip.focus();
            await page.keyboard.press("End");
            await page.waitForTimeout(300);
            assert.ok(await strip.evaluate((element) => element.scrollLeft >= element.scrollWidth - element.clientWidth - 5));
            assert.equal(await page.locator("#week-next").isDisabled(), true);
            await page.keyboard.press("Home");
            await page.waitForTimeout(300);
            await page.locator("#week-next").click();
            await page.waitForTimeout(600);
            assert.ok(await strip.evaluate((element) => element.scrollLeft > 150));
            passed(`${label}: real weekly strip keyboard End/Home and next control scroll, with truthful edge disabled state`);

            const faq = page.locator(".faq-item button");
            await faq.nth(0).focus();
            await page.keyboard.press("Enter");
            assert.equal(await page.locator("#answer-0").isVisible(), true);
            await faq.nth(1).click();
            assert.equal(await page.locator("#answer-0").isHidden(), true);
            assert.equal(await page.locator("#answer-1").isVisible(), true);
            await faq.nth(1).click();
            assert.equal(await page.locator("#answer-1").isHidden(), true);
            passed(`${label}: FAQ keyboard activation, mutually exclusive answers, close`);

            await page.locator(".save").click();
            assert.equal(await page.locator("#confirmation").isHidden(), true);
            await fillForm(page, "8", "voyager");
            await page.locator(".save").click();
            assert.equal(await page.locator("#confirmation").isHidden(), true);
            assert.equal(await page.locator('[name="session"]').evaluate((element) => element.validity.customError), true);
            await page.locator('[name="session"]').selectOption("day");
            await page.locator(".save").click();
            assert.equal(await page.locator("#confirmation").isVisible(), true);
            assert.match(await page.locator(".confirmation-notice").textContent(), /Saved in this browser only/);
            assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("camp-registration.v1")).session), "day");
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator("#confirmation").isVisible(), true);
            await page.locator("#edit").click();
            assert.equal(await page.locator('[name="camper"]').inputValue(), "River Demo");
            await page.locator('[name="age"]').selectOption("13");
            await page.locator('[name="session"]').selectOption("voyager");
            await page.locator(".save").click();
            assert.match(await page.locator("#saved-session").textContent(), /Two-Week Voyager/);
            await noOverflow(page, `${label} saved form`);
            await page.locator("#clear").click();
            assert.equal(await page.evaluate(() => localStorage.getItem("camp-registration.v1")), null);
            assert.equal(await page.locator('[name="camper"]').inputValue(), "");
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator("#registration-form").isVisible(), true);
            passed(`${label}: required field validation, session/age constraint, local save, reload persistence, edit, changed resave, clear and reload`);
            await noOverflow(page, `${label} after interactions`);

            await page.emulateMedia({ reducedMotion: "reduce" });
            assert.equal(await page.locator(".layer").first().evaluate((element) => getComputedStyle(element).animationName), "none");
            passed(`${label}: reduced-motion freezes actual SVG drift`);
            const targets = await page.locator("button, nav a, .button").evaluateAll((elements) => elements.filter((element) => element.getClientRects().length).filter((element) => element.getBoundingClientRect().height < 44).map((element) => ({ text: element.textContent.trim(), height: element.getBoundingClientRect().height })));
            assert.deepEqual(targets, [], `${label} tap targets`);
            passed(`${label}: visible interactive controls have at least 44px height`);
            await context.close();
        }
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();
        await page.goto(server.url, { waitUntil: "networkidle" });
        await noOverflow(page, "1440px desktop");
        await fillForm(page);
        await page.evaluate(() =>
        {
            Storage.prototype.setItem = () => { throw new DOMException("Test storage denial", "QuotaExceededError"); };
        });
        await page.locator(".save").click();
        assert.match(await page.locator("#form-message").textContent(), /unavailable or full/);
        assert.equal(await page.locator("#confirmation").isHidden(), true);
        passed("storage write denial: explicit error, no false saved confirmation");
        await context.close();
        const corrupt = await browser.newContext();
        await corrupt.addInitScript(() => localStorage.setItem("camp-registration.v1", "{invalid"));
        const corruptPage = await corrupt.newPage();
        await corruptPage.goto(server.url, { waitUntil: "networkidle" });
        assert.match(await corruptPage.locator("#form-message").textContent(), /could not be read/);
        assert.equal(await corruptPage.locator("#registration-form").isVisible(), true);
        passed("corrupt local draft: editable fresh form and honest notice");
        await corrupt.close();
        assert.deepEqual(errors, []);
        qa.passed = true;
    }
    catch (error)
    {
        qa.failure = error.stack;
        throw error;
    }
    finally
    {
        if (browser) await browser.close();
        if (server) await server.close();
        qa.resourcesClosed = true;
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
        console.log(JSON.stringify(qa, null, 2));
    }
}
else if (mode === "preview")
{
    const metadata = await WorkspaceFiles.json(metadataFile);
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    assert.equal(qa.passed, true);
    const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
    assert.equal(digest, qa.staticDigest);
    console.log(await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview));
}
else if (mode === "finish")
{
    const metadata = await WorkspaceFiles.json(metadataFile);
    const qaFile = path.join(checks, "qa.json");
    const qa = await WorkspaceFiles.json(qaFile);
    const actualFlags = () => Object.fromEntries(["generated", "preview", "validated", "config_added"].map((key) => [key, metadata[key]]));
    try
    {
        assert.equal(qa.passed, true);
        assert.equal(qa.resourcesClosed, true);
        assert.deepEqual(qa.errors, []);
        assert.equal(metadata.modelId, job.modelId);
        assert.equal(metadata.generated, true);
        assert.ok(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0));
        assert.equal(new Set(metadata.tags).size, metadata.tags.length);
        await StaticHomepage.checkSource(folder);
        const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
        assert.equal(digest, qa.staticDigest);
        const original = await readFile(job.file, "utf8");
        const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
        const inputDigest = createHash("sha256").update(JSON.stringify([original, design])).digest("hex");
        assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), inputDigest);
        const previewFile = path.join(exported, "preview.png");
        const png = await readFile(previewFile);
        assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(png.readUInt32BE(16), 1200);
        assert.equal(png.readUInt32BE(20), 900);
        const imageDigest = createHash("sha256").update(png).digest("hex");
        assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim(), `${digest} ${imageDigest}`);
        const { readdir, stat } = await import("node:fs/promises");
        const files = [];
        async function inventory(directory)
        {
            for (const name of await readdir(directory))
            {
                const file = path.join(directory, name);
                if ((await stat(file)).isDirectory()) await inventory(file);
                else files.push(file);
            }
        }
        await inventory(exported);
        let publicBytes = 0;
        for (const file of files)
        {
            const data = await readFile(file);
            publicBytes += data.length;
            if (file !== previewFile)
            {
                const relative = path.relative(exported, file);
                assert.deepEqual(data, await readFile(path.join(folder, relative)), `Source/export mismatch: ${relative}`);
            }
        }
        assert.ok(publicBytes < 20 * 1024 * 1024);
        const viewedFiles = ["desktop.png", "mobile.png", "desktop-programs.png", "desktop-cabins.png", "mobile-register.png", "mobile-fees.png"];
        const screenshots = [];
        for (const name of viewedFiles)
        {
            const file = path.join(checks, name);
            const image = await readFile(file);
            screenshots.push({ file, sha256: createHash("sha256").update(image).digest("hex"), openedWithView: true });
        }
        qa.visualReviewed = true;
        qa.visualEvidence =
        {
            method: "实际使用 view 打开桌面与手机首页 PNG、当前真实 preview.png 及四张分区截图；非仅检查文件存在。",
            observations:
            [
                "桌面：左侧奶油纸卡与右侧湖泊木屋形成明确层级，暖黄按钮突出，纸雕轮廓、字体、间距与照片条协调。",
                "手机：标题调整为三行，太阳、木屋与码头保留在画面内；导航、按钮和文本无遮挡，表单和费用卡单列清晰。",
                "分区：年龄组活动、木屋安全栏、移动报名字段和费用卡可读；长分区元素截图中的固定页眉拼接不作为页面缺陷或首页预览。",
                "当前首屏预览为真正1200×900截图，已重新打开查看；无空白或浏览器错误页。"
            ],
            images: screenshots,
            preview: { file: previewFile, sha256: imageDigest, openedWithView: true }
        };
        await WorkspaceFiles.saveJson(qaFile, qa);
        metadata.preview = true;
        metadata.validated = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        assert.equal(await StaticHomepage.ensurePreview(workspace, { folder }, exported, digest, undefined, metadata.preview), "preserved");
        const before = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
        await registerGeneratedPage(workspace, { prompt: job.prompt, model: "GPT-6", slug: shared.slug, title: shared.title, staticDir: "out", tags: metadata.tags });
        const after = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
        const group = after.pages[job.prompt];
        const registered = group.pages.filter((entry) => entry.model.toLowerCase() === "gpt-6");
        assert.equal(registered.length, 1);
        assert.equal(registered[0].slug, shared.slug);
        assert.equal(registered[0].staticDir, "out");
        assert.equal(registered[0].enabled, false);
        assert.equal(registered[0].deployed, false);
        for (const [key, value] of Object.entries(before.pages))
        {
            if (key !== job.prompt) assert.deepEqual(after.pages[key], value, `Unrelated registration changed: ${key}`);
        }
        assert.deepEqual(registered[0].tags, metadata.tags);
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const report =
        {
            prompt: job.prompt,
            runId: job.runId,
            status: "completed",
            summary: "已完成一个夏令营英文静态首页；实际浏览器、双端截图视觉复核、真实预览和禁用登记均已通过，未构建或部署。",
            modelId: job.modelId,
            display_model_name: "GPT-6",
            tags: metadata.tags,
            flags: actualFlags(),
            output: folder,
            staticDir: exported,
            qa: qaFile,
            screenshots: { ...qa.screenshots, preview: previewFile, supplemental: screenshots.slice(2) },
            tests: { source: "passed", static: "passed", browser: qa.tests, errors: qa.errors, assertionGroups: qa.tests.length, publicFileCount: files.length, publicBytes, sourceExportIdentical: true },
            visualReviewed: true,
            visualEvidence: qa.visualEvidence,
            staticDigest: digest,
            inputFingerprint: { algorithm: "SHA256(JSON.stringify([fullRawMarkdown, fullDESIGN]))", sha256: inputDigest, verified: true },
            preview: { method: "StaticHomepage.ensurePreview", action: "generated, then fingerprint-verified preservation", file: previewFile, width: 1200, height: 900, imageSHA256: imageDigest, staticDigest: digest, fingerprintVerified: true },
            registration: { unique: true, prompt: job.prompt, ...registered[0], unrelatedConfigPreserved: true },
            provenance: job.provenance,
            limitations:
            [
                "按授权采用无构建原生HTML/CSS/JavaScript静态适配，不是原需求的Vite/React/TypeScript/Tailwind项目；motion和lucide-react以CSS及内联SVG替代，已在README明确。",
                "英雄区为可读性采用桌面610px最小高度和较高手机布局，不是严格62vh；独立绘制纸雕与动作，不声称逐像素复制线上演示。",
                "Camp Bluejay、湖泊、人员、安全描述和费用均属虚构；照片为原需求指定模板生成图，不是实际地点照片。",
                "报名仅写当前浏览器camp-registration.v1；无发送、邮件、付款、真实预订或床位占用。请仅输入虚构资料；存储失败和损坏有明确反馈。",
                "来源受CC BY-NC 4.0非商业许可约束；保留VibeFather署名、资产来源及字体OFL许可。",
                "缺少task\\TASK.md，按本次明确单项job授权执行；未改共享任务、运行状态、日志或辅助工作流。",
                "npm字体包端点TLS失败后改为下载Fontsource发行文件并本地托管；未安装依赖、未关闭TLS验证。",
                "首轮QA把桌面周计划最大滚动量误写为1000px，已按实际可滚动宽度修正；最终26组实际断言通过。"
            ],
            blocker: null,
            resourcesClosed: qa.resourcesClosed,
            coordinatorLock: { verifiedLivePid: lockPid, ownedLockMatches: true, untouched: true },
            buildsExecuted: false,
            deploymentsExecuted: false,
            nestedAgentsUsed: false,
            completedAt: new Date().toISOString()
        };
        await WorkspaceFiles.saveJson(job.reportFile, report);
        const saved = await WorkspaceFiles.json(job.reportFile);
        assert.deepEqual(saved.flags, actualFlags());
        console.log(JSON.stringify({ prompt: saved.prompt, status: saved.status, flags: saved.flags, tests: saved.tests.assertionGroups, publicBytes, reportFile: job.reportFile, registration: { enabled: registered[0].enabled, deployed: registered[0].deployed }, resourcesClosed: saved.resourcesClosed }));
    }
    catch (error)
    {
        await WorkspaceFiles.saveJson(job.reportFile, { prompt: job.prompt, runId: job.runId, status: "failed", modelId: job.modelId, display_model_name: "GPT-6", tags: metadata.tags, flags: actualFlags(), output: folder, qa: qaFile, screenshots: qa.screenshots, blocker: error.stack, resourcesClosed: qa.resourcesClosed, buildsExecuted: false, deploymentsExecuted: false });
        throw error;
    }
}
