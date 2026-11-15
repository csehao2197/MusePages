
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

const points = [["PC-6","Nei Guan","Traditionally described near the inner forearm."],["LI-4","He Gu","Traditionally described on the hand."],["ST-36","Zu San Li","Traditionally described near the lower leg."],["SP-6","San Yin Jiao","Traditionally described above the inner ankle."],["GV-20","Bai Hui","Traditionally described at the crown of the head."],["LV-3","Tai Chong","Traditionally described on the top of the foot."]];
document.querySelectorAll("[data-point]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-point]").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
    const point = points[Number(b.dataset.point)];
    $("#point-info").replaceChildren();
    const h = document.createElement("h3");
    h.textContent = point[0] + " · " + point[1];
    const p = document.createElement("p");
    p.textContent = point[2];
    $("#point-info").append(h, p);
});
document.querySelector("[data-point]").click();
const notes = [["Acupuncture","From £65","Single-use fine needles, following an individual assessment."],["Cupping Therapy","From £55","Suction cups applied to the skin. Temporary marks can occur."],["Chinese Herbal Medicine","From £45","A consultation to discuss traditional herbal approaches and medication interactions."],["Moxibustion","Within selected plans","A warming technique discussed only after suitability assessment."],["Facial Acupuncture","From £85","A facial-focused appointment; suitability and risks are discussed first."],["TCM Consultation","£95 / 75 minutes","Time to discuss your health history, questions and preferences."]];
document.querySelectorAll("[data-treatment]").forEach((b) => b.onclick = () =>
{
    const t = notes[Number(b.dataset.treatment)];
    $("#treatment-info").textContent = t[0] + " — " + t[1] + ". Suitability, risks and alternatives would be discussed during consultation. No outcome is guaranteed.";
});
