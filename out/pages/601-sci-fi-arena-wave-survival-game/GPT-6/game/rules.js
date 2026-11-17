export const rules = Object.freeze(
{
    health: 100,
    shield: 100,
    boltDamage: 18,
    invulnerability: 0.35,
    moveSpeed: 4.6,
    radius: 0.36,
    eye: 1.65,
    magazine: 12,
    reload: 0.95,
    shotInterval: 0.125,
    dryInterval: 0.18,
    hitDamage: 34,
    droneHealth: 100,
    boltSpeed: 9,
    boltLife: 3.2,
    spawnInterval: 0.45,
    breather: 4.5,
    restore: 40,
    cellRespawn: 14,
    waveSize: (wave) => 3 + (wave - 1) * 2,
    droneSpeed: (wave) => Math.min(4.2, 2.2 + (wave - 1) * 0.18),
    droneInterval: (wave) => Math.max(0.95, 1.7 - (wave - 1) * 0.06)
});
export const compact = () => innerWidth < 768 || matchMedia("(pointer: coarse)").matches;
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
