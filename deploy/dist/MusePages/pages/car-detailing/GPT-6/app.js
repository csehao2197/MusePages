const $ = (s) => document.querySelector(s);
const packages = [
    { name: "Entry level detail", price: 150, intro: "A careful reset for a car in regular use.", items: ["pH-appropriate hand wash and wheel clean", "Gentle towel dry and wax application", "Glass clean and light interior vacuum", "Approximately 2–3 hours, subject to inspection"] },
    { name: "Maintenance detail", price: 275, intro: "Consistent care for a finish you want to keep.", items: ["Exterior hand wash and bonded-contamination assessment", "Protective top-up appropriate to existing finish", "Interior surfaces, vacuum and glass", "Approximately 4–5 hours, subject to inspection"] },
    { name: "Full detail", price: 550, intro: "Time, attention and a considered treatment plan.", items: ["Exterior decontamination and finish assessment", "Single-stage enhancement where paint condition allows", "Deep interior clean and surface-appropriate protection", "Approximately one working day; final scope after inspection"] }
];
let service = 0;
function quote()
{
    const p = packages[Number($("#package").value)], factor = Number($("#size").value), condition = Number($("#condition").value), pet = $("#pet").checked ? 60 : 0, fabric = $("#fabric").checked ? 90 : 0;
    const total = Math.round(p.price * factor + condition + pet + fabric);
    $("#total").textContent = `$${total}`;
    $("#breakdown").textContent = `$${p.price} × ${factor} size factor + $${condition} condition + $${pet + fabric} optional care. Indicative USD; inspection required.`;
    $("#email-draft").hidden = true;
    $("#status").textContent = "";
    return total;
}
["package", "size", "condition", "pet", "fabric"].forEach((id) => $(`#${id}`).addEventListener("change", quote));
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    service = Number(button.dataset.service);
    const p = packages[service];
    $("#service-title").textContent = p.name;
    $("#service-intro").textContent = p.intro;
    $("#service-list").innerHTML = p.items.map((item) => `<li>${item}</li>`).join("");
    $("#service-dialog").showModal();
}));
function plan(index)
{
    $("#package").value = index;
    quote();
    $("#contact").scrollIntoView();
}
$("#service-quote").addEventListener("click", () =>
{
    $("#service-dialog").close();
    plan(service);
});
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () => plan(button.dataset.package)));
$("#compare").addEventListener("input", () =>
{
    const value = Number($("#compare").value);
    $("#before").style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    $("#divider").style.left = `${value}%`;
    $("#compare-status").textContent = `${value}% before`;
});
const today = new Date().toISOString().slice(0, 10);
$("#date").min = today;
$("#quote").addEventListener("input", () =>
{
    $("#email-draft").hidden = true;
    $("#status").textContent = "";
});
$("#quote").addEventListener("submit", (event) =>
{
    event.preventDefault();
    let message;
    if ($("#vehicle").value.trim().length < 3) message = "Tell us your vehicle make and model.";
    else if ($("#name").value.trim().length < 2) message = "Please enter your name.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) message = "Please enter a valid email address.";
    else if (!$("#date").value || $("#date").value < today) message = "Choose today or a future preferred date.";
    else
    {
        const total = quote(), p = packages[Number($("#package").value)];
        const body = `Hello LuxureDetails,\n\nVehicle: ${$("#vehicle").value.trim()}\nPackage: ${p.name}\nSize: ${$("#size").selectedOptions[0].textContent}\nCondition: ${$("#condition").selectedOptions[0].textContent}\nPet hair: ${$("#pet").checked}\nFabric protection: ${$("#fabric").checked}\nIndicative quote: $${total} USD\nPreferred date: ${$("#date").value}\nName: ${$("#name").value.trim()}\nEmail: ${$("#email").value.trim()}\n\nPlease confirm scope, final price and availability. Nothing booked on the demo website.`;
        $("#email-draft").href = `mailto:hello@luxuredetails.example?subject=${encodeURIComponent(`${p.name} enquiry`)}&body=${encodeURIComponent(body)}`;
        $("#email-draft").hidden = false;
        message = `Your $${total} indicative quote draft is ready. Nothing sent or booked. Review it in your email app.`;
    }
    $("#status").textContent = message;
});
$("#policies").addEventListener("click", () => $("#policy-dialog").showModal());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(`#${button.dataset.close}`).close()));
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
quote();
