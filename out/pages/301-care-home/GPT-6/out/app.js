const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
document.querySelector("#room-filter").addEventListener("change", (event) =>
{
    let count = 0;
    document.querySelectorAll("[data-room]").forEach((room) =>
    {
        room.hidden = event.target.value !== "all" && room.dataset.room !== event.target.value;
        if (!room.hidden) count++;
    });
    document.querySelector("#room-count").textContent = `${count} room type${count === 1 ? "" : "s"} shown`;
    const topic = event.target.selectedOptions[0].textContent;
    document.querySelector("#room-email").href = `mailto:hello@wrenburyhouse.co.uk?subject=${encodeURIComponent(`Room enquiry: ${topic}`)}`;
});
function daylight()
{
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bounds = document.querySelector("#day").getBoundingClientRect();
    const progress = reduced ? .5 : Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    const phase = progress < .33 ? 0 : progress > .67 ? 2 : 1;
    document.querySelector(".window").style.backgroundColor = ["#c2d6d9", "#e5cfa5", "#c08b58"][phase];
    document.querySelector("#time").textContent = ["07:00 / MORNING LIGHT", "13:00 / AFTERNOON LIGHT", "19:00 / EVENING LIGHT"][phase];
}
addEventListener("scroll", daylight, { passive: true });
daylight();
