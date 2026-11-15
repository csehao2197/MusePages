const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
}));
document.querySelector("#capacity").addEventListener("change", (event) =>
{
    let count = 0;
    document.querySelectorAll("[data-capacity]").forEach((space) =>
    {
        space.hidden = Number(space.dataset.capacity) < Number(event.target.value);
        if (!space.hidden) count++;
    });
    document.querySelector("#space-result").textContent = `${count} setting${count === 1 ? "" : "s"} to explore`;
    document.querySelector("#space-empty").hidden = count !== 0;
});
const lightbox = document.querySelector("#lightbox");
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#view-title").textContent = button.dataset.view;
    lightbox.showModal();
}));
document.querySelector("#close-gallery").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) =>
{
    if (event.target === lightbox) lightbox.close();
});
const form = document.querySelector("#enquiry");
const date = document.querySelector("#date");
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
form.addEventListener("input", () =>
{
    document.querySelector("#confirmation").hidden = true;
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const error = document.querySelector("#form-error");
    if (!form.checkValidity() || document.querySelector("#names").value.trim().length < 2)
    {
        error.textContent = "Please enter your names, a valid email, a future date and a guest range.";
        return;
    }
    error.textContent = "";
    const confirmation = document.querySelector("#confirmation");
    confirmation.textContent = `Enquiry preview for ${document.querySelector("#names").value.trim()}: ${date.value}, ${document.querySelector("#guests").value}. Nothing has been sent; availability and pricing require confirmation with the venue.`;
    confirmation.hidden = false;
});
