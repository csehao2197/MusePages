const projects = [
    { title: "Pulse / Analytics", tags: ["React", "Node.js", "PostgreSQL"], text: "A focused analytics workspace. Change the reporting window in a local data prototype.", visual: '<span class="number">12,840</span><span>sample page views / this week</span><div class="bars"><i style="--h:35%"></i><i style="--h:60%"></i><i style="--h:45%"></i><i style="--h:80%"></i><i style="--h:65%"></i><i style="--h:100%"></i></div>' },
    { title: "Fieldwork / Commerce", tags: ["Next.js", "TypeScript", "Prisma"], text: "An intentional storefront for everyday essentials. Try cart quantity and subtotal states.", visual: '<div class="product-lines"><span>Canvas daypack <b>$48</b></span><span>Field notebook <b>$12</b></span><span>Insulated bottle <b>$24</b></span></div>' },
    { title: "Relay / Collaboration", tags: ["React", "Redis", "Node.js"], text: "A shared project board concept. Move a task through its workflow in this single-browser prototype.", visual: '<div class="board"><div>Todo<i></i><i></i></div><div>Doing<i></i></div><div>Done<i></i><i></i></div></div>' }
];
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const shown = projects.filter((project) => `${project.title} ${project.tags.join(" ")}`.toLowerCase().includes(query));
    document.querySelector("#project-list").innerHTML = shown.map((project) => `<article class="project"><div><p class="eyebrow">${project.tags.join(" / ").toUpperCase()}</p><h3>${project.title}</h3><p>${project.text}</p><div class="chips">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><button data-project="${projects.indexOf(project)}">Run local demo ↗</button></div><div class="visual"><b>${project.title.toUpperCase()}</b>${project.visual}</div></article>`).join("");
    document.querySelector("#empty").hidden = shown.length > 0;
}
render();
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#reset-search").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    render();
});
const dialog = document.querySelector("#demo");
const content = document.querySelector("#demo-content");
function openDemo(index)
{
    document.querySelector("#demo-title").textContent = projects[index].title;
    if (index === 0)
    {
        content.innerHTML = '<p>Illustrative analytics dataset. Choose a reporting window.</p><label>Reporting window<select id="period"><option value="week">This week</option><option value="month">This month</option></select></label><p class="demo-metric" id="metric">12,840</p><p id="metric-label">Sample page views / 7 days</p>';
        document.querySelector("#period").addEventListener("change", (event) =>
        {
            const month = event.target.value === "month";
            document.querySelector("#metric").textContent = month ? "48,920" : "12,840";
            document.querySelector("#metric-label").textContent = `Sample page views / ${month ? "30" : "7"} days`;
        });
    }
    if (index === 1)
    {
        let quantity = 0;
        content.innerHTML = '<p>Canvas daypack · $48.00 · Sample cart only.</p><div class="demo-actions"><button class="ghost" id="minus" disabled aria-label="Remove one daypack">−</button><span id="quantity">0 items</span><button class="button" id="plus" aria-label="Add one daypack">+</button></div><p id="subtotal">Your cart is empty.</p><p>No checkout or payment. Maximum 5 items in this prototype.</p>';
        const update = () =>
        {
            document.querySelector("#quantity").textContent = `${quantity} items`;
            document.querySelector("#subtotal").textContent = quantity ? `Subtotal: $${(quantity * 48).toFixed(2)}` : "Your cart is empty.";
            document.querySelector("#minus").disabled = quantity === 0;
            document.querySelector("#plus").disabled = quantity === 5;
        };
        document.querySelector("#minus").addEventListener("click", () =>
        {
            quantity = Math.max(0, quantity - 1);
            update();
        });
        document.querySelector("#plus").addEventListener("click", () =>
        {
            quantity = Math.min(5, quantity + 1);
            update();
        });
    }
    if (index === 2)
    {
        content.innerHTML = '<p>Task: Review keyboard navigation</p><label>Move task to<select id="task-state"><option>Todo</option><option>Doing</option><option>Done</option></select></label><p id="task-status" role="status">Review keyboard navigation → Todo</p><p>Single-browser state only; no real-time service or saved collaboration.</p>';
        document.querySelector("#task-state").addEventListener("change", (event) => document.querySelector("#task-status").textContent = `Review keyboard navigation → ${event.target.value}`);
    }
    dialog.showModal();
}
document.querySelector("#project-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-project]");
    if (button) openDemo(Number(button.dataset.project));
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
const notes = {
    boundaries: ["typed-boundaries", "Treat external data as unknown. Validate at the boundary, return explicit error states, and keep the typed application core small."],
    focus: ["focus-visible-kit", "Retain visible focus rings, use semantic controls, return focus when dialogs close, and test the complete keyboard path."],
    queue: ["tiny-task-queue", "Bound concurrency, make cancellation explicit, retain failed work and report actual completion rather than optimistic success."]
};
document.querySelectorAll("[data-repo]").forEach((button) => button.addEventListener("click", () =>
{
    const note = notes[button.dataset.repo];
    document.querySelector("#demo-title").textContent = note[0];
    content.textContent = note[1];
    dialog.showModal();
}));
document.querySelector("#terminal-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const command = document.querySelector("#command").value.trim().toLowerCase();
    const replies = {
        help: "Commands: help · stack · projects · clear",
        stack: "React / Node.js / TypeScript / PostgreSQL / Redis / AWS",
        projects: "Pulse: analytics · Fieldwork: commerce · Relay: collaboration",
        clear: ""
    };
    document.querySelector("#terminal-output").textContent = Object.hasOwn(replies, command) ? replies[command] : `Unknown command: ${command || "(empty)"}. Type help.`;
    document.querySelector("#command").value = "";
});
document.querySelector("#contact-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const stage = document.querySelector("#stage").value;
    const brief = document.querySelector("#brief").value.trim();
    const status = document.querySelector("#status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!stage || brief.length < 20)
    {
        status.textContent = "Choose a stage and add at least 20 characters about the problem.";
        return;
    }
    status.textContent = `${name} / ${stage}: ${brief} — Local preview. Nothing sent or saved.`;
});
document.querySelectorAll("#contact-form input, #contact-form textarea, #contact-form select").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#download").addEventListener("click", () =>
{
    const url = URL.createObjectURL(new Blob(["Alex Chen — fictional full-stack developer portfolio\nOriginal concepts: Pulse, Fieldwork, Relay.\nThis sample profile is not a verified employment CV. No career history or credentials asserted."], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "alex-chen-concept-profile.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#download-status").textContent = "Sample concept profile downloaded; not an employment CV.";
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
