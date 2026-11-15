const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const dialog = document.querySelector("#film-dialog");
const strip = document.querySelector(".film-strip");
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        strip.classList.add("settled");
        observer.disconnect();
    }
}, { threshold: .2 });
observer.observe(strip);
document.querySelectorAll("[data-film]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#film-title").textContent = button.dataset.film.toUpperCase();
    dialog.showModal();
}));
document.querySelector("#close-film").addEventListener("click", () => dialog.close());
const roles =
{
    "Rosa Elliott": "Shapes the treatment and finds the human story before a camera comes out.",
    "Sam Okoye": "Looks for available light, quiet frames and a camera position that earns its place.",
    "Hannah Bruce": "Plans the site visits, shifts, permissions and the schedule around the people in the film.",
    "Dan Field": "Finds the rhythm in the edit, then brings the colour and sound into the same world."
};
document.querySelectorAll("[data-person]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#team-note").textContent = `${button.dataset.person}: ${roles[button.dataset.person]} Fictional crew profile.`;
}));
document.querySelectorAll(".rate-download").forEach((button) => button.addEventListener("click", () =>
{
    const content = "NORTHLINE | ILLUSTRATIVE RATE CARD\nUnder 5,000 GBP: one shoot day, one deliverable.\n5,000 to 15,000 GBP: most brand films, grade and sound mix.\nAbove 15,000 GBP: documentary work and multiple locations.\nConcept only, not a binding quote. No client relationships claimed.";
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "northline-rate-card.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}));
document.querySelector("#vimeo").addEventListener("click", () => document.querySelector("#vimeo-status").hidden = false);
const form = document.querySelector("#project-form");
const status = document.querySelector("#project-status");
form.addEventListener("input", () => status.hidden = true);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (document.querySelector("#name").value.trim().length < 2 || document.querySelector("#story").value.trim().length < 20)
    {
        status.textContent = "Add your name and at least 20 non-space characters about the story.";
        return;
    }
    status.textContent = `Brief prepared for ${document.querySelector("#name").value.trim()}. Budget: ${document.querySelector("#budget").value}. Nothing sent. This is not a quote or confirmed production.`;
});
