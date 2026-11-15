const groups = {
    Everyday: [["Shirt, laundered & pressed", 3.2], ["Trousers", 7.5], ["Skirt", 7], ["Jumper", 8], ["Blouse", 7.5], ["Tie", 4]],
    Formalwear: [["Two-piece suit", 16], ["Three-piece suit", 21], ["Dinner jacket", 11], ["Evening dress", 18], ["Waistcoat", 6.5]],
    Outerwear: [["Coat", 14], ["Wool overcoat", 17], ["Padded jacket", 16], ["Leather jacket", 45], ["Suede coat", 58]],
    Household: [["Duvet, single", 18], ["Duvet, double", 22], ["Curtains, per metre drop", 9], ["Tablecloth", 12], ["Cushion cover", 5.5]]
};
const speeds = { standard: { days: 3, multiplier: 1 }, express: { days: 1, multiplier: 1.4 }, sameday: { days: 0, multiplier: 1.9 } };
let speed = "standard";
const bag = [];
const money = (value) => `£${value.toFixed(2)}`;
let total = 0;
function render()
{
    const settings = speeds[speed];
    document.querySelectorAll("[data-speed]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.speed === speed)));
    const ready = new Date();
    ready.setDate(ready.getDate() + settings.days);
    document.querySelector("#delivery").textContent = `Estimated ready: ${ready.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}${settings.days === 0 ? " by 6pm" : ""}. Subject to inspection and opening hours.`;
    const list = document.querySelector("#price-list");
    list.replaceChildren();
    Object.entries(groups).forEach(([name, items]) =>
    {
        const group = document.createElement("section");
        group.className = "price-group";
        const heading = document.createElement("h3");
        heading.textContent = name;
        group.append(heading);
        items.forEach(([title, price]) =>
        {
            const row = document.createElement("div");
            row.className = "price-row";
            const label = document.createElement("span");
            label.textContent = title;
            const amount = document.createElement("strong");
            amount.textContent = money(price * settings.multiplier);
            amount.dataset.price = title;
            const add = document.createElement("button");
            add.textContent = "+";
            add.setAttribute("aria-label", `Add ${title} to bag`);
            add.addEventListener("click", () =>
            {
                bag.push([title, price]);
                updateBag();
            });
            row.append(label, amount, add);
            group.append(row);
        });
        list.append(group);
    });
    updateBag();
}
function updateBag()
{
    total = bag.reduce((sum, item) => sum + item[1] * speeds[speed].multiplier, 0);
    document.querySelector("#total").textContent = money(total);
    document.querySelector("#bag-status").textContent = bag.length ? `${bag.length} item${bag.length === 1 ? "" : "s"} · ${bag.map((item) => item[0]).join(", ")}${total > 20 ? " · Free pickup threshold met." : " · Add items to exceed £20 for free pickup."}` : "Your bag is empty.";
    document.querySelector("#pickup-result").textContent = "";
}
document.querySelectorAll("[data-speed]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        speed = button.dataset.speed;
        render();
    });
});
document.querySelector("#clear").addEventListener("click", () =>
{
    bag.length = 0;
    updateBag();
});
const form = document.querySelector("form");
form.elements.date.min = new Date().toLocaleDateString("en-CA");
form.elements.date.addEventListener("change", () =>
{
    const day = new Date(`${form.elements.date.value}T12:00:00`).getDay();
    form.elements.window.replaceChildren(...(day === 6 ? ["9–11am", "2–4pm"] : day === 0 ? ["Closed on Sunday"] : ["8–10am", "12–2pm", "5–7pm"]).map((text) => new Option(text)));
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#pickup-result");
    const code = form.elements.postcode.value.trim().toUpperCase();
    const valid = ["RG1", "RG2", "RG4", "RG6", "RG30", "RG41"].includes(code);
    const invalid = [...form.querySelectorAll("input")].filter((input) =>
    {
        const okay = input.checkValidity() && (input.name !== "postcode" || valid);
        input.setAttribute("aria-invalid", String(!okay));
        return !okay;
    });
    if (invalid.length)
    {
        result.textContent = "Enter a covered outward postcode, a future date and a valid email.";
        invalid[0].focus();
    }
    else if (new Date(`${form.elements.date.value}T12:00:00`).getDay() === 0)
    {
        result.textContent = "Sunday is closed. Please choose Monday to Saturday.";
    }
    else if (total <= 20)
    {
        result.textContent = "Add garments worth more than £20 to your bag for free pickup.";
    }
    else
    {
        result.textContent = `Local review: ${code}, ${form.elements.date.value}, ${form.elements.window.value}, ${money(total)} estimated. Nothing sent or reserved. Final care and specialist turnaround need assessment.`;
    }
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
render();
