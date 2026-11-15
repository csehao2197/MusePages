import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

const next = async (page) =>
{
    const before = await page.locator("#step-count").textContent();
    await page.locator("#continue").click();
    await page.waitForFunction((text) => document.querySelector("#step-count").textContent !== text, before);
};
await verify(import.meta.url,
{
    title: "TaskFlow — A thoughtful start",
    tags: ["SaaS Onboarding", "Seven-Step Setup", "Calm Sage"],
    mocks: "Single-object local onboarding, sample plans and unsent invites; static adaptation without Next.js runtime.",
    mobile: async (page, check) =>
    {
        await page.locator("#workspace").fill("Mobile studio");
        await next(page);
        check((await page.locator("#step-count").textContent()).includes("2 OF 7"), "Mobile step progression");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile checklist fits");
    }
}, async (page, check) =>
{
    await page.locator("#continue").click();
    check((await page.locator("#error").textContent()).includes("two characters"), "Workspace required");
    await page.locator("#workspace").fill("Studio North");
    await page.locator("#new-account").check();
    await page.locator("#continue").click();
    check((await page.locator("#error").textContent()).includes("valid work email"), "Account validation");
    await page.locator("#name").fill("Alex Morgan");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#password").fill("Sample-Onboard-2026!");
    await page.locator("#terms").check();
    await next(page);
    check(await page.locator(".checklist-row.done").count() === 1, "Activation checklist");
    check(!(await page.evaluate(() => sessionStorage.getItem("taskflow-onboarding"))).includes("Sample-Onboard"), "Password excluded from state");
    await next(page);
    check((await page.locator("#tour").textContent()).includes("Dashboard"), "Tour dashboard");
    await page.locator("#tour-next").click();
    check((await page.locator("#tour").textContent()).includes("Projects"), "Tour next");
    await page.locator("#tour-back").click();
    check(await page.locator("#tour-back").isDisabled(), "Tour first boundary");
    for (let index = 0; index < 5; index++) await page.locator("#tour-next").click();
    check(await page.locator("#tour-next").isDisabled(), "Tour final boundary");
    await page.locator("#restart-tour").click();
    check((await page.locator("#tour-count").textContent()) === "1 / 6", "Tour restart");
    await page.locator("#skip").click();
    await page.locator("#bulk").fill("bad-address");
    await page.locator("#add-bulk").click();
    check((await page.locator("#error").textContent()).includes("invalid"), "Bulk invalid email");
    await page.locator("#bulk").fill("jamie@example.com, alex@example.com; JAMIE@example.com");
    await page.locator("#add-bulk").click();
    check(await page.locator(".invite-row").count() === 2, "Bulk deduplicates");
    await page.locator(".invite-row select").first().selectOption("Admin");
    await next(page);
    await page.locator("#continue").click();
    check((await page.locator("#error").textContent()).includes("Name your project"), "Project validation");
    await page.locator("#project").fill("Winter launch");
    await page.locator('[data-template="2"]').click();
    check((await page.locator("#template-preview").textContent()).includes("Build landing page"), "Real template preview");
    await next(page);
    await page.locator("#theme").selectOption("Dark");
    check(await page.locator("body").getAttribute("class") === "dark", "Dark theme applies");
    await page.locator("#email-tips").check();
    await page.locator("#theme").selectOption("Light");
    await next(page);
    await page.locator('[data-plan="team"]').click();
    check((await page.locator("#billing-summary").textContent()).includes("$36"), "Seat-based plan calculation");
    await page.screenshot({ path: "out/pages/221-saas-onboarding-flow/GPT-6/.checks/billing-desktop.png", fullPage: true });
    await next(page);
    check((await page.locator(".completion-summary").textContent()).includes("Winter launch"), "Completion project summary");
    check((await page.locator(".completion-summary").textContent()).includes("2 local invitations"), "Unsent invite summary");
    await page.locator("#watch-video").click();
    check((await page.locator("#dialog-copy").textContent()).includes("text walkthrough"), "Honest video alternative");
    await page.locator("#dialog-action").click();
    await next(page);
    check((await page.locator(".dashboard-empty").textContent()).includes("Define positioning"), "Template tasks reach dashboard");
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator("#step-count").textContent()).includes("WORKSPACE"), "Progress persists across refresh");
    await page.locator("#restart").click();
    await page.locator("#dialog-action").click();
    check((await page.locator("#step-count").textContent()).includes("1 OF 7"), "Restart resets current tab");
});
