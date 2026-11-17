import { C } from "./content.mjs";

export class Game
{
    constructor(canvas, type, options)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.type = type;
        this.options = options;
        this.phase = "ready";
        this.keys = new Set();
        this.x = 320;
        this.y = 180;
        this.time = 0;
        this.score = 0;
        this.objects = [];
        this.particles = [];
        this.spawn = 0;
        this.seed = crypto.getRandomValues(new Uint32Array(1))[0] || 1;
        this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.lastPaint = 0;
        this.cleanup = [];
        this.listen = (target, name, fn, config) =>
        {
            target.addEventListener(name, fn, config);
            this.cleanup.push(() => target.removeEventListener(name, fn, config));
        };
        this.listen(canvas, "pointerdown", (e) =>
        {
            if (this.phase !== "running") return;
            canvas.focus({ preventScroll: true });
            this.point(e);
            this.dragging = true;
            if (e.isTrusted) canvas.setPointerCapture(e.pointerId);
        });
        this.listen(canvas, "pointermove", (e) =>
        {
            if (this.dragging && this.type === "catch" && this.phase === "running") this.point(e);
        });
        this.listen(canvas, "pointerup", () => this.dragging = false);
        this.listen(canvas, "pointercancel", () => this.dragging = false);
        this.listen(canvas, "keydown", (e) =>
        {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "a", "d", "w", "s"].includes(e.key))
            {
                e.preventDefault();
                if (e.key === " " && this.phase === "running" && !e.repeat && this.type === "bubble") this.pop(this.x, this.y, 10);
                this.keys.add(e.key.toLowerCase());
            }
        });
        this.listen(window, "keyup", (e) => this.keys.delete(e.key.toLowerCase()));
        this.listen(window, "blur", () => { this.keys.clear(); if (this.phase === "running") this.pause(); });
        this.listen(document, "visibilitychange", () => { if (document.hidden && this.phase === "running") this.pause(); });
        this.resize = new ResizeObserver(() => this.draw());
        this.resize.observe(canvas);
        this.draw();
    }
    random()
    {
        this.seed ^= this.seed << 13;
        this.seed ^= this.seed >>> 17;
        this.seed ^= this.seed << 5;
        return (this.seed >>> 0) / 4294967296;
    }
    point(e)
    {
        const bounds = this.canvas.getBoundingClientRect();
        const x = (e.clientX - bounds.left) * 640 / bounds.width;
        const y = (e.clientY - bounds.top) * 360 / bounds.height;
        if (this.type === "catch") this.x = Math.min(610, Math.max(30, x));
        else this.pop(x, y, 0);
    }
    pop(x, y, padding)
    {
        const index = this.objects.findIndex((o) => Math.hypot(o.x - x, o.y - y) <= o.r + padding);
        if (index >= 0)
        {
            const object = this.objects[index];
            this.burst(object.x, object.y, "#FFF3D6");
            this.score += this.objects[index].value;
            this.objects.splice(index, 1);
        }
    }
    burst(x, y, color)
    {
        if (this.reduced) return;
        this.particles.push({ x, y, color, age: 0 });
    }
    start()
    {
        if (this.phase !== "ready") return;
        this.phase = "running";
        this.previous = performance.now();
        this.accumulator = 0;
        this.canvas.focus({ preventScroll: true });
        this.frame = requestAnimationFrame((t) => this.animate(t));
        this.options.update(this.snapshot());
    }
    pause()
    {
        if (this.phase === "running")
        {
            this.phase = "paused";
            cancelAnimationFrame(this.frame);
            this.keys.clear();
        }
        else if (this.phase === "paused")
        {
            this.phase = "running";
            this.previous = performance.now();
            this.frame = requestAnimationFrame((t) => this.animate(t));
            this.canvas.focus({ preventScroll: true });
        }
        this.options.update(this.snapshot());
        this.draw();
    }
    animate(now)
    {
        if (this.phase !== "running") return;
        this.accumulator += Math.min(.25, (now - this.previous) / 1000);
        this.previous = now;
        while (this.accumulator >= 1 / 60 && this.phase === "running")
        {
            this.step(1 / 60);
            this.accumulator -= 1 / 60;
        }
        if (!this.reduced || now - this.lastPaint >= 100)
        {
            this.draw();
            this.lastPaint = now;
        }
        this.options.update(this.snapshot());
        if (this.phase === "running") this.frame = requestAnimationFrame((t) => this.animate(t));
    }
    step(dt)
    {
        this.time = Math.min(C.games[this.type].seconds, this.time + dt);
        if (this.keys.has("arrowleft") || this.keys.has("a")) this.x -= 280 * dt;
        if (this.keys.has("arrowright") || this.keys.has("d")) this.x += 280 * dt;
        if (this.type === "bubble")
        {
            if (this.keys.has("arrowup") || this.keys.has("w")) this.y -= 240 * dt;
            if (this.keys.has("arrowdown") || this.keys.has("s")) this.y += 240 * dt;
        }
        this.x = Math.max(30, Math.min(610, this.x));
        this.y = Math.max(20, Math.min(340, this.y));
        this.spawn += dt;
        const interval = this.type === "catch" ? .6 : .55;
        if (this.spawn >= interval)
        {
            this.spawn -= interval;
            if (this.type === "catch") this.objects.push({ x: 30 + this.random() * 580, y: -10 });
            else if (this.objects.length < 8)
            {
                const small = this.random() >= .75;
                const r = small ? 13 : 22;
                this.objects.push({ x: 20 + r + this.random() * (600 - 2 * r), y: 170 + this.random() * 145, r, value: small ? 2 : 1, age: 0, speed: 24 + this.random() * 18 });
            }
        }
        this.objects = this.objects.filter((o) =>
        {
            if (this.type === "catch")
            {
                o.y += Math.min(230, 110 + 4 * this.time) * dt;
                if (o.y >= 299 && o.y <= 327 && Math.abs(o.x - this.x) < 33)
                {
                    this.score++;
                    this.burst(o.x, o.y, "#F6C453");
                    return false;
                }
                return o.y < 370;
            }
            o.age += dt;
            o.y -= o.speed * dt;
            return o.age < 3.2;
        });
        this.particles = this.particles.filter((p) => { p.age += dt; return p.age < .12; });
        if (this.time >= C.games[this.type].seconds && this.phase === "running")
        {
            this.phase = "complete";
            this.options.complete(this.score, this.type);
        }
    }
    snapshot()
    {
        return { phase: this.phase, score: this.score, remaining: Math.max(0, Math.ceil(C.games[this.type].seconds - this.time)) };
    }
    draw()
    {
        const dpr = Math.min(2, devicePixelRatio || 1);
        const width = Math.max(1, this.canvas.clientWidth);
        const height = width * 360 / 640;
        if (this.canvas.width !== Math.round(width * dpr) || this.canvas.height !== Math.round(height * dpr))
        {
            this.canvas.width = Math.round(width * dpr);
            this.canvas.height = Math.round(height * dpr);
        }
        const c = this.ctx;
        c.setTransform(this.canvas.width / 640, 0, 0, this.canvas.height / 360, 0, 0);
        c.imageSmoothingEnabled = false;
        c.fillStyle = "#BFE3C0";
        c.fillRect(0, 0, 640, 360);
        c.fillStyle = "#A1CBA9";
        for (let x = 0; x < 640; x += 64)
        {
            c.fillRect(x, 336, 32, 24);
            c.fillRect(x + 32, 320, 32, 16);
        }
        c.fillStyle = "#8AC926";
        c.fillRect(0, 334, 640, 5);
        c.fillStyle = "#FFF3D6";
        c.fillRect(48, 34, 64, 12);
        c.fillRect(72, 22, 32, 12);
        c.fillRect(480, 60, 80, 12);
        c.fillRect(500, 48, 32, 12);
        if (this.type === "catch")
        {
            if (this.options.petImage?.complete) c.drawImage(this.options.petImage, Math.round(this.x - 32), 266, 64, 64);
            c.fillStyle = "#574665";
            c.fillRect(Math.round(this.x - 29), 312, 58, 12);
            c.fillStyle = "#F6C453";
            c.fillRect(Math.round(this.x - 25), 314, 50, 7);
        }
        else
        {
            if (this.options.petImage?.complete) c.drawImage(this.options.petImage, 16, 280, 56, 56);
            c.strokeStyle = "#241D31";
            c.lineWidth = 3;
            c.strokeRect(Math.round(this.x - 9), Math.round(this.y - 9), 18, 18);
        }
        for (const o of this.objects)
        {
            if (this.type === "catch")
            {
                c.fillStyle = "#574665";
                c.fillRect(Math.round(o.x - 7), Math.round(o.y - 5), 14, 14);
                c.fillStyle = "#F6C453";
                c.fillRect(Math.round(o.x - 5), Math.round(o.y), 10, 7);
                c.fillStyle = "#689B51";
                c.fillRect(Math.round(o.x - 2), Math.round(o.y - 8), 6, 6);
            }
            else
            {
                c.fillStyle = o.value === 2 ? "#F6C453" : "#69C3D4";
                c.beginPath();
                c.arc(Math.round(o.x), Math.round(o.y), o.r, 0, Math.PI * 2);
                c.fill();
                c.strokeStyle = "#574665";
                c.lineWidth = 3;
                c.stroke();
                c.fillStyle = "#FFF3D6";
                c.fillRect(Math.round(o.x - o.r / 2), Math.round(o.y - o.r / 2), 5, 5);
            }
        }
        for (const particle of this.particles)
        {
            c.fillStyle = particle.color;
            const offset = Math.round(5 + particle.age * 70);
            for (const [x, y] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
            {
                c.fillRect(Math.round(particle.x + x * offset), Math.round(particle.y + y * offset), 4, 4);
            }
        }
    }
    destroy()
    {
        cancelAnimationFrame(this.frame);
        this.cleanup.forEach((fn) => fn());
        this.resize.disconnect();
        this.keys.clear();
    }
}
