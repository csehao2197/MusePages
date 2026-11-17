import { C } from "../content.js";

export function initial()
{
    const tiles = Array.from({ length: 36 }, () => ({ soil: false, crop: null, progress: 0, watered: false }));
    for (const [r, c, crop, progress, watered] of C.initial.crops)
    {
        tiles[r * 6 + c] = { soil: true, crop, progress, watered };
    }
    tiles[C.initial.emptySoil].soil = true;
    return { version: C.version, day: C.initial.day, phase: "Morning", coins: C.initial.coins, inventory: [...C.initial.inventory], tool: C.initial.tool, seed: C.initial.seed, tiles };
}

export function transact(state, action)
{
    const s = structuredClone(state);
    const t = C.copy;
    let message = "";
    let effect = "";
    if (action.type === "tool")
    {
        if (![0, 1, 2, 3].includes(action.value)) return { state, message: "", ok: false };
        s.tool = action.value;
    }
    else if (action.type === "seed")
    {
        if (![0, 1, 2].includes(action.value) || !s.inventory[action.value]) return { state, message: t.noStock, ok: false };
        s.seed = action.value;
        s.tool = 1;
    }
    else if (action.type === "buy")
    {
        const crop = C.crops[action.value];
        if (!crop || s.coins < crop.buy) return { state, message: t.poor, ok: false };
        s.coins -= crop.buy;
        s.inventory[action.value]++;
        message = `${t.purchased} · −${crop.buy} ${C.currency}`;
        effect = "purchase";
    }
    else if (action.type === "day")
    {
        let grew = 0;
        for (const tile of s.tiles)
        {
            if (tile.crop !== null && tile.watered && tile.progress < C.crops[tile.crop].days)
            {
                tile.progress++;
                grew++;
            }
            tile.watered = false;
        }
        s.day++;
        s.phase = "Morning";
        message = `${t.day} ${s.day} ${t.begins} ${grew} ${t.grew}`;
    }
    else if (action.type === "tile")
    {
        const tile = s.tiles[action.value];
        if (!tile) return { state, message: "", ok: false };
        const fail = (message) => ({ state, message, ok: false });
        if (s.tool === 0)
        {
            if (tile.soil) return fail(t.onlyGrass);
            tile.soil = true;
            message = t.tilled;
            effect = "till";
        }
        if (s.tool === 1)
        {
            if (!tile.soil) return fail(t.tillFirst);
            if (tile.crop !== null) return fail(t.occupied);
            if (!s.inventory[s.seed]) return fail(t.noStock);
            s.inventory[s.seed]--;
            tile.crop = s.seed;
            tile.progress = 0;
            message = t.planted;
            effect = "plant";
        }
        if (s.tool === 2)
        {
            if (tile.crop === null) return fail(t.noCrop);
            if (tile.progress === C.crops[tile.crop].days) return fail(t.readyWater);
            if (tile.watered) return fail(t.watered);
            tile.watered = true;
            message = t.waterDone;
            effect = "water";
        }
        if (s.tool === 3)
        {
            if (tile.crop === null) return fail(t.noCrop);
            const crop = C.crops[tile.crop];
            if (tile.progress < crop.days) return fail(t.growing);
            s.coins += crop.sell;
            tile.crop = null;
            tile.progress = 0;
            tile.watered = false;
            message = `${t.harvest} ${crop.name} · +${crop.sell} ${C.currency}`;
            effect = "harvest";
        }
    }
    else return { state, message: "", ok: false };
    return { state: s, message, effect, ok: true };
}
