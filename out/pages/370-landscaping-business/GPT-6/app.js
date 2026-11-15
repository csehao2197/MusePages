const plants =
[
    ["Lavender", "sun", "Dry, free-draining conditions; aromatic summer structure."],
    ["Salvia", "sun", "Long-flowering colour and a strong vertical rhythm."],
    ["Allium", "sun", "Sculptural flower heads above a layered border."],
    ["Fern", "shade", "Soft texture for sheltered, moisture-retentive corners."],
    ["Hellebore", "shade", "Quiet winter and early-spring interest."],
    ["Japanese anemone", "shade", "Airy late-season flowers; allow space for spread."]
];
function renderPlants()
{
    const light = document.querySelector("#light").value;
    document.querySelector("#plants").innerHTML = plants.filter((p) => light === "all" || light === p[1]).map(([name, condition, copy]) => `<article class="plant"><div class="leaf" aria-hidden="true"></div><p class="eyebrow">${condition === "sun" ? "MOSTLY SUN" : "PARTIAL SHADE"}</p><h3>${name}</h3><p>${copy}</p></article>`).join("");
}
document.querySelector("#light").onchange = renderPlants;
let plan = "";
function invalidate()
{
    plan = "";
    document.querySelector("#range").textContent = "Start with your space.";
    document.querySelector("#estimate-result").textContent = "Inputs changed. Explore the allowance again to update your range.";
    document.querySelector("#method").textContent = "";
    document.querySelector("#use-plan").hidden = true;
}
document.querySelector("#estimate-form").oninput = invalidate;
document.querySelector("#estimate-form").onsubmit = (event) =>
{
    event.preventDefault();
    const area = Number(document.querySelector("#area").value);
    const focus = document.querySelector("#focus").value;
    const restricted = document.querySelector("#access").value === "restricted";
    if (!Number.isFinite(area) || area < 10 || area > 2000)
    {
        document.querySelector("#range").textContent = "Let’s check the area.";
        document.querySelector("#estimate-result").textContent = "Enter an area from 10 to 2,000 m².";
        return;
    }
    let low, high, method;
    if (focus === "Design")
    {
        low = 1500 + area * 8;
        high = 2500 + area * 15;
        method = "Example design allowance: £1,500 + £8/m² to £2,500 + £15/m². Build costs excluded.";
    }
    else if (focus === "Planting")
    {
        low = area * 45;
        high = area * 85;
        method = "Example planting allowance: £45–£85/m². Groundworks and specialist trees excluded.";
    }
    else
    {
        low = 80 + area * .4;
        high = 120 + area * .8;
        method = "Example care visit: £80 + £0.40/m² to £120 + £0.80/m². Frequency depends on the site.";
    }
    const currency = (n) => `£${Math.round(n).toLocaleString("en-GB")}`;
    const range = `${currency(low)}–${currency(high)}${focus === "Care" ? " / visit" : ""}`;
    document.querySelector("#range").textContent = range;
    document.querySelector("#estimate-result").textContent = `${focus}, ${area} m². ${restricted ? "Restricted access: range excludes any access adjustment; a site assessment is essential." : "Standard access assumed; a site assessment is still required."}`;
    document.querySelector("#method").textContent = method;
    plan = `${focus} for approximately ${area} m². Example planning allowance ${range}. ${restricted ? "Restricted" : "Standard"} access. `;
    document.querySelector("#use-plan").hidden = false;
};
document.querySelectorAll("[data-service]").forEach((button) => button.onclick = () =>
{
    document.querySelector("#focus").value = button.dataset.service;
    invalidate();
    document.querySelector("#planner").scrollIntoView();
});
document.querySelector("#use-plan").onclick = () => document.querySelector("[name='message']").value = plan;
document.querySelector("#contact-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    document.querySelector("#contact-result").textContent = !f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) || f.message.value.trim().length < 10 ? "Enter your name, a valid email and at least 10 characters about your garden." : `Garden brief prepared for ${f.name.value.trim()}. Nothing sent; no consultation booked.`;
};
const zones =
[
    ["A framework of green", "Clipped hedges and existing mature trees give the garden a clear structure through the year."],
    ["A layered border", "Perennials, grasses and bulbs create overlapping seasons of colour, texture and pollinator interest."],
    ["A place to gather", "A sheltered seating area is set into the composition, close enough to the house to become part of everyday life."],
    ["Productive beauty", "An enclosed kitchen garden balances practical beds with espaliered fruit, with access to water and good circulation."]
];
document.querySelector("#case-open").onclick = () => document.querySelector("#case").showModal();
document.querySelector("#close").onclick = () => document.querySelector("#case").close();
document.querySelectorAll("[data-zone]").forEach((button) => button.onclick = () =>
{
    const zone = zones[Number(button.dataset.zone)];
    document.querySelector("#zone-title").textContent = zone[0];
    document.querySelector("#zone-copy").textContent = zone[1];
    document.querySelectorAll("[data-zone]").forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
});
document.querySelector("#menu").onclick = (event) => event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
renderPlants();
