const $ = (s) => document.querySelector(s);
const frames = [
    { name: "The Marlow", material: "Titanium · 30 colourways · Made in Austria", price: 195, filter: 0, group: "Designer" },
    { name: "The Camden", material: "Acetate · 12 colourways · Handmade in Italy", price: 225, filter: 75, group: "Designer" },
    { name: "The Mayfair", material: "Stainless Steel · 18 colourways · Japanese engineering", price: 175, filter: 170, group: "Reading" }
];
let current = 0;
const shortlist = new Set();
function openFrame(i)
{
    current = i;
    $("#frame-title").textContent = frames[i].name;
    $("#frame-description").textContent = `${frames[i].material} · £${frames[i].price}. Illustrative specifications only; no verified stock.`;
    $("#frame-art").innerHTML = `<img src="frames.svg" alt="${frames[i].name} original concept illustration">`;
    $("#finish").value = "0";
    $("#frame-art img").style.filter = `hue-rotate(${frames[i].filter}deg)`;
    $("#shortlist").textContent = shortlist.has(i) ? "Remove from local shortlist" : "Add to local shortlist";
    $("#shortlist-result").textContent = "";
    $("#explorer").showModal();
}
function render()
{
    const filter = $("#collection").value;
    const selected = frames.map((frame, i) => ({ frame, i })).filter(({ frame, i }) => filter === "all" || (filter === "Shortlist" ? shortlist.has(i) : frame.group === filter));
    $("#frame-grid").innerHTML = selected.map(({ frame, i }) => `<article class="frame-card"><img src="frames.svg" alt="${frame.name} illustrated frame study" style="filter:hue-rotate(${frame.filter}deg)"><div class="frame-body"><h3>${frame.name}</h3><p>${frame.material}</p><div><strong>£${frame.price}</strong><button data-frame="${i}">Explore ${shortlist.has(i) ? "· saved" : "↗"}</button></div></div></article>`).join("");
    $("#frame-count").textContent = `${selected.length} of 3 frame concepts · ${shortlist.size} in your tab-local shortlist`;
    $("#no-frames").hidden = selected.length !== 0;
    document.querySelectorAll("[data-frame]").forEach((button) => button.onclick = () => openFrame(Number(button.dataset.frame)));
}
$("#collection").addEventListener("change", render);
$("#reset-frames").addEventListener("click", () =>
{
    $("#collection").value = "all";
    render();
});
document.querySelectorAll("[data-collection]").forEach((button) => button.addEventListener("click", () =>
{
    $("#collection").value = button.dataset.collection;
    render();
    $("#frames").scrollIntoView();
}));
$("#finish").addEventListener("change", () =>
{
    $("#frame-art img").style.filter = `hue-rotate(${frames[current].filter + Number($("#finish").value)}deg)`;
});
$("#shortlist").addEventListener("click", () =>
{
    if (shortlist.has(current)) shortlist.delete(current);
    else shortlist.add(current);
    const saved = shortlist.has(current);
    $("#shortlist").textContent = saved ? "Remove from local shortlist" : "Add to local shortlist";
    $("#shortlist-result").textContent = saved ? `${frames[current].name} added to this tab’s shortlist. No frame reserved or enquiry sent.` : `${frames[current].name} removed from the local shortlist.`;
    render();
});
$("#close-explorer").addEventListener("click", () => $("#explorer").close());
render();
$("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const type = $("#visit-type").value;
    const session = $("#session").value;
    let message;
    if (!type || !session) message = "Choose a visit type and preferred session to build a note.";
    else
    {
        const cost = { eye: "sample £35", lens: "sample £45", child: "eligibility and provider participation must be confirmed; no free test assumed", frame: "frame and lens costs to discuss" }[type];
        message = `Preparation note: ${session} / ${cost}. Bring current glasses and any prescription or lens details you already have. Ask a qualified practice what else is needed. No appointment booked or medical assessment made.`;
    }
    $("#visit-result").textContent = message;
});
$("#visit-form").addEventListener("reset", () => $("#visit-result").textContent = "");
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
}
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", String($("#nav").classList.toggle("open"))));
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
