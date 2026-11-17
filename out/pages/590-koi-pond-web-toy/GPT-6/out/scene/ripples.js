import { palette as p } from "./palette.js";
import { tiers } from "../quality.js";

export function createRipples(state, random)
{
    const rings = Array.from({ length: 24 }, () => ({ active: false, x: 0, y: 0, age: 0, radius: 0, alpha: 0 }));
    const drops = Array.from({ length: 40 }, () => ({ active: false, x: 0, y: 0, age: 0 }));
    const food = Array.from({ length: 60 }, () => ({ active: false, x: 0, y: 0, age: 0 }));
    const currents = Array.from({ length: 3 }, () => ({ active: false, age: 0, count: 0, points: Array.from({ length: 128 }, () => ({ x: 0, y: 0 })) }));
    let cursor = 0;
    let foodCursor = 0;
    let dropCursor = 0;
    let currentCursor = 0;
    let rainCarry = 0;
    const force = { x: 0, y: 0, weight: 0 };
    const stats = { taps: 0, fed: 0, eaten: 0, currents: 0, cracks: 0 };
    function ring(x, y, delay = 0, small = false, strength = 1, gold = false)
    {
        const r = rings[cursor++ % tiers[state.tier].rings];
        Object.assign(r, { active: true, x, y, age: -delay, small, strength, gold, radius: 0, alpha: 0 });
    }
    function flow(x, y)
    {
        force.x = force.y = force.weight = 0;
        for (const current of currents)
        {
            if (!current.active) continue;
            for (let i = 1; i < current.count; i++)
            {
                const a = current.points[i - 1];
                const b = current.points[i];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const length2 = dx * dx + dy * dy || 1;
                const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / length2));
                const distance = Math.hypot(x - a.x - t * dx, y - a.y - t * dy);
                const weight = Math.max(0, 1 - distance / (180 * state.u)) * Math.min(1, (9 - current.age) / 3);
                if (weight > force.weight)
                {
                    force.x = dx / Math.sqrt(length2);
                    force.y = dy / Math.sqrt(length2);
                    force.weight = weight;
                }
            }
        }
        return force;
    }
    return {
        rings, drops, food, currents, stats, ring, flow,
        tap(x, y)
        {
            stats.taps++;
            ring(x, y);
            if (!state.reduced)
            {
                ring(x, y, 0.14);
                ring(x, y, 0.30);
            }
            state.lastTap = { x, y, time: state.time };
        },
        pellet(x, y)
        {
            const f = food[foodCursor++ % tiers[state.tier].pellets];
            const angle = random() * Math.PI * 2;
            const radius = Math.sqrt(random()) * 46 * state.u;
            Object.assign(f, { x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius, age: 0, active: true });
            stats.fed++;
            ring(f.x, f.y, 0, true, 0.5);
        },
        beginCurrent(x, y)
        {
            const current = currents[currentCursor++ % 3];
            Object.assign(current, { active: true, age: 0, count: 1 });
            Object.assign(current.points[0], { x, y });
            stats.currents++;
            return current;
        },
        extend(current, x, y)
        {
            const last = current.points[current.count - 1];
            if (Math.hypot(x - last.x, y - last.y) < 12 * state.u || current.count >= 128) return;
            Object.assign(current.points[current.count++], { x, y });
            current.age = 0;
        },
        update(dt)
        {
            for (const r of rings)
            {
                if (!r.active) continue;
                r.age += dt;
                const duration = r.gold ? 4 : r.small ? 0.7 : state.reduced ? 1.2 : 2.6;
                if (r.age > duration)
                {
                    r.active = false;
                    continue;
                }
                if (r.age < 0) continue;
                const t = r.age / duration;
                const max = r.gold ? Math.hypot(state.w, state.h) : (r.small ? 26 : 240) * state.u;
                r.radius = 6 * state.u + (max - 6 * state.u) * (1 - Math.pow(1 - t, 3));
                r.alpha = 0.55 * Math.exp(-2.2 * t) * Math.min(1, (1 - t) / 0.2) * r.strength;
            }
            for (const f of food)
            {
                if (!f.active) continue;
                f.age += dt;
                if (f.age > 14) f.active = false;
                const current = flow(f.x, f.y);
                f.x += (current.x * current.weight * 60 - 2) * state.u * dt;
                f.y += (current.y * current.weight * 60 + 1) * state.u * dt;
            }
            for (const c of currents)
            {
                if (!c.active) continue;
                c.age += dt;
                if (c.age > 9) c.active = false;
            }
            rainCarry += dt * state.rain * (state.reduced ? 3 : tiers[state.tier].rain) * (1 - state.seasonMix[3]);
            while (rainCarry > 1)
            {
                rainCarry--;
                Object.assign(drops[dropCursor++ % 40], { active: true, x: random() * state.w, y: random() * state.h, age: 0 });
            }
            for (const d of drops)
            {
                if (!d.active) continue;
                d.age += dt;
                if (d.age > 0.9) d.active = false;
            }
        },
        drawFood(c)
        {
            for (const f of food)
            {
                if (!f.active) continue;
                c.globalAlpha = Math.min(1, 14 - f.age);
                c.fillStyle = p.amber;
                c.beginPath();
                c.arc(f.x, f.y, 3.5 * state.u, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = p.cream;
                c.fillRect(f.x - state.u, f.y - 2 * state.u, 1.5 * state.u, state.u);
            }
            c.globalAlpha = 1;
        },
        draw(c)
        {
            c.save();
            for (const current of currents)
            {
                if (!current.active || current.count < 2) continue;
                c.globalAlpha = 0.35 * Math.min(1, (9 - current.age) / 3);
                c.strokeStyle = p.cream;
                c.lineWidth = 0.8 * state.u;
                c.setLineDash([12 * state.u, 22 * state.u]);
                c.lineDashOffset = -state.time * 120 * state.u;
                for (let j = -1; j <= 1; j++)
                {
                    c.beginPath();
                    for (let i = 0; i < current.count; i++)
                    {
                        const q = current.points[i];
                        if (!i) c.moveTo(q.x + j * 4 * state.u, q.y + j * 3 * state.u);
                        else c.lineTo(q.x + j * 4 * state.u, q.y + j * 3 * state.u);
                    }
                    c.stroke();
                }
            }
            c.setLineDash([]);
            for (const r of rings)
            {
                if (!r.active || r.age < 0) continue;
                c.globalAlpha = r.alpha;
                c.strokeStyle = r.gold ? p.gold : p.cream;
                c.lineWidth = (2.2 - Math.min(1, r.age / 2.6) * 1.6) * state.u;
                c.beginPath();
                c.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                c.stroke();
            }
            c.strokeStyle = p.cream;
            for (const d of drops)
            {
                if (!d.active) continue;
                c.globalAlpha = (1 - d.age / 0.9) * 0.18;
                c.lineWidth = 0.7 * state.u;
                c.beginPath();
                c.arc(d.x, d.y, (4 + d.age / 0.9 * 42) * state.u, 0, Math.PI * 2);
                c.stroke();
            }
            c.restore();
        }
    };
}
