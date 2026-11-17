import { content } from "./content.js";
import { icons } from "./icons.js";
import { voices, starters, noteName, codes } from "./presets.js";
import { fromHex, parseHash, writeHash } from "./hash.js";
import { Synth, frequency } from "./audio.js";
import { Sequencer } from "./sequencer.js";
import { createScope } from "./scope.js";
import { renderShell, renderKeyboard, renderState, updateKnob } from "./ui.js";

const l = content.labels;
export const state = parseHash(location.hash);
export const synth = new Synth();
const held = new Map();
const keyLights = new Map();
let octave = 0;
let generation = 0;
let overlayDismissed = false;
let beatTimer;
let copiedTimer;
let paint = null;
renderShell();
renderKeyboard(octave);
const scope = createScope(document.querySelector("#scope"), synth, state);
const announce = (text) => { document.querySelector("#announcement").textContent = text; };
const overlay = document.querySelector("#start-overlay");
document.querySelector("#start-message").textContent = state.linked ? l.linkMessage : l.startMessage;
document.querySelector("#start-sound").textContent = state.linked ? l.playLink : l.start;

function light(midi, on)
{
    const count = Math.max(0, (keyLights.get(midi) || 0) + (on ? 1 : -1));
    keyLights.set(midi, count);
    document.querySelector(`[data-midi="${midi}"]`)?.classList.toggle("lit", count > 0);
}

function readNote(midi, voiceIndex)
{
    const actual = midi + voices[voiceIndex].transpose;
    document.querySelector("#note-readout").textContent = `${noteName(actual)}  ${Math.round(frequency(actual))} HZ`;
}

export const sequencer = new Sequencer(synth, state, (step, notes) =>
{
    document.querySelectorAll(".step.current").forEach((column) => column.classList.remove("current"));
    document.querySelectorAll(`.step[data-step="${step}"]`).forEach((column) => column.classList.add("current"));
    document.querySelector("#scope-time").textContent = step < 0 ? l.stopped : `${state.bpm} BPM  /  ${l.step} ${String(step + 1).padStart(2, "0")}/16`;
    if (step >= 0 && step % 4 === 0)
    {
        const led = document.querySelector("#beat-led");
        led.classList.add("flash");
        clearTimeout(beatTimer);
        beatTimer = setTimeout(() => led.classList.remove("flash"), 80);
    }
    for (const midi of notes)
    {
        light(midi, true);
        readNote(midi, state.voice);
        setTimeout(() => light(midi, false), voices[state.voice].gate * 60 / state.bpm / 4 * 1000);
    }
});

function refresh()
{
    synth.setTempo(state.bpm);
    renderState(state, scope);
}

function edited()
{
    refresh();
    writeHash(state);
}

function showTransport()
{
    const playing = sequencer.playing;
    document.querySelector("#play").innerHTML = playing ? icons.Square : icons.Play;
    document.querySelector("#play").setAttribute("aria-label", playing ? l.stop : l.play);
    document.querySelector("#play").classList.toggle("playing", playing);
    if (!playing) document.querySelector("#beat-led").classList.remove("flash");
}

async function unlock(event)
{
    if (!(window.AudioContext || window.webkitAudioContext))
    {
        document.querySelector("#start-message").textContent = l.unsupported;
        document.querySelector("#start-sound").hidden = true;
        return false;
    }
    try
    {
        const running = await synth.unlock();
        document.querySelector("#audio-status").textContent = running ? l.on : l.off;
        document.querySelector(".audio-status").classList.toggle("running", running);
        if (running && !overlayDismissed && !event?.target?.closest("#start-sound"))
        {
            overlayDismissed = true;
            overlay.hidden = true;
        }
        return running;
    }
    catch
    {
        announce(l.audioError);
        return false;
    }
}

async function togglePlay()
{
    if (sequencer.playing)
    {
        sequencer.stop();
        showTransport();
        return;
    }
    const current = generation;
    if (await unlock() && current === generation)
    {
        sequencer.start();
        showTransport();
    }
}

