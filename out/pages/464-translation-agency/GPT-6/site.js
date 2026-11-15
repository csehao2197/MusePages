const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
const sentences = [
    { lang: "English", code: "en", text: "The lease runs until the end of March and cannot be broken early." },
    { lang: "French", code: "fr", text: "Le bail court jusqu'à la fin du mois de mars et ne peut être résilié par anticipation." },
    { lang: "German", code: "de", text: "Der Mietvertrag läuft bis Ende März und kann nicht vorzeitig gekündigt werden." },
    { lang: "Spanish", code: "es", text: "El contrato de arrendamiento vence a finales de marzo y no puede rescindirse antes." }
];
const sentence = document.querySelector("#sentence");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let language = 0;
let word = 0;
let paused = false;
let complete = false;
let hold = 0;
function renderWords(words)
{
    sentence.replaceChildren(...words.map((text) =>
    {
        const span = document.createElement("span");
        span.textContent = `${text} `;
        return span;
    }));
}
renderWords(sentences[0].text.split(" "));
let timer;
if (!reduced.matches)
{
    timer = setInterval(() =>
    {
        if (paused || complete) return;
        if (hold++ < 10) return;
        const next = sentences[(language + 1) % sentences.length];
        const target = next.text.split(" ");
        const current = [...sentence.children].map((span) => span.textContent.trim());
        if (word < target.length)
        {
            current[word] = target[word];
            renderWords(current.slice(0, Math.max(word + 1, target.length)));
            word++;
        }
        else
        {
            renderWords(target);
            language = (language + 1) % sentences.length;
            sentence.lang = next.code;
            document.querySelector("#language-name").textContent = next.lang;
            word = 0;
            hold = 0;
            if (language === 0)
            {
                complete = true;
                clearInterval(timer);
                document.querySelector("#motion").textContent = "Sentence complete";
                document.querySelector("#motion").disabled = true;
            }
        }
    }, 220);
}
document.querySelector("#motion").addEventListener("click", (event) =>
{
    paused = !paused;
    event.currentTarget.textContent = paused ? "Resume sentence" : "Pause sentence";
});
const dialog = document.querySelector("#file-dialog");
const form = document.querySelector("#file-form");
const fileInput = document.querySelector("#document");
document.querySelectorAll(".send-file").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
document.querySelector("#close").addEventListener("click", () => dialog.close());
fileInput.addEventListener("change", () =>
{
    const file = fileInput.files[0];
    const valid = file && /\.(pdf|docx|txt)$/i.test(file.name) && file.size <= 15 * 1024 * 1024 && file.size > 0;
    fileInput.setCustomValidity(!file || valid ? "" : "Choose a nonempty PDF, DOCX or TXT up to 15 MB.");
    document.querySelector("#file-status").textContent = valid ? `${file.name} (${file.size} bytes). Selected locally, not uploaded.` : "Choose a nonempty PDF, DOCX or TXT up to 15 MB.";
    document.querySelector("#enquiry-status").textContent = "";
});
document.querySelector("#reset").addEventListener("click", () =>
{
    HTMLFormElement.prototype.reset.call(form);
    fileInput.setCustomValidity("");
    document.querySelector("#file-status").textContent = "PDF, DOCX or TXT. Up to 15 MB.";
    document.querySelector("#enquiry-status").textContent = "Cleared. Nothing sent or stored.";
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#enquiry-status").textContent = "Enquiry preview ready. Nothing sent or stored. Contact the agency directly using a verified channel for real documents.";
});
