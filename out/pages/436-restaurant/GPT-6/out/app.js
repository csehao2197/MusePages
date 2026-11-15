const menu = document.querySelector(".menu");
const nav = document.querySelector("header nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const dialog = document.querySelector("dialog");
const form = document.querySelector("#reservation-form");
const status = document.querySelector("#form-status");
const date = form.elements.date;
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
function openPlanner(context)
{
    form.reset();
    status.textContent = "";
    document.querySelector("#context").textContent = context;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    dialog.showModal();
}
document.querySelectorAll("[data-reserve]").forEach((button) => button.addEventListener("click", () => openPlanner("Reservation planner")));
document.querySelectorAll("[data-experience]").forEach((button) => button.addEventListener("click", () => openPlanner(`${button.dataset.experience} · enquiry planner`)));
document.querySelector(".close").addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const day = new Date(`${date.value}T12:00:00`).getDay();
    if (day === 0 || day === 1)
    {
        status.textContent = "The concept dining room is closed Sunday and Monday. Choose Tuesday–Saturday.";
        return;
    }
    status.textContent = `Local plan: ${form.elements.guests.value} guests on ${date.value} at ${form.elements.time.value}. This is not a confirmed booking. No information has been sent.`;
});
