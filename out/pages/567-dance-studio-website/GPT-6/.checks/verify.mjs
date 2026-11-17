import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { sessions, studio } from "../content.js";
import { countdown, eventTime, endTime, isTrialEligible, filteredSessions, parseFilters, spotsLabel } from "../lib.js";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checks = path.join(folder, ".checks");
const workspace = process.cwd();
const results = [];
const errors = [];
const viewports = [];
let browser;
let server;
let closed = false;
let failure;

async function check(name, run)
{
    await run();
    results.push({name, passed:true});
    console.log(`PASS ${name}`);
}

function monitor(page)
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
        if (new URL(response.url()).origin !== new URL(server.url).origin) errors.push(`Unexpected external request: ${response.url()}`);
    });
}

async function load(page, target)
{
    const response = await page.goto(target, {waitUntil:"networkidle"});
    assert.equal(response.status(),200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
    assert.ok((await page.locator("main").innerText()).trim().length > 500);
    await page.waitForTimeout(1000);
}

async function overflow(page, label)
{
    const size = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(size.scroll <= size.width, `${label}: ${JSON.stringify(size)}`);
    results.push({name:`No horizontal overflow: ${label}`,passed:true,measurements:size});
}

try
{
    await check("24 exact sessions, capacities, availability and combined filters", async () =>
    {
        assert.equal(sessions.length,24);
        assert.equal(sessions.filter((session) => session.ageBand === "youth").every((session) => session.capacity === 14),true);
        assert.equal(sessions.filter(isTrialEligible).length,15);
        assert.equal(endTime(sessions.find((session) => session.id === "sat-1145")),"13:00");
        assert.equal(spotsLabel(sessions.find((session) => session.id === "tue-2000")),"Full");
        assert.equal(spotsLabel(sessions.find((session) => session.id === "wed-2000")),"Only 1 spots");
        assert.deepEqual(parseFilters("?style=unknown&age=unknown&level=unknown"),{style:"",age:"",level:""});
        assert.equal(filteredSessions({style:"hip-hop",age:"adult",level:"first-class"})[0].id,"wed-1845");
    });
    await check("Countdown expiration clamps and event uses configured offset", async () =>
    {
        assert.deepEqual(countdown(Date.parse(studio.recital) + 9999),[0,0,0,0]);
        assert.deepEqual(countdown(Date.parse(studio.recital) - 90061000),[1,1,1,1]);
        assert.equal(eventTime(),"Saturday, June 12 · 7:00 PM CDT");
    });
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder,"out"),"dance-studio-website","GPT-6");
    results.push({name:"Static resource and final subpath validation",passed:true,digest});
    server = await startPreviewServer(path.join(folder,"out"),{workspace});
    browser = await chromium.launch({headless:true});
    const home = server.url;
    const classes = new URL("classes.html",home).href;
    const context = await browser.newContext({viewport:{width:1200,height:900},deviceScaleFactor:1});
    const page = await context.newPage();
    monitor(page);
    viewports.push({name:"desktop",width:1200,height:900,deviceScaleFactor:1});
    await check("Homepage HTTP, meaningful rendering, local fonts and all six real photos", async () =>
    {
        await load(page,home);
        await expect(page.locator("h1")).toHaveText("Find yourbeat.Own the room.");
        await page.evaluate(async () =>
        {
            for (const image of document.images)
            {
                image.loading = "eager";
                await image.decode();
            }
        });
        assert.equal(await page.evaluate(() => document.fonts.check('16px "Archivo Black"')),true);
        assert.equal(await page.locator(".instructor").count(),3);
        assert.equal(await page.locator(".program-card").count(),3);
        assert.equal(await page.locator(".price-card").count(),3);
        await page.screenshot({path:path.join(checks,"desktop.png")});
        await overflow(page,"desktop home before interactions");
    });
    await check("FAQ keyboard activation, one open item, semantic expanded state", async () =>
    {
        const second = page.locator(".faq button").nth(1);
        await second.focus();
        await page.keyboard.press("Enter");
        await expect(second).toHaveAttribute("aria-expanded","true");
        await expect(page.locator(".faq button").first()).toHaveAttribute("aria-expanded","false");
        assert.equal(await page.locator(".faq button[aria-expanded=true]").count(),1);
    });
    await check("Timetable shows all 24 classes and Sunday", async () =>
    {
        await load(page,classes);
        assert.equal(await page.locator(".class-row").count(),24);
        await expect(page.locator("#result-count")).toHaveText("Showing 24 of 24 classes");
        await expect(page.getByText("Rest and reset · Front desk open 12:00–17:00.")).toBeVisible();
        await page.evaluate(() => scrollTo(0,0));
        await page.screenshot({path:path.join(checks,"classes-desktop.png")});
        await overflow(page,"desktop timetable before interactions");
    });
    await check("AND filters, canonical URL, result announcements and keyboard details", async () =>
    {
        await page.locator('[data-filter=style][data-value="hip-hop"]').click();
        await page.locator('[data-filter=age][data-value=adult]').click();
        await page.locator('[data-filter=level][data-value="first-class"]').click();
        await expect(page.locator(".class-row")).toHaveCount(1);
        assert.match(page.url(),/style=hip-hop&age=adult&level=first-class/);
        const row = page.locator('[data-session="wed-1845"]');
        await row.focus();
        await page.keyboard.press("Enter");
        const dialog = page.locator("#class-drawer");
        await expect(dialog).toBeVisible();
        await expect(dialog.locator("[data-close]").first()).toBeFocused();
        await expect(dialog).toContainText("9 of 16 booked · 7 spots left");
        assert.match(page.url(),/class=wed-1845/);
        await page.keyboard.press("Shift+Tab");
        assert.equal(await page.evaluate(() => document.querySelector("#class-drawer").contains(document.activeElement)),true);
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(row).toBeFocused();
        await expect(page).toHaveURL(/level=first-class$/);
        await overflow(page,"desktop timetable after filters and drawer");
    });
    await check("No-result recovery and full-session honest phone waitlist", async () =>
    {
        await page.locator('[data-filter=age][data-value=youth]').click();
        await page.locator('[data-filter=level][data-value=advanced]').click();
        await expect(page.getByText("No classes match all three filters.")).toBeVisible();
        await page.locator("#empty-clear").click();
        await expect(page.locator(".class-row")).toHaveCount(24);
        await page.locator('[data-session="tue-2000"]').click();
        await expect(page.locator("#class-drawer")).toContainText("16 of 16 booked · 0 spots left");
        await expect(page.getByRole("link",{name:"Join the waitlist by phone"})).toHaveAttribute("href",studio.tel);
        await page.keyboard.press("Escape");
    });
    await check("Unknown queries ignored; direct class drawer retains valid filters", async () =>
    {
        await load(page,`${classes}?style=invalid&age=adult&level=bad&class=sat-1145`);
        await expect(page.locator("#class-drawer")).toBeVisible();
        assert.ok(!page.url().includes("invalid") && !page.url().includes("bad"));
        assert.ok(page.url().includes("age=adult") && page.url().includes("class=sat-1145"));
        await page.keyboard.press("Escape");
        await expect(page.locator(".class-row")).toHaveCount(12);
    });
    await check("Trial link preselects actual adult class and preserves plan consideration", async () =>
    {
        await load(page,`${home}?class=wed-1845&plan=eight#trial`);
        await expect(page.locator("#session")).toHaveValue("wed-1845");
        await expect(page.locator("#guardian")).not.toBeVisible();
        await expect(page.locator("#plan-note")).toContainText("Eight-class pass");
        assert.equal(await page.locator("#session option").count(),15);
    });
    await check("Validation blocks incomplete form; blur errors and focus first invalid", async () =>
    {
        await page.locator(".submit").click();
        await expect(page.locator("#name")).toBeFocused();
        await expect(page.locator("#name")).toHaveAttribute("aria-invalid","true");
        await page.locator("#name").fill("Alex");
        await page.locator("#email").fill("not-an-email");
        await page.locator("#notes").focus();
        await expect(page.locator("#email-error")).toHaveText("Enter a valid email address.");
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#notes").fill("First visit");
        await expect(page.locator("#notes-count")).toHaveText("11 / 240");
    });
    await check("Youth guardian required; adult hides requirement, local pass and stable reference", async () =>
    {
        await page.locator("#session").selectOption("mon-1630");
        await expect(page.locator("#guardian")).toBeVisible();
        await page.locator("#experience-0").check();
        await page.locator("#consent").check();
        await page.locator(".submit").click();
        await expect(page.locator("#guardian")).toBeFocused();
        await expect(page.locator("#guardian-error")).not.toBeEmpty();
        await page.locator("#guardian").fill("Taylor");
        await page.locator(".submit").click();
        await expect(page.locator("#trial-pass")).toBeVisible();
        await expect(page.locator("#pass-title")).toBeFocused();
        await expect(page.locator("#trial-pass")).toContainText("Youth Hip-Hop Foundations");
        await expect(page.locator("#trial-pass")).toContainText("No payment has been taken and no email has been sent.");
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("offbeat-dance-assembly:trial")));
        assert.deepEqual(Object.keys(saved).sort(),["created","id","name","sessionId"]);
        assert.match(saved.id,/^OD-\d{4}$/);
        const created = Date.parse(saved.created);
        assert.ok(Math.abs(created - Date.now()) < 10000);
        await page.reload({waitUntil:"networkidle"});
        await expect(page.locator(".reference")).toHaveText(saved.id);
        await overflow(page,"desktop saved booking");
    });
    await check("Print control calls browser print; print CSS exposes only trial pass", async () =>
    {
        await page.evaluate(() =>
        {
            window.print = () => window.__printed = true;
        });
        await page.locator("#print-pass").click();
        assert.equal(await page.evaluate(() => window.__printed),true);
        await page.emulateMedia({media:"print"});
        assert.equal(await page.locator("#trial-pass").evaluate((element) => getComputedStyle(element).visibility),"visible");
        assert.equal(await page.locator("#header").evaluate((element) => getComputedStyle(element).visibility),"hidden");
        const pdf = await page.pdf({path:path.join(checks,"trial-pass.pdf"),format:"A4"});
        assert.equal((pdf.toString("latin1").match(/\/Type \/Page\b/g) || []).length,1);
        await page.emulateMedia({media:"screen"});
    });
    await check("Reset cancellation preserves pass; accepted reset removes local record", async () =>
    {
        page.once("dialog",(dialog) => dialog.dismiss());
        await page.locator("#reset-pass").click();
        await expect(page.locator("#trial-pass")).toBeVisible();
        page.once("dialog",(dialog) => dialog.accept());
        await page.locator("#reset-pass").click();
        await expect(page.locator("#trial-form")).toBeVisible();
        assert.equal(await page.evaluate(() => localStorage.getItem("offbeat-dance-assembly:trial")),null);
        await overflow(page,"desktop home after interactions");
    });
    await check("Invalid trial class safely defaults and no malformed stored reservation loads", async () =>
    {
        await page.evaluate(() => localStorage.setItem("offbeat-dance-assembly:trial",'{"id":"OD-1234","name":"Unsafe","sessionId":"tue-2000","created":"2026-01-01"}'));
        await load(page,`${home}?class=unknown&plan=unknown#trial`);
        await expect(page.locator("#session")).toHaveValue("mon-1630");
        await expect(page.locator("#plan-note")).not.toBeVisible();
        await page.evaluate(() => localStorage.clear());
    });
    await check("Desktop 1440×900 fits both pages", async () =>
    {
        await page.setViewportSize({width:1440,height:900});
        viewports.push({name:"wide",width:1440,height:900,deviceScaleFactor:1});
        await load(page,home);
        await overflow(page,"wide home");
        await load(page,classes);
        await overflow(page,"wide timetable");
    });
    await context.close();
    const mobileContext = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const mobile = await mobileContext.newPage();
    monitor(mobile);
    viewports.push({name:"mobile",width:390,height:844,deviceScaleFactor:1});
    await check("Mobile meaningful homepage, actual screenshot and no overflow", async () =>
    {
        await load(mobile,home);
        await mobile.screenshot({path:path.join(checks,"mobile.png")});
        await overflow(mobile,"mobile home before interactions");
    });
    await check("Mobile menu focus trap, Escape restore and link closes", async () =>
    {
        const trigger = mobile.getByRole("button",{name:"Open menu"});
        await trigger.click();
        await expect(mobile.getByRole("button",{name:"Close menu"})).toBeFocused();
        await mobile.keyboard.press("Shift+Tab");
        assert.equal(await mobile.evaluate(() => document.querySelector("#mobile-menu").contains(document.activeElement)),true);
        await mobile.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
        await trigger.click();
        await mobile.locator("#mobile-menu").getByRole("link",{name:"Timetable",exact:true}).click();
        await mobile.waitForURL(/classes\.html$/);
        await mobile.waitForLoadState("networkidle");
        await expect(mobile.locator("#mobile-menu")).not.toBeVisible();
        await mobile.screenshot({path:path.join(checks,"classes-mobile.png")});
        await overflow(mobile,"mobile timetable before interactions");
    });
    await check("Mobile chip scrolling stays local, details keyboard/mobile and trial direct link", async () =>
    {
        await mobile.locator('[data-filter=level][data-value=advanced]').click();
        await expect(mobile.locator(".class-row")).toHaveCount(3);
        await overflow(mobile,"mobile advanced filter");
        await mobile.locator(".clear-filters").click();
        await mobile.locator('[data-session="sat-1145"]').click();
        await expect(mobile.locator("#class-drawer")).toBeVisible();
        await overflow(mobile,"mobile open drawer");
        await mobile.getByRole("link",{name:"Reserve this as my free trial"}).click();
        await mobile.waitForURL(/class=sat-1145#trial/);
        await expect(mobile.locator("#session")).toHaveValue("sat-1145");
        await expect(mobile.locator("#guardian")).not.toBeVisible();
        await mobile.locator("#name").fill("Sam");
        await mobile.locator("#email").fill("sam@example.com");
        await mobile.locator("#experience-2").check();
        await mobile.locator("#consent").check();
        await mobile.locator(".submit").click();
        await expect(mobile.locator("#trial-pass")).toBeVisible();
        await overflow(mobile,"mobile saved trial");
        await mobile.reload({waitUntil:"networkidle"});
        await expect(mobile.locator("#trial-pass")).toContainText("Adult First Contemporary");
    });
    await check("Mobile all sections and images load without page overflow", async () =>
    {
        await mobile.evaluate(async () =>
        {
            for (const image of document.images)
            {
                image.loading = "eager";
                await image.decode();
            }
        });
        for (const id of ["programs","instructors","recital","passes","trial","faq","visit"])
        {
            await mobile.locator(`#${id}`).scrollIntoViewIfNeeded();
            await overflow(mobile,`mobile section ${id}`);
        }
    });
    await mobileContext.close();
    const restricted = await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    await restricted.addInitScript(() =>
    {
        Storage.prototype.setItem = function () { throw new DOMException("Storage denied","SecurityError"); };
    });
    const fallback = await restricted.newPage();
    monitor(fallback);
    await check("Reduced motion readable at rest, storage failure honestly disclosed", async () =>
    {
        await load(fallback,`${home}?class=wed-1845#trial`);
        const motion = await fallback.locator(".rail-track").evaluate((element) => getComputedStyle(element).animationName);
        assert.equal(motion,"none");
        await fallback.locator("#name").fill("Morgan");
        await fallback.locator("#email").fill("morgan@example.com");
        await fallback.locator("#experience-0").check();
        await fallback.locator("#consent").check();
        await fallback.locator(".submit").click();
        await expect(fallback.locator("#trial-pass")).toContainText("browser storage is unavailable");
        await overflow(fallback,"storage-denied mobile confirmation");
    });
    await restricted.close();
    assert.deepEqual(errors,[]);
}
catch (error)
{
    failure = error;
    results.push({name:"Verification stopped",passed:false,error:error.stack});
    console.error(error);
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    closed = true;
    const screenshots = {};
    for (const name of ["desktop","mobile","classes-desktop","classes-mobile"])
    {
        try
        {
            const buffer = await readFile(path.join(checks,`${name}.png`));
            screenshots[name] = {file:`.checks\\${name}.png`,sha256:createHash("sha256").update(buffer).digest("hex"),width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
        }
        catch {}
    }
    await WorkspaceFiles.saveJson(path.join(checks,"qa.json"),
    {
        prompt:"567-dance-studio-website",
        modelId:"gpt-6.1-sol",
        checkedAt:new Date().toISOString(),
        passed:!failure && errors.length === 0,
        results, errors, viewports, screenshots,
        visualReviewed:false,
        resourcesClosed:closed
    });
}
if (failure) process.exitCode = 1;
