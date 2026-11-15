const cases =
[
    ["2025", "Post-merger operating model, industrial manufacturer", "18% SG&A reduction in 11 months", "Industrial", "Decision rights, budgets and accountability were brought into one operating model. Scope and baseline matter: the metric describes this illustrative engagement only."],
    ["2025", "Pricing architecture rebuild, specialty distributor", "420bps gross margin recovery", "Industrial", "Segment economics, discount exceptions and deal-desk authority were examined together rather than as independent policies."],
    ["2024", "Multi-site staffing model, regional health system", "$31M annualised labour savings", "Healthcare", "Site-level demand and staffing patterns informed a common planning model with room for local clinical needs."],
    ["2024", "Supply base consolidation, automotive supplier", "Tier-1 count reduced from 340 to 96", "Industrial", "Supplier concentration was evaluated alongside resilience, qualification and transition risk."],
    ["2023", "Cash stabilisation, family-held manufacturer", "Covenant compliance restored in two quarters", "Industrial", "A cash-first cadence created a decision window before the longer structural work began."],
    ["2023", "Value creation plan, PE-backed services platform", "Adjusted EBITDA up 2.4x over hold", "Private Equity", "A sequenced operating plan connected investment priorities with accountable owners and measurable milestones."]
];
function render()
{
    const filter = document.querySelector("#work-filter").value;
    const selected = cases.filter((item) => filter === "All industries" || item[3] === filter);
    const list = document.querySelector("#case-list");
    list.replaceChildren();
    for (const [year, name, outcome, industry, description] of selected)
    {
        const detail = document.createElement("details");
        detail.className = "case";
        const summary = document.createElement("summary");
        for (const [value, className] of [[year, "mono"], [name, "case-title"], [outcome, "outcome"], ["+", "mono"]])
        {
            const span = document.createElement("span");
            span.className = className;
            span.textContent = value;
            summary.append(span);
        }
        const text = document.createElement("p");
        text.textContent = `${industry} / ${description}`;
        detail.append(summary, text);
        list.append(detail);
    }
    document.querySelector("#work-count").textContent = selected.length ? `${selected.length} selected engagements` : "No public case studies in this sector. Start a conversation to request relevant work under NDA.";
}
document.querySelector("#work-filter").addEventListener("change", render);
document.querySelectorAll("[data-industry]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#work-filter").value = button.dataset.industry;
    render();
    document.querySelector("#work").scrollIntoView();
}));
const notes =
[
    ["Span of control is a symptom, not a cause", "A flatter chart does not redistribute decisions by itself. Start with the recurring choices that consume leadership time: who owns each choice, what evidence is required, and which budget pays for it? Redesign those mechanisms before changing reporting lines. Otherwise the old committees return under new names."],
    ["The first ninety days are mostly about sequencing", "Not every integration decision deserves day-one urgency. Separate obligations that protect business continuity from choices that create value. Assign an owner to the dependencies between them. The useful plan is not the longest checklist; it is the one that makes irreversible choices explicit."],
    ["Your discount policy is your real pricing strategy", "List price explains ambition. Realised price explains behaviour. Examine which exceptions recur, who can approve them and whether customers actually trade value for concessions. A useful pricing architecture makes those trade-offs visible, rather than replacing judgement with another approval layer."]
];
document.querySelectorAll("[data-insight]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, copy] = notes[Number(button.dataset.insight)];
    document.querySelector("#insight-title").textContent = title;
    document.querySelector("#insight-copy").textContent = copy;
    document.querySelector("#insight-dialog").showModal();
}));
document.querySelector("#close").addEventListener("click", () => document.querySelector("#insight-dialog").close());
document.querySelector("#discuss").addEventListener("click", () => document.querySelector("#insight-dialog").close());
document.querySelector("#contact-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const company = document.querySelector("#company").value.trim();
    const email = document.querySelector("#email");
    const question = document.querySelector("#question").value.trim();
    const status = document.querySelector("#contact-status");
    document.querySelector("#brief").hidden = true;
    if (name.length < 2 || company.length < 2)
    {
        status.textContent = "Add your name and company, at least two characters each.";
        return;
    }
    if (!email.value || !email.validity.valid)
    {
        status.textContent = "Enter a valid email address.";
        return;
    }
    if (question.length < 20)
    {
        status.textContent = "Describe the question in at least 20 characters.";
        return;
    }
    document.querySelector("#brief-copy").textContent = `${name} / ${company} — ${question} First conversation: clarify the decision, the evidence needed and the owner.`;
    document.querySelector("#brief").hidden = false;
    status.textContent = "Conversation brief prepared locally. Nothing sent; no meeting scheduled.";
});
document.querySelector("#reset").addEventListener("click", () =>
{
    HTMLFormElement.prototype.reset.call(document.querySelector("#contact-form"));
    document.querySelector("#brief-copy").textContent = "";
    document.querySelector("#brief").hidden = true;
    document.querySelector("#contact-status").textContent = "Brief and personal details cleared.";
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
render();
