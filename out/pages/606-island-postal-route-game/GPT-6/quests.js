import { storageKey, content } from "./content.js";

export function createQuests()
{
    let saved = {};
    let storageAvailable = true;
    try
    {
        saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
    }
    catch
    {
        storageAvailable = false;
    }
    const state =
    {
        stamps: new Set(Array.isArray(saved.stamps) ? saved.stamps.filter(id => content.shrines.some(s => s.id === id)) : []),
        completed: saved.completed === true,
        sound: saved.sound === true,
        carrying: false,
        storageAvailable
    };
    if (state.completed && state.stamps.size !== 3) state.completed = false;
    function save()
    {
        try
        {
            localStorage.setItem(storageKey, JSON.stringify({ stamps: [...state.stamps], completed: state.completed, sound: state.sound }));
        }
        catch
        {
            state.storageAvailable = false;
        }
    }
    function reset()
    {
        state.stamps.clear();
        state.completed = false;
        state.carrying = false;
        save();
    }
    return { state, save, reset };
}
