const topics =
{
    Home: "Review rebuilding limits, personal property and exclusions with your agent.",
    Auto: "Review liability limits, uninsured motorist protection and deductibles.",
    Life: "Discuss how dependants would meet ongoing expenses after a death.",
    Umbrella: "Ask about liability above underlying policies and eligibility requirements.",
    Disability: "Consider how an illness or injury could affect income and waiting periods.",
    Flood: "Flood is generally excluded from standard homeowners policies. Ask about separate protection and waiting periods."
};
let have = new Set(["Home", "Auto"]);
function render()
{
    document.querySelector("#toggles").innerHTML = Object.keys(topics).map((topic) => `<button aria-pressed="${have.has(topic)}" data-policy="${topic}">${have.has(topic) ? "✓ " : "+ "}${topic}</button>`).join("");
    const gaps = Object.keys(topics).filter((topic) => !have.has(topic));
    document.querySelector("#gap-count").textContent = gaps.length ? `${gaps.length} topics worth a closer look` : "All six selected — review the details.";
    document.querySelector("#gaps").innerHTML = gaps.length ? gaps.map((topic) => `<div class="gap"><strong>${topic}</strong><p>${topics[topic]}</p></div>`).join("") : "<p>Policy names alone cannot confirm adequate coverage. Check limits, exclusions and beneficiaries with a licensed professional.</p>";
}
const personal =
[
    ["Homeowners", "Your home, possessions, liability and loss of use. Replacement valuation and exclusions deserve a close look."],
    ["Auto", "Liability, collision, comprehensive and uninsured motorist options. Limits and deductibles shape the protection."],
    ["Umbrella", "Additional liability coverage above qualifying underlying policies. Eligibility and exclusions vary."],
    ["Life", "Term and permanent options serve different needs. Discuss dependants, duration, cost and underwriting."],
    ["Renters", "Personal belongings, personal liability and additional living expense options for people who rent."],
    ["Flood", "Separate protection for eligible flood damage. Availability, limits and waiting periods vary by policy."]
];
const business =
[
    ["General Liability", "Third-party injury and property-damage exposures, subject to policy terms."],
    ["Commercial Property", "Buildings, equipment and contents; ask separately about business interruption."],
    ["Workers Compensation", "Employee injury coverage and jurisdiction-specific requirements need professional review."],
    ["Commercial Auto", "Owned, hired and non-owned vehicle exposures have different policy requirements."],
    ["Professional Liability", "Errors and omissions risks related to professional services."],
    ["Cyber", "Ask about breach response, interruption, exclusions and incident reporting requirements."]
];
for (const [id, list] of [["personal", personal], ["business", business]])
{
    document.querySelector(`#${id}-grid`).innerHTML = list.map(([name, text], index) => `<article><span>0${index + 1}</span><h3>${name}</h3><p>${text}</p><button class="link" data-detail="${name}">Understand this coverage →</button></article>`).join("");
}
let selected = "";
document.addEventListener("click", (event) =>
{
    const policy = event.target.closest("[data-policy]");
    if (policy)
    {
        const key = policy.dataset.policy;
        if (have.has(key)) have.delete(key);
        else have.add(key);
        render();
    }
    const detail = event.target.closest("[data-detail]");
    if (detail)
    {
        selected = detail.dataset.detail;
        document.querySelector("#detail-title").textContent = selected;
        document.querySelector("#detail-copy").textContent = [...personal, ...business].find(([name]) => name === selected)[1];
        document.querySelector("#detail").showModal();
    }
});
document.querySelector("#reset").onclick = () =>
{
    have = new Set(["Home", "Auto"]);
    render();
};
document.querySelector("#close").onclick = () => document.querySelector("#detail").close();
document.querySelector("#choose").onclick = () =>
{
    document.querySelector("#topic").value = personal.some(([name]) => name === selected) ? selected : "Business coverage";
    document.querySelector("#detail").close();
    document.querySelector("#contact").scrollIntoView();
};
document.querySelector("#discuss").onclick = () => document.querySelector("#topic").value = "Coverage review";
document.querySelector("#quote-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const result = document.querySelector("#form-result");
    if (!f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value))
    {
        result.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!f.consent.checked)
    {
        result.textContent = "Confirm that you understand this local educational preview.";
        return;
    }
    const gaps = Object.keys(topics).filter((topic) => !have.has(topic));
    result.textContent = `Prepared for ${f.name.value.trim()}: ${f.topic.value}. Discussion topics: ${gaps.join(", ") || "review policy details"}. Nothing submitted; no coverage quoted, sold or bound.`;
};
render();
