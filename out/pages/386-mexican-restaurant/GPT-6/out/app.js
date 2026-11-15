const menuData = {
    Tacos: [
        ["Al pastor", "Pork, pineapple, cilantro, onion", 4.5, false],
        ["Barbacoa", "Slow braised beef, salsa verde", 5, false],
        ["Pescado", "Crispy fish, cabbage, chipotle crema", 5.5, false],
        ["Hongos", "Roasted mushrooms, epazote, queso fresco", 4.5, true]
    ],
    Platos: [
        ["Mole poblano", "Chicken, sesame, rice, tortillas", 22, false],
        ["Cochinita pibil", "Achiote pork, pickled onion", 21, false],
        ["Chile relleno", "Poblano, cheese, tomato broth", 18, true],
        ["Carne asada", "Skirt steak, nopales, beans", 26, false]
    ],
    Sides: [
        ["Guacamole and totopos", "Freshly prepared, made for sharing", 11, false],
        ["Elote", "Grilled corn, mayo, cotija, chile", 7, false],
        ["Frijoles charros", "Ask about the recipe and ingredients", 6, false],
        ["Arroz rojo", "Red rice", 5, false]
    ],
    Drinks: [
        ["Horchata", "A cool classic", 5, false],
        ["Agua de jamaica", "Hibiscus refreshment", 5, false],
        ["House margarita", "Alcoholic, for guests 21 and over", 12, false],
        ["Mexican lager", "Alcoholic, for guests 21 and over", 7, false]
    ]
};
let category = "Tacos";
const tabs = [...document.querySelectorAll("[data-tab]")];
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const vegetarian = document.querySelector("#vegetarian").checked;
    const dishes = menuData[category].filter((dish) => (!vegetarian || dish[3]) && `${dish[0]} ${dish[1]}`.toLowerCase().includes(query));
    const panel = document.querySelector("#dishes");
    panel.setAttribute("aria-labelledby", `tab-${category.toLowerCase()}`);
    panel.replaceChildren();
    for (const [name, description, price, veg] of dishes)
    {
        const article = document.createElement("article");
        article.className = "dish";
        const heading = document.createElement("h3");
        heading.textContent = name;
        if (veg)
        {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = "V";
            badge.setAttribute("aria-label", "Vegetarian marked");
            heading.append(badge);
        }
        const amount = document.createElement("span");
        amount.className = "price";
        amount.textContent = `$${price.toFixed(2)}`;
        heading.append(amount);
        const text = document.createElement("p");
        text.textContent = description;
        article.append(heading, text);
        panel.append(article);
    }
    if (!dishes.length) panel.textContent = "No dishes match this category and filter. Try another category or reset the menu.";
    document.querySelector("#menu-count").textContent = `${category}: ${dishes.length} dish${dishes.length === 1 ? "" : "es"} shown.`;
}
function selectTab(tab)
{
    category = tab.dataset.tab;
    tabs.forEach((item) =>
    {
        item.setAttribute("aria-selected", String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
    });
    render();
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) =>
    {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined)
        {
            event.preventDefault();
            selectTab(tabs[next]);
            tabs[next].focus();
        }
    });
});
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#vegetarian").addEventListener("change", render);
document.querySelector("#reset-menu").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    document.querySelector("#vegetarian").checked = false;
    selectTab(tabs[0]);
});
const toggle = document.querySelector("#nav-toggle");
const nav = document.querySelector("#nav");
toggle.addEventListener("click", () =>
{
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", () =>
{
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
document.querySelector("#booking-info").addEventListener("click", () =>
{
    document.querySelector("#booking-note").hidden = false;
});
render();
