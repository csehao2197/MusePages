const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const stock = [
    { name: "Almond croissants", count: 3, min: 24 },
    { name: "Sourdough loaves", count: 8, min: 12 },
    { name: "House blend coffee", count: 32, min: 10 }
];
function renderStock()
{
    const visible = stock.filter((item) => !document.querySelector("#low-only").checked || item.count < item.min);
    document.querySelector("#stock-list").innerHTML = visible.length ? visible.map((item) => `<div class="stock-row"><div><b>${item.name}</b><span>${item.count} units · minimum ${item.min}</span></div>${item.count < item.min ? `<button data-reorder="${stock.indexOf(item)}">Reorder demo</button>` : "<span>Stock healthy</span>"}</div>`).join("") : '<p class="tiny">All sample products are above their minimum. Shelves looking good.</p>';
}
document.querySelector("#low-only").addEventListener("change", renderStock);
document.querySelector("#stock-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-reorder]");
    if (!button) return;
    const item = stock[Number(button.dataset.reorder)];
    item.count = item.min;
    document.querySelector("#stock-status").textContent = `${item.name}: sample stock set to ${item.min}. No order was placed.`;
    renderStock();
});
renderStock();
document.querySelector("#period").addEventListener("change", (event) =>
{
    const week = event.target.value === "week";
    document.querySelector("#revenue").textContent = week ? "$24,180" : "$3,842";
    const values = week ? [55, 62, 42, 87, 100, 91, 70, 80] : [28, 42, 75, 100, 65, 58, 82, 50];
    document.querySelectorAll(".chart i").forEach((bar, i) => bar.style.setProperty("--h", `${values[i]}%`));
    document.querySelector(".chart").setAttribute("aria-label", week ? "Illustrative weekly sales chart" : "Illustrative hourly sales chart");
});
document.querySelector("#receipt").addEventListener("click", () =>
{
    document.querySelector("#receipt-status").textContent = "Sample receipt: Flat white $4.50 + Almond croissant $5.00 = $9.50. Not a payment or tax receipt.";
});
document.querySelectorAll("[data-billing]").forEach((button) => button.addEventListener("click", () =>
{
    const annual = button.dataset.billing === "annual";
    document.querySelectorAll("[data-billing]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll("[data-price]").forEach((price) => price.textContent = Math.round(Number(price.dataset.price) * (annual ? .8 : 1)));
    document.querySelector("#billing-note").textContent = annual ? "Annual billing: rounded monthly equivalents. Pro $468/year; Scale $1,140/year. No checkout is connected." : "Monthly billing. No checkout is connected.";
}));
const dialog = document.querySelector("dialog");
const modalBody = document.querySelector("#modal-body");
document.querySelector(".close").addEventListener("click", () => dialog.close());
function openDialog(title)
{
    document.querySelector("#modal-title").textContent = title;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    dialog.showModal();
}
document.querySelectorAll("[data-start]").forEach((button) => button.addEventListener("click", () =>
{
    modalBody.innerHTML = '<p>Build a local setup checklist. No account, trial, sales contact or subscription is created.</p><form id="setup"><label>Store nickname<input name="store" required minlength="2" maxlength="60" placeholder="Your corner shop"></label><label>Store type<select name="type"><option>Bakery or café</option><option>Boutique</option><option>Grocery</option><option>Other retail</option></select></label><label><input name="consent" type="checkbox" required> I understand this is a browser-only demo.</label><button class="primary">Create local checklist ↗</button><p id="setup-status" role="status"></p></form>';
    openDialog(`${button.dataset.start} · get a feel for Flore`);
    document.querySelector("#setup").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const form = event.target;
        const name = form.elements.store.value.trim();
        if (name.length < 2)
        {
            form.elements.store.setCustomValidity("Enter at least two visible characters.");
            form.elements.store.reportValidity();
            return;
        }
        document.querySelector("#setup-status").textContent = `${name}: 1. Add your sample catalogue. 2. Set stock thresholds. 3. Preview your first sale. Local checklist only; no account was created.`;
    });
    document.querySelector('[name="store"]').addEventListener("input", (event) => event.target.setCustomValidity(""));
}));
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    const privacy = button.dataset.info.includes("Privacy");
    modalBody.textContent = privacy ? "This local concept page stores no cookies or credentials and sends no form data. Any checklist remains in page memory until reload. No service agreement is offered." : `${button.dataset.info} is a product concept, not a connected service. Explore the working sample stockroom, pricing selector and local setup checklist on this page. No sign-in or credentials are requested.`;
    openDialog(button.dataset.info);
}));
