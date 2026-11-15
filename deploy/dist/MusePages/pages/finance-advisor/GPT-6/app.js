const menu = document.querySelector("#menu-button");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
    nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
}));
addEventListener("scroll", () => document.querySelector("header").classList.toggle("scrolled", scrollY > 60), { passive: true });
document.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("[name='topic']").value = button.dataset.topic;
    document.querySelector("#contact").scrollIntoView();
    document.querySelector("[name='name']").focus({ preventScroll: true });
}));
document.querySelector("#consultation").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector("#enquiry-result");
    if (form.elements.name.value.trim().length < 2 || !form.elements.email.validity.valid || !form.elements.email.value || form.elements.message.value.trim().length < 10)
    {
        result.textContent = "Please enter your name, a valid email and at least 10 characters about your question.";
        return;
    }
    if (!form.elements.consent.checked)
    {
        result.textContent = "Please acknowledge the local preview before continuing.";
        return;
    }
    result.textContent = `Enquiry preview ready for ${form.elements.topic.value}. Nothing has been sent; no appointment is booked.`;
});
document.querySelector("#calculator").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const monthly = Number(document.querySelector("#monthly").value);
    const years = Number(document.querySelector("#years").value);
    const result = document.querySelector("#calculation");
    if (document.querySelector("#monthly").value === "" || !Number.isFinite(monthly) || monthly < 0 || monthly > 100000 || !Number.isInteger(years) || years < 1 || years > 60)
    {
        result.textContent = "Enter £0 to £100,000 per month and 1 to 60 whole years.";
        return;
    }
    result.textContent = `${new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(monthly * 12 * years)} in total contributions over ${years} years. Growth not assumed.`;
});
const guides =
{
    retirement: ["How much do you really need to retire?", "Start with a spending budget rather than a universal target. Separate essential costs from discretionary spending. Gather pension statements and check when each income source can start. Allow for inflation, longevity and unexpected costs. A qualified adviser can help explore uncertainty; no calculator here predicts a retirement income."],
    advice: ["The case for independent financial advice", "Ask about authorisation, scope of advice, fees, conflicts and ongoing service. Check any firm's details independently on the relevant regulator's register. Understand the difference between general guidance and a recommendation tailored to you. This fictional site is neither a registered firm nor a source of personalised advice."],
    mistakes: ["Five common investment mistakes", "1. Investing without an accessible emergency reserve. 2. Concentrating everything in one asset. 3. Overlooking charges and tax implications. 4. Reacting to short-term headlines without considering your horizon. 5. Assuming past returns will repeat. These are discussion points, not a recommendation to buy or sell."]
};
document.querySelectorAll("[data-article]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, body] = guides[button.dataset.article];
    document.querySelector("#guide-title").textContent = title;
    document.querySelector("#guide-body").textContent = body;
    document.querySelector("dialog").showModal();
}));
document.querySelector(".close").addEventListener("click", () => document.querySelector("dialog").close());
