import { ROUND_SECONDS, storageKey, depot, jobs, content } from "./content.js";

export function createMissions()
{
    let best = 0;
    try
    {
        best = Math.max(0, Number(localStorage.getItem(storageKey)) || 0);
    }
    catch
    {
        // Private browsing may disable storage; the round is still fully playable.
    }
    const state = { phase: "ready", remaining: ROUND_SECONDS, score: 0, best, cargo: 0, delivered: 0, bonus: 0, message: content.readyStatus };
    function start()
    {
        Object.assign(state, { phase: "playing", remaining: ROUND_SECONDS, score: 0, cargo: 0, delivered: 0, bonus: 0, message: content.pickupHint });
    }
    function target()
    {
        return state.cargo > 0 ? jobs[state.delivered] : depot;
    }
    function saveBest()
    {
        state.best = Math.max(state.best, state.score);
        try
        {
            localStorage.setItem(storageKey, String(state.best));
        }
        catch
        {
            // A score is never required to persist for the game to continue.
        }
    }
    function tick(seconds)
    {
        if (state.phase !== "playing") return;
        state.remaining = Math.max(0, state.remaining - seconds);
        if (!state.remaining)
        {
            state.phase = "timeout";
            saveBest();
        }
    }
    function interact(van)
    {
        if (state.phase !== "playing") return false;
        const point = target();
        if (!point) return false;
        if (Math.hypot(van.x - point.x, van.z - point.z) > 6)
        {
            state.message = content.tooFar;
            return false;
        }
        if (Math.abs(van.speed) > 5)
        {
            state.message = content.slowNote;
            return false;
        }
        if (!state.cargo)
        {
            state.cargo = jobs.length;
            state.message = content.loaded;
            return true;
        }
        state.message = content.delivered(point.name);
        state.cargo--;
        state.delivered++;
        state.score += 100;
        if (state.delivered === jobs.length)
        {
            state.bonus = Math.floor(state.remaining) * 2;
            state.score += state.bonus;
            state.phase = "won";
            saveBest();
        }
        return true;
    }
    return { state, start, target, tick, interact };
}
