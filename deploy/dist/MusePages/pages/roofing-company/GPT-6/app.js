const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const dialog = document.querySelector("dialog");
const form = document.querySelector("#quote-form");
const status = document.querySelector("#quote-status");
function openQuote(service, material)
{
    form.reset();
    status.textContent = "";
    if (service) form.elements.service.value = service;
    if (material) form.elements.material.value = material;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    dialog.showModal();
}
document.querySelectorAll("[data-quote]").forEach((button) => button.addEventListener("click", () => openQuote()));
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => openQuote(button.dataset.service)));
document.querySelectorAll("[data-material]").forEach((button) => button.addEventListener("click", () => openQuote(undefined, button.dataset.material)));
document.querySelector(".close").addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const postcode = form.elements.postcode.value.trim().toUpperCase();
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(postcode))
    {
        status.textContent = "Enter a full UK postcode, for example SW19 1AA.";
        return;
    }
    if (!/^(SW|SE|NW|N|E|W|EC|WC|SM|KT|GU|CR|BR|DA|ME|TN|CT|BN|RH|SS|CM|CO|AL|WD|EN|HP|SG)\d/.test(postcode))
    {
        status.textContent = "This postcode is outside our sample coverage map. Confirm coverage with a real contractor; nothing has been sent.";
        return;
    }
    if (form.elements.notes.value.trim().length < 10)
    {
        status.textContent = "Add at least 10 visible characters describing the project.";
        return;
    }
    status.textContent = `Local brief: ${form.elements.service.value}; ${form.elements.material.value}; ${postcode}. Coverage is indicative. No survey is booked and no request has been sent.`;
});
document.querySelector("#emergency-help").addEventListener("click", () =>
{
    document.querySelector("#emergency-note").hidden = false;
});
