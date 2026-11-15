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
const dialog = document.querySelector("#urgent-dialog");
for (const id of ["emergency", "emergency-service"])
{
    document.getElementById(id).addEventListener("click", () => dialog.showModal());
}
document.querySelector("#close-urgent").addEventListener("click", () => dialog.close());
const service = document.querySelector("#service");
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    service.value = button.dataset.service;
    document.querySelector("#booking").scrollIntoView();
    service.focus({ preventScroll: true });
    document.querySelector("#form-status").hidden = true;
}));
const form = document.querySelector("#visit-form");
const status = document.querySelector("#form-status");
form.addEventListener("input", () => status.hidden = true);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (document.querySelector("#owner").value.trim().length < 2 || document.querySelector("#pet").value.trim().length < 1 || document.querySelector("#concern").value.trim().length < 10)
    {
        status.textContent = "Please enter your name, your pet's name and at least 10 non-space characters about your visit.";
        return;
    }
    status.textContent = `Visit note prepared for ${document.querySelector("#pet").value.trim()} (${document.querySelector("#animal").value}): ${service.value}. Nothing sent or booked. Contact your real vet to arrange care.`;
});
