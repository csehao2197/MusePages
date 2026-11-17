import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { StaticHomepage, WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { Race, loadBest } from "../race.js";
import { newPlayer, drive } from "../drive.js";
import { at, project, curve } from "../track.js";
import { C } from "../content.js";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = process.cwd();
const results = [];
const errors = [];
let browser;
let service;
let resourcesClosed = false;
let failure;
const check = (name, fn) =>
{
    fn();
    results.push({ name, passed: true });
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const memory = new Map();
const storage =
{
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key)
};
function locate(p, s, lateral = 0)
{
    const f = at(s, lateral);
    Object.assign(p, { s, lateral, x: f.p.x, z: f.p.z, yaw: f.yaw, hit: Math.round(s / 4) % 250 });
}
function autopilot(r, limit = 18000)
{
    let saw = new Set();
    for (let i = 0; i < limit && r.state !== "podium"; i++)
    {
        const p = r.player;
        const target = at(p.s + 12).p;
        const rawAngle = Math.atan2(target.z - p.z, target.x - p.x) - p.yaw;
        const error = Math.atan2(Math.sin(rawAngle), Math.cos(rawAngle));
        const speed = p.s > 690 && p.s < 940 ? 21 : 38;
        r.step(1 / 60, { gas: p.speed < speed, brake: p.speed > speed + 1, steer: Math.max(-1, Math.min(1, error * 4)), drift: false });
        saw.add(p.gate);
    }
    return [...saw];
}
try
{
    check("1000 m closed curve; signed centerline projection and bank geometry", () =>
    {
        assert.ok(Math.abs(curve.getLength() - 1000) < .02);
        const f = at(300, 5);
        const hit = project(f.p.x, f.p.z, 75);
        assert.ok(Math.abs(hit.lateral - 5) < .1);
        assert.ok(f.p.y > 3);
    });
    check("Acceleration, braking/reverse and off-asphalt cap are simulated", () =>
    {
        const p = newPlayer();
        for (let i = 0; i < 60; i++) drive(p, { gas: true, steer: 0 }, 1 / 60);
        assert.ok(p.speed > 15 && p.speed < 17);
        for (let i = 0; i < 90; i++) drive(p, { brake: true, steer: 0 }, 1 / 60);
        assert.equal(p.speed, -6);
        locate(p, 100, 10);
        p.speed = 42;
        drive(p, { gas: true, steer: 0 }, 1 / 60);
        assert.equal(p.speed, 26);
    });
    check("Drift earns a real armed boost; Shift spends it for 1.2 seconds", () =>
    {
        const p = newPlayer();
        p.speed = 25;
        for (let i = 0; i < 151; i++)
        {
            locate(p, 100);
            drive(p, { gas: true, drift: true, steer: .5 }, 1 / 60);
        }
        assert.equal(p.meter, 1);
        drive(p, { gas: true, drift: true, boost: true, steer: 0 }, 1 / 60);
        assert.ok(p.boost > 1.18);
        assert.equal(p.meter, 0);
    });
    check("Off-track resets to last gate without inventing laps; wrong-way warning", () =>
    {
        const r = new Race();
        r.state = "racing";
        r.player.gate = 500;
        locate(r.player, 550, 12);
        for (let i = 0; i < 74; i++) r.step(1 / 60, { steer: 0 });
        assert.equal(r.player.completed, 0);
        assert.equal(r.player.gate, 500);
        assert.ok(Math.abs(r.player.lateral) < 1);
        locate(r.player, 550);
        r.player.speed = 0;
        r.player.resetTime = 0;
        r.player.yaw += Math.PI;
        for (let i = 0; i < 26; i++) r.step(1 / 60, { steer: 0 });
        assert.equal(r.visibleBanner, C.labels.wrong);
    });
    check("Obstacle and rival collisions affect real speed", () =>
    {
        const p = newPlayer();
        locate(p, 560, 6.6);
        p.speed = 30;
        drive(p, { steer: 0 }, 1 / 60);
        assert.ok(p.speed < 23 && p.speed >= 7);
        const r = new Race();
        r.state = "racing";
        locate(r.player, 100);
        r.player.speed = 25;
        Object.assign(r.rivals[0], { s: 100.5, lateral: 0, speed: 25 });
        r.step(1 / 60, { gas: true, steer: 0 });
        assert.ok(r.player.speed < 24);
    });
    check("Crossing the line without ordered gates cannot increment a lap", () =>
    {
        const r = new Race();
        r.state = "racing";
        locate(r.player, 999.8);
        r.player.speed = 30;
        r.player.reached40 = true;
        r.step(1 / 60, { gas: true, steer: 0 });
        assert.equal(r.player.completed, 0);
    });
    let winningHeat;
    check("Complete playable heat: steering/braking through 3 laps, gates, real times and win", () =>
    {
        const r = new Race(storage);
        r.start();
        r.step(.5, {});
        assert.equal(r.player.speed, 0);
        assert.equal(r.clock, 0);
        const gates = autopilot(r);
        assert.equal(r.state, "podium");
        assert.equal(r.player.completed, 3);
        assert.equal(r.lapTimes.length, 3);
        assert.ok(gates.includes(250) && gates.includes(500) && gates.includes(750));
        assert.equal(r.position(), 1);
        assert.ok(r.clock > 90 && r.clock < 110);
        assert.equal(r.player.finish, r.clock);
        assert.ok(r.rivals.every((c) => c.finish === null));
        const clock = r.clock;
        r.step(5, { gas: true });
        assert.equal(r.clock, clock);
        winningHeat = { clock: r.clock, lapTimes: r.lapTimes, position: r.position(), bestSamples: r.best.samples.length };
        results.push({ name: "Full heat measured results", passed: true, ...winningHeat });
    });
    check("Ghost persists, interpolates, rejects corrupt data, and clears its browser key", () =>
    {
        const r = new Race(storage);
        assert.ok(r.best?.samples.length > 100);
        r.start();
        r.state = "racing";
        r.clock = 2;
        assert.ok(Number.isFinite(r.ghost().x));
        r.clearBest();
        assert.equal(memory.size, 0);
        assert.equal(r.ghost(), null);
        assert.equal(loadBest({ getItem: () => "{broken" }), null);
        assert.equal(loadBest({ getItem: () => JSON.stringify({ time: 30, samples: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]] }) }), null);
    });
    check("Paused core freezes clock and position; restart restores the real grid", () =>
    {
        const r = new Race();
        r.start();
        for (let i = 0; i < 180; i++) r.step(1 / 60, { gas: true, steer: 0 });
        r.pause();
        const before = r.snapshot();
        r.step(5, { gas: true, steer: 1 });
        assert.deepEqual(r.snapshot(), before);
        r.start();
        assert.equal(r.player.s, 20);
        assert.deepEqual(r.rivals.map((c) => c.s), [52, 36, 8]);
        assert.equal(r.clock, 0);
    });

    await StaticHomepage.checkSource(folder);
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "dusk-track-racing-game", "GPT-6");
    results.push({ name: "Independent static export and source checks", passed: true, digest });
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    assert.equal((await fetch(service.url)).status, 200);
    browser = await chromium.launch({ headless: true });
    async function overflow(page, name)
    {
        const measurement = await page.evaluate(() => ({
            scroll: document.documentElement.scrollWidth,
            viewport: innerWidth,
            body: document.body.scrollWidth
        }));
        assert.ok(measurement.scroll <= measurement.viewport && measurement.body <= measurement.viewport, JSON.stringify(measurement));
        results.push({ name, passed: true, ...measurement });
    }
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 700;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
        page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
        await page.goto(service.url, { waitUntil: "networkidle" });
        await page.waitForSelector('body[data-ready="true"]', { state: "attached" });
        await page.evaluate(() => document.fonts.ready);
        await overflow(page, `${viewport.width}: initial overflow`);
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png") });
        assert.ok(await page.getByRole("heading", { name: C.brand, exact: true }).isVisible());
        await page.getByRole("button", { name: C.labels.soundOff, exact: true }).click();
        assert.ok(await page.getByRole("button", { name: C.labels.soundOn, exact: true }).isVisible());
        await page.getByRole("button", { name: C.labels.soundOn, exact: true }).click();
        await page.getByRole("button", { name: C.labels.controls, exact: true }).click();
        assert.ok(await page.getByRole("heading", { name: C.labels.controls }).isVisible());
        await page.getByRole("button", { name: C.labels.back, exact: true }).click();
        await page.getByRole("button", { name: C.labels.start, exact: true }).click();
        await page.waitForFunction(() => window.raceSnapshot().state === "racing");
        assert.equal((await page.evaluate(() => window.raceSnapshot())).player.speed, 0);
        if (mobile)
        {
            const gas = await page.locator("#gas").boundingBox();
            const cdp = await context.newCDPSession(page);
            const gasTouch = { x: gas.x + 45, y: gas.y + 45, id: 31 };
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [gasTouch] });
            await page.waitForTimeout(1000);
            assert.ok((await page.evaluate(() => window.raceSnapshot())).player.speed > 10);
            const pad = await page.locator("#steer").boundingBox();
            const steerTouch = { x: pad.x + 110, y: pad.y + 66, id: 32 };
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [gasTouch, steerTouch] });
            await page.waitForTimeout(300);
            assert.ok((await page.evaluate(() => window.raceSnapshot())).player.steer > .5);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        }
        else
        {
            await page.keyboard.down("w");
            await page.waitForTimeout(1100);
            assert.ok((await page.evaluate(() => window.raceSnapshot())).player.speed > 10);
            await page.keyboard.down("d");
            await page.waitForTimeout(300);
            assert.ok((await page.evaluate(() => window.raceSnapshot())).player.steer > .5);
            await page.keyboard.up("d");
            await page.keyboard.up("w");
            await page.keyboard.press("r");
            await page.waitForTimeout(50);
            assert.ok((await page.evaluate(() => window.raceSnapshot())).player.resetTime > .5);
        }
        await page.getByRole("button", { name: C.labels.pause, exact: true }).click();
        const paused = await page.evaluate(() => window.raceSnapshot());
        await page.waitForTimeout(250);
        assert.deepEqual(await page.evaluate(() => window.raceSnapshot()), paused);
        await page.getByRole("button", { name: C.labels.controls, exact: true }).click();
        await page.keyboard.press("Escape");
        assert.ok(await page.getByRole("heading", { name: C.labels.paused }).isVisible());
        await page.getByRole("button", { name: C.labels.resume }).click();
        await page.waitForTimeout(100);
        assert.equal((await page.evaluate(() => window.raceSnapshot())).state, "racing");
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile-racing.png" : "desktop-racing.png") });
        await page.evaluate(() => window.dispatchEvent(new Event("blur")));
        await page.waitForTimeout(50);
        assert.equal((await page.evaluate(() => window.raceSnapshot())).state, "paused");
        await page.getByRole("button", { name: C.labels.resume }).click();
        await page.evaluate(() =>
        {
            Object.defineProperty(document, "hidden", { configurable: true, value: true });
            document.dispatchEvent(new Event("visibilitychange"));
            delete document.hidden;
        });
        await page.waitForTimeout(50);
        assert.equal((await page.evaluate(() => window.raceSnapshot())).state, "paused");
        await page.getByRole("button", { name: C.labels.restart, exact: true }).click();
        assert.equal((await page.evaluate(() => window.raceSnapshot())).state, "countdown");
        await overflow(page, `${viewport.width}: after driving, pause, controls, reset and restart`);
        results.push({ name: `${viewport.width}: actual ${mobile ? "touch pedals and analog steer" : "keyboard gas, steer and checkpoint reset"}; countdown, paused clocks, controls, blur/hidden, restart`, passed: true, viewport, errors: errors.length });
        await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.waitForSelector('body[data-ready="true"]', { state: "attached" });
    await overflow(page, "1440 desktop reduced-motion viewport");
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => window.raceSnapshot().state === "racing");
    results.push({ name: "Reduced-motion mode still starts real race; Enter primary control", passed: true });
    await context.close();
    const fallbackContext = await browser.newContext();
    const fallback = await fallbackContext.newPage();
    let fallbackErrors = 0;
    fallback.on("console", (message) => { if (message.type() === "error") fallbackErrors++; });
    await fallback.addInitScript(() =>
    {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args)
        {
            return type.includes("webgl") ? null : original.call(this, type, ...args);
        };
    });
    await fallback.goto(service.url, { waitUntil: "networkidle" });
    assert.ok(await fallback.getByText(C.labels.fallback).isVisible());
    await fallback.waitForTimeout(150);
    assert.ok(fallbackErrors <= 1);
    results.push({ name: "WebGL-unavailable fallback readable; no retry/error loop", passed: true, expectedRendererDiagnostics: fallbackErrors });
    await fallbackContext.close();
    assert.deepEqual(errors, []);
}
catch (error)
{
    failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), {
        passed: !failure && errors.length === 0,
        testedAt: new Date().toISOString(),
        assertions: results,
        errors,
        failure: failure || null,
        visualReviewed: false,
        screenshots: { desktop: ".checks\\desktop.png", mobile: ".checks\\mobile.png" },
        resourcesClosed
    });
}
console.log(JSON.stringify({ passed: !failure, assertions: results.length, failure, errors, resourcesClosed }));
