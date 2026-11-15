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
addEventListener("scroll", () => document.querySelector("header").classList.toggle("scrolled", scrollY > 80), { passive: true });
document.querySelector("#reservation-notes").addEventListener("click", () => document.querySelector("#reservation").showModal());
document.querySelector("#close").addEventListener("click", () => document.querySelector("#reservation").close());
document.querySelector("#sitting").addEventListener("change", (event) =>
{
    document.querySelector("#sitting-status").textContent = event.target.value ? `${event.target.value} sitting selected for review. Arrive before the first piece. No availability checked and no reservation made.` : "Choose a time to review arrival notes. No availability is checked.";
});
