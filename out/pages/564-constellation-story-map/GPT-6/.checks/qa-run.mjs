import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const model = path.resolve(import.meta.dirname, "..");
const workspace = path.resolve(model, "..", "..", "..", "..");
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { patterns, backgroundStars, makerStars, dayFromDate, dateFromDay, restoreCreations } = await import(pathToFileURL(path.join(model, "sky.js")));
const results =
{
    passed: false,
    startedAt: new Date().toISOString(),
    finalSubpath: "/pages/constellation-story-map/GPT-6/index.html",
    browser: "Playwright Chromium",
    viewports: [],
    assertions: [],
    errors: [],
    resourcesClosed: false,
    visualReviewed: false
};
let service;
let browser;
const step = async (name, action) =>
{
    await action();
    results.assertions.push({ name, passed: true });
    console.log(`PASS ${name}`);
};
const overflow = async (page) =>
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "No horizontal page overflow");
};
const act = (page, name) => page.locator(`[data-action="${name}"]`);
const waitTrace = (page) => page.waitForTimeout(740);
const assertCount = async (page, count) => assert.equal(await page.locator("#point-count").textContent(), `${count}/8 stars`);
async function add(page, id)
{
    await page.locator("#maker-star").selectOption(String(id));
    await act(page, "add").click();
}
async function pointOnCanvas(page, x, y)
{
    return page.locator("#sky").evaluate((canvas, point) =>
    {
        const rect = canvas.getBoundingClientRect();
        const scale = Math.max(.05, Math.min((rect.width - 120) / 1600, (rect.height - 120) / 1000));
        const day = Number(canvas.dataset.day);
        const zoom = Number(canvas.dataset.zoom);
        const [px, py] = canvas.dataset.pan.split(",").map(Number);
        const angle = Math.sin(day / 365 * Math.PI * 2) * Math.PI / 10;
        const dx = point.x - 800;
        const dy = point.y - 500;
        return {
            x: rect.x + rect.width / 2 + px + (dx * Math.cos(angle) - dy * Math.sin(angle)) * scale * zoom,
            y: rect.y + rect.height / 2 + py + (dx * Math.sin(angle) + dy * Math.cos(angle) + Math.cos(day / 365 * Math.PI * 2) * 55) * scale * zoom
        };
    }, { x, y });
}
try
{
    await step("Exact six geometry records; deterministic star counts, maker spacing, date parsing and storage validation", async () =>
    {
        assert.equal(patterns.length, 6);
        assert.equal(backgroundStars.length, 420);
        assert.equal(makerStars.length, 28);
        assert.deepEqual(patterns.map((p) => p.center), [[260,250],[810,220],[1320,270],[390,735],[930,700],[1370,710]]);
        for (const [index, star] of makerStars.entries())
        {
            assert.equal(star.id, index + 1);
            assert(star.x >= 260 && star.x <= 1340 && star.y >= 180 && star.y <= 820);
            for (const other of makerStars.slice(0, index))
            {
                assert(Math.hypot(star.x - other.x, star.y - other.y) >= 72);
            }
        }
        assert.equal(dayFromDate("2026-02-29"), null);
        assert.equal(dayFromDate("2025-09-21"), null);
        for (let day = 0; day < 365; day++)
        {
            assert.equal(dayFromDate(dateFromDay(day)), day);
        }
        assert.deepEqual(restoreCreations("{malformed"), []);
        assert.deepEqual(restoreCreations(JSON.stringify([{ name: "  Tide  ", ids: [1,2,3,3,999] }])), [{ name: "Tide", ids: [1,2,3] }]);
        assert.deepEqual(restoreCreations(JSON.stringify([{ name: " ", ids: [1,2,3] }, { name: "Invalid", ids: [1,999] }])), []);
    });
    service = await startPreviewServer(path.join(model, "out"), { workspace });
    const response = await fetch(service.url);
    assert.equal(response.status, 200);
    assert(service.url.endsWith(results.finalSubpath));
    assert.equal((await fetch(new URL("/package.json", service.url))).status, 404);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const watch = (p) =>
    {
        p.on("console", (message) =>
        {
            if (message.type() === "error")
            {
                results.errors.push(`console: ${message.text()}`);
            }
        });
        p.on("pageerror", (error) => results.errors.push(`page: ${error.message}`));
        p.on("requestfailed", (request) => results.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        p.on("response", (response) =>
        {
            if (response.status() >= 400)
            {
                results.errors.push(`HTTP ${response.status()}: ${response.url()}`);
            }
        });
        p.on("request", (request) =>
        {
            if (!request.url().startsWith(new URL(service.url).origin))
            {
                results.errors.push(`External runtime request: ${request.url()}`);
            }
        });
    };
    watch(page);
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    results.viewports.push({ width: 1200, height: 900, dpr: 1 });
    await step("Final public subpath HTTP 200; initial gold Lyra, full story, nonblank Canvas and nine self-hosted fonts", async () =>
    {
        assert(await page.locator("#panel h2").isVisible());
        assert.equal(await page.locator("#panel h2").textContent(), "Lyra");
        assert((await page.locator(".story-prose").textContent()).includes("Orpheus"));
        assert.equal(await page.locator('[data-story="0"]').getAttribute("aria-pressed"), "true");
        assert.equal(await page.evaluate(() => document.fonts.check("400 16px Newsreader") && document.fonts.check("400 16px Manrope") && document.fonts.check('400 16px "IBM Plex Mono"')), true);
        assert(await page.locator("#sky").evaluate((canvas) =>
        {
            const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
            let bright = 0;
            for (let i = 0; i < data.length; i += 4)
            {
                if (data[i] > 100 && data[i + 1] > 100)
                {
                    bright++;
                }
            }
            return bright > 500;
        }));
        await overflow(page);
    });
    await step("All six real stories select without scrolling; completed traces and matching SVG geometry", async () =>
    {
        const scroll = await page.evaluate(() => scrollY);
        for (const pattern of patterns)
        {
            await page.locator(`[data-story="${pattern.id}"]`).evaluate((button) => button.click());
            assert.equal(await page.locator("#panel h2").textContent(), pattern.name);
            assert.equal(await page.locator(".story-diagram line").count(), pattern.edges.length);
            await waitTrace(page);
            assert.equal(await page.locator("#status").textContent(), `${pattern.name} traced.`);
            assert.equal(await page.evaluate(() => scrollY), scroll);
        }
        await act(page, "trace").click();
        await waitTrace(page);
        assert.equal(await page.locator("#panel h2").textContent(), "Corona Borealis");
        await overflow(page);
    });
    await step("Native date and range synchronize, fixed bounds, reset preserves selected story", async () =>
    {
        await page.locator("#atlas-date").fill("2026-01-01");
        await page.locator("#atlas-date").dispatchEvent("change");
        assert.equal(await page.locator("#atlas-day").inputValue(), "0");
        assert.equal(await page.locator("#date-readout").textContent(), "Jan 1, 2026");
        await page.locator("#atlas-day").fill("364");
        await page.locator("#atlas-day").dispatchEvent("input");
        assert.equal(await page.locator("#atlas-date").inputValue(), "2026-12-31");
        await page.waitForTimeout(200);
        assert.equal(await page.locator("#sky").getAttribute("data-day"), "364");
        assert((await page.locator("#chapter").textContent()).includes("Chapter IV"));
        await act(page, "reset-date").click();
        assert.equal(await page.locator("#atlas-date").inputValue(), "2026-09-21");
        assert.equal(await page.locator("#panel h2").textContent(), "Corona Borealis");
    });
    await step("Keyboard 40px pan, bounded zoom, reset and pointer drag threshold/momentum stop", async () =>
    {
        await page.waitForTimeout(200);
        await page.locator("#sky").focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(70);
        assert.equal(await page.locator("#sky").getAttribute("data-pan"), "40,0");
        await page.keyboard.press("+");
        await page.waitForTimeout(180);
        assert.equal(await page.locator("#zoom-readout").textContent(), "1.15×");
        for (let i = 0; i < 10; i++)
        {
            await act(page, "zoom-in").click();
        }
        await page.waitForTimeout(180);
        assert.equal(Number(await page.locator("#sky").getAttribute("data-zoom")), 2.2);
        for (let i = 0; i < 15; i++)
        {
            await act(page, "zoom-out").click();
        }
        await page.waitForTimeout(180);
        assert.equal(Number(await page.locator("#sky").getAttribute("data-zoom")), .75);
        await act(page, "reset-view").click();
        await page.waitForTimeout(180);
        assert.equal(await page.locator("#sky").getAttribute("data-pan"), "0,0");
        const p = await pointOnCanvas(page, 810, 220);
        await page.mouse.move(p.x, p.y);
        await page.mouse.down();
        await page.mouse.move(p.x + 4, p.y);
        await page.mouse.up();
        assert.equal(await page.locator("#panel h2").textContent(), "Cygnus");
        await waitTrace(page);
        const rect = await page.locator("#sky").boundingBox();
        await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
        await page.mouse.down();
        await page.mouse.move(rect.x + rect.width / 2 + 36, rect.y + rect.height / 2 + 20, { steps: 4 });
        await page.mouse.up();
        await page.waitForTimeout(620);
        const pan = await page.locator("#sky").getAttribute("data-pan");
        assert.notEqual(pan, "0,0");
        await page.waitForTimeout(180);
        assert.equal(await page.locator("#sky").getAttribute("data-pan"), pan);
        assert.equal(await page.locator("#panel h2").textContent(), "Cygnus");
        await act(page, "reset-view").click();
        await page.waitForTimeout(180);
    });
    await step("Create: actual pointer star selection, distinct 8-star limit, Undo/Clear and accessible selector", async () =>
    {
        await act(page, "create").first().click();
        assert.equal(await act(page, "save").isDisabled(), true);
        const first = makerStars[0];
        const p = await pointOnCanvas(page, first.x, first.y);
        await page.mouse.click(p.x, p.y);
        await assertCount(page, 1);
        await page.mouse.click(p.x, p.y);
        await assertCount(page, 1);
        assert.equal(await page.locator("#status").textContent(), "That star is already connected. Choose another star.");
        for (let id = 2; id <= 8; id++)
        {
            await add(page, id);
        }
        await assertCount(page, 8);
        assert(await act(page, "add").isDisabled());
        await act(page, "undo").click();
        await assertCount(page, 7);
        assert.equal(await page.locator('#maker-star option[value="1"]').isDisabled(), true);
        await act(page, "clear").click();
        await assertCount(page, 0);
        assert.equal(await page.locator('#maker-star option[value="1"]').isDisabled(), false);
        for (let id = 1; id <= 3; id++)
        {
            await add(page, id);
        }
        await page.locator("#maker-name").fill("   ");
        assert(await act(page, "save").isDisabled());
        await page.locator("#maker-name").fill("  Quiet Harbor  ");
        assert.equal(await act(page, "save").isDisabled(), false);
        assert.equal(await page.locator("#maker-name").getAttribute("maxlength"), "24");
        const before = await page.locator("#sky").getAttribute("data-pan");
        await page.locator("#maker-name").press("ArrowLeft");
        assert.equal(await page.locator("#sky").getAttribute("data-pan"), before);
        await overflow(page);
    });
    await step("Local save survives date, resize and reload; load, six-save cap, inline-confirm delete", async () =>
    {
        await act(page, "save").click();
        assert.equal(await page.locator("#save-feedback").textContent(), "Saved to this browser");
        assert.equal(await page.locator(".saved-name").textContent(), "Quiet Harbor");
        const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("asterwyn-creations-v1")));
        assert.deepEqual(stored, [{ name: "Quiet Harbor", ids: [1,2,3] }]);
        await page.locator("#atlas-date").fill("2026-07-14");
        await page.locator("#atlas-date").dispatchEvent("change");
        await assertCount(page, 3);
        await page.setViewportSize({ width: 1440, height: 900 });
        results.viewports.push({ width: 1440, height: 900, dpr: 1 });
        assert.equal(await page.locator("#maker-name").inputValue(), "  Quiet Harbor  ");
        await assertCount(page, 3);
        await overflow(page);
        await page.reload({ waitUntil: "networkidle" });
        await act(page, "create").first().click();
        assert.equal(await page.locator(".saved-name").textContent(), "Quiet Harbor");
        await page.locator('[data-load="0"]').click();
        await assertCount(page, 3);
        assert.equal(await page.locator("#maker-name").inputValue(), "Quiet Harbor");
        for (let i = 1; i < 6; i++)
        {
            await page.locator("#maker-name").fill(`Harbor ${i}`);
            await act(page, "save").click();
        }
        assert.equal(await page.locator(".saved-row").count(), 6);
        assert(await act(page, "save").isDisabled());
        await page.locator('[data-delete="0"]').click();
        assert.equal(await page.locator(".saved-row").count(), 6);
        assert((await page.locator('[data-delete="0"]').textContent()).includes("Confirm delete"));
        await act(page, "cancel-delete").click();
        assert.equal(await page.locator(".saved-row").count(), 6);
        await page.locator('[data-delete="0"]').click();
        await page.locator('[data-delete="0"]').click();
        assert.equal(await page.locator(".saved-row").count(), 5);
        assert.equal(await act(page, "save").isDisabled(), false);
        await page.locator("#sky").focus();
        await page.keyboard.press("Escape");
        assert.equal(await act(page, "explore").getAttribute("aria-pressed"), "true");
    });
    await step("Guide: native modal focus trap, Escape dismissal and focus return", async () =>
    {
        await act(page, "help").click();
        assert(await page.locator("#guide").isVisible());
        await page.keyboard.press("Tab");
        assert(await page.evaluate(() => document.activeElement.closest("#guide") !== null));
        await page.keyboard.press("Shift+Tab");
        assert(await page.evaluate(() => document.activeElement.closest("#guide") !== null));
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#guide").isVisible(), false);
        assert.equal(await act(page, "help").evaluate((node) => node === document.activeElement), true);
    });
    await step("Malformed storage recovers; storage denial never claims a persistent save", async () =>
    {
        await page.evaluate(() => localStorage.setItem("asterwyn-creations-v1", "{bad"));
        await page.reload({ waitUntil: "networkidle" });
        await act(page, "create").first().click();
        assert.equal(await page.locator(".saved-row").count(), 0);
        for (let id = 1; id <= 3; id++)
        {
            await add(page, id);
        }
        await page.locator("#maker-name").fill("Unsaved pattern");
        await page.evaluate(() =>
        {
            window.originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = () =>
            {
                throw new DOMException("Blocked", "SecurityError");
            };
        });
        await act(page, "save").click();
        assert((await page.locator("#save-feedback").textContent()).includes("not saved"));
        assert.equal(await page.locator(".saved-row").count(), 0);
        await page.evaluate(() =>
        {
            Storage.prototype.setItem = window.originalSetItem;
            localStorage.removeItem("asterwyn-creations-v1");
        });
    });
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(model, ".checks", "desktop.png") });
    await overflow(page);
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    watch(mobile);
    await mobile.goto(service.url, { waitUntil: "networkidle" });
    await mobile.evaluate(() => document.fonts.ready);
    await mobile.evaluate(() => scrollTo(0, 0));
    await mobile.waitForTimeout(100);
    results.viewports.push({ width: 390, height: 844, dpr: 1, touch: true });
    await mobile.screenshot({ path: path.join(model, ".checks", "mobile.png"), fullPage: true });
    await step("Mobile 390×844: normal flow, touch selection, creation/save, scroll and no overflow before/after", async () =>
    {
        await overflow(mobile);
        assert(await mobile.locator("#constellation").isVisible());
        assert.equal(Math.round((await mobile.locator(".stage").boundingBox()).height), 360);
        assert.equal(await mobile.locator(".desktop-index").isVisible(), false);
        await mobile.locator("#constellation").selectOption("3");
        assert.equal(await mobile.locator("#panel h2").textContent(), "Orion");
        await waitTrace(mobile);
        await mobile.locator('.modes [data-action="create"]').tap();
        await mobile.locator("#maker-star").scrollIntoViewIfNeeded();
        for (let id = 10; id <= 12; id++)
        {
            await add(mobile, id);
        }
        await mobile.locator("#maker-name").fill("Pocket Lantern");
        await act(mobile, "save").tap();
        assert.equal(await mobile.locator(".saved-name").textContent(), "Pocket Lantern");
        await act(mobile, "help").scrollIntoViewIfNeeded();
        await act(mobile, "help").tap();
        assert(await mobile.locator("#guide").isVisible());
        await act(mobile, "close-guide").tap();
        await overflow(mobile);
        const badTargets = await mobile.locator("button:visible, input:visible, select:visible, a:visible").evaluateAll((nodes) => nodes.filter((node) =>
        {
            const rect = node.getBoundingClientRect();
            return rect.width < 43.5 || rect.height < 43.5;
        }).map((node) => node.outerHTML.slice(0, 100)));
        assert.deepEqual(badTargets, []);
        assert.equal(await mobile.evaluate(() => getComputedStyle(document.body).touchAction), "auto");
        assert.equal(await mobile.locator("#sky").evaluate((node) => getComputedStyle(node).touchAction), "none");
    });
    await step("Live reduced-motion preference: immediate trace/date/zoom with stable idle canvas", async () =>
    {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.locator('[data-story="4"]').click();
        assert.equal(await page.locator("#status").textContent(), "Ursa Major traced.");
        await page.locator("#atlas-date").fill("2026-05-01");
        await page.locator("#atlas-date").dispatchEvent("change");
        await act(page, "zoom-in").click();
        await page.waitForTimeout(100);
        assert.equal(Number(await page.locator("#sky").getAttribute("data-zoom")), 1.15);
        assert.equal(Number(await page.locator("#sky").getAttribute("data-day")), dayFromDate("2026-05-01"));
        const image = await page.locator("#sky").evaluate((node) => node.toDataURL());
        await page.waitForTimeout(200);
        assert.equal(await page.locator("#sky").evaluate((node) => node.toDataURL()), image);
        await overflow(page);
    });
    await step("Independent static validation, public size under 20 MB, and zero browser/network errors", async () =>
    {
        results.staticDigest = await StaticHomepage.validateStaticOutput(path.join(model, "out"), "constellation-story-map", "GPT-6");
        let bytes = 0;
        const walk = async (folder) =>
        {
            for (const entry of await fs.readdir(folder, { withFileTypes: true }))
            {
                const file = path.join(folder, entry.name);
                if (entry.isDirectory())
                {
                    await walk(file);
                }
                else
                {
                    bytes += (await fs.stat(file)).size;
                }
            }
        };
        await walk(path.join(model, "out"));
        results.staticBytes = bytes;
        assert(bytes < 20 * 1024 * 1024);
        assert.deepEqual(results.errors, []);
    });
    results.passed = true;
}
catch (error)
{
    results.errors.push(error.stack);
    console.error(error);
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (service)
    {
        await service.close();
    }
    results.resourcesClosed = true;
    results.completedAt = new Date().toISOString();
    results.screenshots =
    {
        desktop: path.join(model, ".checks", "desktop.png"),
        mobile: path.join(model, ".checks", "mobile.png")
    };
    await WorkspaceFiles.saveJson(path.join(model, ".checks", "qa.json"), results);
}
