import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, copyFile, readdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";
import { registerGeneratedPage } from "./deploy-site.mjs";

const workspace = process.cwd();
const prompt = "526-oynta-design-agency-portfolio";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const reportFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-report-526.json");
const stage = process.argv[2];
const hash = (value) => createHash("sha256").update(value).digest("hex");
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const group = config.pages[prompt];
const options = Array.isArray(group) ? group : group?.pages ?? [];
const slug = options[0]?.slug ?? "oynta-design-agency-portfolio";
const title = options[0]?.title ?? "Oynta design agency portfolio";
const lockPid = Number((await WorkspaceFiles.text(path.join(workspace, "out", ".generation-locks", `${prompt}.lock`))).trim());
process.kill(lockPid, 0);
const manifest = await WorkspaceFiles.json("C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json");
if (manifest.ownedLock?.pid !== lockPid || manifest.ownedLock.prompt !== prompt || manifest.activePrompt !== prompt)
{
    throw Error("Coordinator-owned operation lock does not match");
}
const lock = { pid: lockPid, running: true, ownedLockMatched: true, coordinatorPreserved: true };

async function download(url, destination)
{
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok)
    {
        throw Error(`Required resource download failed: ${response.status} ${url}`);
    }
    const data = Buffer.from(await response.arrayBuffer());
    if (!data.length)
    {
        throw Error(`Empty resource: ${url}`);
    }
    await writeFile(destination, data);
    return { url, file: path.relative(folder, destination), bytes: data.length, sha256: hash(data) };
}

async function exportSource()
{
    await WorkspaceFiles.ensureDirectory(folder, "out");
    for (const entry of await readdir(folder, { withFileTypes: true }))
    {
        if (entry.name === "images" || entry.name === "fonts")
        {
            await StaticHomepage.copyHtml(path.join(folder, entry.name), path.join(exported, entry.name));
        }
        else if (entry.isFile() && StaticHomepage.publicAsset(entry.name))
        {
            await copyFile(path.join(folder, entry.name), path.join(exported, entry.name));
        }
    }
}

