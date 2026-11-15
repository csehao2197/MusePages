const topics =
[
    ["Mediation Law", "A constructive space to work through disagreements.", "Prepare the issues, the outcome you hope for and what may be open for discussion. Mediation is not appropriate for every situation; suitability requires professional review."],
    ["Estate Planning Law", "Thoughtful preparation for the people you care about.", "List existing documents, important relationships and questions about your wishes. This sample offers no personalised estate or tax advice."],
    ["Business Formation Law", "Clear foundations for a new beginning.", "Discuss ownership, responsibilities and the business you intend to build. Appropriate structures depend on your circumstances."],
    ["Contract Law", "Understand what you are agreeing to.", "Bring a draft, key dates and the obligations you want clarified. A qualified adviser must review the full terms."],
    ["Child Custody Law", "A considered, child-focused conversation.", "Think about routines, practical arrangements and immediate concerns. Obtain advice appropriate to your jurisdiction."],
    ["Divorce Law", "Clarity through an important transition.", "Start with a broad outline and any time-sensitive documents. This page does not assess rights or possible outcomes."]
];
document.querySelector("#specialisation-list").innerHTML = topics.map((topic, index) => `<details><summary>${topic[0]}</summary><p>${topic[1]}</p><p>${topic[2]}</p><a href="#contact" data-topic="${index}">Discuss this area ↗</a></details>`).join("");
document.querySelector("#topic").innerHTML = topics.map((topic) => `<option>${topic[0]}</option>`).join("");
document.querySelectorAll("[data-topic]").forEach((link) => link.addEventListener("click", () => document.querySelector("#topic").selectedIndex = Number(link.dataset.topic)));
const articles =
[
    ["Preparing for a first mediation conversation.", "<p>Preparation can help you make good use of an introductory meeting. These general questions are a starting point, not a legal strategy.</p><ul><li>What would you like the conversation to achieve?</li><li>Which practical issues are most pressing?</li><li>What information do you need to understand the options?</li><li>Are there safety concerns or reasons mediation may not be suitable?</li></ul><p>A trained professional should assess suitability. Seek independent legal advice about your rights.</p>"],
    ["A little preparation for your estate-planning meeting.", "<p>Begin with an overview, not sensitive documents in an online demonstration.</p><ul><li>Which existing wills or powers of attorney might need review?</li><li>Who depends on you, and what are your priorities?</li><li>Have circumstances changed since your last plan?</li><li>What questions do you have about executors or decision-makers?</li></ul><p>Requirements differ by jurisdiction. A qualified solicitor can advise on validity, tax and individual circumstances.</p>"],
    ["Before your business takes its first step.", "<p>A first conversation can identify issues worth exploring before you choose a structure.</p><ul><li>Who owns the business and makes decisions?</li><li>How will roles and responsibilities be documented?</li><li>Which agreements, registrations or permissions need review?</li><li>What happens if a founder leaves?</li></ul><p>This is general educational content, not formation, financial or tax advice.</p>"]
];
const reader = document.querySelector("#reader");
function openReader(title, body, download = false)
{
    document.querySelector("#reader-title").textContent = title;
    document.querySelector("#reader-body").innerHTML = body;
    document.querySelector("#download").hidden = !download;
    reader.showModal();
}
document.querySelectorAll("[data-article]").forEach((button) => button.addEventListener("click", () => openReader(...articles[Number(button.dataset.article)])));
document.querySelector("#checklist").addEventListener("click", () => openReader("Your first conversation checklist.", "<p>A practical preparation template for a conversation with a verified solicitor.</p><ul><li>A brief timeline of the matter</li><li>Your goals and key questions</li><li>Any known deadlines</li><li>A list of relevant documents, kept securely offline</li><li>Questions about conflicts, scope and fees</li></ul><p>Use this as a prompt for preparation, not legal advice.</p>", true));
document.querySelector("#close-reader").addEventListener("click", () => reader.close());
document.querySelector("#download").addEventListener("click", () =>
{
    const blob = new Blob(["FIRST CONVERSATION CHECKLIST\n\nTimeline:\nGoals:\nQuestions:\nKnown deadlines:\nRelevant documents:\nQuestions about conflicts, scope and fees:\n\nGeneral preparation only, not legal advice. Contact a verified solicitor.\n"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "consultation-checklist.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
});
const form = document.querySelector("#plan");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const output = document.querySelector("#result");
    if (!String(data.get("name")).trim() || !data.get("channel"))
    {
        output.textContent = "Enter a first name and choose phone or video.";
        return;
    }
    if (!data.get("ack"))
    {
        output.textContent = "Confirm that this is a local demonstration.";
        return;
    }
    output.textContent = `${String(data.get("name")).trim()}: ${data.get("topic")}, ${data.get("channel")} conversation preference. Bring a timeline, questions and any known deadlines. No request sent or appointment reserved.`;
});
form.addEventListener("reset", () => document.querySelector("#result").textContent = "No legal relationship or privilege is created.");
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open"))));
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
