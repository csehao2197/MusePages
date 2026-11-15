const dialog = document.querySelector("dialog");
const menu = document.querySelector("#mobile-menu");
const toggle = document.querySelector("#menu-toggle");
const views =
{
    projects: ["Selected work", "A different point of view.", "<article><strong>01 / TIDELINE</strong><br>Identity & digital experience for a coastal conservation collective.</article><article><strong>02 / STILL FORM</strong><br>Art direction and a new visual language for considered objects.</article><article><strong>03 / OPEN FIELD</strong><br>Motion-led storytelling for people changing the landscape.</article>"],
    studio: ["The studio", "Built on curiosity.", "<p>Foldcraft is an independent creative studio working at the intersection of strategy, design and motion. We turn complex ideas into clear, compelling visual narratives.</p><p>Our practice: brand strategy, visual identities, digital design and moving images.</p>"],
    contact: ["Reach us", "Good things start with a conversation.", "<p>Tell us your ambition, your challenge and your wildest idea.</p><p><strong>hello@foldcraft.example</strong></p><p>This is a static portfolio demonstration. The sample address is not connected to an inbox.</p>"]
};
function closeMenu()
{
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
}
toggle.addEventListener("click", () =>
{
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelector("#home-link").addEventListener("click", closeMenu);
document.querySelectorAll("[data-view]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const [label, title, content] = views[button.dataset.view];
        document.querySelector("#eyebrow").textContent = label;
        document.querySelector("#panel-title").textContent = title;
        document.querySelector("#panel-content").innerHTML = content;
        closeMenu();
        dialog.showModal();
    });
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
document.querySelector("#pause").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Play ocean ▷" : "Pause ocean Ⅱ";
});
