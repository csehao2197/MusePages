const $ = (s) => document.querySelector(s);
const sessions = [];
function add(day, time, type, duration, places)
{
    sessions.push({ day, time, type, duration, places, id: String(sessions.length) });
}
["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((day) => add(day, "05:00", "S&C", 45, 4));
["Mon", "Wed", "Fri"].forEach((day) =>
{
    add(day, "06:00", "Boxing", 60, 6);
    add(day, "19:00", "Boxing", 60, day === "Mon" ? 0 : 3);
});
["Tue", "Thu"].forEach((day) => add(day, "18:30", "Kickboxing", 60, 5));
add("Sat", "08:00", "S&C", 45, 4);
add("Sat", "09:00", "Kickboxing", 60, 2);
add("Sat", "10:00", "Muay Thai", 60, 0);
add("Sun", "11:00", "Muay Thai", 60, 3);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
sessions.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.time.localeCompare(b.time));
$("#trial-session").innerHTML = '<option value="">Choose an available class</option>' + sessions.filter((s) => s.places).map((s) => `<option value="${s.id}">${s.day} ${s.time} — ${s.type}</option>`).join("");
function render()
{
    const filtered = sessions.filter((s) => ($("#day").value === "all" || s.day === $("#day").value) && ($("#discipline").value === "all" || s.type === $("#discipline").value) && (!$("#available").checked || s.places));
    $("#count").textContent = `${filtered.length} matching sessions`;
    $("#empty").hidden = filtered.length !== 0;
    $("#sessions").innerHTML = filtered.map((s) => `<tr><td>${s.day}</td><td>${s.time}</td><td>${s.type}</td><td>${s.duration} min</td><td>${s.places || "FULL"}</td><td><button data-session="${s.id}" ${s.places ? "" : "disabled"}>${s.places ? "TRY IT ↗" : "FULL"}</button></td></tr>`).join("");
}
["day", "discipline", "available"].forEach((id) => $(`#${id}`).addEventListener("change", render));
$("#reset").addEventListener("click", () =>
{
    $("#day").value = $("#discipline").value = "all";
    $("#available").checked = false;
    render();
});
document.querySelectorAll("[data-discipline]").forEach((button) => button.addEventListener("click", () =>
{
    $("#discipline").value = button.dataset.discipline;
    $("#day").value = "all";
    render();
    $("#schedule").scrollIntoView();
}));
$("#sessions").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-session]");
    if (!button) return;
    $("#trial-session").value = button.dataset.session;
    $("#trial").scrollIntoView();
});
$("#trial-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const selected = sessions.find((s) => s.id === $("#trial-session").value);
    let message;
    if (!selected?.places) message = "Choose an available session.";
    else if ($("#name").value.trim().length < 2) message = "Enter your name.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) message = "Enter a valid email address.";
    else if (!$("#consent").checked) message = "Please acknowledge the demo enquiry.";
    else message = `Demo enquiry prepared for ${selected.type}, ${selected.day} ${selected.time}. £0 trial. Nothing sent or reserved; contact the gym to confirm.`;
    $("#trial-status").textContent = message;
});
function compare()
{
    const count = Number($("#frequency").value);
    const cost = count * 15;
    $("#comparison").textContent = `${count} classes: £${cost} drop-in / £65 monthly. ${cost > 65 ? `Monthly saves £${cost - 65}.` : `Drop-in saves £${65 - cost}.`} Annual: £660 upfront, saving £120 against twelve monthly payments.`;
}
$("#frequency").addEventListener("input", compare);
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
render();
compare();