async function hold(id, midi)
{
    if (held.has(id)) return;
    const token = { midi, voice: null };
    held.set(id, token);
    if (!await unlock() || held.get(id) !== token) return;
    token.voice = synth.note(midi, state.voice, state.tone);
    light(midi, true);
    readNote(midi, state.voice);
}

function release(id)
{
    const token = held.get(id);
    if (!token) return;
    held.delete(id);
    token.voice?.release();
    if (token.voice) light(token.midi, false);
}

export function releaseAll()
{
    generation++;
    for (const id of [...held.keys()]) release(id);
    sequencer.stop();
    keyLights.clear();
    document.querySelectorAll(".key.lit").forEach((key) => key.classList.remove("lit"));
    showTransport();
    paint = null;
}

document.querySelector("#start-sound").addEventListener("click", async () =>
{
    if (state.linked) await togglePlay();
    else if (await unlock())
    {
        const voice = synth.note(72, state.voice, state.tone);
        readNote(72, state.voice);
        light(72, true);
        voice.release(synth.context.currentTime + 0.22);
        setTimeout(() => light(72, false), 220);
    }
});
document.querySelector("#play").addEventListener("click", togglePlay);
document.querySelector("#clear").addEventListener("click", () =>
{
    state.grid.fill(0);
    edited();
    announce(l.cleared);
});
document.querySelectorAll("[data-voice]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        state.voice = Number(button.dataset.voice);
        edited();
    });
    button.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        state.voice = (state.voice + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : 2)) % 3;
        edited();
        document.querySelector(`[data-voice="${state.voice}"]`).focus();
    });
});
document.querySelectorAll("[data-starter]").forEach((button) => button.addEventListener("click", () =>
{
    const starter = starters[Number(button.dataset.starter)];
    state.grid = fromHex(starter.grid);
    state.bpm = starter.bpm;
    state.voice = starter.voice;
    state.tone = 60;
    edited();
}));

function setKnob(knob, value)
{
    const id = knob.id;
    const next = Math.max(Number(knob.dataset.min), Math.min(Number(knob.dataset.max), Math.round(value)));
    if (id === "volume")
    {
        synth.setVolume(next);
        updateKnob(id, next);
    }
    else
    {
        state[id === "tempo" ? "bpm" : "tone"] = next;
        edited();
    }
}
document.querySelectorAll(".knob").forEach((knob) =>
{
    knob.addEventListener("keydown", (event) =>
    {
        const increments = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
        if (!(event.key in increments) && !["Home", "End"].includes(event.key)) return;
        event.preventDefault();
        setKnob(knob, event.key === "Home" ? Number(knob.dataset.min) : event.key === "End" ? Number(knob.dataset.max) : Number(knob.getAttribute("aria-valuenow")) + increments[event.key]);
    });
    knob.addEventListener("dblclick", () => setKnob(knob, Number(knob.dataset.default)));
    knob.addEventListener("pointerdown", (event) =>
    {
        event.preventDefault();
        knob.focus();
        knob.setPointerCapture(event.pointerId);
        const startY = event.clientY;
        const value = Number(knob.getAttribute("aria-valuenow"));
        const range = Number(knob.dataset.max) - Number(knob.dataset.min);
        const move = (moveEvent) => setKnob(knob, value + (startY - moveEvent.clientY) / 100 * range * (moveEvent.shiftKey ? 0.25 : 1));
        const end = () =>
        {
            knob.removeEventListener("pointermove", move);
            knob.removeEventListener("pointerup", end);
            knob.removeEventListener("pointercancel", end);
        };
        knob.addEventListener("pointermove", move);
        knob.addEventListener("pointerup", end);
        knob.addEventListener("pointercancel", end);
    });
});

