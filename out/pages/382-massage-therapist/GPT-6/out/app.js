const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        menu.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
    }
});
const form = document.querySelector("#booking-form");
const result = document.querySelector("#result");
const treatment = document.querySelector("#treatment");
const date = document.querySelector("#date");
const today = new Date();
const localDate = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
date.min = localDate(today);
document.querySelectorAll("[data-treatment]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        treatment.value = button.dataset.treatment;
        document.querySelector("#booking").scrollIntoView();
    });
});
document.querySelector("#package").addEventListener("click", () =>
{
    document.querySelector("#package-note").hidden = false;
    treatment.value = "swedish-60";
    document.querySelector("#booking").scrollIntoView();
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    if (!data.get("name").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")))
    {
        result.textContent = "Enter an example name and valid example email.";
        return;
    }
    if (!treatment.value)
    {
        result.textContent = "Choose a treatment to continue.";
        return;
    }
    if (!date.value || date.value < date.min)
    {
        result.textContent = "Choose today or a future date.";
        return;
    }
    const day = new Date(`${date.value}T12:00:00`).getDay();
    if (day === 0 || day === 1)
    {
        result.textContent = "The sample studio is closed Sunday and Monday. Choose Tuesday–Saturday.";
        return;
    }
    if (!data.get("ack"))
    {
        result.textContent = "Confirm the local-only acknowledgement.";
        return;
    }
    result.textContent = `Local plan: ${treatment.selectedOptions[0].textContent} on ${date.value}. No request sent, appointment reserved or payment taken.`;
});
form.addEventListener("reset", () =>
{
    result.textContent = "";
    document.querySelector("#package-note").hidden = true;
});
const steam = document.querySelector(".steam");
for (let index = 0; index < 12; index++)
{
    const particle = document.createElement("i");
    particle.style.left = `${8 + index * 7}%`;
    particle.style.animationDelay = `${index * .6}s`;
    steam.append(particle);
}
