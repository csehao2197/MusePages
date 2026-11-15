const canvas = document.querySelector("#fluid");
const context = canvas.getContext("2d");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let frameId;
function draw(time)
{
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio, 2);
    if (canvas.width !== width * ratio || canvas.height !== height * ratio)
    {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const phase = reduced ? .7 : time * .00012;
    for (let line = 0; line < 94; line++)
    {
        context.beginPath();
        context.strokeStyle = `rgba(255, ${65 + line}, ${line * .3}, ${.12 + Math.sin(line / 94 * Math.PI) * .5})`;
        context.lineWidth = .65;
        for (let step = 0; step <= 150; step++)
        {
            const angle = step / 150 * Math.PI * 2;
            const radius = 65 + line * 2.8 + Math.sin(angle * 3 + phase + line * .035) * (20 + line * .2);
            const x = width * .39 + Math.cos(angle) * radius * .85;
            const y = height * .48 + Math.sin(angle) * radius * .66 + Math.cos(angle * 2 + phase) * 55;
            if (step === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }
        context.closePath();
        context.stroke();
    }
    if (!reduced && !document.hidden) frameId = requestAnimationFrame(draw);
}
draw(0);
document.addEventListener("visibilitychange", () =>
{
    cancelAnimationFrame(frameId);
    if (!document.hidden) draw(performance.now());
});
window.addEventListener("pagehide", () => cancelAnimationFrame(frameId));
window.addEventListener("resize", () => { if (reduced) draw(0); });
const entries =
[
    ["Orbit Finance", "FINTECH EXPERIENCE", "An intuitive financial world built around the way you move. Strategy, interface and a bold new visual language."],
    ["Forma Studio", "DESIGN SYSTEM", "A flexible design language that turns complexity into clarity. A study in structure, proportion and playful possibility."],
    ["Aether", "SPATIAL AUDIO", "A multisensory identity that lets you feel the sound. An immersive brand and product experience for a fictional audio studio."],
    ["Fieldnotes", "EDITORIAL PLATFORM", "An independent journal for the endlessly curious. A typographic digital world of new perspectives and unexpected stories."],
    ["Sonder", "HOSPITALITY", "A considered digital escape. An atmospheric identity and intuitive booking concept for a quieter kind of destination."]
];
let active = 0;
const cards = [...document.querySelectorAll(".project")];
function update(index)
{
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) =>
    {
        let distance = (i - active + 5) % 5;
        if (distance > 2) distance -= 5;
        const mobile = innerWidth <= 750;
        card.style.transform = `translateX(${distance * (mobile ? 275 : 300)}px) translateZ(${-Math.abs(distance) * 100}px) rotateY(${-distance * 24}deg) scale(${1 - Math.abs(distance) * .15})`;
        card.style.zIndex = String(10 - Math.abs(distance));
        card.style.filter = distance ? "brightness(.45) grayscale(1)" : "none";
        card.style.opacity = Math.abs(distance) === 2 ? ".45" : "1";
        card.setAttribute("aria-pressed", String(i === active));
    });
    document.querySelector("#project-title").textContent = entries[active][0];
    document.querySelector("#project-category").textContent = `0${active + 1} / ${entries[active][1]}`;
    document.querySelector("#project-description").textContent = entries[active][2];
    document.querySelector("#project-count").textContent = `0${active + 1} / 05`;
}
cards.forEach((card, i) => card.addEventListener("click", () => update(i)));
document.querySelector("#prev").addEventListener("click", () => update(active - 1));
document.querySelector("#next").addEventListener("click", () => update(active + 1));
window.addEventListener("resize", () => update(active));
const carousel = document.querySelector(".carousel");
carousel.addEventListener("pointermove", (event) =>
{
    if (reduced || event.pointerType !== "mouse" || innerWidth <= 750) return;
    const bounds = carousel.getBoundingClientRect();
    document.querySelector(".carousel-tilt").style.transform = `rotateX(${-(event.clientY - bounds.top - bounds.height / 2) / 35}deg) rotateY(${(event.clientX - bounds.left - bounds.width / 2) / 65}deg)`;
});
carousel.addEventListener("pointerleave", () => document.querySelector(".carousel-tilt").style.transform = "none");
update(0);
const dialog = document.querySelector("dialog");
function show(title, description)
{
    document.querySelector("#modal-title").textContent = title;
    document.querySelector("#modal-description").textContent = description;
    dialog.showModal();
}
document.querySelector("#visit").addEventListener("click", () => show(entries[active][0], `${entries[active][2]} This is original concept work for this portfolio, not an external live client website. The carousel artwork is the available front-end preview.`));
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () => show(button.dataset.social, "This concept portfolio has no connected social accounts. No external identity or client relationship is implied. Contact is a local demonstration.")));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector(".done").addEventListener("click", () => dialog.close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const message = document.querySelector("#message").value.trim();
    if (!name || message.length < 10)
    {
        document.querySelector("#form-status").textContent = "Please add your name and at least 10 meaningful message characters.";
        return;
    }
    document.querySelector("#form-status").textContent = `Thanks, ${name}. Your project note is ready. This is a local demo; nothing has been sent.`;
});
