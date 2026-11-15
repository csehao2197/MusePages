const day =
[
    ["07:00","Morning check","Every dog seen individually, bedding checked, medication given, water changed."],
    ["07:30","First run","Twenty minutes in a grass paddock, in small compatible groups or alone if your dog prefers it."],
    ["08:30","Breakfast","Your own food, your own portions, your own schedule. We do not switch dogs onto our food."],
    ["10:00","Long walk","Forty-five minutes on the estate paths. Every dog goes out, whatever the weather."],
    ["12:30","Rest","Quiet period in kennels. Dogs sleep more than owners expect and they need this."],
    ["14:30","Second run and play","Another paddock session, plus one-to-one time and enrichment toys."],
    ["16:30","Second walk","Forty-five minutes, different route, so it stays interesting."],
    ["18:00","Dinner","Your food again, then a settle-down period."],
    ["19:30","Photo update","We send you a photo and a line about their day. Every day, without you asking."],
    ["21:00","Last check and lights out","Final toilet break, bedding sorted, and a walk-through by the duty handler."]
];
document.querySelector("#timeline").innerHTML = day.map(([time,title,copy]) => `<li><time>${time}</time><h3>${title}</h3><p>${copy}</p></li>`).join("");
let updateIndex = 0;
const updates =
[
    ["Bramble had a brilliant day","Two long walks and half an hour chasing a football with a spaniel called Ted","Ate everything, slept like a log by seven"],
    ["Otto is finding his feet","A quiet solo paddock session and a gentle walk with a familiar handler","Settled with his own blanket after dinner"],
    ["Chester's evening hello","A garden sniff, a long walk and some one-to-one company","Illustrative message only — real care updates need direct contact"]
];
document.querySelector("#next-update").addEventListener("click", () =>
{
    updateIndex = (updateIndex + 1) % updates.length;
    ["#message-title","#message-detail","#message-food"].forEach((selector,index) => document.querySelector(selector).textContent = updates[updateIndex][index]);
});
const packing = [...document.querySelectorAll(".packing input")];
function packed()
{
    document.querySelector("#packed").textContent = `${packing.filter((input) => input.checked).length} of 6 packed`;
}
packing.forEach((input) => input.addEventListener("change", packed));
document.querySelector("#clear-packing").addEventListener("click", () =>
{
    packing.forEach((input) => input.checked = false);
    packed();
});
const room = document.querySelector("#room");
function roomNote()
{
    const cat = room.value === "cat";
    document.querySelector("#weight-label").hidden = cat;
    document.querySelector("#weight").disabled = cat;
    document.querySelector("#first-note").textContent = cat ? "Cat cabins are in a separate quiet building. Confirm vaccination and care requirements directly." : document.querySelector("#first").value === "yes" ? "First visit? Every new dog needs a free half-day trial before an overnight stay." : "Welcome back. Confirm vaccinations, care notes and any changes directly before arrival.";
}
room.addEventListener("change", roomNote);
document.querySelector("#first").addEventListener("change", roomNote);
document.querySelectorAll("[data-room]").forEach((button) => button.addEventListener("click", () =>
{
    room.value = button.dataset.room;
    roomNote();
    location.hash = "booking";
}));
const form = document.querySelector("#stay-form");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const arrival = document.querySelector("#arrival").value;
    const departure = document.querySelector("#departure").value;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    if (!arrival || arrival < today || !departure || departure <= arrival)
    {
        result.textContent = "Choose an arrival today or later and a departure after arrival.";
        return;
    }
    const name = document.querySelector("#pet-name").value.trim();
    const breed = document.querySelector("#breed").value.trim();
    const weight = Number(document.querySelector("#weight").value);
    if (!name || !breed || (room.value !== "cat" && (!Number.isFinite(weight) || weight < 0.5 || weight > 120)))
    {
        result.textContent = "Add a pet name, breed and a dog weight from 0.5 to 120kg (cat weight not required).";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Acknowledge that care and availability require direct confirmation.";
        return;
    }
    const nights = Math.round((Date.parse(`${departure}T00:00:00Z`) - Date.parse(`${arrival}T00:00:00Z`)) / 86400000);
    let note = room.value !== "cat" && document.querySelector("#first").value === "yes" ? "A free half-day trial is required for a first-time dog." : "Care requirements must be confirmed directly.";
    if (room.value !== "cat" && nights > 14) note += " The brief requires neutering for dog stays over fourteen nights.";
    result.textContent = `Local stay request: ${name}, ${breed} · ${nights} night${nights === 1 ? "" : "s"} · ${room.selectedOptions[0].textContent}.\n${note}\nNo live availability checked, nothing sent or reserved. Rates, peak dates and all medication arrangements need direct confirmation.`;
});
form.addEventListener("reset", () =>
{
    result.textContent = "";
    setTimeout(roomNote, 0);
});
const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function close()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", close);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") close();
});
