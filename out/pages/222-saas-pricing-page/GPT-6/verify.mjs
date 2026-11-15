import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Forma — Simple, Transparent Pricing",
    tags: ["SaaS Pricing", "Seat Cost Calculator", "Warm Gold Editorial"],
    mocks: "Illustrative subscription policies, local plan preview and unsent enterprise request; no checkout.",
    mobile: async (page, check) =>
    {
        await page.locator("#annual").click();
        check(await page.locator("#pro-price").textContent() === "12", "Mobile annual toggle");
        check(await page.locator(".table-wrap").evaluate((element) => element.scrollWidth > element.clientWidth), "Mobile table deliberately scrolls");
        await page.locator('[data-plan="Pro"]').last().click();
        check(await page.locator("dialog").evaluate((element) => element.scrollWidth <= element.clientWidth), "Mobile checkout fits");
    }
}, async (page, check) =>
{
    check(await page.locator(".plan").count() === 3, "Three plans");
    check(await page.locator("#pro-price").textContent() === "15", "Monthly rate");
    check(await page.locator("#total").textContent() === "$75", "Five-seat monthly total");
    await page.locator("#annual").click();
    check(await page.locator("#annual").getAttribute("aria-checked") === "true", "Annual switch semantics");
    check(await page.locator("#pro-price").textContent() === "12", "Annual 20 percent rate");
    check(await page.locator("#total").textContent() === "$60", "Annual monthly-equivalent total");
    check((await page.locator("#annual-total").textContent()).includes("$720 billed yearly · save $180"), "Annual total and savings");
    await page.locator("#seats").fill("20");
    check(await page.locator("#total").textContent() === "$240", "Maximum seats total");
    check((await page.locator("#annual-total").textContent()).includes("$2,880"), "Twenty-seat annual total");
    await page.locator('[data-plan="Pro"]').last().click();
    check((await page.locator("#checkout-summary").textContent()).includes("20 seats · Annual"), "Checkout current configuration");
    await page.locator('#checkout input[type="email"]').fill("alex@example.com");
    await page.locator('#checkout input[type="checkbox"]').check();
    await page.locator("#checkout button").click();
    check((await page.locator("#checkout-status").textContent()).includes("No account"), "Honest Pro preview");
    await page.locator(".close").click();
    await page.locator('[data-plan="Free"]').click();
    check((await page.locator("#checkout-summary").textContent()).includes("1 user"), "Free fixed seat limit");
    await page.locator(".close").click();
    check(await page.locator(".feature-row").count() === 17, "Complete feature comparison");
    await page.locator("#differences").check();
    check(await page.locator(".feature-row").count() === 12, "Differences excludes equal rows");
    await page.locator("#differences").uncheck();
    await page.locator("summary").first().click();
    check(await page.locator("details").first().getAttribute("open") !== null, "FAQ expands");
    await page.locator("#enterprise-plan").click();
    check(await page.locator("#sales-name").evaluate((element) => element === document.activeElement), "Enterprise CTA focuses form");
    await page.locator("#sales-name").fill("Alex Morgan");
    await page.locator('#sales-form input[type="email"]').fill("alex@example.com");
    await page.locator('#sales-form input[placeholder="Your team’s name"]').fill("Studio North");
    await page.locator("#sales-form button").click();
    check((await page.locator("#sales-status").textContent()).includes("no meeting was booked"), "Honest enterprise request");
    await page.locator("#annual").click();
    await page.locator("#seats").fill("1");
    check(await page.locator("#total").textContent() === "$15", "Monthly one-seat boundary");
});
