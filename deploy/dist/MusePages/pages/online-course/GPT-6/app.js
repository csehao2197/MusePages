const $ = (s) => document.querySelector(s);
const courses = [
    { title: "UI Design Fundamentals", category: "Design", modules: 6, hours: "4.2", price: 49, tone: "#dfbf81", shape: "50%", lesson: "Hierarchy before decoration", text: "A useful interface makes the next decision clear. Start with one primary action. Give it stronger visual weight than secondary actions, and keep related information close together. Before adding colour, test whether size, spacing and order tell the right story.", question: "Two actions compete on a screen. What is the best first step?", answers: ["Give both the same bright colour", "Decide which action matters most and give it clear priority", "Add more decorative icons"], correct: 1, why: "A clear priority reduces competition. Decoration alone does not establish a useful order." },
    { title: "Framer for Designers", category: "Design", modules: 8, hours: "5.5", price: 59, tone: "#c5cfcd", shape: "0", lesson: "Think in flexible stacks", text: "A responsive layout needs relationships, not just coordinates. Group related items in a stack, choose a gap and let content determine height. Test both narrow and wide layouts before polishing motion. This is a conceptual exercise; no Framer runtime is embedded.", question: "Which layout is most resilient when a heading wraps?", answers: ["A stack whose height follows its content", "A fixed-height box with hidden overflow", "Separate absolute positions for every word"], correct: 0, why: "Content-driven height lets the stack adapt to different text lengths and viewports." },
    { title: "Brand Strategy", category: "Marketing", modules: 5, hours: "3", price: 49, tone: "#d8b8a5", shape: "50% 0", lesson: "Start with a useful promise", text: "A brand promise connects an audience, a need and a credible difference. Write one sentence naming who you help and why your approach matters. Remove claims you cannot support. Use that sentence to guide a message before selecting a logo or colour.", question: "Which ingredient makes a brand promise more useful?", answers: ["An unsupported superlative", "A longer list of buzzwords", "A specific audience and a credible difference"], correct: 2, why: "Specificity and evidence are stronger than vague claims of being the best." },
    { title: "Copywriting That Converts", category: "Marketing", modules: 4, hours: "2.5", price: 39, tone: "#e5d5a5", shape: "0 50%", lesson: "Clarity before cleverness", text: "Good action copy helps someone understand what happens next. Name the action and its consequence. A button saying ‘Preview the lesson’ sets a clearer expectation than ‘Unlock greatness’. Avoid implying a guaranteed business result.", question: "Which button sets the clearest expectation?", answers: ["Preview the lesson", "Unlock greatness", "Do the thing"], correct: 0, why: "It tells the reader exactly which action will happen next." },
    { title: "No-Code Web Dev", category: "Development", modules: 10, hours: "8", price: 79, tone: "#aebfd0", shape: "10%", lesson: "Model the content first", text: "Before choosing a visual component, list the information your page needs. A course entry might have a title, category, duration and price. Keep repeated entries consistent, then choose a layout. Test missing and long content as well as the ideal example.", question: "What should you test alongside the ideal content?", answers: ["Only another perfect example", "Missing fields and unusually long text", "Nothing until launch"], correct: 1, why: "Real content varies. Empty and long states reveal layout assumptions early." },
    { title: "Product Management 101", category: "Business", modules: 7, hours: "6", price: 59, tone: "#c6c7ad", shape: "50%", lesson: "Separate outcomes from outputs", text: "An output is something you ship. An outcome is a change you hope it enables. ‘Add a help panel’ is an output. ‘Reduce confusion during the first task’ is an outcome. State the problem, propose a small test and choose evidence before committing to a large feature.", question: "Which statement describes an outcome?", answers: ["Ship three new panels", "Publish a roadmap", "Reduce confusion during the first task"], correct: 2, why: "It describes a change in the user experience, rather than a list of deliverables." }
];
let current = 0;
let passed = false;
const completed = new Set();
function openLesson(index)
{
    current = index;
    passed = false;
    const course = courses[index];
    $("#lesson-title").textContent = `${course.title}: ${course.lesson}`;
    $("#lesson-meta").textContent = `${course.category} / sample full course: ${course.modules} modules, ${course.hours} hrs, from £${course.price}`;
    $("#lesson-text").textContent = course.text;
    $("#question").textContent = course.question;
    $("#answers").innerHTML = course.answers.map((answer, i) => `<label><input type="radio" name="answer" value="${i}">${answer}</label>`).join("");
    $("#quiz-result").textContent = "";
    $("#progress").textContent = completed.has(index) ? "You completed this demo lesson in this tab." : "Demo lesson not yet completed.";
    $("#complete").disabled = true;
    $("#complete").textContent = "Complete knowledge check first";
    $("#lesson").showModal();
}
function bindLessons()
{
    document.querySelectorAll("[data-course]").forEach((button) => button.onclick = () => openLesson(Number(button.dataset.course)));
}
function render()
{
    const search = $("#search").value.trim().toLowerCase();
    const category = $("#category").value;
    const filtered = courses.map((course, i) => ({ course, i })).filter(({ course }) => (category === "all" || course.category === category) && `${course.title} ${course.category}`.toLowerCase().includes(search));
    $("#course-grid").innerHTML = filtered.map(({ course, i }) => `<article class="course"><div class="course-cover" style="--tone:${course.tone};--shape:${course.shape}"><span>CRAFT / ${String(i + 1).padStart(2, "0")}<br>${course.category.toUpperCase()}</span></div><div class="course-body"><small>${course.category} / DEMO LESSON INCLUDED</small><h3>${course.title}</h3><p>${course.modules} modules · ${course.hours} hrs · Sample course scope</p><div class="course-footer"><strong>from £${course.price}</strong><button data-course="${i}">${completed.has(i) ? "Revisit lesson" : "Try lesson"} ↗</button></div></div></article>`).join("");
    $("#count").textContent = `${filtered.length} of 6 demo courses · ${completed.size} demo lessons completed in this tab`;
    $("#empty").hidden = filtered.length !== 0;
    bindLessons();
}
$("#search").addEventListener("input", render);
$("#category").addEventListener("change", render);
$("#clear").addEventListener("click", () =>
{
    $("#search").value = "";
    $("#category").value = "all";
    render();
});
render();
$("#close-lesson").addEventListener("click", () => $("#lesson").close());
$("#quiz").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const selected = document.querySelector("[name=answer]:checked");
    passed = Boolean(selected && Number(selected.value) === courses[current].correct);
    $("#quiz-result").textContent = !selected ? "Choose an answer first." : passed ? `Correct. ${courses[current].why}` : `Not quite. Try again. ${courses[current].why}`;
    $("#complete").disabled = !passed;
    $("#complete").textContent = passed ? "Mark demo lesson complete" : "Complete knowledge check first";
});
$("#complete").addEventListener("click", () =>
{
    if (!passed) return;
    completed.add(current);
    $("#progress").textContent = `Demo lesson completed. ${completed.size} of 6 in this tab. This is not a certificate.`;
    render();
});
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    const plan = button.dataset.plan;
    $("#plan-result").textContent = plan === "Annual" ? "Annual example: £149 for one year, £79 less than twelve £19 monthly payments (£228). No purchase, account, renewal or access created." : plan === "Monthly" ? "Monthly example: £19 per month, £228 over twelve months if continued. No subscription, account or recurring charge created." : "Single-course example: from £39; actual sample course prices vary from £39 to £79. No purchase or lifetime access entitlement created.";
}));
const prompts = [
    ["Make a clearer first screen.", "Choose one headline, one supporting sentence and one primary action. Remove everything competing with them."],
    ["Write a useful brand promise.", "Name a specific audience, a need and a difference you can support with evidence. Keep it to one sentence."],
    ["Test an imperfect example.", "Take a course card and double the title length. Then remove the image. What needs to adapt?"]
];
let promptIndex = 0;
$("#next-prompt").addEventListener("click", () =>
{
    promptIndex = (promptIndex + 1) % prompts.length;
    $("#practice-title").textContent = prompts[promptIndex][0];
    $("#practice-copy").textContent = prompts[promptIndex][1];
});
function closeNav()
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
}
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", String($("#nav").classList.toggle("open"))));
$("#nav").addEventListener("click", closeNav);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeNav();
});
