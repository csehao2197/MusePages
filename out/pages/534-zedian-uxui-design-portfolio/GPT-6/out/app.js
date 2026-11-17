"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motion = window.Motion;
const projects =
[
    {
        name: "Forma",
        category: "ARCHITECTURE / DIGITAL EXPERIENCE",
        description: "A new digital home for a forward-thinking architecture studio. Quiet confidence, generous space, and a design system that lets the work speak.",
        tags: ["UX Strategy", "Web Design", "Development"],
        image: "assets/architecture.jpg",
        challenge: "Make an architectural practice’s portfolio as considered and approachable as the spaces it creates, without overwhelming visitors with a wall of projects.",
        approach: "An image-led hierarchy, editorial typography, and a simple project discovery flow. Modular components keep residential, commercial, and research work feeling connected.",
        outcome: "A conceptual responsive experience with clear project navigation and a quieter visual rhythm. No client engagement or measured business results are claimed.",
        year: "2026"
    },
    {
        name: "Offgrid",
        category: "CULTURE / BRAND EXPERIENCE",
        description: "An expressive platform for independent digital culture. Playful typography and unexpected color bring a curious community’s stories to the surface.",
        tags: ["Art Direction", "Brand Identity", "Interaction"],
        image: "assets/technology.jpg",
        challenge: "Create a distinct identity for a culture platform that values discovery over predictable feeds, while keeping reading and browsing effortless.",
        approach: "A bold typographic voice, sharp acid-green accents, and story-first navigation. Motion adds moments of discovery without becoming an obstacle.",
        outcome: "An independent visual and interaction study for a fictional brand. The work explores a design direction, not a live content platform.",
        year: "2025"
    },
    {
        name: "Index",
        category: "EDITORIAL / READING EXPERIENCE",
        description: "A thoughtful online journal for ideas that deserve a second look. An editorial identity balancing confident imagery with an effortless reading experience.",
        tags: ["Editorial", "UI Design", "Design System"],
        image: "assets/editorial.jpg",
        challenge: "Give long-form stories room to breathe and help readers find a new perspective without burying them in recommendation widgets.",
        approach: "Warm neutrals, a literary headline style, and a deliberate reading hierarchy. Accessible navigation connects essays, interviews, and visual stories.",
        outcome: "A fictional editorial design concept that demonstrates typography and content strategy. Article publishing and a CMS are outside this static portfolio.",
        year: "2024"
    }
];

function animate(element, keyframes, options = {})
{
    if (reducedMotion.matches || !motion)
    {
        const final = Object.fromEntries(Object.entries(keyframes).map(([key, value]) => [key, Array.isArray(value) ? value.at(-1) : value]));
        Object.assign(element.style, final);
        return Promise.resolve();
    }
    return motion.animate(element, keyframes, { duration: .5, ease: [.32, .72, 0, 1], ...options });
}

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu()
{
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", open);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menu.focus();
    }
});

const dialogs = document.querySelectorAll("dialog");
function openDialog(id)
{
    closeMenu();
    dialogs.forEach((dialog) =>
    {
        if (dialog.open) dialog.close();
    });
    document.querySelector(`#${id}`).showModal();
    document.body.classList.add("modal-open");
}
dialogs.forEach((dialog) =>
{
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
    dialog.addEventListener("click", (event) =>
    {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom))
        {
            dialog.close();
        }
    });
});
document.querySelectorAll("[data-contact]").forEach((button) => button.addEventListener("click", () => openDialog("contact-dialog")));

let active = 0;
let projectTransition;
const cards = [...document.querySelectorAll(".project-card")];
const dots = [...document.querySelectorAll("[data-select]")];
function selectProject(index, initial = false)
{
    active = index;
    cards.forEach((card, cardIndex) =>
    {
        const diff = (cardIndex - active + cards.length) % cards.length;
        card.style.transform = `translateY(${diff * 35}px) scale(${1 - diff * .05}) rotateX(${diff * 2}deg)`;
        card.style.zIndex = String(cards.length - diff);
        card.style.filter = diff ? `brightness(${1 - diff * .17})` : "none";
        card.setAttribute("aria-label", `${projects[cardIndex].name} — ${diff === 0 ? "front card, click to cycle" : "click to bring to front"}`);
    });
    dots.forEach((dot, index) => dot.setAttribute("aria-pressed", String(index === active)));
    document.querySelector("#project-counter").textContent = `0${active + 1} — 03`;
    const project = projects[active];
    document.querySelector("#project-category").textContent = project.category;
    const title = document.querySelector("#project-title");
    title.replaceChildren(document.createTextNode(project.name), Object.assign(document.createElement("span"), { className: "accent", textContent: "." }));
    document.querySelector("#project-description").textContent = project.description;
    document.querySelector("#project-tags").replaceChildren(...project.tags.map((tag) => Object.assign(document.createElement("span"), { textContent: tag })));
    if (!initial)
    {
        projectTransition?.stop?.();
        projectTransition = animate(document.querySelector(".project-details"), { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] }, { duration: .45 });
    }
}
cards.forEach((card, index) => card.addEventListener("click", () => selectProject(index === active ? (active + 1) % projects.length : index)));
dots.forEach((dot) => dot.addEventListener("click", () => selectProject(Number(dot.dataset.select))));
selectProject(0, true);

