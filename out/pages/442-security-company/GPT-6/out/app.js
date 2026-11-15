const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
function closeNav()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
function scrollSurvey()
{
    closeNav();
    document.querySelector("#survey").scrollIntoView();
}
document.querySelectorAll("[data-scroll]").forEach((button) => button.addEventListener("click", scrollSurvey));
const form = document.querySelector("#survey-form");
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.service.value = button.dataset.service;
    scrollSurvey();
}));
const lines = [
    "DEMO SITE ALPHA · PERIMETER CLEAR · 03:42",
    "DEMO SITE BRAVO · PATROL LOGGED · 03:44",
    "DEMO SITE CHARLIE · ALARM ACK 41s · 03:46",
    "DEMO SITE DELTA · KEYHOLDER NOTIFIED · 03:49"
];
let feedIndex = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const feedToggle = document.querySelector("#feed-toggle");
function updateFeedButton()
{
    feedToggle.textContent = paused ? "Resume feed" : "Pause feed";
    feedToggle.setAttribute("aria-pressed", String(paused));
}
feedToggle.addEventListener("click", () =>
{
    paused = !paused;
    updateFeedButton();
});
updateFeedButton();
setInterval(() =>
{
    if (!paused && !document.hidden)
    {
        feedIndex = (feedIndex + 1) % lines.length;
        document.querySelector("#feed-line").textContent = lines[feedIndex];
    }
}, 3000);
const simulation = [
    "Alarm triggers. No live alarm has been received.",
    "Operator acknowledges the invented alarm. No real operator is connected.",
    "Challenge or dispatch is considered in the scenario. No patrol is dispatched.",
    "Officer arrival is illustrated. No real site is attended.",
    "Written report closes the scenario. No report or email has been sent."
];
let step = 0;
function renderStep()
{
    document.querySelectorAll(".timeline article").forEach((article, index) =>
    {
        article.classList.toggle("active", index <= step);
        article.setAttribute("aria-current", index === step ? "step" : "false");
    });
    document.querySelector("#simulation-status").textContent = `SIMULATION ${step + 1}/5 · ${simulation[step]}`;
    document.querySelector("#next-step").disabled = step === 4;
}
document.querySelector("#next-step").addEventListener("click", () =>
{
    if (step < 4) step++;
    renderStep();
});
document.querySelector("#reset-step").addEventListener("click", () =>
{
    step = 0;
    renderStep();
});
renderStep();
const sectors = {
    Construction: ["Protect the progress.", "Plant, fuel and materials can be exposed outside working hours. A considered mix of patrols and observation helps frame the conversation with a verified provider.", "Unauthorised access and asset loss"],
    Retail: ["A visible, thoughtful presence.", "Opening and closing cover and loss prevention are part of the retail concept. A real plan should balance customer experience and site-specific risk.", "Loss prevention and opening or closing cover"],
    Logistics: ["Know what moves through.", "Gatehouse checks and load verification are proposed capabilities. Detailed audit requirements belong in a private discussion with a verified provider.", "Vehicle movement and delivery disputes"],
    Education: ["Care around your campus.", "Out-of-hours patrols and lone-worker cover are proposed services. Enhanced DBS checks and safeguarding suitability must be independently verified.", "Out-of-hours access and lone-worker support"]
};
let sector = "Construction";
document.querySelectorAll("[data-sector]").forEach((button) => button.addEventListener("click", () =>
{
    sector = button.dataset.sector;
    const item = sectors[sector];
    document.querySelector("#sector-code").textContent = `SECTOR / ${sector.toUpperCase()}`;
    document.querySelector("#sector-heading").textContent = item[0];
    document.querySelector("#sector-copy").textContent = item[1];
    document.querySelector("#sector-risk").textContent = `FOCUS / ${item[2]}`;
    document.querySelectorAll("[data-sector]").forEach((tab) => tab.setAttribute("aria-pressed", String(tab === button)));
}));
document.querySelector("#sector-select").addEventListener("click", () =>
{
    form.elements.sector.value = sector;
    scrollSurvey();
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const digits = form.elements.phone.value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
    {
        document.querySelector("#survey-status").textContent = "Enter an example phone number containing 7 to 15 digits.";
        return;
    }
    const fields = ["company", "contact", "brief"];
    if (fields.some((name) => form.elements[name].value.trim().length < (name === "brief" ? 15 : 2)))
    {
        document.querySelector("#survey-status").textContent = "Use visible fictional aliases and at least 15 characters for the sample overview.";
        return;
    }
    document.querySelector("#survey-status").textContent = `Local summary: ${form.elements.company.value.trim()}, ${form.elements.sector.value}, ${form.elements.service.value}. No survey has been requested, no provider notified and no protection service started.`;
});
const dialog = document.querySelector("dialog");
document.querySelector("#control-info").addEventListener("click", () => dialog.showModal());
document.querySelector(".close").addEventListener("click", () => dialog.close());
