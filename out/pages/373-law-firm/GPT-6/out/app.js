const areas =
[
    ["Personal Injury", "Accidents, wrongful death and catastrophic injury.", "Bring an outline of the incident, approximate dates and any existing correspondence. An attorney must review facts, deadlines and responsibility before advising."],
    ["Family Law", "Divorce, custody, adoption and protective orders.", "Start with your priorities, the people involved and any upcoming court dates. Keep identifying details out of this demonstration."],
    ["Business Litigation", "Contracts, partnerships and commercial disputes.", "Prepare the nature of the dispute, relevant contracts and your desired business outcome. Conflict checks precede any engagement."],
    ["Criminal Defense", "DWI, felony and misdemeanor defense.", "A charge and court date can be time-sensitive. Speak directly with licensed counsel; this page does not provide urgent assistance."],
    ["Estate Planning", "Wills, trusts, powers of attorney and probate.", "Think about the people you want to protect and existing documents. An attorney can discuss a plan appropriate to your circumstances."],
    ["Employment Law", "Termination, discrimination and wage disputes.", "Create a timeline and list available documents. Filing deadlines vary, so seek advice from a qualified attorney promptly."]
];
let selected = 0;
document.querySelector("#areas").innerHTML = areas.map((area, index) => `<button class="area" data-area="${index}" aria-pressed="${index === 0}"><span>0${index + 1} — EXPLORE ↗</span><h3>${area[0]}</h3><p>${area[1]}</p></button>`).join("");
document.querySelector("#area-select").innerHTML = [...areas.map((area) => area[0]), "Other"].map((name) => `<option>${name}</option>`).join("");
function choose(index)
{
    selected = index;
    document.querySelectorAll(".area").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    document.querySelector("#area-title").textContent = areas[index][0];
    document.querySelector("#area-copy").textContent = areas[index][2];
    document.querySelector("#area-choose").textContent = `Prepare a ${areas[index][0]} consultation ↗`;
}
choose(0);
document.querySelectorAll("[data-area]").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.area))));
document.querySelector("#area-choose").addEventListener("click", () => document.querySelector("#area-select").value = areas[selected][0]);
const people =
[
    ["Robert Meridian", "Fictional founding partner in the brief, focused on personal injury and business litigation. The original describes a founding date of 1989 and a prosecutor background; neither history nor recoveries are verified here."],
    ["Diana Vasquez", "Fictional partner focused on family law and estate planning, with an empathetic, structured approach to complex family decisions. No board certification is claimed."],
    ["James Okafor", "Fictional associate focused on criminal defense and employment disputes. His profile emphasizes analytical preparation; no court clerkship or bar membership is claimed as fact."]
];
document.querySelectorAll("[data-person]").forEach((button) => button.addEventListener("click", () =>
{
    const person = people[Number(button.dataset.person)];
    document.querySelector("#profile-name").textContent = person[0];
    document.querySelector("#profile-copy").textContent = person[1];
    document.querySelector("#profile").showModal();
}));
document.querySelector("#close-profile").addEventListener("click", () => document.querySelector("#profile").close());
const quotes =
[
    ["Robert took my call on a Sunday evening after my accident. By Monday morning he had already sent a preservation letter.", "Michael T. · Fictional personal injury client"],
    ["Diana navigated my divorce with legal skill and genuine empathy. My children’s interests were protected at every step.", "Sarah W. · Fictional family law client"],
    ["I’m grateful I got a second opinion. Having someone explain the process made all the difference.", "Anonymous · Fictional criminal defense client"],
    ["I was skeptical that a law firm would treat me like a person and not a case number. Meridian proved me wrong.", "Donna R. · Fictional estate planning client"]
];
let active = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
function quote()
{
    document.querySelector("#quote").textContent = `“${quotes[active][0]}”`;
    document.querySelector("#attribution").textContent = quotes[active][1];
    document.querySelector("#quote-index").textContent = `${active + 1} / 4`;
    document.querySelector("#pause").textContent = paused ? "Resume rotation" : "Pause rotation";
    document.querySelector("#pause").setAttribute("aria-pressed", String(paused));
}
document.querySelector("#next").addEventListener("click", () =>
{
    active = (active + 1) % quotes.length;
    quote();
});
document.querySelector("#prev").addEventListener("click", () =>
{
    active = (active + quotes.length - 1) % quotes.length;
    quote();
});
document.querySelector("#pause").addEventListener("click", () =>
{
    paused = !paused;
    quote();
});
setInterval(() =>
{
    if (!paused && !document.hidden)
    {
        active = (active + 1) % quotes.length;
        quote();
    }
}, 6000);
quote();
const form = document.querySelector("#contact-form");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const result = document.querySelector("#result");
    if (!String(data.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")) || String(data.get("message")).trim().length < 10)
    {
        result.textContent = "Enter a name, valid email and an example description of at least 10 characters.";
        return;
    }
    if (!data.get("ack"))
    {
        result.textContent = "Confirm that this is a local outline only.";
        return;
    }
    result.textContent = `Local outline: ${data.get("area")} — ${String(data.get("message")).trim()}. No request sent; no lawyer-client relationship or privilege created.`;
});
form.addEventListener("reset", () => document.querySelector("#result").textContent = "No request will be sent.");
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
