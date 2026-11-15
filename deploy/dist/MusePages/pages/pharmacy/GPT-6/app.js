function pharmacyStatus(date = new Date())
{
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone:"Europe/London", weekday:"short", hour:"2-digit", minute:"2-digit", hourCycle:"h23" }).formatToParts(date).map((part) => [part.type,part.value]));
    const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const day = weekdays.indexOf(parts.weekday);
    const minute = Number(parts.hour) * 60 + Number(parts.minute);
    const weekday = day > 0 && day < 6;
    if (weekday && ((minute >= 540 && minute < 780) || (minute >= 810 && minute < 1110)))
    {
        return { open:true, text:`Open until ${minute < 780 ? "1pm" : "6:30pm"}${minute < 780 ? " · lunch 1–1:30pm" : ""}` };
    }
    if (day === 6 && minute >= 540 && minute < 780) return { open:true, text:"Open until 1pm" };
    if (weekday && minute >= 780 && minute < 810) return { open:false, text:"Closed for lunch · reopens 1:30pm" };
    if ((weekday || day === 6) && minute < 540) return { open:false, text:"Closed · opens 9am today" };
    if (day === 6 || day === 0 || day === 5) return { open:false, text:"Closed · opens Monday 9am" };
    return { open:false, text:"Closed · opens 9am tomorrow" };
}
window.pharmacyStatus = pharmacyStatus;
function updateStatus()
{
    const status = pharmacyStatus();
    const pill = document.querySelector("#status");
    pill.textContent = `Example hours · ${status.text}`;
    pill.classList.toggle("open", status.open);
    pill.title = "Computed in Europe/London from fictional supplied hours; bank holidays and actual service changes are unknown.";
}
updateStatus();
setInterval(updateStatus, 60000);
const serviceInfo =
[
    ["NHS Prescriptions","Prescription dispensing depends on valid authorisation, clinical checks and stock. This fictional site cannot take orders, contact your GP or supply medicine."],
    ["Private Prescriptions","A real registered pharmacy needs a valid prescription and its own clinical and legal checks. No prescription upload or dispensing service is connected."],
    ["Vaccinations","Current eligibility, age criteria, clinical suitability and stock must be checked by a qualified provider. Sample clinic prices are not verified."],
    ["Blood Pressure Checks","Ask a real pharmacist whether a blood pressure service is suitable and available. This page does not measure, interpret or diagnose blood pressure."],
    ["Medicine Use Reviews","Arrange a review with a real pharmacist and bring an up-to-date medicine list through their approved route. Keep medicine details off this demo."],
    ["Travel Health Clinic","The brief suggests allowing six weeks before travel. A real travel clinician must assess destination, itinerary, timing and individual suitability."],
    ["Minor Ailments Service","A real pharmacist can advise on appropriate care and when to seek other help. This site is not staffed and cannot assess symptoms or diagnose an illness."],
    ["Free Local Delivery","The sample area is CT5 and parts of CT2 within three miles. Delivery depends on a ready prescription and confirmed local logistics. No service is connected."]
];
document.querySelector("#service-grid").innerHTML = serviceInfo.map(([name],index) => `<button data-service="${index}"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>${name}<span aria-hidden="true">↗</span></button>`).join("");
const dialog = document.querySelector("#detail");
function show(title, label, copy)
{
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-label").textContent = label;
    document.querySelector("#detail-copy").textContent = copy;
    dialog.showModal();
}
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    const [name,copy] = serviceInfo[Number(button.dataset.service)];
    show(name, "SERVICE INFORMATION · FICTIONAL PROVIDER", copy);
}));
document.querySelector("#ask").addEventListener("click", () => show("Ask a real pharmacist.", "THIS SITE IS NOT MONITORED", "No confidential conversation, diagnosis or clinical advice takes place here. Contact a real registered pharmacy through its verified details. For urgent non-emergency health help in England use NHS 111; for a life-threatening emergency call 999. Avoid entering symptoms or personal medical information into this demonstration."));
document.querySelector("#close").addEventListener("click", () => dialog.close());
const advice =
{
    antibiotics:["Do I actually need antibiotics for this?","Antibiotics do not treat viral infections. Whether an illness needs antibiotics requires appropriate clinical assessment. Ask a qualified clinician; this page cannot assess symptoms, choose treatment or change a prescribed course."],
    inhaler:["Inhaler technique is device-specific.","There is no single technique for every inhaler. Ask your pharmacist to demonstrate your prescribed device and check your technique. Follow the supplied instructions and your agreed care plan. A ninety-second video was not supplied, so none is simulated here."],
    travel:["A first aid kit starts with your itinerary.","Consider basic dressings, copies of prescriptions and necessary medicines in their original packaging. Ask a real pharmacist or travel clinic about your destination and personal circumstances, and check local medicine-entry rules. This is a general preparation note, not a medicine recommendation."]
};
document.querySelectorAll("[data-advice]").forEach((button) => button.addEventListener("click", () => show(advice[button.dataset.advice][0], "GENERAL INFORMATION, NOT INDIVIDUAL ADVICE", advice[button.dataset.advice][1])));
document.querySelector("#complaints").addEventListener("click", () => show("Complaints procedure", "DEMONSTRATION INFORMATION", "This fictional website does not operate a pharmacy or handle clinical complaints. For a real service concern, contact the actual provider using verified details and request its complaints procedure. Registration numbers and staff in this brief have not been verified; check real providers through the GPhC register."));
const method = document.querySelector("#method");
function methodNote()
{
    document.querySelector("#postcode-label").hidden = method.value !== "delivery";
}
method.addEventListener("change", methodNote);
const repeat = document.querySelector("#repeat-form");
const repeatResult = document.querySelector("#repeat-result");
repeat.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const postcode = document.querySelector("#postcode").value.trim().toUpperCase().replace(/\s+/g,"");
    if (method.value === "delivery" && !/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(postcode))
    {
        repeatResult.textContent = "Enter a full example UK postcode for delivery planning.";
        return;
    }
    if (!document.querySelector("#repeat-ack").checked)
    {
        repeatResult.textContent = "Acknowledge this does not request or dispense medicine.";
        return;
    }
    const delivery = /^(CT5|CT2)\d[A-Z]{2}$/.test(postcode) ? "Sample CT5/CT2 area match only; parts of CT2 and the three-mile radius need direct confirmation." : "This postcode is outside the sample list; confirm coverage with a real pharmacy.";
    repeatResult.textContent = `Local checklist:\n1. Contact a real registered pharmacy through its approved request route.\n2. Confirm authorisation, stock and expected readiness; 48 hours is a brief example, not a deadline.\n3. ${method.value === "delivery" ? delivery + " Confirm delivery day and the ready-prescription 11am cut-off." : "Confirm collection time before travelling; weekdays close for lunch 1–1:30pm."}\nNo prescription ordered, no GP contacted, no medicine dispensed.`;
});
repeat.addEventListener("reset", () =>
{
    repeatResult.textContent = "";
    setTimeout(methodNote, 0);
});
const clinic = document.querySelector("#clinic");
function clinicNote()
{
    document.querySelector("#travel-label").hidden = clinic.value !== "travel";
}
clinic.addEventListener("change", clinicNote);
document.querySelectorAll("[data-clinic]").forEach((button) => button.addEventListener("click", () =>
{
    clinic.value = button.dataset.clinic;
    clinicNote();
    location.hash = "clinic-plan";
}));
const clinicForm = document.querySelector("#clinic-form");
const clinicResult = document.querySelector("#clinic-result");
clinicForm.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const consultation = document.querySelector("#clinic-date").value;
    const travel = document.querySelector("#travel-date").value;
    const now = new Date();
    const today = new Intl.DateTimeFormat("en-CA", { timeZone:"Europe/London", year:"numeric", month:"2-digit", day:"2-digit" }).format(now);
    if (!consultation || consultation <= today)
    {
        clinicResult.textContent = "Choose a future preferred consultation date; no availability is checked.";
        return;
    }
    if (clinic.value === "travel" && (!travel || travel <= consultation))
    {
        clinicResult.textContent = "Choose a departure after the preferred consultation date.";
        return;
    }
    if (!document.querySelector("#clinic-ack").checked)
    {
        clinicResult.textContent = "Acknowledge that a real provider must confirm eligibility and appointments.";
        return;
    }
    const days = travel ? Math.round((Date.parse(`${travel}T00:00:00Z`) - Date.parse(`${consultation}T00:00:00Z`)) / 86400000) : 0;
    const note = clinic.value === "travel" ? days < 42 ? "Less than six weeks before travel: contact a real travel clinician promptly; timing and suitability cannot be assessed here." : "At least six weeks before travel in this example; suitability still requires clinical assessment." : "Seasonal NHS eligibility, price and suitability must be confirmed by a real clinician.";
    clinicResult.textContent = `Local preparation note: ${clinic.selectedOptions[0].textContent}, preferred consultation ${consultation}.\n${note}\nNothing sent or booked. No eligibility decision, vaccine reservation or medical advice provided.`;
});
clinicForm.addEventListener("reset", () =>
{
    clinicResult.textContent = "";
    setTimeout(clinicNote, 0);
});
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
