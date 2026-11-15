const key = "taskflow-onboarding-v1";
const fresh = () =>
({
    step: 1,
    phase: "setup",
    workspace: "",
    role: "",
    logo: "",
    inviteDraft: [{ email: "", role: "Member" }],
    invites: [],
    project: "",
    template: "blank",
    preferences: { mentions: true, tasks: true, digest: false, theme: "system", shortcuts: true, tips: false },
    tasks: [],
    createdTemplate: null
});
let state = fresh();
try
{
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (saved && saved.version === 1 && saved.state && [1, 2, 3, 4].includes(saved.state.step))
    {
        state = { ...fresh(), ...saved.state, preferences: { ...fresh().preferences, ...saved.state.preferences } };
    }
}
catch
{
    state = fresh();
}
const templates =
{
    blank: { name: "Blank Project", tasks: [], summary: "A clean slate, ready for your first task." },
    marketing: { name: "Marketing Campaign", tasks: ["Write the campaign brief", "Define your audience", "Create campaign assets", "Review results"], summary: "Four thoughtful steps from a good idea to a great campaign." },
    launch: { name: "Product Launch", tasks: ["Define launch goals", "Prepare the launch checklist", "Coordinate the release", "Collect customer feedback"], summary: "A simple launch plan, with all the important moments covered." },
    software: { name: "Software Development", tasks: ["Plan the sprint", "Build the first feature", "Review and test", "Ship the release"], summary: "A practical starting point for your next sprint." },
    client: { name: "Client Project", tasks: ["Schedule the kickoff", "Confirm the scope", "Share a first draft", "Get client approval"], summary: "A clear path from the first conversation to the final handoff." }
};
const save = () =>
{
    try
    {
        sessionStorage.setItem(key, JSON.stringify({ version: 1, state }));
        document.querySelector("#save-label").textContent = "Saved in this tab";
    }
    catch
    {
        document.querySelector("#save-label").textContent = "Memory only · storage unavailable";
    }
};
const applyTheme = () =>
{
    document.documentElement.dataset.theme = state.preferences.theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : state.preferences.theme;
};
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () =>
{
    if (state.preferences.theme === "system") applyTheme();
});
const info = (title, content) =>
{
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-content").textContent = content;
    document.querySelector("#info-dialog").showModal();
};
const escapeError = () =>
{
    document.querySelector("#form-error").textContent = "";
    document.querySelectorAll('[aria-invalid="true"]').forEach((input) => input.removeAttribute("aria-invalid"));
};
const error = (text, input) =>
{
    document.querySelector("#form-error").textContent = text;
    if (input)
    {
        input.setAttribute("aria-invalid", "true");
        input.focus();
    }
    return false;
};
const syncLogo = () =>
{
    const preview = document.querySelector("#logo-preview");
    const mini = document.querySelector("#mini-logo");
    if (state.logo)
    {
        const image = new Image();
        image.src = state.logo;
        image.alt = "Your workspace logo";
        preview.replaceChildren(image);
        mini.replaceChildren(image.cloneNode());
    }
    else
    {
        preview.textContent = (state.workspace || "W").charAt(0).toUpperCase();
        mini.textContent = (state.workspace || "S").charAt(0).toUpperCase();
    }
    document.querySelector("#remove-logo").hidden = !state.logo;
};
const renderPreview = () =>
{
    document.querySelector("#mini-name").textContent = state.workspace.trim() || "Your workspace";
    const titles = ["Good things\nare taking shape.", "Make room\nfor your people.", "Big ideas.\nClear next steps.", "Your space.\nYour kind of flow."];
    document.querySelector("#preview-title").textContent = titles[state.step - 1];
    document.querySelector("#preview-title").style.whiteSpace = "pre-line";
    const copy =
    [
        ["Less busywork.\nMore meaningful work.", "Give your ideas a home and your team\na little room to do their best work."],
        ["Different talents.\nOne shared direction.", "Bring your favorite collaborators together.\nThere’s room for every kind of mind."],
        ["A little structure.\nA lot of possibility.", "Big things begin with small next steps.\nFind a starting point that feels right."],
        ["Find your rhythm.\nMake it feel like you.", "A quieter inbox. The right atmosphere.\nGood work happens on your terms."]
    ][state.step - 1];
    document.querySelector("#aside-title").textContent = copy[0];
    document.querySelector("#aside-title").style.whiteSpace = "pre-line";
    document.querySelector("#aside-copy").textContent = copy[1];
    document.querySelector("#aside-copy").style.whiteSpace = "pre-line";
    document.querySelectorAll(".preview-dots i").forEach((dot, index) => dot.classList.toggle("active", index === state.step - 1));
    const miniTasks = document.querySelector("#mini-tasks");
    miniTasks.replaceChildren();
    const tasks = state.step === 3 && templates[state.template].tasks.length ? templates[state.template].tasks.slice(0, 3) : ["A space to think clearly", "A team moving together", "Your next great idea"];
    tasks.forEach((text, index) =>
    {
        const row = document.createElement("p");
        const circle = document.createElement("i");
        const name = document.createElement("span");
        name.textContent = text;
        const mark = document.createElement("b");
        mark.textContent = index === 2 ? "↗" : "✓";
        row.append(circle, name, mark);
        miniTasks.append(row);
    });
    syncLogo();
};
const captureInvites = () =>
{
    state.inviteDraft = [...document.querySelectorAll(".invite-row")].map((row) => ({ email: row.querySelector("input").value.trim(), role: row.querySelector("select").value }));
};
const renderInvites = () =>
{
    const rows = document.querySelector("#invite-rows");
    rows.replaceChildren();
    state.inviteDraft.forEach((invite, index) =>
    {
        const row = document.createElement("div");
        row.className = "invite-row";
        const input = document.createElement("input");
        input.type = "email";
        input.placeholder = "teammate@company.com";
        input.value = invite.email;
        input.setAttribute("aria-label", `Teammate ${index + 1} email`);
        input.addEventListener("input", () =>
        {
            escapeError();
            captureInvites();
            save();
        });
        const select = document.createElement("select");
        select.setAttribute("aria-label", `Teammate ${index + 1} role`);
        ["Admin", "Member", "Viewer"].forEach((role) => select.add(new Option(role, role)));
        select.value = invite.role;
        select.addEventListener("change", () =>
        {
            captureInvites();
            save();
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Remove teammate ${index + 1}`);
        remove.addEventListener("click", () =>
        {
            captureInvites();
            state.inviteDraft.splice(index, 1);
            if (!state.inviteDraft.length) state.inviteDraft.push({ email: "", role: "Member" });
            renderInvites();
            save();
        });
        row.append(input, select, remove);
        rows.append(row);
    });
};
const renderTemplate = () =>
{
    document.querySelectorAll("[data-template]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.template === state.template)));
    document.querySelector("#template-summary").textContent = templates[state.template].summary;
    const list = document.querySelector("#template-tasks");
    list.replaceChildren();
    templates[state.template].tasks.forEach((text) =>
    {
        const item = document.createElement("li");
        item.textContent = text;
        list.append(item);
    });
    renderPreview();
};
const renderPreferences = () =>
{
    for (const [id, preference] of [["notify-mentions", "mentions"], ["notify-tasks", "tasks"], ["notify-digest", "digest"], ["shortcuts", "shortcuts"], ["tips", "tips"]])
    {
        document.querySelector(`#${id}`).checked = state.preferences[preference];
    }
    document.querySelectorAll("[data-theme-option]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeOption === state.preferences.theme)));
    applyTheme();
};
const renderSummary = () =>
{
    const summary = document.querySelector("#setup-summary");
    summary.replaceChildren();
    const entries =
    [
        ["Workspace", `${state.workspace} · ${state.role}`],
        ["Your team", `${state.invites.length} invitation${state.invites.length === 1 ? "" : "s"} prepared · not sent`],
        ["First project", `${state.project} · ${templates[state.template].name}`],
        ["Your preferences", `${state.preferences.theme} theme · shortcuts ${state.preferences.shortcuts ? "on" : "off"} · email tips ${state.preferences.tips ? "on" : "off"}`]
    ];
    entries.forEach(([label, value]) =>
    {
        const row = document.createElement("div");
        row.className = "summary-row";
        const key = document.createElement("span");
        key.textContent = label;
        const text = document.createElement("strong");
        text.textContent = value;
        row.append(key, text);
        summary.append(row);
    });
};
const renderTasks = () =>
{
    const list = document.querySelector("#dashboard-tasks");
    list.replaceChildren();
    if (!state.tasks.length)
    {
        const empty = document.createElement("p");
        empty.className = "empty-tasks";
        empty.textContent = "A clean slate. Add your first task above.";
        list.append(empty);
    }
    state.tasks.forEach((task, index) =>
    {
        const row = document.createElement("div");
        row.className = `task-row${task.done ? " done" : ""}`;
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        const text = document.createElement("span");
        text.textContent = task.title;
        checkbox.addEventListener("change", () =>
        {
            task.done = checkbox.checked;
            save();
            renderTasks();
            document.querySelector("#dashboard-status").textContent = task.done ? "A little progress worth celebrating." : "Task marked as still in progress.";
        });
        label.append(checkbox, text);
        const remove = document.createElement("button");
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Delete ${task.title}`);
        remove.addEventListener("click", () =>
        {
            state.tasks.splice(index, 1);
            save();
            renderTasks();
        });
        row.append(label, remove);
        list.append(row);
    });
    document.querySelector("#task-count").textContent = `${state.tasks.filter((task) => task.done).length} / ${state.tasks.length} complete`;
};
const renderDashboard = () =>
{
    document.querySelector("#dashboard-name").textContent = `Welcome to ${state.workspace}.`;
    document.querySelector("#dashboard-role").textContent = `Your role: ${state.role} · Browser-only workspace`;
    document.querySelector("#dashboard-project").textContent = state.project;
    document.querySelector("#dashboard-team").textContent = state.invites.length ? `${state.invites.length} teammate invitation${state.invites.length === 1 ? "" : "s"} prepared, not sent. ${state.invites.map((invite) => `${invite.email} (${invite.role})`).join("; ")}` : "Your space for now. Add your people when the time is right.";
    document.querySelector("#dashboard-preferences").textContent = `${state.preferences.theme} theme · ${state.preferences.shortcuts ? "Keyboard shortcuts on" : "Keyboard shortcuts off"} · Email tips ${state.preferences.tips ? "opted in (demo)" : "off"}`;
    renderTasks();
};
const render = (focus = false) =>
{
    document.querySelector("#setup").hidden = state.phase !== "setup";
    document.querySelector("#completion").hidden = state.phase !== "completion";
    document.querySelector("#dashboard").hidden = state.phase !== "dashboard";
    document.querySelectorAll(".step").forEach((step) => step.hidden = Number(step.dataset.step) !== state.step);
    document.querySelectorAll("#progress li").forEach((step, index) =>
    {
        step.classList.toggle("done", index + 1 < state.step);
        if (index + 1 === state.step) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
        step.querySelector("span").textContent = index + 1 < state.step ? "✓" : index + 1;
    });
    document.querySelector("#step-label").textContent = `STEP ${state.step} OF 4`;
    document.querySelector("#progress-fill").style.width = `${state.step * 25}%`;
    document.querySelector("#back").hidden = state.step === 1;
    document.querySelector("#first-step-note").hidden = state.step !== 1;
    document.querySelector("#skip").hidden = ![2, 4].includes(state.step);
    document.querySelector("#skip").textContent = state.step === 2 ? "I’ll do this later" : "Skip for now";
    document.querySelector("#continue").innerHTML = state.step === 4 ? "Finish setup <span>✓</span>" : "Continue <span>→</span>";
    document.querySelector("#workspace").value = state.workspace;
    document.querySelector("#role").value = state.role;
    document.querySelector("#project-name").value = state.project;
    renderInvites();
    renderTemplate();
    renderPreferences();
    if (state.phase === "completion") renderSummary();
    if (state.phase === "dashboard") renderDashboard();
    escapeError();
    if (focus)
    {
        const heading = document.querySelector(state.phase === "setup" ? `.step[data-step="${state.step}"] h2` : `#${state.phase} h2`);
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        document.querySelector("#setup").scrollIntoView({ block: "start", behavior: "instant" });
    }
};
const finish = () =>
{
    state.workspace = state.workspace.trim();
    state.project = state.project.trim();
    if (state.createdTemplate !== state.template)
    {
        state.tasks = templates[state.template].tasks.map((title) => ({ title, done: false }));
        state.createdTemplate = state.template;
    }
    state.phase = "completion";
    save();
    render(true);
    const confetti = document.querySelector("#confetti");
    confetti.replaceChildren();
    for (let index = 0; index < 40; index++)
    {
        const piece = document.createElement("i");
        piece.style.left = `${(index * 37) % 100}%`;
        piece.style.animationDelay = `${(index % 7) * .1}s`;
        confetti.append(piece);
    }
};
document.querySelector("#workspace").addEventListener("input", (event) =>
{
    escapeError();
    state.workspace = event.target.value;
    renderPreview();
});
document.querySelector("#role").addEventListener("change", (event) =>
{
    escapeError();
    state.role = event.target.value;
});
document.querySelector("#project-name").addEventListener("input", (event) =>
{
    escapeError();
    state.project = event.target.value;
});
document.querySelector("#logo-upload").addEventListener("change", async (event) =>
{
    const file = event.target.files[0];
    if (!file) return;
    const status = document.querySelector("#logo-status");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024)
    {
        status.textContent = "Choose a PNG, JPG or WebP image smaller than 2 MB.";
        event.target.value = "";
        return;
    }
    try
    {
        const url = await new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = url;
        await image.decode();
        state.logo = url;
        syncLogo();
        status.textContent = "Logo preview ready. Kept in this browser tab only.";
        save();
    }
    catch
    {
        status.textContent = "That image could not be read. Try another PNG, JPG or WebP.";
    }
});
document.querySelector("#remove-logo").addEventListener("click", () =>
{
    state.logo = "";
    document.querySelector("#logo-upload").value = "";
    document.querySelector("#logo-status").textContent = "Logo removed.";
    syncLogo();
    save();
});
document.querySelector("#add-invite").addEventListener("click", () =>
{
    captureInvites();
    if (state.inviteDraft.length >= 20) return error("This demo supports up to 20 teammates.");
    state.inviteDraft.push({ email: "", role: "Member" });
    renderInvites();
    document.querySelector(".invite-row:last-child input").focus();
});
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
document.querySelector("#bulk-add").addEventListener("click", () =>
{
    captureInvites();
    const text = document.querySelector("#bulk-emails").value;
    const emails = text.split(/[\s,;]+/).map((email) => email.trim().toLowerCase()).filter(Boolean);
    const status = document.querySelector("#bulk-status");
    if (!emails.length || emails.some((email) => !validEmail(email)))
    {
        status.textContent = "Check your list: enter valid email addresses. No addresses were added.";
        return;
    }
    const existing = new Set(state.inviteDraft.map((invite) => invite.email.toLowerCase()));
    const unique = [...new Set(emails)].filter((email) => !existing.has(email));
    if (state.inviteDraft.filter((invite) => invite.email).length + unique.length > 20)
    {
        status.textContent = "This demo supports up to 20 teammates. No addresses were added.";
        return;
    }
    state.inviteDraft = state.inviteDraft.filter((invite) => invite.email);
    state.inviteDraft.push(...unique.map((email) => ({ email, role: "Member" })));
    renderInvites();
    document.querySelector("#bulk-emails").value = "";
    status.textContent = `${unique.length} teammate${unique.length === 1 ? "" : "s"} added. Duplicate addresses were skipped.`;
    save();
});
document.querySelectorAll("[data-template]").forEach((button) => button.addEventListener("click", () =>
{
    state.template = button.dataset.template;
    renderTemplate();
    save();
}));
for (const [id, preference] of [["notify-mentions", "mentions"], ["notify-tasks", "tasks"], ["notify-digest", "digest"], ["shortcuts", "shortcuts"], ["tips", "tips"]])
{
    document.querySelector(`#${id}`).addEventListener("change", (event) =>
    {
        state.preferences[preference] = event.target.checked;
        save();
    });
}
document.querySelectorAll("[data-theme-option]").forEach((button) => button.addEventListener("click", () =>
{
    state.preferences.theme = button.dataset.themeOption;
    renderPreferences();
    save();
}));
document.querySelector("#wizard").addEventListener("submit", (event) =>
{
    event.preventDefault();
    escapeError();
    if (state.step === 1)
    {
        if (!state.workspace.trim()) return error("Give your workspace a name to continue.", document.querySelector("#workspace"));
        if (!state.role) return error("Choose your role to continue.", document.querySelector("#role"));
    }
    if (state.step === 2)
    {
        captureInvites();
        const filled = state.inviteDraft.filter((invite) => invite.email);
        if (!filled.length) return error("Add a teammate, or choose “I’ll do this later”.");
        const invalid = state.inviteDraft.findIndex((invite) => invite.email && !validEmail(invite.email));
        if (invalid >= 0) return error("Check the email address before continuing.", document.querySelectorAll(".invite-row input")[invalid]);
        const unique = new Set(filled.map((invite) => invite.email.toLowerCase()));
        if (unique.size !== filled.length) return error("Each teammate needs a unique email address. Remove duplicate addresses.");
        state.invites = filled.map((invite) => ({ ...invite, email: invite.email.toLowerCase() }));
    }
    if (state.step === 3 && !state.project.trim()) return error("Give your first project a name to continue.", document.querySelector("#project-name"));
    if (state.step === 4) return finish();
    state.step++;
    save();
    render(true);
});
document.querySelector("#back").addEventListener("click", () =>
{
    if (state.step === 2) captureInvites();
    state.step = Math.max(1, state.step - 1);
    save();
    render(true);
});
document.querySelector("#skip").addEventListener("click", () =>
{
    if (state.step === 2)
    {
        captureInvites();
        state.invites = [];
        state.step = 3;
        save();
        render(true);
    }
    else if (state.step === 4)
    {
        state.preferences = fresh().preferences;
        finish();
    }
});
document.querySelector("#dashboard-button").addEventListener("click", () =>
{
    state.phase = "dashboard";
    save();
    render(true);
});
document.querySelector("#edit-setup").addEventListener("click", () =>
{
    state.phase = "setup";
    state.step = 1;
    save();
    render(true);
});
document.querySelector("#task-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = document.querySelector("#new-task");
    if (!input.value.trim()) return;
    state.tasks.push({ title: input.value.trim(), done: false });
    input.value = "";
    save();
    renderTasks();
    document.querySelector("#dashboard-status").textContent = "New task added. A small step forward.";
});
document.querySelector("#reset").addEventListener("click", () =>
{
    sessionStorage.removeItem(key);
    state = fresh();
    for (const id of ["logo-status", "bulk-status", "dashboard-status"]) document.querySelector(`#${id}`).textContent = "";
    for (const id of ["logo-upload", "bulk-emails", "new-task"]) document.querySelector(`#${id}`).value = "";
    document.querySelector(".bulk").open = false;
    render(true);
    document.querySelector("#save-label").textContent = "About 2 minutes";
});
document.querySelector("#help").addEventListener("click", () => info("A little help, whenever you need it.", "Workspace: choose a name and your role.\nTeam: prepare individual or bulk invitations, or skip for now.\nProject: pick a template to preview its starter tasks.\nPersonalize: choose your theme and notification preferences.\n\nThis is a local interactive concept. Progress stays in this browser tab. Nothing is sent to a server."));
document.querySelector("#privacy").addEventListener("click", () => info("Your space stays yours.", "This demo saves your setup, email drafts, logo and task list in this tab’s session storage. Nothing is uploaded or sent. Reset this demo from the dashboard to clear it. Closing the tab ends the session. No analytics, cookies or external resources are used."));
document.querySelector("#terms").addEventListener("click", () => info("A product concept, made to explore.", "TaskFlow is a fictional, browser-only onboarding experience. Invitations, notifications and email subscriptions are previews. No account is created, no payment is requested and no messages are delivered."));
document.querySelectorAll("dialog .close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const tourDialog = document.querySelector("#tour-dialog");
const tour = document.querySelector("#tour");
document.querySelector("#watch-tour").addEventListener("click", () =>
{
    tourDialog.showModal();
    if (!tour.getAttribute("src")) tour.src = tour.dataset.src;
    tour.currentTime = 0;
    tour.play().catch(() => tour.controls = true);
});
tourDialog.addEventListener("close", () => tour.pause());
document.addEventListener("keydown", (event) =>
{
    if (event.key !== "?" || !state.preferences.shortcuts || event.target.matches("input,textarea,select") || document.querySelector("dialog[open]")) return;
    event.preventDefault();
    info("A few useful keys.", "Tab — move between controls\nShift + Tab — move back\nEnter — continue or submit the active form\nSpace — toggle a checkbox or switch\nEscape — close a dialog\n? — open this guide\n\nKeyboard shortcuts can be turned off in Personalize. Standard browser navigation remains available.");
});
render();
