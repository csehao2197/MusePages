import { products } from "./products.js";
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const wide = document.querySelector("#wide");
function renderProducts()
{
    const query = search.value.trim().toLowerCase();
    const visible = products.filter((p) => `${p.name} ${p.colour}`.toLowerCase().includes(query) && (category.value === "All" || category.value === p.category || category.value === "Sale" && p.old) && (!wide.checked || p.wide));
    document.querySelector("#products").innerHTML = visible.map((p) => `<article class="product"><div class="product-image"><svg viewBox="0 0 600 400" role="img" aria-label="Original ${p.colour} ${p.name} illustration"><use href="footwear.svg#${p.art}" style="color:${p.tone}"></use></svg>${p.old ? '<span class="sale-tag">Sale</span>' : ""}<button class="add" data-add="${p.id}" aria-label="Choose size for ${p.name}, ${p.colour}"><span class="add-label">Choose size +</span></button></div><h3>${p.name}</h3><p>${p.colour}</p><div class="product-price${p.old ? " sale" : ""}">£${p.price}${p.old ? `<del>£${p.old}</del>` : ""}</div></article>`).join("");
    document.querySelector("#product-count").textContent = `${visible.length} styles`;
    document.querySelector("#empty").hidden = visible.length > 0;
}
[search, category, wide].forEach((input) => input.addEventListener(input === search ? "input" : "change", renderProducts));
function reset()
{
    search.value = "";
    category.value = "All";
    wide.checked = false;
    renderProducts();
}
document.querySelector("#reset").addEventListener("click", reset);
document.querySelector("#shop-all").addEventListener("click", reset);
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    search.value = "";
    wide.checked = false;
    category.value = button.dataset.filter;
    renderProducts();
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#new").scrollIntoView();
}));
document.querySelector("#wide-link").addEventListener("click", () =>
{
    reset();
    wide.checked = true;
    renderProducts();
    document.querySelector("#new").scrollIntoView();
});
document.querySelector("#search-focus").addEventListener("click", () =>
{
    document.querySelector("#new").scrollIntoView();
    search.focus({ preventScroll: true });
});
renderProducts();
const dialog = document.querySelector("dialog");
const body = document.querySelector("#modal-body");
document.querySelector(".close").addEventListener("click", () => dialog.close());
function show(title)
{
    document.querySelector("#modal-title").textContent = title;
    if (!dialog.open) dialog.showModal();
}
const bag = [];
let toastTimer;
function updateBag()
{
    document.querySelector("#bag-count").textContent = bag.reduce((sum, item) => sum + item.qty, 0);
}
document.querySelector("#products").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const product = products.find((p) => p.id === button.dataset.add);
    let size = "";
    body.innerHTML = `<p>${product.colour} · £${product.price}</p><p class="fine">Sample UK sizes. UK 9 is unavailable in this demo. Artwork is illustrative; fit and stock are not verified.</p><div class="sizes" role="group" aria-label="UK shoe size">${[4, 5, 6, 7, 8, 9, 10, 11].map((value) => `<button data-size="${value}" aria-pressed="false"${value === 9 ? " disabled" : ""}>${value}</button>`).join("")}</div><label>Width<select id="width"><option value="Standard">Standard</option>${product.wide ? '<option value="Wide">Wide (W)</option>' : ""}</select></label><button class="primary" id="confirm-add">Add to demo bag</button><p id="add-status" role="status"></p><p class="fine">Local bag only. No checkout, stock hold or order.</p>`;
    show(product.name);
    body.querySelectorAll("[data-size]").forEach((chip) => chip.addEventListener("click", () =>
    {
        size = chip.dataset.size;
        body.querySelectorAll("[data-size]").forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
    }));
    body.querySelector("#confirm-add").addEventListener("click", () =>
    {
        if (!size)
        {
            document.querySelector("#add-status").textContent = "Choose an available UK size first.";
            return;
        }
        const width = document.querySelector("#width").value;
        const existing = bag.find((item) => item.id === product.id && item.size === size && item.width === width);
        if (existing) existing.qty++;
        else bag.push({ id: product.id, size, width, qty: 1 });
        updateBag();
        dialog.close();
        const toast = document.querySelector(".toast");
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.hidden = true, 2000);
    });
});
function renderBag()
{
    if (!bag.length)
    {
        body.innerHTML = '<p>Your demo bag is empty.</p><p class="fine">Choose a style and size to try the local bag. No checkout is connected.</p><button class="primary" id="continue">Keep looking</button>';
        body.querySelector("#continue").addEventListener("click", () => dialog.close());
    }
    else
    {
        let total = 0;
        body.innerHTML = bag.map((item, index) =>
        {
            const product = products.find((p) => p.id === item.id);
            total += product.price * item.qty;
            return `<div class="bag-row"><div><h3>${product.name}</h3><p>${product.colour}<br>UK ${item.size} · ${item.width} · Qty ${item.qty}<br>£${product.price * item.qty}</p></div><button class="text" data-remove="${index}">Remove</button></div>`;
        }).join("") + `<p class="bag-total">Sample subtotal £${total}</p><p class="fine">No checkout, payment or delivery. Nothing is reserved. Bag clears on reload.</p><button class="text" id="clear-bag">Clear demo bag</button>`;
        body.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () =>
        {
            bag.splice(Number(button.dataset.remove), 1);
            updateBag();
            renderBag();
        }));
        body.querySelector("#clear-bag").addEventListener("click", () =>
        {
            bag.length = 0;
            updateBag();
            renderBag();
        });
    }
    show("Your demo bag");
}
document.querySelector("#bag-open").addEventListener("click", renderBag);
const info = {
    Account: "This static shop concept has no accounts or sign in. No passwords, credentials or personal shopping history are requested.",
    "Size guide": "Illustrative UK to EU comparison. Sizes vary by maker; measure your feet and confirm the actual maker's guide before purchase.",
    Returns: "Concept terms: try shoes indoors for 30 days, retain packaging and contact the real shop before returning. This demo creates no orders or returns labels and offers no enforceable returns service.",
    Delivery: "Free delivery over £60 is a brief supplied concept offer. No shipping quote, dispatch or delivery is provided here.",
    Contact: "Stride and Co is a fictional Manchester shop concept. No customer service messages are accepted by this page.",
    Directions: "Concept location: 42 Tib Street, Manchester M4 1LA, in the Northern Quarter. Verify a real address and current hours before travel; this is not live navigation.",
    Careers: "No real vacancies or applications are offered by this fictional shop.",
    "Social channels": "Social channels are part of the concept only. No verified Instagram or TikTok account is linked.",
    Privacy: "No cookies, payments, accounts or persistent storage. The demo bag and selections remain in browser memory until reload. Newsletter addresses are not transmitted or subscribed."
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    body.textContent = info[button.dataset.info];
    if (button.dataset.info === "Size guide") body.insertAdjacentHTML("beforeend", '<table class="guide"><thead><tr><th>UK</th><th>EU sample</th></tr></thead><tbody><tr><td>4</td><td>37</td></tr><tr><td>5</td><td>38</td></tr><tr><td>6</td><td>39</td></tr><tr><td>7</td><td>41</td></tr><tr><td>8</td><td>42</td></tr><tr><td>9</td><td>43</td></tr><tr><td>10</td><td>44</td></tr><tr><td>11</td><td>45</td></tr></tbody></table>');
    show(button.dataset.info);
}));
document.querySelector("#newsletter-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    event.target.reset();
    document.querySelector("#newsletter-status").textContent = "Demo complete. You have not been subscribed and no email address was sent or saved.";
});
