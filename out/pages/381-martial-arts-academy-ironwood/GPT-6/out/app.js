const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const schedule =
{
    Mon: [["6:00 AM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["12:00 PM", "Boxing Technique", "Coach Duval", "All Levels", "Boxing", 15, 99], ["5:00 PM", "Kids BJJ (5–9)", "Coach Marsh", "Fundamentals", "Kids", 5, 9], ["6:15 PM", "Muay Thai", "Coach Suwan", "All Levels", "Muay Thai", 15, 99], ["7:30 PM", "BJJ Advanced + Open Mat", "Coach Reyes", "Advanced", "BJJ", 15, 99]],
    Tue: [["6:00 AM", "Boxing Fundamentals", "Coach Duval", "Fundamentals", "Boxing", 15, 99], ["5:00 PM", "Kids BJJ (10–14)", "Coach Marsh", "Fundamentals", "Kids", 10, 14], ["6:15 PM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["7:30 PM", "Muay Thai Technique", "Coach Suwan", "All Levels", "Muay Thai", 15, 99]],
    Wed: [["6:00 AM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["12:00 PM", "Boxing Technique", "Coach Duval", "All Levels", "Boxing", 15, 99], ["5:00 PM", "Kids BJJ (5–9)", "Coach Marsh", "Fundamentals", "Kids", 5, 9], ["6:15 PM", "Muay Thai", "Coach Suwan", "All Levels", "Muay Thai", 15, 99]],
    Thu: [["6:00 AM", "Boxing Fundamentals", "Coach Duval", "Fundamentals", "Boxing", 15, 99], ["5:00 PM", "Kids BJJ (10–14)", "Coach Marsh", "Fundamentals", "Kids", 10, 14], ["6:15 PM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["7:30 PM", "Muay Thai Technique", "Coach Suwan", "All Levels", "Muay Thai", 15, 99]],
    Fri: [["6:00 AM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["12:00 PM", "Boxing Technique", "Coach Duval", "All Levels", "Boxing", 15, 99], ["6:15 PM", "Muay Thai", "Coach Suwan", "All Levels", "Muay Thai", 15, 99]],
    Sat: [["8:30 AM", "BJJ Fundamentals", "Coach Reyes", "Fundamentals", "BJJ", 15, 99], ["10:00 AM", "Kids BJJ (5–9)", "Coach Marsh", "Fundamentals", "Kids", 5, 9], ["11:00 AM", "Kids BJJ (10–14)", "Coach Marsh", "Fundamentals", "Kids", 10, 14], ["12:00 PM", "BJJ Advanced + Open Mat", "Coach Reyes", "Advanced", "BJJ", 15, 99]],
    Sun: []
};
const allClasses = Object.entries(schedule).flatMap(([day, classes]) => classes.map((item, index) => ({ day, item, id: `${day}-${index}` })));
let day = "Mon";
document.querySelector(".days").innerHTML = days.map((name) => `<button data-day="${name}" aria-pressed="${name === day}">${name}</button>`).join("");
function renderSchedule()
{
    const discipline = document.querySelector("#schedule-discipline").value;
    const beginner = document.querySelector("#beginner").checked;
    const matches = allClasses.filter((entry) => entry.day === day && (discipline === "All disciplines" || entry.item[4] === discipline) && (!beginner || entry.item[3] !== "Advanced"));
    document.querySelector("#schedule-list").innerHTML = matches.map(({ item, id }) => `<article class="class-row"><time>${item[0]}</time><h3>${item[1]}</h3><span>${item[2]}</span><small>${item[3]}</small><button data-class="${id}" ${item[3] === "Advanced" ? "disabled" : ""}>${item[3] === "Advanced" ? "Not a trial" : "Plan this class ↗"}</button></article>`).join("");
    document.querySelector("#schedule-empty").hidden = matches.length > 0;
    if (day === "Sun") document.querySelector("#schedule-empty").textContent = "Sunday is closed in the sample schedule. Choose Monday to Saturday.";
    else document.querySelector("#schedule-empty").textContent = "No sample classes match these filters. Try another day or discipline.";
}
renderSchedule();
document.querySelectorAll("[data-day]").forEach((button) => button.addEventListener("click", () =>
{
    day = button.dataset.day;
    document.querySelectorAll("[data-day]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderSchedule();
}));
document.querySelector("#schedule-discipline").addEventListener("change", renderSchedule);
document.querySelector("#beginner").addEventListener("change", renderSchedule);
const form = document.querySelector("#trial-form");
function renderTrial(preferred)
{
    const ageText = form.elements.age.value;
    const age = Number(ageText);
    const discipline = document.querySelector("#trial-discipline").value;
    const matches = allClasses.filter(({ item }) => item[4] === discipline && item[3] !== "Advanced" && (!ageText || age >= item[5] && age <= item[6]));
    const select = document.querySelector("#trial-class");
    select.innerHTML = matches.length ? `<option value="">Choose a sample class</option>${matches.map(({ day: name, item, id }) => `<option value="${id}">${name} ${item[0]} / ${item[1]}</option>`).join("")}` : '<option value="">No age-appropriate sample classes</option>';
    if (preferred && matches.some((item) => item.id === preferred)) select.value = preferred;
}
renderTrial();
document.querySelector("#trial-discipline").addEventListener("change", () =>
{
    renderTrial();
    document.querySelector("#trial-result").textContent = "Choose an age-appropriate class. No reservation is made.";
});
document.querySelector("#age").addEventListener("input", () => renderTrial());
document.querySelector("#schedule-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-class]");
    if (!button || button.disabled) return;
    const entry = allClasses.find((item) => item.id === button.dataset.class);
    document.querySelector("#trial-discipline").value = entry.item[4];
    renderTrial(entry.id);
    document.querySelector("#trial-result").textContent = form.elements.class.value ? "Sample class carried into your local plan. Add the student age to confirm the age group." : "This class does not match the entered age. Choose an age-appropriate class.";
    document.querySelector("#trial").scrollIntoView();
});
document.querySelectorAll("[data-discipline]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#schedule-discipline").value = button.dataset.discipline;
    document.querySelector("#beginner").checked = true;
    renderSchedule();
    document.querySelector("#schedule").scrollIntoView();
}));
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#trial-plan").value = button.dataset.plan;
    document.querySelector("#trial").scrollIntoView();
}));
const beltCopy =
[
    "White / Day one: curiosity, regular practice and learning how to participate. No prior training assumed.",
    "Blue / Around 12 months in the illustrative brief: a foundation built over time. Promotion requires a real coach's individual assessment.",
    "Purple / Around 30 months in the illustrative brief: deeper understanding and consistent practice. This is not a guaranteed timeline.",
    "Brown / Around 54 months in the illustrative brief: continued refinement. Experience varies with frequency, age and individual circumstances.",
    "Black / Around 84 months in the illustrative brief: a long-term learning milestone, not an end point or a calendar promise."
];
function selectBelt(index)
{
    document.querySelector("#belt-detail").textContent = beltCopy[index];
    document.querySelectorAll("[data-belt]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
}
selectBelt(0);
document.querySelectorAll("[data-belt]").forEach((button) => button.addEventListener("click", () => selectBelt(Number(button.dataset.belt))));
const coaches =
[
    ["MARCO REYES", "A fictional BJJ head-coach persona. The imagined approach uses patient explanation and structured fundamentals. Ranks, certification and competition-corner counts from the brief have not been verified."],
    ["SUWAN PRASERT", "A fictional Muay Thai coach persona. The imagined approach balances technical focus with a welcoming first class. Professional fight records, WMC certification and lineage are not verified or claimed."],
    ["ALICIA DUVAL", "A fictional boxing coach persona. The imagined approach prioritises movement, defence and deliberate progression. USA Boxing certification, medals and awards in the brief are unverified and not claimed."]
];
document.querySelectorAll("[data-coach]").forEach((button) => button.addEventListener("click", () =>
{
    const coach = coaches[Number(button.dataset.coach)];
    document.querySelector("#coach-name").textContent = coach[0];
    document.querySelector("#coach-copy").textContent = coach[1];
    document.querySelector("#coach-dialog").showModal();
}));
document.querySelector("#close-coach").addEventListener("click", () => document.querySelector("#coach-dialog").close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const output = document.querySelector("#trial-result");
    const age = Number(data.get("age"));
    if (!String(data.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")))
    {
        output.textContent = "Enter a contact name and a valid example email.";
        return;
    }
    if (!Number.isInteger(age) || age < 5 || age > 99)
    {
        output.textContent = "Enter a whole-number student age from 5 to 99 for this sample planner.";
        return;
    }
    const entry = allClasses.find((item) => item.id === data.get("class"));
    if (!entry || entry.item[4] !== data.get("discipline") || entry.item[3] === "Advanced" || age < entry.item[5] || age > entry.item[6])
    {
        output.textContent = "Choose an age-appropriate beginner-suitable sample class. Kids classes cover ages 5–14; other sample classes start at 15.";
        return;
    }
    if (age < 18 && !data.get("guardian"))
    {
        output.textContent = "A parent or guardian must handle the plan for a student under 18.";
        return;
    }
    if (!data.get("ack"))
    {
        output.textContent = "Confirm that this is a local plan, not a reservation.";
        return;
    }
    output.textContent = `Local plan: ${entry.day} ${entry.item[0]} / ${entry.item[1]} / ${data.get("plan")}. Arrive ten minutes early in the proposed welcome process and confirm gear with the real academy. No enquiry sent, place held or membership purchased.`;
});
form.addEventListener("reset", () =>
{
    document.querySelector("#trial-result").textContent = "No enquiry sent. No membership or class booked.";
    setTimeout(() => renderTrial(), 0);
});
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
