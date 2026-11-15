import { startParticles } from "./gpu.js";
const tags = ["All", "Light", "Physics", "Fluids", "Grid", "Audio", "Volumes", "Particles", "Capture", "Render"];
const studies = [
    ["Lattices\n/ zone", "Ambient light\n/ study", ["Light", "Grid", "Capture"]],
    ["Prism\n/ shell", "Dispersion hero\n/ render", ["Light", "Volumes", "Render"]],
    ["Nebular\n/ loop", "Procedural hero\n/ sequence", ["Fluids", "Audio", "Particles"]],
    ["Fall\n/ forward", "Dolly track\n/ study", ["Physics", "Capture", "Render"]]
];
const list = document.querySelector(".list");
studies.forEach(([title, subtitle, categories], index) =>
{
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.tags = categories.join(",");
    card.innerHTML = `<canvas class="thumb" width="640" height="320" aria-label="Original animated ${title.replace("\n", "")} study"></canvas><div class="meta"><span>${title}</span><span>${subtitle}</span></div>`;
    list.append(card);
    const canvas = card.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    function draw(time)
    {
        ctx.fillStyle = ["#101514", "#11131a", "#111018", "#171511"][index];
        ctx.fillRect(0,0,640,320);
        ctx.save();
        ctx.translate(320,160);
        ctx.rotate(Math.sin(time / 3000) * .3);
        ctx.strokeStyle = ["#6c8c7e", "#aaa2c9", "#6f608f", "#9d8b63"][index];
        for (let i = 0; i < 22; i++)
        {
            ctx.beginPath();
            if (index % 2) ctx.rect(-140 + i * 7,-105 + i * 3, 280 - i * 8, 210 - i * 4);
            else ctx.ellipse(0,0,50 + i * 7,35 + i * 3, i * .11 + time / 6000,0,Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
});
document.querySelector(".tags").innerHTML = tags.map((tag, index) => `<button aria-pressed="${index === 0}">${tag}</button>`).join("");
document.querySelectorAll(".tags button").forEach((button) => button.onclick = () =>
{
    document.querySelectorAll(".tags button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll(".card").forEach((card) => card.hidden = button.textContent !== "All" && !card.dataset.tags.split(",").includes(button.textContent));
});
if (!startParticles(document.getElementById("bg"))) document.getElementById("fallback").hidden = false;
