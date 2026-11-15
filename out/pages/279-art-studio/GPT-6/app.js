
const $ = (s) => document.querySelector(s);
const classes = [["Monday, oil for beginners.","Three hours. Six people. Twelve weeks, start any week.","MONDAYS 18:30",22],["Wednesday, life drawing.","Two and a half hours, a model, no instruction unless you ask for it.","WEDNESDAYS 19:00",16],["Thursday, acrylic and colour.","Three hours. Eight people. Mixing, mostly, for the first month.","THURSDAYS 18:30",22],["Saturday, open studio.","Four hours, no tutor, bring your own work. A workspace and a sink.","SATURDAYS 10:00",9]];
let selected = 0;
let term = "autumn";
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
function update()
{
    const sessions = Number($("#sessions").value);
    const hire = Number($("#hire").value);
    $("#budget-title").textContent = classes[selected][0];
    if (!Number.isInteger(sessions) || sessions < 1 || sessions > 12)
    {
        $("#budget-result").textContent = "Choose a whole number of sessions from 1 to 12.";
        $("#email-enquiry").removeAttribute("href");
        return;
    }
    const rate = classes[selected][3];
    $("#budget-result").textContent = sessions + " session" + (sessions === 1 ? "" : "s") + " × £" + rate + (hire ? " + £45 term hire" : "") + " = £" + (sessions * rate + hire);
    $("#email-enquiry").href = "mailto:hello@ninthstreet.studio?subject=" + encodeURIComponent("Class enquiry: " + classes[selected][0]) + "&body=" + encodeURIComponent("I am interested in " + sessions + " session(s), " + term + " term. Illustrative budget £" + (sessions * rate + hire) + ". Please confirm dates, availability and any easel hire.");
}
document.querySelectorAll("[data-class]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.class);
    document.querySelectorAll("[data-class]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    update();
    $("#budget").scrollIntoView({ block: "center" });
});
$("#sessions").oninput = update;
$("#hire").onchange = update;
$("#class-filter").onchange = () =>
{
    let count = 0;
    document.querySelectorAll(".class-block").forEach((c) =>
    {
        c.hidden = Boolean($("#class-filter").value) && c.dataset.type !== $("#class-filter").value;
        if (!c.hidden) count++;
    });
    $("#class-count").textContent = count + " sessions shown";
};
document.querySelectorAll("[data-term]").forEach((b) => b.onclick = () =>
{
    term = b.dataset.term;
    document.querySelectorAll("[data-term]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#term-info").textContent = term === "autumn" ? "Brief lists two autumn places. This is sample information, not a live availability claim. Nothing is held here." : "Brief lists this term as open. Confirm the next dates and available places by email. Nothing is held here.";
    update();
});
document.querySelector("[data-term]").click();
update();
