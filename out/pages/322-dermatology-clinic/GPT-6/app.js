const treatments = {
    medical: [
        ["Skin Cancer Screening", "Assessment of moles and skin changes.", "Ask what an examination involves and how any follow-up is communicated."],
        ["Mole & Lesion Removal", "Discuss assessment and removal options.", "Ask about the reason for removal, risks, pathology and aftercare."],
        ["Acne Treatment", "An individual conversation about acne care.", "Bring a list of products and treatments you have used."],
        ["Eczema & Psoriasis", "Explore assessment and long-term management.", "Ask about triggers, treatment choices and monitoring."],
        ["Rosacea Management", "Discuss persistent redness and sensitivity.", "Prepare questions about symptoms and suitable care options."],
        ["Pediatric Dermatology", "Skin concerns for children and families.", "Ask about guardian consent and preparation for your child's visit."]
    ],
    cosmetic: [
        ["Botulinum Toxin", "Consultation about expression lines.", "Discuss suitability, risks and expected limitations. Illustrative pricing: from $12/unit."],
        ["Dermal Filler", "Consider goals, alternatives and risks.", "A qualified professional must assess suitability. Illustrative pricing: from $700/syringe."],
        ["Laser Resurfacing", "Explore texture and sun damage concerns.", "Ask about skin type suitability, downtime and recovery. Illustrative pricing: from $900."],
        ["Chemical Peels", "Talk about pigmentation and surface texture.", "Discuss peel depth, preparation and aftercare. Illustrative pricing: from $250."],
        ["Microneedling with PRP", "An assessment-led cosmetic discussion.", "Ask about evidence, risks and whether alternatives are appropriate. Illustrative pricing: from $650."],
        ["Vascular & Pigment Laser", "Discuss visible vessels and pigment concerns.", "Ask about assessment before treatment. Illustrative pricing: from $400."]
    ]
};
let track = "medical";
function selectTrack(value)
{
    track = value;
    document.querySelectorAll("[data-track]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.track === track)));
    document.querySelector("#visit-track").value = track;
    const grid = document.querySelector("#treatment-grid");
    grid.classList.toggle("cosmetic", track === "cosmetic");
    grid.innerHTML = treatments[track].map((item, index) => `<article class="treatment"><span class="badge">${track === "medical" ? "CHECK COVERAGE" : "SELF-PAY · INDICATIVE FEES"}</span><h3>${item[0]}</h3><p>${item[1]}</p><details><summary>What to expect</summary><p>${item[2]}</p><button data-treatment="${index}">Enquire about this visit ↗</button></details></article>`).join("");
    document.querySelector("#status").textContent = "";
}
document.querySelectorAll("[data-track]").forEach((button) => button.addEventListener("click", () => selectTrack(button.dataset.track)));
document.querySelectorAll("[data-path]").forEach((link) => link.addEventListener("click", () => selectTrack(link.dataset.path)));
selectTrack("medical");
document.querySelector("#treatment-grid").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-treatment]");
    if (!button) return;
    document.querySelector("#topic").value = treatments[track][Number(button.dataset.treatment)][0];
    document.querySelector("#appointment").scrollIntoView();
});
const conditions = ["Acne", "Eczema", "Psoriasis", "Rosacea", "Melanoma", "Basal cell carcinoma", "Moles", "Warts", "Hair loss", "Hyperhidrosis", "Vitiligo", "Shingles", "Cysts", "Keratosis", "Nail disorders", "Rashes", "Hives", "Sun damage", "Scarring", "Melasma"];
document.querySelector("#conditions").innerHTML = conditions.map((condition) => `<button>${condition}</button>`).join("");
document.querySelector("#conditions").addEventListener("click", (event) =>
{
    if (event.target.tagName !== "BUTTON") return;
    selectTrack("medical");
    const topic = event.target.textContent;
    document.querySelector("#topic").value = topic;
    document.querySelector("#condition-status").textContent = `${topic} selected for a medical visit enquiry. A clinician must assess your concern.`;
});
document.querySelectorAll("[data-location]").forEach((button) => button.addEventListener("click", () =>
{
    const location = button.dataset.location;
    document.querySelectorAll("[data-location]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelector("#location").value = location;
    document.querySelector("#pin span").textContent = location;
    document.querySelector("#pin").style.left = location === "Seattle" ? "47%" : "60%";
    document.querySelector("#location-copy").textContent = `${location} · Concept location. Contact a real clinic to verify its address, hours and parking.`;
}));
document.querySelector("#cost-link").addEventListener("click", () => document.querySelector("#topic").value = "Cost estimate and coverage");
document.querySelector("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const topic = document.querySelector("#topic").value.trim();
    const status = document.querySelector("#status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!topic)
    {
        status.textContent = "Choose or enter an enquiry topic.";
        return;
    }
    status.textContent = `${name}: ${document.querySelector("#visit-track").value} visit · ${document.querySelector("#location").value} · ${topic}. Sample request only. Nothing sent or booked.`;
});
document.querySelectorAll("form input, form select").forEach((input) => input.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
