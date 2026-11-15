const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    menu.textContent = expanded ? "Close −" : "Menu +";
    document.querySelector("nav").classList.toggle("open", expanded);
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("nav").classList.remove("open");
    menu.textContent = "Menu +";
}));
const roles = ["Full-Stack Developer", "Open Source Contributor", "Tech Writer"];
let roleIndex = 0;
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    setInterval(() =>
    {
        roleIndex = (roleIndex + 1) % roles.length;
        const role = document.querySelector("#role");
        let length = 0;
        role.textContent = "";
        const typing = setInterval(() =>
        {
            role.textContent = roles[roleIndex].slice(0, ++length);
            if (length >= roles[roleIndex].length) clearInterval(typing);
        }, 45);
    }, 4200);
}
document.querySelector("#terminal-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = document.querySelector("#command");
    const command = input.value.trim().toLowerCase();
    const output = document.querySelector("#terminal-output");
    if (command === "clear")
    {
        output.replaceChildren();
    }
    else
    {
        const messages =
        {
            help: "Commands: help · stack · status · clear",
            stack: "TypeScript / React / Node.js / PostgreSQL / Go",
            status: "Available for select projects. Building at Northstar. Say hello below."
        };
        const line = document.createElement("p");
        line.textContent = messages[command] ?? `Command not found: ${input.value.trim() || "(empty)"}. Try help.`;
        output.append(line);
        output.scrollTop = output.scrollHeight;
    }
    input.value = "";
});
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    document.querySelectorAll(".project").forEach((project) =>
    {
        project.hidden = button.dataset.filter !== "all" && project.dataset.kind !== button.dataset.filter;
    });
}));
const dialog = document.querySelector("#detail");
const openDetail = (title, type, copy) =>
{
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-type").textContent = type;
    document.querySelector("#detail-copy").textContent = copy;
    document.querySelector("#demo").replaceChildren();
    dialog.showModal();
};
document.querySelector("#close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
});
document.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () =>
{
    const name = button.dataset.project;
    openDetail(name, "INTERACTIVE LOCAL DEMO", "A small browser-only prototype. Sample content resets when you close this demo.");
    const demo = document.querySelector("#demo");
    if (name === "Orbit")
    {
        demo.innerHTML = '<form id="note-form"><label>Capture an idea<input id="note" required maxlength="120" placeholder="An idea worth keeping"></label><button class="button">Save idea +</button></form><div id="notes" aria-live="polite"><p class="note-item">Build something useful for someone.</p></div>';
        document.querySelector("#note-form").addEventListener("submit", (event) =>
        {
            event.preventDefault();
            const input = document.querySelector("#note");
            if (!input.value.trim()) return;
            const note = document.createElement("p");
            note.className = "note-item";
            note.textContent = input.value.trim();
            document.querySelector("#notes").prepend(note);
            input.value = "";
        });
    }
    else if (name === "Pulse Analytics")
    {
        demo.innerHTML = '<label>Reporting window<select id="window"><option value="day">Today</option><option value="week">This week</option></select></label><p id="metric" role="status">12,800 events · 1,240 visitors</p>';
        document.querySelector("#window").addEventListener("change", (event) =>
        {
            document.querySelector("#metric").textContent = event.target.value === "week" ? "84,300 events · 8,620 visitors" : "12,800 events · 1,240 visitors";
        });
    }
    else
    {
        demo.innerHTML = '<details><summary>Accessible accordion example</summary><p>Native keyboard support, semantic markup, and a visible focus ring. Small details matter.</p></details><p><label><input id="toggle" type="checkbox" style="display:inline;width:auto"> Enable compact spacing</label></p><p id="toggle-status" role="status">Comfortable spacing selected.</p>';
        document.querySelector("#toggle").addEventListener("change", (event) =>
        {
            document.querySelector("#toggle-status").textContent = event.target.checked ? "Compact spacing selected." : "Comfortable spacing selected.";
        });
    }
}));
const articles =
{
    "Designing APIs for the next person": "Start with the questions your API needs to answer. Use consistent names, return actionable errors and document the unhappy paths. A useful error tells a developer what happened and what they can do next. Before adding another endpoint, write the example you wish someone had given you.",
    "The case for boring technology": "The best tool is often the one your team already understands. Familiar systems leave room for unfamiliar problems. Choose new technology when it solves a real constraint, document the trade-off, and make the cost of operating it part of the decision.",
    "Small interfaces, big accessibility": "Start with semantic HTML. Give every input a visible label, every action a useful name and every keyboard user a visible focus indicator. Test your interface without a mouse. Accessibility improves a product by making intent clearer for everyone."
};
document.querySelectorAll("[data-article]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.article, "WORKBENCH NOTE · LOCAL EXCERPT", articles[button.dataset.article])));
const graph = document.querySelector("#contributions");
for (let index = 0; index < 182; index++) graph.append(document.createElement("i"));
document.querySelector("#contact-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    document.querySelector("#contact-status").textContent = `Thanks, ${data.get("name")}. Your message preview is ready below. Nothing has been sent.`;
    openDetail("Your message preview", "LOCAL DEMO · NOT SENT", `From: ${data.get("name")} (${data.get("email")})\n\n${data.get("message")}\n\nThis fictional portfolio does not send email or store your details.`);
});
