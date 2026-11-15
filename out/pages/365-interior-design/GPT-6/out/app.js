const projects =
[
    ["The Chelsea House", "London", "Residential", "art.svg", "A warm charcoal palette and sculptural seating make an intimate room for the evening.", ["Charcoal velvet", "Honed stone", "Patinated brass"]],
    ["Palazzo Bianco", "Milan", "Residential", "dining.svg", "Oak joinery frames a stone table. Generous circulation balances the weight of the materials.", ["Pale oak", "Travertine", "Linen"]],
    ["Rue du Temple", "Paris", "Residential", "art.svg", "An exploration of quiet tonal layers, softened light and carefully composed proportions.", ["Wool", "Warm plaster", "Bronze"]],
    ["The Carlow Kitchen", "Dublin", "Residential", "dining.svg", "Dark joinery and a tactile central island form a gathering place, not just a working kitchen.", ["Smoked oak", "Limestone", "Brass"]],
    ["Hotel Solaire", "Lisbon", "Hospitality", "art.svg", "An imagined lobby conceived as a living room: low light, honest materials and a welcoming scale.", ["Stone", "Velvet", "Walnut"]],
    ["The Dover Gallery", "London", "Commercial", "dining.svg", "A restrained setting for objects and conversation, with architectural shelving and flexible gathering space.", ["Oak", "Mineral paint", "Steel"]]
];
let filter = "All";
let current = 0;
function render()
{
    const query = document.querySelector("#search").value.toLowerCase();
    const visible = projects.map((project, id) => ({ project, id })).filter(({ project: p }) => (filter === "All" || p[2] === filter) && p.slice(0, 3).join(" ").toLowerCase().includes(query));
    document.querySelector("#project-grid").innerHTML = visible.map(({ project: p, id }) => `<button class="project" data-project="${id}"><span class="image"><img src="${p[3]}" alt="Original architectural illustration for ${p[0]}" style="filter:${id === 2 ? "sepia(.2) brightness(1.2)" : id === 4 ? "brightness(.85)" : "none"}"></span><small>${p[1].toUpperCase()} / ${p[2].toUpperCase()}</small><strong>${p[0]} ↗</strong></button>`).join("");
    document.querySelector("#empty").hidden = visible.length > 0;
}
function showProject(id)
{
    current = (id + projects.length) % projects.length;
    const p = projects[current];
    document.querySelector("#gallery-image").src = p[3];
    document.querySelector("#gallery-image").alt = `Illustrated concept: ${p[0]}`;
    document.querySelector("#gallery-title").textContent = p[0];
    document.querySelector("#gallery-meta").textContent = `${p[1]} / ${p[2]} / CONCEPT STUDY`;
    document.querySelector("#gallery-copy").textContent = p[4];
    document.querySelector("#materials").innerHTML = p[5].map((name) => `<span>${name}</span>`).join("");
    document.querySelector("#gallery-count").textContent = `${current + 1} / ${projects.length}`;
    if (!document.querySelector("#gallery").open) document.querySelector("#gallery").showModal();
}
document.addEventListener("click", (event) =>
{
    const project = event.target.closest("[data-project]");
    if (project) showProject(Number(project.dataset.project));
    const button = event.target.closest("[data-filter]");
    if (button)
    {
        filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
        render();
    }
});
document.querySelector("#search").oninput = render;
document.querySelector("#previous").onclick = () => showProject(current - 1);
document.querySelector("#next").onclick = () => showProject(current + 1);
document.querySelector("#close").onclick = () => document.querySelector("#gallery").close();
document.querySelector("#plan").onclick = () =>
{
    document.querySelector("[name='type']").value = projects[current][2];
    document.querySelector("[name='message']").value = `Inspired by ${projects[current][0]}. `;
    document.querySelector("#gallery").close();
    document.querySelector("#contact").scrollIntoView();
};
document.querySelector("#menu").onclick = (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
};
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
document.querySelector("#enquiry").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    document.querySelector("#result").textContent = !f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) || f.message.value.trim().length < 10 ? "Enter your name, a valid email and at least 10 characters about your project." : `${f.type.value} brief prepared for ${f.name.value.trim()}, budget ${f.budget.value}. Nothing sent; no consultation booked.`;
};
render();
