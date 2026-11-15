const $ = (selector) => document.querySelector(selector);
const rooms =
[
    ["Classic Rooms", 180, "Six rooms with original features and garden views.", "Restored stonework, individually chosen textiles and generous linen. A quiet base for a Cotswolds weekend."],
    ["Deluxe Rooms", 240, "Four rooms with freestanding baths and countryside views.", "More room to linger, a freestanding bath and views out over the surrounding fields."],
    ["The Suite", 380, "Master suite with a private terrace.", "A separate space for slow mornings, a private terrace and the most expansive views in the house."]
];
function space(index, fill = false)
{
    const wrap = (content) => `<svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid ${fill ? "slice" : "meet"}" role="img" aria-label="Original ${["bedroom", "bathroom", "restaurant", "lounge", "grounds", "terrace"][index]} illustration">${content}</svg>`;
    const base = `<rect width="600" height="500" fill="#77715f"/><path d="M0 370H600V500H0" fill="#4a4234"/><path d="M0 90H600M0 180H600M0 270H600" stroke="#a1967c" opacity=".25"/><rect x="405" y="55" width="145" height="215" fill="#a5aa87" stroke="#554f3f" stroke-width="12"/><path d="M477 60V270M410 161H550" stroke="#6b6952" stroke-width="6"/>`;
    if (index === 0) return wrap(`${base}<path d="M100 210h265v200H100Z" fill="#353c35"/><path d="m100 315 265 0 75 140H45Z" fill="#d0c3a5"/><path d="m75 385 335 0 30 70H45Z" fill="#8b8063"/><g fill="#e1d6b9"><rect x="118" y="300" width="105" height="48" rx="8"/><rect x="242" y="300" width="105" height="48" rx="8"/></g><path d="M85 65V450M383 65V450M85 65H383" stroke="#413d30" stroke-width="12"/><path d="M65 65h339" stroke="#9d8b63" stroke-width="6"/><path d="m22 276-18 50h59l-15-50Z" fill="#c3a56e"/>`);
    if (index === 1) return wrap(`${base}<path d="M74 300Q122 250 251 280Q354 265 384 310L356 400Q222 444 99 393Z" fill="#d5d0bd" stroke="#aaa48e" stroke-width="7"/><ellipse cx="227" cy="309" rx="145" ry="36" fill="#8e958b"/><path d="M116 397 100 435m231-34 25 36" stroke="#98815b" stroke-width="12"/><path d="M138 293V240q0-33 33-33h14" fill="none" stroke="#c7a86b" stroke-width="8"/><rect x="452" y="331" width="94" height="80" fill="#a19376"/><path d="M447 326h105" stroke="#d4c7a9" stroke-width="12"/>`);
    if (index === 2) return wrap(`<rect width="600" height="500" fill="#4a4b41"/><path d="M0 380H600V500H0" fill="#39372f"/><rect x="50" y="50" width="170" height="230" fill="#243d3c" stroke="#8b8064" stroke-width="10"/><path d="M135 50V280M50 165H220" stroke="#8b8064" stroke-width="6"/><path d="m90 345 370 0 97 108H20Z" fill="#aea087"/><ellipse cx="173" cy="373" rx="49" ry="23" fill="#e0d6bc"/><ellipse cx="378" cy="373" rx="49" ry="23" fill="#e0d6bc"/><path d="M277 350v-102M310 353V270" stroke="#c9b36f" stroke-width="7"/><path d="m270 248 7-22 8 22m17 22 8-21 8 21" fill="#e6c58e"/><path d="M32 460 20 500M524 452l20 48" stroke="#68583d" stroke-width="12"/><rect x="365" y="92" width="160" height="180" fill="#686955" stroke="#a28d61" stroke-width="9"/><path d="m380 250 60-110 70 110" fill="#424f3b"/>`);
    if (index === 3) return wrap(`${base}<path d="M50 320q-20-85 60-90h85q63 0 49 90l-12 110H57Z" fill="#6a5344"/><path d="M300 370V235h80v135" fill="#342b23" stroke="#a89b7b" stroke-width="22"/><path d="m320 370 22-72 26 72" fill="#be9458"/><path d="M40 339h211l-15 65H54Z" fill="#8b7058"/><rect x="275" y="420" width="160" height="15" fill="#867356"/><path d="M291 433v60m127-60v60" stroke="#554a38" stroke-width="8"/>`);
    if (index === 4) return wrap(`<rect width="600" height="500" fill="#aeb6a5"/><circle cx="450" cy="100" r="43" fill="#d0c7a2"/><path d="M0 220Q140 140 290 230T600 190V500H0" fill="#6e8068"/><path d="M0 290Q180 210 380 300T600 240V500H0" fill="#4a654d"/><path d="M0 390Q180 270 400 360T600 320V500H0" fill="#38533e"/><path d="M0 365 600 465" stroke="#a4a48a" stroke-width="18"/><path d="M0 367 600 467" stroke="#70775e" stroke-width="4" stroke-dasharray="27 5"/><path d="M40 500q250-150 560-170" stroke="#b1aa85" stroke-width="24" fill="none"/>`);
    return wrap(`<rect width="600" height="500" fill="#a8b19d"/><path d="M0 220Q150 160 350 230T600 185V500H0" fill="#637b5d"/><path d="M0 310Q200 240 600 330V500H0" fill="#496145"/><path d="M0 370H600V500H0" fill="#93896f"/><path d="M0 326H600M40 300V410M170 300V410M300 300V410M430 300V410M560 300V410" stroke="#b5ac92" stroke-width="9"/><ellipse cx="300" cy="384" rx="123" ry="29" fill="#c1b193"/><path d="M300 400v100" stroke="#514d3a" stroke-width="12"/><ellipse cx="303" cy="367" rx="25" ry="9" fill="#e3d6b9"/><path d="M280 355v16q22 15 45 0v-16" fill="#e0d2b2"/><ellipse cx="303" cy="355" rx="22" ry="6" fill="#5f4630"/>`);
}
$("#room-list").innerHTML = rooms.map(([name, price, short, description], index) => `<article class="room-row"><button class="room-toggle" data-room-toggle="${index}" aria-expanded="false" aria-controls="room-detail-${index}"><strong>${name}</strong><span>${short}</span><b>from £${price}</b><i>↗</i></button><div class="room-detail" id="room-detail-${index}" hidden><div>${space(index === 0 ? 0 : index === 1 ? 1 : 5)}</div><div><p>${description}</p><p>Sample category for one or two guests. Final room, dates and any dog arrangements require confirmation.</p><button class="outline" data-book="${index}">Choose ${name} ↗</button></div></div></article>`).join("");
const gallery = ["The four-poster", "A bath with a view", "Dinner, by candlelight", "The fireside lounge", "The grounds at first light", "Coffee on the terrace"];
$("#gallery-grid").innerHTML = gallery.map((name, index) => `<button class="gallery-item" data-gallery="${index}">${space(index, true)}<span>${name} ↗</span></button>`).join("");
$("#dining-art").innerHTML = space(2, true);
const menus =
{
    tasting: ["Garden beetroot, goat's curd, hazelnut", "Local trout, young leeks, herb butter", "Orchard apple, brown butter, oat crumble"],
    vegetarian: ["Roast squash, pumpkin seed, sage", "Wild mushroom, celeriac, pearl barley", "Poached pear, dark chocolate, almond"],
    breakfast: ["Eggs to order, local sourdough", "Seasonal fruit, cultured yoghurt, honey", "Porridge, orchard compote, toasted oats"]
};
function menu(type)
{
    $("#menu-content").innerHTML = menus[type].join("<br>");
    $("#menu-tabs").querySelectorAll("button").forEach((button) => button.setAttribute("aria-selected", button.dataset.menu === type));
}
let galleryIndex = 0;
function view(index)
{
    galleryIndex = (index + gallery.length) % gallery.length;
    $("#viewer-art").innerHTML = space(galleryIndex);
    $("#viewer-title").textContent = gallery[galleryIndex];
    $("#viewer-count").textContent = `${galleryIndex + 1} / 6`;
    if (!$("#viewer").open) $("#viewer").showModal();
}
$("#viewer-prev").onclick = () => view(galleryIndex - 1);
$("#viewer-next").onclick = () => view(galleryIndex + 1);
addEventListener("keydown", (event) =>
{
    if ($("#viewer").open && event.key === "ArrowRight") view(galleryIndex + 1);
    if ($("#viewer").open && event.key === "ArrowLeft") view(galleryIndex - 1);
});
const experiences = [["Walking & Cycling", "Borrow a walking map and ask about bike arrangements. Local routes range from a gentle village loop to a full day across the hills. Check the weather, surface conditions and bike availability with the hotel."], ["Private Dining", "A room, a seasonal menu and an evening shaped around your party. Exclusive hire is by enquiry; party size, dietary needs, timings and pricing need direct agreement."], ["Spa Treatments", "In-room treatments with an independent therapist by arrangement. Treatment suitability, timing, access needs and pricing must be discussed before any appointment is confirmed."]];
document.addEventListener("click", (event) =>
{
    const close = event.target.closest("[data-close]");
    const room = event.target.closest("[data-room-toggle]");
    const book = event.target.closest("[data-book]");
    const image = event.target.closest("[data-gallery]");
    const tab = event.target.closest("[data-menu]");
    const experience = event.target.closest("[data-experience]");
    if (close) $(`#${close.dataset.close}`).close();
    if (room)
    {
        const open = room.getAttribute("aria-expanded") !== "true";
        room.setAttribute("aria-expanded", open);
        $(`#room-detail-${room.dataset.roomToggle}`).hidden = !open;
    }
    if (book)
    {
        if (book.dataset.book !== "") $("#room").value = book.dataset.book;
        $("#stay-status").textContent = "Choose your dates. No live availability or booking.";
        $("#booking").showModal();
    }
    if (image) view(Number(image.dataset.gallery));
    if (tab) menu(tab.dataset.menu);
    if (experience)
    {
        const [title, description] = experiences[Number(experience.dataset.experience)];
        $("#experience-title").textContent = title;
        $("#experience-copy").textContent = description;
        $("#experience-dialog").showModal();
    }
});
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
$("#arrive").min = $("#depart").min = today;
$("#arrive").onchange = () => { $("#depart").min = $("#arrive").value || today; $("#stay-status").textContent = "Dates changed. Review your estimate."; };
["depart", "room", "guests", "dinner", "dog"].forEach((id) => $(`#${id}`).onchange = () => { $("#stay-status").textContent = "Stay details changed. Review your estimate."; });
$("#stay").onsubmit = (event) =>
{
    event.preventDefault();
    const arrival = $("#arrive").value;
    const departure = $("#depart").value;
    const nights = Math.round((Date.parse(`${departure}T12:00:00Z`) - Date.parse(`${arrival}T12:00:00Z`)) / 86400000);
    const [name, price] = rooms[Number($("#room").value)];
    let message;
    if (!arrival || !departure || arrival < today || !Number.isFinite(nights) || nights < 1) message = "Choose a future arrival and a departure after arrival.";
    else if (nights > 21) message = "For stays longer than 21 nights, please contact the hotel directly.";
    else if (!$("#email").value || !$("#email").validity.valid) message = "Enter a valid email address for your local enquiry draft.";
    else
    {
        const dinner = $("#dinner").checked ? 75 * Number($("#guests").value) : 0;
        message = `${name} · ${nights} night${nights === 1 ? "" : "s"} · £${price * nights + dinner} indicative total${dinner ? `, including £${dinner} sample dinner` : ""}. No availability checked and nothing reserved or sent.${$("#dog").checked ? " Dog arrangements and fees require confirmation." : ""} Contact the hotel to confirm rates, inclusions and dates.`;
    }
    $("#stay-status").textContent = message;
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
menu("tasting");
