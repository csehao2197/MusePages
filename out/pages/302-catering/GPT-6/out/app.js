const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const dishes =
[
    [["Hokkaido scallop, yuzu kosho, rye", "Kombu-cured scallop, charcoal rye, fermented chilli.", "£14 / pc"], ["Whipped cep, sourdough, truffle", "Dorset mushrooms, brown butter, hay-smoked cream. V", "£9 / pc"], ["Cornish crab, green apple, dill", "Picked white crab, crème fraîche, malted cracker.", "£12 / pc"], ["Heritage tomato, burrata, basil", "Slow-roasted tomato, burrata, three-basil oil. V", "£8 / pc"]],
    [["Smoked trout, buttermilk, sea herbs", "Juniper embers, pickled cucumber, gooseberry.", "Plated"], ["Tagliolini, Exmoor caviar", "Egg-yolk pasta, beurre blanc, chive flower.", "Plated"], ["Charred leek, hazelnut, vadouvan", "Brown butter praline, curry leaf. V", "Plated"]],
    [["Salt-marsh lamb, burnt onion", "Rump and slow-braised shoulder, wild garlic.", "Seasonal"], ["Line-caught turbot, brown shrimp", "Hispi cabbage, seaweed butter.", "Seasonal"], ["Glazed celeriac, Tunworth, oats", "Whole roasted celeriac, brown butter oats. V", "Seasonal"]],
    [["Brown butter tart, Sicilian almond", "Salted caramel, bitter almond ice cream.", "To finish"], ["Roasted rhubarb, vanilla, shortbread", "Yorkshire rhubarb, vanilla cream, buttery crumb.", "To finish"], ["Aged Comté, quince, walnut", "Quince membrillo and candied walnut. V", "To finish"]],
    [["Kabinett Riesling, Mosel ’22", "Off-dry, saline. With canapés.", "Glass I"], ["Chenin Blanc, Loire ’23", "Textural and bright. With the first course.", "Glass II"], ["Gamay, Beaujolais ’22", "Light, bright, served cool. With mains.", "Glass III"], ["Moscato d’Asti ’24", "Gently sparkling. With dessert.", "Glass IV"]]
];
function showTab(index, focus = false)
{
    document.querySelectorAll("[data-tab]").forEach((button, i) =>
    {
        button.setAttribute("aria-selected", String(i === index));
        button.tabIndex = i === index ? 0 : -1;
    });
    const panel = document.querySelector("#dishes");
    panel.setAttribute("aria-labelledby", `tab-${index}`);
    panel.innerHTML = dishes[index].map(([name, description, price]) => `<article class="dish"><div><h3>${name}</h3><p>${description}</p></div><span>${price}</span></article>`).join("");
    if (focus) document.querySelector(`#tab-${index}`).focus();
}
document.querySelectorAll("[data-tab]").forEach((button, i) =>
{
    button.addEventListener("click", () => showTab(i));
    button.addEventListener("keydown", (event) =>
    {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft")
        {
            event.preventDefault();
            showTab((i + (event.key === "ArrowRight" ? 1 : 4)) % 5, true);
        }
    });
});
showTab(0);
const plan = document.querySelector("#package");
const guests = document.querySelector("#guests");
function estimate()
{
    const rate = { Gather: 95, Celebrate: 185 }[plan.value];
    document.querySelector("#estimate").textContent = rate ? `${plan.value} · £${(rate * Number(guests.value || 0)).toLocaleString("en-GB")} food estimate for ${guests.value || 0} guests` : "Grand · Bespoke quote required, 120+ guests";
}
document.querySelector("#quote").addEventListener("input", () =>
{
    document.querySelector("#status").textContent = "";
    estimate();
});
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    plan.value = button.dataset.plan;
    guests.value = { Gather: 8, Celebrate: 40, Grand: 120 }[plan.value];
    estimate();
    document.querySelector("#enquire").scrollIntoView();
}));
document.querySelectorAll("[data-event]").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#event").value = link.dataset.event;
}));
document.querySelectorAll("details").forEach((detail) => detail.addEventListener("toggle", () =>
{
    if (detail.open) document.querySelectorAll("details").forEach((other) =>
    {
        if (other !== detail) other.open = false;
    });
}));
document.querySelector("#quote").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const say = (text) => status.textContent = text;
    if (!document.querySelector("#name").value.trim()) return say("Please add your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value)) return say("Please enter a valid email.");
    const minimum = { Gather: 8, Celebrate: 40, Grand: 120 }[plan.value];
    if (!Number.isInteger(Number(guests.value)) || Number(guests.value) < minimum || Number(guests.value) > 400) return say(`${plan.value} needs ${minimum}–400 guests.`);
    const date = document.querySelector("#date").value;
    if (!date || date < new Date().toLocaleDateString("en-CA")) return say("Choose today or a future event date.");
    if (!document.querySelector("#location").value.trim()) return say("Add an event location or city.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a browser-only draft.");
    say(`Draft ready: ${document.querySelector("#event").value}, ${guests.value} guests, ${document.querySelector("input[name=style]:checked").value}, ${date}. Nothing sent, charged or reserved. Copy your details to contact the team directly.`);
});
