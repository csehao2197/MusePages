import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let browser;
let service;
const errors = [];
let result;
try
{
    service = await startPreviewServer(path.join(folder, "out"), { workspace: process.cwd() });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (e) => { if (e.type() === "error") errors.push(e.text()); });
    page.on("requestfailed", (r) => errors.push(r.url()));
    page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start race", exact: true }).click();
    result = await page.evaluate(async () =>
    {
        const { at } = await import("./track.js");
        const start = performance.now();
        const held = new Set();
        const key = (code, down) =>
        {
            if (held.has(code) === down) return;
            if (down) held.add(code);
            else held.delete(code);
            window.dispatchEvent(new KeyboardEvent(down ? "keydown" : "keyup", { code, bubbles: true, cancelable: true }));
        };
        const gates = new Set();
        return new Promise((resolve, reject) =>
        {
            function tick()
            {
                const snapshot = window.raceSnapshot();
                if (performance.now() - start > 240000)
                {
                    for (const code of [...held]) key(code, false);
                    reject(new Error(`Real heat timeout: ${JSON.stringify(snapshot)}`));
                    return;
                }
                if (snapshot.state === "podium")
                {
                    for (const code of [...held]) key(code, false);
                    resolve({ snapshot, wallSeconds: (performance.now() - start) / 1000, gates: [...gates] });
                    return;
                }
                if (snapshot.state === "racing")
                {
                    const p = snapshot.player;
                    gates.add(p.gate);
                    const f = at(p.s + 10);
                    const raw = Math.atan2(f.p.z - p.z, f.p.x - p.x) - p.yaw;
                    const error = Math.atan2(Math.sin(raw), Math.cos(raw));
                    const desired = Math.max(-1, Math.min(1, error * 4));
                    const speed = p.s > 690 ? 18 : 32;
                    key("KeyW", p.speed < speed);
                    key("KeyS", p.speed > speed + 1);
                    key("KeyD", desired > 0 && p.steer < desired);
                    key("KeyA", desired < 0 && p.steer > desired);
                }
                requestAnimationFrame(tick);
            }
            tick();
        });
    });
    assert.equal(result.snapshot.player.completed, 3);
    assert.equal(result.snapshot.lapTimes.length, 3);
    assert.ok(result.gates.includes(250) && result.gates.includes(500) && result.gates.includes(750));
    assert.ok(await page.getByRole("heading", { name: "Heat complete" }).isVisible());
    assert.equal(await page.locator(".results li").count(), 4);
    const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage)[0])));
    assert.ok(persisted.time > 0 && persisted.samples.length > 100);
    await page.screenshot({ path: path.join(folder, ".checks", "podium.png") });
    await page.getByRole("button", { name: "Run it again", exact: true }).click();
    await page.waitForFunction(() => window.raceSnapshot().state === "racing");
    const ghostCount = await page.evaluate(async () =>
    {
        const { C } = await import("./content.js");
        return JSON.parse(localStorage.getItem(C.key)).samples.length;
    });
    assert.ok(ghostCount > 100);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page.reload({ waitUntil: "networkidle" });
    assert.ok(await page.getByText(/^Best lap [0-9]/).isVisible());
    await page.getByRole("button", { name: "Clear ghost", exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    assert.ok(await page.getByText("No best lap yet", { exact: true }).isVisible());
    assert.deepEqual(errors, []);
    result = { ...result, passed: true, browserKeyboardDriven: true, persistedSamples: ghostCount, podiumRows: 4, ghostReloadAndClear: true, errors };
}
catch (error)
{
    result = { passed: false, error: error.stack, errors, prior: result };
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "full-heat.json"), result);
}
console.log(JSON.stringify(result));
