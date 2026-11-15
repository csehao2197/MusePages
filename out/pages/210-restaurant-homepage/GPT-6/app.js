const menu =
{
    Dinner: [["Tagliatelle al Ragù", 28, "Hand-cut pasta, beef ragù · Contains wheat, egg, dairy"], ["Margherita Classica", 22, "Wood-fired pizza · Contains wheat, dairy"], ["Salmone al Limone", 34, "Salmon, lemon butter · Contains fish, dairy"], ["Burrata e Pomodori", 18, "Burrata, heritage tomato, basil · Contains dairy"]],
    Dessert: [["Tiramisù della Nonna", 12, "Espresso, mascarpone, cocoa · Contains wheat, egg, dairy"], ["Panna Cotta", 11, "Vanilla cream, seasonal berries · Contains dairy"], ["Affogato", 9, "Vanilla gelato, hot espresso · Contains dairy"]],
    Wine: [["Chianti Classico", 15, "Sangiovese · Tuscany · Glass"], ["Pinot Grigio", 13, "Crisp and delicate · Veneto · Glass"], ["Prosecco", 14, "Dry, bright and celebratory · Glass"]]
};
function course(name)
{
    document.querySelectorAll("[data-course]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.course === name));
    document.querySelector("#full-menu").innerHTML = menu[name].map(([dish, price, description]) => `<div class="menu-row">${dish}<strong>$${price}</strong><small>${description}</small></div>`).join("");
}
document.querySelectorAll(".menu-open, .dish-link").forEach((button) => button.onclick = () =>
{
    course("Dinner");
    document.querySelector("#menu-dialog").showModal();
});
document.querySelectorAll("[data-course]").forEach((button) => button.onclick = () => course(button.dataset.course));
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
const photos = [["interior.jpg", "The dining room — a warm welcome."], ["bar.jpg", "Aperitivo hour — settle in for the evening."], ["chef.jpg", "The kitchen — where every detail matters."], ["pasta.jpg", "Handmade pasta — the heart of our table."]];
let photo = 0;
function renderPhoto()
{
    document.querySelector("#large-photo").src = photos[photo][0];
    document.querySelector("#large-photo").alt = photos[photo][1];
    document.querySelector("#photo-caption").textContent = `${photo + 1} / ${photos.length} · ${photos[photo][1]}`;
}
document.querySelectorAll("[data-photo]").forEach((button) => button.onclick = () =>
{
    photo = Number(button.dataset.photo);
    renderPhoto();
    document.querySelector("#lightbox").showModal();
});
document.querySelector("#photo-next").onclick = () =>
{
    photo = (photo + 1) % photos.length;
    renderPhoto();
};
document.querySelector("#photo-prev").onclick = () =>
{
    photo = (photo + photos.length - 1) % photos.length;
    renderPhoto();
};
document.querySelector("#lightbox").onkeydown = (event) =>
{
    if (event.key === "ArrowRight") document.querySelector("#photo-next").click();
    if (event.key === "ArrowLeft") document.querySelector("#photo-prev").click();
};
const today = new Date();
const date = document.querySelector("#date");
date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
date.value = date.min;
document.querySelector("#reserve-form").onsubmit = (event) =>
{
    event.preventDefault();
    const chosen = new Date(`${date.value}T12:00:00`);
    if (chosen.getDay() === 1)
    {
        document.querySelector("#reservation-result").textContent = "We rest on Mondays. Please choose Tuesday–Sunday.";
        return;
    }
    document.querySelector("#reservation-result").textContent = `${document.querySelector("#guest-name").value.trim()}, your preview: ${document.querySelector("#guests").value}, ${chosen.toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${document.querySelector("#time").value}. Please call to reserve; nothing was booked or sent.`;
};
document.querySelector("#newsletter").onsubmit = (event) =>
{
    event.preventDefault();
    document.querySelector("#newsletter-result").textContent = "A lovely thought. This local signup preview sends no email and creates no subscription.";
    document.querySelector("#newsletter-email").value = "";
};
const info =
{
    "Private events": "Celebrate in good company. Our private dining concept accommodates 12–30 guests. Call 212.555.0185 to discuss an evening made personal. No booking is created online.",
    "Careers": "Great hospitality starts with good people. Our restaurant concept has no active vacancies; this is a demonstration.",
    "Instagram": "An illustrative social profile. No official Bella Cucina account is connected to this concept.",
    "Facebook": "This fictional restaurant has no connected Facebook page.",
    "Yelp": "Reviews shown here are sample content, not Yelp reviews or actual verification."
};
document.querySelectorAll("[data-info]").forEach((button) => button.onclick = () =>
{
    document.querySelector("#info-title").textContent = button.dataset.info;
    document.querySelector("#info-copy").textContent = info[button.dataset.info];
    document.querySelector("#info-dialog").showModal();
});
