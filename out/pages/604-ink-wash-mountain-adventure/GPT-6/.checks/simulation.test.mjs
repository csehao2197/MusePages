import test from "node:test";
import assert from "node:assert/strict";
import { createSimulation } from "../simulation.js";
import { trailX } from "../content.js";

const idle = () => ({ x: 0, z: 0, destination: null });
function step(sim, seconds)
{
    for (let i = 0; i < Math.round(seconds * 60); i++) sim.step(1 / 60, idle());
}

test("three strokes produce a deterministic form; spending, range, and Breath recovery are real", () =>
{
    const sim = createSimulation();
    sim.start();
    sim.action("strike", idle());
    assert.equal(sim.state.hits, 0);
    assert.equal(sim.state.player.breath, 88);
    step(sim, 1);
    const p = sim.state.player;
    p.z = -5.5;
    p.x = trailX(-8);
    for (let i = 0; i < 3; i++)
    {
        sim.action("strike", idle());
        step(sim, .35);
    }
    assert.equal(sim.state.hits, 3);
    assert.equal(p.combo, 3);
    assert.equal(sim.state.guardians[0].health, 4);
    const breath = p.breath;
    step(sim, .5);
    assert.ok(p.breath > breath);
});

test("telegraphs damage only inside the ring; timed dodge prevents damage", () =>
{
    for (const shouldDodge of [false, true])
    {
        const sim = createSimulation();
        sim.start();
        sim.state.player.z = -6;
        sim.state.player.x = trailX(-8);
        step(sim, 3.3);
        assert.equal(sim.state.guardians[0].phase, "telegraph");
        if (shouldDodge) sim.action("dodge", idle());
        step(sim, .3);
        assert.equal(sim.state.player.hp, shouldDodge ? 3 : 2);
        assert.equal(sim.state.cleanDodges, shouldDodge ? 1 : 0);
    }
});

test("closed gate blocks progress; retries retain resolved lessons; summit requires all forms", () =>
{
    const sim = createSimulation();
    sim.start();
    sim.state.player.z = -13;
    sim.step(1 / 60, idle());
    assert.equal(sim.state.player.z, -12.5);
    const first = sim.state.guardians[0];
    first.resolved = true;
    first.health = 0;
    sim.state.resolved = 1;
    sim.state.guardians[1].health = 2;
    sim.retry();
    assert.equal(sim.state.guardians[0].resolved, true);
    assert.equal(sim.state.guardians[1].health, 10);
    assert.equal(sim.state.player.z, -31);
    sim.state.guardians.forEach((g) => { g.resolved = true; g.health = 0; });
    sim.state.resolved = 3;
    sim.state.player.z = -89;
    sim.state.player.x = 0;
    sim.step(1 / 60, idle());
    assert.equal(sim.state.mode, "won");
    const elapsed = sim.state.elapsed;
    step(sim, 2);
    assert.equal(sim.state.elapsed, elapsed);
});

test("identical inputs reproduce progression and active timing exactly", () =>
{
    const run = () =>
    {
        const sim = createSimulation();
        sim.start();
        for (let i = 0; i < 240; i++)
        {
            if (i === 120) sim.action("dodge", { x: 1, z: 0 });
            sim.step(1 / 60, { x: 0, z: -1 });
        }
        return { player: sim.state.player, elapsed: sim.state.elapsed, guardians: sim.state.guardians };
    };
    assert.deepEqual(run(), run());
});
