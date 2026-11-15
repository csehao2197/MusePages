const $ = (s) => document.querySelector(s);
$("#price").step = "50";
$("#down").step = "50";
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
function payment(price, down = 5000, term = 60)
{
    const principal = Math.max(0, price - down), rate = .069 / 12;
    return principal ? principal * rate / (1 - (1 + rate) ** -term) : 0;
}
const inventory = [
    ["2024 Aurora GT Line", "Aurora", "Sedan", 42900, "12,400 mi · AWD · Certified Pre-Owned"],
    ["2023 Vantage EX SUV", "Vantage", "SUV", 36500, "21,800 mi · AWD · Certified Pre-Owned"],
    ["2025 Nimbus EV Long Range", "Nimbus", "EV", 51200, "1,200 mi · RWD · New"],
    ["2022 Ridgeback 4x4 Crew", "Ridgeback", "Truck", 39750, "38,600 mi · 4WD · Certified Pre-Owned"],
    ["2024 Corsa Sport Coupe", "Corsa", "Coupe", 47300, "8,900 mi · RWD · Certified Pre-Owned"],
    ["2023 Meridian Touring", "Meridian", "Sedan", 28400, "26,100 mi · FWD · Certified Pre-Owned"],
    ["2025 Vantage Hybrid", "Vantage", "SUV", 44900, "400 mi · AWD · New"],
    ["2021 Aurora Base", "Aurora", "Sedan", 21900, "52,300 mi · FWD · Pre-Owned"],
    ["2024 Ridgeback Trail Edition", "Ridgeback", "Truck", 48600, "14,700 mi · 4WD · Certified Pre-Owned"]
];
let limit = 6, search = "", selected = 0;
function render()
{
    const filtered = inventory.map((v, i) => ({ v, i })).filter(({ v }) => ($("#type").value === "All" || v[2] === $("#type").value) && ($("#make").value === "All" || v[1] === $("#make").value) && v[3] <= Number($("#max").value) && payment(v[3]) <= Number($("#payment-filter").value) && v[0].toLowerCase().includes(search));
    $("#count").textContent = `${filtered.length} matching sample vehicles${search ? ` · search: ${search}` : ""}`;
    $("#max-label").textContent = money($("#max").value);
    $("#empty").hidden = filtered.length !== 0;
    $("#more").hidden = filtered.length <= limit;
    $("#vehicles").innerHTML = filtered.slice(0, limit).map(({ v, i }) => `<article class="vehicle"><div class="vehicle-image"><img src="car.svg" alt="Original illustrative vehicle form for ${v[0]}"><small>SAMPLE LISTING</small></div><div class="vehicle-body"><h3>${v[0]}</h3><p>${v[4]}</p><div class="vehicle-price"><strong>${money(v[3])}</strong><span>est. ${money(payment(v[3]))}/mo</span></div><button data-vehicle="${i}">Explore this vehicle ↗</button></div></article>`).join("");
}
["type", "make", "max", "payment-filter"].forEach((id) => $(`#${id}`).addEventListener("input", () =>
{
    limit = 6;
    render();
}));
$("#reset").addEventListener("click", () =>
{
    $("#type").value = $("#make").value = "All";
    $("#max").value = 90000;
    $("#payment-filter").value = 2000;
    search = "";
    limit = 6;
    render();
});
$("#more").addEventListener("click", () =>
{
    limit += 6;
    render();
});
$("#quick").addEventListener("submit", (event) =>
{
    event.preventDefault();
    $("#make").value = $("#quick-make").value;
    $("#payment-filter").value = $("#quick-payment").value;
    $("#type").value = "All";
    $("#max").value = 90000;
    search = $("#quick-model").value.trim().toLowerCase();
    limit = 6;
    render();
    $("#inventory").scrollIntoView();
});
function calculate()
{
    const price = Number($("#price").value);
    $("#down").max = price;
    if (Number($("#down").value) > price) $("#down").value = price;
    const down = Number($("#down").value), term = Number($("#term").value), monthly = payment(price, down, term);
    $("#price-label").textContent = money(price);
    $("#down-label").textContent = money(down);
    $("#monthly").textContent = money(monthly);
    $("#finance-detail").textContent = `${term} months at 6.9% example APR`;
    $("#principal").textContent = money(price - down);
    $("#interest").textContent = money(monthly * term - (price - down));
    $("#repay").textContent = money(monthly * term);
}
["price", "down", "term"].forEach((id) => $(`#${id}`).addEventListener("input", calculate));
$("#vehicles").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-vehicle]");
    if (!button) return;
    selected = Number(button.dataset.vehicle);
    const v = inventory[selected];
    $("#vehicle-title").textContent = v[0];
    $("#vehicle-spec").textContent = v[4];
    $("#vehicle-price").textContent = money(v[3]);
    $("#vehicle-dialog").showModal();
});
$("#use-price").addEventListener("click", () =>
{
    $("#price").value = inventory[selected][3];
    calculate();
    $("#vehicle-dialog").close();
    $("#finance").scrollIntoView();
});
function enquiry(topic)
{
    $("#enquiry-title").textContent = topic;
    $("#enquiry-status").textContent = "";
    $("#enquiry-dialog").showModal();
}
$("#test-drive").addEventListener("click", () =>
{
    $("#vehicle-dialog").close();
    enquiry(`Test drive: ${inventory[selected][0]}`);
});
document.querySelectorAll("[data-enquiry]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.dataset.enquiry === "Privacy and accessibility")
    {
        enquiry("Privacy & accessibility: no form data is transmitted");
        return;
    }
    enquiry(button.dataset.enquiry);
}));
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(`#${button.dataset.close}`).close()));
const today = new Date().toISOString().slice(0, 10);
$("#date").min = today;
$("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    $("#enquiry-status").textContent = $("#name").value.trim().length < 2 ? "Enter your name." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value) ? "Enter a valid email address." : !$("#date").value || $("#date").value < today ? "Choose today or a future date." : `Draft ready for ${$("#enquiry-title").textContent} on ${$("#date").value}. Nothing sent or scheduled. Contact the dealership directly.`;
});
$("#trade-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const year = Number($("#year").value), mileage = Number($("#mileage").value), currentYear = new Date().getFullYear();
    let message;
    if (!Number.isInteger(year) || year < 1990 || year > currentYear + 1) message = `Enter a year from 1990 to ${currentYear + 1}.`;
    else if (!$("#trade-make").value.trim() || !$("#trade-model").value.trim()) message = "Enter the make and model.";
    else if (!$("#mileage").value || !Number.isFinite(mileage) || mileage < 0 || mileage > 500000) message = "Enter mileage from 0 to 500,000.";
    else
    {
        const guide = Math.max(1500, (30000 - Math.max(0, currentYear - year) * 1800 - mileage * .06) * Number($("#condition").value));
        message = `Illustrative guide: ${money(guide * .9)}–${money(guide * 1.1)}. A simple age/mileage rule, not market data. Not an offer; inspection required. Nothing submitted.`;
    }
    $("#trade-status").textContent = message;
});
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
render();
calculate();
