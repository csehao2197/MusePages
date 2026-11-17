import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { C } from "../content.mjs";
import { initial, tick, care, purchase } from "../simulation.mjs";
import { validateSave, load } from "../storage.mjs";

const root = process.cwd();
const folder = path.resolve("out/pages/615-virtual-pet-companion/GPT-6");
const results = [];
const errors = [];
let server;
let browser;
const check = (name, data = {}) => results.push({ name, passed: true, ...data });
const getSave = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), C.key);
async function noOverflow(page, name)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(sizes.scroll <= sizes.viewport, `${name}: horizontal overflow ${JSON.stringify(sizes)}`);
    check(name, sizes);
}
async function newPage(viewport, options = {})
{
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...options });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
    page.on("console", (e) => { if (e.type() === "error") errors.push(`console: ${e.text()}`); });
    page.on("requestfailed", (r) => errors.push(`request: ${r.url()}: ${r.failure()?.errorText}`));
    page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    return { context, page };
}
async function autoplayer(page, type)
{
    await page.evaluate((type) =>
    {
        window.__qaPlayer = setInterval(() =>
        {
            const canvas = document.querySelector("canvas");
            if (!canvas || document.querySelector("#game-overlay")?.textContent.includes("Round complete")) return;
            const c = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            const pixels = c.getImageData(0, 0, w, h).data;
            const scale = w / 640;
            let found;
            const rgb = type === "catch" ? [246, 196, 83] : [105, 195, 212];
            for (let y = Math.floor(270 * scale); y > 16 * scale && !found; y -= 3)
            {
                for (let x = 20 * scale; x < w - 20 * scale; x += 3)
                {
                    const p = (Math.floor(y) * w + Math.floor(x)) * 4;
                    if (pixels[p] === rgb[0] && pixels[p + 1] === rgb[1] && pixels[p + 2] === rgb[2])
                    {
                        found = { x: x / scale, y: y / scale };
                        break;
                    }
                }
            }
            if (found)
            {
                const rect = canvas.getBoundingClientRect();
                canvas.dispatchEvent(new PointerEvent("pointerdown", { clientX: rect.left + found.x * rect.width / 640, clientY: rect.top + found.y * rect.height / 360, bubbles: true, pointerId: 7 }));
                canvas.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 7 }));
            }
        }, 80);
    }, type);
    await page.getByRole("heading", { name: "Round complete", exact: true }).waitFor({ timeout: 42000 });
    await page.evaluate(() => clearInterval(window.__qaPlayer));
    const score = Number(await page.locator("#score").textContent());
    assert.ok(score > 0, `${type} must earn real skill-based points`);
    return score;
}

