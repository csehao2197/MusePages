const programs = [
    { key: "puppy", title: "Puppy Foundation", fee: 45, symbol: "a good start.", text: "For puppies from 8 weeks to under 6 months. Explore socialisation, house manners and an enjoyable introduction to learning.", items: ["6-week / 12-session concept", "Reward-based foundation skills", "Home-practice workbook ideas"] },
    { key: "adult", title: "Adult Obedience", fee: 55, symbol: "everyday skills.", text: "For dogs 6 months and older. Focus on recall, loose-lead walking and real-world skills, with an individual plan.", items: ["8-session concept program", "Individual priorities", "Progress review and practice plan"] },
    { key: "behaviour", title: "Behaviour & Rehab", fee: 75, symbol: "understanding.", text: "A starting conversation for anxiety, reactivity or aggression. Suitability and safe next steps require individual professional assessment.", items: ["Individual assessment first", "Management and realistic goals", "Veterinary liaison where appropriate"] }
];
document.querySelector("#program-list").innerHTML = programs.map((program) => `<article class="program"><div class="symbol">${program.symbol}</div><span>FROM £${program.fee} / SESSION</span><h3>${program.title}</h3><p>${program.text}</p><ul>${program.items.map((item) => `<li>${item}</li>`).join("")}</ul><button data-program="${program.key}">Explore this starting point ↗</button></article>`).join("");
let suggestion = "";
document.querySelector("#finder-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const age = Number(document.querySelector("#finder-age").value);
    const goal = document.querySelector("#goal").value;
    const status = document.querySelector("#finder-status");
    const use = document.querySelector("#use-program");
    use.hidden = true;
    suggestion = "";
    if (!Number.isInteger(age) || age < 2 || age > 300 || !goal)
    {
        status.textContent = "Choose an age in whole months (2–300) and a goal.";
        return;
    }
    suggestion = goal === "behaviour" ? "behaviour" : age < 6 ? "puppy" : "adult";
    status.textContent = `${programs.find((program) => program.key === suggestion).title}: a starting conversation only. Individual suitability needs assessment.`;
    use.hidden = false;
});
document.querySelectorAll("#finder-age, #goal").forEach((input) => input.addEventListener("input", () =>
{
    suggestion = "";
    document.querySelector("#finder-status").textContent = "";
    document.querySelector("#use-program").hidden = true;
}));
document.querySelector("#use-program").addEventListener("click", () =>
{
    document.querySelector("#program").value = suggestion;
    document.querySelector("#age").value = document.querySelector("#finder-age").value;
    cost();
});
document.querySelectorAll("[data-program]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#program").value = button.dataset.program;
    cost();
    document.querySelector("#book").scrollIntoView();
}));
const stageTexts = [
    "Assessment: talk about history, triggers and what a useful first step could be.",
    "Training plan: agree achievable priorities, a safe setting and a practice routine.",
    "Practice: work in manageable steps, reward useful choices and adjust when needed.",
    "Keep learning: review progress, retain useful skills and adapt as life changes."
];
document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-stage]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelector("#stage-copy").textContent = stageTexts[Number(button.dataset.stage)];
}));
function journey()
{
    const section = document.querySelector("#journey");
    const track = document.querySelector(".journey-track");
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    document.querySelector("#journey-dog").style.transform = `translateX(${progress * Math.max(0, track.clientWidth - 40)}px)`;
}
window.addEventListener("scroll", journey, { passive: true });
window.addEventListener("resize", journey);
journey();
function cost()
{
    const program = document.querySelector("#program").value;
    const format = document.querySelector("#format").value;
    const miles = Number(document.querySelector("#distance").value);
    let text = "Choose a program & format";
    if (program)
    {
        if (!Number.isInteger(miles) || miles < 0 || miles > 150) text = "Enter distance from 0 to 150 miles";
        else
        {
            const prices = { puppy: { single: 45, package: 490 }, adult: { single: 55, package: 399 }, behaviour: { single: 75, package: 150 } };
            const base = format === "assessment" ? 0 : prices[program][format];
            const travel = format === "assessment" ? 0 : Math.max(0, miles - 25) * .45;
            text = `£${(base + travel).toFixed(2)}${travel ? ` / includes £${travel.toFixed(2)} example travel` : ""}`;
        }
    }
    document.querySelector("#cost").textContent = text;
    document.querySelector("#status").textContent = "";
}
document.querySelectorAll("#program, #format, #distance").forEach((input) => input.addEventListener("input", cost));
document.querySelector("#assessment-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const email = document.querySelector("#email");
    if (document.querySelector("#name").value.trim().length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add your name and a valid email address.";
        return;
    }
    const age = Number(document.querySelector("#age").value);
    const program = document.querySelector("#program").value;
    const distance = document.querySelector("#distance").value;
    const miles = Number(distance);
    if (!document.querySelector("#dog").value.trim() || !Number.isInteger(age) || age < 2 || age > 300 || !program || distance === "" || !Number.isInteger(miles) || miles < 0 || miles > 150)
    {
        status.textContent = "Add dog details, age 2–300 months, a program and distance 0–150 miles.";
        return;
    }
    if (program === "puppy" && age >= 6 || program === "adult" && age < 6)
    {
        status.textContent = "Puppy Foundation is for under 6 months; Adult Obedience starts at 6 months. Adjust the program or request a behaviour assessment.";
        return;
    }
    const date = document.querySelector("#date").value;
    if (!date || date <= new Date().toLocaleDateString("en-CA") || new Date(`${date}T12:00:00`).getDay() === 0)
    {
        status.textContent = "Choose a future Monday–Saturday assessment preference.";
        return;
    }
    if (document.querySelector("#message").value.trim().length < 20)
    {
        status.textContent = "Add at least 20 characters about your goals.";
        return;
    }
    status.textContent = `${document.querySelector("#dog").value.trim()} / ${programs.find((item) => item.key === program).title} / ${document.querySelector("#cost").textContent} / ${date}. Local preview. Nothing sent or booked.`;
});
document.querySelectorAll("#assessment-form input, #assessment-form textarea").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
