import { cells, terrain, applyAction, storm, checkAction } from "./sim.js";

function mulberry32(seed)
{
    return () =>
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
export class Crater
{
    constructor(canvas, getView, onCell, onHover, onFallback)
    {
        this.canvas = canvas;
        this.getView = getView;
        this.ctx = canvas.getContext("2d");
        this.frame = 0;
        this.motion = matchMedia("(prefers-reduced-motion: reduce)");
        this.particles = [];
        this.resize = this.resize.bind(this);
        this.visibility = this.visibility.bind(this);
        this.animate = this.animate.bind(this);
        this.point = (event) =>
        {
            const rect = canvas.getBoundingClientRect();
            const fx = (event.clientX - rect.left - this.ox) / this.scale / 36;
            const fy = (event.clientY - rect.top - this.oy) / this.scale / 18;
            const c = Math.round((fx + fy) / 2), r = Math.round((fy - fx) / 2);
            return terrain(c, r) === "void" ? null : { c, r };
        };
        this.click = (event) => { const p = this.point(event); if (p) onCell(p); };
        this.hover = (event) => onHover(this.point(event));
        this.leave = () => onHover(null);
        this.contextMenu = (event) => { event.preventDefault(); onCell(null); };
        this.motionChange = () => { this.seedParticles(); this.visibility(); };
        if (!this.ctx)
        {
            onFallback();
            return;
        }
        canvas.addEventListener("click", this.click);
        canvas.addEventListener("pointermove", this.hover);
        canvas.addEventListener("pointerleave", this.leave);
        canvas.addEventListener("contextmenu", this.contextMenu);
        document.addEventListener("visibilitychange", this.visibility);
        this.motion.addEventListener("change", this.motionChange);
        this.observer = new ResizeObserver(this.resize);
        this.observer.observe(canvas);
        this.seedParticles();
        this.resize();
        this.visibility();
    }
    seedParticles()
    {
        const random = mulberry32(0xC1A0E11);
        this.particles = this.motion.matches ? [] : Array.from({ length: 64 }, () =>
            ({ x: random(), y: random(), radius: 4 + random() * 8 }));
    }
    resize()
    {
        if (!this.ctx) return;
        const { width, height } = this.canvas.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.dpr = Math.min(2, window.devicePixelRatio || 1);
        this.canvas.width = Math.round(width * this.dpr);
        this.canvas.height = Math.round(height * this.dpr);
        const wide = window.innerWidth >= 1100, insetX = wide ? 320 : 0, insetY = wide ? 24 : 0;
        const minX = Math.min(...cells.map((b) => (b.c - b.r) * 36 - 36));
        const maxX = Math.max(...cells.map((b) => (b.c - b.r) * 36 + 36));
        const minY = Math.min(...cells.map((b) => (b.c + b.r) * 18 - 18));
        const maxY = Math.max(...cells.map((b) => (b.c + b.r) * 18 + 25));
        this.scale = Math.min(1.35, (width - insetX * 2 - 32) / (maxX - minX), (height - insetY * 2 - 32) / (maxY - minY));
        this.ox = width / 2 - (minX + maxX) / 2 * this.scale;
        this.oy = height / 2 - (minY + maxY) / 2 * this.scale;
        this.canvas.dataset.fit = JSON.stringify({ x: this.ox, y: this.oy, scale: this.scale });
        this.paint();
    }
    visibility()
    {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        if (!document.hidden && !this.motion.matches && this.ctx) this.frame = requestAnimationFrame(this.animate);
        this.paint();
    }
    animate()
    {
        for (const p of this.particles) p.x = (p.x + .6 / Math.max(1, this.width - (innerWidth >= 1100 ? 640 : 0))) % 1;
        this.paint();
        this.frame = requestAnimationFrame(this.animate);
    }
    diamond(x, y, fill, stroke = "rgba(62,32,24,.45)", line = 1)
    {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x, y - 18);
        ctx.lineTo(x + 36, y);
        ctx.lineTo(x, y + 18);
        ctx.lineTo(x - 36, y);
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke(); }
    }
    ellipse(x, y, rx, ry, fill, stroke)
    {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    }
    structure(b, alpha = 1)
    {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate((b.c - b.r) * 36, (b.c + b.r) * 18);
        ctx.globalAlpha = alpha;
        if (b.kind === "habitat")
        {
            this.ellipse(0, 6, 20, 8, "#A86B38");
            this.ellipse(0, -2, 18, 12, "#E39B54");
            ctx.fillStyle = "#3F241C";
            ctx.fillRect(-3, 2, 6, 8);
            ctx.fillStyle = "#F3E6D4";
            ctx.fillRect(-6, -6, 12, 3);
        }
        if (b.kind === "solar")
        {
            ctx.strokeStyle = "#B7A394";
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, -14); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-16, -18); ctx.lineTo(10, -18); ctx.lineTo(18, -8); ctx.lineTo(-8, -8); ctx.closePath();
            ctx.fillStyle = "#3E4C55"; ctx.fill();
            ctx.strokeStyle = "#E39B54"; ctx.lineWidth = 1; ctx.stroke();
            ctx.strokeStyle = "#B7A394"; ctx.lineWidth = .4;
            ctx.beginPath();
            ctx.moveTo(-9, -18); ctx.lineTo(-1, -8); ctx.moveTo(0, -18); ctx.lineTo(8, -8);
            ctx.moveTo(-12, -13); ctx.lineTo(14, -13); ctx.stroke();
        }
        if (b.kind === "greenhouse")
        {
            this.ellipse(0, 6, 18, 7, "#3F241C");
            this.ellipse(0, -2, 16, 11, "rgba(143,181,115,.85)", "#3E4C55");
            ctx.strokeStyle = "#3E4C55"; ctx.lineWidth = 1;
            ctx.beginPath();
            for (const x of [-5, 5]) { ctx.moveTo(x, -12); ctx.lineTo(x, 8); }
            ctx.stroke();
        }
        if (b.kind === "drill")
        {
            this.ellipse(0, 8, 14, 6, "#5C3428");
            ctx.fillStyle = "#B7A394"; ctx.fillRect(-4, -16, 8, 24);
            ctx.fillStyle = "#E39B54"; ctx.fillRect(-6, -6, 12, 4);
            this.ellipse(0, -16, 4, 3, "#B7D0D6");
        }
        ctx.restore();
    }
    paint()
    {
        if (!this.ctx || !this.width) return;
        const ctx = this.ctx, w = this.width, h = this.height;
        const view = this.getView(), state = view.state, dusty = storm(state.sol);
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, "#2A1A14"); gradient.addColorStop(1, "#14110F");
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
        this.ellipse(w / 2, h / 2, w * .42, h * .33, "rgba(110,59,44,.20)");
        ctx.save(); ctx.translate(this.ox, this.oy); ctx.scale(this.scale, this.scale);
        for (const { c, r } of cells)
        {
            const x = (c - r) * 36, y = (c + r) * 18, t = terrain(c, r);
            if (t === "rim")
            {
                ctx.fillStyle = "#3F241C"; ctx.beginPath();
                ctx.moveTo(x - 36, y); ctx.lineTo(x, y + 18); ctx.lineTo(x + 36, y);
                ctx.lineTo(x + 36, y + 7); ctx.lineTo(x, y + 25); ctx.lineTo(x - 36, y + 7); ctx.closePath(); ctx.fill();
                this.diamond(x, y, "#5C3428");
            }
            else this.diamond(x, y, ["#C4784E", "#B56545", "#A85A3C"][(c * 3 + r) % 3]);
        }
        for (const { c, r } of cells.filter((b) => terrain(b.c, b.r) === "boulder"))
        {
            const x = (c - r) * 36, y = (c + r) * 18;
            this.ellipse(x - 6, y - 4, 10, 10, "#6A3E30");
            this.ellipse(x + 7, y - 1, 8, 8, "#5C3428");
            this.ellipse(x, y + 6, 7, 7, "#4A2C22");
            this.ellipse(x - 9, y - 9, 3, 1.5, "rgba(196,165,116,.55)");
        }
        const buildings = applyAction(state, view.pending).sort((a, b) => a.c + a.r - b.c - b.r);
        for (const b of buildings)
        {
            const ghost = view.pending && view.pending.c === b.c && view.pending.r === b.r;
            this.structure(b, ghost ? .5 : 1);
        }
        if (view.pending) this.diamond((view.pending.c - view.pending.r) * 36, (view.pending.c + view.pending.r) * 18, null, "#E39B54", 2);
        if (view.cursor)
        {
            const { c, r } = view.cursor;
            const invalid = view.tool && checkAction(state, { c, r, kind: view.tool }, view.pending);
            this.diamond((c - r) * 36, (c + r) * 18, null, invalid ? "#E07A5F" : "#E39B54", 2);
        }
        ctx.restore();
        const left = innerWidth >= 1100 ? 320 : 0, area = w - left * 2;
        for (const p of this.particles.slice(0, dusty ? 64 : 32))
        {
            this.ellipse(left + p.x * area, h * (.17 + p.y * .66), p.radius, p.radius * .3,
                dusty ? "rgba(196,165,116,.22)" : "rgba(196,165,116,.12)");
        }
        if (dusty) { ctx.fillStyle = "rgba(196,165,116,.18)"; ctx.fillRect(0, 0, w, h); }
    }
    dispose()
    {
        cancelAnimationFrame(this.frame);
        this.observer?.disconnect();
        document.removeEventListener("visibilitychange", this.visibility);
        this.motion.removeEventListener("change", this.motionChange);
        for (const [type, fn] of [["click", this.click], ["pointermove", this.hover], ["pointerleave", this.leave], ["contextmenu", this.contextMenu]])
            this.canvas.removeEventListener(type, fn);
    }
}
