import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Orbit — Welcome back",
    tags: ["SaaS Authentication", "Accessible Form States", "Violet Orbital Design"],
    mocks: "Local login/signup/reset, social provider explanations and illustrative brand story; no stored credentials or sessions.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-view="signup"]').click();
        check(await page.locator("#fullname").isVisible(), "Mobile signup");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile signup fits");
        await page.screenshot({ path: "out/pages/220-saas-login-signup-pages/GPT-6/.checks/signup-mobile.png", fullPage: true });
    }
}, async (page, check) =>
{
    await page.locator("#submit").click();
    check(await page.locator('[aria-invalid="true"]').count() === 2, "Required login fields");
    await page.locator("#email").fill("bad-email");
    await page.locator("#password").fill("Demo-password-9!");
    await page.locator('[data-toggle="password"]').click();
    check(await page.locator("#password").getAttribute("type") === "text", "Reveal password");
    await page.locator("#submit").click();
    check((await page.locator("#email-error").textContent()).includes("valid"), "Email validation");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#remember").check();
    await page.locator("#submit").click();
    check(await page.locator("#submit").isDisabled(), "Loading state");
    await page.waitForFunction(() => !document.querySelector("#success").hidden);
    check((await page.locator("#success").textContent()).includes("Remember me"), "Login honest remembered option");
    check(await page.locator("#password").inputValue() === "", "Password cleared");
    check(await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0), "No credential storage");
    await page.locator('[data-view="signup"]').click();
    check(page.url().includes("view=signup"), "Stable signup URL");
    await page.locator("#fullname").fill("Alex Morgan");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#password").fill("short");
    check((await page.locator("#strength-label").textContent()).includes("Weak") || (await page.locator("#strength-label").textContent()).includes("12"), "Weak strength feedback");
    await page.locator("#confirm").fill("different");
    await page.locator("#submit").click();
    check((await page.locator("#confirm-error").textContent()).includes("match"), "Confirmation mismatch");
    check((await page.locator("#terms-error").textContent()).includes("agree"), "Terms required");
    await page.locator("#password").fill("Sample-Orbit-2026!");
    await page.locator("#confirm").fill("Sample-Orbit-2026!");
    check((await page.locator("#strength-label").textContent()).includes("Strong"), "Strong password feedback");
    await page.locator("#terms").check();
    await page.locator("#submit").click();
    await page.waitForFunction(() => !document.querySelector("#success").hidden);
    check((await page.locator("#success").textContent()).includes("No account was created"), "Honest signup success");
    check(await page.locator("#confirm").inputValue() === "", "Confirmation cleared");
    await page.screenshot({ path: "out/pages/220-saas-login-signup-pages/GPT-6/.checks/signup-desktop.png", fullPage: true });
    await page.locator('[data-view="login"]').click();
    await page.locator('[data-view="reset"]').click();
    check(await page.locator("#social").isHidden(), "Reset only email");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#submit").click();
    await page.waitForFunction(() => !document.querySelector("#success").hidden);
    check((await page.locator("#success").textContent()).includes("No email was sent"), "Honest reset result");
    await page.locator('[data-view="login"]').click();
    await page.locator('[data-provider="Google"]').click();
    check((await page.locator("#dialog-copy").textContent()).includes("does not open OAuth"), "Social flow honest");
    await page.locator("#dialog-action").click();
    await page.locator('footer [data-policy="Privacy Policy"]').click();
    check((await page.locator("#dialog-copy").textContent()).includes("transmitted or stored"), "Privacy detail");
});
