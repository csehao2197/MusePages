const products = [
    { name: "The Cross Strap", category: "sandals", color: "#a3673e", price: 48000 },
    { name: "The Everyday Slide", category: "slides", color: "#303e32", price: 38000 },
    { name: "The Weekend Sandal", category: "sandals", color: "#452c25", price: 52000 }
];
const saved = new Set();
const cart = [];
let filter = "all";
let discount = false;
const money = (amount) => `₦${amount.toLocaleString("en-NG")}`;
function render()
{
    const shown = products.map((product, index) => ({ ...product, index })).filter((product) => filter === "all" || (filter === "saved" ? saved.has(product.index) : product.category === filter));
    document.querySelector("#products").innerHTML = shown.map((product) => `<article class="product"><div class="product-art"><svg viewBox="0 0 300 150" aria-label="${product.name} leather illustration" role="img"><g transform="rotate(-17 150 75)"><path d="M32 90C15 45 67 26 113 35l121 23c49 8 49 53 5 61l-135 5c-42 2-64-12-72-34Z" fill="#bba07b"/><path d="m85 36 39 6-14 80-42-1Z" fill="${product.color}"/><path d="m172 49 45 7-14 65-48 2Z" fill="${product.color}"/><path d="m92 43 23 5-13 65m80-56 24 6-11 48" fill="none" stroke="#ead6ad" stroke-dasharray="2 3"/></g></svg><button class="save" data-save="${product.index}" aria-label="Save ${product.name}" aria-pressed="${saved.has(product.index)}">${saved.has(product.index) ? "♥" : "♡"}</button></div><h3>${product.name}</h3><p>Handcrafted leather · ${money(product.price)}</p><button class="add" data-add="${product.index}">Add to bag ↗</button></article>`).join("");
    document.querySelector("#empty").hidden = shown.length > 0;
}
document.querySelector("#products").addEventListener("click", (event) =>
{
    const save = event.target.closest("[data-save]");
    const add = event.target.closest("[data-add]");
    if (save)
    {
        const index = Number(save.dataset.save);
        saved.has(index) ? saved.delete(index) : saved.add(index);
        render();
    }
    if (add)
    {
        cart.push(Number(add.dataset.add));
        document.querySelector("#bag-count").textContent = cart.length;
        document.querySelector("#toast").textContent = "Added to your bag. Local demo only.";
    }
});
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((tab) => tab.classList.toggle("active", tab === button));
    render();
}));
function renderCart()
{
    document.querySelector("#cart-items").innerHTML = cart.length ? cart.map((index, line) => `<div class="cart-line">${products[index].name}<button data-remove="${line}">Remove</button><br>${money(products[index].price)}</div>`).join("") : "<p>Your bag is taking a breather. Find a pair you love.</p>";
    document.querySelector("#total").textContent = `Total ${money(cart.reduce((sum, index) => sum + products[index].price, 0) * (discount ? .9 : 1))}`;
    document.querySelector("#bag-count").textContent = cart.length;
    document.querySelector("#checkout").disabled = cart.length === 0;
}
document.querySelector("#bag").addEventListener("click", () =>
{
    renderCart();
    document.querySelector("#cart-dialog").showModal();
});
document.querySelector("#cart-items").addEventListener("click", (event) =>
{
    if (event.target.dataset.remove !== undefined)
    {
        cart.splice(Number(event.target.dataset.remove), 1);
        document.querySelector("#checkout-status").textContent = "";
        renderCart();
    }
});
document.querySelector("#apply").addEventListener("click", () =>
{
    discount = document.querySelector("#coupon").value.trim().toUpperCase() === "FIRST10" && cart.length > 0;
    document.querySelector("#coupon-status").textContent = discount ? "10% applied to this sample bag." : "Code not valid, or your bag is empty.";
    renderCart();
});
document.querySelector("#checkout").addEventListener("click", () =>
{
    document.querySelector("#checkout-status").textContent = "Checkout preview ready. No payment or order is created.";
});
document.querySelector("#size-guide").addEventListener("click", () => document.querySelector("#size-dialog").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));
const subscribers = new Set();
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const status = document.querySelector("#email-status");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        status.textContent = "Enter a valid email address.";
        return;
    }
    status.textContent = subscribers.has(email) ? "Already on this local demo list." : "You’re on the local demo list. No email was sent.";
    subscribers.add(email);
});
render();
