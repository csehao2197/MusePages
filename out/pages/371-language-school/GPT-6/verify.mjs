import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("371-language-school", async (page, check, width) =>
    {
        check(await page.locator(".language-card").count() === 7 && await page.locator(".course").count() === 3, `${width}: complete language and format scope`);
        await page.locator("[data-language='German']").click();
        check(await page.locator("#teacher-empty").isVisible() && await page.locator("#level option").count() === 5, `${width}: German levels and tutor empty state`);
        check(await page.locator("#course-list [data-format='Group']").isDisabled(), `${width}: ineligible group disabled`);
        await page.locator("#format").selectOption("Group");
        await page.locator("#trial-form .button").click();
        check((await page.locator("#trial-result").textContent()).includes("Group unavailable"), `${width}: form also enforces format eligibility`);
        await page.locator("[data-language='Spanish']").click();
        await page.locator("#level").selectOption("C1");
        check(await page.locator("#course-list [data-format='Group']").isDisabled(), `${width}: group level ceiling`);
        await page.locator("#level").selectOption("A2");
        check(!await page.locator("#course-list [data-format='Group']").isDisabled(), `${width}: eligible group restored`);
        await page.locator("#self-check").click();
        await page.locator("#check-form .button").click();
        check((await page.locator("#check-result").textContent()).includes("Choose"), `${width}: unselected self-check error`);
        await page.locator("[name='confidence'][value='2']").check();
        await page.locator("#check-form .button").click();
        check((await page.locator("#check-result").textContent()).includes("not a CEFR assessment"), `${width}: self-check limit`);
        await page.locator("#use-level").click();
        check(await page.locator("#level").inputValue() === "B1", `${width}: self-check handoff`);
        await page.locator("[data-tutor='0']").click();
        check((await page.locator("#profile-copy").textContent()).includes("fictional"), `${width}: honest tutor detail`);
        await page.locator("#profile-choose").click();
        check((await page.locator("#trial-price").textContent()).includes("£15 for 45"), `${width}: individual trial price clarified`);
        await page.locator("#course-list [data-format='Group']").click();
        check((await page.locator("#trial-price").textContent()).includes("free first"), `${width}: free group trial distinction`);
        await page.locator("#trial-form .button").click();
        check((await page.locator("#trial-result").textContent()).includes("valid email"), `${width}: empty enrol form`);
        await page.locator("[name='name']").fill("Example Learner");
        await page.locator("[name='email']").fill("learner@example.test");
        await page.locator("#trial-form .button").click();
        check((await page.locator("#trial-result").textContent()).includes("Confirm"), `${width}: local-preview acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("[name='time']").selectOption("Weekends");
        await page.locator("#trial-form .button").click();
        check((await page.locator("#trial-result").textContent()).includes("Spanish / A1, Group") && (await page.locator("#trial-result").textContent()).includes("No request sent"), `${width}: selected local learning brief`);
        await page.locator("[data-plan='Monthly subscriber']").click();
        check(await page.locator("#format").inputValue() === "Individual" && (await page.locator("#trial-price").textContent()).includes("£99/month"), `${width}: subscriber forces correct format`);
        await page.locator("[data-language='Japanese']").click();
        check(await page.locator("#level option").count() === 2 && (await page.locator("#path-title").textContent()).includes("Beginner"), `${width}: non-CEFR course range`);
        await page.locator("[data-language='Arabic']").click();
        check(await page.locator("#level option").count() === 2 && await page.locator("#teacher-empty").isVisible(), `${width}: Arabic range and empty tutor directory`);
        await page.locator("[data-language='Italian']").click();
        await page.locator("[data-tutor='1']").click();
        await page.locator("#profile-choose").click();
        check(await page.locator("#language").inputValue() === "Italian", `${width}: bilingual tutor preserves selected Italian`);
        await page.locator("#plan").selectOption("Business brief");
        await page.locator("#format").selectOption("Group");
        check(await page.locator("#plan").inputValue() === "Trial exploration", `${width}: changed format clears incompatible business plan`);
        await page.locator(".faq summary").nth(2).click();
        check(await page.locator(".faq details").nth(2).getAttribute("open") !== null, `${width}: trial FAQ expands`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
