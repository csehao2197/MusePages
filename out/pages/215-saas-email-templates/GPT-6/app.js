const templates =
[
    { file: "welcome.html", label: "Welcome aboard", subtitle: "The first hello", icon: "↗", subject: "Welcome to TaskFlow! Let's get started", title: "A good first impression.", note: "A warm introduction, three clear next steps and one focused invitation to get started." },
    { file: "password-reset.html", label: "Password reset", subtitle: "A helping hand", icon: "⌁", subject: "Reset your TaskFlow password", title: "A little reassurance goes a long way.", note: "A focused security message with a 24-hour expiry notice. Reset links are placeholders, not authentication tokens." },
    { file: "team-invitation.html", label: "Team invitation", subtitle: "Better together", icon: "+", subject: "[Inviter Name] invited you to join [Workspace] on TaskFlow", title: "Good work starts with good company.", note: "A personal invitation with workspace context and a clear seven-day expiry." },
    { file: "weekly-digest.html", label: "Weekly digest", subtitle: "Progress, celebrated", icon: "▥", subject: "Your TaskFlow weekly summary", title: "A moment to see how far you've come.", note: "A scannable weekly recap with meaningful metrics, achievements and upcoming priorities." },
    { file: "trial-ending.html", label: "Trial ending", subtitle: "Your next chapter", icon: "◷", subject: "Your TaskFlow trial ends in 3 days", title: "A thoughtful nudge. Never a hard sell.", note: "A transparent trial reminder, a recap of value and a friendly invitation to ask questions." }
];
let current = 0;
let rendered = "";
let sequence = 0;
const cache = new Map();
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
let values = { "[First Name]": "Alex", "[Inviter Name]": "Sarah", "[Workspace]": "Studio North" };
function sizePreview()
{
    const frame = document.querySelector("#email-preview");
    if (frame.contentDocument?.body)
    {
        frame.style.height = "1px";
        frame.style.height = `${frame.contentDocument.documentElement.scrollHeight + 4}px`;
    }
}
document.querySelector("#email-preview").addEventListener("load", sizePreview);
window.addEventListener("resize", sizePreview);
function fill(text, html = false)
{
    for (const [key, value] of Object.entries(values)) text = text.replaceAll(key, html ? escape(value) : value);
    return text;
}
document.querySelector("#template-nav").innerHTML = templates.map((template, index) => `<button class="template-button" data-template="${index}" aria-pressed="${index === 0}"><span>${template.icon}</span><div><strong>${template.label}</strong><small>${template.subtitle}</small></div></button>`).join("");
async function render()
{
    const serial = ++sequence;
    const template = templates[current];
    if (!cache.has(template.file))
    {
        const response = await fetch(template.file);
        if (!response.ok) throw Error(`Template unavailable: ${template.file}`);
        cache.set(template.file, await response.text());
    }
    if (serial !== sequence) return;
    rendered = fill(cache.get(template.file), true);
    document.querySelectorAll("[data-template]").forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.template) === current));
    document.querySelector("#subject").textContent = fill(template.subject);
    document.querySelector(".recipient").textContent = `To: ${values["[First Name]"]} · Illustrative email preview`;
    document.querySelector("#email-preview").srcdoc = rendered;
    document.querySelector("#email-preview").title = `${template.label} email preview`;
    document.querySelector("#template-title").textContent = template.title;
    document.querySelector("#template-note").textContent = template.note;
    document.querySelector("#raw-template").href = template.file;
    document.querySelector("#action-status").textContent = "";
}
document.querySelectorAll("[data-template]").forEach((button) => button.onclick = () =>
{
    current = Number(button.dataset.template);
    render().catch(showError);
});
function showError(error)
{
    document.querySelector("#action-status").textContent = `Preview could not be loaded: ${error.message}`;
}
document.querySelector("#personalize").onsubmit = (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#first-name").value.trim();
    const inviter = document.querySelector("#inviter").value.trim();
    const workspace = document.querySelector("#workspace").value.trim();
    if (!name || !inviter || !workspace) return;
    values = { "[First Name]": name, "[Inviter Name]": inviter, "[Workspace]": workspace };
    render().catch(showError);
};
document.querySelector("#mobile").onclick = () =>
{
    document.querySelector("#email-preview").classList.add("mobile");
    document.querySelector("#mobile").setAttribute("aria-pressed", "true");
    document.querySelector("#desktop").setAttribute("aria-pressed", "false");
    requestAnimationFrame(sizePreview);
};
document.querySelector("#desktop").onclick = () =>
{
    document.querySelector("#email-preview").classList.remove("mobile");
    document.querySelector("#desktop").setAttribute("aria-pressed", "true");
    document.querySelector("#mobile").setAttribute("aria-pressed", "false");
    requestAnimationFrame(sizePreview);
};
function show(title, html)
{
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-content").innerHTML = html;
    document.querySelector("#dialog").showModal();
}
document.querySelector("#download").onclick = () =>
{
    if (!rendered) return;
    const url = URL.createObjectURL(new Blob([rendered], { type: "text/html" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `taskflow-${templates[current].file}`;
    link.click();
    document.querySelector("#action-status").textContent = "Personalized HTML downloaded. Review links and test in your email platform before sending.";
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
document.querySelector("#copy").onclick = async () =>
{
    try
    {
        await navigator.clipboard.writeText(rendered);
        document.querySelector("#action-status").textContent = "Email HTML copied. Ready for your next step.";
    }
    catch
    {
        show("Your email HTML.", '<label for="html-copy">Select and copy the template source</label><textarea id="html-copy" readonly></textarea>');
        document.querySelector("#html-copy").value = rendered;
        document.querySelector("#html-copy").select();
    }
};
document.querySelector("#guide").onclick = () => show("Thoughtful by design.", "<p>Choose a touchpoint. Personalize the preview. Switch between a 600px desktop canvas and a 320px mobile canvas.</p><p>Download or copy the actual table-based, inline-styled HTML. The original source templates retain merge placeholders.</p><p>Before sending, replace demonstration links and company details, connect your provider's merge fields and legally required unsubscribe handling, and test in real email clients. No emails are sent here.</p>");
document.querySelector(".close").onclick = () => document.querySelector("#dialog").close();
function action()
{
    const name = new URLSearchParams(location.search).get("action");
    if (!name) return;
    const actions =
    {
        dashboard: ["Your next chapter starts here.", "<p>Local workspace preview: 3 projects ready, 24 tasks completed and a team moving together.</p><p>No real dashboard account is connected to these email templates.</p>"],
        reset: ["A secure reset starts with a real token.", "<p>This demonstration link contains no reset token and cannot change a password.</p><p>A production flow verifies a single-use token with a 24-hour expiry on your authentication server.</p>"],
        invitation: ["Better together.", "<p>This invitation is a preview, not access to a real workspace.</p><button class='primary' id='local-action'>Accept local invitation preview</button><p id='dialog-status' role='status'></p>"],
        report: ["Your week, in perspective.", "<p>24 tasks completed · 3 projects updated · 18.5 hours logged.</p><p>Milestones: website wireframes approved; onboarding ready for review.</p><p>Next: brand review Tuesday, launch checklist Thursday. Illustrative report only.</p>"],
        upgrade: ["Keep your good work moving.", "<p>Pro concept: unlimited projects, advanced insights and team automations at $12 per user per month.</p><p>No purchase or subscription is available in this static collection.</p>"],
        unsubscribe: ["Your inbox. Your choice.", "<p>There is no live mailing list connected here.</p><button class='primary' id='local-action'>Save local unsubscribe preview</button><p id='dialog-status' role='status'></p>"],
        help: ["A little help, whenever you need it.", "<p>Create a workspace, invite a teammate, and add your first project. For a real setup, replace this link with your product's help center.</p><a href='mailto:support@example.com'>support@example.com ↗</a>"],
        community: ["Good company to keep.", "<p>No official social accounts are connected to this demonstration. Replace these links with your verified company profiles before sending.</p>"]
    };
    if (!actions[name]) return;
    show(...actions[name]);
    const button = document.querySelector("#local-action");
    if (button) button.onclick = () =>
    {
        document.querySelector("#dialog-status").textContent = name === "invitation" ? "Invitation accepted in this local preview only. No account or permissions changed." : "Local preference acknowledged. No real mailing-list subscription was changed.";
        button.disabled = true;
    };
}
render().then(action).catch(showError);
