const finishes =
[
    { id: "oak-natural", name: "Natural Oak", price: 62, fit: 24, color: "#bc966d" },
    { id: "oak-smoked", name: "Smoked Oak", price: 74, fit: 24, color: "#907152" },
    { id: "walnut", name: "American Walnut", price: 96, fit: 24, color: "#73513b" },
    { id: "herringbone", name: "Oak Herringbone", price: 88, fit: 38, color: "#b8976c" },
    { id: "lvt-stone", name: "LVT Stone Effect", price: 38, fit: 22, color: "#b6b4a9" }
];
let selected = finishes[0];
document.querySelector("#swatches").innerHTML = finishes.map((finish) => `<button aria-label="${finish.name}" aria-pressed="${finish === selected}" data-finish="${finish.id}" style="--swatch:${finish.color}"></button>`).join("");
function choose(finish)
{
    selected = finish;
    document.documentElement.style.setProperty("--floor", finish.color);
    document.querySelector("#room-floor").setAttribute("fill", `url(#${finish.id === "herringbone" ? "herring" : finish.id === "lvt-stone" ? "stone" : "plank"})`);
    document.querySelector("#room-title").textContent = `Room visualiser: ${finish.name}`;
    document.querySelector("#finish-name").textContent = finish.name;
    document.querySelector("#finish-price").innerHTML = `£${finish.price}/m² supply · £${finish.fit}/m² fitting<strong>£${finish.price + finish.fit}/m² combined</strong>`;
    document.querySelectorAll("[data-finish]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.finish === finish.id)));
    document.querySelector("#estimate-result").textContent = `${finish.name} selected. Calculate to update your estimate.`;
}
document.querySelectorAll("[data-finish]").forEach((button) => button.addEventListener("click", () => choose(finishes.find((finish) => finish.id === button.dataset.finish))));
choose(selected);
const prices =
[
    ["Laminate, 8mm", 16, 18], ["LVT, click", 38, 22], ["LVT, glue down", 42, 28],
    ["Engineered oak, 14mm", 52, 24], ["Natural oak, solid", 62, 24],
    ["Smoked oak, engineered", 74, 24], ["Oak herringbone", 88, 38], ["American walnut", 96, 24], ["Wool carpet, 80/20", 34, 14]
];
document.querySelector("#price-rows").innerHTML = prices.map(([name, supply, fit]) => `<tr><td>${name}</td><td data-label="Supply /m²">£${supply}</td><td data-label="Fitting /m²">£${fit}</td><td data-label="Combined /m²">£${supply + fit}</td></tr>`).join("");
document.querySelector("#estimate").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const area = Number(document.querySelector("#area").value);
    const result = document.querySelector("#estimate-result");
    if (!Number.isFinite(area) || area < 1 || area > 1000)
    {
        result.textContent = "Enter an area between 1 and 1,000 m².";
        return;
    }
    const extras = (document.querySelector("#level").checked ? 18 : 0) + (document.querySelector("#uplift").checked ? 8 : 0);
    const total = area * (selected.price + selected.fit + extras);
    result.textContent = `${selected.name}, ${area}m²: ${new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(total)} for supply, fitting and selected extras. Underlay, waste, thresholds and other prep excluded. Indicative, not a quote.`;
});
const projects =
[
    ["Victorian terrace, whole ground floor", "Nottingham", "52m² oak herringbone", "Five days including levelling"],
    ["New-build kitchen and utility", "West Bridgford", "31m² glue-down LVT over underfloor heating", "Two days"],
    ["1930s semi, stairs and landing", "Beeston", "22m² wool carpet with engineered oak on landing", "One and a half days"]
];
function renderProjects()
{
    const search = document.querySelector("#project-search").value.toLowerCase().trim();
    const matches = projects.filter((project) => project.join(" ").toLowerCase().includes(search));
    document.querySelector("#project-grid").innerHTML = matches.map(([title, place, material, time]) => `<article class="project"><div class="project-art"><span>${place.toUpperCase()}</span></div><h3>${title}</h3><p>${material}<br>${time}</p></article>`).join("");
    document.querySelector("#project-empty").hidden = matches.length > 0;
}
document.querySelector("#project-search").addEventListener("input", renderProjects);
renderProjects();
document.querySelector("#survey-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = event.currentTarget.elements;
    const result = document.querySelector("#survey-result");
    const rooms = Number(fields.rooms.value);
    if (fields.name.value.trim().length < 2 || !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(fields.postcode.value.trim()) || fields.phone.value.replace(/\D/g, "").length < 7 || fields.current.value.trim().length < 3)
    {
        result.textContent = "Enter your name, a UK postcode, phone number and current floor.";
        return;
    }
    if (!Number.isInteger(rooms) || rooms < 1 || rooms > 30 || (fields.area.value && (Number(fields.area.value) < 1 || Number(fields.area.value) > 1000)))
    {
        result.textContent = "Choose 1 to 30 whole rooms and, if known, 1 to 1,000m².";
        return;
    }
    result.textContent = `Survey enquiry preview: ${rooms} room${rooms > 1 ? "s" : ""}, ${selected.name} interest. Moisture readings included in the concept survey. Nothing sent; no appointment booked.`;
});
