import { C } from "./content.mjs";
import { initial, tick, clamp } from "./simulation.mjs";

const finite = (value) => typeof value === "number" && Number.isFinite(value);
export function migrate(raw)
{
    return raw;
}
export function validateSave(value)
{
    const data = migrate(value);
    if (!data || data.version !== 1 || !C.meters.every((m) => finite(data[m.key])) ||
        !finite(data.coins) || !finite(data.lastTickAt) || !finite(data.lastSavedAt) ||
        !Array.isArray(data.owned) || data.owned.some((id) => !C.items.some((i) => i.id === id)) ||
        !data.owned.includes("leaf") || !(data.equipped === null || data.owned.includes(data.equipped)) ||
        !data.scores || !["catch", "bubble"].every((key) => data.scores[key] === null || (finite(data.scores[key]) && data.scores[key] >= 0)) ||
        !data.settings || data.settings.sound !== false || !Array.isArray(data.activity) ||
        data.activity.some((entry) => typeof entry !== "string" || entry.length > 300)) throw Error("Invalid save");
    const clean = initial();
    for (const m of C.meters) clean[m.key] = clamp(data[m.key]);
    clean.coins = Math.floor(clamp(data.coins, 1000000000));
    clean.owned = [...new Set(data.owned)];
    clean.equipped = data.equipped;
    clean.scores = Object.fromEntries(Object.entries(data.scores).filter(([k]) => ["catch", "bubble"].includes(k)).map(([k, v]) => [k, v === null ? null : Math.floor(clamp(v, 1000000))]));
    clean.activity = data.activity.slice(0, 4);
    clean.lastTickAt = Math.max(0, data.lastTickAt);
    clean.lastSavedAt = Math.max(0, data.lastSavedAt);
    return clean;
}
export function load(storage = localStorage, now = Date.now())
{
    try
    {
        const raw = storage.getItem(C.key);
        if (!raw) return { state: initial(now) };
        let before;
        try { before = validateSave(JSON.parse(raw)); }
        catch { return { state: initial(now), notice: C.text.corrupt }; }
        const after = tick(before, now);
        const changed = C.meters.some((m) => Math.round(before[m.key]) !== Math.round(after[m.key]));
        return { state: after, notice: changed ? C.text.away : "" };
    }
    catch { return { state: initial(now), notice: C.text.storage, unavailable: true }; }
}
export function save(state, storage = localStorage)
{
    try
    {
        state.lastSavedAt = Date.now();
        storage.setItem(C.key, JSON.stringify(state));
        return true;
    }
    catch { return false; }
}
