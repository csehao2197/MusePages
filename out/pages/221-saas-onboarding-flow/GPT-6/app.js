const labels = ["Your workspace", "Setup checklist", "A quick tour", "Invite your team", "First project", "Make it yours", "Choose your plan"];
const defaults = { step: 0, workspace: "", role: "Designer", newAccount: false, name: "", email: "", logo: "", invites: [{ email: "", role: "Member" }], project: "", template: 0, tour: 0, notifications: { mentions: true, deadlines: true, digest: false }, theme: "Light", shortcuts: true, lifecycle: { tips: false, nudges: false, billing: true, releases: false }, plan: "free", completed: [], skipped: [] };
let state;
try
{
    state = JSON.parse(sessionStorage.getItem("taskflow-onboarding")) || structuredClone(defaults);
}
catch
{
    state = structuredClone(defaults);
}
if (!Number.isInteger(state.step) || state.step < 0 || state.step > 8 || !Array.isArray(state.completed)) state = structuredClone(defaults);
const form = document.querySelector("#step-form");
const content = document.querySelector("#step-content");
const error = document.querySelector("#error");
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const save = () =>
{
    try
    {
        sessionStorage.setItem("taskflow-onboarding", JSON.stringify(state));
        document.querySelector("#saved").textContent = "PROGRESS SAVED IN THIS TAB";
    }
    catch
    {
        document.querySelector("#saved").textContent = "PROGRESS KEPT FOR THIS VISIT ONLY";
    }
};
const field = (id, label, value = "", type = "text") => `<label class="field">${label}<input id="${id}" type="${type}" value="${esc(value)}" ${type === "password" ? 'autocomplete="new-password"' : ""}></label>`;
const templateNames = ["Blank Project", "Marketing Campaign", "Product Launch", "Software Development", "Client Project"];
const templateTasks = [[], ["Write campaign brief", "Plan channels", "Review results"], ["Define positioning", "Build landing page", "Launch checklist"], ["Plan sprint", "Build feature", "QA and release"], ["Client kickoff", "Create first draft", "Collect feedback"]];
const tours =
[
    ["Dashboard", "Your day, at a glance. No projects yet? Your first project will bring this overview to life."],
    ["Projects", "Give every goal a home. Start blank or pick a template to get a little momentum."],
    ["Tasks", "Small steps make big things happen. Add an owner and a date so everyone knows what’s next."],
    ["Integrations", "Bring your favorite tools along. Connect apps in the full product after workspace setup."],
    ["Reports", "See the story behind the work. Reports will fill in as your team completes its first tasks."],
    ["Settings", "Make this space yours. Manage your team, preferences and billing in one place."]
];
function applyTheme()
{
    document.body.classList.toggle("dark", state.theme === "Dark" || state.theme === "System" && matchMedia("(prefers-color-scheme: dark)").matches);
}
function capture()
{
    if (state.step === 0)
    {
        state.workspace = document.querySelector("#workspace").value.trim();
        state.role = document.querySelector("#role").value;
        state.newAccount = document.querySelector("#new-account").checked;
        state.name = document.querySelector("#name")?.value.trim() || "";
        state.email = document.querySelector("#email")?.value.trim() || "";
    }
    if (state.step === 3)
    {
        state.invites = [...document.querySelectorAll(".invite-row")].map((row) => ({ email: row.querySelector("input").value.trim(), role: row.querySelector("select").value }));
    }
    if (state.step === 4) state.project = document.querySelector("#project").value.trim();
    if (state.step === 5)
    {
        Object.keys(state.notifications).forEach((key) => state.notifications[key] = document.getElementById(`notify-${key}`).checked);
        Object.keys(state.lifecycle).forEach((key) => state.lifecycle[key] = document.getElementById(`email-${key}`).checked);
        state.theme = document.querySelector("#theme").value;
        state.shortcuts = document.querySelector("#shortcuts").checked;
    }
}
function render()
{
    applyTheme();
    const step = state.step;
    document.querySelector("#step-list").innerHTML = labels.map((label, index) => `<li class="step-item ${index === step ? "active" : ""} ${state.completed.includes(index) ? "complete" : ""}"><span>${state.completed.includes(index) ? "✓" : index + 1}</span><div>${label}${state.skipped.includes(index) ? "<small>Skipped for now</small>" : ""}</div></li>`).join("");
    document.querySelector("#step-count").textContent = step < 7 ? `STEP ${step + 1} OF 7` : step === 7 ? "SETUP COMPLETE" : "YOUR WORKSPACE";
    document.querySelector("#progress").style.width = `${Math.min(7, step + 1) / 7 * 100}%`;
    document.querySelector("#back").hidden = step === 0 || step > 6;
    document.querySelector("#skip").hidden = ![2, 3, 4].includes(step);
    document.querySelector("#continue").textContent = step === 6 ? "Finish setup ↗" : step === 7 ? "Go to Dashboard ↗" : step === 8 ? "Create a project ↗" : "Continue ↗";
    document.querySelector("#continue").disabled = false;
    error.textContent = "";
    document.querySelector("#step-icon").textContent = ["↗", "✓", "▦", "+", "⊞", "◐", "◈", "✓", "▦"][step];
    document.querySelector("#step-kicker").textContent = ["FIRST, A PLACE TO CALL YOUR OWN", "A LITTLE CLARITY BEFORE WE BEGIN", "LET’S TAKE A LOOK AROUND", "GOOD WORK IS A TEAM SPORT", "TURN AN IDEA INTO A LITTLE MOMENTUM", "A WORKSPACE THAT FEELS LIKE YOU", "ROOM TO GROW AT YOUR OWN PACE", "A FRESH START, READY WHEN YOU ARE", "YOUR NEXT GREAT THING STARTS HERE"][step];
    document.querySelector("#step-title").textContent = ["Welcome to TaskFlow!", "Your path to good work.", "Meet your new workspace.", "Invite your team members", "Create your first project", "Customize your experience", "A plan for your next chapter.", "You’re all set!", `Welcome, ${state.workspace || "your workspace"}.`][step];
    document.querySelector("#step-description").textContent = ["Let’s set up your workspace in 2 minutes. Start with a name that feels like your team.", "Here’s what we’ll cover before the dashboard. Optional steps can be finished later.", "Six useful places. One calmer way to work. This lightweight tour uses sample content.", "Bring your favorite collaborators along. Invitations here are prepared locally, never sent.", "Start with a blank canvas or borrow a little structure. You can always change it later.", "A few preferences to make work feel a little more natural.", "Choose a starting point. Change plans later. This demo collects no payment details.", "The foundations are in place. Now make something worth showing up for.", state.project ? "Your local project preview is ready. This is sample workspace data, not a live account." : "A blank canvas is a good place to begin. Create a project when you’re ready."][step];
    if (step === 0)
    {
        content.innerHTML = `${field("workspace", "Workspace name", state.workspace)}<label class="field">Your role<select id="role">${["Founder", "Manager", "Developer", "Designer", "Other"].map((role) => `<option ${state.role === role ? "selected" : ""}>${role}</option>`).join("")}</select></label><label class="field">Workspace logo <small>Optional · PNG, JPG or SVG · 2 MB max · filename only</small><input type="file" id="logo" accept="image/png,image/jpeg,image/svg+xml"><small id="logo-status">${esc(state.logo || "Make it yours later, too.")}</small></label><label class="check"><input id="new-account" type="checkbox" ${state.newAccount ? "checked" : ""}>I’m new — include account details</label><div id="account-fields" class="account-fields" ${state.newAccount ? "" : "hidden"}>${field("name", "Full name", state.name)}${field("email", "Work email", state.email, "email")}${field("password", "Sample password (12+ characters)", "", "password")}<label class="check"><input id="terms" type="checkbox">I accept the illustrative demo terms. No account is created.</label></div>`;
        document.querySelector("#new-account").addEventListener("change", (event) => document.querySelector("#account-fields").hidden = !event.target.checked);
        document.querySelector("#logo").addEventListener("change", (event) =>
        {
            const file = event.target.files[0];
            if (file && (file.size > 2 * 1024 * 1024 || !["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)))
            {
                error.textContent = "Choose a PNG, JPG or SVG under 2 MB.";
                event.target.value = "";
                return;
            }
            state.logo = file?.name || "";
            document.querySelector("#logo-status").textContent = file ? `${file.name} selected locally; no upload.` : "Make it yours later, too.";
            save();
        });
    }
    if (step === 1)
    {
        content.innerHTML = [["Workspace setup", state.workspace], ["First project", state.project], ["First teammate", state.invites.some((invite) => invite.email)], ["Notification preferences", state.completed.includes(5)], ["Billing status", state.completed.includes(6)]].map(([label, done]) => `<div class="checklist-row ${done ? "done" : ""}"><b>${label}</b><span>${done ? "Ready locally" : "Coming up"}</span></div>`).join("") + '<p class="billing-note">Continue to the tour, then invite, create and personalize. Finish setup stays available in the side checklist.</p>';
    }
    if (step === 2)
    {
        content.innerHTML = '<div id="tour"></div><div class="tour-actions"><button type="button" id="tour-back">← Back</button><span id="tour-count"></span><button type="button" id="tour-next">Next →</button></div><button type="button" id="restart-tour">Restart tour</button>';
        const tour = () =>
        {
            const [title, copy] = tours[state.tour];
            document.querySelector("#tour").innerHTML = `<div class="tour-preview"><small>YOUR WORKSPACE / ${title.toUpperCase()}</small><h3>${title}</h3><p>${copy}</p><div class="tour-lines" aria-hidden="true"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:100%"></i></div></div>`;
            document.querySelector("#tour-count").textContent = `${state.tour + 1} / 6`;
            document.querySelector("#tour-back").disabled = state.tour === 0;
            document.querySelector("#tour-next").disabled = state.tour === 5;
            save();
        };
        document.querySelector("#tour-next").addEventListener("click", () => { state.tour = Math.min(5, state.tour + 1); tour(); });
        document.querySelector("#tour-back").addEventListener("click", () => { state.tour = Math.max(0, state.tour - 1); tour(); });
        document.querySelector("#restart-tour").addEventListener("click", () => { state.tour = 0; tour(); });
        tour();
    }
    if (step === 3)
    {
        content.innerHTML = '<div id="invites"></div><button type="button" id="add-invite">+ Add another</button><label class="field">Or paste multiple emails<textarea id="bulk" placeholder="alex@studio.com, jamie@studio.com"></textarea><small>Separate with commas, spaces or new lines.</small></label><button type="button" id="add-bulk">Add bulk emails</button>';
        const invites = () =>
        {
            document.querySelector("#invites").innerHTML = state.invites.map((invite, index) => `<div class="invite-row"><input type="email" aria-label="Teammate email ${index + 1}" placeholder="teammate@company.com" value="${esc(invite.email)}"><select aria-label="Teammate role ${index + 1}">${["Admin", "Member", "Viewer"].map((role) => `<option ${invite.role === role ? "selected" : ""}>${role}</option>`).join("")}</select><button type="button" data-remove="${index}" aria-label="Remove invite ${index + 1}">×</button></div>`).join("");
        };
        document.querySelector("#add-invite").addEventListener("click", () => { capture(); state.invites.push({ email: "", role: "Member" }); invites(); });
        document.querySelector("#invites").addEventListener("click", (event) =>
        {
            const remove = event.target.closest("[data-remove]");
            if (!remove) return;
            capture();
            state.invites.splice(Number(remove.dataset.remove), 1);
            invites();
        });
        document.querySelector("#add-bulk").addEventListener("click", () =>
        {
            capture();
            const emails = document.querySelector("#bulk").value.split(/[\s,;]+/).filter(Boolean);
            if (emails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
            {
                error.textContent = "Check your bulk list — one or more email addresses are invalid.";
                return;
            }
            const seen = new Set(state.invites.map((invite) => invite.email.toLowerCase()));
            emails.forEach((email) =>
            {
                if (!seen.has(email.toLowerCase())) state.invites.push({ email, role: "Member" });
                seen.add(email.toLowerCase());
            });
            state.invites = state.invites.filter((invite) => invite.email);
            document.querySelector("#bulk").value = "";
            error.textContent = "";
            invites();
            save();
        });
        invites();
    }
    if (step === 4)
    {
        content.innerHTML = `${field("project", "Project name", state.project)}<div class="field">Choose a starting point</div><div class="template-grid">${templateNames.map((name, index) => `<button type="button" class="template" data-template="${index}" aria-pressed="${state.template === index}"><b>${name}</b><small>${templateTasks[index].join(" · ") || "A clean slate for your next idea."}</small></button>`).join("")}</div><div class="template-preview" id="template-preview"></div>`;
        const preview = () =>
        {
            document.querySelector("#template-preview").innerHTML = `<b>${templateNames[state.template]} includes</b>${templateTasks[state.template].map((task) => `<p>□ ${task}</p>`).join("") || "<p>No tasks yet. Add your first small step after setup.</p>"}`;
        };
        document.querySelectorAll("[data-template]").forEach((button) => button.addEventListener("click", () =>
        {
            state.template = Number(button.dataset.template);
            document.querySelectorAll("[data-template]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
            preview();
            save();
        }));
        preview();
    }
    if (step === 5)
    {
        const check = (prefix, key, label, value) => `<label class="check"><input type="checkbox" id="${prefix}-${key}" ${value ? "checked" : ""}>${label}</label>`;
        content.innerHTML = `<div class="preference-group"><b>Keep me in the loop</b>${Object.entries({ mentions: "Mentions and assignments", deadlines: "Approaching deadlines", digest: "Weekly activity digest" }).map(([key, label]) => check("notify", key, label, state.notifications[key])).join("")}</div><label class="field">Theme<select id="theme">${["Light", "Dark", "System"].map((theme) => `<option ${state.theme === theme ? "selected" : ""}>${theme}</option>`).join("")}</select></label><label class="check"><input id="shortcuts" type="checkbox" ${state.shortcuts ? "checked" : ""}>Enable keyboard shortcuts <small>(Alt + → to continue)</small></label><div class="preference-group"><b>Email preferences</b>${Object.entries({ tips: "Get product tips via email", nudges: "Onboarding nudges", billing: "Billing reminders", releases: "Release notes" }).map(([key, label]) => check("email", key, label, state.lifecycle[key])).join("")}<p class="billing-note">Opt-ins are saved locally; no mailing list subscription is created.</p></div>`;
        document.querySelector("#theme").addEventListener("change", () => { capture(); applyTheme(); save(); });
    }
    if (step === 6)
    {
        content.innerHTML = `<div class="plans">${[["free", "Free trial", "$0", "14 days · then Free"], ["team", "Team", "$12", "per seat / month"], ["usage", "Usage", "$0.02", "per automation run"]].map(([id, title, price, detail]) => `<button type="button" class="plan" data-plan="${id}" aria-pressed="${state.plan === id}"><b>${title}</b><strong>${price}</strong><small>${detail}</small></button>`).join("")}</div><div id="billing-summary" class="summary"></div><p class="billing-note">Illustrative billing only. Paid choices prepare a handoff, not a charge. You can change plans later. No payment information is collected.</p><button id="free-plan" type="button">Continue on free plan</button>`;
        const billing = () =>
        {
            const seats = 1 + state.invites.filter((invite) => invite.email).length;
            const date = new Date();
            date.setDate(date.getDate() + 14);
            document.querySelector("#billing-summary").innerHTML = `<p><span>Plan</span><b>${state.plan === "free" ? "14-day trial → Free" : state.plan === "team" ? "Team" : "Usage-based"}</b></p><p><span>Workspace seats</span><b>${seats}</b></p><p><span>Estimated monthly</span><b>${state.plan === "team" ? "$" + seats * 12 : state.plan === "usage" ? "$20 / 1,000 runs" : "$0"}</b></p><p><span>${state.plan === "free" ? "Trial ends" : "Example next billing date"}</span><b>${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</b></p><p><span>Payment status</span><b>Not connected</b></p>`;
        };
        document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
        {
            state.plan = button.dataset.plan;
            document.querySelectorAll("[data-plan]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
            billing();
            save();
        }));
        document.querySelector("#free-plan").addEventListener("click", () =>
        {
            state.plan = "free";
            complete();
        });
        billing();
    }
    if (step === 7)
    {
        content.innerHTML = `<div class="celebration" aria-hidden="true">✦ · ✓ · ✦</div><div class="completion-summary"><p><b>${esc(state.workspace)}</b> · ${esc(state.role)}</p><p>${state.project ? esc(state.project) + " · " + templateNames[state.template] : "No project yet — your canvas is ready."}</p><p>${state.invites.filter((invite) => invite.email).length} local invitations prepared · none sent</p><p>${state.theme} theme · ${state.plan === "free" ? "Free" : state.plan} plan preview</p><p>${state.skipped.length} optional steps saved for later</p></div><button id="watch-video" type="button">Watch getting started video ↗</button>`;
        document.querySelector("#watch-video").addEventListener("click", () => showDialog("Your five-minute starting guide", "Video alternative: 1. Open your project. 2. Add a task and owner. 3. Move work across the board. 4. Review the activity feed together. This text walkthrough replaces a hosted video in the static demo."));
    }
    if (step === 8)
    {
        content.innerHTML = `<div class="dashboard-empty"><h3>${state.project ? esc(state.project) : "Your first idea belongs here."}</h3><p>${state.project ? templateTasks[state.template].map(esc).join(" · ") || "No tasks yet. Add your first small step." : "Create a project to give your team a shared starting point."}</p><p>${state.invites.filter((invite) => invite.email).length} demo teammates · no invitations sent</p></div>`;
    }
    save();
}
function validate()
{
    if (state.step === 0)
    {
        if (state.workspace.length < 2) return "Give your workspace a name with at least two characters.";
        if (state.newAccount)
        {
            if (state.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return "Add your name and a valid work email.";
            if (document.querySelector("#password").value.length < 12) return "Use a sample password with at least 12 characters.";
            if (!document.querySelector("#terms").checked) return "Accept the illustrative terms to continue.";
        }
    }
    if (state.step === 3)
    {
        const emails = state.invites.filter((invite) => invite.email).map((invite) => invite.email.toLowerCase());
        if (emails.length === 0) return "Add a teammate email or choose Skip for now.";
        if (emails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return "Check each teammate’s email address.";
        if (new Set(emails).size !== emails.length) return "Each teammate needs a unique email address.";
    }
    if (state.step === 4 && state.project.length < 2) return "Name your project, or skip and start with an empty workspace.";
    return "";
}
async function complete()
{
    const step = state.step;
    if (step < 7 && !state.completed.includes(step)) state.completed.push(step);
    state.skipped = state.skipped.filter((value) => value !== step);
    const button = document.querySelector("#continue");
    button.disabled = true;
    button.textContent = "Saving locally…";
    await new Promise((resolve) => setTimeout(resolve, 300));
    state.step = step === 8 ? 4 : step + 1;
    render();
}
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    capture();
    const message = validate();
    if (message)
    {
        error.textContent = message;
        return;
    }
    complete();
});
document.querySelector("#back").addEventListener("click", () => { capture(); state.step = Math.max(0, state.step - 1); render(); });
document.querySelector("#skip").addEventListener("click", () =>
{
    capture();
    if (state.step === 3) state.invites = [];
    if (state.step === 4) state.project = "";
    if (!state.skipped.includes(state.step)) state.skipped.push(state.step);
    state.step++;
    render();
});
const dialog = document.querySelector("dialog");
function showDialog(title, copy)
{
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-copy").textContent = copy;
    document.querySelector("#dialog-action").textContent = "Got it";
    document.querySelector("#dialog-action").onclick = () => dialog.close();
    dialog.showModal();
}
document.querySelector("#restart").addEventListener("click", () =>
{
    showDialog("A fresh start?", "Restarting clears only this demo’s onboarding progress in the current tab.");
    document.querySelector("#dialog-action").textContent = "Restart setup";
    document.querySelector("#dialog-action").onclick = () => { state = structuredClone(defaults); dialog.close(); render(); };
});
document.querySelector("#dialog-action").addEventListener("click", () => {});
document.querySelector("#help").addEventListener("click", () => showDialog("A friendly nudge", "Start with a workspace name, follow the tour, and choose which optional steps to complete. Invites, billing and account creation are local previews; no support message is sent."));
document.querySelector("#finish-setup").addEventListener("click", () =>
{
    capture();
    state.step = !state.workspace ? 0 : labels.findIndex((_, index) => !state.completed.includes(index) && !state.skipped.includes(index));
    if (state.step < 0) state.step = 7;
    render();
});
document.addEventListener("keydown", (event) =>
{
    if (event.altKey && event.key === "ArrowRight" && state.shortcuts)
    {
        event.preventDefault();
        form.requestSubmit();
    }
});
render();
