const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
}));
document.querySelector("#breath-toggle").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Resume visual" : "Pause visual";
    document.querySelector("#breath-status").textContent = paused ? "Visual paused. Take your time." : "Inhale. Exhale. Begin.";
});
const timetable =
{
    Mon: [["7am", "Vinyasa", "Sara"], ["12pm", "Meditation", "Leo"], ["6pm", "Yin", "Mia"]],
    Tue: [["7am", "Beginners", "Mia"], ["5:30pm", "Vinyasa", "Sara"], ["7:30pm", "Meditation", "Leo"]],
    Wed: [["9am", "Prenatal", "Sara"], ["12pm", "Yin", "Leo"], ["6pm", "Vinyasa", "Mia"]],
    Thu: [["7am", "Vinyasa", "Mia"], ["5:30pm", "Beginners", "Leo"], ["7pm", "Yin", "Sara"]],
    Fri: [["7am", "Vinyasa", "Sara"], ["12pm", "Meditation", "Mia"], ["6pm", "Yin", "Leo"]],
    Sat: [["8am", "Vinyasa", "All"], ["10am", "Beginners", "Sara"], ["2pm", "Workshop TBC", "Details to follow"]],
    Sun: [["9am", "Yin & Meditation", "Leo"], ["11am", "Vinyasa", "Mia"]]
};
const day = document.querySelector("#day");
const practice = document.querySelector("#practice");
const dialog = document.querySelector("#class-dialog");
let selection = null;
function openClass(details)
{
    selection = details;
    document.querySelector("#class-title").textContent = details.name;
    document.querySelector("#class-detail").textContent = `${details.day} · ${details.time} · with ${details.teacher}`;
    document.querySelector("#class-result").textContent = "Local preview only. Nothing is sent and no place is reserved.";
    document.querySelector("#class-form").reset();
    dialog.showModal();
}
function render()
{
    const week = document.querySelector("#week");
    week.replaceChildren();
    let count = 0;
    Object.entries(timetable).forEach(([name, sessions]) =>
    {
        if (day.value !== "all" && day.value !== name) return;
        const matching = sessions.filter((session) => practice.value === "all" || session[1].includes(practice.value));
        if (!matching.length) return;
        const column = document.createElement("section");
        column.className = "day";
        const heading = document.createElement("h3");
        heading.textContent = name;
        column.append(heading);
        matching.forEach(([time, title, teacher]) =>
        {
            const button = document.createElement("button");
            button.className = "session";
            button.disabled = title.includes("TBC");
            const timeLabel = document.createElement("span");
            timeLabel.textContent = time;
            const classLabel = document.createElement("strong");
            classLabel.textContent = title;
            const teacherLabel = document.createElement("small");
            teacherLabel.textContent = teacher;
            button.append(timeLabel, classLabel, teacherLabel);
            button.addEventListener("click", () => openClass({ day: name, time, name: title, teacher }));
            column.append(button);
            count++;
        });
        week.append(column);
    });
    document.querySelector("#schedule-count").textContent = `${count} session${count === 1 ? "" : "s"} shown`;
    document.querySelector("#schedule-empty").hidden = count !== 0;
    week.hidden = count === 0;
}
[day, practice].forEach((input) => input.addEventListener("change", render));
document.querySelector("#reset-schedule").addEventListener("click", () =>
{
    day.value = "all";
    practice.value = "all";
    render();
});
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    day.value = "all";
    practice.value = button.dataset.filter;
    render();
    document.querySelector("#schedule").scrollIntoView({ behavior: "smooth" });
}));
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#plan-result").textContent = `${button.dataset.plan} selected for exploration. Choose a class above to create a local visit preview. No membership or payment has been created.`;
    document.querySelector("#chosen-plan").textContent = `${button.dataset.plan} interest · no membership or payment created`;
    document.querySelector("#schedule").scrollIntoView({ behavior: "smooth" });
}));
function comparePrices()
{
    const count = Number(document.querySelector("#visits").value);
    const total = count * 18;
    document.querySelector("#price-comparison").textContent = `${count} classes: £${total} drop-in vs £75 monthly. ${total > 75 ? `Monthly is £${total - 75} less at that pace.` : `Drop-in is £${75 - total} less at that pace.`} Annual is £650, saving £250 against 12 monthly payments.`;
}
document.querySelector("#visits").addEventListener("input", comparePrices);
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog) dialog.close();
});
document.querySelector("#class-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#class-result");
    const name = document.querySelector("#name").value.trim();
    if (!event.currentTarget.checkValidity() || name.length < 2)
    {
        result.textContent = "Please enter your name, a valid email and confirm the local-preview notice.";
        return;
    }
    result.textContent = `${name}, your ${selection.name} preview for ${selection.day} at ${selection.time} is ready. Nothing has been sent or booked.`;
});
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#newsletter-result").textContent = document.querySelector("#newsletter-email").checkValidity() ? "Your community signup preview is ready. No subscription was created or email sent." : "Please enter a valid email address.";
});
render();
comparePrices();
