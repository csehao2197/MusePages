const $ = (s) => document.querySelector(s);
let time = 16;
const selected = new Set();
const date = $("#date");
date.min = new Date().toISOString().slice(0, 10);
date.value = date.min;
const times = [16, 17, 18, 19, 20, 21, 22];
$(".times").innerHTML = times.map((hour) => `<button data-time="${hour}" aria-pressed="${hour === time}">${hour - 12}:00 PM</button>`).join("");
function rate()
{
    const day = new Date(`${date.value}T12:00:00`).getDay();
    return day >= 1 && day <= 4 && time < 17 ? 24 : 38;
}
function update()
{
    const people = Number($("#people").value);
    const total = selected.size * rate() + (selected.size && $("#shoes").checked ? people * 3 : 0);
    $("#total").textContent = `$${total}`;
    $("#selection").textContent = selected.size ? `${selected.size} lane(s) · 1 hour · $${rate()}/lane` : "Pick a lane to get rolling";
    document.querySelectorAll("[data-lane]").forEach((button) => button.setAttribute("aria-pressed", selected.has(Number(button.dataset.lane))));
    $("#status").textContent = "";
}
function render()
{
    selected.clear();
    const seed = Number(date.value.replaceAll("-", "")) + time;
    $("#lanes").innerHTML = Array.from({ length: 12 }, (_, i) =>
    {
        const lane = i + 1;
        const taken = (lane + seed) % 4 === 0;
        return `<button data-lane="${lane}" ${taken ? "disabled" : ""} aria-label="Lane ${lane}, ${taken ? "taken" : "free"}" aria-pressed="false">${String(lane).padStart(2, "0")}</button>`;
    }).join("");
    update();
}
$(".times").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-time]");
    if (!button) return;
    time = Number(button.dataset.time);
    document.querySelectorAll("[data-time]").forEach((item) => item.setAttribute("aria-pressed", item === button));
    render();
});
$("#lanes").addEventListener("click", (event) =>
{
    const lane = Number(event.target.closest("[data-lane]")?.dataset.lane);
    if (!lane) return;
    selected.has(lane) ? selected.delete(lane) : selected.add(lane);
    update();
});
date.addEventListener("change", render);
$("#people").addEventListener("input", update);
$("#shoes").addEventListener("change", update);
$("#reserve").addEventListener("click", () =>
{
    const people = Number($("#people").value);
    let message;
    if (!date.value || date.value < date.min) message = "Choose today or a future date.";
    else if (!selected.size) message = "Select at least one free lane.";
    else if (!Number.isInteger(people) || people < 1 || people > selected.size * 6) message = `Choose 1–${selected.size * 6} bowlers for your selected lanes.`;
    else if (selected.size >= 6) message = "For six lanes or more, contact the alley for a group rate. Nothing reserved.";
    else message = `Demo plan: lanes ${[...selected].sort((a, b) => a - b).join(", ")} · ${date.value} at ${time - 12}:00 PM · ${$("#total").textContent}. Nothing reserved or charged.`;
    $("#status").textContent = message;
});
let party;
function partyEstimate()
{
    if (!party) return;
    const count = Number($("#children").value);
    $("#party-total").textContent = Number.isInteger(count) && count >= party.min ? `$${count * party.price} estimated for ${count} children. Browser-only enquiry; contact us to arrange.` : `This package needs at least ${party.min} children.`;
}
document.querySelectorAll("[data-party]").forEach((button) => button.addEventListener("click", () =>
{
    party = { price: Number(button.dataset.party), min: Number(button.dataset.min) };
    document.querySelectorAll("[data-party]").forEach((item) => item.setAttribute("aria-pressed", item === button));
    partyEstimate();
}));
$("#children").addEventListener("input", partyEstimate);
$("#menu").addEventListener("click", () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
});
$("#nav").addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        $("#nav").classList.remove("open");
        $("#menu").setAttribute("aria-expanded", "false");
    }
});
render();
