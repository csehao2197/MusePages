import { reducedMotion } from "./motion.js";

export const colors = { teal: "#1F7A7A", coral: "#E0654A", ink: "#1B1E23", muted: "#626762", grid: "#CDCBC0" };

export function mountCanvas(canvas, draw)
{
    const context = canvas.getContext("2d");
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = false;
    let previous = 0;
    let elapsed = 0;
    let disposed = false;
    function paint(now)
    {
        frame = 0;
        if (disposed) return;
        if (visible && !reducedMotion.matches && previous)
        {
            elapsed += Math.min((now - previous) / 1000, 0.05);
        }
        previous = now;
        context.clearRect(0, 0, width, height);
        draw(context, width, height, elapsed);
        if (visible && !reducedMotion.matches) frame = requestAnimationFrame(paint);
    }
    function redraw()
    {
        if (!frame) paint(performance.now());
    }
    function resize()
    {
        const bounds = canvas.getBoundingClientRect();
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }
    const observer = new ResizeObserver(resize);
    const visibility = new IntersectionObserver((entries) =>
    {
        visible = entries[0].isIntersecting;
        canvas.dataset.active = String(visible);
        previous = 0;
        if (!visible)
        {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        else redraw();
    });
    observer.observe(canvas);
    visibility.observe(canvas);
    reducedMotion.addEventListener("change", redraw);
    resize();
    return {
        redraw,
        dispose()
        {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            visibility.disconnect();
            reducedMotion.removeEventListener("change", redraw);
        }
    };
}

export function wave(context, width, baseline, amplitude, phase, color, cycles = 2.5, start = 0, end = width)
{
    context.beginPath();
    for (let x = start; x <= end; x += 1)
    {
        const y = baseline - amplitude * Math.sin(((x - start) / (end - start)) * Math.PI * 2 * cycles + phase);
        if (x === start) context.moveTo(x, y);
        else context.lineTo(x, y);
    }
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
}

export function line(context, x1, y1, x2, y2, color = colors.grid)
{
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
}

export function text(context, value, x, y, color = colors.muted, size = 10)
{
    context.font = `${size}px Consolas, monospace`;
    context.fillStyle = color;
    context.fillText(value, x, y);
}
