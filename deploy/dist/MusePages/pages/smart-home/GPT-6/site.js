const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
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
let timer;
function runScene()
{
    clearInterval(timer);
    const rooms = [...document.querySelectorAll("[data-room]")];
    const order = ["Hall", "Kitchen", "Dining", "Living", "Landing", "Bathroom"];
    const status = document.querySelector("#scene-status");
    rooms.forEach((room) => room.style.fillOpacity = ".03");
    let index = 0;
    const next = () =>
    {
        const name = order[index++];
        rooms.find((room) => room.dataset.room === name).style.fillOpacity = ".25";
        status.textContent = `${name} / evening scene`;
        if (index === order.length)
        {
            clearInterval(timer);
            status.textContent = "Evening scene complete.";
        }
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        rooms.forEach((room) => room.style.fillOpacity = ".25");
        status.textContent = "Evening scene complete.";
    }
    else
    {
        next();
        timer = setInterval(next, 500);
    }
}
document.querySelector("#replay").addEventListener("click", runScene);
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        runScene();
        observer.disconnect();
    }
}, { threshold: .35 });
observer.observe(document.querySelector(".plan-panel"));
