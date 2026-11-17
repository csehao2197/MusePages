import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const workspace = process.cwd();
const rootImport = (file) => import(pathToFileURL(path.join(workspace, "src", "workflows", "script", file)));
const { WorkspaceFiles, StaticHomepage } = await rootImport("render-prompt-page.mjs");
const { startPreviewServer } = await rootImport("generate-preview.mjs");
const { chromium } = await import("@playwright/test");
const job = JSON.parse(await readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "558-how-the-internet-works-explainer");
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const manifest = JSON.parse(await readFile(job.stateFile, "utf8"));
const lockPID = Number((await readFile(job.promptLock, "utf8")).trim());
assert.equal(lockPID, manifest.ownedLock.pid);
assert.equal(manifest.ownedLock.prompt, job.prompt);
assert.equal(manifest.runId, job.runId);
process.kill(lockPID, 0);
const slug = "how-the-internet-works-explainer";
const qa =
{
    passed: false,
    date: new Date().toISOString(),
    prompt: job.prompt,
    modelId: job.modelId,
    lockPID,
    source: await StaticHomepage.checkSource(folder),
    staticDigest: await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6"),
    tests: [],
    errors: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
const test = (label) => qa.tests.push(label);
let server;
let browser;
try
{
    const raw = await readFile(job.file, "utf8");
    const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    const inputDigest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
    assert.equal((await readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim(), inputDigest);
    for (const file of ["main.js", "state.js", "styles.css", "index.html", "content.js"])
    {
        assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)));
    }
    assert.deepEqual(await readFile(path.join(folder, "src", "content.ts")), await readFile(path.join(exported, "content.js")));
    test("Full original/DESIGN fingerprint and byte-identical source/export modules verified");
    server = await startPreviewServer(exported, { workspace });
    qa.url = server.url;
    assert.ok(server.url.endsWith("/pages/how-the-internet-works-explainer/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const label = viewport.width === 1200 ? "desktop" : "mobile";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: label === "mobile", hasTouch: label === "mobile" });
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push(`${label} page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push(`${label} console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => qa.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) qa.errors.push(`${label} HTTP ${response.status()}: ${response.url()}`);
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("h1").textContent(), "How one web page reaches your laptop");
        assert.equal(await page.locator(".scene").count(), 7);
        assert.equal(await page.locator(".beat").count(), 21);
        assert.equal(await page.locator(".term").count(), 14);
        assert.equal(await page.locator("#header-time").textContent(), "0 ms");
        const noOverflow = async (stage) =>
        {
            const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
            assert.ok(dimensions.scroll <= dimensions.viewport + 1, `${label} ${stage} overflow ${JSON.stringify(dimensions)}`);
        };
        await noOverflow("before interactions");
        assert.ok(await page.evaluate(() => document.fonts.check("600 20px Space") && document.fonts.check("400 18px Source") && document.fonts.check("400 12px Plex")));
        qa.screenshots[label] = path.join(checks, `${label}.png`);
        await page.screenshot({ path: qa.screenshots[label], animations: "disabled" });
        test(`${label} ${viewport.width}×${viewport.height} DPR1: real HTTP, visible content, 7 scenes/21 beats/14 terms, local fonts, initial no overflow`);

        await page.locator(".actions .primary").focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(700);
        assert.ok(await page.evaluate(() => Math.abs(document.querySelector("#scene-1").getBoundingClientRect().top) < 150));
        const scheme = page.locator('[data-part="0"]');
        await scheme.focus();
        await page.keyboard.press("Enter");
        assert.match(await page.locator("#caption-0").textContent(), /protocol/);
        assert.equal(await scheme.getAttribute("aria-pressed"), "true");
        await page.locator('[data-part="2"]').click();
        assert.match(await page.locator("#caption-0").textContent(), /Which page/);
        await noOverflow("request control");
        test(`${label}: keyboard start anchor and URL-part controls update actual diagram/caption`);

        const domain = page.locator("#domain");
        await domain.fill("real-site.com");
        await domain.press("Enter");
        assert.equal(await domain.getAttribute("aria-invalid"), "true");
        assert.match(await page.locator("#caption-1").textContent(), /only looks up/);
        await domain.fill(" KETTLEANDCRUMB.EXAMPLE ");
        await domain.press("Enter");
        await page.waitForFunction(() => document.querySelector("#caption-1").textContent.includes("203.0.113.42") && document.querySelector("#caption-1").textContent.includes("24 ms"));
        await page.locator("#dns-form button").click();
        await page.waitForFunction(() => document.querySelector("#caption-1").textContent.includes("From laptop cache"));
        assert.match(await page.locator("#caption-1").textContent(), /0 ms/);
        await page.locator('[data-domain="weather.test"]').click();
        await page.waitForFunction(() => document.querySelector("#caption-1").textContent.includes("weather.test →"));
        const sum = [..."weather.test"].reduce((value, char) => value + char.charCodeAt(0), 0);
        assert.match(await page.locator("#caption-1").textContent(), new RegExp(`203\\.0\\.113\\.${20 + sum % 200}`));
        assert.match(await page.locator("#diagram-1").textContent(), new RegExp(`203\\.0\\.113\\.${20 + sum % 200}`));
        await domain.fill("example.com.evil");
        await domain.press("Enter");
        assert.equal(await domain.getAttribute("aria-invalid"), "true");
        await noOverflow("DNS valid/cache/invalid");
        test(`${label}: DNS keyboard validation, normalization, deterministic answer, full referral sequence, cached repeat, preset, reserved-suffix boundary`);

        for (const [distance, oneWay, hops] of [["city", 12, 4], ["ocean", 96, 10], ["country", 38, 7]])
        {
            await page.locator(`[data-distance="${distance}"]`).click();
            assert.equal(await page.locator("#caption-2").textContent(), `One way: ${oneWay} ms · ${hops} hops`);
            assert.match(await page.locator("#route-beat").textContent(), new RegExp(`${hops} router hops and ${oneWay} milliseconds`));
            await noOverflow(`distance ${distance}`);
        }
        await page.locator("#scene-3").evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
        await page.waitForTimeout(100);
        assert.equal(await page.locator("#header-time").textContent(), "62 ms");
        test(`${label}: all 3 real route presets redraw nodes, change narrative, update first-trip header milestone`);

        for (const [step, text] of [[1, "Send SYN-ACK"], [2, "Send ACK"], [3, "Start over"], [0, "Send SYN"]])
        {
            await page.locator("#handshake").click();
            assert.equal((await page.locator("#handshake").textContent()).trim(), text);
            const actual = await page.evaluate(async () => (await import("./state.js")).store.get().handshakeStep);
            assert.equal(actual, step);
            if (step === 3) assert.match(await page.locator("#diagram-3").textContent(), /connection open · 76 ms/);
        }
        test(`${label}: all TCP SYN/SYN-ACK/ACK sequence/acknowledgment states and reset exercised`);
        await page.locator('[data-tls="0"]').click();
        assert.match(await page.locator("#tls-bytes").textContent(), /Cookie: basket=2-loaves/);
        await page.locator('[data-tls="1"]').click();
        const cipher = await page.locator("#tls-bytes").textContent();
        assert.ok(!cipher.includes("basket"));
        assert.equal(cipher.split("\n").length, 7);
        assert.match(cipher, /to 203.0.113.42:443/);
        await noOverflow("TLS inspector");
        await page.locator("#scene-5").evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
        await page.evaluate(() => scrollBy({ top: innerWidth < 621 ? 0 : 125, behavior: "instant" }));
        await page.waitForTimeout(100);
        await page.screenshot({ path: path.join(checks, `${label}-tls.png`), animations: "disabled" });
        test(`${label}: HTTP plaintext/cookie visibility and deterministic six-row HTTPS bytes; no claim of real cryptography`);

        const loss = page.locator("#loss");
        await loss.focus();
        await loss.press("End");
        assert.equal(await loss.inputValue(), "20");
        assert.equal(await page.locator("#loss-value").textContent(), "20%");
        assert.match(await page.locator("#caption-5").textContent(), /246 ms · 2 resent/);
        await page.waitForFunction(() => document.querySelectorAll('[data-missing="true"]').length === 2);
        await page.waitForFunction(() => document.querySelectorAll('[data-missing="true"]').length === 0);
        assert.equal(await page.locator("#diagram-5 .tile.resent").count(), 2);
        await noOverflow("loss/reassembly");
        await loss.press("Home");
        await page.waitForTimeout(100);
        assert.match(await page.locator("#caption-5").textContent(), /94 ms/);
        test(`${label}: native keyboard loss slider creates 2 gaps, then resends missing chunks and restores loss-free transfer`);

        await page.locator("#warm").click();
        assert.equal(await page.locator("#warm").getAttribute("aria-pressed"), "true");
        assert.equal(await page.locator("#caption-6").textContent(), "Reload: 124 ms · 61% faster");
        assert.match(await page.locator("#diagram-6").textContent(), /DNS cached · connection reused/);
        await page.waitForFunction(() => document.querySelector("#header-time").textContent === "316 ms");
        assert.equal(await page.locator("#header-time").textContent(), "316 ms");
        await page.locator("#warm").click();
        assert.equal(await page.locator("#caption-6").textContent(), "First visit: 316 ms");
        await noOverflow("warm/cold");
        test(`${label}: cold/warm waterfall 316→124 ms, computed 61% reduction, cold header unchanged`);
        const matrix = await page.evaluate(async () =>
        {
            const { timeline } = await import("./state.js");
            return ["city", "country", "ocean"].flatMap((distance) => [0,5,10,15,20].map((lossPercent) =>
            {
                const t = timeline({ distance, lossPercent });
                return { distance, lossPercent, ...t };
            }));
        });
        for (const row of matrix)
        {
            const oneWay = { city: 12, country: 38, ocean: 96 }[row.distance];
            const lost = Math.round(12 * row.lossPercent / 100);
            assert.equal(row.total, 24 + 6 * oneWay + 18 + lost * 2 * oneWay + 46);
            assert.equal(row.durations.reduce((sum, value) => sum + value, 0), row.total);
            assert.equal(row.warmTotal, 2 * oneWay + 48);
            assert.equal(row.lost, lost);
        }
        test(`${label}: 15 route/loss timing combinations, milestone totals, waterfall sums and warm budgets verified`);

        await page.locator("#recap").evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
        await page.waitForTimeout(4400);
        await page.locator("#replay").click();
        await page.waitForFunction(() => document.querySelector("#replay").disabled);
        await page.waitForFunction(() => !document.querySelector("#replay").disabled, { timeout: 6000 });
        assert.match(await page.locator("#replay-status").textContent(), /Trip complete/);
        assert.equal(await page.locator("#header-time").textContent(), "316 ms");
        await page.locator('.term a[aria-label="DNS: go to scene 2"]').click();
        await page.waitForTimeout(700);
        assert.ok(await page.evaluate(() => Math.abs(document.querySelector("#scene-2").getBoundingClientRect().top) < 150));
        await noOverflow("after all interactions");
        test(`${label}: auto/manual four-second replay, final rail and glossary scene navigation; final no overflow`);
        await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".diagram-panel").first().evaluate((element) => getComputedStyle(element).position), "static");
    assert.equal(await page.locator("#replay").isVisible(), false);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator("#handshake").click();
    assert.match(await page.locator("#handshake").textContent(), /Send SYN-ACK/);
    await page.locator("#domain").fill("teacher.example");
    await page.locator("#domain").press("Enter");
    await page.waitForFunction(() => document.querySelector("#caption-1").textContent.includes("teacher.example →"));
    await page.locator("#loss").fill("10");
    await page.waitForFunction(() => document.querySelectorAll('[data-missing="true"]').length === 0);
    await context.close();
    test("1440×900 reduced motion: no sticky figures, no replay animation, responsive width, DNS/TCP/loss controls still functional");
    assert.deepEqual(qa.errors, []);
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
