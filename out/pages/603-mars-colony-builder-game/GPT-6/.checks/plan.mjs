import { newGame, tick, checkAction } from "../sim.js";
import fs from "node:fs/promises";

const spots =
{
    habitat: [[4, 5], [6, 5], [3, 5], [7, 5], [8, 5], [5, 4]],
    greenhouse: [[4, 6], [6, 6], [3, 6], [7, 6]],
    solar: [[4, 2], [5, 2], [6, 2], [7, 2], [3, 3], [4, 3], [5, 9], [6, 9], [7, 9]],
    drill: [[8, 8], [9, 6], [2, 6], [8, 7]]
};
const score = (s, counts) =>
{
    const stocks = [s.oxygen, s.power, s.water, s.morale];
    return s.population * 15 + Math.min(...stocks) * 1.7 + stocks.reduce((a, b) => a + b) * .17 +
        Math.min((counts.habitat + 1) * 8 - s.population, 12) * 1.5 +
        Math.min(counts.greenhouse * 16 - s.population, 18) * 1.5 +
        Math.min(counts.drill * 20 - s.population - (counts.habitat + 1) - counts.greenhouse * 2, 20) * 1.4 +
        Math.min(counts.solar * 5 - (counts.habitat + 1) * 2 - counts.greenhouse * 4 - counts.drill * 3, 12) * 1.5;
};
let beam = [{ state: newGame(), path: [], counts: { habitat: 0, greenhouse: 0, solar: 0, drill: 0 } }], won;
for (let depth = 0; depth < 65 && !won; depth++)
{
    const next = new Map();
    for (const node of beam)
    {
        for (const kind of [null, "habitat", "greenhouse", "solar", "drill"])
        {
            const pos = kind && spots[kind][node.counts[kind]];
            if (kind && !pos) continue;
            const action = kind ? { c: pos[0], r: pos[1], kind } : null;
            if (action && checkAction(node.state, action)) continue;
            const result = tick(node.state, action);
            if (result.failed) continue;
            const counts = { ...node.counts };
            if (kind) counts[kind]++;
            const item = { state: result.state, path: [...node.path, action], counts };
            if (item.state.population === 50) { won = item; break; }
            const key = JSON.stringify([counts, item.state.population, ...["oxygen", "power", "water", "morale"].map((k) => Math.floor(item.state[k] / 8))]);
            if (!next.has(key) || score(item.state, counts) > score(next.get(key).state, counts)) next.set(key, item);
        }
        if (won) break;
    }
    beam = [...next.values()].sort((a, b) => score(b.state, b.counts) - score(a.state, a.counts)).slice(0, 900);
}
if (!won) throw Error("No verified winning route found");
await fs.writeFile(new URL("./winning-route.json", import.meta.url), JSON.stringify(won, null, 4));
console.log(JSON.stringify({ wonOnSol: won.state.sol - 1, population: won.state.population, structures: won.state.buildings.length, stocks: ["oxygen", "power", "water", "morale"].map((k) => won.state[k]), steps: won.path.length }));
