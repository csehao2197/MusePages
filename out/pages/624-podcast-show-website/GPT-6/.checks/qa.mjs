import { chromium, expect } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { readFile, stat, readdir } from "node:fs/promises";
import assert from "node:assert/strict";

const workspace = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src/workflows/script/render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src/workflows/script/generate-preview.mjs")));
const report =
{
    passed: false,
    visualReviewed: false,
    resourcesClosed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: [path.join(folder, ".checks/desktop.png"), path.join(folder, ".checks/mobile.png")],
    staticDigest: null,
    startedAt: new Date().toISOString()
};
let server;
let browser;
const errors = report.errors;

async function check(name, run)
{
    await run();
    report.assertions.push({ name, passed: true });
}

async function overflow(page, name)
{
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(dimensions.scroll <= dimensions.viewport, `${name}: horizontal overflow ${JSON.stringify(dimensions)}`);
}

async function ready(page, url)
{
    const response = await page.goto(url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
    assert.ok((await page.locator("main").innerText()).length > 150);
    await page.waitForTimeout(650);
}

try
{
    report.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "podcast-show-website", "GPT-6");
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    report.url = server.url;
    browser = await chromium.launch({ headless: true, args: ["--autoplay-policy=user-gesture-required"] });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    context.on("page", (page) =>
    {
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
    });
    const page = await context.newPage();
    const url = (file) => new URL(file, server.url).href;
    await ready(page, server.url);
    await check("Desktop 1200×900, meaningful initial homepage, correct title and original studio asset", async () =>
    {
        assert.equal(await page.title(), "Tangent & Tide");
        await expect(page.locator("h1")).toHaveText("Ordinary things.Extraordinary stories.");
        await expect(page.locator(".studio-frame img")).toBeVisible();
        assert.equal(await page.locator(".studio-frame img").evaluate((image) => image.naturalWidth > 0), true);
        assert.equal(await page.evaluate(() => document.fonts.check("600 24px Fraunces") && document.fonts.check("400 16px Inter") && document.fonts.check('400 12px "IBM Plex Mono"')), true);
        await overflow(page, "desktop before interactions");
        await page.screenshot({ path: report.screenshots[0] });
    });
    report.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1, page: "home" });
    await check("Real original audio metadata, no autoplay, disabled out-of-range skips", async () =>
    {
        await expect.poll(() => page.locator("audio").evaluate((audio) => audio.readyState)).toBeGreaterThan(0);
        const audio = await page.locator("audio").evaluate((element) => ({ duration: element.duration, paused: element.paused, time: element.currentTime }));
        assert.equal(audio.duration, 24);
        assert.equal(audio.paused, true);
        assert.equal(audio.time, 0);
        await expect(page.getByRole("button", { name: "Back 15 seconds", exact: true })).toBeDisabled();
        await expect(page.getByRole("button", { name: "Forward 30 seconds", exact: true })).toBeDisabled();
        const wave = await readFile(path.join(folder, "out/public/audio/episode-preview.wav"));
        assert.equal(wave.toString("ascii", 0, 4), "RIFF");
        assert.equal(wave.readUInt16LE(22), 1);
        assert.equal(wave.readUInt16LE(34), 16);
        assert.equal(wave.length, 1058444);
    });
    await check("Actual user-initiated play/pause, elapsed playback and real rate changes", async () =>
    {
        await page.getByRole("button", { name: "Play preview", exact: true }).click();
        await expect.poll(() => page.locator("audio").evaluate((audio) => audio.currentTime)).toBeGreaterThan(.1);
        await expect(page.getByRole("button", { name: "Pause preview", exact: true })).toBeVisible();
        await page.getByRole("button", { name: "Playback speed", exact: true }).click();
        assert.equal(await page.locator("audio").evaluate((audio) => audio.playbackRate), 1.25);
        await page.getByRole("button", { name: "Pause preview", exact: true }).click();
        assert.equal(await page.locator("audio").evaluate((audio) => audio.paused), true);
    });
    await check("Keyboard seek uses real audio time; 15-second back is duration-aware", async () =>
    {
        const seek = page.getByRole("slider", { name: "Seek preview", exact: true });
        await seek.focus();
        await seek.press("End");
        await seek.press("ArrowLeft");
        await expect.poll(() => page.locator("audio").evaluate((audio) => audio.currentTime)).toBeGreaterThan(23);
        await expect(page.getByRole("button", { name: "Back 15 seconds", exact: true })).toBeEnabled();
        await page.getByRole("button", { name: "Back 15 seconds", exact: true }).click();
        await expect.poll(() => page.locator("audio").evaluate((audio) => audio.currentTime)).toBeLessThan(10);
        await expect(page.getByRole("button", { name: "Back 15 seconds", exact: true })).toBeDisabled();
        await expect(page.getByRole("button", { name: "Forward 30 seconds", exact: true })).toBeDisabled();
    });
    await check("Actual mute/unmute and keyboard volume", async () =>
    {
        await page.getByRole("button", { name: "Mute", exact: true }).click();
        assert.equal(await page.locator("audio").evaluate((audio) => audio.muted), true);
        await page.getByRole("button", { name: "Unmute", exact: true }).click();
        const volume = page.getByRole("slider", { name: "Volume", exact: true });
        await volume.focus();
        await volume.press("Home");
        await volume.press("ArrowRight");
        const state = await page.locator("audio").evaluate((audio) => ({ volume: audio.volume, muted: audio.muted }));
        assert.equal(state.volume, .05);
        assert.equal(state.muted, false);
    });
    await check("Local subscription validates, persists after reload, and removes without transmission", async () =>
    {
        await page.locator(".email-toggle").click();
        await expect(page.locator("#email-panel")).toContainText("not sent anywhere");
        await page.locator("#email-address").fill("not-an-address");
        await page.locator(".email-form button").click();
        assert.equal(await page.evaluate(() => localStorage.getItem("tangent-and-tide-local-email")), null);
        await page.locator("#email-address").fill("listener@example.com");
        await page.locator(".email-form button").click();
        await expect(page.locator(".email-saved")).toBeVisible();
        assert.equal(await page.evaluate(() => localStorage.getItem("tangent-and-tide-local-email")), "listener@example.com");
        await ready(page, server.url);
        await page.locator(".email-toggle").click();
        await expect(page.locator(".saved-address")).toHaveText("listener@example.com");
        await page.locator(".remove-email").click();
        assert.equal(await page.evaluate(() => localStorage.getItem("tangent-and-tide-local-email")), null);
        await expect(page.locator(".email-form")).toBeVisible();
    });
    await check("Copy action writes the correct final-subpath homepage URL and confirms", async () =>
    {
        await page.locator(".subscribe-actions .copy-link").click();
        await expect(page.locator(".subscribe-actions .copy-link")).toHaveText("Copied");
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), server.url);
        await overflow(page, "desktop after subscription/copy/player interactions");
    });
    await check("All local navigation/file assets and eight-entry RSS respond successfully", async () =>
    {
        const links = await page.locator("a[href]").evaluateAll((anchors) => [...new Set(anchors.map((anchor) => anchor.href).filter((href) => href.startsWith(location.origin)))]);
        for (const href of links) assert.equal((await context.request.get(href)).status(), 200, href);
        const response = await context.request.get(url("feed.xml"));
        assert.equal(response.status(), 200);
        const xml = await response.text();
        assert.equal((xml.match(/<item>/g) || []).length, 8);
        assert.equal((xml.match(/<enclosure /g) || []).length, 8);
        assert.ok(xml.includes("instrumental"));
        assert.equal(await page.evaluate(async () => new DOMParser().parseFromString(await (await fetch("./feed.xml")).text(), "application/xml").querySelectorAll("parsererror").length), 0);
    });
    await check("Archive query filter initializes and case-insensitive search combines with topics", async () =>
    {
        await ready(page, url("episodes.html?topic=objects"));
        await expect(page.locator(".filter[data-topic=objects]")).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(".episode-row")).toHaveCount(2);
        await page.getByRole("searchbox").fill("LENA");
        await expect(page.locator(".episode-row")).toHaveCount(2);
        await page.getByRole("searchbox").fill("paper");
        await expect(page.locator(".episode-row")).toHaveCount(1);
        await expect(page.locator(".episode-info h3")).toHaveText("The Quiet Engineering of Paper Clips");
        await page.locator(".filter[data-topic=cities]").click();
        await expect(page.locator(".empty-state")).toContainText("No episodes found.");
        await page.locator(".clear-filters").click();
        await expect(page.locator(".episode-row")).toHaveCount(8);
        await expect(page.locator("#result-count")).toHaveText("8 episodes");
        await page.getByRole("searchbox").fill("GLOVES");
        await expect(page.locator(".episode-row")).toHaveCount(1);
        await page.locator(".clear-filters").click();
        await page.locator(".filter[data-topic=standards]").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator(".episode-row")).toHaveCount(1);
        await expect(page.locator(".episode-info h3")).toHaveText("The Color of Emergency Exits");
        await overflow(page, "archive desktop after filtering");
    });
    await check("Detail fallback, chapter highlight without false seek, and explicit scripted transcript", async () =>
    {
        await ready(page, url("episode.html?slug=unknown"));
        await expect(page.locator("h1")).toHaveText("Why the Humble Doorknob Turns");
        await expect(page.locator(".chapter")).toHaveCount(4);
        await page.locator("[data-chapter='2']").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("[data-chapter='2']")).toHaveAttribute("aria-current", "true");
        await expect(page.locator("[data-note='2']")).toHaveClass(/highlight/);
        assert.equal(await page.locator("audio").evaluate((audio) => audio.currentTime), 0);
        await page.locator(".transcript summary").click();
        await expect(page.locator(".transcript")).toHaveAttribute("open", "");
        await expect(page.locator(".transcript")).toContainText("not a verbatim recording");
        await expect(page.locator(".transcript")).toContainText("Lena:");
        await expect(page.locator(".related-card").first()).toContainText("The Quiet Engineering of Paper Clips");
        await overflow(page, "detail desktop after chapters/transcript");
    });
    const { episodes } = await import(pathToFileURL(path.join(folder, "content.js")));
    await check("All eight detail routes have unique notes, chapters, guest context and correct non-autoplay preview", async () =>
    {
        const bodies = new Set();
        for (const episode of episodes)
        {
            await ready(page, url(`episode.html?slug=${episode.slug}`));
            await expect(page.locator("h1")).toHaveText(episode.title);
            await expect(page.locator(".note-panel")).toHaveCount(4);
            await expect(page.locator(".takeaways li")).toHaveCount(3);
            await expect(page.locator(".guest-context")).toContainText(episode.guest === "lena" ? "Lena Ort" : episode.guest === "theo" ? "Theo Wren" : episode.guest === "amara" ? "Amara Pell" : episode.guest === "sera" ? "Sera Quince" : "Nico Vale");
            bodies.add(await page.locator("[data-note='0'] p").innerText());
            assert.equal(await page.locator("audio").evaluate((audio) => audio.paused && audio.currentTime === 0), true);
            await overflow(page, `episode ${episode.number}`);
        }
        assert.equal(bodies.size, 8);
        await ready(page, url("episode.html"));
        await expect(page.locator("h1")).toHaveText(episodes[0].title);
    });
    await check("Guest directory has exact three fictional guest portraits, two host profiles and working detail links", async () =>
    {
        await ready(page, url("guests.html#lena"));
        await expect(page.locator(".guest-card")).toHaveCount(3);
        await expect(page.locator(".host-directory article")).toHaveCount(2);
        assert.equal(await page.locator("#lena img").getAttribute("src"), "./public/images/guest-lena.webp");
        const links = await page.locator(".guest-episodes a").evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
        assert.equal(links.length, 6);
        for (const href of links) assert.equal((await context.request.get(href)).status(), 200);
        await overflow(page, "guests desktop");
    });
    await check("Additional desktop archive, notes, guests, and lower-home visual evidence", async () =>
    {
        await ready(page, url("episodes.html"));
        await page.screenshot({ path: path.join(folder, ".checks/archive.png") });
        await ready(page, url("episode.html"));
        await page.locator(".notes-grid").scrollIntoViewIfNeeded();
        await page.waitForTimeout(650);
        await page.screenshot({ path: path.join(folder, ".checks/notes.png") });
        await ready(page, url("guests.html"));
        await page.screenshot({ path: path.join(folder, ".checks/guests.png") });
        await ready(page, server.url);
        await page.locator(".voices-section").scrollIntoViewIfNeeded();
        await page.waitForTimeout(650);
        await page.screenshot({ path: path.join(folder, ".checks/home-voices.png") });
    });
    await check("1440×900 original-prompt desktop viewport: four pages without overflow", async () =>
    {
        await page.setViewportSize({ width: 1440, height: 900 });
        for (const file of ["index.html", "episodes.html", "episode.html", "guests.html"])
        {
            await ready(page, url(file));
            await overflow(page, `1440 ${file}`);
        }
        report.viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1, pages: ["home", "archive", "detail", "guests"] });
    });
    await check("390×844 mobile first screen shows complete studio image and primary playback control", async () =>
    {
        await page.setViewportSize({ width: 390, height: 844 });
        await ready(page, server.url);
        await overflow(page, "mobile homepage before interactions");
        const image = await page.locator(".studio-frame").boundingBox();
        const play = await page.locator(".play-button").boundingBox();
        assert.ok(image.y + image.height <= 844, `Studio image outside first screen: ${JSON.stringify(image)}`);
        assert.ok(play.y + play.height <= 844, `Play control outside first screen: ${JSON.stringify(play)}`);
        await page.screenshot({ path: report.screenshots[1] });
        report.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, page: "home", imageBottom: image.y + image.height, playBottom: play.y + play.height });
    });
    await check("Mobile accessible disclosure opens in flow and Escape restores focus", async () =>
    {
        await page.locator(".menu-button").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#primary-nav")).toBeVisible();
        await expect(page.locator(".menu-button")).toHaveAttribute("aria-expanded", "true");
        await overflow(page, "mobile menu open");
        await page.keyboard.press("Escape");
        await expect(page.locator(".menu-button")).toBeFocused();
        await expect(page.locator(".menu-button")).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator("#primary-nav")).not.toBeVisible();
    });
    await check("Mobile actual audio, subscription and visible keyboard focus", async () =>
    {
        await page.getByRole("button", { name: "Play preview", exact: true }).click();
        await expect.poll(() => page.locator("audio").evaluate((audio) => audio.currentTime)).toBeGreaterThan(.1);
        await page.getByRole("button", { name: "Pause preview", exact: true }).click();
        await page.locator(".email-toggle").click();
        await page.locator("#email-address").fill("mobile@example.com");
        await page.locator(".email-form button").click();
        await expect(page.locator(".email-saved")).toBeVisible();
        await page.locator(".remove-email").click();
        await page.locator(".email-toggle").focus();
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
        await overflow(page, "mobile home after interactions");
    });
    await check("Mobile archive, text companion, guest links and scoped chapter scroller", async () =>
    {
        await ready(page, url("episodes.html?topic=materials"));
        await expect(page.locator(".episode-row")).toHaveCount(2);
        await overflow(page, "mobile archive before");
        await page.getByRole("searchbox").fill("click");
        await expect(page.locator(".episode-row")).toHaveCount(1);
        await overflow(page, "mobile archive after search");
        await ready(page, url("episode.html"));
        await overflow(page, "mobile detail before");
        await page.locator("[data-chapter='3']").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("[data-note='3']")).toHaveClass(/highlight/);
        await page.locator(".transcript summary").click();
        await expect(page.locator(".transcript")).toContainText("instrumental only");
        assert.equal(await page.locator("audio").evaluate((audio) => audio.currentTime), 0);
        await overflow(page, "mobile detail after");
        await page.locator(".notes-grid").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(folder, ".checks/mobile-notes.png") });
        await ready(page, url("guests.html#amara"));
        await overflow(page, "mobile guest directory");
        report.viewports.push({ width: 390, height: 844, pages: ["archive", "detail", "guests"], keyboard: true });
    });
    await check("Reduced-motion preference preserves controls and disables nonessential animation", async () =>
    {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await ready(page, server.url);
        const style = await page.locator(".hero-copy").evaluate((element) => ({ opacity: getComputedStyle(element).opacity, transition: getComputedStyle(element).transitionDuration }));
        assert.equal(style.opacity, "1");
        assert.equal(style.transition, "0s");
        await page.getByRole("button", { name: "Playback speed", exact: true }).click();
        assert.equal(await page.locator("audio").evaluate((audio) => audio.playbackRate), 1.25);
        await overflow(page, "mobile reduced motion");
    });
    await check("All six supplied images load locally and total public assets remain below 20 MB", async () =>
    {
        const photos = await readdir(path.join(folder, "out/public/images"));
        assert.equal(photos.length, 6);
        for (const file of photos) assert.equal((await context.request.get(url(`public/images/${file}`))).status(), 200);
        async function size(directory)
        {
            let bytes = 0;
            for (const entry of await readdir(directory, { withFileTypes: true }))
            {
                const file = path.join(directory, entry.name);
                bytes += entry.isDirectory() ? await size(file) : (await stat(file)).size;
            }
            return bytes;
        }
        report.publicBytes = await size(path.join(folder, "out"));
        assert.ok(report.publicBytes < 20 * 1024 * 1024);
    });
    assert.deepEqual(errors, []);
    report.passed = true;
}
catch (error)
{
    report.failure = error.stack;
    console.error(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    report.resourcesClosed = true;
    report.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks/qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, assertions: report.assertions.length, errors: report.errors, failure: report.failure || null, resourcesClosed: report.resourcesClosed }));
}
