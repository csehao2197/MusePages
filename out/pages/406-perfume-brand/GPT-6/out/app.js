const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
const products =
{
    figue: ["Figue Noire", "WOODY · GREEN", "Crushed fig leaf, fig milk and dark cedar. An evening in a walled garden in Provence.", [["50ml", 185], ["100ml", 260]]],
    ambre: ["Lumière d'Ambre", "AMBER · RESINOUS", "The amber composition in our four-fragrance collection. Additional notes have not been supplied.", [["50ml", 195]]],
    jasmin: ["Jasmin de Nuit", "WHITE FLORAL", "The white floral composition in our four-fragrance collection. Additional notes have not been supplied.", [["50ml", 185]]],
    pluie: ["Pluie Minérale", "FRESH · MINERAL", "The fresh mineral composition in our four-fragrance collection. Additional notes have not been supplied.", [["50ml", 175]]],
    discovery: ["The discovery set", "FOUR COMPOSITIONS · 2ML EACH", "Four 2ml vials in a linen-bound case. Brief-supplied €32 credit offer is illustrative only.", [["4 × 2ml", 32]]]
};
const key = new URLSearchParams(location.search).get("fragrance");
const product = products[key];
const dialog = document.querySelector("#product");
if (product)
{
    document.querySelector("#product-name").textContent = product[0];
    document.querySelector("#product-family").textContent = product[1];
    document.querySelector("#product-description").textContent = product[2];
    const size = document.querySelector("#size");
    product[3].forEach(([name, price]) => size.add(new Option(name, String(price))));
    const update = () => document.querySelector("#product-price").textContent = `€${size.value}`;
    size.addEventListener("change", update);
    update();
    dialog.showModal();
}
document.querySelector("#close-product").addEventListener("click", () =>
{
    dialog.close();
    history.replaceState(null, "", "index.html#collection");
});
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email");
    document.querySelector("#newsletter-result").textContent = email.value.trim() && email.validity.valid ? "Subscription previewed locally. Nothing was sent or saved." : "Enter a valid email address to preview.";
});
const delivery = document.querySelector("#delivery-info");
document.querySelector("#delivery").addEventListener("click", () => delivery.showModal());
document.querySelector("#close-delivery").addEventListener("click", () => delivery.close());
