import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { simulate, toReal, crossoverYear, formulaBalance } from "../finance.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "..", "..", "..", "..");
const result =
{
    prompt: "559-compound-interest-interactive-explainer",
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
let browser;
let service;

function check(name, condition)
{
    assert.ok(condition, name);
    result.assertions.push(name);
}

function near(actual, expected, tolerance = .00001)
{
    assert.ok(Math.abs(actual - expected) < tolerance, `${actual} does not match ${expected}`);
}

function mathematicalTests()
{
    const base = { monthly: 200, ratePct: 6, years: 40, perYear: 12 };
    const rows = simulate(base);
    near(rows.at(-1).balance, 200 * ((1.005 ** 480 - 1) / .005));
    near(rows[1].interest, 200 * ((1.005 ** 12 - 1) / .005) - 2400);
    check("Default 40-year nominal balance rounds to $398,298", Math.round(rows.at(-1).balance) === 398298);
    check("First cumulative interest/deposit crossover is year 22", crossoverYear(rows) === 22);
    check("One row per year plus a zero baseline", rows.length === 41 && rows[0].balance === 0);
    for (const perYear of [1, 4, 12, 365])
    {
        for (const monthly of [0, 25, 200, 2000])
        {
            for (const ratePct of [0, .1, 6, 12])
            {
                for (const years of [0, 1, 2, 49, 50])
                {
                    const input = { monthly, ratePct, years, perYear };
                    const actual = simulate(input).at(-1);
                    near(actual.balance, formulaBalance(input), .001);
                    near(actual.deposits + actual.interest, actual.balance, .001);
                    checkFinite(actual);
                }
            }
        }
    }
    result.assertions.push("320 deposit/rate/year/frequency combinations agree with closed-form annuity and remain finite");
    check("Zero rate returns only deposits and no crossover", simulate({ ...base, ratePct: 0 }).at(-1).interest === 0 && crossoverYear(simulate({ ...base, ratePct: 0 })) === null);
    check("Zero deposit produces a zero balance", simulate({ ...base, monthly: 0 }).every((row) => row.balance === 0));
    check("Zero years returns zero", simulate({ ...base, years: 0 }).at(-1).balance === 0);
    check("Negative input rejected", throws(() => simulate({ ...base, monthly: -1 })));
    check("Unsupported frequency rejected", throws(() => simulate({ ...base, perYear: 2 })));
    check("Fractional year rejected", throws(() => simulate({ ...base, years: 1.5 })));
    near(toReal(100, 0, 40), 100);
    near(toReal(100, 2.5, 40), 100 / 1.025 ** 40);
    check("Inflation discounts balance and does not change zero", toReal(100, 2.5, 40) < 100 && toReal(0, 6, 50) === 0);
    const frequencies = [1, 4, 12, 365].map((perYear) => simulate({ ...base, perYear }).at(-1).balance);
    check("Higher compounding frequencies increase a positive-rate balance", frequencies.every((v, i) => i === 0 || v > frequencies[i - 1]));
    const early = rows.at(-1).balance;
    const late = simulate({ ...base, years: 30 }).at(-1).balance;
    check("Same-calendar inflation preserves the relative savers' gap", Math.abs((toReal(early, 2.5, 40) - toReal(late, 2.5, 40)) - toReal(early - late, 2.5, 40)) < .00001);
}

function checkFinite(row)
{
    assert.ok(Object.values(row).every(Number.isFinite));
}

function throws(fn)
{
    try
    {
        fn();
        return false;
    }
    catch
    {
        return true;
    }
}

async function setSlider(page, id, value)
{
    await page.locator(`#${id}`).evaluate((input, next) =>
    {
        input.value = next;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }, String(value));
}

async function noOverflow(page, label)
{
    check(label, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth));
}

async function readBalance(page)
{
    return Number((await page.locator("#final-balance").innerText()).replace(/[^\d.-]/g, ""));
}

