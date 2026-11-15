const items =
[
    { name: "The Cloud Classic", category: "Burgers", price: 16, image: "burger.jpg", rating: "4.9", badge: "Most ordered" },
    { name: "Salmon Crunch Roll", category: "Asian Fusion", price: 18, image: "sushi.jpg", rating: "4.8", badge: "Chef favorite" },
    { name: "Good Greens Bowl", category: "Healthy Bowls", price: 14, image: "bowl.jpg", rating: "4.9", badge: "New" },
    { name: "Margherita Magic", category: "Pizza", price: 19, image: "pizza.jpg", rating: "4.8", badge: "Most ordered" },
    { name: "Berry Happy Parfait", category: "Desserts", price: 8, image: "dessert.jpg", rating: "4.7", badge: "Sweet finish" },
    { name: "Double Cloud Burger", category: "Burgers", price: 21, image: "burger.jpg", rating: "4.9", badge: "Big appetite" }
];
let category = "All";
let discount = false;
let deliveryZip = "";
const bag = [];
const zones = { "94103": { name: "SoMa", estimate: "20–25 minutes" }, "94110": { name: "Mission", estimate: "25–30 minutes" }, "94107": { name: "Potrero", estimate: "25–35 minutes" } };
const money = (value) => `$${value.toFixed(2)}`;
function render()
{
    const found = items.filter((item) => category === "All" || item.category === category);
    document.querySelector("#menu-status").textContent = `${category === "All" ? "All cravings welcome" : category} · ${found.length} dishes`;
    document.querySelector("#popular").innerHTML = found.map((item) => `<article class="food-card"><img src="${item.image}" alt="${item.name}, serving inspiration"><span class="badge">${item.badge}</span><h3>${item.name}</h3><p>★ ${item.rating} · Made fresh, just for you</p><strong>${money(item.price)}</strong><button data-add="${items.indexOf(item)}">Add to bag +</button></article>`).join("");
}
function zone(zip)
{
    deliveryZip = zones[zip] ? zip : "";
    const message = zones[zip] ? `${zones[zip].name}: estimated delivery ${zones[zip].estimate}. Demonstration estimate, not live tracking.` : "We're not in that neighborhood yet. Try 94103, 94110 or 94107.";
    document.querySelector("#delivery-result").textContent = message;
    document.querySelector("#zone-info").textContent = message;
    document.querySelector("#zip").value = zip;
    return !!zones[zip];
}
document.querySelector("#address-form").onsubmit = (event) =>
{
    event.preventDefault();
    if (zone(document.querySelector("#zip").value)) document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
};
document.querySelectorAll("[data-zone]").forEach((button) => button.onclick = () => zone(button.dataset.zone));
document.querySelectorAll("[data-category]").forEach((button) => button.onclick = () =>
{
    category = button.dataset.category;
    render();
    document.querySelector("#popular").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelector("#all-menu").onclick = () =>
{
    category = "All";
    render();
};
document.querySelector("#next").onclick = () => document.querySelector("#popular").scrollBy({ left: 500, behavior: "smooth" });
document.querySelector("#prev").onclick = () => document.querySelector("#popular").scrollBy({ left: -500, behavior: "smooth" });
function renderBag()
{
    const subtotal = bag.reduce((sum, item) => sum + item.price, 0);
    const applied = discount && subtotal >= 25;
    document.querySelector("#bag-count").textContent = bag.length;
    document.querySelector("#bag-items").innerHTML = bag.length ? bag.map((item, index) => `<div class="bag-line"><button data-remove="${index}" aria-label="Remove ${item.name}">Remove</button>${item.name} <strong>${money(item.price)}</strong></div>`).join("") : "<p>Empty bag. Endless possibilities.</p>";
    document.querySelector("#total").textContent = `Subtotal ${money(subtotal)}${applied ? " − $10.00 first-bite discount" : ""} = ${money(subtotal - (applied ? 10 : 0))}`;
    if (discount) document.querySelector("#promo-status").textContent = applied ? "FIRSTBITE applied. $10 off!" : "Add at least $25 of food to apply FIRSTBITE.";
    document.querySelector("#checkout-status").textContent = "";
}
document.addEventListener("click", (event) =>
{
    const add = event.target.closest("[data-add]");
    if (add)
    {
        bag.push(items[Number(add.dataset.add)]);
        renderBag();
        add.textContent = "Added ✓";
    }
    const remove = event.target.closest("[data-remove]");
    if (remove)
    {
        bag.splice(Number(remove.dataset.remove), 1);
        renderBag();
    }
});
document.querySelector("#cart-open").onclick = () =>
{
    renderBag();
    document.querySelector("#bag").showModal();
};
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.querySelector("#promo-form").onsubmit = (event) =>
{
    event.preventDefault();
    discount = document.querySelector("#promo").value.trim().toUpperCase() === "FIRSTBITE";
    renderBag();
    if (!discount) document.querySelector("#promo-status").textContent = "That code isn't available. Try FIRSTBITE.";
};
document.querySelector("#checkout").onclick = () =>
{
    document.querySelector("#checkout-status").textContent = !bag.length ? "Add a meal before previewing delivery." : !deliveryZip ? "Enter a supported ZIP on the homepage first." : `Order preview: preparing → cooking → on the way. ${zones[deliveryZip].name}, ${zones[deliveryZip].estimate}. Nothing ordered or charged.`;
};
const information =
{
    "About": "CloudBites is a delivery-only kitchen concept built around freshly cooked meals. This is a static experience, not a live restaurant.",
    "Careers": "Love making someone's day? Send a sample introduction to careers@example.com. No hiring process is active in this demo.",
    "Partner with us": "Our illustrative partner program connects independent kitchens with neighborhood demand. Contact partners@example.com for demonstration information.",
    "Terms": "All menus, prices, discounts, ratings and delivery estimates are illustrative. No transaction or delivery guarantee is created here.",
    "Privacy": "Your ZIP, bag and promo code stay in this browser session. This page sends no order or personal data to a backend.",
    "Allergen information": "Recipes may contain wheat, milk, egg, soy, sesame, fish, shellfish and nuts. A shared kitchen cannot guarantee allergen-free food. Contact the kitchen before ordering."
};
function showInfo(title, text)
{
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-body").textContent = text;
    document.querySelector("#info").showModal();
}
document.querySelectorAll("[data-info]").forEach((button) => button.onclick = () => showInfo(button.dataset.info, information[button.dataset.info]));
document.querySelectorAll(".app-button").forEach((button) => button.onclick = () => showInfo("A taste of what's next.", "This is an app concept, not a live App Store or Google Play listing. Try the working menu and FIRSTBITE offer right here."));
render();
