import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "600-movie-rating-community");
assert.equal(job.modelId, "gpt-6.1-sol");
const durable = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(durable.runId, job.runId);
assert.equal(durable.ownedLock.prompt, job.prompt);
assert.equal(durable.ownedLock.pid, pid);
process.kill(pid, 0);
const checks = path.join(job.output, ".checks");
const output = path.join(job.output, "out");
const results = [];
const errors = [];
const viewports = [];
let browser;
let server;
let resourcesClosed = false;
let failure;
let url;

function monitor(page, name)
{
    page.on("pageerror", (error) => errors.push({ name, type: "pageerror", text: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push({ name, type: "console", text: message.text() });
    });
    page.on("requestfailed", (request) => errors.push({ name, type: "requestfailed", text: request.url(), detail: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push({ name, type: "http", status: response.status(), text: response.url() });
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith("http://127.0.0.1:")) errors.push({ name, type: "external-request", text: request.url() });
    });
}

async function check(name, run)
{
    await run();
    results.push({ name, passed: true });
    console.log("PASS " + name);
}

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(sizes.document <= sizes.width && sizes.body <= sizes.width, `${label}: ${JSON.stringify(sizes)}`);
}

async function go(page, hash)
{
    await page.goto(url + hash, { waitUntil: "networkidle" });
    await page.locator("main h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
}

async function saved(page)
{
    return page.evaluate(() => JSON.parse(localStorage.getItem("fableframe-community-v1")));
}

try
{
    const source = await StaticHomepage.checkSource(job.output);
    assert.equal(source, "html");
    const digest = await StaticHomepage.validateStaticOutput(output, "movie-rating-community", "GPT-6");
    server = await startPreviewServer(output, { workspace });
    url = server.url;
    assert.ok(url.includes("/pages/movie-rating-community/GPT-6/index.html"));
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /<main/);
    browser = await chromium.launch({ headless: true });

    for (const viewport of [{ width: 1200, height: 900 }, { width: 1440, height: 900 }, { width: 390, height: 844 }])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        monitor(page, `${viewport.width}`);
        await check(`Home HTTP, content, local fonts/images, no overflow ${viewport.width}×${viewport.height}`, async () =>
        {
            await go(page, "#/");
            assert.ok(await page.locator("main").innerText().then((text) => text.length > 1500));
            assert.equal(await page.locator(".film-grid .film-card").count(), 6);
            assert.equal(await page.locator(".feature .poster").count(), 4);
            assert.ok(await page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0)));
            assert.ok(await page.evaluate(() => document.fonts.check("16px Instrument") && document.fonts.check("16px DM") && document.fonts.check("16px Plex")));
            await noOverflow(page, "initial homepage");
            if (viewport.width === 1200) await page.screenshot({ path: path.join(checks, "desktop.png") });
            if (viewport.width === 390)
            {
                await page.screenshot({ path: path.join(checks, "mobile.png") });
                const filmButton = await page.getByRole("link", { name: "View film", exact: true }).boundingBox();
                assert.ok(filmButton.y + filmButton.height < 844, "Mobile featured CTA must be in first screen");
            }
        });
        viewports.push({ ...viewport, deviceScaleFactor: 1, homepagePassed: true });
        await check(`Every route visible with no page overflow ${viewport.width}`, async () =>
        {
            for (const hash of ["#/film", "#/film/unknown-slug", "#/reviews", "#/rankings", "#/library", "#/profile"])
            {
                await go(page, hash);
                assert.ok((await page.locator("h1").innerText()).trim().length > 2);
                await noOverflow(page, hash);
            }
            await go(page, "#/film/unknown-slug");
            assert.match(await page.locator(".notice").innerText(), /not in this canon/);
            assert.equal(await page.locator("h1").innerText(), "The Cartographer's Dream");
        });
        if (viewport.width === 390)
        {
            await check("Mobile menu focus trap, Escape, return focus and real navigation", async () =>
            {
                await page.getByRole("button", { name: "Menu", exact: true }).click();
                assert.equal(await page.locator("#mobile-menu").evaluate((element) => element.open), true);
                await page.keyboard.press("Shift+Tab");
                assert.equal(await page.locator("#mobile-menu").evaluate((element) => element.contains(document.activeElement)), true);
                await page.keyboard.press("Escape");
                assert.equal(await page.getByRole("button", { name: "Menu", exact: true }).evaluate((element) => element === document.activeElement), true);
                await page.getByRole("button", { name: "Menu", exact: true }).click();
                await page.locator("#mobile-menu").getByRole("link", { name: "My Library", exact: true }).click();
                await page.locator(".shelf-header").waitFor();
                assert.equal(await page.locator("#mobile-menu").evaluate((element) => element.open), false);
                await page.getByRole("tab", { name: /Want to watch/ }).click();
                await page.locator(".shelf-card").first().getByRole("button", { name: "Mark watched", exact: true }).click();
                assert.equal((await saved(page)).watched.length, 48);
                assert.equal((await saved(page)).queue.length, 17);
                await noOverflow(page, "mobile list transition");
            });
        }
        await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    monitor(page, "interactions");
    await go(page, "#/");
    await check("Exact canonical catalog, interleaving, largest remainders, seed and essay lengths", async () =>
    {
        const data = await page.evaluate(async () =>
        {
            const { catalog, seedReviews, initialState } = await import("./content.js");
            return { catalog, seedReviews, seed: initialState() };
        });
        assert.equal(data.catalog.length, 100);
        assert.equal(new Set(data.catalog.map((film) => film.slug)).size, 100);
        assert.equal(new Set(data.catalog.slice(0,10).map((film) => film.genre)).size, 10);
        for (const [index, film] of data.catalog.entries())
        {
            assert.equal(film.rank,index + 1);
            assert.equal(film.counts.reduce((sum,value) => sum + value,0),860 + ((index * 7919) % 48000));
        }
        assert.equal(data.seed.watched.length,47);
        assert.equal(data.seed.queue.length,18);
        assert.equal(data.seed.reviews.length,12);
        for (const essay of data.seedReviews.filter((review) => review.type === "essay"))
        {
            const words = essay.body.split(/\s+/).length;
            assert.ok(words >= 80 && words <= 180);
        }
    });
    await check("Slash, search, arrow keys, Enter and Escape open real matching film", async () =>
    {
        await page.keyboard.press("/");
        assert.equal(await page.locator("#catalog-search").evaluate((element) => element === document.activeElement),true);
        await page.locator("#catalog-search").fill("Static");
        await page.keyboard.press("ArrowDown");
        assert.match(await page.evaluate(() => document.activeElement.textContent), /Static Between Stars/);
        await page.keyboard.press("Enter");
        await page.waitForURL(/#\/film\/static-between-stars/);
        await page.getByRole("heading", { name: "Static Between Stars", exact: true, level: 1 }).waitFor();
        assert.equal(await page.locator("h1").innerText(),"Static Between Stars");
        await page.keyboard.press("/");
        await page.locator("#catalog-search").fill("mystery");
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#catalog-results a").count(),0);
    });
    await check("Keyboard rating marks watched, excludes queue, updates exact aggregate and reverses", async () =>
    {
        await go(page,"#/film/the-bell-at-blackwater");
        await page.locator('[data-action="remove-rating"]').click();
        const baseline = await page.locator(".distribution").innerText();
        await page.locator(".film-actions .rating-input").getByRole("radio", { name: "1 out of 5", exact: true }).focus();
        await page.keyboard.press("ArrowRight");
        assert.equal((await saved(page)).ratings["the-bell-at-blackwater"],2);
        assert.ok((await saved(page)).watched.includes("the-bell-at-blackwater"));
        assert.ok(!(await saved(page)).queue.includes("the-bell-at-blackwater"));
        assert.match(await page.locator(".distribution").innerText(),/Your rating is included/);
        await page.locator('[data-action="remove-rating"]').click();
        assert.equal(await page.locator(".distribution").innerText(),baseline);
        await page.locator(".film-actions").getByRole("button", { name: /^Want to watch:/ }).click();
        assert.ok((await saved(page)).queue.includes("the-bell-at-blackwater"));
        assert.ok(!(await saved(page)).watched.includes("the-bell-at-blackwater"));
        await page.locator(".film-actions").getByRole("button", { name: "Watched", exact: true }).click();
        assert.ok(!(await saved(page)).queue.includes("the-bell-at-blackwater"));
        await noOverflow(page,"after rating and list changes");
    });
    await check("Helpful toggles once, persists, and review tabs support keyboard", async () =>
    {
        await go(page,"#/film/the-cartographers-dream");
        const helpful = page.locator('[data-action="helpful"]').first();
        const before = await helpful.innerText();
        await helpful.click();
        assert.equal(await page.locator('[data-action="helpful"]').first().getAttribute("aria-pressed"),"true");
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator('[data-action="helpful"]').first().getAttribute("aria-pressed"),"true");
        await page.locator('[data-action="helpful"]').first().click();
        assert.equal(await page.locator('[data-action="helpful"]').first().innerText(),before);
        await page.getByRole("tab", { name: "Short takes", exact: true }).focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.getByRole("tab", { name: "Long essays", exact: true }).getAttribute("aria-selected"),"true");
        await page.getByLabel("Sort", { exact: true }).selectOption("latest");
        const fullBody = await page.locator(".review.essay > p").first().innerText();
        await page.getByRole("button", { name: "Collapse essay", exact: true }).first().click();
        assert.ok((await page.locator(".review.essay > p").first().innerText()).length < fullBody.length);
        await page.getByRole("button", { name: "Read full essay", exact: true }).first().click();
        assert.equal(await page.locator(".review.essay > p").first().innerText(),fullBody);
    });
    await check("Canon AND filters, original ranks, rating sort, empty reset and all 100 progressive rows", async () =>
    {
        await go(page,"#/rankings");
        assert.equal(await page.locator(".rank-row").count(),20);
        assert.match(await page.locator(".rank-row").first().innerText(),/001[\s\S]*The Cartographer's Dream/);
        await page.getByLabel("Genre", { exact: true }).selectOption("Drama");
        await page.getByLabel("Decade", { exact: true }).selectOption("2020");
        await page.getByLabel("Minimum rating", { exact: true }).selectOption("4");
        const filtered = await page.locator(".rank-row").count();
        assert.ok(filtered > 0 && filtered < 20);
        for (const row of await page.locator(".rank-row").all())
        {
            assert.match(await row.locator(".rank-details").innerText(),/202[0-9]/);
            assert.match(await row.locator(".rank-details").innerText(),/Drama/);
        }
        await page.getByLabel("Find a film", { exact: true }).fill("no-such-film");
        assert.equal(await page.locator(".rank-row").count(),0);
        await page.getByRole("button", { name: "Reset filters", exact: true }).click();
        await page.getByLabel("Sort", { exact: true }).selectOption("rating");
        const rank = await page.locator(".rank-row .rank").first().innerText();
        assert.notEqual(rank,"001");
        await page.getByRole("button", { name: "Clear filters", exact: true }).click();
        for (let i=0; i<4; i++) await page.getByRole("button", { name: "Show 20 more", exact: true }).click();
        assert.equal(await page.locator(".rank-row").count(),100);
        await noOverflow(page,"all 100 rows");
    });
    await check("Review filters, empty state, progressive feed and essay expansion", async () =>
    {
        await go(page,"#/reviews");
        assert.equal(await page.locator("#review-feed .review").count(),6);
        await page.getByRole("button", { name: "Show more reviews", exact: true }).click();
        assert.equal(await page.locator("#review-feed .review").count(),12);
        await page.getByRole("tab", { name: "Long essays", exact: true }).click();
        await page.getByLabel("Genre", { exact: true }).selectOption("Science fiction");
        assert.ok((await page.locator(".result-count").innerText()).includes("reviews across"));
        await page.getByLabel("Search the notebook", { exact: true }).fill("no-such-review");
        assert.equal(await page.locator("#review-feed .review").count(),0);
        await page.locator(".empty").getByRole("button", { name: "Clear filters", exact: true }).click();
        const body = await page.locator(".review.essay > p").first().innerText();
        await page.getByRole("button", { name: "Read full essay", exact: true }).first().click();
        assert.ok((await page.locator(".review.essay > p").first().innerText()).length > body.length);
    });
    await check("Dialog focus, validation, draft, preview, essay publish and local persistence", async () =>
    {
        await page.getByRole("button", { name: "Write a review", exact: true }).click();
        assert.equal(await page.locator("#composer").evaluate((element) => element.open),true);
        await page.locator("#compose-film").fill("The Clockwork Heron");
        await page.locator("#composer").getByRole("radio", { name: "5 out of 5", exact: true }).click();
        await page.locator("#composer").getByRole("button", { name: "Publish short take", exact: true }).click();
        assert.match(await page.locator("#editor-error").innerText(),/Write what stayed/);
        await page.locator("#composer").getByRole("tab", { name: "Long essay", exact: true }).click();
        await page.getByLabel("Essay title", { exact: true }).fill("A small machine, a large silence");
        const essay = "The hesitant rhythm of the heron's walk is the film's real argument. It gives the apprentice room to notice a world that has been waiting for someone to pay attention. The marsh is a place worth revisiting.";
        await page.getByLabel("Your essay", { exact: true }).fill(essay);
        await page.locator("#composer").getByRole("button", { name: "Preview", exact: true }).click();
        assert.match(await page.locator("#dialog-editor").innerText(),/A small machine, a large silence/);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#composer").evaluate((element) => element.open),false);
        await page.getByRole("button", { name: "Write a review", exact: true }).click();
        await page.locator("#composer").getByRole("button", { name: "Edit", exact: true }).click();
        assert.equal(await page.getByLabel("Your essay", { exact: true }).inputValue(),essay);
        const count = (await saved(page)).reviews.length;
        await page.locator("#composer").getByRole("button", { name: "Publish essay", exact: true }).click();
        assert.equal(await page.locator("#composer").evaluate((element) => element.open),false);
        assert.equal((await saved(page)).reviews.length,count + 1);
        assert.equal(await page.locator("#review-feed h3").first().innerText(),"A small machine, a large silence");
        assert.equal(await page.locator("#review-feed h3").first().evaluate((element) => element === document.activeElement),true);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal((await saved(page)).reviews[0].title,"A small machine, a large silence");
    });
    await check("Inline short take, saved draft, discard confirmation and successful local insertion", async () =>
    {
        await go(page,"#/film/the-cartographers-dream");
        await page.getByRole("button", { name: "Write a short take", exact: true }).click();
        await page.getByLabel("What stayed with you?", { exact: true }).fill("The map folds, but the memory does not.");
        await go(page,"#/film/the-night-orchard");
        await page.getByLabel("What stayed with you?", { exact: true }).fill("The ledger leaves room for silence.");
        await go(page,"#/film/the-cartographers-dream");
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.getByLabel("What stayed with you?", { exact: true }).inputValue(),"The map folds, but the memory does not.");
        await page.getByRole("button", { name: "Discard draft", exact: true }).click();
        await page.getByRole("button", { name: "Keep writing", exact: true }).click();
        assert.equal(await page.getByLabel("What stayed with you?", { exact: true }).inputValue(),"The map folds, but the memory does not.");
        await page.getByRole("button", { name: "Publish short take", exact: true }).click();
        assert.match(await page.locator(".review").first().innerText(),/The map folds, but the memory does not/);
    });
    await check("Library inline rating, move, recent history and reconciled profile", async () =>
    {
        await go(page,"#/library");
        await page.locator(".shelf-card").first().getByRole("button", { name: "Rate", exact: true }).click();
        await page.locator(".inline-rating").getByRole("radio", { name: "3 out of 5", exact: true }).click();
        assert.ok((await saved(page)).changes[0].action.includes("Rated 3"));
        await page.locator(".shelf-card").first().getByRole("button", { name: "Move to want to watch", exact: true }).click();
        const snapshot = await saved(page);
        assert.ok(!snapshot.watched.some((slug) => snapshot.queue.includes(slug)));
        await go(page,"#/profile");
        const values = await page.locator(".profile-header .metric strong").allTextContents();
        assert.equal(Number(values[0]),snapshot.watched.length);
        assert.equal(Number(values[1]),snapshot.reviews.length);
        assert.equal(Number(values[3]),snapshot.queue.length);
        assert.equal(await page.locator(".profile-panels .panel").first().locator(".bar-row").count(),10);
        assert.equal(await page.locator(".decade").count(),7);
        await noOverflow(page,"updated profile");
    });
    await check("Inline diary reset confirmation restores exact original state", async () =>
    {
        await go(page,"#/library");
        await page.getByRole("button", { name: "Reset sample diary", exact: true }).click();
        await page.getByRole("button", { name: "Keep my changes", exact: true }).click();
        await page.getByRole("button", { name: "Reset sample diary", exact: true }).click();
        await page.getByRole("button", { name: "Restore original diary", exact: true }).click();
        const original = await saved(page);
        assert.equal(original.watched.length,47);
        assert.equal(original.queue.length,18);
        assert.equal(original.reviews.length,12);
        assert.equal(original.votes.length,0);
        assert.equal(await page.getByRole("tab", { name: /Watched · 47/ }).evaluate((element) => element === document.activeElement),true);
    });
    await context.close();

    for (const mode of ["denied", "malformed"])
    {
        const isolated = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
        await isolated.addInitScript((storageMode) =>
        {
            if (storageMode === "denied")
            {
                Object.defineProperty(Storage.prototype,"getItem",{ value() { throw new DOMException("Denied","SecurityError"); } });
                Object.defineProperty(Storage.prototype,"setItem",{ value() { throw new DOMException("Denied","SecurityError"); } });
            }
            else localStorage.setItem("fableframe-community-v1",'{"version":1,"watched":[null],"queue":[],"ratings":{},"reviews":[{}],"draft":{},"votes":[],"changes":[]}');
        },mode);
        const isolatedPage = await isolated.newPage();
        monitor(isolatedPage,mode);
        await check(`Storage ${mode}: useful homepage, rating and navigation remain functional`, async () =>
        {
            await go(isolatedPage,"#/film");
            await isolatedPage.locator(".film-actions .rating-input").getByRole("radio", { name: "5 out of 5", exact: true }).click();
            assert.match(await isolatedPage.locator(".distribution").innerText(),/Your rating is included/);
            await isolatedPage.locator(".film-actions").getByRole("button", { name: /^Want to watch:/ }).click();
            assert.equal(await isolatedPage.locator(".film-actions .rating-input").getByRole("radio", { name: "5 out of 5", exact: true }).getAttribute("aria-checked"),"false");
            await noOverflow(isolatedPage,`storage ${mode} interactions`);
        });
        await isolated.close();
    }

    assert.deepEqual(errors,[]);
    results.push({ name: "Zero browser, console, request, resource HTTP or external-service errors", passed: true });
    results.push({ name: "Repository static validation and target public subpath", passed: true, digest });
}
catch (error)
{
    failure = error;
    results.push({ name: "Interrupted assertion", passed: false, error: error.stack });
    console.error(error);
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    resourcesClosed = true;
    const screenshots = {};
    for (const name of ["desktop","mobile"])
    {
        try
        {
            const bytes = await readFile(path.join(checks,`${name}.png`));
            screenshots[name] = { path: path.join(checks,`${name}.png`), bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
        }
        catch {}
    }
    await WorkspaceFiles.saveJson(path.join(checks,"qa.json"),
    {
        prompt: job.prompt, modelId: job.modelId, timestamp: new Date().toISOString(),
        passed: !failure && errors.length === 0, url, viewports, assertions: results, errors,
        screenshots, visualReviewed: false, resourcesClosed, buildsRun: false, deploymentsRun: false
    });
}
if (failure) process.exitCode = 1;
