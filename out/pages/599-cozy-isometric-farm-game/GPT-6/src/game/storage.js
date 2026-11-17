import { C } from "../content.js";
import { initial } from "./engine.js";

export function valid(s)
{
    const int = (v, min, max) => Number.isSafeInteger(v) && v >= min && v <= max;
    return s && s.version === C.version && int(s.day, 1, 1000000) && s.phase === "Morning" &&
        int(s.coins, 0, Number.MAX_SAFE_INTEGER) && int(s.tool, 0, 3) && int(s.seed, 0, 2) &&
        Array.isArray(s.inventory) && s.inventory.length === 3 && s.inventory.every((n) => int(n, 0, Number.MAX_SAFE_INTEGER)) &&
        Array.isArray(s.tiles) && s.tiles.length === 36 && s.tiles.every((t) =>
            t && typeof t.soil === "boolean" && typeof t.watered === "boolean" &&
            (t.crop === null || int(t.crop, 0, 2)) && int(t.progress, 0, t.crop === null ? 0 : C.crops[t.crop].days) &&
            (t.crop === null ? !t.watered : t.soil));
}

export function load()
{
    try
    {
        const raw = localStorage.getItem(C.key);
        if (!raw) return { state: initial(), fresh: false, available: true };
        const parsed = JSON.parse(raw);
        if (!valid(parsed)) throw Error("Invalid farm data");
        return { state: parsed, fresh: false, available: true };
    }
    catch
    {
        return { state: initial(), fresh: true, available: false };
    }
}

export function save(state)
{
    try
    {
        localStorage.setItem(C.key, JSON.stringify(state));
        return true;
    }
    catch
    {
        return false;
    }
}
