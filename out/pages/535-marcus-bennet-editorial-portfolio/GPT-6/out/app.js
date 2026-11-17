const hero = document.querySelector(".hero");
const toggle = document.querySelector(".menu-toggle");
const panel = document.querySelector(".panel");
const backdrop = document.querySelector(".backdrop");
const closeButton = document.querySelector(".close");
const desktop = matchMedia("(min-width: 640px)");
let previousOverflow = "";

function setOpen(open)
{
    if (open === hero.classList.contains("menu-open")) return;
    if (open) previousOverflow = document.body.style.overflow;
    hero.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.setAttribute("aria-hidden", String(!open));
    panel.inert = !open;
    document.body.style.overflow = open ? "hidden" : previousOverflow;
    if (open) panel.querySelector("a").focus();
    else if (!desktop.matches) toggle.focus();
}

toggle.addEventListener("click", () => setOpen(!hero.classList.contains("menu-open")));
closeButton.addEventListener("click", () => setOpen(false));
backdrop.addEventListener("click", () => setOpen(false));
panel.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setOpen(false)));
desktop.addEventListener("change", event =>
{
    if (event.matches) setOpen(false);
});
document.addEventListener("keydown", event =>
{
    if (!hero.classList.contains("menu-open")) return;
    if (event.key === "Escape")
    {
        event.preventDefault();
        setOpen(false);
    }
    if (event.key !== "Tab") return;
    const focusable = [toggle, closeButton, ...panel.querySelectorAll("a")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first)
    {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
        event.preventDefault();
        first.focus();
    }
});
