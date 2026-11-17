import { voices } from "./presets.js";

export function createScope(canvas, synth, state)
{
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;
    const buffer = new Uint8Array(2048);
    function draw()
    {
        ctx.clearRect(0, 0, width, height);
        const preset = voices[state.voice];
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, preset.accent);
        gradient.addColorStop(1, preset.secondary);
        let start = 0;
        if (synth.analyser && !reduced.matches)
        {
            synth.analyser.getByteTimeDomainData(buffer);
            for (let i = 1; i < buffer.length / 2; i++)
            {
                if (buffer[i - 1] < 128 && buffer[i] >= 128)
                {
                    start = i;
                    break;
                }
            }
        }
        else buffer.fill(128);
        const points = 640;
        ctx.beginPath();
        for (let i = 0; i <= points; i++)
        {
            const phase = i / points * 3;
            const staticValue = state.voice === 0 ? Math.sin(phase * Math.PI * 2) : state.voice === 1 ? (phase % 1 < 0.5 ? 1 : -1) : 2 * (phase % 1) - 1;
            const amplitude = reduced.matches ? staticValue * height * 0.275 : (buffer[start + Math.floor(i / points * (buffer.length - start - 1))] - 128) / 128 * height * 0.44;
            const x = i / points * width;
            const y = height / 2 - amplitude;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    function animate()
    {
        draw();
        frame = requestAnimationFrame(animate);
    }
    function restart()
    {
        cancelAnimationFrame(frame);
        if (reduced.matches) draw();
        else animate();
    }
    const observer = new ResizeObserver(() =>
    {
        const bounds = canvas.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        const dpr = devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    });
    observer.observe(canvas);
    reduced.addEventListener("change", restart);
    restart();
    return {
        redraw: draw,
        close()
        {
            cancelAnimationFrame(frame);
            observer.disconnect();
            reduced.removeEventListener("change", restart);
        }
    };
}
