import { content } from "./content.js";
import { icons } from "./icons.js";
import { voices, starters, gridNotes, noteName, hints } from "./presets.js";
import { toHex } from "./hash.js";

const l = content.labels;
const glyphs = [
    '<path d="M1 12C5-2 9-2 13 12s8 14 12 0"/>',
    '<path d="M1 19V5h12v14h12V5"/>',
    '<path d="m1 19 12-14v14L25 5"/>'
];
const wave = (index) => `<svg class="wave-glyph" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${glyphs[index]}</svg>`;
const knob = (id, label, value, min, max, unit = "") => `
    <div class="knob-group">
        <div class="knob" id="${id}" role="slider" tabindex="0" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}" data-min="${min}" data-max="${max}" data-default="${value}">
            <svg viewBox="0 0 60 60" aria-hidden="true">
                <defs><radialGradient id="cap-${id}" cx="35%" cy="20%"><stop stop-color="#3B2170"/><stop offset="1" stop-color="#1A0D2E"/></radialGradient></defs>
                <circle class="track" cx="30" cy="30" r="25" pathLength="100" transform="rotate(135 30 30)"/>
                <circle class="value-arc" cx="30" cy="30" r="25" pathLength="100" transform="rotate(135 30 30)"/>
                <circle cx="30" cy="30" r="19" fill="url(#cap-${id})" stroke="#5B3A91"/>
                <path class="pointer" d="M30 30V17" stroke="#F3E8FF" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <div><label>${label}</label><output id="${id}-value">${value}${unit}</output></div>
    </div>`;

export function renderShell()
{
    document.querySelector("#app").innerHTML = `
        <div class="instrument" aria-label="${l.instrument}">
            <header class="topbar">
                <div class="identity"><a class="wordmark" href="./index.html">${content.brand}</a><p>${content.tagline}</p></div>
                <div class="top-right"><span class="shortcut">${l.shortcuts}</span><span class="audio-status"><i></i><span id="audio-status">${l.off}</span></span></div>
            </header>
            <section class="panel scope-panel" aria-label="${l.scope}">
                <canvas id="scope" aria-label="Live audio waveform"></canvas>
                <div class="scope-top"><span><b>${l.scope}</b><span class="tiny-divider"></span><span id="scope-voice"></span></span><span id="scope-time">${l.stopped}</span></div>
                <div class="scope-bottom"><span id="note-readout">-- --</span><span>${l.mono}<i class="small-cross">+</i></span></div>
                <div id="start-overlay"><p id="start-message"></p><button id="start-sound"></button><span>${l.startHint}</span></div>
            </section>
            <section class="panel transport" aria-label="Sound controls">
                <div class="transport-actions"><button id="play" class="play" aria-label="${l.play}">${icons.Play}</button><i id="beat-led"></i><button id="clear" class="ghost">${icons.Eraser}<span>${l.clear}</span></button></div>
                <div class="voice-group"><label>${l.voice}</label><div class="voice-options" role="radiogroup" aria-label="${l.voice}">${voices.map((voice, index) => `<button role="radio" data-voice="${index}">${wave(index)}<span>${voice.name}</span></button>`).join("")}</div></div>
                <div class="starter-group"><label>${l.starter}</label><div class="starters">${starters.map((starter, index) => `<button data-starter="${index}">${starter.name}</button>`).join("")}</div></div>
                <div class="knobs">${knob("tempo", l.tempo, 112, 60, 180, " BPM")}${knob("tone", l.tone, 60, 0, 100)}${knob("volume", l.volume, 70, 0, 100)}</div>
                <button id="copy" class="copy">${icons.Link}<span>${l.copy}</span></button>
            </section>
            <section class="panel sequencer" aria-label="16-step sequencer">
                <div class="module-heading"><h2>${l.pattern}<span class="module-number"> / 01</span></h2><span>${l.patternHint}</span></div>
                <div id="grid" class="grid"></div>
            </section>
            <section class="panel keyboard-panel" aria-label="25-key keyboard">
                <div class="module-heading"><h2>${l.keys}<span class="module-number"> / 02</span></h2><span class="keyboard-hint">${l.keyboardHint}</span><div class="octave-controls"><button id="octave-down" aria-label="${l.octaveDown}">${icons.Minus}</button><output id="octave-value">${l.octave} 0</output><button id="octave-up" aria-label="${l.octaveUp}">${icons.Plus}</button></div></div>
                <p class="swipe-hint">${l.swipe}<span>→</span></p>
                <div class="key-scroll"><div id="keyboard" class="keyboard"></div></div>
            </section>
        </div>
        <section class="panel-notes" aria-label="How to play">${content.notes.map((note) => `<article class="panel note-card"><h2>${note.title}</h2><p>${note.text}</p></article>`).join("")}</section>
        <footer><p>${content.brand} is made for ${content.audience}.<br>${l.footer}</p><a href="${content.credit.url}" target="_blank" rel="noopener noreferrer">${content.credit.label}<span>↗</span></a></footer>
        <div id="copy-fallback" hidden><label for="share-url">${l.fallback}</label><input id="share-url" readonly aria-label="${l.fallback}"><button id="close-copy" aria-label="Close link">×</button></div>
        <p id="announcement" class="sr-only" aria-live="polite"></p>`;
    const grid = document.querySelector("#grid");
    for (let barIndex = 0; barIndex < 2; barIndex++)
    {
        const bar = document.createElement("div");
        bar.className = "bar";
        const labels = document.createElement("div");
        labels.className = "row-labels";
        labels.innerHTML = `<span></span>${[...gridNotes].reverse().map((midi) => `<span>${noteName(midi)}</span>`).join("")}`;
        bar.append(labels);
        for (let beat = 0; beat < 2; beat++)
        {
            const group = document.createElement("div");
            group.className = "beat";
            for (let column = 0; column < 4; column++)
            {
                const step = barIndex * 8 + beat * 4 + column;
                const strip = document.createElement("div");
                strip.className = "step";
                strip.dataset.step = String(step);
                strip.innerHTML = `<span class="step-number">${String(step + 1).padStart(2, "0")}</span>${[...gridNotes].reverse().map((midi, row) => `<button class="pad" data-step="${step}" data-row="${7 - row}" aria-label="Step ${step + 1}, note ${noteName(midi)}" aria-pressed="false"></button>`).join("")}`;
                group.append(strip);
            }
            bar.append(group);
        }
        grid.append(bar);
    }
}