try
{
    const start = initial(1000000000);
    const elapsed = tick(start, start.lastTickAt + 60000);
    assert.equal(elapsed.hunger, 71.7);
    assert.equal(elapsed.mood, 79.82);
    assert.equal(elapsed.cleanliness, 67.88);
    assert.equal(elapsed.energy, 85.9);
    assert.equal(tick(start, start.lastTickAt + 10080 * 60000 * 2).hunger, 0);
    assert.deepEqual(tick(start, start.lastTickAt - 1000).hunger, 72);
    for (const [action, expected] of [["feed", [96, 83, 64, 86]], ["play", [68, 98, 62, 76]], ["clean", [72, 84, 100, 83]], ["rest", [68, 80, 68, 100]]])
    {
        const next = care(start, action, start.lastTickAt).state;
        assert.deepEqual(C.meters.map((m) => next[m.key]), expected);
    }
    assert.ok(care({ ...start, energy: 9 }, "play", start.lastTickAt).error);
    const bought = purchase(start, "scarf").state;
    assert.equal(bought.coins, 10);
    assert.equal(bought.equipped, "scarf");
    assert.equal(purchase(bought, "scarf").state.coins, 10);
    assert.equal(purchase(bought, "hood").state.coins, 10);
    assert.throws(() => validateSave({ ...start, coins: "bad" }));
    assert.equal(validateSave({ ...start, hunger: -100, energy: 999 }).energy, 100);
    assert.equal(load({ getItem: () => "{broken" }).notice, C.text.corrupt);
    assert.equal(load({ getItem: () => { throw Error(); } }).unavailable, true);
    const offline = load({ getItem: () => JSON.stringify(start) }, start.lastTickAt + 600000);
    assert.equal(offline.state.hunger, 69);
    assert.equal(tick(offline.state, start.lastTickAt + 600000).hunger, 69);
    check("Pure simulation: exact four actions, timestamp decay, offline cap, schema safety, atomic purchases, no double decay");
    await W.ensureDirectory(folder, "out");
    for (const file of ["index.html", "style.css", "content.mjs", "simulation.mjs", "storage.mjs", "art.mjs", "game.mjs", "app.mjs", "icons.svg", "sprout.svg", "LICENSE", "Lucide-LICENSE.txt"])
    {
        await fs.copyFile(path.join(folder, file), path.join(folder, "out", file));
    }
    await fs.cp(path.join(folder, "fonts"), path.join(folder, "out", "fonts"), { recursive: true });
    const digest = await S.validateStaticOutput(path.join(folder, "out"), "virtual-pet-companion", "GPT-6");
    check("Independent static output and final public subpath validation", { digest });
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("../../../../README.md", server.url))).status, 404);
    check("Target-only HTTP server responds 200; repository paths not served", { url: server.url });
    browser = await chromium.launch({ headless: true });
    const { page, context } = await newPage({ width: 1200, height: 900 });
    await page.goto(server.url);
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("heading", { name: "Meet Bramble." }).waitFor();
    await page.waitForTimeout(200);
    assert.ok(await page.locator(".scene").isVisible());
    assert.equal(await page.locator(".track").count(), 4);
    const sceneBox = await page.locator(".scene").boundingBox();
    const consoleBox = await page.locator(".console").boundingBox();
    assert.ok(sceneBox.x + sceneBox.width < consoleBox.x, "Habitat must not overlap care console");
    await noOverflow(page, "Desktop initial 1200×900");
    await page.screenshot({ path: path.join(folder, ".checks", "desktop.png") });
    const initialCoins = (await getSave(page)).coins;
    await page.locator("#pat").click();
    assert.equal((await getSave(page)).coins, initialCoins);
    await page.keyboard.press("f");
    assert.equal(Math.round((await getSave(page)).hunger), 96);
    assert.equal(await page.locator(".scene").getAttribute("data-reaction"), "feed");
    await page.getByRole("button", { name: "Play", exact: false }).filter({ has: page.locator("kbd") }).click();
    assert.ok((await page.locator("#toast").textContent()).includes("ready in a second"));
    await page.waitForTimeout(1250);
    await page.keyboard.press("p");
    assert.equal(Math.round((await getSave(page)).energy), 76);
    await page.waitForTimeout(1250);
    await page.locator(".wash").click();
    assert.equal(Math.round((await getSave(page)).cleanliness), 90);
    await page.waitForTimeout(1250);
    await page.keyboard.press("r");
    assert.equal(Math.round((await getSave(page)).energy), 100);
    check("Actual pet pat, feed shortcut, cooldown, play shortcut, washing prop, rest shortcut and save");
    await noOverflow(page, "Desktop after care");
    await page.getByRole("link", { name: "Wardrobe", exact: true }).click();
    assert.equal(await page.locator(".outfit").count(), 6);
    await page.locator('[data-buy="scarf"]').click();
    assert.equal((await getSave(page)).coins, 10);
    assert.equal((await getSave(page)).equipped, "scarf");
    assert.equal(await page.locator(".dressing-stage .accessory").getAttribute("data-accessory"), "scarf");
    await page.locator('[data-buy="hood"]').click();
    assert.equal((await getSave(page)).coins, 10);
    assert.match(await page.locator("#toast").textContent(), /Need 25 more acorns/);
    await page.reload();
    await page.locator('[data-buy="scarf"][aria-pressed="true"]').waitFor();
    await page.getByRole("button", { name: "Remove accessory" }).click();
    assert.equal((await getSave(page)).equipped, null);
    await page.locator('[data-buy="scarf"]').click();
    assert.equal((await getSave(page)).coins, 10);
    await page.screenshot({ path: path.join(folder, ".checks", "wardrobe.png"), fullPage: true });
    check("Six outfits; atomic unlock/debit, insufficient funds unchanged, visible equip, none, reload persistence");
    await page.getByRole("link", { name: "Arcade", exact: true }).click();
    await page.locator("#start").click();
    await page.locator("#game").press("ArrowLeft");
    await page.waitForTimeout(700);
    await page.locator("#pause").click();
    const paused = await page.locator("#time").textContent();
    const pausedImage = await page.locator("canvas").screenshot();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator("#time").textContent(), paused);
    assert.ok(pausedImage.equals(await page.locator("canvas").screenshot()));
    await page.locator("#resume").click();
    const catchScore = await autoplayer(page, "catch");
    const afterCatch = await getSave(page);
    assert.equal(afterCatch.coins, 10 + catchScore);
    assert.equal(afterCatch.scores.catch, catchScore);
    await page.waitForTimeout(400);
    assert.equal((await getSave(page)).coins, afterCatch.coins);
    check("Snack Catch actual full 30-second round: keyboard, pixel-targeted pointer catches, frozen pause, one-time bank and high score", { score: catchScore });
    await page.locator('[data-game="bubble"]').click();
    await page.locator("#start").click();
    const reticleX = () => page.locator("canvas").evaluate((canvas) =>
    {
        const c = canvas.getContext("2d");
        const row = c.getImageData(0, Math.round(180 * canvas.height / 360), canvas.width, 1).data;
        for (let x = 0; x < canvas.width; x++)
        {
            if (row[x * 4] === 36 && row[x * 4 + 1] === 29 && row[x * 4 + 2] === 49) return x * 640 / canvas.width;
        }
        return null;
    });
    const beforeKeyboard = await reticleX();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(250);
    await page.keyboard.up("ArrowRight");
    assert.ok((await reticleX()) > beforeKeyboard + 40, "Keyboard actually moves the visible canvas reticle");
    await page.locator("#game").press("Space");
    const bubbleScore = await autoplayer(page, "bubble");
    assert.equal((await getSave(page)).coins, afterCatch.coins + bubbleScore);
    assert.equal((await getSave(page)).scores.bubble, bubbleScore);
    await page.screenshot({ path: path.join(folder, ".checks", "arcade.png"), fullPage: true });
    check("Bubble Pop actual full 25-second round: pointer hit testing, keyboard input, scores, exact one-time reward and persistence", { score: bubbleScore });
    await noOverflow(page, "Desktop arcade after both games");
    await page.locator("#again").click();
    await page.locator("#start").click();
    const beforeExit = (await getSave(page)).coins;
    await page.getByRole("link", { name: "Pet", exact: true }).click();
    await page.locator("#exit-dialog[open]").waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#exit-dialog").isVisible(), false);
    await page.getByRole("link", { name: "Pet", exact: true }).click();
    await page.locator("#confirm-exit").click();
    await page.getByRole("heading", { name: "Meet Bramble." }).waitFor();
    assert.equal((await getSave(page)).coins, beforeExit);
    await page.locator("#reset-open").click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#reset-open").evaluate((el) => document.activeElement === el), true);
    await page.locator("#reset-open").click();
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator("#confirm-reset").evaluate((el) => document.activeElement === el), true);
    await page.locator("#cancel-reset").click();
    await page.locator("#reset-open").click();
    await page.locator("#confirm-reset").click();
    const reset = await getSave(page);
    assert.equal(reset.coins, 30);
    assert.deepEqual(reset.owned, ["leaf"]);
    assert.deepEqual(reset.scores, { catch: null, bubble: null });
    check("Early exit requires confirmation, banks nothing; reset native modal traps focus, Escape returns focus, full reset persisted");
    await context.close();
    const mobile = await newPage({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
    await mobile.page.goto(server.url);
    await mobile.page.evaluate(() => document.fonts.ready);
    await mobile.page.waitForTimeout(200);
    await noOverflow(mobile.page, "Mobile initial 390×844");
    await mobile.page.screenshot({ path: path.join(folder, ".checks", "mobile.png"), fullPage: true });
    await mobile.page.locator('[data-care="feed"]').last().tap();
    assert.equal(Math.round((await getSave(mobile.page)).hunger), 96);
    await noOverflow(mobile.page, "Mobile home after touch care");
    await mobile.page.getByRole("link", { name: "Wardrobe", exact: true }).tap();
    await mobile.page.locator('[data-buy="scarf"]').tap();
    assert.equal((await getSave(mobile.page)).coins, 10);
    await noOverflow(mobile.page, "Mobile wardrobe after touch purchase");
    await mobile.page.getByRole("link", { name: "Arcade", exact: true }).tap();
    await mobile.page.locator("#start").tap();
    await mobile.page.locator("#right").dispatchEvent("pointerdown", { pointerId: 9, pointerType: "touch" });
    await mobile.page.waitForTimeout(300);
    await mobile.page.locator("#right").dispatchEvent("pointerup", { pointerId: 9, pointerType: "touch" });
    await mobile.page.locator("#pause").tap();
    await noOverflow(mobile.page, "Mobile arcade during paused touch game");
    await mobile.page.screenshot({ path: path.join(folder, ".checks", "mobile-arcade.png"), fullPage: true });
    check("Mobile real touch feed, outfit purchase, game start, direction hold and pause");
    await mobile.context.close();
    const recovery = await newPage({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
    await recovery.page.addInitScript((key) => localStorage.setItem(key, "{bad json"), C.key);
    await recovery.page.goto(server.url + "#/wardrobe");
    await recovery.page.getByRole("heading", { name: "A new look for Bramble." }).waitFor();
    assert.equal((await getSave(recovery.page)).coins, 30);
    assert.equal(await recovery.page.locator(".pet-body").first().evaluate((el) => getComputedStyle(el).animationName), "none");
    await noOverflow(recovery.page, "1440×900 reduced-motion direct wardrobe deep link with corrupt save recovery");
    await recovery.context.close();
    const away = await newPage({ width: 1200, height: 900 });
    await away.page.addInitScript(({ key, data }) =>
    {
        if (!sessionStorage.getItem("seeded"))
        {
            data.lastTickAt = Date.now() - 600000;
            data.lastSavedAt = data.lastTickAt;
            data.energy = 9;
            localStorage.setItem(key, JSON.stringify(data));
            sessionStorage.setItem("seeded", "yes");
        }
    }, { key: C.key, data: initial() });
    await away.page.goto(server.url);
    assert.equal(Math.round((await getSave(away.page)).hunger), 69);
    assert.match(await away.page.locator("#toast").textContent(), /While you were away/);
    await away.page.reload();
    assert.equal(Math.round((await getSave(away.page)).hunger), 69);
    assert.equal(await away.page.locator("#toast").textContent(), "");
    const beforeLow = await getSave(away.page);
    await away.page.keyboard.press("p");
    assert.match(await away.page.locator("#toast").textContent(), /quick rest/);
    assert.equal(Math.round((await getSave(away.page)).mood), Math.round(beforeLow.mood));
    check("Actual offline reload applies ten-minute decay once; one away summary; low-energy Play blocked without rewards or meter effects");
    await away.context.close();
    const blocked = await newPage({ width: 390, height: 844 });
    await blocked.page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }));
    await blocked.page.goto(server.url);
    await blocked.page.locator('[data-care="feed"]').last().click();
    assert.equal(await blocked.page.locator("#hunger-value").textContent(), "96");
    assert.match(await blocked.page.locator("#save-state").textContent(), /unavailable/);
    await blocked.context.close();
    check("Storage blocked remains playable with visible notice; corrupt data recovers; reduced-motion and direct hash link work");
    assert.deepEqual(errors, []);
    check("No console/page/request/HTTP errors across desktop, mobile, recovery and unavailable-storage sessions");
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
    await W.saveJson(path.join(folder, ".checks", "qa.json"), { passed: errors.length === 0, modelId: "gpt-6.1-sol", publicModel: "GPT-6", results, errors, viewports: ["1200x900 DPR1", "390x844 DPR1 touch", "1440x900 DPR1 reduced motion"], visualReviewed: false, resourcesClosed: true, screenshots: ["desktop.png", "mobile.png", "wardrobe.png", "arcade.png", "mobile-arcade.png"], timestamp: new Date().toISOString() });
    console.log(JSON.stringify({ passed: errors.length === 0, checks: results.length, errors }, null, 2));
}
