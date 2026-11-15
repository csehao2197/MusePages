const work = [
    { name: "Aura Finance", category: "brand", label: "Brand Identity + Web / Fintech / 2025", headline: "FINANCE.<br>WITH FEELING.", question: "How do you make a finance brand feel more human?", answer: "A confident wordmark, unexpected soft green and an interface language that makes the complicated feel approachable.", color: "#c1e6b1", ink: "#183825" },
    { name: "Construct", category: "web", label: "Architecture Website / Property / 2025", headline: "SPACE<br>TO THINK.", question: "How can architecture speak for itself online?", answer: "An editorial structure that gives projects space, with concise navigation and a restrained typographic hierarchy.", color: "#ddd4c5", ink: "#272420" },
    { name: "Zeno Health", category: "product", label: "Product UI + Motion / Health Tech / 2024", headline: "A CLEARER<br>NEXT STEP.", question: "How can a product guide without overwhelming?", answer: "Progressive information, deliberate states and restrained motion. This interface concept makes no clinical or health-outcome claims.", color: "#594186", ink: "#f7f0ff" },
    { name: "Meridian", category: "brand", label: "E-commerce Brand / Retail / 2024", headline: "EVERYDAY.<br>EXTRAORDINARY.", question: "How do everyday objects earn a distinct identity?", answer: "A modular brand system with expressive type, tactile colour and a storefront focused on considered choices.", color: "#c18563", ink: "#2b1912" }
];
let activeWork = 0;
function render(filter = "all")
{
    document.querySelector("#projects").innerHTML = work.filter((project) => filter === "all" || project.category === filter).map((project) => `<button class="project-row" data-project="${work.indexOf(project)}"><b>${String(work.indexOf(project) + 1).padStart(2, "0")}</b><h3>${project.name}</h3><small>${project.label}</small><span>↗</span></button>`).join("");
}
render();
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render(button.dataset.filter);
}));
const services = [
    ["Brand Identity", "Strategy, naming, visual identity and a usable set of guidelines.", "✳"],
    ["Web Design & Dev", "Conversion-aware experiences, from structure to responsive build.", "↗"],
    ["Motion & Animation", "Brand motion, meaningful UI feedback and moving stories.", "◉"],
    ["UI/UX Design", "Product flows, prototypes and purposeful interface systems.", "⊞"],
    ["Content & Copy", "A recognisable voice, clear web copy and coherent campaigns.", "≋"],
    ["Digital Strategy", "Positioning, audience understanding and a practical roadmap.", "⌁"]
];
document.querySelector("#service-list").innerHTML = services.map((service, index) => `<label class="service"><input type="checkbox" value="${index}" aria-label="Select ${service[0]}"><span aria-hidden="true">${service[2]}</span><h3>${service[0]}</h3><p>${service[1]}</p></label>`).join("");
function selection()
{
    return [...document.querySelectorAll(".service input:checked")].map((input) => services[Number(input.value)][0]);
}
document.querySelector("#service-list").addEventListener("change", () =>
{
    const selected = selection();
    document.querySelector("#service-status").textContent = selected.length ? `${selected.length} selected: ${selected.join(" + ")}` : "No disciplines selected yet.";
    document.querySelector("#brief-services").textContent = selected.length ? selected.join(" / ") : "Choose from services above.";
    document.querySelector("#status").textContent = "";
});
const dialog = document.querySelector("#case-dialog");
document.querySelector("#projects").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-project]");
    if (!button) return;
    activeWork = Number(button.dataset.project);
    const project = work[activeWork];
    document.querySelector("#case-title").textContent = project.name;
    document.querySelector("#case-category").textContent = project.label;
    document.querySelector("#case-art").innerHTML = project.headline;
    document.querySelector("#case-art").style.background = project.color;
    document.querySelector("#case-art").style.color = project.ink;
    document.querySelector("#case-content").innerHTML = `<h3>${project.question}</h3><p>${project.answer}</p><p>Self-initiated concept. No commercial relationship, measured result or client endorsement is represented.</p>`;
    dialog.showModal();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#case-brief").addEventListener("click", () =>
{
    document.querySelector("#ambition").value = `A challenge inspired by the ${work[activeWork].name} concept: `;
    dialog.close();
});
document.querySelector("#brief-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!selection().length)
    {
        status.textContent = "Select at least one discipline from Services.";
        return;
    }
    const ambition = document.querySelector("#ambition").value.trim();
    if (ambition.length < 20 || !document.querySelector("#stage").value)
    {
        status.textContent = "Add at least 20 characters about your ambition and choose a project stage.";
        return;
    }
    status.textContent = `${name}: ${selection().join(" + ")}. ${ambition} Sample brief ready. Nothing submitted or saved.`;
});
document.querySelectorAll("form input, form select, form textarea").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
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
