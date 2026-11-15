const $ = (selector) => document.querySelector(selector);
const rooms =
[
    { name: "The Wren", low: 145, high: 165, bed: "King bed", bath: "Ensuite shower", view: "Over the orchard", color: "#899580", description: "The smallest of the doubles, and the one with the best morning light. Low beam at the door, which we mention because tall guests appreciate the warning." },
    { name: "The Swift", low: 165, high: 185, bed: "Super king", bath: "Ensuite with a roll-top bath", view: "South, over the valley", color: "#b9ad91", description: "The room most people book twice. Sloped ceiling, deep window seat, and the bath is under the window." },
    { name: "The Martin", low: 125, high: 145, bed: "Double", bath: "Private bathroom across the hall", view: "The kitchen garden", color: "#aa9d89", description: "The bathroom is not ensuite, which is why the seasonal rate is lower. It is entirely yours and nobody else passes the door." },
    { name: "The Linnet", low: 125, high: 140, bed: "Twin beds", bath: "Ensuite shower", view: "The courtyard", color: "#a6ac9c", description: "Two proper single beds rather than a zip-and-link. Popular with friends travelling together and with walkers who snore. Dogs welcome at £15 a stay." },
    { name: "The Kestrel", low: 195, high: 220, bed: "King with a sofa", bath: "Ensuite bath and separate shower", view: "Two aspects, west", color: "#a79d83", description: "The largest room, on the corner with two aspects. Room enough for a third person on the sofa bed at £30 per night in this demo estimate." }
];
function roomArt(index)
{
    const room = rooms[index];
    const twin = index === 3;
    const beds = twin ? `<g fill="#ede5d3" stroke="#c0b49a"><path d="M50 260H210L235 425H30Z"/><path d="M275 260H435L467 425H260Z"/><rect x="75" y="252" width="100" height="40"/><rect x="300" y="252" width="100" height="40"/></g>` : `<path d="M100 260H390L450 425H45Z" fill="#e7dfcc" stroke="#c0b49a"/><path d="m83 343 340 0 27 82H45Z" fill="${room.color}"/><rect x="122" y="245" width="115" height="53" rx="7" fill="#f6f0df"/><rect x="255" y="245" width="115" height="53" rx="7" fill="#f6f0df"/>`;
    return `<svg viewBox="0 0 500 430" role="img" aria-label="${room.name} original bedroom illustration"><rect width="500" height="430" fill="#d9d0ba"/><path d="M0 340H500V430H0" fill="#a59172"/><rect x="${index % 2 ? 35 : 350}" y="35" width="115" height="175" fill="#e7e3cf" stroke="#9b987d" stroke-width="10"/><path d="M${index % 2 ? 92 : 407} 35V210M${index % 2 ? 35 : 350} 120h115" stroke="#a9a38b" stroke-width="5"/><path d="M0 0H500v18H0" fill="#7f725c"/><path d="M105 235q135-45 280 0v97H105Z" fill="#74654d"/>${beds}<rect x="450" y="267" width="45" height="65" fill="#877559"/><path d="m460 233-10 33h45l-10-33Z" fill="#eee2be"/><path d="M473 264v20" stroke="#8f763e" stroke-width="5"/><rect x="206" y="58" width="72" height="92" fill="#b3b897" stroke="#827154" stroke-width="7"/><path d="m214 143 28-50 26 50" fill="#83916e"/></svg>`;
}
$("#room-list").innerHTML = rooms.map((room, index) => `<button role="tab" id="room-tab-${index}" aria-controls="room-${index}" data-room="${index}" aria-selected="${index === 0}"><span>0${index + 1}</span>${room.name}</button>`).join("");
$("#room-cards").innerHTML = rooms.map((room, index) => `<article class="room-card ${index === 0 ? "active" : ""}" id="room-${index}"><div class="room-image">${roomArt(index)}</div><h3>${room.name}</h3><div class="room-facts"><strong>From £${room.low}<small> / night</small></strong><span>${room.bed}</span><span>${room.bath}</span><span>${room.view}</span></div><p>${room.description}</p><button class="outline" data-book-room="${index}">Plan a stay in ${room.name} ↗</button></article>`).join("");
$("#rate-rows").innerHTML = [2, 3, 0, 1, 4].map((index) => `<div class="rate-row"><strong>${rooms[index].name}</strong><span data-label="Low">£${rooms[index].low}</span><span data-label="High">£${rooms[index].high}</span><span>1 night, 2 at weekends</span></div>`).join("");
$("#booking-room").innerHTML = rooms.map((room, index) => `<option value="${index}">${room.name}</option>`).join("");
function selectRoom(index)
{
    document.querySelectorAll("[data-room]").forEach((button) => button.setAttribute("aria-selected", Number(button.dataset.room) === index));
    document.querySelectorAll(".room-card").forEach((card, i) => card.classList.toggle("active", i === index));
}
document.addEventListener("click", (event) =>
{
    const room = event.target.closest("[data-room]");
    const book = event.target.closest("[data-book-room]");
    if (room) selectRoom(Number(room.dataset.room));
    if (book)
    {
        $("#booking-room").value = book.dataset.bookRoom;
        $("#stay-status").textContent = `${rooms[Number(book.dataset.bookRoom)].name} selected. Choose dates to estimate your stay.`;
        $("#booking").scrollIntoView();
    }
});
$("#room-list").addEventListener("keydown", (event) =>
{
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const current = Number(document.activeElement.dataset.room || 0);
    const next = (current + (event.key === "ArrowDown" ? 1 : 4)) % 5;
    selectRoom(next);
    $(`#room-tab-${next}`).focus();
});
const today = new Date();
const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
$("#arrive").min = $("#depart").min = todayISO;
$("#arrive").onchange = () =>
{
    $("#depart").min = $("#arrive").value || todayISO;
    $("#stay-status").textContent = "Dates changed. Review the estimate again.";
};
["depart", "booking-room", "guests", "dog"].forEach((id) => $(`#${id}`).onchange = () => { $("#stay-status").textContent = "Stay details changed. Review the estimate again."; });
$("#stay").onsubmit = (event) =>
{
    event.preventDefault();
    const arrival = $("#arrive").value;
    const departure = $("#depart").value;
    const selected = Number($("#booking-room").value);
    const room = rooms[selected];
    const guests = Number($("#guests").value);
    const nights = Math.round((Date.parse(`${departure}T12:00:00Z`) - Date.parse(`${arrival}T12:00:00Z`)) / 86400000);
    let message;
    if (!arrival || !departure || arrival < todayISO || !Number.isFinite(nights) || nights < 1) message = "Choose a future arrival and a departure after arrival.";
    else if (nights > 28) message = "For stays over 28 nights, please call Ruth and Alec.";
    else if (nights === 1 && [5, 6].includes(new Date(`${arrival}T12:00:00Z`).getUTCDay())) message = "Weekend stays need at least two nights. No single-night Saturdays.";
    else if ($("#dog").checked && selected !== 3) message = "Dogs can stay in The Linnet only. Please choose The Linnet or leave the dog option clear.";
    else if (guests === 3 && selected !== 4) message = "Three guests need The Kestrel with its sofa bed.";
    else
    {
        let total = $("#dog").checked ? 15 : 0;
        for (let n = 0; n < nights; n++)
        {
            const date = new Date(`${arrival}T12:00:00Z`);
            date.setUTCDate(date.getUTCDate() + n);
            total += date.getUTCMonth() >= 3 && date.getUTCMonth() <= 8 ? room.high : room.low;
        }
        if (guests === 3) total += 30 * nights;
        message = `${room.name} · ${nights} night${nights === 1 ? "" : "s"} · £${total} estimated. Breakfast for two included. No availability checked and nothing booked. Festival supplements and third-person breakfast need host confirmation.`;
    }
    $("#stay-status").textContent = message;
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
