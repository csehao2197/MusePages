import { services } from "./data.js";
document.querySelector(".service-list").innerHTML = services.map((item) => `<article class="service"><span class="number">${item.number}</span><div><h3>${item.name}</h3><p>${item.description}</p></div></article>`).join("");
for (let row = 0; row < 2; row++)
{
    const container = document.querySelector(row === 0 ? ".row-one" : ".row-two");
    const count = row === 0 ? 11 : 10;
    for (let index = 0; index < count * 3; index++)
    {
        const image = new Image();
        image.src = `object-${index % count + (row ? 11 : 0)}.svg`;
        image.alt = index < count ? "Original dimensional study" : "";
        image.loading = "lazy";
        container.append(image);
    }
}
const projects = [["Nextlevel Studio", "Client"], ["Aura Brand Identity", "Personal"], ["Solaris Digital", "Client"]];
document.querySelector(".project-list").innerHTML = projects.map(([name, type], index) => `<div class="project-wrap"><article class="project-card" style="--offset:${index * 28}px"><div class="project-head"><span class="number">0${index + 1}</span><div><small>${type}</small><h3>${name}</h3></div><button class="live" data-index="${index}">Live Project</button></div><div class="project-art"><div><img src="object-${index * 3}.svg" alt="${name} detail one"><img src="object-${index * 3 + 1}.svg" alt="${name} detail two"></div><img src="object-${index * 3 + 2}.svg" alt="${name} dimensional study"></div></article></div>`).join("");
const paragraph = document.querySelector(".animated-copy");
const copy = paragraph.textContent;
paragraph.setAttribute("aria-label", copy);
paragraph.innerHTML = [...copy].map((letter) => `<span aria-hidden="true">${letter === "&" ? "&amp;" : letter}</span>`).join("");
let queued = false;
function scrollUpdate()
{
    if (queued) return;
    queued = true;
    requestAnimationFrame(() =>
    {
        const section = document.querySelector(".ribbons");
        const offset = (scrollY - section.offsetTop + innerHeight) * .3;
        document.querySelector(".row-one").style.transform = `translateX(${offset - 200}px)`;
        document.querySelector(".row-two").style.transform = `translateX(${-(offset - 200)}px)`;
        const rect = paragraph.getBoundingClientRect();
        const progress = (innerHeight * .8 - rect.top) / (innerHeight * .6 + rect.height);
        [...paragraph.children].forEach((letter, index, list) => letter.style.opacity = String(.2 + .8 * Math.max(0, Math.min(1, (progress - index / list.length + .1) / .15))));
        document.querySelectorAll(".project-card").forEach((card, index) =>
        {
            const rect = card.parentElement.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
            card.style.scale = String(1 - (2 - index) * .03 * progress);
        });
        queued = false;
    });
}
addEventListener("scroll", scrollUpdate, { passive: true });
addEventListener("resize", scrollUpdate);
scrollUpdate();
const magnet = document.querySelector(".magnet");
document.querySelector(".hero").addEventListener("pointermove", (event) =>
{
    if (event.pointerType === "touch") return;
    const rect = magnet.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    if (Math.abs(x) < rect.width / 2 + 150 && Math.abs(y) < rect.height / 2 + 150)
    {
        magnet.style.transition = "transform .3s ease-out";
        magnet.style.transform = `translate3d(${x / 3}px, ${y / 3}px, 0)`;
    }
    else magnet.style.transform = "translate3d(0,0,0)";
});
document.querySelector(".hero").addEventListener("pointerleave", () =>
{
    magnet.style.transition = "transform .6s ease-in-out";
    magnet.style.transform = "translate3d(0,0,0)";
});
document.querySelectorAll(".contact-link").forEach((button) => button.onclick = () => document.getElementById("contact-dialog").showModal());
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.querySelectorAll(".live").forEach((button) => button.onclick = () =>
{
    const index = Number(button.dataset.index);
    document.getElementById("project-title").textContent = projects[index][0];
    document.getElementById("project-image").src = `object-${index * 3 + 2}.svg`;
    document.getElementById("project-description").textContent = "An original local dimensional concept study. This portfolio adaptation does not include a live client site.";
    document.getElementById("project-dialog").showModal();
});
document.querySelector("form").onsubmit = (event) =>
{
    event.preventDefault();
    document.querySelector(".feedback").textContent = "Inquiry preview ready. Local demo only: nothing was sent.";
};
