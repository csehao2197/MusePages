const $ = (s) => document.querySelector(s);
document.querySelectorAll("[data-programme]").forEach((button) => button.addEventListener("click", () =>
{
    $("#programme").value = button.dataset.programme;
    $("#intro").scrollIntoView();
    $("#intro-result").textContent = "";
}));
$("#fit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const goal = $("#goal").value;
    let message;
    if (!goal) message = "Choose a starting point to compare the sample programmes.";
    else if (goal === "ongoing" && !$("#graduate").checked) message = "Ongoing Coaching is intended for Transform graduates. Explore Kickstart or Transform first.";
    else if (goal === "start") message = "Kickstart: 4 weeks, from £320. A shorter introduction, not a clinical recommendation.";
    else if (goal === "depth") message = "Transform: 12 weeks, from £840. Illustrative instalments: 3 × £280. Not a payment agreement or clinical recommendation.";
    else message = "Ongoing Coaching: from £180 per month, 2 sessions. Graduate scenario only; no enrolment or recurring charge.";
    $("#fit-result").textContent = message;
});
$("#fit-form").addEventListener("reset", () => $("#fit-result").textContent = "");
$("#intro-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    $("#intro-result").textContent = !$("#focus").value ? "Choose a call focus. No health details are needed." : `Local 30-minute agenda: ${$("#programme").value} / ${$("#focus").value}. Discuss scope, practical fit and next steps with a verified professional. No call booked, message sent or health data collected.`;
});
$("#intro-form").addEventListener("reset", () => $("#intro-result").textContent = "");
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
