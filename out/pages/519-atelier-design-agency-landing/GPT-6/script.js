const dialog = document.querySelector("dialog");
const menu = document.querySelector("#menu");
const menuButton = document.querySelector("#menu-button");
const panels =
{
    cases: ["Selected cases", "Ideas made tangible.", "<article><strong>FORMA — Product strategy & UX</strong><br>A simpler way to manage a growing independent business.</article><article><strong>COMMON GROUND — Brand & app</strong><br>Connecting local communities through everyday experiences.</article><article><strong>NORTH — Digital direction</strong><br>A considered platform for a new generation of founders.</article>"],
    expertise: ["Our expertise", "From first thought to final touch.", "<p>01 / Research & product strategy<br>02 / UX architecture & prototyping<br>03 / App & interface design<br>04 / Brand systems & creative development</p>"],
    studio: ["The studio", "Ambition, with intention.", "<p>Atelier is an independent design partner to bold ventures. We pair rigorous thinking with a sensitive eye to build digital products with purpose, clarity and lasting character.</p>"],
    insights: ["Studio notes", "A little perspective.", "<article><strong>Designing for the first five minutes</strong><br>The best onboarding starts with understanding what people came to do, then getting out of their way.</article><article><strong>Why restraint is a strategy</strong><br>Clear priorities give an interface its confidence. Every element should earn its place.</article>"],
    contact: ["Reach out", "What’s your next bold move?", "<p>Start a conversation at <strong>hello@atelier.example</strong>.</p><p>Share your vision, project scope and ideal timing. This is a local portfolio demonstration; the sample inbox is not connected.</p>"],
    reel: ["An original motion study", "Form follows feeling.", "<div class='reel'><span>Atelier</span></div><button class='pill primary' id='reel-toggle' aria-pressed='false'>Pause study Ⅱ</button><p>An original browser-generated motion study, not the externally hosted reference film.</p>"]
};
function closeMenu()
{
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () =>
{
    menu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.querySelector("#menu-close").focus();
});
document.querySelector("#menu-close").addEventListener("click", () =>
{
    closeMenu();
    menuButton.focus();
});
document.querySelectorAll("[data-panel]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const [label, heading, content] = panels[button.dataset.panel];
        document.querySelector("#panel-label").textContent = label;
        document.querySelector("#panel-heading").textContent = heading;
        document.querySelector("#panel-content").innerHTML = content;
        closeMenu();
        dialog.showModal();
        document.querySelector("#reel-toggle")?.addEventListener("click", (event) =>
        {
            const stopped = document.querySelector(".reel").classList.toggle("stopped");
            event.currentTarget.setAttribute("aria-pressed", String(stopped));
            event.currentTarget.textContent = stopped ? "Play study ▷" : "Pause study Ⅱ";
        });
    });
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#art-toggle").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Play motion ▷" : "Pause motion Ⅱ";
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
