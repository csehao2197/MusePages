const tasks =
[
    { name: "Gather inspiration", tag: "Research", status: 0 },
    { name: "Write homepage copy", tag: "Content", status: 0 },
    { name: "Design hero section", tag: "Design", status: 1 },
    { name: "Build component library", tag: "Design", status: 1 },
    { name: "Project kickoff", tag: "Planning", status: 2 },
    { name: "Define design direction", tag: "Strategy", status: 2 }
];
let view = "Board";
function taskMarkup(task)
{
    const index = tasks.indexOf(task);
    return `<article class="task"><small>${task.tag}</small><p></p><button data-advance="${index}" class="${task.status === 2 ? "done-label" : ""}">${task.status === 2 ? "✓ Complete · reopen" : task.status === 0 ? "Start task →" : "Mark complete ✓"}</button></article>`;
}
function render()
{
    const board = document.querySelector("#board");
    if (view === "Board")
    {
        board.innerHTML = `<div class="kanban">${["To do", "In progress", "Done"].map((name, status) => `<section class="column"><h3>${name} <span>${tasks.filter((task) => task.status === status).length}</span></h3>${tasks.filter((task) => task.status === status).map(taskMarkup).join("")}</section>`).join("")}</div>`;
        board.querySelectorAll("[data-advance]").forEach((button) => button.previousElementSibling.textContent = tasks[button.dataset.advance].name);
    }
    else if (view === "List")
    {
        board.innerHTML = `<div class="task-list">${tasks.map(taskMarkup).join("")}</div>`;
        board.querySelectorAll("[data-advance]").forEach((button) => button.previousElementSibling.textContent = tasks[button.dataset.advance].name);
    }
    else
    {
        board.innerHTML = `<p class="micro">Sample project calendar · scheduled tasks</p><div class="mini-calendar">${Array.from({ length: 28 }, (_, index) => `<div>${index + 1}${index >= 9 && index < 9 + tasks.length ? `<small data-calendar-task="${index - 9}"></small>` : ""}</div>`).join("")}</div>`;
        board.querySelectorAll("[data-calendar-task]").forEach((item) => item.textContent = tasks[item.dataset.calendarTask].name);
    }
    document.querySelector("#task-progress").textContent = `${tasks.filter((task) => task.status === 2).length} of ${tasks.length} tasks complete`;
}
document.querySelector("#board").onclick = (event) =>
{
    const button = event.target.closest("[data-advance]");
    if (button)
    {
        const task = tasks[Number(button.dataset.advance)];
        task.status = (task.status + 1) % 3;
        render();
    }
};
document.querySelectorAll("[data-view]").forEach((button) => button.onclick = () =>
{
    view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach((other) => other.setAttribute("aria-pressed", other === button));
    render();
});
document.querySelector("#add-task").onclick = () =>
{
    document.querySelector("#task-form").hidden = !document.querySelector("#task-form").hidden;
    if (!document.querySelector("#task-form").hidden) document.querySelector("#task-name").focus();
};
document.querySelector("#task-form").onsubmit = (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#task-name").value.trim();
    if (!name) return;
    tasks.push({ name, tag: "New task", status: 0 });
    document.querySelector("#task-name").value = "";
    document.querySelector("#task-form").hidden = true;
    render();
};
function billing(annual)
{
    document.querySelector("#monthly").setAttribute("aria-pressed", !annual);
    document.querySelector("#annual").setAttribute("aria-pressed", annual);
    document.querySelector("#pro-price").textContent = annual ? "$9.60" : "$12";
    document.querySelector("#billing-note").textContent = annual ? "$115.20 per user, billed yearly" : "Billed monthly";
}
document.querySelector("#monthly").onclick = () => billing(false);
document.querySelector("#annual").onclick = () => billing(true);
function trial(plan, email = "")
{
    document.querySelector("#trial-title").textContent = plan === "Enterprise" ? "Let's build your team preview." : `Find your flow with ${plan}.`;
    document.querySelector("#trial-email").value = email;
    document.querySelector("#trial-result").textContent = "";
    document.querySelector("#trial").showModal();
}
document.querySelectorAll("[data-trial]").forEach((button) => button.onclick = () => trial(button.dataset.trial));
document.querySelector("#get-started").onsubmit = (event) =>
{
    event.preventDefault();
    trial("Starter", document.querySelector("#start-email").value);
};
document.querySelector("#trial-form").onsubmit = (event) =>
{
    event.preventDefault();
    const workspace = document.querySelector("#workspace").value.trim();
    if (workspace.length < 2) return;
    document.querySelector("#workspace-name").textContent = `${workspace} workspace⌄`;
    let stored = false;
    try
    {
        localStorage.setItem("taskflow-workspace", workspace);
        stored = true;
    }
    catch {}
    document.querySelector("#trial-result").textContent = `${workspace} is ready in this ${stored ? "browser" : "session"}. Close this window and try adding a task. No account or email was created.`;
};
try
{
    const workspace = localStorage.getItem("taskflow-workspace");
    if (workspace) document.querySelector("#workspace-name").textContent = `${workspace} workspace⌄`;
}
catch {}
const demoSteps =
[
    ["01 / Make it clear.", "Switch the live preview between Board, List and Calendar. The same six tasks stay together, however you like to work."],
    ["02 / Keep it moving.", "Start a task and mark it complete. The board and completion counter update together. Add a task to make the workspace your own."],
    ["03 / Find your flow.", "Create a local workspace preview with the trial button. Your workspace label stays in this browser; no cloud account is created."]
];
let demoStep = 0;
function renderDemo()
{
    document.querySelector("#demo-title").textContent = demoSteps[demoStep][0];
    document.querySelector("#demo-text").textContent = demoSteps[demoStep][1];
    document.querySelector("#demo-next").textContent = demoStep === 2 ? "Try the workspace →" : "Next →";
}
document.querySelector("#watch-demo").onclick = () =>
{
    demoStep = 0;
    renderDemo();
    document.querySelector("#demo").showModal();
};
document.querySelector("#demo-next").onclick = () =>
{
    if (demoStep === 2)
    {
        document.querySelector("#demo").close();
        document.querySelector(".dashboard").scrollIntoView({ behavior: "smooth" });
        return;
    }
    demoStep++;
    renderDemo();
};
document.querySelectorAll("[data-feature]").forEach((button) => button.onclick = () =>
{
    document.querySelector("#demo-title").textContent = button.dataset.feature;
    document.querySelector("#demo-text").textContent = button.dataset.feature === "Task management" ? "Try the interactive Board, List and Calendar in the hero. Add a task, advance its status, and see progress update." : button.dataset.feature === "Team collaboration" ? "The product concept keeps comments, mentions and decisions beside each task. This offline preview does not synchronize with other users." : "The live task-completion counter reflects your local changes. Team performance reporting is a product concept, not a connected analytics service.";
    demoStep = 2;
    document.querySelector("#demo-next").textContent = "Try the workspace →";
    document.querySelector("#demo").showModal();
});
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
render();
