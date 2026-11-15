const prices = [["Terrace or flat", 2, 60, "40 MIN"], ["Semi detached", 2, 75, "50 MIN"], ["Detached", 2, 95, "1 HR"], ["Detached, large", 3, 135, "1 HR 30"], ["Bungalow", 1, 55, "35 MIN"]];
document.querySelector("#price-rows").innerHTML = prices.map(([property, storeys, price, time]) => `<div class="price-row"><strong>${property}</strong><span>${storeys}</span><b>£${price}</b><span>${time}</span></div>`).join("");
const services = [["All gutter runs vacuumed", "included"], ["Downpipes checked and cleared", "included"], ["Hopper heads emptied", "included"], ["Debris bagged and taken away", "included"], ["Photographs of every run", "included"], ["A note on cracked joints or loose brackets", "included"], ["Fascia and soffit wash, from £45", "extra"], ["Conservatory roof clean, from £40", "extra"], ["Low roof moss removal, quoted", "extra"], ["Broken bracket replacement, £15 plus part", "extra"]];
function filterServices(filter)
{
    const list = services.filter((item) => filter === "all" || item[1] === filter);
    document.querySelector("#service-list").innerHTML = list.map(([name, type]) => `<div class="service"><div>${name}</div><span>${type}</span></div>`).join("");
    document.querySelector("#service-count").textContent = `${list.length} ${filter === "all" ? "service" : filter} items shown.`;
    document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => filterServices(button.dataset.filter)));
filterServices("all");
const towns = ["Worcester", "Malvern", "Droitwich", "Pershore", "Evesham"];
function showTowns()
{
    const query = document.querySelector("#town").value.trim().toLowerCase();
    const matches = towns.filter((town) => town.toLowerCase().includes(query));
    const list = document.querySelector("#town-list");
    list.replaceChildren(...matches.map((town) =>
    {
        const li = document.createElement("li");
        li.textContent = town;
        return li;
    }));
    document.querySelector("#town-status").textContent = matches.length ? `${matches.length} listed ${matches.length === 1 ? "town" : "towns"}. Confirm exact address coverage by phone.` : "No listed town matches. Call before planning a visit outside our patch.";
}
document.querySelector("#town").addEventListener("input", showTowns);
document.querySelector("#reset-area").addEventListener("click", () =>
{
    document.querySelector("#town").value = "";
    showTowns();
});
showTowns();
const form = document.querySelector("#enquiry");
const link = document.querySelector("#email-draft");
form.addEventListener("input", () =>
{
    link.hidden = true;
    document.querySelector("#enquiry-result").textContent = "Details changed. Prepare a fresh draft.";
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const town = form.elements.town.value.trim();
    const result = document.querySelector("#enquiry-result");
    link.hidden = true;
    if (town.length < 2)
    {
        result.textContent = "Enter your town so the service area can be checked.";
        return;
    }
    if (form.elements.notes.value.trim().length < 8)
    {
        result.textContent = "Add a short access note, at least 8 characters.";
        return;
    }
    const body = `${form.elements.property.value}, ${form.elements.storeys.value} storeys.\nTown: ${town}\nAccess: ${form.elements.notes.value.trim()}\nPlease confirm scope, access and availability.`;
    link.href = `mailto:book@fallsandsons.co.uk?subject=Gutter%20clear%20enquiry&body=${encodeURIComponent(body)}`;
    link.hidden = false;
    result.textContent = "Draft prepared in this browser. Open your email app to review and send it yourself. No message sent and no visit booked.";
});