document.querySelector("#all-projects").addEventListener("click", () => openDialog("index-dialog"));
document.querySelectorAll("[data-index]").forEach((button) => button.addEventListener("click", () =>
{
    selectProject(Number(button.dataset.index));
    document.querySelector("#index-dialog").close();
    document.querySelector("#work").scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth" });
    document.querySelector("#explore-project").focus({ preventScroll: true });
}));
document.querySelector("#explore-project").addEventListener("click", () =>
{
    const project = projects[active];
    document.querySelector("#case-title").textContent = `${project.name}. / ${project.year}`;
    const content = document.querySelector("#case-content");
    content.replaceChildren();
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = `${project.name} conceptual project photography`;
    image.className = "case-image";
    content.append(image);
    for (const [label, key] of [["The challenge", "challenge"], ["The approach", "approach"], ["The outcome", "outcome"]])
    {
        content.append(Object.assign(document.createElement("h3"), { textContent: label }));
        content.append(Object.assign(document.createElement("p"), { textContent: project[key] }));
    }
    openDialog("project-dialog");
});
document.querySelector("#case-contact").addEventListener("click", () => openDialog("contact-dialog"));

const stageAnimations = new Map();
async function toggleStage(button, open)
{
    const content = document.getElementById(button.getAttribute("aria-controls"));
    stageAnimations.get(content)?.stop?.();
    button.setAttribute("aria-expanded", String(open));
    if (open)
    {
        content.hidden = false;
        const height = content.scrollHeight;
        content.style.height = "0px";
        const animation = animate(content, { height: ["0px", `${height}px`], opacity: [0, 1] }, { duration: .35 });
        stageAnimations.set(content, animation);
        await animation;
        if (button.getAttribute("aria-expanded") === "true") content.style.height = "auto";
    }
    else
    {
        const animation = animate(content, { height: [`${content.scrollHeight}px`, "0px"], opacity: [1, 0] }, { duration: .25 });
        stageAnimations.set(content, animation);
        await animation;
        if (button.getAttribute("aria-expanded") === "false") content.hidden = true;
    }
}
const stageButtons = [...document.querySelectorAll(".stage h3 button")];
stageButtons.forEach((button) => button.addEventListener("click", () =>
{
    const open = button.getAttribute("aria-expanded") !== "true";
    stageButtons.forEach((other) =>
    {
        if (other !== button && other.getAttribute("aria-expanded") === "true") toggleStage(other, false);
    });
    toggleStage(button, open);
}));

const badge = document.querySelector("#badge");
let drag;
let badgeAnimation;
let keyboardX = 0;
let keyboardY = 0;
function positionBadge(x, y)
{
    badge.style.transform = `translate(${x}px, ${y}px) rotate(${7 + x * .045}deg)`;
    badge.dataset.offsetX = String(x);
    badge.dataset.offsetY = String(y);
}
function resetBadge()
{
    keyboardX = 0;
    keyboardY = 0;
    badgeAnimation?.stop?.();
    badgeAnimation = animate(badge, { transform: "translate(0px, 0px) rotate(7deg)" },
    {
        type: "spring",
        stiffness: 600,
        damping: 20,
        duration: undefined
    });
    badge.dataset.offsetX = "0";
    badge.dataset.offsetY = "0";
}
badge.addEventListener("pointerdown", (event) =>
{
    if (event.button !== 0) return;
    badgeAnimation?.stop?.();
    drag = { x: event.clientX, y: event.clientY, id: event.pointerId };
    badge.setPointerCapture(event.pointerId);
    badge.focus({ preventScroll: true });
    badge.parentElement.style.animationPlayState = "paused";
});
badge.addEventListener("pointermove", (event) =>
{
    if (!drag || drag.id !== event.pointerId) return;
    const constrain = (value, limit) => Math.abs(value) <= limit ? value : Math.sign(value) * (limit + (Math.abs(value) - limit) * .2);
    const maxX = window.innerWidth <= 700 ? 30 : 65;
    positionBadge(constrain(event.clientX - drag.x, maxX), constrain(event.clientY - drag.y, 55));
});
function endDrag(event)
{
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    resetBadge();
    badge.parentElement.style.animationPlayState = "";
}
badge.addEventListener("pointerup", endDrag);
badge.addEventListener("pointercancel", endDrag);
badge.addEventListener("lostpointercapture", endDrag);
badge.addEventListener("keydown", (event) =>
{
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape", "Enter", " "].includes(event.key))
    {
        event.preventDefault();
        badgeAnimation?.stop?.();
        if (["Escape", "Enter", " "].includes(event.key))
        {
            resetBadge();
            return;
        }
        keyboardX = Math.max(-30, Math.min(30, keyboardX + (event.key === "ArrowLeft" ? -10 : event.key === "ArrowRight" ? 10 : 0)));
        keyboardY = Math.max(-30, Math.min(30, keyboardY + (event.key === "ArrowUp" ? -10 : event.key === "ArrowDown" ? 10 : 0)));
        positionBadge(keyboardX, keyboardY);
    }
});
badge.addEventListener("blur", resetBadge);

