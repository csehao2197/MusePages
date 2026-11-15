const swatches = document.querySelectorAll("[data-colour]");
swatches.forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.documentElement.style.setProperty("--swatch", button.dataset.colour);
        swatches.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
        document.querySelector("#colour-name").textContent = button.querySelector("strong").textContent;
    });
});
