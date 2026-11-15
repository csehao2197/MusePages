const courses =
{
    Starters:
    [
        ["Oysters on the Half Shell", "Six Pacific oysters, champagne mignonette, horseradish", "$22"],
        ["Bone Marrow Custard", "Roasted marrow, brioche soldiers, micro herbs, fleur de sel", "$18"],
        ["Wagyu Beef Tartare", "Hand-cut A5 wagyu, cured egg yolk, black truffle, grissini", "$28"],
        ["Seared Foie Gras", "Brioche, sour cherry, candied walnut, aged balsamic", "$32"],
        ["Lobster Bisque", "Maine lobster, brandy cream, tarragon oil, sourdough croutons", "$24"],
        ["Ember Charcuterie Board", "House-cured meats, aged cheeses, pickles, honeycomb, grilled bread", "$38"]
    ],
    Mains:
    [
        ["40-Day Dry-Aged Ribeye (16oz)", "White oak-grilled, bone marrow butter, roasted garlic jus", "$78"],
        ["Prime New York Strip (14oz)", "Truffle compound butter, crispy shallots, herb oil", "$68"],
        ["Tomahawk for Two (32oz)", "Dry-aged 30 days, table-side carving, three sauces", "$155"],
        ["Whole Roasted Duck", "Cherry gastrique, duck fat fingerlings, braised endive", "$62"],
        ["Pan-Seared Halibut", "Champagne beurre blanc, saffron oil, charred leek, caperberries", "$54"],
        ["Filet Mignon (8oz)", "Béarnaise, pomme purée, haricots verts", "$74"]
    ],
    Desserts:
    [
        ["Valrhona Chocolate Fondant", "Salted caramel, vanilla bean ice cream", "$16"],
        ["Crème Brûlée", "Classic Madagascar vanilla, caramelized sugar, seasonal berries", "$14"],
        ["Cheese Selection", "Three aged cheeses, honeycomb, quince paste, walnut bread", "$22"],
        ["Ember Apple Tarte Tatin", "Calvados caramel, crème fraîche, toasted almond", "$15"]
    ],
    Drinks:
    [
        ["Old Fashioned", "Maker's Mark 46, Angostura, orange peel, Luxardo cherry", "$18"],
        ["Ember Negroni", "Mancino Secco, Campari, Sipsmith gin, black walnut bitters", "$19"],
        ["The Vine Sauvignon Blanc", "Marlborough, New Zealand, crisp, citrus-forward", "$16/glass"],
        ["Château Pichon Baron 2016", "Pauillac, Bordeaux — full-bodied, classic structure", "$28/glass"]
    ]
};
const tabs = [...document.querySelectorAll("[data-course]")];
function showCourse(button)
{
    tabs.forEach((tab) =>
    {
        tab.setAttribute("aria-selected", String(tab === button));
        tab.tabIndex = tab === button ? 0 : -1;
    });
    document.querySelector("#menu-items").setAttribute("aria-labelledby", button.id);
    document.querySelector("#menu-items").innerHTML = courses[button.dataset.course].map(([name, description, price]) => `<article class="dish"><div><h3>${name}</h3><p>${description}</p></div><span>${price}</span></article>`).join("");
}
tabs.forEach((button, index) =>
{
    button.addEventListener("click", () => showCourse(button));
    button.addEventListener("keydown", (event) =>
    {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        showCourse(tabs[next]);
        tabs[next].focus();
    });
});
showCourse(tabs[0]);
const menuButton = document.querySelector("#menu-toggle");
menuButton.addEventListener("click", () =>
{
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
    menuButton.textContent = open ? "Close" : "Menu";
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("nav").classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
}));
addEventListener("scroll", () => document.querySelector("header").classList.toggle("scrolled", scrollY > 80), { passive: true });
const form = document.querySelector("form");
const party = document.querySelector("#party");
function updateParty()
{
    const privateDining = form.elements.occasion.value === "Private dining";
    const first = privateDining ? 8 : 1;
    const last = privateDining ? 22 : 8;
    party.innerHTML = Array.from({ length: last - first + 1 }, (_, index) => `<option>${index + first}</option>`).join("");
}
form.elements.occasion.addEventListener("change", updateParty);
updateParty();
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
form.elements.date.min = today;
document.querySelector("#private-button").addEventListener("click", () =>
{
    form.elements.occasion.value = "Private dining";
    updateParty();
    document.querySelector("#reserve").scrollIntoView();
    form.elements.date.focus({ preventScroll: true });
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = form.elements;
    const result = document.querySelector("#reservation-result");
    if (!fields.date.value || fields.date.value < today)
    {
        result.textContent = "Choose today or a future date.";
        return;
    }
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid || fields.phone.value.replace(/\D/g, "").length < 7)
    {
        result.textContent = "Enter a full name, valid email and phone number.";
        return;
    }
    if (!fields.consent.checked)
    {
        result.textContent = "Please acknowledge the local request preview.";
        return;
    }
    result.textContent = `${fields.occasion.value} preview: ${fields.party.value} guests, ${fields.date.value} at ${fields.time.value}. No request sent and no table reserved.`;
});
const notes =
[
    ["Heat. Time. Restraint.", "We let the fire do its work, and the ingredient tell its story."],
    ["A seat at the table.", "Good food is only half the evening. The company makes the rest."],
    ["Nothing for decoration.", "Every element on the plate earns its place."]
];
document.querySelectorAll("[data-note]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, body] = notes[Number(button.dataset.note)];
    document.querySelector("#note").textContent = title;
    document.querySelector("#note-body").textContent = body;
    document.querySelectorAll("[data-note]").forEach((dot) => dot.setAttribute("aria-pressed", String(dot === button)));
}));
