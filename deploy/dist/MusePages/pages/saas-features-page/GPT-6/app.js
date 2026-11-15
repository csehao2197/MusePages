const tasks =
[
    { id: 1, title: "Brand direction", tag: "DESIGN", owner: "AM", stage: 0, dependency: "None", priority: "High" },
    { id: 2, title: "Write launch story", tag: "CONTENT", owner: "JK", stage: 0, dependency: "Brand direction", priority: "Medium" },
    { id: 3, title: "Build landing page", tag: "PRODUCT", owner: "SR", stage: 1, dependency: "Brand direction", priority: "High" },
    { id: 4, title: "Audience research", tag: "STRATEGY", owner: "AM", stage: 2, dependency: "None", priority: "Low" }
];
let hours = 18.5;
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const status = document.querySelector("#board-status");
function render()
{
    document.querySelector("#board").innerHTML = ["To do", "In progress", "Done"].map((stage, index) => `<div class="column" data-stage="${index}"><b>${stage} <span>· ${tasks.filter((task) => task.stage === index).length}</span></b>${tasks.filter((task) => task.stage === index).map((task) => `<article class="task" draggable="true" data-id="${task.id}"><span>${task.tag}</span><b>${escape(task.title)}</b><small>${task.priority} priority · Nov 20</small><button data-move="${task.id}" aria-label="Move ${escape(task.title)} forward">Move forward →</button><span class="owner">${task.owner}</span></article>`).join("")}</div>`).join("");
    document.querySelector("#timeline").innerHTML = `<small>ILLUSTRATIVE LAUNCH TIMELINE · NOV 16–30</small>` + tasks.map((task, index) => `<div class="timeline-row"><span>${escape(task.title)}</span><div><div class="timeline-bar" style="margin-left:${index * 8}%;width:${70 - index * 6}%">${index + 2} days · ${["Planned", "Active", "Done"][task.stage]}</div></div></div>`).join("");
    document.querySelector("#completed").textContent = `${tasks.filter((task) => task.stage === 2).length}/${tasks.length}`;
    document.querySelector("#hours").textContent = `${hours}h`;
}
function setView(view)
{
    document.querySelectorAll(".view").forEach((panel) => panel.hidden = panel.id !== view);
    document.querySelectorAll("[data-view]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.view === view)));
}
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelector("#board").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-move]");
    if (!button) return;
    const task = tasks.find((item) => item.id === Number(button.dataset.move));
    task.stage = (task.stage + 1) % 3;
    status.textContent = `${task.title} moved to ${["To do", "In progress", "Done"][task.stage]}.`;
    render();
});
document.querySelector("#board").addEventListener("dragstart", (event) =>
{
    const task = event.target.closest(".task");
    if (task) event.dataTransfer.setData("text/plain", task.dataset.id);
});
document.querySelector("#board").addEventListener("dragover", (event) => event.preventDefault());
document.querySelector("#board").addEventListener("drop", (event) =>
{
    event.preventDefault();
    const column = event.target.closest("[data-stage]");
    const task = tasks.find((item) => item.id === Number(event.dataTransfer.getData("text/plain")));
    if (!column || !task) return;
    task.stage = Number(column.dataset.stage);
    status.textContent = `${task.title} moved by drag and drop.`;
    render();
});
const dialog = document.querySelector("dialog");
function open(title, description)
{
    document.querySelector("#modal-title").textContent = title;
    document.querySelector("#modal-description").innerHTML = description;
    document.querySelector("#modal-form").hidden = false;
    document.querySelector("#modal-form").reset();
    document.querySelector("#modal-status").textContent = "";
    dialog.showModal();
}
document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () =>
{
    const title = button.dataset.open;
    const copy = title.includes("pricing") ? "<p>Free: $0 for 3 projects. Pro: $12 per person/month. Business: $24 per person/month. Illustrative pricing, billed monthly.</p>" : title.includes("API") ? "<p>API preview: GET /v1/projects, scoped access tokens and signed task.updated webhooks. This demo makes no API calls.</p>" : title.includes("connection") ? "<p>Connection preview: select a workspace, review project read/write permissions and authorize through your provider. This static demo never requests credentials or connects an account.</p>" : "<p>Explore a 14-day trial or tell us about your team. This request is local: no account, booking or message is created.</p>";
    open(title, copy);
}));
document.querySelector("#modal-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#modal-status").textContent = "Demo request prepared locally. No account created and no message sent.";
});
document.querySelector("#add-task").addEventListener("click", () =>
{
    open("A little more momentum", '<p>Add a real task to this browser-only project board.</p><form id="task-form"><label>Task name<input id="task-name" maxlength="70" required placeholder="Prepare the launch checklist"></label><button class="blue">Add task</button></form>');
    document.querySelector("#modal-form").hidden = true;
    document.querySelector("#task-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const title = document.querySelector("#task-name").value.trim();
        if (!title) return;
        tasks.push({ id: Date.now(), title, tag: "NEW TASK", owner: "YOU", stage: 0, dependency: "None", priority: "Medium" });
        render();
        setView("board");
        status.textContent = `Added ${title}.`;
        dialog.close();
    });
});
const demos =
{
    board: ["Everything in its right place.", '<div class="mini-board"><span>TO DO<i></i><i></i></span><span>IN PROGRESS<i></i></span><span>DONE<i></i><i></i></span></div>', "A focused board makes the next move obvious. Try moving real tasks in the product preview above."],
    timeline: ["The whole plan. One clear view.", '<div class="timeline-row"><span>Discovery</span><div class="timeline-bar" style="width:60%">3 days</div></div><div class="timeline-row"><span>Build</span><div class="timeline-bar" style="width:70%;margin-left:20%">5 days</div></div><div class="timeline-row"><span>Launch</span><div class="timeline-bar" style="width:40%;margin-left:50%">2 days</div></div>', "Milestones and durations make room for a plan that everyone can follow. See the project timeline above."],
    dependency: ["Connect the dots.", '<div class="demo-line"><b>Brand direction</b><span class="pill">First</span></div><div class="demo-line"><span>↓ Unlocks</span></div><div class="demo-line"><b>Build landing page</b><span class="pill">Depends on brand</span></div>', "A clear dependency chain helps you spot blockers before they become surprises."],
    fields: ["Your workflow, in your words.", '<div class="demo-line"><b>Priority</b><span class="pill">High</span></div><div id="custom-fields"></div><form class="field-editor" id="field-form"><input id="field-name" required maxlength="30" aria-label="Custom field name" placeholder="Add a field, e.g. Client"><button>Add field +</button></form>', "Add a custom field to this preview. It stays for the current view and is never sent to a server."]
};
function feature(name)
{
    const [title, html, description] = demos[name];
    document.querySelector("#feature-title").textContent = title;
    document.querySelector("#feature-demo").innerHTML = html;
    document.querySelector("#feature-description").textContent = description;
    document.querySelectorAll("[data-feature]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.feature === name)));
    if (name === "fields")
    {
        document.querySelector("#field-form").addEventListener("submit", (event) =>
        {
            event.preventDefault();
            const value = document.querySelector("#field-name").value.trim();
            if (!value) return;
            const row = document.createElement("div");
            row.className = "demo-line";
            row.textContent = `${value} · Not set`;
            document.querySelector("#custom-fields").append(row);
            document.querySelector("#field-name").value = "";
        });
    }
}
document.querySelectorAll("[data-feature]").forEach((button) => button.addEventListener("click", () => feature(button.dataset.feature)));
document.querySelector("#document").addEventListener("input", () => document.querySelector("#activity").textContent = "Activity: You edited the launch note. Local changes only.");
document.querySelector("#comment-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const field = document.querySelector("#comment");
    if (!field.value.trim()) return;
    const comment = document.createElement("p");
    comment.textContent = `You · just now: ${field.value.trim()}`;
    document.querySelector("#comments").append(comment);
    document.querySelector("#activity").textContent = "Activity: You added a comment.";
    field.value = "";
});
document.querySelector("#file").addEventListener("change", (event) =>
{
    const file = event.target.files[0];
    document.querySelector("#file-status").textContent = file ? `${file.name} selected locally. No file was uploaded.` : "";
    document.querySelector("#activity").textContent = file ? `Activity: You selected ${file.name}.` : "Activity: File selection cleared.";
});
document.querySelector("#log-time").addEventListener("click", () =>
{
    hours += 0.5;
    render();
    status.textContent = "Added 30 minutes to your local time report.";
});
document.querySelector("#export").addEventListener("click", () =>
{
    const csv = [["Task", "Status", "Priority"], ...tasks.map((task) => [task.title, ["To do", "In progress", "Done"][task.stage], task.priority])].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "taskflow-launch-report.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "Exported current task data as CSV, compatible with Excel.";
});
document.querySelector("#print").addEventListener("click", () => window.print());
document.querySelector("#see-insights").addEventListener("click", () =>
{
    setView("insights");
    document.querySelector(".workspace").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
});
const cases =
[
    ["Make every launch land.", "Coordinate campaigns, approvals and deadlines in one place. A sample marketing team replaces scattered briefs with a shared launch board.", "“From the first brief to the final send, everyone knows what’s next.”", "Marketing · illustrative team story"],
    ["Ship with fewer surprises.", "Link dependencies, triage bugs and connect release plans with GitHub. A sample development team catches blocked work before sprint review.", "“The whole release, not just another ticket queue.”", "Software development · illustrative team story"],
    ["More creating. Less chasing.", "Bring client feedback, assets and delivery milestones together. A sample agency tracks revisions without losing the original creative direction.", "“We made space for the idea, not another status meeting.”", "Creative agencies · illustrative team story"],
    ["Good work, wherever you are.", "Make decisions visible with async notes, mentions and activity history. A sample distributed team hands off work smoothly across three time zones.", "“We start the day with context, not a calendar full of catch-ups.”", "Remote teams · illustrative team story"]
];
function team(index)
{
    const [title, copy, quote, caption] = cases[index];
    document.querySelector("#case-title").textContent = title;
    document.querySelector("#case-copy").textContent = copy;
    document.querySelector("#case-quote").innerHTML = `${quote}<small>${caption}</small>`;
    document.querySelectorAll("[data-team]").forEach((button) => button.setAttribute("aria-selected", String(Number(button.dataset.team) === index)));
}
document.querySelectorAll("[data-team]").forEach((button) => button.addEventListener("click", () => team(Number(button.dataset.team))));
render();
feature("board");
team(0);
