const $ = (s) => document.querySelector(s);
const projects = [
    ["Apex", "Sustainable materials", "Identity", "A modular identity built from the idea of using less. Angular letterforms and a restrained material palette."],
    ["Meridian", "Architecture & property", "Identity", "A precise typographic system for spaces with a point of view. A grid-led wordmark connects plans, signage and print."],
    ["Vantage", "Financial services", "Digital", "A clearer digital voice for complex financial information. Accessible hierarchy replaces dense, undifferentiated interfaces."],
    ["Stratum", "Fashion & apparel", "Identity", "A layered identity for everyday essentials. Bold typography carries garment labels, packaging and editorial stories."],
    ["Orion", "Technology", "Motion", "An orbital motion language turns abstract technology into a recognisable rhythm. A flexible system, not a one-off logo."],
    ["Volta", "Electric vehicles", "Digital", "An energetic digital concept that makes electric mobility approachable. Clear product storytelling meets confident type."]
];
let current = 0;
function render(filter = "all")
{
    const filtered = projects.map((project, index) => ({ project, index })).filter(({ project }) => filter === "all" || project[2] === filter);
    $("#projects").innerHTML = filtered.map(({ project, index }) => `<button class="project" data-project="${index}" aria-label="View ${project[0]} case study"><span class="project-brand">${index === 0 ? "apex↗" : index === 1 ? "M /" : index === 2 ? "VANTAGE." : index === 3 ? "stratum" : index === 4 ? "OR/ON" : "VOLTA"} </span><small>${project[0]} / ${project[1]} ↗</small><span class="split" aria-hidden="true">${project[0]}</span></button>`).join("");
    $("#work-count").textContent = `${filtered.length} projects shown`;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    render(button.dataset.filter);
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", item === button));
}));
$("#projects").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-project]");
    if (!button) return;
    current = Number(button.dataset.project);
    const project = projects[current];
    $("#case-title").textContent = project[0];
    $("#case-copy").textContent = project[3];
    $("#after-art").textContent = project[0].toUpperCase() + ".";
    $("#before-art").textContent = project[0].toLowerCase();
    $("#reveal").value = 50;
    compare();
    $("#case").showModal();
});
function compare()
{
    const value = Number($("#reveal").value);
    $("#before-art").style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    $("#reveal-status").textContent = `${value}% before / ${100 - value}% after`;
}
$("#reveal").addEventListener("input", compare);
$("#close").addEventListener("click", () => $("#case").close());
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    $("#package").value = button.dataset.package;
    $("#contact").scrollIntoView();
}));
let downloadUrl;
$("#brief").addEventListener("input", () =>
{
    $("#download").hidden = true;
    $("#status").textContent = "";
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
});
$("#brief").addEventListener("submit", (event) =>
{
    event.preventDefault();
    let message;
    if ($("#name").value.trim().length < 2) message = "Please enter your name.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) message = "Please enter a valid work email.";
    else if (!$("#package").value) message = "Select an engagement.";
    else if ($("#goals").value.trim().length < 20) message = "Tell us a little more: at least 20 characters about your goals.";
    else
    {
        const content = `FORM STUDIO — PROJECT BRIEF\nName: ${$("#name").value.trim()}\nEmail: ${$("#email").value.trim()}\nPackage: ${$("#package").value}\nIdeal start: ${$("#timing").value}\nGoals: ${$("#goals").value.trim()}\n\nBrowser-generated draft. Nothing submitted. Scope, pricing and dates subject to confirmation.`;
        downloadUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        $("#download").href = downloadUrl;
        $("#download").hidden = false;
        message = `Your ${$("#package").value} brief is ready to download. Nothing sent; share the draft yourself.`;
    }
    $("#status").textContent = message;
});
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
render();
