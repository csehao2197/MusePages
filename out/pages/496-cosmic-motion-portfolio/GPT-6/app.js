const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.getElementById("loader");
function loaded()
{
    loader.hidden = true;
    document.body.classList.add("ready");
}
if (reduced) loaded();
else
{
    const start = performance.now();
    function loading(now)
    {
        const progress = Math.min(1, (now - start) / 2700);
        document.getElementById("loading-count").textContent = String(Math.floor(progress * 100)).padStart(3, "0");
        document.getElementById("loading-progress").style.transform = `scaleX(${progress})`;
        document.getElementById("loading-word").textContent = ["Design", "Create", "Inspire"][Math.min(2, Math.floor((now - start) / 900))];
        if (progress < 1) requestAnimationFrame(loading);
        else setTimeout(loaded, 400);
    }
    requestAnimationFrame(loading);
}
const roles = ["Creative", "Fullstack", "Founder", "Scholar"];
let roleIndex = 0;
setInterval(() =>
{
    roleIndex = (roleIndex + 1) % roles.length;
    const role = document.getElementById("role");
    role.textContent = roles[roleIndex];
    role.classList.remove("role-animation");
    void role.offsetWidth;
    role.classList.add("role-animation");
}, 2000);
const projectNames = ["Automotive Motion", "Urban Architecture", "Human Perspective", "Brand Identity"];
const projectImages = ["automotive.svg", "architecture.svg", "perspective.svg", "identity.svg"];
const projectCopy = [
    "A study in tension and velocity. Sculpted surfaces, long exposures and a restrained palette explore how a vehicle can communicate movement before it moves.",
    "An exploration of human-scale rhythm inside the city. Repeated forms, changing light and deliberate perspective reveal the warmth in structural systems.",
    "A visual essay about the person on the other side of the screen. Quiet portraiture and expressive shapes put empathy before interface.",
    "A flexible graphic language built around one idea: clarity with character. The identity moves between a singular mark and a modular world."
];
const detail = document.getElementById("detail");
function showDetail(label, title, copy, image)
{
    document.getElementById("detail-label").textContent = label;
    document.getElementById("detail-title").textContent = title;
    document.getElementById("detail-copy").innerHTML = copy;
    const element = document.getElementById("detail-image");
    element.hidden = !image;
    if (image) element.src = image;
    detail.showModal();
}
document.querySelectorAll(".project").forEach((button) => button.onclick = () =>
{
    const index = Number(button.dataset.project);
    showDetail("LOCAL CONCEPT CASE STUDY", projectNames[index], `<p>${projectCopy[index]}</p><p>Original local concept artwork for this static portfolio demonstration, not a live client release.</p>`, projectImages[index]);
});
document.querySelector(".view-all").onclick = () => showDetail("WORK INDEX", "From concept to launch.", `<p>${projectNames.join(" · ")}</p><p>All four concept studies are included in the selected-work grid below.</p>`);
const journal = [
    ["The small details are the whole experience", "5 min read", "Oct 28, 2026", "identity.svg", "A system becomes memorable through its smallest moments: how it waits, how it responds, and how it makes space for a person. Start with one interaction. Remove what distracts. Refine what remains."],
    ["Designing for the space between", "4 min read", "Oct 12, 2026", "architecture.svg", "The space between elements is a design material. It sets pace, creates relationships, and lets an idea breathe. The same is true of the spaces between disciplines: often the best work lives there."],
    ["A little room for the unexpected", "6 min read", "Sep 30, 2026", "perspective.svg", "A creative process needs enough structure to move and enough openness to change direction. Keep a playground beside the project. Let a surprising sketch challenge an obvious answer."],
    ["Making motion mean something", "3 min read", "Sep 14, 2026", "automotive.svg", "Motion should clarify a relationship, acknowledge an action, or establish a rhythm. If it does none of these things, ask whether the still version is more honest. Always make room for reduced motion."]
];
document.querySelector(".entries").innerHTML = journal.map(([title, time, date, image], index) => `<button class="entry reveal" data-entry="${index}"><img src="${image}" alt=""><div><h3>${title}</h3><p>${time} / ${date}</p></div><span>↗</span></button>`).join("");
document.querySelectorAll(".entry").forEach((button) => button.onclick = () =>
{
    const [title, time, date, image, copy] = journal[Number(button.dataset.entry)];
    showDetail(`ORIGINAL DEMO JOURNAL / ${time} / ${date}`, title, `<p>${copy}</p>`, image);
});
document.getElementById("all-journal").onclick = () => showDetail("JOURNAL INDEX", "Recent thoughts", `<p>${journal.map((entry) => entry[0]).join("</p><p>")}</p>`);
document.getElementById("resume").onclick = () => showDetail("DEMONSTRATION PROFILE", "Michael Smith", "<p>Creative practice at the intersection of design and engineering. Based in Chicago.</p><p>Focus: digital products, interaction systems, art direction and creative exploration.</p><p>Source brief: 20+ years experience / 95+ projects. These are portfolio demonstration claims, not a verified employment history.</p>");
const columns = document.querySelectorAll(".parallax-columns > div");
for (let index = 0; index < 6; index++)
{
    const button = document.createElement("button");
    button.className = "exploration";
    button.setAttribute("aria-label", `Open exploration ${index + 1}`);
    button.innerHTML = `<img src="exploration-${index}.svg" alt="Original visual exploration ${index + 1}">`;
    button.style.rotate = `${index % 2 ? 6 : -6}deg`;
    button.onclick = () => openLightbox(index);
    columns[index % 2].append(button);
}
let selected = 0;
const lightbox = document.getElementById("lightbox");
function openLightbox(index)
{
    selected = (index + 6) % 6;
    document.getElementById("lightbox-image").src = `exploration-${selected}.svg`;
    document.getElementById("lightbox-count").textContent = `${selected + 1} / 6`;
    if (!lightbox.open) lightbox.showModal();
}
document.getElementById("previous").onclick = () => openLightbox(selected - 1);
document.getElementById("next").onclick = () => openLightbox(selected + 1);
document.addEventListener("keydown", (event) =>
{
    if (!lightbox.open) return;
    if (event.key === "ArrowRight") openLightbox(selected + 1);
    if (event.key === "ArrowLeft") openLightbox(selected - 1);
});
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.querySelector(".marquee > div").textContent = "BUILDING THE FUTURE • ".repeat(10);
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting) { entry.target.classList.add("seen"); observer.unobserve(entry.target); }
    });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
let queued = false;
function onScroll()
{
    if (queued) return;
    queued = true;
    requestAnimationFrame(() =>
    {
        document.body.classList.toggle("scrolled", scrollY > 100);
        const work = document.getElementById("work").getBoundingClientRect();
        document.querySelectorAll(".nav-pill a").forEach((link) => link.classList.toggle("active", link.hash === (work.top < innerHeight / 2 && work.bottom > 0 ? "#work" : "#home")));
        if (!reduced)
        {
            const rect = document.querySelector(".explorations").getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight)));
            columns[0].style.transform = `translateY(${-progress * 400}px)`;
            columns[1].style.transform = `translateY(${-progress * 650}px)`;
        }
        queued = false;
    });
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
