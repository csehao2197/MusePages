// @ts-nocheck
import { vertices, R } from "./physics.js";
import { content } from "./content.js";

export function createRenderer(canvas)
{
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    function resize()
    {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return function draw(world, alpha)
    {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        const scale = Math.min(width, height) / 1000;
        ctx.translate((width - scale * 1000) / 2, (height - scale * 1000) / 2);
        ctx.scale(scale, scale);
        const angle = world.previousAngle + (world.angle - world.previousAngle) * alpha;
        const points = vertices(angle);
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = "#130D3F";
        ctx.fill();
        ctx.strokeStyle = "#25E5F2";
        ctx.lineWidth = 8;
        ctx.shadowColor = "#25E5F2";
        ctx.shadowBlur = 12 * scale;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.save();
        ctx.translate(500, 500);
        ctx.scale(0.984, 0.984);
        ctx.translate(-500, -500);
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.restore();
        for (const b of world.balls)
        {
            const x = b.px + (b.x - b.px) * alpha;
            const y = b.py + (b.y - b.py) * alpha;
            const rotation = b.pa + (b.angle - b.pa) * alpha;
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = "#090621";
            ctx.beginPath();
            ctx.ellipse(2, 5, R + 1, R, 0, 0, Math.PI * 2);
            ctx.fill();
            const gradient = ctx.createRadialGradient(-10, -13, 1, 4, 8, 41);
            gradient.addColorStop(0, "#FFFFFF");
            gradient.addColorStop(0.16, content.palette[(b.id - 1) % 5]);
            gradient.addColorStop(0.68, content.palette[(b.id - 1) % 5]);
            gradient.addColorStop(1, "#130D3F");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fill();
            ctx.save();
            ctx.rotate(rotation);
            ctx.strokeStyle = "#130D3F";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(-1, -1, 23, 0.2, 1.8);
            ctx.stroke();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(0, 1, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#130D3F";
            ctx.font = `600 30px ${content.fonts.headline}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(b.id), 0, 1, 29);
            ctx.restore();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(-11, -16, 7, 3.5, -0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        for (const p of world.particles)
        {
            ctx.globalAlpha = Math.max(0, p.life / p.total);
            ctx.fillStyle = content.palette[p.color];
            ctx.fillRect(p.x, p.y, 5, 9);
        }
        ctx.globalAlpha = 1;
    };
}
