import { starters } from "./presets.js";

export const toHex = (grid) => Array.from(grid, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const fromHex = (hex) => Array.from({ length: 16 }, (_, index) => parseInt(hex.slice(index * 2, index * 2 + 2), 16));
export function parseHash(hash)
{
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const valid = params.get("v") === "1" && /^[0-9a-f]{32}$/i.test(params.get("g") || "");
    if (!valid)
    {
        return { grid: fromHex(starters[0].grid), voice: 1, bpm: 112, tone: 60, linked: false };
    }
    const numeric = (key, fallback, min, max) =>
    {
        const raw = params.get(key);
        const value = raw === null || raw.trim() === "" ? fallback : Number(raw);
        return Math.max(min, Math.min(max, Math.round(Number.isFinite(value) ? value : fallback)));
    };
    return { grid: fromHex(params.get("g")), voice: numeric("p", 1, 0, 2), bpm: numeric("b", 112, 60, 180), tone: numeric("n", 60, 0, 100), linked: true };
}
export function writeHash(state)
{
    const params = new URLSearchParams({ v: "1", p: String(state.voice), b: String(state.bpm), n: String(state.tone), g: toHex(state.grid) });
    history.replaceState(null, "", `#${params}`);
}
