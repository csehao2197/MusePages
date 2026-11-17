import test from "node:test";
import assert from "node:assert/strict";
import { terrain, cells, newGame, tick, solarYield, storm, forecast, housing, checkAction } from "../sim.js";
import { validSave } from "../save.js";

test("exact terrain geometry and initial habitat", () =>
{
    const counts = {};
    for (let c = 0; c < 12; c++) for (let r = 0; r < 12; r++)
    {
        const type = terrain(c, r);
        counts[type] = (counts[type] || 0) + 1;
    }
    assert.deepEqual(counts, { void: 48, rim: 28, floor: 62, boulder: 6 });
    assert.equal(cells.length, 96);
    assert.deepEqual(newGame().buildings, [{ c: 5, r: 6, kind: "habitat" }]);
});
test("three mandatory first-sol outcomes share the pure tick; input is immutable", () =>
{
    const initial = newGame(), snapshot = JSON.stringify(initial);
    for (const [action, expectedPower] of [[null, 44], [{ c: 4, r: 2, kind: "solar" }, 54], [{ c: 6, r: 6, kind: "solar" }, 51]])
    {
        const result = tick(initial, action);
        assert.deepEqual(["oxygen", "power", "water", "morale", "population", "sol"].map((k) => result.state[k]), [68, expectedPower, 57, 69, 8, 2]);
        assert.equal(result.failed, false);
        assert.equal(JSON.stringify(initial), snapshot);
    }
});
test("adjacency is orthogonal, shading saturates, drills do not shade", () =>
{
    const p = { c: 5, r: 5, kind: "solar" };
    const neighbors = [{ c: 4, r: 5, kind: "habitat" }, { c: 5, r: 4, kind: "greenhouse" },
        { c: 6, r: 5, kind: "habitat" }, { c: 5, r: 6, kind: "greenhouse" }];
    for (let n = 0; n <= 4; n++)
    {
        assert.equal(solarYield(neighbors.slice(0, n), p, false), [10, 7, 4, 2, 2][n]);
        assert.equal(solarYield(neighbors.slice(0, n), p, true), [5, 3, 1, 1, 1][n]);
    }
    assert.equal(solarYield([{ c: 4, r: 4, kind: "habitat" }, { c: 4, r: 5, kind: "drill" }], p, false), 10);
    const base = { ...newGame(), population: 6, buildings: [p, { c: 4, r: 5, kind: "habitat" }] };
    assert.equal(tick(base, { c: 4, r: 6, kind: "greenhouse" }).state.oxygen, 84);
    assert.equal(tick(base, { c: 6, r: 6, kind: "greenhouse" }).state.oxygen, 76);
});
test("exact storm calendar and inclusive forecast", () =>
{
    for (const start of [8, 18, 30, 44, 60, 78, 96, 114, 132, 150])
    {
        assert.equal(storm(start - 1), false);
        for (let i = 0; i < 4; i++)
        {
            assert.equal(storm(start + i), true);
            assert.deepEqual(forecast(start + i), { active: true, count: 4 - i });
        }
        assert.equal(storm(start + 4), false);
    }
    assert.deepEqual(forecast(1), { active: false, count: 7 });
});
test("brownout idles all equipment; equality of supply and demand is powered", () =>
{
    const base = { ...newGame(), power: 1, population: 6,
        buildings: [...newGame().buildings, { c: 6, r: 6, kind: "greenhouse" }, { c: 7, r: 6, kind: "drill" }] };
    const dark = tick(base);
    assert.equal(dark.powered, false);
    assert.deepEqual(dark.delta, { oxygen: -6, power: -2, water: -7, morale: -5 });
    assert.equal(dark.failed, true);
    assert.deepEqual(dark.failedStocks, ["power"]);
    assert.equal(dark.state.population, 6);
    assert.equal(tick({ ...base, power: 9 }).powered, true);
});
test("stocks clamp; growth requires all stocks, power, and beds; occupied habitat is protected", () =>
{
    const base = newGame();
    assert.equal(tick({ ...base, oxygen: 40 }).growth, 0);
    assert.equal(tick({ ...base, oxygen: 41 }).growth, 2);
    assert.equal(tick({ ...base, population: 8 }).growth, 0);
    assert.equal(checkAction(base, { c: 5, r: 6, kind: "remove" }), "beds");
    assert.equal(checkAction(base, { c: 2, r: 4, kind: "drill" }), "boulder");
    assert.equal(checkAction(base, { c: 0, r: 0, kind: "drill" }), "wall");
    assert.equal(checkAction(base, { c: 5, r: 6, kind: "solar" }), "occupied");
    assert.equal(checkAction(base, { c: 5, r: 5, kind: "remove" }), "nothing");
    assert.equal(checkAction(base, { c: 5, r: 5, kind: "solar" }, { kind: "solar" }), "oneChange");
    const rich = { ...base, oxygen: 99, water: 99, power: 99, morale: 99,
        buildings: [...base.buildings, { c: 6, r: 6, kind: "greenhouse" }, { c: 8, r: 6, kind: "drill" }, { c: 4, r: 2, kind: "solar" }] };
    const result = tick(rich);
    assert.ok(["oxygen", "power", "water", "morale"].every((k) => result.state[k] <= 100 && result.state[k] >= 0));
    assert.equal(housing(result.state.buildings), 8);
});
test("save schema ignores malformed, unknown, duplicate, non-floor and impossible snapshots", () =>
{
    const base = newGame();
    assert.ok(validSave(base));
    for (const bad of [null, {}, { ...base, version: 2 }, { ...base, oxygen: -1 }, { ...base, sol: 1.5 },
        { ...base, population: 9 }, { ...base, buildings: [...base.buildings, ...base.buildings] },
        { ...base, buildings: [{ c: 2, r: 4, kind: "habitat" }] },
        { ...base, buildings: [{ c: 5, r: 6, kind: "alien" }] }]) assert.equal(validSave(bad), false);
});
test("powered equipment, drill noise, storm morale and simultaneous failure order", () =>
{
    const base = { ...newGame(), buildings: [...newGame().buildings,
        { c: 6, r: 6, kind: "greenhouse" }, { c: 5, r: 5, kind: "drill" }, { c: 4, r: 2, kind: "solar" }] };
    const result = tick(base);
    assert.deepEqual(["oxygen", "power", "water", "morale"].map((k) => result.state[k]), [84, 47, 75, 68]);
    const quiet = { ...base, buildings: base.buildings.map((b) => b.kind === "drill" ? { c: 8, r: 8, kind: "drill" } : b) };
    assert.equal(tick(quiet).state.morale, 70);
    assert.deepEqual(["oxygen", "power", "water", "morale"].map((k) => tick({ ...base, sol: 8 }).state[k]), [84, 42, 75, 60]);
    const empty = { ...newGame(), sol: 8, population: 8, oxygen: 1, power: 1, water: 1, morale: 1 };
    const failed = tick(empty);
    assert.deepEqual(failed.failedStocks, ["oxygen", "power", "water", "morale"]);
    assert.equal(failed.growth, 0);
    assert.equal(empty.sol, 8);
    assert.equal(empty.oxygen, 1);
});
