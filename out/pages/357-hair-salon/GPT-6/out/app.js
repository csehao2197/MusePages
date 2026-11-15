const services =
{
    "Cut & Style": [65, 60, "Consultation included. A cut shaped around your routine.", ["Nora", "Maya", "Luna"]],
    "Colour & Balayage": [95, 180, "Bespoke blending, planned with your colourist.", ["Nora", "Maya"]],
    Highlights: [85, 120, "Foils and freehand for thoughtful light and dimension.", ["Nora", "Maya"]],
    "Blow-Dry": [40, 45, "An in-salon finish, from soft movement to sleek.", ["Nora", "Maya", "Luna"]],
    "Keratin Treatment": [150, 180, "A smoothing consultation and individual suitability review.", ["Nora"]],
    Extensions: [200, 180, "Tape, bonds or clip options discussed at consultation.", ["Luna"]]
};
document.querySelector("#service-grid").innerHTML = Object.entries(services).map(([name, data], i) => `<article class="service"><span class="service-index">SERVICE / ${String(i + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${data[2]}</p><div class="service-price"><strong>from £${data[0]}</strong><button data-book="${name}">Explore ↗</button></div></article>`).join("");
const looks = [["Soft blonde balayage", "portrait", "Colour & Balayage", "#a58b5e", "#d0b181"], ["Gloss brunette", "bob", "Blow-Dry", "#38251c", "#846046"], ["Natural texture", "portrait", "Cut & Style", "#211815", "#69472f"], ["Precision crop", "crop", "Cut & Style", "#211815", "#69472f"], ["Rich copper", "portrait", "Colour & Balayage", "#7d3b27", "#bc7751"]];
const art = (look) => `<svg role="img" aria-label="${look[0]}, original hair illustration" style="--hair:${look[3]};--strand:${look[4]}"><use href="#${look[1]}"/></svg>`;
document.querySelector("#gallery").innerHTML = looks.map((look, i) => `<button class="look" data-look="${i}">${art(look)}<span>${look[0]} ↗</span></button>`).join("");
let currentLook = 0;
document.querySelectorAll("[data-look]").forEach((button) => button.addEventListener("click", () =>
{
    currentLook = Number(button.dataset.look);
    const look = looks[currentLook];
    document.querySelector("#look-image").innerHTML = art(look);
    document.querySelector("#look-title").textContent = look[0].toUpperCase();
    document.querySelector("#look-copy").textContent = `An original concept study for ${look[2]}. Explore shape and tone at a consultation; an illustration is not a promise of an achievable result on every hair type.`;
    document.querySelector("#look-dialog").showModal();
}));
const form = document.querySelector("#booking-form");
const modal = document.querySelector("#booking-dialog");
form.elements.service.innerHTML = Object.keys(services).map((name) => `<option>${name}</option>`).join("");
function updateService()
{
    const name = form.elements.service.value;
    const data = services[name];
    const previous = form.elements.stylist.value;
    form.elements.stylist.innerHTML = data[3].map((stylist) => `<option>${stylist}</option>`).join("");
    if (data[3].includes(previous)) form.elements.stylist.value = previous;
    const starts = [540, 630, 720, 810, 900, 990].filter((start) => start + data[1] <= 1140);
    form.elements.time.innerHTML = starts.map((start) => `<option>${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}</option>`).join("");
    document.querySelector("#service-note").textContent = `From £${data[0]} · sample duration ${data[1]} minutes. ${name.includes("Colour") || name === "Highlights" ? "Colour suitability and any patch-test requirements must be confirmed by the operator before treatment. " : ""}All sample times finish by 19:00. Final price and duration follow consultation.`;
    document.querySelector("#booking-result").textContent = "Selection updated. No appointment reserved.";
}
form.elements.service.addEventListener("change", updateService);
form.addEventListener("input", () => document.querySelector("#booking-result").textContent = "Details changed. Preview again for the current selection.");
updateService();
function openBooking(service, stylist)
{
    if (service) form.elements.service.value = service;
    updateService();
    if (stylist && services[form.elements.service.value][3].includes(stylist)) form.elements.stylist.value = stylist;
    modal.showModal();
}
document.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => openBooking(button.dataset.book)));
document.querySelectorAll("[data-stylist]").forEach((button) => button.addEventListener("click", () => openBooking("Cut & Style", button.dataset.stylist)));
document.querySelector("#look-book").addEventListener("click", () =>
{
    document.querySelector("#look-dialog").close();
    openBooking(looks[currentLook][2]);
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#booking-result");
    const dateText = form.elements.date.value;
    if (form.elements.name.value.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!dateText || dateText <= new Date().toISOString().slice(0, 10))
    {
        result.textContent = "Choose a future appointment date.";
        return;
    }
    if (new Date(`${dateText}T12:00:00Z`).getUTCDay() === 0)
    {
        result.textContent = "The studio is closed on Sundays. Choose Monday to Saturday.";
        return;
    }
    const service = form.elements.service.value;
    result.textContent = `${service} with ${form.elements.stylist.value}, ${dateText} at ${form.elements.time.value}, from £${services[service][0]}. Browser preview only: no appointment booked, payment taken or email sent. Details stay in memory.`;
});
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
}));
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () => document.querySelector("#social-result").textContent = `${button.dataset.social}: no verified account exists for this fictional studio. Explore the local portfolio instead.`));
