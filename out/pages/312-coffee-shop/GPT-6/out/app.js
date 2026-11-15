const origins =
{
    Colombia: "Huila · caramel, red apple, cocoa · 250g £12",
    Ethiopia: "Sidama · bergamot, peach, jasmine · 250g £12",
    Brazil: "Cerrado · hazelnut, milk chocolate, fig · 250g £12"
};
const origin = document.querySelector("#origin");
function updateOrigin()
{
    document.querySelector("#origin-note").textContent = origins[origin.value];
}
origin.addEventListener("change", updateOrigin);
updateOrigin();
const basket = [];
const product = document.querySelector("#product");
function milkState()
{
    document.querySelector("#milk-label").hidden = product.selectedIndex !== 0;
}
product.addEventListener("change", milkState);
milkState();
function render()
{
    const list = document.querySelector("#basket-list");
    list.replaceChildren();
    basket.forEach((item, index) =>
    {
        const row = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = `${item.quantity} × ${item.name} — £${item.total.toFixed(2)} `;
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove ${item.name}`);
        remove.addEventListener("click", () =>
        {
            basket.splice(index, 1);
            render();
        });
        row.append(text, remove);
        list.append(row);
    });
    if (!basket.length) list.textContent = "A little empty. Add something lovely.";
    document.querySelector("#total").textContent = `£${basket.reduce((sum, item) => sum + item.total, 0).toFixed(2)}`;
}
document.querySelector("#add-item").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const quantity = Number(document.querySelector("#quantity").value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 12)
    {
        document.querySelector("#add-status").textContent = "Choose 1–12 of an item.";
        return;
    }
    const oat = product.selectedIndex === 0 && document.querySelector("#milk").value === "0.4";
    let name = product.selectedOptions[0].textContent.split(" · ")[0];
    if (product.selectedIndex === 4) name = `${origin.value} beans 250g`;
    if (oat) name += " with oat";
    basket.push({ name, quantity, total: quantity * (Number(product.value) + (oat ? 0.4 : 0)) });
    render();
    document.querySelector("#add-status").textContent = "Added to your local estimate. Nothing ordered.";
});
document.querySelector("#clear").addEventListener("click", () =>
{
    basket.length = 0;
    render();
});
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const people = Number(document.querySelector("#people").value);
    document.querySelector("#event-status").textContent = Number.isInteger(people) && people >= 4 && people <= 24 ? `${document.querySelector("#occasion").value} for ${people}: enquiry preview ready. Contact the café to discuss dates; nothing booked or sent.` : "Choose a group of 4–24 people.";
});
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
render();
