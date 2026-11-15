
const $ = (s) => document.querySelector(s);
$("#menu").onclick = () =>
{
    const open = $("#navigation").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
};
document.querySelectorAll("nav a").forEach((a) => a.onclick = () =>
{
    $("#navigation").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
document.querySelectorAll("[data-book]").forEach((b) => b.onclick = () =>
{
    $("#booking-result").textContent = "";
    $("#booking").showModal();
});
$(".close").onclick = () => $("#booking").close();
$("#booking-form").onsubmit = (e) =>
{
    e.preventDefault();
    const form = new FormData(e.target);
    $("#booking-result").textContent = "Preview ready for " + form.get("name") + ": " + form.get("service") + ". Nothing has been sent or booked.";
};

const projects = [["Courtyard House","Residential","London","2025"],["Northbank Works","Commercial","Manchester","2024"],["Above the City","Residential","London","2025"],["The Quiet Pavilion","Cultural","Kent","2023"],["A Place to Gather","Interiors","Surrey","2024"],["Folded Light","Interiors","London","2026"]];
document.querySelectorAll("[data-filter]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-filter]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    let count = 0;
    document.querySelectorAll(".project").forEach((p) =>
    {
        p.hidden = b.dataset.filter !== "All" && p.dataset.category !== b.dataset.filter;
        if (!p.hidden) count++;
    });
    $("#project-count").textContent = "( " + count + " concept projects )";
});
document.querySelectorAll("[data-project]").forEach((b) => b.onclick = () =>
{
    const p = projects[Number(b.dataset.project)];
    $("#project-title").textContent = p[0];
    $("#project-meta").textContent = p[1] + " / " + p[2] + " / " + p[3];
    $("#project-image").replaceChildren(b.querySelector("svg").cloneNode(true));
    $("#project-description").textContent = "An original illustrative " + p[1].toLowerCase() + " study exploring spatial rhythm, material restraint and natural light. A concept, not a completed building or client commission.";
    $("#project-dialog").showModal();
});
$("#project-close").onclick = () => $("#project-dialog").close();