const form = document.querySelector("#brief-form");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const brief = `Project enquiry\n\nName: ${data.get("name").trim()}\nEmail: ${data.get("email").trim()}\n\nProject:\n${data.get("message").trim()}\n\nCreated locally using the Zedian portfolio demo.`;
    document.querySelector("#brief-text").value = brief;
    document.querySelector("#brief-result").hidden = false;
    document.querySelector("#email-brief").href = `mailto:hello@zedian.example?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(brief)}`;
    document.querySelector("#form-feedback").textContent = "Your brief is ready. Nothing has been sent.";
    document.querySelector("#brief-text").focus();
});
document.querySelector("#copy-brief").addEventListener("click", async () =>
{
    const text = document.querySelector("#brief-text");
    try
    {
        await navigator.clipboard.writeText(text.value);
        document.querySelector("#form-feedback").textContent = "Brief copied to clipboard.";
    }
    catch
    {
        text.focus();
        text.select();
        document.querySelector("#form-feedback").textContent = "Select and copy the brief using your keyboard or device menu.";
    }
});

function showInformation(title, paragraphs, link)
{
    document.querySelector("#info-title").textContent = title;
    const content = document.querySelector("#info-content");
    content.replaceChildren(...paragraphs.map((text) => Object.assign(document.createElement("p"), { textContent: text })));
    if (link)
    {
        const anchor = Object.assign(document.createElement("a"), { href: link.url, textContent: link.label, target: "_blank", rel: "noopener noreferrer" });
        content.append(anchor);
    }
    openDialog("info-dialog");
}
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () =>
{
    const platform = button.dataset.social;
    const urls = { Dribbble: "https://dribbble.com/", Behance: "https://www.behance.net/", LinkedIn: "https://www.linkedin.com/" };
    showInformation(`${platform} / demo`, ["Zedian is a fictional portfolio identity. No personal social profile is claimed or connected.", "You can visit the platform itself below. This opens an external website."], { url: urls[platform], label: `Visit ${platform} ↗` });
}));
document.querySelector("#privacy").addEventListener("click", () => showInformation("Privacy & credits",
[
    "This static portfolio uses no analytics, cookies, remote fonts, or storage. Briefs stay in memory in your browser and disappear when you reload. Copying uses your device clipboard; opening an email draft hands the brief to your email application.",
    "Zedian, the biography, awards, and project case studies are fictional design demonstrations. This is not a live business or booking service.",
    "Prompt: Nomaan Khan / frostmute, msites-prompt-collection (MIT). Photographic placeholders: Unsplash contributors, used under the Unsplash License; they do not depict a real Zedian or client work. Photography source links and third-party license notices accompany this page.",
    "Motion animations: Framer B.V. (MIT). Icons: Lucide contributors (ISC) and Cole Bemis / Feather (MIT). Generated by gpt-6.1-sol, displayed in the collection as GPT-6."
], { url: "credits.html", label: "Read source links and license notices ↗" }));

if (motion && !reducedMotion.matches)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (!entry.isIntersecting) return;
            animate(entry.target, { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] }, { duration: .6 });
            if (entry.target.classList.contains("toolkit"))
            {
                entry.target.querySelectorAll(".skills span").forEach((chip, index) => animate(chip, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { delay: index * .1, duration: .6 }));
            }
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -60px 0px", threshold: .08 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}
