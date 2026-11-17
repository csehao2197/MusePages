import { content } from "./content.js";
import { distance } from "./terrain.js";
import { createScene } from "./scene.js";
import { createPlayer } from "./player.js";
import { createQuests } from "./quests.js";
import { createControls } from "./controls.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";

await document.fonts.ready;
const quests = createQuests();
const { state } = quests;
const audio = createAudio();
let world;
try
{
    world = createScene(document.getElementById("world"));
}
catch
{
    document.getElementById("loading").textContent = "This island needs WebGL. Please enable hardware acceleration and reload.";
    throw new Error("WebGL renderer could not be initialized");
}
const player = createPlayer(world.courier);
let nearby;
function interact()
{
    if (document.querySelector("dialog[open]")) return;
    if (nearby?.id === "post" && !state.carrying && !state.completed)
    {
        state.carrying = true;
        ui.toast(content.messages.pickup);
        audio.chime(state.sound);
    }
    else if (nearby && content.shrines.some(s => s.id === nearby.id) && state.carrying && !state.stamps.has(nearby.id))
    {
        state.stamps.add(nearby.id);
        quests.save();
        audio.chime(state.sound);
        ui.toast(state.stamps.size === 3 ? content.messages.open : `${nearby.name} stamped. A small moment, safely kept.`);
    }
}
function follow(id)
{
    if (!state.carrying && !state.completed)
    {
        ui.toast(content.messages.noLetter);
        return;
    }
    if (id === "temple" && state.stamps.size < 3)
    {
        ui.toast(content.messages.gateLocked);
        return;
    }
    player.follow(id);
    ui.toast(`Following the trail to ${id === "temple" ? "North Temple" : content.shrines.find(s => s.id === id).name}.`);
}
const controls = createControls(interact);
const ui = createUI(state, follow, interact);
function reset()
{
    quests.reset();
    player.reset();
    for (const id of ["reset-dialog", "complete-dialog"]) ui.$(id).close();
    ui.toast(content.messages.reset);
}
ui.on("confirm-reset", "click", reset);
ui.on("replay", "click", reset);
ui.on("wander", "click", () => ui.$("complete-dialog").close());
ui.on("sound", "click", () =>
{
    state.sound = !state.sound;
    quests.save();
    audio.chime(state.sound);
});
ui.on("zoom-in", "click", () => world.zoom(.2));
ui.on("zoom-out", "click", () => world.zoom(-.2));
if (state.stamps.size) ui.toast(content.messages.saved);
ui.$("loading").remove();
let frame = 0;
let last = performance.now();
let elapsed = 0;
let disposed = false;
function tick(now)
{
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    if (!document.hidden)
    {
        elapsed += dt;
        if (!document.querySelector("dialog[open]")) player.update(dt, controls.input(), state.stamps.size === 3, elapsed);
        nearby = [{ ...content.post, id: "post", name: "Post House" }, ...content.shrines, { ...content.temple, id: "temple", name: "North Temple" }].find(p => distance(p, player.position) < (p.id === "temple" ? 5 : 2.8));
        if (state.carrying && state.stamps.size === 3 && !state.completed && player.position.z < -22 && Math.abs(player.position.x - 1) < 2.7)
        {
            state.completed = true;
            state.carrying = false;
            quests.save();
            audio.chime(state.sound);
            ui.toast(content.messages.complete);
            ui.$("complete-dialog").showModal();
        }
        ui.update(nearby, player.following);
        world.render(elapsed, state, player.position);
        document.getElementById("world").dataset.position = `${player.position.x.toFixed(2)},${player.position.z.toFixed(2)}`;
        document.getElementById("world").dataset.following = String(player.following);
        document.getElementById("world").dataset.ready = "true";
    }
    frame = requestAnimationFrame(tick);
}
frame = requestAnimationFrame(tick);
function dispose()
{
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    controls.dispose();
    ui.dispose();
    audio.dispose();
    world.dispose();
    window.removeEventListener("pagehide", dispose);
}
window.addEventListener("pagehide", dispose);
