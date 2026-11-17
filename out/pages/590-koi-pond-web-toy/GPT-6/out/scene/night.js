import { palette as p } from "./palette.js";
import { tiers } from "../quality.js";

export function createNight(state, random, flora)
{
    const flies = Array.from({ length: 26 }, () => ({ x: random(), y: random(), phase: random() * 6.28, period: 2.8 + random() * 1.7 }));
    return {
        draw(c)
        {
            if (state.night < 0.001 && state.rain < 0.001) return;
            const u = state.u;
            c.save();
            c.fillStyle = "#0A2230";
            c.globalAlpha = state.night * 0.46;
            c.fillRect(0, 0, state.w, state.h);
            c.fillStyle = p.deep;
            c.globalAlpha = state.rain * 0.08;
            c.fillRect(0, 0, state.w, state.h);
            c.globalCompositeOperation = "lighter";
            const amount = Math.max(0, (state.night - 0.18) / 0.82);
            for (const l of flora.lanterns)
            {
                c.globalAlpha = amount * 0.55;
                const glow = c.createRadialGradient(l.x, l.y, 0, l.x, l.y, 70 * u);
                glow.addColorStop(0, "#E0B04A88");
                glow.addColorStop(1, "#E0B04A00");
                c.fillStyle = glow;
                c.fillRect(l.x - 70 * u, l.y - 70 * u, 140 * u, 140 * u);
                c.fillStyle = p.gold;
                c.beginPath();
                c.ellipse(l.x, l.y, 12 * u, 15 * u, 0, 0, 6.28);
                c.fill();
                for (let i = 0; i < tiers[state.tier].slices; i++)
                {
                    c.globalAlpha = amount * 0.19 * (1 - i / 8);
                    const wobble = state.reduced ? 0 : Math.sin(state.time * (0.4 + i * 0.08) * 6.28) * 6 * u;
                    c.fillRect(l.x - (12 - i) * u + wobble, l.y + (26 + i * 19) * u, (24 - i * 2) * u, (7 - i * 0.5) * u);
                }
            }
            const seasonCount = (1 - state.seasonMix[3]) * (0.5 + state.seasonMix[1] * 0.5);
            for (let i = 0; i < Math.round(tiers[state.tier].fireflies * seasonCount); i++)
            {
                const f = flies[i];
                const time = state.reduced ? 0 : state.time;
                const x = f.x * state.w + Math.sin(time * 0.12 + f.phase) * 45 * u;
                const y = f.y * state.h + Math.cos(time * 0.18 + f.phase) * 30 * u;
                const pulse = Math.max(0, Math.sin(state.time * 6.28 / (state.reduced ? 6 : f.period) + f.phase));
                c.globalAlpha = amount * pulse * 0.8;
                const glow = c.createRadialGradient(x, y, 0, x, y, 10 * u);
                glow.addColorStop(0, "#E0B04A88");
                glow.addColorStop(1, "#E0B04A00");
                c.fillStyle = glow;
                c.fillRect(x - 10 * u, y - 10 * u, 20 * u, 20 * u);
                c.fillStyle = p.gold;
                c.beginPath();
                c.arc(x, y, 1.6 * u, 0, 6.28);
                c.fill();
            }
            c.restore();
        }
    };
}
