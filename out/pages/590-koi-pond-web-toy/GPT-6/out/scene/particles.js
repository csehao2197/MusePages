import { palette as p } from "./palette.js";
import { tiers } from "../quality.js";

export function createParticles(state, random, ripples)
{
    const particles = Array.from({ length: 350 }, (_, i) =>
    ({
        x: random(), y: random(), angle: random() * 6.28, phase: random() * 6.28,
        speed: 0.5 + random(), size: 5 + random() * 6, landed: i < 14, air: i < 22
    }));
    const dragonflies = Array.from({ length: 2 }, () => ({ x: random(), y: random(), phase: random() * 6.28, next: 0, tx: random(), ty: random() }));
    function update(dt)
    {
        const scale = state.reduced ? 0.3 : 1;
        for (let i = 0; i < particles.length; i++)
        {
            const f = particles[i];
            if (state.reduced) continue;
            const flow = ripples.flow(f.x * state.w, f.y * state.h);
            const speed = f.landed ? 8 : 18 + f.speed * 10;
            f.x += ((-0.6 + Math.sin(state.time * 0.6 + f.phase) * (f.landed ? 0.2 : 1.1)) * speed + flow.x * flow.weight * 60) * state.u * dt / state.w * scale;
            f.y += (speed * 0.4 + flow.y * flow.weight * 60) * state.u * dt / state.h * scale;
            f.angle += dt * (f.landed ? 0.05 : 0.4) * f.speed;
            if (f.y > 1.05)
            {
                f.y = -0.05;
                f.x = random();
                f.landed = false;
            }
            if (f.x < -0.05) f.x = 1.05;
            if (!f.landed && Math.sin(state.time * 0.12 + f.phase) > 0.99)
            {
                f.landed = true;
                if (i < 38) ripples.ring(f.x * state.w, f.y * state.h, 0, true, 0.25);
            }
        }
        for (const d of dragonflies)
        {
            if (state.time > d.next)
            {
                d.next = state.time + 1.2 + random() * 5;
                d.tx = 0.2 + random() * 0.6;
                d.ty = 0.3 + random() * 0.5;
            }
            d.x += (d.tx - d.x) * Math.min(1, dt * 5);
            d.y += (d.ty - d.y) * Math.min(1, dt * 5);
        }
    }
    return {
        particles, update,
        draw(c)
        {
            const mix = state.seasonMix;
            const tier = tiers[state.tier];
            const u = state.u;
            c.save();
            for (let season = 0; season < 4; season++)
            {
                if (mix[season] < 0.005 || season === 1) continue;
                const max = season === 3 ? Math.min(350, Math.round(tier.snow * (1 + state.rain * 1.5))) : Math.round((season === 0 ? 70 : 38) * tier.particles);
                const count = state.reduced ? Math.round(max * 0.6) : max;
                for (let i = 0; i < count; i++)
                {
                    const f = particles[i];
                    const x = f.x * state.w;
                    const y = f.y * state.h;
                    c.save();
                    c.translate(x, y);
                    c.rotate(f.angle + (state.reduced || f.landed ? 0 : Math.sin(state.time * 3.14 + f.phase) * 0.49));
                    const size = f.size * u;
                    c.globalAlpha = mix[season] * (f.landed || state.reduced ? 0.70 : 0.90);
                    if (season === 3)
                    {
                        c.fillStyle = p.cream;
                        c.beginPath();
                        c.arc(0, 0, (1.5 + f.speed) * u, 0, 6.28);
                        c.fill();
                    }
                    else if (season === 0)
                    {
                        c.fillStyle = p.blush;
                        c.beginPath();
                        c.moveTo(-size, 0);
                        c.bezierCurveTo(-size * 0.5, -size, size * 0.8, -size * 0.5, size, 0);
                        c.bezierCurveTo(size * 0.8, size * 0.5, -size * 0.5, size, -size, 0);
                        c.fill();
                        c.fillStyle = p.cream;
                        c.globalAlpha *= 0.6;
                        c.beginPath();
                        c.ellipse(size * 0.2, 0, size * 0.6, size * 0.36, 0, 0, 6.28);
                        c.fill();
                    }
                    else
                    {
                        c.fillStyle = i % 3 ? p.gold : p.amber;
                        c.beginPath();
                        c.moveTo(0, size * 0.6);
                        c.lineTo(-size * 0.7, -size * 0.4);
                        c.quadraticCurveTo(-size * 0.4, -size, 0, -size * 0.6);
                        c.quadraticCurveTo(size * 0.4, -size, size * 0.8, -size * 0.4);
                        c.closePath();
                        c.fill();
                        c.strokeStyle = p.amber;
                        c.lineWidth = 0.6 * u;
                        c.beginPath();
                        c.moveTo(0, size);
                        c.lineTo(0, -size * 0.5);
                        c.stroke();
                    }
                    c.restore();
                }
            }
            if (mix[1] > 0.005)
            {
                for (let i = 0; i < (state.tier === "low" || state.reduced ? 1 : 2); i++)
                {
                    const d = dragonflies[i];
                    const x = state.reduced ? state.w * 0.7 : d.x * state.w;
                    const y = state.reduced ? state.h * 0.56 : d.y * state.h;
                    c.save();
                    c.translate(x, y);
                    c.rotate(d.phase);
                    c.globalAlpha = mix[1] * 0.45;
                    c.fillStyle = p.cream;
                    for (const side of [-1, 1])
                    {
                        c.beginPath();
                        c.ellipse(6 * u * side, 0, 10 * u, 2.5 * u, side * 0.25, 0, 6.28);
                        c.ellipse(6 * u * side, 5 * u, 9 * u, 2.5 * u, side * -0.3, 0, 6.28);
                        c.fill();
                    }
                    c.globalAlpha = mix[1];
                    c.fillStyle = p.gold;
                    c.fillRect(-u, -6 * u, 2 * u, 23 * u);
                    c.restore();
                }
            }
            c.restore();
        }
    };
}
