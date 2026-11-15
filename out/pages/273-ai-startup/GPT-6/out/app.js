
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

const tickets = [["Priya Shah","Refund for a double charge","09:42","Could you check whether I was charged twice?","Thanks Priya. An agent needs to check your payment record before confirming a refund. This question needs human review."],["Tom Okafor","Can I change my delivery day?","09:38","Hi, I am away next Thursday. Can I move my box to Saturday instead?","Hi Tom, yes. You can move this week's delivery to Saturday from Account, then Deliveries, up to 23:59 on Tuesday [1]. Saturday slots are 08:00 to 13:00 in your area [2]. Want me to move it for you now?"],["Lena Hart","Export to CSV missing","09:31","Where can I export our records?","Hi Lena. Open Reports, choose the date range, then select Export CSV. An agent should confirm your permissions before sending."],["Marcus Bell","Invoice address wrong","09:20","Can you update the address on my invoice?","Hi Marcus. Please confirm the billing address through your account settings. An agent will check whether an invoice can be reissued."],["Aiko Mori","Team seats","09:02","Can we add another person?","Hi Aiko. Team includes up to 10 agent seats. An agent can help review your current plan before making changes."]];
let selected = 1;
const sent = new Set();
function show()
{
    const t = tickets[selected];
    $("#sender").textContent = t[0] + " · " + t[2];
    $("#subject").textContent = t[1];
    $("#question").textContent = t[3];
    $("#reply").textContent = t[4];
    $("#editor").value = t[4];
    $("#editor-label").hidden = true;
    $("#reply").hidden = false;
    $("#edit").textContent = "Edit";
    $("#source").hidden = true;
    $(".sources").hidden = selected !== 1;
    $("#confidence").textContent = selected === 1 ? "CONFIDENCE: HIGH · SAMPLE" : "HUMAN REVIEW REQUIRED";
    $("#send").disabled = sent.has(selected);
    $("#send-result").textContent = sent.has(selected) ? "Marked approved locally. Nothing was sent." : "";
    document.querySelectorAll("[data-ticket]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.ticket) === selected)));
}
document.querySelectorAll("[data-ticket]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.ticket);
    $(".tickets").classList.remove("show");
    show();
});
$("#back").onclick = () => $(".tickets").classList.toggle("show");
$("#edit").onclick = () =>
{
    if ($("#editor-label").hidden)
    {
        $("#editor-label").hidden = false;
        $("#reply").hidden = true;
        $("#edit").textContent = "Save edit";
        $("#editor").focus();
    }
    else if ($("#editor").value.trim())
    {
        tickets[selected][4] = $("#editor").value.trim();
        show();
    }
};
$("#send").onclick = () =>
{
    if (!$("#editor-label").hidden)
    {
        $("#send-result").textContent = "Save your edit before approving.";
        return;
    }
    sent.add(selected);
    $("#open-count").textContent = 14 - sent.size;
    show();
};
document.querySelectorAll("[data-source]").forEach((b) => b.onclick = () =>
{
    $("#source").hidden = false;
    $("#source").textContent = Number(b.dataset.source) === 0 ? "Sample source: Delivery changes close at 23:59 on Tuesday in Account > Deliveries." : "Sample source: Saturday delivery slots run from 08:00 to 13:00 in the sample area.";
});
show();
