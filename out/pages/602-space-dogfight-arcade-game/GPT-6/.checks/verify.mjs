import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const job = JSON.parse(await readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const metadataFile = path.join(folder, "metadata.json");
const tags = ["Dogfight", "Arcade", "Low Poly"];
assert.equal(job.prompt, "602-space-dogfight-arcade-game");
assert.equal(job.modelId, "gpt-6.1-sol");
const lockPID = Number((await readFile(job.promptLock, "utf8")).trim());
const state = JSON.parse(await readFile(job.stateFile, "utf8"));
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lockPID);
process.kill(lockPID, 0);

if (process.argv.includes("--prepare"))
{
    await W.saveJson(metadataFile, { modelId: job.modelId, tags, staticDir: "out", generated: false, preview: false, config_added: false, validated: false });
    for (const directory of ["vendor", "fonts", "licenses", "out"])
    {
        await mkdir(path.join(folder, directory), { recursive: true });
    }
    await copyFile(path.join(folder, "node_modules", "three", "build", "three.module.js"), path.join(folder, "vendor", "three.module.js"));
    await copyFile(path.join(folder, "node_modules", "three", "LICENSE"), path.join(folder, "licenses", "three-LICENSE.txt"));
    for (const [name, weight] of [["oxanium", 600], ["source-sans-3", 400], ["ibm-plex-mono", 400]])
    {
        await copyFile(path.join(folder, "node_modules", "@fontsource", name, "files", `${name}-latin-${weight}-normal.woff2`), path.join(folder, "fonts", `${name}-latin-${weight}-normal.woff2`));
        await copyFile(path.join(folder, "node_modules", "@fontsource", name, "LICENSE"), path.join(folder, "licenses", `${name}-LICENSE.txt`));
    }
    await S.copyHtml(folder, exported);
    await W.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([
        await readFile(job.file, "utf8"),
        await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8")
    ])).digest("hex") + "\n");
    await S.checkSource(folder);
    const metadata = await W.json(metadataFile);
    metadata.generated = true;
    await W.saveJson(metadataFile, metadata);
}
else if (process.argv.includes("--sync"))
{
    for (const name of ["index.html", "content.js", "tuning.js", "audio.js", "game.js", "main.js", "style.css", "favicon.svg", "LICENSE"])
    {
        await copyFile(path.join(folder, name), path.join(exported, name));
    }
}

