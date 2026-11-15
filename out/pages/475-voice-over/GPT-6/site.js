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
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const wave = document.querySelector("#wave");
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        wave.classList.add("drawn");
        observer.disconnect();
    }
}, { threshold: .2 });
observer.observe(wave);
const speeds = ["Usually 110 to 130 words a minute", "Usually 140 words a minute", "About 9,500 words a day", "Usually 160 words a minute", "Prompts at 24 bit, 48 kHz"];
document.querySelectorAll("[data-read]").forEach((button, index) =>
{
    function selectRead()
    {
        document.querySelectorAll("[data-read]").forEach((item) =>
        {
            item.classList.toggle("selected", item === button);
            item.setAttribute("aria-pressed", String(item === button));
        });
        document.querySelector("#read-copy").textContent = button.querySelector("small").textContent;
        document.querySelector("#read-speed").textContent = speeds[index];
    }
    button.addEventListener("mouseenter", selectRead);
    button.addEventListener("focus", selectRead);
    button.addEventListener("click", selectRead);
});
const transcripts =
{
    "National Trust": "The stone is cool even in July. Stand here for a moment, and let the shape of the room tell you what remains.",
    "Wellcome Collection": "Look closely at the edge of the page. A small pencil mark changes the question the whole object is asking.",
    "Faber": "He left the cup where she would find it, handle turned towards the window, as it had been every morning before.",
    "Siemens": "Before the next step, check that the area is clear. Follow your site's approved procedure and ask if anything is uncertain.",
    "Channel 4": "At six each morning the gate opens. The same people arrive, but no two days inside are quite alike.",
    "NHS Somerset": "Thank you for calling. Please listen to the available options so that your call can reach the right team."
};
const sampleDialog = document.querySelector("#sample-dialog");
document.querySelectorAll("[data-sample]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#sample-title").textContent = button.dataset.sample;
    document.querySelector("#transcript").textContent = transcripts[button.dataset.sample];
    sampleDialog.showModal();
}));
document.querySelector("#close-sample").addEventListener("click", () => sampleDialog.close());
const sessionDialog = document.querySelector("#session-dialog");
document.querySelector("#session").addEventListener("click", () => sessionDialog.showModal());
document.querySelector("#close-session").addEventListener("click", () => sessionDialog.close());
const excerpt = document.querySelector("#excerpt");
const status = document.querySelector("#script-status");
const form = document.querySelector("#script-form");
form.addEventListener("input", () =>
{
    status.hidden = true;
    const words = excerpt.value.trim() ? excerpt.value.trim().split(/\s+/).length : 0;
    document.querySelector("#word-count").textContent = `${words} words · stays on this device`;
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (document.querySelector("#name").value.trim().length < 2 || excerpt.value.trim().length < 20)
    {
        status.textContent = "Add your name and at least 20 non-space characters of script.";
        return;
    }
    status.textContent = `${document.querySelector("#style").value} brief prepared for ${document.querySelector("#name").value.trim()}. Nothing uploaded, recorded or sent. No session booked.`;
});
