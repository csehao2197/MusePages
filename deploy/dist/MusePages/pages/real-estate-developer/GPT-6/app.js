const developments = [
    ["SELLING NOW", "Harbour Row", "Shoreham-by-Sea", "Four brick townhouses on the edge of the harbour, each with a roof terrace looking over the boats.", "4 homes · 3 bedrooms · from £785,000", "View Harbour Row"],
    ["COMING SPRING 2027", "The Pines", "West Wittering", "Six single storey courtyard houses set among existing pine trees, five minutes on foot from the beach.", "6 homes · 2 to 4 bedrooms · from £950,000", "Register for The Pines"],
    ["IN PLANNING", "The Old School", "Lewes", "A Victorian school turned into twelve apartments, with new glass wings in the old playground.", "12 homes · 1 to 3 bedrooms · prices to be announced", "Follow The Old School"]
];
document.querySelector(".developments").innerHTML = developments.map(([status, name, location, text, facts, action]) => `<article class="development"><div class="scheme-art"><img src="coast.svg" alt="Original coastal architectural study for illustrative ${name} listing"></div><div><p class="label">${status}</p><h3>${name}</h3><span class="location">${location}</span><p>${text}</p><p class="facts">${facts}</p><a class="text-link" href="#register" data-development="${name}">${action}</a></div></article>`).join("");
document.querySelectorAll("[data-development]").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector('[name="development"]').value = link.dataset.development;
}));
const completed = [["Saltings", "Bosham", "2025", "8 homes"], ["Chapel Yard", "Arundel", "2023", "14 homes"], ["The Ropewalk", "Rye", "2021", "10 homes"], ["Downs View", "Ditchling", "2019", "6 homes"], ["Marine Terrace", "Hove", "2016", "18 homes"]];
document.querySelector(".completed").innerHTML = completed.map(([name, town, year, homes]) => `<button aria-pressed="false" data-scheme="${name}"><span>${name}</span><span class="town">${town}</span><span>${year}</span><span class="homes">${homes}</span></button>`).join("");
document.querySelectorAll("[data-scheme]").forEach((button) => button.addEventListener("click", () =>
{
    const active = button.getAttribute("aria-pressed") !== "true";
    document.querySelectorAll("[data-scheme]").forEach((row) => row.setAttribute("aria-pressed", row === button && active));
    const preview = document.querySelector(".scheme-preview");
    preview.hidden = !active;
    preview.querySelector("figcaption").textContent = `${completed.find(([name]) => name === button.dataset.scheme).join(" · ")}. Original study, illustrative project data.`;
}));
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.target);
    document.querySelector("#confirmation").textContent = `Thank you, ${data.get("name")}. Your interest in ${data.get("development")} is prepared locally. Nothing was submitted. For actual availability contact sales directly.`;
});
document.querySelector("form").addEventListener("reset", () => document.querySelector("#confirmation").textContent = "Your details stay in this page.");
const dialog = document.querySelector("dialog");
document.querySelector("#privacy").addEventListener("click", () => dialog.showModal());
document.querySelector(".close").addEventListener("click", () => dialog.close());
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
