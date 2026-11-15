const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
const dialog = document.querySelector("#product");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.addEventListener("click", () =>
{
    navigation.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
document.querySelectorAll("[data-product]").forEach((link) =>
{
    link.addEventListener("click", (event) =>
    {
        event.preventDefault();
        const [title, description, price] = link.dataset.product.split("|");
        document.querySelector("#product-title").textContent = title;
        document.querySelector("#product-description").textContent = description;
        document.querySelector("#product-price").textContent = price;
        dialog.showModal();
    });
});
document.querySelectorAll("[data-note]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#product-title").textContent = button.textContent;
        document.querySelector("#product-description").textContent = button.dataset.note;
        document.querySelector("#product-price").textContent = "";
        dialog.showModal();
    });
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#email-status").textContent = "Thanks — demo preference noted. Nothing was sent or subscribed.";
});
