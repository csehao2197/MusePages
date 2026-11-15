const $ = (s) => document.querySelector(s);
$("#base").addEventListener("change", () =>
{
    const signature = $("#base").value === "95";
    $("#signatories").disabled = !signature;
    if (!signature) $("#signatories").value = "1";
    $("#estimate-result").textContent = "";
});
$("#estimate").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const signature = $("#base").value === "95";
    const count = Number($("#signatories").value);
    if (signature && (!Number.isInteger(count) || count < 1 || count > 8))
    {
        $("#estimate-result").textContent = "Enter 1–8 whole signatories for this illustration.";
        return;
    }
    const total = Number($("#base").value) + (signature ? (count - 1) * 40 : 0) + ($("#apostille").checked ? 85 : 0) + ($("#visit").checked ? 60 : 0);
    $("#estimate-result").textContent = `Illustrative subtotal ${$("#visit").checked ? "from " : ""}£${total}, excluding VAT and any additional official disbursements. Not a quote or legal advice; no appointment made.`;
});
$("#estimate").addEventListener("reset", () =>
{
    $("#signatories").disabled = false;
    $("#estimate-result").textContent = "";
});
document.querySelectorAll("[data-document]").forEach((button) => button.addEventListener("click", () =>
{
    $("#document-type").value = button.dataset.document;
    $("#preparation").scrollIntoView();
    $("#checklist-result").textContent = "";
}));
$("#checklist-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const missing = [["#original", "original document"], ["#identity", "identity and address evidence"], ["#country", "receiving authority’s requirements"]].filter(([selector]) => !$(selector).checked).map(([, name]) => name);
    const type = $("#document-type").value;
    const extra = type === "Company documents" ? " Ask about evidence of signatory authority and company records." : type === "Consular legalisation" || type === "Apostilles" ? " Confirm eligibility and the receiving country’s legalisation chain." : " Check any witness, translation and signing requirements.";
    $("#checklist-result").textContent = missing.length ? `Still to prepare: ${missing.join("; ")}.${extra}` : `${type}: checklist reviewed locally.${extra} This does not confirm legal suitability or acceptance.`;
});
$("#checklist-form").addEventListener("reset", () => $("#checklist-result").textContent = "");
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
