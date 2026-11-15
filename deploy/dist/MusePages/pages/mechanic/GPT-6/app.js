const items = [
    { id: "mot", name: "MOT Test (Class 4)", price: 29.99, time: "45–60 min" },
    { id: "full", name: "Full Service", price: 149, time: "2–3 hrs" },
    { id: "interim", name: "Interim Service", price: 89, time: "1–2 hrs" },
    { id: "pads", name: "Brake Pads (per axle)", price: 79, time: "1 hr" },
    { id: "discs", name: "Brake Discs + Pads", price: 149, time: "1.5 hrs" },
    { id: "air", name: "Air Con Regas", price: 49, time: "30–45 min" },
    { id: "scan", name: "Diagnostic Scan", price: 35, time: "30 min" },
    { id: "tyre", name: "Tyre Supply & Fit (each)", price: 49, time: "20 min" },
    { id: "engine", name: "Engine Repair", price: 95, time: "Assessment" }
];
const chosen = new Set();
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
document.querySelector("#rates").innerHTML = items.slice(0, 8).map((item) => `<tr><td>${item.name}</td><td>${money(item.price)}</td><td>${item.time}</td><td><button data-add="${item.id}" aria-label="Add ${item.name}">+</button></td></tr>`).join("");
function render()
{
    const selected = items.filter((item) => chosen.has(item.id));
    document.querySelector("#selected").innerHTML = selected.length ? selected.map((item) => `<div class="selection"><span>${item.name}</span><button data-remove="${item.id}" aria-label="Remove ${item.name}">×</button></div>`).join("") : "<p>No services selected. Add a service to begin.</p>";
    const sum = selected.reduce((total, item) => total + Math.round(item.price * 100), 0);
    document.querySelector("#subtotal").textContent = money(sum / 100);
    document.querySelector("#vat").textContent = money(Math.round(sum * .2) / 100);
    document.querySelector("#total").textContent = money((sum + Math.round(sum * .2)) / 100);
    document.querySelectorAll("[data-add]").forEach((button) => button.setAttribute("aria-pressed", String(chosen.has(button.dataset.add))));
}
document.addEventListener("click", (event) =>
{
    const add = event.target.closest("[data-add]");
    const remove = event.target.closest("[data-remove]");
    if (add)
    {
        chosen.add(add.dataset.add);
        render();
    }
    if (remove)
    {
        chosen.delete(remove.dataset.remove);
        render();
    }
});
document.querySelector("#clear").addEventListener("click", () =>
{
    chosen.clear();
    render();
});
render();
const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
    }
});
new IntersectionObserver(([entry]) => document.querySelector(".hero-bar").classList.toggle("hidden", !entry.isIntersecting), { threshold: .2 }).observe(document.querySelector(".hero"));
const form = document.querySelector("#visit");
const result = document.querySelector("#result");
const date = document.querySelector("#date");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    let error = "";
    if (!chosen.size) error = "Add at least one service to your estimate.";
    else if (!data.get("name").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email"))) error = "Enter an example name and valid example email.";
    else if (!data.get("vehicle").trim()) error = "Add a vehicle make and model.";
    else if (!date.value || date.value < date.min) error = "Choose today or a future date.";
    else if (new Date(`${date.value}T12:00:00`).getDay() === 0) error = "Sunday is workshop closed. Choose Monday–Saturday.";
    else if (!data.get("ack")) error = "Confirm the local-only acknowledgement.";
    result.textContent = error || `Local visit plan: ${chosen.size} service(s), from ${document.querySelector("#total").textContent} including illustrative VAT, ${date.value}. No appointment booked or enquiry sent.`;
});
form.addEventListener("reset", () => { result.textContent = ""; });
