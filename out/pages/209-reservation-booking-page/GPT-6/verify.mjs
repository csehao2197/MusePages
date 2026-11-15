import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Prime & Co — Reserve Your Experience",
    tags: ["Fine Dining Reservations", "Multi-step Booking", "Dark Gold"],
    assets: ["interior.jpg"],
    mocks: "Sample availability and local reservation/waitlist preview; no email, backend or deposit.",
    mobile: async (page, check) =>
    {
        await page.locator("[data-party='20']").click();
        check((await page.locator("#large-party").textContent()).includes("8+"), "Mobile large-party notice");
    }
}, async (page, check) =>
{
    check(await page.locator("[data-party]").count() === 20, "Twenty party options");
    await page.locator("#to-details").click();
    check((await page.locator("#party-error").textContent()).includes("choose"), "Required date/time");
    await page.locator("#calendar button:not([disabled])").first().click();
    check(await page.locator("#calendar .selected").count() === 1, "Calendar selection");
    await page.locator('[data-time="19:00"]').click();
    check((await page.locator("#time-status").textContent()).includes("fully booked"), "Full slot alternatives");
    check(await page.locator("#waitlist").isVisible(), "Waitlist offered");
    await page.locator("#waitlist").click();
    check((await page.locator("#time-status").textContent()).includes("Waitlist preview"), "Waitlist selection");
    await page.locator('[data-time="18:30"]').click();
    check((await page.locator("#time-status").textContent()).includes("Limited"), "Limited slot");
    await page.locator("[data-party='8']").click();
    await page.locator('[name="area"][value="Patio"]').check();
    await page.locator("#to-details").click();
    check((await page.locator("#party-error").textContent()).includes("up to 6"), "Area capacity");
    await page.locator('[name="area"][value="Private Room"]').check();
    await page.locator("#to-details").click();
    check(await page.locator("#step-2").isVisible(), "Step two");
    await page.locator("#name").fill("Alex <Guest>");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#phone").fill("+1 212 555 0188");
    await page.locator("#occasion").selectOption("Anniversary");
    await page.locator("#requests").fill("Gluten-free options, please.");
    await page.locator("#step-2 button[type='submit']").click();
    check(await page.locator("#step-3").isVisible(), "Review step");
    check((await page.locator("#review").textContent()).includes("Alex <Guest>"), "Escaped guest details");
    check(await page.locator("#review guest").count() === 0, "No user HTML interpreted");
    await page.locator("#confirm").click();
    check((await page.locator("#confirm-error").textContent()).includes("acknowledge"), "Policy acknowledgment");
    await page.locator("#policy").check();
    await page.locator("#confirm").click();
    check((await page.locator("#confirmation-number").textContent()).includes("PC-"), "Preview reference");
    check((await page.locator("#confirmation").textContent()).includes("no confirmation email"), "No false email claim");
    check((await page.locator("#google-calendar").getAttribute("href")).includes("America%2FNew_York"), "Calendar timezone");
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#apple-calendar").click();
    const download = await downloadEvent;
    check(download.suggestedFilename() === "prime-reservation-preview.ics", "Calendar file download");
    const stream = await download.createReadStream();
    let calendar = "";
    for await (const chunk of stream) calendar += chunk;
    check(/DTSTAMP:\d{8}T\d{6}Z/.test(calendar), "Valid ICS UTC timestamp");
    check(calendar.includes("DTSTART;TZID=America/New_York:"), "ICS appointment timezone");
    await page.locator("#modify").click();
    check(await page.locator("#step-1").isVisible(), "Modify booking");
    await page.locator("#to-details").click();
    check(await page.locator("#name").inputValue() === "Alex <Guest>", "Guest data retained on modify");
    await page.locator("#step-2 button[type='submit']").click();
    await page.locator("#policy").check();
    await page.locator("#confirm").click();
    await page.locator("#cancel").click();
    check((await page.locator("#cancel-status").textContent()).includes("cancelled"), "Cancel preview");
});
