const sessions =
[
    [1, "09:00", "Ballet Beg.", "Ballet", "Beginner"], [1, "18:00", "Contemporary", "Contemporary", "All levels"],
    [2, "09:00", "Hip-Hop", "Hip-Hop", "All levels"], [2, "18:00", "Ballet Adv.", "Ballet", "Advanced"],
    [3, "09:00", "Latin", "Latin", "All levels"], [3, "18:00", "Contemporary", "Contemporary", "All levels"],
    [4, "09:00", "Full", "", ""], [4, "18:00", "Ballet Int.", "Ballet", "Intermediate"],
    [5, "09:00", "Hip-Hop", "Hip-Hop", "All levels"], [5, "18:00", "Full", "", ""],
    [6, "10:00", "Ballet Beg.", "Ballet", "Beginner"], [6, "12:00", "Latin", "Latin", "All levels"], [6, "14:00", "Hip-Hop", "Hip-Hop", "All levels"],
    [0, "10:00", "Contemporary", "Contemporary", "All levels"], [0, "12:00", "Ballet Beg.", "Ballet", "Beginner"], [0, "14:00", "Full", "", ""]
].map((session, index) => ({ id: String(index), day: session[0], time: session[1], name: session[2], style: session[3], level: session[4] }));
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const select = document.querySelector("#session");
for (const session of sessions.filter((item) => item.name !== "Full"))
{
    const option = document.createElement("option");
    option.value = session.id;
    option.textContent = `${days[session.day]} ${session.time} / ${session.name}`;
    select.append(option);
}
function selection()
{
    const session = sessions.find((item) => item.id === select.value);
    document.querySelector("#selection").textContent = session ? `${days[session.day]} ${session.time} / ${session.name}. Sample session only.` : "Choose a sample session from the timetable or the list.";
}
select.addEventListener("change", selection);
function render()
{
    const style = document.querySelector("#style-filter").value;
    const level = document.querySelector("#level-filter").value;
    const filtered = sessions.filter((item) => (style === "All styles" || item.style === style) && (level === "All levels" || item.level === level || item.level === "All levels"));
    const grid = document.querySelector("#schedule-grid");
    grid.replaceChildren();
    for (const day of [1, 2, 3, 4, 5, 6, 0])
    {
        const column = document.createElement("div");
        column.className = "day";
        const heading = document.createElement("h3");
        heading.textContent = days[day].slice(0, 3);
        column.append(heading);
        const daily = filtered.filter((item) => item.day === day);
        daily.forEach((session) =>
        {
            const button = document.createElement("button");
            button.className = "slot";
            button.disabled = session.name === "Full";
            button.setAttribute("aria-label", `${days[day]} ${session.time} ${session.name}`);
            const name = document.createElement("span");
            name.textContent = session.name;
            const time = document.createElement("small");
            time.textContent = session.time;
            button.append(name, time);
            button.addEventListener("click", () =>
            {
                select.value = session.id;
                selection();
                document.querySelector("#trial").scrollIntoView();
            });
            column.append(button);
        });
        if (!daily.length)
        {
            const empty = document.createElement("p");
            empty.className = "day-empty";
            empty.textContent = "No class";
            column.append(empty);
        }
        grid.append(column);
    }
    const available = filtered.filter((item) => item.name !== "Full");
    document.querySelector("#schedule-status").textContent = available.length ? `${available.length} sample sessions. £14 per class; first-class trial offer subject to confirmation.` : "No classes match these filters. Try another style or level.";
}
document.querySelector("#style-filter").addEventListener("change", render);
document.querySelector("#level-filter").addEventListener("change", render);
document.querySelector("#clear-filters").addEventListener("click", () =>
{
    document.querySelector("#style-filter").value = "All styles";
    document.querySelector("#level-filter").value = "All levels";
    render();
});
function filterStyle(style)
{
    document.querySelector("#style-filter").value = style;
    document.querySelector("#level-filter").value = "All levels";
    render();
    document.querySelector("#timetable").scrollIntoView();
}
document.querySelectorAll("[data-style]").forEach((button) => button.addEventListener("click", () => filterStyle(button.dataset.style)));
document.querySelectorAll("[data-instructor]").forEach((button) => button.addEventListener("click", () => filterStyle(button.dataset.instructor)));
const shows =
[
    ["Winter Showcase", "A winter programme bringing classical discipline and contemporary expression to one stage. A creative showcase concept featuring student work and original choreography.", "SAT 14 DEC / Hackney Empire, London"],
    ["Spring Showcase", "An evening of new beginnings, from first performances to advanced ensemble pieces. A spring programme concept across the studio’s disciplines.", "SAT 22 MAR / Barbican Centre, London"]
];
document.querySelectorAll("[data-show]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, copy, date] = shows[Number(button.dataset.show)];
    document.querySelector("#show-title").textContent = title;
    document.querySelector("#show-copy").textContent = copy;
    document.querySelector("#show-date").textContent = date;
    document.querySelector("#show-dialog").showModal();
}));
document.querySelector("#close").addEventListener("click", () => document.querySelector("#show-dialog").close());
document.querySelector("#participant").addEventListener("change", () =>
{
    const child = document.querySelector("#participant").value === "child";
    document.querySelector("#guardian-label").hidden = !child;
    if (!child) document.querySelector("#guardian").checked = false;
});
document.querySelector("#trial-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const session = sessions.find((item) => item.id === select.value);
    const date = document.querySelector("#date").value;
    const status = document.querySelector("#trial-status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add an adult contact name and a valid email address.";
        return;
    }
    if (!session)
    {
        status.textContent = "Choose a sample class to start your enquiry.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future preferred date.";
        return;
    }
    if (new Date(`${date}T12:00:00`).getDay() !== session.day)
    {
        status.textContent = `Choose a ${days[session.day]} to match your selected session.`;
        return;
    }
    if (session.level === "Advanced" && document.querySelector("#experience").value !== "advanced")
    {
        status.textContent = "Advanced ballet requires prior advanced experience. Choose a beginner class or discuss placement with the studio.";
        return;
    }
    if (document.querySelector("#participant").value === "child" && !document.querySelector("#guardian").checked)
    {
        status.textContent = "A parent or guardian must confirm the age-appropriate class enquiry.";
        return;
    }
    status.textContent = `${name}: ${session.name}, ${days[session.day]} ${session.time}, ${date}. Free first-class enquiry for ${document.querySelector("#participant").value === "child" ? "a child, guardian confirmed" : "an adult"}. Nothing booked or sent; class suitability, trial eligibility and places need studio confirmation.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
render();
