const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const dialog = document.querySelector("dialog");
function closeMenu()
{
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () =>
{
    menu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.querySelector("#close-menu").focus();
});
document.querySelector("#close-menu").addEventListener("click", closeMenu);
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
const projects = [...document.querySelectorAll(".project")];
projects.forEach((project) =>
{
    project.addEventListener("click", () =>
    {
        projects.forEach((item) =>
        {
            item.classList.toggle("active", item === project);
            item.setAttribute("aria-expanded", String(item === project));
        });
    });
});
document.querySelectorAll(".questions details").forEach((item) =>
{
    item.addEventListener("toggle", () =>
    {
        if (item.open) document.querySelectorAll(".questions details").forEach((other) =>
        {
            if (other !== item) other.open = false;
        });
    });
});
const services =
{
    strategy: ["Strategy", "Clarity before creativity.", "Discovery, audience research, positioning and a clear roadmap. We build the foundation that makes every creative decision meaningful."],
    identity: ["Identity", "A character all your own.", "Brand systems, art direction, typography and visual languages. Distinctive by design, coherent at every touchpoint."],
    digital: ["Digital", "Useful meets unforgettable.", "UX research, interface design and creative development. Thoughtful, accessible experiences that turn first impressions into lasting connections."],
    motion: ["Motion", "Ideas in their element.", "Motion identities, interactive storytelling and expressive transitions. Movement with purpose, not decoration."]
};
function showPanel(label, title, content)
{
    document.querySelector("#dialog-label").textContent = label;
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-body").textContent = content;
    dialog.showModal();
}
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => showPanel(...services[button.dataset.service])));
document.querySelector("#start-project").addEventListener("click", () => showPanel("A new beginning", "Hello, possibility.", "Share your ambition, scope and timeline with hello@infine.example. This static creative portfolio uses a demonstration address; no message is sent or collected."));
document.querySelector(".close").addEventListener("click", () => dialog.close());
const reveal = document.querySelector(".reveal");
reveal.innerHTML = reveal.textContent.split(" ").map((word) => `<span>${word}</span>`).join(" ");
let lastY = 0;
function onScroll()
{
    const y = window.scrollY;
    navigation.classList.toggle("scrolled", y > 50);
    navigation.classList.toggle("away", y > lastY && y > 150 && menu.hidden);
    lastY = y;
    const progress = Math.min(1, y / (innerHeight * .45));
    document.documentElement.style.setProperty("--hero-scale", String(1 - progress * .2));
    document.documentElement.style.setProperty("--hero-radius", `${progress * 32}px`);
    const rect = reveal.getBoundingClientRect();
    const amount = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight * .6)));
    const words = [...reveal.children];
    words.forEach((word, index) => word.style.opacity = String(Math.max(.15, Math.min(1, amount * 2 - index / words.length))));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
document.addEventListener("pointermove", (event) =>
{
    document.querySelector(".cursor").style.transform = `translate(${event.clientX + 38}px, ${event.clientY + 38}px)`;
});
