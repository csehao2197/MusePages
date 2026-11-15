const levels =
[
    ["Beginner", 55, 6, "Paddle, pop up and ride the white water. Start at the beginning, with room to try again."],
    ["Intermediate", 65, 4, "Read the wave, refine your paddle technique and find confidence on the green face."],
    ["Advanced", 75, 2, "Focused coaching on turns, positioning and progression, with a maximum of two per coach."]
];
document.querySelector("#levels").innerHTML = levels.map(([name, price, max, text], id) => `<article class="level"><div class="level-image">0${id + 1}</div><p class="eyebrow">LEVEL 0${id + 1}</p><h3>${name.toUpperCase()}</h3><p>${text}</p><p>2 hours · max ${max} people</p><p class="price">From £${price} / person</p><button class="button" data-level="${name}">Plan this level ↗</button></article>`).join("");
let slot = null;
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const slots = days.flatMap((day, d) => [0, 1, 2].map((time, t) => ({ day, time: t === 0 ? (d > 4 ? "08:00" : "07:00") : t === 1 ? "12:00" : d > 4 ? "17:30" : "17:00", level: levels[(d + t) % 3][0], full: [4, 10, 17, 19].includes(d * 3 + t), id: d * 3 + t })));
function renderSchedule()
{
    const filter = document.querySelector("#level-filter").value;
    document.querySelector("#week").innerHTML = days.map((day) => `<div class="day"><h3>${day}</h3>${slots.filter((s) => s.day === day && (filter === "all" || s.level === filter)).map((s) => `<button class="slot" data-slot="${s.id}" ${s.full ? "disabled" : ""}><span>${s.time}</span>${s.level}<br>${s.full ? "Full" : "Plan session ↗"}</button>`).join("")}</div>`).join("");
}
function estimate()
{
    const f = document.querySelector("#booking-form").elements;
    const l = levels.find(([name]) => name === f.level.value);
    const n = Number(f.people.value);
    const valid = Number.isInteger(n) && n >= 1 && n <= l[2];
    f.people.max = l[2];
    document.querySelector("#estimate").textContent = valid ? `${n} × £${l[1]} = £${n * l[1]} example total. 2 hours; gear included in example package.` : `Choose 1–${l[2]} people for ${l[0]}.`;
    return valid;
}
function open(level, selectedSlot = null)
{
    slot = selectedSlot;
    document.querySelector("#booking-level").value = level;
    document.querySelector("[name='people']").value = "1";
    document.querySelector("#slot-label").textContent = slot ? `Sample slot: ${slot.day} ${slot.time}. Not held or reserved.` : "Choose any suitable sample session from the timetable to add a time.";
    document.querySelector("#booking-result").textContent = "";
    estimate();
    document.querySelector("#booking").showModal();
}
document.addEventListener("click", (event) =>
{
    const level = event.target.closest("[data-level]");
    if (level) open(level.dataset.level);
    const button = event.target.closest("[data-slot]");
    if (button)
    {
        const s = slots.find((entry) => entry.id === Number(button.dataset.slot));
        if (!s.full) open(s.level, s);
    }
});
document.querySelector("#level-filter").onchange = renderSchedule;
document.querySelector("#clear-filter").onclick = () =>
{
    document.querySelector("#level-filter").value = "all";
    renderSchedule();
};
document.querySelector("#booking-level").onchange = () =>
{
    if (slot && document.querySelector("#booking-level").value !== slot.level)
    {
        slot = null;
        document.querySelector("#slot-label").textContent = "Level changed. Choose a matching sample session to add a time.";
    }
    estimate();
};
document.querySelector("[name='people']").oninput = estimate;
document.querySelector("#close").onclick = () => document.querySelector("#booking").close();
document.querySelector("#booking-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    document.querySelector("#booking-result").textContent = !estimate() || !f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) ? "Enter valid participant count, your name and a valid email." : !f.ack.checked ? "Confirm that you understand this is not a reservation." : `${f.level.value} plan for ${f.people.value} participant(s)${slot ? `, ${slot.day} ${slot.time}` : ", time not selected"}. Prepared locally; no reservation, payment or confirmation created.`;
};
document.querySelector("#menu").onclick = (event) => event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
renderSchedule();
