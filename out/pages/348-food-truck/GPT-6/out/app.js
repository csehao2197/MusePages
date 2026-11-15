const items =
[
    ["classic", "The Classic", "Two smash patties, American cheese, pickles, mustard, ketchup, brioche.", 11, "Burgers"],
    ["bbq", "The Smash BBQ", "Two smash patties, smoked bacon, house BBQ, crispy onions, brioche.", 13, "Burgers"],
    ["vegan", "The Vegan", "Beyond Beef, vegan cheese, pickled red onion, iceberg, vegan mayo.", 11, "Burgers"],
    ["double", "The Double Classic", "Four patties, four slices of American cheese. Same brioche, barely.", 15, "Burgers"],
    ["cheese", "Classic Cheese Fries", "Skin-on fries with melted cheese.", 5, "Fries"],
    ["bacon", "Bacon & Cheese Fries", "Skin-on fries, smoked bacon, cheese.", 6.5, "Fries"],
    ["truffle", "Truffle Fries", "Skin-on fries with a truffle finish.", 6, "Fries"],
    ["chilli", "Chilli Cheese Fries", "Skin-on fries with chilli and cheese.", 6.5, "Fries"],
    ["float", "Fanta Float", "A cold, creamy orange float.", 3, "Drinks"],
    ["coke", "Mexican Coke", "Chilled bottled cola.", 3.5, "Drinks"],
    ["lemonade", "Lemonade", "A bright citrus refresher.", 2.5, "Drinks"],
    ["tea", "Iced Tea", "Cold brewed tea.", 2.5, "Drinks"],
    ["korean", "The Korean Smash", "Gochujang mayo, kimchi, smash patty, sesame slaw.", 14, "Special"]
];
const money = (value) => `£${value.toFixed(2)}`;
const cart = new Map();
function renderMenu()
{
    const category = document.querySelector("#category").value;
    const search = document.querySelector("#search").value.trim().toLowerCase();
    const matches = items.filter((item) => (category === "All" || item[4] === category) && `${item[1]} ${item[2]}`.toLowerCase().includes(search));
    document.querySelector("#menu-list").innerHTML = matches.map(([id, name, description, price]) => `<article class="menu-item"><div><h3>${name}</h3><p>${description}</p></div><button data-add="${id}" aria-label="Add ${name}">${money(price)} +</button></article>`).join("");
    document.querySelector("#menu-empty").hidden = matches.length > 0;
}
function renderCart()
{
    let total = 0;
    let count = 0;
    document.querySelector("#cart-items").innerHTML = [...cart].map(([id, quantity]) =>
    {
        const item = items.find((entry) => entry[0] === id);
        total += item[3] * quantity;
        count += quantity;
        return `<div class="cart-row"><strong>${item[1]}</strong><div class="quantity"><button aria-label="Decrease ${item[1]}" data-id="${id}" data-delta="-1">−</button><span>${quantity}</span><button aria-label="Increase ${item[1]}" data-id="${id}" data-delta="1">+</button><span>${money(item[3] * quantity)}</span><button aria-label="Remove ${item[1]}" data-id="${id}" data-delta="remove">×</button></div></div>`;
    }).join("");
    document.querySelector("#cart-total").textContent = money(total);
    document.querySelector("#order-count").textContent = count;
    document.querySelector("#cart-empty").hidden = count > 0;
    document.querySelector("#order-result").textContent = "No order sent. Food is not being prepared.";
}
function add(id)
{
    cart.set(id, Math.min(20, (cart.get(id) || 0) + 1));
    renderCart();
}
document.querySelector("#menu-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-add]");
    if (!button) return;
    add(button.dataset.add);
    button.textContent = "Added ✓";
});
document.querySelectorAll("[data-quick]").forEach((button) => button.addEventListener("click", () =>
{
    add(button.dataset.quick);
    button.textContent = "Added to local order ✓";
}));
document.querySelector("#cart-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-delta]");
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.delta === "remove") cart.delete(id);
    else
    {
        const quantity = Math.min(20, cart.get(id) + Number(button.dataset.delta));
        if (quantity <= 0) cart.delete(id);
        else cart.set(id, quantity);
    }
    renderCart();
});
document.querySelector("#clear-cart").addEventListener("click", () =>
{
    cart.clear();
    renderCart();
});
document.querySelector("#category").addEventListener("change", renderMenu);
document.querySelector("#search").addEventListener("input", renderMenu);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#category").value = "All";
    document.querySelector("#search").value = "";
    renderMenu();
});
document.querySelectorAll("[data-category-link]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#category").value = button.dataset.categoryLink;
    document.querySelector("#search").value = "";
    renderMenu();
    document.querySelector("#menu").scrollIntoView();
}));
const stops =
[
    { name: "Shoreditch Market", days: [2, 3, 4, 5], hours: "Tue–Fri · 12pm–9pm" },
    { name: "Brixton Market", days: [6], hours: "Sat · 11am–8pm" },
    { name: "Peckham Rye", days: [0], hours: "Sun · 12pm–7pm" }
];
function renderStops()
{
    const day = document.querySelector("#day").value;
    const matches = stops.filter((stop) => day === "all" || stop.days.includes(Number(day)));
    document.querySelector("#stops").innerHTML = matches.map((stop) => `<button class="stop" data-stop="${stop.name}" aria-pressed="${document.querySelector("#pickup").value === stop.name}"><strong>${stop.name}</strong><span>${stop.hours}</span><em>Select for local pickup planner ↗</em></button>`).join("");
    document.querySelector("#no-stop").hidden = matches.length > 0;
}
document.querySelector("#day").addEventListener("change", renderStops);
document.querySelector("#stops").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-stop]");
    if (!button) return;
    document.querySelector("#pickup").value = button.dataset.stop;
    renderStops();
});
document.querySelector("#pickup").addEventListener("change", renderStops);
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#order-result");
    if (!cart.size)
    {
        result.textContent = "Your tray is empty. Add a menu item first.";
        return;
    }
    if (!document.querySelector("#pickup").value || document.querySelector("#customer").value.trim().length < 2)
    {
        result.textContent = "Choose a pickup stop and enter your first name.";
        return;
    }
    result.textContent = `Local tray reviewed for ${document.querySelector("#pickup").value}: ${document.querySelector("#cart-total").textContent}. No order sent, payment taken or food being prepared.`;
});
renderMenu();
renderCart();
renderStops();
