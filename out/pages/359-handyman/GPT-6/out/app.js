const jobs =
[
    ["tv", "Mount a TV", 65, 60, "Up to 65 inch on a solid or stud wall, cables tidied into trunking."],
    ["shelf", "Put up shelves", 45, 45, "Per run up to 2 metres, including finding the studs properly."],
    ["flat", "Flat-pack furniture", 55, 60, "Per item up to a double wardrobe. Have the instructions ready."],
    ["tap", "Replace a tap", 70, 60, "Kitchen or basin, like-for-like swap. Agree any new parts first."],
    ["door", "Ease a sticking door", 40, 30, "Planed, rehung or hinges adjusted, whichever it actually needs."],
    ["seal", "Reseal a bath or shower", 60, 60, "Old silicone stripped properly before the new seal goes in."],
    ["hang", "Hang a door", 95, 120, "Fitting hinges, handle and latch. Door and hardware extra at cost."],
    ["blind", "Fit blinds or curtain poles", 45, 45, "Per window, with the right fixing for the wall."],
    ["plaster", "Fill and touch up plaster", 50, 60, "Small holes and cracks, ready for you to paint."],
    ["alarm", "Fit a smoke alarm", 35, 20, "Battery type, position agreed with current guidance. No mains work."],
    ["waste", "Clear a blocked waste", 55, 45, "Sink, basin or bath. Outdoor drains need a specialist."],
    ["bed", "Assemble a bed", 65, 60, "Including the slats nobody can face. One bed per listed unit."]
];
const picked = new Set();
const form = document.querySelector("#booking-form");
document.querySelector("#job-grid").innerHTML = jobs.map(([id, name, price, minutes, copy]) => `<button class="job" data-job="${id}" aria-pressed="false"><span class="job-top"><svg aria-hidden="true"><use href="#tool"/></svg><span class="job-toggle">+</span></span><h3>${name}</h3><p>${copy}</p><span class="job-bottom"><strong>£${price}</strong><span>about ${minutes} min</span></span></button>`).join("");
function currentSelection()
{
    const list = jobs.filter((job) => picked.has(job[0]));
    return { list, price: list.reduce((sum, job) => sum + job[2], 0), minutes: list.reduce((sum, job) => sum + job[3], 0) };
}
function updateJobs()
{
    const { list, price, minutes } = currentSelection();
    const visits = Math.ceil(minutes / 240);
    const summary = list.length ? `${list.length} jobs · about ${Math.round(minutes / 6) / 10} hours${visits > 1 ? ` · needs ${visits} half-day visits` : ""}` : "No jobs yet. Pick a starting point.";
    document.querySelector("#total-price").textContent = `£${price}`;
    document.querySelector("#total-copy").textContent = summary;
    document.querySelector("#booking-summary").textContent = list.length ? `${list.map((job) => job[1]).join(", ")}. Labour £${price}; about ${minutes} minutes.${visits > 1 ? ` This needs ${visits} half-day visits; request a plan rather than a single slot.` : ""} Larger materials extra at cost.` : "Choose jobs above or describe an unusual task.";
    document.querySelectorAll("[data-job]").forEach((button) =>
    {
        const selected = picked.has(button.dataset.job);
        button.setAttribute("aria-pressed", String(selected));
        button.querySelector(".job-toggle").textContent = selected ? "✓" : "+";
    });
    document.querySelector("#booking-result").textContent = "Job list updated. Preview again; no slot held.";
}
document.querySelectorAll("[data-job]").forEach((button) => button.addEventListener("click", () =>
{
    picked.has(button.dataset.job) ? picked.delete(button.dataset.job) : picked.add(button.dataset.job);
    updateJobs();
}));
document.querySelector("#clear-jobs").addEventListener("click", () =>
{
    picked.clear();
    updateJobs();
});
function nextDay(weekday, from)
{
    const date = new Date(from);
    date.setUTCDate(date.getUTCDate() + ((weekday - date.getUTCDay() + 7) % 7 || 7));
    return date;
}
const now = new Date();
const thursday = nextDay(4, now);
const monday = nextDay(1, thursday);
const slots = [[thursday, "morning", "08:00–12:30"], [thursday, "afternoon", "13:00–17:30"], [monday, "morning", "08:00–12:30"]].map(([date, half, time]) =>
{
    const iso = date.toISOString().slice(0, 10);
    return { value: `${iso} ${half}`, label: `${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" })} ${half}`, time };
});
document.querySelector("#slots").innerHTML = slots.map((slot, i) => `<button class="slot" data-slot="${i}"><strong>${slot.label}</strong><span>${slot.time} ↗</span></button>`).join("");
slots.forEach((slot) => form.elements.slot.add(new Option(slot.label, slot.value)));
document.querySelectorAll("[data-slot]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.slot.value = slots[Number(button.dataset.slot)].value;
    document.querySelector("#booking").scrollIntoView();
}));
document.querySelector("#check-coverage").addEventListener("click", () =>
{
    const postcode = document.querySelector("#postcode").value.toUpperCase().replace(/\s/g, "");
    const result = document.querySelector("#coverage-result");
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(postcode))
    {
        result.textContent = "Enter a full UK postcode, such as BS6 5AA.";
        return;
    }
    const district = postcode.slice(0, -3);
    const covered = /^BS(?:[1-9]|1[0-6])$/.test(district) || /^BA[12]$/.test(district);
    result.textContent = covered ? `${district}: travel included in the listed area. Exact access and job scope still need confirmation.` : `${district}: outside the listed postcode districts. Named towns or a travel charge may apply. Ask first; no route or charge has been assumed.`;
});
let photoUrl;
let photoValid = true;
form.elements.photo.addEventListener("change", () =>
{
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    const preview = document.querySelector("#photo-preview");
    preview.hidden = true;
    preview.removeAttribute("src");
    const photo = form.elements.photo.files[0];
    const status = document.querySelector("#photo-status");
    photoValid = !photo || (["image/jpeg", "image/png", "image/webp"].includes(photo.type) && photo.size <= 5 * 1024 * 1024);
    if (!photoValid)
    {
        status.textContent = "Choose a JPG, PNG or WebP image up to 5 MB. No file was uploaded.";
        return;
    }
    if (!photo)
    {
        status.textContent = "No photo selected.";
        return;
    }
    photoUrl = URL.createObjectURL(photo);
    preview.src = photoUrl;
    preview.hidden = false;
    status.textContent = `${photo.name} selected locally. Never uploaded.`;
});
form.addEventListener("input", () => document.querySelector("#booking-result").textContent = "Details changed. Preview the current visit again.");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#booking-result");
    const { list, price, minutes } = currentSelection();
    if (!list.length && form.elements.description.value.trim().length < 10)
    {
        result.textContent = "Pick at least one job or describe your task in 10 or more characters.";
        return;
    }
    const phone = form.elements.phone.value.trim();
    const digits = phone.replace(/\D/g, "").length;
    if (form.elements.name.value.trim().length < 2 || form.elements.address.value.trim().length < 5 || !/^[+\d\s()-]{10,24}$/.test(phone) || digits < 10 || digits > 15)
    {
        result.textContent = "Enter a name, address or full postcode, and a valid phone number.";
        return;
    }
    if (!form.elements.slot.value)
    {
        result.textContent = "Choose a preferred sample half-day.";
        return;
    }
    if (!photoValid)
    {
        result.textContent = "Remove or replace the unsupported photo before previewing.";
        return;
    }
    result.textContent = `${list.length ? `${list.length} jobs, £${price} labour, about ${minutes} minutes` : "Custom task, scope and price to agree"}; preference ${form.elements.slot.selectedOptions[0].textContent}.${minutes > 240 ? ` Requires ${Math.ceil(minutes / 240)} half-day visits, not one slot.` : ""} Browser preview only. No enquiry sent, slot booked, text triggered or payment taken.`;
});
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
}));
addEventListener("pagehide", () =>
{
    if (photoUrl) URL.revokeObjectURL(photoUrl);
});
