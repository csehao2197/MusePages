import { bend, track } from "./track.js";
export function drawMap(canvas, run)
{
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 120, 146);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#324455";
    ctx.beginPath();
    for (let step = 0; step <= 60; step++)
    {
        const x = 60 + bend(track.length * step / 60) * 2;
        const y = 134 - step * 2;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    const progress = run.distance / track.length;
    ctx.fillStyle = "#91f3d9";
    ctx.shadowColor = "#58f0cc";
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.arc(60 + bend(run.distance) * 2, 134 - progress * 120, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}
