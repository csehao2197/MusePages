const drinks =
{
    Signature: [["The Last Light", "Mezcal, aperol, blood orange, activated charcoal", "£15"], ["Midnight Sour", "Bourbon, black sesame, lemon, honey", "£14"], ["Fog of Dusk", "Gin, elderflower, cucumber · theatrical serve", "£14"]],
    Classics: [["Dusk Negroni", "Gin, vermouth, bitter orange", "£12"], ["House Old Fashioned", "Bourbon, bitters, demerara", "£13"]],
    Zero: [["Afterglow", "Zero-proof aperitif, blood orange, soda", "£10"], ["Soft Focus", "Low ABV sherry, cucumber, tonic", "£11"]],
    Spirits: [["Seasonal Highball", "Japanese whisky, apple, soda", "£13"], ["Rare Pours", "Ask your bartender for today's spirits selection", "Ask us"]]
};
let category = "Signature";
const list = document.querySelector("#drink-list");
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const filtered = drinks[category].filter((drink) => drink.join(" ").toLowerCase().includes(query));
    list.replaceChildren();
    for (const [name, detail, price] of filtered)
    {
        const article = document.createElement("article");
        article.className = "drink";
        const picture = document.createElement("div");
        picture.className = "drink-picture";
        picture.innerHTML = '<div class="glass" aria-hidden="true"></div>';
        const title = document.createElement("h4");
        title.textContent = name;
        const copy = document.createElement("p");
        copy.textContent = detail;
        const cost = document.createElement("span");
        cost.className = "price";
        cost.textContent = price;
        article.append(picture, title, copy, cost);
        list.append(article);
    }
    if (!filtered.length) list.textContent = "No matching flavours. Try another ingredient or category.";
    document.querySelector("#drink-heading").textContent = category === "Signature" ? "Current signatures" : `${category} selection`;
}
document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () =>
{
    category = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach((item) =>
    {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelector("#search").value = "";
    render();
}));
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
document.querySelector("#booking").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = document.querySelector("#date").value;
    const status = document.querySelector("#booking-status");
    if (!value || value <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future evening to make your plan.";
        return;
    }
    if (new Date(`${value}T12:00:00`).getDay() === 1)
    {
        status.textContent = "The bar is closed on Mondays. Choose Tuesday–Sunday.";
        return;
    }
    status.textContent = `Evening plan: ${document.querySelector("#guests").value} guests, ${value} at ${document.querySelector("#time").value}. Nothing reserved or sent; contact the bar to confirm availability.`;
});
document.querySelector("#mailing").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email");
    document.querySelector("#mail-status").textContent = email.validity.valid && email.value ? "Preview complete — no subscription created and no email sent." : "Enter a valid email address to preview joining.";
});
render();
