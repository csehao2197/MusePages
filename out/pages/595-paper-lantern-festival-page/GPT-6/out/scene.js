import { content } from "./content.js";

export function mulberry32(seed)
{
    return function()
    {
        let value = seed += 0x6d2b79f5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

export class FestivalScene
{
    constructor(canvas, onPreferenceChange)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: false });
        this.motion = matchMedia("(prefers-reduced-motion: reduce)");
        this.fine = matchMedia("(pointer: fine)");
        this.reduced = this.motion.matches;
        this.onPreferenceChange = onPreferenceChange;
        this.wind = 1;
        this.paused = false;
        this.elapsed = 0;
        this.personal = [];
        this.ambient = [];
        this.stars = [];
        this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.frame = 0;
        this.last = 0;
        this.accumulator = 0;
        this.allAmbient = this.createAmbient();
        this.resize = this.resize.bind(this);
        this.tick = this.tick.bind(this);
        this.preference = () =>
        {
            this.reduced = this.motion.matches;
            this.pointer.x = this.pointer.y = this.pointer.targetX = this.pointer.targetY = 0;
            if (this.reduced)
            {
                for (const lantern of this.personal)
                {
                    if (lantern.releaseAge < 1.4)
                    {
                        lantern.y = .58;
                        lantern.releaseAge = 1.4;
                    }
                }
            }
            this.onPreferenceChange?.(this.reduced);
            this.restart();
        };
        this.visibility = () => this.restart();
        this.move = (event) =>
        {
            if (!this.fine.matches || this.reduced) return;
            const box = canvas.getBoundingClientRect();
            this.pointer.targetX = ((event.clientX - box.left) / box.width - .5) * 2;
            this.pointer.targetY = ((event.clientY - box.top) / box.height - .5) * 2;
        };
        this.leave = () =>
        {
            this.pointer.targetX = this.pointer.targetY = 0;
        };
        this.observer = new ResizeObserver(this.resize);
        this.observer.observe(canvas);
        this.motion.addEventListener("change", this.preference);
        document.addEventListener("visibilitychange", this.visibility);
        canvas.addEventListener("pointermove", this.move);
        canvas.addEventListener("pointerleave", this.leave);
        this.resize();
    }

    createAmbient()
    {
        const random = mulberry32(291129);
        return Array.from({ length: 42 }, (_, id) =>
        ({
            id,
            kind: "ambient",
            wishId: content.ambient[id % 12].id,
            x: .04 + random() * .92,
            y: .09 + random() * .59,
            depth: .35 + random() * .65,
            scale: .55 + random() * .63,
            phase: random() * Math.PI * 2,
            sway: .6 + random() * .8,
            rotation: 0,
            cycle: 0,
            releaseAge: 1.4
        }));
    }

    resize()
    {
        const rect = this.canvas.getBoundingClientRect();
        this.width = Math.max(1, rect.width);
        this.height = Math.max(1, rect.height);
        const mobile = innerWidth < 760;
        this.dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75);
        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        this.ambient = this.allAmbient.slice(0, mobile ? 24 : 42).sort((a, b) => a.depth - b.depth);
        const random = mulberry32(291129);
        this.stars = [];
        while (this.stars.length < 96)
        {
            const x = random();
            const y = random() * .6;
            const size = .4 + random() * .8;
            if (Math.hypot((x - .18) * this.width, (y - .19) * this.height) < 44) continue;
            this.stars.push({ x, y, size, alpha: .2 + random() * .4 });
        }
        this.restart();
    }

    setWind(value)
    {
        this.wind = [0, 1, 1.85][value];
        this.render();
    }

    setPaused(paused)
    {
        this.paused = paused;
        this.restart();
    }

    reset()
    {
        this.pointer.x = this.pointer.y = this.pointer.targetX = this.pointer.targetY = 0;
        this.setWind(1);
        this.render();
    }

    release(wish)
    {
        this.personal = this.personal.filter((lantern) => lantern.wishId !== wish.id);
        this.personal.push(
        {
            id: `personal-${wish.id}`,
            kind: "personal",
            wishId: wish.id,
            x: .48,
            y: this.reduced ? .58 : .78,
            depth: 1,
            scale: this.reduced ? 1 : .72,
            phase: wish.ordinal,
            sway: 1,
            rotation: 0,
            cycle: 0,
            releaseAge: this.reduced ? 1.4 : 0,
            dormant: false,
            paperTone: wish.paperTone
        });
        this.restart();
    }

    remove(wishId)
    {
        this.personal = this.personal.filter((lantern) => lantern.wishId !== wishId);
        this.render();
    }

    restart()
    {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.last = 0;
        this.accumulator = 0;
        this.render();
        if (!document.hidden && !this.reduced && (!this.paused || this.personal.some((lantern) => lantern.releaseAge < 1.4)))
        {
            this.frame = requestAnimationFrame(this.tick);
        }
    }

    tick(now)
    {
        const activeRelease = this.personal.some((lantern) => lantern.releaseAge < 1.4);
        const interval = activeRelease ? 1000 / 60 : 1000 / 30;
        if (!this.last) this.last = now;
        if (now - this.last >= interval - .5)
        {
            const delta = Math.min((now - this.last) / 1000, .05);
            this.last = now;
            this.accumulator += delta;
            let steps = 0;
            while (this.accumulator >= 1 / 60 && steps < 3)
            {
                this.simulate(1 / 60);
                this.accumulator -= 1 / 60;
                steps++;
            }
            this.render();
        }
        if (!document.hidden && !this.reduced && (!this.paused || this.personal.some((lantern) => lantern.releaseAge < 1.4)))
        {
            this.frame = requestAnimationFrame(this.tick);
        }
    }

    simulate(dt)
    {
        if (!this.paused)
        {
            this.elapsed += dt;
            const ease = 1 - Math.exp(-dt / .2);
            this.pointer.x += (this.pointer.targetX - this.pointer.x) * ease;
            this.pointer.y += (this.pointer.targetY - this.pointer.y) * ease;
            for (const lantern of this.ambient)
            {
                this.drift(lantern, dt, 4 + lantern.depth * 7);
                if (lantern.y * this.height < -65 || lantern.x * this.width > this.width + 65 || lantern.x * this.width < -65)
                {
                    lantern.cycle++;
                    lantern.x = .04 + mulberry32(291129 + lantern.id * 7919 + lantern.cycle * 104729)() * .92;
                    lantern.y = .69;
                }
            }
        }
        for (const lantern of this.personal)
        {
            if (lantern.dormant) continue;
            if (lantern.releaseAge < 1.4)
            {
                lantern.releaseAge = Math.min(1.4, lantern.releaseAge + dt);
                const progress = 1 - (1 - lantern.releaseAge / 1.4) ** 3;
                lantern.y = .78 - progress * .18;
                lantern.scale = .72 + progress * .28;
            }
            else if (!this.paused)
            {
                this.drift(lantern, dt, 9 + lantern.depth * 5);
                if (lantern.y * this.height < -65 || lantern.x * this.width > this.width + 65)
                {
                    lantern.dormant = true;
                }
            }
        }
    }

    drift(lantern, dt, speed)
    {
        lantern.y -= speed * dt / this.height;
        lantern.x += (this.wind * (3 + lantern.depth * 5) +
            Math.sin(this.elapsed * .35 + lantern.phase) * lantern.sway * 1.8) * dt / this.width;
        lantern.rotation = Math.sin(this.elapsed * .5 + lantern.phase) * .055;
    }

    layer(offset, draw)
    {
        this.ctx.save();
        this.ctx.translate(-this.pointer.x * offset, -this.pointer.y * offset);
        draw();
        this.ctx.restore();
    }

    render()
    {
        if (!this.width) return;
        const c = this.ctx;
        const w = this.width;
        const h = this.height;
        const horizon = h * .64;
        c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        const sky = c.createLinearGradient(0, 0, 0, horizon);
        sky.addColorStop(0, "#070c18");
        sky.addColorStop(.52, "#101c35");
        sky.addColorStop(1, "#24363f");
        c.fillStyle = sky;
        c.fillRect(0, 0, w, h);
        this.layer(2, () =>
        {
            for (const star of this.stars)
            {
                c.fillStyle = `rgba(222,229,226,${star.alpha})`;
                c.beginPath();
                c.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
                c.fill();
            }
            c.fillStyle = "#dbdbc8";
            c.beginPath();
            c.arc(w * .18, h * .19, 30, 0, Math.PI * 2);
            c.fill();
        });
        this.layer(4, () =>
        {
            c.fillStyle = "#1b343e";
            c.beginPath();
            c.moveTo(-20, horizon);
            c.lineTo(-20, h * .51);
            c.bezierCurveTo(w * .13, h * .41, w * .17, h * .59, w * .33, h * .52);
            c.bezierCurveTo(w * .49, h * .45, w * .55, h * .57, w * .69, h * .49);
            c.bezierCurveTo(w * .82, h * .42, w * .92, h * .49, w + 20, h * .42);
            c.lineTo(w + 20, horizon);
            c.fill();
            c.fillStyle = "#162e36";
            c.beginPath();
            c.moveTo(-20, horizon + 10);
            c.lineTo(-20, h * .6);
            c.bezierCurveTo(w * .12, h * .51, w * .19, h * .55, w * .31, h * .59);
            c.bezierCurveTo(w * .49, h * .64, w * .63, h * .51, w * .78, h * .56);
            c.bezierCurveTo(w * .9, h * .6, w, h * .5, w + 20, h * .56);
            c.lineTo(w + 20, horizon + 10);
            c.fill();
        });
        this.layer(7, () =>
        {
            for (let index = 0; index < 2; index++)
            {
                const y = h * (.56 + index * .045);
                const mist = c.createLinearGradient(0, y, 0, y + 32);
                mist.addColorStop(0, "rgba(110,149,151,0)");
                mist.addColorStop(.5, "rgba(110,149,151,.055)");
                mist.addColorStop(1, "rgba(110,149,151,0)");
                c.fillStyle = mist;
                c.fillRect(0, y, w, 32);
            }
        });
        c.fillStyle = "#0e242d";
        c.fillRect(0, horizon - 3, w, 8);
        const river = c.createLinearGradient(0, horizon, 0, h);
        river.addColorStop(0, "#1c333d");
        river.addColorStop(.34, "#112538");
        river.addColorStop(1, "#080f1c");
        c.fillStyle = river;
        c.fillRect(0, horizon + 3, w, h - horizon);
        for (let index = 0; index < 68; index++)
        {
            const y = horizon + 9 + ((index * 37) % Math.max(1, Math.floor(h - horizon - 10)));
            const x = ((index * 193) % w) + Math.sin(this.elapsed * .15 + index) * 5;
            const length = 8 + (index % 8) * 7;
            c.strokeStyle = `rgba(126,164,184,${.04 + (index % 4) * .013})`;
            c.lineWidth = .6;
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x + length, y + .3);
            c.stroke();
        }
        for (const lantern of [...this.ambient, ...this.personal])
        {
            if (lantern.dormant) continue;
            const x = lantern.x * w;
            const reflectionY = horizon + Math.abs(horizon - lantern.y * h) * .35 + 8;
            c.strokeStyle = `rgba(246,184,95,${.08 * lantern.depth})`;
            c.lineWidth = 2 * lantern.depth;
            for (let index = 0; index < 3; index++)
            {
                c.beginPath();
                c.moveTo(x + index * 4 - 4, reflectionY + index * 6);
                c.lineTo(x + index * 4 - 4, reflectionY + index * 6 + 8 + lantern.scale * 10);
                c.stroke();
            }
        }
        for (const lantern of this.ambient) this.drawLantern(lantern);
        for (const lantern of this.personal)
        {
            if (!lantern.dormant) this.drawLantern(lantern);
        }
        this.layer(10, () =>
        {
            c.fillStyle = "#050b13";
            c.beginPath();
            c.moveTo(-15, h + 15);
            c.lineTo(-15, h * .84);
            c.bezierCurveTo(w * .07, h * .81, w * .14, h * .93, w * .3, h + 15);
            c.fill();
            c.beginPath();
            c.moveTo(w + 15, h + 15);
            c.lineTo(w + 15, h * .82);
            c.bezierCurveTo(w * .91, h * .91, w * .86, h * .92, w * .77, h + 15);
            c.fill();
            for (let index = 0; index < 25; index++)
            {
                const x = (index < 13 ? index * 8 : w - (index - 13) * 9);
                c.strokeStyle = "#07101a";
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(x, h);
                c.quadraticCurveTo(x + 10, h - 48 - index % 4 * 13, x - 5, h - 70 - index % 3 * 20);
                c.stroke();
            }
            const center = w * .48;
            c.fillStyle = "#181b20";
            c.beginPath();
            c.moveTo(center - 22, h * .82);
            c.lineTo(center + 22, h * .82);
            c.lineTo(center + 71, h + 12);
            c.lineTo(center - 71, h + 12);
            c.closePath();
            c.fill();
            c.strokeStyle = "#4a4237";
            c.lineWidth = 1;
            for (let index = 0; index < 11; index++)
            {
                const t = index / 10;
                const y = h * .82 + t ** 1.5 * (h * .18);
                const half = 22 + t ** 1.5 * 49;
                c.beginPath();
                c.moveTo(center - half, y);
                c.lineTo(center + half, y);
                c.stroke();
            }
            c.fillStyle = "#0a1018";
            for (const side of [-1, 1])
            {
                c.fillRect(center + side * 24 - 3, h * .8, 6, h * .07);
                c.fillRect(center + side * 55 - 4, h * .9, 8, h * .08);
            }
        });
    }

    drawLantern(lantern)
    {
        const c = this.ctx;
        const size = lantern.depth * lantern.scale;
        c.save();
        c.translate(lantern.x * this.width, lantern.y * this.height);
        c.rotate(lantern.rotation);
        c.scale(size, size);
        if (!this.reduced && lantern.kind === "personal" && lantern.releaseAge < 1.4)
        {
            const trail = c.createLinearGradient(0, 14, 0, 64);
            trail.addColorStop(0, "rgba(246,184,95,.5)");
            trail.addColorStop(1, "rgba(246,184,95,0)");
            c.strokeStyle = trail;
            c.lineWidth = 1.5;
            c.beginPath();
            c.moveTo(0, 14);
            c.quadraticCurveTo(-4, 36, 0, 64);
            c.stroke();
        }
        const brightness = this.reduced ? 1 : 1 + Math.sin(this.elapsed * .8 + lantern.phase) * .07;
        c.globalAlpha = brightness / 1.07;
        const halo = c.createRadialGradient(0, -3, 5, 0, -3, 28 * 2.2);
        halo.addColorStop(0, "rgba(246,184,95,.16)");
        halo.addColorStop(.4, "rgba(246,184,95,.055)");
        halo.addColorStop(1, "rgba(246,184,95,0)");
        c.fillStyle = halo;
        c.fillRect(-62, -65, 124, 124);
        const paper = c.createLinearGradient(-14, 0, 14, 0);
        paper.addColorStop(0, "#b77e45");
        paper.addColorStop(.25, lantern.paperTone === "apricot" ? "#f5c59c" : "#f6b85f");
        paper.addColorStop(.53, "#ffe6a3");
        paper.addColorStop(.77, "#f7eac8");
        paper.addColorStop(1, "#d39451");
        c.fillStyle = paper;
        c.beginPath();
        c.moveTo(-14, -17);
        c.quadraticCurveTo(0, -25, 14, -17);
        c.lineTo(11, 18);
        c.quadraticCurveTo(0, 23, -11, 18);
        c.closePath();
        c.fill();
        c.strokeStyle = "rgba(138,104,72,.42)";
        c.lineWidth = .6;
        for (const rib of [-8, -3, 3, 8])
        {
            c.beginPath();
            c.moveTo(rib, -19);
            c.quadraticCurveTo(rib * 1.1, 0, rib * .78, 20);
            c.stroke();
        }
        c.fillStyle = "#7b542e";
        c.beginPath();
        c.ellipse(0, 18, 11, 3, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#ffe6a3";
        c.beginPath();
        c.ellipse(0, 18, 5, 1.3, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }

    destroy()
    {
        cancelAnimationFrame(this.frame);
        this.observer.disconnect();
        this.motion.removeEventListener("change", this.preference);
        document.removeEventListener("visibilitychange", this.visibility);
        this.canvas.removeEventListener("pointermove", this.move);
        this.canvas.removeEventListener("pointerleave", this.leave);
    }
}
