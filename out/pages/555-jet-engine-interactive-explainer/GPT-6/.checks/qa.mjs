import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "555-jet-engine-interactive-explainer");
assert.equal(job.modelId, "gpt-6.1-sol");
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const qa = {passed: false, visualReviewed: false, viewports: [], assertions: [], errors: [], resourcesClosed: false};
let server;
let browser;
function passed(text)
{
    qa.assertions.push(text);
}
async function overflow(page, context)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, context);
    passed(context);
}
async function setThrottle(page, endpoint)
{
    const slider = page.locator("#hero-throttle");
    await slider.focus();
    await slider.press(endpoint);
}
function captureErrors(page)
{
    page.on("pageerror", (e) => qa.errors.push(`page: ${e.message}`));
    page.on("console", (e) =>
    {
        if (e.type() === "error") qa.errors.push(`console: ${e.text()}`);
    });
    page.on("response", (response) =>
    {
        if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on("requestfailed", (request) => qa.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
}
try
{
    server = await startPreviewServer(exported, {workspace});
    assert.ok(server.url.endsWith("/pages/jet-engine-interactive-explainer/GPT-6/index.html"));
    browser = await chromium.launch({headless: true});
    const page = await browser.newPage({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    captureErrors(page);
    const response = await page.goto(server.url, {waitUntil: "networkidle"});
    assert.equal(response.status(), 200);
    await page.locator(".scene path[data-blade]").first().waitFor();
    assert.ok((await page.locator("body").innerText()).length > 3000);
    assert.equal(await page.locator('[data-scene="hero"] [data-rotor="0"]').count(), 22);
    assert.equal(await page.locator('[data-scene="hero"] [data-rotor="13"]').count(), 16);
    assert.equal(await page.locator('[data-scene="hero"] .particles circle').count(), 160);
    assert.equal(await page.locator(".chapter").count(), 5);
    passed("HTTP 200 at exact final public subpath; meaningful visible page, 22 fan blades, 14 rotor rows, five chapters, 160 desktop particles.");
    await overflow(page, "Desktop initial: no horizontal overflow.");
    qa.viewports.push({width: 1200, height: 900, deviceScaleFactor: 1, screenshot: ".checks\\desktop.png"});
    await page.screenshot({path: path.join(checks, "desktop.png")});
    await setThrottle(page, "End");
    assert.equal(await page.locator("#hero-throttle").inputValue(), "100");
    assert.equal(await page.locator("#lab-throttle").inputValue(), "100");
    assert.match(await page.locator(".n1").first().innerText(), /4\.80/);
    assert.match(await page.locator(".n2").first().innerText(), /12\.50/);
    const blade = page.locator('[data-scene="hero"] [data-rotor="0"]').first();
    const moving = await blade.getAttribute("d");
    await page.waitForTimeout(140);
    assert.notEqual(await blade.getAttribute("d"), moving);
    await page.locator(".motion-toggle").first().click();
    const paused = await blade.getAttribute("d");
    await page.waitForTimeout(150);
    assert.equal(await blade.getAttribute("d"), paused);
    await page.locator(".motion-toggle").first().click();
    await setThrottle(page, "Home");
    assert.match(await page.locator(".n1").first().innerText(), /0\.00/);
    assert.match(await page.locator(".n2").first().innerText(), /0\.00/);
    const zero = await blade.getAttribute("d");
    const zeroParticle = await page.locator('[data-scene="hero"] .particles circle').first().getAttribute("cx");
    await page.waitForTimeout(150);
    assert.equal(await blade.getAttribute("d"), zero);
    assert.equal(await page.locator('[data-scene="hero"] .particles circle').first().getAttribute("cx"), zeroParticle);
    await page.locator("#hero-throttle").press("ArrowRight");
    assert.equal(await page.locator("#hero-throttle").inputValue(), "1");
    assert.equal(await page.locator("#tour-throttle").inputValue(), "1");
    passed("Keyboard Home/End/ArrowRight synchronize all three throttles and both spool readouts; real projected blades move, pause freezes geometry, zero freezes blades and particles.");
    await page.locator('[data-flow="bypass"]').first().click();
    assert.equal(await page.locator(".bypass-path").first().isVisible(), false);
    assert.equal(await page.locator(".core-path").first().isVisible(), true);
    await page.locator('[data-flow="core"]').first().click();
    assert.equal(await page.locator(".core-path").first().isVisible(), false);
    assert.equal(await page.locator('[data-scene="hero"] .particles circle:visible').count(), 0);
    await page.locator('[data-flow="bypass"]').first().click();
    await page.locator('[data-flow="core"]').first().click();
    assert.equal(await page.locator('[data-scene="hero"] .particles circle:visible').count(), 160);
    passed("Bypass/core controls independently hide path and particle groups and synchronize all scenes.");
    for (let index = 0; index < 5; index++)
    {
        await page.locator(`[data-stage="${index}"]`).click();
        assert.equal(await page.locator(`[data-stage="${index}"]`).getAttribute("aria-pressed"), "true");
        assert.ok((await page.locator(".annotation").innerText()).length > 40);
    }
    assert.equal(await page.locator('[data-scene="tour"] [data-zone="combustor"]').first().evaluate((el) => el.classList.contains("muted-zone")), true);
    await page.locator(".reset-view").click();
    assert.equal(await page.locator("#tour-throttle").inputValue(), "35");
    assert.equal(await page.locator('[data-stage="0"]').getAttribute("aria-pressed"), "true");
    await page.emulateMedia({reducedMotion: "reduce"});
    for (let index = 0; index < 5; index++)
    {
        await page.locator(`[data-chapter="${index}"]`).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * .3));
        await page.waitForTimeout(90);
        assert.equal(await page.locator(`[data-stage="${index}"]`).getAttribute("aria-pressed"), "true", `scroll stage ${index}`);
    }
    passed("All five manual stage selections highlight relevant geometry; reset restores defaults; real scrolling selects all five cutaway states.");
    await page.locator('[data-answer="0"]').click();
    assert.match(await page.locator(".feedback").innerText(), /Not quite/);
    await page.locator('[data-answer="1"]').focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator(".feedback").innerText(), /Exactly/);
    await page.locator(".quiz .quiz-reset").click();
    assert.equal(await page.locator(".feedback").innerText(), "");
    assert.equal(await page.locator('[data-answer="0"]').evaluate((el) => el === document.activeElement), true);
    passed("Wrong and correct quiz choices provide mechanical explanations; keyboard Enter selects; retry clears feedback and restores focus.");
    await overflow(page, "Desktop after interactions: no horizontal overflow.");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const still = await blade.getAttribute("d");
    await page.waitForTimeout(150);
    assert.equal(await blade.getAttribute("d"), still);
    assert.match(await page.locator(".live").first().innerText(), /Reduced motion/);
    await setThrottle(page, "End");
    assert.match(await page.locator(".n2").first().innerText(), /12\.50/);
    passed("Reduced motion freezes continuous rotors while keyboard readouts, scroll states, toggles and quiz remain functional.");
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.locator(".reset-view").click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);
    const offscreen = await blade.getAttribute("d");
    await page.waitForTimeout(150);
    assert.equal(await blade.getAttribute("d"), offscreen);
    passed("Offscreen hero scene does not update rotor geometry.");
    await page.setViewportSize({width: 1440, height: 900});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await overflow(page, "1440×900 requested desktop layout: no horizontal overflow.");
    qa.viewports.push({width: 1440, height: 900, deviceScaleFactor: 1});
    await page.close();

    const mobile = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    captureErrors(mobile);
    assert.equal((await mobile.goto(server.url, {waitUntil: "networkidle"})).status(), 200);
    assert.equal(await mobile.locator('[data-scene="hero"] .particles circle').count(), 80);
    await overflow(mobile, "Mobile initial: no horizontal overflow.");
    qa.viewports.push({width: 390, height: 844, deviceScaleFactor: 1, screenshot: ".checks\\mobile.png"});
    await mobile.screenshot({path: path.join(checks, "mobile.png")});
    await mobile.locator(".motion-toggle").first().tap();
    assert.equal(await mobile.locator(".motion-toggle").first().getAttribute("aria-pressed"), "true");
    await mobile.locator('[data-flow="core"]').first().tap();
    assert.equal(await mobile.locator(".core-path").first().isVisible(), false);
    await mobile.locator('[data-stage="3"]').tap();
    assert.equal(await mobile.locator('[data-stage="3"]').getAttribute("aria-pressed"), "true");
    await mobile.locator('[data-answer="1"]').tap();
    assert.match(await mobile.locator(".feedback").innerText(), /Exactly/);
    await mobile.locator("#lab-throttle").evaluate((el) =>
    {
        el.value = "73";
        el.dispatchEvent(new Event("input", {bubbles: true}));
    });
    assert.equal(await mobile.locator("#hero-throttle").inputValue(), "73");
    await overflow(mobile, "Mobile after touch/quiz/throttle interactions: no horizontal overflow.");
    passed("390×844 mobile: 80 particles; actual touch pause, flow isolation, stage selection and quiz; 73% lab throttle synchronizes hero.");
    await mobile.close();
    assert.deepEqual(qa.errors, []);
    qa.staticDigest = await StaticHomepage.validateStaticOutput(exported, "jet-engine-interactive-explainer", "GPT-6");
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
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
