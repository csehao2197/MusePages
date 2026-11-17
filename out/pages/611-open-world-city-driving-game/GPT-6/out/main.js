import { CONTENT, MARKUP } from "./content.js";
import { makeWorld } from "./world.js";
import { createDriver } from "./drive.js";
import { makeTraffic } from "./traffic.js";
import { makeMissions } from "./missions.js";
import { updateLighting } from "./lighting.js";
import { drawMinimap } from "./minimap.js";
import { makeUI } from "./ui.js";
import { makeAudio } from "./audio.js";

document.body.innerHTML = MARKUP;
document.title = `${CONTENT.brand} — ${CONTENT.district}`;
await document.fonts.ready;
const bests = { porch: 0, lap: 0, mute: true };
let storageAvailable = true;
try
{
    const stored = JSON.parse(localStorage.getItem(CONTENT.saveKey) || "null");
    if (stored)
    {
        if (Number.isFinite(stored.porch) && stored.porch > 0) bests.porch = stored.porch;
        if (Number.isFinite(stored.lap) && stored.lap > 0) bests.lap = stored.lap;
        if (typeof stored.mute === "boolean") bests.mute = stored.mute;
    }
}
catch
{
    storageAvailable = false;
}
function save()
{
    try
    {
        localStorage.setItem(CONTENT.saveKey, JSON.stringify({ porch: bests.porch, lap: bests.lap, mute: bests.mute }));
    }
    catch
    {
        storageAvailable = false;
        ui?.toast(CONTENT.messages.storage);
    }
}
const world = makeWorld(document.getElementById("world"));
const sound = makeAudio(bests, save);
let ui = null;
const driver = createDriver(world, (key) => ui?.toast(CONTENT.messages[key]));
const traffic = makeTraffic(world);
const missions = makeMissions(world, driver, bests, save, (message, duration) => ui?.toast(message, duration), sound);
const game =
{
    started: false,
    elapsed: 0,
    reset()
    {
        this.elapsed = 0;
        missions.state.completed = 0;
        traffic.reset();
    }
};
ui = makeUI(driver, missions, bests, sound, game);
if (!storageAvailable) ui.toast(CONTENT.messages.storage);
let previous = performance.now();
let renderCount = 0;
let cameraInitialized = false;
const look = new world.THREE.Vector3(0, 0, 0);
const cameraPosition = new world.THREE.Vector3();
let displayHeight = 170;

function resize()
{
    world.renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);
resize();

function frame(now)
{
    requestAnimationFrame(frame);
    const dt = Math.min(.5, Math.max(0, (now - previous) / 1000));
    previous = now;
    const paused = ui.paused();
    if (!paused)
    {
        const steps = Math.max(1, Math.ceil(dt * 60));
        const step = dt / steps;
        if (game.started) game.elapsed += dt;
        for (let index = 0; index < steps; index++)
        {
            if (game.started)
            {
                driver.update(step, traffic.cars);
                missions.update(step, game.elapsed);
            }
            traffic.update(step, driver.state);
        }
    }
    const mobile = window.innerWidth <= 760;
    const aspect = window.innerWidth / window.innerHeight;
    const targetHeight = game.started ? (mobile ? 59 : 43) : (mobile ? 163 / aspect : 159);
    displayHeight += (targetHeight - displayHeight) * (cameraInitialized ? Math.min(1, dt * 3) : 1);
    const target = new world.THREE.Vector3(game.started ? driver.state.x : 0, 0, game.started ? driver.state.z : 0);
    look.lerp(target, cameraInitialized ? Math.min(1, dt * 4) : 1);
    cameraPosition.copy(look).add(new world.THREE.Vector3(105, 145, -160));
    world.camera.position.copy(cameraPosition);
    world.camera.lookAt(look);
    world.camera.left = -displayHeight * aspect;
    world.camera.right = displayHeight * aspect;
    world.camera.top = displayHeight;
    world.camera.bottom = -displayHeight;
    world.camera.clearViewOffset();
    if (!game.started)
    {
        world.camera.setViewOffset(window.innerWidth, window.innerHeight, mobile ? 0 : -window.innerWidth * .15, mobile ? window.innerHeight * .16 : -window.innerHeight * .015, window.innerWidth, window.innerHeight);
    }
    world.camera.updateProjectionMatrix();
    cameraInitialized = true;
    if (renderCount % 4 === 0)
    {
        updateLighting(world, game.elapsed);
        drawMinimap(world, driver, missions, traffic);
        ui.update();
    }
    sound.update(driver.state.speed, !!driver.state.car, paused);
    world.renderer.render(world.scene, world.camera);
    renderCount++;
    document.body.dataset.ready = "true";
}
requestAnimationFrame(frame);
window.addEventListener("pagehide", () => sound.close());

// Read-only diagnostics support reproducible browser QA without altering simulation state.
Object.defineProperty(window, "club",
{
    value: Object.freeze(
    {
        snapshot: () =>
        ({
            ready: renderCount > 0,
            started: game.started,
            paused: ui.paused(),
            elapsed: game.elapsed,
            player: { x: driver.state.x, z: driver.state.z, yaw: driver.state.yaw, speed: driver.state.speed, car: driver.state.car?.name || null, collisions: driver.state.collisions, distance: driver.state.distance },
            mission: { ...missions.state },
            target: missions.target() ? { ...missions.target() } : null,
            bests: { ...bests },
            traffic: traffic.cars.map((car) => ({ x: car.x, z: car.z, yaw: car.yaw })),
            poolCars: world.poolCars.map((car) => ({ x: car.x, z: car.z, yaw: car.yaw })),
            lighting: { sunlight: world.sun.intensity, lampGlow: world.lamps[0].material.emissiveIntensity },
            renderedFrames: renderCount
        })
    }),
    writable: false
});
