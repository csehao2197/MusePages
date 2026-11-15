const pizzas =
[
    ["Marinara", "pomodoro San Marzano, aglio, origano, olio EVO", 9, "vegan"],
    ["Margherita", "pomodoro, fiordilatte, basilico", 11, "vegetarian"],
    ["Diavola", "pomodoro, fiordilatte, salame piccante, miele", 14, ""],
    ["Napoli", "pomodoro, fiordilatte, acciughe, capperi, olive", 14, ""],
    ["Capricciosa", "pomodoro, fiordilatte, prosciutto cotto, funghi, carciofi", 15, ""],
    ["Bufala e Datterini", "datterini gialli, mozzarella di bufala, basilico", 15, "vegetarian"],
    ["Quattro Formaggi", "fiordilatte, gorgonzola, pecorino, parmigiano", 15, "vegetarian"],
    ["Patate e Rosmarino", "patate, rosmarino, fiordilatte, pepe nero", 13, "vegetarian"],
    ["Salsiccia e Friarielli", "salsiccia, friarielli, fiordilatte", 16, ""],
    ["Zucca e Nocciole", "zucca arrostita, nocciole, ricotta", 14, "vegetarian"],
    ["Tartufo", "funghi, crema di tartufo, fiordilatte", 17, "vegetarian"],
    ["Ortolana", "verdure grigliate, pomodoro, senza formaggio", 13, "vegan"]
];
let filter = "all";
let basket = [];
function render()
{
    const menu = document.querySelector("#pizza-menu");
    menu.replaceChildren();
    let count = 0;
    pizzas.forEach(([name, ingredients, price, diet], index) =>
    {
        if (filter === "vegan" && diet !== "vegan" || filter === "vegetarian" && !diet) return;
        count++;
        const row = document.createElement("article");
        row.className = "pizza";
        const head = document.createElement("div");
        head.className = "pizza-head";
        const title = document.createElement("h4");
        title.textContent = name;
        const amount = document.createElement("b");
        const cost = price + (filter === "gluten" ? 2 : 0);
        amount.textContent = `£${cost}`;
        head.append(title, amount);
        const copy = document.createElement("p");
        copy.textContent = ingredients;
        const badge = document.createElement("small");
        badge.textContent = `${index < 6 ? "ROSSE" : "BIANCHE"}${diet ? ` · ${diet}` : ""}${filter === "gluten" ? " · GF base, shared kitchen" : ""}`;
        const add = document.createElement("button");
        add.textContent = "Add to collection outline +";
        add.addEventListener("click", () =>
        {
            basket.push({ name: `${name}${filter === "gluten" ? " (GF base)" : ""}`, cost });
            renderBasket();
            add.textContent = "Added to local outline ✓";
        });
        row.append(head, copy, badge, document.createElement("br"), add);
        menu.append(row);
    });
    document.querySelector("#menu-status").textContent = `${count} pizzas${filter === "gluten" ? " with £2 base supplement" : ""}`;
}
function renderBasket()
{
    document.querySelector("#basket-list").textContent = basket.length ? basket.map((pizza) => pizza.name).join(" · ") : "No pizzas selected. Add one from the menu.";
    const subtotal = basket.reduce((sum, pizza) => sum + pizza.cost, 0);
    document.querySelector("#total").textContent = `Example total £${(subtotal * .9).toFixed(2)} after proposed 10% collection discount.`;
}
document.querySelectorAll("[data-filter]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        render();
    });
});
document.querySelector("#clear-basket").addEventListener("click", () =>
{
    basket = [];
    renderBasket();
});
render();
document.querySelector("#table").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#table-result");
    if (document.querySelector("#party").value === "7")
    {
        result.textContent = "For seven or more, please call the kitchen. No table held.";
        return;
    }
    const date = document.querySelector("#date").value;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (!date || date <= today)
    {
        result.textContent = "Choose a future date for this example enquiry.";
        return;
    }
    if (new Date(`${date}T12:00:00`).getDay() === 1)
    {
        result.textContent = "Closed on Mondays in the example schedule.";
        return;
    }
    const phone = document.querySelector("#phone").value.replace(/[^\d]/g, "");
    if (!document.querySelector("#name").value.trim() || phone.length < 10 || phone.length > 15)
    {
        result.textContent = "Add a name and a valid phone number of 10 to 15 digits.";
        return;
    }
    result.textContent = `Enquiry checked locally for ${document.querySelector("#party").value} at ${document.querySelector("#time").value} on ${date}. Nothing sent and no table held. Call to confirm.`;
});
document.querySelector("#table").addEventListener("reset", () => document.querySelector("#table-result").textContent = "");
