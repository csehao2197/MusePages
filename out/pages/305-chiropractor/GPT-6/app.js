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
const concerns =
[
    ["Back discomfort", "Discuss how long it has been troubling you, everyday activities and what you hope to understand. Assessment helps determine whether care or referral is appropriate."],
    ["Neck stiffness", "A clinician can ask about movement, work habits and the history of your concern. The cause cannot be established from this page."],
    ["Headaches", "Headaches have many causes. Discuss symptoms with an appropriate healthcare professional; chiropractic care is not suitable for every headache."],
    ["Leg discomfort", "A proper assessment can help decide the next step. This page cannot determine whether a nerve, muscle or another cause is involved."],
    ["Sports concerns", "Talk about your activity, training demands and recovery priorities. Appropriate assessment and referral come before any care recommendation."],
    ["Desk comfort", "Discuss everyday movement and how your working environment feels. There is no single perfect posture or guaranteed corrective programme."]
];
document.querySelectorAll("[data-condition]").forEach((button) => button.addEventListener("click", () =>
{
    const item = concerns[Number(button.dataset.condition)];
    document.querySelector("#condition-name").textContent = item[0];
    document.querySelector("#condition-copy").textContent = item[1];
    document.querySelectorAll("[data-condition]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
}));
document.querySelectorAll("[data-person]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#person").value = button.dataset.person;
    document.querySelector("#book").scrollIntoView();
}));
function slots()
{
    const date = document.querySelector("#date").value;
    const weekday = date ? new Date(`${date}T12:00:00`).getDay() : 1;
    const times = weekday === 0 ? [] : weekday === 6 ? ["09:00", "11:00", "13:00"] : ["09:00", "12:00", "16:00", "18:00"];
    document.querySelector("#time").innerHTML = times.length ? times.map((time) => `<option>${time}</option>`).join("") : "<option value=''>Closed on Sundays</option>";
}
document.querySelector("#date").addEventListener("change", slots);
document.querySelector("#type").addEventListener("change", () =>
{
    document.querySelector("#estimate").textContent = `Illustrative fee: £${document.querySelector("#type").value}`;
});
document.querySelector("#form").addEventListener("input", () => document.querySelector("#status").textContent = "");
document.querySelector("#form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const say = (text) => document.querySelector("#status").textContent = text;
    const date = document.querySelector("#date").value;
    if (!date || date < new Date().toLocaleDateString("en-CA")) return say("Choose today or a future date.");
    if (!document.querySelector("#time").value) return say("The sample clinics are closed on Sundays.");
    if (document.querySelector("#location").value === "Video discussion" && document.querySelector("#type").value !== "0") return say("Video is for the introductory discussion only. Choose a clinic for an assessment or follow-up.");
    if (!document.querySelector("#name").value.trim()) return say("Please add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value)) return say("Enter a valid email address.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a browser-only preference plan.");
    say(`Preferences: ${document.querySelector("#location").value}, ${date} at ${document.querySelector("#time").value}, ${document.querySelector("#person").value}. Nothing scheduled, charged or sent. Contact the clinic to discuss suitability and availability.`);
});
slots();
