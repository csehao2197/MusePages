import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readFile, mkdir, rename, cp, copyFile, readdir, stat } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const root = process.cwd();
const workflow = (name) => pathToFileURL(path.join(root, "src", "workflows", "script", name)).href;
const { WorkspaceFiles, StaticHomepage } = await import(workflow("render-prompt-page.mjs"));
const { startPreviewServer } = await import(workflow("generate-preview.mjs"));
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "592-retro-roller-rink-website");
assert.equal(job.modelId, "gpt-6.1-sol");
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const assertions = [];
const errors = [];
const requests = [];
const screenshots = [];
const viewports = [];
let server;
let browser;
const report =
{
    prompt: job.prompt,
    modelId: job.modelId,
    passed: false,
    visualReviewed: false,
    viewports,
    assertions,
    errors,
    screenshots,
    resourcesClosed: false
};

async function check(name, run)
{
    await run();
    assertions.push({ name, passed: true });
}

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: ${JSON.stringify(sizes)}`);
    assertions.push({ name: label, passed: true, sizes });
}

try
{
    const manifest = JSON.parse(await readFile(job.stateFile, "utf8"));
    const pid = Number((await readFile(job.promptLock, "utf8")).trim());
    assert.equal(manifest.runId, job.runId);
    assert.equal(manifest.activePrompt, job.prompt);
    assert.equal(manifest.ownedLock.prompt, job.prompt);
    assert.equal(manifest.ownedLock.pid, pid);
    process.kill(pid, 0);
    report.lock = { pid, prompt: job.prompt, runId: job.runId, live: true };
    for (const font of ["fredoka", "dm-sans"])
    {
        await mkdir(path.join(folder, "fonts", font), { recursive: true });
        const old = path.join(folder, "fonts", `${font}-LICENSE`);
        try
        {
            await rename(old, path.join(folder, "fonts", font, "LICENSE"));
        }
        catch (error)
        {
            if (error.code !== "ENOENT")
            {
                throw error;
            }
        }
    }
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    for (const file of ["index.html", "content.js", "app.js", "styles.css", "LICENSE", "NOTICE"])
    {
        await copyFile(path.join(folder, file), path.join(exported, file));
    }
    for (const directory of ["images", "fonts"])
    {
        await cp(path.join(folder, directory), path.join(exported, directory), { recursive: true });
    }
    const config = JSON.parse(await readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const group = config.pages[job.prompt];
    const entries = Array.isArray(group) ? group : group?.pages || [];
    report.slug = entries[0]?.slug || "retro-roller-rink-website";
    report.title = entries[0]?.title || "Retro Roller Rink Website";
    report.staticDigest = await StaticHomepage.validateStaticOutput(exported, report.slug, "GPT-6");
    assertions.push({ name: "Repository source gate and independent static resource/subpath validation", passed: true });
    server = await startPreviewServer(exported, { workspace: root });
    report.url = server.url;
    assert(new URL(server.url).pathname === `/pages/${report.slug}/GPT-6/index.html`);
    const readiness = await fetch(server.url);
    assert.equal(readiness.status, 200);
    assert.equal((await fetch(new URL("/", server.url))).status, 404);
    assert.equal((await fetch(new URL("../metadata.json", server.url))).status, 404);
    assertions.push({ name: "Owned target-only preview responds 200 at final mount, rejects root/source access", passed: true });
    browser = await chromium.launch({ headless: true });
    for (const [label, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: label === "mobile", hasTouch: label === "mobile" });
        try
        {
            const page = await context.newPage();
            viewports.push({ label, ...viewport, deviceScaleFactor: 1 });
            page.on("pageerror", (e) => errors.push(`${label} page: ${e.message}`));
            page.on("console", (m) =>
            {
                if (m.type() === "error")
                {
                    errors.push(`${label} console: ${m.text()}`);
                }
            });
            page.on("requestfailed", (r) => errors.push(`${label} request: ${r.url()} ${r.failure()?.errorText}`));
            page.on("response", (r) =>
            {
                if (r.status() >= 400)
                {
                    errors.push(`${label} HTTP ${r.status()}: ${r.url()}`);
                }
            });
            page.on("request", (r) => requests.push({ label, url: r.url(), method: r.method() }));
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.evaluate(async () =>
            {
                document.querySelectorAll("img").forEach((img) => img.loading = "eager");
                await document.fonts.ready;
                await Promise.all([...document.images].map((image) => image.decode()));
            });
            await check(`${label}: meaningful English homepage and all five local photographs/fonts`, async () =>
            {
                await expect(page.locator("h1")).toHaveText("Good wheels.Great company.");
                await expect(page.locator(".ticket")).toHaveCount(6);
                assert.equal(await page.locator("img").count(), 5);
                assert(await page.evaluate(() => document.fonts.check("700 82px Fredoka") && document.fonts.check('400 16px "DM Sans"')));
                const text = await page.locator("body").innerText();
                assert(text.length > 3000);
                assert(!/[\u3400-\u9FFF]/u.test(text));
                assert(await page.evaluate(() => [...document.images].every((img) => img.naturalWidth > 0)));
            });
            await noOverflow(page, `${label}: no horizontal overflow before interactions`);
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            await page.screenshot({ path: path.join(checks, `${label}.png`), animations: "disabled" });
            screenshots.push(path.join(checks, `${label}.png`));
            await page.screenshot({ path: path.join(checks, `${label}-full.png`), fullPage: true, animations: "disabled" });
            screenshots.push(path.join(checks, `${label}-full.png`));

            await check(`${label}: keyboard session filters, focus retained, weekday empty/reset`, async () =>
            {
                await page.locator('[data-category="Adults"]').focus();
                await page.keyboard.press("Enter");
                await expect(page.locator(".ticket")).toHaveCount(2);
                await expect(page.locator('[data-category="Adults"]')).toBeFocused();
                await expect(page.locator('[data-category="Adults"]')).toHaveAttribute("aria-pressed", "true");
                await page.locator("#weekday").selectOption("Tuesday");
                await expect(page.locator("#session-list")).toContainText("No sessions match");
                await expect(page.locator("#session-count")).toHaveText("0 sessions to roll with");
                await page.locator("#reset-filters").click();
                await expect(page.locator(".ticket")).toHaveCount(6);
            });
            await check(`${label}: carried session and separate per-skater rental arithmetic`, async () =>
            {
                await page.locator('[data-session="family"]').click();
                await expect(page.locator("#session")).toHaveValue("family");
                await expect(page.locator("#session")).toBeFocused();
                await page.locator("#guests").fill("3");
                await expect(page.locator("#summary .total strong")).toHaveText("$36");
                await page.locator(".planner-rental input").check();
                await expect(page.locator("#summary .total strong")).toHaveText("$51");
                await expect(page.locator("#summary")).toContainText("3 rental pairs × $5 = $15");
                await expect(page.locator(".rental-controls .rental-check")).toBeChecked();
            });
            await check(`${label}: rental size keyboard selection, range reset, planner sync`, async () =>
            {
                await page.locator('[data-size="Adult 7"]').focus();
                await page.keyboard.press("Space");
                await expect(page.locator("#rentalSize")).toHaveValue("Adult 7");
                await expect(page.locator('[data-size="Adult 7"]')).toBeFocused();
                await page.locator('[data-range="Youth"]').click();
                await expect(page.locator("#rentalSize")).toHaveValue("");
                await expect(page.locator("#sizes button")).toHaveCount(6);
                await page.locator('[data-size="Youth Y10"]').click();
                await expect(page.locator("#summary")).toContainText("Youth Y10");
                await page.locator("#rentalSize").selectOption("Adult 9");
                await expect(page.locator('[data-range="Adult"]')).toHaveAttribute("aria-pressed", "true");
                await expect(page.locator('[data-size="Adult 9"]')).toHaveAttribute("aria-pressed", "true");
            });
            await check(`${label}: included rentals cannot be charged twice; age confirmation resets`, async () =>
            {
                await page.locator("#age").check();
                await page.locator("#session").selectOption("learn");
                await expect(page.locator("#age")).not.toBeChecked();
                await expect(page.locator(".planner-rental input")).toBeDisabled();
                await expect(page.locator("#summary .total strong")).toHaveText("$42");
                await expect(page.locator("#summary")).toContainText("Rental pairs included");
                await expect(page.locator("#age-rule")).toHaveText("Ages 7+");
            });
            await check(`${label}: all party package prices/minimums and extra-guest formulas`, async () =>
            {
                for (const [id, min, price] of [["little", 8, 180], ["big", 12, 280], ["orbit", 16, 390]])
                {
                    await page.locator(`[data-party="${id}"]`).click();
                    await expect(page.locator("#package")).toHaveValue(id);
                    await expect(page.locator(`[data-party="${id}"]`)).toHaveAttribute("aria-pressed", "true");
                    await expect(page.locator("#guests")).toHaveAttribute("min", String(min));
                    await page.locator("#guests").fill(String(min));
                    await expect(page.locator("#summary .total strong")).toHaveText(`$${price}`);
                    await page.locator("#guests").fill(String(min + 2));
                    await expect(page.locator("#summary .total strong")).toHaveText(`$${price + 36}`);
                    await expect(page.locator(".planner-rental input")).toBeDisabled();
                }
                await page.locator("#guests").fill("15");
                await page.locator(".submit").click();
                await expect(page.locator("#guests-error")).toContainText("16 to 24");
                await expect(page.locator("#name")).toBeFocused();
                await page.locator("#guests").fill("25");
                await expect(page.locator("#summary .total strong")).toHaveText("—");
            });
            await check(`${label}: visit mode restores guest range and full inline validation`, async () =>
            {
                await page.locator('[data-mode="Visit"]').click();
                await expect(page.locator("#guests")).toHaveAttribute("min", "1");
                await expect(page.locator("#package-field")).toBeHidden();
                await page.locator("#name").fill("Local Skater");
                await page.locator("#email").fill("not-an-email");
                await page.locator("#guests").fill("1.5");
                await page.locator("#session").selectOption("family");
                await page.locator("#rentalSize").selectOption("");
                await page.locator(".submit").click();
                await expect(page.locator("#email")).toBeFocused();
                await expect(page.locator("#email-error")).not.toBeEmpty();
                await expect(page.locator("#guests-error")).not.toBeEmpty();
                await expect(page.locator("#rentalSize-error")).not.toBeEmpty();
                await expect(page.locator("#age-error")).not.toBeEmpty();
                await expect(page.locator("#receipt")).not.toBeVisible();
            });
            await check(`${label}: honest local receipt, escaped notes, Escape focus restore, values retained`, async () =>
            {
                await page.locator("#email").fill("skater@example.test");
                await page.locator("#guests").fill("3");
                await page.locator("#rentalSize").selectOption("Adult 9");
                await page.locator("#notes").fill("<b>Beginner group</b>");
                await page.locator("#age").check();
                const before = requests.length;
                await page.locator(".submit").click();
                await expect(page.locator("#receipt")).toBeVisible();
                await expect(page.locator("#receipt")).toContainText("Saturday · 11 AM–1 PM");
                await expect(page.locator("#receipt")).toContainText("$51");
                await expect(page.locator("#receipt")).toContainText("No booking, message, or payment was sent");
                await expect(page.locator("#receipt")).toContainText("<b>Beginner group</b>");
                await expect(page.locator("#receipt-details b")).toHaveCount(0);
                await expect(page.locator(".dialog-close")).toBeFocused();
                await page.keyboard.press("Shift+Tab");
                assert(await page.evaluate(() => document.activeElement.closest("dialog") !== null));
                await page.keyboard.press("Escape");
                await expect(page.locator("#receipt")).not.toBeVisible();
                await expect(page.locator(".submit")).toBeFocused();
                await expect(page.locator("#name")).toHaveValue("Local Skater");
                assert.equal(requests.length, before, "Submitting a local plan must not send requests");
            });
            await check(`${label}: party receipt total, edit/outside close, clear resets plan`, async () =>
            {
                await page.locator('[data-party="big"]').click();
                await page.locator("#guests").fill("14");
                await page.locator(".submit").click();
                await expect(page.locator("#receipt")).toBeVisible();
                await expect(page.locator("#receipt")).toContainText("Big Groove");
                await expect(page.locator("#receipt")).toContainText("$316");
                await page.locator("#edit-plan").click();
                await expect(page.locator("#receipt")).not.toBeVisible();
                await expect(page.locator("#guests")).toHaveValue("14");
                await page.locator(".submit").click();
                await page.mouse.click(2, 2);
                await expect(page.locator("#receipt")).not.toBeVisible();
                await page.locator(".submit").click();
                await page.locator("#clear-plan").click();
                await expect(page.locator("#name")).toHaveValue("");
                await expect(page.locator("#guests")).toHaveValue("1");
                await expect(page.locator("#session")).toHaveValue("");
                await expect(page.locator("#rentalSize")).toHaveValue("");
                await expect(page.locator("#name")).toBeFocused();
            });
            await check(`${label}: snack categories and native keyboard house-note accordion`, async () =>
            {
                await page.locator('[data-snack="Food"]').click();
                await expect(page.locator(".menu-item")).toHaveCount(3);
                await expect(page.locator("#menu-list")).toContainText("Soft pretzel");
                await page.locator('[data-snack="Drinks"]').focus();
                await page.keyboard.press("Enter");
                await expect(page.locator(".menu-item")).toHaveCount(3);
                await expect(page.locator("#menu-list")).toContainText("Orange float");
                await expect(page.locator('[data-snack="Drinks"]')).toBeFocused();
                await page.locator('[data-snack="All"]').click();
                await expect(page.locator(".menu-item")).toHaveCount(6);
                await page.locator("summary").first().focus();
                await page.keyboard.press("Enter");
                await expect(page.locator("details").first()).toHaveAttribute("open", "");
                await expect(page.locator("details").first()).toContainText("This demo cannot reserve places");
                await page.keyboard.press("Enter");
            });
            await check(`${label}: decoration pause persists; personal plan does not persist`, async () =>
            {
                await page.locator("#motion-toggle").click();
                await expect(page.locator("body")).toHaveClass(/decoration-paused/);
                await page.reload({ waitUntil: "networkidle" });
                await expect(page.locator("#motion-toggle")).toHaveText("Resume decoration");
                await expect(page.locator("#name")).toHaveValue("");
                await page.locator("#motion-toggle").click();
            });
            await noOverflow(page, `${label}: no horizontal overflow after interactions and reload`);
            await check(`${label}: reduced motion and final screenshot state`, async () =>
            {
                await page.emulateMedia({ reducedMotion: "reduce" });
                assert.equal(await page.locator(".spark").first().evaluate((el) => getComputedStyle(el).animationName), "none");
                await page.locator("#sessions").scrollIntoViewIfNeeded();
                await page.screenshot({ path: path.join(checks, `${label}-sessions.png`), animations: "disabled" });
                await page.locator("#planner").scrollIntoViewIfNeeded();
                await page.screenshot({ path: path.join(checks, `${label}-planner.png`), animations: "disabled" });
            });
        }
        finally
        {
            await context.close();
        }
    }
    const wide = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try
    {
        viewports.push({ label: "wide", width: 1440, height: 900, deviceScaleFactor: 1 });
        wide.on("pageerror", (e) => errors.push(`wide page: ${e.message}`));
        wide.on("console", (m) =>
        {
            if (m.type() === "error")
            {
                errors.push(`wide console: ${m.text()}`);
            }
        });
        await wide.goto(server.url, { waitUntil: "networkidle" });
        await wide.evaluate(() => document.fonts.ready);
        await noOverflow(wide, "1440×900: no horizontal overflow");
        await wide.locator('[data-session="afterglow"]').click();
        await expect(wide.locator("#age-rule")).toHaveText("Ages 18+");
        await noOverflow(wide, "1440×900: no overflow after session selection");
    }
    finally
    {
        await wide.close();
    }
    assert.equal(errors.length, 0, JSON.stringify(errors));
    assert(requests.every((r) => r.method === "GET" && new URL(r.url).origin === new URL(server.url).origin), "All runtime requests must be local static GETs");
    assertions.push({ name: "No console, page, request, resource or HTTP errors; no external or submission network calls", passed: true, runtimeRequestCount: requests.length });
    const walk = async (directory) =>
    {
        let bytes = 0;
        for (const item of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, item.name);
            bytes += item.isDirectory() ? await walk(file) : (await stat(file)).size;
        }
        return bytes;
    };
    report.staticBytesBeforePreview = await walk(exported);
    assert(report.staticBytesBeforePreview < 20 * 1024 * 1024);
    report.passed = true;
}
catch (error)
{
    errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    report.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, assertions: assertions.length, errors, viewports, screenshots, resourcesClosed: report.resourcesClosed }));
}
