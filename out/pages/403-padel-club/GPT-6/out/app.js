const $ = (s) => document.querySelector(s);
document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () =>
{
    $("#rules-result").textContent = button.dataset.answer === "right" ? "Correct. Serve underarm, below your waist, into the diagonally opposite box." : "Not quite. A padel serve is underarm and below the waist. Try the other answer.";
}));
$("#cost-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const players = Number($("#players").value);
    if (!Number.isInteger(players) || players < 1 || players > 4)
    {
        $("#cost-result").textContent = "Choose 1 to 4 whole players splitting the cost. The game itself is doubles with four players.";
        return;
    }
    const base = Number($("#peak").value);
    const plan = $("#plan").value;
    const free = plan === "smash" && base === 32 && Number($("#credits").value) > 0;
    const total = free ? 0 : plan === "rally" ? base * .9 : base;
    $("#cost-result").textContent = `Sample court total £${total.toFixed(2)}. Split ${players} ways: £${(total / players).toFixed(2)} each.${free ? " Uses one hypothetical off peak credit." : plan === "smash" ? " No eligible free credit applied." : ""} Membership fees are separate. No court reserved or credit actually used.`;
});
$("#cost-form").addEventListener("reset", () => $("#cost-result").textContent = "");
const leagues = [
    ["Monday", "Beginners mix in", "All levels", "19:00", "open"],
    ["Tuesday", "Ladder league", "Intermediate", "19:30", "intermediate"],
    ["Thursday", "Mixed doubles league", "Intermediate and up", "19:30", "intermediate"],
    ["Friday", "Americano and a pint", "All levels", "18:30", "open"]
];
function render()
{
    const filter = $("#level").value;
    const selected = leagues.filter((league) => filter === "all" || league[4] === filter);
    $("#league-list").innerHTML = selected.map((league) => `<article class="league"><span>${league[0]}</span><b>${league[1]}</b><span>${league[2]}</span><span>${league[3]}</span></article>`).join("");
    $("#league-empty").hidden = selected.length !== 0;
}
$("#level").addEventListener("change", render);
render();
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
}
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", String($("#nav").classList.toggle("open"))));
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
