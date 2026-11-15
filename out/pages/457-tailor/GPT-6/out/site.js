const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
let clothPreference = "";
document.querySelectorAll("[data-cloth]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        clothPreference = button.dataset.cloth;
        document.querySelectorAll("[data-cloth]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        document.querySelector("#cloth-status").textContent = `${clothPreference} selected for your local draft. Confirm actual cloth and stock at consultation.`;
    });
});
const prices =
{
    suit: ["Two-piece suit", 3200, 3600],
    three: ["Three-piece suit", 3800, 4200],
    dinner: ["Dinner suit", 3900, 4400],
    overcoat: ["Overcoat", 3400, 3900],
    sport: ["Sport coat", 2400, 2700],
    shirts: ["Four shirts (minimum order)", 1120, 1280]
};
const gbp = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
document.querySelector("#garment").addEventListener("change", (event) =>
{
    const [name, from, typical] = prices[event.target.value];
    document.querySelector("#price-estimate").textContent = `${name}: from ${gbp(from)}. Typical ${gbp(typical)}. Indicative only.`;
});
document.querySelector("#fitting-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#fitting-status").textContent = `${document.querySelector("#purpose").value} in ${document.querySelector("#city").value}${clothPreference ? ` / ${clothPreference}` : ""}. Local draft previewed. No appointment booked, nothing sent or stored.`;
});
