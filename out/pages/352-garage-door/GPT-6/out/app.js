const repairs =
[
    ["spring", "Broken spring.", "The door suddenly weighs seventy kilos. Usually £180 to £240 for a pair.", "Stop using the door"],
    ["cable", "Cable off the drum.", "The door hangs crooked and jams. Usually £120 to £160.", "Stop using the door"],
    ["motor", "Motor failure.", "The door is fine, the opener is not. Usually £220 to £390 depending on the unit.", "Ask about safe manual use"],
    ["track", "Off its track.", "Nearly always a bent roller or a knock. Usually £140.", "Leave it closed"]
];
function renderRepairs()
{
    const key = document.querySelector("#symptom").value;
    const selected = repairs.filter((item) => !key || item[0] === key);
    document.querySelector("#repair-list").innerHTML = selected.map((item) => `<article class="repair"><span class="meta">${String(repairs.indexOf(item) + 1).padStart(2, "0")}</span><h3>${item[1]}</h3><p>${item[2]}</p><strong>${item[3].toUpperCase()}</strong></article>`).join("");
    document.querySelector("#repair-count").textContent = `${selected.length} repair ${selected.length === 1 ? "guide" : "guides"} shown. Costs are illustrative.`;
}
document.querySelector("#symptom").addEventListener("change", renderRepairs);
renderRepairs();
const fits = [["Up and over", "Billericay"], ["Sectional", "Chelmsford"], ["Side hinged", "Maldon"], ["Roller", "Basildon"], ["Automation", "Brentwood"]];
document.querySelector("#fits").innerHTML = fits.map(([door, town], i) => `<figure><svg role="img" aria-label="${door} concept illustration in ${town}" style="filter:${["none", "saturate(.6)", "sepia(.4)", "brightness(.95)", "saturate(.3)"][i]}"><use href="#house"/></svg><figcaption>${town} / ${door}</figcaption></figure>`).join("");
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const postcode = form.elements.postcode.value.trim().toUpperCase().replace(/\s/g, "");
    const result = document.querySelector("#quote-result");
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(postcode))
    {
        result.textContent = "Enter a full UK postcode, such as CM1 1AA.";
        return;
    }
    if (!/^(CM|SS|CO|RM|IG|E)\d/.test(postcode))
    {
        result.textContent = "That postcode is outside this illustrative Essex and east London coverage. Call to ask before planning a visit.";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter a valid email address.";
        return;
    }
    const service = form.elements.service;
    result.textContent = `${service.selectedOptions[0].textContent}: from £${Number(service.value).toLocaleString("en-GB")} fitted, VAT included. Coverage matches ${postcode}. Local preview only; no enquiry sent, no visit booked. Final price needs a survey.`;
});
