export const T =
{
    SPHERE: 148, WARN: 140, RELEASE: 136, CRUISE: 34, BOOST_SPEED: 70,
    BOOST_TIME: 0.75, BOOST_CD: 2.4, YAW_RATE: 1.35, PITCH_RATE: 1.05,
    PITCH_LIMIT: 1.05, ROLL_TIME: 0.6, SHIMMER: 0.4, ROLL_GAP: 0.45,
    BANK: 0.38, SHIELD_MAX: 100, PLAYER_BOLT_DAMAGE: 16,
    DRONE_BOLT_DAMAGE: 18, REGEN_DELAY: 1.6, REGEN_RATE: 12, HIT_INVULN: 0.35,
    BOLT_SPEED: 130, BOLT_INTERVAL: 0.13, BOLT_LIFE: 1.15, BOLT_CAP: 16,
    LOCK_MIN: 8, LOCK_MAX: 78, LOCK_CONE_DEG: 16, LOCK_TIME: 0.65,
    LOCK_CD: 0.4, MISSILE_SPEED: 92, MISSILE_TURN: 2.2, MISSILE_LIFE: 3.4,
    DRONE_SHIELD: 32, DRONE_TURN: 0.85, DRONE_FIRE_RANGE: 62,
    DRONE_FIRE_CONE_DEG: 12, DRONE_FIRE_CD: 1.7, DRONE_BOLT_SPEED: 78,
    SEPARATION: 7, BREATHER: 2.8, SPAWN_RADIUS: 96
};
export function mulberry32(seed)
{
    return function()
    {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}
