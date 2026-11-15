const range = document.querySelector("#reveal");
range.addEventListener("input", () =>
{
    document.querySelector("#before").style.clipPath = `inset(0 ${100 - Number(range.value)}% 0 0)`;
    document.querySelector("#reveal-value").value = `${range.value}%`;
});
const copy =
[
    "Open the pool, remove and clean the cover, reset the chemistry and restart the equipment.",
    "Weekly visits, attention to changing sanitiser demand, and a filter check every month. A professional sets the appropriate service plan.",
    "Leaf season. Baskets fill fast, so the proposed route stays weekly even as it cools.",
    "A reduced schedule or full winterising, depending on local conditions, equipment and whether you swim year-round."
];
const tabs = [...document.querySelectorAll("[role=tab]")];
function select(index)
{
    tabs.forEach((tab, position) =>
    {
        tab.setAttribute("aria-selected", String(position === index));
        tab.tabIndex = position === index ? 0 : -1;
    });
    document.querySelector("#season-copy").textContent = copy[index];
    document.querySelector("#season-copy").setAttribute("aria-labelledby", tabs[index].id);
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
        select(next);
        tabs[next].focus();
    });
});
