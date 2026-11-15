const services = [
    ["Gel Manicure", "Classic gel, carefully shaped and filed. Long-wear colour.", 60, 38],
    ["Nail Art", "Hand-painted details, from a single accent to a full set.", 75, 55],
    ["BIAB / Builder Gel", "Flexible support and a natural-looking finish.", 75, 52],
    ["Acrylic Extensions", "Full sets and infills, sculpted or tip-overlay.", 90, 65],
    ["Gel Polish Soak-Off", "Careful removal with a mini treatment.", 30, 20],
    ["Spa Pedicure", "Soak, exfoliation, cuticle care and gel polish.", 75, 50],
    ["Chrome & Foil", "Mirror, holographic or foil finish. Add-on only.", 15, 12],
    ["Nail Treatment", "A tailored strengthening base and care discussion.", 45, 28]
];
const $ = (s) => document.querySelector(s);
$("#service-list").innerHTML = services.map((s, i) => `<article class="service-row"><small>${String(i + 1).padStart(2, "0")}</small><h3>${s[0]}</h3><p>${s[1]}</p><button data-service="${i}">${i === 6 ? "+" : ""}${s[2]} min<br>from £${s[3]} ↗</button></article>`).join("");
$("#service").innerHTML = services.map((s, i) => `<option value="${i}">${s[0]}</option>`).join("");
document.querySelectorAll("[data-service]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        $("#service").value = button.dataset.service;
        $("#booking").scrollIntoView();
    });
});
document.querySelectorAll("[data-tier]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        $("#tier").value = button.dataset.tier;
        $("#booking").scrollIntoView();
    });
});
const studies = ["Oval nude BIAB", "Rose chrome", "Terracotta swirls", "Plum square", "Fine gold French", "Botanical green", "Deep red", "Cloud blue", "Tools of the trade", "Milky star", "Tortoiseshell", "Sculpted petals"];
const tones = ["#ead8cb", "#e7b9c3", "#d9ab91", "#a48b9b", "#f0e5c4", "#c5d0ba", "#c89b99", "#bdccd6", "#d4c3a9", "#eee8e0", "#caa37f", "#e6d5cf"];
$("#gallery-grid").innerHTML = studies.map((name, i) => `<button class="nail-item" data-study="${i}" style="--tone:${tones[i]}"><img src="nails.svg" alt="${name} illustrative colour study" style="filter:hue-rotate(${i * 19}deg)"><span>${name} ↗</span></button>`).join("");
document.querySelectorAll("[data-study]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const i = Number(button.dataset.study);
        $("#study-title").textContent = studies[i];
        $("#study-art").innerHTML = `<img src="nails.svg" alt="Original illustrative nail composition" style="filter:hue-rotate(${i * 19}deg)">`;
        $("#study-copy").textContent = "An original vector colour study, not a photograph of a finished client set. Use this palette as a starting point for an artist consultation.";
        $("#study").showModal();
    });
});
$("#close-study").addEventListener("click", () => $("#study").close());
const quotes = [
    ["“The only place where I never feel rushed. Exactly what I asked for, every time.”", "Isabelle N. · Sample review"],
    ["“My wedding nails were a beautiful little detail I’ll always remember.”", "Priya K. · Sample review"],
    ["“A thoughtful conversation about my nails, and a plan that felt personal.”", "Rachel O. · Sample review"],
    ["“Quiet, considered and a complete change of pace from the city outside.”", "Sophie W. · Sample review"]
];
let quote = 0;
function showQuote()
{
    $("#quote").textContent = quotes[quote][0];
    $("#author").textContent = quotes[quote][1];
    $("#quote-count").textContent = `${quote + 1} / 4`;
}
$("#prev").addEventListener("click", () =>
{
    quote = (quote + 3) % 4;
    showQuote();
});
$("#next").addEventListener("click", () =>
{
    quote = (quote + 1) % 4;
    showQuote();
});
showQuote();
$("#date").min = new Date().toLocaleDateString("en-CA");
$("#planner").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = $("#date").value;
    if (!date || date < $("#date").min)
    {
        $("#result").textContent = "Choose today or a future date for your example visit.";
        return;
    }
    if (new Date(`${date}T12:00:00`).getDay() === 0)
    {
        $("#result").textContent = "The sample studio is closed on Sundays. Choose Monday–Saturday.";
        return;
    }
    const service = services[Number($("#service").value)];
    if ($("#service").value === "6")
    {
        $("#result").textContent = "Chrome & Foil is an add-on. Choose a main service and discuss this finish with an artist.";
        return;
    }
    const tier = $("#tier").value;
    const price = tier === "Artist" ? "price on consultation" : `from £${service[3] + (tier === "Signature" ? 10 : 0)}`;
    $("#result").textContent = `Example: ${service[0]} · ${service[2]} min · ${tier} · ${price} · ${$("#artist").value} · ${date}. No booking made; no availability checked.`;
});
$("#planner").addEventListener("reset", () => $("#result").textContent = "");
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
}
$("#menu").addEventListener("click", () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
});
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
