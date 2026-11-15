const $ = (s) => document.querySelector(s);
const events = [
    ["FRI 12 SEP", "ANSWER CODE", 18],
    ["SAT 13 SEP", "HELENA VOSS", null],
    ["FRI 19 SEP", "KIN + RESIDENTS", 14],
    ["SAT 20 SEP", "NEROLI B2B TESSELLATE", 20],
    ["FRI 26 SEP", "BASEMENT SERIES 04", 12],
    ["SAT 27 SEP", "MARCEL DETTMANN", 26],
    ["FRI 03 OCT", "LOW FREQUENCY COLLECTIVE", 14],
    ["SAT 04 OCT", "ANASTASIA KOVA", 22],
    ["FRI 10 OCT", "RESIDENTS ALL NIGHT", 10],
    ["SAT 11 OCT", "OCTO OCTA", null],
    ["FRI 17 OCT", "SUBSTRATA X NACHTLAB", 16],
    ["SAT 18 OCT", "FIVE YEAR ANNIVERSARY", 30]
];
let selectedEvent = 0;
function render()
{
    const filter = $("#availability").value;
    $("#events").innerHTML = events.map((event, i) => ({ event, i })).filter(({ event }) => filter === "all" || (filter === "sold" ? event[2] === null : event[2] !== null)).map(({ event, i }) => `<article class="event ${event[2] === null ? "sold" : ""}"><small>${event[0]}</small><h3>${event[1]}</h3><button data-ticket="${i}" ${event[2] === null ? "disabled" : ""}>${event[2] === null ? "SOLD OUT" : `€${event[2]} ↗`}</button></article>`).join("");
    document.querySelectorAll("[data-ticket]:not(:disabled)").forEach((button) =>
    {
        button.addEventListener("click", () =>
        {
            selectedEvent = Number(button.dataset.ticket);
            $("#ticket-name").textContent = events[selectedEvent][1];
            $("#ticket-meta").textContent = `${events[selectedEvent][0]} / €${events[selectedEvent][2]} per sample ticket`;
            $("#quantity").value = "1";
            $("#ticket-result").textContent = "";
            $("#ticket").showModal();
        });
    });
}
$("#availability").addEventListener("change", render);
render();
$("#close-ticket").addEventListener("click", () => $("#ticket").close());
$("#calculate").addEventListener("click", () =>
{
    const quantity = Number($("#quantity").value);
    $("#ticket-result").textContent = !Number.isInteger(quantity) || quantity < 1 || quantity > 6 ? "Choose a whole number from 1 to 6." : `Sample total €${quantity * events[selectedEvent][2]} for ${quantity}. No ticket issued or payment taken.`;
});
const tiers = [
    ["Booth, Annex", 250, 6, "Two bottles with mixers · Queue jump · Until 04:00"],
    ["Booth, Main", 450, 8, "Three bottles with mixers · Queue jump · All night · Host"],
    ["Balcony, Main", 700, 12, "Five bottles with mixers · Private entrance · All night · Host"],
    ["Basement Corner", 350, 8, "Three bottles with mixers · Best sound, worst view"]
];
$("#tier-list").innerHTML = tiers.map((tier, i) => `<article class="tier"><small>UP TO ${tier[2]} PEOPLE</small><h3>${tier[0].toUpperCase()}</h3><strong>€${tier[1]}</strong><p>MINIMUM SPEND</p><p>${tier[3]}</p><button data-tier="${i}">SELECT ↗</button></article>`).join("");
$("#table").innerHTML = tiers.map((tier, i) => `<option value="${i}">${tier[0]}</option>`).join("");
$("#night").innerHTML = `<option value="">Choose a sample night</option>` + events.filter((event) => event[2] !== null).map((event) => `<option>${event[0]} / ${event[1]}</option>`).join("");
document.querySelectorAll("[data-tier]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        $("#table").value = button.dataset.tier;
        $("#table-form").scrollIntoView();
    });
});
$("#table-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const tier = tiers[Number($("#table").value)];
    const guests = Number($("#guests").value);
    let message;
    if (!$("#night").value) message = "Choose a sample night. Sold-out nights are excluded.";
    else if (!Number.isInteger(guests) || guests < 1 || guests > tier[2]) message = `Choose 1–${tier[2]} whole guests for ${tier[0]}.`;
    else if (!$("#adult").checked) message = "Acknowledge the 18+ sample door policy and local-only nature.";
    else message = `Local plan: ${tier[0]} / ${guests} guests / €${tier[1]} minimum spend (about €${(tier[1] / guests).toFixed(2)} each) / ${$("#night").value}. No enquiry sent. No table reserved.`;
    $("#table-result").textContent = message;
});
$("#table-form").addEventListener("reset", () => $("#table-result").textContent = "");
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}
$("#menu").addEventListener("click", () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
});
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
