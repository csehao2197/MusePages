const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timetable =
[
    [["07:30", "Reformer Pilates", "Reformer guide", 3], ["18:00", "Mat Pilates", "Mat specialist", 5]],
    [["08:00", "Reformer & Barre", "Barre coach", 2], ["19:00", "Reformer Pilates", "Reformer guide", 0]],
    [["12:30", "Mat Pilates", "Mat specialist", 4]],
    [["07:30", "Reformer Pilates", "Reformer guide", 2], ["18:00", "Reformer & Barre", "Barre coach", 1]],
    [["09:00", "Reformer Pilates", "Reformer guide", 4]],
    [["09:30", "Reformer & Barre", "Barre coach", 2], ["11:00", "Mat Pilates", "Mat specialist", 3]],
    []
];
let selected = 0;
function render()
{
    document.querySelectorAll("[role=tab]").forEach((tab, index) =>
    {
        tab.setAttribute("aria-selected", String(index === selected));
        tab.tabIndex = index === selected ? 0 : -1;
    });
    const list = document.querySelector("#class-list");
    list.setAttribute("aria-labelledby", `day-${selected}`);
    list.replaceChildren();
    if (!timetable[selected].length)
    {
        list.textContent = "A little rest. No example group classes on Sunday. Explore Monday or a private session.";
        return;
    }
    timetable[selected].forEach(([time, name, teacher, spaces]) =>
    {
        const row = document.createElement("article");
        row.className = "class-row";
        const clock = document.createElement("time");
        clock.textContent = time;
        const content = document.createElement("div");
        const heading = document.createElement("h3");
        heading.textContent = name;
        const instructor = document.createElement("p");
        instructor.textContent = teacher;
        content.append(heading, instructor);
        const availability = document.createElement("small");
        availability.textContent = spaces ? `${spaces} example spaces` : "Example class full";
        const button = document.createElement("button");
        button.textContent = spaces ? "Explore class ↗" : "Choose another";
        button.addEventListener("click", () =>
        {
            document.querySelector("#kind").value = name;
            document.querySelector("#result").textContent = `${days[selected]} ${time}: ${spaces ? "example preference selected" : "example class is full, explore another time"}. No place reserved.`;
            document.querySelector("#intro").scrollIntoView();
        });
        row.append(clock, content, availability, button);
        list.append(row);
    });
}
days.forEach((day, index) =>
{
    const tab = document.createElement("button");
    tab.id = `day-${index}`;
    tab.textContent = day;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "class-list");
    tab.addEventListener("click", () =>
    {
        selected = index;
        render();
    });
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        selected = event.key === "Home" ? 0 : event.key === "End" ? 6 : (selected + (event.key === "ArrowRight" ? 1 : 6)) % 7;
        render();
        document.querySelector(`#day-${selected}`).focus();
    });
    document.querySelector(".days").append(tab);
});
render();
document.querySelectorAll("[data-kind], [data-plan]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector(button.dataset.kind ? "#kind" : "#plan").value = button.dataset.kind || button.dataset.plan;
        document.querySelector("#intro").scrollIntoView();
    });
});
document.querySelector("#planner").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#result");
    if (!document.querySelector("#experience").value)
    {
        result.textContent = "Choose your experience so the outline can suggest a first step.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Please acknowledge that this is a local outline.";
        return;
    }
    const beginner = document.querySelector("#experience").value === "First time";
    result.textContent = `${document.querySelector("#kind").value} · ${document.querySelector("#plan").value}. ${beginner ? "Ask about an introductory class and equipment orientation." : "Discuss the right level with an instructor."} Nothing sent, charged or reserved.`;
});
document.querySelector("#planner").addEventListener("reset", () => document.querySelector("#result").textContent = "");
