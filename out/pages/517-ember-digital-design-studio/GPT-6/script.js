const menu = document.querySelector("#mobile-menu");
const toggle = document.querySelector(".menu-button");
const detail = document.querySelector("#detail");
const panels =
{
    WORKS: ["Selected, not expected.", "<p><strong>FORM / 2026</strong><br>A spatial identity for an independent architecture practice.</p><hr><p><strong>FIELD NOTES / 2025</strong><br>An editorial platform built around discovery and motion.</p>"],
    SERVICES: ["Clarity. Character. Impact.", "<p>01 — Brand strategy & positioning<br>02 — Visual identity & art direction<br>03 — Digital experiences & websites<br>04 — Motion systems & creative development</p>"],
    ABOUT: ["From primal to powerful.", "<p>EMBER is an independent digital design studio. We bring strategy, identity and meaningful motion together to build brands that feel unmistakably themselves.</p>"],
    TEAM: ["Small team. Shared fire.", "<p>Our independent collective brings together brand designers, creative developers and motion artists. Assembled around each project, connected by curiosity.</p>"],
    CONTACTS: ["Let’s make a mark.", "<p>Tell us what you are building.<br><strong>hello@ember.example</strong><br>23 Industrial Lane, Unit 5<br>London, UK, E2 8AA</p><p>Portfolio demonstration — this address does not deliver messages.</p>"],
    SOCIAL: ["Stay in the loop.", "<p>This independent portfolio demonstration has no connected social accounts. Explore our selected work here instead.</p>"]
};
function closeMenu()
{
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
}
toggle.addEventListener("click", () =>
{
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.querySelector("#menu-close").focus();
});
document.querySelector("#menu-close").addEventListener("click", () =>
{
    closeMenu();
    toggle.focus();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
document.querySelectorAll("[data-panel]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const key = button.dataset.panel;
        const [title, body] = panels[key];
        closeMenu();
        document.querySelector("#detail-label").textContent = key;
        document.querySelector("#detail-title").textContent = title;
        document.querySelector("#detail-body").innerHTML = body;
        document.querySelector(".dialog-contact").hidden = key === "CONTACTS";
        if (!detail.open) detail.showModal();
    });
});
document.querySelector(".close").addEventListener("click", () => detail.close());
detail.addEventListener("click", (event) =>
{
    if (event.target === detail) detail.close();
});
document.querySelector("#motion-toggle").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Play landscape ▷" : "Pause landscape Ⅱ";
});
