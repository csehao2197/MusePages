import { C } from "./content.mjs";

export const clamp = (number, max = 100) => Math.min(max, Math.max(0, number));
export function initial(now = Date.now())
{
    return {
        version: 1, hunger: 72, mood: 80, cleanliness: 68, energy: 86, coins: 30,
        owned: ["leaf"], equipped: "leaf", scores: { catch: null, bubble: null },
        settings: { sound: false }, activity: [...C.welcome], lastTickAt: now, lastSavedAt: now
    };
}
export function tick(state, now = Date.now())
{
    const minutes = Math.min(10080, Math.max(0, now - state.lastTickAt) / 60000);
    const next = { ...state, lastTickAt: now };
    for (const meter of C.meters) next[meter.key] = clamp(state[meter.key] - minutes * meter.decay);
    return next;
}
export function log(state, message)
{
    return { ...state, activity: [message, ...state.activity].slice(0, 4) };
}
export function care(state, action, now = Date.now())
{
    const next = tick(state, now);
    if (action === "play" && next.energy < 10) return { state: next, error: C.text.lowEnergy };
    C.meters.forEach((meter, index) => next[meter.key] = clamp(next[meter.key] + C.actions[action].changes[index]));
    return { state: log(next, C.actions[action].message) };
}
export function purchase(state, id)
{
    const item = C.items.find((entry) => entry.id === id);
    if (!item) return { state, error: C.text.unknownAccessory };
    if (!state.owned.includes(id) && state.coins < item.price) return { state, error: C.text.need(item.price - state.coins) };
    const owned = state.owned.includes(id);
    return { state: log({ ...state, coins: state.coins - (owned ? 0 : item.price), owned: [...new Set([...state.owned, id])], equipped: id }, owned ? C.text.equipped(item.name) : C.text.unlocked(item.name)), unlocked: !owned };
}
