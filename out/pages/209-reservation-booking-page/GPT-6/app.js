const today = new Date();
today.setHours(0, 0, 0, 0);
let shown = new Date(today.getFullYear(), today.getMonth(), 1);
let party = 2;
let chosenDate = "";
let chosenTime = "";
let waitlisted = false;
let booking;
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const niceDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
function step(number)
{
    document.querySelectorAll(".step").forEach((panel, index) => panel.hidden = index !== number - 1);
    document.querySelectorAll(".progress li").forEach((item, index) =>
    {
        item.classList.toggle("active", index === number - 1);
        if (index === number - 1) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
    });
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
}
function calendar()
{
    document.querySelector("#month-label").textContent = shown.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const first = new Date(shown.getFullYear(), shown.getMonth(), 1).getDay();
    const count = new Date(shown.getFullYear(), shown.getMonth() + 1, 0).getDate();
    let html = "<span></span>".repeat(first);
    for (let day = 1; day <= count; day++)
    {
        const date = new Date(shown.getFullYear(), shown.getMonth(), day);
        const value = localDate(date);
        const unavailable = date < today || date.getDay() === 1 || (date - today) / 86400000 > 60;
        html += `<button type="button" data-date="${value}" ${unavailable ? "disabled" : ""} class="${chosenDate === value ? "selected" : ""}" aria-label="${niceDate(value)}${unavailable ? ", unavailable" : ""}" aria-pressed="${chosenDate === value}">${day}</button>`;
    }
    document.querySelector("#calendar").innerHTML = html;
    document.querySelector("#previous-month").disabled = shown <= new Date(today.getFullYear(), today.getMonth(), 1);
    document.querySelector("#next-month").disabled = shown > new Date(today.getFullYear(), today.getMonth() + 1, 1);
}
document.querySelector("#guest-buttons").innerHTML = Array.from({ length: 20 }, (_, index) => `<button type="button" data-party="${index + 1}" class="${index === 1 ? "selected" : ""}" aria-pressed="${index === 1}" aria-label="${index + 1} ${index ? "guests" : "guest"}">${index + 1}</button>`).join("");
document.querySelector("#times").innerHTML = Array.from({ length: 9 }, (_, index) =>
{
    const value = `${17 + Math.floor(index / 2)}:${index % 2 ? "30" : "00"}`;
    const display = `${5 + Math.floor(index / 2)}:${index % 2 ? "30" : "00"}`;
    const status = index === 4 ? "Fully booked" : index === 3 ? "Limited" : "Available";
    return `<button type="button" data-time="${value}" class="${index === 4 ? "full" : index === 3 ? "limited" : ""}" aria-label="${display} pm, ${status}">${display}<small>${status}</small></button>`;
}).join("");
document.querySelector("#guest-buttons").onclick = (event) =>
{
    const button = event.target.closest("[data-party]");
    if (!button) return;
    party = Number(button.dataset.party);
    document.querySelectorAll("[data-party]").forEach((item) =>
    {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", item === button);
    });
    document.querySelector("#large-party").textContent = party >= 8 ? "For 8+ guests, call 212.555.0188 to arrange a personal event." : "";
};
document.querySelector("#calendar").onclick = (event) =>
{
    const button = event.target.closest("[data-date]");
    if (!button || button.disabled) return;
    chosenDate = button.dataset.date;
    chosenTime = "";
    waitlisted = false;
    document.querySelectorAll("[data-time]").forEach((item) => item.classList.remove("selected"));
    document.querySelector("#waitlist").hidden = true;
    document.querySelector("#time-status").textContent = `${niceDate(chosenDate)} · Choose your preferred time.`;
    calendar();
};
document.querySelector("#previous-month").onclick = () =>
{
    shown.setMonth(shown.getMonth() - 1);
    calendar();
};
document.querySelector("#next-month").onclick = () =>
{
    shown.setMonth(shown.getMonth() + 1);
    calendar();
};
document.querySelector("#times").onclick = (event) =>
{
    const button = event.target.closest("[data-time]");
    if (!button) return;
    if (!chosenDate)
    {
        document.querySelector("#time-status").textContent = "Please select a date first.";
        return;
    }
    waitlisted = false;
    document.querySelector("#waitlist").hidden = button.dataset.time !== "19:00";
    if (button.dataset.time === "19:00")
    {
        chosenTime = "";
        document.querySelectorAll("[data-time]").forEach((item) => item.classList.remove("selected"));
        document.querySelector("#time-status").textContent = "7 pm is fully booked. Try 6:30 or 7:30 pm, or preview joining the waitlist.";
        return;
    }
    chosenTime = button.dataset.time;
    document.querySelectorAll("[data-time]").forEach((item) => item.classList.toggle("selected", item === button));
    document.querySelector("#time-status").textContent = `${chosenTime} selected · ${button.classList.contains("limited") ? "Limited availability" : "Available"} in this sample.`;
};
document.querySelector("#waitlist").onclick = () =>
{
    chosenTime = "19:00";
    waitlisted = true;
    document.querySelector("#time-status").textContent = "Waitlist preview selected for 7 pm. A table is not guaranteed.";
};
document.querySelector("#to-details").onclick = () =>
{
    const area = document.querySelector('[name="area"]:checked').value;
    const capacities = { "Main Dining Room": 20, "Private Room": 12, "Patio": 6, "Chef's Table": 4 };
    const error = !chosenDate || !chosenTime ? "Please choose an available date and time (or a waitlist preview)." : party > capacities[area] ? `${area} accommodates up to ${capacities[area]}. Choose another space.` : "";
    document.querySelector("#party-error").textContent = error;
    if (error) return;
    document.querySelector("#selection-summary").textContent = `${party} guests · ${niceDate(chosenDate)} · ${chosenTime} · ${area}${waitlisted ? " · WAITLIST" : ""}`;
    step(2);
};
document.querySelectorAll("[data-back]").forEach((button) => button.onclick = () => step(Number(button.dataset.back)));
function summary()
{
    return `<p><b>${booking.name}</b></p><p>${party} guests · ${niceDate(chosenDate)}<br>${chosenTime} · ${booking.area}${waitlisted ? " · WAITLIST PREVIEW" : ""}</p><p>${booking.email}<br>${booking.phone}</p><p>${booking.occasion}</p><p>${booking.requests || "No special requests."}</p>`;
}
document.querySelector("#reservation").onsubmit = (event) =>
{
    event.preventDefault();
    booking = Object.fromEntries(["name", "email", "phone", "occasion", "requests"].map((id) => [id, escape(document.getElementById(id).value.trim())]));
    booking.area = document.querySelector('[name="area"]:checked').value;
    document.querySelector("#review").innerHTML = summary();
    step(3);
};
document.querySelector("#confirm").onclick = () =>
{
    if (!document.querySelector("#policy").checked)
    {
        document.querySelector("#confirm-error").textContent = "Please acknowledge the demonstration and cancellation policy.";
        return;
    }
    document.querySelector("#reservation").hidden = true;
    document.querySelector("#confirmation").hidden = false;
    document.querySelector("#confirmation-number").textContent = `PREVIEW · PC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    document.querySelector("#confirmed-details").innerHTML = summary();
    document.querySelector("#cancel").disabled = false;
    document.querySelector("#cancel-status").textContent = "";
    document.querySelector(".calendar-links").hidden = false;
    const date = chosenDate.replaceAll("-", "");
    const start = `${date}T${chosenTime.replace(":", "")}00`;
    const end = `${date}T${String(Number(chosenTime.slice(0, 2)) + 2).padStart(2, "0")}${chosenTime.slice(3)}00`;
    document.querySelector("#google-calendar").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Prime & Co — preview only")}&dates=${start}/${end}&ctz=America%2FNew_York&details=Demonstration%20only%3B%20no%20table%20reserved`;
    document.querySelector("#booking").scrollIntoView();
};
function calendarFile()
{
    const date = chosenDate.replaceAll("-", "");
    const start = `${date}T${chosenTime.replace(":", "")}00`;
    const end = `${date}T${String(Number(chosenTime.slice(0, 2)) + 2).padStart(2, "0")}${chosenTime.slice(3)}00`;
    const text = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Prime Co//Reservation Preview//EN\r\nBEGIN:VEVENT\r\nUID:${crypto.randomUUID()}@prime.example\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, "")}\r\nDTSTART;TZID=America/New_York:${start}\r\nDTEND;TZID=America/New_York:${end}\r\nSUMMARY:Prime & Co - preview only\r\nDESCRIPTION:No table reserved. Contact the restaurant to book.\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "prime-reservation-preview.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector("#apple-calendar").onclick = calendarFile;
document.querySelector("#outlook-calendar").onclick = calendarFile;
document.querySelector("#modify").onclick = () =>
{
    document.querySelector("#confirmation").hidden = true;
    document.querySelector("#reservation").hidden = false;
    document.querySelector("#policy").checked = false;
    step(1);
};
document.querySelector("#cancel").onclick = () =>
{
    document.querySelector("#cancel-status").textContent = "Your local preview is cancelled. No real reservation or email was affected.";
    document.querySelector("#cancel").disabled = true;
    document.querySelector(".calendar-links").hidden = true;
};
calendar();
