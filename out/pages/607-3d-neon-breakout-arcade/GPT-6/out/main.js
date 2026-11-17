import { C, saveKey } from "./content.js";
import { Simulation } from "./sim.js";
import { Arena } from "./arena.js";
import { CabinetAudio } from "./audio.js";
import { Hud } from "./hud.js";

let stored = {};
try
{
    const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
    stored = { best: Number.isSafeInteger(parsed.best) && parsed.best >= 0 ? parsed.best : 0, muted: parsed.muted === true };
}
catch {}
const audio = new CabinetAudio(stored.muted);
let arena;
let hud;
const keys = new Set();
const sim = new Simulation((name, data) =>
{
    if (name === "rebuild") arena?.rebuild();
    if (name === "break") arena?.break(data);
    if (name === "toast" || name === "lost") hud?.showToast(data);
    audio.play(name);
    if (name === "lost") hud?.announce(data);
    if (["clear", "fail", "win"].includes(name))
    {
        keys.clear();
        hud?.announce(name === "clear" ? C.clear : name === "win" ? C.final : C.fail);
        if (name !== "clear")
        {
            hud.newBest = sim.points > hud.best;
            hud.best = Math.max(hud.best, sim.points);
            save();
        }
        setTimeout(() =>
        {
            if (!["serve", "play"].includes(sim.state)) audio.silence();
        }, name === "win" ? 450 : 300);
    }
});
sim.clock = 0;
function save()
{
    try { localStorage.setItem(saveKey, JSON.stringify({ best: hud.best, muted: audio.muted })); }
    catch {}
}
function pause()
{
    if (["serve", "play"].includes(sim.state))
    {
        sim.resumeState = sim.state;
        sim.state = "paused";
        keys.clear();
        audio.silence();
    }
    else if (sim.state === "paused") action("resume");
}
async function action(name)
{
    keys.clear();
    if (name === "start")
    {
        if (!arena) return;
        sim.started = true;
        sim.state = "serve";
        await audio.unlock();
    }
    if (name === "controls")
    {
        sim.controlsFrom = sim.state === "start" ? "start" : "paused";
        sim.state = "controls";
        audio.silence();
    }
    if (name === "back") sim.state = sim.controlsFrom || "start";
    if (name === "pause") pause();
    if (name === "resume")
    {
        sim.state = sim.resumeState || "serve";
        await audio.unlock();
    }
    if (name === "restart")
    {
        sim.rebuild();
        await audio.unlock();
    }
    if (name === "next")
    {
        sim.round++;
        sim.rebuild();
        await audio.unlock();
    }
    if (name === "reset")
    {
        hud.newBest = false;
        sim.reset();
        await audio.unlock();
    }
    if (name === "sound")
    {
        audio.muted = !audio.muted;
        if (audio.muted) audio.silence();
        else if (["serve", "play"].includes(sim.state)) await audio.unlock();
        save();
    }
    hud.update();
}
hud = new Hud(sim, audio, action, stored.best || 0);
try { arena = new Arena(document.querySelector("#court"), sim); }
catch
{
    hud.fallback = true;
    audio.muted = true;
}
hud.update();
const canvas = document.querySelector("#court");
let pointer;
let pointerApplied = false;
function aim(e)
{
    if (!["serve", "play"].includes(sim.state)) return;
    const rect = canvas.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    sim.move(-6.17 + t * 12.34);
    pointerApplied = true;
}
canvas.addEventListener("pointerdown", e =>
{
    if (!["serve", "play"].includes(sim.state)) return;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, movement: 0 };
    canvas.setPointerCapture(e.pointerId);
    aim(e);
});
canvas.addEventListener("pointermove", e =>
{
    if (pointer?.id === e.pointerId) pointer.movement = Math.max(pointer.movement, Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y));
    if (e.pointerType === "mouse" || pointer?.id === e.pointerId) aim(e);
});
canvas.addEventListener("pointerup", e =>
{
    if (pointer?.id === e.pointerId)
    {
        if (Math.max(pointer.movement, Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y)) < 14) sim.launch();
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
        pointer = null;
    }
});
canvas.addEventListener("pointercancel", () => { pointer = null; });
addEventListener("keydown", e =>
{
    if (["ArrowLeft", "ArrowRight", "Space", "Escape"].includes(e.code)) e.preventDefault();
    if (["ArrowLeft", "ArrowRight"].includes(e.code) && ["serve", "play"].includes(sim.state)) keys.add(e.code);
    if (e.repeat) return;
    if (e.code === "Space") sim.launch();
    if (e.code === "Escape")
    {
        if (sim.state === "controls") action("back");
        else pause();
    }
    if (e.code === "KeyM") action("sound");
    hud.update();
});
addEventListener("keyup", e => keys.delete(e.code));
addEventListener("blur", () => { keys.clear(); pointer = null; });
document.addEventListener("visibilitychange", () =>
{
    keys.clear();
    pointer = null;
    if (document.hidden)
    {
        if (["serve", "play"].includes(sim.state)) pause();
        audio.silence();
    }
});
addEventListener("resize", () => arena?.resize());
let previous = performance.now();
let accumulator = 0;
function frame(now)
{
    const dt = Math.min(.1, (now - previous) / 1000);
    previous = now;
    if (!document.hidden)
    {
        accumulator += dt;
        let steps = 0;
        while (accumulator >= 1 / 60 && steps < 3)
        {
            if (["play", "serve"].includes(sim.state))
            {
                if (!pointerApplied) sim.move(sim.bar + ((keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0)) * 11 / 60);
                sim.clock += 1 / 60;
                sim.step(1 / 60);
            }
            accumulator -= 1 / 60;
            steps++;
        }
        if (steps === 3) accumulator = 0;
        pointerApplied = false;
        arena?.render(dt, now / 1000);
        hud.update();
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
export { sim, arena, audio };
