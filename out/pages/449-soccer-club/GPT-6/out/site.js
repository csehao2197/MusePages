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
document.querySelector("#team-filter").addEventListener("change", (event) =>
{
    const team = event.target.value;
    for (const [list, empty] of [["fixture-list", "fixtures-empty"], ["result-list", "results-empty"]])
    {
        let visible = 0;
        document.querySelectorAll(`#${list} article`).forEach((row) =>
        {
            row.hidden = team !== "all" && row.dataset.match !== team;
            if (!row.hidden) visible++;
        });
        document.getElementById(empty).hidden = visible !== 0;
    }
    document.querySelector("#filter-status").textContent = team === "all" ? "Showing all teams." : `Showing ${team}.`;
});
document.querySelectorAll("[data-team]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#interest-team").value = button.dataset.team;
        document.querySelector("#interest-status").textContent = `${button.dataset.team} selected. Preview your interest below; no registration is created.`;
        document.querySelector("#join").scrollIntoView();
    });
});
document.querySelector("#interest").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#interest-status").textContent = `Interest draft for ${document.querySelector("#interest-team").value}. Nothing sent or reserved. Contact the club to confirm dates and fees.`;
});
