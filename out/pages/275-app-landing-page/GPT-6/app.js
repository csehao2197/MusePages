
const $ = (s) => document.querySelector(s);
$("#menu").onclick = () =>
{
    const open = $("#navigation").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
};
document.querySelectorAll("nav a").forEach((a) => a.onclick = () =>
{
    $("#navigation").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
document.querySelectorAll("[data-book]").forEach((b) => b.onclick = () =>
{
    $("#booking-result").textContent = "";
    $("#booking").showModal();
});
$(".close").onclick = () => $("#booking").close();
$("#booking-form").onsubmit = (e) =>
{
    e.preventDefault();
    const form = new FormData(e.target);
    $("#booking-result").textContent = "Preview ready for " + form.get("name") + ": " + form.get("service") + ". Nothing has been sent or booked.";
};

const sounds = [["Rain on a tent",45],["Slow ocean",60],["Night forest",45],["Distant thunder",30],["Cabin fire",60],["Snowfall",45],["Old fan",90],["Train at night",60]];
let remaining = 1800;
let interval;
function clock()
{
    $("#clock").textContent = String(Math.floor(remaining / 60)).padStart(2, "0") + ":" + String(remaining % 60).padStart(2, "0");
}
function pause()
{
    clearInterval(interval);
    interval = undefined;
    $("#play").textContent = "Start";
    $("#play").setAttribute("aria-pressed", "false");
}
$("#play").onclick = () =>
{
    if (interval)
    {
        pause();
        $("#player-state").textContent = "Preview paused · no audio";
        return;
    }
    if (!remaining) remaining = Number($("#timer").value) * 60;
    $("#play").textContent = "Pause";
    $("#play").setAttribute("aria-pressed", "true");
    $("#player-state").textContent = "Silent timer running · no audio";
    interval = setInterval(() =>
    {
        remaining--;
        clock();
        if (remaining <= 0)
        {
            pause();
            $("#player-state").textContent = "Preview complete";
        }
    }, 1000);
};
function reset()
{
    pause();
    remaining = Number($("#timer").value) * 60;
    clock();
    $("#player-state").textContent = "Silent interface preview";
}
$("#restart").onclick = reset;
$("#timer").onchange = reset;
document.querySelectorAll("[data-sound]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-sound]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#now-playing").textContent = sounds[Number(b.dataset.sound)][0];
});
document.querySelectorAll("[data-billing]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-billing]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#price").innerHTML = b.dataset.billing === "yearly" ? "$29<small> / year</small>" : "$4.99<small> / month</small>";
});
