export const tiers = Object.freeze(
{
    high: { fish: 1, particles: 1, rings: 24, fireflies: 26, rain: 14, pellets: 60, snow: 140, slices: 7, points: 12, dpr: 2, water: 1.5 },
    mid: { fish: 0.8, particles: 0.7, rings: 16, fireflies: 18, rain: 10, pellets: 60, snow: 98, slices: 5, points: 12, dpr: 1.5, water: 1.125 },
    low: { fish: 0.6, particles: 0.45, rings: 12, fireflies: 12, rain: 7, pellets: 36, snow: 60, slices: 5, points: 9, dpr: 2, water: 1 }
});

export function initialTier()
{
    if (matchMedia("(pointer: coarse)").matches || Math.min(innerWidth, innerHeight) < 600) return "low";
    if ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4) return "mid";
    return "high";
}

export function createGovernor(state, change)
{
    const names = ["low", "mid", "high"];
    const ceiling = names.indexOf(state.tier);
    const frames = new Float32Array(90).fill(16.67);
    let cursor = 0;
    let slow = 0;
    let fast = 0;
    let total = 1500;
    return (ms) =>
    {
        total -= frames[cursor];
        frames[cursor] = Math.min(ms, 200);
        total += frames[cursor];
        cursor = (cursor + 1) % 90;
        const average = total / 90;
        state.fps = Math.min(120, 1000 / average);
        slow = average > 22 ? slow + ms : 0;
        fast = average < 12 ? fast + ms : 0;
        const level = names.indexOf(state.tier);
        if (slow > 2000 && level > 0)
        {
            state.tier = names[level - 1];
            slow = 0;
            change();
        }
        if (fast > 10000 && level < ceiling)
        {
            state.tier = names[level + 1];
            fast = 0;
            change();
        }
    };
}
