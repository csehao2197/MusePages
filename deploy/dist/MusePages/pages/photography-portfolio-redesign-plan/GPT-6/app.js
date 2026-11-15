const $ = (id) => document.getElementById(id);
const work = [
    { category: "retail", title: "Spaces worth stepping into", service: "Retail & spaces", image: "architecture", description: "Show people the experience before they walk through the door. Considered photographs for spaces with a point of view." },
    { category: "marketing", title: "A quieter kind of statement", service: "Marketing & social", image: "interior", description: "A library of distinctive images that feels like your brand, wherever the conversation happens." },
    { category: "headshots", title: "The person behind the work", service: "Headshots", image: "portrait", description: "Approachable portraits, confidently you. A relaxed experience for people who would rather be behind a desk than a lens." },
    { category: "events", title: "A gathering to remember", service: "Events", image: "event", description: "The atmosphere, the anticipation and the in-between moments. Your event, remembered as it felt." }
];
$("service-list").innerHTML = work.map((item, index) => `<article class="service"><button class="service-image" data-gallery="${index}" aria-label="Open ${item.service} gallery"><img src="assets/${item.image}.jpg" alt="${item.title}" loading="lazy"><span>Explore sample images ↗</span></button><div class="service-copy"><p class="eyebrow">0${index + 1} / BUILT AROUND YOUR BUSINESS</p><h3>${item.service}</h3><p>${item.description}</p><a href="?filter=${item.category}#projects" data-project-link="${item.category}">View projects →</a></div></article>`).join("");
let activeSlide = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const labels = ["ARCHITECTURE / A STUDY IN FORM", "INTERIORS / AN EVERYDAY PERSPECTIVE", "EVENTS / ROOM FOR CONNECTION"];
function showSlide(index)
{
    activeSlide = index;
    document.querySelectorAll(".slides img").forEach((image, i) => image.classList.toggle("current", i === index));
    document.querySelectorAll("[data-slide]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    $("slide-label").textContent = labels[index];
}
document.querySelectorAll("[data-slide]").forEach((button) => button.addEventListener("click", () => showSlide(Number(button.dataset.slide))));
function pauseLabel()
{
    $("pause").setAttribute("aria-label", paused ? "Resume slideshow" : "Pause slideshow");
    $("pause").textContent = paused ? "▷" : "Ⅱ";
}
$("pause").addEventListener("click", () => { paused = !paused; pauseLabel(); });
setInterval(() => { if (!paused && !document.hidden && !$("gallery").open) showSlide((activeSlide + 1) % 3); }, 6000);
pauseLabel();
let galleryIndex = 0;
function gallery()
{
    const item = work[galleryIndex];
    $("gallery-title").textContent = `SELECTED PERSPECTIVES / ${item.service.toUpperCase()}`;
    $("gallery-image").src = `assets/${item.image}.jpg`;
    $("gallery-image").alt = item.title;
    $("gallery-count").textContent = `${galleryIndex + 1} / ${work.length}`;
    $("caption").textContent = `${item.title} · Unsplash sample image, illustrative portfolio.`;
}
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-gallery]");
    if (button)
    {
        galleryIndex = Number(button.dataset.gallery);
        gallery();
        $("gallery").showModal();
    }
    const project = event.target.closest("[data-project-link]");
    if (project)
    {
        event.preventDefault();
        filter(project.dataset.projectLink);
        $("projects").scrollIntoView();
    }
});
$("next").addEventListener("click", () => { galleryIndex = (galleryIndex + 1) % work.length; gallery(); });
$("previous").addEventListener("click", () => { galleryIndex = (galleryIndex + work.length - 1) % work.length; gallery(); });
$("close").addEventListener("click", () => $("gallery").close());
function filter(category, updateURL = true)
{
    if (!["all", ...work.map((item) => item.category)].includes(category)) category = "all";
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("active", button.dataset.filter === category));
    $("project-grid").innerHTML = work.map((item, index) => ({ ...item, index })).filter((item) => category === "all" || item.category === category).map((item) => `<article class="project"><button data-gallery="${item.index}" aria-label="Open ${item.title}"><img src="assets/${item.image}.jpg" alt="${item.title}" loading="lazy"></button><p>${item.title} / ${item.service}</p></article>`).join("");
    if (updateURL)
    {
        const url = new URL(location.href);
        category === "all" ? url.searchParams.delete("filter") : url.searchParams.set("filter", category);
        history.replaceState(null, "", url);
    }
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => filter(button.dataset.filter)));
$("contact").addEventListener("submit", (event) =>
{
    event.preventDefault();
    let message = "Inquiry preview ready. No message was sent; connect a real contact service to book.";
    if (!$("first").value.trim() || !$("last").value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value.trim()) || $("needs").value.trim().length < 10) message = "Add both names, a valid email and at least 10 characters about your project.";
    else if ($("website").value.trim() && !/^https?:\/\/[^ ]+\.[^ ]+$/.test($("website").value.trim())) message = "Use a full http or https website address, or leave it blank.";
    $("contact-status").textContent = message;
});
filter(new URLSearchParams(location.search).get("filter") || "all", false);
