const defaults =
{
    profile: { name: "Alex Morgan", display: "Alex", email: "alex@studionorth.example", job: "Product designer", bio: "Making thoughtful things with good people.", timezone: "Europe/London", language: "English", avatar: "" },
    workspace: { name: "Studio North", slug: "studio-north", logo: "", view: "Board", visibility: "Team only", permissions: { "Create projects": [true, true, false], "Invite members": [true, false, false], "Manage billing": [true, false, false], "Export project data": [true, true, false] } },
    notifications: [[true, true, true], [false, false, true], [true, true, true], [false, true, true], [false, false, true], [true, false, false]],
    integrations: ["slack", "drive"],
    billing: { plan: "Pro", cancelled: false },
    security: { twoFactor: false, sessions: ["macbook", "iphone", "windows"] },
    api: [{ id: "local-key-example", name: "Reporting demo", suffix: "demo_8f2a", scope: "Read projects" }]
};
let saved;
try
{
    saved = JSON.parse(localStorage.getItem("formwork-settings")) || structuredClone(defaults);
}
catch
{
    saved = structuredClone(defaults);
}
if (!saved.profile || !saved.workspace || !Array.isArray(saved.notifications)) saved = structuredClone(defaults);
let draft = structuredClone(saved);
let section = ["profile", "account", "workspace", "notifications", "integrations", "billing", "security", "api"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "profile";
let dirty = false;
const panel = document.querySelector("#panel");
const status = document.querySelector("#status");
const form = document.querySelector("#settings-form");
const dialog = document.querySelector("dialog");
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const categories = [["profile", "Profile", "○"], ["account", "Account", "◈"], ["workspace", "Workspace", "▦"], ["notifications", "Notifications", "♧"], ["integrations", "Integrations", "⌁"], ["billing", "Billing", "▤"], ["security", "Security", "◇"], ["api", "API", "{ }"]];
const descriptions =
{
    profile: ["Your profile", "A little about you, for the people you work with.", "PERSONAL"],
    account: ["Your account", "The essentials behind your everyday workspace.", "PERSONAL"],
    workspace: ["Workspace details", "A shared home for the way your team works.", "WORKSPACE"],
    notifications: ["Stay in the loop", "The right updates, in the right place, at the right time.", "PERSONAL"],
    integrations: ["Your connected tools", "A little less switching. A lot more in sync.", "WORKSPACE"],
    billing: ["Plan & billing", "A clear view of your plan, payments and invoices.", "WORKSPACE"],
    security: ["A little peace of mind", "Keep your workspace and account protected.", "PERSONAL"],
    api: ["Developer access", "Thoughtful connections, with the right permissions.", "DEVELOPER"]
};
const field = (name, label, value, options = "") => `<label class="field">${label}<input data-field="${name}" value="${esc(value)}" ${options}></label>`;
const select = (name, label, value, values) => `<label class="field">${label}<select data-field="${name}">${values.map((entry) => `<option ${entry === value ? "selected" : ""}>${entry}</option>`).join("")}</select></label>`;
const toggle = (id, value, label) => `<button type="button" class="toggle" role="switch" aria-checked="${value}" aria-label="${label}" data-toggle="${id}"><i></i></button>`;
function mark()
{
    dirty = JSON.stringify(draft) !== JSON.stringify(saved);
    document.body.classList.toggle("dirty", dirty);
    document.querySelector("#save-message").innerHTML = `${dirty ? "A few changes to keep." : "You’re all up to date."}<small>Local demo · no changes to a real account</small>`;
}
function capture()
{
    if (section === "profile" || section === "workspace")
    {
        panel.querySelectorAll("[data-field]").forEach((input) => draft[section][input.dataset.field] = input.value);
    }
}
function show(title, html)
{
    document.querySelector("#modal").innerHTML = `<div class="eyebrow">YOUR WORKSPACE, THOUGHTFULLY MANAGED</div><h2>${title}</h2>${html}`;
    document.querySelector("#modal-status").textContent = "";
    dialog.showModal();
}
function persistImmediate()
{
    saved = structuredClone(draft);
    try
    {
        localStorage.setItem("formwork-settings", JSON.stringify(saved));
        status.textContent = "Local demo settings updated. No real account was changed.";
    }
    catch
    {
        status.textContent = "Updated for this visit only; browser storage is unavailable.";
    }
    mark();
}
function render()
{
    document.querySelector("#settings-nav").innerHTML = categories.map(([id, title, icon]) => `<button data-section="${id}" ${id === section ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon}</span>${title}</button>`).join("");
    const [title, description, label] = descriptions[section];
    document.querySelector("#section-title").textContent = title;
    document.querySelector("#section-description").textContent = description;
    document.querySelector("#section-label").textContent = label;
    document.querySelector("#sidebar-name").textContent = draft.profile.name;
    status.textContent = "";
    if (section === "profile")
    {
        const p = draft.profile;
        panel.innerHTML = `<div class="settings-block avatar-row">${p.avatar ? `<img class="avatar" src="${p.avatar}" alt="Your locally cropped avatar">` : '<span class="avatar">AM</span>'}<div><b>Profile photo</b><p>A friendly face makes a workspace feel more human.</p><div class="avatar-actions"><button type="button" id="avatar-upload">Upload photo</button><button type="button" id="avatar-remove">Remove</button></div></div></div><div class="field-grid">${field("name", "Full name", p.name, 'maxlength="80" required')}${field("display", "Display name", p.display, 'maxlength="40" required')}<label class="field">Email address<button type="button" id="change-email">Change email ↗</button><input value="${esc(p.email)}" readonly><small>Used for sign-in and important account updates.</small></label>${field("job", "Job title", p.job, 'maxlength="80"')}<label class="field full">A little about you<textarea data-field="bio" maxlength="400">${esc(p.bio)}</textarea><small>What do you love working on? 400 characters max.</small></label>${select("timezone", "Timezone", p.timezone, ["Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo", "UTC"])}${select("language", "Language", p.language, ["English", "French", "German", "Spanish"])}</div><p class="form-note">Your timezone helps teammates find a thoughtful time to connect. Language preference is a local setting preview; this interface stays in English.</p>`;
    }
    if (section === "account")
    {
        panel.innerHTML = `<div class="setting-line"><div><b>Account email</b><small>${esc(draft.profile.email)}</small></div><button type="button" id="change-email">Change email</button></div><div class="setting-line"><div><b>Account data</b><small>Download your current local settings as JSON.</small></div><button type="button" id="export-data">Export data ↓</button></div><div class="setting-line"><div><b>Workspace access</b><small>Studio North · owner · illustrative account</small></div><span class="badge">Active demo</span></div><div class="setting-line danger"><div><b>Delete local account preview</b><small>Clears only this demo’s stored settings.</small></div><button type="button" id="delete-account">Delete preview</button></div>`;
    }
    if (section === "workspace")
    {
        const w = draft.workspace;
        panel.innerHTML = `<div class="field-grid">${field("name", "Workspace name", w.name, 'required maxlength="60"')}${field("slug", "Workspace URL", w.slug, 'required maxlength="50" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"')}<label class="field full">Workspace logo<input id="workspace-logo" type="file" accept="image/png,image/jpeg,image/svg+xml"><small id="logo-status">${esc(w.logo || "Select a local image; filename preview only.")}</small></label>${select("view", "Default project view", w.view, ["Board", "List", "Timeline"])}${select("visibility", "New project visibility", w.visibility, ["Team only", "Invite only"])}</div><h3 class="panel-heading">Member permissions</h3><p class="form-note">Owner access stays enabled. Adjust Member and Viewer defaults for this local preview.</p><div class="table-wrap"><table><thead><tr><th>Permission</th><th>Owner</th><th>Member</th><th>Viewer</th></tr></thead><tbody>${Object.entries(w.permissions).map(([name, values], row) => `<tr><td>${name}</td>${values.map((value, col) => `<td>${col === 0 ? '<span aria-label="Always enabled">✓</span>' : toggle(`permission:${row}:${col}`, value, `${name}: ${["Owner", "Member", "Viewer"][col]}`)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    if (section === "notifications")
    {
        panel.innerHTML = `<p class="form-note">Choose your channels. Push notifications here are a preference only; browser permission is not requested.</p><div class="table-wrap"><table><thead><tr><th>Activity</th><th>Email</th><th>Push</th><th>In-app</th></tr></thead><tbody>${["Task assigned", "Task completed", "Mentions", "Comments", "Project updates", "Weekly digest"].map((name, row) => `<tr><td>${name}</td>${draft.notifications[row].map((value, col) => `<td>${toggle(`notification:${row}:${col}`, value, `${name}: ${["Email", "Push", "In-app"][col]}`)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="form-note">Important billing and security updates would still be delivered in the full product. This demo sends no messages.</p>`;
    }
    if (section === "integrations")
    {
        panel.innerHTML = '<input class="search-field" id="integration-search" type="search" placeholder="Search your tools..." aria-label="Search integrations"><div id="integration-list" class="integrations-grid"></div><p id="integration-empty" class="form-note" hidden>No tools match that search. Try Slack or GitHub.</p>';
        renderIntegrations();
        document.querySelector("#integration-search").addEventListener("input", renderIntegrations);
    }
    if (section === "billing")
    {
        panel.innerHTML = `<div class="plan-card"><div><div><div class="eyebrow">YOUR CURRENT PLAN</div><h3>${draft.billing.plan} plan</h3></div><strong>$${draft.billing.plan === "Business" ? "192" : "96"}<small> / month</small></strong></div><div><p>8 demo seats · ${draft.billing.cancelled ? "Cancels at period end" : "Renews December 1, 2026"}</p><button type="button" id="upgrade">Explore upgrade ↗</button></div></div><div class="setting-line"><div><b>Payment method</b><small>Visa ending in •••• 4242 · sample card</small></div><button type="button" id="payment">Manage payment</button></div><h3 class="panel-heading">Billing history</h3><div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th>Download</th></tr></thead><tbody>${["November 1", "October 1", "September 1"].map((date, index) => `<tr><td>FW-${202611 - index}</td><td>${date}, 2026</td><td>$96.00</td><td><span class="badge">Paid · sample</span></td><td><button type="button" data-invoice="${index}">Invoice ↓</button></td></tr>`).join("")}</tbody></table></div><div class="setting-line danger"><div><b>${draft.billing.cancelled ? "Cancellation scheduled locally" : "Cancel subscription"}</b><small>No real subscription exists. Your sample access lasts through November 30.</small></div><button type="button" id="cancel-plan">${draft.billing.cancelled ? "Undo cancellation" : "Cancel plan"}</button></div>`;
    }
    if (section === "security")
    {
        panel.innerHTML = `<div class="setting-line"><div><b>Password</b><small>Use a unique password. This demo never stores passwords.</small></div><button type="button" id="password">Change password</button></div><div class="setting-line"><div><b>Two-factor authentication</b><small>${draft.security.twoFactor ? "Enabled for this local demo only." : "Add a second layer of security to your account."}</small></div>${toggle("2fa", draft.security.twoFactor, "Two-factor authentication")}</div><h3 class="panel-heading">Active sessions</h3><div id="sessions">${draft.security.sessions.map((id) => `<div class="session"><span aria-hidden="true">${id === "iphone" ? "▯" : "▱"}</span><div><b>${{ macbook: "MacBook Pro · Chrome", iphone: "iPhone · Safari", windows: "Windows · Edge" }[id]}</b><small>${id === "macbook" ? "London, UK · Current browser preview" : "Illustrative session · last active 2 hours ago"}</small></div>${id === "macbook" ? "<small>Current session</small>" : `<button type="button" data-signout="${id}">Sign out</button>`}</div>`).join("")}</div><h3 class="panel-heading">Recent login activity</h3><div class="table-wrap"><table><thead><tr><th>Device</th><th>Location</th><th>Time</th><th>Result</th></tr></thead><tbody><tr><td>Chrome / macOS</td><td>London, UK</td><td>Today, 09:14</td><td>Successful*</td></tr><tr><td>Safari / iOS</td><td>London, UK</td><td>Yesterday, 18:02</td><td>Successful*</td></tr></tbody></table></div><p class="form-note">*Sample login history, not actual location or device tracking.</p><div class="setting-line"><div><b>API access keys</b><small>Manage scoped, nonfunctional sample keys.</small></div><button type="button" data-section="api">Manage keys ↗</button></div>`;
    }
    if (section === "api")
    {
        panel.innerHTML = '<p class="form-note">All keys below are clearly labeled, nonfunctional demo identifiers. Keep real credentials out of browser-only websites.</p><div id="keys"></div><div class="api-actions"><button type="button" class="primary" id="create-key">Create demo key</button><button type="button" id="api-docs">API reference ↗</button></div><h3 class="panel-heading">A minimal request</h3><pre>GET /v1/projects\nAuthorization: Bearer YOUR_SCOPED_TOKEN\n\n// Example only. No requests are made.</pre>';
        renderKeys();
    }
    mark();
}
const integrations = [["slack", "#", "Slack", "Keep your team in the conversation with project updates."], ["drive", "G", "Google Drive", "Attach project documents without losing the context."], ["github", "GH", "GitHub", "Link commits and pull requests with the work behind them."], ["figma", "F", "Figma", "Bring your latest designs into your project tasks."]];
function renderIntegrations()
{
    const term = document.querySelector("#integration-search").value.toLowerCase();
    const matches = integrations.filter((row) => row.join(" ").toLowerCase().includes(term));
    document.querySelector("#integration-list").innerHTML = matches.map(([id, icon, name, copy]) => `<div class="integration"><div class="integration-heading"><span class="app-icon">${icon}</span><b>${name}</b>${draft.integrations.includes(id) ? '<span class="badge">Connected</span>' : ""}</div><p>${copy}</p><button type="button" data-connect="${id}">${draft.integrations.includes(id) ? "Disconnect" : "Connect"} local demo</button></div>`).join("");
    document.querySelector("#integration-empty").hidden = matches.length > 0;
}
function renderKeys()
{
    document.querySelector("#keys").innerHTML = draft.api.map((key) => `<div class="key-row"><div><b>${esc(key.name)}</b><code>demo_••••${esc(key.suffix)} · ${esc(key.scope)}</code></div><span class="badge">Nonfunctional</span><button type="button" data-revoke="${key.id}">Revoke</button></div>`).join("") || '<p class="form-note">No keys yet. Create a scoped demo identifier to preview this workflow.</p>';
}
form.addEventListener("input", () => { capture(); mark(); });
form.addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#discard").addEventListener("click", () =>
{
    draft = structuredClone(saved);
    render();
    status.textContent = "Unsaved local changes discarded.";
});
document.querySelector("#save").addEventListener("click", () =>
{
    capture();
    if (!draft.profile.name.trim() || !draft.profile.display.trim())
    {
        status.textContent = "Add a full name and display name before saving.";
        return;
    }
    if (!draft.workspace.name.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.workspace.slug))
    {
        status.textContent = "Use a workspace name and a lowercase URL made of words, numbers and single hyphens.";
        return;
    }
    persistImmediate();
    document.querySelector("#sidebar-name").textContent = draft.profile.name;
});
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.section)
    {
        capture();
        section = button.dataset.section;
        history.replaceState(null, "", `#${section}`);
        render();
    }
    if (button.dataset.toggle)
    {
        const [type, row, col] = button.dataset.toggle.split(":");
        if (type === "2fa") return twoFactor();
        if (type === "notification") draft.notifications[Number(row)][Number(col)] = !draft.notifications[Number(row)][Number(col)];
        if (type === "permission")
        {
            const key = Object.keys(draft.workspace.permissions)[Number(row)];
            draft.workspace.permissions[key][Number(col)] = !draft.workspace.permissions[key][Number(col)];
        }
        button.setAttribute("aria-checked", String(button.getAttribute("aria-checked") !== "true"));
        mark();
    }
    if (button.id === "change-email") changeEmail();
    if (button.id === "avatar-upload") cropAvatar();
    if (button.id === "avatar-remove") { draft.profile.avatar = ""; render(); }
    if (button.dataset.connect)
    {
        const id = button.dataset.connect;
        const connected = draft.integrations.includes(id);
        show(connected ? "Disconnect this local preview?" : "Connect thoughtfully.", `<p>${connected ? "Remove this browser’s demo connection flag. No provider account is affected." : "This preview would request project names and task activity in the full product. No OAuth, credentials or real connection is used here."}</p><button type="button" class="primary" id="confirm-connection">${connected ? "Disconnect" : "Connect"} local demo</button>`);
        document.querySelector("#confirm-connection").onclick = () =>
        {
            draft.integrations = connected ? draft.integrations.filter((item) => item !== id) : [...draft.integrations, id];
            dialog.close();
            renderIntegrations();
            mark();
            status.textContent = "Demo connection changed. Save to keep the local preference.";
        };
    }
    if (button.id === "password") changePassword();
    if (button.dataset.signout)
    {
        draft.security.sessions = draft.security.sessions.filter((id) => id !== button.dataset.signout);
        render();
        status.textContent = "Sample session removed locally. Save to keep the change.";
    }
    if (button.id === "create-key") createKey();
    if (button.dataset.revoke)
    {
        const id = button.dataset.revoke;
        show("Revoke this demo key?", '<p>This removes a nonfunctional identifier from your local settings only.</p><button type="button" class="primary" id="confirm-revoke">Revoke demo key</button>');
        document.querySelector("#confirm-revoke").onclick = () => { draft.api = draft.api.filter((key) => key.id !== id); dialog.close(); renderKeys(); mark(); };
    }
    if (button.id === "api-docs") show("A thoughtful API connection.", "<p>Use scoped tokens and cursor pagination with GET /v1/projects. Verify signatures on task.updated webhooks and rotate tokens before expiry. This is illustrative documentation, not a live API.</p>");
    if (button.id === "upgrade")
    {
        show("A little more room to grow.", '<p>Business preview: $24 per seat/month, eight seats, $192 per month. Includes SSO and team reporting in the product concept. No charge or subscription is created.</p><button type="button" class="primary" id="confirm-upgrade">Preview Business locally</button>');
        document.querySelector("#confirm-upgrade").onclick = () => { draft.billing.plan = "Business"; dialog.close(); render(); };
    }
    if (button.id === "payment") show("Payment details stay private.", "<p>Visa ending 4242 is sample data. The full product would open a secure payment-provider portal. This static demo never collects card details or connects to a payment service.</p>");
    if (button.id === "cancel-plan") cancelPlan();
    if (button.dataset.invoice !== undefined)
    {
        const index = Number(button.dataset.invoice);
        download(`formwork-invoice-${202611 - index}.txt`, `FORMWORK — SAMPLE INVOICE\nInvoice: FW-${202611 - index}\nWorkspace: Studio North\nPro plan: 8 seats × $12\nAmount: USD 96.00\nStatus: illustrative paid record\nThis is demo content, not a tax invoice.\n`, "text/plain");
    }
    if (button.id === "export-data") download("formwork-local-settings.json", JSON.stringify(draft, null, 4), "application/json");
    if (button.id === "delete-account")
    {
        show("Clear this local preview?", '<p>Type DELETE to reset this demo’s local settings. No real account is affected.</p><form id="delete-form"><label class="field">Confirmation<input id="delete-confirm" required></label><button class="primary">Clear demo settings</button></form>');
        document.querySelector("#delete-form").onsubmit = (event) =>
        {
            event.preventDefault();
            if (document.querySelector("#delete-confirm").value !== "DELETE") return document.querySelector("#modal-status").textContent = "Type DELETE exactly to confirm.";
            draft = structuredClone(defaults);
            persistImmediate();
            dialog.close();
            render();
        };
    }
});
form.addEventListener("change", (event) =>
{
    if (event.target.id !== "workspace-logo") return;
    const file = event.target.files[0];
    if (file && (file.size > 2 * 1024 * 1024 || !file.type.startsWith("image/")))
    {
        status.textContent = "Choose an image under 2 MB.";
        event.target.value = "";
        return;
    }
    draft.workspace.logo = file?.name || "";
    document.querySelector("#logo-status").textContent = file ? `${file.name} selected locally. No upload.` : "No local logo selected.";
    mark();
});
function changeEmail()
{
    show("A fresh address?", '<p>This changes only the local profile preview. No verification email is sent.</p><form id="email-form"><label class="field">New email<input id="new-email" type="email" required placeholder="you@company.com"></label><button class="primary">Update local email</button></form>');
    document.querySelector("#email-form").onsubmit = (event) =>
    {
        event.preventDefault();
        draft.profile.email = document.querySelector("#new-email").value;
        dialog.close();
        render();
        status.textContent = "Email preview updated. Save to keep the local change.";
    };
}
function changePassword()
{
    show("A stronger starting point.", '<p>Use sample values only. Nothing here is checked against a real account, saved or sent.</p><form id="password-form"><label class="field">Current sample password<input type="password" id="old-password" required autocomplete="off"></label><label class="field">New sample password<input type="password" id="new-password" required minlength="12" autocomplete="off"></label><label class="field">Confirm sample password<input type="password" id="confirm-password" required autocomplete="off"></label><button class="primary">Preview password change</button></form>');
    document.querySelector("#password-form").onsubmit = (event) =>
    {
        event.preventDefault();
        if (document.querySelector("#new-password").value !== document.querySelector("#confirm-password").value) return document.querySelector("#modal-status").textContent = "Your new sample passwords do not match.";
        document.querySelector("#password-form").reset();
        document.querySelector("#modal-status").textContent = "Password-change flow complete locally. No password was stored, transmitted or changed on a real account.";
    };
}
function twoFactor()
{
    const enabled = draft.security.twoFactor;
    show(enabled ? "Disable the 2FA preview?" : "A second layer of peace of mind.", enabled ? '<p>This only changes a local demo preference.</p><button class="primary" id="disable-2fa">Disable local 2FA</button>' : '<p>In the full product, scan a private QR code with your authenticator. Here, use the public sample code <b>123456</b> to try the confirmation state. It is not a real security credential.</p><form id="twofactor-form"><label class="field">Sample six-digit code<input id="twofactor-code" inputmode="numeric" pattern="[0-9]{6}" required maxlength="6"></label><button class="primary">Enable local 2FA preview</button></form>');
    if (enabled) document.querySelector("#disable-2fa").onclick = () => { draft.security.twoFactor = false; dialog.close(); render(); };
    else document.querySelector("#twofactor-form").onsubmit = (event) =>
    {
        event.preventDefault();
        if (document.querySelector("#twofactor-code").value !== "123456") return document.querySelector("#modal-status").textContent = "Use the public sample code 123456.";
        draft.security.twoFactor = true;
        dialog.close();
        render();
        status.textContent = "2FA enabled locally only. Save to keep the demo preference.";
    };
}
function createKey()
{
    show("A connection with clear boundaries.", '<p>Create a nonfunctional demo identifier. No actual token or account access is issued.</p><form id="key-form"><label class="field">Key name<input id="key-name" required maxlength="40" placeholder="Reporting preview"></label><label class="field">Scope<select id="key-scope"><option>Read projects</option><option>Read tasks</option><option>Read reports</option></select></label><button class="primary">Create demo identifier</button></form>');
    document.querySelector("#key-form").onsubmit = (event) =>
    {
        event.preventDefault();
        const name = document.querySelector("#key-name").value.trim();
        if (!name) return;
        draft.api.push({ id: `local-${Date.now()}`, name, suffix: `demo_${String(Date.now()).slice(-4)}`, scope: document.querySelector("#key-scope").value });
        dialog.close();
        renderKeys();
        mark();
    };
}
function cancelPlan()
{
    if (draft.billing.cancelled)
    {
        draft.billing.cancelled = false;
        render();
        return;
    }
    show("Before you go.", '<p>Your illustrative Pro access remains through November 30, 2026. Data stays in the local preview. Confirming does not cancel a real subscription.</p><form id="cancel-form"><label class="check"><input type="checkbox" required>I understand this is a local cancellation preview.</label><button class="primary">Confirm local cancellation</button></form>');
    document.querySelector("#cancel-form").onsubmit = (event) =>
    {
        event.preventDefault();
        draft.billing.cancelled = true;
        dialog.close();
        render();
        status.textContent = "Local cancellation scheduled. Save to keep the demo state.";
    };
}
function download(name, text, type)
{
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "Local demo file downloaded.";
}
function cropAvatar()
{
    show("A friendly face, your way.", '<p>Choose an image under 5 MB. Position and crop locally; nothing is uploaded.</p><input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp"><div class="crop-area"><canvas id="crop" width="220" height="220"></canvas></div><div class="crop-controls"><label>Zoom<input id="zoom" type="range" min="1" max="3" step=".1" value="1"></label><label>Horizontal position<input id="pan-x" type="range" min="-100" max="100" value="0"></label><label>Vertical position<input id="pan-y" type="range" min="-100" max="100" value="0"></label></div><button type="button" class="primary" id="apply-crop" disabled>Use cropped photo</button>');
    const canvas = document.querySelector("#crop");
    const context = canvas.getContext("2d");
    let image;
    const draw = () =>
    {
        if (!image) return;
        const scale = Math.max(220 / image.width, 220 / image.height) * Number(document.querySelector("#zoom").value);
        const w = image.width * scale;
        const h = image.height * scale;
        const x = (220 - w) / 2 + Number(document.querySelector("#pan-x").value) / 100 * (w - 220) / 2;
        const y = (220 - h) / 2 + Number(document.querySelector("#pan-y").value) / 100 * (h - 220) / 2;
        context.clearRect(0, 0, 220, 220);
        context.drawImage(image, x, y, w, h);
    };
    document.querySelector("#avatar-file").onchange = async (event) =>
    {
        const file = event.target.files[0];
        if (!file) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)
        {
            document.querySelector("#modal-status").textContent = "Choose a PNG, JPG or WebP under 5 MB.";
            return;
        }
        const url = URL.createObjectURL(file);
        image = new Image();
        image.onload = () => { draw(); URL.revokeObjectURL(url); document.querySelector("#apply-crop").disabled = false; };
        image.onerror = () => { URL.revokeObjectURL(url); document.querySelector("#modal-status").textContent = "This image could not be decoded."; };
        image.src = url;
    };
    document.querySelectorAll(".crop-controls input").forEach((input) => input.oninput = draw);
    document.querySelector("#apply-crop").onclick = () => { draft.profile.avatar = canvas.toDataURL("image/png"); dialog.close(); render(); };
}
render();
