const programmes =
[
    "Clarity Intensive",
    "Career Pivot",
    "Business Founder"
];
const descriptions =
[
    "90-day proposed programme: weekly 1-to-1 sessions, a values-led direction and reflection between meetings. The brief includes voice-note support; scope and response times would need agreement. No support channel is connected here.",
    "Six focused weeks to explore a professional transition: clarify what matters, identify options and design a manageable experiment. No job placement, resignation advice or income outcome is promised.",
    "A proposed founder sounding board: strategy questions, mindset reflection and accountability. Session scope and duration would be agreed individually. This is not financial, investment or regulated business advice."
];
function selectProgramme(index)
{
    document.querySelectorAll("[data-programme]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    document.querySelector("#programme-detail").textContent = descriptions[index];
    document.querySelector("#call-programme").selectedIndex = index;
}
selectProgramme(0);
document.querySelectorAll("[data-programme]").forEach((button) => button.addEventListener("click", () => selectProgramme(Number(button.dataset.programme))));
const notes =
[
    ["When success stops feeling like you", "A sample reflection: which parts of your definition of success are yours, and which did you inherit? Notice one moment this week when work felt meaningful. What made it different?"],
    ["The art of a smaller next step", "A sample reflection: choose an experiment small enough to try this week. What would you like to learn, rather than prove? Decide when you will pause to reflect, without judging the outcome."],
    ["A boundary is a beginning", "A sample reflection: notice one recurring request that leaves you stretched. What would a sustainable response sound like? Consider your circumstances and responsibilities before making changes."]
];
function selectEpisode(index)
{
    document.querySelector("#episode-title").textContent = notes[index][0];
    document.querySelector("#episode-copy").textContent = notes[index][1];
    document.querySelectorAll("[data-episode]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
}
selectEpisode(0);
document.querySelectorAll("[data-episode]").forEach((button) => button.addEventListener("click", () => selectEpisode(Number(button.dataset.episode))));
const reflection = document.querySelector("#reflection");
const prompts = { Career: "What would you like more of in your working week?", Balance: "Where could you make a little room for yourself?", Business: "What small experiment could help you learn something useful?" };
reflection.elements.focus.addEventListener("change", () =>
{
    document.querySelector("#prompt").textContent = prompts[reflection.elements.focus.value];
    document.querySelector("#reflection-result").textContent = "";
});
reflection.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const text = reflection.elements.step.value.trim();
    document.querySelector("#reflection-result").textContent = text.length < 8 ? "Write a small step of at least 8 characters. There is no perfect answer." : `Your ${reflection.elements.focus.value.toLowerCase()} experiment: ${text}. Revisit it in a week: what did you learn? This is a reflection, not professional advice. Nothing saved or sent.`;
});
reflection.addEventListener("reset", () =>
{
    document.querySelector("#reflection-result").textContent = "";
    document.querySelector("#prompt").textContent = prompts.Career;
});
document.querySelector("#guide").addEventListener("click", () =>
{
    const url = URL.createObjectURL(new Blob(["A MOMENT OF CLARITY\n\nWhat feels important right now?\nWhat would I like more of?\nWhat is one small experiment I can try this week?\nWhen will I reflect on what I learned?\n\nGeneral self-reflection only. Coaching is not therapy, healthcare or financial advice.\n"], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "clarity-reflection-guide.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
});
const call = document.querySelector("#call-form");
call.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(call);
    const result = document.querySelector("#call-result");
    if (!String(data.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")))
    {
        result.textContent = "Enter a first name and a valid example email.";
        return;
    }
    if (!data.get("ack"))
    {
        result.textContent = "Confirm that this is a local enquiry preview.";
        return;
    }
    result.textContent = `${String(data.get("name")).trim()}, your local enquiry preview is for ${data.get("programme")}: a proposed 30-minute conversation. No request sent, appointment reserved or confidentiality guarantee created.`;
});
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
