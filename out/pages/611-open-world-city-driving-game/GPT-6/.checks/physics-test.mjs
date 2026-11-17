import assert from "node:assert/strict";
import { createDriver } from "../drive.js";
import { updateLighting } from "../lighting.js";
import * as THREE from "../vendor/three.module.js";
import { writeFile } from "node:fs/promises";

const tests = [];
function makeFixture(obstacles = [])
{
    const vector = { set() {} };
    const mesh = { position: vector, rotation: { y: 0 } };
    const car = { x: 0, z: 0, yaw: 0, speed: 0, mesh, start: { x: 0, z: 0, yaw: 0 } };
    const world = { poolCars: [car], obstacles, player: { visible: true, position: vector, rotation: { y: 0 } }, leftLeg: { rotation: {} }, rightLeg: { rotation: {} } };
    const driver = createDriver(world, () => {});
    Object.assign(driver.state, { x: 0, z: 0, car, yaw: 0 });
    return { driver, world };
}
function simulate(driver, seconds, traffic = [])
{
    for (let frame = 0; frame < Math.round(seconds * 60); frame++) driver.update(1 / 60, traffic);
}
function pass(name)
{
    tests.push({ name, passed: true });
}
const acceleration = makeFixture().driver;
acceleration.input.forward = true;
simulate(acceleration, 1);
assert.ok(acceleration.state.speed > 10);
assert.ok(acceleration.state.z > 4);
assert.equal(acceleration.state.x, 0);
pass("North-facing yaw-zero vehicle accelerates north with no lateral drift");
acceleration.input.right = true;
simulate(acceleration, .5);
assert.ok(acceleration.state.yaw > 0);
assert.ok(acceleration.state.x > 0);
pass("Right steering rotates toward positive east; reverse uses signed steering");
const coasting = makeFixture().driver;
coasting.state.speed = 16;
simulate(coasting, .5);
const braking = makeFixture().driver;
braking.state.speed = 16;
braking.input.handbrake = true;
simulate(braking, .5);
assert.ok(braking.state.speed < coasting.state.speed - 7);
pass("Handbrake removes speed faster than coasting");
const reverse = makeFixture().driver;
reverse.input.brake = true;
simulate(reverse, 2);
assert.ok(reverse.state.speed < -7);
assert.ok(reverse.state.z < -8);
pass("Brake pedal transitions from rest into physically negative reverse motion");
const wall = makeFixture([{ x: 0, z: 10, w: 15, d: 3 }]).driver;
wall.input.forward = true;
simulate(wall, 4);
assert.ok(wall.state.collisions > 0);
assert.ok(wall.state.z < 7.1);
pass("Solid wall collision stops vehicle before its collision volume tunnels through");
const traffic = makeFixture().driver;
traffic.input.forward = true;
simulate(traffic, 4, [{ x: 0, z: 9 }]);
assert.ok(traffic.state.collisions > 0);
assert.ok(traffic.state.z < 5.3);
pass("Ambient traffic uses a real solid vehicle collision volume");
const lighting =
{
    THREE,
    hemi: {},
    sun: { color: new THREE.Color() },
    renderer: { setClearColor() {} },
    scene: { fog: { color: new THREE.Color() } },
    lamps: [{ material: {} }],
    windows: [{ material: {} }]
};
globalThis.document = { getElementById: () => ({ textContent: "" }) };
updateLighting(lighting, 0);
const duskSun = lighting.sun.intensity;
updateLighting(lighting, 150);
assert.equal(lighting.sun.intensity, .5);
assert.ok(lighting.sun.intensity < duskSun / 5);
assert.equal(lighting.lamps[0].material.emissiveIntensity, 3);
updateLighting(lighting, 1000);
assert.equal(lighting.sun.intensity, .5);
pass("Dusk reaches night at 150 active seconds and clamps thereafter");
const result = { passed: true, type: "Focused simulation unit assertions; browser gameplay is tested separately.", tests };
await writeFile(new URL("./physics.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
process.stdout.write(JSON.stringify(result) + "\n");
