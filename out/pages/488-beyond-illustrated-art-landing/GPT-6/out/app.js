const hero = document.querySelector(".hero");
function update()
{
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight)));
    const scale = innerWidth < 768 ? .5 : 1;
    for (const [direction, sign] of [["left", -1], ["right", 1]])
    {
        const column = document.querySelector(`.${direction}`);
        column.style.opacity = String(.35 + progress * .65);
        column.querySelectorAll("span").forEach((word, index) =>
        {
            word.style.transform = `translateX(${sign * (60 + index * 40) * scale * (1 - progress)}px)`;
        });
    }
}
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
const phrase = "SPARK · RENDER · IGNITE · UNFOLD · GENESIS · EVOLVE · PURPOSE · BEYOND · ";
document.querySelector(".marquee-track").innerHTML = Array.from({ length: 4 }, () => `<span>${phrase}</span>`).join("");
update();