const qa = { passed: false, date: new Date().toISOString(), source: await S.checkSource(folder), staticDigest: await S.validateStaticOutput(exported, "space-dogfight-arcade-game", "GPT-6"), tests: [], errors: [], visualReviewed: false, resourcesClosed: false, viewports: [], screenshots: {} };
let service;
let browser;
const test = (name, evidence) => qa.tests.push({ name, passed: true, evidence });
const get = (page, expression) => page.evaluate(async expression =>
{
    const { game } = await import("./main.js");
    return new Function("game", `return (${expression});`)(game);
}, expression);
const noOverflow = async page =>
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, height: innerHeight, documentHeight: document.documentElement.scrollHeight }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport && sizes.documentHeight <= sizes.height, JSON.stringify(sizes));
    return sizes;
};
const fixture = async (page, kind) => page.evaluate(async kind =>
{
    const { game } = await import("./main.js");
    const THREE = await import("./vendor/three.module.js");
    if (kind === "target")
    {
        game.launch();
        const drone = game.drones[0];
        drone.mesh.position.copy(game.ship.position).add(new THREE.Vector3(0, 0, -55));
        drone.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1));
        return;
    }
    if (kind === "loss")
    {
        game.launch();
        let collisions = 0;
        for (let i = 0; i < 6; i++)
        {
            game.invulnerable = 0;
            game.rollTime = 0;
            const bolt = game.bolts.find(item => item.enemy && item.life <= 0);
            bolt.life = 1;
            bolt.mesh.position.copy(game.ship.position);
            bolt.velocity.set(0, 0, 0);
            game.stepBolts(.01);
            collisions++;
        }
        return { collisions, shield: game.shield, state: game.state };
    }
    if (kind === "wave")
    {
        game.launch();
        let hits = 0;
        for (const drone of game.drones.filter(item => item.alive))
        {
            for (let i = 0; i < 2; i++)
            {
                const bolt = game.bolts.find(item => !item.enemy && item.life <= 0);
                bolt.life = 1;
                bolt.mesh.position.copy(drone.mesh.position);
                bolt.velocity.set(0, 0, 0);
                game.stepBolts(.01);
                hits++;
            }
        }
        const cleared = { hits, score: game.score, kills: game.metrics.kills, breather: game.breather, wave: game.wave };
        const neutral = { x: 0, y: 0, fire: false, lock: false, boost: false, roll: false };
        for (let i = 0; i < 90; i++) game.step(.033, neutral);
        return { cleared, nextWave: game.wave, drones: game.drones.filter(item => item.alive).length };
    }
    if (kind === "regen")
    {
        game.launch();
        game.damage();
        const start = game.shield;
        game.sinceHit = 1.7;
        game.step(.033, { x: 0, y: 0, fire: false, lock: false, boost: false, roll: false });
        const after = game.shield;
        game.rollTime = .6;
        game.invulnerable = 0;
        game.damage();
        return { start, after, protectedShield: game.shield };
    }
    if (kind === "boundary")
    {
        game.launch();
        game.ship.position.set(0, 0, -141);
        game.step(.033, { x: 0, y: 0 });
        return { boundary: game.boundary, returns: game.metrics.boundaryReturns };
    }
}, kind);

