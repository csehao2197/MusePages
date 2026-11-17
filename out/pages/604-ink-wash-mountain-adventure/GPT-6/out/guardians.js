import { CONTENT } from "./content.js";

export function makeGuardians()
{
    return CONTENT.guardians.map((g) => ({ ...g, maxHealth: g.health, resolved: false, phase: "waiting", phaseTime: 0, hit: 0 }));
}
