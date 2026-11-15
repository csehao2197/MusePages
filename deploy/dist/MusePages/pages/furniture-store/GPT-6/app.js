const items =
[
    { id: "alden", name: "Alden Lounge Chair", material: "White oak · Bouclé", price: 1290, room: "Living", art: "chair", dimensions: "W 78 × D 82 × H 76 cm" },
    { id: "marlow", name: "Marlow Sofa, 3-Seat", material: "Walnut base · Belgian linen", price: 3450, room: "Living", art: "sofa", dimensions: "W 220 × D 94 × H 78 cm" },
    { id: "fennimore", name: "Fennimore Dining Table", material: "Solid white oak · Seats 8", price: 2780, room: "Dining", art: "table", dimensions: "W 220 × D 95 × H 75 cm" },
    { id: "ridge", name: "Ridge Sideboard", material: "Walnut · Brass pulls", price: 2190, room: "Dining", art: "sideboard", dimensions: "W 160 × D 45 × H 78 cm" },
    { id: "copse", name: "Copse Bed Frame, Queen", material: "Ash · Cane headboard", price: 1940, room: "Bedroom", art: "bed", dimensions: "W 165 × D 215 × H 110 cm" },
    { id: "halden", name: "Halden Desk", material: "White oak · Blackened steel", price: 1480, room: "Workspace", art: "desk", dimensions: "W 140 × D 65 × H 75 cm" },
    { id: "yarrow", name: "Yarrow Armchair", material: "Ash · Wool flannel", price: 980, room: "Living", art: "armchair", dimensions: "W 74 × D 80 × H 79 cm" },
    { id: "bramble", name: "Bramble Bookcase", material: "Solid oak · Adjustable shelving", price: 1620, room: "Workspace", art: "bookcase", dimensions: "W 100 × D 35 × H 180 cm" }
];
const finishes = [{ name: "Natural", wood: "#bea17b", fabric: "#d3c7b1" }, { name: "Walnut", wood: "#775238", fabric: "#b7a58d" }, { name: "Charcoal", wood: "#484640", fabric: "#777971" }, { name: "Sage", wood: "#9b8a6e", fabric: "#98a18a" }];
const selections = new Map(items.map((item) => [item.id, "Natural"]));
const saved = new Set();
const cart = new Map();
let onlySaved = false;
let detailItem = null;
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
function artwork(item, finish)
{
    const colour = finishes.find((entry) => entry.name === finish);
    return `<svg viewBox="0 0 400 320" role="img" aria-label="Original ${item.name} illustration in ${finish} finish" style="--wood:${colour.wood};--fabric:${colour.fabric}"><use href="products.svg#${item.art}"></use></svg>`;
}
function card(item)
{
    const finish = selections.get(item.id);
    return `<article class="product" data-product="${item.id}"><div class="product-art">${artwork(item, finish)}<button class="save" aria-label="Save ${item.name}" aria-pressed="${saved.has(item.id)}" data-save="${item.id}">${saved.has(item.id) ? "♥" : "♡"}</button></div><h3>${item.name}</h3><p>${item.material}</p><p class="price">${money(item.price)}</p><div class="swatches" aria-label="${item.name} finish">${finishes.map((colour) => `<button aria-label="${item.name}: ${colour.name}" aria-pressed="${finish === colour.name}" data-finish="${colour.name}" data-id="${item.id}" style="--finish:${colour.fabric}"></button>`).join("")}</div><button class="text-link" data-details="${item.id}">View details ↗</button></article>`;
}
function render()
{
    const room = document.querySelector("#room-filter").value;
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const budget = Number(document.querySelector("#budget").value);
    const matches = items.filter((item) => (room === "All rooms" || room === item.room) && `${item.name} ${item.material}`.toLowerCase().includes(query) && item.price <= budget && (!onlySaved || saved.has(item.id)));
    document.querySelector("#products").innerHTML = matches.map(card).join("");
    document.querySelector("#best-products").innerHTML = ["marlow", "fennimore", "alden", "ridge"].map((id) => card(items.find((item) => item.id === id))).join("");
    document.querySelector("#empty").hidden = matches.length > 0;
    document.querySelector("#catalogue-status").textContent = `${matches.length} piece${matches.length === 1 ? "" : "s"}${onlySaved ? " in your saved selection" : " in view"}. Finish colours are illustrative.`;
    document.querySelector("#saved-count").textContent = saved.size;
    document.querySelector("#saved-button").setAttribute("aria-pressed", String(onlySaved));
}
function renderCart()
{
    let total = 0;
    let count = 0;
    document.querySelector("#cart-items").innerHTML = [...cart].map(([key, entry]) =>
    {
        const item = items.find((item) => item.id === entry.id);
        total += item.price * entry.quantity;
        count += entry.quantity;
        return `<div class="cart-row"><strong>${item.name}</strong><small>${entry.finish} finish · ${money(item.price)} each</small><div class="quantity"><button aria-label="Decrease ${key}" data-cart="${key}" data-delta="-1">−</button><span>${entry.quantity}</span><button aria-label="Increase ${key}" data-cart="${key}" data-delta="1">+</button><span>${money(item.price * entry.quantity)}</span><button aria-label="Remove ${key}" data-cart="${key}" data-delta="remove">×</button></div></div>`;
    }).join("");
    document.querySelector("#bag-count").textContent = count;
    document.querySelector("#cart-total").textContent = money(total);
    document.querySelector("#bag-empty").hidden = count > 0;
    document.querySelector("#delivery-note").textContent = `${total > 999 ? "Above the concept free-delivery threshold." : "Free concept delivery applies over $999."} No checkout or payment. Taxes and real delivery costs unconfirmed.`;
}
document.addEventListener("click", (event) =>
{
    const save = event.target.closest("[data-save]");
    if (save)
    {
        saved.has(save.dataset.save) ? saved.delete(save.dataset.save) : saved.add(save.dataset.save);
        render();
    }
    const swatch = event.target.closest("[data-finish]");
    if (swatch)
    {
        selections.set(swatch.dataset.id, swatch.dataset.finish);
        render();
    }
    const detail = event.target.closest("[data-details]");
    if (detail)
    {
        detailItem = items.find((item) => item.id === detail.dataset.details);
        const finish = selections.get(detailItem.id);
        document.querySelector("#detail-art").innerHTML = artwork(detailItem, finish);
        document.querySelector("#detail-title").textContent = detailItem.name;
        document.querySelector("#detail-spec").textContent = `${detailItem.material} · ${finish} finish selected`;
        document.querySelector("#detail-dimensions").textContent = `Illustrative dimensions: ${detailItem.dimensions}`;
        document.querySelector("#detail-price").textContent = money(detailItem.price);
        document.querySelector("#detail-result").textContent = "Local selection only; no stock or checkout connected.";
        document.querySelector("#details").showModal();
    }
});
document.querySelector("#detail-add").addEventListener("click", () =>
{
    const finish = selections.get(detailItem.id);
    const key = `${detailItem.id}:${finish}`;
    const entry = cart.get(key) || { id: detailItem.id, finish, quantity: 0 };
    entry.quantity = Math.min(9, entry.quantity + 1);
    cart.set(key, entry);
    renderCart();
    document.querySelector("#detail-result").textContent = "Added to local bag. No purchase, payment or stock reservation.";
});
document.querySelector("#bag-button").addEventListener("click", () => document.querySelector("#bag").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close()));
document.querySelector("#cart-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-cart]");
    if (!button) return;
    const entry = cart.get(button.dataset.cart);
    if (button.dataset.delta === "remove") cart.delete(button.dataset.cart);
    else
    {
        entry.quantity = Math.min(9, entry.quantity + Number(button.dataset.delta));
        if (entry.quantity <= 0) cart.delete(button.dataset.cart);
    }
    renderCart();
});
document.querySelector("#clear-bag").addEventListener("click", () =>
{
    cart.clear();
    renderCart();
});
function reset()
{
    onlySaved = false;
    document.querySelector("#room-filter").value = "All rooms";
    document.querySelector("#search").value = "";
    document.querySelector("#budget").value = "99999";
    render();
}
document.querySelector("#reset").addEventListener("click", reset);
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#room-filter").addEventListener("change", render);
document.querySelector("#budget").addEventListener("change", render);
document.querySelector("#saved-button").addEventListener("click", () =>
{
    onlySaved = !onlySaved;
    document.querySelector("#room-filter").value = "All rooms";
    document.querySelector("#search").value = "";
    document.querySelector("#budget").value = "99999";
    render();
    document.querySelector("#arrivals").scrollIntoView();
});
function browse(room)
{
    reset();
    document.querySelector("#room-filter").value = room;
    document.querySelector("#visit-form [name='room']").value = room;
    render();
    document.querySelector("#arrivals").scrollIntoView();
}
const roomExamples = { Living: ["sofa", "A PLACE TO LAND"], Dining: ["table", "ROOM FOR CONVERSATION"], Bedroom: ["bed", "NOTHING EXTRA"], Workspace: ["desk", "SPACE TO THINK"] };
function previewRoom(room)
{
    const [art, caption] = roomExamples[room];
    document.querySelector("#room-art use").setAttribute("href", `products.svg#${art}`);
    document.querySelector("#room-art-title").textContent = `${room} room furniture study`;
    document.querySelector("#room-caption").textContent = `${room.toUpperCase()} / ${caption}`;
    document.querySelectorAll("[data-room]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.room === room)));
}
document.querySelectorAll("[data-room]").forEach((button) =>
{
    button.addEventListener("mouseenter", () => previewRoom(button.dataset.room));
    button.addEventListener("focus", () => previewRoom(button.dataset.room));
    button.addEventListener("click", () =>
    {
        previewRoom(button.dataset.room);
        browse(button.dataset.room);
    });
});
document.querySelectorAll("[data-room-link]").forEach((button) => button.addEventListener("click", () => browse(button.dataset.roomLink)));
const materialNotes =
{
    "White oak": "White oak: pale, open grain and visible medullary rays. A durable hardwood; colour varies naturally. Avoid prolonged moisture and direct heat.",
    Walnut: "Walnut: deeper brown with flowing grain. Natural light can mellow its colour over time. Dust gently and protect against hot or wet objects.",
    Ash: "Ash: light-toned, straight and expressive grain. A resilient hardwood suited to shaped frames. Maintain stable indoor humidity."
};
document.querySelector("#material-choice").addEventListener("change", (event) => document.querySelector("#material-note").textContent = materialNotes[event.target.value]);
document.querySelector("#material-note").textContent = materialNotes["White oak"];
const visit = document.querySelector("#visit-form");
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
visit.elements.date.min = today;
function updateTimes()
{
    const value = visit.elements.date.value;
    if (!value)
    {
        visit.elements.time.innerHTML = "<option value=''>Choose a date first</option>";
        return;
    }
    const sunday = new Date(`${value}T12:00:00`).getDay() === 0;
    visit.elements.time.innerHTML = Array.from({ length: sunday ? 6 : 9 }, (_, index) => `${index + (sunday ? 11 : 10)}:00`).map((time) => `<option>${time}</option>`).join("");
}
visit.elements.date.addEventListener("change", updateTimes);
visit.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = visit.elements;
    const result = document.querySelector("#visit-result");
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid)
    {
        result.textContent = "Please enter your name and a valid email address.";
        return;
    }
    if (!fields.date.value || fields.date.value < today || !fields.time.value)
    {
        result.textContent = "Choose today or a future date and a preferred time.";
        return;
    }
    result.textContent = `${fields.room.value} consultation preview: ${fields.date.value} at ${fields.time.value}. No request sent and no appointment reserved.`;
});
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = event.currentTarget.elements.email;
    document.querySelector("#newsletter-result").textContent = email.value && email.validity.valid ? "Sign-up preview ready. No email transmitted and no subscription created." : "Enter a valid email address for this preview.";
});
if (matchMedia("(max-width: 767px)").matches) document.querySelectorAll("footer details").forEach((details) => details.open = false);
render();
renderCart();
updateTimes();