function setPad(button, on)
{
    const step = Number(button.dataset.step);
    const mask = 1 << Number(button.dataset.row);
    state.grid[step] = on ? state.grid[step] | mask : state.grid[step] & ~mask;
    edited();
}
document.querySelector("#grid").addEventListener("pointerdown", (event) =>
{
    const button = event.target.closest(".pad");
    if (!button || event.button !== 0) return;
    const on = button.getAttribute("aria-pressed") !== "true";
    if (event.pointerType !== "touch")
    {
        paint = { id: event.pointerId, on };
        event.preventDefault();
        button.focus({ preventScroll: true });
    }
    setPad(button, on);
});
document.querySelector("#grid").addEventListener("pointerover", (event) =>
{
    const button = event.target.closest(".pad");
    if (paint && event.pointerId === paint.id && event.buttons === 1 && button) setPad(button, paint.on);
});
document.querySelector("#grid").addEventListener("click", (event) =>
{
    if (event.detail === 0 && event.target.matches(".pad")) setPad(event.target, event.target.getAttribute("aria-pressed") !== "true");
});

function changeOctave(delta)
{
    for (const id of [...held.keys()]) release(id);
    octave = Math.max(-2, Math.min(2, octave + delta));
    renderKeyboard(octave);
}
document.querySelector("#octave-down").addEventListener("click", () => changeOctave(-1));
document.querySelector("#octave-up").addEventListener("click", () => changeOctave(1));
document.querySelector("#keyboard").addEventListener("pointerdown", (event) =>
{
    const key = event.target.closest(".key");
    if (!key || event.button !== 0) return;
    if (event.pointerType === "mouse") event.preventDefault();
    hold(`pointer-${event.pointerId}`, Number(key.dataset.midi));
});
document.querySelector("#keyboard").addEventListener("pointerover", (event) =>
{
    const key = event.target.closest(".key");
    const id = `pointer-${event.pointerId}`;
    if (event.pointerType !== "mouse" || !held.has(id) || !key || held.get(id).midi === Number(key.dataset.midi)) return;
    release(id);
    hold(id, Number(key.dataset.midi));
});
window.addEventListener("pointerup", (event) =>
{
    release(`pointer-${event.pointerId}`);
    paint = null;
});
window.addEventListener("pointercancel", releaseAll);
window.addEventListener("blur", releaseAll);
document.addEventListener("visibilitychange", releaseAll);
window.addEventListener("keydown", (event) =>
{
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.matches("input,textarea,[contenteditable=true]")) return;
    const index = codes.indexOf(event.code);
    if (index >= 0)
    {
        event.preventDefault();
        hold(event.code, 60 + index + octave * 12);
    }
    else if (event.code === "KeyZ" || event.code === "KeyX")
    {
        event.preventDefault();
        changeOctave(event.code === "KeyZ" ? -1 : 1);
    }
    else if (event.code === "Space" && !event.target.closest("button,[role=slider]"))
    {
        event.preventDefault();
        togglePlay();
    }
});
window.addEventListener("keyup", (event) => release(event.code));
document.addEventListener("pointerdown", unlock, { capture: true });
document.addEventListener("touchend", unlock, { capture: true });
document.addEventListener("keydown", (event) =>
{
    if (!event.ctrlKey && !event.metaKey && !event.altKey) unlock();
}, { capture: true });
window.addEventListener("hashchange", () =>
{
    const next = parseHash(location.hash);
    Object.assign(state, next);
    refresh();
});
document.querySelector("#copy").addEventListener("click", async () =>
{
    writeHash(state);
    try
    {
        await navigator.clipboard.writeText(location.href);
        const button = document.querySelector("#copy");
        button.innerHTML = `${icons.Check}<span>${l.copied}</span>`;
        announce(l.copied);
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => { button.innerHTML = `${icons.Link}<span>${l.copy}</span>`; }, 1600);
    }
    catch
    {
        document.querySelector("#copy-fallback").hidden = false;
        const input = document.querySelector("#share-url");
        input.value = location.href;
        input.focus();
        input.select();
        announce(l.fallback);
    }
});
document.querySelector("#close-copy").addEventListener("click", () => { document.querySelector("#copy-fallback").hidden = true; });
window.addEventListener("pagehide", () =>
{
    releaseAll();
    scope.close();
    synth.context?.close();
});
refresh();
updateKnob("volume", synth.volume);
if (!(window.AudioContext || window.webkitAudioContext)) unlock();
