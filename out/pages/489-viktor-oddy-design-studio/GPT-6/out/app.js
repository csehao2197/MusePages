const track = document.querySelector(".track");
for (let i = 0; i < 16; i++)
{
    const image = new Image();
    image.src = `study-${i % 8}.svg`;
    image.alt = i < 8 ? `Original studio graphic study ${i + 1}` : "";
    track.append(image);
}
const clients = [
    ["Marcus Anderson", "CEO, Data.storage", "With very little guidance team delivered designs that were consistently spot on..."],
    ["alexwu", "Founder, Nexgate", "Viktor led the creation of our best fundraising deck to date!..."],
    ["James Mitchell", "VP Product, LaunchPad", "Working with Viktor transformed our product vision..."],
    ["Rachel Foster", "Co-founder, Nexus Labs", "The design quality exceeded our expectations..."],
    ["David Zhang", "Head of Design, Paradigm Labs", "Incredible work from start to finish..."]
];
let active = 0;
let paused = false;
function show(index)
{
    active = (index + clients.length) % clients.length;
    const [name, company, quote] = clients[active];
    document.getElementById("client").textContent = name;
    document.getElementById("company").textContent = `↗ ${company}`;
    document.getElementById("testimonial").textContent = quote;
    document.getElementById("initials").textContent = name.split(" ").map((word) => word[0]).join("");
    document.getElementById("position").textContent = `${active + 1} / 5`;
}
document.getElementById("next").onclick = () => show(active + 1);
document.getElementById("prev").onclick = () => show(active - 1);
const carousel = document.querySelector(".carousel");
carousel.addEventListener("mouseenter", () => { paused = true; });
carousel.addEventListener("mouseleave", () => { paused = false; });
carousel.addEventListener("focusin", () => { paused = true; });
carousel.addEventListener("focusout", () => { paused = false; });
setInterval(() => { if (!paused && !document.hidden) show(active + 1); }, 3000);
show(0);
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("seen");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
let queued = false;
function parallax()
{
    if (queued) return;
    queued = true;
    requestAnimationFrame(() =>
    {
        const portrait = document.querySelector(".portrait");
        const rect = portrait.parentElement.getBoundingClientRect();
        const offset = Math.max(-100, Math.min(100, (innerHeight / 2 - rect.top) * .14));
        portrait.style.transform = `translateY(${offset - 45}px)`;
        queued = false;
    });
}
addEventListener("scroll", parallax, { passive: true });
parallax();
const partner = document.querySelector(".partner");
let last = 0;
partner.addEventListener("pointermove", (event) =>
{
    if (Date.now() - last < 80 || event.pointerType === "touch") return;
    last = Date.now();
    const image = new Image();
    image.src = `study-${Math.floor(Math.random() * 8)}.svg`;
    image.alt = "";
    image.className = "trail";
    const rect = partner.getBoundingClientRect();
    image.style.left = `${event.clientX - rect.left - 75}px`;
    image.style.top = `${event.clientY - rect.top - 50}px`;
    image.style.rotate = `${Math.random() * 20 - 10}deg`;
    partner.append(image);
    image.addEventListener("animationend", () => image.remove(), { once: true });
});
