const $ = (s) => document.querySelector(s);
let amount = 60;
let frequency = "Monthly";
const impacts = { 25: "a household water filter for one year", 60: "one week of river-quality monitoring", 150: "training a volunteer steward for a season", 400: "restoring 100 feet of eroded streambank" };
function update()
{
    const custom = $("#custom").value;
    const value = custom === "" ? amount : Number(custom);
    const valid = Number.isFinite(value) && value >= 1 && value <= 100000 && Math.abs(value * 100 - Math.round(value * 100)) < .00001;
    document.querySelectorAll("[data-amount]").forEach((button) => button.setAttribute("aria-pressed", String(custom === "" && Number(button.dataset.amount) === amount)));
    document.querySelectorAll("[data-frequency]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.frequency === frequency)));
    $("#translation").textContent = valid ? (impacts[value] ? `Illustrative $${value} cost example: ${impacts[value]}. These are not guaranteed outcomes.` : `Your custom $${value.toFixed(2)} ${frequency.toLowerCase()} plan supports the concept’s general work. No specific impact is assigned.`) : "Enter an amount from $1 to $100,000, with at most two decimal places.";
    $("#give-button").textContent = valid ? `Review $${value} ${frequency.toLowerCase()} plan` : "Review giving plan";
    $("#give-result").textContent = "";
    return valid ? value : null;
}
document.querySelectorAll("[data-amount]").forEach((button) => button.addEventListener("click", () =>
{
    amount = Number(button.dataset.amount);
    $("#custom").value = "";
    update();
}));
document.querySelectorAll("[data-frequency]").forEach((button) => button.addEventListener("click", () =>
{
    frequency = button.dataset.frequency;
    update();
}));
$("#custom").addEventListener("input", update);
$("#giving-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = update();
    $("#give-result").textContent = value === null ? "Choose a valid amount first." : `Local plan reviewed: $${value.toFixed(2)} ${frequency.toLowerCase()}. No donation, recurring charge or tax receipt created.`;
});
$("#giving-form").addEventListener("reset", () =>
{
    amount = 60;
    frequency = "Monthly";
    setTimeout(update, 0);
});
update();
document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () =>
{
    $("#route").value = button.dataset.route;
    $("#interest").scrollIntoView();
}));
$("#interest").addEventListener("submit", (event) =>
{
    event.preventDefault();
    $("#interest-result").textContent = !$("#time").value ? "Choose a time commitment to build your local plan." : `${$("#route").value}: ${$("#time").value}. Next step: discuss training, access and suitability with a verified coordinator. No signup sent or place reserved.`;
});
$("#interest").addEventListener("reset", () => $("#interest-result").textContent = "");
$("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = $("#email");
    $("#email-result").textContent = !input.value.trim() || !input.validity.valid ? "Enter a valid email address." : "Local confirmation only. No subscription created or email sent.";
});
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
}
$("#menu").addEventListener("click", () =>
{
    $("#menu").setAttribute("aria-expanded", String($("#nav").classList.toggle("open")));
});
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
