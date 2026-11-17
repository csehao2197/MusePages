import test from "node:test";
import assert from "node:assert/strict";
import { Simulation } from "../sim.js";
import { levels } from "../levels.js";
import { C, createContent } from "../content.js";

function strike(s, brick)
{
    s.state = "play";
    s.balls = [{ x: brick.x, z: brick.z - .35, vx: 0, vz: s.speed, cooldown: 0, held: false, trail: [] }];
    s.step(1 / 60);
}

test("all five maps clear through actual ball collision, carry points/sparks and reset", () =>
{
    const s = new Simulation();
    assert.equal(s.remaining, 36);
    for (let round = 0; round < 5; round++)
    {
        assert.equal(s.round, round);
        const previous = s.points;
        for (const brick of s.bricks)
        {
            while (brick.hp) strike(s, brick);
        }
        assert.equal(s.remaining, 0);
        assert.equal(s.state, round === 4 ? "win" : "clear");
        assert.ok(s.points >= previous + 800 + s.bricks.length * 100);
        assert.equal(s.sparks, Math.min(5, 4 + round));
        if (round < 4)
        {
            s.round++;
            s.rebuild();
        }
    }
    s.reset();
    assert.deepEqual([s.round, s.points, s.sparks, s.state, s.remaining], [0, 0, 3, "serve", 36]);
});

test("lime chip, destruction, authored pickup queue and two-drop limit", () =>
{
    const s = new Simulation();
    s.round = 4;
    s.rebuild();
    const lime = s.bricks.find(b => b.row === 0 && b.col === 4);
    strike(s, lime);
    assert.equal(lime.hp, 1);
    assert.equal(s.points, 40);
    assert.equal(s.pickups.length, 0);
    strike(s, lime);
    assert.equal(s.points, 200);
    assert.equal(s.pickups[0].type, "scatter");
    s.bricks.find(b => b.row === 3 && b.col === 0).hp = 0;
    const drops = levels[4].drops.slice(1).map(([row, col]) => s.bricks.find(b => b.row === row && b.col === col));
    for (const brick of drops) strike(s, brick);
    assert.equal(s.pickups.length, 2);
    assert.equal(s.points, 400);
});

