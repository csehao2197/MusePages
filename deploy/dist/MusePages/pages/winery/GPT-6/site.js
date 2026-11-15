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
window.addEventListener("scroll", () =>
{
    document.querySelector("#header").classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });
document.querySelectorAll(".wine-grid article > a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector(link.getAttribute("href")).open = true;
}));
document.querySelectorAll("[data-club]").forEach((button) => button.addEventListener("click", () =>
{
    const annual = Number(button.dataset.price) * Number(button.dataset.cadence);
    document.querySelector("#club-result").textContent = `${button.dataset.club}: $${button.dataset.price} × ${button.dataset.cadence} shipments = $${annual} per year before tax and shipping. Local comparison only; you have not joined or been charged.`;
}));
const experience = document.querySelector("#experience");
const date = document.querySelector("#date");
const guests = document.querySelector("#guests");
const time = document.querySelector("#time");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
function update()
{
    const price = { classic: 35, estate: 65, walk: 95 }[experience.value];
    document.querySelector("#tasting-total").textContent = `${Number(guests.value || 0)} guests · $${price * Number(guests.value || 0)} before any tax or extras`;
    document.querySelector("#tasting-result").textContent = "No table is held and no payment is requested.";
    const maximum = experience.value === "walk" ? 15 : experience.value === "estate" ? 15 : 16;
    [...time.options].forEach((option) =>
    {
        option.disabled = Number(option.value.slice(0, 2)) > maximum;
    });
    if (Number(time.value.slice(0, 2)) > maximum) time.value = `${maximum}:00`;
}
[experience, guests].forEach((input) => input.addEventListener("change", update));
guests.addEventListener("input", update);
document.querySelector("#tasting-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#tasting-result");
    if (!event.currentTarget.checkValidity())
    {
        result.textContent = "Please enter a future date, 1–8 guests, a valid email and confirm the age requirement.";
        return;
    }
    if (experience.value === "walk" && new Date(`${date.value}T12:00:00`).getDay() !== 6)
    {
        result.textContent = "The Vineyard Walk runs Saturdays only. Choose a Saturday or another experience.";
        return;
    }
    result.textContent = `Visit preview: ${experience.selectedOptions[0].textContent}, ${guests.value} guests, ${date.value} at ${time.value}. No reservation has been made; confirm directly with the estate.`;
});
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = document.querySelector("#newsletter-email");
    document.querySelector("#newsletter-result").textContent = input.checkValidity() ? "Your newsletter preview is ready. No subscription was created and no email was sent." : "Please enter a valid email to preview signup.";
});
update();
