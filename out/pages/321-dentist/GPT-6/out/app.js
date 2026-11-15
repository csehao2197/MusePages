const services = [
    ["Dental Check-Up", "routine", "FROM $80", "An examination of teeth and gums, with time to discuss your questions.", "◌", "#deeeee"],
    ["Teeth Cleaning", "routine", "FROM $120", "Discuss professional hygiene care and a routine suited to your needs.", "⌁", "#dce9e4"],
    ["Tooth Whitening", "cosmetic", "FROM $299", "Explore whitening options, suitability and realistic expectations.", "✧", "#eee8dc"],
    ["Dental Implants", "restorative", "FROM $1,800", "Learn about assessment and restoration options for missing teeth.", "⊙", "#e7e5df"],
    ["Veneers & Crowns", "restorative", "FROM $650", "Discuss ways to restore tooth shape, appearance and function.", "∩", "#e8dfe0"],
    ["Emergency Care", "routine", "ASK ABOUT AVAILABILITY", "Contact an appropriate urgent dental service for pain or trauma.", "+", "#d4e4e6"]
];
const grid = document.querySelector("#service-grid");
function renderServices()
{
    const filter = document.querySelector("#service-filter").value;
    grid.innerHTML = services.filter((s) => filter === "all" || s[1] === filter).map((s) => `<article class="service"><div class="service-art" style="--tint:${s[5]}" aria-hidden="true">${s[4]}</div><div class="service-body"><span class="price">${s[2]}</span><h3>${s[0]}</h3><p>${s[3]}</p><button data-care="${s[0]}">Explore this care ↗</button></div></article>`).join("");
    document.querySelector("#empty").hidden = grid.children.length > 0;
}
renderServices();
document.querySelector("#service-filter").addEventListener("change", renderServices);
grid.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-care]");
    if (!button) return;
    document.querySelector("#care").value = button.dataset.care;
    document.querySelector("#status").textContent = "";
    document.querySelector("#contact").scrollIntoView();
    document.querySelector("#name").focus({ preventScroll: true });
});
const descriptions = [
    "Start with a conversation about your teeth, comfort and priorities.",
    "Review your options, individual fees and the proposed care plan.",
    "Understand what your treatment involves before you decide.",
    "Discuss aftercare and an individual checkup schedule."
];
document.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-step]").forEach((step) => step.setAttribute("aria-selected", String(step === button)));
    document.querySelector("#step-copy").textContent = descriptions[Number(button.dataset.step)];
}));
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const care = document.querySelector("#care").value;
    const date = document.querySelector("#date").value;
    const status = document.querySelector("#status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!care)
    {
        status.textContent = "Choose a care option.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future preferred date.";
        return;
    }
    status.textContent = `${name}, your sample ${care.toLowerCase()} enquiry for ${date} is ready. Nothing sent or booked.`;
});
document.querySelectorAll("#enquiry input, #enquiry select").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const start = performance.now();
        function frame(now)
        {
            const progress = reduced ? 1 : Math.min((now - start) / 1400, 1);
            element.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        observer.unobserve(element);
    });
}, { threshold: .3 });
document.querySelectorAll("[data-count]").forEach((element) => observer.observe(element));
