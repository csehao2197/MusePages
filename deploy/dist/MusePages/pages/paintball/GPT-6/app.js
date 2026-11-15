const $ = (s) => document.querySelector(s);
const packages = { rookie: { name: "Rookie", base: 25, balls: 100 }, regular: { name: "Regular", base: 35, balls: 300 }, assault: { name: "Assault", base: 45, balls: 600 } };
function calculate()
{
    const players = Number($("#players").value);
    const extra = Number($("#extra").value);
    $("#extra-count").textContent = String(extra);
    if (!Number.isInteger(players) || players < 1 || players > 60)
    {
        $("#total").textContent = "—";
        $("#breakdown").textContent = "Enter 1–60 whole players.";
        $("#discount").textContent = "CHECK GROUP SIZE";
        $("#group-note").textContent = "";
        $("#cost-error").textContent = "Choose a whole number from 1 to 60.";
        return null;
    }
    const pkg = packages[$("#package").value];
    const discount = players >= 20 ? .85 : players >= 10 ? .9 : 1;
    const each = Math.round((pkg.base + extra * .04) * discount);
    $("#total").textContent = `£${each * players}`;
    $("#breakdown").textContent = `£${each} per player · ${players} players · ${pkg.balls + extra} paintballs each`;
    $("#discount").textContent = discount === 1 ? "STANDARD SAMPLE PRICE" : `${discount === .85 ? 15 : 10}% GROUP DISCOUNT`;
    $("#group-note").textContent = players < 6 ? "Below six: Saturday open-day enquiry only, not a private group." : "Sample estimate only. No reservation or payment.";
    $("#cost-error").textContent = "";
    return { players, pkg };
}
["players", "extra", "package"].forEach((id) => $(`#${id}`).addEventListener("input", calculate));
$("#minus").addEventListener("click", () =>
{
    $("#players").value = String(Math.max(1, (Number($("#players").value) || 1) - 1));
    calculate();
});
$("#plus").addEventListener("click", () =>
{
    $("#players").value = String(Math.min(60, (Number($("#players").value) || 0) + 1));
    calculate();
});
$("#cost-form").addEventListener("submit", (event) => event.preventDefault());
$("#cost-form").addEventListener("reset", () => setTimeout(calculate, 0));
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    $("#package").value = button.dataset.package;
    calculate();
    $("#calculator").scrollIntoView();
}));
$("#handoff").addEventListener("click", () =>
{
    const result = calculate();
    if (!result) return;
    $("#booking-players").value = String(result.players);
    $("#booking-package").value = $("#package").value;
    $("#booking").scrollIntoView();
    $("#booking-result").textContent = "";
});
calculate();
const zones = [
    ["The Village", "BUILT TERRAIN / FAST GAMES", "Twelve wooden buildings and tight lanes. A compact zone for short games and frequent resets."],
    ["Trench Line", "TRENCH TERRAIN / TEAM OBJECTIVES", "Two hundred metres of dug trench and sandbag positions in the concept plan."],
    ["The Chapel", "STRUCTURED TERRAIN / ATTACK & DEFEND", "A two-storey ruin and bell-tower setting. Access and rules require operator supervision."],
    ["Deep Wood", "NATURAL TERRAIN / COMMUNICATION", "Natural woodland with no built cover. A setting for movement and communication games."],
    ["The Yard", "INDUSTRIAL TERRAIN / OBJECTIVE GAMES", "Shipping containers, pallets and vehicle-wreck props create a varied field."],
    ["The Bridge", "DRY STREAM BED / FINAL GROUP GAME", "A single crossing over a dry stream bed. The proposed full-day finale."]
];
$("#zone-list").innerHTML = zones.map((zone, i) => `<button class="zone-row" data-zone="${i}"><span>0${i + 1}</span><b>${zone[0].toUpperCase()}</b></button>`).join("");
function selectZone(i)
{
    $("#zone-name").textContent = zones[i][0].toUpperCase();
    $("#zone-type").textContent = zones[i][1];
    $("#zone-copy").textContent = `${zones[i][2]} Schematic concept only, not a navigation or safety map.`;
    document.querySelectorAll("[data-zone]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.zone) === i)));
}
document.querySelectorAll("[data-zone]").forEach((button) =>
{
    button.addEventListener("click", () => selectZone(Number(button.dataset.zone)));
    button.addEventListener("mouseenter", () => selectZone(Number(button.dataset.zone)));
    button.addEventListener("focus", () => selectZone(Number(button.dataset.zone)));
});
selectZone(0);
document.querySelectorAll("[data-occasion]").forEach((button) => button.addEventListener("click", () =>
{
    $("#occasion").value = button.dataset.occasion;
    $("#booking").scrollIntoView();
}));
$("#date").min = new Date().toLocaleDateString("en-CA");
$("#booking-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = $("#date").value;
    const players = Number($("#booking-players").value);
    const occasion = $("#occasion").value;
    const ages = $("#ages").value;
    const email = $("#email");
    let message;
    if (!date || date < $("#date").min) message = "Choose today or a future date for the sample enquiry.";
    else if (!Number.isInteger(players) || players < 1 || players > 60) message = "Choose 1–60 whole players.";
    else if (ages === "under") message = "Under 12 is outside this concept’s minimum age. No enquiry can be prepared for this scenario.";
    else if (occasion === "birthday" && players < 8) message = "Birthday concept bookings require at least eight players.";
    else if (occasion === "corporate" && players > 40) message = "The £1,400 private-hire example covers up to forty. A bespoke operator quote is needed.";
    else if (players < 6 && new Date(`${date}T12:00:00`).getDay() !== 6) message = "Below six players: the concept offers Saturday open days only. Choose a Saturday or ask an operator.";
    else if (!email.value.trim() || !email.validity.valid) message = "Enter a valid example email. It stays in this tab.";
    else if (!$("#ack").checked) message = "Acknowledge this is a local plan, not a booking or waiver.";
    else
    {
        message = `Local plan: ${date} / ${players} players / ${packages[$("#booking-package").value].name}${occasion === "corporate" ? " / private hire from £1,400, separate quote" : ` / sample deposit £${players * 10}`}. ${ages !== "adult" ? "Under-18s need the actual operator’s guardian process; juniors need the separate programme. " : ""}No availability checked, enquiry sent, deposit collected or place reserved. Extra-paint choices above are estimates only and must be reconfirmed.`;
    }
    $("#booking-result").textContent = message;
});
$("#booking-form").addEventListener("reset", () => $("#booking-result").textContent = "");
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
