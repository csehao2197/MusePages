const dialog = document.querySelector("#info-dialog");
const mobile = document.querySelector("#mobile-nav");
const copy =
{
    Work: "A considered collection of fictional studies: Aeon — an editorial identity; Vela — a digital destination; Apex — a product system. This front-page concept demonstrates the studio’s visual language, not live client projects.",
    Studio: "Small by choice, ambitious by nature. Arc is a fictional independent studio pairing expressive design with thoughtful engineering. The studio metrics and brand names are illustrative.",
    Journal: "Field note / 01 — Make fewer things, better. A lasting digital experience starts with clear purpose, precise typography and an interface that respects its audience. This is a local editorial preview.",
    Credits: "Prompt source © 2026 Nomaan Khan, MIT license retained with this export. The silver sculpture and folded architecture are original SVG artwork. System Georgia/Arial replace external Instrument Serif/Barlow. No external footage, analytics, cookies or backend. This is a fictional studio.",
    Contact: "Tell us about your next chapter. This local brief validates your details in your browser; no request is transmitted or stored.",
    Showreel: "A short, original procedural motion study exploring the studio’s three disciplines. This is local Canvas artwork, not the source prompt’s third-party video."
};
let reelFrame;
let reelTime = 0;
let reelPaused = false;
let reelLast = 0;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function reelDraw(time)
{
    const canvas = document.querySelector("#reel-canvas");
    const context = canvas.getContext("2d");
    if (!reelPaused && !reduced) reelTime += Math.min(time - reelLast, 50);
    reelLast = time;
    context.fillStyle = "#050505";
    context.fillRect(0, 0, 640, 360);
    const phase = reelTime / 1600;
    for (let ring = 0; ring < 35; ring++)
    {
        context.beginPath();
        context.ellipse(320, 180, 35 + ring * 6, 20 + ring * 3, phase * .2 + ring * .025, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255,255,255,${.1 + ring / 80})`;
        context.lineWidth = .8;
        context.stroke();
    }
    const index = Math.floor(reelTime / 3500) % 3;
    const discipline = ["Design", "Engineering", "Growth"][index];
    context.fillStyle = "#fff";
    context.font = "italic 46px Georgia";
    context.textAlign = "center";
    context.fillText(discipline, 320, 195);
    document.querySelector("#reel-caption").textContent = `0${index + 1} / ${discipline}`;
    if (!reelPaused && !reduced && dialog.open) reelFrame = requestAnimationFrame(reelDraw);
}
function open(name)
{
    mobile.close();
    document.querySelector("#info-title").textContent = name === "Contact" ? "A new beginning." : name;
    document.querySelector("#info-copy").textContent = copy[name];
    document.querySelector("#brief").hidden = name !== "Contact";
    document.querySelector("#reel").hidden = name !== "Showreel";
    dialog.showModal();
    if (name === "Showreel")
    {
        reelTime = 0;
        reelLast = performance.now();
        reelPaused = false;
        document.querySelector("#reel-pause").textContent = "Pause Ⅱ";
        document.querySelector("#reel-pause").setAttribute("aria-pressed", "false");
        reelDraw(reelLast);
    }
}
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () => open(button.dataset.info)));
document.querySelectorAll("[data-contact]").forEach((button) => button.addEventListener("click", () => open("Contact")));
document.querySelector("#showreel").addEventListener("click", () => open("Showreel"));
document.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => cancelAnimationFrame(reelFrame));
document.querySelector("#reel-pause").addEventListener("click", (event) =>
{
    reelPaused = !reelPaused;
    event.currentTarget.textContent = reelPaused ? "Play ▷" : "Pause Ⅱ";
    event.currentTarget.setAttribute("aria-pressed", String(reelPaused));
    cancelAnimationFrame(reelFrame);
    reelLast = performance.now();
    reelDraw(reelLast);
});
document.querySelector(".mobile-toggle").addEventListener("click", () => mobile.showModal());
document.querySelector(".close-nav").addEventListener("click", () => mobile.close());
mobile.querySelector("a").addEventListener("click", () => mobile.close());
document.querySelectorAll("[data-mobile-info]").forEach((button) => button.addEventListener("click", () => open(button.dataset.mobileInfo)));
document.querySelectorAll(".scope").forEach((button) => button.addEventListener("click", () =>
{
    const expanded = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(expanded));
    button.nextElementSibling.hidden = !expanded;
    button.querySelector("span").textContent = expanded ? "−" : "+";
}));
document.querySelector("#brief").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const vision = document.querySelector("#vision").value.trim();
    document.querySelector("#brief-status").textContent = name && vision.length >= 10 ? `Thanks, ${name}. Your local brief is ready. Nothing has been sent or saved.` : "Please add your name and at least 10 meaningful project characters.";
});
window.addEventListener("pagehide", () => cancelAnimationFrame(reelFrame));
