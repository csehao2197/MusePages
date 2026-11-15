const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
const dialog = document.querySelector("#detail");
function show(title, label, copy)
{
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-label").textContent = label;
    document.querySelector("#detail-copy").textContent = copy;
    dialog.showModal();
}
document.querySelectorAll("[data-talk]").forEach((button) => button.addEventListener("click", () =>
{
    show(button.querySelector("strong").textContent, button.querySelector("em").textContent, `${button.querySelector("small").textContent} This brief-supplied talk is a portfolio preview. A recording and availability have not been supplied; use the email enquiry for a discussion.`);
}));
document.querySelectorAll("[data-essay]").forEach((button) => button.addEventListener("click", () =>
{
    show(button.dataset.essay, "SELECTED WRITING · REFERENCE ONLY", "The brief supplies the title and publication, not the article text or a verified publication link. No article is reproduced here. Ask about the writing through the example email.");
}));
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () =>
{
    show(button.dataset.social, "SOCIAL PROFILE", "A verified profile URL was not supplied for this fictional person. This preview does not impersonate a real social account.");
}));
document.querySelectorAll(".projects article").forEach((card) =>
{
    const heading = card.querySelector("h3");
    const button = document.createElement("button");
    button.className = "project-name";
    button.textContent = heading.textContent;
    heading.replaceChildren(button);
    button.addEventListener("click", () =>
    {
        show(button.textContent.replace("↗", "").trim(), "ENGAGEMENT STUDY · ILLUSTRATIVE", `${card.querySelector("p").textContent} This brief-supplied result is fictional, not a verified client endorsement. Ask about the workshop format through the example email.`);
    });
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#detail-book").addEventListener("click", () => dialog.close());
document.querySelector("#press").addEventListener("click", () =>
{
    const content = "NADIA OKONJO — FICTIONAL PRESS KIT\nSpeaker, advisor, writer. Based in Lisbon.\nI help large organisations make decisions faster without making them worse.\nTalks: The Consensus Tax; Deciding at Speed; The Meeting That Should Have Been Three; Nobody Reads the Strategy.\nLanguages: English, Portuguese, Igbo.\nBrief-supplied example contact: hello@nadiaokonjo.com\nAll credentials and client stories are illustrative, unverified brief content. Original illustrated portrait available separately; real press photos not supplied.\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "nadia-press-kit.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
if (matchMedia("(hover:hover) and (pointer:fine)").matches)
{
    const cursor = document.querySelector("#cursor");
    document.addEventListener("pointermove", (event) =>
    {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll(".projects article").forEach((card) =>
    {
        card.addEventListener("pointerenter", () =>
        {
            cursor.style.width = cursor.style.height = "64px";
            cursor.textContent = "View";
        });
        card.addEventListener("pointerleave", () =>
        {
            cursor.style.width = cursor.style.height = "10px";
            cursor.textContent = "";
        });
    });
}
