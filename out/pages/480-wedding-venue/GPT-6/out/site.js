const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const dialog = document.querySelector("#scene-dialog");
document.querySelectorAll("[data-scene]").forEach((button) => button.addEventListener("click", () =>
{
    dialog.querySelector("img").src = `art.svg#${button.dataset.scene}`;
    dialog.querySelector("img").alt = button.querySelector("img").alt;
    document.querySelector("#scene-caption").textContent = button.dataset.caption;
    dialog.showModal();
}));
document.querySelector("#close-scene").addEventListener("click", () => dialog.close());
document.querySelector("#brochure").addEventListener("click", () =>
{
    const text = "ASHFORD MANOR | ILLUSTRATIVE ESTATE BROCHURE\nFictional estate, Great Wishford, Wiltshire.\nGreat Hall: up to 250 guests.\nWalled Garden: up to 150 guests.\nOrangery: up to 80 guests.\n40 acres, 18 bedrooms, up to 38 overnight guests.\nMidweek from GBP 4,500. Weekend from GBP 7,500. Full Weekend from GBP 14,000.\nAll capacities, licensing, rates and terms are unverified concept details. No dates held, bookings accepted or payment taken. Catering and final scope require a real venue quote.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ashford-manor-brochure.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const form = document.querySelector("#enquiry-form");
const status = document.querySelector("#enquiry-status");
const setting = document.querySelector("#setting");
const guests = document.querySelector("#guests");
const capacities = { "The Great Hall": 250, "The Walled Garden": 150, "The Orangery": 80 };
const packageSelect = document.querySelector("#package");
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    packageSelect.value = button.dataset.package;
    status.hidden = true;
    document.querySelector("#enquire").scrollIntoView();
    packageSelect.focus({ preventScroll: true });
}));
function updateCapacity()
{
    const limit = capacities[setting.value];
    document.querySelector("#capacity-note").textContent = `${setting.value} accommodates up to ${limit} guests in this concept.${Number(guests.value) > limit ? " Your party exceeds this setting's sample capacity; choose a larger space." : ""}`;
}
setting.addEventListener("change", updateCapacity);
guests.addEventListener("input", updateCapacity);
const date = document.querySelector("#date");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
form.addEventListener("input", () => status.hidden = true);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (Number(guests.value) > capacities[setting.value])
    {
        status.textContent = "Your guest count exceeds the selected setting's sample capacity. Choose a larger space or reduce the guest count.";
        return;
    }
    if (document.querySelector("#names").value.trim().length < 2 || document.querySelector("#message").value.trim().length < 15)
    {
        status.textContent = "Add your names and at least 15 non-space characters about your plans.";
        return;
    }
    status.textContent = `${packageSelect.value} enquiry prepared for ${guests.value} guests in ${setting.value} on ${date.value}. Nothing sent. No availability checked, date held or booking confirmed.`;
});
