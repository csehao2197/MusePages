import { trailX } from "./content.js";

export function makePlayer(z = 2)
{
    return { x: trailX(z), z, hp: 3, breath: 100, combo: 0, comboWindow: 0, cooldown: 0, swing: 0, dodge: 0, invulnerable: 0, dodgeX: 0, dodgeZ: 0, facing: Math.PI, walking: false };
}

export function movePlayer(state, input, dt)
{
    const p = state.player;
    let dx = input.x;
    let dz = input.z;
    if (input.destination && !dx && !dz)
    {
        dx = input.destination.x - p.x;
        dz = input.destination.z - p.z;
        const distance = Math.hypot(dx, dz);
        if (distance < .2)
        {
            input.destination = null;
            dx = dz = 0;
        }
    }
    const length = Math.hypot(dx, dz);
    if (length)
    {
        dx /= length;
        dz /= length;
    }
    p.walking = length > 0;
    if (p.dodge > 0)
    {
        dx = p.dodgeX;
        dz = p.dodgeZ;
    }
    const speed = p.dodge > 0 ? 8.5 : 5.8;
    p.x += dx * speed * dt;
    p.z += dz * speed * dt;
    if (length && p.swing <= 0) p.facing = Math.atan2(dx, dz);
    p.z = Math.min(8, Math.max(-94, p.z));
    p.x = Math.max(trailX(p.z) - 3.7, Math.min(trailX(p.z) + 3.7, p.x));
    const guardian = state.guardians.find((g) => !g.resolved);
    if (guardian && p.z < guardian.z - 4.5)
    {
        p.z = guardian.z - 4.5;
        if (state.messageTime <= 0) state.notice("Learn this form to open the practice gate.");
    }
}
