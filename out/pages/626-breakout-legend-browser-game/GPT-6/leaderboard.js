const KEY = "breakout-legend-local-v1";

export function formatTime(seconds)
{
    const value = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function readEntries(storage = localStorage)
{
    const entries = JSON.parse(storage.getItem(KEY) || "[]");
    if (!Array.isArray(entries)) throw Error("Local leaderboard data is invalid.");
    return entries.filter((entry) => typeof entry.name === "string" && entry.name.length > 0 &&
        entry.name.length <= 20 && Number.isInteger(entry.time) && entry.time > 0)
        .sort((a, b) => a.time - b.time).slice(0, 50);
}

export function submitEntry(name, time, storage = localStorage)
{
    name = String(name).replace(/<[^>]*>/g, "").trim();
    if (!name || name.length > 20) throw Error("Name must be 1–20 characters.");
    if (!Number.isInteger(time) || time <= 0) throw Error("Time must be a positive number of seconds.");
    const entry = { name, time, id: crypto.randomUUID() };
    const entries = [...readEntries(storage), entry].sort((a, b) => a.time - b.time).slice(0, 50);
    storage.setItem(KEY, JSON.stringify(entries));
    return { entry, rank: entries.findIndex((item) => item.id === entry.id) + 1 };
}
