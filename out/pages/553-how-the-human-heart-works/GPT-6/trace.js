import { signal, timing } from "./model.js";
import { content } from "./content.js";
import { node } from "./diagram.js";

export function createTrace(canvas)
{
    const context = canvas.getContext("2d");
    let width = 1, height = 1;
    let samples = [];
    let lastElapsed = null;
    function resize()
    {
        const box = canvas.getBoundingClientRect();
        width = Math.max(1, box.width);
        height = Math.max(1, box.height);
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    function draw(t, rate, elapsed, delta, reduced)
    {
        if (reduced)
        {
            samples = [];
            const { RR } = timing(rate);
            for (let i = 0; i <= 1200; i++)
            {
                const time = i / 1200 * 2 * RR - RR / 4;
                samples.push({ x: i / 1200 * width, value: signal(time, rate), alpha: 1, time });
            }
        }
        else if (lastElapsed === null)
        {
            for (let i = 0; i <= 1200; i++)
            {
                const ago = 5 - i / 240;
                samples.push({ elapsed: elapsed - ago, value: signal(t - ago, rate), time: t - ago });
            }
        }
        else if (delta > 0)
        {
            const count = Math.max(1, Math.ceil(delta * 240));
            for (let i = 1; i <= count; i++)
            {
                const ago = delta * (1 - i / count);
                samples.push({ elapsed: elapsed - ago, value: signal(t - ago, rate), time: t - ago });
            }
        }
        if (!reduced) samples = samples.filter((sample) => elapsed - sample.elapsed <= 5);
        lastElapsed = elapsed;
        context.clearRect(0, 0, width, height);
        context.strokeStyle = "#4B2A55";
        context.lineWidth = 0.5;
        for (let x = 0; x < width; x += 40)
        {
            context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
        }
        for (let y = 0; y < height; y += 40)
        {
            context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
        }
        let previous = null;
        const headX = ((elapsed % 5) + 5) % 5 / 5 * width;
        const gap = Math.min(28, width * 0.04);
        const { RR, PR, Ts } = timing(rate);
        for (const sample of samples)
        {
            const x = reduced ? sample.x : ((sample.elapsed % 5) + 5) % 5 / 5 * width;
            const y = height * 0.62 - sample.value * height * 0.5;
            const age = reduced ? 0 : elapsed - sample.elapsed;
            const alpha = reduced ? 1 : 1 - 0.65 * age / 5;
            const ahead = (x - headX + width) % width;
            if (!reduced && ahead > 0 && ahead < gap)
            {
                previous = null;
                continue;
            }
            if (previous && x > previous.x && x - previous.x < width / 20)
            {
                context.strokeStyle = `rgba(57,255,136,${alpha})`;
                context.lineWidth = 2;
                context.shadowColor = "#39FF88";
                context.shadowBlur = age < 0.1 || reduced ? 8 : 0;
                context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(x, y); context.stroke();
            }
            for (const [index, center] of [[0, -PR], [1, 0], [2, Ts - 0.05]])
            {
                if (previous && Math.floor((sample.time - center) / RR) > Math.floor((previous.time - center) / RR))
                {
                    context.shadowBlur = 0;
                    context.font = "10px Martian Mono";
                    context.fillStyle = `rgba(57,255,136,${alpha})`;
                    context.fillText(content.marks[index][0], Math.max(4, x - 8), Math.max(10, y - 12));
                }
            }
            previous = { x, y, time: sample.time };
        }
        context.shadowBlur = 0;
        if (!reduced)
        {
            context.fillStyle = "#39FF88";
            context.beginPath(); context.arc(headX, height * 0.62 - signal(t, rate) * height * 0.5, 3, 0, Math.PI * 2); context.fill();
        }
        canvas.dataset.sampleCount = samples.length;
        canvas.dataset.elapsed = elapsed.toFixed(4);
    }
    return { draw, resize };
}

export function createStaticTrace(svg)
{
    svg.setAttribute("viewBox", "0 0 1200 240");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", content.traceDescription);
    const { RR, PR, Ts } = timing(72);
    for (let x = 0; x <= 1200; x += 40) node("path", { d: `M${x} 0 V240`, stroke: "#4B2A55", "stroke-width": 0.5 }, svg);
    for (let y = 0; y <= 240; y += 40) node("path", { d: `M0 ${y} H1200`, stroke: "#4B2A55", "stroke-width": 0.5 }, svg);
    const segments = [[], [], []];
    for (let i = 0; i <= 1200; i++)
    {
        const t = -RR / 2 + i / 1200 * RR;
        const index = t < -0.045 ? 0 : t <= 0.06 ? 1 : 2;
        segments[index].push([i, 150 - signal(t, 72) * 115]);
    }
    const paths = segments.map((points) => node("path", { d: `M${points.join(" L")}`, stroke: "#39FF88", "stroke-width": 2.5, fill: "none" }, svg));
    for (const [i, t] of [[0, -PR], [1, 0], [2, Ts - 0.05]])
    {
        const label = node("text", { x: (t + RR / 2) / RR * 1200, y: 22, fill: "#39FF88", "text-anchor": "middle", class: "trace-label" }, svg);
        label.textContent = content.marks[i][0];
    }
    return (active = -1) => paths.forEach((p, i) => p.style.opacity = active === -1 || active === i ? "1" : "0.35");
}
