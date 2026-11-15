
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
const works = [["Slow Water (iv)","2025","Oil and pigment on linen","180 × 140 cm"],["Slow Water (vii)","2026","Oil and pigment on linen","210 × 165 cm"],["Holdfast","2025","Oil on canvas","90 × 90 cm"],["Untitled (Jutland)","2026","Pigment and wax on unstretched linen","240 × 190 cm"],["Slow Water (i)","2024","Oil on canvas","120 × 100 cm"],["Low Tide, Repeated","2026","Oil and pigment on linen","165 × 165 cm"]];
let selected = 0;
function show()
{
    const w = works[selected];
    $("#work-title").textContent = w[0];
    $("#work-label").textContent = "Ines Okafor · " + w[1] + " · " + w[2] + " · " + w[3];
    $("#work-image").replaceChildren(document.querySelector(".artwork[data-work='" + selected + "'] svg").cloneNode(true));
    $("#work-enquiry").href = "mailto:enquiries@vesselgallery.dk?subject=" + encodeURIComponent("Work enquiry: " + w[0]);
    $("#position").textContent = (selected + 1) + " / " + works.length;
}
document.querySelectorAll("[data-work]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.work);
    show();
    $("#work-dialog").showModal();
});
$("#close-work").onclick = () => $("#work-dialog").close();
$("#next").onclick = () =>
{
    selected = (selected + 1) % works.length;
    show();
};
$("#previous").onclick = () =>
{
    selected = (selected + works.length - 1) % works.length;
    show();
};
$("#year").onchange = () =>
{
    let count = 0;
    document.querySelectorAll(".archive-row").forEach((r) =>
    {
        r.hidden = Boolean($("#year").value) && r.dataset.year !== $("#year").value;
        if (!r.hidden) count++;
    });
    $("#archive-count").textContent = count + " exhibition records";
};
