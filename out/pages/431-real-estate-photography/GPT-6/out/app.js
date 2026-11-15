const work = [["living.svg", "LEWES, 4 BED, FOR ALDRIDGE & CO"], ["kitchen.svg", "BRIGHTON, 2 BED FLAT, FOR HARDING"], ["hall.svg", "DITCHLING, 5 BED, FOR ALDRIDGE & CO"], ["living.svg", "HOVE, 3 BED, FOR SEAWARD"], ["kitchen.svg", "UCKFIELD, COTTAGE, FOR MAYHEW"], ["hall.svg", "STEYNING, BARN CONVERSION, FOR HARDING"]];
document.querySelector(".work-grid").innerHTML = work.map(([file, caption]) => `<figure><img src="${file}" alt="Original illustrative interior study"><figcaption>${caption}</figcaption></figure>`).join("");
const tasks = ["Cars off the drive", "Bins out of sight", "Beds made, cushions straightened", "Worktops cleared except one nice thing", "Toilet seats down, towels matching", "Lights on in every room, even in daylight"];
document.querySelector(".checklist").innerHTML = tasks.map((task) => `<label><input type="checkbox">${task}</label>`).join("");
function update()
{
    const count = document.querySelectorAll(".checklist input:checked").length;
    document.querySelector("#prepared").textContent = `${count} of 6 ready.${count === 6 ? " The house is prepared for the shoot." : ""}`;
}
document.querySelectorAll(".checklist input").forEach((input) => input.addEventListener("change", update));
document.querySelector("#reset-checklist").addEventListener("click", () =>
{
    document.querySelectorAll(".checklist input").forEach((input) => input.checked = false);
    update();
});
document.querySelector("#print-guide").addEventListener("click", () => window.print());
const merge = document.querySelector(".merge");
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        merge.classList.add("done");
        observer.disconnect();
    }
}, { threshold: .35 });
observer.observe(merge);