test("paddle rebounds outward, misses cost one spark, three misses fail", () =>
{
    const s = new Simulation();
    s.state = "play";
    s.balls = [{ x: .8, z: 1.8, vx: 0, vz: -7.2, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.ok(s.balls[0].vz > 0 && s.balls[0].vx > 0);
    assert.equal(s.balls[0].z, 1.87);
    assert.ok(Math.abs(Math.hypot(s.balls[0].vx, s.balls[0].vz) - s.speed) < 1e-8);
    for (let i = 0; i < 3; i++)
    {
        s.state = "play";
        s.balls = [{ x: 6, z: .16, vx: 0, vz: -s.speed, cooldown: 0, trail: [] }];
        s.step(1 / 60);
        assert.equal(s.sparks, 2 - i);
    }
    assert.equal(s.state, "fail");
});

test("walls, least-axis brick resolution, corner hit and high-speed anti-tunneling", () =>
{
    const s = new Simulation();
    s.round = 4;
    s.rebuild();
    s.state = "play";
    s.balls = [{ x: 7.24, z: 5, vx: 10, vz: 4, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.ok(s.balls[0].vx < 0 && s.balls[0].x <= 7.25);
    s.balls = [{ x: 0, z: 19.14, vx: 1, vz: 10, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.ok(s.balls[0].vz < 0);
    const brick = s.bricks.find(b => b.type === "c");
    s.bricks = [brick, { ...brick, x: brick.x + 1.46 }];
    s.balls = [{ x: brick.x - .86, z: brick.z, vx: s.speed, vz: .001, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.equal(brick.hp, 0);
    assert.ok(s.balls[0].vx < 0);
    assert.equal(s.bricks[1].hp, 1);
    const corner = { x: 0, z: 8, type: "l", hp: 2, lime: true, row: 3, col: 3 };
    s.bricks = [corner, { ...corner, x: 4 }];
    s.balls = [{ x: -.8, z: 7.55, vx: 5, vz: 5, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.equal(corner.hp, 1);
    assert.ok(s.balls[0].vx < 0 && s.balls[0].vz < 0);
    assert.equal(s.bricks[1].hp, 2);
});

test("last-brick clear wins before another ball crosses out", () =>
{
    const s = new Simulation();
    const b = s.bricks[0];
    s.bricks = [b];
    s.state = "play";
    s.balls = [{ x: b.x, z: b.z - .5, vx: 0, vz: s.speed, cooldown: 0, trail: [] }, { x: 5, z: .16, vx: 0, vz: -s.speed, cooldown: 0, trail: [] }];
    s.step(1 / 60);
    assert.equal(s.state, "clear");
    assert.equal(s.sparks, 4);
    assert.equal(s.points, 900);
});

test("real pickup catches, beam chips and destroys, simultaneous timers freeze", () =>
{
    const s = new Simulation();
    s.state = "serve";
    for (const type of ["girder", "needle"])
    {
        s.pickups.push({ type, x: s.bar, z: 1.7 });
        s.step(1 / 60);
    }
    assert.equal(s.points, 400);
    assert.equal(s.halfWidth, 2.08);
    assert.ok(s.needle > 5.9 && s.girder > 7.9);
    const b = { x: 0, z: 8, hp: 2, lime: true, type: "l", row: 0, col: 0 };
    s.bricks = [b, { ...b, x: 3 }];
    for (let i = 0; i < 7; i++) s.step(1 / 60);
    assert.equal(b.hp, 1);
    assert.equal(s.points, 440);
    for (let i = 0; i < 28; i++) s.step(1 / 60);
    assert.equal(b.hp, 0);
    assert.equal(s.points, 600);
    for (const state of ["paused", "controls", "clear", "fail", "win"])
    {
        s.state = state;
        const before = JSON.stringify([s.balls, s.needle, s.girder, s.pickups]);
        s.step(1);
        assert.equal(JSON.stringify([s.balls, s.needle, s.girder, s.pickups]), before);
    }
});

test("Scatter respects five-ball cap and held serve can still be launched", () =>
{
    const s = new Simulation();
    s.state = "serve";
    s.catchPickup("scatter");
    assert.equal(s.balls.length, 3);
    s.catchPickup("scatter");
    s.catchPickup("scatter");
    assert.equal(s.balls.length, 5);
    assert.equal(s.points, 600);
    s.launch();
    assert.ok(s.balls.every(b => !b.held));
    for (const b of s.balls) assert.ok(Math.abs(Math.hypot(b.vx, b.vz) - s.speed) < 1e-8);
    s.girder = .001;
    s.move(7);
    s.step(1 / 60);
    assert.ok(s.bar <= 6.17);
});

test("copy-only second-name fixture preserves game maps, speeds, colors and drops", () =>
{
    const before = JSON.stringify(levels);
    const names = { ...C };
    Object.assign(C, createContent({ brand: "Circuit Room", venue: "Millhouse Rec", city: "Redloom", attendant: "Ellis Ward" }));
    const reskinned = new Simulation();
    assert.equal(reskinned.remaining, 36);
    assert.equal(reskinned.speed, 7.2);
    assert.equal(JSON.stringify(levels), before);
    assert.equal(C.rounds[4], "Last Bell");
    assert.equal(C.attendantLine, "Ellis Ward leaves the cabinet on after lab hours");
    assert.equal(C.hours, "Room 12 at Millhouse Rec. Open 7 pm to 11 pm");
    assert.deepEqual(createContent({ deck: "Keep it moving." }).rounds, names.rounds);
    const renamed = createContent({ brand: "Evening Key", venue: "Cedar Yard", attendant: "Ari Vale" });
    assert.ok(renamed.attendantLine.includes("Ari Vale") && renamed.hours.includes("Cedar Yard"));
    assert.ok(renamed.rounds[0].includes("Cedar Yard"));
    Object.assign(C, names);
});
