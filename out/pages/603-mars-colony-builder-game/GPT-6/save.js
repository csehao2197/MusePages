import { C } from "./content.js";
import { terrain, housing, STOCKS } from "./sim.js";
const slug = C.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const saveKey = `colony-save:${slug}`;
const soundKey = `colony-sound:${slug}`;
export function validSave(s)
{
    if (!s || s.version !== 1 || !Number.isInteger(s.sol) || s.sol < 1 || s.sol > 100000 ||
        !Number.isInteger(s.population) || s.population < 1 || s.population > 50 ||
        typeof s.wonDismissed !== "boolean" || !Array.isArray(s.buildings) || s.buildings.length > 62) return false;
    if (!STOCKS.every((k) => Number.isInteger(s[k]) && s[k] > 0 && s[k] <= 100)) return false;
    const occupied = new Set();
    for (const b of s.buildings)
    {
        if (!b || !Number.isInteger(b.c) || !Number.isInteger(b.r) || terrain(b.c, b.r) !== "floor" ||
            !["habitat", "solar", "greenhouse", "drill"].includes(b.kind) || occupied.has(`${b.c},${b.r}`)) return false;
        occupied.add(`${b.c},${b.r}`);
    }
    return housing(s.buildings) >= s.population;
}
export function load()
{
    try
    {
        const s = JSON.parse(localStorage.getItem(saveKey));
        if (!validSave(s)) return null;
        return { version: 1, sol: s.sol, population: s.population, oxygen: s.oxygen, power: s.power,
            water: s.water, morale: s.morale, buildings: s.buildings.map(({ c, r, kind }) => ({ c, r, kind })),
            wonDismissed: s.wonDismissed };
    }
    catch
    {
        return null;
    }
}
export function store(state)
{
    try
    {
        localStorage.setItem(saveKey, JSON.stringify(state));
        return true;
    }
    catch
    {
        return false;
    }
}
export function clearSave()
{
    try { localStorage.removeItem(saveKey); return true; }
    catch { return false; }
}
export function soundPreference(value)
{
    try
    {
        if (value !== undefined) localStorage.setItem(soundKey, JSON.stringify(value));
        return localStorage.getItem(soundKey) === "true";
    }
    catch { return false; }
}
