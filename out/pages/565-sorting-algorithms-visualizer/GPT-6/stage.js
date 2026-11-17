import { content } from "./content.js";

const colors = {
    background: "#0D0F12", grid: "#1E232A", muted: "#8C94A1", compare: "#F5A524",
    swap: "#3CC8E0", idle: "#515967", range: "#7C8694", pivot: "#F4EFE1", sorted: "#B9C3CF"
};

export class BarStage
{
    constructor(canvas, reduced, hover)
    {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.reduced = reduced;
        this.hover = hover;
        this.dirty = true;
        this.observer = new ResizeObserver(() =>
        {
            const box = canvas.getBoundingClientRect();
            this.width = box.width;
            this.height = box.height;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(box.width * dpr);
            canvas.height = Math.round(box.height * dpr);
            this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.dirty = true;
        });
        this.observer.observe(canvas);
        canvas.addEventListener("pointermove", (event) =>
        {
            if (!this.player || !hover) return;
            const x = event.clientX - canvas.getBoundingClientRect().left;
            const i = Math.floor((x - 40) / ((this.width - 56) / this.player.array.length));
            hover.textContent = i >= 0 && i < this.player.array.length ? content.hover(i, this.player.array[i]) : "";
        });
        canvas.addEventListener("pointerleave", () =>
        {
            if (hover) hover.textContent = "";
        });
    }

    set(player, speed = 50)
    {
        if (this.player === player && this.lastPosition === player.position) return;
        const now = performance.now();
        const oneForward = this.player === player && player.position === this.lastPosition + 1;
        this.slide = !this.reduced && speed <= 12 && oneForward && player.step?.k === "swap"
            ? { start: now, duration: 900 / speed, i: player.step.i, j: player.step.j } : null;
        if (player.finished && this.lastPosition !== player.total && !this.reduced) this.sweep = now;
        if (!player.finished) this.sweep = null;
        this.player = player;
        this.lastPosition = player.position;
        this.dirty = true;
    }

    draw(now)
    {
        if (!this.player || !this.width) return;
        if (this.reduced)
        {
            this.slide = null;
            this.sweep = null;
        }
        const sweeping = this.sweep !== null && this.sweep !== undefined && now - this.sweep < 700;
        const sliding = this.slide && now - this.slide.start < this.slide.duration;
        if (!this.dirty && !sweeping && !sliding && !this.wasAnimating) return;
        this.dirty = false;
        this.wasAnimating = sweeping || sliding;
        const ctx = this.context;
        const { width: w, height: h } = this;
        const left = 40;
        const right = w - 16;
        const baseline = h - 32;
        const top = 50;
        const plotHeight = baseline - top;
        const { array, step, sorted } = this.player;
        const unit = (right - left) / Math.max(array.length, 1);
        const gap = array.length <= 64 ? 2 : 1;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, w, h);
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = "right";
        for (const value of [25, 50, 75, 100])
        {
            const y = Math.round(baseline - plotHeight * value / 100) + 0.5;
            ctx.strokeStyle = colors.grid;
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
            ctx.stroke();
            ctx.fillStyle = colors.muted;
            ctx.fillText(String(value), left - 12, y + 3);
        }
        array.forEach((value, i) =>
        {
            let x = left + unit * i;
            if (sliding && (i === this.slide.i || i === this.slide.j))
            {
                const from = i === this.slide.i ? this.slide.j : this.slide.i;
                const t = Math.min(1, (now - this.slide.start) / this.slide.duration);
                x += (from - i) * unit * Math.pow(1 - t, 3);
            }
            const y = baseline - plotHeight * value / 100;
            let fill = sorted.has(i) ? colors.sorted : step?.range && i >= step.range[0] && i <= step.range[1] ? colors.range : colors.idle;
            if (step?.pivot === i) fill = colors.pivot;
            const active = step && (step.i === i || step.j === i) && step.k !== "sorted";
            if (active) fill = step.k === "compare" ? colors.compare : colors.swap;
            if (sweeping)
            {
                const offset = (now - this.sweep) - 580 * i / Math.max(1, array.length - 1);
                if (offset >= 0 && offset <= 120) fill = "#FFFFFF";
            }
            ctx.fillStyle = fill;
            ctx.fillRect(x, y, Math.max(1, unit - gap), baseline - y);
            if (active)
            {
                ctx.fillStyle = step.k === "compare" ? colors.compare : colors.swap;
                ctx.fillRect(x, baseline + 8, Math.max(1, unit - gap), 6);
            }
            if (step?.pivot === i)
            {
                ctx.fillStyle = colors.compare;
                ctx.beginPath();
                ctx.moveTo(x + (unit - gap) / 2, y - 5);
                ctx.lineTo(x + (unit - gap) / 2 - 4, y - 12);
                ctx.lineTo(x + (unit - gap) / 2 + 4, y - 12);
                ctx.fill();
            }
        });
        if (step?.range)
        {
            ctx.fillStyle = colors.range;
            ctx.fillRect(left + step.range[0] * unit, baseline + 3, unit * (step.range[1] - step.range[0] + 1) - gap, 2);
        }
        ctx.textAlign = "left";
        ctx.fillStyle = colors.muted;
        ctx.fillText("1", left, h - 5);
        ctx.textAlign = "right";
        ctx.fillText(String(array.length), right, h - 5);
    }
}
