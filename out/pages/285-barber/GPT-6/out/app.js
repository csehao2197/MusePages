const $ = (selector) => document.querySelector(selector);
const services =
[
    ["Classic Cut", 28, 30, "Scissor or clipper cut shaped to your head. Finished with hot towel, product styling, and a clean neckline."],
    ["Cut & Beard", 42, 50, "Full haircut paired with a precision beard sculpt. Straight-razor detailing and hot-towel finish included."],
    ["Hot Towel Shave", 32, 40, "Traditional straight-razor shave. Pre-shave oil, hot towels and cooling post-shave balm."],
    ["Fade", 30, 40, "Skin, low, mid, or high — blended with precision and tapered clean. Any length on top."],
    ["Shape & Lineup", 18, 20, "Razor-sharp edge work on the hairline, temples, and behind the ears. Add-on or standalone."],
    ["The Works", 72, 80, "Cut, beard sculpt, hot towel shave, and scalp massage. Our full ritual. Allow 80 minutes."]
];
const barbers =
[
    ["James Kingston", "Fades & Classic Cuts", "Third-generation barber. Fifteen years behind the chair and still loves every cut."],
    ["Marcus Webb", "Textures & Beards", "Specialist in Afro-textured hair and beard sculpting. Certified in straight-razor technique."],
    ["Dario Ferrara", "Scissor Work", "Trained in Milan. Scissors only. An eye for the most precise cut of your life."],
    ["Tom Russell", "Traditional Shaves", "Our hot-towel specialist. Thirty years of straight-razor experience."]
];
function portrait(index)
{
    const skin = ["#c59e82", "#9d7657", "#bd967c", "#c5a18e"][index % 4];
    const hair = ["#493c32", "#242a2c", "#33302e", "#8b8981"][index % 4];
    return `<svg viewBox="0 0 300 340" role="img" aria-label="Original barber portrait illustration"><rect width="300" height="340" fill="${index % 2 ? "#25334b" : "#1d2b41"}"/><path d="M18 340Q15 230 150 232Q277 230 285 340" fill="#0d1728"/><path d="m104 234 45 63 47-63-14 106h-67Z" fill="#68717a"/><ellipse cx="150" cy="158" rx="60" ry="79" fill="${skin}"/><path d="M90 163Q70 65 150 64Q225 65 210 162L193 112Q153 132 107 109Z" fill="${hair}"/><path d="m109 164 21 0m39 0h21" stroke="#4d4036" stroke-width="3"/><path d="M113 195Q150 226 189 195L175 228 126 227Z" fill="${hair}"/><path d="m134 195 30 0" stroke="#bc8d74" stroke-width="2"/><path d="m44 294 41-21m130 0 42 21" stroke="#3b4b62" stroke-width="2"/></svg>`;
}
$("#service-list").innerHTML = services.map(([name, price, minutes, description], index) => `<button class="service" data-service="${index}"><span>0${index + 1} / ${minutes} MIN</span><h3>${name}</h3><p>${description}</p><b>from £${price} ↗</b></button>`).join("");
$("#barber-list").innerHTML = barbers.map(([name, specialty, bio], index) => `<article class="barber">${portrait(index)}<div><h3>${name}</h3><span class="specialty">${specialty}</span><p>${bio}</p><button data-barber="${index}">Book with ${name.split(" ")[0]} →</button></div></article>`).join("");
const galleryTitles = ["High fade", "Hot towel ritual", "Beard sculpt", "The straight razor", "Classic side part", "The shop", "Precision clipper", "In the chair", "Tools of the trade"];
function galleryArt(index)
{
    if (index === 5) return `<svg viewBox="0 0 300 280" role="img" aria-label="Illustrated barbershop"><image href="shop.svg" width="420" height="280" x="-60"/></svg>`;
    if ([1, 3, 6, 8].includes(index))
    {
        const tool = index === 1 ? `<path d="M45 115Q150 65 255 115L230 204Q150 240 65 200Z" fill="#d2d6d3"/><path d="m70 140 165 0m-150 18 135 0" stroke="#9eaaa9" stroke-width="3"/>` : index === 3 ? `<path d="m60 180 140-75 40 30-149 74Z" fill="#b9c3ce"/><path d="m85 206 130 27 15-24-99-42Z" fill="#674538"/>` : index === 6 ? `<rect x="100" y="110" width="90" height="140" rx="15" fill="#101825" stroke="#9da8b9"/><path d="M100 110V65h90v45" fill="#9ea8b0"/><path d="M110 65V95m12-30v30m12-30v30m12-30v30m12-30v30m12-30v30" stroke="#26364a" stroke-width="4"/><circle cx="145" cy="165" r="13" fill="#b3382b"/>` : `<path d="m90 80 110 150m-5-150L83 230" stroke="#c4cbd2" stroke-width="8"/><circle cx="75" cy="240" r="24" fill="none" stroke="#c4cbd2" stroke-width="8"/><circle cx="210" cy="240" r="24" fill="none" stroke="#c4cbd2" stroke-width="8"/><circle cx="148" cy="155" r="6" fill="#c74a39"/>`;
        return `<svg viewBox="0 0 300 300" role="img" aria-label="${galleryTitles[index]} illustration"><rect width="300" height="300" fill="#23314a"/>${tool}</svg>`;
    }
    return portrait(index + 1);
}
$("#gallery-grid").innerHTML = galleryTitles.map((title, index) => `<button data-gallery="${index}" aria-label="View ${title}">${galleryArt(index)}</button>`).join("");
$("#service").innerHTML = services.map(([name, price], index) => `<option value="${index}">${name} · from £${price}</option>`).join("");
$("#barber").innerHTML = barbers.map(([name], index) => `<option value="${index}">${name}</option>`).join("");
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
$("#date").min = today;
let slot = "";
function summary()
{
    const [name, price, minutes] = services[Number($("#service").value)];
    $("#booking-summary").textContent = `${name} · ${minutes} min · from £${price}${slot ? ` · ${slot}` : ""}`;
    $("#booking-status").textContent = "Local demo plan only. No chair has been reserved.";
}
function slots()
{
    slot = "";
    const date = $("#date").value;
    const valid = date && date >= today;
    const sunday = valid && new Date(`${date}T12:00:00`).getDay() === 0;
    $("#slots").innerHTML = valid ? (sunday ? ["10:00", "12:00", "14:00"] : ["09:00", "11:00", "14:00", "16:00"]).map((time) => `<button type="button" data-slot="${time}" aria-pressed="false">${time}</button>`).join("") : "<p class='small'>Choose today or a future date to view demo times.</p>";
    summary();
}
document.addEventListener("click", (event) =>
{
    const book = event.target.closest("[data-book], [data-service], [data-barber]");
    const time = event.target.closest("[data-slot]");
    const image = event.target.closest("[data-gallery]");
    if (book)
    {
        if (book.dataset.service !== undefined) $("#service").value = book.dataset.service;
        if (book.dataset.barber !== undefined) $("#barber").value = book.dataset.barber;
        slots();
        $("#booking").showModal();
    }
    if (time)
    {
        slot = time.dataset.slot;
        $("#slots").querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", button === time));
        summary();
    }
    if (image)
    {
        const index = Number(image.dataset.gallery);
        $("#viewer-art").innerHTML = galleryArt(index);
        $("#viewer-title").textContent = galleryTitles[index];
        $("#viewer").showModal();
    }
});
$("#date").onchange = slots;
$("#service").onchange = $("#barber").onchange = slots;
$("#booking-close").onclick = () => $("#booking").close();
$("#viewer-close").onclick = () => $("#viewer").close();
$("#booking-form").onsubmit = (event) =>
{
    event.preventDefault();
    if (!$("#date").value || $("#date").value < today || !slot) $("#booking-status").textContent = "Choose a future date and an appointment time.";
    else if (!$("#customer").value.trim() || !$("#email").value || !$("#email").validity.valid) $("#booking-status").textContent = "Enter your name and a valid email address.";
    else $("#booking-status").textContent = `Plan ready: ${barbers[Number($("#barber").value)][0]}, ${$("#date").value} at ${slot}. Nothing booked or sent; call the shop to confirm.`;
};
$("#wait").onclick = () => { $("#wait-status").textContent = "Walk-ins are welcome in this concept. The brief's 15-minute wait is illustrative, not live. Call +44 161 834 5200."; };
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
slots();
