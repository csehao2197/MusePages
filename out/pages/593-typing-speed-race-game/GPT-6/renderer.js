import { content as C } from "./content.js";
import { formatTime } from "./scoring.js";

const colors = { ink: "#080B18", panel: "#111A33", cyan: "#37E6F5", coral: "#FF536B", gold: "#FFC857", white: "#F4F7FF", gray: "#A8B3CF", grid: "#2A3858" };

export function car(ctx, x, y, color, scale = 1)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#030712";
    for (const dx of [-13, 12])
    {
        for (const dy of [-13, 13])
        {
            ctx.beginPath();
            ctx.arc(dx, dy, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-23, -10);
    ctx.lineTo(13, -12);
    ctx.lineTo(24, -6);
    ctx.lineTo(24, 6);
    ctx.lineTo(13, 12);
    ctx.lineTo(-23, 10);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#101c2f";
    ctx.fillRect(-6, -8, 14, 16);
    ctx.fillStyle = "#2a5265";
    ctx.fillRect(7, -7, 4, 14);
    ctx.fillStyle = "#f4f7ff";
    ctx.fillRect(20, -7, 3, 3);
    ctx.fillRect(20, 4, 3, 3);
    ctx.fillStyle = colors.coral;
    ctx.fillRect(-23, -7, 2, 4);
    ctx.fillRect(-23, 3, 2, 4);
    ctx.fillStyle = color;
    ctx.fillRect(-19, -15, 3, 30);
    ctx.restore();
}

export function drawTrack(canvas, player, ghost, light)
{
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = box.width;
    const h = box.height;
    if (!w || !h)
    {
        return;
    }
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr))
    {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0d152b";
    ctx.fillRect(0, 0, w, h);
    const compact = h < 220;
    ctx.strokeStyle = "#18243d";
    ctx.lineWidth = .5;
    for (let x = 24; x < w; x += 24)
    {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 16; y < h; y += 24)
    {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    const top = compact ? 43 : h * .33;
    const bottom = compact ? h - 24 : h - 36;
    const laneHeight = (bottom - top) / 2;
    ctx.font = `700 ${compact ? 27 : Math.min(w * .106, 52)}px Chakra`;
    ctx.strokeStyle = "#344261";
    ctx.lineWidth = 1;
    ctx.strokeText(C.labels.circuit, 24, compact ? 30 : top - 40);
    if (!compact)
    {
        ctx.font = "8px Plex";
        ctx.fillStyle = colors.gray;
        ctx.fillText(C.labels.track, 25, top - 19);
        for (let i = 0; i < 3; i++)
        {
            ctx.fillStyle = light && i >= 3 - Number(light) ? colors.coral : "#333044";
            if (light === "GO")
            {
                ctx.fillStyle = colors.cyan;
            }
            ctx.beginPath();
            ctx.arc(w - 67 + i * 18, top - 23, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    ctx.fillStyle = colors.ink;
    ctx.fillRect(16, top, w - 32, bottom - top);
    for (let x = 16; x < w - 16; x += 20)
    {
        ctx.fillStyle = Math.floor(x / 20) % 2 ? colors.cyan : "#19304a";
        ctx.fillRect(x, top, Math.min(12, w - 16 - x), 3);
        ctx.fillStyle = Math.floor(x / 20) % 2 ? colors.coral : "#3c2339";
        ctx.fillRect(x, bottom - 3, Math.min(12, w - 16 - x), 3);
        ctx.fillStyle = colors.grid;
        ctx.fillRect(x, top + laneHeight - 1, Math.min(10, w - 16 - x), 2);
    }
    const start = 57;
    const finish = w - 57;
    ctx.strokeStyle = "#45516a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start - 22, top + 8);
    ctx.lineTo(start - 22, bottom - 8);
    ctx.stroke();
    for (let row = 0; row < Math.floor((bottom - top - 14) / 7); row++)
    {
        for (let col = 0; col < 2; col++)
        {
            ctx.fillStyle = (row + col) % 2 ? "#111a33" : "#c0cadb";
            ctx.fillRect(finish + 20 + col * 7, top + 7 + row * 7, 7, 7);
        }
    }
    ctx.font = `${compact ? 7 : 8}px Plex`;
    ctx.fillStyle = colors.cyan;
    ctx.fillText(C.labels.you, 47, top + 14);
    ctx.fillStyle = colors.gold;
    ctx.fillText(C.labels.target, 47, top + laneHeight + 14);
    const scale = compact ? .65 : .9;
    car(ctx, start + (finish - start) * player, top + laneHeight * .56, colors.cyan, scale);
    car(ctx, start + (finish - start) * ghost, top + laneHeight * 1.56, colors.gold, scale);
    ctx.font = "7px Plex";
    ctx.fillStyle = colors.gray;
    ctx.fillText(C.labels.startLine, 26, bottom + 16);
    ctx.fillText(C.labels.finishLine, w - 59, bottom + 16);
    canvas.dataset.player = String(player);
    canvas.dataset.ghost = String(ghost);
}

export async function drawShare(canvas, run)
{
    await Promise.all([document.fonts.load("600 120px Plex"), document.fonts.load("700 54px Chakra")]);
    await document.fonts.ready;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colors.ink;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(24.5, 24.5, 1151, 581);
    ctx.fillStyle = colors.cyan;
    for (let row = 0; row < 3; row++)
    {
        for (let col = 0; col < 4; col++)
        {
            if ((row + col) % 2 === 0)
            {
                ctx.fillRect(60 + col * 10, 59 + row * 10, 10, 10);
            }
        }
    }
    ctx.fillStyle = colors.white;
    ctx.font = "700 27px Chakra";
    ctx.fillText(C.brand.toUpperCase(), 116, 83);
    ctx.fillStyle = colors.gray;
    ctx.font = "16px Plex";
    ctx.fillText(C.labels.complete, 60, 147);
    ctx.fillStyle = colors.white;
    ctx.font = "700 54px Chakra";
    ctx.fillText(C.tagline, 60, 215);
    ctx.fillStyle = colors.cyan;
    ctx.font = "600 120px Plex";
    ctx.fillText(String(run.wpm), 56, 363);
    ctx.font = "20px Plex";
    ctx.fillText(C.labels.wpm, 66, 405);
    ctx.fillStyle = colors.white;
    ctx.font = "500 40px Plex";
    ctx.fillText(`${run.accuracy.toFixed(1)}%`, 430, 325);
    ctx.fillText(formatTime(run.elapsed), 770, 325);
    ctx.font = "14px Plex";
    ctx.fillStyle = colors.gray;
    ctx.fillText(C.labels.accuracy, 430, 365);
    ctx.fillText(C.labels.activeTime, 770, 365);
    ctx.fillStyle = colors.panel;
    ctx.fillRect(60, 452, 1080, 108);
    ctx.fillStyle = colors.gold;
    ctx.font = "600 20px Chakra";
    ctx.fillText(`${run.difficulty} · ${C.ghost} ${C.levels[run.difficulty].pace} ${C.labels.units}`, 80, 488);
    ctx.fillStyle = colors.gray;
    ctx.font = "14px Plex";
    ctx.fillText(run.personalBest ? C.labels.newBest : C.labels.bestUnchanged, 80, 526);
    car(ctx, 750, 487, colors.cyan, 1.2);
    car(ctx, 700, 532, colors.gold, 1.2);
    ctx.fillStyle = colors.coral;
    ctx.fillRect(1052, 452, 8, 108);
    for (let row = 0; row < 9; row++)
    {
        ctx.fillStyle = row % 2 ? colors.white : colors.ink;
        ctx.fillRect(1074, 452 + row * 12, 12, 12);
        ctx.fillStyle = row % 2 ? colors.ink : colors.white;
        ctx.fillRect(1086, 452 + row * 12, 12, 12);
    }
}
