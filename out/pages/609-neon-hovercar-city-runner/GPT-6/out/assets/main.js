import { content as c, bestKey } from "./content.js";
import { createRun, step } from "./sim.js";
import { createCanyon } from "./canyon.js";
import { createHud } from "./hud.js";
import { createAudio } from "./audio.js";
import { icon } from "./icons.js";
import { track } from "./track.js";

document.title = `${c.brand} — ${c.city}`;
document.querySelector("#world").setAttribute("aria-label", c.canvasLabel);
await document.fonts.ready;
const hud = createHud();
await document.fonts.ready;
const canyon = createCanyon(document.querySelector("#world"));
const audio = createAudio();
let run = createRun();
const input = { left: false, right: false, pace: false, boost: false };
let best = 0;
try { best = Math.max(0, Number.parseInt(localStorage.getItem(bestKey), 10) || 0); } catch {}
let help = false;
let helpPrevious = "ready";
let accumulator = 0;
let previousTime = performance.now();
let previousPhase = run.phase;
function clearInput()
{
    for (const key of Object.keys(input)) input[key] = false;
}
function pause()
{
    if (run.phase === "running")
    {
        run.phase = "paused";
        clearInput();
    }
    else if (run.phase === "paused" && !help) run.phase = "running";
}
hud.onAction(() =>
{
    if (run.phase === "paused") run.phase = "running";
    else
    {
        run = createRun();
        run.phase = "running";
        clearInput();
    }
});
document.querySelector("#pause").onclick = pause;
document.querySelector("#sound").onclick = () =>
{
    const enabled = audio.toggle();
    const button = document.querySelector("#sound");
    button.innerHTML = icon(enabled ? "volume-2" : "volume-x");
    button.setAttribute("aria-label", enabled ? c.soundOff : c.soundOn);
    button.title = enabled ? c.soundOff : c.soundOn;
};
document.querySelector("#help").onclick = () =>
{
    if (help) return;
    helpPrevious = run.phase;
    if (run.phase === "running") run.phase = "paused";
    clearInput();
    help = true;
};
hud.onCloseHelp(() =>
{
    help = false;
    run.phase = helpPrevious === "running" ? "paused" : helpPrevious;
});
const mapping = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "pace", KeyW: "pace", Space: "boost" };
addEventListener("keydown", (event) =>
{
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement && event.code === "Space") return;
    if (mapping[event.code])
    {
        event.preventDefault();
        if (run.phase === "running") input[mapping[event.code]] = true;
    }
    if (!event.repeat && ["KeyP", "Escape"].includes(event.code))
    {
        event.preventDefault();
        if (help)
        {
            help = false;
            run.phase = helpPrevious === "running" ? "paused" : helpPrevious;
        }
        else pause();
    }
});
addEventListener("keyup", (event) =>
{
    if (mapping[event.code]) input[mapping[event.code]] = false;
});
for (const button of document.querySelectorAll("[data-control]"))
{
    const pointers = new Set();
    button.addEventListener("pointerdown", (event) =>
    {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        pointers.add(event.pointerId);
        if (run.phase === "running") input[button.dataset.control] = true;
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    {
        button.addEventListener(type, (event) =>
        {
            pointers.delete(event.pointerId);
            if (pointers.size === 0) input[button.dataset.control] = false;
        });
    }
}
addEventListener("blur", () =>
{
    clearInput();
    if (run.phase === "running") run.phase = "paused";
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden && run.phase === "running")
    {
        run.phase = "paused";
        clearInput();
        hud.update(run, best, help);
    }
});
Object.defineProperty(window, "laneTelemetry",
{
    get: () => Object.freeze({ ...run, passed: [...run.passed], reducedMotion: hud.reduced, input: { ...input } })
});
function animate(now)
{
    const delta = Math.min((now - previousTime) / 1000, 0.1);
    previousTime = now;
    accumulator += delta;
    while (accumulator >= track.tick)
    {
        step(run, input, track.tick);
        accumulator -= track.tick;
    }
    if (run.phase !== previousPhase && ["reached", "failed"].includes(run.phase))
    {
        clearInput();
        best = Math.max(best, run.haul);
        try { localStorage.setItem(bestKey, String(best)); } catch {}
    }
    previousPhase = run.phase;
    hud.update(run, best, help);
    audio.update(run);
    canyon.render(run, input, hud.reduced, now / 1000);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
addEventListener("pagehide", () =>
{
    canyon.dispose();
    audio.close();
}, { once: true });
