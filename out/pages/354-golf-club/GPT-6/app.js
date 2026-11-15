document.querySelectorAll('use[href="#course"]').forEach((art) => art.setAttribute("href", "#course-art"));
const yards = [365, 402, 517, 179, 389, 504, 168, 321, 403, 360, 374, 441, 158, 496, 340, 175, 308, 512];
const pars = [4, 4, 5, 3, 4, 5, 3, 4, 4, 4, 4, 4, 3, 5, 4, 3, 4, 5];
const indexes = [9, 3, 13, 17, 7, 5, 15, 11, 2, 10, 4, 1, 18, 6, 12, 16, 14, 8];
const notes = ["A generous opening fairway. Keep the approach short of the back fringe.", "The fairway turns left around mature trees. Position matters more than distance.", "A steady three-shot par five with a well-protected final approach.", "A small target that rewards a controlled iron.", "The left side offers the clearest line into the green.", "A long par five. The lay-up area narrows near the green.", "Downhill across water to a green that slopes away from you. Club selection is a guess and everyone claims otherwise.", "Short on paper, exacting around the green.", "A testing finish to the front nine into the prevailing breeze.", "An open drive before the course begins to tighten.", "The first of a demanding four-hole stretch.", "The hardest hole on the card. A blind drive over the ridge, then a long approach to bunkers cut in 1931.", "A delicate par three with little room long.", "A long par five to close the decisive stretch.", "A good drive leaves a short but exacting approach.", "Play for the middle of this small green.", "A positional tee shot sets up the last short approach.", "Reachable in two with a following wind, roughly one day in nine. The clubhouse windows watch every approach."];
let active = 7;
function openHole(number)
{
    active = number;
    document.querySelectorAll(".hole").forEach((row) =>
    {
        const selected = Number(row.dataset.number) === number;
        row.classList.toggle("open", selected);
        row.querySelector("button").setAttribute("aria-expanded", String(selected));
    });
}
function renderScorecard()
{
    const yellow = document.querySelector("#tee").value === "yellow";
    const lengths = yards.map((n, i) => n - (yellow ? (pars[i] === 3 ? 10 : 20) : 0));
    let markup = "";
    lengths.forEach((length, i) =>
    {
        markup += `<div class="hole" data-number="${i + 1}"><button class="hole-button" aria-expanded="false" aria-controls="hole-note-${i + 1}"><span>${i + 1}</span><span>${length}</span><span>${pars[i]}</span><span>${indexes[i]}</span></button><p class="hole-description" id="hole-note-${i + 1}">${notes[i]}</p></div>`;
        if (i === 8 || i === 17)
        {
            const start = i === 8 ? 0 : 9;
            markup += `<div class="nine-total"><span>${i === 8 ? "Out" : "In"}</span><b>${lengths.slice(start, start + 9).reduce((a, b) => a + b, 0).toLocaleString("en-GB")}</b><b>36</b><span>${i === 8 ? "Front nine" : "Back nine"}</span></div>`;
        }
    });
    document.querySelector("#scorecard").innerHTML = markup;
    const total = lengths.reduce((a, b) => a + b, 0).toLocaleString("en-GB");
    document.querySelector("#score-yards").textContent = total;
    document.querySelector("#yard-total").textContent = total;
    document.querySelector("#tee-name").textContent = yellow ? "yellows (illustrative)" : "whites";
    document.querySelectorAll(".hole").forEach((row) =>
    {
        const number = Number(row.dataset.number);
        row.addEventListener("mouseenter", () => openHole(number));
        row.querySelector("button").addEventListener("focus", () => openHole(number));
        row.querySelector("button").addEventListener("click", () => openHole(number));
    });
    openHole(active);
}
document.querySelector("#tee").addEventListener("change", renderScorecard);
renderScorecard();
document.querySelectorAll("[data-hole]").forEach((button) => button.addEventListener("click", () =>
{
    openHole(Number(button.dataset.hole));
    document.querySelector(`.hole[data-number="${button.dataset.hole}"]`).scrollIntoView({ block: "center" });
}));
const memberships =
{
    "Full Membership": { annual: 1850, joining: 1200, benefits: ["Unrestricted play seven days", "Full competition eligibility", "Guest rate of £30", "Reciprocal access to eleven partner clubs"] },
    "Weekday Membership": { annual: 1050, joining: 600, benefits: ["Play Monday to Friday", "Weekday competitions", "Guest rate of £35", "Full clubhouse rights"] },
    "Junior Membership": { annual: 180, joining: 0, benefits: ["Under 18", "Free group coaching", "Supervised weekend play", "Reduced entry to full membership"] }
};
document.querySelector("#membership-cards").innerHTML = Object.entries(memberships).map(([name, value]) => `<article class="membership-card"><h3>${name.replace(" Membership", "")}</h3><p class="dues">£${value.annual.toLocaleString("en-GB")}</p><p class="small">Annual dues · ${value.joining ? `£${value.joining.toLocaleString("en-GB")} joining fee` : "No joining fee"}</p><ul>${value.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul><button data-interest="${name}">Enquire about ${name.replace(" Membership", "").toLowerCase()}</button></article>`).join("");
const form = document.querySelector("#enquiry-form");
function updateInterest()
{
    const name = form.elements.interest.value;
    const tier = memberships[name];
    document.querySelector("#age-field").hidden = name !== "Junior Membership";
    document.querySelector("#selection-note").textContent = tier ? `${name}: £${(tier.annual + tier.joining).toLocaleString("en-GB")} first-year joining fee and dues.${name === "Full Membership" ? " Approximate waiting list: fourteen months." : ""} Illustrative terms only.` : `${name}: explore a local enquiry preview. The club would confirm times and availability directly.`;
    document.querySelector("#enquiry-result").textContent = "Selection updated. Nothing is sent or saved.";
}
form.elements.interest.addEventListener("change", updateInterest);
document.querySelectorAll("[data-interest]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.interest.value = button.dataset.interest;
    updateInterest();
    document.querySelector("#enquiry").scrollIntoView();
}));
document.querySelector("#event-guests").addEventListener("change", (event) =>
{
    const guests = Number(event.target.value);
    document.querySelector("#event-total").textContent = `${guests} guests · from £${(guests * 68).toLocaleString("en-GB")} · illustrative package`;
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#enquiry-result");
    if (form.elements.name.value.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (form.elements.interest.value === "Junior Membership" && (!Number.isInteger(Number(form.elements.age.value)) || Number(form.elements.age.value) < 1 || Number(form.elements.age.value) > 17))
    {
        result.textContent = "Junior membership is for ages 1 to 17. Enter a valid age.";
        return;
    }
    if (!form.elements.consent.checked)
    {
        result.textContent = "Confirm that you understand this is a local preview.";
        return;
    }
    result.textContent = `${form.elements.interest.value} enquiry preview ready for ${form.elements.name.value.trim()}. No application submitted, waiting-list place assigned or tee time booked. Nothing sent or saved.`;
});
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a, .close").forEach((el) => el.addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
}));
const observer = new IntersectionObserver((entries) => entries.forEach((entry) =>
{
    if (entry.isIntersecting) entry.target.classList.add("reveal");
}), { threshold: .12 });
document.querySelectorAll(".section").forEach((section) => observer.observe(section));
