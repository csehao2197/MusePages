import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { levels } from "../levels.js";
import { traceBeam } from "../trace.js";
import { initialState, reducer, cleanProgress } from "../state.js";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const job = JSON.parse(await readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const folder = job.output;
const qa = { prompt: job.prompt, modelId: job.modelId, passed: false, visualReviewed: false, date: new Date().toISOString(), tests: [], errors: [], viewports: [], screenshots: {}, resourcesClosed: false };
let service;
let browser;
const record = (name, evidence) => qa.tests.push({ name, passed: true, evidence });
const getMoves = async (page) => Number(await page.locator("#moves").textContent());
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: horizontal overflow ${JSON.stringify(sizes)}`);
    return sizes;
}
async function choose(page, index)
{
    if (await page.locator("#dialog").evaluate((element) => element.open)) await page.locator("#close-dialog").click();
    await page.locator('header [data-action="levels"]').click();
    await page.locator(`[data-level="${index}"]`).click();
    assert.equal(await getMoves(page), 0);
    assert.equal((await page.locator("#level-name").textContent()).trim(), levels[index].name);
}
async function solveKeyboard(page, level)
{
    await page.locator("#board").focus();
    for (const piece of level.pieces)
    {
        const clicks = piece.type === "P" ? (piece.solved - piece.initial + 4) % 4 : 1;
        for (let turn = 0; turn < clicks; turn++) await page.keyboard.press("Enter");
        if (piece.id !== level.pieces.length - 1) await page.keyboard.press("ArrowRight");
    }
}
function fixture(pieces, receivers = [{ x: 3, y: 1, d: 1 }], blockers = [])
{
    return { size: 4, emitter: { x: 0, y: 1, d: 1 }, pieces: pieces.map((piece, id) => ({ id, ...piece })), receivers, blockers };
}
try
{
    assert.equal(levels.length, 12);
    for (const level of levels)
    {
        let state = initialState({ current: level.id - 1 });
        const initial = traceBeam(level, state.rotations);
        assert(!initial.solved, `Level ${level.id} must start unsolved`);
        for (const piece of level.pieces)
        {
            const clicks = piece.type === "P" ? (piece.solved - piece.initial + 4) % 4 : 1;
            for (let index = 0; index < clicks; index++) state = reducer(state, { type: "rotate", index: piece.id });
        }
        const solved = traceBeam(level, state.rotations);
        assert(solved.solved, `Authored route ${level.id} must work`);
        assert.equal(solved.lit.length, level.receivers.length);
        assert.equal(state.moves, level.target, `Authored target ${level.id}`);
        assert(state.solved.includes(level.id));
        record(`Pure authored solution ${String(level.id).padStart(2, "0")}`, { initialUnsolved: true, targets: solved.lit.length, moves: state.moves, visits: solved.visits });
    }
    let f = fixture([{ x: 1, y: 1, type: "L" }]);
    assert(traceBeam(f, [0]).solved);
    assert(!traceBeam(f, [1]).solved);
    assert(!traceBeam(fixture([], undefined, [{ x: 2, y: 1 }]), []).solved);
    assert(!traceBeam(fixture([], [{ x: 3, y: 1, d: 3 }]), []).solved);
    const rising = [1, 0, 3, 2];
    const falling = [3, 2, 1, 0];
    for (let d = 0; d < 4; d++)
    {
        const step = [[0, -1], [1, 0], [0, 1], [-1, 0]][d];
        for (const [rotation, output] of [[0, rising[d]], [1, falling[d]]])
        {
            const outStep = [[0, -1], [1, 0], [0, 1], [-1, 0]][output];
            const level = { size: 5, emitter: { x: 2 - step[0], y: 2 - step[1], d }, pieces: [{ id: 0, x: 2, y: 2, type: "M" }], receivers: [{ x: 2 + outStep[0], y: 2 + outStep[1], d: output }], blockers: [] };
            assert(traceBeam(level, [rotation]).solved);
        }
    }
    f = fixture([{ x: 1, y: 1, type: "P" }, { x: 1, y: 3, type: "M" }], [{ x: 3, y: 1, d: 1 }, { x: 3, y: 3, d: 1 }]);
    assert(traceBeam(f, [2, 1]).solved);
    assert(!traceBeam(f, [0, 1]).solved);
    const loop = {
        size: 4, emitter: { x: 0, y: 1, d: 1 }, receivers: [{ x: 3, y: 3, d: 1 }], blockers: [],
        pieces: [{ id: 0, x: 1, y: 1, type: "P" }, { id: 1, x: 2, y: 1, type: "M" }, { id: 2, x: 2, y: 2, type: "M" }, { id: 3, x: 1, y: 2, type: "M" }]
    };
    const loopResult = traceBeam(loop, [1, 1, 0, 1]);
    assert(loopResult.visits <= 64 && !loopResult.capped && !loopResult.solved);
    const capFixture = { size: 3000, emitter: { x: 0, y: 0, d: 1 }, pieces: [], receivers: [{ x: 2999, y: 0, d: 1 }], blockers: [] };
    assert.equal(traceBeam(capFixture, []).visits, 2048);
    assert(traceBeam(capFixture, []).capped);
    record("Optical edge rules", "Both mirror mappings in all four directions; axis gating; blockers; directional receivers; splitter straight and branch; deduplicated loop; exact 2048 cap");
    let state = initialState();
    state = reducer(state, { type: "rotate" });
    assert.equal(state.moves, 1);
    const undone = reducer(state, { type: "undo" });
    assert.deepEqual(undone.rotations, levels[0].pieces.map((piece) => piece.initial));
    assert.equal(undone.moves, 0);
    assert.equal(undone.best[1], 1);
    const restarted = reducer(state, { type: "restart" });
    assert.equal(restarted.moves, 0);
    assert.equal(restarted.history.length, 0);
    assert.equal(restarted.best[1], 1);
    state = reducer(state, { type: "rotate" });
    state = reducer(state, { type: "rotate" });
    assert.equal(state.moves, 3);
    assert.equal(state.best[1], 1);
    assert.deepEqual(cleanProgress({ current: 99, solved: [1, 1, -3, "2"], best: { 1: "2", 2: 3 } }), { current: 0, solved: [1], best: { 2: 3 }, sound: false });
    record("Reducer and persistence boundaries", "Quarter-turn snapshots, undo move count, restart state, retained best, malformed progress normalization");
    qa.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "light-beam-lens-puzzle-game", "GPT-6");
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    assert.equal((await fetch(new URL("./package.json", service.url))).status, 404);
    record("Preview server isolation", "Only the actual static folder is served; repository README and source package manifest are inaccessible");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    function watch(page)
    {
        page.on("pageerror", (error) => qa.errors.push(`page: ${error.message}`));
        page.on("console", (message) => { if (message.type() === "error") qa.errors.push(`console: ${message.text()}`); });
        page.on("requestfailed", (request) => qa.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()}: ${response.url()}`); });
        page.on("request", (request) =>
        {
            if (new URL(request.url()).origin !== new URL(service.url).origin) qa.errors.push(`Unexpected remote request: ${request.url()}`);
        });
    }
    watch(page);
    assert.equal((await page.goto(service.url, { waitUntil: "networkidle" })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    assert.equal(await page.title(), "Lumenwild");
    assert(await page.locator("#board canvas").isVisible());
    assert.equal(await getMoves(page), 0);
    assert(await page.locator('.desktop-actions [data-action="undo"]').isDisabled());
    qa.viewports.push({ width: 1200, height: 900, dpr: 1, initial: await noOverflow(page, "desktop initial") });
    qa.screenshots.desktop = path.join(folder, ".checks", "desktop.png");
    await page.screenshot({ path: qa.screenshots.desktop });
    record("Initial static desktop", "HTTP 200 at final public subpath; real WebGL board; fonts ready; no overflow; Undo initially disabled; 1200x900 DPR1 screenshot");
    await page.locator('header [data-action="help"]').click();
    assert(await page.getByRole("heading", { name: "Rotate the optics. Follow the light." }).isVisible());
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => document.querySelector("#dialog").contains(document.activeElement)));
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.activeElement.dataset.action), "help");
    await page.locator("#board").focus();
    await page.keyboard.press("Enter");
    assert.equal(await getMoves(page), 1);
    assert.equal(await page.locator("#receiver-status").textContent(), "1 of 1 receivers lit");
    await page.keyboard.press("u");
    assert.equal(await getMoves(page), 0);
    assert.equal(await page.locator("#receiver-status").textContent(), "0 of 1 receivers lit");
    await page.keyboard.press("Enter");
    await page.keyboard.press("r");
    assert.equal(await getMoves(page), 0);
    record("Desktop keyboard and modal accessibility", "Enter rotates and traces live; U restores orientation/moves; R resets; native modal focus confinement; Escape closes and restores trigger focus");
    // Click the actual Three.js optic using an independently reconstructed camera.
    const point = await page.evaluate(async () =>
    {
        const THREE = await import("./vendor/three.module.js");
        const board = document.querySelector("#board").getBoundingClientRect();
        const aspect = board.width / board.height;
        const height = Math.max(4 * 1.53, 4 * 1.78 / aspect);
        const camera = new THREE.OrthographicCamera(-height * aspect / 2, height * aspect / 2, height / 2, -height / 2, 0.1, 100);
        camera.position.set(8, 10, 8);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        const p = new THREE.Vector3(-0.5, 0.4, -0.5).project(camera);
        return { x: board.x + (p.x + 1) / 2 * board.width, y: board.y + (1 - p.y) / 2 * board.height };
    });
    await page.mouse.click(point.x, point.y);
    assert.equal(await getMoves(page), 1);
    assert.equal(await page.locator("#receiver-status").textContent(), "1 of 1 receivers lit");
    await page.getByRole("heading", { name: "The path is whole." }).waitFor();
    assert.equal(await page.locator("#level-name").textContent(), levels[0].name);
    await page.getByRole("button", { name: "Replay", exact: true }).click();
    assert.equal(await getMoves(page), 0);
    record("Actual 3D raycast pointer play", "Clicked rendered lens; live route energized target; delayed completion dialog, no auto advance; Replay reset");
    for (const level of levels)
    {
        await choose(page, level.id - 1);
        assert.equal(await page.locator("#receiver-status").textContent(), `0 of ${level.receivers.length} receivers lit`);
        await solveKeyboard(page, level);
        assert.equal(await getMoves(page), level.target);
        assert.equal(await page.locator("#receiver-status").textContent(), `${level.receivers.length} of ${level.receivers.length} receivers lit`);
        await page.getByRole("heading", { name: "The path is whole." }).waitFor();
        assert(await page.getByText(`Solved in ${level.target} moves · Target ${level.target}`, { exact: true }).isVisible());
        await noOverflow(page, `desktop solved ${level.id}`);
        if (level.id === 12)
        {
            await page.locator("#close-dialog").click();
            await page.waitForTimeout(300);
            qa.screenshots.constellation = path.join(folder, ".checks", "constellation.png");
            await page.screenshot({ path: qa.screenshots.constellation });
            await page.locator("#continue").click();
        }
    }
    record("All twelve real browser solutions", "Unrestricted level selection; each initial HUD unsolved; keyboard quarter turns; all receivers activate simultaneously; exact authored move totals and completion dialogs on all 12 levels");
    await page.getByRole("button", { name: "Back to levels", exact: true }).click();
    assert.equal(await page.locator(".level-grid button").count(), 12);
    assert.equal(await page.locator(".level-grid small").count(), 12);
    await page.locator("#close-dialog").click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#level-name").textContent(), levels[11].name);
    assert.equal(await getMoves(page), 0);
    await page.locator('header [data-action="levels"]').click();
    assert.equal(await page.locator(".level-grid small").count(), 12);
    assert((await page.locator(".level-grid button").first().textContent()).includes("best 1"));
    await page.locator('[data-level="0"]').click();
    await page.locator('header [data-action="sound"]').click();
    assert.equal(await page.locator('header [data-action="sound"]').getAttribute("aria-pressed"), "true");
    await page.locator('header [data-action="sound"]').click();
    assert.equal(await page.locator('header [data-action="sound"]').getAttribute("aria-pressed"), "false");
    record("Persistent progress, final action and optional audio", "12 solved marks/bests survive reload; current level restores but unfinished rotations do not; final chamber returns to level grid; sound explicitly toggles on/off without errors");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(200);
    const desktop1440 = await noOverflow(page, "1440 desktop");
    assert(await page.evaluate(() => document.querySelector("main").getBoundingClientRect().bottom <= innerHeight));
    assert(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight));
    qa.viewports.push({ width: 1440, height: 900, dpr: 1, initial: desktop1440, wholeGameFits: true });
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    watch(mobile);
    assert.equal((await mobile.goto(service.url, { waitUntil: "networkidle" })).status(), 200);
    await mobile.evaluate(() => document.fonts.ready);
    await mobile.waitForTimeout(500);
    assert(await mobile.locator("#board canvas").isVisible());
    assert.equal(await mobile.locator('header [data-action="help"]').getAttribute("aria-label"), "How to play");
    const touchHeights = await mobile.locator(".mobile-controls button").evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    assert(touchHeights.every((height) => height >= 44));
    qa.viewports.push({ width: 390, height: 844, dpr: 1, initial: await noOverflow(mobile, "mobile initial") });
    qa.screenshots.mobile = path.join(folder, ".checks", "mobile.png");
    await mobile.screenshot({ path: qa.screenshots.mobile });
    const tapPoint = await mobile.evaluate(async () =>
    {
        const THREE = await import("./vendor/three.module.js");
        const board = document.querySelector("#board").getBoundingClientRect();
        const aspect = board.width / board.height;
        const height = Math.max(6.12, 7.12 / aspect);
        const camera = new THREE.OrthographicCamera(-height * aspect / 2, height * aspect / 2, height / 2, -height / 2, 0.1, 100);
        camera.position.set(8, 10, 8);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        const p = new THREE.Vector3(-0.5, 0.4, -0.5).project(camera);
        return { x: board.x + (p.x + 1) / 2 * board.width, y: board.y + (1 - p.y) / 2 * board.height };
    });
    await mobile.touchscreen.tap(tapPoint.x, tapPoint.y);
    assert.equal(await getMoves(mobile), 1);
    assert.equal(await mobile.locator("#receiver-status").textContent(), "1 of 1 receivers lit");
    await mobile.getByRole("heading", { name: "The path is whole." }).waitFor();
    await mobile.locator("#close-dialog").tap();
    await mobile.locator('.mobile-controls [data-action="undo"]').tap();
    assert.equal(await getMoves(mobile), 0);
    await mobile.locator('.mobile-controls [data-action="rotate"]').tap();
    assert.equal(await getMoves(mobile), 1);
    await mobile.getByRole("heading", { name: "The path is whole." }).waitFor();
    await mobile.getByRole("button", { name: "Next chamber", exact: true }).tap();
    assert.equal(await mobile.locator("#level-name").textContent(), levels[1].name);
    await mobile.locator(".piece-panel summary").tap();
    await mobile.locator('[data-piece="0"]').tap();
    assert.equal(await mobile.locator("#receiver-status").textContent(), "1 of 1 receivers lit");
    await mobile.getByRole("heading", { name: "The path is whole." }).waitFor();
    await mobile.locator("#close-dialog").tap();
    await mobile.locator('.mobile-controls [data-action="restart"]').tap();
    assert.equal(await getMoves(mobile), 0);
    assert.equal(await mobile.locator("#receiver-status").textContent(), "0 of 1 receivers lit");
    await noOverflow(mobile, "mobile after gameplay");
    await mobile.locator('header [data-action="help"]').tap();
    assert(await mobile.locator('#dialog [data-action="sound"]').isVisible());
    await mobile.locator("#close-dialog").tap();
    await choose(mobile, 11);
    await noOverflow(mobile, "mobile largest board");
    await mobile.emulateMedia({ reducedMotion: "reduce" });
    await mobile.locator("#board").focus();
    await mobile.keyboard.press("Enter");
    assert.equal(await getMoves(mobile), 1);
    record("Mobile actual touch and accessible alternative", "390x844 DPR1; actual lens tap; fixed Undo/Rotate selected/Restart; next chamber; labeled DOM optic action; help sound; largest grid; reduced motion; no overflow before/after");
    const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await fallbackContext.addInitScript(() =>
    {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...rest)
        {
            if (type === "webgl2") return null;
            return getContext.call(this, type, ...rest);
        };
        localStorage.setItem("lumenwild-progress-v1", "{bad");
    });
    const fallback = await fallbackContext.newPage();
    watch(fallback);
    await fallback.goto(service.url, { waitUntil: "networkidle" });
    assert(await fallback.getByText(/3D rendering is unavailable/).isVisible());
    await fallback.locator(".piece-panel summary").click();
    await fallback.locator('[data-piece="0"]').click();
    assert.equal(await fallback.locator("#receiver-status").textContent(), "1 of 1 receivers lit");
    record("Graceful WebGL and corrupt storage fallback", "No WebGL context: clear local explanation, DOM controls still solve; malformed saved JSON does not crash");
    assert.deepEqual(qa.errors, [], "No HTTP/resource/request/console/page errors");
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, tests: qa.tests.length, errors: qa.errors, screenshots: qa.screenshots, resourcesClosed: qa.resourcesClosed }));
}
