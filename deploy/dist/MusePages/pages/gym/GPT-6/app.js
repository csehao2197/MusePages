const classes = [["HIIT", "Short bursts. Honest effort. A coached interval session with lower-impact options."], ["Strength & Conditioning", "Build confidence around the barbell with coached strength work and conditioning."], ["Spin", "A dark room, a loud playlist and a ride you can scale to your own pace."], ["Boxing", "Footwork, bags and coached combinations. No contact sparring in this sample class."], ["Yoga", "Make space for breath, balance and a change of pace."], ["Mobility", "Controlled movement and dedicated recovery time between harder sessions."]];
document.querySelector("#class-grid").innerHTML = classes.map(([name, copy], i) => `<article class="class-card"><div class="class-icon"><svg aria-hidden="true"><use href="#barbell"/></svg><span>${String(i + 1).padStart(2, "0")}</span></div><h3>${name}</h3><p>${copy}</p><button data-class="${name}">View timetable ↗</button></article>`).join("");
const sessions =
[
    ["Mon", "06:30", "HIIT", "Maya", 45, 6], ["Mon", "12:15", "Strength & Conditioning", "Alex", 50, 0], ["Mon", "18:00", "Yoga", "Daniel", 60, 8],
    ["Tue", "07:00", "Spin", "Maya", 45, 4], ["Tue", "18:15", "Boxing", "Maya", 50, 5], ["Wed", "06:30", "Strength & Conditioning", "Alex", 50, 6],
    ["Wed", "19:00", "Mobility", "Daniel", 40, 8], ["Thu", "07:00", "HIIT", "Maya", 45, 4], ["Thu", "18:00", "Yoga", "Daniel", 60, 7],
    ["Fri", "12:15", "Spin", "Maya", 45, 6], ["Fri", "18:00", "Boxing", "Maya", 50, 3], ["Sat", "09:00", "Strength & Conditioning", "Alex", 50, 8],
    ["Sat", "11:00", "Mobility", "Daniel", 40, 9], ["Sun", "10:00", "Yoga", "Daniel", 60, 5]
];
let day = "Mon";
let plan = "Full Access";
let chosenSession = "";
const plans =
{
    Flex: [35, ["Off-peak gym access", "Weekday entry before 16:00", "Local plan preview"]],
    "Full Access": [55, ["Unlimited gym access", "10 classes per month", "Full opening-hours access"]],
    "All In": [89, ["Unlimited gym access", "Unlimited classes", "One PT session per month"]]
};
document.querySelector("#days").innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => `<button data-day="${name}" aria-pressed="${name === day}">${name}</button>`).join("");
function renderSchedule()
{
    const filter = document.querySelector("#class-filter").value;
    const list = sessions.map((item, index) => ({ item, index })).filter(({ item }) => item[0] === day && (!filter || item[2] === filter));
    document.querySelectorAll("[data-day]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.day === day)));
    document.querySelector("#sessions").innerHTML = list.map(({ item, index }) => `<article class="session"><time>${item[1]}</time><h3>${item[2]}</h3><span>${item[3]} · ${item[4]} min</span><span>${item[5] ? `${item[5]} sample spots` : "Sample full"}</span><button data-session="${index}" ${item[5] ? "" : "disabled"}>${item[5] ? "Preview class ↗" : "Full"}</button></article>`).join("");
    document.querySelector("#schedule-empty").hidden = list.length > 0;
    document.querySelector("#schedule-count").textContent = `${list.length} sample ${list.length === 1 ? "session" : "sessions"} for ${day}.`;
    document.querySelectorAll("[data-session]").forEach((button) => button.addEventListener("click", () =>
    {
        const item = sessions[Number(button.dataset.session)];
        chosenSession = `${item[2]}, ${item[0]} ${item[1]}`;
        document.querySelector("#session-title").textContent = item[2];
        document.querySelector("#session-detail").textContent = `${item[0]} ${item[1]} · ${item[4]} minutes with ${item[3]} · ${item[5]} illustrative spots.`;
        document.querySelector("#session-dialog").showModal();
    }));
}
document.querySelectorAll("[data-day]").forEach((button) => button.addEventListener("click", () =>
{
    day = button.dataset.day;
    renderSchedule();
}));
document.querySelector("#class-filter").addEventListener("change", renderSchedule);
document.querySelectorAll("[data-class]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#class-filter").value = button.dataset.class;
    day = sessions.find((item) => item[2] === button.dataset.class)[0];
    renderSchedule();
    document.querySelector("#timetable").scrollIntoView();
}));
document.querySelector("#reset-schedule").addEventListener("click", () =>
{
    day = "Mon";
    document.querySelector("#class-filter").value = "";
    renderSchedule();
});
renderSchedule();
function showTrial()
{
    const yearly = document.querySelector("#billing").value === "year";
    document.querySelector("#trial-selection").textContent = `${plan} · £${plans[plan][0] * (yearly ? 12 : 1)}/${yearly ? "year" : "month"} after trial, illustrative only.${chosenSession ? ` Interested in ${chosenSession}. No space held.` : ""}`;
    document.querySelector("#trial-result").textContent = "No account, payment or booking is created.";
    document.querySelector("#trial-dialog").showModal();
}
function renderPlans()
{
    const yearly = document.querySelector("#billing").value === "year";
    document.querySelector("#plans").innerHTML = Object.entries(plans).map(([name, [price, benefits]]) => `<article class="plan ${name === "Full Access" ? "featured" : ""}">${name === "Full Access" ? '<span class="badge">Best value</span>' : ""}<h3>${name}</h3><p class="plan-price">£${price * (yearly ? 12 : 1)}<small>/${yearly ? "yr" : "mo"}</small></p><ul>${benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul><button class="button" data-plan="${name}">Try ${name} ↗</button></article>`).join("");
    document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
    {
        plan = button.dataset.plan;
        chosenSession = "";
        showTrial();
    }));
}
document.querySelector("#billing").addEventListener("change", renderPlans);
renderPlans();
document.querySelectorAll(".trial-trigger").forEach((button) => button.addEventListener("click", showTrial));
document.querySelector("#session-trial").addEventListener("click", () =>
{
    document.querySelector("#session-dialog").close();
    showTrial();
});
document.querySelector("#trial-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector("#trial-result");
    if (form.elements.name.value.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!form.elements.date.value || form.elements.date.value <= new Date().toISOString().slice(0, 10))
    {
        result.textContent = "Choose a future start date.";
        return;
    }
    if (!form.elements.age.checked)
    {
        result.textContent = "Confirm the age and local-preview statement.";
        return;
    }
    result.textContent = `Trial preview for ${form.elements.name.value.trim()} from ${form.elements.date.value}, ${plan}. Nothing sent or saved. No membership, class booking or charge created.`;
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
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () => document.querySelector("#social-result").textContent = `${button.dataset.social}: this fictional gym has no verified social account. No external account opened.`));
