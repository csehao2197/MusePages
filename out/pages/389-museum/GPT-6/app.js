const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}
menu.addEventListener("click", () =>
{
    nav.classList.add("open");
    menu.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    document.querySelector("#close-menu").focus();
});
document.querySelector("#close-menu").addEventListener("click", () =>
{
    closeMenu();
    menu.focus();
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (nav.classList.contains("open") && event.key === "Escape")
    {
        closeMenu();
        menu.focus();
    }
    if (nav.classList.contains("open") && event.key === "Tab")
    {
        const nodes = [...nav.querySelectorAll("button, a")];
        if (event.shiftKey && document.activeElement === nodes[0])
        {
            event.preventDefault();
            nodes.at(-1).focus();
        }
        else if (!event.shiftKey && document.activeElement === nodes.at(-1))
        {
            event.preventDefault();
            nodes[0].focus();
        }
    }
});
const objects = [
    ["Ship’s figurehead, painted oak", "c.1860 / RM.1972.14", "Painted oak and a face made to meet the water. In this fictional catalogue, a ship’s figurehead opens a conversation about craft, trade and the people behind a vessel."],
    ["Brewery enamel sign", "1928 / RM.1988.203", "Bold lettering designed for a busy street. An imagined brewery sign connects graphic design to the working life of the quay."],
    ["Rope-maker’s twisting hook", "c.1890 / RM.1965.41", "A small tool in a much larger industry. This illustrated catalogue entry explores the skilled hands behind ropes used along the river."],
    ["Bentwood café chair", "1904 / RM.2019.7", "Lightweight, repeatable and made for everyday life. This imagined chair tells a story about manufacturing and the places where people meet."]
];
const events = [
    ["Family trail: Find the Figurehead", "ARCHIVE EXAMPLE / SAT 19 SEP / 11:00 / FREE", "An example family discovery trail. No live event, places or registration. For a real family visit, check ages, accessibility and supervision requirements with the venue."],
    ["Late: Chairs After Dark", "ARCHIVE EXAMPLE / WED 23 SEP / 18:30 / £15", "An example evening programme about design. This archived listing is not available to book."],
    ["Curator’s tour of Made on the River", "ARCHIVE EXAMPLE / SAT 26 SEP / 14:00 / FREE", "An example guided look at river industries. No actual curator, tour or capacity is represented."],
    ["Talk: The Brewers of Quay Street", "ARCHIVE EXAMPLE / THU 1 OCT / 19:00 / £8", "An example local-history talk about work and community on the quay. No tickets are sold."],
    ["Relaxed opening for sensory needs", "ARCHIVE EXAMPLE / SUN 4 OCT / 10:30 / FREE", "An example relaxed opening concept. Access provisions must be confirmed directly with a real venue; this demo cannot guarantee facilities."]
];
const dialog = document.querySelector("#detail");
function showDetail(data)
{
    document.querySelector("#detail-title").textContent = data[0];
    document.querySelector("#detail-label").textContent = data[1];
    document.querySelector("#detail-copy").textContent = data[2];
    dialog.showModal();
}
document.querySelectorAll("[data-object]").forEach((button) => button.addEventListener("click", () => showDetail(objects[Number(button.dataset.object)])));
document.querySelectorAll("[data-event]").forEach((button) => button.addEventListener("click", () => showDetail(events[Number(button.dataset.event)])));
document.querySelector("#close-detail").addEventListener("click", () => dialog.close());
