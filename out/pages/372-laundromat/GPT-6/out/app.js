const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const started = Date.now();
const machines = Array.from({ length: 42 }, (_, index) =>
{
    const type = index < 24 ? "washer" : "dryer";
    const number = index < 24 ? index + 1 : index - 23;
    const free = number <= (type === "washer" ? 9 : 6);
    return { type, number, status: number === (type === "washer" ? 24 : 18) ? "broken" : free ? "free" : "busy", finishes: started + (number + 2) * 60000 };
});
let filter = "all";
function render()
{
    const now = Date.now();
    const free = (machine) => machine.status !== "broken" && (machine.status === "free" || machine.finishes <= now);
    const washers = machines.filter((machine) => machine.type === "washer" && free(machine)).length;
    const dryers = machines.filter((machine) => machine.type === "dryer" && free(machine)).length;
    document.querySelector("#summary").textContent = `${washers} washers + ${dryers} dryers free`;
    document.querySelector("#nav-free").textContent = washers + dryers;
    const selected = machines.filter((machine) => (filter === "all" || machine.type === filter) && (!document.querySelector("#free-only").checked || free(machine)));
    document.querySelector("#board").innerHTML = selected.map((machine) =>
    {
        const remaining = Math.max(0, Math.ceil((machine.finishes - now) / 1000));
        const status = machine.status === "broken" ? "Out of order" : free(machine) ? "FREE" : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
        return `<div class="machine ${machine.status === "broken" ? "broken" : free(machine) ? "free" : "busy"}"><small>${machine.type === "washer" ? "WASHER" : "DRYER"} ${String(machine.number).padStart(2, "0")}</small><strong>${status}</strong></div>`;
    }).join("");
    document.querySelector("#empty").hidden = selected.length !== 0;
    document.querySelector("#updated").textContent = `Sample board · refreshed ${new Date().toLocaleTimeString("en-GB")}`;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render();
}));
document.querySelector("#free-only").addEventListener("change", render);
render();
setInterval(render, 1000);
document.querySelector("#estimate").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const kg = Number(document.querySelector("#weight").value);
    const time = document.querySelector("#drop-time").value;
    const output = document.querySelector("#result");
    if (!Number.isFinite(kg) || kg <= 0 || kg > 100 || !time)
    {
        output.textContent = "Enter a weight above 0 and up to 100kg, plus a drop-off time.";
        return;
    }
    if (time < "06:00" || time >= "18:00")
    {
        output.textContent = "Please choose attended drop-off hours: 08:00–18:00 weekdays or 09:00–17:00 weekends. Confirm locally.";
        return;
    }
    if (time < "08:00")
    {
        output.textContent = "Service wash starts when staff arrive at 08:00 weekdays (09:00 weekends).";
        return;
    }
    output.textContent = `Estimate £${(Math.max(6, kg) * 2.4).toFixed(2)}${kg < 6 ? " (6kg minimum)" : ""}. ${time < "10:00" ? "Ready by 5pm the same day" : "Ready next morning"} under the sample policy. Confirm weekend staffing locally. No order sent.`;
});
