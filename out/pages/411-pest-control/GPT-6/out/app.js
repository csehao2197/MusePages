const services =
{
    rodents:["Rats & Mice","A qualified technician would assess signs, access points and monitoring needs before discussing a management plan."],
    bedbugs:["Bed Bugs","An inspection helps distinguish suspected activity from other causes. Discreet assessment and a confirmed preparation plan come first."],
    cockroaches:["Cockroaches","Professional identification and site assessment are important, especially for food businesses. Treatment scope depends on the premises."],
    wasps:["Wasps & Hornets","Keep away from suspected nests, keep children and pets clear, and leave the nest undisturbed. Contact a qualified local professional."],
    ants:["Ants","Identification helps a professional understand activity and agree a proportionate, site-specific approach."],
    moths:["Moths & Beetles","A professional can identify the species and assess affected materials before recommending suitable next steps."]
};
const dialog = document.querySelector("#detail");
document.querySelectorAll(".service-icon").forEach((icon) =>
{
    icon.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7h6a4 4 0 0 1 4 4v5a7 7 0 0 1-14 0v-5a4 4 0 0 1 4-4Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2M12 20v-9M3 9h3M18 9h3M2 14h4M18 14h4M3 19h4M17 19h4"/></svg>';
});
let selected = "rodents";
function show(title, label, copy, discuss = false)
{
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-label").textContent = label;
    document.querySelector("#detail-copy").textContent = copy;
    document.querySelector("#discuss").hidden = !discuss;
    dialog.showModal();
}
document.querySelectorAll("[data-pest]").forEach((button) => button.addEventListener("click", () =>
{
    selected = button.dataset.pest;
    show(services[selected][0], "PROFESSIONAL ASSESSMENT", `${services[selected][1]} This is a fictional service preview; no treatment instructions or booking are provided.`, true);
}));
document.querySelector("#discuss").addEventListener("click", () =>
{
    document.querySelector("#pest").value = selected;
    dialog.close();
    location.hash = "contact";
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#terms").addEventListener("click", () => show("About the sample guarantee", "ILLUSTRATIVE TERMS ONLY", "The brief proposes 12 months, re-treatment if needed, no extra charge and no questions asked. No actual provider, eligibility rules or signed terms exist in this demonstration. Do not rely on this as a contract or pest-free guarantee; ask a real provider for written coverage, exclusions and follow-up terms."));
document.querySelector("#blog").addEventListener("click", () => show("Start with identification", "HOME PROTECTION NOTES", "Record what you have noticed without disturbing suspected nests or handling unknown pests. A qualified local professional can assess the situation and advise on next steps. This static concept does not provide DIY chemical instructions."));
const normalize = (value) => value.trim().toUpperCase().replace(/\s+/g,"");
function validPostcode(value)
{
    return /^(GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/.test(normalize(value));
}
document.querySelector("#postcode-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = normalize(document.querySelector("#postcode").value);
    let message;
    if (!validPostcode(value)) message = "Enter a full UK postcode, for example SW1A 1AA.";
    else if (/^(SW1[A-Z]?|SW2|SE1)\d[A-Z]{2}$/.test(value))
    {
        message = "Matches an illustrative London sample zone only. Actual coverage and availability are unconfirmed.";
        document.querySelector("#quote-postcode").value = document.querySelector("#postcode").value.trim().toUpperCase();
    }
    else message = "Not in the small sample zone list. This does not mean you are outside real coverage; contact a provider to confirm.";
    document.querySelector("#coverage-result").textContent = message;
});
const form = document.querySelector("#quote-form");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email");
    if (!validPostcode(document.querySelector("#quote-postcode").value))
    {
        result.textContent = "Enter a full UK postcode to prepare the local enquiry.";
        return;
    }
    if (!email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter a valid example email address.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Acknowledge this is a local demonstration.";
        return;
    }
    result.textContent = `Local enquiry prepared: ${document.querySelector("#property").value} · ${document.querySelector("#pest").selectedOptions[0].textContent} · ${document.querySelector("#quote-postcode").value.trim().toUpperCase()}.\nNothing sent or booked. Coverage, price, licensing and treatment suitability are not confirmed.`;
});
form.addEventListener("reset", () => result.textContent = "");
const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
