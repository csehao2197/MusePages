import {content as c} from "./content.js";
import {DEFAULT_NAMES, FIFTHS_ORDER, RELATIVE_MINORS, PITCH_COLORS, SCALES, SIGNATURES, SIGNATURE_NOTES, pc, pitch, noteName, quality, chord, scaleMidis, diatonic, intervalDescription} from "./theory.js";
import * as audio from "./audio.js";

const state =
{
    selectedKey: 0,
    activeNotes: new Map(),
    interval: {rootMidi: 60, semitones: 7},
    chord: {rootName: "C", quality: "major"},
    lastEvent: null,
    wins: [false, false, false, false],
    muted: false,
    heroPlayed: [],
    intervalPlayed: [],
    octave: 4,
    quiz: null
};
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="./icons.svg#${name}"></use></svg>`;
const color = (name) => PITCH_COLORS[pitch(name)];
const chip = (name, action, extra = "") => `<button class="note-chip" style="--note:${color(name)}" data-action="${action}" data-note="${name}" ${extra}>${name}</button>`;
const point = (radius, angle) => [300 + radius * Math.sin(angle * Math.PI / 180), 300 - radius * Math.cos(angle * Math.PI / 180)];
function wedge(inner, outer, angle)
{
    const a = point(outer, angle - 14.25);
    const b = point(outer, angle + 14.25);
    const d = point(inner, angle + 14.25);
    const e = point(inner, angle - 14.25);
    return `M${a} A${outer},${outer} 0 0 1 ${b} L${d} A${inner},${inner} 0 0 0 ${e} Z`;
}
function circle(where)
{
    return `<div class="circle-wrap ${where === "hero" ? "hero-circle" : ""}" data-circle="${where}">
        <svg viewBox="0 0 600 600" class="fifths" role="slider" tabindex="0" aria-label="${c.hero.circleLabel}" aria-valuemin="0" aria-valuemax="11" aria-valuenow="0" aria-valuetext="C major, none" data-circle-control="${where}">
            <g class="rotor">${FIFTHS_ORDER.map((name, i) =>
            {
                const outer = point(246, i * 30);
                const inner = point(165, i * 30);
                const minor = RELATIVE_MINORS[i];
                return `<g data-wedge="${i}">
                    <path class="major-wedge" data-key="${i}" d="${wedge(200, 290, i * 30)}" fill="${color(name)}"/>
                    <g class="circle-label" transform="translate(${outer})"><text data-major-label="${i}" text-anchor="middle" dominant-baseline="middle">${name}</text></g>
                    <g class="minor-ring"><path data-key="${i}" d="${wedge(130, 199, i * 30)}" fill="${color(minor.slice(0, -1))}"/>
                    <g class="circle-label" transform="translate(${inner})"><text data-minor-label="${i}" text-anchor="middle" dominant-baseline="middle">${minor}</text></g></g>
                </g>`;
            }).join("")}</g>
            <circle cx="300" cy="300" r="124" fill="#120634"/>
            <g class="circle-center" data-action="scale" role="button" aria-label="${c.ui.circleScale}">
                <text class="center-name" x="300" y="292" text-anchor="middle">C</text>
                <text class="center-signature" x="300" y="328" text-anchor="middle">none</text>
                <path d="M291 356 L291 378 L309 367 Z" fill="#E6FF2E"/>
            </g>
            <path d="M285 1 L315 1 L300 24 Z" fill="#E6FF2E"/>
        </svg>
    </div>`;
}
const NATURALS = [0, 2, 4, 5, 7, 9, 11];
const SHARPS = [{pc: 1, gap: 1}, {pc: 3, gap: 2}, {pc: 6, gap: 4}, {pc: 8, gap: 5}, {pc: 10, gap: 6}];
const KEY_MAP = {a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ";": 16, "'": 17};
function piano(where)
{
    const key = (midi, black, gap) =>
    {
        const name = DEFAULT_NAMES[pc(midi)];
        const aria = name.replace("#", c.ui.sharp).replace("b", c.ui.flat) + " " + (Math.floor(midi / 12) - 1);
        const cap = Object.keys(KEY_MAP).find((k) => KEY_MAP[k] === midi - 60) ?? "";
        return `<button class="piano-key ${black ? "black" : "white"}" data-midi="${midi}" data-piano="${where}" aria-label="${aria}" style="--note:${PITCH_COLORS[pc(midi)]};--wave-delay:${(midi - 60) * 75}ms;${black ? `left:calc(${gap} * 100% / 7 - 4.43%)` : ""}"><span class="key-cap">${cap.toUpperCase()}</span><span class="key-name">${name}</span><span class="color-strip"></span></button>`;
    };
    return `<div class="piano" data-piano-tray="${where}">${[60, 72].map((base) => `<div class="octave"><div class="naturals">${NATURALS.map((n) => key(base + n, false)).join("")}</div>${SHARPS.map((s) => key(base + s.pc, true, s.gap)).join("")}</div>`).join("")}</div>`;
}
function heading(index)
{
    const chapter = c.chapters[index];
    return `<div class="chapter-copy reveal"><span class="chapter-number">${chapter.number}</span><span class="eyebrow">${chapter.kicker}</span><h2>${chapter.title}</h2><p>${chapter.body}</p>${chapter.extra ? `<p class="muted">${chapter.extra}</p>` : ""}</div>`;
}
function win(index)
{
    return `<div class="win-bar" data-win="${index}" role="status">${icon("trophy")}<span>${c.wins[index]}</span><span class="win-count">${index + 1}/4</span></div>`;
}
function app()
{
    return `<header class="topbar"><a href="#top" class="brand"><img src="./favicon.svg" alt="" width="26" height="26"><span>${c.brand.split(" ").slice(0, 1).join(" ")}<br><small>${c.brand.split(" ").slice(1).join(" ")}</small></span></a><nav>${c.nav.map((name) => `<a href="#${name.toLowerCase()}">${name}</a>`).join("")}</nav><div class="top-actions"><span class="wins-pill" id="wins-count">0/4 ${c.ui.wins}</span><button class="sound-control" data-action="mute" aria-label="${c.ui.soundOn}">${icon("volume-2")}<span>${c.ui.soundOn}</span></button></div></header>
    <main>
        <section class="hero" id="top">
            <img class="hero-photo" src="${c.images.hero[0]}" alt="${c.images.hero[1]}">
            <div class="hero-scrim"></div><div id="beams"></div>
            <div class="container hero-content">
                <div class="hero-upper"><div class="hero-copy"><div class="eyebrow">${c.hero.eyebrow}</div><h1>${c.hero.title.map((line, i) => `<span ${i === 1 ? 'class="acid"' : ""}>${line}</span>`).join("")}</h1><p>${c.hero.lead}</p><div class="hero-buttons"><a class="button primary" href="#intervals">${c.hero.start}${icon("arrow-down")}</a><a class="button coral secondary" href="#quiz">${c.hero.quiz}</a></div><div class="hero-tags">${c.hero.chips.map((tag) => `<span>${tag}</span>`).join("")}</div></div>
                <div class="hero-instrument">${circle("hero")}<p class="mono circle-caption">${c.hero.circleHint}</p></div></div>
                <div class="hero-piano"><div class="piano-readout"><span class="live-dot"></span><span id="hero-readout" aria-live="polite">${c.hero.readout}</span><span class="octave-hint">${c.hero.octaveHint} <b id="octave-number">4</b></span></div>${piano("hero")}<div class="piano-foot">${c.hero.pianoFoot.map((line) => `<span>${line}</span>`).join("")}</div></div>
            </div>
        </section>
        <section class="color-band"><div class="container color-layout"><div><h3>${c.colors.title}</h3><p>${c.colors.body}</p></div><div class="color-chips">${FIFTHS_ORDER.map((name) => chip(name, "color")).join("")}</div></div></section>
        <section class="chapter" id="intervals"><div class="container"><div class="chapter-grid">${heading(0)}<div class="panel reveal"><div class="panel-label">${c.ui.panelLabels[0]}</div><div class="interval-grid">${c.intervals.map((entry, i) => `<button class="interval-chip" data-action="interval" data-steps="${i + 1}"><span class="mono step">${String(i + 1).padStart(2, "0")}</span><strong>${entry[0]}</strong><small>${entry[1]}</small></button>`).join("")}</div><div id="interval-result" class="interval-result" aria-live="polite"></div><div id="interval-arc"></div>${piano("intervals")}<p class="helper">${c.chapters[0].helper}</p></div></div>${win(0)}</div></section>
        <section class="chapter curtain" id="circle"><div class="container"><div class="chapter-grid reverse"><div class="panel reveal"><div class="panel-label">${c.ui.panelLabels[1]}</div><div class="circle-panel">${circle("chapter")}<div id="circle-info"></div></div>${piano("circle")}<p class="helper">${c.chapters[1].helper}</p></div>${heading(1)}</div>${win(1)}</div></section>
        <section class="chapter" id="chords"><div class="container"><div class="chapter-grid">${heading(2)}<div class="panel reveal"><div class="panel-label">${c.ui.panelLabels[2]}</div><p class="mono">${c.ui.root}</p><div class="root-chips">${DEFAULT_NAMES.map((name) => chip(name, "root")).join("")}</div><p class="mono">${c.ui.quality}</p><div class="quality-grid">${c.qualities.map((q) => `<button data-action="quality" data-quality="${q.id}">${q.name}</button>`).join("")}</div><div class="chord-result-row"><div id="chord-result" aria-live="polite"></div><div><svg id="chord-shape" viewBox="0 0 240 240" role="img" aria-label="${c.ui.chordDiagram}"></svg><p class="shape-caption">${c.ui.shape}</p></div></div>${piano("chords")}<div class="progressions"><p id="progression-title" class="mono"></p>${c.progressions.map((progression, i) => `<button data-action="progression" data-progression="${i}">${progression.name}${icon("play")}</button>`).join("")}</div></div></div>${win(2)}</div></section>
        <section class="chapter curtain" id="quiz"><div class="container quiz-container">${heading(3)}<div class="panel quiz-panel reveal"><div id="quiz-content"></div><div id="quiz-piano" hidden>${piano("quiz")}</div></div>${win(3)}</div></section>
        <section class="chapter cheats"><div class="container"><span class="eyebrow">A little help, whenever you need it</span><h2>${c.ui.cheat}</h2><div class="cheat-columns"><div><h3>Intervals</h3>${c.intervals.map((entry, i) => `<div class="cheat-row"><span class="step mono">${i + 1}</span><div><strong>${entry[0]}</strong><small>${entry[1]}</small></div><button class="icon-button" data-action="cheat-interval" data-steps="${i + 1}" aria-label="Play ${entry[0]}">${icon("play")}</button></div>`).join("")}</div><div><h3>Chords</h3>${c.qualities.map((q) => `<div class="cheat-row"><span class="chord-symbol">${q.name === "Major" ? "M" : q.name === "Minor" ? "m" : q.name.slice(0, 2)}</span><div><strong>${q.name} <span class="mono">${q.steps.slice(1).map((s, i) => s - q.steps[i]).join(" + ")}</span></strong><small>${q.mood}</small></div><button class="icon-button" data-action="cheat-chord" data-quality="${q.id}" aria-label="Play ${q.name} chord">${icon("play")}</button></div>`).join("")}</div></div></div></section>
        <section class="chapter curtain school"><div class="container"><div class="school-row"><div class="portrait-block"><img src="${c.images.instructor[0]}" alt="${c.images.instructor[1]}" loading="lazy"></div><div><span class="eyebrow">${c.school.eyebrow}</span><h2>${c.school.title}</h2><p>${c.school.bio}</p><div class="stats">${c.school.stats.map(([number, label]) => `<div><strong>${number}</strong><span>${label}</span></div>`).join("")}</div></div></div><div class="school-row course-row"><img src="${c.images.class[0]}" alt="${c.images.class[1]}" loading="lazy"><div><span class="eyebrow">From your screen to the stage</span><h2>${c.school.course}</h2><ul class="course-facts">${c.school.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul><div class="class-grid">${c.school.classes.map((name, i) => `<div><span class="mono">0${i + 1}</span><strong>${name}</strong></div>`).join("")}</div></div></div><div class="quotes">${c.school.quotes.map(([quote, name, job]) => `<blockquote><p>“${quote}”</p><footer><strong>${name}</strong><span>${job}</span></footer></blockquote>`).join("")}</div></div></section>
        <section class="chapter faq"><div class="container"><h2>${c.ui.before}</h2>${c.faq.map(([question, answer], i) => `<details ${i === 0 ? "open" : ""}><summary>${question}${icon("plus")}</summary><p>${answer}</p></details>`).join("")}</div></section>
        <section class="final-band"><div class="final-copy"><span class="eyebrow">Less guessing. More playing.</span><h2>${c.final.title}</h2><p>${c.final.body}</p><div class="contacts"><strong>${c.final.phone}</strong><strong>${c.final.email}</strong></div><a class="button dark" href="#quiz">${c.final.replay}${icon("rotate-ccw")}</a></div><img src="${c.images.final[0]}" alt="${c.images.final[1]}" loading="lazy"></section>
    </main>
    <footer class="footer"><div class="container footer-grid"><div><a class="footer-brand" href="#top">${c.brand}</a><p>${c.final.address}<br>${c.final.hours}</p></div><nav>${c.nav.map((name) => `<a href="#${name.toLowerCase()}">${name}</a>`).join("")}</nav><div><p>${c.final.synthesis}</p><p class="demo-note">${c.final.demo}</p><a href="${c.final.creditUrl}" target="_blank" rel="noopener">${c.final.credit}</a></div></div></footer>
    <div class="dock" id="dock"><div class="mini-piano" id="mini-piano" aria-hidden="true">${Array.from({length: 24}, (_, i) => `<span data-mini="${60 + i}" class="${NATURALS.includes(i % 12) ? "mini-white" : "mini-black"}" style="--note:${PITCH_COLORS[i % 12]}"></span>`).join("")}</div><span id="dock-readout" class="mono">${c.ui.press}</span><button class="icon-button" data-action="replay" aria-label="${c.ui.replay}" disabled>${icon("play")}</button><button class="sound-control" data-action="mute" aria-label="Sound on">${icon("volume-2")}<span>Sound on</span></button></div>`;
}
document.querySelector("#app").innerHTML = app();
let rotation = 0;
const heldPointers = new Map();
const heldKeys = new Map();
let visiblePiano = "hero";
let quizBusyUntil = 0;

function quizHidden()
{
    return state.quiz && !state.quiz.finished && state.quiz.chosen === null;
}
function selectedSpellings(where)
{
    if (where === "chords") return chord(state.chord.rootName, state.chord.quality);
    if (where === "intervals")
    {
        const midis = [state.interval.rootMidi, state.interval.rootMidi + state.interval.semitones];
        return {midis, names: midis.map((m) => DEFAULT_NAMES[pc(m)])};
    }
    if (where === "quiz")
    {
        const round = state.quiz?.rounds[state.quiz.index];
        if (!round || quizHidden()) return {midis: [], names: []};
        const midis = quizMidis(round);
        return {midis, names: round.kind === "chord" ? chord(DEFAULT_NAMES[pc(round.root)], round.value).names : midis.map((m) => DEFAULT_NAMES[pc(m)])};
    }
    return {midis: scaleMidis(state.selectedKey).slice(0, 7), names: SCALES[state.selectedKey]};
}
function renderKeys()
{
    document.querySelectorAll("[data-piano-tray]").forEach((tray) =>
    {
        const spellings = selectedSpellings(tray.dataset.pianoTray);
        const litPcs = spellings.midis.map(pc);
        tray.querySelectorAll("[data-midi]").forEach((key) =>
        {
            const midi = Number(key.dataset.midi);
            const exact = tray.dataset.pianoTray === "chords" || tray.dataset.pianoTray === "intervals" || tray.dataset.pianoTray === "quiz";
            const lit = exact ? spellings.midis.includes(midi) : litPcs.includes(pc(midi));
            const sounding = state.activeNotes.has(midi) && !(tray.dataset.pianoTray === "quiz" && quizHidden());
            key.classList.toggle("lit", lit);
            key.classList.toggle("sounding", sounding);
            const spelling = spellings.names[litPcs.indexOf(pc(midi))] ?? DEFAULT_NAMES[pc(midi)];
            key.querySelector(".key-name").textContent = lit ? spelling : DEFAULT_NAMES[pc(midi)];
        });
    });
    document.querySelectorAll("[data-mini]").forEach((key) => key.classList.toggle("lit", !quizHidden() && state.activeNotes.has(Number(key.dataset.mini))));
}
audio.setReporter((midi, on) =>
{
    const count = state.activeNotes.get(midi) ?? 0;
    if (on) state.activeNotes.set(midi, count + 1);
    else if (count > 1) state.activeNotes.set(midi, count - 1);
    else state.activeNotes.delete(midi);
    renderKeys();
    document.querySelectorAll(`[data-wedge="${FIFTHS_ORDER.findIndex((name) => pitch(name) === pc(midi))}"]`).forEach((w) => w.classList.toggle("pulse", on));
});
function event(label, midis, playback = "note", perform = true)
{
    if (quizHidden())
    {
        if (perform)
        {
            if (playback === "note") audio.playNote(midis[0], 700, true);
            else audio[playback](midis, true);
        }
        return;
    }
    state.lastEvent = {label, midis: [...midis], playback};
    updateDock();
    if (perform) audio[playback === "note" ? "playNote" : playback](playback === "note" ? midis[0] : midis);
}
function updateDock()
{
    document.querySelector("#dock-readout").textContent = quizHidden() ? c.ui.quizListen : state.lastEvent?.label ?? c.ui.press;
    const replay = document.querySelector('[data-action="replay"]');
    replay.disabled = quizHidden() ? state.muted : !state.lastEvent;
    replay.setAttribute("aria-label", quizHidden() ? c.ui.play : c.ui.replay);
    renderKeys();
}
function earn(index, message)
{
    if (state.wins[index]) return;
    state.wins[index] = true;
    const bar = document.querySelector(`[data-win="${index}"]`);
    bar.classList.add("won");
    bar.querySelector("span").textContent = message;
    bar.querySelector("use").setAttribute("href", "./icons.svg#check");
    const count = document.querySelector("#wins-count");
    count.textContent = `${state.wins.filter(Boolean).length}/4 ${c.ui.wins}`;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        count.animate([{transform: "scale(1)"}, {transform: "scale(1.2)"}, {transform: "scale(1)"}], {duration: 350});
    }
}
function selectKey(index, source = "key")
{
    state.selectedKey = (index + 12) % 12;
    const tonic = FIFTHS_ORDER[state.selectedKey];
    if (source !== "chord")
    {
        state.interval.rootMidi = 60 + pitch(tonic);
        state.chord.rootName = tonic;
    }
    let target = -state.selectedKey * 30;
    while (target - rotation > 180) target -= 360;
    while (target - rotation < -180) target += 360;
    rotation = target;
    renderCircle();
    renderInterval();
    renderChord();
    renderKeys();
    if (source === "circle-user" && tonic === "A") earn(1, c.ui.winCircle);
}
function renderCircle()
{
    document.querySelectorAll("[data-circle]").forEach((wrap) =>
    {
        wrap.querySelector(".rotor").style.transform = `rotate(${rotation}deg)`;
        wrap.querySelectorAll("[data-wedge]").forEach((wedgeGroup) =>
        {
            const index = Number(wedgeGroup.dataset.wedge);
            const neighbor = Math.min(pc(index - state.selectedKey), pc(state.selectedKey - index)) <= 1;
            wedgeGroup.classList.toggle("neighbor", neighbor);
            wedgeGroup.classList.toggle("selected", index === state.selectedKey);
            wedgeGroup.querySelectorAll("text").forEach((text) => text.style.transform = `rotate(${-rotation}deg)`);
            wedgeGroup.querySelector(".major-wedge").setAttribute("d", wedge(200, index === state.selectedKey ? 298 : 290, index * 30));
        });
        wrap.querySelector(".center-name").textContent = FIFTHS_ORDER[state.selectedKey];
        wrap.querySelector(".center-signature").textContent = SIGNATURES[state.selectedKey];
        wrap.querySelector(".fifths").setAttribute("aria-valuenow", state.selectedKey);
        wrap.querySelector(".fifths").setAttribute("aria-valuetext", `${FIFTHS_ORDER[state.selectedKey]} major, ${SIGNATURES[state.selectedKey]}`);
    });
    const tonic = FIFTHS_ORDER[state.selectedKey];
    document.querySelector("#circle-info").innerHTML = `<span class="eyebrow">YOUR SELECTED KEY</span><h3>${tonic} major</h3><p class="muted">Relative minor: ${RELATIVE_MINORS[state.selectedKey].slice(0, -1)} minor</p><p class="mono signature">${state.selectedKey === 0 ? "No sharps or flats" : `${state.selectedKey <= 6 ? "Sharps" : "Flats"}: ${SIGNATURE_NOTES[state.selectedKey]}`}</p><div class="scale-chips">${SCALES[state.selectedKey].map((name) => chip(name, "color")).join("")}</div><button class="button primary" data-action="scale">${icon("play")}${c.ui.scale}</button><div class="diatonic">${diatonic(state.selectedKey).map((d, i) => `<button data-action="diatonic" data-degree="${i}"><span class="mono">${d.roman}</span><strong>${d.root}${d.quality === "minor" ? "m" : d.quality === "diminished" ? "dim" : ""}</strong></button>`).join("")}</div>`;
}
function renderInterval()
{
    const root = state.interval.rootMidi;
    const upper = root + state.interval.semitones;
    document.querySelectorAll(".interval-chip").forEach((button) =>
    {
        const selected = Number(button.dataset.steps) === state.interval.semitones;
        button.classList.toggle("selected", selected);
        button.style.setProperty("--note", PITCH_COLORS[pc(upper)]);
        button.setAttribute("aria-pressed", selected);
    });
    document.querySelector("#interval-result").innerHTML = `<span style="color:${PITCH_COLORS[pc(root)]}">${DEFAULT_NAMES[pc(root)]}</span><span class="distance-line"></span><span style="color:${PITCH_COLORS[pc(upper)]}">${DEFAULT_NAMES[pc(upper)]}</span><small class="mono">${state.interval.semitones} ${c.ui.halfSteps}</small>`;
    document.querySelector("#interval-arc").innerHTML = `<svg class="interval-arc" viewBox="0 0 600 66" aria-hidden="true"><path d="M30 58 Q300 -25 570 58" fill="none" stroke="${PITCH_COLORS[pc(upper)]}" stroke-width="2" stroke-dasharray="5 5"/><text x="300" y="30" text-anchor="middle" fill="#C9BEF2">${state.interval.semitones} half steps</text></svg><span class="arc-pill mono">${DEFAULT_NAMES[pc(root)]} → ${DEFAULT_NAMES[pc(upper)]} · ${state.interval.semitones} half steps</span>`;
}
function renderChord()
{
    const result = chord(state.chord.rootName, state.chord.quality);
    document.querySelectorAll('[data-action="root"]').forEach((button) => button.setAttribute("aria-pressed", button.dataset.note === state.chord.rootName));
    document.querySelectorAll('[data-action="quality"]').forEach((button) => button.setAttribute("aria-pressed", button.dataset.quality === state.chord.quality));
    document.querySelector("#chord-result").innerHTML = `<h3>${state.chord.rootName} ${result.q.name.toLowerCase()}</h3><p class="muted">${result.q.mood}</p><div class="chord-notes">${result.names.map((name, i) => `<div><span class="result-note" style="--note:${color(name)}">${name}</span><small>${result.q.labels[i]}</small></div>`).join("")}</div><p class="mono">Half steps: ${result.q.steps.slice(1).map((step, i) => step - result.q.steps[i]).join(" + ")}</p><button class="button primary" data-action="strum">${icon("play")}${c.ui.strum}</button>`;
    const positions = FIFTHS_ORDER.map((name, i) => [120 + 96 * Math.sin(i * Math.PI / 6), 120 - 96 * Math.cos(i * Math.PI / 6)]);
    const vertices = result.names.map((name) => positions[FIFTHS_ORDER.findIndex((n) => pitch(n) === pitch(name))]);
    if (vertices.length === 3) vertices.push(vertices.at(-1));
    document.querySelector("#chord-shape").innerHTML = `<circle cx="120" cy="120" r="96" stroke="#7656B4" fill="none"/><polygon points="${vertices.join(" ")}" fill="${color(state.chord.rootName)}" fill-opacity=".35" stroke="#E6FF2E" stroke-width="2"/>${positions.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${color(FIFTHS_ORDER[i])}"/><text x="${120 + (p[0] - 120) * 1.17}" y="${124 + (p[1] - 120) * 1.17}" text-anchor="middle" fill="#F6F1FF">${FIFTHS_ORDER[i]}</text>`).join("")}`;
    document.querySelector("#progression-title").textContent = c.format.progression(FIFTHS_ORDER[state.selectedKey]);
}
function changeChord(root, id, source = "chord", play = true)
{
    const previous = {...state.chord};
    state.chord = {rootName: root, quality: id};
    if (source === "chord")
    {
        const relative = ["minor", "minor7", "diminished"].includes(id);
        selectKey(FIFTHS_ORDER.findIndex((name) => pitch(name) === pc(pitch(root) + (relative ? 3 : 0))), "chord");
    }
    renderChord();
    renderKeys();
    if (previous.quality === "major" && id === "minor" && previous.rootName === root && source === "chord")
    {
        const before = chord(root, "major").names[1];
        const after = chord(root, "minor").names[1];
        earn(2, c.format.winMinor(before, after));
    }
    const result = chord(root, id);
    if (play) event(c.format.chord(root, result.q.name, result.names), result.midis, "strum");
}
function beam(midi)
{
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = document.createElement("span");
    element.className = "stage-beam";
    element.style.setProperty("--note", PITCH_COLORS[pc(midi)]);
    element.style.left = `${((midi - 60) / 24) * 100}%`;
    document.querySelector("#beams").append(element);
    setTimeout(() => element.remove(), 750);
}
function press(midi, where, sustained = false)
{
    audio.unlock();
    if (where === "hero")
    {
        state.heroPlayed = [...state.heroPlayed.slice(-1), midi];
        selectKey(FIFTHS_ORDER.findIndex((name) => pitch(name) === pc(midi)), "hero");
        document.querySelector("#hero-readout").textContent = state.heroPlayed.length === 1 ? c.format.firstNote(noteName(midi)) : intervalDescription(...state.heroPlayed);
        beam(midi);
    }
    else if (where === "intervals")
    {
        state.intervalPlayed = [...state.intervalPlayed.slice(-1), midi];
        state.interval.rootMidi = 60 + pc(midi);
        renderInterval();
        renderKeys();
        if (state.intervalPlayed.length === 2 && state.intervalPlayed[1] - state.intervalPlayed[0] === 7) earn(0, c.format.winFifth(noteName(state.intervalPlayed[0]), noteName(midi)));
    }
    event(noteName(midi), [midi], "note", !sustained);
    return sustained ? audio.noteOn(midi) : null;
}
function quizMidis(round)
{
    return round.kind === "interval" ? [round.root, round.root + round.value] : quality(round.value).steps.map((step) => round.root + step);
}
function startQuiz()
{
    audio.stop();
    releaseHeld();
    const rounds = c.quiz.map((round) => ({...round, root: 60 + Math.floor(Math.random() * 8)}));
    for (let i = rounds.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [rounds[i], rounds[j]] = [rounds[j], rounds[i]];
    }
    state.quiz = {rounds, index: 0, score: 0, chosen: null, answers: [], finished: false};
    renderQuiz();
    updateDock();
}
function renderQuiz()
{
    const q = state.quiz;
    const panel = document.querySelector("#quiz-content");
    const pianoBlock = document.querySelector("#quiz-piano");
    if (!q)
    {
        panel.innerHTML = `<span class="quiz-symbol">${icon("headphones")}</span><h3>${c.ui.ready}</h3><p class="muted">${c.ui.quizHelp}</p><button class="button primary" data-action="start-quiz">${c.ui.startQuiz}${icon("arrow-right")}</button>`;
        pianoBlock.hidden = true;
        return;
    }
    if (q.finished)
    {
        const missed = q.answers.map((a, i) => a.correct ? null : i).filter((i) => i !== null);
        panel.innerHTML = `<div class="quiz-score">${q.score}<span>/8</span></div><h3>${c.ui.resultsTitles[q.score <= 3 ? 0 : q.score <= 6 ? 1 : 2]}</h3><p class="muted">${missed.length ? c.ui.missed : c.ui.perfect}</p><div class="missed-rounds">${missed.map((i) => `<button data-action="missed" data-round="${i}">${icon("play")} ${q.rounds[i].answer}<span class="mono">ROUND ${i + 1}</span></button>`).join("")}</div><button class="button primary" data-action="start-quiz">${icon("rotate-ccw")}${c.ui.again}</button>`;
        pianoBlock.hidden = true;
        return;
    }
    const round = q.rounds[q.index];
    const answered = q.chosen !== null;
    panel.innerHTML = `<div class="quiz-meta mono"><span>Round ${q.index + 1} of 8</span><span>Score ${q.score}</span></div><div class="segments">${Array.from({length: 8}, (_, i) => `<span class="${q.answers[i] ? q.answers[i].correct ? "correct" : "wrong" : i === q.index ? "current" : ""}"></span>`).join("")}</div><div class="quiz-play">${state.muted ? `<p>${c.ui.muted}</p><button class="button primary" data-action="mute">${c.ui.enableSound}</button>` : `<button class="play-sound ${Date.now() < quizBusyUntil ? "playing" : ""}" data-action="quiz-play" aria-label="${c.ui.play}">${icon("play")}</button><p class="mono">${c.ui.play}</p>`}</div><div class="answer-grid">${round.options.map((answer, i) => `<button data-action="answer" data-answer="${i}" ${answered ? "disabled" : ""} class="${answered && answer === round.answer ? "correct" : answered && q.chosen === i ? "wrong" : ""}">${answered && (answer === round.answer || q.chosen === i) ? icon(answer === round.answer ? "check" : "x") : ""}${answer}</button>`).join("")}</div>${answered ? `<p class="answer-note" role="status">${round.note}</p><button class="button primary" data-action="next-quiz">${q.index === 7 ? c.ui.results : c.ui.next}${icon("arrow-right")}</button>` : `<p class="muted quiz-no-hints">${c.ui.quizHelp}</p>`}`;
    pianoBlock.hidden = !answered;
    renderKeys();
}
function playQuiz(index = state.quiz?.index)
{
    if (state.muted || !state.quiz) return;
    audio.stop();
    const round = state.quiz.rounds[index];
    const silent = quizHidden();
    if (round.kind === "interval") audio.playMelodic(quizMidis(round), silent);
    else audio.strum(quizMidis(round), silent);
    quizBusyUntil = Date.now() + (round.kind === "interval" ? 1800 : 1400);
    const button = document.querySelector(".play-sound");
    button?.classList.add("playing");
    audio.schedule(() => button?.classList.remove("playing"), 1850);
}
function answerQuiz(index)
{
    if (!state.quiz || state.quiz.chosen !== null || state.quiz.finished) return;
    audio.stop();
    const q = state.quiz;
    const round = q.rounds[q.index];
    q.chosen = index;
    const correct = round.options[index] === round.answer;
    if (correct) q.score++;
    q.answers.push({chosen: index, correct});
    renderQuiz();
    const notes = quizMidis(round);
    event(c.format.quiz(round.answer, notes.map(noteName)), notes, round.kind === "interval" ? "playMelodic" : "strum", false);
    updateDock();
    document.querySelector('[data-action="next-quiz"]').focus({preventScroll: true});
}
function toggleMute()
{
    state.muted = !state.muted;
    audio.mute(state.muted);
    document.querySelectorAll(".sound-control").forEach((button) =>
    {
        button.innerHTML = icon(state.muted ? "volume-x" : "volume-2") + `<span>${state.muted ? c.ui.soundOff : c.ui.soundOn}</span>`;
        button.setAttribute("aria-label", state.muted ? c.ui.soundOff : c.ui.soundOn);
        button.setAttribute("aria-pressed", state.muted);
    });
    renderQuiz();
    updateDock();
}
function runAction(element)
{
    const action = element.dataset.action;
    if (action !== "mute") audio.unlock();
    if (action === "mute") toggleMute();
    else if (action === "color") event(noteName(60 + pitch(element.dataset.note)), [60 + pitch(element.dataset.note)]);
    else if (action === "interval" || action === "cheat-interval")
    {
        state.interval.semitones = Number(element.dataset.steps);
        if (action === "cheat-interval") state.interval.rootMidi = 60 + pitch(FIFTHS_ORDER[state.selectedKey]);
        const root = state.interval.rootMidi;
        renderInterval();
        renderKeys();
        event(`${DEFAULT_NAMES[pc(root)]} · ${c.intervals[state.interval.semitones - 1][0]}`, [root, root + state.interval.semitones], "playMelodic");
    }
    else if (action === "scale") event(c.format.scale(FIFTHS_ORDER[state.selectedKey]), scaleMidis(state.selectedKey), "playScale");
    else if (action === "root") changeChord(element.dataset.note, state.chord.quality);
    else if (action === "quality") changeChord(state.chord.rootName, element.dataset.quality);
    else if (action === "diatonic")
    {
        const d = diatonic(state.selectedKey)[Number(element.dataset.degree)];
        changeChord(d.root, d.quality, "diatonic");
    }
    else if (action === "strum") changeChord(state.chord.rootName, state.chord.quality, "diatonic");
    else if (action === "cheat-chord") changeChord(FIFTHS_ORDER[state.selectedKey], element.dataset.quality, "diatonic");
    else if (action === "progression")
    {
        audio.stop();
        const chords = diatonic(state.selectedKey);
        const indexes = c.progressions[Number(element.dataset.progression)].degrees;
        indexes.forEach((degree, i) => audio.schedule(() => changeChord(chords[degree].root, chords[degree].quality, "diatonic"), i * 700));
    }
    else if (action === "start-quiz") startQuiz();
    else if (action === "quiz-play") playQuiz();
    else if (action === "answer") answerQuiz(Number(element.dataset.answer));
    else if (action === "next-quiz")
    {
        audio.stop();
        if (state.quiz.index === 7)
        {
            state.quiz.finished = true;
            earn(3, c.ui.winQuiz);
        }
        else
        {
            state.quiz.index++;
            state.quiz.chosen = null;
        }
        renderQuiz();
        updateDock();
    }
    else if (action === "missed") playQuiz(Number(element.dataset.round));
    else if (action === "replay")
    {
        if (quizHidden()) playQuiz();
        else if (state.lastEvent) event(state.lastEvent.label, state.lastEvent.midis, state.lastEvent.playback);
    }
}
document.addEventListener("click", (e) =>
{
    const action = e.target.closest("[data-action]");
    if (action && !action.disabled) runAction(action);
    const key = e.target.closest("[data-midi]");
    if (key && e.detail === 0) press(Number(key.dataset.midi), key.dataset.piano);
});
function pointerKey(e)
{
    return document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-midi]");
}
document.addEventListener("pointerdown", (e) =>
{
    if (e.button !== 0) return;
    const key = e.target.closest("[data-midi]");
    if (!key) return;
    e.preventDefault();
    key.focus({preventScroll: true});
    const id = press(Number(key.dataset.midi), key.dataset.piano, true);
    heldPointers.set(e.pointerId, {id, midi: Number(key.dataset.midi), where: key.dataset.piano});
});
document.addEventListener("pointermove", (e) =>
{
    const held = heldPointers.get(e.pointerId);
    if (!held) return;
    const key = pointerKey(e);
    const midi = key ? Number(key.dataset.midi) : null;
    if (held.midi === midi) return;
    audio.noteOff(held.id);
    if (key) heldPointers.set(e.pointerId, {id: press(midi, key.dataset.piano, true), midi, where: key.dataset.piano});
    else heldPointers.set(e.pointerId, {id: null, midi: null, where: held.where});
});
function releasePointer(e)
{
    const held = heldPointers.get(e.pointerId);
    if (held) audio.noteOff(held.id);
    heldPointers.delete(e.pointerId);
}
document.addEventListener("pointerup", releasePointer);
document.addEventListener("pointercancel", releasePointer);
function releaseHeld()
{
    heldPointers.forEach((held) => audio.noteOff(held.id));
    heldPointers.clear();
    heldKeys.forEach(audio.noteOff);
    heldKeys.clear();
}
window.addEventListener("blur", releaseHeld);
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden)
    {
        releaseHeld();
        audio.stop();
    }
});
window.addEventListener("keydown", (e) =>
{
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.target.closest("input,textarea,select,[contenteditable]")) return;
    const key = e.key.toLowerCase();
    if (key === "z" || key === "x")
    {
        state.octave = key === "z" ? 4 : 5;
        document.querySelector("#octave-number").textContent = state.octave;
        document.querySelectorAll(".key-cap").forEach((cap) =>
        {
            const midi = Number(cap.parentElement.dataset.midi);
            cap.textContent = (Object.keys(KEY_MAP).find((k) => KEY_MAP[k] === midi - (state.octave + 1) * 12) ?? "").toUpperCase();
        });
        return;
    }
    if (!(key in KEY_MAP)) return;
    const midi = (state.octave + 1) * 12 + KEY_MAP[key];
    if (midi > 83) return;
    e.preventDefault();
    heldKeys.set(e.code, press(midi, visiblePiano, true));
});
window.addEventListener("keyup", (e) =>
{
    audio.noteOff(heldKeys.get(e.code));
    heldKeys.delete(e.code);
});
document.querySelectorAll("[data-circle-control]").forEach((svg) =>
{
    let drag;
    svg.addEventListener("keydown", (e) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) return;
        e.preventDefault();
        audio.unlock();
        if (e.key === "Enter" || e.key === " ") runAction(svg.querySelector('[data-action="scale"]'));
        else
        {
            selectKey(state.selectedKey + (e.key === "ArrowRight" ? 1 : -1), svg.dataset.circleControl === "chapter" ? "circle-user" : "key");
            audio.tick(60 + pitch(FIFTHS_ORDER[state.selectedKey]));
        }
    });
    const angle = (e) =>
    {
        const box = svg.getBoundingClientRect();
        return Math.atan2(e.clientX - box.left - box.width / 2, -(e.clientY - box.top - box.height / 2)) * 180 / Math.PI;
    };
    svg.addEventListener("pointerdown", (e) =>
    {
        if (e.target.closest(".circle-center")) return;
        e.preventDefault();
        audio.unlock();
        svg.focus({preventScroll: true});
        drag = {pointer: e.pointerId, angle: angle(e), rotation, moved: false, index: state.selectedKey, key: e.target.dataset.key ?? e.target.closest("[data-wedge]")?.dataset.wedge};
        svg.classList.add("dragging");
    });
    document.addEventListener("pointermove", (e) =>
    {
        if (!drag || e.pointerId !== drag.pointer) return;
        let delta = angle(e) - drag.angle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        if (Math.abs(delta) > 4) drag.moved = true;
        rotation = drag.rotation + delta;
        const index = ((Math.round(-rotation / 30) % 12) + 12) % 12;
        svg.querySelector(".rotor").style.transform = `rotate(${rotation}deg)`;
        svg.querySelectorAll(".circle-label text").forEach((text) => text.style.transform = `rotate(${-rotation}deg)`);
        if (index !== drag.index)
        {
            drag.index = index;
            audio.tick(60 + pitch(FIFTHS_ORDER[index]));
        }
    });
    const finish = (e) =>
    {
        if (!drag || e.pointerId !== drag.pointer) return;
        const index = !drag.moved && drag.key !== undefined ? Number(drag.key) : drag.index;
        svg.classList.remove("dragging");
        drag = null;
        selectKey(index, svg.dataset.circleControl === "chapter" ? "circle-user" : "key");
    };
    document.addEventListener("pointerup", finish);
    document.addEventListener("pointercancel", finish);
});
const sections = new Map();
new IntersectionObserver((entries) =>
{
    entries.forEach((entry) => sections.set(entry.target.dataset.pianoTray, entry.intersectionRatio));
    visiblePiano = [...sections].sort((a, b) => b[1] - a[1])[0]?.[1] > 0 ? [...sections].sort((a, b) => b[1] - a[1])[0][0] : "other";
}, {threshold: [0, 0.1, 0.5, 1]}).observe(document.querySelector('[data-piano-tray="hero"]'));
const pianoObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) => sections.set(entry.target.dataset.pianoTray, entry.intersectionRatio));
    const best = [...sections].sort((a, b) => b[1] - a[1])[0];
    visiblePiano = best?.[1] > 0 ? best[0] : "other";
}, {threshold: [0, 0.1, 0.5, 1]});
document.querySelectorAll('[data-piano-tray]:not([data-piano-tray="hero"])').forEach((p) => pianoObserver.observe(p));
new IntersectionObserver(([entry]) =>
{
    document.querySelector("#dock").classList.toggle("visible", !entry.isIntersecting);
}, {threshold: 0}).observe(document.querySelector(".hero"));
const reveal = new IntersectionObserver((entries) =>
{
    entries.filter((entry) => entry.isIntersecting).forEach((entry) =>
    {
        entry.target.classList.add("revealed");
        reveal.unobserve(entry.target);
    });
}, {threshold: 0.06});
document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));
renderCircle();
renderInterval();
renderChord();
renderQuiz();
renderKeys();
updateDock();

// Read-only diagnostic surface for deterministic musical and browser QA.
window.lesson =
{
    snapshot: () => ({...state, activeNotes: [...state.activeNotes.keys()], audio: audio.audioStatus()}),
    theory: {chord, scaleMidis, pitch, intervalDescription},
    content: c
};
