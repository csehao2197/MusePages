const $ = (selector) => document.querySelector(selector);
function advise()
{
    const size = $("#size").value;
    const sight = $("#sight").value;
    $("#advice").textContent = size === "large" || sight === "yes" ? "Replacement assessment recommended. Please send a photo before driving with impaired visibility." : size === "unsure" || sight === "unsure" ? "Not sure? A photograph with a coin beside the damage helps us assess it. Call for advice." : "A resin repair may be suitable. Send a photo so a technician can confirm.";
    $("#photo-link").href = `mailto:hello@clearpane.co.uk?subject=Windscreen%20damage%20photo&body=${encodeURIComponent(`Size: ${$("#size").selectedOptions[0].text}. Driver's sight: ${$("#sight").selectedOptions[0].text}. Please attach a photograph with a coin beside the damage.`)}`;
}
$("#size").onchange = $("#sight").onchange = advise;
$("#chips").oninput = () =>
{
    const count = Number($("#chips").value);
    $("#estimate").textContent = Number.isInteger(count) && count >= 1 && count <= 6 ? `£${65 + (count - 1) * 20} · about ${40 + (count - 1) * 15} minutes` : "Enter a whole number from 1 to 6. Call for larger jobs.";
};
const towns = [["Nottingham", 20], ["West Bridgford", 25], ["Beeston", 25], ["Derby", 35], ["Mansfield", 35], ["Newark", 40], ["Long Eaton", 30], ["Ilkeston", 30], ["Ripley", 40], ["Hucknall", 25]];
function areas()
{
    const matches = towns.filter(([town]) => town.toLowerCase().includes($("#area-search").value.trim().toLowerCase()));
    $("#area-list").innerHTML = matches.map(([town, minutes]) => `<div class="area"><strong>${town}</strong><span>${minutes} MIN</span></div>`).join("");
    $("#area-status").textContent = matches.length ? `${matches.length} towns shown` : "No listed town matches. Call us to check your area.";
}
$("#area-search").oninput = areas;
const steps =
[
    ["00:00", "You call or send a photograph.", "A photograph with a coin beside the damage tells us everything we need."],
    ["SAME DAY", "A two hour arrival window.", "We text when we set off, and we are usually early rather than late."],
    ["00:40", "The work.", "Done on your drive, in a car park or outside the office. You do not need to be there once we start."],
    ["+60 MIN", "Cure time.", "An hour before you drive after a replacement. Repairs you can drive away from immediately."]
];
$("#steps").innerHTML = steps.map(([time, title, copy]) => `<article class="step"><span class="meta">${time}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join("");
advise();
areas();
const observer = new IntersectionObserver((entries) =>
{
    if (entries[0].isIntersecting)
    {
        $(".repair-panel").classList.add("seen");
        observer.disconnect();
    }
}, { threshold: .35 });
observer.observe($(".repair-panel"));
