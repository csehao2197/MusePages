const beers =
[
    ["Ironside Pale Ale", "American Pale", "4.8%", 35, "Tropical citrus, pine resin and soft stone fruit. A refreshingly bitter finish. Our original pale, brewed since day one.", "Pale"],
    ["Coal Face Porter", "English Porter", "5.6%", 28, "Roasted malt, dark chocolate bitterness and a quiet vanilla finish. A rich, warming Sheffield porter.", "Dark"],
    ["Golden Anvil Lager", "Czech Pilsner Style", "4.2%", 22, "Clean, crisp and refreshing. Floral hops meet a smooth malt backbone and a bright finish.", "Lager"],
    ["Ember Wheat", "Hefeweizen", "4.5%", 15, "Banana and clove from Bavarian yeast. A smooth, hazy golden pour, naturally cloudy and unfiltered.", "Wheat"],
    ["Copper Run IPA", "West Coast IPA", "6.2%", 65, "Grapefruit, mango and resinous pine. Big hops, dry and assertive, with a clean bitter finish.", "IPA"],
    ["Session Saison", "Belgian Saison", "3.8%", 20, "White pepper, lemon zest and fresh hay. Light, effervescent farmhouse character with plenty to say.", "Saison"]
];
function renderBeers()
{
    const style = document.querySelector("#style").value;
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const filtered = beers.filter((beer) => (style === "All styles" || beer[5] === style) && beer.join(" ").toLowerCase().includes(query));
    const grid = document.querySelector("#beer-grid");
    grid.replaceChildren();
    for (const [name, type, abv, ibu, notes] of filtered)
    {
        const button = document.createElement("button");
        button.className = "beer";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", `${name}, ${type}, ${abv} ABV. ${notes} ${ibu} IBU. Turn label.`);
        button.innerHTML = `<div class="beer-inner"><div class="beer-front" aria-hidden="true"><div><h3>${name}</h3><small>${type.toUpperCase()}</small></div><div><strong>${abv}</strong><br><small>ABV</small></div><small>TURN FOR TASTING NOTES ↗</small></div><div class="beer-back" aria-hidden="true"><small>TASTING NOTES</small><p>${notes}</p><span>${ibu} IBU / ${abv} ABV</span><small>ILLUSTRATIVE MENU · ASK AT THE BAR</small></div></div>`;
        button.addEventListener("click", () => button.setAttribute("aria-pressed", String(button.classList.toggle("flipped"))));
        grid.append(button);
    }
    document.querySelector("#beer-status").textContent = filtered.length ? `${filtered.length} beers in this selection` : "No matching beers. Try another style or flavour.";
}
document.querySelector("#style").addEventListener("change", renderBeers);
document.querySelector("#search").addEventListener("input", renderBeers);
const bag = [];
function renderBag()
{
    const list = document.querySelector("#bag-list");
    list.replaceChildren();
    bag.forEach((product, index) =>
    {
        const row = document.createElement("li");
        const copy = document.createElement("span");
        copy.textContent = `${product.name} · £${product.price} `;
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove ${product.name}`);
        remove.addEventListener("click", () =>
        {
            bag.splice(index, 1);
            renderBag();
        });
        row.append(copy, remove);
        list.append(row);
    });
    if (!bag.length) list.textContent = "Your bag is empty.";
    document.querySelector("#bag-total").textContent = `£${bag.reduce((sum, product) => sum + product.price, 0)}`;
}
document.querySelectorAll("[data-product]").forEach((button) => button.addEventListener("click", () =>
{
    bag.push({ name: button.dataset.product === "Hoodie" ? `Hoodie (${document.querySelector("#size").value})` : button.dataset.product, price: Number(button.dataset.price) });
    renderBag();
}));
document.querySelector("#clear").addEventListener("click", () =>
{
    bag.length = 0;
    renderBag();
});
document.querySelector("#tour-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const people = Number(document.querySelector("#people").value);
    const date = document.querySelector("#date").value;
    const email = document.querySelector("#email");
    const status = document.querySelector("#tour-status");
    if (!Number.isInteger(people) || people < 1 || people > 12)
    {
        status.textContent = "Choose 1–12 adults per enquiry.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future preferred date.";
        return;
    }
    if (new Date(`${date}T12:00:00`).getDay() === 1)
    {
        status.textContent = "The taproom is closed on Mondays. Choose another day.";
        return;
    }
    if (!email.value || !email.validity.valid)
    {
        status.textContent = "Enter a valid email address.";
        return;
    }
    if (!document.querySelector("#adult").checked)
    {
        status.textContent = "Confirm all attendees are 18 or over.";
        return;
    }
    status.textContent = `${people} adults on ${date}: illustrative total £${people * Number(document.querySelector("#tour").value)}. Nothing booked, charged or sent. Contact the taproom to request a session; dates are not live availability.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
renderBeers();
renderBag();
