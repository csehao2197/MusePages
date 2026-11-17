import { content } from "./content.js";

export function mulberry32(seed)
{
    return () =>
    {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

const geometry =
[
    { center: [260, 250], points: [[0,-72],[48,-4],[30,64],[-42,54],[-48,-10]], edges: [[0,1],[1,2],[2,3],[3,1],[0,4]] },
    { center: [810, 220], points: [[0,-115],[0,-48],[0,15],[0,105],[-105,-12],[-52,-25],[52,-15],[105,5]], edges: [[0,1],[1,2],[2,3],[4,5],[5,2],[2,6],[6,7]] },
    { center: [1320, 270], points: [[-110,40],[-55,-45],[0,30],[55,-50],[110,35]], edges: [[0,1],[1,2],[2,3],[3,4]] },
    { center: [390, 735], points: [[-65,-85],[65,-80],[0,-135],[-45,0],[0,5],[45,10],[-55,105],[65,100]], edges: [[2,0],[2,1],[0,3],[1,5],[3,4],[4,5],[3,6],[5,7],[6,7]] },
    { center: [930, 700], points: [[-125,-25],[-75,-65],[-15,-50],[15,5],[70,35],[130,5],[180,-50]], edges: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]] },
    { center: [1370, 710], points: [[-120,25],[-85,-35],[-35,-65],[15,-70],[60,-45],[95,0],[110,55]], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] }
];
const names = content.names.split(",").map((name) => name.trim());
if (names.length !== 6 || names.some((name) => !name))
{
    throw new Error("The atlas requires exactly six named patterns.");
}
export const patterns = geometry.map((record, index) => ({ ...record, ...content.stories[index], name: names[index], id: index, number: String(index + 1).padStart(2, "0") }));
const random = mulberry32(48271);
export const backgroundStars = Array.from({ length: 420 }, (_, index) =>
({
    x: random() * 1600,
    y: random() * 1000,
    radius: 0.55 + random() * 1.2,
    opacity: 0.18 + random() * 0.5,
    phase: random() * Math.PI * 2,
    bright: (index + 1) % 17 === 0
}));
const makerRandom = mulberry32(90217);
export const makerStars = [];
while (makerStars.length < 28)
{
    const star = { id: makerStars.length + 1, x: 260 + makerRandom() * 1080, y: 180 + makerRandom() * 640 };
    if (makerStars.every((other) => Math.hypot(star.x - other.x, star.y - other.y) >= 72))
    {
        makerStars.push(star);
    }
}

export function dayFromDate(value)
{
    const match = /^2026-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
    {
        return null;
    }
    const month = Number(match[1]);
    const day = Number(match[2]);
    const date = new Date(2026, month - 1, day, 12);
    if (date.getMonth() !== month - 1 || date.getDate() !== day)
    {
        return null;
    }
    return Math.round((date - new Date(2026, 0, 1, 12)) / 86400000);
}

export function dateFromDay(day)
{
    const date = new Date(2026, 0, 1 + day, 12);
    return `2026-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function displayDate(value)
{
    const [, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(2026, month - 1, day, 12));
}

export function restoreCreations(raw)
{
    try
    {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
        {
            return [];
        }
        return parsed.slice(0, 6).flatMap((record) =>
        {
            if (!record || typeof record.name !== "string" || !record.name.trim() || record.name.trim().length > 24 || !Array.isArray(record.ids))
            {
                return [];
            }
            const ids = [...new Set(record.ids.filter((id) => Number.isInteger(id) && makerStars.some((star) => star.id === id)))].slice(0, 8);
            return ids.length >= 3 ? [{ name: record.name.trim(), ids }] : [];
        });
    }
    catch
    {
        return [];
    }
}
