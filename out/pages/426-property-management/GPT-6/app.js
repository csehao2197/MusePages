const services = [
    ["Marketing & Listing Syndication", "Professional photos and distribution to 40+ rental sites within 48 hours of go-live."],
    ["Tenant Screening", "Background, credit, income, and rental history checks on every adult applicant."],
    ["Lease Preparation & Execution", "Texas-compliant lease, digital signing, and required disclosures."],
    ["Rent Collection", "Online payments, automatic late fees, and clear escalation."],
    ["Owner Accounting & Statements", "Monthly statements, year-end 1099, and downloadable ledgers."],
    ["Maintenance Coordination", "Vetted licensed vendors, no markup, and photo documentation."],
    ["24/7 Emergency Response", "The service described includes a real person on the emergency line."],
    ["Property Inspections", "Move-in, move-out, and annual mid-lease photo reports."],
    ["Lease Renewals", "Market-rate analysis and negotiation. No renewal fee."],
    ["Eviction Management", "Filing, counsel coordination, and court attendance."]
];
document.querySelector(".service-list").innerHTML = services.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p><span>Included</span></article>`).join("");
const comparisons = [["Listing on 40+ sites", "Included", "You post individually"], ["Full applicant screening", "Included", "Usually credit only"], ["24/7 emergency line", "Included", "Your phone"], ["Vetted licensed vendors", "Included", "Whoever answers"], ["Vendor invoice markup", "None", "N/A"], ["Texas-compliant lease", "Included", "Template you found online"], ["Late rent enforcement", "Automated", "An awkward text"], ["Annual inspections", "Included", "Rarely happen"], ["Eviction handling", "Managed", "You in court"], ["Average days to lease", "19 (brief data)", "34 (brief data)"]];
document.querySelector(".comparison").insertAdjacentHTML("beforeend", comparisons.map(([name, ours, theirs]) => `<div class="comparison-row"><span>${name}</span><b>${ours}</b><span>${theirs}</span></div>`).join(""));
document.querySelector(".areas").innerHTML = ["Central Austin", "South Congress", "East Austin", "Mueller", "Cedar Park", "Round Rock", "Pflugerville", "Georgetown", "Leander", "Kyle", "Buda", "Dripping Springs"].map((area) => `<li>${area}</li>`).join("");
const faqs = [["How quickly can you lease my property?", "The brief's average is 19 days against 34 for the market. These are illustrative figures, not a leasing guarantee. Above-market pricing can take longer."], ["Do you mark up maintenance invoices?", "The described service charges exactly what the vendor charges, with every invoice attached to the monthly statement."], ["What happens if a tenant stops paying?", "The described policy sends late notices on day four, then coordinates filing and counsel. Actual action follows the lease and applicable law."], ["Can I use my own contractor?", "Yes. Provide the contact and spend authority and the manager will schedule through them."], ["Am I locked into a contract?", "The brief describes an annual agreement with a 30-day termination clause and no termination penalty after the first 90 days. Confirm actual terms before signing."], ["Do you manage short-term rentals?", "The service described is for long-term residential leases of twelve months or more."]];
document.querySelector("#faqs").innerHTML = faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("");
const rent = document.querySelector("#rent");
const units = document.querySelector("#units");
function calculate()
{
    const count = Number(units.value);
    const valid = units.value !== "" && Number.isInteger(count) && count >= 1 && count <= 100;
    document.querySelector("#unit-error").textContent = valid ? "" : "Enter a whole number from 1 to 100.";
    document.querySelector("#rent-label").textContent = Number(rent.value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    const rate = count >= 5 ? .07 : count >= 2 ? .075 : .08;
    document.querySelector("#fee").textContent = valid ? `$${Math.round(Number(rent.value) * count * rate).toLocaleString("en-US")}` : "—";
    document.querySelector("#rate").textContent = valid ? `${(rate * 100).toFixed(1)}% of collected rent · no leasing fee on renewals` : "A valid unit count is needed for an estimate.";
}
rent.addEventListener("input", calculate);
units.addEventListener("input", calculate);
for (const [id, delta] of [["minus", -1], ["plus", 1]])
{
    document.querySelector(`#${id}`).addEventListener("click", () =>
    {
        units.value = Math.max(1, Math.min(100, (Number(units.value) || 1) + delta));
        calculate();
    });
}
const dialog = document.querySelector("dialog");
function open(title, html)
{
    document.querySelector("#modal-title").textContent = title;
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelectorAll("[data-portal]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.dataset.portal === "Maintenance request")
    {
        open("Prepare a maintenance request", '<p>Local demo. For an emergency, contact your actual manager directly.</p><form id="maintenance"><label>Issue description<textarea required minlength="10" name="issue"></textarea></label><label>Urgency<select name="urgency"><option>Routine</option><option>Urgent</option></select></label><button>Preview request</button><p id="request-status" role="status"></p></form>');
        document.querySelector("#maintenance").addEventListener("submit", (event) =>
        {
            event.preventDefault();
            const data = new FormData(event.target);
            document.querySelector("#request-status").textContent = `${data.get("urgency")} draft: ${data.get("issue")}. Saved on screen only — not submitted or scheduled.`;
        });
    }
    else open(button.dataset.portal, "<p>This static preview has no account authentication or payment processing. Use the verified portal supplied by your real property manager.</p><p>No credentials or banking information are requested here.</p><a href='#tenants' id='back-tenant'>View tenant help →</a>");
}));
document.querySelector("#rentals").addEventListener("click", () => open("Available rentals", "<p>No live inventory is connected. Contact the property manager to check current availability; no rental application is collected here.</p>"));
document.querySelector(".cta form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.target);
    document.querySelector("#form-status").textContent = `Draft ready for ${data.get("type")} at ${data.get("address")}. Contact your manager to send it. This page has not requested or produced a market valuation.`;
});
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
