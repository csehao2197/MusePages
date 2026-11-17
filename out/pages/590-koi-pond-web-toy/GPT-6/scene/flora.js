import { palette as p, smoothPath } from "./palette.js";

export function createFlora(state, random, ripples)
{
    const pads = Array.from({ length: 11 }, (_, i) =>
    ({
        r: 34 + random() * 32, angle: random() * 6.28, phase: random() * 6.28,
        period: 5 + random() * 4, dx: 0, dy: 0, scale: 1, index: i,
        ox: (random() - 0.5) * 145, oy: (random() - 0.5) * 100
    }));
    const stoneSpecs = Array.from({ length: 5 }, () =>
    ({
        r: 46 + random() * 24,
        points: Array.from({ length: 9 }, (_, i) => ({ a: i * 6.28 / 9, r: 0.83 + random() * 0.30 })),
        specks: Array.from({ length: 44 }, () => ({ x: (random() - 0.5) * 1.4, y: (random() - 0.5) * 1.4, r: 0.3 + random() * 1.2 }))
    }));
    const ice = Array.from({ length: 6 }, (_, index) =>
    ({
        nx: [0.20, 0.53, 0.81, 0.35, 0.73, 0.92][index],
        ny: [0.29, 0.39, 0.52, 0.76, 0.83, 0.22][index],
        phase: random() * 6.28,
        shape: Array.from({ length: 6 }, (_, i) => ({ a: i * Math.PI / 3, r: 72 + random() * 57 })),
        points: Array.from({ length: 6 }, () => ({ x: 0, y: 0 }))
    }));
    const cracks = Array.from({ length: 8 }, () => ({ active: false, age: 0, x: 0, y: 0, lines: Array.from({ length: 6 }, (_, i) => ({ a: i * Math.PI / 3 + random() * 0.3, r: 30 + random() * 40 })) }));
    const structures = document.createElement("canvas");
    const c = structures.getContext("2d");
    const lanterns = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    let stones = [];
    let crackIndex = 0;
    function resize()
    {
        structures.width = Math.round(state.w * state.ratio);
        structures.height = Math.round(state.h * state.ratio);
        c.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
        const w = state.w;
        const h = state.h;
        const u = state.u;
        const anchors = state.wide ? [[0.68, 0.62, 5], [0.24, 0.47, 4], [0.47, 0.22, 2]] : [[0.70, 0.56, 4], [0.26, 0.38, 3], [0.42, 0.74, 1]];
        let index = 0;
        for (const [x, y, count] of anchors)
        {
            for (let i = 0; i < count; i++)
            {
                const pad = pads[index++];
                pad.x = x * w + pad.ox * u;
                pad.y = y * h + pad.oy * u;
                if (state.wide && index > 9)
                {
                    pad.x = x * w + i * 44 * u;
                    pad.y = y * h + i * 25 * u;
                }
            }
        }
        const positions = state.wide ? [[-0.01, 0.62], [0.05, 0.75], [0.12, 0.86], [0.21, 0.95], [0.29, 1.04]] : [[-0.03, 0.63], [0.09, 0.71], [0.05, 0.81], [0.14, 0.86]];
        stones = positions.map(([x, y], i) =>
        {
            const s = stoneSpecs[i];
            return { x: x * w, y: y * h, r: s.r * u, points: s.points.map((q) => ({ x: x * w + Math.cos(q.a) * q.r * s.r * u, y: y * h + Math.sin(q.a) * q.r * s.r * u })) };
        });
        c.clearRect(0, 0, w, h);
        for (let i = 0; i < stones.length; i++)
        {
            const s = stones[i];
            c.save();
            c.translate(10 * u, 15 * u);
            c.fillStyle = "#082A3170";
            smoothPath(c, s.points);
            c.fill();
            c.restore();
            c.fillStyle = p.deep;
            smoothPath(c, s.points);
            c.fill();
            c.save();
            c.translate(0, -5 * u);
            c.fillStyle = p.stone;
            smoothPath(c, s.points);
            c.fill();
            c.clip();
            c.fillStyle = "#8FA39D50";
            c.beginPath();
            c.ellipse(s.x - s.r * 0.15, s.y - s.r * 0.22, s.r * 0.8, s.r * 0.5, -0.3, 0, 6.28);
            c.fill();
            c.fillStyle = p.stoneLight;
            for (const q of stoneSpecs[i].specks)
            {
                c.beginPath();
                c.ellipse(s.x + q.x * s.r, s.y + q.y * s.r, q.r * u, q.r * u * 0.6, 0.5, 0, 6.28);
                c.fill();
            }
            if (i === 1 || i === 3)
            {
                c.fillStyle = p.pad;
                c.beginPath();
                c.ellipse(s.x - s.r * 0.5, s.y + s.r * 0.3, s.r * 0.6, s.r * 0.3, -0.9, 0, 6.28);
                c.fill();
            }
            c.restore();
        }
        const ax = w * (state.wide ? 0.56 : 0.58);
        const by = h * (state.wide ? 0.38 : 0.15);
        const edgeAngle = Math.atan2(by, w - ax);
        const length = Math.hypot(w - ax, by);
        c.save();
        c.beginPath();
        c.moveTo(ax, 0);
        c.lineTo(w, by);
        c.lineTo(w, 0);
        c.closePath();
        c.save();
        c.translate(12 * u, 18 * u);
        c.fillStyle = "#082A3175";
        c.fill();
        c.restore();
        c.clip();
        c.translate(ax, 0);
        c.rotate(edgeAngle);
        c.fillStyle = p.wood;
        c.fillRect(-w, -h, w * 3, h * 2);
        for (let x = -44 * u; x < length + 44 * u; x += 44 * u)
        {
            c.fillStyle = Math.round(x / (44 * u)) % 2 ? "#805035" : p.wood;
            c.fillRect(x, -h, 42 * u, h * 2);
            c.strokeStyle = "#10262B44";
            c.lineWidth = 0.7 * u;
            for (let j = 0; j < 3; j++)
            {
                c.beginPath();
                c.moveTo(x + (8 + j * 12) * u, 20 * u);
                c.bezierCurveTo(x + (16 + j * 8) * u, -h * 0.2, x + (4 + j * 12) * u, -h * 0.4, x + (10 + j * 12) * u, -h);
                c.stroke();
            }
            c.fillStyle = "#10262B77";
            c.beginPath();
            c.arc(x + 21 * u, -20 * u, 1.4 * u, 0, 6.28);
            c.fill();
        }
        c.restore();
        c.strokeStyle = p.vermilion;
        c.lineWidth = 10 * u;
        c.beginPath();
        c.moveTo(ax, 0);
        c.lineTo(w, by);
        c.stroke();
        c.strokeStyle = "#F5EFE04D";
        c.lineWidth = 1.2 * u;
        c.beginPath();
        c.moveTo(ax, -3 * u);
        c.lineTo(w, by - 3 * u);
        c.stroke();
        for (let i = 0; i < 2; i++)
        {
            const t = [0.30, 0.72][i];
            const x = ax + (w - ax) * t;
            const y = by * t;
            c.fillStyle = p.deep;
            c.beginPath();
            c.ellipse(x + 4 * u, y + 9 * u, 14 * u, 13 * u, 0, 0, 6.28);
            c.fill();
            c.fillStyle = p.vermilion;
            c.beginPath();
            c.arc(x, y, 13 * u, 0, 6.28);
            c.fill();
            c.fillStyle = p.gold;
            c.beginPath();
            c.arc(x, y - 3 * u, 9.5 * u, 0, 6.28);
            c.fill();
            const lx = x - Math.sin(edgeAngle) * 20 * u;
            const ly = y + Math.cos(edgeAngle) * 20 * u;
            lanterns[i].x = lx;
            lanterns[i].y = ly;
            c.fillStyle = p.cream;
            c.beginPath();
            c.ellipse(lx, ly, 13 * u, 16 * u, 0, 0, 6.28);
            c.fill();
            c.strokeStyle = "#C98F3A66";
            c.lineWidth = 0.8 * u;
            for (const d of [-0.5, 0, 0.5])
            {
                c.beginPath();
                c.ellipse(lx, ly, (7 + d * 6) * u, 16 * u, 0, 0, 6.28);
                c.stroke();
            }
            c.fillStyle = p.vermilion;
            c.fillRect(lx - 5 * u, ly - 17 * u, 10 * u, 3 * u);
            c.fillRect(lx - 5 * u, ly + 14 * u, 10 * u, 3 * u);
        }
        layoutIce();
    }
    function layoutIce()
    {
        for (const plate of ice)
        {
            const dx = state.reduced ? 0 : Math.sin(state.time * 0.025 + plate.phase) * 8 * state.u;
            for (let i = 0; i < plate.points.length; i++)
            {
                const q = plate.shape[i];
                plate.points[i].x = plate.nx * state.w + Math.cos(q.a) * q.r * state.u + dx;
                plate.points[i].y = plate.ny * state.h + Math.sin(q.a) * q.r * state.u * 0.8;
            }
        }
    }
    function lotus(c, r, time)
    {
        c.save();
        c.rotate(Math.sin(time) * 0.03);
        for (let ring = 0; ring < 2; ring++)
        {
            for (let j = 0; j < 7; j++)
            {
                c.save();
                c.rotate(j * Math.PI * 2 / 7 + ring * 0.45);
                const length = r * (ring ? 0.42 : 0.64);
                c.fillStyle = p.blush;
                c.beginPath();
                c.moveTo(0, 0);
                c.bezierCurveTo(-length * 0.6, -length * 0.5, -length * 0.4, -length, 0, -length * 1.25);
                c.bezierCurveTo(length * 0.4, -length, length * 0.6, -length * 0.5, 0, 0);
                c.fill();
                c.scale(0.7, 0.8);
                c.fillStyle = p.cream;
                c.fill();
                c.restore();
            }
        }
        c.fillStyle = p.gold;
        c.beginPath();
        c.arc(0, 0, r * 0.13, 0, 6.28);
        c.fill();
        c.restore();
    }
    return {
        pads, ice, cracks, lanterns, resize,
        crack(x, y)
        {
            if (state.seasonMix[3] < 0.5) return false;
            for (const plate of ice)
            {
                let inside = false;
                const points = plate.points;
                for (let i = 0, j = points.length - 1; i < points.length; j = i++)
                {
                    if ((points[i].y > y) !== (points[j].y > y) && x < (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x) inside = !inside;
                }
                if (!inside) continue;
                Object.assign(cracks[crackIndex++ % 8], { active: true, x, y, age: 0 });
                ripples.ring(x, y, 0, false, 0.4);
                ripples.stats.cracks++;
                return true;
            }
            return false;
        },
        update(dt)
        {
            layoutIce();
            for (const crack of cracks)
            {
                if (crack.active && (crack.age += dt) > 6) crack.active = false;
            }
            for (const pad of pads)
            {
                let dx = 0;
                let dy = 0;
                for (const r of ripples.rings)
                {
                    if (!r.active || r.age < 0) continue;
                    const distance = Math.hypot(pad.x - r.x, pad.y - r.y) || 1;
                    if (Math.abs(distance - r.radius) < 18 * state.u)
                    {
                        dx += (pad.x - r.x) / distance * 4 * state.u * r.alpha;
                        dy += (pad.y - r.y) / distance * 4 * state.u * r.alpha;
                    }
                }
                const flow = ripples.flow(pad.x, pad.y);
                dx += flow.x * flow.weight * 6 * state.u;
                dy += flow.y * flow.weight * 6 * state.u;
                pad.dx += ((state.reduced ? 0 : dx) - pad.dx) * Math.min(1, dt * 10);
                pad.dy += ((state.reduced ? 0 : dy) - pad.dy) * Math.min(1, dt * 10);
            }
        },
        draw(c)
        {
            const u = state.u;
            const mix = state.seasonMix;
            const limit = state.wide ? 11 : 8;
            for (let i = 0; i < limit; i++)
            {
                const pad = pads[i];
                const visibility = mix[0] * (i % 5 < 3 ? 1 : 0) + mix[1] + mix[2] * (i % 5 < 4 ? 1 : 0) + mix[3] * (i % 3 === 0 ? 1 : 0);
                if (visibility < 0.005) continue;
                c.save();
                c.globalAlpha = visibility;
                const drift = state.reduced ? 0 : Math.sin(state.time * 6.28 / pad.period + pad.phase) * 3 * u;
                c.translate(pad.x + pad.dx + drift, pad.y + pad.dy + (state.reduced ? 0 : Math.cos(state.time * 0.7 + pad.phase) * 2 * u));
                c.rotate(pad.angle + (state.reduced ? 0 : Math.sin(state.time * 0.8 + pad.phase) * 0.035));
                const r = pad.r * u * (1 - mix[0] * 0.2);
                c.fillStyle = "#082A314D";
                c.beginPath();
                c.arc(8 * u, 11 * u, r, 0, 6.28);
                c.fill();
                c.fillStyle = p.pad;
                c.beginPath();
                c.moveTo(0, 0);
                c.arc(0, 0, r, 0.245, 6.038);
                c.closePath();
                c.fill();
                c.fillStyle = p.padLight;
                c.globalAlpha = visibility * (0.18 + mix[0] * 0.6);
                c.fill();
                c.globalAlpha = visibility * 0.25;
                c.strokeStyle = p.padLight;
                c.lineWidth = 0.9 * u;
                for (let j = 1; j <= 9; j++)
                {
                    const a = 0.25 + j / 10 * 5.79;
                    c.beginPath();
                    c.moveTo(0, 0);
                    c.quadraticCurveTo(Math.cos(a - 0.1) * r * 0.6, Math.sin(a - 0.1) * r * 0.6, Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95);
                    c.stroke();
                }
                c.globalAlpha = visibility * (0.12 + mix[2] * 0.28);
                c.strokeStyle = mix[3] > 0.5 ? p.cream : p.amber;
                c.lineWidth = mix[3] > 0.5 ? 2 * u : u;
                c.beginPath();
                c.arc(0, 0, r - u, 0.245, 6.038);
                c.stroke();
                if (i < 3 && mix[1] > 0.01)
                {
                    c.globalAlpha = mix[1];
                    c.rotate(-pad.angle);
                    lotus(c, r, state.time * 0.35 + pad.phase);
                }
                c.restore();
            }
            c.drawImage(structures, 0, 0, state.w, state.h);
            if (mix[3] > 0.005)
            {
                c.save();
                c.globalAlpha = mix[3] * 0.7;
                c.fillStyle = p.cream;
                for (const stone of stones)
                {
                    c.beginPath();
                    c.ellipse(stone.x - stone.r * 0.1, stone.y - stone.r * 0.3, stone.r * 0.7, stone.r * 0.3, -0.2, 0, 6.28);
                    c.fill();
                }
                for (const plate of ice)
                {
                    c.globalAlpha = mix[3] * 0.16;
                    c.fillStyle = p.ice;
                    c.beginPath();
                    c.moveTo(plate.points[0].x, plate.points[0].y);
                    for (let i = 1; i < 6; i++) c.lineTo(plate.points[i].x, plate.points[i].y);
                    c.closePath();
                    c.fill();
                    c.globalAlpha = mix[3] * 0.23;
                    c.lineWidth = u;
                    c.strokeStyle = p.cream;
                    c.stroke();
                    c.beginPath();
                    c.moveTo(plate.points[0].x, plate.points[0].y);
                    c.lineTo(plate.nx * state.w, plate.ny * state.h);
                    c.lineTo(plate.points[3].x, plate.points[3].y);
                    c.stroke();
                }
                for (const crack of cracks)
                {
                    if (!crack.active) continue;
                    c.globalAlpha = Math.min(1, (6 - crack.age) / 2) * mix[3] * 0.7;
                    c.strokeStyle = p.cream;
                    c.lineWidth = 0.7 * u;
                    const growth = Math.min(1, crack.age / 0.18);
                    for (const line of crack.lines)
                    {
                        const dx = Math.cos(line.a) * line.r * u * growth;
                        const dy = Math.sin(line.a) * line.r * u * growth;
                        c.beginPath();
                        c.moveTo(crack.x, crack.y);
                        c.lineTo(crack.x + dx * 0.5 + 2 * u, crack.y + dy * 0.5);
                        c.lineTo(crack.x + dx, crack.y + dy);
                        c.stroke();
                    }
                }
                c.restore();
            }
        }
    };
}
