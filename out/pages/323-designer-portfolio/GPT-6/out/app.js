const projects = [
    { name: "Orbit", type: "product", label: "Finance, with a little breathing room", color: "#403253", block: "#9371b6", mark: "↗", problem: "Complex finance dashboards overwhelm the people who need a quick overview.", approach: "Prioritise the account balance, upcoming activity and one useful next step. Group advanced reporting separately.", outcome: "An original dashboard concept with a clear information hierarchy. No claimed client metrics or production deployment." },
    { name: "Morrow", type: "web", label: "A quieter corner of the internet", color: "#34433b", block: "#719080", mark: "m", problem: "A concept architecture practice needs its work to lead the conversation.", approach: "Use generous photography spaces, restrained navigation and short project narratives.", outcome: "A self-initiated editorial website direction; imagery is represented by original interface studies." },
    { name: "Forma", type: "system", label: "Consistency without the constraints", color: "#372f48", block: "#8b74a3", mark: "F", problem: "Growing products need consistent patterns without freezing their visual language.", approach: "Establish tokens, accessible interaction states and a component naming structure.", outcome: "A demonstrative design-system exploration, not a downloadable production library." },
    { name: "Stride", type: "product", label: "Make the next move easier", color: "#474034", block: "#b1966a", mark: "S", problem: "Habit trackers can make a missed day feel like a failure.", approach: "Focus on the next action, flexible goals and non-punitive progress feedback.", outcome: "An original mobile product concept. No user research or health results are asserted." },
    { name: "Index", type: "web", label: "A home for independent ideas", color: "#303e4d", block: "#7896b3", mark: "i", problem: "Independent publications need a simple path from exploration to reading.", approach: "Create a readable editorial grid with clear topics and a calm reading experience.", outcome: "A fictional publication website study, with no associated publisher." }
];
let filter = "all";
function render()
{
    const shown = projects.filter((item) => filter === "all" || item.type === filter);
    document.querySelector("#projects").innerHTML = shown.map((item) => `<article class="project"><button data-project="${projects.indexOf(item)}" aria-label="View ${item.name} case study"><div class="project-visual" style="--tint:${item.color};--block:${item.block}"><div class="mock-ui"><b>${item.name.toUpperCase()}.</b><div class="ui-tabs">Overview &nbsp; / &nbsp; Explore &nbsp; / &nbsp; Your space</div><div class="ui-content"><div>${item.mark}</div><div></div></div></div></div><div class="project-caption"><div><h3>${item.name} — ${item.label}</h3><small>${item.type.toUpperCase()} DESIGN / CONCEPT STUDY</small></div><span>↗</span></div></button></article>`).join("");
    document.querySelector("#project-count").textContent = `${shown.length} concept ${shown.length === 1 ? "project" : "projects"} shown`;
}
render();
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render();
}));
const dialog = document.querySelector("#case-dialog");
document.querySelector("#projects").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-project]");
    if (!button) return;
    const project = projects[Number(button.dataset.project)];
    document.querySelector("#case-title").textContent = project.name;
    document.querySelector("#case-category").textContent = `${project.type.toUpperCase()} / SELF-INITIATED CONCEPT`;
    document.querySelector("#case-summary").textContent = project.label;
    document.querySelector("#case-study").innerHTML = `<h3>The question</h3><p>${project.problem}</p><h3>The approach</h3><p>${project.approach}</p><h3>The output</h3><p>${project.outcome}</p>`;
    dialog.showModal();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#case-contact").addEventListener("click", () =>
{
    document.querySelector("#message").value = `I'd like to discuss a project inspired by ${document.querySelector("#case-title").textContent}.`;
    dialog.close();
});
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#service").value = button.dataset.service;
    document.querySelector("#status").textContent = "";
    document.querySelector("#contact").scrollIntoView();
}));
document.querySelector("#brief").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const service = document.querySelector("#service").value;
    const message = document.querySelector("#message").value.trim();
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add your name and a valid email address.";
        return;
    }
    if (!service || message.length < 20)
    {
        status.textContent = "Choose a service and describe your project in at least 20 characters.";
        return;
    }
    status.textContent = `${name}, your ${service} brief is ready to review: ${message} Nothing sent or saved.`;
});
document.querySelectorAll("form input, form select, form textarea").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#cv").addEventListener("click", () =>
{
    const text = "Paul Smith — fictional product designer concept\nOriginal portfolio: Orbit, Morrow, Forma, Stride, Index.\nServices: UI/UX, Framer, design systems.\nThis sample profile is not a verified employment CV. No career history or credentials asserted.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "paul-smith-concept-profile.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#cv-status").textContent = "Sample concept profile downloaded; not a verified employment CV.";
});
document.addEventListener("pointermove", (event) =>
{
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glow = document.querySelector("#cursor-glow");
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
});
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
