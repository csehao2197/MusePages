
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

const routes = [["Bishop's Stortford","Stansted","Saloon",32],["Bishop's Stortford","Heathrow T5","Saloon",128],["Cambridge","Stansted","Saloon",78],["Cambridge","Heathrow T2","Estate",185],["Hertford","Luton","Saloon",74],["Hertford","Gatwick","Saloon",148],["Saffron Walden","Stansted","Van",62],["Chelmsford","Heathrow T3","Estate",195]];
function render()
{
    $("#routes").replaceChildren();
    const filtered = routes.filter((r) => r[1].includes($("#airport").value));
    for (const r of filtered)
    {
        const row = document.createElement("article");
        row.className = "route";
        for (const value of r.slice(0, 3))
        {
            const span = document.createElement("span");
            span.textContent = value;
            row.append(span);
        }
        const price = document.createElement("b");
        price.textContent = "£" + r[3];
        const b = document.createElement("button");
        b.textContent = "Select";
        b.onclick = () =>
        {
            $("#selection").hidden = false;
            $("#selection").textContent = r[0] + " to " + r[1] + " / " + r[2] + " / £" + r[3] + ". Illustrative fixed fare. Call or email to confirm availability; nothing is reserved.";
        };
        row.append(price, b);
        $("#routes").append(row);
    }
    $("#route-count").textContent = filtered.length + " routes shown";
    $("#selection").hidden = true;
}
$("#airport").onchange = render;
render();
