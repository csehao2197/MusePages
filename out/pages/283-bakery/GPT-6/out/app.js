const $ = (selector) => document.querySelector(selector);
function food(type, seed = 0)
{
    const backgrounds = ["#c9b99a", "#ded5c4", "#d0bfa5", "#b8a78d", "#e4d8c6"];
    const bread = `<ellipse cx="210" cy="239" rx="147" ry="95" fill="#8d4e21"/><ellipse cx="200" cy="211" rx="142" ry="96" fill="#b77938"/><path d="m115 160q70 40 100 115m-50-138q70 45 100 115m-40-130q55 40 90 105" fill="none" stroke="#e6c997" stroke-width="15"/><path d="m115 160q70 40 100 115m-50-138q70 45 100 115m-40-130q55 40 90 105" fill="none" stroke="#f0dfbc" stroke-width="5"/>`;
    const croissant = `<path d="M57 265Q22 100 174 131Q322 80 350 255L300 276Q266 197 207 198Q147 195 103 280Z" fill="#b67832"/><path d="M100 149q35 50 34 85m30-101q29 23 27 66m40-76q-6 44-1 75m42-57q-15 37-6 66m44-27q-17 36-8 63" fill="none" stroke="#edc783" stroke-width="13"/><path d="M62 258q-6-94 72-113" fill="none" stroke="#d7a45d" stroke-width="13"/>`;
    const tart = `<ellipse cx="200" cy="241" rx="140" ry="103" fill="#ab7036"/><ellipse cx="200" cy="215" rx="133" ry="100" fill="#e2bd78"/><ellipse cx="200" cy="209" rx="111" ry="79" fill="#dfcfac"/>${Array.from({ length: 19 }, (_, n) => `<circle cx="${110 + n * 57 % 180}" cy="${164 + n * 29 % 90}" r="15" fill="${n % 2 ? "#873c32" : "#b44d3b"}"/><circle cx="${106 + n * 57 % 180}" cy="${159 + n * 29 % 90}" r="4" fill="#d58a70"/>`).join("")}`;
    return `<svg viewBox="0 0 400 400" role="img" aria-label="Original illustration of ${type}"><rect width="400" height="400" fill="${backgrounds[seed % 5]}"/><path d="M0 330Q180 300 400 350M0 62Q180 100 400 68" stroke="#f4ead5" stroke-width="2" opacity=".4"/><ellipse cx="200" cy="258" rx="165" ry="110" fill="#eee4cd"/>${type === "sourdough" ? bread : type === "croissants" ? croissant : tart}<g fill="#f3e7d0" opacity=".6"><circle cx="133" cy="170" r="2"/><circle cx="240" cy="151" r="2"/><circle cx="298" cy="220" r="2"/><circle cx="180" cy="270" r="2"/><circle cx="88" cy="280" r="3"/></g></svg>`;
}
const products = [["sourdough", "Artisan breads", "Sourdough", "Classic · Seeded · Rye"], ["croissants", "Viennoiserie", "Croissants", "Butter · Almond · Chocolate"], ["pastries", "Pâtisserie", "Pastries", "Tarts · Danishes · Éclairs"]];
$("#products").innerHTML = products.map(([type, category, name, variants], index) => `<article class="product"><div class="product-art">${food(type, index)}</div><p class="label">${category}</p><h3>${name}</h3><p>${variants}</p><button class="plain" data-order>Explore the daily menu</button></article>`).join("");
$("#craft-art").innerHTML = food("sourdough", 3);
$("#journal").innerHTML = [0, 1, 2, 0, 1].map((n, index) => `<div>${food(products[n][0], index)}</div>`).join("");
const items = [{ name: "Classic sourdough", category: "Bread", price: 6.5 }, { name: "Seeded rye", category: "Bread", price: 7 }, { name: "Butter croissant", category: "Pastry", price: 3.2 }, { name: "Almond croissant", category: "Pastry", price: 4 }, { name: "Seasonal fruit tart", category: "Pastry", price: 4.8 }];
const basket = new Map();
const euro = (amount) => `€${amount.toFixed(2)}`;
let category = "All";
function renderMenu()
{
    $("#order-menu").innerHTML = items.map((item, index) => ({ item, index })).filter(({ item }) => category === "All" || item.category === category).map(({ item, index }) => `<div class="menu-item"><span>${item.name}<br><small>${euro(item.price)}</small></span><button class="bracket" data-add="${index}">[ Add ]</button></div>`).join("");
}
function renderBasket()
{
    let total = 0;
    let count = 0;
    $("#basket").innerHTML = [...basket].map(([index, quantity]) =>
    {
        total += items[index].price * quantity;
        count += quantity;
        return `<div class="basket-item"><span>${quantity} × ${items[index].name}</span><button class="bracket" data-remove="${index}" aria-label="Remove one ${items[index].name}">[ − ]</button></div>`;
    }).join("") || "<p>Your bag is empty. Choose something from the ovens.</p>";
    $("#total").textContent = `Demo total: ${euro(total)}`;
    $("#bag-count").textContent = `[ ${count} ]`;
    $("#pickup-status").textContent = "Local demo only. No order has been placed.";
}
document.addEventListener("click", (event) =>
{
    const order = event.target.closest("[data-order]");
    const add = event.target.closest("[data-add]");
    const remove = event.target.closest("[data-remove]");
    const filter = event.target.closest("[data-category]");
    if (order) $("#order").showModal();
    if (add)
    {
        const index = Number(add.dataset.add);
        basket.set(index, Math.min(20, (basket.get(index) || 0) + 1));
        renderBasket();
    }
    if (remove)
    {
        const index = Number(remove.dataset.remove);
        const next = basket.get(index) - 1;
        if (next > 0) basket.set(index, next);
        else basket.delete(index);
        renderBasket();
    }
    if (filter)
    {
        category = filter.dataset.category;
        document.querySelectorAll("[data-category]").forEach((button) => button.setAttribute("aria-pressed", button === filter));
        renderMenu();
    }
});
$("#order-close").onclick = () => $("#order").close();
const today = new Date();
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
$("#pickup-date").min = date;
$("#pickup").onsubmit = (event) =>
{
    event.preventDefault();
    if (!basket.size) $("#pickup-status").textContent = "Your bag is empty. Add a bake before reviewing.";
    else if (!$("#pickup-date").value || $("#pickup-date").value < date) $("#pickup-status").textContent = "Choose today or a future collection date.";
    else $("#pickup-status").textContent = `Demo collection plan for ${$("#pickup-date").value}. Nothing reserved; please call the bakery to confirm.`;
};
$("#newsletter").onsubmit = (event) =>
{
    event.preventDefault();
    $("#newsletter-status").textContent = $("#email").value && $("#email").validity.valid ? "Preference noted in this page only. No subscription created." : "Please enter a valid email address.";
};
$("#menu-toggle").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu-toggle").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () =>
{
    $("#nav").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
};
renderMenu();
renderBasket();