if (stage === "assets")
{
    await WorkspaceFiles.ensureDirectory(folder, "images");
    await WorkspaceFiles.ensureDirectory(folder, "fonts");
    await WorkspaceFiles.ensureDirectory(folder, ".checks");
    const photos =
    {
        "data": "1551288049-bebda4e38f71",
        "abstract": "1618005182384-a83a8bd57fbe",
        "workspace": "1498050108023-c5249f4df085",
        "team": "1522071820081-009f0129c71c",
        "office": "1600880292203-757bb62b4baf",
        "alex": "1500648767791-00dcc994a43e",
        "maya": "1534528741775-53994a69daeb",
        "sam": "1506794778202-cad84cf45f1d"
    };
    const resources = await Promise.all(Object.entries(photos).map(([name, id]) =>
    {
        const portrait = ["alex", "maya", "sam"].includes(name);
        return download(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${portrait ? 800 : 1400}&q=85`, path.join(folder, "images", `${name}.jpg`));
    }));
    for (const family of ["Inter", "Outfit"])
    {
        const response = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@100..900&display=swap`,
        {
            signal: AbortSignal.timeout(30000),
            headers: { "User-Agent": "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36" }
        });
        if (!response.ok)
        {
            throw Error(`Font CSS failed: ${family}`);
        }
        const css = await response.text();
        const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((match) => match[1]);
        if (!urls.length)
        {
            throw Error(`No downloadable font: ${family}`);
        }
        const source = urls.at(-1);
        const fontExtension = new URL(source).pathname.endsWith(".ttf") ? "ttf" : "woff2";
        resources.push(await download(source, path.join(folder, "fonts", `${family.toLowerCase()}.${fontExtension}`)));
        resources.push(await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family.toLowerCase()}/OFL.txt`, path.join(folder, "fonts", `LICENSE-${family}.txt`)));
    }
    resources.push(await download("https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE", path.join(folder, "LICENSE-Lucide.txt")));
    await copyFile(path.join(workspace, "data", "downloads", "github.com", "frostmute-msites-prompt-collection", "d4974f4296e2851e05eabddb9240170cc423dd46", "LICENSE"), path.join(folder, "LICENSE"));
    await WorkspaceFiles.saveJson(path.join(checks, "assets.json"), resources);
    await WorkspaceFiles.saveText(path.join(folder, "README.md"), await WorkspaceFiles.text(path.join(folder, "README.md")) + "\n## Asset record\n\n" + resources.map((resource) => `- \`${resource.file}\`: ${resource.url}`).join("\n") + "\n");
    console.log(JSON.stringify({ assets: resources.length, localOnly: true, lock }));
}
else if (stage === "prepare")
{
    if (await WorkspaceFiles.info(metadataFile))
    {
        throw Error("Existing metadata must not be overwritten or retried");
    }
    const metadata =
    {
        modelId: "gpt-6.1-sol",
        tags: ["Agency", "Portfolio", "Kinetic"],
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    const original = await WorkspaceFiles.text(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`));
    const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    await StaticHomepage.checkSource(folder);
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), hash(JSON.stringify([original, design])) + "\n");
    metadata.generated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await exportSource();
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    console.log(JSON.stringify({ sourceCheck: "passed", staticCheck: "passed", digest, metadata, lock }));
}
else if (stage === "qa")
{
    await exportSource();
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    const results = [];
    const errors = [];
    let browser;
    let server;
    let passed = false;
    async function assertion(name, operation)
    {
        await operation();
        results.push({ name, passed: true });
    }
    async function noOverflow(page, name)
    {
        await assertion(name, async () =>
        {
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        });
    }
    try
    {
        server = await startPreviewServer(exported, { workspace });
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const mobile = viewport.width < 500;
            const name = mobile ? "mobile" : "desktop";
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce", acceptDownloads: true, isMobile: mobile, hasTouch: mobile });
            page.setDefaultTimeout(15000);
            page.on("console", (message) =>
            {
                if (message.type() === "error")
                {
                    errors.push(`${name}: console: ${message.text()}`);
                }
            });
            page.on("pageerror", (error) => errors.push(`${name}: page: ${error.message}`));
            page.on("requestfailed", (request) => errors.push(`${name}: request: ${request.url()}`));
            page.on("response", (response) =>
            {
                if (response.status() >= 400)
                {
                    errors.push(`${name}: HTTP ${response.status()} ${response.url()}`);
                }
            });
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            await assertion(`${name}: successful HTTP at final public model subpath`, async () =>
            {
                expect(response.ok()).toBe(true);
                expect(new URL(page.url()).pathname).toBe(`/pages/${slug}/GPT-6/index.html`);
            });
            await page.evaluate(async () =>
            {
                await document.fonts.ready;
                await Promise.all([...document.images].filter((image) => image.hasAttribute("src") && image.loading !== "lazy").map((image) => image.decode()));
            });
            await assertion(`${name}: visible nonblank hero and local fonts`, async () =>
            {
                await expect(page.locator("h1")).toBeVisible();
                expect(await page.locator("h1").innerText()).toContain("digital solution");
                expect(await page.evaluate(() => document.fonts.check("100px Outfit") && document.fonts.check("14px Inter"))).toBe(true);
                expect(await page.locator("#liquid").getAttribute("data-renderer")).toBe("webgl-domain-warp");
                expect(await page.locator("#liquid").getAttribute("data-paused")).toBe("true");
            });
            await noOverflow(page, `${name}: no horizontal overflow before interactions`);
            await page.screenshot({ path: path.join(checks, `${name}.png`), animations: "disabled" });
            if (mobile)
            {
                await assertion("mobile: full-screen menu locks scrolling and traps focus", async () =>
                {
                    await page.locator(".menu-toggle").click();
                    await expect(page.locator("#mobile-menu")).toBeVisible();
                    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
                    await page.keyboard.press("Shift+Tab");
                    expect(await page.evaluate(() => document.activeElement.closest("#mobile-menu") !== null)).toBe(true);
                    await page.keyboard.press("Escape");
                    await expect(page.locator("#mobile-menu")).not.toBeVisible();
                    await expect(page.locator(".menu-toggle")).toBeFocused();
                    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
                    await page.locator(".menu-toggle").click();
                    await page.locator('#mobile-menu a[href="#work"]').click();
                    await expect(page.locator("#mobile-menu")).not.toBeVisible();
                });
            }
            await page.locator("#work").scrollIntoViewIfNeeded();
            await assertion(`${name}: project next, previous and keyboard navigation`, async () =>
            {
                await page.locator("#next-project").click();
                await expect(page.locator("#project-count")).toHaveText("02 / 03");
                await page.locator("#previous-project").click();
                await expect(page.locator("#project-count")).toHaveText("01 / 03");
                await page.locator(".project-stack").focus();
                await page.keyboard.press("ArrowRight");
                await expect(page.locator("#project-count")).toHaveText("02 / 03");
                await page.keyboard.press("ArrowLeft");
                await expect(page.locator("#project-count")).toHaveText("01 / 03");
            });
            await assertion(`${name}: exposed background card moves to front`, async () =>
            {
                await page.locator(".project-stack").scrollIntoViewIfNeeded();
                await expect(page.locator('[data-project="2"]')).toHaveCSS("transform", "matrix(0.9, 0, 0, 0.9, 0, -60)");
                const box = await page.locator('[data-project="2"]').boundingBox();
                await page.mouse.click(box.x + box.width / 2, box.y + 8);
                await expect(page.locator("#project-count")).toHaveText("03 / 03");
            });
            await assertion(`${name}: drag or touch swipe changes project`, async () =>
            {
                const box = await page.locator(".project-card.front .project-image").boundingBox();
                const x = box.x + box.width * .65;
                const y = box.y + box.height * .5;
                if (mobile)
                {
                    const cdp = await page.context().newCDPSession(page);
                    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
                    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - 85, y }] });
                    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
                    await cdp.detach();
                }
                else
                {
                    await page.mouse.move(x, y);
                    await page.mouse.down();
                    await page.mouse.move(x - 110, y, { steps: 8 });
                    await page.mouse.up();
                }
                await expect(page.locator("#project-count")).toHaveText("01 / 03");
            });
            await noOverflow(page, `${name}: no horizontal overflow after carousel gestures`);
            await assertion(`${name}: case study displays selected content and dismisses`, async () =>
            {
                await page.locator(".front .case-button").click();
                await expect(page.locator("#case-title")).toContainText("Axion");
                await expect(page.locator("#case-challenge")).toContainText("analytics");
                await page.keyboard.press("Escape");
                await expect(page.locator("#case-dialog")).not.toBeVisible();
            });
            await assertion(`${name}: FAQ has meaningful answers and single-open state`, async () =>
            {
                await page.locator("details").nth(1).locator("summary").click();
                await expect(page.locator("details").nth(1)).toHaveAttribute("open", "");
                await expect(page.locator("details").nth(0)).not.toHaveAttribute("open", "");
                await expect(page.locator("details").nth(1).locator("div")).toContainText("discover, define, design");
                await page.locator("details").nth(1).locator("summary").focus();
                await page.keyboard.press("Enter");
                await expect(page.locator("details").nth(1)).not.toHaveAttribute("open", "");
            });
            await assertion(`${name}: Pro plan, form validation, brief creation, editing and download`, async () =>
            {
                await page.locator('[data-plan="Pro"]').click();
                await expect(page.locator("#contact-dialog")).toBeVisible();
                await expect(page.locator('select[name="plan"]')).toHaveValue("Pro");
                await page.locator('#project-form button[type="submit"]').click();
                await expect(page.locator("#project-form")).toBeVisible();
                expect(await page.locator("#project-form").evaluate((form) => form.checkValidity())).toBe(false);
                await page.locator('input[name="name"]').fill("Jordan Example");
                await page.locator('input[name="email"]').fill("jordan@example.com");
                await page.locator('textarea[name="idea"]').fill("A thoughtful brand and website for our independent coffee studio.");
                await page.locator('#project-form button[type="submit"]').click();
                await expect(page.locator("#brief-result")).toBeVisible();
                await expect(page.locator("#brief-summary")).toContainText("Pro");
                const downloadPromise = page.waitForEvent("download");
                await page.locator("#download-brief").click();
                const download = await downloadPromise;
                expect(download.suggestedFilename()).toBe("oynta-project-brief.txt");
                const stream = await download.createReadStream();
                const chunks = [];
                for await (const chunk of stream)
                {
                    chunks.push(chunk);
                }
                const content = Buffer.concat(chunks).toString("utf8");
                expect(content).toContain("Starting point: Pro");
                expect(content).toContain("independent coffee studio");
                await page.locator("#edit-brief").click();
                await expect(page.locator('textarea[name="idea"]')).toHaveValue(/coffee studio/);
                await page.keyboard.press("Escape");
            });
            await assertion(`${name}: team focus treatment and all photographs load`, async () =>
            {
                await page.locator(".team-card").first().focus();
                await expect(page.locator(".team-card img").first()).toHaveCSS("filter", "grayscale(0)");
                await page.evaluate(async () =>
                {
                    for (const image of document.images)
                    {
                        image.loading = "eager";
                    }
                    await Promise.all([...document.images].filter((image) => image.hasAttribute("src")).map((image) => image.decode()));
                });
                expect(await page.evaluate(() => [...document.images].filter((image) => image.hasAttribute("src")).every((image) => image.naturalWidth > 0))).toBe(true);
            });
            await assertion(`${name}: social disclosure and back-to-top work`, async () =>
            {
                await page.locator('[data-social="Instagram"]').click();
                await expect(page.locator("#social-dialog")).toContainText("No official social account");
                await page.locator(".dialog-dismiss").click();
                await page.locator("#back-top").click();
                await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
            });
            await noOverflow(page, `${name}: no horizontal overflow after all interactions`);
            await page.screenshot({ path: path.join(checks, `${name}-full.png`), fullPage: true, animations: "disabled" });
            await page.close();
        }
        const motionPage = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "no-preference" });
        motionPage.on("console", (message) =>
        {
            if (message.type() === "error")
            {
                errors.push(`normal motion: console: ${message.text()}`);
            }
        });
        motionPage.on("pageerror", (error) => errors.push(`normal motion: page: ${error.message}`));
        motionPage.on("requestfailed", (request) => errors.push(`normal motion: request: ${request.url()}`));
        motionPage.on("response", (response) =>
        {
            if (response.status() >= 400)
            {
                errors.push(`normal motion: HTTP ${response.status()} ${response.url()}`);
            }
        });
        await motionPage.goto(server.url, { waitUntil: "networkidle" });
        await assertion("normal motion: active WebGL stops offscreen and restarts on return", async () =>
        {
            await expect(motionPage.locator("#liquid")).toHaveAttribute("data-paused", "false");
            await motionPage.evaluate(() => scrollTo({ top: 2000, behavior: "instant" }));
            await expect(motionPage.locator("#liquid")).toHaveAttribute("data-paused", "true");
            await motionPage.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
            await expect(motionPage.locator("#liquid")).toHaveAttribute("data-paused", "false");
        });
        await motionPage.close();
        expect(errors).toEqual([]);
        results.push({ name: "No HTTP, resource, request, console or page errors", passed: true });
        passed = true;
    }
    catch (error)
    {
        errors.push(error.message);
        throw error;
    }
    finally
    {
        await browser?.close();
        await server?.close();
        await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
        {
            passed,
            timestamp: new Date().toISOString(),
            digest,
            url: `/pages/${slug}/GPT-6/index.html`,
            viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
            assertions: results,
            errors,
            screenshots: ["desktop.png", "mobile.png", "desktop-full.png", "mobile-full.png"],
            visualReviewed: false,
            resourcesClosed: true
        });
    }
    console.log(JSON.stringify({ passed, assertions: results.length, errors, resourcesClosed: true }));
}
else if (stage === "finish")
{
    const qa = await WorkspaceFiles.json(path.join(checks, "qa.json"));
    const metadata = await WorkspaceFiles.json(metadataFile);
    if (!qa.passed || !qa.visualReviewed || metadata.modelId !== "gpt-6.1-sol" || !metadata.generated)
    {
        throw Error("Actual browser and visual review gate is not ready");
    }
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    if (qa.digest !== digest)
    {
        throw Error("Source changed since browser QA");
    }
    const preview = await StaticHomepage.ensurePreview(workspace, { folder, file: metadataFile }, exported, digest, undefined, metadata.preview);
    const image = await readFile(path.join(exported, "preview.png"));
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(900);
    expect((await WorkspaceFiles.text(path.join(folder, ".generation-preview.sha256"))).trim()).toBe(`${digest} ${hash(image)}`);
    metadata.preview = true;
    metadata.validated = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await registerGeneratedPage(workspace, { prompt, model: "GPT-6", slug, title, staticDir: "out", tags: metadata.tags });
    const registeredConfig = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
    const entries = registeredConfig.pages[prompt].pages.filter((entry) => entry.model === "GPT-6");
    expect(entries).toHaveLength(1);
    expect(entries[0].enabled).toBe(false);
    expect(entries[0].deployed).toBe(false);
    expect(entries[0].tags).toEqual(metadata.tags);
    metadata.config_added = true;
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await WorkspaceFiles.saveJson(reportFile,
    {
        prompt,
        status: "completed",
        action: "generated-static-homepage",
        modelId: metadata.modelId,
        actualModelId: metadata.modelId,
        displayModel: "GPT-6",
        tags: metadata.tags,
        metadata,
        flags: { generated: metadata.generated, preview: metadata.preview, validated: metadata.validated, config_added: metadata.config_added },
        output: folder,
        staticOutput: exported,
        publicPath: `/pages/${slug}/GPT-6/index.html`,
        lock,
        input: { fullOriginalRead: true, fullDesignRead: true, fingerprint: (await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim() },
        provenance: { author: "Nomaan Khan", license: "MIT", repository: "frostmute/msites-prompt-collection", snapshot: "d4974f4296e2851e05eabddb9240170cc423dd46" },
        tests: { source: "passed", static: "passed", browser: qa, staticDigest: digest, preview, previewDigestVerified: true },
        QA: path.join(checks, "qa.json"),
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png"), desktopFull: path.join(checks, "desktop-full.png"), mobileFull: path.join(checks, "mobile-full.png"), preview: path.join(exported, "preview.png") },
        visual: { reviewed: qa.visualReviewed, evidence: qa.visualEvidence, previewViewed: false },
        registration: { verifiedUnique: true, ...entries[0] },
        limits:
        [
            "Authorized static HTML/CSS/browser JavaScript adaptation instead of React/Vite/TypeScript, Tailwind, Framer Motion, R3F/Three.js, and Lenis.",
            "Native smooth scrolling and 0.1-interpolated parallax replace exact Lenis root scrolling; FAQ uses native disclosure/CSS motion rather than Framer height animation.",
            "All projects, profiles, prices and studio statistics are explicitly illustrative. Unsplash photographs do not identify the named fictional staff.",
            "Inquiry form creates only a local downloadable brief. No backend, real contact delivery, payment or official social account.",
            "No build, dist, publish, deployment, external AI, credentials or nested agents."
        ],
        resourcesClosed: true
    });
    console.log(JSON.stringify({ metadata, registration: entries[0], preview, previewNeedsVisualOpen: path.join(exported, "preview.png") }));
}
else
{
    throw Error("Use assets, prepare, qa, or finish");
}