export function renderKeyboard(octave)
{
    let natural = 0;
    document.querySelector("#keyboard").innerHTML = Array.from({ length: 25 }, (_, offset) =>
    {
        const midi = 60 + offset + octave * 12;
        const sharp = [1, 3, 6, 8, 10].includes(offset % 12);
        const scale = [0, 3, 5, 7, 10].includes(offset % 12);
        const position = sharp ? natural - 0.29 : natural++;
        return `<button class="key ${sharp ? "sharp" : "natural"}" style="--key-position:${position}" data-offset="${offset}" data-midi="${midi}" aria-label="${noteName(midi)}"><span class="note-label">${offset % 12 === 0 ? noteName(midi) : ""}</span>${scale ? '<i class="scale-dot"></i>' : ""}<kbd>${hints[offset] || ""}</kbd></button>`;
    }).join("");
    document.querySelector("#octave-value").textContent = `${l.octave} ${octave > 0 ? "+" : ""}${octave}`;
    document.querySelector("#octave-down").disabled = octave <= -2;
    document.querySelector("#octave-up").disabled = octave >= 2;
}

export function renderState(state, scope)
{
    const voice = voices[state.voice];
    document.documentElement.style.setProperty("--accent", voice.accent);
    document.documentElement.style.setProperty("--accent-2", voice.secondary);
    document.querySelector("#scope-voice").textContent = voice.name.toUpperCase();
    document.querySelectorAll("[data-voice]").forEach((button, index) =>
    {
        button.setAttribute("aria-checked", String(index === state.voice));
        button.tabIndex = index === state.voice ? 0 : -1;
    });
    document.querySelectorAll(".pad").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(Boolean(state.grid[Number(button.dataset.step)] & (1 << Number(button.dataset.row)))));
    });
    document.querySelectorAll("[data-starter]").forEach((button, index) =>
    {
        const matches = toHex(state.grid) === starters[index].grid && state.bpm === starters[index].bpm;
        button.classList.toggle("matched", matches);
        button.setAttribute("aria-pressed", String(matches));
    });
    updateKnob("tempo", state.bpm);
    updateKnob("tone", state.tone);
    scope?.redraw();
}

export function updateKnob(id, value)
{
    const knob = document.querySelector(`#${id}`);
    const fraction = (value - Number(knob.dataset.min)) / (Number(knob.dataset.max) - Number(knob.dataset.min));
    knob.setAttribute("aria-valuenow", String(value));
    knob.setAttribute("aria-valuetext", `${value}${id === "tempo" ? " BPM" : ""}`);
    knob.querySelector(".value-arc").style.strokeDasharray = `${fraction * 75} 100`;
    knob.querySelector(".pointer").setAttribute("transform", `rotate(${-135 + fraction * 270} 30 30)`);
    document.querySelector(`#${id}-value`).textContent = `${value}${id === "tempo" ? " BPM" : ""}`;
}
