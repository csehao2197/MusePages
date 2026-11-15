const services =
[
    ["Helpdesk", "Phone, email and portal support with clear hours and an agreed escalation path."],
    ["Infrastructure", "Servers, networks, firewalls and Wi-Fi, on premises or in the cloud."],
    ["Microsoft 365", "Tenant configuration, migration planning, device management and licence reviews."],
    ["Cyber Essentials", "Readiness support and remediation planning. Certification requires independent assessment."],
    ["Backup & recovery", "A backup plan is only meaningful when restores are tested and documented."],
    ["Procurement", "Specification, setup, asset tagging and a sensible lifecycle for your equipment."]
];
document.querySelector("#service-grid").innerHTML = services.map(([name, text], id) => `<article class="service"><span>0${id + 1} /</span><h3>${name}</h3><p>${text}</p></article>`).join("");
document.querySelectorAll(".service").forEach((el) => el.onpointermove = (event) =>
{
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - r.left}px`);
    el.style.setProperty("--y", `${event.clientY - r.top}px`);
});
const tiers =
[
    ["P1", "Whole site down", 4, 15, "Escalate a site-wide outage."],
    ["P2", "Department blocked", 11, 30, "Assess a department-level disruption."],
    ["P3", "Individual blocked, workaround exists", 26, 120, "Review the individual issue and workaround."],
    ["P4", "Request, change or question", 74, 480, "Schedule a routine request."]
];
document.querySelector("#sla-rows").innerHTML = tiers.map(([name, example, actual, target]) => `<div class="sla-row"><b>${name}</b><span>${example}</span><div class="bar" aria-label="Example ${actual} minutes against ${target} minute target"><i style="width:${actual / target * 100}%"></i></div><strong>${actual}m / ${target}m</strong></div>`).join("");
document.querySelector("#incident").onchange = (event) =>
{
    const t = tiers[Number(event.target.value)];
    document.querySelector("#incident-result").textContent = `${t[0]} · Example target ${t[3]}m · ${t[4]}`;
    document.querySelector("#ticket-title").textContent = t[1];
    document.querySelector("#ticket-priority").textContent = t[0];
    document.querySelector("#ticket-target").textContent = `${t[3]}m`;
    resetDemo();
};
let demoStep = 0;
const demoStates =
[
    "Ready to simulate triage. No systems are monitored.",
    "Simulated: impact recorded and ticket classified. Nothing submitted.",
    "Simulated: example engineer assigned. No real person has been notified.",
    "Demo complete: next step would be diagnosis. No issue was fixed or monitored."
];
function resetDemo()
{
    demoStep = 0;
    document.querySelector("#ticket-state").textContent = demoStates[0];
    document.querySelector("#simulate").disabled = false;
    document.querySelector("#simulate").textContent = "Run support demo →";
}
document.querySelector("#simulate").onclick = (event) =>
{
    demoStep++;
    document.querySelector("#ticket-state").textContent = demoStates[demoStep];
    event.target.textContent = demoStep === 3 ? "Demo complete" : "Next demo step →";
    event.target.disabled = demoStep === 3;
};
document.querySelector("#reset-demo").onclick = resetDemo;
const plans =
[
    ["Essential", 42, ["Helpdesk", "Patching & monitoring", "Microsoft 365 management", "Backup planning"]],
    ["Complete", 64, ["Everything in Essential", "Priority-one out-of-hours scope", "Named engineer", "Quarterly review"]],
    ["Complete + Infrastructure", 89, ["Everything in Complete", "Server & network scope", "Firewall & Wi-Fi scope", "Monthly on-site day"]]
];
function renderPrices()
{
    const n = Number(document.querySelector("#staff").value);
    const valid = Number.isInteger(n) && n >= 15 && n <= 200;
    document.querySelector("#price-error").textContent = valid ? "" : "Enter a whole team size from 15 to 200.";
    document.querySelector("#pricing-grid").innerHTML = plans.map(([name, price, items], id) => `<article class="plan ${id === 1 ? "featured" : ""}"><p class="eyebrow">${id === 1 ? "BROADER COVERAGE" : "MANAGED SUPPORT"}</p><h3>${name}</h3><p class="cost">£${price}<small> / user</small></p><p class="note">per month, excluding VAT</p><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul><p class="total">${valid ? `£${(n * price).toLocaleString("en-GB")} / month` : "Choose team size"}</p><button class="button" data-plan="${id}" ${valid ? "" : "disabled"}>Explore ${id === 2 ? "Infrastructure" : name} ↗</button></article>`).join("");
}
document.querySelector("#staff").oninput = renderPrices;
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-plan]");
    if (button)
    {
        document.querySelector("[name='plan']").value = plans[Number(button.dataset.plan)][0];
        document.querySelector("#contact-staff").value = document.querySelector("#staff").value;
        document.querySelector("#contact").scrollIntoView();
    }
});
document.querySelector("#contact-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const n = Number(f.staff.value);
    document.querySelector("#contact-result").textContent = !f.company.value.trim() || !f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) || !Number.isInteger(n) || n < 15 || n > 200 || f.message.value.trim().length < 10 ? "Enter company, name, valid email, 15–200 staff and a description of at least 10 characters." : `${f.plan.value} discovery brief for ${f.company.value.trim()}, ${n} staff, prepared locally. No call booked or request submitted.`;
};
document.querySelector("#portal").onclick = () => document.querySelector("#portal-dialog").showModal();
document.querySelector("#close").onclick = () => document.querySelector("#portal-dialog").close();
document.querySelector("#support-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const t = tiers[f.impact.selectedIndex];
    document.querySelector("#support-result").textContent = f.summary.value.trim().length < 10 ? "Add a summary of at least 10 characters." : `Simulated ${t[0]} ticket. Example response target ${t[3]} minutes. Nothing submitted; contact your actual support provider.`;
};
document.querySelector("#menu").onclick = (event) => event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
renderPrices();
