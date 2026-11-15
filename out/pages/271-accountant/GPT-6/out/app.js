
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

const serviceCopy = ["A reliable picture of where your business stands.","Personal and business returns, carefully prepared.","Clear records and support with your VAT obligations.","Keep your people paid and your records in order.","Get the structure and systems right from day one.","Make room for what comes next with a practical plan."];
document.querySelectorAll("[data-service]").forEach((button) => button.onclick = () =>
{
    $("#service-detail").hidden = false;
    $("#service-detail").textContent = serviceCopy[Number(button.dataset.service)] + " Discuss your circumstances in a free consultation; scope is agreed before work begins.";
    $("#service-detail").scrollIntoView({ block: "nearest" });
});
