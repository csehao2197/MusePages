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
function filterWines()
{
    const search = document.querySelector("#wine-search").value.trim().toLowerCase();
    const style = document.querySelector("#wine-style").value;
    let count = 0;
    document.querySelectorAll(".pours article").forEach((wine) =>
    {
        wine.hidden = !(wine.textContent.toLowerCase().includes(search) && (style === "all" || wine.dataset.style === style));
        if (!wine.hidden) count++;
    });
    document.querySelector("#wine-count").textContent = `${count} sample pour${count === 1 ? "" : "s"}`;
    document.querySelector("#wine-empty").hidden = count !== 0;
}
document.querySelector("#wine-search").addEventListener("input", filterWines);
document.querySelector("#wine-style").addEventListener("change", filterWines);
let flight = null;
const board = document.querySelector("#board");
const occasion = document.querySelector("#occasion");
const party = document.querySelector("#party");
function updateSelection()
{
    document.querySelector("#selection").textContent = flight ? `${flight.name} flight · £${flight.price} for one tasting flight.` : "No flight selected.";
    const total = (flight ? flight.price : 0) + (board.checked ? 18 : 0);
    document.querySelector("#estimate").textContent = total ? `Illustrative food & flight subtotal: from £${total}. ${occasion.value === "private" ? `Private dining separately from £${Number(party.value || 0) * 45} for your party.` : "Other drinks and service are not included."}` : "No food or flight selected.";
    document.querySelector("#reservation-result").textContent = "Nothing is sent. Dates, menus and tables need confirmation.";
}
document.querySelectorAll("[data-flight]").forEach((button) => button.addEventListener("click", () =>
{
    flight = { name: button.dataset.flight, price: Number(button.dataset.price) };
    document.querySelector("#flight-choice").textContent = `${flight.name} added to your table preview. See your evening below.`;
    updateSelection();
}));
document.querySelector("#clear-flight").addEventListener("click", () =>
{
    flight = null;
    document.querySelector("#flight-choice").textContent = "Choose a flight to add it to your table preview.";
    updateSelection();
});
function updateOccasion()
{
    const isPrivate = occasion.value === "private";
    party.min = isPrivate ? "8" : "1";
    if (Number(party.value) < Number(party.min)) party.value = party.min;
    updateSelection();
}
occasion.addEventListener("change", updateOccasion);
party.addEventListener("input", updateSelection);
board.addEventListener("change", updateSelection);
document.querySelector("#private-enquiry").addEventListener("click", () =>
{
    occasion.value = "private";
    updateOccasion();
    document.querySelector("#reserve").scrollIntoView({ behavior: "smooth" });
    document.querySelector("#date").focus({ preventScroll: true });
});
const date = document.querySelector("#date");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
date.addEventListener("change", () =>
{
    const time = document.querySelector("#time");
    time.replaceChildren(new Option("Choose a time", ""));
    if (!date.value) return;
    const day = new Date(`${date.value}T12:00:00`).getDay();
    const opening = day === 0 ? 14 : day >= 4 ? 15 : 16;
    const last = day === 0 ? 20 : day >= 4 ? 23 : 22;
    for (let hour = opening; hour <= last; hour++)
    {
        time.add(new Option(`${hour}:00`, `${hour}:00`));
    }
    updateSelection();
});
document.querySelector("#reservation").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#reservation-result");
    const name = document.querySelector("#name").value.trim();
    if (!event.currentTarget.checkValidity() || name.length < 2)
    {
        result.textContent = `Please enter a future date, arrival time, valid email and a party of ${occasion.value === "private" ? "8–12" : "1–12"}.`;
        return;
    }
    result.textContent = `${name}, your ${occasion.value === "private" ? "private dining" : "table"} preview for ${party.value} on ${date.value} at ${document.querySelector("#time").value} is ready. Nothing has been sent or reserved.`;
});
