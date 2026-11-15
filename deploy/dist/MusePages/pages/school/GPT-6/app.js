const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const dates = [
    ["2026-10-23", "23", "Oct", "Half term starts after school"],
    ["2026-11-03", "3", "Nov", "Children return to school"],
    ["2026-11-14", "14", "Nov", "Parent consultations, 3:30 pm to 7:00 pm"],
    ["2026-12-04", "4", "Dec", "Christmas fair, school hall"],
    ["2026-12-18", "18", "Dec", "Last day of term, finish at 1:30 pm"]
];
function renderDates()
{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visible = dates.filter((item) => document.querySelector("#date-filter").value === "all" || new Date(`${item[0]}T12:00:00`) >= today);
    document.querySelector("#dates-list").innerHTML = visible.length ? visible.map((item) => `<div class="date-row"><time class="date-badge" datetime="${item[0]}"><b>${item[1]}</b><small>${item[2]}</small></time><p>${item[3]}</p></div>`).join("") : "<p>There are no upcoming dates in this sample list. Choose all dates to view the autumn term.</p>";
}
document.querySelector("#date-filter").addEventListener("change", renderDates);
renderDates();
const meals = {
    Monday: ["Tomato pasta bake", "Lentil pasta bake", "Peas, sweetcorn and fresh fruit"],
    Tuesday: ["Roast chicken", "Roast vegetable parcel", "Roast potatoes, carrots and seasonal greens"],
    Wednesday: ["Beef cottage pie", "Lentil cottage pie", "Broccoli and apple crumble"],
    Thursday: ["Chicken curry", "Chickpea curry", "Rice, cucumber and yoghurt"],
    Friday: ["Baked fish fingers", "Vegetable fingers", "Potato wedges, peas and fruit"]
};
function renderMeal()
{
    const meal = meals[document.querySelector("#lunch-day").value];
    document.querySelector("#meal-name").textContent = meal[document.querySelector("#vegetarian").checked ? 1 : 0];
    document.querySelector("#meal-side").textContent = meal[2];
}
document.querySelector("#lunch-day").addEventListener("change", renderMeal);
document.querySelector("#vegetarian").addEventListener("change", renderMeal);
renderMeal();
const dialog = document.querySelector("dialog");
const body = document.querySelector("#modal-body");
document.querySelector(".close").addEventListener("click", () => dialog.close());
function show(title)
{
    document.querySelector("#modal-title").textContent = title;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    dialog.showModal();
}
const info = {
    "Report an absence": "This fictional school page is not monitored and cannot report an absence. Use the actual school office's verified contact route. This demo collects no child's name, attendance or health information.",
    Uniform: "Sample uniform: royal blue jumper or cardigan, white polo shirt, grey trousers or skirt and practical black shoes. Confirm the real school's policy and approved suppliers before purchasing.",
    Clubs: "Sample provision: breakfast club from 7:45 am, after school care until 5:45 pm and seasonal sports and gardening clubs. Availability, fees and holiday provision require direct confirmation. No booking is taken here.",
    "Our staff": "Mrs Helen Carter is the fictional head teacher named in the brief. Staff biographies and a verified directory are outside this static concept.",
    Governors: "A real school would publish its governing body, interests and meeting information here. This fictional concept has no governing body.",
    Vacancies: "No real vacancies or applications are offered by this school concept.",
    Safeguarding: "This page is not a monitored safeguarding route. Use the verified safeguarding contact at the actual school, or local emergency services for immediate danger. No concern or child's personal data is collected here.",
    SEND: "Families can discuss individual support and reasonable adjustments with a real school's SEND coordinator. This static concept makes no assessment and holds no pupil information.",
    Privacy: "No cookies, accounts or personal data storage. Menu choices and visit planning stay in memory until reload. No absence, admissions or visit form is transmitted."
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    body.textContent = info[button.dataset.info];
    show(button.dataset.info);
}));
document.querySelectorAll("[data-apply]").forEach((button) => button.addEventListener("click", () =>
{
    body.innerHTML = "<p>Thinking of joining Oakfield?</p><ol><li>Check your child's entry year and the current application deadline.</li><li>Read the real school's admissions policy and local authority guidance.</li><li>Apply through Sheffield City Council's verified school admissions service.</li></ol><p>This fictional concept takes no applications and collects no pupil data.</p><button class='primary' id='admission-visit'>Plan an open morning</button>";
    show("Applying for a place");
    document.querySelector("#admission-visit").addEventListener("click", () =>
    {
        dialog.close();
        openVisit();
    });
}));
function openVisit()
{
    body.innerHTML = '<p>Open morning concept: Tuesdays at 9:30, October to January. Pick a date to create a local reminder, not a booking.</p><form id="visit-form"><label>Preferred date<input type="date" name="date" required></label><label class="check"><input type="checkbox" required> I understand no visit will be booked.</label><button class="primary">Review visit plan</button><p id="visit-status" role="status"></p></form>';
    show("Come and see a normal day");
    const form = document.querySelector("#visit-form");
    const now = new Date();
    form.elements.date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    form.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const selected = new Date(`${form.elements.date.value}T12:00:00`);
        const month = selected.getMonth();
        document.querySelector("#visit-status").textContent = selected.getDay() !== 2 || ![9, 10, 11, 0].includes(month) ? "Choose a Tuesday from October to January. Actual school holiday availability requires confirmation." : `Local plan for ${form.elements.date.value} at 9:30. No visit has been booked. Confirm the date with the real school office.`;
    });
}
document.querySelectorAll("[data-visit]").forEach((button) => button.addEventListener("click", openVisit));
const stories = [
    ["Year 4 bring the Romans to life", "A week of shields, mosaics and a very convincing march around the playground. Our sample classroom story celebrates history through making, exploring and asking questions."],
    ["Harvest collection for the food bank", "Thank you to every family who donated. We filled the minibus twice. This concept story celebrates the part a school can play in its wider community."],
    ["New climbing frame is open", "Paid for by two years of cake sales from our Friends of Oakfield. This sample update celebrates the patience and generosity behind a new place to play."]
];
document.querySelectorAll("[data-news]").forEach((button) => button.addEventListener("click", () =>
{
    const story = stories[Number(button.dataset.news)];
    body.textContent = `${story[1]} Illustrative news supplied or extended from the fictional school brief.`;
    show(story[0]);
}));
document.querySelector("#all-news").addEventListener("click", (event) =>
{
    const expanded = event.target.getAttribute("aria-expanded") !== "true";
    event.target.setAttribute("aria-expanded", String(expanded));
    document.querySelector("#news-status").hidden = !expanded;
});
