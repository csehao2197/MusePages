const QUEUE_DAYS = 4;
const $ = (selector) => document.querySelector(selector);
const tiers =
[
    { name: "Safety check", price: 25, hours: .5, description: "Brakes, gears, tyres and a bolt torque check. Thirty minutes, usually while you wait.", items: ["Brakes", "Gears", "Tyres", "Bolt torque check"] },
    { name: "Minor service", price: 65, hours: 1.5, description: "Everything in the safety check, plus a clean and adjustment to keep your daily miles running smoothly.", items: ["Everything in safety check", "Gear and brake adjustment", "Drivetrain clean", "Wheel true"] },
    { name: "Major service", price: 130, hours: 3, description: "A full strip and rebuild. For the bike you ride all year, not just when the sun is out.", items: ["Everything in minor service", "Full strip and rebuild", "New cables and housing", "Bearing service throughout"] },
    { name: "Custom build", price: 260, hours: 6, description: "Built from your parts, to your fit. Frame preparation and the small details done right.", items: ["Frame prep and facing", "Full build from parts", "Bearing prep and torque log", "Two free follow-up adjustments"] }
];
let selected = 1;
let requestType = tiers[selected].name;
function choose(index)
{
    selected = index;
    const tier = tiers[index];
    document.querySelectorAll("[data-tier]").forEach((button) => button.setAttribute("aria-selected", Number(button.dataset.tier) === index));
    $("#tier-label").textContent = `${tier.hours} HOURS ON THE STAND`;
    $("#tier-title").textContent = tier.name.toUpperCase();
    $("#tier-description").textContent = tier.description;
    $("#tier-items").innerHTML = tier.items.map((item) => `<li>${item}</li>`).join("");
    $("#tier-price").textContent = `${index === 3 ? "FROM " : ""}£${tier.price}`;
    $("#turnaround").textContent = `Ready in about ${QUEUE_DAYS + Math.ceil(tier.hours / 6)} days · illustrative queue`;
}
$("#tiers").innerHTML = tiers.map((tier, index) => `<button class="tier" role="tab" data-tier="${index}" aria-selected="${index === selected}"><strong>${tier.name}</strong><span>£${tier.price}${index === 3 ? "+" : ""}</span></button>`).join("");
const repairs = [["Puncture repair", "£12"], ["Tube replacement", "£15"], ["Brake pad replacement, per wheel", "£18"], ["Hydraulic brake bleed, per brake", "£30"], ["Gear cable and housing", "£22"], ["Brake cable and housing", "£20"], ["Wheel true", "£20"], ["Spoke replacement", "£8 each"], ["Bottom bracket replacement", "£35 + part"], ["Headset service", "£40"], ["Tubeless setup, per wheel", "£25"], ["Hydraulic hose shorten", "£28"], ["Chain and cassette fit", "£30 + parts"], ["Bike box packing", "£45"]];
function filterRepairs()
{
    const matches = repairs.filter(([name]) => name.toLowerCase().includes($("#repair-search").value.trim().toLowerCase()));
    $("#repair-list").innerHTML = matches.map(([name, price]) => `<div class="repair"><span>${name}</span><span>${price}</span></div>`).join("");
    $("#repair-count").textContent = matches.length ? `${matches.length} repairs shown. Indicative labour prices; parts as noted.` : "No repair matches. Call us about unusual jobs.";
}
$("#repair-search").oninput = filterRepairs;
const routes =
{
    social: ["SOCIAL / 15 MPH", "A sociable spin to the lanes with a café stop. Regroup at every junction. Nobody left behind.", "Illustrative route: Salford to Worsley loop · about 25 miles."],
    steady: ["STEADY / 17 MPH", "A longer loop for regular riders. Two-abreast where safe, with regrouping and a café stop.", "Illustrative route: Cheshire lanes · about 40 miles."],
    fast: ["FAST / SELF-SUPPORTED", "Experienced riders only. This group is not no-drop; carry tools, food and a route of your own.", "No confirmed route or guided service. Ask the shop before joining."]
};
function route()
{
    const [title, description, distance] = routes[$("#pace").value];
    $("#route").innerHTML = `<h3>${title}</h3><p>${description}</p><p class="note">${distance}</p>`;
}
$("#pace").onchange = route;
document.addEventListener("click", (event) =>
{
    const tier = event.target.closest("[data-tier]");
    const book = event.target.closest("[data-book]");
    const fit = event.target.closest("[data-fit]");
    if (tier) choose(Number(tier.dataset.tier));
    if (book || fit)
    {
        requestType = fit ? fit.dataset.fit : tiers[selected].name;
        $("#booking-title").textContent = requestType.toUpperCase();
        $("#booking-cost").textContent = fit ? requestType === "Basic fit" ? "£60 · 60 minutes" : "£150 · 2.5 hours" : `£${tiers[selected].price}${selected === 3 ? "+" : ""} · about ${QUEUE_DAYS + Math.ceil(tiers[selected].hours / 6)} days from the example queue`;
        $("#request-status").textContent = "Local request planner only. Nothing booked or sent.";
        $("#booking").showModal();
    }
});
$("#close").onclick = () => $("#booking").close();
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
$("#date").min = today;
$("#request").onsubmit = (event) =>
{
    event.preventDefault();
    const date = $("#date").value;
    const day = new Date(`${date}T12:00:00`).getDay();
    let message;
    if (!date || date < today) message = "Choose today or a future drop-off date.";
    else if ([0, 1].includes(day)) message = "The workshop is closed Sunday and Monday. Choose Tuesday to Saturday.";
    else if (!$("#problem").value.trim() || !$("#email").value || !$("#email").validity.valid) message = "Describe your bike and enter a valid email address.";
    else message = `${requestType} request plan for ${date} is ready. Nothing booked or sent; call 0161 555 0173 to confirm capacity and parts.`;
    $("#request-status").textContent = message;
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
choose(1);
filterRepairs();
route();
