const canvas = document.getElementById("background");
const context = canvas.getContext("2d");
const reel = document.getElementById("reel-canvas");
const reelContext = reel.getContext("2d");
let paused = false;
let frozenTime = 0;
function resize()
{
    canvas.width = innerWidth * Math.min(devicePixelRatio, 2);
    canvas.height = innerHeight * Math.min(devicePixelRatio, 2);
}
addEventListener("resize", resize);
resize();
function artwork(ctx, width, height, time, bright)
{
    ctx.fillStyle = "#080909";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width * .53, height * .47);
    ctx.rotate(-.25 + Math.sin(time / 9000) * .06);
    const scale = Math.max(width, height) / 1000;
    ctx.scale(scale, scale);
    for (let index = 0; index < 70; index++)
    {
        const t = index / 70;
        const x = Math.sin(t * Math.PI * 3 + time / 6500) * 170;
        const y = (t - .5) * 950;
        const width = 90 + Math.sin(t * Math.PI * 4 + time / 5000) * 75;
        ctx.beginPath();
        ctx.ellipse(x, y, width, 170, t * 2, 0, Math.PI * 2);
        const shade = Math.floor(12 + Math.sin(t * Math.PI) * (bright ? 100 : 40));
        ctx.strokeStyle = `rgb(${shade * 1.4},${shade * .65},${shade * .58})`;
        ctx.lineWidth = bright ? 2 : 1.8;
        ctx.stroke();
    }
    ctx.restore();
}
function frame(time)
{
    artwork(context, canvas.width, canvas.height, time, false);
    if (!paused) frozenTime = time;
    if (document.getElementById("reel").open) artwork(reelContext, 1000, 600, frozenTime, true);
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
const menu = document.getElementById("menu");
const openMenu = document.getElementById("open-menu");
openMenu.onclick = () =>
{
    menu.showModal();
    openMenu.setAttribute("aria-expanded", "true");
};
menu.querySelectorAll("a").forEach((link, index) =>
{
    link.style.setProperty("--delay", `${100 + index * 60}ms`);
    link.onclick = () => menu.close();
});
menu.addEventListener("close", () => openMenu.setAttribute("aria-expanded", "false"));
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.getElementById("showreel").onclick = () => document.getElementById("reel").showModal();
document.getElementById("pause").onclick = (event) =>
{
    paused = !paused;
    event.currentTarget.textContent = paused ? "Resume showreel" : "Pause showreel";
};
document.getElementById("schedule").onclick = () => document.getElementById("call").showModal();
document.querySelector("form").onsubmit = (event) =>
{
    event.preventDefault();
    document.getElementById("feedback").textContent = "Your request preview is ready. This local demo sends nothing.";
};
