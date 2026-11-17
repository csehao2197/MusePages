export const RULES = Object.freeze(
{
    size: 12, maxStock: 100, goal: 50, beds: 8, growth: 2, threshold: 35,
    stormStarts: [8, 18, 30, 44, 60, 78], stormLength: 4, laterStart: 96, laterStep: 18
});
export const STOCKS = ["oxygen", "power", "water", "morale"];
const rocks = new Set(["2,4", "8,3", "4,9", "9,7", "3,7", "7,8"]);
export function terrain(c, r)
{
    if (c < 0 || r < 0 || c >= 12 || r >= 12) return "void";
    const d2 = (c * 2 - 11) ** 2 + (r * 2 - 11) ** 2;
    return d2 > 128 ? "void" : d2 > 84 ? "rim" : rocks.has(`${c},${r}`) ? "boulder" : "floor";
}
export const cells = Array.from({ length: 144 }, (_, i) => ({ c: i % 12, r: Math.floor(i / 12) }))
    .filter(({ c, r }) => terrain(c, r) !== "void").sort((a, b) => a.c + a.r - b.c - b.r || a.c - b.c);
export function newGame()
{
    return { version: 1, sol: 1, population: 6, oxygen: 74, power: 46, water: 64, morale: 68,
        buildings: [{ c: 5, r: 6, kind: "habitat" }], wonDismissed: false };
}
export function storm(sol)
{
    return RULES.stormStarts.some((start) => sol >= start && sol < start + 4) ||
        (sol >= 96 && (sol - 96) % 18 < 4);
}
export function forecast(sol)
{
    let n = 1;
    while (storm(sol + n) === storm(sol)) n++;
    return { active: storm(sol), count: n };
}
export function neighbors(buildings, cell)
{
    return buildings.filter((b) => Math.abs(b.c - cell.c) + Math.abs(b.r - cell.r) === 1);
}
export function solarYield(buildings, cell, dusty)
{
    const shade = neighbors(buildings, cell).filter((b) => b.kind === "habitat" || b.kind === "greenhouse").length;
    return dusty ? Math.max(1, 5 - 2 * shade) : Math.max(2, 10 - 3 * shade);
}
export function housing(buildings)
{
    return buildings.filter((b) => b.kind === "habitat").length * RULES.beds;
}
export function applyAction(state, action)
{
    const buildings = state.buildings.map((b) => ({ ...b }));
    if (!action) return buildings;
    if (action.kind === "remove") return buildings.filter((b) => b.c !== action.c || b.r !== action.r);
    return [...buildings, { ...action }];
}
export function checkAction(state, action, pending)
{
    if (pending) return "oneChange";
    const t = terrain(action.c, action.r);
    if (t === "void" || t === "rim") return "wall";
    if (t === "boulder") return "boulder";
    const existing = state.buildings.find((b) => b.c === action.c && b.r === action.r);
    if (action.kind === "remove")
    {
        if (!existing) return "nothing";
        if (existing.kind === "habitat" && state.population > housing(state.buildings) - RULES.beds) return "beds";
    }
    else if (existing) return "occupied";
    return null;
}
export function tick(before, action = null)
{
    const buildings = applyAction(before, action);
    const count = (kind) => buildings.filter((b) => b.kind === kind).length;
    const habitats = count("habitat"), greens = count("greenhouse"), drills = count("drill");
    const dusty = storm(before.sol);
    const supply = buildings.filter((b) => b.kind === "solar").reduce((n, b) => n + solarYield(buildings, b, dusty), 0);
    const demand = habitats * 2 + greens * 4 + drills * 3;
    const powered = before.power + supply >= demand;
    const oxygenMade = buildings.filter((b) => b.kind === "greenhouse")
        .reduce((n, b) => n + (neighbors(buildings, b).some((v) => v.kind === "habitat") ? 16 : 8), 0);
    const drillPenalty = buildings.filter((b) => b.kind === "drill")
        .reduce((n, b) => n + 1 + 2 * neighbors(buildings, b).filter((v) => v.kind === "habitat").length, 0);
    const beds = housing(buildings);
    const delta =
    {
        oxygen: (powered ? oxygenMade : 0) - before.population,
        power: supply - (powered ? demand : habitats * 2),
        water: (powered ? drills * 20 - greens * 2 : 0) - habitats - before.population,
        morale: habitats + (powered ? greens * 2 - drillPenalty : -6) +
            (before.population <= beds - 8 ? 2 : 0) -
            (before.population === beds && beds > 0 ? 4 : 0) - (dusty ? 8 : 0)
    };
    const state = { ...before, buildings, sol: before.sol + 1 };
    for (const key of STOCKS) state[key] = Math.max(0, Math.min(100, before[key] + delta[key]));
    const failedStocks = STOCKS.filter((key) => state[key] === 0);
    const failed = failedStocks.length > 0;
    const growth = !failed && powered && STOCKS.every((key) => state[key] >= 35) ?
        Math.max(0, Math.min(2, beds - before.population, 50 - before.population)) : 0;
    state.population += growth;
    return { state, failed, failedStocks, powered, delta, supply, demand, growth, attemptedSol: before.sol,
        stormStart: dusty && !storm(before.sol - 1), stormEnd: dusty && !storm(before.sol + 1) };
}
