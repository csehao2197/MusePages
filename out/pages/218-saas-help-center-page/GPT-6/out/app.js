const icons =
[
    '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2m1.5-4-3-3s3-9 13-9c0 10-9 13-9 13Zm0 0 3 3m-7-7-3-1 4-4 3 1m5 5 1 3-4 4-1-3"/><circle cx="15" cy="8" r="1.5"/>',
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20M6 15h3"/>',
    '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
    '<path d="M8 3v5m8-5v5M5 8h14v4a7 7 0 0 1-14 0Zm7 11v3"/>',
    '<path d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-6 6a2 2 0 0 0 3 3l6-6a5 5 0 0 0 6.4-6.4l-3 3-3-3Z"/>'
];
const categories =
[
    ["Getting Started", "From hello to your first workspace."],
    ["Account & Billing", "Your account, plans and payments."],
    ["Projects & Tasks", "Turn the plan into a little progress."],
    ["Team & Collaboration", "Make good things happen together."],
    ["Integrations", "Bring your favorite tools along."],
    ["Troubleshooting", "A quick fix for the unexpected."]
];
const guides =
[
    ["create-workspace", "Create your first workspace", 0, 4, "A fresh space for your team’s best work.", ["Choose Create workspace from the workspace switcher.", "Give it a clear name, like Studio North, and choose a timezone.", "Invite teammates by work email, or skip this step for now.", "Choose a project template and add your first task."], "A workspace brings projects, people and shared settings together. You can belong to more than one workspace.", "workspace-name: Studio North\ntimezone: Europe/London\nvisibility: invite-only"],
    ["reset-password", "Reset your password", 1, 2, "Get back to your work, safely.", ["Select Forgot password on the sign-in page.", "Enter the email address linked to your Folio account.", "Open the newest reset email and use the link within 30 minutes.", "Choose a unique password and sign in again."], "If you use single sign-on, your identity provider manages password resets. Contact your organization’s administrator.", "Password checklist\n• At least 12 characters\n• Unique to this account\n• Stored in a password manager"],
    ["invite-team", "Invite your team to Folio", 3, 3, "The right people, in the right place.", ["Open Workspace settings, then Members.", "Select Invite teammates and enter their email addresses.", "Choose Member or Guest access and review permissions.", "Send the invitations. Pending invitations appear in Members."], "Guests only see the projects explicitly shared with them. Invitations expire after seven days.", "Owner → workspace settings and billing\nMember → team projects\nGuest → explicitly shared projects"],
    ["connect-slack", "Connect Folio with Slack", 4, 5, "Keep important project updates in the conversation.", ["Open Workspace settings → Integrations → Slack.", "Select Connect Slack and review the requested permissions.", "Choose a channel for project notifications.", "Send a test notification and save your preferences."], "Only a workspace owner can authorize a connection. This knowledge-base demo does not perform OAuth or send Slack messages.", "Notification example\nProject: Website launch\nEvent: Task completed\nChannel: #launch-team"],
    ["project-boards", "Organize tasks with project boards", 2, 4, "A clear view of what’s moving and what’s next.", ["Open a project and select Board view.", "Add columns for To do, In progress and Done.", "Create tasks with a clear title, owner and due date.", "Move a task to its new column as the work progresses."], "Use filters to focus on one owner or priority. Changing your personal filter does not change anyone else’s view.", "To do → In progress → Review → Done\nSuggested fields: Owner, Priority, Due date"],
    ["sync-fix", "Fix a workspace that is not syncing", 5, 3, "A few checks to get things moving again.", ["Check your internet connection and refresh the browser.", "Open Folio in a private window to check extensions.", "Confirm that your browser is up to date.", "If the issue persists, contact support with a redacted error message."], "Keep unsaved text in a separate note before refreshing. Never send passwords, tokens or private customer data to support.", "Useful support details\nBrowser and version:\nTime of the issue (with timezone):\nSteps to reproduce:\nRedacted error message:"],
    ["import-csv", "Import a task list from CSV", 0, 4, "Bring your existing work into Folio.", ["Prepare a UTF-8 CSV with a Task name column.", "Open your project and select Import → CSV.", "Map each column to a field and review the preview.", "Confirm the import after checking a few sample rows."], "The sample import limit is 20 MB. Dates should use YYYY-MM-DD to avoid ambiguity.", 'Task name,Owner,Due date\n"Review homepage",Alex,2026-11-20'],
    ["billing-plan", "Understand your plan and billing", 1, 4, "A clear view of seats, renewals and invoices.", ["Open Workspace settings → Billing as an owner.", "Review your plan, seat count and renewal date.", "Download an invoice or update your payment method.", "Review the prorated total before confirming a plan change."], "Plan downgrades take effect at renewal. Contact support if an invoice does not match your workspace seat count.", "Invoice summary\nPlan: Pro\nBilling: Monthly\nSeats: 8"],
    ["task-dependencies", "Link tasks and dependencies", 2, 5, "Make the order of work clear.", ["Open a task and choose Dependencies.", "Select the task that needs to be completed first.", "Check the timeline for scheduling conflicts.", "Notify the owner when a blocking task is ready."], "A dependency explains sequence; it does not automatically complete a task. Avoid circular dependency chains.", "Brand approval → Landing page build → Launch review"],
    ["team-permissions", "Choose the right team permissions", 3, 4, "Give people the access they need.", ["Open Members from Workspace settings.", "Review each teammate’s current role.", "Choose a new role and inspect its capabilities.", "Save changes and review guest access each quarter."], "At least one owner must remain. Transfer ownership before removing an owner’s account.", "Access review\nOwners: billing and settings\nMembers: team work\nGuests: shared projects"],
    ["api-token", "Create a scoped API token", 4, 6, "Connect thoughtfully, with the smallest set of permissions.", ["Open Personal settings → Developer tokens.", "Name your token and choose the necessary scopes.", "Set an expiry date and generate the token.", "Store the token securely; rotate it before expiry."], "This static guide never issues tokens. The example uses a placeholder, not a credential.", "GET /v1/projects\nAuthorization: Bearer YOUR_SCOPED_TOKEN"],
    ["notification-fix", "Troubleshoot missing notifications", 5, 3, "Find the setting that keeps you in the loop.", ["Check Inbox filters for unread or assigned updates.", "Review Personal settings → Notifications.", "Check email spam folders and quiet hours.", "Ask an owner to verify access to the project."], "Browser notifications require permission. Team mentions only reach people who can access that project.", "Notification checklist\nEmail: enabled\nMentions: enabled\nQuiet hours: 18:00–09:00"]
];
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const articleLink = (guide) => `article.html?guide=${guide[0]}`;
const search = document.querySelector("#search");
if (search)
{
    let category = null;
    let all = false;
    function render()
    {
        const term = search.value.trim().toLowerCase();
        const selected = guides.filter((guide) => (category === null || guide[2] === category) && `${guide[1]} ${guide[4]} ${guide[5].join(" ")}`.toLowerCase().includes(term));
        const visible = all || term || category !== null ? selected : selected.slice(0, 6);
        document.querySelector("#list-title").textContent = term ? "Search results" : category !== null ? categories[category][0] : all ? "All articles" : "Most viewed articles";
        document.querySelector("#results").textContent = `${visible.length} articles${category !== null ? " in " + categories[category][0] : ""}`;
        document.querySelector("#empty").hidden = visible.length > 0;
        document.querySelector("#article-list").innerHTML = visible.map((guide) => `<a class="article-link" href="${articleLink(guide)}"><b>${esc(guide[1])}</b><span class="tag">${categories[guide[2]][0]}</span><small>${guide[3]} min read</small><span>↗</span></a>`).join("");
    }
    document.querySelector("#categories").innerHTML = categories.map(([title, copy], index) => `<button class="category" data-category="${index}"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[index]}</svg><b>${title}</b><p>${copy}</p><small>${guides.filter((guide) => guide[2] === index).length} articles <span>↗</span></small></button>`).join("");
    document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () =>
    {
        category = Number(button.dataset.category);
        all = true;
        search.value = "";
        render();
        document.querySelector("#articles").scrollIntoView();
    }));
    search.addEventListener("input", () =>
    {
        category = null;
        render();
    });
    document.querySelectorAll("[data-search]").forEach((button) => button.addEventListener("click", () =>
    {
        category = null;
        search.value = button.dataset.search;
        render();
        document.querySelector("#articles").scrollIntoView();
    }));
    const reset = () =>
    {
        category = null;
        search.value = "";
        all = true;
        render();
    };
    document.querySelector("#all").addEventListener("click", reset);
    document.querySelector("#reset").addEventListener("click", reset);
    render();
    const dialog = document.querySelector("dialog");
    const open = (title) =>
    {
        document.querySelector("#support-title").textContent = title;
        document.querySelector("#support-copy").textContent = title === "Status page" ? "Illustrative status: workspace, search and integrations operational. This preview does not monitor a live service." : title === "API docs" ? "API preview: GET /v1/projects lists accessible projects with cursor pagination. Read the scoped API token article for safe access patterns." : title === "Community forum" ? "Community preview: Workflow recipes, Ask a teammate and Product ideas. Tell us which topic interests you; this demo has no live forum." : title === "Live chat" ? "Live chat hours: Monday–Friday, 9am–6pm UTC. This local demo prepares your question without connecting to an agent." : title === "Urgent support" ? "For production outages, your account’s emergency support channel is the right route. This demo is not monitored; no emergency message is sent." : "We usually respond within one business day in the full product. This local demo prepares a request without sending any message.";
        document.querySelector("#support-status").textContent = "";
        document.querySelector("#support-form").reset();
        dialog.showModal();
    };
    document.querySelectorAll("[data-support]").forEach((button) => button.addEventListener("click", () => open(button.dataset.support)));
    document.querySelector("#support-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        document.querySelector("#support-status").textContent = "Your demo request is ready. No message was sent; this service is not monitored.";
    });
    if (location.hash === "#support-dialog") open("Contact support");
}
else
{
    const guide = guides.find((entry) => entry[0] === new URLSearchParams(location.search).get("guide")) || guides[0];
    const [id, title, category, minutes, intro, steps, details, code] = guide;
    document.title = `${title} — Folio Help`;
    document.querySelector("#crumb-category").textContent = categories[category][0];
    document.querySelector("#article-content").innerHTML = `<div class="eyebrow">${categories[category][0].toUpperCase()}</div><h1>${title}</h1><p class="article-meta">Updated November 10, 2026 · ${minutes} min read · Folio support</p><p>${intro}</p><h2 id="overview">The essentials</h2><p>${details}</p><div class="callout"><b>Good to know</b><br>This is an illustrative product guide. The steps describe the full product concept; this standalone help center does not change a real account.</div><h2 id="steps">Step by step</h2><ol>${steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><figure class="screen-art" role="img" aria-label="Illustrative Folio settings screenshot"><div><b>folio / ${categories[category][0]}</b><span>${esc(steps[0])}</span><span>${esc(steps[1])}</span><span>Review changes & continue →</span></div><figcaption>Illustrated product view · ${title}</figcaption></figure><h2 id="details">A little more detail</h2><h3>A useful reference</h3><p>Keep this checklist close as you work through the setup.</p><pre><code>${esc(code)}</code></pre><div class="callout warning"><b>Take a moment</b><br>Review permissions and keep a copy of unsaved work before making account or workspace changes. Share redacted details with support.</div><h2 id="next">What’s next?</h2><ul><li>Check the result in your workspace before sharing it with your team.</li><li>Keep your team’s permissions and preferences up to date.</li><li>Use the related guides below for your next step.</li></ul><div class="callout tip"><b>A friendly tip</b><br>Share this article’s URL with a teammate so you can follow the same steps together.</div>`;
    document.querySelector("#related").innerHTML = "<h3>Keep exploring</h3>" + guides.filter((entry) => entry[0] !== id && (entry[2] === category || entry[2] === 0)).slice(0, 3).map((entry) => `<a href="${articleLink(entry)}">${entry[1]} ↗</a>`).join("");
    document.querySelectorAll("[data-helpful]").forEach((button) => button.addEventListener("click", () =>
    {
        document.querySelectorAll("[data-helpful]").forEach((vote) => vote.setAttribute("aria-pressed", String(vote === button)));
        document.querySelector("#feedback-status").textContent = button.dataset.helpful === "yes" ? "Thank you! Feedback noted for this visit." : "Thanks for letting us know. Contact support for a more specific answer.";
    }));
}
