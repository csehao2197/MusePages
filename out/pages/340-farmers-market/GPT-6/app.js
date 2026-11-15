const traders = [
    ["Hollow Lane Dairy", "Raw milk cheese, butter, cream", "dairy", "Cheese wedge", 5],
    ["Cross Oak Bakery", "Sourdough, rye, pastries until they go", "bakery", "Sourdough loaf", 4.5],
    ["Marlow Hill", "Vegetables, orchard fruit, hogget", "produce", "Seasonal squash", 3],
    ["The Fish Van", "Day boat fish from Brixham, Friday landed", "meat", "Fish portion", 7],
    ["Bell and Bramble", "Preserves, chutney, honey", "pantry", "Honey jar", 6],
    ["Nettlebed Growers", "Salad, herbs, tomatoes in season", "produce", "Salad bag", 2.5],
    ["Coombe Farm Eggs", "Eggs, duck eggs, occasional geese", "dairy", "Six eggs", 3],
    ["Weavers Butchers", "Beef, pork, sausages made on Thursday", "meat", "Sausage pack", 5.5],
    ["The Flower Cart", "Cut flowers, seasonal, British grown", "produce", "Seasonal bunch", 12],
    ["Ash Tree Cider", "Cider, perry, apple juice", "pantry", "Apple juice bottle", 3.5],
    ["Ground Coffee Co", "Coffee to drink and beans to take", "pantry", "Coffee beans", 8],
    ["Pickle Street", "Kimchi, kraut, hot sauce", "pantry", "Kimchi jar", 5],
    ["Old Mill Flour", "Stoneground flour, oats, pulses", "pantry", "Flour bag", 3],
    ["Two Fields Lamb", "Lamb, mutton, sheepskins in winter", "meat", "Lamb portion", 9],
    ["The Cake Table", "Whole cakes, tray bakes, gluten free on request", "bakery", "Cake slice", 3.5],
    ["Severn Smokery", "Smoked salmon, trout, mackerel", "meat", "Smoked fish pack", 6],
    ["Wild Yeast", "Bagels and focaccia, sells out by eleven", "bakery", "Focaccia", 4],
    ["Green Man Kitchen", "Hot food, soup from October", "services", "Seasonal soup", 5],
    ["Hedgerow Herbals", "Teas, tinctures, dried herbs", "pantry", "Herbal tea bag", 4.5],
    ["Blackdown Charcuterie", "Salami, coppa, pancetta", "meat", "Salami pack", 6],
    ["The Olive Stall", "Olives, oils, preserved lemons", "pantry", "Olives tub", 4],
    ["Cotswold Mushrooms", "Oyster, shiitake, seasonal wild", "produce", "Mushroom punnet", 4.5],
    ["Sourwood Chocolate", "Bean to bar, made twelve miles away", "bakery", "Chocolate bar", 4],
    ["Knife and Steel", "Knife sharpening while you shop", "services", "Sharpening enquiry", 6]
];
const money = (value) => `£${value.toFixed(2)}`;
let selected = 0;
const cart = new Map();
const next = new Date();
const daysToSaturday = (6 - next.getDay() + 7) % 7;
next.setDate(next.getDate() + (daysToSaturday === 0 && next.getHours() >= 14 ? 7 : daysToSaturday));
const formatted = next.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
document.querySelector("#next-date").textContent = formatted.toUpperCase();
document.querySelector("#market-date").textContent = formatted;
function choose(index)
{
    selected = index;
    const [name, sells, , product, price] = traders[index];
    document.querySelector("#stall-number").textContent = `STALL ${String(index + 1).padStart(2, "0")}`;
    document.querySelector("#stall-name").textContent = name;
    document.querySelector("#stall-sells").textContent = sells;
    document.querySelector("#sample-product").textContent = `Example shopping item: ${product} · ${money(price)}`;
    document.querySelectorAll(".stall").forEach((stall, i) => stall.setAttribute("aria-pressed", String(i === index)));
}
traders.forEach((trader, i) =>
{
    let x, y;
    if (i < 8)
    {
        x = 70 + i * 64;
        y = 110;
    }
    else if (i < 12)
    {
        x = 530;
        y = 185 + (i - 8) * 62;
    }
    else if (i < 20)
    {
        x = 70 + (19 - i) * 64;
        y = 425;
    }
    else
    {
        x = 45;
        y = 185 + (23 - i) * 62;
    }
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("stall");
    group.dataset.stall = i;
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `Stall ${i + 1}: ${trader[0]}`);
    group.setAttribute("transform", `translate(${x} ${y})`);
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "45");
    rect.setAttribute("height", "38");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "22.5");
    text.setAttribute("y", "24");
    text.setAttribute("text-anchor", "middle");
    text.textContent = String(i + 1).padStart(2, "0");
    group.append(rect, text);
    ["mouseenter", "focus", "click"].forEach((event) => group.addEventListener(event, () => choose(i)));
    group.addEventListener("keydown", (event) =>
    {
        if (event.key === "Enter" || event.key === " ")
        {
            event.preventDefault();
            choose(i);
        }
    });
    document.querySelector("#stalls").append(group);
});
function filter()
{
    const term = document.querySelector("#search").value.trim().toLowerCase();
    const category = document.querySelector("#category").value;
    const list = document.querySelector("#trader-index");
    list.replaceChildren();
    let count = 0;
    traders.forEach(([name, sells, type], i) =>
    {
        if (category !== "all" && category !== type || !`${name} ${sells}`.toLowerCase().includes(term)) return;
        const button = document.createElement("button");
        button.className = "trader-row";
        const number = document.createElement("span");
        number.className = "meta";
        number.textContent = String(i + 1).padStart(2, "0");
        const detail = document.createElement("span");
        const title = document.createElement("strong");
        title.textContent = name;
        const text = document.createElement("small");
        text.textContent = sells;
        detail.append(title, text);
        button.append(number, detail);
        button.addEventListener("click", () =>
        {
            choose(i);
            document.querySelector("#plan").scrollIntoView();
        });
        list.append(button);
        count++;
    });
    document.querySelector("#trader-count").textContent = `${count} OF 24 TRADERS`;
    document.querySelector("#empty").hidden = count > 0;
}
document.querySelector("#search").addEventListener("input", filter);
document.querySelector("#category").addEventListener("change", filter);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    document.querySelector("#category").value = "all";
    filter();
});
function updateCart()
{
    const list = document.querySelector("#cart-items");
    list.replaceChildren();
    let total = 0;
    let count = 0;
    cart.forEach((quantity, i) =>
    {
        const trader = traders[i];
        total += trader[4] * quantity;
        count += quantity;
        const row = document.createElement("div");
        row.className = "cart-row";
        row.dataset.item = i;
        const detail = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = trader[3];
        const sub = document.createElement("small");
        sub.textContent = `${trader[0]} · ${money(trader[4])} each`;
        detail.append(title, sub);
        const control = document.createElement("div");
        control.className = "quantity";
        [-1, 1].forEach((change) =>
        {
            const button = document.createElement("button");
            button.textContent = change === 1 ? "+" : "−";
            button.setAttribute("aria-label", `${change === 1 ? "Increase" : "Decrease"} ${trader[3]}`);
            button.addEventListener("click", () =>
            {
                const next = quantity + change;
                if (next > 0) cart.set(i, next);
                else cart.delete(i);
                updateCart();
            });
            control.append(button);
            if (change === -1)
            {
                const amount = document.createElement("span");
                amount.textContent = quantity;
                control.append(amount);
            }
        });
        row.append(detail, control);
        list.append(row);
    });
    document.querySelector("#cart-total").textContent = money(total);
    document.querySelector("#cart-status").textContent = count ? `${count} example item${count === 1 ? "" : "s"} on your list. Nothing ordered or reserved.` : "Your shopping list is empty.";
}
document.querySelector("#add-item").addEventListener("click", () =>
{
    cart.set(selected, (cart.get(selected) || 0) + 1);
    updateCart();
});
document.querySelector("#clear-cart").addEventListener("click", () =>
{
    cart.clear();
    updateCart();
});
const dialog = document.querySelector("#application");
document.querySelector("#apply-button").addEventListener("click", () => dialog.showModal());
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const valid = form.checkValidity() && form.elements.name.value.trim() && form.elements.product.value.trim().length >= 15;
    document.querySelector("#application-result").textContent = valid ? `Trader enquiry preview · £${form.elements.pitch.value} example pitch fee. Nothing sent and no stall reserved. Waiting-list and registration checks require direct contact.` : "Enter a trading name, valid email and at least 15 characters about your products; acknowledge the requirements.";
});
choose(0);
filter();
updateCart();
