import { at, project, obstacles } from "./track.js";
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const angle = (x) => Math.atan2(Math.sin(x), Math.cos(x));

export function newPlayer()
{
    const f = at(20);
    return {
        x: f.p.x, z: f.p.z, yaw: f.yaw, s: 20, lateral: 0, hit: 5,
        speed: 0, steer: 0, slip: 0, meter: 0, boost: 0, travel: 0,
        offTime: 0, wrongTime: 0, cooldown: 0, resetTime: 0,
        completed: 0, gate: 0, reached40: false, finish: null, drifting: false
    };
}
export function resetPlayer(p)
{
    const f = at(p.gate);
    Object.assign(p, {
        x: f.p.x, z: f.p.z, yaw: f.yaw, s: p.gate, lateral: 0,
        hit: Math.round(p.gate / 4) % 250, speed: 16, slip: 0,
        offTime: 0, wrongTime: 0, cooldown: .8, resetTime: .8
    });
}
export function drive(p, input, dt)
{
    const previousS = p.s;
    const off = Math.abs(p.lateral) > 8;
    const targetSteer = clamp(input.steer, -1, 1);
    p.steer += clamp(targetSteer - p.steer, -3.5 * dt, 3.5 * dt);
    p.boost = Math.max(0, p.boost - dt);
    p.cooldown = Math.max(0, p.cooldown - dt);
    p.resetTime = Math.max(0, p.resetTime - dt);
    if (p.meter >= 1 && (input.boost || (p.drifting && !input.drift)))
    {
        p.boost = 1.2;
        p.meter = 0;
        input.onBoost?.();
    }
    if (input.gas) p.speed += 16 * (off ? .45 : 1) * dt;
    else if (!input.brake) p.speed -= Math.sign(p.speed) * Math.min(Math.abs(p.speed), 3 * dt);
    if (input.brake) p.speed -= 28 * dt;
    p.speed = clamp(p.speed, -6, off ? 26 : p.boost > 0 ? 54 : 42);
    p.drifting = Boolean(input.gas && p.speed > 18 && (input.drift || input.brake && Math.abs(p.steer) > .4) && !p.boost);
    p.slip += ((p.drifting ? p.steer * 16 * Math.PI / 180 : 0) - p.slip) * Math.min(1, dt * 5);
    if (p.meter < 1) p.meter = clamp(p.meter + (p.drifting ? .4 : -.15) * dt, 0, 1);
    const rate = 1.6 - 1.1 * Math.min(Math.abs(p.speed) / 42, 1);
    p.yaw += p.steer * rate * dt * Math.min(Math.abs(p.speed) / 5, 1) * (p.speed < 0 ? -1 : 1);
    p.x += Math.cos(p.yaw + p.slip) * p.speed * dt;
    p.z += Math.sin(p.yaw + p.slip) * p.speed * dt;
    p.travel += p.speed * dt;
    const f = project(p.x, p.z, p.hit);
    Object.assign(p, { s: f.s, lateral: f.lateral, hit: f.hit });
    p.offTime = Math.abs(p.lateral) > 8 ? p.offTime + dt : 0;
    p.wrongTime = Math.abs(angle(p.yaw - f.yaw)) > Math.PI / 2 ? p.wrongTime + dt : 0;
    if (p.offTime >= 1.2 || Math.abs(p.lateral) > 20 || input.reset)
    {
        resetPlayer(p);
        input.reset = false;
        return { reset: true, delta: 0 };
    }
    if (!p.cooldown)
    {
        for (const o of obstacles)
        {
            let ds = Math.abs(p.s - o.s);
            ds = Math.min(ds, 1000 - ds);
            if (ds < 1.8 && Math.abs(p.lateral - o.lateral) < 1.4)
            {
                p.speed = Math.max(7, p.speed * .72);
                const shove = p.lateral > o.lateral ? 1.2 : -1.2;
                p.x += f.r.x * shove;
                p.z += f.r.z * shove;
                p.cooldown = .45;
                break;
            }
        }
    }
    let delta = p.s - previousS;
    if (delta < -500) delta += 1000;
    if (delta > 500) delta -= 1000;
    return { previousS, delta, reset: false };
}
