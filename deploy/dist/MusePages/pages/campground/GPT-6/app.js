const $ = (s) => document.querySelector(s);
const pitches = [
    { name: "Tent pitch", price: 24, sleeps: 6, min: 1, note: "Grass, no hookup, fire pit allowed. Car beside the tent on most pitches." },
    { name: "Electric pitch", price: 34, sleeps: 6, min: 1, note: "16A hookup, hardstanding edge, fire pit allowed." },
    { name: "Campervan pitch", price: 38, sleeps: 4, min: 1, note: "Level hardstanding, 16A hookup, grey waste point on the field." },
    { name: "Bell tent", price: 95, sleeps: 4, min: 2, note: "Furnished. Beds made up, wood burner, rugs and lanterns. Two-night minimum." },
    { name: "Cabin", price: 140, sleeps: 5, min: 2, note: "Insulated, kitchenette, private shower and loo, veranda. Two-night minimum." }
];
let selected = 0;
const now = new Date();
let month = new Date(now.getFullYear() + (now.getMonth() > 9 ? 1 : 0), now.getMonth() > 9 ? 2 : Math.max(2, now.getMonth()), 1);
const today = now.toISOString().slice(0, 10);
const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
function inSeason(value)
{
    const md = value.slice(5);
    return md >= "03-14" && md <= "10-25";
}
function free(value)
{
    return value >= today && inSeason(value) && (Number(value.slice(-2)) + selected * 3) % 9 !== 0;
}
$("#pitch-choices").innerHTML = pitches.map((p, i) => `<button data-pitch="${i}" aria-pressed="${i === 0}"><b>${p.name}</b><small>From £${p.price} / night<br>Up to ${p.sleeps} people</small></button>`).join("");
function calendar()
{
    $("#month").textContent = month.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    const first = (month.getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    $("#calendar").innerHTML = '<span></span>'.repeat(first) + Array.from({ length: days }, (_, i) =>
    {
        const value = iso(new Date(month.getFullYear(), month.getMonth(), i + 1));
        return `<button data-date="${value}" ${free(value) ? "" : "disabled"} aria-label="${value}, ${free(value) ? "sample available" : "unavailable"}" aria-pressed="${$("#arrive").value === value}">${i + 1}</button>`;
    }).join("");
}
function choose()
{
    const p = pitches[selected];
    $("#pitch-kicker").textContent = `YOUR PATCH / ${p.min} NIGHT MINIMUM`;
    $("#pitch-name").textContent = $("#booking-type").textContent = p.name;
    $("#pitch-description").textContent = p.note;
    $("#pitch-price").textContent = `£${p.price} / night`;
    $("#pitch-capacity").textContent = `Up to ${p.sleeps} people · one pitch`;
    $("#people").max = p.sleeps;
    $("#fire").disabled = selected !== 0 && selected !== 1;
    if ($("#fire").disabled) $("#fire").checked = false;
    $("#status").textContent = "";
    document.querySelectorAll("[data-pitch]").forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.pitch) === selected));
    calendar();
}
$("#pitch-choices").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-pitch]");
    if (!button) return;
    selected = Number(button.dataset.pitch);
    choose();
});
$("#prev").addEventListener("click", () =>
{
    month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    calendar();
});
$("#next").addEventListener("click", () =>
{
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    calendar();
});
$("#calendar").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-date]");
    if (!button) return;
    $("#arrive").value = button.dataset.date;
    $("#status").textContent = "Arrival selected. Choose your departure below.";
    calendar();
});
$("#arrive").min = $("#depart").min = today;
$("#stay").addEventListener("input", () => $("#status").textContent = "");
$("#stay").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const start = $("#arrive").value;
    const end = $("#depart").value;
    const nights = Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
    const p = pitches[selected];
    const people = Number($("#people").value);
    const dogs = Number($("#dogs").value);
    let message;
    if (!start || !end || start < today || nights <= 0) message = "Choose a future arrival and a departure after arrival.";
    else if (!inSeason(start) || end > `${end.slice(0, 4)}-10-26` || start.slice(0, 4) !== end.slice(0, 4)) message = "Our season runs 14 March to final departure 26 October.";
    else if (nights < p.min) message = `${p.name} has a ${p.min}-night minimum.`;
    else if (nights > 21) message = "For stays over 21 nights, please contact reception.";
    else if (!Number.isInteger(people) || people < 1 || people > p.sleeps) message = `Choose 1–${p.sleeps} people for this pitch.`;
    else if (!Number.isInteger(dogs) || dogs < 0 || dogs > 2) message = "Choose zero, one or two dogs.";
    else
    {
        const unavailable = Array.from({ length: nights }, (_, i) => new Date(Date.parse(start) + i * 86400000).toISOString().slice(0, 10)).find((date) => !free(date));
        if (unavailable) message = `No sample availability for ${p.name} on ${unavailable}. Try another date or pitch.`;
        else message = `Demo estimate: ${nights} nights × £${p.price} + dogs £${dogs * 4} + fire pit £${$("#fire").checked ? 8 : 0} = £${nights * p.price + dogs * 4 + ($("#fire").checked ? 8 : 0)}. Extras excluded. Nothing booked or charged.`;
    }
    $("#status").textContent = message;
});
const zones = [
    ["The Meadow", "Open grass for groups and families. Closest to the play area and the loudest field, honestly."],
    ["The Woodland", "Twelve shaded, sheltered pitches among pines. Quieter, with slightly tougher ground for pegs."],
    ["The Van Field", "Fourteen level hardstanding pitches with hookups and a five-metre gap between vans."],
    ["Glamping Row", "Four bell tents and two cabins along the top edge, with the best valley views."],
    ["Facilities Block", "Central to everything. No pitch is more than 140 metres from a hot shower."]
];
$("#zones").innerHTML = zones.map((zone, i) => `<button data-zone="${i}" aria-pressed="${i === 0}">${i + 1}. ${zone[0]}</button>`).join("");
$("#zone-copy").textContent = zones[0][1];
$("#zones").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-zone]");
    if (!button) return;
    $("#zone-copy").textContent = zones[Number(button.dataset.zone)][1];
    document.querySelectorAll("[data-zone]").forEach((item) => item.setAttribute("aria-pressed", item === button));
});
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
choose();
