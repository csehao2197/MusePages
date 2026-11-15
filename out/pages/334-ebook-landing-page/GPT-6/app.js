const prompts = [
    "List every project on your current site. Which three most closely resemble the work you want next?",
    "For each shortlisted project, name the client's problem before naming the deliverable.",
    "Draft six short headings: context, problem, constraint, decision, result, reflection.",
    "Read your first screen aloud. Does it say who you help and what you help them do?",
    "Write one sentence explaining what changes the scope and price of your work.",
    "Replace a list of tools with one paragraph about how you make decisions.",
    "Pick one prospective client. Link one relevant project and explain the connection."
];
document.querySelectorAll("[data-chapter]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelectorAll("[data-chapter]").forEach((node) => node.removeAttribute("aria-current"));
        button.setAttribute("aria-current", "true");
        document.querySelector("#chapter-note").textContent = `Reflection ${Number(button.dataset.chapter) + 1}: ${prompts[button.dataset.chapter]}`;
    });
});
const samples = [
    { title: "Choosing the three", text: "Delete every project you would not want to be hired to do again. You are advertising for more of the same work, so advertise for the work you want." },
    { title: "Writing the case study", text: "A case study is not a story about you. It is evidence, arranged in the order a sceptical person needs it: problem, constraint, decision, result." }
];
const dialog = document.querySelector("#reader");
let index = 0;
function render()
{
    document.querySelector("#reader-title").textContent = samples[index].title;
    document.querySelector("#reader-text").textContent = samples[index].text;
    document.querySelector("#page-status").textContent = `${index + 1} of ${samples.length}`;
    document.querySelector("#previous").disabled = index === 0;
    document.querySelector("#next").disabled = index === samples.length - 1;
}
function openReader()
{
    index = 0;
    render();
    dialog.showModal();
}
document.querySelector("#preview").addEventListener("click", openReader);
document.querySelector("#get-book").addEventListener("click", openReader);
document.querySelector("#close-reader").addEventListener("click", () => dialog.close());
document.querySelector("#next").addEventListener("click", () =>
{
    index = Math.min(samples.length - 1, index + 1);
    render();
});
document.querySelector("#previous").addEventListener("click", () =>
{
    index = Math.max(0, index - 1);
    render();
});
function download(filename, text)
{
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector("#download").addEventListener("click", () => download("quiet-portfolio-sample.txt", `THE QUIET PORTFOLIO\nFictional book concept. Sample excerpts only.\n\n${samples.map((sample) => `${sample.title}\n${sample.text}`).join("\n\n")}\n\nNot the complete PDF or EPUB. No purchase took place.`));
document.querySelector("#template").addEventListener("click", () => download("portfolio-reflection-template.txt", `PORTFOLIO REFLECTION TEMPLATE\nFree local demonstration\n\n${prompts.map((prompt, i) => `${i + 1}. ${prompt}\nNotes:\n`).join("\n")}`));
function progress()
{
    const available = document.documentElement.scrollHeight - innerHeight;
    document.querySelector("#progress").style.width = `${available > 0 ? Math.min(100, scrollY / available * 100) : 0}%`;
    document.querySelector(".sticky-buy").classList.toggle("visible", document.querySelector(".hero").getBoundingClientRect().bottom < 0);
}
addEventListener("scroll", progress, { passive: true });
addEventListener("resize", progress);
progress();
