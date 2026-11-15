const groups =
[
    ["Getting Started",
        ["How do I create an account?", "Choose Try Gather free, enter your work email and create a workspace. In the live product, an email verification link activates your account."],
        ["What’s included in the free trial?", "Explore all Pro features for 14 days with up to 10 teammates. No credit card is required. Your projects remain accessible on the Free plan when the trial ends."],
        ["How do I invite team members?", "Open Workspace settings → Members → Invite. Add email addresses and select a role. Invitations expire after seven days and can be resent."],
        ["Where can I find tutorials?", "The video library below includes a five-minute workspace tour, project walkthroughs and recorded onboarding webinars."],
        ["Is there a mobile app?", "Gather is designed for mobile browsers. Pin your workspace to your home screen for quick access; native app availability depends on your platform."],
        ["How do I import my data?", "Choose Import in a project and upload a UTF-8 CSV with task names, owners and due dates. Preview the column mapping before confirming. Files up to 20 MB are supported."]
    ],
    ["Billing & Pricing",
        ["What payment methods do you accept?", "Billing supports major credit and debit cards. Enterprise customers can request annual invoicing and bank transfer through their account manager."],
        ["Can I change my plan anytime?", "Yes. Upgrade immediately with prorated billing. Downgrades apply at the next renewal, so paid features stay available through the current period."],
        ["Do you offer refunds?", "Contact support within 30 days of your first paid subscription to request a refund review. Renewal and regional rights are explained before purchase."],
        ["How does annual billing work?", "Annual billing collects one payment for twelve months, with a 20% saving compared with monthly billing. Your renewal date is visible in Billing."],
        ["What happens when my trial ends?", "Your workspace moves to Free unless you choose a paid plan. We keep your data; features beyond Free limits become read-only until you upgrade or reduce usage."],
        ["Are there any hidden fees?", "No. Your billing preview shows seat charges, applicable taxes and any prorated changes before you confirm."],
        ["Do you offer discounts for nonprofits?", "Eligible registered nonprofits can apply for a 30% subscription discount. Send your registration details to our support team for review."]
    ],
    ["Account & Security",
        ["How do I reset my password?", "Select Forgot password on the sign-in screen. A time-limited reset link is sent to your registered email. Check spam or contact support if it does not arrive."],
        ["How do I enable two-factor authentication?", "Visit Personal settings → Security → Two-factor authentication, scan the QR code with an authenticator app and store your recovery codes securely."],
        ["Can I export my data?", "Workspace owners can export tasks and project data as CSV from Settings → Export. Export permissions follow your workspace role."],
        ["How do I delete my account?", "Open Personal settings → Delete account and confirm by email. Transfer workspace ownership first. We show the retention timeline before final confirmation."],
        ["Is my data encrypted?", "The product design uses TLS in transit and AES-256 encryption at rest. This static demonstration contains sample content and does not store real customer data."],
        ["Where is my data stored?", "The illustrative standard workspace region is the EU. Enterprise data residency requirements should be confirmed in your agreement before sending production data."]
    ],
    ["Features & Usage",
        ["What are the usage limits?", "Free includes three projects and five members. Pro includes unlimited projects and up to 10,000 automation runs per month. Your workspace usage meter shows current limits."],
        ["How do I use project boards?", "Create a project, choose Board view and add your first task. Drag tasks between stages, assign an owner and set a due date to keep work moving."],
        ["Can I customize the dashboard?", "Yes. Pin projects, choose a board or list view, and reorder dashboard widgets. Each teammate’s personal dashboard is independent."],
        ["How do notifications work?", "Mentions, assignments and approaching due dates appear in your inbox. Set email preferences and quiet hours in Personal settings."],
        ["Can I automate tasks?", "Use Automations to pair a trigger, condition and action. For example, notify an owner when a task becomes overdue. Test a rule before enabling it."],
        ["Can I collaborate in real time?", "In the full product, teammates can comment, mention each other and edit project details together. This static FAQ demonstrates help interactions only."]
    ],
    ["Integrations",
        ["Which apps connect to Gather?", "The illustrative integration catalog includes Slack, Google Drive, GitHub and Figma. Each connection lists its permissions before authorization."],
        ["How do I disconnect an integration?", "Workspace owners can choose Settings → Integrations → Disconnect. Existing imported tasks remain, but future synchronization stops."],
        ["Is there an API?", "The API reference explains token scopes, pagination and webhook signatures. API calls in this standalone site are documentation examples rather than live endpoints."]
    ],
    ["Technical Support",
        ["How do I report a bug?", "Share reproduction steps, browser version and a redacted screenshot with support. Include a project reference without sharing passwords or sensitive information."],
        ["Which browsers are supported?", "Use the latest two versions of Chrome, Firefox, Safari or Edge. Enable JavaScript for searching, copying links and giving answer feedback."],
        ["What if my workspace will not load?", "Refresh the page, check your connection and try a private browser window. If the issue continues, contact support with the time and any error message."]
    ],
    ["Enterprise & Teams",
        ["Can I manage team permissions?", "Workspace owners assign Admin, Member or Guest roles. Guests only see explicitly shared projects; review access regularly."],
        ["Do you support single sign-on?", "Enterprise plans can configure SAML SSO and domain verification. Your IT team should test sign-in and recovery access before enforcing SSO."],
        ["Can we arrange a team onboarding call?", "Yes. Use Schedule a call below to tell us your team size and goals. In this demo, the request stays in the browser and is not sent."]
    ]
];
let active = "Getting Started";
const list = document.querySelector("#faq-list");
const search = document.querySelector("#search");
const safe = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const idFor = (question) => question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
const highlight = (value, term) =>
{
    if (!term) return safe(value);
    const index = value.toLowerCase().indexOf(term.toLowerCase());
    if (index < 0) return safe(value);
    return safe(value.slice(0, index)) + "<mark>" + safe(value.slice(index, index + term.length)) + "</mark>" + highlight(value.slice(index + term.length), term);
};
document.querySelector("#categories").innerHTML = ["All topics", ...groups.map((group) => group[0])].map((name) => `<button aria-pressed="${name === active}" data-category="${safe(name)}">${safe(name)}<span>↗</span></button>`).join("");
function render()
{
    const term = search.value.trim();
    const matches = groups.filter((group) => active === "All topics" || group[0] === active).flatMap((group) => group.slice(1).map(([q, a]) => ({ q, a, category: group[0] }))).filter(({ q, a }) => `${q} ${a}`.toLowerCase().includes(term.toLowerCase()));
    document.querySelector("#category-title").textContent = term ? "Your search results" : active;
    document.querySelector("#section-label").textContent = term ? `SEARCHING ${active.toUpperCase()}` : "THE BASICS, MADE SIMPLE";
    document.querySelector("#result-count").textContent = `${matches.length} answers`;
    document.querySelector("#empty").hidden = matches.length > 0;
    list.innerHTML = matches.map(({ q, a, category }, index) => `<details id="${idFor(q)}"${index === 0 && !term ? " open" : ""}><summary>${highlight(q, term)}</summary><div class="answer"><p>${highlight(a, term)}</p><span>Was this helpful?</span><button data-vote="yes" aria-pressed="false">Yes</button><button data-vote="no" aria-pressed="false">No</button><button data-copy="${idFor(q)}">Copy link ↗</button><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href.split("#")[0] + "#" + idFor(q))}" target="_blank" rel="noopener">Share</a><small role="status"></small></div></details>`).join("");
    document.querySelectorAll("[data-category]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.category === active)));
}
search.addEventListener("input", render);
document.querySelector("#categories").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-category]");
    if (!button) return;
    active = button.dataset.category;
    render();
});
document.querySelectorAll("[data-search]").forEach((button) => button.addEventListener("click", () =>
{
    active = "All topics";
    search.value = button.dataset.search;
    render();
    search.focus();
}));
document.querySelector("#clear").addEventListener("click", () =>
{
    active = "All topics";
    search.value = "";
    render();
});
list.addEventListener("click", async (event) =>
{
    const vote = event.target.closest("[data-vote]");
    if (vote)
    {
        vote.closest(".answer").querySelectorAll("[data-vote]").forEach((button) => button.setAttribute("aria-pressed", String(button === vote)));
        vote.closest(".answer").querySelector("small").textContent = vote.dataset.vote === "yes" ? "Thanks — glad that helped. Feedback recorded for this visit." : "Thanks. Contact support below for a more specific answer.";
    }
    const copy = event.target.closest("[data-copy]");
    if (copy)
    {
        const url = new URL(location.href);
        url.hash = copy.dataset.copy;
        try
        {
            await navigator.clipboard.writeText(url.href);
            copy.closest(".answer").querySelector("small").textContent = "Answer link copied.";
        }
        catch
        {
            copy.closest(".answer").querySelector("small").textContent = url.href;
        }
    }
});
function openHash()
{
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    if (!groups.some((group) => group.slice(1).some(([q]) => idFor(q) === id))) return;
    active = "All topics";
    search.value = "";
    render();
    const answer = document.getElementById(id);
    answer.open = true;
    answer.scrollIntoView({ block: "center" });
}
addEventListener("hashchange", openHash);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
    {
        event.preventDefault();
        search.focus();
    }
});
document.querySelector("#print").addEventListener("click", () =>
{
    document.querySelectorAll("details").forEach((detail) => detail.open = true);
    window.print();
});
const dialog = document.querySelector("dialog");
document.querySelectorAll("[data-dialog]").forEach((button) => button.addEventListener("click", () =>
{
    const title = button.dataset.dialog;
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-copy").textContent = /documentation/i.test(title) ? "Quick guide: create a workspace, import your tasks, invite teammates and choose a board view. Ask for the guide you need below." : /video/i.test(title) ? "Library preview: Your first workspace (5 min), Building better boards (8 min), and Monthly team clinic (35 min). Tell us which walkthrough interests you." : /developer/i.test(title) ? "Developer preview: GET /projects lists authorized projects; use scoped bearer tokens and cursor pagination. Blog: A calmer weekly planning ritual. This is illustrative documentation." : /community/i.test(title) ? "Community preview: share workflow tips, explore team playbooks and join the monthly workspace clinic. This demo does not connect to a real forum." : "Tell us a little about what you need. This is a browser-only demo: no message is sent and no account or booking is created.";
    document.querySelector("#dialog-status").textContent = "";
    document.querySelector("#contact").reset();
    dialog.showModal();
}));
document.querySelector("#contact").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#dialog-status").textContent = "Demo request prepared. No email was sent and no booking or account was created.";
});
render();
openHash();
