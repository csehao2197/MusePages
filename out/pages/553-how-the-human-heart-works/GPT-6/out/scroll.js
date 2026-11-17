import { content } from "./content.js";
import { clamp } from "./model.js";

const travel =
[
    [[330, 340]], [[332, 442]], [[380, 560]], [[432, 290]],
    [[432, 188], [880, 188], [880, 290]], [[700, 290], [640, 320]], [[626, 425]],
    [[626, 580]], [[500, 330]], [[500, 120], [640, 56], [792, 166], [792, 700], [500, 852], [204, 836]]
];
function interpolate(points, progress)
{
    const lengths = points.slice(1).map((point, i) => Math.hypot(point[0] - points[i][0], point[1] - points[i][1]));
    let distance = lengths.reduce((a, b) => a + b, 0) * clamp(progress);
    for (let i = 0; i < lengths.length; i++)
    {
        if (lengths[i] === 0) continue;
        if (distance <= lengths[i])
        {
            const x = distance / lengths[i];
            return points[i].map((v, j) => v + (points[i + 1][j] - v) * x);
        }
        distance -= lengths[i];
    }
    return points.at(-1);
}

export function connectScroll(diagram, reduced)
{
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const cards = [...document.querySelectorAll(".path-step")];
    const dots = [...document.querySelectorAll(".path-dot")];
    let active = 0;
    function select(index)
    {
        active = index;
        const [name, , , targets, position] = content.path.steps[index];
        diagram.spotlight(targets, name, position);
        cards.forEach((card, i) => card.classList.toggle("active", i === index));
        dots.forEach((dot, i) =>
        {
            dot.classList.toggle("active", i === index);
            dot.setAttribute("aria-current", i === index ? "step" : "false");
        });
        document.querySelector("#active-stop").textContent = `${String(index + 1).padStart(2, "0")} / 10 · ${name}`;
        if (reduced.matches) diagram.setDrop(position, index >= 5);
        document.querySelector("#path").dataset.activeStep = index;
    }
    select(0);
    cards.forEach((card, index) => ScrollTrigger.create(
    {
        trigger: card, start: "top 60%", end: "bottom 60%",
        onEnter: () => select(index), onEnterBack: () => select(index)
    }));
    ScrollTrigger.create(
    {
        trigger: ".path-layout", start: "top 60%", end: "bottom 60%", scrub: true,
        onUpdate: (self) =>
        {
            if (reduced.matches) return;
            const overall = self.progress * 10;
            const index = Math.min(9, Math.floor(overall));
            const previous = index === 0 ? travel[0][0] : content.path.steps[index - 1][4];
            const points = [previous, ...travel[index]];
            const position = interpolate(points, overall - index);
            diagram.setDrop(position, index >= 5);
        }
    });
    for (const [id] of content.nav)
    {
        ScrollTrigger.create(
        {
            trigger: `#${id}`, start: "top 35%", end: "bottom 35%",
            onToggle: (self) =>
            {
                if (!self.isActive) return;
                document.querySelectorAll("header nav a").forEach((a) =>
                {
                    const current = a.hash === `#${id}`;
                    a.classList.toggle("current", current);
                    if (current) a.setAttribute("aria-current", "location");
                    else a.removeAttribute("aria-current");
                });
            }
        });
    }
    if (!reduced.matches)
    {
        for (const element of document.querySelectorAll(".section-heading, .reveal"))
        {
            gsap.from(element, { y: 16, opacity: 0, duration: 0.5, scrollTrigger: { trigger: element, start: "top 92%", once: true } });
        }
        gsap.from(".rate-fill", { scaleX: 0, transformOrigin: "left", duration: 0.6, scrollTrigger: { trigger: "#rate", start: "top 85%", once: true } });
    }
    reduced.addEventListener("change", () => select(active));
    ScrollTrigger.refresh();
}
