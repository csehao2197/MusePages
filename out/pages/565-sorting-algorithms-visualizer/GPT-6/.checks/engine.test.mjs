import test from "node:test";
import assert from "node:assert/strict";
import { algorithms } from "../engine/algorithms.js";
import { makeArray, mulberry32 } from "../engine/arrays.js";
import { Player, applyStep, raceAt } from "../engine/player.js";

for (const [name, sort] of Object.entries(algorithms))
{
    test(`${name}: immutable, correct traces on empty/single/ordered/reversed/duplicate/negative/seeded arrays`, () =>
    {
        const cases = [[], [7], [1, 2, 3], [3, 2, 1], [4, 4, 4, 4], [3, -2, 3, 0, -9], [0, 0], ...["random", "nearly", "reversed", "few"].flatMap((p) => [8, 48, 128].map((n) => makeArray(n, p, 2048)))];
        for (const input of cases)
        {
            const original = [...input];
            const steps = sort(Object.freeze(input));
            const player = new Player(input, steps);
            assert.deepEqual(input, original);
            assert.deepEqual(sort(input), steps, "deterministic trace");
            const array = [...input];
            const sorted = new Set();
            let compares = 0;
            let swaps = 0;
            let writes = 0;
            for (const s of steps)
            {
                assert.ok(["compare", "swap", "write", "sorted"].includes(s.k));
                if (s.k === "compare")
                {
                    compares++;
                    assert.ok(s.i >= 0 && s.i < input.length && s.j >= 0 && s.j < input.length);
                    if (name !== "merge")
                    {
                        assert.equal(s.a, array[s.i]);
                        assert.equal(s.b, array[s.j]);
                    }
                }
                if (s.k === "write")
                {
                    assert.equal(s.prev, array[s.i], "write prev is reversible");
                    writes++;
                }
                if (s.k === "swap") swaps++;
                if (s.k === "sorted") assert.ok(s.indices.every((i) => i >= 0 && i < input.length));
                applyStep(array, sorted, s);
            }
            player.seek(steps.length);
            assert.deepEqual(player.array, [...original].sort((a, b) => a - b));
            assert.equal(player.sorted.size, input.length);
            assert.deepEqual(player.metrics, [compares, swaps, writes]);
            assert.deepEqual(player.array, array);
            if (name === "merge") assert.equal(swaps, 0);
            else assert.equal(writes, 0);
        }
    });

    test(`${name}: forward, back, reset and snapshot-boundary seeking reproduce every state`, () =>
    {
        const input = makeArray(48, "random", 2049);
        const steps = sort(input);
        const player = new Player(input, steps);
        const states = [{ array: [...input], sorted: [] }];
        const a = [...input];
        const sorted = new Set();
        steps.forEach((s) =>
        {
            applyStep(a, sorted, s);
            states.push({ array: [...a], sorted: [...sorted] });
        });
        for (let k = steps.length; k >= 0; k--)
        {
            player.seek(k);
            assert.deepEqual(player.array, states[k].array);
            assert.deepEqual([...player.sorted], states[k].sorted);
        }
        player.seek(-8);
        assert.equal(player.position, 0);
        player.seek(steps.length + 8);
        assert.equal(player.position, steps.length);
        for (const k of [1, 255, 256, 257, 0, steps.length])
        {
            if (k > steps.length) continue;
            player.seek(k);
            assert.deepEqual(player.array, states[k].array);
        }
    });
}

test("exact small traces implement the specified counting conventions", () =>
{
    assert.equal(algorithms.bubble([3, 2, 1]).length, 9);
    assert.equal(algorithms.insertion([3, 2, 1]).length, 7);
    assert.equal(algorithms.merge([2, 1]).length, 4);
    assert.equal(algorithms.quick([1, 2, 3]).length, 6);
    assert.equal(algorithms.heap([3, 2, 1]).length, 9);
    assert.deepEqual(algorithms.bubble([1, 2, 3]).map((s) => s.k), ["compare", "compare", "sorted", "sorted"]);
    assert.deepEqual(algorithms.merge([2, 1, 4, 3]).filter((s) => s.k === "compare").map((s) => [s.a, s.b]), [[2, 1], [4, 3], [1, 3], [2, 3]]);
    assert.equal(algorithms.quick([4, 4, 4]).filter((s) => s.k === "compare").length, 3);
});

test("mulberry32 and all four patterns are reproducible; shuffle advances seed", () =>
{
    const a = mulberry32(2048);
    const b = mulberry32(2048);
    assert.deepEqual(Array.from({ length: 10 }, a), Array.from({ length: 10 }, b));
    for (const p of ["random", "nearly", "reversed", "few"])
    {
        assert.deepEqual(makeArray(48, p, 2048), makeArray(48, p, 2048));
    }
    assert.notDeepEqual(makeArray(48, "random", 2048), makeArray(48, "random", 2049));
    const ladder = Array.from({ length: 48 }, (_, k) => Math.round(5 + 95 * (k + 1) / 48));
    assert.deepEqual(makeArray(48, "random", 2048).sort((a, b) => a - b), ladder);
    assert.deepEqual(makeArray(48, "reversed", 2048), [...ladder].reverse());
    assert.ok(makeArray(128, "few", 2048).every((n) => [20, 40, 60, 80, 100].includes(n)));
});

test("race advances one step per shared tick, freezes the winner, finishes both, resets and ties", () =>
{
    const input = makeArray(16);
    const players = ["bubble", "quick"].map((id) => new Player(input, algorithms[id](input)));
    const first = Math.min(...players.map((p) => p.total));
    const last = Math.max(...players.map((p) => p.total));
    let result = raceAt(players, 7);
    assert.ok(players.every((p) => p.position === 7));
    result = raceAt(players, first + 1);
    assert.equal(players[result.winner].position, first);
    result = raceAt(players, last + 100);
    assert.equal(result.tick, last);
    assert.equal(result.margin, last - first);
    assert.ok(players.every((p) => p.finished));
    raceAt(players, 0);
    assert.ok(players.every((p) => p.position === 0 && p.metrics.every((n) => n === 0)));
    const ties = [0, 1].map(() => new Player(input, algorithms.merge(input)));
    assert.equal(raceAt(ties, ties[0].total).winner, null);
});
