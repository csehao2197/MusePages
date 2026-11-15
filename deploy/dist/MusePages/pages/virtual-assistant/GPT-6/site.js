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
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
const cells = [];
document.querySelectorAll(".hours").forEach((column) =>
{
    for (let hour = 0; hour < 10; hour++)
    {
        const cell = document.createElement("span");
        cell.className = "hour";
        column.append(cell);
        cells.push(cell);
    }
});
const counter = document.querySelector("#hours-count");
const observer = new IntersectionObserver((entries) =>
{
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    cells.slice(0, 11).forEach((cell, index) =>
    {
        setTimeout(() =>
        {
            cell.classList.add("filled");
            counter.textContent = String(index + 1);
        }, reduced ? 0 : index * 60);
    });
}, { threshold: .2 });
observer.observe(document.querySelector("#week"));
const dialog = document.querySelector("#call-dialog");
document.querySelectorAll(".call").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
document.querySelector("#privacy").addEventListener("click", () => document.querySelector("#privacy-dialog").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const form = document.querySelector("#call-form");
const status = document.querySelector("#call-status");
form.addEventListener("input", () => status.hidden = true);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (document.querySelector("#name").value.trim().length < 2 || document.querySelector("#task").value.trim().length < 15)
    {
        status.textContent = "Please add your name and at least 15 non-space characters about your work.";
        return;
    }
    status.textContent = `Introduction prepared for ${document.querySelector("#name").value.trim()}. Nothing sent and no call booked. Your details remain in this page only.`;
});
