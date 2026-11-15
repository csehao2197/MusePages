const menu =
[
    { name: "Salmon aburi roll", roman: "Sake aburi maki", price: 18, category: "Sushi & Sashimi", description: "Flame-kissed salmon, avocado and a bright yuzu finish.", ingredients: "Salmon, rice, avocado, nori, yuzu, soy", allergens: "Fish, soy, gluten", tags: ["Chef's Picks"] },
    { name: "Miso mushroom bao", roman: "Kinoko bao", price: 12, category: "Appetizers", description: "Pillowy steamed buns, miso mushrooms and pickled cucumber.", ingredients: "Wheat bun, mushrooms, miso, cucumber, sesame", allergens: "Gluten, soy, sesame", tags: ["Vegetarian", "Vegan", "Chef's Picks"] },
    { name: "Chili crisp noodles", roman: "Tantan men", price: 17, category: "Noodles & Rice", description: "Springy noodles, warming chili and toasted peanut crunch.", ingredients: "Wheat noodles, chili, peanuts, sesame, soy, scallions", allergens: "Nuts, gluten, soy, sesame", tags: ["Vegan", "Vegetarian", "Spicy"] },
    { name: "Ginger glazed salmon", roman: "Sake teriyaki", price: 26, category: "Main Courses", description: "Roasted salmon, ginger glaze and seasonal greens.", ingredients: "Salmon, ginger, tamari, rice, bok choy", allergens: "Fish, soy", tags: ["Gluten-Free", "Chef's Picks"] },
    { name: "Green garden bowl", roman: "Yasai don", price: 16, category: "Vegetarian", description: "Seasonal greens, sesame tofu and fragrant steamed rice.", ingredients: "Rice, tofu, broccoli, avocado, sesame, tamari", allergens: "Soy, sesame", tags: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { name: "Black sesame parfait", roman: "Kuro goma parfait", price: 9, category: "Desserts", description: "Velvety sesame cream, berry compote and crisp rice.", ingredients: "Cream, sesame, berries, sugar, rice", allergens: "Dairy, sesame", tags: ["Vegetarian", "Gluten-Free"] },
    { name: "Yuzu sparkling tea", roman: "Yuzu cha", price: 6, category: "Beverages", description: "Citrus, jasmine tea and a refreshing little sparkle.", ingredients: "Jasmine tea, yuzu juice, sugar, sparkling water", allergens: "None declared; shared preparation area", tags: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { name: "Crispy chili tofu", roman: "Atsuage", price: 14, category: "Appetizers", description: "Golden tofu, fresh herbs and our signature chili dressing.", ingredients: "Tofu, cornstarch, chili, tamari, sesame", allergens: "Soy, sesame", tags: ["Vegetarian", "Vegan", "Gluten-Free", "Spicy"] }
];
let category = "All";
const photos = ["sushi.jpg", "bao.jpg", "noodles.jpg", "salmon.jpg", "bowl.jpg", "dessert.jpg", "tea.jpg", "bowl.jpg"];
menu.forEach((dish, index) => dish.photo = photos[index]);
let romanized = false;
let current;
const filters = new Set();
const basket = [];
const money = (value) => `$${value.toFixed(2)}`;
const dishDialog = document.querySelector("#dish-dialog");
const orderDialog = document.querySelector("#order-dialog");
function render()
{
    const found = menu.filter((dish) => (category === "All" || dish.category === category) && [...filters].every((filter) => dish.tags.includes(filter)));
    document.querySelector("#count").textContent = `${found.length} dishes to discover`;
    document.querySelector("#category-heading").textContent = category === "All" ? "A taste of everything" : category;
    document.querySelector("#dishes").innerHTML = found.map((dish) => `<article class="dish"><button data-dish="${menu.indexOf(dish)}" aria-label="Customize ${dish.name}"><img src="${dish.photo}" alt="Serving inspiration for ${dish.name}"><h3><span>${romanized ? dish.roman : dish.name}</span><span>$${dish.price}</span></h3><p>${dish.description}</p><div class="tags">${dish.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}${dish.allergens.includes("Nuts") ? '<span class="tag">Contains nuts</span>' : ""}</div></button></article>`).join("") || '<p class="empty">No dishes match this combination. Clear filters to discover more.</p>';
}
function openDish(index)
{
    current = menu[index];
    document.querySelector("#dish-detail").innerHTML = `<img class="detail-photo" src="${current.photo}" alt="Serving inspiration for ${current.name}"><p class="eyebrow">${current.category}</p><h2>${current.name} <span>$${current.price}</span></h2><p>${current.roman}</p><p>${current.description}</p><p><strong>Ingredients:</strong> ${current.ingredients}</p><p><strong>Allergens:</strong> ${current.allergens}. Shared kitchen; cross-contact is possible.</p><form id="customize"><label>Spice level<select id="spice"><option>Mild</option><option>Medium</option><option>Hot</option></select></label><label><input id="extra" type="checkbox"> Add avocado +$3</label><button class="primary" type="submit">Add to order · <span id="item-total">${money(current.price)}</span></button></form>`;
    document.querySelector("#extra").onchange = (event) => document.querySelector("#item-total").textContent = money(current.price + (event.target.checked ? 3 : 0));
    document.querySelector("#customize").onsubmit = (event) =>
    {
        event.preventDefault();
        basket.push({ name: current.name, spice: document.querySelector("#spice").value, extra: document.querySelector("#extra").checked, price: current.price + (document.querySelector("#extra").checked ? 3 : 0) });
        document.querySelector("#basket-count").textContent = basket.length;
        dishDialog.close();
    };
    dishDialog.showModal();
}
document.querySelector("#dishes").onclick = (event) =>
{
    const button = event.target.closest("[data-dish]");
    if (button) openDish(Number(button.dataset.dish));
};
document.querySelectorAll("[data-category]").forEach((button) => button.onclick = () =>
{
    category = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach((other) =>
    {
        other.classList.toggle("active", other === button);
        other.setAttribute("aria-pressed", other === button);
    });
    render();
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
});
document.querySelectorAll("[data-diet]").forEach((button) => button.onclick = () =>
{
    const value = button.dataset.diet;
    filters.has(value) ? filters.delete(value) : filters.add(value);
    button.setAttribute("aria-pressed", filters.has(value));
    render();
});
document.querySelector("#clear").onclick = () =>
{
    filters.clear();
    document.querySelectorAll("[data-diet]").forEach((button) => button.setAttribute("aria-pressed", "false"));
    render();
};
document.querySelector("#language").onclick = (event) =>
{
    romanized = !romanized;
    event.target.setAttribute("aria-pressed", romanized);
    event.target.textContent = romanized ? "Romanized / EN" : "EN / Romanized";
    render();
};
document.querySelector("#special-button").onclick = () => openDish(1);
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
function renderOrder()
{
    document.querySelector("#order-items").innerHTML = basket.length ? basket.map((item, index) => `<div class="order-line"><button data-remove="${index}" aria-label="Remove ${item.name}">Remove</button><strong>${item.name}</strong><br><span>${item.spice}${item.extra ? " · Extra avocado" : ""} · ${money(item.price)}</span></div>`).join("") : "<p>Your table is waiting. Add something delicious.</p>";
    document.querySelector("#order-total").textContent = `Subtotal: ${money(basket.reduce((total, item) => total + item.price, 0))} · Tax calculated at restaurant`;
    document.querySelector("#basket-count").textContent = basket.length;
}
document.querySelector("#basket-button").onclick = () =>
{
    renderOrder();
    orderDialog.showModal();
};
document.querySelector("#order-items").onclick = (event) =>
{
    const remove = event.target.closest("[data-remove]");
    if (remove)
    {
        basket.splice(Number(remove.dataset.remove), 1);
        renderOrder();
    }
};
document.querySelector("#clear-order").onclick = () =>
{
    basket.length = 0;
    renderOrder();
};
document.querySelector("#download").onclick = () => window.print();
document.querySelector("#share").onclick = async () =>
{
    const link = "https://musepages.pages.dev/pages/digital-menu-page/GPT-6/index.html";
    try
    {
        await navigator.clipboard.writeText(link);
        document.querySelector("#share-status").textContent = "Menu link copied. This preview may not be published yet.";
    }
    catch
    {
        document.querySelector("#share-status").textContent = link;
    }
};
function updateClock()
{
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === "hour").value);
    const minute = Number(parts.find((part) => part.type === "minute").value);
    const open = hour * 60 + minute >= 690 && hour < 22;
    document.querySelector("#hours").innerHTML = `<i></i> ${open ? "OPEN NOW" : "CLOSED"}`;
    document.querySelector("#clock").textContent = `${new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(now)} PT`;
}
updateClock();
setInterval(updateClock, 60000);
render();
