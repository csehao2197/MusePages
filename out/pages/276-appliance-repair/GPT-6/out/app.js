
const $ = (s) => document.querySelector(s);
$("#menu").onclick = () =>
{
    const open = $("#navigation").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
};
document.querySelectorAll("nav a").forEach((a) => a.onclick = () =>
{
    $("#navigation").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
document.querySelectorAll("[data-book]").forEach((b) => b.onclick = () =>
{
    $("#booking-result").textContent = "";
    $("#booking").showModal();
});
$(".close").onclick = () => $("#booking").close();
$("#booking-form").onsubmit = (e) =>
{
    e.preventDefault();
    const form = new FormData(e.target);
    $("#booking-result").textContent = "Preview ready for " + form.get("name") + ": " + form.get("service") + ". Nothing has been sent or booked.";
};

const appliances = [["Washing machine","Won't spin, leaks, drum bearings",95,210],["Tumble dryer","Not heating, thermostat, belt",85,165],["Dishwasher","Not draining, not heating, leaks",90,180],["Fridge freezer","Not cooling, icing up, noisy fan",110,240],["Oven","No heat, fan, door seal, element",85,190],["Hob","Ignition, zone faults, controls",80,175],["Microwave","No heat, turntable, door switch",70,140],["Washer dryer","Drying, spin faults, pump",105,230]];
document.querySelectorAll("[data-appliance]").forEach((b) => b.onclick = () =>
{
    const index = Number(b.dataset.appliance);
    document.querySelectorAll("[data-appliance]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    document.querySelectorAll(".price-row").forEach((r) => r.classList.remove("selected"));
    const row = $("#appliance-" + index);
    row.classList.add("selected");
    row.scrollIntoView({ block: "center" });
    const item = appliances[index];
    $("#picked").textContent = item[0] + ": typical total £" + item[2] + "–£" + item[3] + ", including the £49 diagnostic credit. Diagnostic only: £49.";
    $('[name="service"]').selectedIndex = index;
});
$("#area-form").onsubmit = (e) =>
{
    e.preventDefault();
    const code = $("#postcode").value.trim().toUpperCase().replace(/\s/g, "");
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(code))
    {
        $("#area-result").textContent = "Enter a full UK postcode, for example LS1 1AA.";
        return;
    }
    $("#area-result").textContent = /^(LS|HG)\d/.test(code) ? "Your postcode is in our sample LS / HG area. Call to confirm exact coverage and availability." : "Outside the sample LS / HG area. Call to ask about nearby coverage.";
};
