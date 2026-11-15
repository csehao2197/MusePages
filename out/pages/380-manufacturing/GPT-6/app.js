const materials = ["Aluminium", "Stainless", "Tool steel", "Titanium", "Brass", "Engineering plastics"];
const processes = ["CNC milling", "CNC turning", "Wire EDM", "Surface grinding", "Sheet fabrication"];
const levels =
[
    [2, 2, 2, 1, 2, 2],
    [2, 2, 2, 1, 2, 2],
    [1, 2, 2, 1, 2, 0],
    [1, 2, 2, 1, 1, 0],
    [2, 2, 1, 0, 1, 0]
];
const symbol = (level) => ["—", "○", "●"][level];
const status = (level) => ["Not offered in sample", "On request", "Standard sample"][level];
document.querySelector("#matrix-desktop").innerHTML = `<table class="matrix"><thead><tr><th>Process / Material</th>${materials.map((material) => `<th>${material}</th>`).join("")}</tr></thead><tbody>${processes.map((process, r) => `<tr><th scope="row">${process}</th>${materials.map((material, c) => `<td><button data-r="${r}" data-c="${c}" aria-label="${process}, ${material}: ${status(levels[r][c])}" title="${status(levels[r][c])}; select for limits">${symbol(levels[r][c])}</button></td>`).join("")}</tr>`).join("")}</tbody></table>`;
document.querySelector("#matrix-mobile").innerHTML = processes.map((process, r) => `<details><summary>${process}</summary>${materials.map((material, c) => `<button data-r="${r}" data-c="${c}" aria-label="${process}, ${material}: ${status(levels[r][c])}">${material}<span>${symbol(levels[r][c])}</span></button>`).join("")}</details>`).join("");
document.querySelectorAll("[data-r]").forEach((button) => button.addEventListener("click", () =>
{
    const r = Number(button.dataset.r);
    const c = Number(button.dataset.c);
    const level = levels[r][c];
    const limits = ["Sample target ±0.005mm, subject to feature and setup review.", "Sample target ±0.005mm, subject to diameter and geometry review.", "Sample positional target ±0.003mm on suitable conductive stock.", "Sample Ra 0.2 finish target; flatness and material suitability need review.", "Sample capacity to 12mm mild steel; other thicknesses and materials require review."];
    document.querySelector("#capability-detail").textContent = `${processes[r]} / ${materials[c]}: ${status(level)}. ${level ? limits[r] : "No tolerance is offered for this combination."} Illustrative only; confirm against the drawing.`;
}));
document.querySelector("#material").innerHTML = [...materials, "Other / discuss"].map((material) => `<option>${material}</option>`).join("");
const machines =
[
    ["MILL", "Hermle C42U", "5-axis", "800 × 800 × 550mm"],
    ["MILL", "Hermle C32U", "5-axis", "650 × 600 × 500mm"],
    ["MILL", "DMG Mori DMU 50", "5-axis", "500 × 450 × 400mm"],
    ["MILL", "Haas VF-4SS", "3-axis", "1270 × 508 × 635mm"],
    ["MILL", "Haas VF-3", "3-axis", "1016 × 508 × 635mm"],
    ["MILL", "Haas VF-2", "3-axis", "762 × 406 × 508mm"],
    ["MILL", "Matsuura MX-520", "5-axis", "520 × 460 × 400mm"],
    ["TURN", "DMG Mori NLX 2500", "Live tooling / sub-spindle", "Ø366 × 705mm"],
    ["TURN", "Doosan Puma 2600SY", "Y-axis / sub-spindle", "Ø350 × 900mm"],
    ["TURN", "Haas ST-20", "Turning", "Ø356 × 559mm"],
    ["EDM", "Sodick AQ400LS", "Wire", "400 × 300 × 250mm"],
    ["GRIND", "Jones & Shipman 1400", "Surface", "600 × 300mm"],
    ["LASER", "Trumpf TruLaser 3030", "Laser", "12mm mild steel"],
    ["BRAKE", "Amada HFE 1303", "Press brake", "3m / 130 tonne"]
];
function renderMachines()
{
    const query = document.querySelector("#machine-search").value.trim().toLowerCase();
    const matches = machines.filter((machine) => machine.join(" ").toLowerCase().includes(query));
    const labels = ["Process", "Make / model", "Configuration", "Envelope / capacity"];
    document.querySelector("#machine-table").innerHTML = `<table class="equipment"><thead><tr>${labels.map((label) => `<th>${label}</th>`).join("")}</tr></thead><tbody>${matches.map((machine) => `<tr>${machine.map((value, index) => `<td data-label="${labels[index]}">${value}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    document.querySelector("#machine-empty").hidden = matches.length > 0;
    document.querySelector("#machine-count").textContent = `${matches.length} / 14 sample entries`;
}
renderMachines();
document.querySelector("#machine-search").addEventListener("input", renderMachines);
const form = document.querySelector("#rfq");
const drawing = form.elements.drawing;
drawing.addEventListener("change", () =>
{
    const file = drawing.files[0];
    document.querySelector("#file-note").textContent = file ? `${file.name} / ${Math.ceil(file.size / 1024)}KB. Metadata only; not read or uploaded.` : "No file selected. Nothing will leave your device.";
});
const today = () =>
{
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
form.elements.date.min = today();
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const result = document.querySelector("#result");
    const quantity = Number(data.get("quantity"));
    if (!String(data.get("company")).trim() || !String(data.get("contact")).trim() || !String(data.get("part")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")))
    {
        result.textContent = "Enter company, contact, part/revision and a valid example email.";
        return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000)
    {
        result.textContent = "Quantity must be a whole number from 1 to 10000.";
        return;
    }
    if (!data.get("date") || data.get("date") < today())
    {
        result.textContent = "Choose today or a future required date. This is not a lead-time commitment.";
        return;
    }
    const file = drawing.files[0];
    if (file && (!/\.(step|stp|iges|igs|dxf|pdf|sldprt|sldasm|f3d)$/i.test(file.name) || file.size > 20 * 1024 * 1024 || file.size === 0))
    {
        result.textContent = "Use a nonempty STEP, IGES, DXF, PDF, SolidWorks or Fusion test file up to 20MB.";
        return;
    }
    if (!data.get("ack"))
    {
        result.textContent = "Confirm that this uses example data and is local only.";
        return;
    }
    result.textContent = `Local RFQ: ${String(data.get("part")).trim()} / ${quantity} × ${data.get("material")} / ${data.get("tolerance")} / required ${data.get("date")}. ${file ? `Drawing name: ${file.name}.` : "No drawing selected."} No request or file sent. Engineering and availability review still required.`;
});
form.addEventListener("reset", () =>
{
    document.querySelector("#result").textContent = "No quote request will be sent.";
    document.querySelector("#file-note").textContent = "No file selected. Nothing will leave your device.";
});
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
