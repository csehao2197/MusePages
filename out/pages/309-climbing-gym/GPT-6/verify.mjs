import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("309-climbing-gym", async (page, check, width) =>
    {
        check(await page.locator(".hold").count() === 14, `${width}: fourteen route holds`);
        check(await page.locator(".hold.on").count() === 7, `${width}: reduced motion seven lit holds`);
        check(await page.locator(".hold:not(.on)").count() === 7, `${width}: other problem remains outlined`);
        await page.locator("[data-grade='3']").click();
        check((await page.locator("#grade-copy").textContent()).includes("more than one"), `${width}: orange grade information`);
        check(await page.locator("[data-grade='3']").getAttribute("aria-pressed") === "true", `${width}: active grade`);
        await page.locator("[data-course='Youth club']").click();
        check(decodeURIComponent(await page.locator("#course-email").getAttribute("href")).includes("Youth club"), `${width}: contextual coaching enquiry`);
        check((await page.locator("#course-status").textContent()).includes("No place held"), `${width}: honest course state`);
        await page.locator("#adults").fill("2");
        await page.locator("#young").fill("1");
        check(await page.locator("#total").textContent() === "£48", `${width}: first session group price`);
        check(!await page.locator("#shoes-label").isVisible(), `${width}: first session shoe hire included`);
        await page.locator("#type").selectOption("return");
        await page.locator("#shoes").fill("2");
        check(await page.locator("#total").textContent() === "£43", `${width}: returning adults minors and shoes`);
        await page.locator("#shoes").fill("4");
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("cannot exceed"), `${width}: excess shoe hire`);
        await page.locator("#shoes").fill("0");
        await page.locator("#adults").fill("0");
        await page.locator("#under14").check();
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("adult must accompany"), `${width}: under14 adult requirement`);
        await page.locator("#young").fill("0");
        check(await page.locator("#total").textContent() === "Check group size", `${width}: empty group state`);
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("1–12"), `${width}: empty group rejected`);
        await page.locator("#adults").fill("1");
        await page.locator("#young").fill("1");
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: date required`);
        await page.locator("#date").fill("2027-02-06");
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: plan acknowledgement`);
        await page.locator("#accept").check();
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("09:00–20:00"), `${width}: weekend hours`);
        check((await page.locator("#status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest visit plan`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#plan button").click();
        check((await page.locator("#status").textContent()).includes("07:00–22:00"), `${width}: weekday hours`);
        await page.locator("#visit summary").click();
        check((await page.locator("#visit details").textContent()).includes("water"), `${width}: first-visit practical information`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "climbing mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
