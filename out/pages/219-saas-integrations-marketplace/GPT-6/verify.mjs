import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "TaskFlow Connect — Integrations",
    tags: ["Integration Marketplace", "Local Connection Flow", "Deep Teal"],
    mocks: "Curated catalog with illustrative counts/reviews and localStorage-only installs; no third-party authorization.",
    mobile: async (page, check) =>
    {
        await page.locator('#apps [data-detail="figma"]').first().click();
        check(await page.locator("#detail").isVisible(), "Mobile details");
        check(await page.locator("#detail").evaluate((element) => element.scrollWidth <= element.clientWidth), "Mobile dialog fits");
        await page.screenshot({ path: "out/pages/219-saas-integrations-marketplace/GPT-6/.checks/detail-mobile.png", fullPage: true });
    }
}, async (page, check) =>
{
    check(await page.locator(".app-card").count() === 16, "Sixteen implemented apps");
    check(await page.locator(".featured-card").count() === 3, "Three featured apps");
    await page.locator('[data-category="Development"]').click();
    check(await page.locator(".app-card").count() === 3, "Development count");
    await page.locator("#premium").check();
    check(await page.locator(".app-card").count() === 1, "Combined category price filters");
    check((await page.locator(".app-title").textContent()).includes("Jira"), "Correct premium development app");
    await page.locator("#reset").click();
    await page.locator("#community").check();
    await page.locator("#free").check();
    check(await page.locator(".app-card").count() === 3, "Maintainer and free filters");
    await page.locator("#search").fill("notion");
    check(await page.locator(".app-card").count() === 1, "Search with filters");
    await page.locator("#search").fill("no-such-app");
    check(await page.locator("#empty").isVisible(), "Catalog empty state");
    await page.locator("#empty-reset").click();
    await page.locator("#sort").selectOption("newest");
    check((await page.locator(".app-title").first().textContent()).includes("Webhooks"), "Newest ordering");
    await page.locator('.featured-card[data-detail="slack"]').click();
    check((await page.locator(".detail-heading h2").textContent()) === "Slack", "Detailed app");
    check((await page.locator("#detail-content").textContent()).includes("Requested scopes"), "Permission requirements");
    await page.locator("#connect").click();
    check((await page.locator("#connect-status").textContent()).includes("acknowledge"), "Explicit consent gate");
    await page.locator("#consent").check();
    await page.locator("#connect").click();
    check((await page.locator("#connect-status").textContent()).includes("No real account"), "Honest installed result");
    await page.locator('#detail .close').click();
    check((await page.locator('#apps [data-detail="slack"]').last().textContent()).includes("Installed"), "Grid installed state");
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator('#apps [data-detail="slack"]').last().textContent()).includes("Installed"), "Local state persists");
    await page.locator('#apps [data-detail="slack"]').first().click();
    await page.locator("#connect").click();
    check((await page.locator("#connect-status").textContent()).includes("removed"), "Local disconnect");
    await page.locator("#detail .close").click();
    await page.locator("#request").click();
    await page.locator("#app-name").fill("Linear");
    await page.locator('#request-form input[type="email"]').fill("alex@example.com");
    await page.locator("#request-form textarea").fill("Sync project issues.");
    await page.locator('#request-form button').click();
    check((await page.locator("#request-status").textContent()).includes("Linear prepared locally"), "Named integration request");
    await page.locator("#request-dialog .close").click();
    await page.locator("#api").click();
    check((await page.locator("#detail-content").textContent()).includes("task.updated"), "Useful API quickstart");
});
