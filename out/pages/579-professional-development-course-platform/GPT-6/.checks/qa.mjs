import assert from "node:assert/strict";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium, expect} from "@playwright/test";
import {WorkspaceFiles, StaticHomepage} from "../../../../../src/workflows/script/render-prompt-page.mjs";
import {startPreviewServer} from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const errors = [];
const assertions = [];
const viewports = [];
const result =
{
    passed: false,
    startedAt: new Date().toISOString(),
    assertions,
    errors,
    viewports,
    screenshots: {desktop: path.join(folder, ".checks", "desktop.png"), mobile: path.join(folder, ".checks", "mobile.png")},
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
const record = (name, evidence = true) => assertions.push({name, passed: true, evidence});
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth}));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: ${JSON.stringify(sizes)}`);
    record(`No horizontal overflow: ${label}`, sizes);
}
function monitor(page, label)
{
    page.on("pageerror", (error) => errors.push(`${label} page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            errors.push(`${label} console: ${message.text()}`);
        }
    });
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            errors.push(`${label} HTTP ${response.status()}: ${response.url()}`);
        }
    });
    page.on("requestfailed", (request) => errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
}
async function closeDialog(page)
{
    await page.keyboard.press("Escape");
    await expect(page.locator("#modal")).not.toBeVisible();
}
function dateAfter(days)
{
    const date = new Date();
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
try
{
    result.staticDigest = await StaticHomepage.validateStaticOutput(exported, "professional-development-course-platform", "GPT-6");
    record("Repository static output validation", result.staticDigest);
    server = await startPreviewServer(exported, {workspace});
    assert.match(server.url, /\/pages\/professional-development-course-platform\/GPT-6\/index\.html$/);
    result.url = server.url;
    browser = await chromium.launch({headless: true});
    const context = await browser.newContext({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    const page = await context.newPage();
    monitor(page, "desktop");
    const response = await page.goto(server.url, {waitUntil: "networkidle"});
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", {name: "Good to grow, Jamie."})).toBeVisible();
    assert.ok((await page.locator("body").innerText()).length > 1500);
    assert.equal(await page.locator(".course-card").count(), 3);
    await noOverflow(page, "desktop initial 1200x900");
    viewports.push({width: 1200, height: 900, deviceScaleFactor: 1});
    await page.screenshot({path: result.screenshots.desktop});
    await page.screenshot({path: path.join(folder, ".checks", "desktop-full.png"), fullPage: true});
    record("Successful HTTP and meaningful nonblank homepage at final subpath");

    await page.getByRole("button", {name: "Leadership", exact: true}).click();
    await expect(page.locator(".course-card")).toHaveCount(2);
    await page.getByRole("button", {name: "Search and filter courses"}).click();
    await page.locator("#level-filter").selectOption("Beginner");
    await expect(page.getByRole("heading", {name: /No courses found/})).toBeVisible();
    await page.locator(".filter-panel [data-action='clear-filters']").click();
    await page.locator("#coach-filter").selectOption("Maya Brooks");
    await expect(page.locator(".course-card")).toHaveCount(2);
    await page.locator(".filter-panel [data-action='clear-filters']").click();
    await page.keyboard.press("Tab");
    await page.locator("h1").click();
    await page.keyboard.press("/");
    await expect(page.locator("#course-search")).toBeFocused();
    await page.locator("#course-search").fill("habit");
    await expect(page.locator(".course-card")).toHaveCount(1);
    await expect(page.locator(".course-card h3")).toHaveText("Build habits that actually stick");
    await page.locator("#course-search").fill("nothing matches this");
    await expect(page.locator(".empty-state")).toBeVisible();
    await page.locator(".empty-state button").click();
    await expect(page.locator(".course-card")).toHaveCount(6);
    await noOverflow(page, "desktop filters and empty state");
    record("Topic, level, coach and keyboard search, empty state, combined filters and reset");

    await page.locator(".save-course").first().click();
    await expect(page.locator(".save-course").first()).toHaveAttribute("aria-pressed", "true");
    await page.locator("[data-course='intentional']").first().click();
    await expect(page.locator("#modal")).toBeVisible();
    await expect(page.locator("#modal")).toContainText("No payment");
    await page.locator("[data-enroll='intentional']").click();
    const correct = [1, 1, 2];
    for (let index = 0; index < 3; index++)
    {
        await expect(page.locator("#modal-kicker")).toContainText(`LESSON ${index + 1} OF 3`);
        await expect(page.locator(".lesson-text")).toBeVisible();
        await page.locator("#lesson-reflection").fill("I will create one clear project brief before Friday and ask for feedback.");
        if (index === 0)
        {
            await page.locator('input[name="answer"][value="0"]').check();
            await page.getByRole("button", {name: "Check & complete lesson"}).click();
            await expect(page.locator("#lesson-feedback")).toContainText("Not quite");
            const completed = await page.evaluate(() => JSON.parse(localStorage.getItem("stride-growth-v1")).completed);
            assert.deepEqual(completed, {});
        }
        await page.locator(`input[name="answer"][value="${correct[index]}"]`).check();
        await page.getByRole("button", {name: "Check & complete lesson"}).click();
        await expect(page.locator("#lesson-feedback")).toHaveClass(/success/);
        await page.locator("[data-next-lesson]").click();
    }
    await expect(page.locator("#modal-title")).toHaveText("Look how far you’ve come.");
    await expect(page.locator(".badge-tile")).toContainText("Course explorer");
    await page.getByRole("button", {name: "Review lessons", exact: true}).click();
    await expect(page.locator("#modal-kicker")).toContainText("REVIEW");
    await page.getByRole("button", {name: "Next lesson", exact: true}).click();
    await expect(page.locator("#modal-title")).toHaveText("Protect a focus block");
    await closeDialog(page);
    await expect(page.locator("#minutes-stat")).toHaveText("25 min");
    const weeklyEvidence = await page.evaluate(() =>
    {
        const todayIndex = (new Date().getDay() + 6) % 7;
        const days = [...document.querySelectorAll(".week-days > span")];
        return {today: days.findIndex((day) => day.classList.contains("today")), learned: days[todayIndex].classList.contains("learned")};
    });
    assert.equal(weeklyEvidence.today, (new Date().getDay() + 6) % 7);
    assert.equal(weeklyEvidence.learned, true);
    record("Actual completion timestamps drive current local week and correct current weekday", weeklyEvidence);
    await expect(page.locator("#badge-count")).toHaveText("2 badges earned");
    await page.reload({waitUntil: "networkidle"});
    await expect(page.locator("#badge-count")).toHaveText("2 badges earned");
    record("Actual sequential learning: reflection, wrong-answer rejection, three correct assessments, completion, review, metrics, badges and reload persistence");

    await page.getByRole("button", {name: "Set a new goal", exact: true}).click();
    await page.locator('#goal-form [name="title"]').fill("Lead a clear career conversation");
    await page.locator('#goal-form [name="due"]').fill(dateAfter(14));
    await page.locator('#goal-form [name="course"]').selectOption("career");
    await page.locator('#goal-form [name="steps"]').fill("one\ntwo\nthree\nfour\nfive\nsix");
    await page.getByRole("button", {name: "Create my plan"}).click();
    await expect(page.locator("#goal-feedback")).toContainText("1–5 milestones");
    await page.locator('#goal-form [name="steps"]').fill("Map a strength with evidence\nInterview a practitioner\nCreate a small portfolio artifact");
    await page.getByRole("button", {name: "Create my plan"}).click();
    await expect(page.locator("#modal-title")).toHaveText("Lead a clear career conversation");
    const check = page.locator("[data-milestone]").first();
    await check.focus();
    await page.keyboard.press("Space");
    await expect(check).toBeChecked();
    await expect(page.locator("#goal-status")).toContainText("1 of 3");
    await closeDialog(page);
    await expect(page.locator(".goal-item").last()).toContainText("1 of 3");
    await page.reload({waitUntil: "networkidle"});
    await expect(page.locator(".goal-item").last()).toContainText("1 of 3");
    record("Career goal linked to a course, milestone count validation, keyboard checklist and persistence");

    await page.locator(".goal-item").last().getByRole("button", {name: "Check in"}).click();
    await page.getByRole("button", {name: "Open related course"}).click();
    await expect(page.locator("#modal-title")).toHaveText("Navigate your next career chapter");
    await page.locator("[data-enroll='career']").click();
    for (const answer of [1, 2, 1])
    {
        await page.locator("#lesson-reflection").fill("I will map a demonstrated strength, interview a practitioner, and create one small work sample in the next 30 days.");
        await page.locator(`input[name="answer"][value="${answer}"]`).check();
        await page.getByRole("button", {name: "Check & complete lesson"}).click();
        await expect(page.locator("#lesson-feedback")).toHaveClass(/success/);
        await page.locator("[data-next-lesson]").click();
    }
    await expect(page.locator(".badge-tile")).toContainText("Navigate your next career chapter");
    await closeDialog(page);
    record("Career planning learning core: evidence-based strengths, low-risk career experiment and a 30-day plan, all three assessments completed through the linked goal");

    await page.getByRole("button", {name: "View Alex Morgan", exact: true}).click();
    await expect(page.locator("#modal")).toContainText("Qualifications are not verified");
    await page.locator('#booking-form [name="date"]').fill(dateAfter(2));
    await page.locator('#booking-form [name="time"]').selectOption("13:00");
    await page.locator('#booking-form [name="format"]').selectOption("In person · 30 minutes");
    await page.locator('#booking-form [name="focus"]').fill("Review a realistic leadership development plan");
    await page.getByRole("button", {name: "Save a demo request"}).click();
    await expect(page.locator(".session-item")).toContainText("In person");
    await expect(page.locator(".session-item")).toContainText("not confirmed");
    await page.locator("[data-cancel-session]").click();
    await expect(page.locator("#modal")).toContainText("No local requests yet");
    await closeDialog(page);
    record("Coach profile, future local date, in-person request, clear non-confirmation and cancellation");

    await page.getByRole("button", {name: "Your weekly reset", exact: false}).click();
    await page.locator('#reflection-form textarea').fill("Keep: writing a project brief. Release: optional meetings. Try: a calm morning focus block.");
    await page.getByRole("button", {name: "Save my reflection"}).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", {name: "Download blank worksheet"}).click();
    const downloaded = await downloadPromise;
    assert.equal(downloaded.suggestedFilename(), "stride-weekly-reset.txt");
    await page.getByRole("button", {name: "Save resource", exact: true}).click();
    await expect(page.locator("#saved-count")).toHaveText("1 saved");
    await closeDialog(page);
    await page.getByRole("button", {name: "Your weekly reset", exact: false}).click();
    await expect(page.locator('#reflection-form textarea')).toHaveValue(/Keep: writing/);
    await closeDialog(page);
    record("Meaningful worksheet reflection, saved resource, persistence and actual download");

    await page.getByRole("button", {name: "Step into the community"}).click();
    await page.locator('#community-form textarea').fill("I protected one short focus block and felt less rushed.");
    await page.getByRole("button", {name: "Post locally", exact: true}).click();
    await expect(page.locator(".community-post").last()).toContainText("less rushed");
    await page.locator('[data-action="event"]').click();
    await expect(page.locator('[data-action="event"]')).toContainText("Remove local RSVP");
    await closeDialog(page);
    record("Local community reply and illustrative workshop RSVP");

    await page.getByRole("button", {name: "Notifications", exact: true}).click();
    await page.getByRole("button", {name: "Manage preferences"}).click();
    await page.locator('[data-setting="releases"]').uncheck();
    await page.locator('[data-setting="reminders"]').uncheck();
    await closeDialog(page);
    await page.getByRole("button", {name: "Notifications", exact: true}).click();
    await expect(page.locator("#modal")).toContainText("All suggestions are turned off");
    await closeDialog(page);
    record("Notification preferences change actual local notification content");

    await page.getByRole("button", {name: "Coach studio"}).click();
    const creator = page.locator("#creator-form");
    await creator.locator('[name="title"]').fill("Planning a thoughtful team handoff");
    await creator.locator('[name="topic"]').selectOption("Leadership");
    await creator.locator('[name="level"]').selectOption("Beginner");
    await creator.locator('[name="outcome"]').fill("Create a clear handoff with an owner and a feedback checkpoint.");
    await creator.locator('[name="lessonTitle"]').fill("Name the next owner");
    await creator.locator('[name="text"]').fill("A useful handoff names the next owner, explains the current status, links the necessary material, and agrees on a feedback checkpoint. Ask the receiver to restate the next action so gaps become visible.");
    await creator.locator('[name="practice"]').fill("Write one handoff with its owner and next action.");
    await creator.locator('[name="question"]').fill("What makes a handoff clear?");
    await creator.locator('[name="correct"]').fill("An owner, context, next action, and a checkpoint");
    await creator.locator('[name="incorrect"]').fill("A vague deadline without an owner");
    await page.getByRole("button", {name: "Publish to this browser"}).click();
    await expect(page.locator(".course-card")).toHaveCount(7);
    await expect(page.locator(".course-card").last()).toContainText("Planning a thoughtful team handoff");
    await page.locator(".course-card").last().getByRole("button", {name: "View course"}).click();
    await page.locator("[data-enroll]").click();
    await expect(page.locator(".lesson-text")).toContainText("feedback checkpoint");
    await closeDialog(page);
    record("Coach studio publishes a real locally readable course without implying authentication or public publishing");

    await page.getByRole("button", {name: "Edit your profile", exact: true}).click();
    await page.locator('#profile-form [name="name"]').fill("Avery Reed");
    await page.locator('#profile-form [name="interest"]').selectOption("Leadership");
    await page.locator('#profile-form [name="style"]').selectOption("Reflective and supportive");
    await page.locator('#profile-form [name="target"]').selectOption("90");
    await page.getByRole("button", {name: "Save & explore my focus"}).click();
    await expect(page.locator("#greeting-name")).toHaveText("Avery");
    await expect(page.locator("#weekly-target-label")).toHaveText("of 90 min goal");
    await expect(page.locator(".course-card")).toHaveCount(3);
    await page.reload({waitUntil: "networkidle"});
    await expect(page.locator("#greeting-name")).toHaveText("Avery");
    await noOverflow(page, "desktop after all interactions");
    record("Profile, coaching preferences, weekly intention, local interest recommendation and persistence");

    const mobileContext = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce"});
    const mobile = await mobileContext.newPage();
    monitor(mobile, "mobile");
    await mobile.goto(server.url, {waitUntil: "networkidle"});
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile, "mobile initial 390x844");
    await mobile.screenshot({path: result.screenshots.mobile});
    viewports.push({width: 390, height: 844, deviceScaleFactor: 1, mobile: true, reducedMotion: true});
    await mobile.getByRole("button", {name: "Open navigation", exact: true}).click();
    await expect(mobile.locator("#sidebar")).toHaveClass(/open/);
    assert.equal(await mobile.locator("#sidebar").evaluate((element) => element.inert), false);
    await mobile.keyboard.press("Escape");
    await expect(mobile.getByRole("button", {name: "Open navigation", exact: true})).toBeFocused();
    assert.equal(await mobile.locator("#sidebar").evaluate((element) => element.inert), true);
    await mobile.getByRole("button", {name: "Open navigation", exact: true}).click();
    await mobile.locator("#sidebar").getByRole("link", {name: "Explore courses"}).click();
    await expect(mobile.locator("#sidebar")).not.toHaveClass(/open/);
    await mobile.getByRole("button", {name: "Mindfulness", exact: true}).click();
    await expect(mobile.locator(".course-card")).toHaveCount(1);
    await mobile.locator(".course-card").getByRole("button", {name: "View course"}).click();
    await mobile.locator("[data-enroll]").click();
    await mobile.locator("#lesson-reflection").fill("I notice a quiet room, the desk surface, and soft light.");
    await mobile.locator('input[name="answer"][value="1"]').check();
    await mobile.getByRole("button", {name: "Check & complete lesson"}).click();
    await expect(mobile.locator("#lesson-feedback")).toHaveClass(/success/);
    await noOverflow(mobile, "mobile active learning dialog");
    await mobile.keyboard.press("Tab");
    const focusInModal = await mobile.evaluate(() => document.querySelector("#modal").contains(document.activeElement));
    assert.equal(focusInModal, true);
    await closeDialog(mobile);
    await mobile.getByRole("button", {name: "Add a goal", exact: true}).click();
    await mobile.locator('#goal-form [name="title"]').fill("Add a one-minute pause");
    await mobile.locator('#goal-form [name="due"]').fill(dateAfter(7));
    await mobile.locator('#goal-form [name="steps"]').fill("Notice my surroundings after lunch");
    await mobile.getByRole("button", {name: "Create my plan"}).click();
    await mobile.locator("[data-milestone]").check();
    await closeDialog(mobile);
    await mobile.locator("summary").nth(1).click();
    await expect(mobile.locator("details").nth(1)).toHaveAttribute("open", "");
    await noOverflow(mobile, "mobile after learning, goals, FAQ and navigation");
    record("Mobile actual learning, goal milestone, native focus trap, touch navigation, Escape, reduced motion and FAQ");
    await mobile.locator("body").click({position: {x: 2, y: 2}});
    await mobile.evaluate(() => document.activeElement?.blur());
    await mobile.waitForTimeout(4600);
    await mobile.screenshot({path: path.join(folder, ".checks", "mobile-full.png"), fullPage: true});

    for (const width of [320, 768, 1920, 3840])
    {
        await page.setViewportSize({width, height: width === 320 ? 740 : 900});
        await page.locator("body").click({position: {x: 2, y: 2}});
        await noOverflow(page, `responsive ${width}px`);
        viewports.push({width, height: width === 320 ? 740 : 900});
    }
    assert.deepEqual(errors, []);
    record("No console, page, failed request or HTTP resource errors on desktop or mobile", []);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.locator("body").evaluate((body) => /[\u3400-\u9fff]/.test(body.innerText)), false);
    record("English-only rendered site");
    await context.close();
    await mobileContext.close();
    result.passed = true;
}
catch (error)
{
    result.failure = error.stack || String(error);
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (server)
    {
        await server.close();
    }
    result.resourcesClosed = true;
    result.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), result);
    console.log(JSON.stringify({passed: result.passed, assertions: assertions.length, errors, failure: result.failure, resourcesClosed: result.resourcesClosed}));
}
