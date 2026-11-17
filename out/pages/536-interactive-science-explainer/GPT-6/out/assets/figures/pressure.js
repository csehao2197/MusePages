import { content } from "../content.js";
import { mountCanvas, colors, wave, line, text } from "../lib/canvas.js";

export function displacementAt(position, time)
{
    return Math.sin(position * Math.PI * 4 - time * 1.1);
}

export function pressureAt(position, time)
{
    return -Math.cos(position * Math.PI * 4 - time * 1.1);
}

export function mountHero(canvas)
{
    return mountCanvas(canvas, (ctx, width, height, time) =>
    {
        const ys = [height * 0.23, height * 0.53, height * 0.83];
        ys.forEach((y, i) =>
        {
            line(ctx, 0, y, width, y, "#B7C9BD");
            text(ctx, content.hero.signal[i], 0, y - 30, colors.muted, 9);
        });
        wave(ctx, width, ys[0], 22, -time * 0.3, colors.teal, 2.2);
        wave(ctx, width, ys[1], 22, Math.PI - time * 0.3, colors.coral, 2.2);
        wave(ctx, width, ys[2], 0, 0, colors.ink, 2.2);
        ctx.beginPath();
        ctx.arc(width * 0.5, ys[2], 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.ink;
        ctx.fill();
    });
}

export function mountPressure(canvas, figure)
{
    return mountCanvas(canvas, (ctx, width, height, time) =>
    {
        const step = Number(figure.dataset.step || 0);
        const left = 16;
        const span = width - 32;
        const baseline = height * 0.39;
        const labelSize = width < 350 ? 8 : 9;
        line(ctx, left, baseline, width - left, baseline);
        text(ctx, content.pressure.graphLabels[0], left, 24, colors.muted, labelSize);
        text(ctx, content.pressure.graphLabels[1], left, baseline - 8, colors.muted, labelSize);
        text(ctx, content.pressure.graphLabels[2], left, baseline + 70, colors.muted, labelSize);
        ctx.beginPath();
        for (let x = 0; x <= span; x++)
        {
            const position = x / span;
            const envelope = step === 1 ? Math.max(0, 1 - position * 2) : 1;
            const y = baseline - (step ? pressureAt(position, time) * 38 * envelope : 0);
            if (!x) ctx.moveTo(left + x, y);
            else ctx.lineTo(left + x, y);
        }
        ctx.strokeStyle = colors.teal;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        for (let row = 0; row < 3; row++)
        {
            for (let n = 0; n < 33; n++)
            {
                const position = n / 32;
                const envelope = step === 1 ? Math.max(0, 1 - position * 2) : 1;
                const offset = step ? displacementAt(position, time) * 7 * envelope : 0;
                ctx.beginPath();
                ctx.arc(left + position * span + offset, height * 0.74 + row * 12, n === 14 && row === 1 ? 4 : 2, 0, Math.PI * 2);
                ctx.fillStyle = n === 14 && row === 1 ? colors.coral : colors.teal;
                ctx.fill();
            }
        }
        text(ctx, content.pressure.marker, left, height - 8, colors.coral, labelSize);
        figure.dataset.particleOffset = String(step ? displacementAt(14 / 32, time) * 7 : 0);
        figure.dataset.waveTime = String(time);
        figure.dataset.pressureSample = String(step ? pressureAt(0.5, time) : 0);
    });
}
