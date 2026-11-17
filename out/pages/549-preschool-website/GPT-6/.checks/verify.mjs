import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspace = path.resolve(folder, "..", "..", "..", "..");
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const exported = path.join(folder, "out");
const qa =
{
    prompt: "549-preschool-website",
    modelId: "gpt-6.1-sol",
    publicModel: "GPT-6",
    passed: false,
    visualReviewed: false,
    resourcesClosed: false,
    tests: [],
    viewports: [],
    errors: [],
    screenshots:
    {
        desktop: path.join(folder, ".checks", "desktop.png"),
        mobile: path.join(folder, ".checks", "mobile.png")
    }
};
let browser;
let server;

function pass(name, evidence)
{
    qa.tests.push({ name, passed: true, evidence });
}

async function overflow(page, label)
{
    const sizes = await page.evaluate(() =>
    ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: horizontal overflow ${JSON.stringify(sizes)}`);
    pass(`No horizontal overflow: ${label}`, sizes);
}

async function settle(page)
{
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) =>
        {
            if (image.complete) return Promise.resolve();
            return new Promise((resolve) =>
            {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });
        }));
    });
    await page.waitForTimeout(2300);
}

async function exercise(page, label, mobile)
{
    for (const id of ["programs", "day", "teachers", "tuition"])
    {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        await overflow(page, `${label} ${id}`);
        if (label === "desktop" && id === "teachers")
        {
            await page.locator("#teachers").screenshot({ path: path.join(folder, ".checks", "desktop-teachers.png") });
        }
    }
    assert.equal(await page.locator(".program-card").count(), 3);
    assert.equal(await page.locator(".timeline li").count(), 7);
    assert.equal(await page.locator(".teacher-card").count(), 3);
    assert.equal(await page.locator("tbody tr").count(), 5);
    assert.equal(await page.locator("details").count(), 5);
    assert.equal(await page.locator(".lunch .time").innerText(), "11:30");
    assert.match(await page.locator("tbody").innerText(), /\$420[\s\S]*\$1,450/);
    pass(`${label}: full preschool content`, "Three programs, seven timed stops, lunch highlight, three teachers, five exact rates and five FAQs.");

    for (let index = 0; index < 5; index++)
    {
        const details = page.locator("details").nth(index);
        const summary = details.locator("summary");
        await summary.focus();
        await summary.press("Enter");
        assert.equal(await details.getAttribute("open"), "");
        assert(await details.locator("p").isVisible());
        assert((await details.locator("p").innerText()).length > 50);
        await summary.press("Enter");
        assert.equal(await details.getAttribute("open"), null);
    }
    pass(`${label}: all FAQ accordions`, "All five open and close with Enter, exposing real parent answers.");
    await overflow(page, `${label} FAQ interaction`);

    await page.getByRole("link", { name: "Book a tour", exact: true }).first().click();
    await page.waitForTimeout(900);
    assert(new URL(page.url()).hash === "#tour");
    const tourBox = await page.locator("#tour").boundingBox();
    assert(tourBox.y >= 70 && tourBox.y < 160, `Tour anchor is hidden by header: ${tourBox.y}`);
    pass(`${label}: sticky tour navigation`, { hash: "#tour", sectionTop: tourBox.y });

    await page.getByRole("button", { name: "Request the tour" }).click();
    assert.equal(await page.locator(".field-error:not([hidden])").count(), 5);
    assert(await page.locator("#error-summary").isVisible());
    assert.equal(await page.locator('input[name="day"]').first().evaluate((node) => node === document.activeElement), true);
    pass(`${label}: kind empty-form validation`, "Five inline errors, alert summary, first invalid radio focused.");
    await overflow(page, `${label} invalid submit`);

    if (!mobile)
    {
        const day = page.locator('input[name="day"]').first();
        await day.press("Space");
        await day.press("ArrowRight");
        assert(await page.locator('input[name="day"][value="Thursday"]').isChecked());
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.name), "time");
        await page.keyboard.press("Space");
        await page.keyboard.press("ArrowRight");
        assert(await page.locator('input[name="time"][value="10:00"]').isChecked());
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.id), "age");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        assert.equal(await page.locator("#age").inputValue(), "3");
        await page.keyboard.press("Tab");
        await page.keyboard.type("Ada");
        await page.keyboard.press("Tab");
        await page.keyboard.type("abc");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
    }
    else
    {
        await page.locator(".chip").filter({ hasText: "Tuesday" }).click();
        await page.locator(".chip").filter({ hasText: "9:00" }).click();
        await page.locator("#age").selectOption("2");
        await page.locator("#name").fill("Milo");
        await page.locator("#phone").fill("abc");
        await page.getByRole("button", { name: "Request the tour" }).click();
    }
    assert(await page.locator("#phone-error").isVisible());
    assert.equal(await page.locator(".field-error:not([hidden])").count(), 1);
    await page.locator("#phone").fill("(303) 555-0123");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#name").inputValue(), mobile ? "Milo" : "Ada");
    assert.equal(await page.locator("#phone").inputValue(), "(303) 555-0123");
    assert.equal(await page.locator("#age").inputValue(), mobile ? "2" : "3");
    assert(await page.locator(`input[name="day"][value="${mobile ? "Tuesday" : "Thursday"}"]`).isChecked());
    pass(`${label}: keyboard/touch selection, phone validation and draft restore`, "Day/time, age and example first-name/phone retained after reload; alphabetic phone rejected.");

    await page.locator("#tour").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    if (!mobile)
    {
        await page.locator("#phone").focus();
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.type), "submit");
        await page.keyboard.press("Enter");
    }
    else
    {
        await page.getByRole("button", { name: "Request the tour" }).click();
    }
    assert(await page.locator(".booked").isVisible());
    assert.match(await page.locator("#booked-heading").innerText(), mobile ? /Milo/ : /Ada/);
    assert.match(await page.locator(".booked-echo").innerText(), mobile ? /Tuesday · 9:00 · Age 2/ : /Thursday · 10:00 · Age 3/);
    assert.match(await page.locator(".booked").innerText(), /not booked with a school/);
    await overflow(page, `${label} booked state`);
    if (mobile)
    {
        await page.waitForTimeout(400);
        await page.locator(".tour-panel").screenshot({ path: path.join(folder, ".checks", "mobile-tour.png") });
    }
    await page.reload({ waitUntil: "networkidle" });
    assert(await page.locator(".booked").isVisible());
    await page.getByRole("button", { name: "Change my tour" }).click();
    assert.equal(await page.locator("#name").inputValue(), mobile ? "Milo" : "Ada");
    assert.equal(await page.locator("#phone").inputValue(), "(303) 555-0123");
    pass(`${label}: local confirmation, persisted booking and prefilled editing`, "Name/day/time/age echoed; no actual booking claimed; Change my tour restores all fields.");
    await overflow(page, `${label} after all interactions`);

    await page.evaluate(() => document.querySelectorAll("img").forEach((image) => image.loading = "eager"));
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    pass(`${label}: exact template photos loaded`, await page.locator("img").evaluateAll((images) => images.map((image) => ({ src: image.getAttribute("src"), width: image.naturalWidth }))));
}

try
{
    qa.staticDigest = await StaticHomepage.validateStaticOutput(exported, "preschool-website", "GPT-6");
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    pass("Repository source and model-subpath static checks", { digest: qa.staticDigest });
    for (const file of ["index.html", "app.js", "content.js", "icons.js", "styles.css"])
    {
        assert((await readFile(path.join(folder, file))).equals(await readFile(path.join(exported, file))));
    }
    pass("Source/export equality", "HTML, CSS, content, browser app and inline icons are byte-identical.");
    server = await startPreviewServer(exported, { workspace });
    qa.publicUrl = server.url;
    assert(server.url.endsWith("/pages/preschool-website/GPT-6/index.html"));
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/", server.url))).status, 404);
    assert.equal((await fetch(new URL("./metadata.json", server.url))).status, 404);
    pass("Responsive target-only preview server", "Homepage HTTP 200; root and private metadata deliberately HTTP 404.");
    browser = await chromium.launch({ headless: true });
    const specifications =
    [
        { label: "desktop", width: 1200, height: 900, interactive: true },
        { label: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, interactive: true },
        { label: "desktop-wide", width: 1440, height: 900 },
        { label: "tablet", width: 820, height: 900 },
        { label: "narrow", width: 320, height: 844 },
        { label: "reduced-motion", width: 390, height: 844, reducedMotion: "reduce" }
    ];
    for (const spec of specifications)
    {
        const context = await browser.newContext(
        {
            viewport: { width: spec.width, height: spec.height },
            deviceScaleFactor: 1,
            isMobile: spec.isMobile || false,
            hasTouch: spec.hasTouch || false,
            reducedMotion: spec.reducedMotion || "no-preference"
        });
        const page = await context.newPage();
        const requests = [];
        page.on("pageerror", (error) => qa.errors.push({ viewport: spec.label, type: "pageerror", message: error.message }));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push({ viewport: spec.label, type: "console", message: message.text() });
        });
        page.on("requestfailed", (request) => qa.errors.push({ viewport: spec.label, type: "requestfailed", url: request.url(), message: request.failure()?.errorText }));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) qa.errors.push({ viewport: spec.label, type: "http", status: response.status(), url: response.url() });
        });
        page.on("request", (request) => requests.push({ url: request.url(), method: request.method() }));
        try
        {
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await settle(page);
            assert(await page.locator("h1").isVisible());
            assert.match(await page.locator("h1").innerText(), /Small people,\s+big mornings\./);
            assert((await page.locator("main").innerText()).length > 2500);
            assert.equal(await page.locator("html").getAttribute("lang"), "en");
            assert.equal(await page.evaluate(() => document.fonts.check('700 32px "Baloo 2"') && document.fonts.check('400 16px "Nunito Sans Variable"')), true);
            assert.equal(await page.locator(".first-hello img").evaluate((node) => node.complete && node.naturalWidth > 0), true);
            assert.equal(await page.locator(".first-hello").evaluate((node) => node.getBoundingClientRect().bottom < innerHeight), true);
            await overflow(page, `${spec.label} initial`);
            if (spec.label === "desktop" || spec.label === "mobile")
            {
                await page.screenshot({ path: qa.screenshots[spec.label], fullPage: false });
            }
            if (spec.interactive) await exercise(page, spec.label, !!spec.isMobile);
            else
            {
                await page.locator("#teachers").scrollIntoViewIfNeeded();
                await page.locator("#tour").scrollIntoViewIfNeeded();
                await page.waitForTimeout(900);
                await overflow(page, `${spec.label} lower sections`);
            }
            if (spec.reducedMotion)
            {
                const motion = await page.locator(".hero-copy h1").evaluate((node) =>
                {
                    const style = getComputedStyle(node);
                    return { animation: style.animationName, transform: style.transform };
                });
                assert.equal(motion.animation, "none");
                assert.equal(await page.locator(".tour-panel").evaluate((node) => getComputedStyle(node).opacity), "1");
                pass("Reduced motion", motion);
            }
            assert(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(server.url).origin));
            pass(`${spec.label}: no transmission or third-party runtime resources`, { requests: requests.length, methods: ["GET"], localOnly: true });
            qa.viewports.push({ ...spec, deviceScaleFactor: 1, passed: true });
        }
        finally
        {
            await context.close();
        }
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    try
    {
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push({ viewport: "storage", type: "pageerror", message: error.message }));
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.evaluate(() => localStorage.setItem("bluebird-garden-preschool:tour", "{broken"));
        await page.reload({ waitUntil: "networkidle" });
        assert.match(await page.locator("#storage-warning").innerText(), /could not be read/);
        assert(await page.locator("#tour-form").isVisible());
        await page.evaluate(() => localStorage.setItem("bluebird-garden-preschool:tour", JSON.stringify({ day: "Friday", time: "12:00", age: "99", sent: true })));
        await page.reload({ waitUntil: "networkidle" });
        assert(await page.locator("#tour-form").isVisible());
        assert.equal(await page.locator("#age").inputValue(), "");
        pass("Corrupt and invalid persisted data", "Malformed JSON and impossible sent booking safely fall back to editable form.");
    }
    finally
    {
        await context.close();
    }
    const blocked = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    try
    {
        await blocked.addInitScript(() =>
        {
            Storage.prototype.getItem = () => { throw new Error("Blocked storage"); };
            Storage.prototype.setItem = () => { throw new Error("Blocked storage"); };
        });
        const page = await blocked.newPage();
        page.on("pageerror", (error) => qa.errors.push({ viewport: "blocked-storage", type: "pageerror", message: error.message }));
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.locator(".chip").filter({ hasText: "Thursday" }).click();
        await page.locator(".chip").filter({ hasText: "10:00" }).click();
        await page.locator("#age").selectOption("4");
        await page.locator("#name").fill("<b>Alex</b>");
        await page.locator("#phone").fill("3035550123");
        await page.getByRole("button", { name: "Request the tour" }).click();
        assert(await page.locator(".booked").isVisible());
        assert.match(await page.locator("#storage-warning").innerText(), /won’t survive a refresh/);
        assert.match(await page.locator("#booked-heading").innerText(), /<b>Alex<\/b>/);
        assert.equal(await page.locator("#booked-heading b").count(), 0);
        await overflow(page, "blocked-storage confirmation");
        pass("Unavailable storage and safe name rendering", "Confirmation still works with storage denied, warns truthfully, and escapes HTML-like names.");
    }
    finally
    {
        await blocked.close();
    }
    assert.equal(qa.errors.length, 0, JSON.stringify(qa.errors));
    pass("Zero console/page/HTTP/resource/request errors", { errors: qa.errors });
    let bytes = 0;
    async function total(directory)
    {
        for (const entry of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await total(file);
            else bytes += (await readFile(file)).length;
        }
    }
    await total(exported);
    assert(bytes < 10 * 1024 * 1024);
    qa.staticBytes = bytes;
    qa.passed = true;
}
catch (error)
{
    qa.errors.push({ type: "assertion", message: error.message, stack: error.stack });
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
}
console.log(JSON.stringify({ passed: qa.passed, assertions: qa.tests.length, viewports: qa.viewports.map((view) => view.label), errors: qa.errors, resourcesClosed: qa.resourcesClosed }, null, 2));
