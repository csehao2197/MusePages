const content =
{
    "404": ["404", "A SMALL DETOUR. NOT A DEAD END.", "Page not found.", "The page you're looking for doesn't exist or has been moved.<br>Let's get you back to somewhere good."],
    "500": ["500", "EVEN GOOD SYSTEMS HAVE OFF DAYS.", "Something went wrong.", "We're experiencing technical difficulties.<br>This is a demo error; no automatic alert was sent."],
    "403": ["403", "THE RIGHT ACCESS OPENS DOORS.", "Access denied.", "You don't have permission to view this page.<br>Your workspace administrator can help."],
    "maintenance": ["◷", "MAKING A LITTLE ROOM FOR BETTER.", "We'll be right back.", "We're performing scheduled maintenance to improve your experience.<br>Illustrative window: 14:00–14:30 UTC."],
    "offline": ["○", "A MOMENT TO RECONNECT.", "You're offline.", "Check your internet connection and try again.<br>Your next step will be here when you're ready."]
};
const docs =
{
    "Quickstart guide": "Create a workspace, invite a teammate, and add your first project. Keep the next step small and clear.",
    "Workspace settings": "Workspace owners manage the team name, preferences and access. This demonstration does not connect to a real workspace.",
    "Billing and plans": "A billing owner can review plans and invoices in Settings. No billing service is connected to this preview.",
    "Documentation": "Start with the Quickstart guide, Workspace settings, or Billing and plans. Search those titles from the missing-page screen.",
    "Help center": "For missing pages, check the address or return to your dashboard. For permissions, ask your workspace administrator.",
    "Contact support": "Email support@example.com with the page address and any error reference shown. This fictional support address is provided for illustration."
};
let state = "404";
let reference = `ORB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
let hasCache = false;
try
{
    hasCache = localStorage.getItem("orbit-quickstart") === "saved";
}
catch {}
function showDialog(title, html)
{
    document.querySelector("#dialog-heading").textContent = title;
    document.querySelector("#dialog-body").innerHTML = html;
    document.querySelector("#dialog").showModal();
}
function openDoc(name)
{
    showDialog(name, `<p>${docs[name]}</p>${name === "Quickstart guide" ? '<button id="save-offline" class="primary">Save guide for offline preview</button><p id="cache-status" role="status"></p>' : ""}`);
    const save = document.querySelector("#save-offline");
    if (save) save.onclick = () =>
    {
        try
        {
            localStorage.setItem("orbit-quickstart", "saved");
            hasCache = true;
            document.querySelector("#cache-status").textContent = "Quickstart saved in this browser for the offline preview.";
        }
        catch
        {
            document.querySelector("#cache-status").textContent = "Browser storage is unavailable; the guide remains available in this session.";
            hasCache = true;
        }
    };
}
function render()
{
    const [number, eyebrow, heading, description] = content[state];
    document.querySelector("#error-number").textContent = number;
    document.querySelector("#state-eyebrow").textContent = eyebrow;
    document.querySelector("#error-heading").textContent = heading;
    document.querySelector("#error-description").innerHTML = description;
    document.querySelector("#state-status").textContent = "";
    document.querySelector("#working-page").hidden = true;
    document.querySelectorAll("[data-state]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.state === state));
    const commonHome = '<button class="secondary" data-destination="home">Go home ↗</button>';
    let html = "";
    if (state === "404")
    {
        html = `<div class="actions"><button class="primary" data-destination="dashboard">Go to dashboard →</button>${commonHome}</div><form id="search-form"><label hidden for="search">Search help articles</label><input id="search" placeholder="Try searching for what you need" required><button aria-label="Search help">↵</button></form><div id="search-results" role="status"></div>`;
    }
    if (state === "500")
    {
        html = `<p class="reference">Error reference: ${reference}</p><div class="actions"><button class="primary" id="retry">Try again ↻</button><button class="secondary status-action">Check system status ↗</button></div>`;
    }
    if (state === "403")
    {
        html = '<div class="actions"><button class="primary" id="access">Request access →</button><button class="secondary" data-destination="dashboard">Go back to dashboard</button></div><p class="small">Prefer a conversation? <a href="mailto:admin@example.com">Contact your admin ↗</a></p>';
    }
    if (state === "maintenance")
    {
        html = '<progress max="100" value="72" aria-label="Illustrative maintenance progress, 72 percent"></progress><p class="small">72% complete · Sample progress, not live monitoring</p><form class="notify-form" id="notify"><label hidden for="notify-email">Notification email</label><input id="notify-email" type="email" placeholder="Your email address" required><button class="primary">Notify me →</button></form><div class="actions"><button class="secondary status-action">Read status updates ↗</button></div>';
    }
    if (state === "offline")
    {
        html = `<div class="actions"><button class="primary" id="retry">Retry connection ↻</button>${commonHome}</div><p class="small">Browser connection: ${navigator.onLine ? "online" : "offline"} · selected error is a preview</p><div id="cached-content">${hasCache ? '<strong>Saved for later</strong><p><button data-doc="Quickstart guide">Quickstart guide ↗</button></p>' : "<p>No saved articles yet. Open the quickstart guide from search and save it for this preview.</p>"}</div>`;
    }
    document.querySelector("#state-content").innerHTML = html;
    const search = document.querySelector("#search-form");
    if (search) search.onsubmit = (event) =>
    {
        event.preventDefault();
        const query = document.querySelector("#search").value.trim().toLowerCase();
        const results = Object.keys(docs).filter((name) => `${name} ${docs[name]}`.toLowerCase().includes(query));
        document.querySelector("#search-results").innerHTML = "";
        if (!results.length) document.querySelector("#search-results").textContent = "No matching articles. Try “workspace”, “billing” or “quickstart”.";
        for (const name of results)
        {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.doc = name;
            button.textContent = `${name} ↗`;
            document.querySelector("#search-results").append(button);
        }
    };
    const retry = document.querySelector("#retry");
    if (retry) retry.onclick = () =>
    {
        document.querySelector("#state-status").textContent = state === "500" ? `Demo server remains unavailable. Reference ${reference}. Try the dashboard or contact support.` : navigator.onLine ? "Your browser reports an online connection. This offline screen is a preview; saved content remains available." : "Your browser still reports offline. Check Wi-Fi or mobile data and try again.";
    };
    const access = document.querySelector("#access");
    if (access) access.onclick = () =>
    {
        showDialog("Ask for the right access.", '<form id="access-form"><label>Work email<input id="access-email" type="email" required></label><label>What do you need access to?<textarea id="access-reason" required minlength="5"></textarea></label><button class="primary">Create local request preview</button></form><p id="access-result" role="status"></p>');
        document.querySelector("#access-form").onsubmit = (event) =>
        {
            event.preventDefault();
            document.querySelector("#access-result").textContent = "Request preview created. Nothing was sent to an administrator. Contact admin@example.com to request real access.";
        };
    };
    const notify = document.querySelector("#notify");
    if (notify) notify.onsubmit = (event) =>
    {
        event.preventDefault();
        document.querySelector("#state-status").textContent = "Notification preference previewed. No subscription or email was created.";
        document.querySelector("#notify-email").value = "";
    };
}
document.addEventListener("click", (event) =>
{
    const tab = event.target.closest("[data-state]");
    if (tab)
    {
        state = tab.dataset.state;
        render();
    }
    const doc = event.target.closest("[data-doc]");
    if (doc) openDoc(doc.dataset.doc);
    const destination = event.target.closest("[data-destination]");
    if (destination)
    {
        event.preventDefault();
        const dashboard = destination.dataset.destination === "dashboard";
        document.querySelector("#error-heading").textContent = dashboard ? "Welcome back to your dashboard." : "You're on familiar ground.";
        document.querySelector("#error-description").textContent = dashboard ? "A working local destination. Your workspace is ready for its next chapter." : "Orbit brings your team, projects and next steps together.";
        document.querySelector("#state-content").innerHTML = `<div class="actions"><button class="primary" data-state="404">Return to recovery preview →</button></div>`;
        document.querySelector("#state-status").textContent = "";
        document.querySelector("#working-page").hidden = false;
        document.querySelector("#working-page").innerHTML = dashboard ? "<b>Workspace overview</b><p>3 active projects · 12 tasks this week · Team in sync</p>" : "<b>Welcome to Orbit.</b><p>This is a static SaaS recovery experience with useful local destinations.</p>";
    }
    if (event.target.closest(".status-action, #system-status")) showDialog("A little transparency.", "<p>Sample service status</p><ul><li>Workspace: operational (demo)</li><li>API: maintenance preview</li><li>Scheduled window: 14:00–14:30 UTC</li></ul><p class='small'>Not connected to live monitoring. No alerts have been sent.</p><a href='mailto:support@example.com'>Contact support ↗</a>");
});
document.querySelector(".close").onclick = () => document.querySelector("#dialog").close();
render();
