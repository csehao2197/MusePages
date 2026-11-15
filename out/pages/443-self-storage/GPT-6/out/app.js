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
const sizes = [
    { size: 10, dimensions: "5′ × 2′ × 8′", price: 12, status: "Available" },
    { size: 25, dimensions: "5′ × 5′ × 8′", price: 22, status: "Available", label: "SMALL", fits: "A garden shed. Boxes, a bike, seasonal things." },
    { size: 35, dimensions: "5′ × 7′ × 8′", price: 29, status: "2 left" },
    { size: 50, dimensions: "10′ × 5′ × 8′", price: 38, status: "Available", label: "MEDIUM", fits: "A single room of furniture, or a small flat move." },
    { size: 75, dimensions: "10′ × 7.5′ × 8′", price: 49, status: "Available" },
    { size: 100, dimensions: "10′ × 10′ × 8′", price: 62, status: "1 left", label: "LARGE", fits: "A one-bedroom flat, or a single garage worth." },
    { size: 150, dimensions: "15′ × 10′ × 8′", price: 85, status: "Available" },
    { size: 200, dimensions: "20′ × 10′ × 8′", price: 108, status: "Available", label: "EXTRA LARGE", fits: "A three-bedroom house, or a transit van and a half." }
];
let selected = sizes.find((unit) => unit.size === 50);
document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () =>
{
    selected = sizes.find((unit) => unit.size === Number(button.dataset.size));
    document.querySelectorAll("[data-size]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelector("#unit-label").textContent = `${selected.size} SQ FT / ${selected.label}`;
    document.querySelector("#unit-fits").textContent = selected.fits;
    document.querySelector("#unit-price").textContent = selected.price;
    document.querySelector("#unit-period").textContent = `£${selected.price * 4} per 4-week period`;
    document.querySelector("#unit-dimension").textContent = selected.dimensions;
    document.querySelector("#unit-art").dataset.capacity = selected.size;
    document.querySelector("#unit-art").setAttribute("aria-label", `Original illustrative ${selected.size} sq ft storage diagram`);
}));
function renderUnits()
{
    const visible = sizes.filter((unit) => unit.size >= Number(document.querySelector("#minimum").value));
    document.querySelector("#unit-rows").innerHTML = visible.map((unit) => `<tr><td data-label="Size">${unit.size} sq ft</td><td data-label="Dimensions">${unit.dimensions}</td><td data-label="Weekly">£${unit.price}</td><td data-label="4 weeks">£${unit.price * 4}</td><td data-label="Sample status"><span class="availability">${unit.status} · demo</span></td><td data-label="Plan"><button data-unit="${unit.size}">Reserve ↗</button></td></tr>`).join("");
    document.querySelector("#units-empty").hidden = visible.length > 0;
}
document.querySelector("#minimum").addEventListener("change", renderUnits);
renderUnits();
const dialog = document.querySelector("dialog");
const form = document.querySelector("#reserve-form");
const status = document.querySelector("#reserve-status");
let reservation = selected;
function reserve(unit, purpose = "Home move")
{
    reservation = unit;
    form.reset();
    form.elements.purpose.value = purpose;
    const now = new Date();
    form.elements.date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    status.textContent = "";
    document.querySelector("#reservation-unit").textContent = `${unit.size} sq ft · ${unit.dimensions} · £${unit.price}/week. Insurance excluded. Sample rates only.`;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    dialog.showModal();
}
document.querySelectorAll("[data-reserve]").forEach((button) => button.addEventListener("click", () => reserve(selected)));
document.querySelector("#reserve-selected").addEventListener("click", () => reserve(selected));
document.querySelector("#unit-rows").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-unit]");
    if (button) reserve(sizes.find((unit) => unit.size === Number(button.dataset.unit)));
});
document.querySelector("#business-plan").addEventListener("click", () => reserve(sizes.find((unit) => unit.size === 25), "Business stock"));
document.querySelector(".close").addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.textContent = `Local plan: ${reservation.size} sq ft from ${form.elements.date.value}; £${reservation.price * 4} per 4 weeks before insurance. No unit has been reserved, price held or payment taken.`;
});
document.querySelector("#estimate").addEventListener("click", () =>
{
    const boxes = document.querySelector("#box-qty");
    const tape = document.querySelector("#tape-qty");
    if (![boxes, tape].every((input) => input.value !== "" && input.checkValidity()))
    {
        document.querySelector("#supply-status").textContent = "Enter whole quantities from 0 to 100 for both items.";
        return;
    }
    const total = Number(boxes.value) * 2.4 + Number(tape.value) * 2.2;
    document.querySelector("#supply-status").textContent = `£${total.toFixed(2)} · ${total ? "Local estimate only. No order placed." : "No supplies selected."}`;
});
