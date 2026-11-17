import { content } from "./content.js";

export const solids =
[
    { x: -2.8, z: 17.6, radius: 2.4 },
    { x: -20, z: -12, radius: 3 },
    { x: 18, z: -16, radius: 4 },
    { x: 14, z: -21, radius: 3 }
];
export function heightAt(x, z)
{
    return .55 + Math.max(0, 1 - Math.hypot((x + 9) / 10, (z + 14) / 10)) * 1.6;
}
export function walkable(x, z, open)
{
    if ((x / 26) ** 2 + ((z + 1) / 29) ** 2 > .88) return false;
    if (x > 6.5 && x < 10 && z > 10 && z < 22) return false;
    if (x > 6.5 && x < 10 && z > -2 && z < 4.8) return false;
    if (!open && z < -20.5 && x > -3.4 && x < 5.4) return false;
    return !solids.some(s => Math.hypot(x - s.x, z - s.z) < s.radius);
}
export function routeTo(id, position)
{
    const target = content.shrines.find(s => s.id === id);
    const route = [];
    if (position.x > 10) route.push({ x: 12, z: 7 }, { x: 4, z: 7 });
    route.push({ x: 0, z: 7 });
    if (id === "river") route.push({ x: 12, z: 7 }, { x: 16, z: 7 });
    else if (id === "mountain") route.push({ x: -5, z: -4 }, { x: -9, z: -11.5 });
    else if (id === "wind") route.push({ x: -13.6, z: 3 });
    else if (id === "temple") route.push({ x: 1, z: -10 }, { x: 1, z: -19 }, { x: 1, z: -23 });
    else if (target) route.push({ x: target.x, z: target.z });
    return route;
}
export function seededRandom()
{
    let seed = [...`${content.brand}:${content.island}`].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 1);
    return () =>
    {
        seed = (1664525 * seed + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}
export function distance(a, b)
{
    return Math.hypot(a.x - b.x, a.z - b.z);
}
