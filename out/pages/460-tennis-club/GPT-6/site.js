const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const grid = document.querySelector("#court-grid");
const day = document.querySelector("#day");
const court = document.querySelector("#court");
const player = document.querySelector("#player");
let selected = null;
function summary()
{
    document.querySelector("#selection").textContent = selected ? `Day ${Number(day.value) + 1} · Court ${selected.court + 1} · ${selected.hour}:00–${selected.hour + 1}:00` : "Choose a green slot to get started.";
    const price = selected && player.value === "visitor" ? selected.hour >= 17 ? 20 : 14 : 0;
    document.querySelector("#total").textContent = `£${price}`;
}
function render()
{
    grid.replaceChildren();
    grid.append(document.createElement("span"));
    for (let index = 0; index < 6; index++)
    {
        const label = document.createElement("span");
        label.textContent = `${index + 1} ${index < 4 ? "Clay" : index === 4 ? "Hard" : "Indoor"}`;
        if (index !== Number(court.value)) label.className = "other-court";
        grid.append(label);
    }
    for (let hour = 8; hour <= 20; hour++)
    {
        const label = document.createElement("span");
        label.textContent = `${String(hour).padStart(2, "0")}:00`;
        grid.append(label);
        for (let index = 0; index < 6; index++)
        {
            const button = document.createElement("button");
            const state = (hour + index + Number(day.value)) % 5 === 0 ? "booked" : hour === 20 && index < 2 ? "restricted" : "free";
            const active = selected?.hour === hour && selected?.court === index;
            button.className = `slot ${state}${active ? " selected" : ""}${index !== Number(court.value) ? " other-court" : ""}`;
            button.disabled = state !== "free";
            button.setAttribute("aria-label", `Court ${index + 1}, ${hour}:00, ${state}`);
            button.setAttribute("aria-pressed", String(active));
            button.textContent = active ? "Selected" : state === "free" ? "Free" : state === "booked" ? "Booked" : "Lights";
            button.addEventListener("click", () =>
            {
                selected = active ? null : { hour, court: index };
                document.querySelector("#booking-status").textContent = "Demo timetable. No court is reserved.";
                render();
            });
            grid.append(button);
        }
    }
    summary();
}
day.addEventListener("change", () =>
{
    selected = null;
    render();
});
court.addEventListener("change", render);
player.addEventListener("change", summary);
document.querySelector("#clear").addEventListener("click", () =>
{
    selected = null;
    render();
});
document.querySelector("#reserve").addEventListener("click", () =>
{
    document.querySelector("#booking-status").textContent = !selected ? "Select an available slot first." : player.value === "visitor" && day.value === "2" ? "Visitors can only book within 24 hours. Choose today or tomorrow in this demo." : "Booking preview ready. No reservation or payment made.";
});
const fees = { "Full Adult": [315, 50], "Off-Peak Adult": [185, 50], "Junior": [95, 0], "Family": [560, 50] };
document.querySelectorAll("[data-tier]").forEach((button) => button.addEventListener("click", () =>
{
    const [annual, joining] = fees[button.dataset.tier];
    document.querySelector("#membership-status").textContent = `${button.dataset.tier}: £${annual} subscription + £${joining} joining fee = £${annual + joining} first year. Estimate only; no payment taken.`;
}));
const dialog = document.querySelector("#member-dialog");
document.querySelector("#login").addEventListener("click", () => dialog.showModal());
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#explore").addEventListener("click", () =>
{
    dialog.close();
    document.querySelector("#booking").scrollIntoView();
});
render();
