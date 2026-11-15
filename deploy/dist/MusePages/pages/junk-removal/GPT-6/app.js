const accepted = ["Furniture", "Mattresses", "Fridges & appliances", "Garden waste", "Garage clear-outs", "Office clear-outs", "Sheds & decking", "Hot tubs", "Builders’ waste", "TVs & electricals", "Carpets & flooring", "General household"];
const rejected = ["Asbestos", "Liquid paint", "Car tyres"];
const loads =
[
    ["Quarter load", 95, "A few bags, a mattress or a couple of chairs.", 25],
    ["Half load", 165, "A small bedroom or a cleared shed.", 50],
    ["Three-quarter load", 225, "A garage or a small flat’s furniture.", 75],
    ["Full load", 290, "A house clearance or a full office.", 100]
];
let items = new Set();
let load = null;
let prepared = "";
function invalidate()
{
    prepared = "";
    document.querySelector("#download").disabled = true;
    document.querySelector("#plan-result").textContent = "";
}
function render()
{
    const query = document.querySelector("#search").value.toLowerCase();
    const visible = [...accepted, ...rejected].filter((name) => name.toLowerCase().includes(query));
    document.querySelector("#items").innerHTML = visible.map((name) => `<button class="item ${rejected.includes(name) ? "rejected" : ""}" data-item="${name}" aria-pressed="${items.has(name)}">${rejected.includes(name) ? "SPECIALIST / " : items.has(name) ? "✓ " : "+ "}${name}</button>`).join("");
    document.querySelector("#empty").hidden = visible.length > 0;
    document.querySelector("#selected").replaceChildren(...[...items].map((name) =>
    {
        const row = document.createElement("p");
        row.textContent = name;
        const button = document.createElement("button");
        button.textContent = "Remove ×";
        button.onclick = () =>
        {
            items.delete(name);
            invalidate();
            render();
        };
        row.append(button);
        return row;
    }));
    if (!items.size) document.querySelector("#selected").textContent = "Your clear-out list is empty.";
}
document.querySelector("#loads").innerHTML = loads.map(([name, price, text, fill], id) => `<button class="load" data-load="${id}" aria-pressed="false"><div class="truck" aria-hidden="true"><i style="height:${fill}%"></i></div><span>${name}</span><strong>£${price}</strong><small>${text}</small></button>`).join("");
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-item]");
    if (button)
    {
        const name = button.dataset.item;
        if (rejected.includes(name))
        {
            document.querySelector("#item-status").textContent = `${name}: specialist disposal required. Not added to your household list.`;
            return;
        }
        if (items.has(name)) items.delete(name);
        else items.add(name);
        document.querySelector("#item-status").textContent = `${items.size} accepted item types in your local list. Actual disposal requires assessment.`;
        invalidate();
        render();
    }
    const band = event.target.closest("[data-load]");
    if (band)
    {
        load = Number(band.dataset.load);
        document.querySelectorAll("[data-load]").forEach((el) => el.setAttribute("aria-pressed", String(el === band)));
        document.querySelector("#load-status").textContent = `${loads[load][0]} selected: stated example £${loads[load][1]}. ${loads[load][2]} Assessment still required.`;
        invalidate();
    }
});
document.querySelector("#search").oninput = render;
document.querySelector("#clear").onclick = () =>
{
    items.clear();
    load = null;
    document.querySelectorAll("[data-load]").forEach((el) => el.setAttribute("aria-pressed", "false"));
    document.querySelector("#load-status").textContent = "Choose a stated load band for your checklist.";
    invalidate();
    render();
};
document.querySelector("#plan-form").oninput = invalidate;
document.querySelector("#plan-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const result = document.querySelector("#plan-result");
    if (!items.size || load === null || !f.area.value || f.access.value.trim().length < 10 || !f.safe.checked)
    {
        result.textContent = "Add accepted items, choose a load band and area, describe access (10+ characters), and confirm the hazardous-material check.";
        return;
    }
    if (f.area.value === "Elsewhere")
    {
        result.textContent = "Outside the example service areas. Find a suitable local licensed carrier; no pickup arranged.";
        return;
    }
    prepared = `HAUL CO. LOCAL CHECKLIST — NOT A BOOKING\nArea: ${f.area.value}\nItems: ${[...items].join(", ")}\nBand: ${loads[load][0]} — stated example £${loads[load][1]}\nAccess: ${f.access.value.trim()}\nHazardous materials excluded by visitor. Professional assessment required.\nNo collection, price guarantee or reservation created.`;
    result.textContent = `${items.size} item type(s), ${loads[load][0]}, ${f.area.value}: checklist prepared locally. No pickup booked.`;
    document.querySelector("#download").disabled = false;
};
document.querySelector("#download").onclick = () =>
{
    if (!prepared) return;
    const url = URL.createObjectURL(new Blob([prepared], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "haul-clear-out-checklist.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
render();
