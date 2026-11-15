import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "TaskFlow — Make Room for Great Work",
    tags: ["Project Management", "Interactive Kanban", "Indigo SaaS"],
    assets: ["inter.ttf", "LICENSE-Inter.txt", "person-a.jpg", "person-b.jpg", "person-c.jpg"],
    mocks: "Local task/workspace preview; illustrative teams, logos, testimonials, plans and enterprise features.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-view="List"]').click();
        check(await page.locator(".task-list .task").count() === 6, "Mobile list view");
    }
}, async (page, check) =>
{
    check(await page.locator(".task").count() === 6, "Six initial tasks");
    await page.locator('[data-advance="0"]').click();
    check(await page.locator(".column").nth(1).locator(".task").count() === 3, "Task moves to progress");
    await page.locator('[data-advance="0"]').click();
    check((await page.locator("#task-progress").textContent()).startsWith("3 of 6"), "Completion updates");
    await page.locator("#add-task").click();
    await page.locator("#task-name").fill("Ship the preview");
    await page.locator("#task-form button").click();
    check(await page.locator(".task").count() === 7, "Add task");
    check((await page.locator("#task-progress").textContent()).includes("of 7"), "Task denominator");
    await page.locator('[data-view="List"]').click();
    check(await page.locator(".task-list .task").count() === 7, "List preserves tasks");
    await page.locator('[data-view="Calendar"]').click();
    check(await page.locator("[data-calendar-task]").count() === 7, "Calendar preserves tasks");
    await page.locator("#annual").click();
    check(await page.locator("#pro-price").textContent() === "$9.60", "Yearly discount");
    check((await page.locator("#billing-note").textContent()).includes("$115.20"), "Annual total");
    await page.locator("#monthly").click();
    check(await page.locator("#pro-price").textContent() === "$12", "Monthly restored");
    await page.locator("#watch-demo").click();
    await page.locator("#demo-next").click();
    check((await page.locator("#demo-title").textContent()).startsWith("02"), "Demo advances");
    await page.locator("#demo-next").click();
    await page.locator("#demo-next").click();
    check(!await page.locator("#demo").isVisible(), "Demo completes");
    await page.locator("#faq summary").first().click();
    check(await page.locator("#faq details").first().getAttribute("open") !== null, "FAQ expands");
    await page.locator("#start-email").fill("alex@example.com");
    await page.locator("#get-started button").click();
    check(await page.locator("#trial-email").inputValue() === "alex@example.com", "Email passed to trial");
    await page.locator("#workspace").fill("Bright ideas");
    await page.locator("#trial-form button").click();
    check((await page.locator("#trial-result").textContent()).includes("No account"), "Honest workspace result");
    await page.locator("#trial .close").click();
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator("#workspace-name").textContent()).includes("Bright ideas"), "Workspace persists");
});
