const $ = (s) => document.querySelector(s);
const categories = {
    Beef: [["ribeye", "Dry-aged ribeye", 38], ["sirloin", "Sirloin on the bone", 34], ["fillet", "Fillet", 62], ["chuck", "Chuck for braising", 14], ["short-rib", "Short rib", 16], ["cheek", "Ox cheek", 12]],
    Lamb: [["rack", "Rack, French trimmed", 32], ["lamb-shoulder", "Shoulder, bone in", 18], ["neck", "Neck fillet", 16], ["shanks", "Shanks", 14]],
    Pork: [["belly", "Belly, skin on", 14], ["chops", "Loin chops", 16], ["pork-shoulder", "Shoulder for pulling", 11], ["bacon", "Back bacon, home cured", 19]],
    "Poultry & game": [["chicken", "Free-range chicken", 9], ["duck", "Duck breast", 28], ["pheasant", "Pheasant, in season", 12, "each"]]
};
const products = Object.values(categories).flat().map(([id, name, price, unit]) => ({ id, name, price, unit: unit || "kg" }));
products.push({ id: "week", name: "The Week box", price: 65, unit: "box" }, { id: "grill", name: "The Grill box", price: 80, unit: "box" }, { id: "slow", name: "The Slow box", price: 55, unit: "box" });
const cart = new Map();
function renderCuts(category)
{
    $("#cuts").innerHTML = categories[category].map(([id, name, price, unit]) => `<article class="cut"><div><h3>${name}</h3><span>€${price}/${unit || "kg"}</span></div><button data-add="${id}" aria-label="Add ${name}">+</button></article>`).join("") + (category === "Poultry & game" ? '<p>Free-range turkey: order directly by 10 December. Price and weight by enquiry.</p>' : "");
}
document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-category]").forEach((item) => item.setAttribute("aria-pressed", item === button));
    renderCuts(button.dataset.category);
}));
function renderCart()
{
    let total = 0;
    $("#cart").innerHTML = cart.size ? [...cart].map(([id, quantity]) =>
    {
        const product = products.find((p) => p.id === id);
        total += product.price * quantity;
        return `<div class="cart-row"><div><b>${product.name}</b><br><small>€${product.price}/${product.unit}</small><br><button data-remove="${id}">Remove</button></div><label>${product.unit}<input aria-label="${product.name} quantity" data-quantity="${id}" type="number" min="${product.unit === "kg" ? ".25" : "1"}" step="${product.unit === "kg" ? ".25" : "1"}" max="20" value="${quantity}"></label></div>`;
    }).join("") : "<p>Your list is empty. Choose a cut or a box.</p>";
    $("#total").textContent = `€${total.toFixed(2)}`;
    $("#bag").textContent = cart.size;
    $("#status").textContent = "";
}
document.addEventListener("click", (event) =>
{
    const add = event.target.closest("[data-add]");
    const remove = event.target.closest("[data-remove]");
    if (add)
    {
        const id = add.dataset.add;
        const product = products.find((p) => p.id === id);
        cart.set(id, Math.min(20, (cart.get(id) || 0) + (product.unit === "kg" ? .5 : 1)));
        $("#add-status").textContent = `${product.name} added to your collection draft.`;
        renderCart();
    }
    if (remove)
    {
        cart.delete(remove.dataset.remove);
        renderCart();
    }
});
$("#cart").addEventListener("change", (event) =>
{
    const input = event.target.closest("[data-quantity]");
    if (!input) return;
    const product = products.find((p) => p.id === input.dataset.quantity);
    const n = Number(input.value);
    if (!Number.isFinite(n) || n <= 0 || n > 20 || (product.unit !== "kg" && !Number.isInteger(n)) || (product.unit === "kg" && n * 4 % 1))
    {
        $("#status").textContent = "Use 0.25kg steps or whole items, up to 20.";
        input.value = cart.get(product.id);
        return;
    }
    cart.set(product.id, n);
    input.value = n;
    const total = [...cart].reduce((sum, [id, quantity]) => sum + products.find((p) => p.id === id).price * quantity, 0);
    $("#total").textContent = `€${total.toFixed(2)}`;
    $("#status").textContent = "";
});
const today = new Date().toISOString().slice(0, 10);
$("#date").min = today;
$("#review").addEventListener("click", () =>
{
    const day = new Date(`${$("#date").value}T12:00:00`).getDay();
    $("#status").textContent = !cart.size ? "Your list is empty. Add a cut first." : !$("#date").value || $("#date").value < today ? "Choose a future collection day." : day === 0 || day === 1 ? "The shop is closed Sunday and Monday." : $("#name").value.trim().length < 2 ? "Enter your name for the draft." : `Draft reviewed: ${cart.size} lines, ${$("#total").textContent} approximate. Nothing sent or reserved. Contact the shop to confirm weight, stock, price and collection.`;
});
const batches = [["Hereford ribeye", "Ballynoe Farm", "2026-11-01", 35], ["Sirloin on the bone", "Ballynoe Farm", "2026-10-28", 28], ["Dexter rump", "Cloonmore", "2026-10-20", 45]];
$("#batches").innerHTML = batches.map(([name, farm, start, target]) =>
{
    const days = Math.max(0, Math.floor((Date.now() - new Date(`${start}T00:00:00Z`).getTime()) / 86400000));
    const pct = Math.min(days / target, 1);
    return `<article data-days="${days}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="none" stroke="#4e4038" stroke-width="5"/><circle cx="50" cy="50" r="44" fill="none" stroke="#c4a06a" stroke-width="5" pathLength="1" stroke-dasharray="${pct} 1"/></svg><strong>${days}</strong><small>OF ${target} DAYS</small><h3>${name}</h3><p>${farm}<br>Sample start: ${start}${days >= target ? "<br>Target reached in this sample." : ""}</p></article>`;
}).join("");
const recipes = [
    ["Ox cheek braised in stout", "For four: 1kg ox cheek, 2 onions, 2 carrots, 500ml stout, stock, thyme.", ["Brown the cheeks in a heavy casserole. Set aside; soften chopped onions and carrots.", "Return the meat, add stout and enough stock to almost cover. Add thyme and bring to a simmer.", "Cover and braise in a 150°C oven for about 3–4 hours, until tender. Check liquid periodically.", "Rest, skim the sauce and serve with mash. Chill leftovers promptly."]],
    ["A ribeye, a pan, and nothing else", "Ribeye steak, salt, black pepper and a little cooking oil.", ["Pat the steak dry and season just before cooking.", "Heat a heavy pan, add a little oil and sear both sides. Adjust heat to avoid burning.", "Finish to your preferred doneness using a thermometer and appropriate safe-cooking guidance; timing varies with thickness.", "Rest before slicing. Serve simply."]],
    ["Slow shoulder of Saddleback, eight hours", "Pork shoulder, onions, garlic, stock, salt, pepper and fennel seed.", ["Place sliced onions and garlic in a covered roasting dish. Season the pork and lay it on top.", "Add stock around the meat. Cover and cook at 140°C for roughly 6–8 hours, depending on size.", "Check liquid occasionally and confirm a safe internal temperature; continue until fork-tender.", "Rest, shred and moisten with the cooking juices. Refrigerate leftovers promptly."]]
];
document.querySelectorAll("[data-recipe]").forEach((button) => button.addEventListener("click", () =>
{
    const recipe = recipes[Number(button.dataset.recipe)];
    $("#recipe-title").textContent = recipe[0];
    $("#ingredients").textContent = recipe[1];
    $("#method").innerHTML = recipe[2].map((step) => `<li>${step}</li>`).join("");
    $("#recipe").showModal();
}));
$("#close").addEventListener("click", () => $("#recipe").close());
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
renderCuts("Beef");
renderCart();
