const dialog = document.querySelector("#detail");
const title = document.querySelector("#dialog-title");
const copy = document.querySelector("#dialog-copy");
const projects =
{
    Aural: "An independent sound company with a different frequency. Strategy, a sculptural orbital identity, and a flexible visual language built around the joy of listening. This is an original fictional case study.",
    Groundwork: "Everyday rituals, thoughtfully reimagined. An earthy identity and refill-minded packaging concept with quiet confidence. Original fictional packaging artwork; no products are sold.",
    Offscript: "A platform for the next wave of independent culture. Expressive typography, a restless editorial voice, and a digital-first identity. Original fictional culture project.",
    Still: "A slower kind of hospitality. An architectural identity that makes room for calm through soft forms and natural tones. Original fictional brand concept."
};
function openDialog(heading, text, label)
{
    title.textContent = heading;
    copy.textContent = text;
    document.querySelector("#dialog-label").textContent = label;
    dialog.showModal();
}
document.querySelectorAll("[data-project]").forEach((button) =>
{
    button.addEventListener("click", () => openDialog(button.dataset.project, projects[button.dataset.project], "Selected project / Concept work"));
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector(".dialog-done").addEventListener("click", () => dialog.close());
document.querySelectorAll("[data-legal]").forEach((button) =>
{
    button.addEventListener("click", () => openDialog(button.dataset.legal, button.dataset.legal === "Privacy" ? "This standalone concept has no analytics, accounts, cookies or form submissions. All interaction stays in your browser. The example email is not monitored." : "Prompt: Superdesign, CC0 1.0. All displayed artwork is original CSS composition. System fonts replace external Anton and Plus Jakarta Sans. Otherform, its projects and testimonials are fictional.", "Studio information"));
});
const testimonials =
[
    ["“THEY DIDN’T JUST UNDERSTAND OUR VISION. THEY SHOWED US HOW MUCH BIGGER IT COULD BE.”", "JAMIE MORGAN", "Founder, Aural · Demo testimonial", "JM"],
    ["“A RARE BALANCE OF RADICAL THINKING AND REAL CARE FOR EVERY LITTLE DETAIL.”", "ALEX RIVERS", "Co-founder, Groundwork · Demo testimonial", "AR"],
    ["“THE RESULT FEELS ENTIRELY LIKE US. JUST A VERSION WE HADN’T IMAGINED YET.”", "SAM ELLIS", "Director, Still · Demo testimonial", "SE"]
];
let active = 0;
function move(direction)
{
    active = (active + direction + testimonials.length) % testimonials.length;
    const [quote, name, role, initials] = testimonials[active];
    document.querySelector("#quote").textContent = quote;
    document.querySelector("#person").textContent = name;
    document.querySelector("#role").textContent = role;
    document.querySelector("#initials").textContent = initials;
    document.querySelector("#counter").textContent = `0${active + 1} / 03`;
}
document.querySelector("#previous").addEventListener("click", () => move(-1));
document.querySelector("#next").addEventListener("click", () => move(1));
