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
const stages =
[
    ["Baby discoveries", "Sensory baskets, songs and soft floor play, with rest and feeding routines discussed individually with parents."],
    ["Toddler adventures", "Water play, mark-making and stories that invite new words. Everyday choices support growing independence."],
    ["Pre-school possibilities", "Collaborative play, early sounds and numbers, and imaginative projects. Building confidence through curiosity, not pressure."]
];
document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () =>
{
    const index = Number(button.dataset.stage);
    document.querySelector("#stage-title").textContent = stages[index][0];
    document.querySelector("#stage-copy").textContent = stages[index][1];
    document.querySelectorAll("[data-stage]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document.querySelector("#age").selectedIndex = index;
}));
function estimate()
{
    const days = Number(document.querySelector("#days").value);
    document.querySelector("#estimate").textContent = Number.isInteger(days) && days >= 1 && days <= 5 ? `£${days * Number(document.querySelector("#session").value)} / week` : "Choose 1–5 sessions per week.";
}
document.querySelector("#days").addEventListener("input", estimate);
document.querySelector("#session").addEventListener("change", estimate);
document.querySelector("#visit-form").addEventListener("input", () => document.querySelector("#status").textContent = "");
document.querySelector("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const say = (text) => document.querySelector("#status").textContent = text;
    if (!document.querySelector("#name").value.trim()) return say("Please add the parent or carer name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value)) return say("Please add a valid email address.");
    const date = document.querySelector("#date").value;
    if (!date || date < new Date().toLocaleDateString("en-CA")) return say("Choose today or a future weekday.");
    const day = new Date(`${date}T12:00:00`).getDay();
    if (day === 0 || day === 6) return say("Choose a weekday, Monday to Friday.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a browser-only plan.");
    say(`Visit discussion plan: ${date}, ${document.querySelector("#time").value}, ${document.querySelector("#age").value}. Nothing sent or scheduled. Contact the nursery directly to arrange a visit.`);
});
