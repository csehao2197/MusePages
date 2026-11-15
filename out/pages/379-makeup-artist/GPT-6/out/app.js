const studies =
[
    ["Editorial", "The burgundy study", "Architectural eyeliner, warm skin and a deep burgundy lip. An original vector study of contrast, not a photograph or client commission.", "Editorial & Fashion"],
    ["Bridal", "Quiet luminosity", "A softer colour treatment of the illustrated face, exploring warm neutrals and gentle definition. Discuss preferences and product suitability with a real artist.", "Bridal"],
    ["Commercial", "Colour, in focus", "A high-saturation crop used to explore the graphic impact of a campaign image. No brand campaign or product claim is implied.", "Commercial & Film"],
    ["Film", "Between light & shadow", "A monochrome character study, imagining how definition reads on camera. This is not a film credit or behind-the-scenes photograph.", "Commercial & Film"],
    ["Editorial", "An architectural eye", "A closer crop and heightened contrast to isolate shape around the eye. A concept direction, not a tutorial or professional result guarantee.", "Editorial & Fashion"],
    ["Bridal", "Golden hour", "A warm sepia interpretation of the original illustration, imagined for a considered bridal moodboard. No real bridal party is depicted.", "Bridal"]
];
let active = 0;
function render(filter)
{
    document.querySelector("#gallery").innerHTML = studies.map((study, index) => ({ study, index })).filter(({ study }) => filter === "All" || study[0] === filter).map(({ study, index }) => `<button class="study" data-study="${index}" aria-label="Open ${study[1]}"><img class="look-${index}" src="beauty.svg" alt="Original illustrated ${study[1].toLowerCase()}"><span>${study[0].toUpperCase()} / CONCEPT ${String(index + 1).padStart(2, "0")}<strong>${study[1]} ↗</strong></span></button>`).join("");
}
render("All");
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render(button.dataset.filter);
}));
document.querySelector("#gallery").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-study]");
    if (!button) return;
    active = Number(button.dataset.study);
    const study = studies[active];
    document.querySelector("#viewer-image").className = `look-${active}`;
    document.querySelector("#viewer-title").textContent = study[1];
    document.querySelector("#viewer-category").textContent = study[0];
    document.querySelector("#viewer-copy").textContent = study[2];
    document.querySelector("#viewer").showModal();
});
document.querySelector("#close-viewer").addEventListener("click", () => document.querySelector("#viewer").close());
document.querySelector("#viewer-choose").addEventListener("click", () =>
{
    document.querySelector("#service").value = studies[active][3];
    document.querySelector("[name='message']").value = `Inspired by the ${studies[active][1]} concept study. `;
    document.querySelector("#viewer").close();
    document.querySelector("#contact").scrollIntoView();
});
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#service").value = button.dataset.service;
    document.querySelector("#contact").scrollIntoView();
}));
const localToday = () =>
{
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
document.querySelector("[name='date']").min = localToday();
const form = document.querySelector("#enquiry");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const result = document.querySelector("#result");
    if (!String(data.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")) || String(data.get("message")).trim().length < 10)
    {
        result.textContent = "Enter a name, valid example email and a project description of at least 10 characters.";
        return;
    }
    if (!data.get("date") || data.get("date") < localToday())
    {
        result.textContent = "Choose today or a future proposed date. This does not check availability.";
        return;
    }
    if (!data.get("ack"))
    {
        result.textContent = "Confirm that this is a local project brief only.";
        return;
    }
    result.textContent = `Local brief: ${data.get("service")} on ${data.get("date")}. Direction: ${String(data.get("message")).trim()}. No enquiry sent, date held or booking made.`;
});
form.addEventListener("reset", () => document.querySelector("#result").textContent = "Use example information. Nothing is stored or sent.");
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