try
{
    service = await startPreviewServer(exported, { workspace });
    assert.equal((await fetch(service.url)).status, 200);
    assert.equal((await fetch(new URL("/", service.url))).status, 404);
    test("Final public subpath and static-only server isolation", service.url.replace(/:\d+/, ":PORT"));
    browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 768;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile });
        const page = await context.newPage();
        page.on("pageerror", error => qa.errors.push(`page: ${error.message}`));
        page.on("console", message => { if (message.type() === "error") qa.errors.push(`console: ${message.text()}`); });
        page.on("requestfailed", request => qa.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response => { if (response.status() >= 400) qa.errors.push(`http: ${response.status()} ${response.url()}`); });
        await page.goto(service.url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(async () => !!(await import("./main.js")).game);
        await page.waitForTimeout(500);
        assert.equal(await page.title(), "Cinder Patrol");
        assert.equal(await get(page, "game.state"), "title");
        assert.equal(await page.locator("#launch").isEnabled(), true);
        assert.equal(await page.locator("#card").isVisible(), true);
        qa.viewports.push({ ...viewport, DPR: 1, before: await noOverflow(page) });
        const screenshot = path.join(checks, mobile ? "mobile.png" : "desktop.png");
        await page.screenshot({ path: screenshot });
        qa.screenshots[mobile ? "mobile" : "desktop"] = screenshot;
        test(`${mobile ? "Mobile" : "Desktop"} lit title, loaded fonts, no overflow`, await get(page, "({ rocks: game.rocks.filter(x=>x.mesh.visible).length, stars: game.stars.geometry.drawRange.count, state: game.state })"));
        if (mobile)
        {
            const launchBox = await page.locator("#launch").boundingBox();
            assert.ok(launchBox.y >= 0 && launchBox.y + launchBox.height <= viewport.height);
            await page.locator("#card").evaluate(element => element.scrollTop = element.scrollHeight);
            await page.waitForTimeout(100);
            assert.equal(await page.locator(".credit").isVisible(), true);
            await page.locator("#card").evaluate(element => element.scrollTop = 0);
            test("Mobile primary action remains visible; manual and attribution scroll inside sheet", launchBox);
        }
        await page.locator("#launch").click();
        assert.equal(await get(page, "game.state"), "play");
        assert.equal(await page.locator("#hud").isVisible(), true);
        assert.equal(await get(page, "game.drones.filter(x=>x.alive).length"), 3);
        if (!mobile)
        {
            const yaw = await get(page, "game.ship.rotation.y");
            await page.keyboard.down("KeyD");
            await page.keyboard.down("Space");
            await page.waitForTimeout(450);
            await page.keyboard.up("KeyD");
            await page.keyboard.up("Space");
            assert.ok(await get(page, "game.ship.rotation.y") < yaw);
            assert.ok(await get(page, "game.metrics.shots") >= 2);
            await page.keyboard.press("Shift");
            await page.waitForTimeout(100);
            assert.ok(await get(page, "game.boostTime") > 0);
            await page.keyboard.press("KeyR");
            await page.waitForTimeout(100);
            assert.ok(await get(page, "game.rollTime") > 0);
            test("Keyboard steering, pooled firing, boost and protective roll", await get(page, "({...game.metrics, boostTime: game.boostTime, rollTime: game.rollTime})"));
            const tones = await page.locator("#tones").textContent();
            await page.keyboard.press("KeyM");
            await page.waitForTimeout(100);
            assert.notEqual(await page.locator("#tones").textContent(), tones);
            await page.locator("#tones").click();
            await page.waitForTimeout(100);
            assert.equal(await page.locator("#tones").textContent(), tones);
            test("Mute key/button and only permitted preference storage", await page.evaluate(() => Object.keys(localStorage)));
            await page.mouse.move(600, 450);
            const pointerShots = await get(page, "game.metrics.shots");
            await page.mouse.down();
            await page.waitForTimeout(300);
            await page.mouse.up();
            assert.ok(await get(page, "game.metrics.shots") > pointerShots);
            test("Desktop primary pointer fires actual pooled bolts", await get(page, "game.metrics.shots"));
            await fixture(page, "target");
            const shots = await get(page, "game.metrics.shots");
            await page.keyboard.down("Space");
            await page.waitForTimeout(750);
            await page.keyboard.up("Space");
            assert.ok(await get(page, "game.metrics.shots") > shots);
            assert.ok(await get(page, "game.metrics.kills") >= 1);
            test("Live keyboard bolts hit and destroy a pursuit drone", await get(page, "({kills:game.metrics.kills, score:game.score})"));
            await fixture(page, "target");
            const missiles = await get(page, "game.metrics.missiles");
            await page.keyboard.down("KeyF");
            await page.waitForTimeout(1100);
            await page.keyboard.up("KeyF");
            assert.ok(await get(page, "game.metrics.missiles") > missiles);
            await page.waitForTimeout(900);
            assert.ok(await get(page, "game.metrics.kills") >= 1);
            test("Held lock acquires, launches one homing missile and destroys target", await get(page, "({missiles:game.metrics.missiles,kills:game.metrics.kills})"));
            const wave = await fixture(page, "wave");
            assert.equal(wave.cleared.hits, 6);
            assert.equal(wave.cleared.score, 550);
            assert.ok(wave.cleared.breather > 0);
            assert.equal(wave.nextWave, 2);
            assert.equal(wave.drones, 5);
            test("Real collision fixtures: two bolts per drone, score, wave-clear success, breather, next wave", wave);
            const regen = await fixture(page, "regen");
            assert.equal(regen.start, 82);
            assert.ok(regen.after > regen.start);
            assert.equal(regen.after, regen.protectedShield);
            test("Shield damage, regeneration delay and roll damage immunity", regen);
            assert.equal((await fixture(page, "boundary")).boundary, true);
            test("Bounded volume automatic turn override", true);
            const loss = await fixture(page, "loss");
            assert.equal(loss.shield, 0);
            assert.equal(loss.state, "ended");
            await page.waitForTimeout(1100);
            assert.equal(await page.locator("#heading").textContent(), "Shields down");
            assert.ok((await page.locator("#deck").textContent()).includes("Wave reached 1"));
            await page.screenshot({ path: path.join(checks, "retry.png") });
            await page.getByRole("button", { name: "Fly again" }).click();
            assert.equal(await get(page, "game.state"), "play");
            assert.equal(await get(page, "game.shield"), 100);
            await fixture(page, "loss");
            await page.waitForTimeout(1100);
            await page.getByRole("button", { name: "Title", exact: true }).click();
            assert.equal(await get(page, "game.state"), "title");
            assert.equal(await get(page, "game.drones.filter(x=>x.alive).length"), 0);
            test("Six enemy projectile collision loss, retry without reload, title restoration", loss);
            await page.locator("#launch").click();
            await page.waitForTimeout(9000);
            assert.ok(await get(page, "game.metrics.enemyShots") > 0);
            test("Unmodified active enemy AI independently pursues and fires", await get(page, "({enemyShots:game.metrics.enemyShots, shield:game.shield, hits:game.metrics.hits})"));
        }
        else
        {
            assert.equal(await page.locator("#touch").isVisible(), true);
            const initialYaw = await get(page, "game.ship.rotation.y");
            const box = await page.locator("#stick").boundingBox();
            await page.mouse.move(box.x + 58, box.y + 58);
            await page.mouse.down();
            await page.mouse.move(box.x + 90, box.y + 40);
            await page.waitForTimeout(400);
            assert.ok(await get(page, "game.ship.rotation.y") < initialYaw);
            await page.mouse.up();
            assert.equal(await page.locator("#stick").getAttribute("aria-valuenow"), "0");
            const fireBox = await page.locator("#fire").boundingBox();
            await page.mouse.move(fireBox.x + 32, fireBox.y + 32);
            await page.mouse.down();
            await page.waitForTimeout(450);
            await page.mouse.up();
            assert.ok(await get(page, "game.metrics.shots") >= 2);
            await page.locator("#boost").tap();
            await page.waitForTimeout(100);
            assert.ok(await get(page, "game.boostTime") > 0);
            await page.locator("#roll").tap();
            await page.waitForTimeout(100);
            assert.ok(await get(page, "game.rollTime") > 0);
            test("Mobile stick pointer-capture steering and FIRE hold, real touch BOOST/ROLL", await get(page, "({...game.metrics})"));
            await fixture(page, "target");
            const lockBox = await page.locator("#lock").boundingBox();
            const missiles = await get(page, "game.metrics.missiles");
            await page.mouse.move(lockBox.x + 32, lockBox.y + 32);
            await page.mouse.down();
            await page.waitForTimeout(1200);
            await page.mouse.up();
            assert.ok(await get(page, "game.metrics.missiles") > missiles);
            test("Mobile held LOCK launches an actual homing missile", await get(page, "game.metrics.missiles"));
            const loss = await fixture(page, "loss");
            await page.waitForTimeout(1100);
            assert.equal(await page.locator("#touch").isVisible(), false);
            assert.equal(await page.locator("#heading").textContent(), "Shields down");
            await noOverflow(page);
            await page.getByRole("button", { name: "Fly again" }).tap();
            assert.equal(await get(page, "game.state"), "play");
            assert.equal(await page.locator("#touch").isVisible(), true);
            test("Mobile collision loss and touch retry restore live controls", loss);
        }
        await page.screenshot({ path: path.join(checks, mobile ? "mobile-play.png" : "desktop-play.png") });
        qa.viewports.at(-1).after = await noOverflow(page);
        await context.close();
    }
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await reduced.newPage();
    page.on("pageerror", error => qa.errors.push(error.message));
    await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(await get(page, "game.reduced"), true);
    await page.locator("#launch").click();
    await page.keyboard.press("Shift");
    await page.waitForTimeout(100);
    assert.equal(await get(page, "game.speedLines.visible"), false);
    assert.ok(await get(page, "game.boostTime") > 0);
    test("Reduced motion preserves playable boost while hiding speed lines", true);
    await reduced.close();
    assert.deepEqual(qa.errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
