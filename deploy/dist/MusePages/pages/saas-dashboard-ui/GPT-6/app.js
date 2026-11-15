const icons =
{
    Dashboard: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    Projects: '<path d="M3 7h7l2-3h9v16H3Z"/>',
    Tasks: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
    Team: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
    Messages: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 3V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"/><path d="M7 8h10M7 12h7"/>',
    Calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
    Reports: '<path d="M3 3v18h18M8 16v-6m5 6V7m5 9V3"/>',
    Settings: '<circle cx="12" cy="12" r="3"/><path d="m9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z"/>'
};
const projects =
[
    { name: "Website redesign", status: "In progress", owner: "Julia Lee", due: "Nov 18", tasks: 18 },
    { name: "Mobile app launch", status: "In progress", owner: "Sam Kim", due: "Nov 20", tasks: 24 },
    { name: "Brand guidelines", status: "Completed", owner: "Maya Ross", due: "Nov 15", tasks: 12 },
    { name: "Customer research", status: "On hold", owner: "Noah James", due: "Nov 25", tasks: 8 }
];
const people =
[
    { name: "Julia Lee", initials: "JL", role: "Product designer", tasks: 18, completion: 84, status: "Available", color: "violet" },
    { name: "Sam Kim", initials: "SK", role: "Frontend developer", tasks: 24, completion: 72, status: "At capacity", color: "peach" },
    { name: "Maya Ross", initials: "MR", role: "Brand designer", tasks: 12, completion: 92, status: "Available", color: "mint" },
    { name: "Noah James", initials: "NJ", role: "Product manager", tasks: 16, completion: 68, status: "In a meeting", color: "violet" },
    { name: "Emma Wilson", initials: "EW", role: "UX researcher", tasks: 14, completion: 88, status: "Available", color: "rose" },
    { name: "Liam Chen", initials: "LC", role: "Backend developer", tasks: 21, completion: 76, status: "At capacity", color: "mint" }
];
const taskNames = ["Review homepage wireframes", "Update the design system", "Prepare launch checklist", "Write onboarding copy", "Share research findings"];
const checked = new Set();
const messages = [{ name: "Julia Lee", text: "Homepage explorations are ready for a little feedback." }, { name: "Sam Kim", text: "The component library update is on track for Friday." }];
let section = "Dashboard";
let projectFilter = "All";
let displayName = "Alex Carter";
let sorted = [...people];
let sortDirection = 1;
let lastSort = "";
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
document.querySelector("#navigation").innerHTML = Object.keys(icons).map((name) => `<button class="nav-item ${name === "Dashboard" ? "active" : ""}" data-section="${name}" aria-label="${name}" ${name === "Dashboard" ? 'aria-current="page"' : ""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg><span class="nav-label">${name}</span>${name === "Messages" ? '<span class="badge nav-label">4</span>' : ""}</button>`).join("");
function teamRows()
{
    return sorted.map((person) => `<tr><td><div class="member"><span class="avatar ${person.color}">${person.initials}</span><div><strong>${person.name}</strong><small>${person.role}</small></div></div></td><td>${person.tasks} tasks</td><td><span class="progress" style="--progress:${person.completion}%"><i></i></span>${person.completion}%</td><td><span class="member-status ${person.status === "Available" ? "" : "busy"}">${person.status}</span></td><td><button data-person="${person.name}" aria-label="View ${person.name}">⋯</button></td></tr>`).join("");
}
function renderTeam()
{
    document.querySelectorAll("#workload-rows, #team-rows").forEach((body) => body.innerHTML = teamRows());
}
const activity =
[
    ["JL", "violet", "Julia Lee", "completed", "Homepage wireframes", "12 min ago"],
    ["SK", "peach", "Sam Kim", "commented on", "Design system v2", "28 min ago"],
    ["MR", "mint", "Maya Ross", "uploaded", "Brand assets.zip", "1 hour ago"],
    ["NJ", "violet", "Noah James", "created a new project", "Mobile app launch", "2 hours ago"],
    ["EW", "rose", "Emma Wilson", "updated", "Research insights", "3 hours ago"]
];
document.querySelector("#activity").innerHTML = activity.map(([initials, color, name, action, item, time]) => `<div class="activity-item"><span class="avatar ${color}">${initials}</span><div><p><b>${name}</b> ${action} <b>${item}</b></p><small>${time}</small></div></div>`).join("");
document.querySelector("#deadlines").innerHTML = projects.map((project, index) => `<button class="deadline" data-project="${index}"><span class="date-box">NOV<b>${[18, 20, 15, 25][index]}</b></span><span><strong>${project.name}</strong><small>${project.owner} · ${project.tasks} tasks</small></span><span class="due">${index === 0 ? "Due soon" : index === 2 ? "Completed" : "Upcoming"}</span></button>`).join("");
function show(title, html)
{
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-body").innerHTML = html;
    document.querySelector("#dialog").showModal();
}
function renderProjects()
{
    const found = projects.filter((project) => projectFilter === "All" || project.status === projectFilter);
    document.querySelector("#project-list").innerHTML = found.map((project) => `<article class="card"><h2>${escape(project.name)}</h2><p>${project.status} · ${project.owner}</p><p>${project.tasks} tasks · Due ${project.due}</p><button class="secondary" data-project="${projects.indexOf(project)}">Open project →</button></article>`).join("") || "<p>No projects in this status.</p>";
}
function renderSection(name)
{
    section = name;
    document.querySelector("#dashboard").hidden = name !== "Dashboard";
    document.querySelector("#secondary-view").hidden = name === "Dashboard";
    document.querySelector("#page-label").textContent = name === "Dashboard" ? "Overview" : name;
    document.querySelectorAll(".nav-item").forEach((button) =>
    {
        button.classList.toggle("active", button.dataset.section === name);
        if (button.dataset.section === name) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });
    document.querySelector("#user-dropdown").hidden = true;
    document.querySelector("#search-results").hidden = true;
    document.querySelector("#user-menu").setAttribute("aria-expanded", "false");
    document.querySelector("#secondary-title").textContent = name;
    document.querySelector("#secondary-description").textContent = "A working local view. Changes stay in this session unless noted.";
    const target = document.querySelector("#secondary-content");
    if (name === "Projects")
    {
        target.innerHTML = `<label for="project-filter" class="sr-only">Project status</label><select id="project-filter">${["All", "In progress", "Completed", "On hold"].map((status) => `<option ${status === projectFilter ? "selected" : ""}>${status}</option>`).join("")}</select><div id="project-list" class="project-list"></div>`;
        renderProjects();
        document.querySelector("#project-filter").onchange = (event) =>
        {
            projectFilter = event.target.value;
            renderProjects();
        };
    }
    if (name === "Tasks")
    {
        target.innerHTML = `<article class="card"><h2>Your next steps.</h2><p id="task-count"></p>${taskNames.map((task, index) => `<label class="task-row"><input type="checkbox" data-task="${index}" ${checked.has(index) ? "checked" : ""}><span>${task}</span></label>`).join("")}</article>`;
        updateTaskCount();
    }
    if (name === "Team")
    {
        target.innerHTML = '<article class="card"><h2>Meet your people.</h2><p>6 representative profiles from a 12-person illustrative workspace.</p><div class="table-wrap"><table><thead><tr><th>Team member</th><th>Assigned tasks</th><th>Completion</th><th>Status</th><th></th></tr></thead><tbody id="team-rows"></tbody></table></div></article>';
        renderTeam();
    }
    if (name === "Messages")
    {
        target.innerHTML = '<article class="card"><h2># website-redesign</h2><div id="messages"></div><form id="message-form"><label class="sr-only" for="message">Message</label><input id="message" placeholder="Share a thought with the demo team" required maxlength="500"><button class="primary">Send locally →</button></form><p class="demo-note">Messages are local previews; no team member receives them.</p></article>';
        renderMessages();
        document.querySelector("#message-form").onsubmit = (event) =>
        {
            event.preventDefault();
            const text = document.querySelector("#message").value.trim();
            if (!text) return;
            messages.push({ name: displayName, text });
            renderMessages();
            document.querySelector("#message").value = "";
        };
    }
    if (name === "Calendar")
    {
        target.innerHTML = `<article class="card"><h2>November 2026 · Sample project calendar</h2><p>Choose an event date to see its project.</p><div class="calendar-grid">${Array.from({ length: 30 }, (_, index) =>
        {
            const match = [18, 20, 15, 25].indexOf(index + 1);
            return `<button ${match >= 0 ? `data-project="${match}"` : "disabled"}>${index + 1}${match >= 0 ? `<small>${projects[match].name}</small>` : ""}</button>`;
        }).join("")}</div></article>`;
    }
    if (name === "Reports")
    {
        target.innerHTML = '<article class="card"><h2>Your week, in perspective.</h2><p>24 projects · 156 active tasks · 342 hours logged · 84 tasks completed.</p><p>Snapshot uses fictional demonstration data, not a connected time-tracking service.</p><button class="primary" id="download-report">Download workspace CSV ↓</button></article>';
        document.querySelector("#download-report").onclick = exportReport;
    }
    if (name === "Settings")
    {
        target.innerHTML = `<form id="settings-form" class="card"><h2>Make it feel like you.</h2><label>Display name<input id="display-name" value="${escape(displayName)}" required minlength="2" maxlength="40"></label><label>Workspace name<input id="workspace-name" value="Studio workspace" required minlength="2" maxlength="40"></label><button class="primary">Save local preferences</button><p id="settings-status" role="status"></p></form>`;
        document.querySelector("#settings-form").onsubmit = (event) =>
        {
            event.preventDefault();
            displayName = document.querySelector("#display-name").value.trim();
            if (displayName.length < 2) return;
            document.querySelector(".user-menu > span:not(.avatar)").textContent = displayName;
            document.querySelector("#dashboard h1").textContent = `Good morning, ${displayName.split(" ")[0]}`;
            document.querySelector(".workspace-switch .nav-label").firstChild.textContent = document.querySelector("#workspace-name").value.trim();
            document.querySelector("#settings-status").textContent = "Preferences updated in this session. No account data was sent.";
        };
    }
    window.scrollTo(0, 0);
}
function updateTaskCount()
{
    document.querySelector("#task-count").textContent = `${checked.size} of ${taskNames.length} personal tasks complete.`;
}
function renderMessages()
{
    document.querySelector("#messages").innerHTML = messages.map((message) => `<div class="message"><b>${escape(message.name)}</b><p>${escape(message.text)}</p></div>`).join("");
}
function exportReport()
{
    const rows = [["Team member", "Assigned tasks", "Completion percent", "Status"], ...people.map((person) => [person.name, person.tasks, person.completion, person.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "forma-workload.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.addEventListener("click", (event) =>
{
    const nav = event.target.closest("[data-section]");
    if (nav) renderSection(nav.dataset.section);
    const project = event.target.closest("[data-project]");
    if (project)
    {
        const item = projects[Number(project.dataset.project)];
        show(item.name, `<p>${item.status} · Owner: ${escape(item.owner)}</p><p>${item.tasks} tasks · Due ${item.due}</p><p>Illustrative project. No external workspace is connected.</p>`);
    }
    const person = event.target.closest("[data-person]");
    if (person)
    {
        const member = people.find((item) => item.name === person.dataset.person);
        show(member.name, `<p>${member.role}</p><p>${member.tasks} assigned tasks · ${member.completion}% completion</p><p>${member.status} · Illustrative team profile.</p>`);
    }
    const filter = event.target.closest("[data-project-filter]");
    if (filter)
    {
        projectFilter = filter.dataset.projectFilter;
        renderSection("Projects");
    }
    const sort = event.target.closest("[data-sort]");
    if (sort)
    {
        sortDirection = lastSort === sort.dataset.sort ? -sortDirection : 1;
        lastSort = sort.dataset.sort;
        sorted.sort((a, b) => sortDirection * (typeof a[lastSort] === "string" ? a[lastSort].localeCompare(b[lastSort]) : a[lastSort] - b[lastSort]));
        renderTeam();
    }
});
document.addEventListener("change", (event) =>
{
    if (event.target.matches("[data-task]"))
    {
        const index = Number(event.target.dataset.task);
        event.target.checked ? checked.add(index) : checked.delete(index);
        updateTaskCount();
    }
});
document.querySelector("#collapse").onclick = () =>
{
    const collapsed = document.body.classList.toggle("collapsed");
    document.querySelector("#collapse").setAttribute("aria-expanded", !collapsed);
    document.querySelector("#collapse").setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
};
document.querySelector("#notifications").onclick = () =>
{
    show("A little heads-up.", "<p><b>3 new notifications</b></p><p>Julia shared wireframes. Sam mentioned you. Your weekly summary is ready.</p><button class='primary' id='mark-read'>Mark all as read</button>");
    document.querySelector("#mark-read").onclick = () =>
    {
        document.querySelector("#notification-dot").hidden = true;
        document.querySelector("#notifications").setAttribute("aria-label", "Notifications, none unread");
        document.querySelector("#dialog-body").innerHTML = "<p>All caught up. Notifications marked read locally.</p>";
    };
};
document.querySelector("#user-menu").onclick = () =>
{
    const open = document.querySelector("#user-dropdown").hidden;
    document.querySelector("#user-dropdown").hidden = !open;
    document.querySelector("#user-menu").setAttribute("aria-expanded", open);
};
document.querySelector("#session-info").onclick = () => show("A clear view of the demo.", "<p>No authentication or backend is connected. Projects, messages and settings are held in this browser session. Exported CSV contains only fictional team data.</p>");
document.querySelector("#workspace-info").onclick = () => show("Studio workspace", "<p>12 members · 24 projects · Pro concept plan</p><p>All workspace metrics are illustrative.</p>");
document.querySelector("#upgrade").onclick = () => show("Room for your next big idea.", "<p>Pro is a product concept with additional automations and reports. No billing or purchase is available in this static preview.</p>");
document.querySelector("#export").onclick = exportReport;
document.querySelector("#new-project").onclick = () =>
{
    show("Start something good.", '<form id="project-form"><label>Project name<input id="project-name" required minlength="2" maxlength="70"></label><button class="primary">Create local project</button></form><p id="project-status" role="status"></p>');
    document.querySelector("#project-form").onsubmit = (event) =>
    {
        event.preventDefault();
        const name = document.querySelector("#project-name").value.trim();
        if (name.length < 2) return;
        projects.push({ name, status: "In progress", owner: displayName, due: "Not scheduled", tasks: 0 });
        document.querySelector("#project-count").textContent = String(24 + projects.length - 4);
        document.querySelector("#project-status").textContent = "Project created locally. Find it in Projects; no server was contacted.";
        document.querySelector("#project-form button").disabled = true;
    };
};
document.querySelector("#period").onchange = (event) =>
{
    const month = event.target.value === "month";
    document.querySelector("#hours").innerHTML = month ? "1,368<span>h</span>" : "342<span>h</span>";
    document.querySelector("#chart-total").textContent = month ? "336" : "84";
    document.querySelector("#chart-caption").textContent = month ? "Four-week sample · Weekly average shown across weekdays" : "Last 7 days · Sample team activity";
    document.querySelector("#line").setAttribute("d", month ? "M35 130 125 95 215 75 305 90 395 55 485 65 575 24" : "M35 115 125 95 215 107 305 58 395 74 485 30 575 42");
    document.querySelector("#area").setAttribute("d", document.querySelector("#line").getAttribute("d") + "V145H35Z");
};
document.querySelector("#global-search").oninput = (event) =>
{
    const query = event.target.value.trim().toLowerCase();
    const target = document.querySelector("#search-results");
    target.hidden = !query;
    if (!query) return;
    const found = Object.keys(icons).filter((name) => name.toLowerCase().includes(query));
    const foundProjects = projects.filter((project) => project.name.toLowerCase().includes(query));
    target.innerHTML = found.map((name) => `<button data-section="${name}">${name} →</button>`).join("") + foundProjects.map((project) => `<button data-project="${projects.indexOf(project)}">${escape(project.name)} ↗</button>`).join("") || "<p>No results. Try “projects”, “team” or “website”.</p>";
};
document.addEventListener("keydown", (event) =>
{
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")
    {
        event.preventDefault();
        document.querySelector("#global-search").focus();
    }
    if (event.key === "Escape")
    {
        document.querySelector("#search-results").hidden = true;
        document.querySelector("#user-dropdown").hidden = true;
    }
});
document.querySelector(".close").onclick = () => document.querySelector("#dialog").close();
renderTeam();
