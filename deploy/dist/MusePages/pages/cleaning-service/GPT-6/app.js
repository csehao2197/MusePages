const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const services =
[
    ["House Cleaning", "Regular attention to bedrooms, kitchens, bathrooms and everyday living spaces.", 89, "home", "Bedrooms", 20],
    ["Office Cleaning", "Workspaces, shared areas and meeting rooms, with a scope designed around your routine.", 120, "work", "500 sq ft units", 30],
    ["Deep Cleaning", "Detailed surface cleaning, baseboards and the corners that deserve a little extra time.", 180, "home", "Bedrooms", 20],
    ["Move In / Out", "An empty-property fresh start, including cabinets, fixtures and agreed surfaces.", 200, "home", "Bedrooms", 20],
    ["Carpet Cleaning", "Discuss fibre type, stain assessment and a suitable extraction approach before cleaning.", 75, "special", "Rooms", 75],
    ["Window Cleaning", "Interior and accessible exterior glass, with access requirements agreed in advance.", 60, "special", "Sets of 5 windows", 60]
];
let active = "all";
function render()
{
    const matches = services.map((item, index) => ({ item, index })).filter(({ item }) => active === "all" || item[3] === active);
    document.querySelector("#service-list").innerHTML = matches.map(({ item: s, index }) => `<article class="service"><span>${String(index + 1).padStart(2, "0")} / ${s[3].toUpperCase()}</span><h3>${s[0]}</h3><p>${s[1]}</p><strong>From $${s[2]}${index === 4 ? " / room" : index === 5 ? " / 5 windows" : ""}</strong><button data-plan="${index}">Build this estimate ↗</button></article>`).join("");
    document.querySelector("#service-count").textContent = `${matches.length} service${matches.length === 1 ? "" : "s"} shown`;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    active = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    render();
}));
const service = document.querySelector("#service");
function estimate()
{
    const s = services[Number(service.value)];
    document.querySelector("#unit-label").textContent = s[4];
    const units = Number(document.querySelector("#units").value);
    const valid = Number.isInteger(units) && units >= 1 && units <= 10;
    const base = s[2] + (units - 1) * s[5];
    const extras = [...document.querySelectorAll(".extra:checked")].reduce((sum, item) => sum + Number(item.value), 0);
    const discount = base * Number(document.querySelector("#frequency").value) / 100;
    document.querySelector("#total").textContent = valid ? `$${(base - discount + extras).toFixed(2)}` : "Check size";
    document.querySelector("#breakdown").textContent = valid ? `Base $${base.toFixed(2)} · extras $${extras.toFixed(2)} · discount $${discount.toFixed(2)}` : "Choose 1–10 whole units for a sample estimate.";
}
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-plan]");
    if (!button) return;
    service.value = button.dataset.plan;
    estimate();
    document.querySelector("#quote").scrollIntoView();
});
document.querySelector("#quote").addEventListener("input", () =>
{
    document.querySelector("#status").textContent = "";
    estimate();
});
service.addEventListener("change", estimate);
document.querySelector("#frequency").addEventListener("change", estimate);
document.querySelector("#quote").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const say = (text) => document.querySelector("#status").textContent = text;
    const units = Number(document.querySelector("#units").value);
    if (!Number.isInteger(units) || units < 1 || units > 10) return say("Choose 1–10 whole units.");
    const zip = document.querySelector("#zip").value;
    if (!/^\d{5}$/.test(zip)) return say("Enter a five-digit ZIP code.");
    if (!/^(100|101|102|103|104|606|607|608)/.test(zip)) return say("Outside the sample area. Call the team about your location; no coverage is promised.");
    if (!document.querySelector("#name").value.trim()) return say("Please add your full name.");
    const date = document.querySelector("#date").value;
    if (!date || date < new Date().toLocaleDateString("en-CA")) return say("Choose today or a future date.");
    if (new Date(`${date}T12:00:00`).getDay() === 0) return say("The sample team is closed on Sundays. Choose Monday to Saturday.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value)) return say("Enter a valid email address.");
    const phone = document.querySelector("#phone").value.replace(/\D/g, "");
    if (phone.length < 10 || phone.length > 15) return say("Enter a phone number with 10–15 digits.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a sample cleaning plan.");
    say(`${services[Number(service.value)][0]} plan for ${date}, ZIP ${zip}: ${document.querySelector("#total").textContent} per visit before any applicable tax or scope adjustments. Nothing booked, charged or sent. Call to confirm a real quote.`);
});
render();
estimate();
