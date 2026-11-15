const stock = [
    { year: 1978, name: "Fender Stratocaster", type: "Electric", condition: "Excellent", price: 2850, note: "Original-pickup and 1990s-refinish description from the sample brief. No authenticity inspection has taken place." },
    { year: 1965, name: "Vox AC30 Top Boost", type: "Amp", condition: "Very good", price: 2200, note: "Sample notes describe original speakers and one replaced valve. No actual amp or recent service is verified." },
    { year: 2019, name: "Gibson Les Paul Standard", type: "Electric", condition: "Mint", price: 1690, note: "Sample listing describes light use, case and paperwork. Age and condition require real inspection." },
    { year: 2021, name: "Martin D-28", type: "Acoustic", condition: "Excellent", price: 1950, note: "Sample notes mention belt marks on the back. A tonal description is subjective and not verified here." },
    { year: 1972, name: "Fender Precision Bass", type: "Bass", condition: "Good", price: 1780, note: "Heavily played example with replaced tuners. Neck condition and originality are not verified." },
    { year: 1990, name: "Marshall JCM800 2203", type: "Amp", condition: "Very good", price: 1150, note: "Sample listing describes an unmodified amp. No service history or electrical safety is represented." },
    { year: 2016, name: "Fender Telecaster American Pro", type: "Electric", condition: "Excellent", price: 890, note: "Sample model/year pairing and lower-bout ding from the brief. Historical specification and condition need independent verification." },
    { year: 1968, name: "Framus Texan", type: "Acoustic", condition: "Good", price: 640, note: "An illustrative characterful acoustic listing, not a confirmed instrument or valuation." },
    { year: 2020, name: "Rickenbacker 4003", type: "Bass", condition: "Excellent", price: 1590, note: "Fireglo, original case and one-owner story are sample notes only." },
    { year: 1980, name: "Roland Jazz Chorus JC-120", type: "Amp", condition: "Good", price: 780, note: "A sample large clean amplifier listing. Weight, condition and operation need confirmation." },
    { year: 2018, name: "PRS SE Custom 24", type: "Electric", condition: "Very good", price: 480, note: "An illustrative lower-priced used electric, not an actual offer or value guarantee." },
    { year: 1976, name: "Yamaha FG-180", type: "Acoustic", condition: "Good", price: 390, sold: true, note: "Sold in the sample inventory. No interest request or reservation can be created for this entry." }
];
const jobs = [
    ["Standard setup", "£55", "3–4 days"],
    ["Setup with new strings", "£68", "3–4 days"],
    ["Fret dress and polish", "£145", "1 week"],
    ["Full refret", "£340", "2–3 weeks"],
    ["Nut replacement, bone", "£75", "1 week"],
    ["Electronics rewire", "£95", "1 week"],
    ["Pickup fitting", "£45 per pickup", "3 days"],
    ["Acoustic bridge reglue", "£160", "2 weeks"],
    ["Amp service and retube", "£120 plus valves", "1–2 weeks"],
    ["Structural crack repair", "From £180", "After inspection"]
];
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
let type = "All";
function decadeOf(year)
{
    return year >= 2000 ? "2000s+" : `${Math.floor(year / 10) * 10}s`;
}
function render()
{
    const decade = document.querySelector("#decade").value;
    const condition = document.querySelector("#condition").value;
    const max = Number(document.querySelector("#max-price").value);
    document.querySelector("#price-label").textContent = money(max);
    const shown = stock.map((item, index) => ({ item, index })).filter(({ item }) => (type === "All" || item.type === type) && (decade === "All" || decadeOf(item.year) === decade) && (condition === "All" || item.condition === condition) && item.price <= max && (!document.querySelector("#available").checked || !item.sold));
    document.querySelector("#stock-count").textContent = `${shown.length} sample listing${shown.length === 1 ? "" : "s"} shown. Not live inventory.`;
    document.querySelector("#gear-grid").innerHTML = shown.length ? shown.map(({ item, index }) => `<article class="gear-card"><div class="gear-art ${item.type.toLowerCase()}">${item.type === "Amp" ? '<div class="amp-art" aria-hidden="true"></div>' : '<img src="guitar.svg" alt="Stylised instrument illustration, not an actual product photo">'}${item.sold ? '<span class="sold-badge">SOLD / SAMPLE</span>' : ""}</div><h3>${item.year} ${item.name}</h3><p class="condition">${item.type} / ${item.condition}</p><div class="gear-bottom"><b>${money(item.price)}</b><button data-gear="${index}" aria-label="Details for ${item.year} ${item.name}">DETAILS ↗</button></div></article>`).join("") : '<p class="empty">No sample gear matches these filters. Try another type or reset the filters.</p>';
    document.querySelectorAll("[data-gear]").forEach((button) => button.addEventListener("click", () => openGear(Number(button.dataset.gear))));
}
document.querySelectorAll("[data-type]").forEach((button) => button.addEventListener("click", () =>
{
    type = button.dataset.type;
    document.querySelectorAll("[data-type]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render();
}));
["#decade", "#condition", "#available"].forEach((id) => document.querySelector(id).addEventListener("change", render));
document.querySelector("#max-price").addEventListener("input", render);
document.querySelector("#reset-filters").addEventListener("click", () =>
{
    type = "All";
    document.querySelector("#decade").value = "All";
    document.querySelector("#condition").value = "All";
    document.querySelector("#max-price").value = "4000";
    document.querySelector("#available").checked = false;
    document.querySelectorAll("[data-type]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.type === "All")));
    render();
});
document.querySelector("#filter-toggle").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("#filters").classList.toggle("open", open);
});
const detail = document.querySelector("#gear-detail");
let selectedGear;
function openGear(index)
{
    selectedGear = stock[index];
    document.querySelector("#detail-name").textContent = `${selectedGear.year} ${selectedGear.name}`;
    document.querySelector("#detail-meta").textContent = `${selectedGear.type} / ${selectedGear.condition} / ${selectedGear.sold ? "SOLD SAMPLE" : "SAMPLE LISTING"}`;
    document.querySelector("#detail-note").textContent = selectedGear.note;
    document.querySelector("#detail-price").textContent = money(selectedGear.price);
    document.querySelector("#gear-interest").disabled = Boolean(selectedGear.sold);
    document.querySelector("#interest-result").textContent = "";
    detail.showModal();
}
document.querySelector("#close-detail").addEventListener("click", () => detail.close());
document.querySelector("#gear-interest").addEventListener("click", () =>
{
    if (!selectedGear || selectedGear.sold) return;
    document.querySelector("#interest-result").textContent = `Local interest note: ${selectedGear.year} ${selectedGear.name}, sample ${money(selectedGear.price)}. No enquiry sent, stock held or purchase made.`;
});
document.querySelector("#jobs").innerHTML = jobs.map(([name, price, time], index) => `<div class="job-row"><button data-job="${index}"><span>${name}</span><b>${price} ↗</b></button><p>SAMPLE TURNAROUND / ${time}</p></div>`).join("");
document.querySelector("#job").innerHTML = jobs.map(([name, price], index) => `<option value="${index}">${name} · ${price}</option>`).join("");
document.querySelectorAll("[data-job]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#job").value = button.dataset.job;
    document.querySelector("#setup").scrollIntoView();
}));
const setup = document.querySelector("#setup-form");
setup.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(setup);
    let text;
    if (!data.get("instrument").trim()) text = "Add an example instrument.";
    else if (data.get("issue").trim().length < 10) text = "Describe the issue in at least 10 characters.";
    else if (!data.get("ack")) text = "Confirm the local-only acknowledgement.";
    else
    {
        const [name, price, time] = jobs[Number(document.querySelector("#job").value)];
        text = `Local repair note: ${data.get("instrument").trim()} / ${name} / sample ${price}, ${time}. Issue: ${data.get("issue").trim()}. No enquiry sent, repair assessed or slot booked.`;
    }
    document.querySelector("#setup-result").textContent = text;
});
setup.addEventListener("reset", () => { document.querySelector("#setup-result").textContent = ""; });
const trade = document.querySelector("#trade");
trade.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const category = document.querySelector("#trade-category").value;
    const raw = document.querySelector("#retail").value;
    const retail = Number(raw);
    let text;
    if (["Digital modelling amp", "Beginner pack"].includes(category)) text = "This category is outside the sample trade-in policy. No valuation can be offered.";
    else if (document.querySelector("#neck").checked) text = "A known or suspected neck crack needs specialist inspection; this planner cannot value it.";
    else if (!raw || !Number.isFinite(retail) || retail <= 0 || retail > 20000) text = "Enter an example retail estimate greater than £0 and up to £20,000.";
    else text = `Illustrative trade-credit idea: ${money(retail * .6)} (60% of your ${money(retail)} retail estimate). Not an offer or valuation; inspection, resale costs and condition change real figures. Cash terms would need separate confirmation. Nothing submitted.`;
    document.querySelector("#trade-result").textContent = text;
});
trade.addEventListener("reset", () => { document.querySelector("#trade-result").textContent = ""; });
const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}
menu.addEventListener("click", () =>
{
    nav.classList.add("open");
    menu.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    document.querySelector("#close-menu").focus();
});
document.querySelector("#close-menu").addEventListener("click", closeMenu);
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (nav.classList.contains("open") && event.key === "Escape")
    {
        closeMenu();
        menu.focus();
    }
    if (nav.classList.contains("open") && event.key === "Tab")
    {
        const nodes = [...nav.querySelectorAll("button, a")];
        if (event.shiftKey && document.activeElement === nodes[0])
        {
            event.preventDefault();
            nodes.at(-1).focus();
        }
        else if (!event.shiftKey && document.activeElement === nodes.at(-1))
        {
            event.preventDefault();
            nodes[0].focus();
        }
    }
});
render();
