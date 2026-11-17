// @ts-nocheck
export const R = 27;
export const INERTIA = 0.5 * R * R;
export const BASE_STEP = 1 / 240;
const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

export function vertices(angle)
{
    return Array.from({ length: 6 }, (_, i) =>
    ({
        x: 500 + 420 * Math.cos(angle + i * Math.PI / 3),
        y: 500 + 420 * Math.sin(angle + i * Math.PI / 3)
    }));
}

export function edges(angle)
{
    const points = vertices(angle);
    return points.map((a, i) =>
    {
        const b = points[(i + 1) % 6];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const length = Math.hypot(dx, dy);
        return { x: a.x, y: a.y, nx: -dy / length, ny: dx / length };
    });
}

export function random(world)
{
    world.seed = (Math.imul(world.seed, 1664525) + 1013904223) >>> 0;
    return world.seed / 4294967296;
}

function disk(world, id, x, y)
{
    return { id, x, y, px: x, py: y, vx: (random(world) - 0.5) * 55,
        vy: (random(world) - 0.5) * 30, angle: 0, pa: 0, omega: (random(world) - 0.5) * 2 };
}

export function fits(world, x, y, gap = 2)
{
    return edges(world.angle).every(e => (x - e.x) * e.nx + (y - e.y) * e.ny >= R + gap) &&
        world.balls.every(b => Math.hypot(b.x - x, b.y - y) >= R * 2 + gap);
}

export function createWorld(reduced = false)
{
    const world = { seed: 137, balls: [], particles: [], cooldowns: new Map(), time: 0,
        angle: -Math.PI / 6, previousAngle: -Math.PI / 6, gravity: 1, friction: 0.18,
        spin: 30, count: 20, slow: false, reduced, pendingShake: [], maxMicrosteps: 0,
        maxTranslation: 0, invalidStates: 0, collisionCount: 0 };
    reset(world);
    return world;
}

export function reset(world)
{
    Object.assign(world, { seed: 137, balls: [], particles: [], cooldowns: new Map(), time: 0,
        angle: -Math.PI / 6, previousAngle: -Math.PI / 6, gravity: 1, friction: 0.18,
        spin: 30, count: 20, slow: false, pendingShake: [] });
    for (let id = 1; id <= 20; id++)
    {
        const row = Math.floor((id - 1) / 5);
        const col = (id - 1) % 5;
        for (let attempt = 0; attempt < 250; attempt++)
        {
            const x = 500 + (col - 2) * 61 + (row % 2) * 10 + (random(world) - 0.5) * 3;
            const y = 250 + row * 61 + (random(world) - 0.5) * 3;
            if (fits(world, x, y))
            {
                world.balls.push(disk(world, id, x, y));
                break;
            }
        }
    }
}

export function setCount(world, value)
{
    world.count = Math.round(clamp(value, 4, 40));
    world.balls = world.balls.filter(b => b.id <= world.count);
    world.pendingShake = world.pendingShake.filter(impulse => impulse.id <= world.count);
    spawn(world);
}

function spawn(world)
{
    let attempts = 0;
    while (world.balls.length < world.count && attempts++ < 250)
    {
        const x = 500 + (random(world) - 0.5) * 790;
        const y = 500 + (random(world) - 0.5) * 790;
        if (fits(world, x, y))
        {
            world.balls.push(disk(world, world.balls.length + 1, x, y));
        }
    }
}

export function cap(ball)
{
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > 1800)
    {
        ball.vx *= 1800 / speed;
        ball.vy *= 1800 / speed;
    }
    ball.omega = clamp(ball.omega, -24, 24);
}

export function queueShake(world)
{
    for (const b of world.balls)
    {
        world.pendingShake.push({ id: b.id, vx: random(world) * 1000 - 500,
            vy: -(350 + random(world) * 400), omega: random(world) * 16 - 8 });
    }
}

export function shake(world)
{
    if (!world.pendingShake.length) queueShake(world);
    for (const impulse of world.pendingShake)
    {
        const b = world.balls.find(ball => ball.id === impulse.id);
        if (!b) continue;
        b.vx += impulse.vx;
        b.vy += impulse.vy;
        b.omega += impulse.omega;
        cap(b);
    }
    world.pendingShake = [];
}

function confetti(world, key, speed, x, y)
{
    if (world.reduced || speed <= 170 || world.time - (world.cooldowns.get(key) ?? -1) < 0.1) return;
    world.cooldowns.set(key, world.time);
    for (let i = 0; i < 3 && world.particles.length < 120; i++)
    {
        const life = 0.18 + random(world) * 0.2;
        world.particles.push({ x, y, vx: (random(world) - 0.5) * 210,
            vy: -50 - random(world) * 150, life, total: life, color: Math.floor(random(world) * 5) });
    }
}

export function wallContact(world, b, e, index, h, projectOnly = false)
{
    const d = (b.x - e.x) * e.nx + (b.y - e.y) * e.ny;
    if (d > R + 0.03) return;
    const qx = b.x - d * e.nx;
    const qy = b.y - d * e.ny;
    if (d < R)
    {
        b.x += (R - d + 0.01) * e.nx;
        b.y += (R - d + 0.01) * e.ny;
    }
    if (projectOnly) return;
    const omega = world.spin * Math.PI / 180;
    const wx = -omega * (qy - 500);
    const wy = omega * (qx - 500);
    const rx = -R * e.nx;
    const ry = -R * e.ny;
    const tx = -e.ny;
    const ty = e.nx;
    let rvx = b.vx - b.omega * ry - wx;
    let rvy = b.vy + b.omega * rx - wy;
    const vn = rvx * e.nx + rvy * e.ny;
    let jn = 0;
    if (vn < 0)
    {
        jn = -(1 + (Math.abs(vn) >= 35 ? 0.76 : 0)) * vn;
        b.vx += jn * e.nx;
        b.vy += jn * e.ny;
        world.collisionCount++;
        confetti(world, `w${b.id}:${index}`, -vn, qx, qy);
    }
    rvx = b.vx - b.omega * ry - wx;
    rvy = b.vy + b.omega * rx - wy;
    const cross = rx * ty - ry * tx;
    const support = Math.max(Math.abs(jn), Math.max(0, -900 * world.gravity * e.ny) * h);
    const limit = world.friction * support;
    const jt = clamp(-(rvx * tx + rvy * ty) / (1 + cross * cross / INERTIA), -limit, limit);
    b.vx += jt * tx;
    b.vy += jt * ty;
    b.omega += cross * jt / INERTIA;
}

