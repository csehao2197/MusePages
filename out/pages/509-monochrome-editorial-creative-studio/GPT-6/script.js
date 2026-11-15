const menu = document.querySelector("#menu");
const toggle = document.querySelector(".menu-button");
toggle.addEventListener("click", () =>
{
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => toggle.setAttribute("aria-expanded", "false"));
document.querySelector(".menu-close").addEventListener("click", () => menu.close());
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.close()));
document.querySelectorAll("h1 > span").forEach((line) =>
{
    const text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-label", text);
    [...text].forEach((character, index) =>
    {
        const letter = document.createElement("i");
        letter.textContent = character === " " ? "\u00a0" : character;
        letter.style.setProperty("--index", index);
        letter.setAttribute("aria-hidden", "true");
        line.append(letter);
    });
});
document.querySelector("#motion").addEventListener("click", (event) =>
{
    const paused = document.querySelector(".marquee-section").classList.toggle("paused");
    event.currentTarget.textContent = paused ? "Resume motion ▷" : "Pause motion Ⅱ";
    event.currentTarget.setAttribute("aria-pressed", String(paused));
});
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) =>
    {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
    });
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((project) =>
    {
        project.hidden = button.dataset.filter !== "all" && project.dataset.category !== button.dataset.filter;
        if (!project.hidden) count++;
    });
    document.querySelector("#result-count").textContent = `${count} projects`;
}));
const details = document.querySelector("#project-dialog");
const descriptions =
{
    Matter: "A material-first brand identity for a fictional objects company. A simple spherical form becomes a flexible visual language. Original CSS sculpture; identity, packaging and art direction concept.",
    "Between Spaces": "An editorial digital concept for an architecture journal. Bold structural lines, generous space and an intuitive rhythm help the work tell its own story. All architecture is original abstract CSS artwork.",
    "Open Practice": "An open-minded identity for a fictional collaborative workspace. Interlocking forms express the connections between people, ideas and places. Original local artwork; no third-party imagery.",
    "The Other Side": "An independent journal concept exploring perspectives beyond the familiar. A typographic publication and digital reading experience; this homepage demonstrates the visual direction.",
    "Social links": "This is a fictional studio concept. Social profile connections are not configured. You can explore all four original projects here; external social accounts are not represented.",
    "Credits & privacy": "Prompt content by Superdesign under CC0 1.0; the full dedication is retained with this page. All artwork is original CSS. Arial replaces external Inter. No analytics, cookies, personal data collection or backend. Email address is illustrative."
};
document.querySelectorAll("[data-title], [data-info]").forEach((button) => button.addEventListener("click", () =>
{
    const title = button.dataset.title || button.dataset.info;
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-copy").textContent = descriptions[title];
    details.showModal();
}));
document.querySelector(".detail-close").addEventListener("click", () => details.close());
document.querySelector(".detail-done").addEventListener("click", () => details.close());
if (matchMedia("(pointer: fine)").matches)
{
    const cursor = document.querySelector(".cursor");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -100, y = -100, targetX = -100, targetY = -100;
    document.addEventListener("pointermove", (event) =>
    {
        targetX = event.clientX - 16;
        targetY = event.clientY - 16;
        cursor.classList.toggle("hovering", Boolean(event.target.closest("a, button")));
    });
    function frame()
    {
        x += (targetX - x) * (reduced ? 1 : .18);
        y += (targetY - y) * (reduced ? 1 : .18);
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
