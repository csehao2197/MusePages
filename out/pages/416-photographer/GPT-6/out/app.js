const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
function closeMenu()
{
    navigation.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const open = navigation.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
});
navigation.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
document.querySelectorAll("[data-filter]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        let count = 0;
        document.querySelectorAll("[data-category]").forEach((item) =>
        {
            item.hidden = button.dataset.filter !== "All" && item.dataset.category !== button.dataset.filter;
            if (!item.hidden) count++;
        });
        document.querySelector("#count").textContent = `${count} illustrated ${count === 1 ? "study" : "studies"}`;
    });
});
const dialog = document.querySelector("#study");
document.querySelectorAll("[data-category]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#study-title").textContent = button.dataset.title;
        document.querySelector("#study-copy").textContent = `${button.dataset.category}: an original illustration exploring warm shadow, quiet expression and off-centre composition. This is a creative direction study, not a delivered client photograph.`;
        dialog.showModal();
    });
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelectorAll("[data-session]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#session").value = button.dataset.session;
        document.querySelector("#contact").scrollIntoView();
        document.querySelector("#name").focus({ preventScroll: true });
    });
});
const form = document.querySelector("#request");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const date = document.querySelector("#date").value;
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (!name || !email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Please enter your name and a valid email address.";
        return;
    }
    if (!date || date <= localToday)
    {
        result.textContent = "Choose a future preferred date. Availability still needs confirmation.";
        return;
    }
    result.textContent = `${name}, your ${document.querySelector("#session").value} session outline for ${date} is ready locally. Nothing sent or booked. Email the concept contact separately if appropriate.`;
});
form.addEventListener("reset", () => result.textContent = "");
