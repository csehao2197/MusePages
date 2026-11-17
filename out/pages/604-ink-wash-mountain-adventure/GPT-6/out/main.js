import { createSimulation } from "./simulation.js";
import { createScene } from "./scene.js";
import { createControls } from "./controls.js";
import { createAudio } from "./audio.js";
import { createUI } from "./ui.js";

const canvas = document.getElementById("world");
const audio = createAudio();
let simulation = createSimulation((type) => audio.play(type));
let paused = false;
let frame;
let last = performance.now();
let accumulator = 0;
let visibleTime = 0;
let nextThunder = 19;
let lastRendered = 0;
let disposed = false;
let scene;
try
{
    scene = createScene(canvas);
}
catch
{
    document.getElementById("feedback").textContent = "WebGL is unavailable. Please open this practice in a WebGL-enabled browser.";
    document.getElementById("begin").disabled = true;
    throw new Error("Rainveil requires WebGL");
}
function start()
{
    if (paused || document.hidden) return;
    simulation.start();
    void audio.activate();
}
const controls = createControls(canvas, scene, (action, input) =>
{
    if (paused || document.hidden) return;
    start();
    simulation.action(action, input);
}, start);
const ui = createUI(
{
    start,
    retry()
    {
        controls.clear();
        paused = false;
        simulation.retry();
        void audio.activate();
    },
    restart()
    {
        controls.clear();
        paused = false;
        simulation = createSimulation((type) => audio.play(type));
        start();
    },
    pause(value)
    {
        paused = value;
        controls.clear();
        accumulator = 0;
        if (value) void audio.pause();
        else void audio.activate();
    },
    sound: () => audio.toggle()
});
ui.setSound(audio.enabled);
function visibility()
{
    controls.clear();
    last = performance.now();
    accumulator = 0;
    if (document.hidden) void audio.pause();
    else if (!paused) void audio.activate();
}
document.addEventListener("visibilitychange", visibility);
function render(now)
{
    if (disposed) return;
    frame = requestAnimationFrame(render);
    const delta = Math.min((now - last) / 1000, .1);
    last = now;
    if (document.hidden) return;
    if (!paused)
    {
        visibleTime += delta;
        accumulator += delta;
        while (accumulator >= 1 / 60)
        {
            simulation.step(1 / 60, controls.input);
            accumulator -= 1 / 60;
        }
        if (visibleTime > nextThunder)
        {
            audio.play("thunder");
            nextThunder += 29;
        }
    }
    controls.input.playerX = simulation.state.player.x;
    controls.input.guardianZ = simulation.state.guardians.find((g) => !g.resolved)?.z;
    if (now - lastRendered < 1000 / (innerWidth <= 800 ? 30 : 60)) return;
    lastRendered = now;
    const target = scene.render(simulation.state, visibleTime);
    ui.update(simulation.state, target);
}
frame = requestAnimationFrame(render);
Object.defineProperty(window, "__RAINVEIL__", {
    get()
    {
        const s = simulation.state;
        return JSON.parse(JSON.stringify({ mode: s.mode, player: s.player, guardians: s.guardians, resolved: s.resolved, elapsed: s.elapsed, hits: s.hits, strikes: s.strikes, dodges: s.dodges, cleanDodges: s.cleanDodges, retries: s.retries, paused }));
    }
});
async function dispose()
{
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", dispose);
    controls.dispose();
    ui.dispose();
    scene.dispose();
    await audio.dispose();
}
window.addEventListener("pagehide", dispose);
