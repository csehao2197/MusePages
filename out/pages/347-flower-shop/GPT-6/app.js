const products =
[
    { id: "peony", name: "Blush Garden Peony Bouquet", description: "Lush blush peonies, soft greenery and tissue wrap.", price: 65, category: "Seasonal" },
    { id: "wild", name: "Wild Gathered Wildflower Bunch", description: "Loose seasonal flowers, tied with natural twine.", price: 38, category: "Everyday" },
    { id: "lily", name: "Lily & Eucalyptus Arrangement", description: "Architectural stems in your choice of vase. Keep away from pets.", price: 75, category: "Arrangements", choices: ["Forest green vase", "White vase"] },
    { id: "box", name: "The Bloom Box", description: "Curated seasonal blooms. Plan a delivery rhythm locally.", price: 52, category: "Subscriptions", choices: ["Monthly concept", "Seasonal concept"] },
    { id: "rose", name: "Single-Stem Garden Rose", description: "One perfect stem. For a note, a moment, or a Tuesday.", price: 12, category: "Everyday" },
    { id: "crown", name: "Dried Flower Crown", description: "Pampas, strawflower and lavender for a keepsake.", price: 45, category: "Dried flowers" }
];
const cart = new Map();
const money = (value) => `£${value}`;
function renderProducts()
{
    const category = document.querySelector("#category").value;
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const matches = products.filter((item) => (category === "All flowers" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query));
    document.querySelector("#products").innerHTML = matches.map((item) => `<article class="product" data-tone="${products.indexOf(item)}"><div class="product-art"><img src="art.svg" alt="Original botanical study for ${item.name}; illustration, stems may vary"></div><h3>${item.name}</h3><p>${item.description}</p><p class="price">${money(item.price)}${item.id === "box" ? "<small> / delivery, from</small>" : ""}</p>${item.choices ? `<label>Choose an option<select id="choice-${item.id}">${item.choices.map((choice) => `<option>${choice}</option>`).join("")}</select></label>` : ""}<button class="button" data-add="${item.id}">Add to bag ↗</button></article>`).join("");
    document.querySelector("#result-count").textContent = `${matches.length} arrangement${matches.length === 1 ? "" : "s"} found`;
    document.querySelector("#empty").hidden = matches.length > 0;
}
document.querySelector("#category").addEventListener("change", renderProducts);
document.querySelector("#search").addEventListener("input", renderProducts);
function reset()
{
    document.querySelector("#category").value = "All flowers";
    document.querySelector("#search").value = "";
    renderProducts();
}
document.querySelector("#reset").addEventListener("click", reset);
document.querySelectorAll("[data-filter-link]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#category").value = button.dataset.filterLink;
    document.querySelector("#search").value = "";
    renderProducts();
    document.querySelector("#shop").scrollIntoView();
}));
function renderCart()
{
    let total = 0;
    let count = 0;
    document.querySelector("#cart-items").innerHTML = [...cart].map(([key, item]) =>
    {
        total += item.price * item.quantity;
        count += item.quantity;
        return `<div class="cart-row"><strong>${item.name}</strong><small>${item.choice || "Seasonal studio selection"}</small><div class="quantity"><button aria-label="Decrease ${key}" data-key="${key}" data-delta="-1">−</button><span>${item.quantity}</span><button aria-label="Increase ${key}" data-key="${key}" data-delta="1">+</button><span>${money(item.price * item.quantity)}</span><button data-key="${key}" data-delta="remove">Remove</button></div></div>`;
    }).join("");
    document.querySelector("#bag-count").textContent = count;
    document.querySelector("#cart-total").textContent = money(total);
    document.querySelector("#cart-empty").hidden = count > 0;
    document.querySelector("#order-result").textContent = "No order placed and no payment taken.";
}
document.querySelector("#products").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.add);
    const choice = document.querySelector(`#choice-${product.id}`)?.value || "";
    const key = `${product.id}${choice ? `:${choice}` : ""}`;
    const item = cart.get(key) || { ...product, choice, quantity: 0 };
    item.quantity = Math.min(9, item.quantity + 1);
    cart.set(key, item);
    renderCart();
    button.textContent = "Added ✓";
});
document.querySelector("#cart-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-key]");
    if (!button) return;
    const item = cart.get(button.dataset.key);
    if (button.dataset.delta === "remove") cart.delete(button.dataset.key);
    else
    {
        item.quantity = Math.min(9, item.quantity + Number(button.dataset.delta));
        if (item.quantity <= 0) cart.delete(button.dataset.key);
    }
    renderCart();
});
document.querySelector("#open-bag").addEventListener("click", () => document.querySelector("#bag").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close()));
document.querySelector("#clear-bag").addEventListener("click", () =>
{
    cart.clear();
    renderCart();
});
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
document.querySelectorAll("[type='date']").forEach((input) => input.min = today);
document.querySelector("#order-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#order-result");
    const dateValue = event.currentTarget.elements.date.value;
    if (!cart.size)
    {
        result.textContent = "Your bag is empty. Choose some flowers first.";
        return;
    }
    if (!dateValue || dateValue < today)
    {
        result.textContent = "Choose today or a future preferred date.";
        return;
    }
    result.textContent = `Local order preview for ${dateValue}, product subtotal ${document.querySelector("#cart-total").textContent}. Delivery availability and fees unconfirmed. No order placed, subscription started or payment taken.`;
});
document.querySelector("#postcode-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = document.querySelector("#postcode").value.toUpperCase().replace(/\s/g, "");
    const result = document.querySelector("#postcode-result");
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(value))
    {
        result.textContent = "Please enter a valid UK postcode.";
        return;
    }
    result.textContent = /^(?:W[128]|SW[368]|SE1|E[1289]|N1|NW1)\d[A-Z]{2}$/.test(value) ? "Within the illustrative coverage area. Actual delivery and fees need confirmation." : "Outside the listed concept area. A real studio would need to confirm courier options.";
});
let type = "";
document.querySelectorAll("[data-inquiry]").forEach((button) => button.addEventListener("click", () =>
{
    type = button.dataset.inquiry;
    document.querySelector("#inquiry-title").textContent = `${type} inquiry`;
    document.querySelector("#inquiry-result").textContent = "Local preview only. Nothing sent.";
    document.querySelector("#inquiry").showModal();
}));
document.querySelector("#inquiry-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = event.currentTarget.elements;
    const result = document.querySelector("#inquiry-result");
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid || fields.vision.value.trim().length < 10)
    {
        result.textContent = "Enter a name, valid email and at least 10 characters about your vision.";
        return;
    }
    const minimum = new Date();
    minimum.setHours(0, 0, 0, 0);
    minimum.setDate(minimum.getDate() + (type === "Wedding" ? 42 : 5));
    if (!fields.date.value || new Date(`${fields.date.value}T00:00:00`) < minimum)
    {
        result.textContent = type === "Wedding" ? "Please allow at least 6 weeks for a wedding concept." : "Please allow at least 5 days for a custom concept.";
        return;
    }
    result.textContent = `${type} inquiry preview ready. Nothing sent, no consultation or flowers booked.`;
});
renderProducts();
renderCart();
