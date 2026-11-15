const projects =
[
    ["Ridgeline Logistics Center", "Industrial", "2025", "142,000 sq ft · 14 months · $38M", "Self-performed concrete and steel delivery for a regional logistics facility."],
    ["Cherry Creek Medical Pavilion", "Commercial", "2025", "88,000 sq ft · 19 months · $54M", "Coordinated building systems and clinical-space fit-out."],
    ["The Foundry Lofts", "Multifamily", "2024", "214 units · 22 months · $61M", "Multifamily delivery with a phased occupancy strategy."],
    ["Front Range Technical College — Trades Building", "Institutional", "2024", "64,000 sq ft · 16 months · $29M", "A purpose-built teaching environment for the next generation of trades."],
    ["Baxter Cold Storage Expansion", "Industrial", "2023", "96,000 sq ft · 11 months · $31M", "Specialist cold-chain expansion alongside continuing operations."],
    ["Union Station Office Retrofit", "Commercial", "2023", "120,000 sq ft · 15 months · $42M", "Occupied-space modernisation in the heart of Denver."]
];
let sector = "All";
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const filtered = projects.filter((project) => (sector === "All" || project[1] === sector) && project[0].toLowerCase().includes(query));
    const grid = document.querySelector("#project-grid");
    grid.replaceChildren();
    for (const project of filtered)
    {
        const [name, type, year, metrics, description] = project;
        const button = document.createElement("button");
        button.className = "project";
        const art = document.createElement("img");
        art.src = "building.svg";
        art.alt = "Original schematic architectural project study";
        const content = document.createElement("div");
        const label = document.createElement("span");
        label.textContent = `${type.toUpperCase()} / ${year}`;
        const title = document.createElement("h3");
        title.textContent = name;
        const facts = document.createElement("small");
        facts.textContent = `${metrics} · View study ↗`;
        content.append(label, title, facts);
        button.append(art, content);
        button.addEventListener("click", () =>
        {
            document.querySelector("#project-title").textContent = name;
            document.querySelector("#project-sector").textContent = `${type} / ${year}`;
            document.querySelector("#project-metrics").textContent = metrics;
            document.querySelector("#project-description").textContent = `${description} Illustrative case study from the creative brief; not independently verified.`;
            document.querySelector("#sector").value = type;
            document.querySelector("#project-dialog").showModal();
        });
        grid.append(button);
    }
    document.querySelector("#project-count").textContent = filtered.length ? `${filtered.length} selected project${filtered.length === 1 ? "" : "s"}` : "No matching projects. Change the sector or search.";
}
document.querySelectorAll("[data-sector]").forEach((button) => button.addEventListener("click", () =>
{
    sector = button.dataset.sector;
    document.querySelectorAll("[data-sector]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render();
}));
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#close").addEventListener("click", () => document.querySelector("#project-dialog").close());
document.querySelector("#similar").addEventListener("click", () => document.querySelector("#project-dialog").close());
document.querySelector("#bid-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email");
    const scope = document.querySelector("#scope").value.trim();
    const budget = document.querySelector("#budget").value;
    const status = document.querySelector("#bid-status");
    if (!email.value || !email.validity.valid)
    {
        status.textContent = "Enter a valid work email.";
        return;
    }
    if (scope.length < 20)
    {
        status.textContent = "Add at least 20 characters describing scope and location.";
        return;
    }
    if (!budget)
    {
        status.textContent = "Select a target budget range, or choose to be determined.";
        return;
    }
    status.textContent = `${document.querySelector("#sector").value} enquiry prepared locally. Budget: ${budget}. Scope: ${scope}. Nothing sent or uploaded; call the office to discuss drawings and availability.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
render();
