import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Forma — Workspace Overview",
    tags: ["Admin Dashboard", "Interactive Workspace", "Indigo Data Visualization"],
    assets: ["inter.ttf", "LICENSE-Inter.txt"],
    mocks: "Fictional snapshot metrics, team and project data; local section views and session-only edits.",
    mobile: async (page, check) =>
    {
        check(await page.locator(".sidebar").evaluate((element) => getComputedStyle(element).bottom === "0px"), "Mobile bottom nav");
        await page.locator('.nav-item[data-section="Tasks"]').click();
        await page.locator("[data-task='0']").check();
        check((await page.locator("#task-count").textContent()).startsWith("1 of 5"), "Mobile task workflow");
    }
}, async (page, check) =>
{
    check(await page.locator(".stats article").count() === 4, "Four stat cards");
    check(await page.locator(".activity-item").count() === 5, "Five activity entries");
    await page.locator("#period").selectOption("month");
    check(await page.locator("#chart-total").textContent() === "336", "Period chart updates");
    check((await page.locator("#hours").textContent()).includes("1,368"), "Period hours update");
    await page.locator("#period").selectOption("week");
    await page.locator('[data-sort="tasks"]').click();
    check((await page.locator("#workload-rows tr").first().textContent()).includes("Maya Ross"), "Workload ascending sort");
    await page.locator('[data-sort="tasks"]').click();
    check((await page.locator("#workload-rows tr").first().textContent()).includes("Sam Kim"), "Workload descending sort");
    await page.locator("#collapse").click();
    check(await page.locator("#collapse").getAttribute("aria-expanded") === "false", "Sidebar collapse");
    await page.locator("#collapse").click();
    await page.keyboard.press("Control+k");
    check(await page.locator("#global-search").evaluate((element) => element === document.activeElement), "Keyboard search focus");
    await page.locator("#global-search").fill("website");
    check((await page.locator("#search-results").textContent()).includes("Website redesign"), "Project search");
    await page.locator("#global-search").fill("noresultxyz");
    check((await page.locator("#search-results").textContent()).includes("No results"), "Search empty state");
    await page.keyboard.press("Escape");
    await page.locator("#notifications").click();
    await page.locator("#mark-read").click();
    check(await page.locator("#notification-dot").isHidden(), "Notifications marked read");
    await page.locator(".close").click();
    await page.locator("#new-project").click();
    await page.locator("#project-name").fill("Autumn campaign");
    await page.locator("#project-form button").click();
    check(await page.locator("#project-count").textContent() === "25", "New project counter");
    await page.locator(".close").click();
    await page.locator('.nav-item[data-section="Projects"]').click();
    check((await page.locator("#project-list").textContent()).includes("Autumn campaign"), "New project visible");
    await page.locator("#project-filter").selectOption("Completed");
    check(await page.locator("#project-list .card").count() === 1, "Project status filter");
    await page.locator('.nav-item[data-section="Tasks"]').click();
    await page.locator("[data-task='0']").check();
    check((await page.locator("#task-count").textContent()).startsWith("1 of 5"), "Task completion");
    await page.locator('.nav-item[data-section="Team"]').click();
    check(await page.locator("#team-rows tr").count() === 6, "Team view");
    await page.locator('.nav-item[data-section="Messages"]').click();
    await page.locator("#message").fill("Ready for review <team>");
    await page.locator("#message-form button").click();
    check((await page.locator("#messages").textContent()).includes("Ready for review <team>"), "Local message escaped and displayed");
    await page.locator('.nav-item[data-section="Calendar"]').click();
    await page.locator('.calendar-grid [data-project="0"]').click();
    check(await page.locator("#dialog-title").textContent() === "Website redesign", "Calendar project details");
    await page.locator(".close").click();
    await page.locator('.nav-item[data-section="Reports"]').click();
    const pending = page.waitForEvent("download");
    await page.locator("#download-report").click();
    const download = await pending;
    check(download.suggestedFilename() === "forma-workload.csv", "CSV export");
    const stream = await download.createReadStream();
    let csv = "";
    for await (const chunk of stream) csv += chunk;
    check(csv.includes('"Julia Lee","18","84"'), "CSV actual data");
    await page.locator('.nav-item[data-section="Settings"]').click();
    await page.locator("#display-name").fill("Morgan");
    await page.locator("#settings-form button").click();
    check((await page.locator("#settings-status").textContent()).includes("No account data"), "Local settings saved");
    await page.locator('.nav-item[data-section="Dashboard"]').click();
    check((await page.locator("#dashboard h1").textContent()).includes("Morgan"), "Name reflected in dashboard");
});
