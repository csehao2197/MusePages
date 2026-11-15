const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
}));
const base = { terraced: 12, semi: 15, detached: 20, bungalow: 14, flat: 10 };
const property = document.querySelector("#property");
const conservatory = document.querySelector("#conservatory");
const rhythm = document.querySelector("#rhythm");
let beds = 3;
let prices = {};
function update()
{
    const single = base[property.value] + Math.max(0, beds - 2) * 3 + (conservatory.checked ? 6 : 0);
    prices = { single, four: Math.round(single * .85), eight: Math.round(single * .92) };
    document.querySelector("#bedrooms").textContent = beds;
    document.querySelector("#minus").disabled = beds === 1;
    document.querySelector("#plus").disabled = beds === 6;
    document.querySelector("#plan-price").textContent = prices.four;
    document.querySelector("#one-off").textContent = `£${single} as a one-off`;
    document.querySelector("#four-price").textContent = `£${prices.four}`;
    document.querySelector("#eight-price").textContent = `£${prices.eight}`;
    document.querySelector("#single-price").textContent = `£${single}`;
    const timing = { four: "four-weekly", eight: "eight-weekly", single: "one-off" }[rhythm.value];
    document.querySelector("#draft-summary").textContent = `${property.selectedOptions[0].textContent} · ${beds} bedroom${beds === 1 ? "" : "s"}${conservatory.checked ? " · conservatory roof" : ""} · £${prices[rhythm.value]} ${timing}`;
    document.querySelector("#clean-result").textContent = "Local preview only. Nothing is sent, scheduled or charged.";
}
document.querySelector("#minus").addEventListener("click", () =>
{
    beds = Math.max(1, beds - 1);
    update();
});
document.querySelector("#plus").addEventListener("click", () =>
{
    beds = Math.min(6, beds + 1);
    update();
});
[property, conservatory, rhythm].forEach((input) => input.addEventListener("change", update));
document.querySelectorAll("[data-plan]").forEach((link) => link.addEventListener("click", () =>
{
    rhythm.value = link.dataset.plan;
    update();
}));
document.querySelector("#comparison").addEventListener("input", (event) =>
{
    const value = Number(event.target.value);
    document.querySelector("#dirty-layer").style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    document.querySelector("#compare-line").style.left = `${value}%`;
    document.querySelector("#comparison-value").textContent = `${value}%`;
});
document.querySelector("#coverage-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = document.querySelector("#postcode").value.trim().toUpperCase();
    const result = document.querySelector("#coverage-result");
    if (!value)
    {
        result.textContent = "Enter a postcode to check the sample area.";
        return;
    }
    const match = /^(NR\d{1,2})(?:\s*\d[A-Z]{2})?$/.exec(value);
    if (!match)
    {
        result.textContent = "Use a Norwich postcode such as NR2 1AB, or an outward code such as NR2.";
        return;
    }
    const code = Number(match[1].slice(2));
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 18].includes(code))
    {
        result.textContent = `${match[1]} is outside the sample service area. A real route needs confirmation directly.`;
        return;
    }
    result.textContent = `${match[1]} is in the sample area: ${code <= 7 ? "Monday–Wednesday city round" : "Thursday–Friday village round"}. No live slot has been checked.`;
});
document.querySelector("#clean-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector("#clean-result");
    const name = document.querySelector("#name").value.trim();
    if (!form.checkValidity() || name.length < 2)
    {
        result.textContent = "Please enter your name and a valid email address.";
        return;
    }
    result.textContent = `${name}, your £${prices[rhythm.value]} cleaning plan is ready to review.${document.querySelector("#text-before").checked ? " Includes text-before-arrival preference." : ""} Nothing has been sent, booked or charged.`;
});
update();
