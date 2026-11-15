const menus =
{
    Espresso: [["Double Espresso", 2.8, "Ristretto-style pull, 18g dose, 30ml extraction. Bright and syrupy."], ["Flat White", 3.6, "Double ristretto, microfoam textured to silk. Our most-ordered drink."], ["Cortado", 3.4, "Equal parts espresso and steamed milk. Small, strong, precise."], ["Cappuccino", 3.5, "Third foam, third milk, third espresso. Dry or wet — just ask."]],
    "Pour Over": [["Chemex Filter", 4.5, "Ethiopia Yirgacheffe. Floral, stone fruit, clean finish. Allow 6 minutes."], ["V60 Seasonal", 4.2, "Our rotating single-origin pick. Ask what is pouring today."], ["Aeropress Classic", 3.8, "Full immersion, 2-minute steep. Rich body, low acidity."]],
    "Cold Brew": [["24-Hour Cold Brew", 4.2, "Steeped 24 hours in filtered water. Naturally sweet."], ["Cold Brew Tonic", 4.6, "Cold brew, tonic and ice. Effervescent and unexpected."], ["Espresso Tonic", 4.4, "Double espresso over ice-cold tonic. Bittersweet and bright."]],
    Food: [["Almond Croissant", 4.2, "Twice-baked with frangipane. Flaky, buttery, genuinely dangerous."], ["Avocado Toast", 7.5, "Sourdough, smashed avocado, lemon, chilli, sea salt."], ["Seasonal Porridge", 5.8, "Oats, fruit compote, toasted seeds, oat milk. Vegan."], ["Cheese & Ham Toastie", 6.5, "Comté and honey-glazed ham on sourdough. Pressed to order."]]
};
let category = "Espresso";
let selected = { name: "Flat White", price: 3.6 };
const dialog = document.querySelector("#order-dialog");
function choose(name, price)
{
    selected = { name, price: Number(price) };
    document.querySelector("#chosen").textContent = name;
    document.querySelector("#quantity").value = "1";
    document.querySelector("#order-status").textContent = "No order or payment will be submitted.";
    total();
    dialog.showModal();
}
function total()
{
    const quantity = Number(document.querySelector("#quantity").value);
    document.querySelector("#total").textContent = Number.isInteger(quantity) && quantity > 0 && quantity <= 10 ? `£${(selected.price * quantity).toFixed(2)}` : "Choose 1–10";
}
function render()
{
    const panel = document.querySelector("#menu-panel");
    const query = document.querySelector("#search").value.trim().toLowerCase();
    panel.replaceChildren();
    const results = menus[category].filter((item) => item.join(" ").toLowerCase().includes(query));
    for (const [name, price, description] of results)
    {
        const card = document.createElement("article");
        card.className = "menu-item";
        const title = document.createElement("h3");
        title.textContent = name;
        const copy = document.createElement("p");
        copy.textContent = description;
        const button = document.createElement("button");
        button.className = "text-button";
        button.textContent = `Plan one · £${price.toFixed(2)} ↗`;
        button.addEventListener("click", () => choose(name, price));
        card.append(title, copy, button);
        panel.append(card);
    }
    if (!results.length) panel.textContent = "No matching rituals. Try a different word or category.";
}
const tabs = [...document.querySelectorAll("[data-tab]")];
function activate(tab)
{
    category = tab.dataset.tab;
    document.querySelector("#search").value = "";
    tabs.forEach((item) =>
    {
        item.setAttribute("aria-selected", String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
    });
    document.querySelector("#menu-panel").setAttribute("aria-labelledby", tab.id);
    render();
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) =>
    {
        let next;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index + tabs.length - 1) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs.at(-1);
        if (next)
        {
            event.preventDefault();
            activate(next);
            next.focus();
        }
    });
});
document.querySelector("#search").addEventListener("input", render);
document.querySelectorAll("[data-order]").forEach((button) => button.addEventListener("click", () => choose(button.dataset.order, button.dataset.price)));
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#quantity").addEventListener("input", total);
document.querySelector("#order-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = document.querySelector("#date").value;
    const time = document.querySelector("#time").value;
    const quantity = Number(document.querySelector("#quantity").value);
    const status = document.querySelector("#order-status");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    {
        status.textContent = "Choose 1–10 items.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA") || !time)
    {
        status.textContent = "Choose a future pickup day and time.";
        return;
    }
    const day = new Date(`${date}T12:00:00`).getDay();
    const open = day === 0 ? "09:00" : day === 6 ? "08:00" : "07:00";
    const last = day === 0 ? "14:30" : day === 6 ? "16:30" : "17:30";
    if (time < open || time > last)
    {
        status.textContent = `Pickup planning hours for this day: ${open}–${last}.`;
        return;
    }
    status.textContent = `${quantity} × ${selected.name}, ${date} ${time}, estimate £${(quantity * selected.price).toFixed(2)}. Nothing ordered, paid or sent; confirm in store.`;
});
document.querySelector("#nav-toggle").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#nav-toggle").setAttribute("aria-expanded", "false");
}));
render();
