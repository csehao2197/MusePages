const gear = [["Microphones", ["Neumann U87 (2)", "Coles 4038 (2)", "AKG C414 (4)", "Shure SM7B", "Beyerdynamic M160"]], ["Outboard", ["Urei 1176 (2)", "Teletronix LA-2A", "EMT 140 plate", "Roland RE-201", "Pultec EQP-1A"]], ["Instruments", ["1963 Steinway B", "Ludwig Classic Maple", "Hammond A100 with Leslie 122", "Fender Deluxe Reverb", "Wurlitzer 200A"]]];
document.querySelector(".gear").innerHTML = gear.map(([name, items]) => `<div><h3>${name}</h3><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></div>`).join("");
const sessions = [["Aoife Shand, Long Water.", "2026. Vinyl and digital."], ["The Quiet Orders, Second House.", "2025. Vinyl."], ["Baltic Street Choir, Evensong.", "2025. Digital."], ["Rab Ferrier, Notes on a Flood.", "2024. Cassette and digital."]];
document.querySelector(".sessions").innerHTML = sessions.map(([name, format], i) => `<article class="session"><div class="sleeve" role="img" aria-label="Original abstract sleeve illustration"></div><h3>${name}</h3><p class="meta">${format}</p>${i === 0 ? '<span class="new meta">● NEW</span>' : ""}</article>`).join("");
const rates = [["The Hall, ten hours with engineer", "450 GBP"], ["The Booth, ten hours with engineer", "180 GBP"], ["Mixing, per song", "320 GBP"], ["Attended mastering, per song", "140 GBP"]];
document.querySelector(".rates").innerHTML = rates.map(([name, price]) => `<div class="rate"><span>${name}</span><span class="meta">${price}</span></div>`).join("");
const dialog = document.querySelector("dialog");
function modal(html)
{
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelectorAll("[data-room]").forEach((button) => button.addEventListener("click", () => modal(`<p class="meta">ROOM NOTES</p><h2>${button.dataset.room}</h2><p>${button.dataset.room === "The Hall" ? "Nine metre ceiling, floated oak floor and room for a nine piece. Sample day rate: 450 GBP with engineer." : "A quiet, controlled space for vocals, overdubs, voice work and podcasts. Sample day rate: 180 GBP with engineer."}</p><p>Illustrative room information. Discuss access, instrumentation and session needs directly with the studio.</p><a href="mailto:book@taperoom.studio?subject=${encodeURIComponent(button.dataset.room + " enquiry")}">Ask about this room</a>`)));
document.querySelectorAll("[data-booking]").forEach((button) => button.addEventListener("click", () =>
{
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    modal(`<p class="meta">START A CONVERSATION</p><h2>${button.dataset.booking}</h2><p>This is a local enquiry planner. No live calendar is connected and no date can be reserved here.</p><form id="date-form"><label>Preferred date<input type="date" name="date" min="${today}" required></label><label>Room or service<select name="service"><option>The Hall</option><option>The Booth</option><option>Mixing</option><option>Mastering</option></select></label><label>Session length<select name="length"><option>One day</option><option>Two days</option><option>Block booking</option></select></label><button class="pill">Prepare date enquiry <span>↗</span></button><p id="date-status" role="status"></p><a id="email-date" hidden>Open studio enquiry email</a></form>`);
    if (button.dataset.booking === "Block booking enquiry") document.querySelector('[name="length"]').value = "Block booking";
    document.querySelector("#date-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.target);
        document.querySelector("#date-status").textContent = `${data.get("service")} · ${data.get("date")} · ${data.get("length")}. Enquiry prepared, not sent. Availability is unverified and no booking is held.`;
        const link = document.querySelector("#email-date");
        link.href = `mailto:book@taperoom.studio?subject=${encodeURIComponent(`${data.get("service")} enquiry ${data.get("date")}`)}&body=${encodeURIComponent(`I would like to discuss ${data.get("length")} in ${data.get("service")} from ${data.get("date")}. Please confirm availability and terms.`)}`;
        link.hidden = false;
    });
}));
const day = new Date().toLocaleDateString("en-GB", { weekday: "long" });
document.querySelector("#today").textContent = `TODAY: ${day.toUpperCase()} · ${day === "Sunday" ? "BY ARRANGEMENT" : "10:00 UNTIL LATE"} (SAMPLE HOURS)`;
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
