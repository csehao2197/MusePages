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
const counts = { Boxes: 0, Sofas: 0, Beds: 0, Desks: 0, Wardrobes: 0, "Specialist items": 0 };
const inventory = document.querySelector("#inventory");
for (const name of Object.keys(counts))
{
    const row = document.createElement("div");
    row.className = "inventory-row";
    const text = document.createElement("span");
    text.textContent = name;
    const counter = document.createElement("div");
    counter.className = "counter";
    for (const [label, delta] of [["−", -1], ["+", 1]])
    {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.item = name;
        button.dataset.delta = delta;
        button.setAttribute("aria-label", `${delta > 0 ? "Add" : "Remove"} ${name}`);
        button.addEventListener("click", () =>
        {
            counts[name] = Math.max(0, Math.min(99, counts[name] + delta));
            counter.querySelector("output").textContent = counts[name];
        });
        counter.append(button);
        if (delta === -1)
        {
            const output = document.createElement("output");
            output.textContent = "0";
            output.setAttribute("aria-label", `${name} count`);
            counter.append(output);
        }
    }
    row.append(text, counter);
    inventory.append(row);
}
const stages = ["#stage-one", "#stage-two", "#stage-three"];
function showStage(index)
{
    stages.forEach((id, i) => { document.querySelector(id).hidden = i !== index; });
    document.querySelectorAll(".steps li").forEach((item, i) => item.classList.toggle("active", i === index));
    document.querySelector("#error").textContent = "";
}
const date = document.querySelector("#date");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
document.querySelector("#next").addEventListener("click", () =>
{
    const from = document.querySelector("#from").value.trim();
    const to = document.querySelector("#to").value.trim();
    const error = document.querySelector("#error");
    if (!from || !to) error.textContent = "Enter both general areas, without full addresses.";
    else if (from.toLowerCase() === to.toLowerCase()) error.textContent = "Add different areas or a distinct destination description for a local move.";
    else if (!date.value || date.value < date.min) error.textContent = "Choose today or a future preferred date.";
    else showStage(1);
});
document.querySelector("#summary").addEventListener("click", () =>
{
    const entries = Object.entries(counts).filter(([, count]) => count > 0);
    if (!entries.length)
    {
        document.querySelector("#error").textContent = "Add at least one item to the example inventory.";
        return;
    }
    document.querySelector("#summary-copy").textContent = `${document.querySelector("#service").value}: ${document.querySelector("#from").value.trim()} to ${document.querySelector("#to").value.trim()}, preferred ${date.value}.`;
    document.querySelector("#summary-items").replaceChildren(...entries.map(([name, count]) =>
    {
        const li = document.createElement("li");
        li.textContent = `${name}: ${count}`;
        return li;
    }));
    document.querySelector("#access-copy").textContent = `${document.querySelector("#stairs").checked ? "Stairs/access discussion needed. " : ""}${document.querySelector("#fragile").checked ? "Specialist handling discussion needed." : ""}`;
    showStage(2);
});
document.querySelector("#back").addEventListener("click", () => showStage(0));
document.querySelector("#edit").addEventListener("click", () => showStage(1));
const form = document.querySelector("#move");
form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("reset", () =>
{
    Object.keys(counts).forEach((name) => { counts[name] = 0; });
    document.querySelectorAll("output").forEach((output) => { output.textContent = "0"; });
    document.querySelector("#summary-copy").textContent = "";
    document.querySelector("#summary-items").replaceChildren();
    document.querySelector("#access-copy").textContent = "";
    showStage(0);
});
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    showStage(0);
    document.querySelector("#service").value = button.dataset.service;
    document.querySelector("#planner").scrollIntoView();
}));
document.querySelector("#city").addEventListener("change", (event) =>
{
    document.querySelector("#coverage-result").textContent = event.target.value === "Somewhere else" ? "Other destinations need individual confirmation. Add a general area to your brief." : `${event.target.value} is an example route. Confirm distance, access and availability with a real mover.`;
});
document.querySelector("#use-city").addEventListener("click", () =>
{
    showStage(0);
    const city = document.querySelector("#city").value;
    document.querySelector("#to").value = city === "Somewhere else" ? "" : city;
    document.querySelector("#planner").scrollIntoView();
});
