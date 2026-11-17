import { palette as p, angleDelta, smoothPath } from "./palette.js";
import { tiers } from "../quality.js";
import { content } from "../content.js";

const lengths = [240, 200, 190, 180, 175, 170, 160, 150, 150];
const colors = [p.cream, p.vermilion, p.gold, p.cream, p.vermilion, p.cream, p.gold, p.cream, p.cream];
const widths = [0.028, 0.071, 0.097, 0.105, 0.098, 0.081, 0.062, 0.044, 0.029, 0.020, 0.017, 0.016];

export function createKoi(state, random, ripples)
{
    const fish = Array.from({ length: content.koiCount }, (_, index) =>
    {
        const a = index * 2.399 + 0.4;
        const x = state.w * (0.50 + Math.cos(a) * (0.10 + random() * 0.20));
        const y = state.h * (0.54 + Math.sin(a) * (0.12 + random() * 0.20));
        const heading = a + Math.PI / 2;
        const length = lengths[index % 9] * state.u;
        return {
            index, x, y, heading, length: lengths[index % 9], speed: 43, acceleration: 0,
            phase: random() * 6.28, period: 6 + random() * 5, beat: 0,
            depth: random(), burstUntil: -10, interestUntil: -10, tapped: -10,
            delay: 0.15 + random() * 0.75, leaving: false, visible: index < Math.max(4, Math.round(content.koiCount * tiers[state.tier].fish)),
            tail: 0, tailVelocity: 0, linger: 0, feedX: x, feedY: y,
            spine: Array.from({ length: tiers[state.tier].points }, (_, i) => ({ x: x - Math.cos(heading) * length * i / (tiers[state.tier].points - 1), y: y - Math.sin(heading) * length * i / (tiers[state.tier].points - 1) })),
            contour: Array.from({ length: tiers[state.tier].points * 2 }, () => ({ x: 0, y: 0 })),
            patches: Array.from({ length: index === 0 ? 3 : 4 }, (_, n) => ({ t: 0.18 + n * 0.19, side: (random() - 0.5) * 0.09, size: 0.07 + random() * 0.04, angle: random() * 3 }))
        };
    });
    const sorted = [...fish].sort((a, b) => b.depth - a.depth);
    function quality()
    {
        const cap = Math.max(4, Math.round(content.koiCount * tiers[state.tier].fish));
        for (const f of fish)
        {
            const count = tiers[state.tier].points;
            if (f.spine.length !== count)
            {
                const old = f.spine;
                f.spine = Array.from({ length: count }, (_, i) =>
                {
                    const t = i / (count - 1) * (old.length - 1);
                    const a = old[Math.floor(t)];
                    const b = old[Math.min(old.length - 1, Math.ceil(t))];
                    return { x: a.x + (b.x - a.x) * (t % 1), y: a.y + (b.y - a.y) * (t % 1) };
                });
                f.contour = Array.from({ length: count * 2 }, () => ({ x: 0, y: 0 }));
            }
            if (f.index >= cap && f.visible) f.leaving = true;
            else if (f.index < cap)
            {
                if (!f.visible)
                {
                    f.x = -f.length * state.u;
                    f.y = state.h * (0.3 + f.depth * 0.4);
                    f.heading = 0;
                    for (const s of f.spine) Object.assign(s, { x: f.x, y: f.y });
                }
                f.leaving = false;
                f.visible = true;
            }
        }
    }
    function update(dt)
    {
        for (const f of fish)
        {
            if (!f.visible) continue;
            const L = f.length * state.u * (1 - f.depth * 0.08);
            const cruise = (55 - (f.length - 150) * 0.18) * (1 - state.seasonMix[3] * 0.4);
            let desired = f.heading + Math.sin(state.time / f.period * 6.28 + f.phase) * 0.18;
            let vx = Math.cos(desired);
            let vy = Math.sin(desired);
            const homeX = state.w * 0.50 - f.x;
            const homeY = state.h * 0.54 - f.y;
            const homeDistance = Math.hypot(homeX, homeY) || 1;
            vx += homeX / homeDistance * 0.15 - homeY / homeDistance * 0.20;
            vy += homeY / homeDistance * 0.15 + homeX / homeDistance * 0.20;
            for (const other of fish)
            {
                if (other === f || !other.visible) continue;
                const dx = f.x - other.x;
                const dy = f.y - other.y;
                const d = Math.hypot(dx, dy) || 1;
                if (d < L * 0.9)
                {
                    vx += dx / d * (1 - d / (L * 0.9)) * 1.4;
                    vy += dy / d * (1 - d / (L * 0.9)) * 1.4;
                }
                else if (d < L * 1.8)
                {
                    vx += Math.cos(other.heading) * 0.06;
                    vy += Math.sin(other.heading) * 0.06;
                }
            }
            const margin = 140 * state.u;
            vx += Math.max(0, (margin - f.x) / margin) * 3 - Math.max(0, (f.x - state.w + margin) / margin) * 3;
            vy += Math.max(0, (margin - f.y) / margin) * 3 - Math.max(0, (f.y - state.h + margin) / margin) * 3;
            let targetSpeed = cruise;
            const cycle = (state.time + f.phase) % 4;
            const gliding = cycle > 2.7;
            if (gliding) targetSpeed *= 0.8;
            const tap = state.lastTap;
            if (tap && tap.time !== f.tapped && state.time - tap.time < 0.1)
            {
                f.tapped = tap.time;
                const distance = Math.hypot(f.x - tap.x, f.y - tap.y) / state.u;
                if (distance < 140 && !state.reduced) f.burstUntil = state.time + 0.6;
                else if (distance < 380) f.interestUntil = state.time + 2;
            }
            if (tap && f.burstUntil > state.time)
            {
                vx = (f.x - tap.x) / state.u;
                vy = (f.y - tap.y) / state.u;
                targetSpeed = 190;
            }
            else if (tap && f.interestUntil > state.time && state.time - tap.time > 0.5)
            {
                vx += (tap.x - f.x) / (180 * state.u);
                vy += (tap.y - f.y) / (180 * state.u);
            }
            let nearest = null;
            let nearestDistance = Infinity;
            for (const pellet of ripples.food)
            {
                if (!pellet.active || pellet.age < f.delay) continue;
                const distance = Math.hypot(pellet.x - f.x, pellet.y - f.y);
                if (distance < nearestDistance)
                {
                    nearest = pellet;
                    nearestDistance = distance;
                }
            }
            if (nearest)
            {
                const dx = nearest.x - f.x;
                const dy = nearest.y - f.y;
                vx = dx / (nearestDistance || 1) * 2.4 - dy / (nearestDistance || 1) * 0.16;
                vy = dy / (nearestDistance || 1) * 2.4 + dx / (nearestDistance || 1) * 0.16;
                targetSpeed = cruise * (nearestDistance < 90 * state.u ? 0.85 : 1.6);
                f.linger = state.time + 2 + f.delay;
                f.feedX = nearest.x;
                f.feedY = nearest.y;
                if (nearestDistance < 15 * state.u)
                {
                    nearest.active = false;
                    ripples.stats.eaten++;
                    ripples.ring(nearest.x, nearest.y, 0, true, 0.75);
                    f.beat += 0.3;
                }
            }
            else if (f.linger > state.time)
            {
                const dx = f.feedX - f.x;
                const dy = f.feedY - f.y;
                const distance = Math.hypot(dx, dy) || 1;
                const inward = (distance - L * 0.45) / L;
                vx = dx / distance * inward - dy / distance;
                vy = dy / distance * inward + dx / distance;
                targetSpeed = cruise * 0.8;
            }
            const current = ripples.flow(f.x, f.y);
            vx += current.x * current.weight * 2.4;
            vy += current.y * current.weight * 2.4;
            if (current.weight > 0.2 && !nearest) targetSpeed *= 1.3;
            if (f.leaving)
            {
                vx = -3;
                vy = (state.h * 0.5 - f.y) / state.h;
                if (f.x < -L * 1.4)
                {
                    f.visible = false;
                    continue;
                }
            }
            desired = Math.atan2(vy, vx);
            const turn = angleDelta(f.heading, desired);
            const turnCap = Math.min(f.burstUntil > state.time ? 1.8 : 1.22, f.speed / f.length * 2) * dt * (state.reduced ? 0.35 : 1);
            f.heading += Math.max(-turnCap, Math.min(turnCap, turn));
            const omega = 2.5;
            f.acceleration += ((targetSpeed - f.speed) * omega * omega - 2 * omega * f.acceleration) * dt;
            f.speed = Math.max(4, f.speed + f.acceleration * dt);
            const calm = state.reduced ? 0.35 : 1;
            f.x += Math.cos(f.heading) * f.speed * state.u * calm * dt;
            f.y += Math.sin(f.heading) * f.speed * state.u * calm * dt;
            f.beat += dt * (0.9 + Math.max(0, f.speed - cruise) / 140 * 1.5) * 6.28;
            f.spine[0].x = f.x;
            f.spine[0].y = f.y;
            for (let i = 1; i < f.spine.length; i++)
            {
                const prev = f.spine[i - 1];
                const q = f.spine[i];
                const dx = prev.x - q.x;
                const dy = prev.y - q.y;
                const distance = Math.hypot(dx, dy) || 1;
                q.x = prev.x - dx / distance * L / (f.spine.length - 1);
                q.y = prev.y - dy / distance * L / (f.spine.length - 1);
            }
            const tailTarget = Math.sin(f.beat - 6.28) * 0.35 + turn * 0.6;
            f.tailVelocity += (40 * (tailTarget - f.tail) - 8 * f.tailVelocity) * dt;
            f.tail += f.tailVelocity * dt;
            f.amplitude = (gliding ? 0.35 : 1) * (state.reduced ? 0.5 : 1);
        }
    }
    function shape(c, f, shadow = false)
    {
        const L = f.length * state.u * (1 - f.depth * 0.08);
        const n = f.spine.length;
        for (let i = 0; i < n; i++)
        {
            const q = f.spine[i];
            const prev = f.spine[Math.max(0, i - 1)];
            const next = f.spine[Math.min(n - 1, i + 1)];
            const angle = Math.atan2(prev.y - next.y, prev.x - next.x);
            const nx = -Math.sin(angle);
            const ny = Math.cos(angle);
            const t = i / (n - 1);
            const wave = Math.sin(f.beat - t * 6.28) * Math.pow(t, 1.8) * L * 0.065 * (f.amplitude || 1);
            const profile = t * (widths.length - 1);
            const width = (widths[Math.floor(profile)] + (widths[Math.ceil(profile)] - widths[Math.floor(profile)]) * (profile % 1)) * L;
            const offset = shadow ? state.u * (14 - f.depth * 5) : 0;
            f.contour[i].x = q.x + nx * (width + wave) + offset;
            f.contour[i].y = q.y + ny * (width + wave) + offset;
            f.contour[2 * n - 1 - i].x = q.x + nx * (-width + wave) + offset;
            f.contour[2 * n - 1 - i].y = q.y + ny * (-width + wave) + offset;
        }
        smoothPath(c, f.contour);
    }
    function draw(c)
    {
        for (const f of sorted)
        {
            if (!f.visible) continue;
            const L = f.length * state.u * (1 - f.depth * 0.08);
            const color = colors[f.index % 9];
            c.save();
            c.globalAlpha = 0.20;
            c.fillStyle = p.deep;
            shape(c, f, true);
            c.fill();
            c.globalAlpha = f.index === 7 ? 0.78 : 1 - f.depth * 0.1;
            const root = f.spine.at(-1);
            const before = f.spine.at(-2);
            const tailAngle = Math.atan2(before.y - root.y, before.x - root.x);
            const tailWave = Math.sin(f.beat - 6.28) * L * 0.065 * (f.amplitude || 1);
            c.save();
            c.translate(root.x - Math.sin(tailAngle) * tailWave, root.y + Math.cos(tailAngle) * tailWave);
            c.rotate(tailAngle + f.tail * 1.6);
            c.fillStyle = color;
            c.globalAlpha *= 0.7;
            c.beginPath();
            c.moveTo(0, -L * 0.018);
            c.bezierCurveTo(-L * 0.08, -L * 0.04, -L * 0.18, -L * 0.16, -L * 0.28, -L * 0.15);
            c.quadraticCurveTo(-L * 0.26, -L * 0.04, -L * 0.16, 0);
            c.quadraticCurveTo(-L * 0.26, L * 0.04, -L * 0.28, L * 0.15);
            c.bezierCurveTo(-L * 0.18, L * 0.16, -L * 0.08, L * 0.04, 0, L * 0.018);
            c.fill();
            c.strokeStyle = p.cream;
            c.lineWidth = 0.65 * state.u;
            c.globalAlpha *= 0.35;
            for (let k = -3; k <= 3; k++)
            {
                c.beginPath();
                c.moveTo(0, 0);
                c.quadraticCurveTo(-L * 0.12, k * L * 0.022, -L * (0.22 + Math.abs(k) * 0.02), k * L * 0.043);
                c.stroke();
            }
            c.restore();
            const fin = f.spine[Math.round((f.spine.length - 1) * 0.24)];
            const finAngle = Math.atan2(f.spine[1].y - fin.y, f.spine[1].x - fin.x);
            c.save();
            c.translate(fin.x, fin.y);
            c.rotate(finAngle);
            c.fillStyle = p.cream;
            for (const side of [-1, 1])
            {
                c.save();
                c.scale(1, side);
                const sweep = Math.sin(f.beat + side) * 0.025 * L;
                c.globalAlpha = 0.38;
                c.beginPath();
                c.moveTo(L * 0.03, L * 0.05);
                c.bezierCurveTo(L * 0.03, L * 0.13, -L * 0.10 + sweep, L * 0.23, -L * 0.18, L * 0.20);
                c.quadraticCurveTo(-L * 0.13, L * 0.08, -L * 0.07, L * 0.06);
                c.fill();
                c.globalAlpha = 0.25;
                c.strokeStyle = p.cream;
                c.lineWidth = 0.5 * state.u;
                for (let j = 0; j < 5; j++)
                {
                    c.beginPath();
                    c.moveTo(L * 0.01, L * 0.05);
                    c.lineTo((-0.06 - j * 0.025) * L + sweep, (0.15 + j * 0.012) * L);
                    c.stroke();
                }
                c.restore();
            }
            c.restore();
            shape(c, f);
            c.fillStyle = color;
            c.fill();
            c.save();
            c.clip();
            for (let j = 0; j < f.patches.length; j++)
            {
                const patch = f.patches[j];
                if ((f.index === 2 || f.index === 3 || f.index === 8) && j > 0 || f.index === 6 || f.index === 7) continue;
                const t = f.index === 2 || f.index === 3 || f.index === 8 ? 0.08 : patch.t;
                const index = Math.max(1, Math.min(f.spine.length - 2, Math.round(t * (f.spine.length - 1))));
                const q = f.spine[index];
                const angle = Math.atan2(f.spine[index - 1].y - q.y, f.spine[index - 1].x - q.x);
                c.save();
                c.translate(q.x, q.y);
                c.rotate(angle + patch.angle * 0.3);
                c.fillStyle = f.index === 2 ? p.cream : f.index === 6 ? p.amber : f.index === 4 ? p.ink : f.index === 7 ? p.cream : f.index === 1 ? p.vermilion : j % 3 === 1 && f.index === 5 ? p.gold : p.vermilion;
                if (f.index === 3 && j > 0)
                {
                    c.restore();
                    continue;
                }
                const r = f.index === 4 ? 0.023 : f.index === 3 ? 0.05 : f.index === 8 ? 0.13 : patch.size;
                c.beginPath();
                c.moveTo(-r * L, patch.side * L);
                c.bezierCurveTo(-r * L * 1.2, (patch.side - r) * L, r * L * 0.3, (patch.side - r * 0.85) * L, r * L * 0.82, (patch.side - r * 0.35) * L);
                c.bezierCurveTo(r * L * 1.25, (patch.side + r * 0.85) * L, -r * L * 0.55, (patch.side + r * 1.05) * L, -r * L, patch.side * L);
                c.fill();
                c.restore();
            }
            c.strokeStyle = p.ink;
            c.globalAlpha = 0.22;
            c.lineWidth = state.u * 1.2;
            c.beginPath();
            for (let i = Math.round(f.spine.length * 0.3); i <= Math.round(f.spine.length * 0.6); i++)
            {
                const q = f.spine[i];
                if (i === Math.round(f.spine.length * 0.3)) c.moveTo(q.x, q.y);
                else c.lineTo(q.x, q.y);
            }
            c.stroke();
            c.strokeStyle = p.cream;
            c.globalAlpha = 0.20;
            c.lineWidth = 3 * state.u;
            c.beginPath();
            c.moveTo(f.spine[1].x - 3 * state.u, f.spine[1].y - 2 * state.u);
            for (let i = 2; i < f.spine.length * 0.7; i++) c.lineTo(f.spine[i].x - 3 * state.u, f.spine[i].y - 2 * state.u);
            c.stroke();
            c.restore();
            c.globalAlpha = 1;
            c.fillStyle = p.ink;
            const eye = f.spine[1];
            for (const side of [-1, 1])
            {
                c.beginPath();
                c.arc(eye.x - Math.sin(f.heading) * L * 0.049 * side, eye.y + Math.cos(f.heading) * L * 0.049 * side, Math.max(1, L * 0.009), 0, Math.PI * 2);
                c.fill();
            }
            if (f.depth > 0)
            {
                shape(c, f);
                c.fillStyle = p.water;
                c.globalAlpha = f.depth * 0.14;
                c.fill();
            }
            c.restore();
        }
    }
    return { fish, update, draw, quality };
}
