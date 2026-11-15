let annual = false;
let selected = "Pro";
const seats = document.querySelector("#seats");
const currency = (value) => `$${value.toLocaleString("en-US")}`;
function update()
{
    const count = Number(seats.value);
    const rate = annual ? 12 : 15;
    document.querySelector("#annual").setAttribute("aria-checked", String(annual));
    document.querySelector("#pro-price").textContent = rate;
    document.querySelector("#pro-billing").textContent = annual ? "$144 per user billed annually. Save 20%." : "Billed monthly. Your team, your pace.";
    document.querySelector("#seat-count").value = count;
    document.querySelector("#total").textContent = currency(count * rate);
    document.querySelector("#total-period").textContent = annual ? "per month, billed annually" : "per month";
    document.querySelector("#annual-total").textContent = annual ? `${currency(count * 144)} billed yearly · save ${currency(count * 36)}/year` : `${currency(count * 180)} per year at monthly rates`;
}
document.querySelector("#annual").addEventListener("click", () =>
{
    annual = !annual;
    update();
});
seats.addEventListener("input", update);
const matrix =
[
    ["Core Features", [["Projects", "3", "Unlimited", "Unlimited"], ["Users", "1", "Up to 20", "Unlimited"], ["Storage", "1GB", "50GB", "Unlimited"], ["Task boards", true, true, true], ["Advanced analytics", false, true, true]]],
    ["Collaboration", [["Comments & mentions", true, true, true], ["Shared workspaces", false, true, true], ["Custom integrations", false, true, true], ["Guest permissions", false, true, true]]],
    ["Security", [["Encrypted in transit", true, true, true], ["Two-factor authentication", true, true, true], ["SSO / SAML", false, false, true], ["Custom contracts", false, false, true]]],
    ["Support", [["Support channel", "Email", "Priority", "Dedicated"], ["Knowledge base", true, true, true], ["SLA guarantee", false, false, true], ["Personal onboarding", false, false, true]]]
];
function renderMatrix()
{
    const differences = document.querySelector("#differences").checked;
    document.querySelector("#matrix").innerHTML = matrix.map(([group, rows]) =>
    {
        const filtered = rows.filter((row) => !differences || new Set(row.slice(1)).size > 1);
        return filtered.length ? `<tr class="group"><th colspan="4">${group}</th></tr>` + filtered.map(([name, ...values]) => `<tr class="feature-row"><td>${name}</td>${values.map((value) => `<td>${typeof value === "boolean" ? `<span role="img" aria-label="${value ? "Included" : "Not included"}">${value ? "✓" : "×"}</span>` : value}</td>`).join("")}</tr>`).join("") : "";
    }).join("");
}
document.querySelector("#differences").addEventListener("change", renderMatrix);
const dialog = document.querySelector("dialog");
function checkout(plan)
{
    selected = plan;
    document.querySelector("#checkout-title").textContent = plan === "Free" ? "A good place to begin." : "Find your flow with Pro.";
    const count = Number(seats.value);
    document.querySelector("#checkout-summary").innerHTML = plan === "Free" ? "<p><b>Free · $0 / month</b></p><p>1 user · 3 projects · 1GB storage</p><p>No credit card. No time limit.</p>" : `<p><b>Pro · ${count} ${count === 1 ? "seat" : "seats"} · ${annual ? "Annual" : "Monthly"}</b></p><p>${currency(count * (annual ? 12 : 15))} / month${annual ? ` · ${currency(count * 144)} billed yearly` : ""}</p><p>Due today: $0 · 14-day trial · no card collected</p><p>After trial: choose a paid plan or continue on Free.</p>`;
    document.querySelector("#checkout-status").textContent = "";
    document.querySelector("#checkout").reset();
    dialog.showModal();
}
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () => checkout(button.dataset.plan)));
document.querySelector("#checkout").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#checkout-status").textContent = `${selected} preview prepared. No account, trial subscription or payment was created.`;
});
document.querySelector("#enterprise-plan").addEventListener("click", () =>
{
    document.querySelector("#sales").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.querySelector("#sales-name").focus({ preventScroll: true });
});
document.querySelector("#sales-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#sales-status").textContent = "Your enterprise demo request is ready locally. No email was sent and no meeting was booked.";
});
update();
renderMatrix();
