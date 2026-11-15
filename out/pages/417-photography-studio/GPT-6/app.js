const titles = ["Window, morning", "Structure in motion", "Together, quietly", "The maker", "Shadow play", "A new chapter", "Small gestures", "City pause", "At work", "Direct", "Fabric and air", "Lines of light"];
const grid = document.querySelector("#grid");
titles.forEach((title, index) =>
{
    const button = document.createElement("button");
    const image = document.createElement("img");
    const label = document.createElement("span");
    image.src = "window.svg";
    image.alt = `${title}, original monochrome composition study`;
    label.textContent = `${title} / View project ↗`;
    button.append(image, label);
    button.addEventListener("click", () =>
    {
        current = index;
        renderProject();
        dialog.showModal();
    });
    grid.append(button);
});
const dialog = document.querySelector("#project");
let current = 0;
function renderProject()
{
    document.querySelector("#project-title").textContent = titles[current];
    document.querySelector("#position").textContent = `${current + 1} / ${titles.length}`;
    document.querySelector("#project-description").textContent = "An original illustrative exploration of natural window light, geometry and a quiet human presence. Concept direction only, not a real client commission.";
    dialog.querySelector("img").style.transform = current % 2 ? "scaleX(-1)" : "";
}
function advance(amount)
{
    current = (current + amount + titles.length) % titles.length;
    renderProject();
}
document.querySelector("#next").addEventListener("click", () => advance(1));
document.querySelector("#previous").addEventListener("click", () => advance(-1));
document.querySelector("#close").addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (event) =>
{
    if (event.key === "ArrowRight") advance(1);
    if (event.key === "ArrowLeft") advance(-1);
});
document.querySelectorAll("[data-package]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#package").value = button.dataset.package;
        document.querySelector("#book").scrollIntoView();
    });
});
const result = document.querySelector("#result");
const email = document.querySelector("#email");
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const brief = document.querySelector("#brief").value.trim();
    if (brief.length < 12)
    {
        result.textContent = "Add a short project brief of at least 12 characters.";
        email.hidden = true;
        return;
    }
    const selected = document.querySelector("#package").value;
    result.textContent = `${selected} draft prepared locally. Nothing sent or reserved. The example address is not an operating studio.`;
    email.href = `mailto:hello@stillframestudio.example?subject=${encodeURIComponent(`${selected} enquiry`)}&body=${encodeURIComponent(brief)}`;
    email.hidden = false;
});
document.querySelector("#enquiry").addEventListener("reset", () =>
{
    result.textContent = "";
    email.hidden = true;
    email.removeAttribute("href");
});
