const cart = new Map();
const money = (value) => `£${value}`;
function render()
{
    let total = 0;
    let count = 0;
    document.querySelector("#cart-items").innerHTML = [...cart].map(([name, item]) =>
    {
        total += item.price * item.quantity;
        count += item.quantity;
        return `<div class="cart-row"><strong>${name}</strong><div><button aria-label="Decrease ${name}" data-change="-1" data-name="${name}">−</button><span>${item.quantity}</span><button aria-label="Increase ${name}" data-change="1" data-name="${name}">+</button><span>${money(item.price * item.quantity)}</span><button aria-label="Remove ${name}" data-change="remove" data-name="${name}">×</button></div></div>`;
    }).join("");
    document.querySelector("#cart-total").textContent = money(total);
    document.querySelector("#bag-count").textContent = count;
    document.querySelector("#cart-empty").hidden = cart.size > 0;
    document.querySelector("#cart-status").textContent = cart.size ? `${count} arrangement${count > 1 ? "s" : ""} selected locally. No flowers ordered.` : "Your selection is empty. No flowers ordered.";
    document.querySelector("#delivery-result").textContent = "Free delivery over £80. Otherwise illustrative delivery £8.";
}
document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () =>
{
    const name = button.dataset.add;
    const item = cart.get(name) || { price: Number(button.dataset.price), quantity: 0 };
    if (item.quantity >= 9)
    {
        document.querySelector("#cart-status").textContent = "Maximum nine of each arrangement in this planner.";
        return;
    }
    item.quantity++;
    cart.set(name, item);
    render();
    button.textContent = "Added to your stems ✓";
}));
document.querySelector("#cart-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-change]");
    if (!button) return;
    const item = cart.get(button.dataset.name);
    if (button.dataset.change === "remove") cart.delete(button.dataset.name);
    else
    {
        item.quantity = Math.min(9, item.quantity + Number(button.dataset.change));
        if (item.quantity <= 0) cart.delete(button.dataset.name);
    }
    render();
});
document.querySelector("#clear-cart").addEventListener("click", () =>
{
    cart.clear();
    render();
    document.querySelectorAll("[data-add]").forEach((button) => button.textContent = "Add to your stems ↗");
});
document.querySelector("#delivery").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#delivery-result");
    const postcode = document.querySelector("#postcode").value.toUpperCase().replace(/\s/g, "");
    if (!cart.size)
    {
        result.textContent = "Choose an arrangement before checking delivery.";
        return;
    }
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(postcode))
    {
        result.textContent = "Enter a valid UK postcode.";
        return;
    }
    if (!/^(EC|WC|E|N|NW|SE|SW|W)\d/.test(postcode))
    {
        result.textContent = "Outside this illustrative London service area. No order created.";
        return;
    }
    const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
    result.textContent = `Concept delivery: ${total > 80 ? "free" : "£8"}. ${hour < 11 ? "Before the 11am London cutoff" : "After the 11am London cutoff; plan for a later day"}. Subject to a real florist's availability. No order placed.`;
});
render();
const dialog = document.querySelector("dialog");
let occasion = "";
document.querySelectorAll("[data-enquiry]").forEach((button) => button.addEventListener("click", () =>
{
    occasion = button.dataset.enquiry;
    document.querySelector("#enquiry-title").textContent = occasion;
    document.querySelector("#enquiry-result").textContent = "Local preview only; nothing is sent or booked.";
    dialog.showModal();
}));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = event.currentTarget.elements;
    const result = document.querySelector("#enquiry-result");
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid || fields.setting.value.trim().length < 10)
    {
        result.textContent = "Enter your name, a valid email and at least 10 characters about the setting.";
        return;
    }
    if (!fields.date.value || fields.date.value < today)
    {
        result.textContent = "Choose today or a future occasion date.";
        return;
    }
    result.textContent = `${occasion} enquiry preview for ${fields.date.value}. Nothing sent and no consultation booked.`;
});
