import { CONTENT, trailX } from "./content.js";

export function strike(state)
{
    const p = state.player;
    if (p.cooldown > 0 || p.dodge > 0 || state.mode !== "playing") return;
    if (p.breath < 12)
    {
        state.notice(CONTENT.feedback.breath);
        return;
    }
    p.breath -= 12;
    state.strikes++;
    p.cooldown = .31;
    p.swing = .25;
    const guardian = state.guardians.find((g) => !g.resolved);
    if (!guardian || Math.hypot(p.x - trailX(guardian.z), p.z - guardian.z) > 3.65)
    {
        p.combo = 0;
        state.notice(CONTENT.feedback.range);
        return;
    }
    p.combo = p.comboWindow > 0 ? p.combo % 3 + 1 : 1;
    p.comboWindow = .95;
    p.facing = Math.atan2(trailX(guardian.z) - p.x, guardian.z - p.z);
    guardian.health = Math.max(0, guardian.health - (p.combo === 3 ? 2 : 1));
    guardian.hit = .25;
    state.hits++;
    state.sound("strike");
    state.notice(p.combo === 3 ? CONTENT.feedback.combo : `${["", "First", "Second"][p.combo]} stroke`);
    if (guardian.health === 0)
    {
        guardian.resolved = true;
        state.resolved++;
        p.hp = 3;
        p.breath = 100;
        state.notice(CONTENT.feedback.resolved);
        state.sound("resolve");
    }
}

export function dodge(state, dx, dz)
{
    const p = state.player;
    if (p.dodge > 0 || p.cooldown > 0 || state.mode !== "playing") return;
    if (p.breath < 24)
    {
        state.notice(CONTENT.feedback.breath);
        return;
    }
    p.breath -= 24;
    p.dodge = .5;
    p.invulnerable = .58;
    p.dodgeX = dx || dz ? dx : .8;
    p.dodgeZ = dx || dz ? dz : .25;
    const length = Math.hypot(p.dodgeX, p.dodgeZ);
    p.dodgeX /= length;
    p.dodgeZ /= length;
    state.dodges++;
    state.sound("dodge");
}

export function updateCombat(state, dt)
{
    const p = state.player;
    for (const key of ["cooldown", "dodge", "invulnerable", "comboWindow", "swing"])
    {
        p[key] = Math.max(0, p[key] - dt);
    }
    p.breath = Math.min(100, p.breath + dt * (p.cooldown > 0 || p.dodge > 0 ? 2 : 20));
    for (const g of state.guardians)
    {
        g.hit = Math.max(0, g.hit - dt);
        if (g.resolved) continue;
        const distance = Math.hypot(p.x - trailX(g.z), p.z - (g.z + 1));
        if (distance > 7 && g.phase === "waiting") continue;
        g.phaseTime += dt;
        if (g.phase === "waiting" && g.phaseTime >= g.rest)
        {
            g.phase = "telegraph";
            g.phaseTime = 0;
        }
        else if (g.phase === "telegraph" && g.phaseTime >= g.windup)
        {
            g.phase = "sweep";
            g.phaseTime = 0;
            if (distance < 4.7)
            {
                if (p.invulnerable > 0)
                {
                    state.notice(CONTENT.feedback.dodge);
                    state.cleanDodges++;
                }
                else
                {
                    p.hp--;
                    p.invulnerable = 1.3;
                    p.combo = 0;
                    state.notice(CONTENT.feedback.hit);
                    state.sound("hurt");
                    if (p.hp <= 0)
                    {
                        state.mode = "fallen";
                        return;
                    }
                }
            }
        }
        else if (g.phase === "sweep" && g.phaseTime >= .2)
        {
            g.phase = "recovery";
            g.phaseTime = 0;
        }
        else if (g.phase === "recovery" && g.phaseTime >= g.rest)
        {
            g.phase = "waiting";
            g.phaseTime = 0;
        }
    }
}
