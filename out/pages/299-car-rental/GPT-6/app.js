const $ = (s) => document.querySelector(s);
const fleet = [
    { name: "Economy", model: "Vauxhall Corsa or similar", category: "Small", price: 29, seats: 5, doors: 5, bags: "1 large bag", gear: "Manual" },
    { name: "Compact", model: "Ford Focus or similar", category: "Small", price: 34, seats: 5, doors: 5, bags: "2 large bags", gear: "Manual" },
    { name: "Compact Automatic", model: "Toyota Corolla or similar", category: "Small", price: 42, seats: 5, doors: 5, bags: "2 large bags", gear: "Automatic" },
    { name: "Estate", model: "Skoda Octavia Estate or similar", category: "Estate", price: 48, seats: 5, doors: 5, bags: "4 large bags", gear: "Manual" },
    { name: "SUV", model: "Nissan Qashqai or similar", category: "SUV", price: 55, seats: 5, doors: 5, bags: "3 large bags", gear: "Automatic" },
    { name: "7-Seat", model: "Peugeot 5008 or similar", category: "SUV", price: 72, seats: 7, doors: 5, bags: "3 large bags", gear: "Automatic" },
    { name: "Electric", model: "MG4 or similar", category: "Electric", price: 52, seats: 5, doors: 5, bags: "2 large bags", gear: "Automatic · 280 mi indicative range" },
    { name: "Small Van", model: "Ford Transit Custom or similar", category: "Van", price: 58, seats: 3, doors: null, bags: "6.8m³ load space", gear: "Manual" }
];
let category = "All", trip = null, selected = 0;
const today = new Date().toISOString().slice(0, 10);
$("#from").min = $("#to").min = today;
function readTrip()
{
    const from = $("#from").value, to = $("#to").value, age = Number($("#age").value), days = Math.round((Date.parse(to) - Date.parse(from)) / 86400000);
    if (!from || !to || from < today || !Number.isInteger(days) || days < 1) return { error: "Choose a future pickup and a return after pickup." };
    if (days > 30) return { error: "For more than 30 days, ask about long-term hire below." };
    if (!Number.isInteger(age) || age < 21 || age > 99) return { error: "Drivers must be aged 21–99 in this demo." };
    if ($("#pickup").value !== "Manchester" && new Date(`${from}T12:00:00`).getDay() === 0) return { error: "This pickup branch is closed on Sunday. Choose another date or Manchester." };
    return { from, to, age, days, pickup: $("#pickup").value, drop: $("#return").value, young: age < 25 ? 14 : 0, oneway: $("#pickup").value !== $("#return").value ? 45 : 0 };
}
function live()
{
    const next = readTrip();
    $("#live-estimate").textContent = next.error ? next.error : `${next.days} day${next.days === 1 ? "" : "s"} · Economy from £${next.days * (29 + next.young) + next.oneway} total: base £${next.days * 29}, young-driver £${next.days * next.young}, one-way £${next.oneway}. Standard cover and VAT included; optional extras separate.`;
    trip = null;
    $("#search-status").textContent = "Details changed. Search again to apply these dates.";
    render();
}
function availability(index)
{
    if (!trip) return true;
    return Array.from({ length: trip.days }, (_, i) => new Date(Date.parse(trip.from) + i * 86400000).getUTCDate()).every((day) => (day + index) % 11 !== 0);
}
function render()
{
    const filtered = fleet.map((v, i) => ({ v, i })).filter(({ v, i }) => (category === "All" || v.category === category) && (!trip || trip.age >= 25 || i < 3) && (!$("#available").checked || availability(i)));
    $("#fleet-count").textContent = `${filtered.length} sample classes${trip ? ` for ${trip.days} day(s) from ${trip.pickup}` : " · search dates to check sample availability"}`;
    $("#empty").hidden = filtered.length !== 0;
    $("#vehicles").innerHTML = filtered.map(({ v, i }) =>
    {
        const available = availability(i);
        const badge = !trip ? "SAMPLE CLASS" : !available ? "NO SAMPLE AVAILABILITY" : i === 3 ? "SAMPLE: 2 LEFT" : i === 5 ? "SAMPLE: 1 LEFT" : "SAMPLE AVAILABLE";
        return `<article class="vehicle"><div class="vehicle-image"><img src="hatchback.svg" alt="Representative class illustration, not an exact ${v.model} photograph"><small class="${available ? "" : "unavailable"}">${badge}</small></div><div class="vehicle-body"><h3>${v.name}</h3><p>${v.model}</p><div class="daily">£${v.price}<span> / day base</span></div><div class="specs">${v.seats} seats${v.doors ? ` · ${v.doors} doors` : ""}<br>${v.bags} · ${v.gear}</div><button data-rent="${i}" ${trip && !available ? "disabled" : ""}>${trip ? "Review this hire ↗" : "Choose dates first ↗"}</button></div></article>`;
    }).join("");
    document.querySelectorAll("[data-category]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.category === category));
}
$("#categories").innerHTML = ["All", "Small", "Estate", "SUV", "Van", "Electric"].map((item) => `<button data-category="${item}" aria-pressed="${item === "All"}">${item}</button>`).join("");
$("#categories").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-category]");
    if (!button) return;
    category = button.dataset.category;
    render();
});
$("#available").addEventListener("change", render);
$("#reset").addEventListener("click", () =>
{
    category = "All";
    $("#available").checked = false;
    render();
});
["pickup", "return", "from", "to", "age"].forEach((id) => $(`#${id}`).addEventListener("input", live));
$("#search-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const next = readTrip();
    if (next.error)
    {
        $("#search-status").textContent = next.error;
        trip = null;
        render();
        return;
    }
    trip = next;
    $("#search-status").textContent = "Sample search applied. No live stock checked and nothing reserved.";
    render();
    $("#fleet").scrollIntoView();
});
$("#vehicles").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-rent]");
    if (!button) return;
    if (!trip)
    {
        $("#search-status").textContent = "Choose dates and search before reviewing a hire.";
        $("#search").scrollIntoView();
        return;
    }
    selected = Number(button.dataset.rent);
    $("#rental-title").textContent = `${fleet[selected].name} · ${fleet[selected].model}`;
    $("#rental-trip").textContent = `${trip.pickup} → ${trip.drop} / ${trip.from} to ${trip.to} / ${trip.days} days / driver age ${trip.age}`;
    $("#cover").value = $("#seats").value = $("#drivers").value = "0";
    $("#accept").checked = false;
    totals();
    $("#rental").showModal();
});
function totals()
{
    if (!trip) return null;
    const seats = Number($("#seats").value), drivers = Number($("#drivers").value), cover = Number($("#cover").value);
    $("#rental-status").textContent = "";
    if (!Number.isInteger(seats) || seats < 0 || seats > 3 || !Number.isInteger(drivers) || drivers < 0 || drivers > 3)
    {
        $("#hire-total").textContent = "Check extras";
        $("#rental-status").textContent = "Choose 0–3 child seats and 0–3 extra drivers.";
        return null;
    }
    const base = fleet[selected].price * trip.days, coverCost = cover * trip.days, childCost = seats * 6 * trip.days, driverCost = drivers * 8 * trip.days, young = trip.young * trip.days;
    const rows = [["Vehicle", `${trip.days} × £${fleet[selected].price}`, base], ["Cover upgrade", `${trip.days} × £${cover}`, coverCost], ["Child seats", `${seats} × £6 × ${trip.days}`, childCost], ["Extra drivers", `${drivers} × £8 × ${trip.days}`, driverCost], ["Young driver", `${trip.days} × £${trip.young}`, young], ["One-way relocation", "per hire", trip.oneway]];
    $("#itemisation").innerHTML = rows.map(([name, desc, cost]) => `<p><span>${name} <small>(${desc})</small></span><b>£${cost}</b></p>`).join("");
    $("#hold").textContent = cover === 0 ? "£1,200" : cover === 11 ? "£350" : "£0";
    const total = base + coverCost + childCost + driverCost + young + trip.oneway;
    $("#hire-total").textContent = `£${total}`;
    return total;
}
["cover", "seats", "drivers"].forEach((id) => $(`#${id}`).addEventListener("input", totals));
$("#rental-form").addEventListener("input", () => $("#rental-status").textContent = "");
$("#rental-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const total = totals();
    if (total === null) return;
    $("#rental-status").textContent = $("#name").value.trim().length < 2 ? "Enter the main driver's name." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim()) ? "Enter a valid email address." : !$("#accept").checked ? "Acknowledge this is a demo estimate." : `Draft reviewed: ${fleet[selected].name}, ${trip.days} days, £${total} hire + ${$("#hold").textContent} separate card hold. Nothing booked, charged or sent. Confirm availability and terms with the branch.`;
});
document.querySelectorAll("[data-branch]").forEach((button) => button.addEventListener("click", () =>
{
    $("#pickup").value = $("#return").value = button.dataset.branch;
    live();
    $("#search").scrollIntoView();
}));
function longterm()
{
    const months = Number($("#months").value), price = { 1: 680, 2: 1290, 3: 1850, 6: 3400 }[months];
    $("#long-price").textContent = `£${price.toLocaleString("en-GB")}`;
    $("#long-copy").textContent = `${months} month${months === 1 ? "" : "s"} total · compact automatic · servicing, tyres and breakdown included in the sample offer.`;
    $("#long-link").href = `mailto:hire@roadline.example?subject=${encodeURIComponent(`${months}-month compact automatic enquiry`)}&body=${encodeURIComponent(`I would like to discuss the illustrative £${price} total offer. Please confirm current availability, cover and full terms. Nothing booked on the demo website.`)}`;
}
$("#months").addEventListener("change", longterm);
$("#terms").addEventListener("click", () => $("#terms-dialog").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(`#${button.dataset.close}`).close()));
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
render();
longterm();