async function browserTests(viewport, name, reduced)
{
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: name === "mobile", hasTouch: name === "mobile", reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await context.newPage();
    const prefix = `${name}: `;
    page.on("pageerror", (error) => result.errors.push(`${prefix}${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            result.errors.push(`${prefix}${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => result.errors.push(`${prefix}${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            result.errors.push(`${prefix}HTTP ${response.status()} ${response.url()}`);
        }
    });
    try
    {
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(750);
        check(`${prefix}HTTP 200 on final public subpath`, response.status() === 200 && page.url().includes("/pages/compound-interest-interactive-explainer/GPT-6/index.html"));
        check(`${prefix}meaningful visible English homepage`, await page.locator("h1").isVisible() && (await page.locator("body").innerText()).length > 5000 && await page.locator("html").getAttribute("lang") === "en");
        check(`${prefix}calculated default, not a canned mock`, await readBalance(page) === 398298);
        check(`${prefix}all self-hosted fonts loaded`, await page.evaluate(() => document.fonts.check('400 16px "Fraunces"') && document.fonts.check('400 16px "Public Sans"') && document.fonts.check('400 16px "IBM Plex Mono"')));
        await noOverflow(page, `${prefix}no initial horizontal overflow`);
        if (name !== "wide")
        {
            const screenshot = path.join(folder, ".checks", `${name}.png`);
            await page.screenshot({ path: screenshot });
            result.screenshots[name] = screenshot;
        }

        await page.locator("#monthly").focus();
        await page.keyboard.press("Home");
        await page.waitForTimeout(650);
        check(`${prefix}keyboard zero contribution updates result`, await readBalance(page) === 0 && (await page.locator("#crossover-note").innerText()).includes("does not overtake"));
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(650);
        check(`${prefix}keyboard step produces a real calculated amount`, await readBalance(page) === Math.round(formulaBalance({ monthly: 25, ratePct: 6, years: 40, perYear: 12 })));
        await setSlider(page, "monthly", 200);
        await setSlider(page, "ratePct", 0);
        await page.waitForTimeout(650);
        check(`${prefix}zero interest displays $96,000 and zero-rate formula branch`, await readBalance(page) === 96000 && (await page.locator("#balance-formula").innerText()).includes("When i = 0"));
        await setSlider(page, "years", 1);
        await page.waitForTimeout(650);
        check(`${prefix}minimum horizon handles zero-year shorter scenario`, await readBalance(page) === 2400 && (await page.locator("#scenario-a-value").innerText()) === "$0");
        await setSlider(page, "ratePct", .1);
        check(`${prefix}small annual rate substituted accurately as 0.001`, (await page.locator("#rate-formula").innerText()).includes("0.001 /"));
        await setSlider(page, "monthly", 2000);
        await setSlider(page, "ratePct", 12);
        await setSlider(page, "years", 50);
        await page.waitForTimeout(650);
        check(`${prefix}upper-bound result matches independently evaluated annuity`, await readBalance(page) === Math.round(formulaBalance({ monthly: 2000, ratePct: 12, years: 50, perYear: 12 })));
        await noOverflow(page, `${prefix}no overflow at maximum result`);
        await setSlider(page, "monthly", 200);
        await setSlider(page, "ratePct", 6);
        await setSlider(page, "years", 40);
        await page.locator('header [data-mode="true"]').click();
        await page.waitForTimeout(650);
        check(`${prefix}today's-money toggle discounts actual result`, await readBalance(page) === Math.round(toReal(formulaBalance({ monthly: 200, ratePct: 6, years: 40 }), 2.5, 40)));
        check(`${prefix}global inflation controls remain synchronized`, await page.locator("#real-switch").isChecked() && await page.locator('#inflation [data-mode="true"]').getAttribute("aria-pressed") === "true");
        await setSlider(page, "inflation-secondary", 0);
        await page.waitForTimeout(650);
        check(`${prefix}zero inflation equals nominal and updates both sliders`, await readBalance(page) === 398298 && await page.locator("#inflationPct").inputValue() === "0");
        await setSlider(page, "inflation-secondary", 6);
        await page.waitForTimeout(650);
        check(`${prefix}maximum inflation is computed`, await readBalance(page) === Math.round(toReal(formulaBalance({ monthly: 200, ratePct: 6, years: 40 }), 6, 40)));
        await page.locator('header [data-mode="false"]').click();
        await page.locator('[data-frequency="365"]').click();
        await page.waitForTimeout(650);
        check(`${prefix}daily frequency updates all results and selected table row`, await readBalance(page) === Math.round(formulaBalance({ monthly: 200, ratePct: 6, years: 40, perYear: 365 })) && (await page.locator("#frequency-rows tr.selected th").innerText()) === "Daily");
        await page.locator("#year-details summary").click();
        check(`${prefix}year-by-year disclosure has 40 computed rows`, await page.locator("#year-rows tr").count() === 40 && await page.locator(".table-scroll").isVisible());
        await page.locator('[data-frequency="12"]').click();
        await page.locator("#area-chart").focus();
        await page.keyboard.press("Home");
        check(`${prefix}chart keyboard origin exposes zero values`, (await page.locator("#chart-tooltip").innerText()).includes("Year 0"));
        await page.keyboard.press("ArrowRight");
        check(`${prefix}chart keyboard exploration exposes computed year one`, (await page.locator("#chart-tooltip").innerText()).includes("$2,400"));
        await page.keyboard.press("End");
        check(`${prefix}chart keyboard End reaches selected horizon`, (await page.locator("#chart-tooltip").innerText()).includes("Year 40"));
        await page.locator("#area-chart").hover({ position: { x: 120, y: 120 } });
        check(`${prefix}pointer chart inspection is functional`, await page.locator("#chart-tooltip").isVisible());
        for (const step of [1, 2, 3])
        {
            await page.locator(`[data-step="${step}"]`).evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
            await page.waitForTimeout(150);
            check(`${prefix}scroll chapter ${step + 1} selects the matching chart state`, (await page.locator("#step-indicator").innerText()).startsWith(String(step + 1)));
        }
        await page.locator("#age-scrubber").focus();
        await page.keyboard.press("Home");
        check(`${prefix}age scrubber begins with no balances`, (await page.locator("#age-readout").innerText()) === "Age 25: Maya $0 · Theo $0");
        await page.keyboard.press("ArrowRight");
        check(`${prefix}early saver begins before late saver`, (await page.locator("#age-readout").innerText()).includes("Theo $0") && !(await page.locator("#age-readout").innerText()).includes("Maya $0"));
        await page.locator("#play").click();
        if (reduced)
        {
            check(`${prefix}reduced-motion playback immediately shows completed comparison`, await page.locator("#age-scrubber").inputValue() === "65");
        }
        else
        {
            await page.waitForTimeout(700);
            check(`${prefix}playback advances real balances through decades`, Number(await page.locator("#age-scrubber").inputValue()) > 25 && Number(await page.locator("#age-scrubber").inputValue()) < 65);
            await page.locator("#play").click();
            const pausedAge = await page.locator("#age-scrubber").inputValue();
            await page.waitForTimeout(150);
            check(`${prefix}playback pauses`, await page.locator("#age-scrubber").inputValue() === pausedAge);
        }
        await page.locator("#age-scrubber").focus();
        await page.keyboard.press("End");
        check(`${prefix}comparison ends at correct live hypothetical balances`, (await page.locator("#age-readout").innerText()).includes("Maya $398,298") && (await page.locator("#age-readout").innerText()).includes("Theo $200,903"));
        await page.locator(".faq").nth(0).locator("summary").click();
        await page.locator(".faq").nth(1).locator("summary").click();
        await page.waitForTimeout(100);
        check(`${prefix}FAQ only retains one open item`, await page.locator(".faq[open]").count() === 1);
        if (name === "mobile")
        {
            await page.locator("#menu-button").click();
            check(`${prefix}chapter menu opens with accessible state`, await page.locator("#mobile-menu").isVisible() && await page.locator("#menu-button").getAttribute("aria-expanded") === "true");
            await page.keyboard.press("Escape");
            check(`${prefix}Escape closes mobile menu and restores focus`, await page.locator("#mobile-menu").isHidden() && await page.locator("#menu-button").evaluate((el) => document.activeElement === el));
            await page.locator("#menu-button").click();
            await page.locator('#mobile-menu a[href="#inflation"]').click();
            check(`${prefix}mobile anchor closes menu`, await page.locator("#mobile-menu").isHidden());
            await page.locator("#monthly").tap({ position: { x: 200, y: 12 } });
            check(`${prefix}touch slider changes contribution`, Number(await page.locator("#monthly").inputValue()) > 0);
        }
        await noOverflow(page, `${prefix}no horizontal overflow after interactions and expanded table`);
        check(`${prefix}four licensed local chapter illustrations decode`, await page.evaluate(async () =>
        {
            const images = [...document.querySelectorAll("figure img")];
            await Promise.all(images.map((img) => img.decode()));
            return images.length === 4 && images.every((img) => img.naturalWidth > 100);
        }));
        result.viewports.push({ name, ...viewport, deviceScaleFactor: 1, reducedMotion: reduced, passed: true });
    }
    finally
    {
        await context.close();
    }
}

try
{
    mathematicalTests();
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "compound-interest-interactive-explainer", "GPT-6");
    result.staticDigest = digest;
    result.assertions.push("StaticHomepage validated independent export and final public subpath");
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    check("Preview service is responsive", (await fetch(service.url)).status === 200);
    browser = await chromium.launch({ headless: true });
    await browserTests({ width: 1200, height: 900 }, "desktop", false);
    await browserTests({ width: 390, height: 844 }, "mobile", true);
    await browserTests({ width: 1440, height: 900 }, "wide", true);
    check("No console, page, request or HTTP errors across all viewports and interactions", result.errors.length === 0);
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    result.resourcesClosed = true;
    result.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
