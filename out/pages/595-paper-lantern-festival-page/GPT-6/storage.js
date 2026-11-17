import { content } from "./content.js";

export const paperTones = ["cream", "honey", "apricot"];

export function loadWishes()
{
    try
    {
        const raw = localStorage.getItem(content.storageKey);
        if (raw === null) return { wishes: [], unavailable: false };
        const data = JSON.parse(raw);
        if (data?.version !== 1 || !Array.isArray(data.wishes)) return { wishes: [], unavailable: false };
        const ids = new Set();
        const ordinals = new Set();
        const wishes = data.wishes.filter((wish) =>
        {
            if (!wish || typeof wish.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(wish.id) ||
                ids.has(wish.id) || typeof wish.text !== "string" || wish.text !== wish.text.trim() ||
                wish.text.length < 3 || wish.text.length > 120 || !Number.isInteger(wish.ordinal) ||
                wish.ordinal < 1 || wish.ordinal > 24 || ordinals.has(wish.ordinal) ||
                !paperTones.includes(wish.paperTone)) return false;
            ids.add(wish.id);
            ordinals.add(wish.ordinal);
            return true;
        }).sort((a, b) => a.ordinal - b.ordinal).slice(0, 24).map((wish, index) =>
        ({
            id: wish.id,
            text: wish.text,
            ordinal: index + 1,
            paperTone: wish.paperTone
        }));
        return { wishes, unavailable: false };
    }
    catch (error)
    {
        return { wishes: [], unavailable: !(error instanceof SyntaxError) };
    }
}

export function saveWishes(wishes)
{
    try
    {
        localStorage.setItem(content.storageKey, JSON.stringify({ version: 1, wishes }));
        return true;
    }
    catch
    {
        return false;
    }
}
