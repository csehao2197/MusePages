const projects =
[
    ["The Prinsengracht Residence", "2024", "Residential", "art.svg"],
    ["Studio Zwart", "2023", "Commercial", "workspace.svg"],
    ["Villa Oud-Zuid", "2024", "Residential", "art.svg"],
    ["Café Marges", "2023", "Commercial", "workspace.svg"],
    ["The Jordaan Loft", "2024", "Residential", "art.svg"],
    ["Haarlemmerstraat Showroom", "2022", "Commercial", "workspace.svg"],
    ["The Canal House", "2024", "Residential", "art.svg"],
    ["Hotel Bereken", "2023", "Commercial", "workspace.svg"],
    ["Vondelpark Villa", "2023", "Residential", "art.svg"],
    ["Studio De Pijp", "2024", "Commercial", "workspace.svg"],
    ["The Stagings — Maasdam Street", "2024", "Staging", "art.svg"],
    ["The Herengracht Apartment", "2022", "Residential", "art.svg"]
];
let filter = "All";
let current = 0;
function render()
{
    const query = document.querySelector("#search").value.toLowerCase();
    const visible = projects.map((p, id) => ({ p, id })).filter(({ p }) => (filter === "All" || p[2] === filter) && p[0].toLowerCase().includes(query));
    document.querySelector("#masonry").innerHTML = visible.map(({ p, id }) => `<button class="project" data-project="${id}"><img src="${p[3]}" alt="Illustrated concept for ${p[0]}" style="height:${[290, 380, 330, 260][id % 4]}px;object-position:${[20, 50, 80][id % 3]}% center"><span class="caption"><strong>${p[0]} ↗</strong><small>${p[1]} / ${p[2]} / CONCEPT STUDY</small></span></button>`).join("");
    document.querySelector("#counter").textContent = `${String(visible.length).padStart(2, "0")} / 12 studies`;
    document.querySelector("#empty").hidden = visible.length > 0;
}
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-filter]");
    if (button)
    {
        filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
        render();
    }
    const card = event.target.closest("[data-project]");
    if (card)
    {
        current = Number(card.dataset.project);
        const p = projects[current];
        document.querySelector("#detail-image").src = p[3];
        document.querySelector("#detail-image").alt = `Original illustrated study: ${p[0]}`;
        document.querySelector("#detail-name").textContent = p[0];
        document.querySelector("#detail-meta").textContent = `${p[1]} / ${p[2]} / FICTIONAL STUDY`;
        document.querySelector("#detail-copy").textContent = p[2] === "Staging" ? "A warm, uncluttered composition that helps visitors imagine everyday life in the space. Styling is not a guarantee of sale or value." : p[2] === "Commercial" ? "A material-led workplace study balancing a welcoming atmosphere, practical surfaces and space to collaborate." : "An exploration of soft daylight, layered linen and tactile oak. Designed around conversation, calm and the rhythms of home.";
        document.querySelector("#project").showModal();
    }
    const service = event.target.closest("[data-service]");
    if (service)
    {
        document.querySelector("[name='type']").value = service.dataset.service;
        document.querySelector("#contact").scrollIntoView();
    }
});
document.querySelector("#search").oninput = render;
document.querySelector("#close").onclick = () => document.querySelector("#project").close();
document.querySelector("#inspired").onclick = () =>
{
    document.querySelector("[name='type']").value = projects[current][2];
    document.querySelector("[name='message']").value = `Inspired by ${projects[current][0]}. `;
    document.querySelector("#project").close();
    document.querySelector("#contact").scrollIntoView();
};
const materials =
[
    ["Warm linen", "#d9cbb4", "Tactile, relaxed and beautifully imperfect."],
    ["Terracotta", "#bb7658", "Earthy warmth, with natural variation and character."],
    ["European oak", "#b89a6f", "A quiet grain and a finish chosen to age gracefully."],
    ["Soft sage", "#939c7f", "A muted botanical tone that sits gently beside timber."]
];
document.querySelector("#swatches").innerHTML = materials.map(([name, color], id) => `<button aria-label="${name}" aria-pressed="${id === 0}" data-material="${id}" style="background:${color}"></button>`).join("");
document.querySelectorAll("[data-material]").forEach((button) => button.onclick = () =>
{
    const m = materials[Number(button.dataset.material)];
    document.querySelector("#material-name").textContent = m[0];
    document.querySelector("#material-copy").textContent = m[2];
    document.querySelectorAll("[data-material]").forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
});
let step = 0;
const track = document.querySelector("#track");
function updateStep()
{
    document.querySelector("#step-back").disabled = step === 0;
    document.querySelector("#step-next").disabled = step === 4;
    document.querySelector("#step-status").textContent = `Step ${step + 1} of 5`;
}
function go(direction)
{
    step = Math.max(0, Math.min(4, step + direction));
    const card = track.children[step];
    track.scrollTo({ left: Math.min(card.offsetLeft - track.children[0].offsetLeft, track.scrollWidth - track.clientWidth), behavior: "instant" });
    updateStep();
}
document.querySelector("#step-back").onclick = () => go(-1);
document.querySelector("#step-next").onclick = () => go(1);
document.querySelector("#menu").onclick = (event) => event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
document.querySelector("#enquiry").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    document.querySelector("#result").textContent = !f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) || f.message.value.trim().length < 10 ? "Enter your name, a valid email and a project description of at least 10 characters." : `${f.type.value} message prepared for ${f.name.value.trim()}. Nothing sent or reserved.`;
};
render();
updateStep();
