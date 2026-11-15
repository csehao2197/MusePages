const lists = {
    "First-Time Buyer": ["Deposit source questions", "Identity and address examples", "Income and spending overview"],
    "Home Mover": ["Current mortgage terms", "Possible early repayment charges", "Sale and purchase budget"],
    Remortgage: ["Current deal end date", "Outstanding balance", "Fees and early repayment questions"],
    "Buy-to-Let": ["Expected rental income", "Landlord obligations", "Tax and specialist advice questions"],
    "Self-Employed": ["Accounts and tax calculation examples", "Business income history", "Variable income questions"],
    Protection: ["Existing cover questions", "Household needs and exclusions", "Cost and suitability discussion"]
};
function checklist(name)
{
    document.querySelector("#checklist-title").textContent = name;
    document.querySelector("#documents").replaceChildren(...lists[name].map((text) =>
    {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
    }));
    document.querySelector("#situation").value = name;
    document.querySelectorAll("[data-service]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.service === name)));
}
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => checklist(button.dataset.service)));
checklist("First-Time Buyer");
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(value);
const calc = document.querySelector("#calc");
function calculate(event)
{
    event?.preventDefault();
    const raw = ["price", "deposit", "rate", "years"].map((id) => document.querySelector(`#${id}`).value);
    const [price, deposit, rate, years] = raw.map(Number);
    let error = "";
    if (raw.some((value) => value.trim() === "") || ![price, deposit, rate, years].every(Number.isFinite)) error = "Enter a number in every field.";
    else if (price <= 0 || price > 10000000 || deposit < 0 || deposit >= price) error = "Use a property price up to £10 million and a deposit from zero to less than the price.";
    else if (rate < 0 || rate > 25) error = "Use an annual rate from 0% to 25%.";
    else if (!Number.isInteger(years) || years < 1 || years > 40) error = "Use a whole-number term from 1 to 40 years.";
    document.querySelector("#calc-error").textContent = error;
    document.querySelector("#calculation").hidden = Boolean(error);
    if (error) return;
    const principal = price - deposit;
    const months = years * 12;
    const monthlyRate = rate / 1200;
    const monthly = monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - (1 + monthlyRate) ** -months);
    document.querySelector("#monthly").textContent = `${money(monthly)} / month`;
    document.querySelector("#loan").textContent = money(principal);
    document.querySelector("#ltv").textContent = `${(principal / price * 100).toFixed(1)}%`;
    document.querySelector("#repaid").textContent = money(monthly * months);
    document.querySelector("#interest").textContent = money(Math.max(0, monthly * months - principal));
}
calc.addEventListener("submit", calculate);
calc.addEventListener("reset", () => setTimeout(calculate, 0));
calculate();
const outline = document.querySelector("#outline");
outline.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(outline);
    const result = document.querySelector("#outline-result");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email"))) result.textContent = "Enter a valid example email.";
    else if (!data.get("ack")) result.textContent = "Confirm the educational, local-only acknowledgement.";
    else result.textContent = `Local outline: ${document.querySelector("#situation").value}. Ask about eligibility, total costs, fees, commission and risks. No enquiry sent, credit search made or quote offered.`;
});
outline.addEventListener("reset", () => { document.querySelector("#outline-result").textContent = ""; });
const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
