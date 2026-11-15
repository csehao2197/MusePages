const rooms = ["The Vault", "The Study", "Isolation", "The Heist"];
const matrix = [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 0, 0], [0, 0, 2, 0]];
const times = ["2:00pm", "4:00pm", "6:00pm", "8:00pm"];
const players = document.querySelector("#players");
const date = document.querySelector("#date");
date.min = new Date().toLocaleDateString("en-CA");
let selection = null;
function total()
{
    const count = Number(players.value);
    const day = date.value ? new Date(`${date.value}T12:00:00`).getDay() : 1;
    return count * (count === 6 ? 16 : day === 0 || day >= 5 ? 22 : 18);
}
function update()
{
    const focus = document.querySelector("#focus").value;
    const body = document.querySelector("#slots");
    body.replaceChildren();
    matrix.forEach((row, time) =>
    {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.scope = "row";
        th.textContent = times[time];
        tr.append(th);
        row.forEach((state, room) =>
        {
            const td = document.createElement("td");
            const button = document.createElement("button");
            button.textContent = ["Available", "Last 2 spots", "Fully booked"][state];
            button.className = state === 1 ? "limited" : "";
            button.disabled = state === 2 || (focus !== "all" && Number(focus) !== room);
            button.setAttribute("aria-label", `${rooms[room]}, ${times[time]}, ${button.textContent}`);
            button.setAttribute("aria-pressed", String(selection?.room === room && selection?.time === time));
            button.dataset.slot = `${time}-${room}`;
            button.addEventListener("click", () =>
            {
                selection = { time, room, state };
                document.querySelector("#booking-error").textContent = "";
                update();
            });
            td.append(button);
            tr.append(td);
        });
        body.append(tr);
    });
    document.querySelector("#selection").textContent = selection ? `${rooms[selection.room]} · ${times[selection.time]} · ${players.value} players · illustrative selection` : "No room selected. Choose an available slot above.";
    document.querySelector("#price").textContent = `£${total()}`;
}
document.querySelectorAll("[data-room]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        selection = null;
        document.querySelector("#focus").value = button.dataset.room;
        update();
        document.querySelector("#booking").scrollIntoView();
    });
});
document.querySelector("#focus").addEventListener("change", () =>
{
    selection = null;
    update();
});
players.addEventListener("change", update);
date.addEventListener("change", update);
const dialog = document.querySelector("#request");
document.querySelector("#review").addEventListener("click", () =>
{
    const error = document.querySelector("#booking-error");
    if (!date.checkValidity()) error.textContent = "Choose a present or future date first.";
    else if (!selection) error.textContent = "Choose an available room and time first.";
    else if (selection.room === 2 && Number(players.value) > 4) error.textContent = "Isolation holds up to 4 players. Choose fewer players or a different room.";
    else if (selection.state === 1 && Number(players.value) > 2) error.textContent = "This sample slot has only 2 spots. Choose 2 players or another time.";
    else
    {
        error.textContent = "";
        document.querySelector("#summary").textContent = `${rooms[selection.room]} · ${date.value} at ${times[selection.time]} · ${players.value} players · £${total()} example total.`;
        document.querySelector("#result").textContent = "";
        dialog.showModal();
    }
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    document.querySelector("#result").textContent = form.checkValidity() && form.elements.name.value.trim() ? "Local plan complete. No booking, payment or email has been made." : "Please enter an example name and valid email.";
});
document.querySelector("#gift").addEventListener("click", () =>
{
    document.querySelector("#gift-result").textContent = `£${document.querySelector("#gift-amount").value} gift preview. No voucher issued and no payment taken.`;
});
let seconds = 47 * 60 + 23;
let paused = false;
function displayTimer()
{
    document.querySelector("#timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
setInterval(() =>
{
    if (!paused && seconds > 0) seconds--;
    displayTimer();
}, 1000);
document.querySelector("#pause").addEventListener("click", (event) =>
{
    paused = !paused;
    event.currentTarget.textContent = paused ? "Resume" : "Pause";
    event.currentTarget.setAttribute("aria-pressed", String(paused));
});
document.querySelector("#reset").addEventListener("click", () =>
{
    seconds = 47 * 60 + 23;
    displayTimer();
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
update();
