const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const positions = [[13, 83], [25, 72], [40, 63], [47, 49], [65, 36], [70, 24], [84, 13], [14, 29], [31, 16], [20, 52], [62, 77], [78, 59], [87, 40], [45, 28]];
const route = document.querySelector("#route");
positions.forEach(([left, top], index) =>
{
    const hold = document.createElement("div");
    hold.className = "hold";
    hold.style.left = `${left}%`;
    hold.style.top = `${top}%`;
    hold.style.setProperty("--angle", `${index % 2 ? 18 : -20}deg`);
    hold.dataset.route = String(index < 7);
    route.append(hold);
});
function light()
{
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    route.querySelectorAll("[data-route=true]").forEach((hold, index) =>
    {
        if (reduced) hold.classList.add("on");
        else setTimeout(() => hold.classList.add("on"), index * 180);
    });
}
if (matchMedia("(prefers-reduced-motion: reduce)").matches) light();
else
{
    const observer = new IntersectionObserver((entries) =>
    {
        if (entries.some((entry) => entry.isIntersecting))
        {
            light();
            observer.disconnect();
        }
    }, { threshold: .6 });
    observer.observe(route);
}
const grades =
[
    ["Yellow / 1–2", "Big holds and an obvious path. Ask the team for a good first problem."],
    ["Green / 3", "Your first real puzzle. Generally bigger holds, with a little more thought about the next move."],
    ["Blue / 4", "Feet start to matter more. Working out where to stand can change the whole problem."],
    ["Orange / 5", "Expect more than one attempt. A route may reward a different sequence rather than more force."],
    ["Red / 6", "More demanding movement and holds. Individual strengths and styles make a difference."],
    ["Black / 7+", "A serious challenge for experienced climbers. There is no timetable for getting here."]
];
document.querySelectorAll("[data-grade]").forEach((button) => button.addEventListener("click", () =>
{
    const item = grades[Number(button.dataset.grade)];
    document.querySelector("#grade-name").textContent = item[0];
    document.querySelector("#grade-copy").textContent = item[1];
    document.querySelectorAll("[data-grade]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
}));
document.querySelectorAll("[data-course]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#course-status").textContent = `${button.dataset.course} selected for enquiry. No place held. Use the email link to ask about current dates, suitability and spaces.`;
    document.querySelector("#course-email").href = `mailto:hello@crimp.climbing?subject=${encodeURIComponent(`Coaching enquiry: ${button.dataset.course}`)}`;
}));
const type = document.querySelector("#type");
function values()
{
    const adults = Number(document.querySelector("#adults").value);
    const young = Number(document.querySelector("#young").value);
    const shoes = type.value === "first" ? 0 : Number(document.querySelector("#shoes").value);
    return { adults, young, shoes, people: adults + young };
}
function estimate()
{
    const v = values();
    const valid = [v.adults, v.young, v.shoes].every((n) => Number.isInteger(n) && n >= 0) && v.people >= 1 && v.people <= 12 && v.shoes <= v.people;
    const total = type.value === "first" ? v.people * 16 : v.adults * 13 + v.young * 9 + v.shoes * 4;
    document.querySelector("#total").textContent = valid ? `£${total}` : "Check group size";
    document.querySelector("#shoes-label").hidden = type.value === "first";
    document.querySelector("#inclusions").textContent = type.value === "first" ? "Entry, shoe hire and safety brief included for each person." : "Returning entry, plus any selected shoe hire. Confirm participation requirements directly.";
}
document.querySelector("#plan").addEventListener("input", () =>
{
    document.querySelector("#status").textContent = "";
    estimate();
});
type.addEventListener("change", estimate);
document.querySelector("#plan").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const say = (text) => document.querySelector("#status").textContent = text;
    const v = values();
    if (![v.adults, v.young, v.shoes].every((n) => Number.isInteger(n) && n >= 0) || v.people < 1 || v.people > 12) return say("Choose 1–12 people using whole, non-negative counts.");
    if (v.shoes > v.people) return say("Shoe hire pairs cannot exceed the number of people.");
    if (document.querySelector("#under14").checked && v.adults === 0) return say("An adult must accompany under 14s. Confirm supervision arrangements directly.");
    const date = document.querySelector("#date").value;
    if (!date || date < new Date().toLocaleDateString("en-CA")) return say("Choose today or a future visit date.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a cost plan, not a booking or safety waiver.");
    const weekend = [0, 6].includes(new Date(`${date}T12:00:00`).getDay());
    say(`Personal plan: ${v.people} ${v.people === 1 ? "person" : "people"}, ${date}, ${document.querySelector("#total").textContent}. Sample opening ${weekend ? "09:00–20:00" : "07:00–22:00"}. Nothing booked, charged or sent. Confirm current hours and requirements with the gym.`);
});
estimate();
