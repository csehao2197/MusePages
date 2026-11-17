import { content } from "../content.js";
import { mountCanvas, colors, wave, line, text } from "../lib/canvas.js";

export function phaseResult(degrees)
{
    const radians = degrees * Math.PI / 180;
    const amplitude = Math.abs(2 * Math.cos(radians / 2));
    const silent = amplitude < 1e-12;
    return { amplitude: silent ? 0 : amplitude, db: silent ? -Infinity : 20 * Math.log10(amplitude), silent };
}

export function sampleWaves(position, degrees)
{
    const noise = Math.sin(position);
    const antiNoise = Math.sin(position + degrees * Math.PI / 180);
    return { noise, antiNoise, sum: noise + antiNoise };
}

export function mountPhaseLab(canvas, panel)
{
    const slider = document.getElementById("phase-slider");
    const value = document.getElementById("phase-value");
    const level = document.getElementById("phase-level");
    const feedback = document.getElementById("phase-feedback");
    const remaining = document.getElementById("remaining-amplitude");
    let degrees = Number(slider.value);
    const drawing = mountCanvas(canvas, (ctx, width, height, time) =>
    {
        const left = 10;
        const right = width - 10;
        const phase = degrees * Math.PI / 180;
        const top = height * 0.28;
        const bottom = height * 0.72;
        const scale = width < 350 ? 23 : 30;
        text(ctx, content.phase.canvasHints[0], left, 25, colors.muted, 9);
        text(ctx, content.phase.canvasHints[1], left, bottom - 2 * scale - 8, colors.muted, 9);
        [top, bottom].forEach((y) => line(ctx, left, y, right, y));
        wave(ctx, width, top, scale, -time * 0.45, colors.teal, 2.4, left, right);
        wave(ctx, width, top, scale, phase - time * 0.45, colors.coral, 2.4, left, right);
        ctx.beginPath();
        for (let x = left; x <= right; x++)
        {
            const position = (x - left) / (right - left) * Math.PI * 2 * 2.4 - time * 0.45;
            const sum = sampleWaves(position, degrees).sum;
            const y = bottom - scale * sum;
            if (x === left) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 2.7;
        ctx.stroke();
        text(ctx, content.phase.canvasHints[2], left, height - 8, colors.muted, width < 350 ? 8 : 9);
    });
    function update(next)
    {
        degrees = Math.max(0, Math.min(360, Math.round(next)));
        slider.value = String(degrees);
        slider.setAttribute("aria-valuetext", `${degrees}°`);
        value.textContent = `${degrees}°`;
        const result = phaseResult(degrees);
        const state = result.silent ? "silent" : result.amplitude >= 1.999 ? "reinforcing" : result.amplitude < 1 ? "cancelling" : "partial";
        panel.dataset.state = state;
        panel.dataset.phase = String(degrees);
        panel.dataset.amplitude = String(result.amplitude);
        panel.dataset.db = String(result.db);
        level.textContent = result.silent ? content.phase.infinity : `${result.db >= 0 ? "+" : "−"}${Math.abs(result.db).toFixed(1)} ${content.phase.units}`;
        remaining.textContent = `${content.phase.amplitude}: ${Math.round(result.amplitude * 100)}%`;
        feedback.textContent = content.phase.states[state];
        document.querySelectorAll("[data-phase]").forEach((button) =>
        {
            if (button.tagName !== "BUTTON") return;
            const active = Number(button.dataset.phase) === degrees;
            button.dataset.active = String(active);
            button.setAttribute("aria-pressed", String(active));
        });
        drawing.redraw();
    }
    slider.addEventListener("input", () => update(Number(slider.value)));
    document.querySelectorAll("button[data-phase]").forEach((button) => button.addEventListener("click", () => update(Number(button.dataset.phase))));
    let drag = null;
    canvas.addEventListener("pointerdown", (event) =>
    {
        if (event.button !== 0) return;
        drag = { x: event.clientX, phase: degrees };
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) =>
    {
        if (!drag) return;
        update(drag.phase + (event.clientX - drag.x) / canvas.getBoundingClientRect().width * 360);
    });
    function endDrag()
    {
        drag = null;
    }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    update(degrees);
    return drawing;
}
