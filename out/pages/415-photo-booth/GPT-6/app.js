const descriptions =
[
    "Chrome and cream enamel, the loudest shutter of the three.",
    "Wood panelled, from a station in Leeds, still smells faintly of it.",
    "Small, white, easy up stairs. The one for tight rooms."
];
document.querySelectorAll("[data-booth]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelectorAll("[data-booth]").forEach((item) => item.setAttribute("aria-expanded", String(item === button)));
        const index = Number(button.dataset.booth);
        document.querySelector("#booth-copy").textContent = descriptions[index];
        document.querySelector(".booth").style.background = ["#ede5cd", "#9d7046", "#faf8eb"][index];
    });
});
