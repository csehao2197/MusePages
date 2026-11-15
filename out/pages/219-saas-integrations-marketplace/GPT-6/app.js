const apps =
[
    ["slack", "Slack", "Communication", "Get project notifications in your Slack channels.", "Official", "Free", 24800, "#", "#f0e4f0", "#6f376e", 4.9],
    ["github", "GitHub", "Development", "Link commits and pull requests to the work behind them.", "Official", "Free", 19200, "GH", "#ecedef", "#252c38", 4.8],
    ["drive", "Google Drive", "File Storage", "Bring your documents right into the conversation.", "Official", "Free", 17600, "G", "#e7f1e8", "#3a8b61", 4.8],
    ["zapier", "Zapier", "Other", "Connect TaskFlow to 3,000+ apps with no-code automations.", "Official", "Premium", 14300, "✳", "#ffeddd", "#d26a30", 4.7],
    ["figma", "Figma", "Development", "Embed live designs and keep feedback in context.", "Official", "Free", 12800, "F", "#fae9e4", "#bc614d", 4.9],
    ["jira", "Jira", "Development", "Keep tasks and issues in sync in both directions.", "Official", "Premium", 10900, "J", "#e6edff", "#406dc5", 4.6],
    ["zoom", "Zoom", "Communication", "Turn a task into a meeting with a little less effort.", "Official", "Free", 9800, "Z", "#e6f1ff", "#3a78ca", 4.7],
    ["notion", "Notion", "File Storage", "Import pages and export project notes to your wiki.", "Community", "Free", 8600, "N", "#efefec", "#323e37", 4.5],
    ["gcal", "Google Calendar", "Calendar", "Make space for your task deadlines on the calendar.", "Official", "Free", 7900, "31", "#e9f1fb", "#4b79b9", 4.7],
    ["outlook", "Outlook Calendar", "Calendar", "Bring project milestones into your working week.", "Community", "Premium", 5400, "O", "#e7f1fa", "#3c83aa", 4.4],
    ["amplitude", "Amplitude", "Analytics", "Turn product events into actionable team insights.", "Community", "Premium", 3600, "A", "#eae8ff", "#6a64ad", 4.6],
    ["looker", "Looker Studio", "Analytics", "Make project progress part of your reporting.", "Community", "Free", 2800, "L", "#e6effc", "#527ab6", 4.3],
    ["mailchimp", "Mailchimp", "Marketing", "Keep campaign checklists aligned with your sends.", "Official", "Premium", 3100, "M", "#fff3c8", "#8e772e", 4.6],
    ["hubspot", "HubSpot", "Marketing", "Connect customer handoffs with your team’s projects.", "Official", "Premium", 4400, "H", "#ffede2", "#d57a4c", 4.5],
    ["discord", "Discord", "Communication", "Share a little project momentum with your community.", "Community", "Free", 1700, "D", "#eaeaff", "#6c6cad", 4.4],
    ["webhooks", "Webhooks", "Other", "Build your own connection with signed event payloads.", "Official", "Free", 1200, "{ }", "#e4f2ee", "#388f77", 4.7]
].map((row, index) => ({ id: row[0], name: row[1], category: row[2], description: row[3], author: row[4], price: row[5], installs: row[6], logo: row[7], bg: row[8], color: row[9], rating: row[10], added: index }));
const categories = ["All integrations", "Communication", "Development", "File Storage", "Calendar", "Analytics", "Marketing", "Other"];
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
let installed;
try
{
    installed = new Set(JSON.parse(localStorage.getItem("taskflow-demo-connections") || "[]"));
}
catch
{
    installed = new Set();
}
let category = "All integrations";
const icon = (app) => `<span class="app-icon" style="--app-bg:${app.bg};--app-color:${app.color}" aria-hidden="true">${app.logo}</span>`;
document.querySelector("#categories").innerHTML = categories.map((name) => `<button data-category="${name}" aria-pressed="${name === category}">${name}<span>${name === "All integrations" ? apps.length : apps.filter((app) => app.category === name).length}</span></button>`).join("");
document.querySelector("#featured-list").innerHTML = apps.slice(0, 3).map((app) => `<button class="featured-card" data-detail="${app.id}"><div>${icon(app)}<b>${app.name}</b></div><p>${app.description}</p><span>Explore integration ↗</span></button>`).join("");
function render()
{
    const term = document.querySelector("#search").value.trim().toLowerCase();
    const prices = ["free", "premium"].filter((id) => document.getElementById(id).checked);
    const authors = ["official", "community"].filter((id) => document.getElementById(id).checked);
    const filtered = apps.filter((app) => (category === "All integrations" || category === app.category) && `${app.name} ${app.description} ${app.category}`.toLowerCase().includes(term) && (!prices.length || prices.includes(app.price.toLowerCase())) && (!authors.length || authors.includes(app.author.toLowerCase()))).sort((a, b) => document.querySelector("#sort").value === "newest" ? b.added - a.added : b.installs - a.installs);
    document.querySelector("#catalog-title").firstChild.textContent = category + " ";
    document.querySelector("#count").textContent = `(${filtered.length})`;
    document.querySelector("#empty").hidden = filtered.length !== 0;
    document.querySelector("#apps").innerHTML = filtered.map((app) => `<article class="app-card"><div class="app-top">${icon(app)}<span class="badge">${app.author}</span></div><button class="app-title" data-detail="${app.id}">${app.name} ↗</button><span class="category-tag">${app.category} · ${app.price}</span><p>${app.description}</p><div class="app-footer"><small>★ ${app.rating} · ${(app.installs / 1000).toFixed(1)}k installs*</small><button class="${installed.has(app.id) ? "installed" : ""}" data-detail="${app.id}">${installed.has(app.id) ? "Installed ✓" : "Connect"}</button></div></article>`).join("");
    document.querySelectorAll("[data-category]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
    document.querySelector("#catalog-status").textContent = `Showing ${filtered.length} of ${apps.length} curated apps. *Ratings and install counts are illustrative. Installed means a local demo connection only.`;
}
document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () =>
{
    category = button.dataset.category;
    render();
}));
document.querySelector("#search").addEventListener("input", render);
document.querySelectorAll(".filter-group input, #sort").forEach((input) => input.addEventListener("change", render));
function reset()
{
    category = "All integrations";
    document.querySelector("#search").value = "";
    document.querySelectorAll(".filter-group input").forEach((input) => input.checked = false);
    document.querySelector("#sort").value = "popular";
    render();
}
document.querySelector("#reset").addEventListener("click", reset);
document.querySelector("#empty-reset").addEventListener("click", reset);
const detail = document.querySelector("#detail");
function openDetail(id)
{
    const app = apps.find((entry) => entry.id === id);
    const enabled = installed.has(id);
    const related = apps.filter((entry) => entry.id !== id && entry.category === app.category).slice(0, 2);
    document.querySelector("#detail-content").innerHTML = `<div class="detail-heading">${icon(app)}<div><h2>${app.name}</h2><small>${app.category} · ${app.author} · ${app.price}</small></div></div><p>${app.description} Keep your team in context while the tools you already use do their thing.</p><div class="integration-screen" role="img" aria-label="${app.name} integration illustrated screenshot"><div><b>TaskFlow ↔ ${app.name}</b><span>Workspace: Studio North</span><span>Project: Website launch</span><span>Update: Brand direction is ready for review ✓</span></div><small>Illustrative integration preview — not a live third-party service.</small></div><h3>What you can do</h3><ul><li>${app.description}</li><li>Choose which projects share updates.</li><li>Review activity and revoke access from your workspace.</li></ul><h3>Get connected in three steps</h3><ol><li>Choose your workspace and review permissions.</li><li>Authorize the connection with ${app.name} in the full product.</li><li>Pick a project and send a test update.</li></ol><h3>Requirements & permissions</h3><p>Workspace administrator access and an active ${app.name} account. Requested scopes: read project names and task activity; write integration notifications. ${app.price === "Premium" ? "Requires a paid TaskFlow plan; provider fees may also apply." : "Free connector; provider plan limits may apply."}</p><label class="consent"><input type="checkbox" id="consent"> I understand this creates a local demo connection only. No OAuth, credentials or account access.</label><div class="detail-actions"><button class="primary" id="connect">${enabled ? "Disconnect local demo" : "Connect local demo"}</button><small>No third-party data is sent.</small></div><p id="connect-status" role="status">${enabled ? "Installed locally in this browser." : ""}</p><div class="review"><h3>★ ${app.rating} / 5 · illustrative review</h3><p>“A useful way to keep our launch work connected.” — Sample reviewer, Studio North</p></div><h3>More connections to explore</h3><div class="related-apps">${(related.length ? related : apps.slice(0, 2)).map((entry) => `<button data-detail="${entry.id}">${entry.name} ↗</button>`).join("")}</div>`;
    document.querySelector("#connect").addEventListener("click", () =>
    {
        const message = document.querySelector("#connect-status");
        if (!installed.has(id) && !document.querySelector("#consent").checked)
        {
            message.textContent = "Please review and acknowledge the demo permissions first.";
            return;
        }
        installed.has(id) ? installed.delete(id) : installed.add(id);
        try
        {
            localStorage.setItem("taskflow-demo-connections", JSON.stringify([...installed]));
            message.textContent = installed.has(id) ? "Installed locally. No real account was connected." : "Local connection removed. No real account was changed.";
        }
        catch
        {
            message.textContent = "Demo connection changed for this visit only; browser storage is unavailable.";
        }
        document.querySelector("#connect").textContent = installed.has(id) ? "Disconnect local demo" : "Connect local demo";
        render();
    });
    if (!detail.open) detail.showModal();
    detail.scrollTop = 0;
}
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-detail]");
    if (button) openDetail(button.dataset.detail);
});
const requestDialog = document.querySelector("#request-dialog");
const request = () =>
{
    document.querySelector("#request-status").textContent = "";
    document.querySelector("#request-form").reset();
    requestDialog.showModal();
};
document.querySelector("#request").addEventListener("click", request);
document.querySelector("#request-bottom").addEventListener("click", request);
document.querySelector("#request-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#request-status").textContent = `Request for ${document.querySelector("#app-name").value} prepared locally. No message was sent.`;
});
document.querySelector("#api").addEventListener("click", () =>
{
    document.querySelector("#detail-content").innerHTML = '<div class="eyebrow">DEVELOPER QUICKSTART</div><h2>Build the missing connection.</h2><p>Start with a scoped token and GET /v1/projects. Subscribe to task.updated webhooks and verify signatures before processing payloads.</p><pre>GET /v1/projects\nAuthorization: Bearer YOUR_SCOPED_TOKEN</pre><h3>Next steps</h3><ol><li>Define the minimum required scopes.</li><li>Test with non-production sample data.</li><li>Handle pagination, rate limits and retries.</li></ol><p>Illustrative API documentation; this static site issues no credentials and makes no API calls.</p>';
    detail.showModal();
});
render();