export function pairContact(world, a, b)
{
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);
    if (distance > R * 2 + 0.02) return;
    const seedAngle = (a.id * 31 + b.id * 17) % 360 * Math.PI / 180;
    const nx = distance > 1e-8 ? dx / distance : Math.cos(seedAngle);
    const ny = distance > 1e-8 ? dy / distance : Math.sin(seedAngle);
    const correction = Math.max(0, R * 2 - distance - 0.02) * 0.5;
    a.x -= correction * nx;
    a.y -= correction * ny;
    b.x += correction * nx;
    b.y += correction * ny;
    const tx = -ny;
    const ty = nx;
    let rvx = b.vx + b.omega * R * ny - a.vx + a.omega * R * ny;
    let rvy = b.vy - b.omega * R * nx - a.vy - a.omega * R * nx;
    const vn = rvx * nx + rvy * ny;
    if (vn >= 0) return;
    const jn = -(1 + (-vn >= 35 ? 0.8 : 0)) * vn / 2;
    a.vx -= jn * nx;
    a.vy -= jn * ny;
    b.vx += jn * nx;
    b.vy += jn * ny;
    rvx = b.vx + b.omega * R * ny - a.vx + a.omega * R * ny;
    rvy = b.vy - b.omega * R * nx - a.vy - a.omega * R * nx;
    const jt = clamp(-(rvx * tx + rvy * ty) / (2 + 2 * R * R / INERTIA),
        -world.friction * jn, world.friction * jn);
    a.vx -= jt * tx;
    a.vy -= jt * ty;
    b.vx += jt * tx;
    b.vy += jt * ty;
    a.omega -= R * jt / INERTIA;
    b.omega -= R * jt / INERTIA;
    world.collisionCount++;
    confetti(world, `p${a.id}:${b.id}`, -vn, (a.x + b.x) / 2, (a.y + b.y) / 2);
}

export function step(world, dt = BASE_STEP)
{
    world.previousAngle = world.angle;
    let maxSpeed = 0;
    for (const b of world.balls)
    {
        if (![b.x, b.y, b.vx, b.vy, b.angle, b.omega].every(Number.isFinite))
        {
            world.invalidStates++;
            b.x = Number.isFinite(b.px) ? b.px : 500;
            b.y = Number.isFinite(b.py) ? b.py : 500;
            b.vx = 0;
            b.vy = 0;
            b.angle = 0;
            b.omega = 0;
        }
        cap(b);
        b.px = b.x;
        b.py = b.y;
        b.pa = b.angle;
        maxSpeed = Math.max(maxSpeed, Math.hypot(b.vx, b.vy));
    }
    // Include possible collision acceleration up to the defensive speed cap.
    const travel = (Math.max(1800, maxSpeed) + Math.abs(world.spin) * Math.PI / 180 * 420 +
        900 * world.gravity * dt) * dt;
    const subdivisions = Math.min(16, Math.max(1, Math.ceil(travel / (0.35 * R))));
    world.maxMicrosteps = Math.max(world.maxMicrosteps, subdivisions);
    world.maxTranslation = Math.max(world.maxTranslation, travel / subdivisions);
    const h = dt / subdivisions;
    for (let micro = 0; micro < subdivisions; micro++)
    {
        world.time += h;
        world.angle += world.spin * Math.PI / 180 * h;
        const boundary = edges(world.angle);
        if (world.balls.length < world.count) spawn(world);
        for (const b of world.balls)
        {
            b.vy += 900 * world.gravity * h;
            b.vx *= Math.exp(-0.1 * h);
            b.vy *= Math.exp(-0.1 * h);
            b.omega *= Math.exp(-0.16 * h);
            cap(b);
            b.x += b.vx * h;
            b.y += b.vy * h;
            b.angle += b.omega * h;
        }
        for (let iteration = 0; iteration < 8; iteration++)
        {
            for (let i = 0; i < world.balls.length; i++)
            {
                const a = world.balls[i];
                for (let j = i + 1; j < world.balls.length; j++) pairContact(world, a, world.balls[j]);
                for (let k = 0; k < 6; k++) wallContact(world, a, boundary[k], k, h);
            }
        }
        for (const b of world.balls)
        {
            for (let pass = 0; pass < 6; pass++)
            {
                for (let k = 0; k < 6; k++) wallContact(world, b, boundary[k], k, h, true);
            }
            cap(b);
        }
        world.particles = world.particles.filter(p =>
        {
            p.life -= h;
            p.vy += 300 * h;
            p.x += p.vx * h;
            p.y += p.vy * h;
            return p.life > 0;
        });
    }
    if (world.angle > TAU * 100)
    {
        world.angle -= TAU * 100;
        world.previousAngle -= TAU * 100;
    }
    if (world.angle < -TAU * 100)
    {
        world.angle += TAU * 100;
        world.previousAngle += TAU * 100;
    }
}
