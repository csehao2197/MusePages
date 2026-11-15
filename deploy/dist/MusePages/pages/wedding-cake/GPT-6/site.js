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
const cake = document.querySelector(".cake-drawing");
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        cake.classList.add("stacked");
        observer.disconnect();
    }
}, { threshold: .2 });
observer.observe(cake);
const dialog = document.querySelector("#cake-dialog");
document.querySelectorAll("[data-cake]").forEach((button) => button.addEventListener("click", () =>
{
    dialog.querySelector("img").src = `art.svg#${button.dataset.view}`;
    dialog.querySelector("img").alt = button.querySelector("img").alt;
    document.querySelector("#cake-caption").textContent = button.dataset.cake;
    dialog.showModal();
}));
document.querySelector("#close-cake").addEventListener("click", () => dialog.close());
